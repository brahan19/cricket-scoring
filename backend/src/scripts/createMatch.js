const mongoose = require('mongoose');
const Team = require('../models/Team');
const Match = require('../models/Match');

mongoose.connect('mongodb://localhost:27017/cricket_scoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        // Get existing teams
        const team1 = await Team.findOne({ name: 'Dragon Fire' });
        const team2 = await Team.findOne({ name: 'Fire Dragon' });

        if (!team1 || !team2) {
            throw new Error('Teams not found');
        }

        // Create a match
        const match = new Match({
            teams: {
                team1: team1._id,
                team2: team2._id
            },
            venue: 'Central Cricket Ground',
            matchType: 't20',
            overs: 20,
            oversPerInnings: 20,
            date: new Date(),
            toss: {
                wonBy: 'Dragon Fire',
                electedTo: 'bat'
            },
            innings: [{
                team: team1._id,
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
                currentBowler: null
            }],
            currentInnings: 0,
            status: 'in_progress'
        });
        await match.save();

        console.log('Match created successfully!');
        console.log('Match ID:', match._id);
    } catch (error) {
        console.error('Error creating match:', error);
    } finally {
        await mongoose.disconnect();
    }
}); 