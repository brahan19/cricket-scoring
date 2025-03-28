import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Fab,
  Box,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getMatches } from '../services/api';

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await getMatches();
      setMatches(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading matches:', error);
      setError('Failed to load matches. Please try again.');
    }
  };

  const getMatchStatus = (match) => {
    switch (match.status) {
      case 'in_progress':
        return { text: 'In Progress', color: 'error.main' };
      case 'completed':
        return { text: 'Completed', color: 'success.main' };
      default:
        return { text: 'Scheduled', color: 'info.main' };
    }
  };

  const getTeamName = (team) => {
    return team?.name || 'Unknown Team';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cricket Scoring App
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {matches.map((match) => {
          const status = getMatchStatus(match);
          return (
            <Grid item xs={12} sm={6} md={4} key={match._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {getTeamName(match.teams.team1)} vs {getTeamName(match.teams.team2)}
                  </Typography>
                  <Typography color={status.color} gutterBottom>
                    {status.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Venue: {match.venue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(match.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/match/${match._id}`)}
                  >
                    View Details
                  </Button>
                  {match.status === 'in_progress' && (
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => navigate(`/scoring/${match._id}`)}
                    >
                      Score Live
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab 
          color="primary" 
          aria-label="add match"
          onClick={() => navigate('/new-match')}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Container>
  );
};

export default Home; 