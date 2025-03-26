import { Types } from 'mongoose';

export interface IPlayer {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    isOut?: boolean;
    overs?: number;
    wickets?: number;
    runsConceded?: number;
}

export interface IExtras {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
}

export interface IBall {
    batsman: string;
    bowler: string;
    runs: number;
    isWicket: boolean;
    isExtra: boolean;
    extraType?: 'wide' | 'noBall' | 'bye' | 'legBye';
    timestamp: Date;
}

export interface IInnings {
    team: Types.ObjectId;
    total: number;
    wickets: number;
    overs: number;
    extras: IExtras;
    players: IPlayer[];
    currentBatsmen: IPlayer[];
    currentBowler: IPlayer | null;
    balls: IBall[];
}

export interface IToss {
    wonBy?: string;
    electedTo?: string;
}

export interface IMatch {
    _id: string;
    teams: {
        team1: Types.ObjectId;
        team2: Types.ObjectId;
    };
    teamMembers: {
        team1: string[];
        team2: string[];
    };
    venue: string;
    matchType: string;
    overs: number;
    date: Date;
    toss?: IToss;
    innings: IInnings[];
    currentInnings: number;
    status: 'scheduled' | 'in_progress' | 'completed';
    oversPerInnings?: number;
    createdAt: Date;
    updatedAt: Date;
} 