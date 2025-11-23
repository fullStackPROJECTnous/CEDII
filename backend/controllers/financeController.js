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
/**
 * Crée et envoie une facture
 */
exports.createAndSendInvoice = async (req, res) => {
  console.log('🔍 Début createAndSendInvoice');
  
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'miharinandrasana@gmail.com',
      pass: process.env.EMAIL_PASS || 'zpaa nrcm eqli jpqf'
    }
  });
  
  try {
    const { locationId, clientEmail } = req.body;
    console.log('📍 Données reçues:', { locationId, clientEmail });

    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId est requis'
      });
    }

    // 🔥 CORRECTION : Autoriser aussi les locations "En cours"
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
      WHERE l.idLo = ? AND l.etatLo IN ('Confirmée', 'En cours')
    `;

    const [locationData] = await sequelize.query(sqlCheckLocation, {
      replacements: [locationId],
      type: sequelize.QueryTypes.SELECT
    });

    if (!locationData) {
      return res.status(404).json({
        success: false,
        message: `Location ${locationId} non trouvée ou statut incorrect (doit être "Confirmée" ou "En cours")`
      });
    }

    console.log(`📍 Location trouvée: ${locationData.idLo} - Statut: ${locationData.etatLo}`);

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
        await sendInvoiceEmail(transporter, emailFinal, locationData, numeroFacture, montantTotal, joursRetard, penalite);
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

// 🔥 NOUVELLE MÉTHODE : Annuler un paiement
exports.cancelPayment = async (req, res) => {
    const paymentId = req.params.id;
    
    try {
        const [results, metadata] = await sequelize.query(
            `UPDATE paiement 
             SET statutPaie = 'Annulé' 
             WHERE idPaie = :id 
             AND statutPaie = 'En attente'`,
            {
                replacements: { id: paymentId },
                type: sequelize.QueryTypes.UPDATE
            }
        );

        if (metadata.affectedRows === 0) {
            return res.status(404).send({ 
                message: `Paiement ${paymentId} non trouvé ou déjà traité.` 
            });
        }
        
        res.status(200).send({ 
            message: `Paiement ${paymentId} annulé avec succès.` 
        });

    } catch (error) {
        console.error("Erreur cancelPayment:", error);
        res.status(500).send({ 
            message: "Échec de l'annulation du paiement.",
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
    from: process.env.EMAIL_USER || 'cediifia@gmail.com',
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

/**
 * Télécharge une facture PDF
 */exports.downloadInvoice = async (req, res) => {
  const { locationId } = req.params;

  try {
    console.log(`📍 Téléchargement facture pour location ${locationId}`);

    const sqlInvoiceData = `
      SELECT 
        p.numeroFacture, p.montantPaie, p.statutPaie,
        l.idLo, l.typeLo, l.debLo, l.finLo,
        CONCAT(c.nomCli, ' ', c.prenomCli) AS client
      FROM paiement p
      JOIN location l ON p.idLo = l.idLo
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      WHERE l.idLo = ?
      LIMIT 1
    `;

    const [invoiceData] = await sequelize.query(sqlInvoiceData, {
      replacements: [locationId],
      type: sequelize.QueryTypes.SELECT
    });

    if (!invoiceData) {
      return res.status(404).json({ 
        success: false, 
        message: "Aucune facture trouvée pour cette location" 
      });
    }

    // 🔥 CORRECTION SIMPLE : Texte formaté
    const factureContent = `
      FACTURE CEDII
      =============
      Numéro: ${invoiceData.numeroFacture}
      Client: ${invoiceData.client}
      Location: #${invoiceData.idLo} - ${invoiceData.typeLo}
      Période: ${new Date(invoiceData.debLo).toLocaleDateString('fr-FR')} au ${new Date(invoiceData.finLo).toLocaleDateString('fr-FR')}
      Montant: ${parseFloat(invoiceData.montantPaie || 0).toLocaleString('fr-FR')} Ar
      Statut: ${invoiceData.statutPaie}
      
      Merci pour votre confiance!
      CEDII Locations
    `;

    // 🔥 CORRECTION : Créer un blob côté client
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${invoiceData.numeroFacture}.txt"`);
    res.send(factureContent);

  } catch (error) {
    console.error("❌ Erreur téléchargement facture:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }1
};


/**
 * Télécharge une facture PDF pour les locations TERMINÉES ET PAYÉES
 */
exports.downloadPaidInvoice = async (req, res) => {
  const { locationId } = req.params;

  try {
    console.log(`📍 Téléchargement facture PAYÉE pour location ${locationId}`);

    const sqlInvoiceData = `
      SELECT 
        p.idPaie,
        p.numeroFacture,
        p.dateCre as dateFacturation,
        p.montantPaie,
        p.statutPaie,
        p.modePaie,
        l.idLo,
        l.typeLo,
        l.debLo,
        l.finLo,
        l.tarifTot,
        l.etatLo,
        c.idCli,
        c.nomCli,
        c.prenomCli,
        c.emailCli,
        c.telephoneCli,
        c.addresseCli,
        m.designationMat,
        m.codeMat,
        s.nomSalle,
        s.numeroSalle,
        DATEDIFF(CURDATE(), DATE(l.finLo)) AS joursRetard,
        CASE 
          WHEN l.finLo < CURDATE() AND p.statutPaie = 'Effectué' THEN 
            ROUND((DATEDIFF(CURDATE(), DATE(l.finLo)) * 0.02 * l.tarifTot), 2)
          ELSE 0 
        END AS penalite
      FROM paiement p
      JOIN location l ON p.idLo = l.idLo
      JOIN reservation r ON l.idRes = r.idRes
      JOIN client c ON r.idCli = c.idCli
      LEFT JOIN materiel m ON r.codeMat = m.codeMat
      LEFT JOIN salle s ON r.idSalle = s.idSalle
      WHERE l.idLo = ?
      AND p.statutPaie = 'Effectué'
      LIMIT 1
    `;

    const [invoiceData] = await sequelize.query(sqlInvoiceData, {
      replacements: [locationId],
      type: sequelize.QueryTypes.SELECT
    });

    if (!invoiceData) {
      return res.status(404).json({ 
        success: false, 
        message: "Aucune facture payée trouvée pour cette location" 
      });
    }

    console.log(`✅ Facture payée trouvée: ${invoiceData.numeroFacture}`);

    // Créer un PDF basique sans pdfkit
    const pdfBuffer = createSimplePDFBuffer(invoiceData);
    
    // Configurer les headers pour le téléchargement PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${invoiceData.numeroFacture}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Envoyer le PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error("❌ Erreur téléchargement facture payée:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération du PDF",
      error: error.message
    });
  }
};

