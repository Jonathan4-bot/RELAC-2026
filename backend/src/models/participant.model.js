import db from '../config/database.js';

export class Participant {
  static create(data) {
    // Nettoyer les données : convertir undefined en null
    const clean = (val) => val === undefined || val === '' ? null : val;
    const toInt = (val) => {
      if (val === true || val === 'true' || val === 1 || val === '1') return 1;
      if (val === false || val === 'false' || val === 0 || val === '0') return 0;
      return null;
    };

    const stmt = db.prepare(`
      INSERT INTO participants (
        numero_dossier, nom, postnom, prenom, sexe, date_naissance,
        telephone, whatsapp, adresse, email, photo_url,
        eglise, departement, fonction, responsable_spirituel,
        urgence_nom, urgence_lien, urgence_telephone,
        maladie_chronique, allergies, restrictions_alimentaires, traitements_medicaux,
        infos_medicales_complementaires, mode_paiement, reference_paiement,
        preuve_paiement_url, deja_participe, comment_connu
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      clean(data.numero_dossier), clean(data.nom), clean(data.postnom), clean(data.prenom), clean(data.sexe),
      clean(data.date_naissance), clean(data.telephone), clean(data.whatsapp), clean(data.adresse), clean(data.email),
      clean(data.photo_url),
      clean(data.eglise), clean(data.departement), clean(data.fonction), clean(data.responsable_spirituel),
      clean(data.urgence_nom), clean(data.urgence_lien), clean(data.urgence_telephone),
      clean(data.maladie_chronique), clean(data.allergies), clean(data.restrictions_alimentaires),
      clean(data.traitements_medicaux), clean(data.infos_medicales_complementaires),
      clean(data.mode_paiement), clean(data.reference_paiement), clean(data.preuve_paiement_url),
      toInt(data.deja_participe), clean(data.comment_connu)
    );
    return this.findById(info.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT p.*, 
             w.nom as workshop_nom, 
             r.nom as room_nom,
             u.nom as valide_par_nom, u.prenom as valide_par_prenom
      FROM participants p
      LEFT JOIN workshops w ON p.workshop_id = w.id
      LEFT JOIN rooms r ON p.room_id = r.id
      LEFT JOIN users u ON p.valide_par = u.id
      WHERE p.id = ?
    `);
    return stmt.get(id) || null;
  }

  static findByNumeroDossier(numero_dossier) {
    const stmt = db.prepare(`
      SELECT p.*, 
             w.nom as workshop_nom, 
             r.nom as room_nom
      FROM participants p
      LEFT JOIN workshops w ON p.workshop_id = w.id
      LEFT JOIN rooms r ON p.room_id = r.id
      WHERE p.numero_dossier = ?
    `);
    return stmt.get(numero_dossier) || null;
  }

  static findByMatricule(matricule) {
    const stmt = db.prepare(`
      SELECT p.*, 
             w.nom as workshop_nom, 
             r.nom as room_nom
      FROM participants p
      LEFT JOIN workshops w ON p.workshop_id = w.id
      LEFT JOIN rooms r ON p.room_id = r.id
      WHERE p.matricule = ?
    `);
    return stmt.get(matricule) || null;
  }

