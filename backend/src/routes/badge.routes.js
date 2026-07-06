import express from 'express';
import { generateBadge } from '../services/badge.service.js';
import { Participant } from '../models/participant.model.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - accessible via matricule (pour les participants)
router.get('/public/:matricule', async (req, res, next) => {
  try {
    const { matricule } = req.params;
    
    const participant = await Participant.findByMatricule(matricule);
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    if (participant.statut_inscription !== 'valide') {
      return res.status(400).json({
        success: false,
        message: 'Le participant doit être validé pour générer un badge'
      });
    }

    const badgeUrl = await generateBadge(participant);

    res.json({
      success: true,
      data: {
        badge_url: badgeUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin route
router.get('/generate/:participantId', authenticateToken, authorizeRoles('super_admin', 'admin'), async (req, res, next) => {
  try {
    const { participantId } = req.params;
    
    const participant = await Participant.findById(participantId);
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    if (participant.statut_inscription !== 'valide') {
      return res.status(400).json({
        success: false,
        message: 'Le participant doit être validé pour générer un badge'
      });
    }

    const badgeUrl = await generateBadge(participant);

    res.json({
      success: true,
      data: {
        badge_url: badgeUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
