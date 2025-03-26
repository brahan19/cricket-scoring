export interface ITeamMember {
    name: string;
    role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
}

export interface ITeam {
    _id: string;
    name: string;
    members: ITeamMember[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
} 