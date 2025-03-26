const mongoose = require('mongoose');
const Match = require('../models/Match');

mongoose.connect('mongodb://localhost:27017/cricket_scoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        const matchId = '67e3d050eb5bac7bbb9f4622';
        const match = await Match.findById(matchId)
            .populate('teams.team1')
            .populate('teams.team2')
            .populate('innings.team');

        console.log('Match Data:', JSON.stringify(match, null, 2));
        console.log('Current Innings:', match.innings[match.currentInnings]);
        console.log('Team1:', match.teams.team1);
        console.log('Team2:', match.teams.team2);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}); 