const mongoose = require('mongoose');
const Match = require('../models/Match');

const resetMatch = async (matchId) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/cricket-scoring');
        console.log('Connected to MongoDB');

        const match = await Match.findById(matchId);
        if (!match) {
            console.log('Match not found');
            return;
        }

        // Reset innings data
        match.innings = [{
            team: match.teams.team1,
            total: 0,
            wickets: 0,
            overs: 0,
            extras: {
                wides: 0,
                noBalls: 0,
                byes: 0,
                legByes: 0
            },
            players: [],
            currentBatsmen: [],
            currentBowler: null,
            balls: []
        }];
        match.currentInnings = 0;
        match.status = 'scheduled';

        await match.save();
        console.log('Match score reset successfully');
    } catch (error) {
        console.error('Error resetting match:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Get match ID from command line argument
const matchId = process.argv[2];
if (!matchId) {
    console.log('Please provide a match ID');
    process.exit(1);
}

resetMatch(matchId); 