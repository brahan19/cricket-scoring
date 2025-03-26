import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, updateMatch } from '../services/api';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatch();
  }, [id]);

  const loadMatch = async () => {
    try {
      const response = await getMatch(id);
      setMatch(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading match:', error);
      setError('Failed to load match details. Please try again.');
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'error';
      case 'completed':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="h1">
                {match.teams.team1} vs {match.teams.team2}
              </Typography>
              <Chip
                label={match.status.toUpperCase()}
                color={getStatusColor(match.status)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Venue:</strong> {match.venue}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(match.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Match Type:</strong> {match.matchType}
            </Typography>
            <Typography variant="body1">
              <strong>Overs:</strong> {match.overs}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {match.innings && match.innings.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Innings Summary
          </Typography>
          {match.innings.map((innings, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {innings.team} Innings
              </Typography>
              <Typography variant="h4">
                {innings.total}/{innings.wickets} ({innings.overs} overs)
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Batsman</TableCell>
                      <TableCell align="right">Runs</TableCell>
                      <TableCell align="right">Balls</TableCell>
                      <TableCell align="right">4s</TableCell>
                      <TableCell align="right">6s</TableCell>
                      <TableCell align="right">SR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {innings.players
                      .filter(player => player.runs !== undefined)
                      .map((player, playerIndex) => (
                        <TableRow key={playerIndex}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell align="right">{player.runs}</TableCell>
                          <TableCell align="right">{player.balls}</TableCell>
                          <TableCell align="right">{player.fours}</TableCell>
                          <TableCell align="right">{player.sixes}</TableCell>
                          <TableCell align="right">
                            {player.balls > 0
                              ? ((player.runs / player.balls) * 100).toFixed(2)
                              : '0.00'}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Bowler</TableCell>
                      <TableCell align="right">Overs</TableCell>
                      <TableCell align="right">Wickets</TableCell>
                      <TableCell align="right">Runs</TableCell>
                      <TableCell align="right">Economy</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {innings.players
                      .filter(player => player.overs !== undefined)
                      .map((player, playerIndex) => (
                        <TableRow key={playerIndex}>
                          <TableCell>{player.name}</TableCell>
                          <TableCell align="right">{player.overs}</TableCell>
                          <TableCell align="right">{player.wickets}</TableCell>
                          <TableCell align="right">{player.runsConceded}</TableCell>
                          <TableCell align="right">
                            {player.overs > 0
                              ? (player.runsConceded / player.overs).toFixed(2)
                              : '0.00'}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Paper>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        {match.status === 'scheduled' && (
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              try {
                await updateMatch(id, { ...match, status: 'in_progress' });
                navigate(`/scoring/${id}`);
              } catch (error) {
                console.error('Error starting match:', error);
                setError('Failed to start match. Please try again.');
              }
            }}
          >
            Start Match
          </Button>
        )}
        {match.status === 'in_progress' && (
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate(`/scoring/${id}`)}
          >
            Continue Scoring
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default MatchDetails; 