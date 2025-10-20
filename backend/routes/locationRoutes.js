/*const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationController');

// Routes pour les Réservations Actives / En Attente
router.get('/reservations/pending', locationCtrl.getPendingReservations); 
router.post('/reservations', locationCtrl.createReservation); 
router.put('/reservations/:id/status', locationCtrl.updateReservationStatus); 
router.delete('/reservations/:id', locationCtrl.deleteReservation); 

// Routes pour l'Historique des Locations Terminées
router.get('/locations/history', locationCtrl.getLocationHistory); 

module.exports = router;*/
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');


 router.get('/reception/dashboard', locationController.getReceptionDashboardData); 

 router.put('/reservations/:idRes/status', locationController.updateReservationStatus);

router.get('/reservations/pending', locationController.getPendingReservations);
router.get('/', locationController.getAllLocations); 

router.get('/availability', locationController.checkAvailability);

router.get('/events/confirmed', locationController.getConfirmedEvents);



// Route pour la mise à jour du statut (si non déjà présente)
// Route: PUT /api/locations/reservations/:idRes/status


// ...


// Route pour récupérer toutes les locations


// Les routes pour le CRUD
// router.post('/', locationController.createLocation);
// router.put('/:id', locationController.updateLocation);
// router.delete('/:id', locationController.deleteLocation);

module.exports = router;