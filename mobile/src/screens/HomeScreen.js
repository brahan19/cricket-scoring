import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Cricket Scorer</Title>
        <Paragraph style={styles.subtitle}>Track your cricket matches with ease</Paragraph>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Start New Match</Title>
          <Paragraph>Create a new cricket match and start scoring</Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewMatch')}
            style={styles.button}
            icon={() => <Icon name="plus-circle" size={24} color="white" />}
          >
            New Match
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Live Matches</Title>
          <Paragraph>View and update ongoing matches</Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('LiveMatch')}
            style={styles.button}
            icon={() => <Icon name="play-circle" size={24} color="white" />}
          >
            View Live Matches
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Stats</Title>
          <Paragraph>View your match statistics and records</Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Stats')}
            style={styles.button}
            icon={() => <Icon name="chart-bar" size={24} color="white" />}
          >
            View Statistics
          </Button>
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
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  button: {
    marginTop: 16,
  },
});

export default HomeScreen; 