import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { matchApi, teamApi } from '../services/api';
import { ITeam } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const NewMatchScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeam1, setSelectedTeam1] = useState<ITeam | null>(null);
    const [selectedTeam2, setSelectedTeam2] = useState<ITeam | null>(null);
    const [venue, setVenue] = useState('');
    const [matchType, setMatchType] = useState<'T20' | 'ODI' | 'Test'>('T20');
    const [overs, setOvers] = useState('20');

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const response = await teamApi.getAll();
            setTeams(response.data);
        } catch (error) {
            console.error('Error loading teams:', error);
            Alert.alert('Error', 'Failed to load teams');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMatch = async () => {
        if (!selectedTeam1 || !selectedTeam2) {
            Alert.alert('Error', 'Please select both teams');
            return;
        }

        if (!venue) {
            Alert.alert('Error', 'Please enter a venue');
            return;
        }

        try {
            const response = await matchApi.create({
                team1: selectedTeam1._id,
                team2: selectedTeam2._id,
                venue,
                matchType,
                overs: parseInt(overs),
                date: new Date().toISOString(),
            });
            navigation.navigate('MatchDetails', { matchId: response.data._id });
        } catch (error) {
            console.error('Error creating match:', error);
            Alert.alert('Error', 'Failed to create match');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>New Match</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.teamSelectionContainer}>
                    <Text style={styles.label}>Team 1</Text>
                    <ScrollView horizontal style={styles.teamScrollView}>
                        {teams.map((team) => (
                            <TouchableOpacity
                                key={team._id}
                                style={[
                                    styles.teamButton,
                                    selectedTeam1?._id === team._id && styles.selectedTeamButton,
                                ]}
                                onPress={() => setSelectedTeam1(team)}
                            >
                                <Text
                                    style={[
                                        styles.teamButtonText,
                                        selectedTeam1?._id === team._id && styles.selectedTeamButtonText,
                                    ]}
                                >
                                    {team.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.teamSelectionContainer}>
                    <Text style={styles.label}>Team 2</Text>
                    <ScrollView horizontal style={styles.teamScrollView}>
                        {teams.map((team) => (
                            <TouchableOpacity
                                key={team._id}
                                style={[
                                    styles.teamButton,
                                    selectedTeam2?._id === team._id && styles.selectedTeamButton,
                                ]}
                                onPress={() => setSelectedTeam2(team)}
                            >
                                <Text
                                    style={[
                                        styles.teamButtonText,
                                        selectedTeam2?._id === team._id && styles.selectedTeamButtonText,
                                    ]}
                                >
                                    {team.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Venue</Text>
                    <TextInput
                        style={styles.input}
                        value={venue}
                        onChangeText={setVenue}
                        placeholder="Enter venue"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Match Type</Text>
                    <View style={styles.matchTypeContainer}>
                        {(['T20', 'ODI', 'Test'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.matchTypeButton,
                                    matchType === type && styles.selectedMatchTypeButton,
                                ]}
                                onPress={() => setMatchType(type)}
                            >
                                <Text
                                    style={[
                                        styles.matchTypeButtonText,
                                        matchType === type && styles.selectedMatchTypeButtonText,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Overs</Text>
                    <TextInput
                        style={styles.input}
                        value={overs}
                        onChangeText={setOvers}
                        placeholder="Enter number of overs"
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateMatch}
                >
                    <Text style={styles.createButtonText}>Create Match</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 16,
    },
    teamSelectionContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    teamScrollView: {
        flexGrow: 0,
    },
    teamButton: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedTeamButton: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    teamButtonText: {
        fontSize: 16,
    },
    selectedTeamButtonText: {
        color: '#fff',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    matchTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    matchTypeButton: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedMatchTypeButton: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    matchTypeButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    selectedMatchTypeButtonText: {
        color: '#fff',
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 