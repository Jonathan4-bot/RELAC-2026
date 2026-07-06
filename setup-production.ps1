# ================================================================
# Script de configuration rapide — ReLAc 2026 Production
# Exécuter dans PowerShell : .\setup-production.ps1
# ================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          ReLAc 2026 — Configuration Production          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ─────────────────────────────────────────────
# Vérification Node.js
# ─────────────────────────────────────────────
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js n'est pas installé. Télécharger sur nodejs.org" -ForegroundColor Red
    exit 1
}

$majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($majorVersion -lt 22) {
    Write-Host "❌ Node.js $nodeVersion détecté. Version 22+ requise (node:sqlite)." -ForegroundColor Red
    Write-Host "   Télécharger Node.js 22 LTS sur : https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js $nodeVersion détecté (compatible)" -ForegroundColor Green

# ─────────────────────────────────────────────
# Génération d'un JWT_SECRET fort
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "🔐 Génération d'un JWT_SECRET cryptographiquement fort..." -ForegroundColor Yellow
$jwtSecret = node -e "const c=require('crypto'); console.log(c.randomBytes(64).toString('hex'));"
Write-Host "✅ JWT_SECRET généré (128 caractères hexadécimaux)" -ForegroundColor Green

# ─────────────────────────────────────────────
# Collecte des informations
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "📋 Configuration de l'environnement de production" -ForegroundColor Cyan
Write-Host "   (Appuyer sur Entrée pour utiliser la valeur par défaut)" -ForegroundColor Gray
Write-Host ""

$frontendUrl = Read-Host "URL du frontend [ex: https://relac2026.netlify.app]"
if (-not $frontendUrl) { $frontendUrl = "https://relac2026.netlify.app" }

$emailUser = Read-Host "Email Gmail [ex: relac2026@gmail.com]"
$emailPassword = Read-Host "Mot de passe d'application Gmail (16 caractères)" -AsSecureString
$emailPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($emailPassword)
)

# ─────────────────────────────────────────────
# Création du fichier .env de production
# ─────────────────────────────────────────────
$envContent = @"
# ================================================================
# RELAC 2026 — Production (généré automatiquement)
# ================================================================

# Serveur
PORT=5000
NODE_ENV=production

# JWT — Clé forte générée automatiquement
JWT_SECRET=$jwtSecret
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=$frontendUrl

# Email Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=$emailUser
EMAIL_PASSWORD=$emailPasswordPlain
EMAIL_FROM=ReLAc 2026 <$emailUser>

# Upload
MAX_FILE_SIZE=5242880
"@

$envPath = Join-Path $PSScriptRoot "backend\.env.production"
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force
Write-Host ""
Write-Host "✅ Fichier .env.production créé : $envPath" -ForegroundColor Green

# ─────────────────────────────────────────────
# Installation des dépendances
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
Set-Location backend
npm install --production
Set-Location ..

Write-Host ""
Write-Host "📦 Installation et build du frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

# ─────────────────────────────────────────────
# Migration base de données
# ─────────────────────────────────────────────
Write-Host ""
Write-Host "🗄️  Initialisation de la base de données..." -ForegroundColor Yellow
Set-Location backend
$env:NODE_ENV = "production"
npm run migrate
Set-Location ..

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ Configuration terminée !                 ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  📋 Prochaines étapes :                                  ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  1. Changer le mot de passe admin (OBLIGATOIRE) :       ║" -ForegroundColor Green
Write-Host "║     cd backend && npm run change-password               ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  2. Démarrer le backend :                                ║" -ForegroundColor Green
Write-Host "║     cd backend && npm start                             ║" -ForegroundColor Yellow
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  3. Déployer frontend/dist/ sur Netlify                 ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
