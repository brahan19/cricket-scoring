import mongoose, { Schema } from 'mongoose';
import { ITeam, ITeamMember } from '../interfaces/team.interface';

const teamMemberSchema = new Schema<ITeamMember>({
    name: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
        default: 'all-rounder'
    }
});

const teamSchema = new Schema<ITeam>({
    name: { type: String, required: true, unique: true },
    members: [teamMemberSchema],
    createdBy: { type: String, required: true }
}, { timestamps: true });

export const Team = mongoose.model<ITeam>('Team', teamSchema); 