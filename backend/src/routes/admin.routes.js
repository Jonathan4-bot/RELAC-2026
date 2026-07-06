import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/admin.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('super_admin', 'admin', 'finance', 'logistique'), getDashboardStats);

// User management (Super Admin only)
router.get('/users', authenticateToken, authorizeRoles('super_admin'), getAllUsers);
router.post('/users', authenticateToken, authorizeRoles('super_admin'), createUser);
router.put('/users/:id', authenticateToken, authorizeRoles('super_admin'), updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('super_admin'), deleteUser);

// Workshop management (Admin and Super Admin)
router.get('/workshops', authenticateToken, authorizeRoles('super_admin', 'admin', 'logistique'), getAllWorkshops);
router.post('/workshops', authenticateToken, authorizeRoles('super_admin', 'admin'), createWorkshop);
router.put('/workshops/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), updateWorkshop);
router.delete('/workshops/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), deleteWorkshop);

// Room management (Admin and Super Admin)
router.get('/rooms', authenticateToken, authorizeRoles('super_admin', 'admin', 'logistique'), getAllRooms);
router.post('/rooms', authenticateToken, authorizeRoles('super_admin', 'admin'), createRoom);
router.put('/rooms/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), updateRoom);
router.delete('/rooms/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), deleteRoom);

export default router;
