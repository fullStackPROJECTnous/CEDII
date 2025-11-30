
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
router.get('/debug/salles', salleController.debugSalles);
//router.post('/:idSalle/calculate-tarif', salleController.calculateTarifSalle);

module.exports = router;