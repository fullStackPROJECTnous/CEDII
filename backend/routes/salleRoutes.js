// routes/salleRoutes.js (CORRIGÉ)
/*
const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salleController'); // Chemin à ajuster si nécessaire

// CRUD Routes
//router.post('/', salleController.createSalle);      // Create (POST)
//router.get('/', salleController.findAllSalles);     // Read All (GET)
router.get('/', salleController.getAllSalles);
//router.get('/:id', salleController.findOneSalle);   // Read One (GET by ID)
//router.put('/:id', salleController.updateSalle);    // Update (PUT)
//router.delete('/:id', salleController.deleteSalle); // Delete (DELETE)

module.exports = router;*/

// backend/routes/salle.routes.js
const express = require('express');
const router = express.Router();
const salleController = require('../controllers/salleController');

// Routes CRUD de base
router.get('/', salleController.getAllSalles);
router.post('/', salleController.createSalle);
router.get('/:idSalle', salleController.getSalle);
router.put('/:idSalle', salleController.updateSalle);
router.delete('/:idSalle', salleController.deleteSalle);

// Routes pour les fonctionnalités avancées
router.get('/:idSalle/reservations', salleController.getReservationsSalle);
router.post('/:idSalle/check-disponibilite', salleController.checkDisponibilite);
router.get('/:idSalle/calendrier', salleController.getCalendrierSalle);
//router.post('/:idSalle/calculate-tarif', salleController.calculateTarifSalle);

module.exports = router;