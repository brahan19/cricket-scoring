import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Text, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StatisticsScreen = () => {
  // TODO: Replace with actual data from backend
  const stats = {
    totalMatches: 25,
    totalRuns: 12500,
    totalWickets: 450,
    highestScore: 'Team A: 189/6',
    lowestScore: 'Team B: 45/10',
    topBatsmen: [
      { name: 'John Doe', runs: 850, matches: 15, average: 56.67 },
      { name: 'Jane Smith', runs: 720, matches: 12, average: 60.00 },
      { name: 'Mike Johnson', runs: 680, matches: 14, average: 48.57 },
    ],
    topBowlers: [
      { name: 'David Wilson', wickets: 45, matches: 18, average: 15.22 },
      { name: 'Sarah Brown', wickets: 38, matches: 15, average: 18.95 },
      { name: 'Tom Anderson', wickets: 35, matches: 16, average: 20.14 },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Overall Statistics</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="cricket" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{stats.totalMatches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="run" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{stats.totalRuns}</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="cricket" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{stats.totalWickets}</Text>
              <Text style={styles.statLabel}>Wickets</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Records</Title>
          <List.Item
            title="Highest Score"
            description={stats.highestScore}
            left={props => <List.Icon {...props} icon="trophy" />}
          />
          <List.Item
            title="Lowest Score"
            description={stats.lowestScore}
            left={props => <List.Icon {...props} icon="trophy-outline" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Top Batsmen</Title>
          {stats.topBatsmen.map((batsman, index) => (
            <List.Item
              key={index}
              title={batsman.name}
              description={`${batsman.runs} runs in ${batsman.matches} matches (Avg: ${batsman.average})`}
              left={props => <List.Icon {...props} icon="account" />}
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Top Bowlers</Title>
          {stats.topBowlers.map((bowler, index) => (
            <List.Item
              key={index}
              title={bowler.name}
              description={`${bowler.wickets} wickets in ${bowler.matches} matches (Avg: ${bowler.average})`}
              left={props => <List.Icon {...props} icon="account" />}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default StatisticsScreen; 