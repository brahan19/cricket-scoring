const mongoose = require('mongoose');
const Team = require('../models/Team');

mongoose.connect('mongodb://localhost:27017/cricket_scoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        const teams = await Team.find();
        console.log('Teams:', JSON.stringify(teams, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}); 