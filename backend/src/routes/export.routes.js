import express from 'express';
import { exportToExcel, exportToPDF } from '../services/export.service.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/excel', authenticateToken, authorizeRoles('super_admin', 'admin', 'finance'), async (req, res, next) => {
  try {
    const filters = {
      statut_inscription: req.query.statut_inscription,
      statut_paiement: req.query.statut_paiement,
      sexe: req.query.sexe,
      workshop_id: req.query.workshop_id,
      room_id: req.query.room_id,
    };

    const filePath = await exportToExcel(filters);

    res.json({
      success: true,
      data: {
        download_url: filePath
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/pdf', authenticateToken, authorizeRoles('super_admin', 'admin', 'finance'), async (req, res, next) => {
  try {
    const filters = {
      statut_inscription: req.query.statut_inscription,
      statut_paiement: req.query.statut_paiement,
      sexe: req.query.sexe,
      workshop_id: req.query.workshop_id,
      room_id: req.query.room_id,
    };

    const filePath = await exportToPDF(filters);

    res.json({
      success: true,
      data: {
        download_url: filePath
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
