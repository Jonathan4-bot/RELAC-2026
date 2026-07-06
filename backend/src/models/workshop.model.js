import db from '../config/database.js';

export class Workshop {
  static findAll() {
    const stmt = db.prepare('SELECT * FROM workshops ORDER BY nom');
    return stmt.all();
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM workshops WHERE id = ?');
    return stmt.get(id) || null;
  }

  static create({ nom, capacite_max }) {
    const stmt = db.prepare('INSERT INTO workshops (nom, capacite_max) VALUES (?, ?)');
    const info = stmt.run(nom, capacite_max);
    return this.findById(info.lastInsertRowid);
  }

  static update(id, updates) {
    if (Object.keys(updates).length === 0) return null;

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    const stmt = db.prepare(`UPDATE workshops SET ${fields} WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM workshops WHERE id = ?');
    stmt.run(id);
    return { id };
  }

  static getParticipantsCount(id) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM participants WHERE workshop_id = ? AND statut_inscription = 'valide'
    `);
    return stmt.get(id).count;
  }
}