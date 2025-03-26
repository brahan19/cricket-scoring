const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
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

const inningsSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    total: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    extras: {
        wides: { type: Number, default: 0 },
        noBalls: { type: Number, default: 0 },
        byes: { type: Number, default: 0 },
        legByes: { type: Number, default: 0 }
    },
    players: [playerSchema],
    currentBatsmen: [playerSchema],
    currentBowler: playerSchema,
    balls: [{
        batsman: { type: String, required: true },
        bowler: { type: String, required: true },
        runs: { type: Number, default: 0 },
        isWicket: { type: Boolean, default: false },
        isExtra: { type: Boolean, default: false },
        extraType: { type: String, enum: ['wide', 'noBall', 'bye', 'legBye'] },
        timestamp: { type: Date, default: Date.now }
    }]
});

const matchSchema = new mongoose.Schema({
    teams: {
        team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
        team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }
    },
    teamMembers: {
        team1: [{ type: String, required: true }],
        team2: [{ type: String, required: true }]
    },
    venue: { type: String, required: true },
    matchType: { type: String, required: true },
    overs: { type: Number, required: true },
    date: { type: Date, required: true },
    toss: {
        wonBy: { type: String },
        electedTo: { type: String }
    },
    innings: [inningsSchema],
    currentInnings: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed'],
        default: 'scheduled'
    },
    oversPerInnings: {
        type: Number,
        required: function() {
            return this.matchType !== 'test';
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema); 