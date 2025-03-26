const mongoose = require('mongoose');
const Match = require('../models/Match');

mongoose.connect('mongodb://localhost:27017/cricket_scoring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    try {
        const result = await Match.deleteMany({});
        console.log(`Deleted ${result.deletedCount} matches successfully!`);
    } catch (error) {
        console.error('Error deleting matches:', error);
    } finally {
        await mongoose.disconnect();
    }
}); 