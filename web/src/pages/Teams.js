import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getTeams, createTeam, addTeamMember, removeTeamMember } from '../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', createdBy: 'admin' });
  const [newMember, setNewMember] = useState({ name: '', role: 'all-rounder' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching teams...');
      const response = await getTeams();
      console.log('Teams response:', response.data);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      setError(null);
      console.log('Creating team:', newTeam);
      await createTeam(newTeam);
      setNewTeam({ name: '', createdBy: 'admin' });
      setOpenDialog(false);
      fetchTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      setError(error.message || 'Failed to create team');
    }
  };

  const handleAddMember = async (teamId) => {
    try {
      setError(null);
      console.log('Adding member:', newMember, 'to team:', teamId);
      await addTeamMember(teamId, newMember);
      setNewMember({ name: '', role: 'all-rounder' });
      fetchTeams();
    } catch (error) {
      console.error('Error adding team member:', error);
      setError(error.message || 'Failed to add team member');
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      setError(null);
      console.log('Removing member:', memberId, 'from team:', teamId);
      await removeTeamMember(teamId, memberId);
      fetchTeams();
    } catch (error) {
      console.error('Error removing team member:', error);
      setError(error.message || 'Failed to remove team member');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Teams
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create Team
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {teams.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                No teams found. Create your first team!
              </Typography>
            </Grid>
          ) : (
            teams.map((team) => (
              <Grid item xs={12} key={team._id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {team.name}
                  </Typography>
                  <List>
                    {team.members.map((member) => (
                      <ListItem key={member._id}>
                        <ListItemText 
                          primary={member.name}
                          secondary={member.role}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleRemoveMember(team._id, member._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                      size="small"
                      label="Add Member"
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={newMember.role}
                        label="Role"
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                      >
                        <MenuItem value="batsman">Batsman</MenuItem>
                        <MenuItem value="bowler">Bowler</MenuItem>
                        <MenuItem value="all-rounder">All-Rounder</MenuItem>
                        <MenuItem value="wicket-keeper">Wicket Keeper</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddMember(team._id)}
                      disabled={!newMember.name}
                    >
                      Add
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={newTeam.name}
            onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTeam} variant="contained" disabled={!newTeam.name}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Teams; 