import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { teamApi } from '../services/api';
import { ITeam } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const TeamsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleDeleteTeam = async (teamId: string) => {
        Alert.alert(
            'Delete Team',
            'Are you sure you want to delete this team?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await teamApi.delete(teamId);
                            await loadTeams();
                        } catch (error) {
                            console.error('Error deleting team:', error);
                            Alert.alert('Error', 'Failed to delete team');
                        }
                    },
                },
            ]
        );
    };

    const renderTeamItem = ({ item }: { item: ITeam }) => (
        <TouchableOpacity
            style={styles.teamItem}
            onPress={() => navigation.navigate('TeamDetails', { teamId: item._id })}
        >
            <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{item.name}</Text>
                <Text style={styles.teamMembers}>
                    {item.members.length} members
                </Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTeam(item._id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Teams</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('NewTeam')}
                >
                    <Text style={styles.addButtonText}>Add Team</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={teams}
                renderItem={renderTeamItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    listContainer: {
        padding: 16,
    },
    teamItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    teamInfo: {
        flex: 1,
    },
    teamName: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
    },
    teamMembers: {
        fontSize: 14,
        color: '#757575',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        padding: 8,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
}); 