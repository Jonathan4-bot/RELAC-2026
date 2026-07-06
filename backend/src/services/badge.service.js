import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateBadge = async (participant) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: [3508, 2480], // A4 landscape at 300 DPI
        margin: 50
      });

      const badgesDir = path.join(__dirname, '../../uploads/badges');
      if (!fs.existsSync(badgesDir)) {
        fs.mkdirSync(badgesDir, { recursive: true });
      }

      const filename = `badge-${participant.matricule || participant.numero_dossier}.pdf`;
      const filepath = path.join(badgesDir, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Background gradient
      doc.rect(0, 0, 3508, 2480)
         .fillAndStroke('#17303b', '#17303b');

      // Decorative elements
      doc.rect(100, 100, 3308, 2280)
         .lineWidth(20)
         .strokeAndFill('#00d084', '#00d084');

      doc.rect(150, 150, 3208, 2180)
         .lineWidth(10)
         .strokeAndFill('#ffffff', '#ffffff');

      // Header
      doc.fontSize(80)
         .fill('#17303b')
         .text('RELAC 2026', 1754, 250, { align: 'center' });

      doc.fontSize(50)
         .fill('#666666')
         .text('Retraite du Libre Accès', 1754, 350, { align: 'center' });

      doc.fontSize(40)
         .fill('#00d084')
         .text('12ème Édition • Du 02 au 08 août 2026', 1754, 420, { align: 'center' });

      // Photo placeholder or actual photo
      const photoX = 300;
      const photoY = 600;
      const photoSize = 800;

      if (participant.photo_url) {
        try {
          const photoPath = path.join(__dirname, '../../', participant.photo_url);
          if (fs.existsSync(photoPath)) {
            doc.image(photoPath, photoX, photoY, { width: photoSize, height: photoSize });
          } else {
            // Placeholder if photo doesn't exist
            drawPhotoPlaceholder(doc, photoX, photoY, photoSize);
          }
        } catch (e) {
          drawPhotoPlaceholder(doc, photoX, photoY, photoSize);
        }
      } else {
        drawPhotoPlaceholder(doc, photoX, photoY, photoSize);
      }

      // Participant information
      const infoX = 1200;
      let infoY = 700;

      doc.fontSize(50)
         .fill('#17303b')
         .text('Nom complet:', infoX, infoY);
      
      infoY += 80;
      doc.fontSize(60)
         .fill('#000000')
         .text(`${participant.nom} ${participant.postnom || ''} ${participant.prenom}`, infoX, infoY);

      infoY += 120;
      doc.fontSize(50)
         .fill('#17303b')
         .text('Téléphone:', infoX, infoY);
      
      infoY += 80;
      doc.fontSize(60)
         .fill('#000000')
         .text(participant.telephone, infoX, infoY);

      infoY += 120;
      doc.fontSize(50)
         .fill('#17303b')
         .text('Matricule:', infoX, infoY);
      
      infoY += 80;
      doc.fontSize(70)
         .fill('#00d084')
         .font('Helvetica-Bold')
         .text(participant.matricule || 'En attente', infoX, infoY);

      // Assignment information
      const assignX = 1200;
      let assignY = 1400;

      doc.fontSize(50)
         .fill('#17303b')
         .text('Atelier:', assignX, assignY);
      
      assignY += 80;
      doc.fontSize(60)
         .fill('#000000')
         .text(participant.workshop_nom || 'Non assigné', assignX, assignY);

      assignY += 120;
      doc.fontSize(50)
         .fill('#17303b')
         .text('Chambre:', assignX, assignY);
      
      assignY += 80;
      doc.fontSize(60)
         .fill('#000000')
         .text(participant.room_nom || 'Non assigné', assignX, assignY);

      // Generate QR Code
      QRCode.toDataURL(participant.matricule || participant.numero_dossier, {
        width: 600,
        margin: 2,
        color: {
          dark: '#17303b',
          light: '#ffffff'
        }
      }, (err, url) => {
        if (err) {
          console.error('QR Code generation error:', err);
        } else {
          // Add QR code to PDF
          const qrBuffer = Buffer.from(url.split(',')[1], 'base64');
          doc.image(qrBuffer, 2600, 600, { width: 600, height: 600 });

          // QR Code label
          doc.fontSize(40)
             .fill('#17303b')
             .text('Scanner pour vérifier', 2900, 1250, { align: 'center' });

          // Footer
          doc.fontSize(35)
             .fill('#666666')
             .text('Jeunesse Logos-Rhema', 1754, 2000, { align: 'center' });

          doc.fontSize(30)
             .fill('#999999')
             .text('Ce badge est personnel et incessible', 1754, 2060, { align: 'center' });

          doc.end();

          stream.on('finish', () => {
            resolve(`/uploads/badges/${filename}`);
          });

          stream.on('error', (err) => {
            reject(err);
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

function drawPhotoPlaceholder(doc, x, y, size) {
  doc.rect(x, y, size, size)
     .fillAndStroke('#f0f0f0', '#cccccc');
  
  doc.fontSize(40)
     .fill('#999999')
     .text('Photo', x + size / 2, y + size / 2 - 20, { align: 'center', width: size });
}
