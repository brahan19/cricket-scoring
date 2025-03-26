import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { matchApi } from '../services/api';
import { IMatch } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const MatchDetailsScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const { matchId } = route.params as { matchId: string };
    const [match, setMatch] = useState<IMatch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMatchDetails();
    }, [matchId]);

    const loadMatchDetails = async () => {
        try {
            const response = await matchApi.getById(matchId);
            setMatch(response.data);
        } catch (error) {
            console.error('Error loading match details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !match) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const currentInnings = match.innings[match.currentInnings];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.matchType}>{match.matchType}</Text>
                <Text style={styles.date}>
                    {new Date(match.date).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.teamsContainer}>
                <View style={styles.teamBox}>
                    <Text style={styles.teamName}>{match.teams.team1}</Text>
                    <Text style={styles.score}>
                        {currentInnings.total}/{currentInnings.wickets}
                    </Text>
                    <Text style={styles.overs}>
                        ({currentInnings.overs.toFixed(1)} ov)
                    </Text>
                </View>
                <Text style={styles.vs}>vs</Text>
                <View style={styles.teamBox}>
                    <Text style={styles.teamName}>{match.teams.team2}</Text>
                    <Text style={styles.score}>Yet to bat</Text>
                </View>
            </View>

            <View style={styles.extrasContainer}>
                <Text style={styles.extrasTitle}>Extras</Text>
                <View style={styles.extrasRow}>
                    <Text style={styles.extrasItem}>Wides: {currentInnings.extras.wides}</Text>
                    <Text style={styles.extrasItem}>No Balls: {currentInnings.extras.noBalls}</Text>
                </View>
                <View style={styles.extrasRow}>
                    <Text style={styles.extrasItem}>Byes: {currentInnings.extras.byes}</Text>
                    <Text style={styles.extrasItem}>Leg Byes: {currentInnings.extras.legByes}</Text>
                </View>
            </View>

            <View style={styles.batsmenContainer}>
                <Text style={styles.sectionTitle}>Current Batsmen</Text>
                {currentInnings.currentBatsmen.map((batsman, index) => (
                    <View key={index} style={styles.batsmanRow}>
                        <Text style={styles.batsmanName}>{batsman.name}</Text>
                        <Text style={styles.batsmanStats}>
                            {batsman.runs}({batsman.balls})
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.bowlerContainer}>
                <Text style={styles.sectionTitle}>Current Bowler</Text>
                {currentInnings.currentBowler && (
                    <View style={styles.bowlerRow}>
                        <Text style={styles.bowlerName}>
                            {currentInnings.currentBowler.name}
                        </Text>
                        <Text style={styles.bowlerStats}>
                            {currentInnings.currentBowler.wickets}/{currentInnings.currentBowler.runsConceded}
                            ({currentInnings.currentBowler.overs?.toFixed(1) || '0.0'} ov)
                        </Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={styles.startScoringButton}
                onPress={() => navigation.navigate('LiveScoring', { matchId: match._id })}
            >
                <Text style={styles.startScoringButtonText}>Start Live Scoring</Text>
            </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    matchType: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 16,
        color: '#757575',
    },
    teamsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
    },
    teamBox: {
        flex: 1,
        alignItems: 'center',
    },
    teamName: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    overs: {
        fontSize: 14,
        color: '#757575',
    },
    vs: {
        fontSize: 16,
        color: '#757575',
        marginHorizontal: 16,
    },
    extrasContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
    },
    extrasTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    extrasRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    extrasItem: {
        fontSize: 16,
    },
    batsmenContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    batsmanRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    batsmanName: {
        fontSize: 16,
    },
    batsmanStats: {
        fontSize: 16,
        fontWeight: '500',
    },
    bowlerContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
    },
    bowlerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bowlerName: {
        fontSize: 16,
    },
    bowlerStats: {
        fontSize: 16,
        fontWeight: '500',
    },
    startScoringButton: {
        backgroundColor: '#4CAF50',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    startScoringButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 