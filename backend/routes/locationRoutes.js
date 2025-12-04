const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authJwt = require('../middleware/authJwt');

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
router.get('/reservations/:idRes/details', locationController.getReservationDetails);
router.post('/reservations/:idRes/validate', locationController.validateReservation);

// Route pour mettre à jour le statut de réservation
router.put('/reservations/:idRes/status', locationController.updateReservationStatus);

// Routes pour les événements
router.get('/events/confirmed', locationController.getConfirmedEvents);
router.get('/terminated', locationController.getTerminatedLocations);

// CORRECTION CRITIQUE : Route pour état des lieux - DOIT utiliser un chemin spécifique
router.post('/etat-lieux/:idLo', locationController.submitEtatLieux);

// CORRECTION CRITIQUE : Route pour mettre à jour le statut d'une location
router.put('/locations/:idLo/status', locationController.updateLocationStatus); // <-- CHANGEMENT ICI
router.put('/:idLo/status', locationController.updateLocationStatus); 
// Route de détails des locations
router.get('/locations/:idLo/details', locationController.getLocationDetails); // <-- OPTIONNEL : uniformiser

// Routes client
router.post('/client/reservations', 
    authJwt.verifyToken,
    locationController.createClientReservation
);

module.exports = router;