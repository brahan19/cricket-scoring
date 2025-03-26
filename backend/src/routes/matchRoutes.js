const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Create a new match
router.post('/', async (req, res) => {
    try {
        // Create initial innings
        const initialInnings = {
            team: req.body.teams.team1,
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
        };

        const matchData = {
            ...req.body,
            innings: [initialInnings],
            currentInnings: 0,
            status: 'scheduled',
            teamMembers: {
                team1: req.body.teamMembers?.team1 || [],
                team2: req.body.teamMembers?.team2 || []
            }
        };

        const match = new Match(matchData);
        await match.save();
        res.status(201).json(match);
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(400).json({ 
            message: 'Error creating match',
            details: error.message 
        });
    }
});

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find().sort({ date: -1 });
        res.json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ 
            message: 'Error fetching matches',
            details: error.message 
        });
    }
});

// Get match by ID
router.get('/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(500).json({ 
            message: 'Error fetching match',
            details: error.message 
        });
    }
});

// Update match details
router.put('/:id', async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(400).json({ 
            message: 'Error updating match',
            details: error.message 
        });
    }
});

// Update match score
router.post('/:id/score', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const { runs, wickets, extras, batsmanName, bowlerName } = req.body;
        const currentInnings = match.innings[match.currentInnings];

        // Update or create current batsman
        let batsman = currentInnings.players.find(p => p.name === batsmanName);
        if (!batsman) {
            batsman = { name: batsmanName, runs: 0, balls: 0, fours: 0, sixes: 0 };
            currentInnings.players.push(batsman);
        }
        batsman.runs += runs;
        batsman.balls += 1;
        if (runs === 4) batsman.fours += 1;
        if (runs === 6) batsman.sixes += 1;

        // Update or create current bowler
        let bowler = currentInnings.players.find(p => p.name === bowlerName);
        if (!bowler) {
            bowler = { name: bowlerName, overs: 0, wickets: 0, runsConceded: 0 };
            currentInnings.players.push(bowler);
        }
        
        // Update bowler's overs (6 balls = 1 over)
        const currentBalls = (bowler.overs % 1) * 10;
        const newBalls = currentBalls + 1;
        if (newBalls === 6) {
            bowler.overs = Math.floor(bowler.overs) + 1;
        } else {
            bowler.overs = Math.floor(bowler.overs) + (newBalls / 10);
        }
        
        bowler.runsConceded += runs;
        if (wickets) bowler.wickets += wickets;

        // Update innings total
        currentInnings.total += runs;
        currentInnings.wickets += wickets;
        
        // Update innings overs (6 balls = 1 over)
        const currentInningsBalls = (currentInnings.overs % 1) * 10;
        const newInningsBalls = currentInningsBalls + 1;
        if (newInningsBalls === 6) {
            currentInnings.overs = Math.floor(currentInnings.overs) + 1;
        } else {
            currentInnings.overs = Math.floor(currentInnings.overs) + (newInningsBalls / 10);
        }
        
        currentInnings.extras = { ...currentInnings.extras, ...extras };

        // Update current batsmen and bowler
        currentInnings.currentBatsmen = currentInnings.players.filter(p => !p.isOut).slice(0, 2);
        currentInnings.currentBowler = bowler;

        await match.save();
        res.json(match);
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(400).json({ 
            message: 'Error updating score',
            details: error.message 
        });
    }
});

// Get match statistics
router.get('/:id/statistics', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const statistics = {
            matchType: match.matchType,
            venue: match.venue,
            teams: match.teams,
            toss: match.toss,
            innings: match.innings.map(innings => ({
                team: innings.team,
                total: innings.total,
                wickets: innings.wickets,
                overs: innings.overs,
                extras: innings.extras,
                topBatsmen: innings.players
                    .sort((a, b) => b.runs - a.runs)
                    .slice(0, 3),
                topBowlers: innings.players
                    .sort((a, b) => b.wickets - a.wickets)
                    .slice(0, 3)
            }))
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ 
            message: 'Error fetching statistics',
            details: error.message 
        });
    }
});

module.exports = router; 