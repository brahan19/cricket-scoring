import express, { Request, Response, Router } from 'express';
import { Team } from '../models/Team';
import { ITeam } from '../interfaces/team.interface';

const router: Router = express.Router();

// Create a new team
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const teamData: Partial<ITeam> = {
            ...req.body,
            createdBy: req.body.createdBy || 'system'
        };

        const team = new Team(teamData);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(400).json({ 
            message: 'Error creating team',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get all teams
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const teams = await Team.find().sort({ name: 1 });
        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ 
            message: 'Error fetching teams',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get team by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ 
            message: 'Error fetching team',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Update team
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.json(team);
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(400).json({ 
            message: 'Error updating team',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Delete team
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);

        if (!team) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ 
            message: 'Error deleting team',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 