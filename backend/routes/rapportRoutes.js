const express = require('express');
const router = express.Router();
const rapportCtrl = require('../controllers/rapportController');

// Routes pour les Rapports et Suivi
router.get('/kpis', rapportCtrl.getKPIs);
router.get('/reservations-report', rapportCtrl.getReservationsReport);
router.get('/top-materiel', rapportCtrl.getTopRentedMateriel);

module.exports = router;