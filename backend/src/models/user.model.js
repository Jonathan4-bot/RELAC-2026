import db from '../config/database.js';

export class User {
  static create({ email, password, role, nom, prenom }) {
    const stmt = db.prepare(`
      INSERT INTO users (email, password, role, nom, prenom)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(email, password, role, nom, prenom);
    return this.findById(info.lastInsertRowid);
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) || null;
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, email, role, nom, prenom, created_at FROM users WHERE id = ?');
    return stmt.get(id) || null;
  }

  static findAll() {
    const stmt = db.prepare('SELECT id, email, role, nom, prenom, created_at FROM users ORDER BY created_at DESC');
    return stmt.all();
  }

  static update(id, updates) {
    if (Object.keys(updates).length === 0) return null;

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    const stmt = db.prepare(`UPDATE users SET ${fields}, updated_at = datetime('now') WHERE id = ?`);
    stmt.run(...values);
    return this.findById(id);
  }

  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
    return { id };
  }
}