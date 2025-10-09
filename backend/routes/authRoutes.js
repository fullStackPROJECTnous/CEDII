// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.home);
//router.post('/login',  authController.home); 

// Route POST pour l'inscription (pour ajouter des utilisateurs au début)
router.post('/register', authController.register);

// Route POST pour la connexion (le vrai point de login)
router.post('/login', authController.login);

module.exports = router;