/**
 * Crée un PDF basique sans dépendances externes
 */
function createSimplePDFBuffer(invoiceData) {
  // Créer un PDF très basique avec en-têtes corrects
  const pdfContent = `%PDF-1.4
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>
endobj
4 0 obj
<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>
endobj
5 0 obj
<</Length 800>>
stream
BT
/F1 12 Tf
50 750 Td (FACTURE CEDII LOCATIONS) Tj
0 -20 Td (========================) Tj
0 -20 Td (Numero: ${invoiceData.numeroFacture}) Tj
0 -15 Td (Date: ${new Date(invoiceData.dateFacturation).toLocaleDateString('fr-FR')}) Tj
0 -15 Td (Statut: ${invoiceData.statutPaie}) Tj
0 -15 Td (Mode paiement: ${invoiceData.modePaie || 'Non specifie'}) Tj
0 -30 Td (CLIENT:) Tj
0 -15 Td (${invoiceData.prenomCli} ${invoiceData.nomCli}) Tj
0 -15 Td (Email: ${invoiceData.emailCli || 'Non renseigne'}) Tj
0 -15 Td (Tel: ${invoiceData.telephoneCli || 'Non renseigne'}) Tj
0 -30 Td (LOCATION #${invoiceData.idLo}) Tj
0 -15 Td (Type: ${invoiceData.typeLo}) Tj
0 -15 Td (Du: ${new Date(invoiceData.debLo).toLocaleDateString('fr-FR')}) Tj
0 -15 Td (Au: ${new Date(invoiceData.finLo).toLocaleDateString('fr-FR')}) Tj
${invoiceData.designationMat ? `0 -15 Td (Materiel: ${invoiceData.designationMat}) Tj` : ''}
${invoiceData.nomSalle ? `0 -15 Td (Salle: ${invoiceData.nomSalle}) Tj` : ''}
0 -30 Td (MONTANT TOTAL:) Tj
0 -20 Td (${parseFloat(invoiceData.montantPaie || 0).toLocaleString('fr-FR')} Ar) Tj
0 -30 Td (Merci pour votre confiance!) Tj
0 -15 Td (CEDII Locations) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000234 00000 n
0000000315 00000 n
trailer
<</Size 6/Root 1 0 R>>
startxref
1125
%%EOF`;

  return Buffer.from(pdfContent, 'binary');
}
/**
 * Génère un PDF détaillé pour les factures payées
 */
