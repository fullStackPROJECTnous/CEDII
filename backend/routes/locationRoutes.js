const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authJwt = require('../middleware/authJwt'); // Import correct

// Route protégée
router.post('/client/reservations', 
    authJwt.verifyToken, // ← Utilisez authJwt.verifyToken
    locationController.createClientReservation
);

// --- Gestion des Locations et Réservations ---

// Routes générales en premier
router.get('/', locationController.getAllLocations);
router.get('/reception/dashboard', locationController.getReceptionDashboardData);
router.get('/reservations/pending', locationController.getPendingReservations);
router.get('/history', locationController.getLocationHistory);

// Routes pour les catalogues
router.get('/clients', locationController.getClients);
router.get('/salles', locationController.getSalles);
router.get('/materiels', locationController.getMateriels);

// Routes de disponibilité
router.get('/availability', locationController.checkAvailability);

// Routes de réservations
router.post('/reservations', locationController.createReservation);
// Route spécifique pour les réservations CLIENT
//router.post('/client/reservations', locationController.createClientReservation);
router.get('/reservations/:idRes/details', locationController.getReservationDetails);
router.post('/reservations/:idRes/validate', locationController.validateReservation);
router.put('/reservations/:idRes/status', locationController.updateReservationStatus);
// Dans votre fichier de routes (ex: locationRoutes.js)
//router.put('/reservations/:idRes/status', locationController.updateReservationStatus);
// Routes d'événements
// Ajoutez cette route AVANT les routes paramétrées génériques
router.put('/:idLo/status', locationController.updateLocationStatus);
router.get('/events/confirmed', locationController.getConfirmedEvents);
router.get('/terminated', locationController.getTerminatedLocations);

// 🔥 CORRECTION : Déplacer la route état-lieux AVANT les routes paramétrées génériques
router.post('/etat-lieux/:idLo', locationController.submitEtatLieux);

// Routes de détails (DOIVENT ÊTRE APRÈS les routes spécifiques)
router.get('/:idLo/details', locationController.getLocationDetails);

module.exports = router;