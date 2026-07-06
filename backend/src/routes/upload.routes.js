import express from 'express';
import { uploadSingle, uploadFields } from '../middleware/upload.middleware.js';
import { Participant } from '../models/participant.model.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Upload participant photo
router.post('/photo/:participantId', authenticateToken, uploadSingle('photo'), async (req, res, next) => {
  try {
    const { participantId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier téléversé'
      });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const participant = await Participant.updatePhoto(participantId, photoUrl);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Photo téléversée avec succès',
      data: {
        photo_url: photoUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload payment proof
router.post('/payment/:participantId', authenticateToken, uploadSingle('payment_proof'), async (req, res, next) => {
  try {
    const { participantId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier téléversé'
      });
    }

    const proofUrl = `/uploads/${req.file.filename}`;
    const participant = await Participant.updatePaymentProof(participantId, proofUrl);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preuve de paiement téléversée avec succès',
      data: {
        preuve_paiement_url: proofUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
