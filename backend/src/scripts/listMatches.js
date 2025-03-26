const mongoose = require('mongoose');
const Match = require('../models/Match');

mongoose.connect('mongodb://localhost:27017/cricket_scoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        const matches = await Match.find()
            .populate('teams.team1')
            .populate('teams.team2')
            .populate('innings.team');

        console.log('Matches:', JSON.stringify(matches, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}); 