// backend/routes/rapportRoutes.js (NETTOYÉ ET SÉCURISÉ)

const express = require('express');
const router = express.Router();
const rapportCtrl = require('../controllers/rapportController'); // Gardons-le pour les autres routes
// Si votre fichier db.js exporte l'instance de Sequelize :
const sequelize = require('../config/db'); // Renommez l'import en 'sequelize'
// Si votre fichier db.js exporte la fonction execute (ce qui n'est pas le cas ici) :
// const { execute } = require('../config/db'); 


// GET /api/rapports/kpis
router.get('/kpis', rapportCtrl.getKPIs);
// Les autres routes qui utilisent le contrôleur sont conservées
router.get('/reservations-report', rapportCtrl.getReservationsReport);
router.get('/top-materiel', rapportCtrl.getTopRentedMateriel);

router.get('/revenu-par-client', rapportCtrl.getRevenueByClientType); // 👈 Nouvelle route
// ...

// NOUVELLES ROUTES MANQUANTES
router.get('/reservations', rapportCtrl.getReservationsStats);
router.get('/monthly-stats', rapportCtrl.getMonthlyStats);
router.get('/location-types', rapportCtrl.getLocationTypes);
router.get('/export', rapportCtrl.exportReports);

module.exports = router;