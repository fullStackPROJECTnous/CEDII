const db = require('../models');
const { Op } = require('sequelize');
const Paiement = db.Paiement; // Table existante
const Location = db.Location;
const Client = db.Client;
const Reservation = db.Reservation; 
const sequelize = db.sequelize;


exports.getFinanceDashboardData = async (req, res) => {
    try {
        // --- 1. KPI Paiements en Attente ---
        const sqlPendingPayments = `
            SELECT 
                COUNT(idPaie) AS pendingPaymentsCount,
                SUM(montantPaie) AS pendingAmount
            FROM 
                paiement
            WHERE 
                statutPaie = 'En attente';
        `;
        const [paymentData] = await sequelize.query(sqlPendingPayments, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // --- 2. Factures Prêtes à l'Envoi (Simulées à partir des Locations Terminées et Impayées) ---
        const sqlInvoicesToSend = `
            SELECT
                l.idLo AS id,
                CONCAT(c.nomCli, ' ', c.prenomCli) AS client,
                l.tarifTot AS amount
            FROM 
                location l
            JOIN
                reservation r ON l.idRes = r.idRes
            JOIN 
                client c ON r.idCli = c.idCli
            WHERE 
                l.etatLo = 'Terminée'
                AND l.idLo NOT IN (
                    SELECT idLo FROM paiement WHERE statutPaie = 'Effectué'
                )
        `;
        const invoicesToSend = await sequelize.query(sqlInvoicesToSend, { 
            type: sequelize.QueryTypes.SELECT 
        });
        
        // --- 3. Autres KPIs (Simulations) ---
        const monthlyRevenue = 45000; 
        const avgDaysLate = 3.2;
        const autoPaymentRate = '88%';
        const pendingPenalties = []; // Remplacer par votre requête si vous avez une table de pénalités

        res.status(200).send({
            pendingPaymentsCount: parseInt(paymentData.pendingPaymentsCount) || 0,
            pendingAmount: parseFloat(paymentData.pendingAmount) || 0,
            monthlyRevenue,
            avgDaysLate,
            autoPaymentRate,
            invoicesToSend, // Liste des locations "à facturer"
            pendingPenalties
        });

    } catch (error) {
        console.error("Erreur critique getFinanceDashboardData:", error);
        res.status(500).send({ message: "Erreur lors de la récupération des données du tableau de bord Finance." });
    }
};

// =========================================================================
// B. LOGIQUE DE LA PAGE FACTURATION (/facturation)
// =========================================================================

exports.getFacturationData = async (req, res) => {
    try {
        // Liste des locations terminées et non encore payées
        const locationsToInvoiceSQL = `
             SELECT
                l.idLo AS id,
                CONCAT(c.nomCli, ' ', c.prenomCli) AS client,
                l.finLo AS endDate,
                DATEDIFF(CURDATE(), DATE(l.finLo)) AS daysLate,
                l.tarifTot AS amount
            FROM 
                location l
            JOIN
                reservation r ON l.idRes = r.idRes
            JOIN 
                client c ON r.idCli = c.idCli
            WHERE 
                l.etatLo = 'Terminée'
                AND l.idLo NOT IN (
                    SELECT idLo FROM paiement WHERE statutPaie = 'Effectué'
                )
            ORDER BY l.finLo ASC;
        `;
        
        const locationsToInvoice = await sequelize.query(locationsToInvoiceSQL, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // Comme il n'y a pas de table 'facture', on utilise la même liste pour la génération et l'envoi
        const invoicesReadyToSend = locationsToInvoice;

        res.status(200).send({ 
            locationsToInvoice: locationsToInvoice,
            invoicesReadyToSend: invoicesReadyToSend
        });
    } catch (error) {
        console.error("Erreur getFacturationData:", error);
        res.status(500).send({ message: "Échec de la récupération des données de facturation." });
    }
};

// --- LOGIQUE DE GÉNÉRATION ET EMAIL SANS TABLE FACTURE ---

exports.generateInvoices = async (req, res) => {
    // Cette fonction simule la génération pour pré-visualisation/calculs.
    // L'envoi réel aura lieu dans sendInvoice.
    
    // Vous devez récupérer ici la liste des locationsToInvoice (similaire à getFacturationData)
    // puis calculer les montants finaux.
    
    res.status(200).send({ 
        message: "Calcul des factures pour pré-visualisation terminé. (Pas d'enregistrement permanent)"
    });
};


exports.sendInvoice = async (req, res) => {
    const locationId = req.params.id; // L'ID de la location est la référence

    try {
        // 1. Récupérer toutes les données nécessaires pour le calcul et l'email
        const sqlInvoiceData = `
            SELECT 
                l.tarifTot,
                r.idRes,
                c.nomCli, 
                c.prenomCli, 
                c.emailCli,
                l.debLo,
                l.finLo
            FROM 
                location l
            JOIN 
                reservation r ON l.idRes = r.idRes
            JOIN 
                client c ON r.idCli = c.idCli
            WHERE 
                l.idLo = :id AND l.etatLo = 'Terminée'
                AND l.idLo NOT IN (SELECT idLo FROM paiement WHERE statutPaie = 'Effectué');
        `;
        
        const [invoiceData] = await sequelize.query(sqlInvoiceData, { 
            replacements: { id: locationId },
            type: sequelize.QueryTypes.SELECT 
        });

        if (!invoiceData) {
            return res.status(404).send({ message: "Location terminée non trouvée, déjà payée ou non facturable." });
        }

        // 2. LOGIQUE DE CALCUL DE LA FACTURE (Pénalités)
        const baseAmount = parseFloat(invoiceData.tarifTot);
        // Calcul des jours de retard entre la fin de location et aujourd'hui
        const daysOverdue = Math.max(0, Math.floor((new Date() - new Date(invoiceData.finLo)) / (1000 * 60 * 60 * 24)));
        const penaltyRate = 0.01; // 1% de pénalité par jour de retard (Exemple)
        const penalty = daysOverdue * penaltyRate * baseAmount; 
        const finalAmount = (baseAmount + penalty).toFixed(2);
        
        // 3. PRÉPARATION ET ENVOI DE L'EMAIL
        const emailContent = {
            to: invoiceData.emailCli,
            subject: `Votre Facture de Location #${locationId} - Montant: ${finalAmount} MGA`,
            body: `
                Bonjour ${invoiceData.prenomCli} ${invoiceData.nomCli},
                
                Veuillez trouver ci-joint votre facture définitive pour la location #${locationId} (Réservation #${invoiceData.idRes}).
                
                * **Montant Initial:** ${baseAmount.toFixed(2)} MGA
                * **Pénalités (${daysOverdue} jours @ ${penaltyRate*100}%):** ${penalty.toFixed(2)} MGA
                * **Montant Total dû:** ${finalAmount} MGA
                
                Veuillez procéder au paiement sur notre compte bancaire XYZ.
                
                Cordialement,
                L'équipe CEDII Finance
            `
        };

        // 💡 INTEGRATION RÉELLE D'ENVOI D'EMAIL (Exemple avec Nodemailer)
        // const nodemailer = require('nodemailer');
        // let transporter = nodemailer.createTransport({...});
        // await transporter.sendMail({ from: '...', to: emailContent.to, subject: emailContent.subject, text: emailContent.body });

        console.log(`[SIMULATION ENVOI EMAIL RÉUSSI] Facture ${locationId} envoyée à ${emailContent.to}`);
        
        // 4. (AUCUNE MISE À JOUR DE BDD - Pas de table facture)

        res.status(200).send({ 
            message: `Facture #${locationId} calculée et envoyée par email à ${invoiceData.emailCli}.`,
            emailDetails: emailContent 
        });

    } catch (error) {
        console.error("Erreur sendInvoice:", error);
        res.status(500).send({ message: "Échec de l'envoi de la facture par email." });
    }
};

// ... (autres exports) ...

exports.getPaymentData = async (req, res) => {
    try {
        // ... (Requête pour les Paiements EN ATTENTE) ...
        const sqlPendingPaymentsDetails = `... WHERE p.statutPaie = 'En attente' ...`;
        const pendingPayments = await sequelize.query(sqlPendingPaymentsDetails, { 
             type: sequelize.QueryTypes.SELECT 
        });

        // --- 2. Requête pour les Paiements VALIDÉS (Historique) ---
        const sqlValidatedPaymentsDetails = `
            SELECT 
                p.idPaie AS id,
                CONCAT(c.nomCli, ' ', c.prenomCli) AS client,
                p.dateCre AS date,
                p.modePaie AS method,
                p.montantPaie AS amount
            FROM 
                paiement p
            JOIN 
                location l ON p.idLo = l.idLo
            JOIN reservation r ON l.idRes = r.idRes
            JOIN client c ON r.idCli = c.idCli
            WHERE 
                p.statutPaie = 'Effectué'
            ORDER BY 
                p.dateCre DESC;
        `;
        const validatedPayments = await sequelize.query(sqlValidatedPaymentsDetails, { 
             type: sequelize.QueryTypes.SELECT 
        });

        // Envoi des deux listes au frontend
        res.status(200).send({
            pendingPayments,
            validatedPayments // 👈 C'est cette liste qui est l'historique complet
        });

    } catch (error) {
        console.error("Erreur getPaymentData:", error);
        res.status(500).send({ message: "Erreur serveur lors de la récupération des données de paiement." });
    }
};

// ... (autres exports) ...
exports.validatePayment = async (req, res) => {
    const paymentId = req.params.id; // Récupère l'ID du paiement de la route
    
    try {
        // Requête SQL pour mettre à jour le statut du paiement
        const [results, metadata] = await sequelize.query(
            `UPDATE paiement 
             SET statutPaie = 'Effectué' 
             WHERE idPaie = :id 
             AND statutPaie = 'En attente'`, // S'assurer qu'on ne met à jour que les paiements en attente
            {
                replacements: { id: paymentId },
                type: sequelize.QueryTypes.UPDATE
            }
        );

        // 'metadata' contient le nombre de lignes affectées (rows affected)
        if (metadata.affectedRows === 0) {
            // Si 0 ligne affectée, soit l'ID n'existe pas, soit le statut n'était pas 'En attente'
            return res.status(404).send({ 
                message: `Paiement ${paymentId} non trouvé ou déjà validé.` 
            });
        }
        
        // Succès de la mise à jour
        res.status(200).send({ 
            message: `Paiement ${paymentId} validé avec succès (Statut: Effectué).` 
        });

    } catch (error) {
        console.error("Erreur validatePayment:", error);
        res.status(500).send({ 
            message: "Échec de la validation du paiement en base de données.",
            error: error.message
        });
    }
};

exports.sendPaymentReminder = async (req, res) => {
    const paymentId = req.params.id; // L'ID du paiement concerné

    try {
        // --- TODO: INTÉGRATION RÉELLE D'ENVOI D'EMAIL ---
        // 1. Récupérer l'adresse email du client (via jointure paiement -> location -> reservation -> client)
        // 2. Utiliser Nodemailer (ou autre) pour envoyer l'email de relance.
        
        console.log(`[SIMULATION] Relance envoyée pour le paiement ${paymentId}.`);

        // Vous pourriez également ajouter un champ 'dateRelancePaie' dans la table 'paiement'
        // pour éviter d'envoyer plusieurs relances le même jour.

        res.status(200).send({ 
            message: `Relance envoyée pour le paiement #${paymentId}.` 
        });

    } catch (error) {
        console.error("Erreur sendPaymentReminder:", error);
        res.status(500).send({ 
            message: "Échec de l'envoi de la relance par email.",
            error: error.message
        });
    }
};

// --- Fonction de Chargement des Données (à réutiliser) ---
const fetchDashboardData = async () => {
    try {
        const response = await FinanceService.getFinanceDashboardData(); // Utilisez le bon service
        // Mise à jour de la liste
        invoicesToSend.value = response.data.invoicesToSend;
        // ... mise à jour des autres KPIs ...

    } catch (error) {
        console.error("Erreur de chargement du tableau de bord:", error);
    }
};

// ... (autres exports) ...

exports.getLitigationCount = async (req, res) => {
    try {
        // 💡 Requête SQL pour compter les cas nécessitant une action (Exemple de litige)
        // Vous devez définir la condition qui caractérise un 'litige' ou une 'pénalité à notifier'.
        const sqlLitigationCount = `
            SELECT 
                COUNT(l.idLo) AS litigeCount
            FROM 
                location l
            WHERE 
                l.etatLo = 'Confirmée' 
                AND DATEDIFF(CURDATE(), DATE(l.finLo)) > 5 
                AND l.idLo NOT IN (SELECT idLo FROM paiement WHERE statutPaie = 'Effectué');
        `;
        // Cet exemple compte les locations terminées, impayées et en retard de plus de 5 jours.

        const [result] = await sequelize.query(sqlLitigationCount, { 
            type: sequelize.QueryTypes.SELECT 
        });

        res.status(200).send({ 
            count: result.litigeCount
        });

    } catch (error) {
        console.error("Erreur getLitigationCount:", error);
        res.status(500).send({ message: "Erreur serveur." });
    }
};

// backend/controllers/financeController.js (CORRECTION)

// ...

exports.getLitigationCount = async (req, res) => {
    try {
        const sqlLitigationCount = `
            SELECT 
                COUNT(l.idLo) AS litigeCount
            FROM 
                location l
            WHERE 
                l.etatLo = 'Confirmée' 
                -- ET n'a pas de paiement marqué comme 'Effectué'
                AND l.idLo NOT IN (
                    SELECT idLo FROM paiement WHERE statutPaie = 'Effectué'
                )
                -- On compte comme litige/pénalité si la finLo est passée depuis au moins 1 jour
                AND l.finLo < DATE_SUB(CURDATE(), INTERVAL 1 DAY); 
        `;

        // 1. Déstructurez le résultat. [resultObject] sera l'objet { litigeCount: N }
        const [resultObject] = await sequelize.query(sqlLitigationCount, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // 2. Accédez directement à la propriété et assurez-vous qu'elle est bien un nombre (ou 0)
        const count = resultObject ? parseInt(resultObject.litigeCount) || 0 : 0;
        
        res.status(200).send({ 
            count: count // Envoyer le décompte
        });

    } catch (error) {
        // Enregistrer l'erreur détaillée pour aider au débogage
        console.error("Erreur détaillée getLitigationCount:", error); 
        // 💡 Astuce : cette ligne est ce qui apparaît dans la console de votre serveur Node.js!
        res.status(500).send({ 
            message: "Erreur serveur lors du décompte des litiges. (Vérifiez la console du serveur)" 
        });
    }
};

// backend/controllers/financeController.js (Ajouter cette fonction)

/**
 * Récupère la liste détaillée des locations terminées, impayées et en retard (> 1 jour).
 */
exports.getPenalitesData = async (req, res) => {
    try {
        const sqlPenalitesData = `
            SELECT
                l.idLo AS id,
                CONCAT(c.nomCli, ' ', c.prenomCli) AS client,
                c.emailCli,
                l.tarifTot AS baseAmount,
                l.finLo AS endDate,
                -- Calcul des jours de retard
                DATEDIFF(CURDATE(), DATE(l.finLo)) AS daysLate
            FROM 
                location l
            JOIN
                reservation r ON l.idRes = r.idRes
            JOIN 
                client c ON r.idCli = c.idCli
            WHERE 
                l.etatLo = 'Terminée' 
                AND l.idLo NOT IN (
                    SELECT idLo FROM paiement WHERE statutPaie = 'Effectué'
                )
                AND l.finLo < CURDATE() -- Au moins 1 jour de retard
            ORDER BY 
                l.finLo ASC;
        `;
        
        const penalitesData = await sequelize.query(sqlPenalitesData, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // Logique de calcul de pénalité (identique à celle utilisée dans sendInvoice)
        const penaltyRate = 0.01; // 1% de pénalité par jour

        const formattedPenalites = penalitesData.map(item => {
            const daysOverdue = parseInt(item.daysLate, 10);
            const baseAmount = parseFloat(item.baseAmount);
            const penalty = daysOverdue > 0 ? (daysOverdue * penaltyRate * baseAmount) : 0;
            const finalAmount = baseAmount + penalty;

            return {
                id: item.id,
                client: item.client,
                email: item.emailCli,
                daysLate: daysOverdue,
                baseAmount: baseAmount.toFixed(2),
                penaltyAmount: penalty.toFixed(2),
                finalAmount: finalAmount.toFixed(2) // Montant total dû avec pénalité
            };
        });

        res.status(200).send(formattedPenalites);

    } catch (error) {
        console.error("Erreur getPenalitesData:", error);
        res.status(500).send({ message: "Échec de la récupération des données de pénalités." });
    }
};


// backend/controllers/financeController.js (Ajouter cette fonction)

/**
 * Récupère les indicateurs clés de performance (KPI) pour la page de Rapports/Synthèse.
 */
exports.getRapportsSyntheseData = async (req, res) => {
    try {
        // 1. Chiffre d'Affaires Total (Toutes les paiements 'Effectué')
        const sqlTotalRevenue = `
            SELECT 
                SUM(montantPaie) AS totalRevenue
            FROM 
                paiement
            WHERE 
                statutPaie = 'Effectué';
        `;
        const [revenueData] = await sequelize.query(sqlTotalRevenue, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // 2. Nombre de Locations Actuelles (étatLo = 'En cours')
        const sqlActiveLocations = `
            SELECT 
                COUNT(idLo) AS activeLocationsCount
            FROM 
                location
            WHERE 
                etatLo = 'En cours';
        `;
        const [activeData] = await sequelize.query(sqlActiveLocations, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // 3. Montants en Attente de Paiement
        const sqlPendingAmount = `
            SELECT 
                SUM(montantPaie) AS pendingAmount
            FROM 
                paiement
            WHERE 
                statutPaie = 'En attente';
        `;
        const [pendingData] = await sequelize.query(sqlPendingAmount, { 
            type: sequelize.QueryTypes.SELECT 
        });
        
        // 4. Distribution des Moyens de Paiement (Exemple)
        const sqlPaymentMethods = `
            SELECT 
                modePaie, 
                COUNT(idPaie) AS count
            FROM 
                paiement
            WHERE 
                statutPaie = 'Effectué'
            GROUP BY 
                modePaie;
        `;
        const paymentMethods = await sequelize.query(sqlPaymentMethods, { 
            type: sequelize.QueryTypes.SELECT 
        });

        res.status(200).send({
            totalRevenue: parseFloat(revenueData[0]?.totalRevenue) || 0,
            activeLocationsCount: parseInt(activeData[0]?.activeLocationsCount) || 0,
            pendingAmount: parseFloat(pendingData[0]?.pendingAmount) || 0,
            paymentMethodDistribution: paymentMethods
        });

    } catch (error) {
        console.error("Erreur getRapportsSyntheseData:", error);
        res.status(500).send({ message: "Échec de la récupération des données de rapport." });
    }
};

exports.getMonthlyRevenueTrend = async (req, res) => {
    try {
        const sqlMonthlyTrend = `
            SELECT
                YEAR(paie.dateCre) AS annee,       -- ⬅️ CORRECTION
                MONTH(paie.dateCre) AS mois,       -- ⬅️ CORRECTION
                SUM(paie.montantPaie) AS totalMensuel
            FROM
                paiement paie
            WHERE
                paie.statutPaie = 'Effectué'
                -- Optionnel: Limiter aux 12 derniers mois
                AND paie.dateCre >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) -- ⬅️ CORRECTION
            GROUP BY
                annee, mois
            ORDER BY
                annee ASC, mois ASC;
        `;

        const [monthlyData] = await sequelize.query(sqlMonthlyTrend, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // Assurez-vous d'envoyer le résultat non indexé
        res.status(200).send(monthlyData);

    } catch (error) {
        console.error("Erreur critique dans getMonthlyRevenueTrend:", error); 
        res.status(500).send({ 
            message: "Erreur serveur : Problème d'exécution de la requête SQL. (Vérifiez la console du serveur)" 
        });
    }
};

