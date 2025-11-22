const db = require('../models');
const { Op } = require('sequelize');
const sequelize = db.sequelize;

const nodemailer = require('nodemailer');

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'miharinandrasana@gmail.com',
    pass: process.env.EMAIL_PASS || 'zpaa nrcm eqli jpqf'
  }
});

// =========================================================================
// FONCTIONS PRINCIPALES
// =========================================================================

/**
 * Tableau de bord financier
 */
exports.getFinanceDashboardData = async (req, res) => {
  try {
    const stats = await getUpdatedDashboardStats();
    
    const sqlMonthlyRevenue = `
      SELECT
        DATE_FORMAT(p.dateCre, '%Y-%m') AS mois,
        SUM(p.montantPaie) AS revenus
      FROM paiement p
      WHERE p.statutPaie = 'Effectué'
      AND p.dateCre >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(p.dateCre, '%Y-%m')
      ORDER BY mois ASC
    `;

    const monthlyRevenue = await sequelize.query(sqlMonthlyRevenue, {
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).send({
      ...stats,
      monthlyRevenue: monthlyRevenue,
      currency: 'Ar'
    });

  } catch (error) {
    console.error("Erreur getFinanceDashboardData:", error);
    res.status(500).send({ message: "Erreur dashboard financier" });
  }
};

/**
 * Récupère les locations confirmées à facturer
 */
exports.getConfirmedLocationsToInvoice = async (req, res) => {
  try {
    const sqlConfirmedLocations = `
      SELECT 
        l.idLo,
        l.idRes,
        l.debLo,
        l.finLo,
        l.typeLo,
        l.tarifTot,
        l.etatLo,
        l.qteMat,
        l.nbPersp,
        c.idCli,
        c.nomCli,
        c.prenomCli,
        c.emailCli,
        c.telephoneCli,
        r.typeRes,
        m.codeMat,
        m.designationMat,
        s.idSalle,
        s.nomSalle,
        DATEDIFF(CURDATE(), DATE(l.finLo)) AS joursRetard,
        CASE 
          WHEN l.finLo < CURDATE() AND l.etatLo = 'Confirmée' THEN 'En retard'
          ELSE 'À facturer'
        END AS statutFacturation
      FROM location l
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      LEFT JOIN materiel m ON r.codeMat = m.codeMat
      LEFT JOIN salle s ON r.idSalle = s.idSalle
      WHERE l.etatLo = 'Confirmée'
      AND l.idLo NOT IN (SELECT idLo FROM paiement WHERE statutPaie = 'Effectué')
      ORDER BY l.debLo ASC;
    `;

    const confirmedLocations = await sequelize.query(sqlConfirmedLocations, { 
      type: sequelize.QueryTypes.SELECT 
    });

    res.status(200).send(confirmedLocations);

  } catch (error) {
    console.error("Erreur getConfirmedLocationsToInvoice:", error);
    res.status(500).send({ 
      message: "Échec de la récupération des locations",
      error: error.message 
    });
  }
};

/**
 * Crée et envoie une facture
 */
exports.createAndSendInvoice = async (req, res) => {
  console.log('🔍 Début createAndSendInvoice');
  
  try {
    const { locationId, clientEmail } = req.body;
    console.log('📍 Données reçues:', { locationId, clientEmail });

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId est requis'
      });
    }

    // 1. Vérifier que la location existe et est confirmée
    const sqlCheckLocation = `
      SELECT 
        l.idLo, l.etatLo, l.tarifTot, l.typeLo, l.debLo, l.finLo,
        c.nomCli, c.prenomCli, c.emailCli,
        r.idRes,
        m.designationMat,
        s.nomSalle
      FROM location l
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      LEFT JOIN materiel m ON r.codeMat = m.codeMat
      LEFT JOIN salle s ON r.idSalle = s.idSalle
      WHERE l.idLo = ? AND l.etatLo = 'Confirmée'
    `;

    const [locationData] = await sequelize.query(sqlCheckLocation, {
      replacements: [locationId],
      type: sequelize.QueryTypes.SELECT
    });

    if (!locationData) {
      return res.status(404).json({
        success: false,
        message: `Location ${locationId} non trouvée ou non confirmée`
      });
    }

    // 2. Calculer les pénalités si la location est en retard
    const finLocation = new Date(locationData.finLo);
    const aujourdhui = new Date();
    const joursRetard = Math.max(0, Math.floor((aujourdhui - finLocation) / (1000 * 60 * 60 * 24)));
    const tauxPenalite = 0.02;
    const penalite = joursRetard * tauxPenalite * parseFloat(locationData.tarifTot);
    const montantTotal = parseFloat(locationData.tarifTot) + penalite;

    // 3. Générer numéro de facture
    const annee = new Date().getFullYear();
    const [lastInvoice] = await sequelize.query(
      `SELECT numeroFacture FROM paiement WHERE numeroFacture LIKE ? ORDER BY idPaie DESC LIMIT 1`,
      {
        replacements: [`FACT-${annee}-%`],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let numeroFacture = `FACT-${annee}-0001`;
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.numeroFacture.split('-').pop());
      numeroFacture = `FACT-${annee}-${(lastNumber + 1).toString().padStart(4, '0')}`;
    }

    // 4. Créer le paiement/facture
    const sqlInsertPaiement = `
      INSERT INTO paiement 
      (idLo, numeroFacture, dateCre, montantPaie, statutPaie, libellePaie, emailEnvoye)
      VALUES (?, ?, NOW(), ?, 'En attente', ?, FALSE)
    `;

    await sequelize.query(sqlInsertPaiement, {
      replacements: [
        locationId,
        numeroFacture,
        montantTotal,
        `Location ${locationData.typeLo} - ${locationData.designationMat || locationData.nomSalle}`
      ]
    });

    // 5. Mettre à jour le statut de la location
    await sequelize.query(
      `UPDATE location SET etatLo = 'Terminée' WHERE idLo = ?`,
      { replacements: [locationId] }
    );

    // 6. Envoyer l'email si email fourni
    const emailFinal = clientEmail || locationData.emailCli;
    let emailEnvoye = false;

    if (emailFinal) {
      try {
        await sendInvoiceEmail(emailFinal, locationData, numeroFacture, montantTotal, joursRetard, penalite);
        emailEnvoye = true;
        
        await sequelize.query(
          `UPDATE paiement SET emailEnvoye = TRUE, dateEnvoiEmail = NOW() WHERE numeroFacture = ?`,
          { replacements: [numeroFacture] }
        );

        await sequelize.query(
          `INSERT INTO historique_email (idPaie, dateEnvoi, destinataire, sujet, statutEnvoi)
           SELECT idPaie, NOW(), ?, 'Facture Location', 'succes'
           FROM paiement WHERE numeroFacture = ?`,
          { 
            replacements: [emailFinal, numeroFacture] 
          }
        );

      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError);
        
        await sequelize.query(
          `INSERT INTO historique_email (idPaie, dateEnvoi, destinataire, sujet, statutEnvoi, erreurMessage)
           SELECT idPaie, NOW(), ?, 'Facture Location', 'echec', ?
           FROM paiement WHERE numeroFacture = ?`,
          { 
            replacements: [emailFinal, emailError.message, numeroFacture] 
          }
        );
      }
    }

    // 7. Récupérer les stats mises à jour
    const updatedStats = await getUpdatedDashboardStats();

    res.json({
      success: true,
      message: 'Facture créée avec succès' + (emailEnvoye ? ' et email envoyé' : ''),
      invoiceNumber: numeroFacture,
      locationId: locationId,
      montantTotal: montantTotal,
      joursRetard: joursRetard,
      penalite: penalite,
      emailEnvoye: emailEnvoye,
      newStats: updatedStats
    });

  } catch (error) {
    console.error('❌ ERREUR createAndSendInvoice:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Calcule les pénalités pour les locations en retard
 */
exports.calculatePenalties = async (req, res) => {
  try {
    const sqlLocationsEnRetard = `
      SELECT 
        l.idLo,
        l.tarifTot,
        l.finLo,
        l.etatLo,
        c.nomCli,
        c.prenomCli,
        c.emailCli,
        DATEDIFF(CURDATE(), DATE(l.finLo)) AS joursRetard,
        p.statutPaie
      FROM location l
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      LEFT JOIN paiement p ON l.idLo = p.idLo AND p.statutPaie = 'Effectué'
      WHERE l.finLo < CURDATE()
      AND l.etatLo = 'Confirmée'
      AND p.idPaie IS NULL
      AND DATEDIFF(CURDATE(), DATE(l.finLo)) > 0
      ORDER BY l.finLo ASC
    `;

    const locationsEnRetard = await sequelize.query(sqlLocationsEnRetard, {
      type: sequelize.QueryTypes.SELECT
    });

    const penalties = locationsEnRetard.map(location => {
      const tauxPenalite = 0.02;
      const penalite = location.joursRetard * tauxPenalite * parseFloat(location.tarifTot);
      const totalDu = parseFloat(location.tarifTot) + penalite;

      return {
        locationId: location.idLo,
        client: `${location.prenomCli} ${location.nomCli}`,
        email: location.emailCli,
        dateFin: location.finLo,
        joursRetard: location.joursRetard,
        montantBase: parseFloat(location.tarifTot),
        penalite: penalite,
        totalDu: totalDu,
        statut: 'En retard'
      };
    });

    res.status(200).send(penalties);

  } catch (error) {
    console.error("Erreur calculatePenalties:", error);
    res.status(500).send({ message: "Erreur calcul pénalités" });
  }
};

/**
 * Envoie les notifications de pénalités
 */
exports.sendPenaltyNotifications = async (req, res) => {
  try {
    const penalties = await this.calculatePenalties();
    
    let notificationsEnvoyees = 0;
    let erreurs = 0;

    for (const penalty of penalties) {
      try {
        await sendPenaltyEmail(penalty);
        notificationsEnvoyees++;
        
        await sequelize.query(
          `INSERT INTO historique_email (idPaie, dateEnvoi, destinataire, sujet, statutEnvoi)
           SELECT p.idPaie, NOW(), ?, 'Notification Pénalité', 'succes'
           FROM paiement p WHERE p.idLo = ? LIMIT 1`,
          { 
            replacements: [penalty.email, penalty.locationId] 
          }
        );

      } catch (emailError) {
        console.error(`❌ Erreur notification pour ${penalty.email}:`, emailError);
        erreurs++;
        
        await sequelize.query(
          `INSERT INTO historique_email (idPaie, dateEnvoi, destinataire, sujet, statutEnvoi, erreurMessage)
           SELECT p.idPaie, NOW(), ?, 'Notification Pénalité', 'echec', ?
           FROM paiement p WHERE p.idLo = ? LIMIT 1`,
          { 
            replacements: [penalty.email, emailError.message, penalty.locationId] 
          }
        );
      }
    }
    
    res.status(200).send({ 
      success: true,
      message: `Notifications envoyées: ${notificationsEnvoyees} succès, ${erreurs} échecs`,
      notificationsEnvoyees,
      erreurs
    });

  } catch (error) {
    console.error("Erreur sendPenaltyNotifications:", error);
    res.status(500).send({ 
      success: false,
      message: "Erreur envoi notifications" 
    });
  }
};

/**
 * Récupère les données de paiement
 */
exports.getPaymentData = async (req, res) => {
  try {
    const sqlPendingPaymentsDetails = `
      SELECT 
        p.idPaie,
        p.numeroFacture,
        p.dateCre,
        p.modePaie,
        p.montantPaie,
        p.statutPaie,
        p.libellePaie,
        c.nomCli,
        c.prenomCli,
        c.emailCli,
        l.idLo
      FROM paiement p
      JOIN location l ON p.idLo = l.idLo
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      WHERE p.statutPaie = 'En attente'
      ORDER BY p.dateCre DESC;
    `;
    
    const pendingPayments = await sequelize.query(sqlPendingPaymentsDetails, { 
      type: sequelize.QueryTypes.SELECT 
    });

    const sqlValidatedPaymentsDetails = `
      SELECT 
        p.idPaie,
        p.numeroFacture,
        p.dateCre,
        p.modePaie,
        p.montantPaie,
        p.statutPaie,
        p.libellePaie,
        c.nomCli,
        c.prenomCli,
        c.emailCli,
        l.idLo
      FROM paiement p
      JOIN location l ON p.idLo = l.idLo
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      WHERE p.statutPaie = 'Effectué'
      ORDER BY p.dateCre DESC;
    `;
    
    const validatedPayments = await sequelize.query(sqlValidatedPaymentsDetails, { 
      type: sequelize.QueryTypes.SELECT 
    });

    res.status(200).send({
      success: true,
      pendingPayments,
      validatedPayments
    });

  } catch (error) {
    console.error("Erreur getPaymentData:", error);
    res.status(500).send({ 
      success: false,
      message: "Erreur récupération données paiement",
      error: error.message 
    });
  }
};

/**
 * Valide un paiement
 */
exports.validatePayment = async (req, res) => {
  const paymentId = req.params.id;
  
  try {
    const [results, metadata] = await sequelize.query(
      `UPDATE paiement 
       SET statutPaie = 'Effectué' 
       WHERE idPaie = :id 
       AND statutPaie = 'En attente'`,
      {
        replacements: { id: paymentId },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    if (metadata.affectedRows === 0) {
      return res.status(404).send({ 
        message: `Paiement ${paymentId} non trouvé ou déjà validé.` 
      });
    }
    
    res.status(200).send({ 
      message: `Paiement ${paymentId} validé avec succès.` 
    });

  } catch (error) {
    console.error("Erreur validatePayment:", error);
    res.status(500).send({ 
      message: "Échec de la validation du paiement.",
      error: error.message
    });
  }
};

/**
 * Télécharge une facture PDF
 */
exports.downloadInvoice = async (req, res) => {
  const { locationId } = req.params;

  try {
    const sqlInvoiceData = `
      SELECT 
        p.numeroFacture,
        p.dateCre,
        p.montantPaie,
        p.statutPaie,
        l.idLo,
        l.typeLo,
        l.debLo,
        l.finLo,
        CONCAT(c.nomCli, ' ', c.prenomCli) AS client,
        c.emailCli,
        c.telephoneCli,
        m.designationMat,
        s.nomSalle,
        DATEDIFF(CURDATE(), DATE(l.finLo)) AS joursRetard
      FROM paiement p
      JOIN location l ON p.idLo = l.idLo
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      LEFT JOIN materiel m ON r.codeMat = m.codeMat
      LEFT JOIN salle s ON r.idSalle = s.idSalle
      WHERE l.idLo = ?
    `;

    const [invoiceData] = await sequelize.query(sqlInvoiceData, {
      replacements: [locationId],
      type: sequelize.QueryTypes.SELECT
    });

    if (!invoiceData) {
      return res.status(404).send({ message: "Facture non trouvée" });
    }

    const pdfContent = generatePDFContent(invoiceData);
    const pdfBuffer = Buffer.from(pdfContent, 'utf-8');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facture-${invoiceData.numeroFacture}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Erreur downloadInvoice:", error);
    res.status(500).send({ message: "Erreur téléchargement facture" });
  }
};

/**
 * Cashflow synthèse
 */
exports.getCashflowSynthese = async (req, res) => {
  console.log('=== DÉBUT getCashflowSynthese ===');
  
  try {
    const sqlRevenus = `
      SELECT COALESCE(SUM(montantPaie), 0) AS totalRevenus
      FROM paiement
      WHERE statutPaie = 'Effectué';
    `;
    const [revenusResult] = await sequelize.query(sqlRevenus, { 
      type: sequelize.QueryTypes.SELECT 
    });

    const sqlDepenses = `
      SELECT COALESCE(SUM(tarifTot), 0) AS totalDepenses
      FROM location
      WHERE etatLo = 'Terminée'
      AND idLo NOT IN (SELECT idLo FROM paiement WHERE statutPaie = 'Effectué');
    `;
    const [depensesResult] = await sequelize.query(sqlDepenses, { 
      type: sequelize.QueryTypes.SELECT 
    });

    const totalRevenus = parseFloat(revenusResult.totalRevenus) || 0;
    const totalDepenses = parseFloat(depensesResult.totalDepenses) || 0;
    const soldeNet = totalRevenus - totalDepenses;
    const tauxEpargne = totalRevenus > 0 ? ((soldeNet / totalRevenus) * 100).toFixed(1) : 0;

    const response = {
      kpis: {
        totalRevenus: totalRevenus,
        totalDepenses: totalDepenses,
        soldeNet: soldeNet,
        tauxEpargne: tauxEpargne + '%'
      },
      graphiques: {
        evolution: [],
        repartitionRevenus: []
      }
    };

    console.log('✅ getCashflowSynthese terminé avec succès');
    res.status(200).send(response);

  } catch (error) {
    console.error('❌ ERREUR getCashflowSynthese:', error);
    
    const responseSecours = {
      kpis: {
        totalRevenus: 150000,
        totalDepenses: 45000,
        soldeNet: 105000,
        tauxEpargne: '70.0%'
      },
      graphiques: {
        evolution: [],
        repartitionRevenus: []
      },
      message: "Données de démonstration - Mode secours activé"
    };
    
    res.status(200).send(responseSecours);
  }
};

// =========================================================================
// FONCTIONS UTILITAIRES
// =========================================================================

async function getUpdatedDashboardStats() {
  try {
    const [confirmedCount] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM location l
      WHERE l.etatLo = 'Confirmée'
      AND l.idLo NOT IN (SELECT idLo FROM paiement WHERE statutPaie = 'Effectué')
    `, { type: sequelize.QueryTypes.SELECT });

    const [invoicesSentCount] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM paiement 
      WHERE emailEnvoye = TRUE
    `, { type: sequelize.QueryTypes.SELECT });

    const [revenueData] = await sequelize.query(`
      SELECT COALESCE(SUM(montantPaie), 0) as totalRevenue
      FROM paiement 
      WHERE statutPaie = 'Effectué'
    `, { type: sequelize.QueryTypes.SELECT });

    const [pendingData] = await sequelize.query(`
      SELECT 
        COUNT(*) as pendingCount,
        COALESCE(SUM(montantPaie), 0) as pendingAmount
      FROM paiement 
      WHERE statutPaie = 'En attente'
    `, { type: sequelize.QueryTypes.SELECT });

    const [overdueCount] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM location l
      WHERE l.finLo < CURDATE()
      AND l.etatLo = 'Confirmée'
      AND l.idLo NOT IN (SELECT idLo FROM paiement WHERE statutPaie = 'Effectué')
    `, { type: sequelize.QueryTypes.SELECT });

    return {
      confirmedLocationsCount: parseInt(confirmedCount?.count) || 0,
      invoicesSentCount: parseInt(invoicesSentCount?.count) || 0,
      totalRevenue: parseFloat(revenueData?.totalRevenue) || 0,
      pendingPaymentsCount: parseInt(pendingData?.pendingCount) || 0,
      pendingAmount: parseFloat(pendingData?.pendingAmount) || 0,
      overdueLocationsCount: parseInt(overdueCount?.count) || 0
    };

  } catch (error) {
    console.error("Erreur getUpdatedDashboardStats:", error);
    return {
      confirmedLocationsCount: 0,
      invoicesSentCount: 0,
      totalRevenue: 0,
      pendingPaymentsCount: 0,
      pendingAmount: 0,
      overdueLocationsCount: 0
    };
  }
}

async function sendInvoiceEmail(email, locationData, numeroFacture, montantTotal, joursRetard, penalite) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'cedii.locations@gmail.com',
    to: email,
    subject: `Facture ${numeroFacture} - CEDII Locations`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5811EE 0%, #04058F 100%); color: white; padding: 20px; text-align: center;">
          <h1>CEDII LOCATIONS</h1>
          <h2>FACTURE ${numeroFacture}</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Bonjour ${locationData.prenomCli} ${locationData.nomCli},</p>
          <p>Veuillez trouver ci-joint votre facture pour la location suivante :</p>
          
          <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 8px;">
            <h3 style="color: #5811EE;">Détails de la location</h3>
            <p><strong>Référence:</strong> #${locationData.idLo}</p>
            <p><strong>Type:</strong> ${locationData.typeLo}</p>
            <p><strong>Désignation:</strong> ${locationData.designationMat || locationData.nomSalle || 'Non spécifié'}</p>
            <p><strong>Date début:</strong> ${new Date(locationData.debLo).toLocaleDateString('fr-FR')}</p>
            <p><strong>Date fin:</strong> ${new Date(locationData.finLo).toLocaleDateString('fr-FR')}</p>
            ${joursRetard > 0 ? `
              <p><strong>Jours de retard:</strong> ${joursRetard} jours</p>
              <p><strong>Pénalité de retard:</strong> ${penalite.toFixed(2)} Ar</p>
            ` : ''}
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
            <h3 style="color: #28a745; margin: 0;">
              MONTANT TOTAL: ${parseFloat(montantTotal).toLocaleString('fr-FR')} Ar
            </h3>
          </div>
          
          <p style="margin-top: 20px;">
            Veuillez procéder au paiement selon les modalités convenues.
          </p>
          
          <p>Cordialement,<br>
          <strong>L'équipe CEDII Locations</strong></p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

async function sendPenaltyEmail(penalty) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'cedii.locations@gmail.com',
    to: penalty.email,
    subject: `⚠️ Notification de pénalité - Location #${penalty.locationId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffc107; color: #856404; padding: 20px; text-align: center;">
          <h1>⚠️ NOTIFICATION DE PÉNALITÉ</h1>
          <h2>CEDII LOCATIONS</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Bonjour ${penalty.client},</p>
          <p>Nous vous informons que votre location #${penalty.locationId} est en retard de paiement.</p>
          
          <div style="border: 2px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 8px;">
            <h3 style="color: #856404;">Détails de la pénalité</h3>
            <p><strong>Jours de retard:</strong> ${penalty.joursRetard} jours</p>
            <p><strong>Montant initial:</strong> ${penalty.montantBase.toLocaleString('fr-FR')} Ar</p>
            <p><strong>Pénalité de retard (2%/jour):</strong> ${penalty.penalite.toFixed(2)} Ar</p>
            <p><strong>Nouveau total dû:</strong> ${penalty.totalDu.toLocaleString('fr-FR')} Ar</p>
          </div>
          
          <p style="color: #dc3545;">
            <strong>Attention:</strong> Le montant dû augmentera chaque jour supplémentaire de retard.
          </p>
          
          <p>Veuillez régulariser votre situation au plus vite.</p>
          
          <p>Cordialement,<br>
          <strong>Service Financier CEDII</strong></p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

function generatePDFContent(invoiceData) {
  return `
    FACTURE CEDII
    =============
    
    Numéro: ${invoiceData.numeroFacture}
    Date: ${new Date(invoiceData.dateCre).toLocaleDateString('fr-FR')}
    
    CLIENT:
    ${invoiceData.client}
    ${invoiceData.emailCli}
    ${invoiceData.telephoneCli}
    
    DÉTAILS LOCATION:
    Référence: #${invoiceData.idLo}
    Type: ${invoiceData.typeLo}
    Période: ${new Date(invoiceData.debLo).toLocaleDateString('fr-FR')} 
             au ${new Date(invoiceData.finLo).toLocaleDateString('fr-FR')}
    ${invoiceData.designationMat ? `Matériel: ${invoiceData.designationMat}` : ''}
    ${invoiceData.nomSalle ? `Salle: ${invoiceData.nomSalle}` : ''}
    
    MONTANTS:
    Montant location: ${parseFloat(invoiceData.montantPaie).toLocaleString('fr-FR')} Ar
    ${invoiceData.joursRetard > 0 ? `Jours retard: ${invoiceData.joursRetard}` : ''}
    
    STATUT: ${invoiceData.statutPaie}
    
    Merci pour votre confiance!
    CEDII - Centre d'Échange, de Documentation et d'Information Inter-Institutionnelles
  `;
}

// Fonctions simplifiées pour les routes manquantes
exports.getFacturationData = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.sendPaymentReminder = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.generateInvoices = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.sendInvoice = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.exportInvoices = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.getPaymentHistory = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.getLitigationCount = async (req, res) => {
  res.status(200).send({ count: 0 });
};

exports.getPenalitesData = async (req, res) => {
  res.status(200).send([]);
};

exports.getMonthlyRevenueTrend = async (req, res) => {
  res.status(200).send([]);
};

exports.getRapportsSyntheseData = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};

exports.createInvoiceFromLocation = async (req, res) => {
  res.status(200).send({ message: "Fonction en développement" });
};