const mongoose = require('mongoose');
const Match = require('../models/Match');

const cleanupMatches = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cricket-scoring');
        console.log('Connected to MongoDB');

        // Get all matches
        const matches = await Match.find();
        console.log(`Found ${matches.length} matches`);

        let removedCount = 0;
        for (const match of matches) {
            const team1 = match.teams.team1;
            const team2 = match.teams.team2;

            // Check if either team reference is invalid
            if (!team1 || !team2 || 
                team1 === 'undefined' || team2 === 'undefined' ||
                !mongoose.Types.ObjectId.isValid(team1) || !mongoose.Types.ObjectId.isValid(team2)) {
                console.log(`Removing match ${match._id} with invalid team references:`, {
                    team1,
                    team2
                });
                await Match.findByIdAndDelete(match._id);
                removedCount++;
            }
        }

        console.log(`Removed ${removedCount} matches with invalid team references`);
        console.log('Cleanup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

cleanupMatches(); 