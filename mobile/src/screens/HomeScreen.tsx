import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { matchApi } from '../services/api';
import { IMatch } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            const response = await matchApi.getAll();
            setMatches(response.data);
        } catch (error) {
            console.error('Error loading matches:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderMatchItem = ({ item }: { item: IMatch }) => (
        <TouchableOpacity
            style={styles.matchCard}
            onPress={() => navigation.navigate('MatchDetails', { matchId: item._id })}
        >
            <View style={styles.matchHeader}>
                <Text style={styles.matchType}>{item.matchType}</Text>
                <Text style={styles.matchDate}>
                    {new Date(item.date).toLocaleDateString()}
                </Text>
            </View>
            <View style={styles.matchTeams}>
                <Text style={styles.teamName}>{item.teams.team1}</Text>
                <Text style={styles.vs}>vs</Text>
                <Text style={styles.teamName}>{item.teams.team2}</Text>
            </View>
            <View style={styles.matchStatus}>
                <Text style={[
                    styles.statusText,
                    { color: item.status === 'in_progress' ? '#4CAF50' : '#757575' }
                ]}>
                    {item.status.replace('_', ' ').toUpperCase()}
                </Text>
            </View>
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
                <Text style={styles.title}>Cricket Matches</Text>
                <TouchableOpacity
                    style={styles.newMatchButton}
                    onPress={() => navigation.navigate('NewMatch')}
                >
                    <Text style={styles.newMatchButtonText}>New Match</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={matches}
                renderItem={renderMatchItem}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    newMatchButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    newMatchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        padding: 16,
    },
    matchCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    matchType: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    matchDate: {
        color: '#757575',
    },
    matchTeams: {
        alignItems: 'center',
        marginBottom: 8,
    },
    teamName: {
        fontSize: 18,
        fontWeight: '500',
    },
    vs: {
        fontSize: 14,
        color: '#757575',
        marginVertical: 4,
    },
    matchStatus: {
        alignItems: 'flex-end',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
    },
}); 