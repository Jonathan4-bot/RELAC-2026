import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/database.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function migrate() {
  console.log('🔄 Création des tables...');

  // Créer les tables dans l'ordre
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'finance', 'logistique')),
      nom TEXT,
      prenom TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS workshops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT UNIQUE NOT NULL,
      capacite_max INTEGER DEFAULT 30,
      nombre_participants INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT UNIQUE NOT NULL,
      sexe TEXT NOT NULL CHECK(sexe IN ('Masculin', 'Féminin')),
      capacite_max INTEGER DEFAULT 20,
      nombre_occupants INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_dossier TEXT UNIQUE NOT NULL,
      matricule TEXT UNIQUE,
      
      -- Personal Information
      nom TEXT NOT NULL,
      postnom TEXT,
      prenom TEXT NOT NULL,
      sexe TEXT NOT NULL CHECK(sexe IN ('Masculin', 'Féminin')),
      date_naissance TEXT NOT NULL,
      telephone TEXT NOT NULL,
      whatsapp TEXT,
      adresse TEXT,
      email TEXT,
      photo_url TEXT,
      
      -- Ecclesiastical Information
      eglise TEXT,
      departement TEXT,
      fonction TEXT,
      responsable_spirituel TEXT,
      
      -- Emergency Contact
      urgence_nom TEXT,
      urgence_lien TEXT,
      urgence_telephone TEXT,
      
      -- Medical Information
      maladie_chronique TEXT,
      allergies TEXT,
      restrictions_alimentaires TEXT,
      traitements_medicaux TEXT,
      infos_medicales_complementaires TEXT,
      
      -- Payment Information
      montant_participation REAL DEFAULT 20.00,
      mode_paiement TEXT CHECK(mode_paiement IN ('Cash', 'Orange Money', 'Airtel Money', 'M-Pesa')),
      reference_paiement TEXT,
      preuve_paiement_url TEXT,
      
      -- Status
      statut_inscription TEXT DEFAULT 'en_attente' CHECK(statut_inscription IN ('en_attente', 'valide', 'rejete')),
      statut_paiement TEXT DEFAULT 'en_attente' CHECK(statut_paiement IN ('en_attente', 'valide', 'rejete')),
      
      -- Assignments
      workshop_id INTEGER REFERENCES workshops(id),
      room_id INTEGER REFERENCES rooms(id),
      
      -- Metadata
      deja_participe INTEGER DEFAULT 0,
      comment_connu TEXT,
      date_inscription TEXT DEFAULT (datetime('now')),
      date_validation TEXT,
      valide_par INTEGER REFERENCES users(id),
      
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER UNIQUE NOT NULL REFERENCES participants(id),
      qr_code_url TEXT,
      badge_pdf_url TEXT,
      genere_le TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER REFERENCES participants(id),
      date TEXT DEFAULT (datetime('now')),
      type_presence TEXT CHECK(type_presence IN ('matin', 'soir', 'session')),
      enregistre_par INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS presences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL REFERENCES participants(id),
      type TEXT NOT NULL CHECK(type IN ('sortie', 'entree')),
      heure TEXT DEFAULT (datetime('now', 'localtime')),
      note TEXT,
      scanne_par INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Tables créées avec succès !');

  // Insérer les ateliers par défaut (livres de la Bible)
  const existingWorkshops = db.prepare('SELECT COUNT(*) as count FROM workshops').get();
  if (existingWorkshops.count === 0) {
    const insertWorkshop = db.prepare('INSERT INTO workshops (nom, capacite_max) VALUES (?, ?)');
    const workshops = [
      'Genèse', 'Exode', 'Lévitique', 'Nombres', 'Deutéronome',
      'Josué', 'Ruth', 'Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains'
    ];
    for (const name of workshops) {
      insertWorkshop.run(name, 30);
    }
    console.log(`📚 ${workshops.length} ateliers créés`);
  }

  // Insérer les chambres par défaut
  const existingRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get();
  if (existingRooms.count === 0) {
    const insertRoom = db.prepare('INSERT INTO rooms (nom, sexe, capacite_max) VALUES (?, ?, ?)');
    insertRoom.run('A', 'Féminin', 20);
    insertRoom.run('B', 'Féminin', 20);
    insertRoom.run('C', 'Masculin', 20);
    insertRoom.run('D', 'Masculin', 20);
    console.log('🏠 4 chambres créées');
  }

  // Créer un compte admin par défaut
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existingUsers.count === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('Admin123!', salt);
    
    const insertUser = db.prepare(`
      INSERT INTO users (email, password, role, nom, prenom)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertUser.run('admin@relac2026.com', hashedPassword, 'super_admin', 'Admin', 'Super');
    
    console.log('👑 Compte admin créé: admin@relac2026.com / Admin123!');
  } else {
    console.log('👤 Comptes existants trouvés, aucun admin créé');
  }

  // Corriger les matricules existants s'ils sont nuls
  try {
    const result = db.prepare("UPDATE participants SET matricule = numero_dossier WHERE matricule IS NULL").run();
    if (result.changes > 0) {
      console.log(`🔧 ${result.changes} matricules existants ont été corrigés.`);
    }
  } catch (err) {
    console.error('⚠️ Impossible de mettre à jour les matricules existants:', err.message);
  }

  console.log('');
  console.log('✅ Migration terminée avec succès !');
  console.log('📊 Base SQLite prête');
  console.log('👤 Admin: admin@relac2026.com / Admin123!');
}

export { migrate };
export default migrate;