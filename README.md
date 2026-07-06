# RELAC 2026 - Plateforme d'Inscription et de Gestion des Participants

Plateforme web moderne et professionnelle pour gérer les inscriptions à la RELAC 2026 (Retraite du Libre Accès), organisée par la Jeunesse Logos-Rhema.

## 🚀 Fonctionnalités

### Pour les Participants
- **Inscription en ligne** : Formulaire multi-étapes complet (informations personnelles, ecclésiastiques, urgence, médical, paiement)
- **Suivi de dossier** : Portail participant pour vérifier le statut d'inscription
- **Paiement flexible** : Support Cash, Orange Money, Airtel Money, M-Pesa
- **Badge personnalisé** : Génération automatique de badge PDF avec QR code
- **Email de confirmation** : Notifications automatiques à chaque étape

### Pour l'Administration
- **Tableau de bord** : Statistiques en temps réel (inscrits, paiements, ateliers, chambres)
- **Gestion des participants** : Validation, rejet, modification des inscriptions
- **Assignation automatique** : Attribution automatique des ateliers (livres bibliques) et chambres
- **Génération de matricules** : Système automatique RELAC2026-XXXX
- **Export de données** : Export Excel et PDF des listes
- **Contrôle d'accès** : Rôles (Super Admin, Admin, Finance, Logistique)

## 🛠️ Stack Technique

### Frontend
- **React.js** : Framework JavaScript
- **Vite** : Build tool
- **Tailwind CSS** : Framework CSS
- **Framer Motion** : Animations
- **React Router** : Routing
- **React Icons** : Icônes

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **PostgreSQL** : Base de données
- **JWT** : Authentification
- **Multer** : Upload de fichiers
- **Nodemailer** : Envoi d'emails
- **PDFKit** : Génération PDF
- **QRCode** : Génération QR codes
- **ExcelJS** : Export Excel

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## 🔧 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd RELAC-2026
```

### 2. Configuration du Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configurer le fichier `.env` :

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=relac2026
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Email (Gmail ou SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=RELAC 2026 <noreply@relac2026.com>

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Initialiser la base de données

```bash
npm run migrate
```

Cela créera toutes les tables et insérera les ateliers et chambres par défaut.

### 4. Créer un compte Super Admin

```bash
# Utiliser un outil comme pgAdmin ou psql
INSERT INTO users (email, password, role, nom, prenom) 
VALUES ('admin@relac2026.com', '$2a$10$hashed_password', 'super_admin', 'Admin', 'Super');
```

**Important** : Remplacez `$2a$10$hashed_password` par un mot de passe hashé avec bcryptjs.

### 5. Configuration du Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Configurer le fichier `.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Lancer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

L'application sera accessible :
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## 📁 Structure du Projet

```
RELAC-2026/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (base de données)
│   │   ├── controllers/     # Logique métier
│   │   ├── middleware/      # Middleware (auth, upload, error)
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Services (email, PDF, QR code, export)
│   │   └── database/        # Schema et migrations
│   ├── uploads/             # Fichiers uploadés
│   ├── server.js            # Point d'entrée
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── services/        # Services API
│   │   ├── App.jsx          # Composant principal
│   │   └── main.jsx         # Point d'entrée
│   └── package.json
└── README.md
```

## 🔐 Rôles et Permissions

### Super Admin
- Accès total à toutes les fonctionnalités
- Gestion des utilisateurs
- Gestion des ateliers et chambres
- Validation des inscriptions

### Admin
- Gestion des participants
- Validation des inscriptions
- Gestion des ateliers et chambres

### Finance
- Validation des paiements
- Export des rapports financiers

### Logistique
- Gestion des chambres
- Gestion des ateliers
- Export des listes logistiques

## 📊 Ateliers par Défaut

Les ateliers portent les noms des livres de la Bible :
- Genèse, Exode, Lévitique, Nombres, Deutéronome
- Josué, Ruth
- Matthieu, Marc, Luc, Jean
- Actes, Romains

## 🏠 Chambres par Défaut

- **Femmes** : Chambres A, B (20 places chacune)
- **Hommes** : Chambres C, D (20 places chacunes)

## 📧 Configuration Email

Pour Gmail :
1. Activer la vérification en 2 étapes
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

Pour autre provider SMTP :
Configurer les paramètres dans le fichier `.env` du backend.

## 🚀 Déploiement

### Option 1: Docker (Recommandé)

La méthode la plus simple pour déployer en production est d'utiliser Docker et Docker Compose.

```bash
# 1. Cloner le projet
git clone <repository-url>
cd RELAC-2026

# 2. Configurer l'environnement
cp .env.production.example .env
nano .env  # Éditer avec vos valeurs

# 3. Déployer
chmod +x deploy.sh
./deploy.sh
```

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour plus de détails sur le déploiement.

### Option 2: Déploiement Manuel

#### Backend (Production)

```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

Ou utiliser PM2 pour la gestion de processus :

```bash
npm install -g pm2
pm2 start server.js --name relac-backend
pm2 save
pm2 startup
```

#### Frontend (Production)

```bash
cd frontend
npm run build
```

Servir le dossier `dist` avec un serveur web (Nginx, Apache, etc.).

Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour la configuration Nginx détaillée.

## 📝 Notes Importantes

- Le système génère automatiquement les matricules (RELAC2026-XXXX)
- L'assignation des ateliers et chambres est automatique et équilibrée
- Les emails sont envoyés automatiquement lors de l'inscription et de la validation
- Les badges PDF sont générés automatiquement après validation
- Pour le déploiement en production, voir le guide [DEPLOYMENT.md](DEPLOYMENT.md)

## 🤝 Support

Pour toute question ou problème, contactez l'équipe technique de la Jeunesse Logos-Rhema.

## 📄 Licence

Ce projet est propriété de la Jeunesse Logos-Rhema.

---

**Développé pour la 12ème édition de la RELAC 2026**
*Du 02 au 08 août 2026*
"# RELAC-2026" 
