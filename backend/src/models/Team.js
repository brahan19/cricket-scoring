const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    members: [{
        name: { type: String, required: true },
        role: { 
            type: String, 
            enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
            default: 'all-rounder'
        }
    }],
    createdBy: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema); 