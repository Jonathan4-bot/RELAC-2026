import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Participant } from '../models/participant.model.js';
import path from 'path';
import fs from 'fs';

export const exportToExcel = async (filters = {}) => {
  const participants = await Participant.findAll(filters);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Participants');

  // Define columns
  worksheet.columns = [
    { header: 'Matricule', key: 'matricule', width: 20 },
    { header: 'Numéro Dossier', key: 'numero_dossier', width: 30 },
    { header: 'Nom', key: 'nom', width: 20 },
    { header: 'Post-nom', key: 'postnom', width: 20 },
    { header: 'Prénom', key: 'prenom', width: 20 },
    { header: 'Sexe', key: 'sexe', width: 15 },
    { header: 'Date Naissance', key: 'date_naissance', width: 15 },
    { header: 'Téléphone', key: 'telephone', width: 20 },
    { header: 'WhatsApp', key: 'whatsapp', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Église', key: 'eglise', width: 30 },
    { header: 'Département', key: 'departement', width: 20 },
    { header: 'Fonction', key: 'fonction', width: 20 },
    { header: 'Atelier', key: 'workshop_nom', width: 20 },
    { header: 'Chambre', key: 'room_nom', width: 15 },
    { header: 'Statut Inscription', key: 'statut_inscription', width: 20 },
    { header: 'Statut Paiement', key: 'statut_paiement', width: 20 },
    { header: 'Mode Paiement', key: 'mode_paiement', width: 20 },
    { header: 'Référence Paiement', key: 'reference_paiement', width: 25 },
    { header: 'Date Inscription', key: 'date_inscription', width: 20 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00D084' }
  };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data
  participants.forEach(p => {
    worksheet.addRow({
      matricule: p.matricule || '',
      numero_dossier: p.numero_dossier,
      nom: p.nom,
      postnom: p.postnom || '',
      prenom: p.prenom,
      sexe: p.sexe,
      date_naissance: p.date_naissance,
      telephone: p.telephone,
      whatsapp: p.whatsapp || '',
      email: p.email || '',
      eglise: p.eglise || '',
      departement: p.departement || '',
      fonction: p.fonction || '',
      workshop_nom: p.workshop_nom || '',
      room_nom: p.room_nom || '',
      statut_inscription: p.statut_inscription,
      statut_paiement: p.statut_paiement,
      mode_paiement: p.mode_paiement || '',
      reference_paiement: p.reference_paiement || '',
      date_inscription: p.date_inscription,
    });
  });

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 10;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 5;
  });

  const exportsDir = path.join(process.cwd(), 'backend/uploads/exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const filename = `participants-${Date.now()}.xlsx`;
  const filepath = path.join(exportsDir, filename);

  await workbook.xlsx.writeFile(filepath);

  return `/uploads/exports/${filename}`;
};

export const exportToPDF = async (filters = {}) => {
  const participants = await Participant.findAll(filters);
  
  const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'portrait' });
  
  const exportsDir = path.join(process.cwd(), 'backend/uploads/exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const filename = `participants-${Date.now()}.pdf`;
  const filepath = path.join(exportsDir, filename);
  const stream = fs.createWriteStream(filepath);

  doc.pipe(stream);

  // Header
  doc.fontSize(20)
     .fill('#17303b')
     .text('Liste des Participants - RELAC 2026', { align: 'center' });

  doc.fontSize(12)
     .fill('#666666')
     .text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });

  doc.moveDown();

  // Table header
  const tableTop = doc.y;
  const headers = ['Matricule', 'Nom', 'Prénom', 'Sexe', 'Atelier', 'Chambre', 'Statut'];
  const columnWidths = [80, 80, 80, 40, 60, 50, 60];
  let xPos = 50;

  doc.fontSize(10).fill('#00d084');
  headers.forEach((header, i) => {
    doc.text(header, xPos, tableTop, { width: columnWidths[i] });
    xPos += columnWidths[i] + 10;
  });

  doc.moveDown();

  // Table rows
  doc.fontSize(9).fill('#333333');
  participants.forEach((p, index) => {
    if (doc.y > 700) {
      doc.addPage();
      doc.y = 50;
    }

    xPos = 50;
    const row = [
      p.matricule || '',
      p.nom,
      p.prenom,
      p.sexe,
      p.workshop_nom || '',
      p.room_nom || '',
      p.statut_inscription
    ];

    row.forEach((cell, i) => {
      doc.text(cell || '', xPos, doc.y, { width: columnWidths[i] });
      xPos += columnWidths[i] + 10;
    });

    doc.moveDown(0.5);
  });

  // Footer
  doc.fontSize(10)
     .fill('#999999')
    .text(`Total: ${participants.length} participants`, { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(`/uploads/exports/${filename}`));
    stream.on('error', reject);
  });
};
