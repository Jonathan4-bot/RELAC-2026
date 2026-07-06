import db from '../config/database.js';

// ─────────────────────────────────────────────
// POST /api/presences/scan
// Enregistre une sortie ou une entrée via QR code
// Body: { matricule, type: 'sortie' | 'entree', note? }
// ─────────────────────────────────────────────
export const scanPresence = (req, res) => {
  try {
    const { matricule, type, note } = req.body;
    const scanneParId = req.user?.id || null;

    if (!matricule || !type) {
      return res.status(400).json({ error: 'Matricule et type (sortie/entree) requis.' });
    }

    if (!['sortie', 'entree'].includes(type)) {
      return res.status(400).json({ error: 'Type invalide. Utiliser "sortie" ou "entree".' });
    }

    // Trouver le participant par matricule OU numéro de dossier
    const participant = db.prepare(`
      SELECT id, nom, prenom, postnom, matricule, numero_dossier,
             eglise, statut_inscription, photo_url
      FROM participants
      WHERE matricule = ? OR numero_dossier = ?
    `).get(matricule, matricule);

    if (!participant) {
      return res.status(404).json({ error: `Participant introuvable pour le code : ${matricule}` });
    }

    if (participant.statut_inscription !== 'valide') {
      return res.status(403).json({
        error: `Inscription non validée (statut: ${participant.statut_inscription})`,
        participant: {
          nom: participant.nom,
          prenom: participant.prenom,
          statut: participant.statut_inscription
        }
      });
    }

    // Vérifier la dernière présence pour éviter les doublons rapides (< 1 minute)
    const derniereScan = db.prepare(`
      SELECT * FROM presences
      WHERE participant_id = ?
      ORDER BY created_at DESC LIMIT 1
    `).get(participant.id);

    if (derniereScan) {
      const diffMinutes = (Date.now() - new Date(derniereScan.created_at).getTime()) / 60000;
      if (diffMinutes < 1 && derniereScan.type === type) {
        return res.status(409).json({
          warning: `Ce participant a déjà été scanné (${type}) il y a moins d'1 minute.`,
          derniereScan
        });
      }
    }

    // Enregistrer la présence
    const heureLocale = new Date().toLocaleString('fr-FR', {
      timeZone: 'Africa/Lubumbashi',
      dateStyle: 'short',
      timeStyle: 'medium'
    });

    const result = db.prepare(`
      INSERT INTO presences (participant_id, type, heure, note, scanne_par)
      VALUES (?, ?, datetime('now', 'localtime'), ?, ?)
    `).run(participant.id, type, note || null, scanneParId);

    // Récupérer l'historique du jour
    const historiqueJour = db.prepare(`
      SELECT type, heure FROM presences
      WHERE participant_id = ?
        AND date(created_at) = date('now')
      ORDER BY created_at DESC
      LIMIT 10
    `).all(participant.id);

    return res.status(201).json({
      success: true,
      message: `✅ ${type === 'sortie' ? 'Sortie' : 'Entrée'} enregistrée pour ${participant.prenom} ${participant.nom}`,
      heure: heureLocale,
      participant: {
        id: participant.id,
        nom: participant.nom,
        prenom: participant.prenom,
        postnom: participant.postnom,
        matricule: participant.matricule,
        numero_dossier: participant.numero_dossier,
        eglise: participant.eglise,
        photo_url: participant.photo_url,
      },
      type,
      historiqueJour,
      presenceId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Erreur scan présence:', error);
    return res.status(500).json({ error: 'Erreur serveur lors du scan.' });
  }
};

// ─────────────────────────────────────────────
// GET /api/presences/historique/:matricule
// Historique complet des présences d'un participant
// ─────────────────────────────────────────────
export const getHistorique = (req, res) => {
  try {
    const { matricule } = req.params;

    const participant = db.prepare(`
      SELECT id, nom, prenom, postnom, matricule, numero_dossier, eglise
      FROM participants WHERE matricule = ? OR numero_dossier = ?
    `).get(matricule, matricule);

    if (!participant) {
      return res.status(404).json({ error: 'Participant introuvable.' });
    }

    const historique = db.prepare(`
      SELECT p.id, p.type, p.heure, p.note, p.created_at,
             u.nom as scanne_par_nom, u.prenom as scanne_par_prenom
      FROM presences p
      LEFT JOIN users u ON u.id = p.scanne_par
      WHERE p.participant_id = ?
      ORDER BY p.created_at DESC
    `).all(participant.id);

    // Stats résumées
    const stats = {
      total_sorties: historique.filter(h => h.type === 'sortie').length,
      total_entrees: historique.filter(h => h.type === 'entree').length,
      derniere_activite: historique[0] || null
    };

    return res.json({ participant, historique, stats });

  } catch (error) {
    console.error('Erreur historique:', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ─────────────────────────────────────────────
// GET /api/presences/live
// Vue temps-réel de toutes les présences du jour
// ─────────────────────────────────────────────
export const getLivePresences = (req, res) => {
  try {
    const presencesJour = db.prepare(`
      SELECT 
        p.id, p.type, p.heure, p.created_at,
        pa.nom, pa.prenom, pa.postnom, pa.matricule,
        pa.numero_dossier, pa.eglise, pa.photo_url
      FROM presences p
      JOIN participants pa ON pa.id = p.participant_id
      WHERE date(p.created_at) = date('now')
      ORDER BY p.created_at DESC
      LIMIT 100
    `).all();

    // Participants actuellement sortis (dernière action = sortie)
    const tousParticipants = db.prepare(`
      SELECT DISTINCT participant_id FROM presences
      WHERE date(created_at) = date('now')
    `).all().map(r => r.participant_id);

    const statutsActuels = {};
    for (const pid of tousParticipants) {
      const derniere = db.prepare(`
        SELECT type FROM presences
        WHERE participant_id = ? AND date(created_at) = date('now')
        ORDER BY created_at DESC LIMIT 1
      `).get(pid);
      if (derniere) statutsActuels[pid] = derniere.type;
    }

    const nbSortis = Object.values(statutsActuels).filter(t => t === 'sortie').length;
    const nbRentres = Object.values(statutsActuels).filter(t => t === 'entree').length;

    return res.json({
      presences: presencesJour,
      resume: {
        total_scans_jour: presencesJour.length,
        participants_sortis: nbSortis,
        participants_rentres: nbRentres
      }
    });

  } catch (error) {
    console.error('Erreur live présences:', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
