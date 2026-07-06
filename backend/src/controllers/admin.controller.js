import { User } from '../models/user.model.js';
import { Workshop } from '../models/workshop.model.js';
import { Room } from '../models/room.model.js';
import { Participant } from '../models/participant.model.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const participantStats = await Participant.getStatistics();
    const workshops = await Workshop.findAll();
    const rooms = await Room.findAll();

    res.status(200).json({
      success: true,
      data: {
        participants: participantStats,
        workshops: workshops.map(w => ({
          id: w.id,
          nom: w.nom,
          capacite_max: w.capacite_max,
          nombre_participants: w.nombre_participants,
          taux_remplissage: Math.round((w.nombre_participants / w.capacite_max) * 100)
        })),
        rooms: rooms.map(r => ({
          id: r.id,
          nom: r.nom,
          sexe: r.sexe,
          capacite_max: r.capacite_max,
          nombre_occupants: r.nombre_occupants,
          taux_remplissage: Math.round((r.nombre_occupants / r.capacite_max) * 100)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, role, nom, prenom } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    const user = await User.create({ email, password, role, nom, prenom });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password update through this endpoint
    delete updates.password;

    const user = await User.update(id, updates);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const user = await User.delete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.findAll();

    res.status(200).json({
      success: true,
      data: workshops
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkshop = async (req, res, next) => {
  try {
    const { nom, capacite_max } = req.body;

    const workshop = await Workshop.create({ nom, capacite_max });

    res.status(201).json({
      success: true,
      message: 'Atelier créé avec succès',
      data: workshop
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkshop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const workshop = await Workshop.update(id, updates);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Atelier non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Atelier mis à jour avec succès',
      data: workshop
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkshop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const workshop = await Workshop.delete(id);

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Atelier non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Atelier supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll();

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { nom, sexe, capacite_max } = req.body;

    const room = await Room.create({ nom, sexe, capacite_max });

    res.status(201).json({
      success: true,
      message: 'Chambre créée avec succès',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const room = await Room.update(id, updates);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chambre mise à jour avec succès',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await Room.delete(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chambre supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};
