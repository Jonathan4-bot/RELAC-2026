import { Participant } from '../models/participant.model.js';
import { Workshop } from '../models/workshop.model.js';
import { Room } from '../models/room.model.js';
import { sendRegistrationEmail, sendValidationEmail } from '../services/email.service.js';

export const registerParticipant = async (req, res, next) => {
  try {
    const data = req.body;

    // Handle uploaded files
    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        data.photo_url = `/uploads/${req.files.photo[0].filename}`;
      }
      if (req.files.preuve_paiement && req.files.preuve_paiement[0]) {
        data.preuve_paiement_url = `/uploads/${req.files.preuve_paiement[0].filename}`;
      }
    }

    let participant;
    let matricule;
    let retries = 3;
    
    while (retries > 0) {
      try {
        // Generate unique matricule
        matricule = Participant.generateMatricule();
        data.matricule = matricule;
        data.numero_dossier = matricule;

        // Create participant
        participant = await Participant.create(data);
        break; // Success
      } catch (error) {
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
          retries--;
          if (retries === 0) throw error;
        } else {
          throw error;
        }
      }
    }

    // Send confirmation email
    if (data.email) {
      await sendRegistrationEmail(data.email, {
        nom: data.prenom,
        numero_dossier: matricule
      });
    }

    res.status(201).json({
      success: true,
      message: 'Inscription enregistrée avec succès',
      data: participant
    });
  } catch (error) {
    next(error);
  }
};

export const getParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    next(error);
  }
};

export const getParticipantByDossier = async (req, res, next) => {
  try {
    const { numero_dossier } = req.params;
    const participant = await Participant.findByNumeroDossier(numero_dossier);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    next(error);
  }
};

export const getParticipantByMatricule = async (req, res, next) => {
  try {
    const { matricule } = req.params;
    const participant = await Participant.findByMatricule(matricule);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
  next(error);
  }
};

export const getAllParticipants = async (req, res, next) => {
  try {
    const filters = {
      statut_inscription: req.query.statut_inscription,
      statut_paiement: req.query.statut_paiement,
      sexe: req.query.sexe,
      workshop_id: req.query.workshop_id,
      room_id: req.query.room_id,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset ? parseInt(req.query.offset) : null
    };

    const participants = await Participant.findAll(filters);

    res.status(200).json({
      success: true,
      data: participants,
      count: participants.length
    });
  } catch (error) {
    next(error);
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const stats = await Participant.getStatistics();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const updateParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const participant = await Participant.update(id, updates);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant mis à jour avec succès',
      data: participant
    });
  } catch (error) {
    next(error);
  }
};

export const validateParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { workshop_id, room_id } = req.body;

    // Get participant to determine gender
    const participant = await Participant.findById(id);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    // Auto-assign workshop if not provided
    let finalWorkshopId = workshop_id;
    if (!finalWorkshopId) {
      const availableWorkshop = await Participant.getAvailableWorkshop();
      if (!availableWorkshop) {
        return res.status(400).json({
          success: false,
          message: 'Aucun atelier disponible'
        });
      }
      finalWorkshopId = availableWorkshop.id;
    }

    // Auto-assign room if not provided
    let finalRoomId = room_id;
    if (!finalRoomId) {
      const availableRoom = await Participant.getAvailableRoom(participant.sexe);
      if (!availableRoom) {
        return res.status(400).json({
          success: false,
          message: 'Aucune chambre disponible pour ce sexe'
        });
      }
      finalRoomId = availableRoom.id;
    }

    // Validate participant
    const validatedParticipant = await Participant.validate(id, {
      workshopId: finalWorkshopId,
      roomId: finalRoomId,
      validePar: req.user.id
    });

    // Send validation email
    if (participant.email) {
      await sendValidationEmail(participant.email, {
        nom: participant.prenom,
        matricule: validatedParticipant.matricule,
        workshop: validatedParticipant.workshop_nom,
        room: validatedParticipant.room_nom
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant validé avec succès',
      data: validatedParticipant
    });
  } catch (error) {
    next(error);
  }
};

export const rejectParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const participant = await Participant.reject(id, req.user.id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant rejeté avec succès',
      data: participant
    });
  } catch (error) {
    next(error);
  }
};

export const deleteParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const participant = await Participant.delete(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};
