/*const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const reservationController = require('../controllers/reservationController');

// 🌐 ROUTES PUBLIQUES (sans authentification)
// 1. CRÉATION D'UNE RÉSERVATION POUR CLIENTS PUBLICS
router.post('/public/reservations', reservationController.createPublicReservation);

// 🆕 ROUTES POUR LA RÉCEPTION (sans authentification)
// 2. RÉCUPÉRATION DES RÉSERVATIONS EN ATTENTE (pour la réception)
router.get('/pending/requests', reservationController.getPendingReservations);

// 3. RÉCUPÉRATION DES NOTIFICATIONS NON LUES
router.get('/notifications/unread', reservationController.getUnreadNotifications);

// 4. MARQUER UNE NOTIFICATION COMME LUE
router.patch('/notifications/:idNotif/read', reservationController.marquerNotificationLue);

// 🔐 ROUTES PROTÉGÉES PAR JWT
router.use(verifyToken);

// 📋 ROUTES POUR LES RÉSERVATIONS

// 5. CRÉATION D'UNE NOUVELLE RÉSERVATION (clients authentifiés)
//router.post('/', reservationController.createReservation);

// 6. RÉCUPÉRATION DES RÉSERVATIONS D'UN CLIENT
router.get('/client/:clientId', reservationController.getClientReservations);

// 7. RÉCUPÉRATION D'UNE RÉSERVATION SPÉCIFIQUE
router.get('/:id', reservationController.getReservationById);

// 8. MODIFICATION D'UNE RÉSERVATION
router.put('/:id', reservationController.updateReservation);

// 9. ANNULATION D'UNE RÉSERVATION
router.patch('/:id/cancel', reservationController.cancelReservation);

// 10. SUPPRESSION D'UNE RÉSERVATION (admin seulement)
router.delete('/:id', reservationController.deleteReservation);

// 📊 ROUTES ADMIN (avec vérification de rôle supplémentaire)

// 11. RÉCUPÉRATION DE TOUTES LES RÉSERVATIONS (admin)
router.get('/', reservationController.getAllReservations);

// 12. CHANGEMENT DE STATUT D'UNE RÉSERVATION (admin/reception)
router.patch('/:id/status', reservationController.updateReservationStatus);

// 13. RÉSERVATIONS PAR STATUT
router.get('/status/:status', reservationController.getReservationsByStatus);

router.get('/reservations/stats', reservationController.getReservationStats);

// 14. RÉSERVATIONS POUR UNE PÉRIODE
router.get('/period/:startDate/:endDate', reservationController.getReservationsByPeriod);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authJwt');
const reservationController = require('../controllers/reservationController');

// 🌐 ROUTES PUBLIQUES (sans authentification)
// 1. CRÉATION D'UNE RÉSERVATION POUR CLIENTS PUBLICS
router.post('/public/reservations', reservationController.createPublicReservation);

// 🆕 ROUTES POUR LA RÉCEPTION (sans authentification)
// 2. RÉCUPÉRATION DES RÉSERVATIONS EN ATTENTE (pour la réception)
router.get('/pending/requests', reservationController.getPendingReservations);

// 3. RÉCUPÉRATION DES NOTIFICATIONS NON LUES
router.get('/notifications/unread', reservationController.getUnreadNotifications);

// 4. MARQUER UNE NOTIFICATION COMME LUE
router.patch('/notifications/:idNotif/read', reservationController.marquerNotificationLue);

// 5. RÉCUPÉRATION DES STATISTIQUES (pour dashboard)
router.get('/stats', reservationController.getReservationStats); // <-- CORRECTION ICI

// 🔐 ROUTES PROTÉGÉES PAR JWT
router.use(verifyToken);

// 📋 ROUTES POUR LES RÉSERVATIONS

// 6. CRÉATION D'UNE NOUVELLE RÉSERVATION (clients authentifiés)
//router.post('/', reservationController.createReservation);

// 7. RÉCUPÉRATION DES RÉSERVATIONS D'UN CLIENT
router.get('/client/:clientId', reservationController.getClientReservations);

// 8. RÉCUPÉRATION D'UNE RÉSERVATION SPÉCIFIQUE
router.get('/:id', reservationController.getReservationById);

// 9. MODIFICATION D'UNE RÉSERVATION
router.put('/:id', reservationController.updateReservation);

// 10. ANNULATION D'UNE RÉSERVATION
router.patch('/:id/cancel', reservationController.cancelReservation);

// 11. SUPPRESSION D'UNE RÉSERVATION (admin seulement)
router.delete('/:id', reservationController.deleteReservation);

// 📊 ROUTES ADMIN (avec vérification de rôle supplémentaire)

// 12. RÉCUPÉRATION DE TOUTES LES RÉSERVATIONS (admin)
router.get('/', reservationController.getAllReservations);

// 13. CHANGEMENT DE STATUT D'UNE RÉSERVATION (admin/reception)
router.patch('/:id/status', reservationController.updateReservationStatus);

// 14. RÉSERVATIONS PAR STATUT
router.get('/status/:status', reservationController.getReservationsByStatus);

// 15. RÉSERVATIONS POUR UNE PÉRIODE
router.get('/period/:startDate/:endDate', reservationController.getReservationsByPeriod);

module.exports = router;