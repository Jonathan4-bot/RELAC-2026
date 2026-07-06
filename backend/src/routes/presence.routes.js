import express from 'express';
import { scanPresence, getHistorique, getLivePresences } from '../controllers/presence.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Scanner un participant (sortie/entree)
router.post('/scan', authenticateToken, authorizeRoles('super_admin', 'admin', 'logistique'), scanPresence);

// Voir le statut temps réel (live) du jour
router.get('/live', authenticateToken, authorizeRoles('super_admin', 'admin', 'logistique'), getLivePresences);

// Historique complet d'un participant
router.get('/historique/:matricule', authenticateToken, authorizeRoles('super_admin', 'admin', 'logistique'), getHistorique);

export default router;
