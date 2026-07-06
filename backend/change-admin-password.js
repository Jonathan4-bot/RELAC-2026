# ================================================================
# Script de changement du mot de passe administrateur
# ReLAc 2026 — Sécurité Production
# ================================================================
# Usage : node change-admin-password.js
# ================================================================

import bcrypt from 'bcryptjs';
import db from './src/config/database.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function changeAdminPassword() {
  console.log('\n🔐 Changement du mot de passe Administrateur — ReLAc 2026\n');

  // Afficher les admins existants
  const admins = db.prepare('SELECT id, email, nom, prenom, role FROM users').all();

  if (admins.length === 0) {
    console.log('❌ Aucun admin trouvé. Lancez d\'abord : npm run migrate');
    rl.close();
    return;
  }

  console.log('📋 Comptes administrateurs existants :');
  admins.forEach((admin, i) => {
    console.log(`  ${i + 1}. [${admin.role}] ${admin.prenom} ${admin.nom} — ${admin.email}`);
  });

  const choix = await question('\nNuméro du compte à modifier (ou "q" pour quitter) : ');

  if (choix === 'q') {
    console.log('Opération annulée.');
    rl.close();
    return;
  }

  const idx = parseInt(choix) - 1;
  if (isNaN(idx) || idx < 0 || idx >= admins.length) {
    console.log('❌ Choix invalide.');
    rl.close();
    return;
  }

  const admin = admins[idx];
  console.log(`\n✏️  Modification du compte : ${admin.email}`);

  const nouveauMdp = await question('Nouveau mot de passe (min. 8 caractères) : ');

  if (!nouveauMdp || nouveauMdp.length < 8) {
    console.log('❌ Mot de passe trop court (minimum 8 caractères).');
    rl.close();
    return;
  }

  const confirmation = await question('Confirmer le mot de passe : ');

  if (nouveauMdp !== confirmation) {
    console.log('❌ Les mots de passe ne correspondent pas.');
    rl.close();
    return;
  }

  try {
    const hash = bcrypt.hashSync(nouveauMdp, 12);
    db.prepare('UPDATE users SET password = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .run(hash, admin.id);

    console.log(`\n✅ Mot de passe mis à jour avec succès pour ${admin.email}`);
    console.log('   Conservez ce mot de passe en lieu sûr.\n');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error.message);
  }

  rl.close();
}

changeAdminPassword();
