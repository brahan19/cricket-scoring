const mongoose = require('mongoose');
const Match = require('../models/Match');
const Team = require('../models/Team');

const migrateTeams = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket-scoring');
        console.log('Connected to MongoDB');

        // Get all matches
        const matches = await Match.find();
        console.log(`Found ${matches.length} matches to update`);

        // Update each match
        for (const match of matches) {
            // Find teams by name
            const team1 = await Team.findOne({ name: match.teams.team1 });
            const team2 = await Team.findOne({ name: match.teams.team2 });

            if (team1 && team2) {
                // Update match with team ObjectIds
                match.teams.team1 = team1._id;
                match.teams.team2 = team2._id;
                await match.save();
                console.log(`Updated match ${match._id} with team references`);
            } else {
                console.log(`Could not find teams for match ${match._id}`);
                console.log('Team1:', match.teams.team1);
                console.log('Team2:', match.teams.team2);
            }
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateTeams(); 