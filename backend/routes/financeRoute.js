const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Routes principales
router.get('/dashboard', financeController.getFinanceDashboardData);
router.get('/cashflow-synthese', financeController.getCashflowSynthese);
router.get('/facturation', financeController.getFacturationData);

// Routes pour les paiements
router.get('/payments', financeController.getPaymentData);
router.post('/validate-payment/:id', financeController.validatePayment);
router.post('/send-payment-reminder', financeController.sendPaymentReminder);

// Routes pour la génération de factures
router.post('/generate-invoices', financeController.generateInvoices);
router.post('/send-invoice/:id', financeController.sendInvoice);

// Dans votre fichier de routes (ex: financeRoutes.js)
router.get('/rapports-data', financeController.getRapportsData);
router.get('/monthly-revenue', financeController.getMonthlyRevenue);

// Dans financeRoutes.js
router.get('/penalites-data', financeController.getPenalitesData);
router.post('/send-penalty-reminder', financeController.sendPenaltyReminder);

// Routes pour le backend financier
router.get('/chiffre-affaires', async (req, res) => {
  try {
    const db = require('../models');
    const Paiement = db.Paiement;
    
    const result = await Paiement.sum('montantPaie', {
      where: { statutPaie: 'Effectué' }
    });
    
    res.json({ total: result || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/factures-envoyees', async (req, res) => {
  try {
    const db = require('../models');
    const HistoriqueEmail = db.HistoriqueEmail;
    
    const count = await HistoriqueEmail.count({
      where: { statutEnvoi: 'succes' }
    });
    
    res.json({ count: count || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nouvelle route pour annuler les paiements
router.post('/cancel-payment/:id', financeController.cancelPayment);

// Nouvelles routes pour l'interface avancée
router.get('/confirmed-locations', financeController.getConfirmedLocationsToInvoice);
router.post('/create-and-send-invoice', financeController.createAndSendInvoice);
router.get('/download-invoice/:locationId', financeController.downloadInvoice);
router.get('/export-invoices', financeController.exportInvoices);

// Routes pour les pénalités et workflow
router.get('/penalties/calculate', financeController.calculatePenalties);
router.post('/penalties/notify', financeController.sendPenaltyNotifications);

// Routes pour les rapports et statistiques
router.get('/payment-history', financeController.getPaymentHistory);
router.get('/litigation-count', financeController.getLitigationCount);
router.get('/penalites', financeController.getPenalitesData);
router.get('/monthly-revenue', financeController.getMonthlyRevenueTrend);
router.get('/reports', financeController.getRapportsSyntheseData);
// Dans financeRoutes.js - AJOUTEZ cette route
router.post('/send-payment-reminder/:id', financeController.sendPaymentReminder);

// Ancienne route conservée pour compatibilité
router.post('/create-invoice/:idLo', financeController.createInvoiceFromLocation);
// Dans financeRoutes.js
router.get('/paid-invoices/:locationId/download', financeController.downloadPaidInvoice);
// Dans financeRoutes.js - AJOUTEZ cette ligne si elle n'existe pas


module.exports = router;