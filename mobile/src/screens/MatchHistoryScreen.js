import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MatchHistoryScreen = ({ navigation }) => {
  // TODO: Replace with actual data from backend
  const matches = [
    {
      id: '1',
      team1: 'Team A',
      team2: 'Team B',
      date: '2024-03-15',
      venue: 'Cricket Ground',
      result: 'Team A won by 5 wickets',
      score: 'Team A: 156/5 (18.2 ov)',
    },
    {
      id: '2',
      team1: 'Team C',
      team2: 'Team D',
      date: '2024-03-14',
      venue: 'Sports Complex',
      result: 'Team D won by 3 runs',
      score: 'Team D: 189/6 (20 ov)',
    },
  ];

  const renderMatchCard = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('MatchDetails', { match: item })}>
      <Card.Content>
        <Title style={styles.matchTitle}>
          {item.team1} vs {item.team2}
        </Title>
        <View style={styles.matchInfo}>
          <Paragraph>
            <Icon name="calendar" size={16} /> {item.date}
          </Paragraph>
          <Paragraph>
            <Icon name="map-marker" size={16} /> {item.venue}
          </Paragraph>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{item.score}</Text>
          <Text style={styles.result}>{item.result}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatchCard}
        keyExtractor={(item) => item.id}
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
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  matchTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  matchInfo: {
    marginBottom: 8,
  },
  scoreContainer: {
    marginTop: 8,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
  },
});

export default MatchHistoryScreen; 