import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';

const NewMatchScreen = ({ navigation }) => {
  const [matchDetails, setMatchDetails] = useState({
    team1: '',
    team2: '',
    venue: '',
    matchType: 't20',
    oversPerInnings: '20',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!matchDetails.team1) newErrors.team1 = 'Team 1 name is required';
    if (!matchDetails.team2) newErrors.team2 = 'Team 2 name is required';
    if (!matchDetails.venue) newErrors.venue = 'Venue is required';
    if (matchDetails.matchType !== 'test' && !matchDetails.oversPerInnings) {
      newErrors.oversPerInnings = 'Overs per innings is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: Create match in backend
      navigation.navigate('LiveMatch', { matchDetails });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>New Match Details</Title>

      <TextInput
        label="Team 1"
        value={matchDetails.team1}
        onChangeText={(text) => setMatchDetails({ ...matchDetails, team1: text })}
        style={styles.input}
        error={!!errors.team1}
      />
      <HelperText type="error" visible={!!errors.team1}>
        {errors.team1}
      </HelperText>

      <TextInput
        label="Team 2"
        value={matchDetails.team2}
        onChangeText={(text) => setMatchDetails({ ...matchDetails, team2: text })}
        style={styles.input}
        error={!!errors.team2}
      />
      <HelperText type="error" visible={!!errors.team2}>
        {errors.team2}
      </HelperText>

      <TextInput
        label="Venue"
        value={matchDetails.venue}
        onChangeText={(text) => setMatchDetails({ ...matchDetails, venue: text })}
        style={styles.input}
        error={!!errors.venue}
      />
      <HelperText type="error" visible={!!errors.venue}>
        {errors.venue}
      </HelperText>

      <TextInput
        label="Match Type"
        value={matchDetails.matchType}
        onChangeText={(text) => setMatchDetails({ ...matchDetails, matchType: text })}
        style={styles.input}
        disabled
      />

      {matchDetails.matchType !== 'test' && (
        <>
          <TextInput
            label="Overs per Innings"
            value={matchDetails.oversPerInnings}
            onChangeText={(text) => setMatchDetails({ ...matchDetails, oversPerInnings: text })}
            style={styles.input}
            keyboardType="numeric"
            error={!!errors.oversPerInnings}
          />
          <HelperText type="error" visible={!!errors.oversPerInnings}>
            {errors.oversPerInnings}
          </HelperText>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
      >
        Start Match
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
});

export default NewMatchScreen; 