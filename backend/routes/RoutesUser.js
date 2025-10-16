/*const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authJwt'); // Middleware de sécurité
//import ServiceUser from '../services/ServiceUser.js';

// Protection des routes : toutes les routes de gestion nécessitent l'ADMINISTRATEUR
router.use(verifyToken, isAdmin); 

// Récupérer tous les utilisateurs (pour le tableau)
router.get('/', userController.findAll); 

// Créer un nouvel utilisateur (avec hashage du mot de passe)
router.post('/', userController.create); 

// Modifier un utilisateur
router.put('/:id', userController.update); 

// Supprimer un utilisateur
router.delete('/:id', userController.delete); 


/*router.get('/', (req, res) => {
    res.send("Route test OK");
});
module.exports = router;*/