import db from '../config/database.js';

export class Room {
  static findAll() {
    const stmt = db.prepare('SELECT * FROM rooms ORDER BY sexe, nom');
    return stmt.all();
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM rooms WHERE id = ?');
    return stmt.get(id) || null;
  }

  static findBySexe(sexe) {
    const stmt = db.prepare('SELECT * FROM rooms WHERE sexe = ? ORDER BY nom');
    return stmt.all(sexe);
  }

  static create({ nom, sexe, capacite_max }) {
    const stmt = db.prepare('INSERT INTO rooms (nom, sexe, capacite_max) VALUES (?, ?, ?)');
    const info = stmt.run(nom, sexe, capacite_max);
    return this.findById(info.lastInsertRowid);
  }

  static update(id, updates) {
    if (Object.keys(updates).length === 0) return null;

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    const stmt = db.prepare(`UPDATE rooms SET ${fields} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM rooms WHERE id = ?');
    stmt.run(id);
    return { id };
  }

  static getOccupantsCount(id) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM participants WHERE room_id = ? AND statut_inscription = 'valide'
    `);
    return stmt.get(id).count;
  }
}