  static findAll(filters = {}) {
    let query = `
      SELECT p.*, 
             w.nom as workshop_nom, 
             r.nom as room_nom
      FROM participants p
      LEFT JOIN workshops w ON p.workshop_id = w.id
      LEFT JOIN rooms r ON p.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.statut_inscription) { params.push(filters.statut_inscription); query += ' AND p.statut_inscription = ?'; }
    if (filters.statut_paiement) { params.push(filters.statut_paiement); query += ' AND p.statut_paiement = ?'; }
    if (filters.sexe) { params.push(filters.sexe); query += ' AND p.sexe = ?'; }
    if (filters.workshop_id) { params.push(filters.workshop_id); query += ' AND p.workshop_id = ?'; }
    if (filters.room_id) { params.push(filters.room_id); query += ' AND p.room_id = ?'; }

    if (filters.search) {
      const s = `%${filters.search}%`;
      params.push(s, s, s, s);
      query += ' AND (p.nom LIKE ? OR p.prenom LIKE ? OR p.email LIKE ? OR p.matricule LIKE ?)';
    }

    query += ' ORDER BY p.date_inscription DESC';
    if (filters.limit) { params.push(filters.limit); query += ' LIMIT ?'; }
    if (filters.offset) { params.push(filters.offset); query += ' OFFSET ?'; }

    return db.prepare(query).all(...params);
  }

  static getStatistics() {
    return db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN sexe = 'Masculin' THEN 1 ELSE 0 END) as hommes,
        SUM(CASE WHEN sexe = 'Féminin' THEN 1 ELSE 0 END) as femmes,
        SUM(CASE WHEN statut_paiement = 'valide' THEN 1 ELSE 0 END) as paiements_valides,
        SUM(CASE WHEN statut_paiement = 'en_attente' THEN 1 ELSE 0 END) as paiements_en_attente,
        SUM(CASE WHEN statut_inscription = 'valide' THEN 1 ELSE 0 END) as inscriptions_valides,
        SUM(CASE WHEN statut_inscription = 'rejete' THEN 1 ELSE 0 END) as inscriptions_rejetes
      FROM participants
    `).get();
  }

  static update(id, updates) {
    if (Object.keys(updates).length === 0) return null;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    db.prepare(`UPDATE participants SET ${fields}, updated_at = datetime('now') WHERE id = ?`).run(...values);
    return this.findById(id);
  }

  static updatePhoto(id, photoUrl) {
    db.prepare(`UPDATE participants SET photo_url = ?, updated_at = datetime('now') WHERE id = ?`).run(photoUrl, id);
    return this.findById(id);
  }

  static updatePaymentProof(id, proofUrl) {
    db.prepare(`UPDATE participants SET preuve_paiement_url = ?, updated_at = datetime('now') WHERE id = ?`).run(proofUrl, id);
    return this.findById(id);
  }

  static validate(id, { workshopId, roomId, validePar }) {
    db.prepare(`
      UPDATE participants 
      SET statut_inscription = 'valide', statut_paiement = 'valide',
          workshop_id = ?, room_id = ?, date_validation = datetime('now'), valide_par = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(workshopId, roomId, validePar, id);
    this.updateWorkshopCount(workshopId);
    this.updateRoomCount(roomId);
    return this.findById(id);
  }

  static reject(id, validePar) {
    db.prepare(`
      UPDATE participants SET statut_inscription = 'rejete', statut_paiement = 'rejete',
        date_validation = datetime('now'), valide_par = ?, updated_at = datetime('now') WHERE id = ?
    `).run(validePar, id);
    return this.findById(id);
  }

  static generateMatricule() {
    const year = new Date().getFullYear();
    const result = db.prepare(`SELECT MAX(CAST(SUBSTR(matricule, -3) AS INTEGER)) as maxCount FROM participants WHERE matricule LIKE ?`).get(`ReLAc${year}-%`);
    
    let count = 1;
    if (result && result.maxCount !== null) {
      count = result.maxCount + 1;
    }
    
    return `ReLAc${year}-${String(count).padStart(3, '0')}`;
  }

  static updateWorkshopCount(workshopId) {
    const { count } = db.prepare(`SELECT COUNT(*) as count FROM participants WHERE workshop_id = ? AND statut_inscription = 'valide'`).get(workshopId);
    db.prepare(`UPDATE workshops SET nombre_participants = ? WHERE id = ?`).run(count, workshopId);
  }

  static updateRoomCount(roomId) {
    const { count } = db.prepare(`SELECT COUNT(*) as count FROM participants WHERE room_id = ? AND statut_inscription = 'valide'`).get(roomId);
    db.prepare(`UPDATE rooms SET nombre_occupants = ? WHERE id = ?`).run(count, roomId);
  }

  static getAvailableWorkshop() {
    return db.prepare(`SELECT * FROM workshops WHERE nombre_participants < capacite_max ORDER BY nombre_participants ASC LIMIT 1`).get() || null;
  }

  static getAvailableRoom(sexe) {
    return db.prepare(`SELECT * FROM rooms WHERE sexe = ? AND nombre_occupants < capacite_max ORDER BY nombre_occupants ASC LIMIT 1`).get(sexe) || null;
  }

  static delete(id) {
    db.prepare('DELETE FROM participants WHERE id = ?').run(id);
    return { id };
  }
}