const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const mongoose = require('mongoose');

// Create a new team
router.post('/', async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(400).json({ 
            message: 'Error creating team',
            details: error.message 
        });
    }
});

// Get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().sort({ name: 1 });
        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ 
            message: 'Error fetching teams',
            details: error.message 
        });
    }
});

// Get team by ID or name
router.get('/:identifier', async (req, res) => {
    try {
        let team;
        const identifier = req.params.identifier;

        // Try to find by ID first
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            team = await Team.findById(identifier);
        }

        // If not found by ID, try to find by name
        if (!team) {
            team = await Team.findOne({ name: decodeURIComponent(identifier) });
        }

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ 
            message: 'Error fetching team',
            details: error.message 
        });
    }
});

// Update team
router.put('/:identifier', async (req, res) => {
    try {
        let team;
        const identifier = req.params.identifier;

        // Try to update by ID first
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            team = await Team.findByIdAndUpdate(
                identifier,
                req.body,
                { new: true, runValidators: true }
            );
        }

        // If not found by ID, try to update by name
        if (!team) {
            team = await Team.findOneAndUpdate(
                { name: decodeURIComponent(identifier) },
                req.body,
                { new: true, runValidators: true }
            );
        }

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(400).json({ 
            message: 'Error updating team',
            details: error.message 
        });
    }
});

// Add member to team
router.post('/:identifier/members', async (req, res) => {
    try {
        let team;
        const identifier = req.params.identifier;

        // Try to find by ID first
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            team = await Team.findById(identifier);
        }

        // If not found by ID, try to find by name
        if (!team) {
            team = await Team.findOne({ name: decodeURIComponent(identifier) });
        }

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.members.push(req.body);
        await team.save();
        res.json(team);
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(400).json({ 
            message: 'Error adding team member',
            details: error.message 
        });
    }
});

// Remove member from team
router.delete('/:identifier/members/:memberId', async (req, res) => {
    try {
        let team;
        const identifier = req.params.identifier;

        // Try to find by ID first
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            team = await Team.findById(identifier);
        }

        // If not found by ID, try to find by name
        if (!team) {
            team = await Team.findOne({ name: decodeURIComponent(identifier) });
        }

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.members = team.members.filter(member => 
            member._id.toString() !== req.params.memberId
        );
        await team.save();
        res.json(team);
    } catch (error) {
        console.error('Error removing team member:', error);
        res.status(400).json({ 
            message: 'Error removing team member',
            details: error.message 
        });
    }
});

module.exports = router; 