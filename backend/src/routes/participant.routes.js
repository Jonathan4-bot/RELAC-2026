import express from 'express';
import {
  registerParticipant,
  getParticipant,
  getParticipantByDossier,
  getParticipantByMatricule,
  getAllParticipants,
  getStatistics,
  updateParticipant,
  validateParticipant,
  rejectParticipant,
  deleteParticipant
} from '../controllers/participant.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { uploadFields } from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes - support file uploads
router.post('/register', uploadFields([
  { name: 'photo', maxCount: 1 },
  { name: 'preuve_paiement', maxCount: 1 }
]), registerParticipant);
router.get('/dossier/:numero_dossier', getParticipantByDossier);
router.get('/matricule/:matricule', getParticipantByMatricule);
router.get('/statistics', getStatistics);

// Protected routes - all authenticated users
router.get('/:id', authenticateToken, getParticipant);
router.get('/', authenticateToken, getAllParticipants);

// Admin only routes
router.put('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), updateParticipant);
router.post('/:id/validate', authenticateToken, authorizeRoles('super_admin', 'admin', 'finance'), validateParticipant);
router.post('/:id/reject', authenticateToken, authorizeRoles('super_admin', 'admin', 'finance'), rejectParticipant);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), deleteParticipant);

export default router;
