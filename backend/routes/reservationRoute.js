const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const reservationController = require('../controllers/reservationController');

// 🔐 Routes protégées par JWT
router.use(verifyToken);

// 📋 ROUTES POUR LES RÉSERVATIONS

// 1. CRÉATION D'UNE NOUVELLE RÉSERVATION
router.post('/', reservationController.createReservation);

// 2. RÉCUPÉRATION DES RÉSERVATIONS D'UN CLIENT
router.get('/client/:clientId', reservationController.getClientReservations);

// 3. RÉCUPÉRATION D'UNE RÉSERVATION SPÉCIFIQUE
router.get('/:id', reservationController.getReservationById);

// 4. MODIFICATION D'UNE RÉSERVATION
router.put('/:id', reservationController.updateReservation);

// 5. ANNULATION D'UNE RÉSERVATION
router.patch('/:id/cancel', reservationController.cancelReservation);

// 6. SUPPRESSION D'UNE RÉSERVATION (admin seulement)
router.delete('/:id', reservationController.deleteReservation);

// 📊 ROUTES ADMIN (avec vérification de rôle supplémentaire)

// 7. RÉCUPÉRATION DE TOUTES LES RÉSERVATIONS (admin)
router.get('/', reservationController.getAllReservations);

// 8. CHANGEMENT DE STATUT D'UNE RÉSERVATION (admin/reception)
router.patch('/:id/status', reservationController.updateReservationStatus);

// 9. RÉSERVATIONS PAR STATUT
router.get('/status/:status', reservationController.getReservationsByStatus);

// 10. RÉSERVATIONS POUR UNE PÉRIODE
router.get('/period/:startDate/:endDate', reservationController.getReservationsByPeriod);

module.exports = router;