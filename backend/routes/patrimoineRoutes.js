
const express = require('express');
const router = express.Router();
const materielController = require('../controllers/materielController');

router.post('/', materielController.createMateriel);             // CREATE
router.get('/', materielController.getAllMateriels);             // READ ALL
router.get('/:code', materielController.getMaterielByCode);      // READ ONE
router.put('/:code', materielController.updateMateriel);         // UPDATE
router.delete('/:code', materielController.deleteMateriel);     // DELETE

// Nouvelles routes pour les fonctionnalités avancées
router.get('/:codeMat/historique', materielController.getHistoriqueEmprunt);
router.put('/:codeMat/etat', materielController.updateEtatMateriel);


module.exports = router;

