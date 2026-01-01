// backend/services/emailService.js
const nodemailer = require('nodemailer');

/**
 * Crée et configure un transporteur email
 * @returns {Object} Transporteur nodemailer configuré
 */
function createTransporter() {
  console.log('📍 Configuration du transporteur email...');
  
  // Configuration pour Gmail
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'miharinandrasana@gmail.com',
      pass: process.env.EMAIL_PASS || 'zpaa nrcm eqli jpqf'
    }
  });

  // Vérification de la configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.error('❌ Erreur configuration email:', error);
    } else {
      console.log('✅ Serveur email prêt pour envoyer des messages');
    }
  });

  return transporter;
}

/**
 * Envoie un email de facture
 * @param {string} clientEmail - Email du destinataire
 * @param {Object} location - Données de la location
 * @param {string} pdfPath - Chemin vers le PDF (optionnel)
 */
async function sendInvoiceEmail(clientEmail, location, pdfPath = null) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'CEDII Locations',
        address: process.env.EMAIL_USER || 'cedii.locations@gmail.com'
      },
      to: clientEmail,
      subject: `Facture CEDII - Location #${location.idLo}`,
      html: generateInvoiceEmailTemplate(location),
      attachments: pdfPath ? [
        {
          filename: `facture-${location.idLo}.pdf`,
          path: pdfPath
        }
      ] : []
    };

    console.log(`📍 Envoi email à: ${clientEmail}`);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès:', result.messageId);
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

/**
 * Génère le template HTML pour l'email de facture
 * @param {Object} location - Données de la location
 * @returns {string} HTML de l'email
 */

