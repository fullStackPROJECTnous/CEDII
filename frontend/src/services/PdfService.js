// frontend/services/PdfService.js
import jsPDF from 'jspdf';

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
}

export default new PdfService();