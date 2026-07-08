// SQLite avec le module natif Node.js - Aucune installation requise !
// Disponible depuis Node.js 22+
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'database.sqlite');
let db;
try {
  console.log('📂 Tentative d\'ouverture de la base de données à:', dbPath);
  db = new DatabaseSync(dbPath);
  // Activer les clés étrangères
  db.exec('PRAGMA foreign_keys = ON');
  console.log('✅ SQLite natif connecté - Fichier:', dbPath);
} catch (error) {
  console.error('❌ ERREUR CRITIQUE D\'OUVERTURE DE LA BASE DE DONNEES:', error);
  process.exit(1);
}

export default db;