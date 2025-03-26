const mongoose = require('mongoose');
const Team = require('../models/Team');
const Match = require('../models/Match');

mongoose.connect('mongodb://localhost:27017/cricket_scoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        // Create Team 1
        const team1 = new Team({
            name: 'Dragon Fire',
            members: [
                { name: 'John Smith', role: 'batsman' },
                { name: 'Mike Johnson', role: 'batsman' },
                { name: 'David Brown', role: 'all-rounder' },
                { name: 'Steve Wilson', role: 'bowler' },
                { name: 'Tom Anderson', role: 'bowler' }
            ],
            createdBy: 'admin'
        });
        await team1.save();

        // Create Team 2
        const team2 = new Team({
            name: 'Fire Dragon',
            members: [
                { name: 'Alex Turner', role: 'batsman' },
                { name: 'Chris Evans', role: 'batsman' },
                { name: 'James Wilson', role: 'all-rounder' },
                { name: 'Peter Smith', role: 'bowler' },
                { name: 'Ryan Brown', role: 'bowler' }
            ],
            createdBy: 'admin'
        });
        await team2.save();

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

        console.log('Sample data created successfully!');
        console.log('Team 1:', team1._id);
        console.log('Team 2:', team2._id);
        console.log('Match:', match._id);
    } catch (error) {
        console.error('Error creating sample data:', error);
    } finally {
        await mongoose.disconnect();
    }
}); 