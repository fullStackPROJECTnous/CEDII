const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const reservationController = require('../controllers/reservationController');

// 🌐 ROUTES PUBLIQUES (sans authentification)
// 1. CRÉATION D'UNE RÉSERVATION POUR CLIENTS PUBLICS
router.post('/public/reservations', reservationController.createPublicReservation);

// 🔐 ROUTES PROTÉGÉES PAR JWT
router.use(verifyToken);

// 📋 ROUTES POUR LES RÉSERVATIONS

// 2. CRÉATION D'UNE NOUVELLE RÉSERVATION (clients authentifiés)
router.post('/', reservationController.createReservation);

// 3. RÉCUPÉRATION DES RÉSERVATIONS D'UN CLIENT
router.get('/client/:clientId', reservationController.getClientReservations);

// 4. RÉCUPÉRATION D'UNE RÉSERVATION SPÉCIFIQUE
router.get('/:id', reservationController.getReservationById);

// 5. MODIFICATION D'UNE RÉSERVATION
router.put('/:id', reservationController.updateReservation);

// 6. ANNULATION D'UNE RÉSERVATION
router.patch('/:id/cancel', reservationController.cancelReservation);

// 7. SUPPRESSION D'UNE RÉSERVATION (admin seulement)
router.delete('/:id', reservationController.deleteReservation);

// 📊 ROUTES ADMIN (avec vérification de rôle supplémentaire)

// 8. RÉCUPÉRATION DE TOUTES LES RÉSERVATIONS (admin)
router.get('/', reservationController.getAllReservations);

// 9. CHANGEMENT DE STATUT D'UNE RÉSERVATION (admin/reception)
router.patch('/:id/status', reservationController.updateReservationStatus);

// 10. RÉSERVATIONS PAR STATUT
router.get('/status/:status', reservationController.getReservationsByStatus);

// 11. RÉSERVATIONS POUR UNE PÉRIODE
router.get('/period/:startDate/:endDate', reservationController.getReservationsByPeriod);

// 🆕 ROUTES POUR LES NOTIFICATIONS ET DEMANDES EN ATTENTE

// 12. RÉCUPÉRATION DES RÉSERVATIONS EN ATTENTE (pour la réception)
router.get('/pending/requests', reservationController.getPendingReservations);

// 13. MARQUER UNE NOTIFICATION COMME LUE
router.patch('/notifications/:idNotif/read', reservationController.marquerNotificationLue);

module.exports = router;