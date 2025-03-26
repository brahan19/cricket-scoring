import { Document } from 'mongoose';

export interface ITeamMember {
    name: string;
    role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
}

export interface ITeam extends Document {
    name: string;
    members: ITeamMember[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
} 