import mongoose, { Schema, Types } from 'mongoose';
import { IMatch, IPlayer, IExtras, IBall, IInnings, IToss } from '../interfaces/match.interface';

const playerSchema = new Schema<IPlayer>({
    name: { type: String, required: true },
    runs: { type: Number, default: 0 },
    balls: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    isOut: { type: Boolean, default: false },
    overs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    runsConceded: { type: Number, default: 0 }
});

const extrasSchema = new Schema<IExtras>({
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 }
});

const ballSchema = new Schema<IBall>({
    batsman: { type: String, required: true },
    bowler: { type: String, required: true },
    runs: { type: Number, default: 0 },
    isWicket: { type: Boolean, default: false },
    isExtra: { type: Boolean, default: false },
    extraType: { type: String, enum: ['wide', 'noBall', 'bye', 'legBye'] },
    timestamp: { type: Date, default: Date.now }
});

const inningsSchema = new Schema<IInnings>({
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    total: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    extras: extrasSchema,
    players: [playerSchema],
    currentBatsmen: [playerSchema],
    currentBowler: playerSchema,
    balls: [ballSchema]
});

const tossSchema = new Schema<IToss>({
    wonBy: String,
    electedTo: String
});

const matchSchema = new Schema<IMatch>({
    teams: {
        team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
        team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true }
    },
    teamMembers: {
        team1: [{ type: String, required: true }],
        team2: [{ type: String, required: true }]
    },
    venue: { type: String, required: true },
    matchType: { type: String, required: true },
    overs: { type: Number, required: true },
    date: { type: Date, required: true },
    toss: tossSchema,
    innings: [inningsSchema],
    currentInnings: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed'],
        default: 'scheduled'
    },
    oversPerInnings: {
        type: Number,
        required: function(this: IMatch) {
            return this.matchType !== 'test';
        }
    }
}, { timestamps: true });

export const Match = mongoose.model<IMatch>('Match', matchSchema); 