/*
function generateInvoiceEmailTemplate(location) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
        }
        .header { 
          background: linear-gradient(135deg, #5811EE, #04058F); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0;
        }
        .content { 
          padding: 30px; 
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }
        .footer { 
          background: #343a40; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 0 0 10px 10px;
          font-size: 14px;
        }
        .invoice-details { 
          background: white; 
          border: 2px solid #5811EE; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .amount { 
          font-size: 24px; 
          color: #28a745; 
          font-weight: bold; 
          text-align: center;
          margin: 20px 0;
        }
        .badge {
          background: #5811EE;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table td {
          padding: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        table tr:last-child td {
          border-bottom: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏢 CEDII LOCATIONS</h1>
        <h2>VOTRE FACTURE</h2>
        <span class="badge">REF: #${location.idLo}</span>
      </div>
      
      <div class="content">
        <p>Cher client,</p>
        <p>Veuillez trouver les détails de votre facture pour la location effectuée.</p>
        
        <div class="invoice-details">
          <h3>📋 Détails de la location</h3>
          <table>
            <tr>
              <td><strong>Référence:</strong></td>
              <td>#${location.idLo}</td>
            </tr>
            <tr>
              <td><strong>Type:</strong></td>
              <td>${location.typeLo || 'Location'}</td>
            </tr>
            <tr>
              <td><strong>Date début:</strong></td>
              <td>${new Date(location.debLo).toLocaleDateString('fr-FR')} à ${new Date(location.debLo).toLocaleTimeString('fr-FR')}</td>
            </tr>
            <tr>
              <td><strong>Date fin:</strong></td>
              <td>${new Date(location.finLo).toLocaleDateString('fr-FR')} à ${new Date(location.finLo).toLocaleTimeString('fr-FR')}</td>
            </tr>
            <tr>
              <td><strong>Statut:</strong></td>
              <td><span style="color: #28a745; font-weight: bold;">● Facturé</span></td>
            </tr>
          </table>
          
          <div class="amount">
            💰 Montant total: ${(location.tarifTot || 0).toLocaleString('fr-FR')} Ar
          </div>
        </div>
        
        <p><strong>Informations de paiement:</strong></p>
        <p>• Paiement attendu sous 15 jours<br>
           • Mode de paiement: Virement bancaire ou espèces<br>
           • Contact: +261 XX XX XXX XX</p>
        
        <p>Cordialement,<br>
        <strong>L'équipe CEDII Locations</strong></p>
      </div>
      
      <div class="footer">
        <p>🏢 <strong>CEDII Locations</strong></p>
        <p>📧 contact@cedii.com | 📞 +261 XX XX XXX XX</p>
        <p>📍 Adresse: [Votre adresse]</p>
        <p style="font-size: 12px; opacity: 0.8;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    </body>
    </html>
  `;
}

*/
function generateInvoiceEmailTemplate(location) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
        }
        .header { 
          background: linear-gradient(135deg, #5811EE, #04058F); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0;
          position: relative;
        }
        .logo-container {
          position: absolute;
          top: 15px;
          left: 15px;
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 5px;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .content { 
          padding: 30px; 
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }
        .footer { 
          background: #343a40; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 0 0 10px 10px;
          font-size: 14px;
        }
        .invoice-details { 
          background: white; 
          border: 2px solid #5811EE; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .amount { 
          font-size: 24px; 
          color: #28a745; 
          font-weight: bold; 
          text-align: center;
          margin: 20px 0;
        }
        .badge {
          background: #5811EE;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table td {
          padding: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        table tr:last-child td {
          border-bottom: none;
        }
        .attachment-box {
          background: #e8f4ff;
          border-left: 4px solid #5811EE;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .attachment-icon {
          color: #5811EE;
          font-weight: bold;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <!-- Logo CEDII en haut à gauche -->
          <img src="/public/images/logo.jpg" alt="Logo CEDII" class="logo-img" 
               onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'color:#5811EE; font-weight:bold;\\'>CEDII</span>';">
        </div>
        <h1>🏢 CEDII LOCATIONS</h1>
        <h2>VOTRE FACTURE</h2>
        <span class="badge">REF: #${location.idLo}</span>
      </div>
      
      <div class="content">
        <p>Cher(e) ${location.prenomCli || 'Client'},</p>
        <p>Veuillez trouver ci-joint votre facture détaillée pour la location effectuée.</p>
        
        <!-- Boîte de notification pour la pièce jointe -->
        <div class="attachment-box">
          <p><span class="attachment-icon">📎</span> <strong>Pièce jointe :</strong> 
          Facture_${location.numeroFacture || location.idLo}.pdf</p>
          <p style="font-size: 14px; margin-top: 5px;">
            Cette facture contient tous les détails de votre location, le récapitulatif des montants 
            et les informations de paiement. Veuillez trouver le PDF en pièce jointe de cet email.
          </p>
        </div>
        
        <div class="invoice-details">
          <h3>📋 Récapitulatif de la location</h3>
          <table>
            <tr>
              <td><strong>Numéro de facture:</strong></td>
              <td>${location.numeroFacture || 'N/A'}</td>
            </tr>
            <tr>
              <td><strong>Référence location:</strong></td>
              <td>#${location.idLo}</td>
            </tr>
            <tr>
              <td><strong>Type:</strong></td>
              <td>${location.typeLo || 'Location'}</td>
            </tr>
            <tr>
              <td><strong>Date début:</strong></td>
              <td>${new Date(location.debLo).toLocaleDateString('fr-FR')} à ${new Date(location.debLo).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</td>
            </tr>
            <tr>
              <td><strong>Date fin:</strong></td>
              <td>${new Date(location.finLo).toLocaleDateString('fr-FR')} à ${new Date(location.finLo).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</td>
            </tr>
            <tr>
              <td><strong>Statut:</strong></td>
              <td><span style="color: #28a745; font-weight: bold;">● Facturé</span></td>
            </tr>
          </table>
          
          <div class="amount">
            💰 Montant total: ${(location.tarifTot || 0).toLocaleString('fr-FR')} Ar
          </div>
        </div>
        
        <p><strong>Informations de paiement:</strong></p>
        <p>• Paiement attendu sous 15 jours<br>
           • Mode de paiement: Virement bancaire ou espèces<br>
           • Contact: +261 34 05 120 30</p>
        
        <p>Cordialement,<br>
        <strong>L'équipe CEDII Locations</strong></p>
      </div>
      
      <div class="footer">
        <p>🏢 <strong>CEDII Locations</strong></p>
        <p>📧 contact@cedii.mg | 📞 +261 34 05 120 30</p>
        <p>📍 Lot IVH 32 Ter Amboditsiry, Fianarantsoa 301 - Madagascar</p>
        <p style="font-size: 12px; opacity: 0.8;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envoie un email de test
 */
async function sendTestEmail() {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'CEDII Locations - Test',
        address: process.env.EMAIL_USER
      },
      to: process.env.EMAIL_USER,
      subject: '🎉 Test Email CEDII Locations',
      html: `
        <h1>Test réussi !</h1>
        <p>Votre configuration email fonctionne correctement.</p>
        <p>🕒 ${new Date().toLocaleString('fr-FR')}</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de test envoyé:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('❌ Erreur email test:', error);
    throw error;
  }
}

module.exports = {
  createTransporter,
  sendInvoiceEmail,
  sendTestEmail,
  generateInvoiceEmailTemplate
};