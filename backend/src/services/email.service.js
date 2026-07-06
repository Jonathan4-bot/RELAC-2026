import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────
// Création du transporteur avec vérification
// Si EMAIL_USER est vide, les emails sont désactivés
// gracieusement (l'app continue de fonctionner)
// ─────────────────────────────────────────────
const isEmailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  console.log('✅ Service email configuré et actif');
} else {
  console.log('⚠️  Email non configuré — les notifications sont désactivées');
  console.log('   Pour activer : remplir EMAIL_USER et EMAIL_PASSWORD dans .env');
}

const FOOTER_DATE = 'Du 09 au 15 août 2026 • Lubumbashi — École La Bonté 3';
const SITE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─────────────────────────────────────────────
// Email de confirmation d'inscription
// ─────────────────────────────────────────────
export const sendRegistrationEmail = async (email, data) => {
  if (!isEmailConfigured || !transporter) {
    console.log(`📧 [MODE SILENCIEUX] Email de confirmation pour ${email} (email non configuré)`);
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ReLAc 2026 <noreply@relac2026.com>',
      to: email,
      subject: 'Confirmation d\'inscription — ReLAc 2026 🙏',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 30px auto; }
            .header { background: linear-gradient(135deg, #17303b 0%, #0a5c7a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .header h1 { margin: 0 0 8px; font-size: 28px; letter-spacing: 1px; }
            .header p { margin: 0; opacity: 0.85; font-size: 14px; }
            .content { background: white; padding: 35px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .badge { background: #f0fdf4; border: 2px solid #00d084; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
            .badge .dossier { font-size: 24px; font-weight: bold; color: #17303b; letter-spacing: 2px; }
            .info-box { background: #f8fafc; border-left: 4px solid #00d084; border-radius: 0 8px 8px 0; padding: 15px 20px; margin: 15px 0; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00d084, #0a9c64); color: white; text-decoration: none; border-radius: 30px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 25px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🙏 ReLAc 2026</h1>
              <p>Retraite du Libre Accès — 12ème Édition</p>
            </div>
            <div class="content">
              <h2>Bienvenue, ${data.nom} !</h2>
              <p>Votre inscription à la <strong>ReLAc 2026</strong> a été enregistrée avec succès. Gloire à Dieu !</p>

              <div class="badge">
                <p style="margin:0 0 5px; font-size:13px; color:#555;">Votre numéro de dossier</p>
                <div class="dossier">${data.numero_dossier}</div>
                <p style="margin:8px 0 0; font-size:12px; color:#777;">Conservez ce numéro précieusement</p>
              </div>

              <div class="info-box">
                <p style="margin:0;"><strong>📍 Lieu :</strong> École La Bonté 3, Avenue des Aviateurs, Quartier Texaco, Lubumbashi</p>
                <p style="margin:8px 0 0;"><strong>📅 Dates :</strong> Du 09 au 15 août 2026</p>
              </div>

              <p>Votre dossier est actuellement <strong>en attente de validation</strong> par l'administration. Vous recevrez un email dès que votre inscription sera validée.</p>

              <div style="text-align:center;">
                <a href="${SITE_URL}/participant/${data.numero_dossier}" class="button">Suivre mon dossier →</a>
              </div>

              <div class="footer">
                <p>Jeunesse JELOR — Logos-Rhema • ReLAc 2026 • ${FOOTER_DATE}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de confirmation envoyé à ${email}`);
  } catch (error) {
    // Erreur email non bloquante — l'inscription reste enregistrée
    console.error('❌ Erreur envoi email (non critique):', error.message);
  }
};

// ─────────────────────────────────────────────
// Email de validation d'inscription
// ─────────────────────────────────────────────
export const sendValidationEmail = async (email, data) => {
  if (!isEmailConfigured || !transporter) {
    console.log(`📧 [MODE SILENCIEUX] Email de validation pour ${email} (email non configuré)`);
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ReLAc 2026 <noreply@relac2026.com>',
      to: email,
      subject: 'Inscription validée — ReLAc 2026 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
            .wrapper { max-width: 600px; margin: 30px auto; }
            .header { background: linear-gradient(135deg, #17303b 0%, #0a5c7a 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .header h1 { margin: 0 0 8px; font-size: 28px; }
            .content { background: white; padding: 35px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .success-banner { background: linear-gradient(135deg, #00d084, #0a9c64); color: white; border-radius: 10px; padding: 20px; text-align: center; margin: 15px 0; }
            .info-box { background: white; border: 1px solid #e2e8f0; border-left: 4px solid #00d084; border-radius: 0 8px 8px 0; padding: 15px 20px; margin: 10px 0; }
            .info-box p { margin: 5px 0; }
            .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00d084, #0a9c64); color: white; text-decoration: none; border-radius: 30px; margin-top: 20px; font-weight: bold; }
            .footer { text-align: center; margin-top: 25px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🎉 Félicitations !</h1>
              <p>Votre inscription est confirmée — ReLAc 2026</p>
            </div>
            <div class="content">
              <h2>Bienvenue officiellement, ${data.nom} !</h2>
              <p>Nous avons le bonheur de vous accueillir à la <strong>ReLAc 2026</strong>. Que Dieu honore votre engagement !</p>

              <div class="success-banner">
                <div style="font-size:13px; opacity:0.9;">Votre matricule officiel</div>
                <div style="font-size:28px; font-weight:bold; letter-spacing:3px;">${data.matricule}</div>
              </div>

              <div class="info-box">
                <p><strong>🏠 Chambre assignée :</strong> ${data.room || 'À définir'}</p>
                <p><strong>🎓 Atelier :</strong> ${data.workshop || 'À définir'}</p>
                <p><strong>📍 Lieu :</strong> École La Bonté 3, Quartier Texaco, Lubumbashi</p>
                <p><strong>📅 Dates :</strong> Du 09 au 15 août 2026</p>
              </div>

              <p>Votre <strong>badge officiel</strong> est disponible dans votre espace participant. Pensez à le télécharger avant la retraite.</p>

              <div style="text-align:center;">
                <a href="${SITE_URL}/participant/${data.matricule}" class="button">Accéder à mon espace →</a>
              </div>

              <div class="footer">
                <p>Jeunesse JELOR — Logos-Rhema • ReLAc 2026 • ${FOOTER_DATE}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de validation envoyé à ${email}`);
  } catch (error) {
    // Erreur email non bloquante
    console.error('❌ Erreur envoi email (non critique):', error.message);
  }
};
