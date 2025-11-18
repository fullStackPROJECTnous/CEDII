const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Routes principales
router.get('/dashboard', financeController.getFinanceDashboardData);
router.get('/cashflow-synthese', financeController.getCashflowSynthese);
router.get('/facturation', financeController.getFacturationData);

// Routes pour les paiements - CORRECTION ICI
router.get('/payments', financeController.getPaymentData); // ✅ AJOUTÉE
router.post('/validate-payment/:id', financeController.validatePayment);
router.post('/send-reminder/:id', financeController.sendPaymentReminder);

// Routes pour la génération de factures
router.post('/generate-invoices', financeController.generateInvoices);
router.post('/send-invoice/:id', financeController.sendInvoice);

// Nouvelles routes pour l'interface avancée
router.get('/confirmed-locations', financeController.getConfirmedLocationsToInvoice);
router.post('/create-and-send-invoice', financeController.createAndSendInvoice);
router.get('/download-invoice/:locationId', financeController.downloadInvoice);
router.get('/export-invoices', financeController.exportInvoices);

// Routes pour les rapports et statistiques
router.get('/payment-history', financeController.getPaymentHistory);
router.get('/litigation-count', financeController.getLitigationCount);
router.get('/penalites', financeController.getPenalitesData);
router.get('/monthly-revenue', financeController.getMonthlyRevenueTrend);
router.get('/reports', financeController.getRapportsSyntheseData);

// Ancienne route conservée pour compatibilité
router.post('/create-invoice/:idLo', financeController.createInvoiceFromLocation);

module.exports = router;