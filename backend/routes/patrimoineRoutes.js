const express = require('express');
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
//router.post('/materiel', materielController.createMateriel);
//router.delete('/materiel/:id', materielController.deleteMateriel);
// router.put('/materiel/:id', patrimoineCtrl.updateMateriel); // Ajoutez la mise à jour si besoin

module.exports = router;

