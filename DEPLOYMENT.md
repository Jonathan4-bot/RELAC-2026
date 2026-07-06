# Guide de Déploiement — ReLAc 2026

## Architecture du projet

```
RELAC-2026/
├── frontend/     → Site vitrine React/Vite (déployé sur Netlify)
└── backend/      → API Express + SQLite natif Node 22+ (déployé sur Render)
```

> **Note** : La base de données est SQLite (fichier local), intégrée nativement dans Node.js 22+.  
> Aucun serveur de base de données séparé (PostgreSQL, MySQL, etc.) n'est requis.

---

## ⚡ Méthode 1 — Déploiement Cloud Gratuit (Recommandé)

C'est la méthode la plus simple. Frontend sur **Netlify**, Backend sur **Render**.

### Étape 1 — Préparer le Frontend

```bash
# Depuis le dossier du projet
cd frontend
npm run build
```
Le dossier `frontend/dist/` est généré.

**Déployer sur Netlify :**
1. Créer un compte sur [netlify.com](https://netlify.com)
2. "Add new site" → "Deploy manually"
3. Glisser-déposer le dossier `frontend/dist/` dans Netlify
4. Ton URL est disponible immédiatement (ex: `relac2026.netlify.app`)
5. HTTPS est activé automatiquement ✅

---

### Étape 2 — Déployer le Backend sur Render

1. Pousser le code sur GitHub :
   ```bash
   git add .
   git commit -m "Production ready"
   git push
   ```

2. Créer un compte sur [render.com](https://render.com)

3. "New Web Service" → Connecter ton dépôt GitHub → Sélectionner `RELAC-2026`

4. Configurer le service :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install && npm run migrate`
   - **Start Command** : `node server.js`
   - **Node Version** : `22` (obligatoire pour `node:sqlite`)

5. Configurer les variables d'environnement (onglet "Environment") :

   | Variable | Valeur |
   |----------|--------|
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | *(générer avec le script ci-dessous)* |
   | `FRONTEND_URL` | `https://relac2026.netlify.app` |
   | `EMAIL_HOST` | `smtp.gmail.com` |
   | `EMAIL_PORT` | `587` |
   | `EMAIL_USER` | `ton.email@gmail.com` |
   | `EMAIL_PASSWORD` | *(mot de passe d'application Gmail)* |
   | `EMAIL_FROM` | `ReLAc 2026 <ton.email@gmail.com>` |

6. Cliquer "Create Web Service" → Render déploie automatiquement

> **HTTPS** : Render active automatiquement HTTPS sur `https://xxx.onrender.com` ✅

---

### Étape 3 — Connecter Frontend et Backend

Retourner sur Netlify → Site settings → Environment variables :

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://xxx.onrender.com/api` |

Puis redéployer le frontend.

---

## 🔐 Génération d'un JWT_SECRET fort

```bash
node -e "const c=require('crypto'); console.log(c.randomBytes(64).toString('hex'));"
```
Copier la sortie (128 caractères) et la coller dans `JWT_SECRET`.

---

## 📧 Configuration Email Gmail

1. Aller sur [myaccount.google.com](https://myaccount.google.com)
2. **Sécurité** → activer la **Validation en deux étapes**
3. **Sécurité** → **Mots de passe des applications**
4. Créer un mot de passe pour "Autre (nom personnalisé)" → `ReLAc 2026`
5. Copier le mot de passe à **16 caractères** → `EMAIL_PASSWORD`

> Si l'email n'est pas configuré, l'application fonctionne quand même normalement.  
> Les inscriptions sont enregistrées, mais les emails de confirmation ne sont pas envoyés.

---

## 🔑 Changer le mot de passe Admin

Après le premier déploiement, **changer immédiatement** le mot de passe par défaut (`Admin123!`) :

```bash
cd backend
npm run change-password
```

Le script interactif liste les admins, demande un nouveau mot de passe et le confirme.

---

## 🐳 Méthode 2 — Déploiement avec Docker

### Prérequis
- Docker Engine 20.10+
- Docker Compose v2.0+

### Configurer l'environnement

```bash
# Copier le template
cp backend/.env.production.example backend/.env.production

# Éditer les valeurs
notepad backend/.env.production
```

### Lancer

```bash
docker-compose up -d
```

Les services démarrés :
- **Frontend** → `http://localhost:80`
- **Backend API** → `http://localhost:5000`

### Volumes persistants

| Volume | Contenu |
|--------|---------|
| `sqlite_data` | Base de données SQLite |
| `uploads_data` | Photos et preuves de paiement |

### HTTPS avec Docker

Pour activer HTTPS, placer les certificats dans `./ssl/` :
```
ssl/
├── cert.pem
└── key.pem
```
*(Obtenir des certificats gratuits avec [Let's Encrypt](https://letsencrypt.org))*

---

## 🚀 Script de setup automatique (Windows)

```powershell
# Dans PowerShell, depuis la racine du projet :
.\setup-production.ps1
```

Le script :
1. Vérifie la version de Node.js (22+ requis)
2. Génère automatiquement un JWT_SECRET fort
3. Collecte les informations email
4. Crée le fichier `.env.production`
5. Installe les dépendances et construit le frontend
6. Initialise la base de données

---

## ✅ Checklist finale avant mise en production

- [ ] `FRONTEND_URL` pointe vers l'URL réelle (non localhost)
- [ ] `JWT_SECRET` est fort (64+ caractères aléatoires)
- [ ] Email Gmail configuré avec un mot de passe d'application
- [ ] Mot de passe Admin par défaut changé (`npm run change-password`)
- [ ] HTTPS activé (automatique sur Netlify/Render)
- [ ] Build frontend validé (`npm run build` sans erreur)
- [ ] Base de données migrée (`npm run migrate`)

---

## 📊 Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | `admin@relac2026.com` | `Admin123!` ← **À changer !** |

---

## 🆘 Dépannage courant

**Port 5000 déjà utilisé :**
```powershell
# Windows — Trouver et tuer le processus
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Erreur `node:sqlite` :**  
Vérifier que Node.js ≥ 22 est installé : `node -v`

**Emails non envoyés :**  
Vérifier que `EMAIL_USER` et `EMAIL_PASSWORD` sont remplis dans `.env`.  
L'application fonctionne sans email — les inscriptions sont toujours enregistrées.

**Erreur CORS :**  
Vérifier que `FRONTEND_URL` dans le `.env` backend correspond exactement à l'URL du frontend (sans slash final).
