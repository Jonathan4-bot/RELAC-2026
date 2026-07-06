-- RELAC 2026 Database Schema

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

-- Users table (for admin authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'finance', 'logistique')),
  nom VARCHAR(100),
  prenom VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workshops table (Bible book names)
CREATE TABLE workshops (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) UNIQUE NOT NULL,
  capacite_max INTEGER DEFAULT 30,
  nombre_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(50) UNIQUE NOT NULL,
  sexe VARCHAR(20) NOT NULL CHECK (sexe IN ('Masculin', 'Féminin')),
  capacite_max INTEGER DEFAULT 20,
  nombre_occupants INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participants table
CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  numero_dossier VARCHAR(50) UNIQUE NOT NULL,
  matricule VARCHAR(50) UNIQUE,
  
  -- Personal Information
  nom VARCHAR(100) NOT NULL,
  postnom VARCHAR(100),
  prenom VARCHAR(100) NOT NULL,
  sexe VARCHAR(20) NOT NULL CHECK (sexe IN ('Masculin', 'Féminin')),
  date_naissance DATE NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  adresse TEXT,
  email VARCHAR(255),
  photo_url VARCHAR(500),
  
  -- Ecclesiastical Information
  eglise VARCHAR(255),
  departement VARCHAR(100),
  fonction VARCHAR(100),
  responsable_spirituel VARCHAR(255),
  
  -- Emergency Contact
  urgence_nom VARCHAR(255),
  urgence_lien VARCHAR(100),
  urgence_telephone VARCHAR(20),
  
  -- Medical Information
  maladie_chronique TEXT,
  allergies TEXT,
  restrictions_alimentaires TEXT,
  traitements_medicaux TEXT,
  infos_medicales_complementaires TEXT,
  
  -- Payment Information
  montant_participation DECIMAL(10, 2) DEFAULT 20.00,
  mode_paiement VARCHAR(50) CHECK (mode_paiement IN ('Cash', 'Orange Money', 'Airtel Money', 'M-Pesa')),
  reference_paiement VARCHAR(100),
  preuve_paiement_url VARCHAR(500),
  
  -- Status
  statut_inscription VARCHAR(50) DEFAULT 'en_attente' CHECK (statut_inscription IN ('en_attente', 'valide', 'rejete')),
  statut_paiement VARCHAR(50) DEFAULT 'en_attente' CHECK (statut_paiement IN ('en_attente', 'valide', 'rejete')),
  
  -- Assignments
  workshop_id INTEGER REFERENCES workshops(id),
  room_id INTEGER REFERENCES rooms(id),
  
  -- Metadata
  deja_participe BOOLEAN DEFAULT false,
  comment_connu VARCHAR(100),
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_validation TIMESTAMP,
  valide_par INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER UNIQUE NOT NULL REFERENCES participants(id),
  qr_code_url VARCHAR(500),
  badge_pdf_url VARCHAR(500),
  genere_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type_presence VARCHAR(50) CHECK (type_presence IN ('matin', 'soir', 'session')),
  enregistre_par INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default workshops (Bible books)
INSERT INTO workshops (nom, capacite_max) VALUES
('Genèse', 30),
('Exode', 30),
('Lévitique', 30),
('Nombres', 30),
('Deutéronome', 30),
('Josué', 30),
('Ruth', 30),
('Matthieu', 30),
('Marc', 30),
('Luc', 30),
('Jean', 30),
('Actes', 30),
('Romains', 30);

-- Insert default rooms
INSERT INTO rooms (nom, sexe, capacite_max) VALUES
('A', 'Féminin', 20),
('B', 'Féminin', 20),
('C', 'Masculin', 20),
('D', 'Masculin', 20);

-- Create indexes for better performance
CREATE INDEX idx_participants_statut ON participants(statut_inscription);
CREATE INDEX idx_participants_sexe ON participants(sexe);
CREATE INDEX idx_participants_workshop ON participants(workshop_id);
CREATE INDEX idx_participants_room ON participants(room_id);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
