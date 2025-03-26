import axios from 'axios';
import { API_URL } from '@env';
import { IMatch, ITeam } from '../interfaces';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Team APIs
export const teamApi = {
    getAll: () => api.get<ITeam[]>('/teams'),
    getById: (id: string) => api.get<ITeam>(`/teams/${id}`),
    create: (team: Partial<ITeam>) => api.post<ITeam>('/teams', team),
    update: (id: string, team: Partial<ITeam>) => api.put<ITeam>(`/teams/${id}`, team),
    delete: (id: string) => api.delete(`/teams/${id}`),
};

// Match APIs
export const matchApi = {
    getAll: () => api.get<IMatch[]>('/matches'),
    getById: (id: string) => api.get<IMatch>(`/matches/${id}`),
    create: (match: Partial<IMatch>) => api.post<IMatch>('/matches', match),
    update: (id: string, match: Partial<IMatch>) => api.put<IMatch>(`/matches/${id}`, match),
    updateScore: (id: string, scoreUpdate: {
        runs: number;
        wickets: number;
        extras: {
            wides: number;
            noBalls: number;
            byes: number;
            legByes: number;
        };
        batsmanName: string;
        bowlerName: string;
    }) => api.put<IMatch>(`/matches/${id}/score`, scoreUpdate),
    delete: (id: string) => api.delete(`/matches/${id}`),
}; 