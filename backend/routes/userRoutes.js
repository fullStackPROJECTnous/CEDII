// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


//router.get('/', userController.home);

// Route POST pour l'inscription (pour ajouter des utilisateurs au début)
//router.post('/home', userController.home);

router.get('/clients/list', userController.getAllClientUsers);
// Route POST pour la connexion (le vrai point de login)
router.post('/login', userController.login);

module.exports = router;