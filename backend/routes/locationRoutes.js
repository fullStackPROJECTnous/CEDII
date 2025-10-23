// backend/routes/locationRoutes.js (NETTOYÉ)

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Routes pour les Locations et Réservations (utiliser UNIQUEMENT le Controller)

// REMARQUE: La route manuelle pour '/reservations/en-attente' a été retirée.
// Utilisez UNIQUEMENT locationController.getPendingReservations
router.get('/reservations/pending', locationController.getPendingReservations); 

router.get('/reception/dashboard', locationController.getReceptionDashboardData); 
router.put('/reservations/:idRes/status', locationController.updateReservationStatus);
router.get('/', locationController.getAllLocations); 
router.get('/availability', locationController.checkAvailability);
router.get('/events/confirmed', locationController.getConfirmedEvents);

module.exports = router;