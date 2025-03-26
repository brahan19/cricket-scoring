import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTeams, createMatch } from '../services/api';

const NewMatch = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [matchData, setMatchData] = useState({
    teams: {
      team1: '',
      team2: ''
    },
    teamMembers: {
      team1: [],
      team2: []
    },
    venue: '',
    matchType: 't20',
    overs: 20,
    oversPerInnings: 20,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to load teams. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMatchData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setMatchData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    const selectedTeam = teams.find(team => team._id === value);
    
    setMatchData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      },
      teamMembers: {
        ...prev.teamMembers,
        [child]: selectedTeam ? selectedTeam.members.map(member => member.name) : []
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createMatch(matchData);
      navigate(`/match/${response.data._id}`);
    } catch (error) {
      console.error('Error creating match:', error);
      setError('Failed to create match. Please try again.');
    }
  };

  const isTestMatch = matchData.matchType === 'test';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Match
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Team 1</InputLabel>
                <Select
                  name="teams.team1"
                  value={matchData.teams.team1}
                  onChange={handleTeamChange}
                  label="Team 1"
                >
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {matchData.teamMembers.team1.length} players selected
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Team 2</InputLabel>
                <Select
                  name="teams.team2"
                  value={matchData.teams.team2}
                  onChange={handleTeamChange}
                  label="Team 2"
                >
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {matchData.teamMembers.team2.length} players selected
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Venue"
                name="venue"
                value={matchData.venue}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Match Type</InputLabel>
                <Select
                  name="matchType"
                  value={matchData.matchType}
                  onChange={handleInputChange}
                  label="Match Type"
                >
                  <MenuItem value="t20">T20</MenuItem>
                  <MenuItem value="odi">ODI</MenuItem>
                  <MenuItem value="test">Test</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Overs"
                name="overs"
                type="number"
                value={matchData.overs}
                onChange={handleInputChange}
                required
                helperText="Total number of overs in the match"
              />
            </Grid>
            {!isTestMatch && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Overs per Innings"
                  name="oversPerInnings"
                  type="number"
                  value={matchData.oversPerInnings}
                  onChange={handleInputChange}
                  required
                  helperText="Number of overs per innings"
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={matchData.date}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!matchData.teams.team1 || !matchData.teams.team2}
                >
                  Create Match
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/teams')}
                  fullWidth
                >
                  Manage Teams
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default NewMatch; 