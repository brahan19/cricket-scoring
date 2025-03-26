import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Portal, Modal, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LiveMatchScreen = ({ route, navigation }) => {
  const { matchDetails } = route.params;
  const [score, setScore] = useState({
    runs: 0,
    wickets: 0,
    overs: 0,
    currentBatsman: { runs: 0, balls: 0 },
    currentBowler: { overs: 0, wickets: 0, runs: 0 },
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'runs', 'wicket', 'extras'

  const handleRuns = (runs) => {
    setScore({
      ...score,
      runs: score.runs + runs,
      currentBatsman: {
        ...score.currentBatsman,
        runs: score.currentBatsman.runs + runs,
        balls: score.currentBatsman.balls + 1,
      },
      currentBowler: {
        ...score.currentBowler,
        runs: score.currentBowler.runs + runs,
        overs: score.currentBowler.overs + 0.1,
      },
      overs: score.overs + 0.1,
    });
    setShowModal(false);
  };

  const handleWicket = (type) => {
    setScore({
      ...score,
      wickets: score.wickets + 1,
      currentBatsman: {
        ...score.currentBatsman,
        isOut: true,
        howOut: type,
      },
      currentBowler: {
        ...score.currentBowler,
        wickets: score.currentBowler.wickets + 1,
        overs: score.currentBowler.overs + 0.1,
      },
      overs: score.overs + 0.1,
    });
    setShowModal(false);
  };

  const handleExtras = (type, value) => {
    setScore({
      ...score,
      extras: {
        ...score.extras,
        [type]: score.extras[type] + value,
      },
      runs: score.runs + value,
      currentBowler: {
        ...score.currentBowler,
        runs: score.currentBowler.runs + value,
        overs: score.currentBowler.overs + 0.1,
      },
      overs: score.overs + 0.1,
    });
    setShowModal(false);
  };

  const renderModal = () => {
    switch (modalType) {
      case 'runs':
        return (
          <View style={styles.modalContent}>
            <Title>Add Runs</Title>
            <View style={styles.runsGrid}>
              {[0, 1, 2, 3, 4, 6].map((run) => (
                <Button
                  key={run}
                  mode="contained"
                  onPress={() => handleRuns(run)}
                  style={styles.runButton}
                >
                  {run}
                </Button>
              ))}
            </View>
          </View>
        );
      case 'wicket':
        return (
          <View style={styles.modalContent}>
            <Title>Wicket Type</Title>
            <Button
              mode="contained"
              onPress={() => handleWicket('Bowled')}
              style={styles.modalButton}
            >
              Bowled
            </Button>
            <Button
              mode="contained"
              onPress={() => handleWicket('Caught')}
              style={styles.modalButton}
            >
              Caught
            </Button>
            <Button
              mode="contained"
              onPress={() => handleWicket('LBW')}
              style={styles.modalButton}
            >
              LBW
            </Button>
            <Button
              mode="contained"
              onPress={() => handleWicket('Run Out')}
              style={styles.modalButton}
            >
              Run Out
            </Button>
          </View>
        );
      case 'extras':
        return (
          <View style={styles.modalContent}>
            <Title>Add Extras</Title>
            <Button
              mode="contained"
              onPress={() => handleExtras('wides', 1)}
              style={styles.modalButton}
            >
              Wide
            </Button>
            <Button
              mode="contained"
              onPress={() => handleExtras('noBalls', 1)}
              style={styles.modalButton}
            >
              No Ball
            </Button>
            <Button
              mode="contained"
              onPress={() => handleExtras('byes', 1)}
              style={styles.modalButton}
            >
              Bye
            </Button>
            <Button
              mode="contained"
              onPress={() => handleExtras('legByes', 1)}
              style={styles.modalButton}
            >
              Leg Bye
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.scoreCard}>
        <Card.Content>
          <Title style={styles.matchTitle}>
            {matchDetails.team1} vs {matchDetails.team2}
          </Title>
          <Text style={styles.venue}>{matchDetails.venue}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>
              {score.runs}/{score.wickets}
            </Text>
            <Text style={styles.overs}>
              ({score.overs.toFixed(1)} ov)
            </Text>
          </View>

          <View style={styles.currentStats}>
            <Text>Current Batsman: {score.currentBatsman.runs}({score.currentBatsman.balls})</Text>
            <Text>Current Bowler: {score.currentBowler.wickets}/{score.currentBowler.runs}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => {
            setModalType('runs');
            setShowModal(true);
          }}
          style={styles.button}
          icon={() => <Icon name="run" size={24} color="white" />}
        >
          Add Runs
        </Button>

        <Button
          mode="contained"
          onPress={() => {
            setModalType('wicket');
            setShowModal(true);
          }}
          style={styles.button}
          icon={() => <Icon name="cricket" size={24} color="white" />}
        >
          Wicket
        </Button>

        <Button
          mode="contained"
          onPress={() => {
            setModalType('extras');
            setShowModal(true);
          }}
          style={styles.button}
          icon={() => <Icon name="plus-circle" size={24} color="white" />}
        >
          Extras
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modal}
        >
          {renderModal()}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scoreCard: {
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  venue: {
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 8,
  },
  overs: {
    fontSize: 18,
  },
  currentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalContent: {
    alignItems: 'center',
  },
  runsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  runButton: {
    margin: 4,
    width: 60,
  },
  modalButton: {
    marginVertical: 4,
    width: '100%',
  },
});

export default LiveMatchScreen; 