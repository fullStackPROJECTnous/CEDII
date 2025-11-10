/*const express = require('express');
const router = express.Router();
//const patrimoineCtrl = require('../controllers/patrimoineController');
const materielController = require('../controllers/materielController');
// 💡 Assurez-vous d'avoir votre middleware d'authentification (ex: verifyToken) ici

// Routes pour les Salles
//router.get('/salles', patrimoineCtrl.getAllSalles);
//router.post('/salles', patrimoineCtrl.createSalle);
//router.put('/salles/:id', patrimoineCtrl.updateSalle);
// router.delete('/salles/:id', patrimoineCtrl.deleteSalle); // Ajoutez la suppression si besoin

// Routes pour le Matériel
router.get('/', materielController.getAllMateriel);

// Routes CRUD de base

router.post('/', materielController.createMateriel);
//router.get('/:codeMat', materielController.getMateriel);
router.put('/:codeMat', materielController.updateMateriel);
router.delete('/:codeMat', materielController.deleteMateriel);

// Nouvelles routes pour les fonctionnalités avancées
router.get('/:codeMat/historique', materielController.getHistoriqueEmprunt);
router.put('/:codeMat/etat', materielController.updateEtatMateriel);

//router.post('/materiel', materielController.createMateriel);
//router.delete('/materiel/:id', materielController.deleteMateriel);
// router.put('/materiel/:id', patrimoineCtrl.updateMateriel); // Ajoutez la mise à jour si besoin

module.exports = router;*/

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

//router.post('/materiel', materielController.createMateriel);
//router.delete('/materiel/:id', materielController.deleteMateriel);
// router.put('/materiel/:id', patrimoineCtrl.updateMateriel); // Ajoutez la mise à jour si besoin

module.exports = router;

