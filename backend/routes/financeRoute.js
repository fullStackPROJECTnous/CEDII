const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Route pour obtenir toutes les données du tableau de bord
router.get(
    '/dashboard', 
    // [authJwt.verifyToken, authJwt.isFinanceOrAdmin], // Exemple de middleware
    financeController.getFinanceDashboardData
);

router.get('/cashflow-synthese', financeController.getCashflowSynthese);

router.get(
    '/facturation', 
    // [authJwt.verifyToken, authJwt.isFinanceOrAdmin],
    financeController.getFacturationData
);

/*router.post(
    '/notify-penalty/:id', 
    financeController.sendPenaltyNotification
)*/

// Route pour déclencher le processus de génération automatique des factures
router.post(
    '/generate-invoices', 
    // [authJwt.verifyToken, authJwt.isFinanceOrAdmin],
    financeController.generateInvoices
);

// Route pour envoyer une facture spécifique par email et mettre à jour son statut
router.post(
    '/send-invoice/:id', 
    // [authJwt.verifyToken, authJwt.isFinanceOrAdmin],
    financeController.sendInvoice
);

router.get(
    '/payments', 
    financeController.getPaymentData
);

// Route pour valider et rapprocher un paiement
router.post(
    '/validate-payment/:id', 
    financeController.validatePayment
);

// Route pour envoyer un email de relance de paiement
router.post(
    '/send-reminder/:id', 
    financeController.sendPaymentReminder
);


// NOUVELLES ROUTES CORRIGÉES
router.get('/confirmed-locations', financeController.getConfirmedLocationsToInvoice);
router.post('/create-and-send-invoice', financeController.createAndSendInvoice);
router.get('/download-invoice/:locationId', financeController.downloadInvoice); // ✅ CORRIGÉ
router.get('/export-invoices', financeController.exportInvoices);

// Routes pour l'envoi de factures
router.post('/send-invoice', financeController.createAndSendInvoice); // ✅ NOUVELLE ROUTE POST
router.post('/send-invoice/:id', financeController.sendInvoice); // ✅ CONSERVER L'ANCIENNE

router.get('/payment-history', financeController.getPaymentHistory);

// Route pour obtenir le compte des litiges pour l'affichage dans la sidebar
router.get(
    '/litigation-count', 
    financeController.getLitigationCount
);

// backend/routes/financeRoutes.js (Extrait)

// ... (vos autres routes) ...

// Route pour obtenir le compte des litiges pour la sidebar
router.get(
    '/litigation-count', 
    financeController.getLitigationCount
);

// backend/routes/financeRoutes.js (Extrait)

// ... (vos autres routes) ...

// Route pour obtenir le compte des litiges pour la sidebar
router.get(
    '/litigation-count', 
    financeController.getLitigationCount
);


// backend/routes/financeRoutes.js (Ajouter ceci)

// Route pour obtenir la liste détaillée des pénalités/litiges
router.get(
    '/penalites', 
    financeController.getPenalitesData
);


router.get(
    '/monthly-revenue', 
    financeController.getMonthlyRevenueTrend
);

router.get(
    '/reports', 
    financeController.getRapportsSyntheseData
);

// Dans financeRoutes.js
router.get('/confirmed-locations', financeController.getConfirmedLocationsToInvoice);
router.post('/create-invoice/:idLo', financeController.createInvoiceFromLocation);


module.exports = router;