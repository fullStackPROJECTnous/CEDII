// frontend/services/PdfService.js
import jsPDF from 'jspdf';
//import pdfkit from 'pdfkit';
  // backend/services/pdfService.js
;

class PdfService {
  /**
   * Génère une facture PDF
   */
  generateInvoice(invoiceData) {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Logo ou nom de l'entreprise
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('CEDII - Centre d\'Échange, de Documentation et d\'Information', 105, 30, { align: 'center' });
    doc.text('Inter-Institutionnelles', 105, 36, { align: 'center' });
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);
    
    // Informations de la facture
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    // Numéro de facture et date
    doc.text(`Facture N°: ${invoiceData.numeroFacture || 'FACT-' + invoiceData.idLo}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 67);
    
    // Informations client
    doc.text('CLIENT:', 20, 80);
    doc.setFont(undefined, 'bold');
    doc.text(`${invoiceData.client.prenomCli} ${invoiceData.client.nomCli}`, 20, 87);
    doc.setFont(undefined, 'normal');
    doc.text(`Email: ${invoiceData.client.emailCli}`, 20, 94);
    doc.text(`Téléphone: ${invoiceData.client.telephoneCli}`, 20, 101);
    
    // Détails de la location
    doc.text('DÉTAILS DE LA LOCATION:', 20, 120);
    doc.text(`Type: ${invoiceData.typeLo}`, 20, 127);
    doc.text(`Période: Du ${new Date(invoiceData.debLo).toLocaleString('fr-FR')}`, 20, 134);
    doc.text(`Au ${new Date(invoiceData.finLo).toLocaleString('fr-FR')}`, 20, 141);
    
    if (invoiceData.materiel) {
      doc.text(`Matériel: ${invoiceData.materiel.designationMat}`, 20, 148);
      doc.text(`Quantité: ${invoiceData.qteMat || 1}`, 20, 155);
    }
    
    if (invoiceData.salle) {
      doc.text(`Salle: ${invoiceData.salle.nomSalle}`, 20, 148);
      doc.text(`Nombre de personnes: ${invoiceData.nbPersp || 'Non spécifié'}`, 20, 155);
    }
    
    // Montant
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`MONTANT TOTAL: ${parseFloat(invoiceData.tarifTot).toLocaleString('fr-FR')} Ar`, 20, 180);
    
    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Merci pour votre confiance!', 105, 280, { align: 'center' });
    doc.text('CEDII - Votre partenaire de confiance pour vos locations', 105, 285, { align: 'center' });
    
    return doc;
  }

   static async generateRetourPDF(data) {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('CONTRAT DE RETOUR DE MATÉRIEL', 105, 20, { align: 'center' });
    
    // Informations location
    doc.setFontSize(12);
    doc.text(`Location #${data.locationId}`, 20, 40);
    doc.text(`Client: ${data.client}`, 20, 50);
    doc.text(`Date retour: ${data.dateRetour}`, 20, 60);
    
    // Tableau des matériels
    const tableData = data.materiels.map(mat => [
      mat.codeMat,
      mat.designation,
      mat.quantiteRetournee,
      mat.etat,
      mat.etat === 'Endommagé' ? `${mat.coutReparation} Ar` : '-'
    ]);
    
    doc.autoTable({
      startY: 70,
      head: [['Code', 'Désignation', 'Qté', 'État', 'Coût réparation']],
      body: tableData,
      theme: 'grid'
    });
    
    // Résumé financier
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('RÉSUMÉ FINANCIER', 20, finalY);
    doc.text(`Pénalité retard (${data.joursRetard} jours): ${data.penaliteRetard} Ar`, 30, finalY + 10);
    doc.text(`Coût réparations: ${data.coutTotalReparation} Ar`, 30, finalY + 20);
    doc.text(`MONTANT TOTAL DÛ: ${data.montantTotal} Ar`, 30, finalY + 35);
    
    // Observations
    if (data.observations) {
      doc.text(`Observations: ${data.observations}`, 20, finalY + 50);
    }
    
    // Pied de page
    doc.text('Signature client:', 20, finalY + 70);
    doc.text('_________________________', 20, finalY + 80);
    doc.text('Signature responsable:', 120, finalY + 70);
    doc.text('_________________________', 120, finalY + 80);
    
    return doc.output('bloburl');
  }
}



/* generateInvoicePDF(invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // En-tête
      doc.fontSize(20).text('CEDII LOCATIONS', { align: 'center' });
      doc.fontSize(16).text('FACTURE', { align: 'center' });
      doc.moveDown();

      // Informations facture
      doc.fontSize(12);
      doc.text(`Numéro: ${invoiceData.numeroFacture}`);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`);
      doc.text(`Statut: ${invoiceData.statutPaie}`);
      doc.moveDown();

      // Informations client
      doc.text('CLIENT:');
      doc.text(`Nom: ${invoiceData.client}`);
      doc.text(`Email: ${invoiceData.emailCli}`);
      doc.text(`Téléphone: ${invoiceData.telephoneCli}`);
      doc.moveDown();

      // Détails location
      doc.text('DÉTAILS LOCATION:');
      doc.text(`Référence: #${invoiceData.idLo}`);
      doc.text(`Type: ${invoiceData.typeLo}`);
      doc.text(`Période: ${new Date(invoiceData.debLo).toLocaleDateString('fr-FR')} - ${new Date(invoiceData.finLo).toLocaleDateString('fr-FR')}`);
      doc.moveDown();

      // Montant
      doc.text(`MONTANT: ${parseFloat(invoiceData.montantPaie).toLocaleString('fr-FR')} Ar`, { align: 'right' });
      
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}*/



export default new PdfService();