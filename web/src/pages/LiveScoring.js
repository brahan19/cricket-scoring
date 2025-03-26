import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Slider,
  Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, updateScore, updateMatch, getTeam } from '../services/api';

const LiveScoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [error, setError] = useState('');
  const [scoreInput, setScoreInput] = useState({
    runs: 0,
    extras: {
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0
    },
    wickets: 0,
    batsmanName: '',
    bowlerName: ''
  });
  const [isPlayerDialogOpen, setPlayerDialogOpen] = useState(false);

  useEffect(() => {
    loadMatch();
  }, [id]);

  const loadMatch = async () => {
    try {
      const response = await getMatch(id);
      setMatch(response.data);
      
      // Fetch team details
      const team1Response = await getTeam(response.data.teams.team1);
      const team2Response = await getTeam(response.data.teams.team2);
      setTeam1(team1Response.data);
      setTeam2(team2Response.data);
      
      setError('');
    } catch (error) {
      console.error('Error loading match:', error);
      setError('Failed to load match details. Please try again.');
    }
  };

  const handleScoreSubmit = async () => {
    try {
      await updateScore(id, scoreInput);
      await loadMatch();
      setScoreInput({
        runs: 0,
        extras: {
          wides: 0,
          noBalls: 0,
          byes: 0,
          legByes: 0
        },
        wickets: 0,
        batsmanName: scoreInput.batsmanName,
        bowlerName: scoreInput.bowlerName
      });
      setError('');
    } catch (error) {
      console.error('Error updating score:', error);
      setError('Failed to update score. Please try again.');
    }
  };

  const handleEndMatch = async () => {
    try {
      await updateMatch(id, { ...match, status: 'completed' });
      navigate(`/match/${id}`);
    } catch (error) {
      console.error('Error ending match:', error);
      setError('Failed to end match. Please try again.');
    }
  };

  const formatOvers = (overs) => {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs % 1) * 10);
    return `${fullOvers}.${balls}`;
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!match || !team1 || !team2) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const currentInnings = match.innings[match.currentInnings];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={1}>
          <Typography variant="h6" component="h1" align="center">
            {team1.name} vs {team2.name}
          </Typography>
          <Typography variant="subtitle1" color="primary" align="center">
            {currentInnings.team === team1._id ? team1.name : team2.name} Innings
          </Typography>
          <Typography variant="h3" align="center" gutterBottom>
            {currentInnings.total}/{currentInnings.wickets}
          </Typography>
          <Typography variant="h6" align="center">
            Overs: {formatOvers(currentInnings.overs)}
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Batsman</InputLabel>
                <Select
                  value={scoreInput.batsmanName}
                  onChange={(e) => setScoreInput(prev => ({
                    ...prev,
                    batsmanName: e.target.value
                  }))}
                  label="Batsman"
                >
                  {(currentInnings.team === team1._id ? team1.members : team2.members).map((member) => (
                    <MenuItem key={member._id} value={member.name}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Bowler</InputLabel>
                <Select
                  value={scoreInput.bowlerName}
                  onChange={(e) => setScoreInput(prev => ({
                    ...prev,
                    bowlerName: e.target.value
                  }))}
                  label="Bowler"
                >
                  {(currentInnings.team === team1._id ? team2.members : team1.members).map((member) => (
                    <MenuItem key={member._id} value={member.name}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>Runs: {scoreInput.runs}</Typography>
            <Slider
              value={scoreInput.runs}
              onChange={(e, value) => setScoreInput(prev => ({
                ...prev,
                runs: value
              }))}
              min={0}
              max={6}
              step={1}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} runs`}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Wickets</InputLabel>
            <Select
              value={scoreInput.wickets}
              onChange={(e) => setScoreInput(prev => ({
                ...prev,
                wickets: e.target.value
              }))}
              label="Wickets"
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setPlayerDialogOpen(true)}
          >
            Add Extras
          </Button>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleScoreSubmit}
          >
            Update Score
          </Button>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate(`/match/${id}`)}
        >
          Back to Match
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleEndMatch}
        >
          End Match
        </Button>
      </Stack>

      <Dialog 
        open={isPlayerDialogOpen} 
        onClose={() => setPlayerDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add Extras</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Wides"
              type="number"
              value={scoreInput.extras.wides}
              onChange={(e) => setScoreInput(prev => ({
                ...prev,
                extras: {
                  ...prev.extras,
                  wides: parseInt(e.target.value) || 0
                }
              }))}
            />
            <TextField
              fullWidth
              label="No Balls"
              type="number"
              value={scoreInput.extras.noBalls}
              onChange={(e) => setScoreInput(prev => ({
                ...prev,
                extras: {
                  ...prev.extras,
                  noBalls: parseInt(e.target.value) || 0
                }
              }))}
            />
            <TextField
              fullWidth
              label="Byes"
              type="number"
              value={scoreInput.extras.byes}
              onChange={(e) => setScoreInput(prev => ({
                ...prev,
                extras: {
                  ...prev.extras,
                  byes: parseInt(e.target.value) || 0
                }
              }))}
            />
            <TextField
              fullWidth
              label="Leg Byes"
              type="number"
              value={scoreInput.extras.legByes}
              onChange={(e) => setScoreInput(prev => ({
                ...prev,
                extras: {
                  ...prev.extras,
                  legByes: parseInt(e.target.value) || 0
                }
              }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlayerDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LiveScoring; 