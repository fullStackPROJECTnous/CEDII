// routes/salleRoutes.js (CORRIGÉ)

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

module.exports = router;