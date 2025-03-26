import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL
});

// Match endpoints
export const getMatches = () => api.get('/matches');
export const getMatch = (id) => api.get(`/matches/${id}`);
export const createMatch = (data) => api.post('/matches', data);
export const updateMatch = (id, data) => api.put(`/matches/${id}`, data);
export const updateScore = (id, data) => api.post(`/matches/${id}/score`, data);
export const getMatchStatistics = (id) => api.get(`/matches/${id}/statistics`);

// Team endpoints
export const getTeams = () => api.get('/teams');
export const getTeam = (id) => api.get(`/teams/${id}`);
export const createTeam = (data) => api.post('/teams', data);
export const updateTeam = (id, data) => api.put(`/teams/${id}`, data);
export const addTeamMember = (teamId, data) => api.post(`/teams/${teamId}/members`, data);
export const removeTeamMember = (teamId, memberId) => api.delete(`/teams/${teamId}/members/${memberId}`);

export default api; 