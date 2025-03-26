import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { matchApi } from '../services/api';
import { IMatch, IPlayer } from '../interfaces';
import { NavigationProp } from '../types/navigation';

export const LiveScoringScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp>();
    const { matchId } = route.params as { matchId: string };
    const [match, setMatch] = useState<IMatch | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBatsman, setSelectedBatsman] = useState<IPlayer | null>(null);
    const [selectedBowler, setSelectedBowler] = useState<IPlayer | null>(null);

    useEffect(() => {
        loadMatchDetails();
    }, [matchId]);

    const loadMatchDetails = async () => {
        try {
            const response = await matchApi.getById(matchId);
            setMatch(response.data);
            const currentInnings = response.data.innings[response.data.currentInnings];
            setSelectedBatsman(currentInnings.currentBatsmen[0]);
            setSelectedBowler(currentInnings.currentBowler);
        } catch (error) {
            console.error('Error loading match details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRuns = async (runs: number) => {
        if (!match || !selectedBatsman || !selectedBowler) return;

        try {
            const currentInnings = match.innings[match.currentInnings];
            await matchApi.updateScore(matchId, {
                runs,
                batsmanName: selectedBatsman.name,
                bowlerName: selectedBowler.name,
                wickets: 0,
                extras: {
                    wides: 0,
                    noBalls: 0,
                    byes: 0,
                    legByes: 0,
                },
            });
            await loadMatchDetails();
        } catch (error) {
            console.error('Error updating score:', error);
            Alert.alert('Error', 'Failed to update score');
        }
    };

    const handleWicket = async () => {
        if (!match || !selectedBatsman || !selectedBowler) return;

        try {
            const currentInnings = match.innings[match.currentInnings];
            await matchApi.updateScore(matchId, {
                runs: 0,
                batsmanName: selectedBatsman.name,
                bowlerName: selectedBowler.name,
                wickets: 1,
                extras: {
                    wides: 0,
                    noBalls: 0,
                    byes: 0,
                    legByes: 0,
                },
            });
            await loadMatchDetails();
        } catch (error) {
            console.error('Error updating wicket:', error);
            Alert.alert('Error', 'Failed to update wicket');
        }
    };

    const handleExtra = async (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
        if (!match || !selectedBatsman || !selectedBowler) return;

        try {
            const currentInnings = match.innings[match.currentInnings];
            await matchApi.updateScore(matchId, {
                runs: 0,
                batsmanName: selectedBatsman.name,
                bowlerName: selectedBowler.name,
                wickets: 0,
                extras: {
                    wides: type === 'wide' ? 1 : 0,
                    noBalls: type === 'noBall' ? 1 : 0,
                    byes: type === 'bye' ? 1 : 0,
                    legByes: type === 'legBye' ? 1 : 0,
                },
            });
            await loadMatchDetails();
        } catch (error) {
            console.error('Error updating extra:', error);
            Alert.alert('Error', 'Failed to update extra');
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

            <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                    {currentInnings.total}/{currentInnings.wickets}
                </Text>
                <Text style={styles.overs}>
                    ({currentInnings.overs.toFixed(1)} ov)
                </Text>
            </View>

            <View style={styles.currentPlayersContainer}>
                <View style={styles.playerBox}>
                    <Text style={styles.playerTitle}>Striker</Text>
                    <Text style={styles.playerName}>{selectedBatsman?.name}</Text>
                    <Text style={styles.playerStats}>
                        {selectedBatsman?.runs}({selectedBatsman?.balls})
                    </Text>
                </View>
                <View style={styles.playerBox}>
                    <Text style={styles.playerTitle}>Bowler</Text>
                    <Text style={styles.playerName}>{selectedBowler?.name}</Text>
                    <Text style={styles.playerStats}>
                        {selectedBowler?.wickets}/{selectedBowler?.runsConceded}
                        ({selectedBowler?.overs?.toFixed(1) || '0.0'} ov)
                    </Text>
                </View>
            </View>

            <View style={styles.scoringButtonsContainer}>
                <View style={styles.runsContainer}>
                    {[1, 2, 3, 4, 6].map((runs) => (
                        <TouchableOpacity
                            key={runs}
                            style={styles.runsButton}
                            onPress={() => handleRuns(runs)}
                        >
                            <Text style={styles.runsButtonText}>{runs}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.extrasContainer}>
                    <TouchableOpacity
                        style={styles.extraButton}
                        onPress={() => handleExtra('wide')}
                    >
                        <Text style={styles.extraButtonText}>Wide</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.extraButton}
                        onPress={() => handleExtra('noBall')}
                    >
                        <Text style={styles.extraButtonText}>No Ball</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.extraButton}
                        onPress={() => handleExtra('bye')}
                    >
                        <Text style={styles.extraButtonText}>Bye</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.extraButton}
                        onPress={() => handleExtra('legBye')}
                    >
                        <Text style={styles.extraButtonText}>Leg Bye</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.wicketButton}
                    onPress={handleWicket}
                >
                    <Text style={styles.wicketButtonText}>Wicket</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.extrasSummaryContainer}>
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
    scoreContainer: {
        backgroundColor: '#fff',
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    score: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    overs: {
        fontSize: 18,
        color: '#757575',
        marginTop: 4,
    },
    currentPlayersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
    },
    playerBox: {
        flex: 1,
        alignItems: 'center',
    },
    playerTitle: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 4,
    },
    playerName: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 4,
    },
    playerStats: {
        fontSize: 16,
    },
    scoringButtonsContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 8,
    },
    runsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    runsButton: {
        backgroundColor: '#2196F3',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    runsButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    extrasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    extraButton: {
        backgroundColor: '#FF9800',
        padding: 12,
        borderRadius: 8,
        width: '48%',
        marginBottom: 8,
    },
    extraButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    wicketButton: {
        backgroundColor: '#F44336',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    wicketButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    extrasSummaryContainer: {
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
}); 