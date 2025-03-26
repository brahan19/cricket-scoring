const mongoose = require('mongoose');
const Match = require('../models/Match');
const Team = require('../models/Team');

const checkMatches = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket-scoring');
        console.log('Connected to MongoDB');

        // Get all matches
        const matches = await Match.find();
        console.log(`Found ${matches.length} matches`);

        // Check each match
        for (const match of matches) {
            console.log('\nMatch:', match._id);
            console.log('Team1:', match.teams.team1);
            console.log('Team2:', match.teams.team2);
            
            // Try to find teams
            const team1 = await Team.findById(match.teams.team1);
            const team2 = await Team.findById(match.teams.team2);
            
            console.log('Team1 found:', team1 ? team1.name : 'Not found');
            console.log('Team2 found:', team2 ? team2.name : 'Not found');
        }

        console.log('\nCheck completed');
        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkMatches(); 