function generateDetailedPDF(invoiceData) {
  const PDFDocument = require('pdfkit');
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    // Cette fonction sera appelée quand le PDF est généré
  });

  // ===== EN-TÊTE =====
  doc.fontSize(20)
     .font('Helvetica-Bold')
     .fillColor('#04058f')
     .text('CEDII LOCATIONS', 50, 50, { align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#5811ee')
     .text('FACTURE', 50, 75, { align: 'center' });
  
  doc.fontSize(10)
     .fillColor('#666666')
     .text('Centre d\'Échange, de Documentation et d\'Information Inter-Institutionnelles', 50, 95, { align: 'center' });

  // Ligne de séparation
  doc.moveTo(50, 120)
     .lineTo(550, 120)
     .strokeColor('#cccccc')
     .lineWidth(1)
     .stroke();

  // ===== INFORMATIONS FACTURE =====
  doc.fontSize(12)
     .fillColor('#333333')
     .font('Helvetica-Bold')
     .text('INFORMATIONS FACTURE:', 50, 140);
  
  doc.font('Helvetica')
     .text(`Numéro: ${invoiceData.numeroFacture}`, 50, 160);
  doc.text(`Date: ${new Date(invoiceData.dateFacturation).toLocaleDateString('fr-FR')}`, 50, 175);
  doc.text(`Statut: ${invoiceData.statutPaie}`, 50, 190);
  doc.text(`Mode de paiement: ${invoiceData.modePaie || 'Non spécifié'}`, 50, 205);

  // ===== INFORMATIONS CLIENT =====
  doc.font('Helvetica-Bold')
     .text('CLIENT:', 300, 140);
  
  doc.font('Helvetica')
     .text(`${invoiceData.prenomCli} ${invoiceData.nomCli}`, 300, 160);
  doc.text(`Email: ${invoiceData.emailCli || 'Non renseigné'}`, 300, 175);
  doc.text(`Téléphone: ${invoiceData.telephoneCli || 'Non renseigné'}`, 300, 190);
  
  if (invoiceData.addresseCli) {
    doc.text(`Adresse: ${invoiceData.addresseCli}`, 300, 205);
  }

  // Ligne de séparation
  doc.moveTo(50, 230)
     .lineTo(550, 230)
     .stroke();

  // ===== DÉTAILS LOCATION =====
  doc.font('Helvetica-Bold')
     .text('DÉTAILS DE LA LOCATION:', 50, 250);
  
  doc.font('Helvetica')
     .text(`Référence: #${invoiceData.idLo}`, 50, 270);
  doc.text(`Type: ${invoiceData.typeLo}`, 50, 285);
  doc.text(`Date début: ${new Date(invoiceData.debLo).toLocaleString('fr-FR')}`, 50, 300);
  doc.text(`Date fin: ${new Date(invoiceData.finLo).toLocaleString('fr-FR')}`, 50, 315);
  
  if (invoiceData.designationMat) {
    doc.text(`Matériel: ${invoiceData.designationMat}`, 50, 330);
    doc.text(`Code: ${invoiceData.codeMat}`, 50, 345);
  }
  
  if (invoiceData.nomSalle) {
    doc.text(`Salle: ${invoiceData.nomSalle} (${invoiceData.numeroSalle})`, 50, 330);
  }

  // ===== MONTANTS =====
  const startY = invoiceData.designationMat || invoiceData.nomSalle ? 370 : 350;
  
  doc.moveTo(50, startY)
     .lineTo(550, startY)
     .stroke();
  
  doc.font('Helvetica-Bold')
     .text('RÉCAPITULATIF DES MONTANTS:', 50, startY + 20);
  
  const montantLocation = parseFloat(invoiceData.tarifTot || 0);
  const penalite = parseFloat(invoiceData.penalite || 0);
  const montantTotal = parseFloat(invoiceData.montantPaie || 0);

  doc.font('Helvetica')
     .text(`Montant location:`, 50, startY + 45)
     .text(`${montantLocation.toLocaleString('fr-FR')} Ar`, 400, startY + 45, { align: 'right' });
  
  if (penalite > 0) {
    doc.text(`Pénalité de retard (${invoiceData.joursRetard} jours):`, 50, startY + 60)
       .text(`+ ${penalite.toLocaleString('fr-FR')} Ar`, 400, startY + 60, { align: 'right' });
  }

  doc.moveTo(50, startY + 80)
     .lineTo(550, startY + 80)
     .stroke();
  
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor('#28a745')
     .text('MONTANT TOTAL:', 50, startY + 95)
     .text(`${montantTotal.toLocaleString('fr-FR')} Ar`, 400, startY + 95, { align: 'right' });

  // ===== PIED DE PAGE =====
  const footerY = 650;
  
  doc.fontSize(8)
     .fillColor('#666666')
     .text('Merci pour votre confiance!', 50, footerY, { align: 'center' });
  
  doc.text('CEDII - Votre partenaire de confiance pour vos locations', 50, footerY + 15, { align: 'center' });
  doc.text('Contact: contact@cedii.com | Tél: +261 XX XX XXX XX', 50, footerY + 30, { align: 'center' });

  doc.end();

  return Buffer.concat(buffers);
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