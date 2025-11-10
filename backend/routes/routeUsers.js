// routes/admin.routes.js (Backend Node.js/Express)

const express = require('express');
const router = express.Router();
// Assurez-vous d'importer les modules nécessaires
const userController = require('../controllers/userController');
//const { authJwt } = require('../middlewares'); // Middleware pour la vérification du token et du rôle

// --- Routes d'administration pour la gestion des utilisateurs ---
router.get('/:id/history', 
    // [authJwt.verifyToken], // Peut-être accessible par l'utilisateur lui-même et l'admin
    userController.getUserHistory
);
// --- Routes d'administration pour la gestion des utilisateurs ---
router.get('/users/clients/list', 
    // [authJwt.verifyToken], // Peut-être accessible par l'utilisateur lui-même et l'admin
    userController.getAllClientUsers
);

// [GET] /api/users/:id/last-activity - Récupère la dernière activité d'un utilisateur
router.get('/:id/last-activity', 
    // [authJwt.verifyToken], 
    userController.getLastActivity
);
// Récupère TOUS les utilisateurs. Nécessite d'être connecté (verifyToken) et d'être Admin (isAdmin).
router.get('/users', 
  //  [authJwt.verifyToken, authJwt.isAdmin], 
    userController.getAllUsers
);



// [POST] /api/users
// Crée un nouvel utilisateur. Nécessite d'être connecté et d'être Admin.
router.post('/users', 
    //[authJwt.verifyToken, authJwt.isAdmin], 
    userController.createUser
);

// [PUT] /api/users/:id
// Met à jour un utilisateur. Nécessite d'être connecté et d'être Admin.
router.put('/users/:id', 
   // [authJwt.verifyToken, authJwt.isAdmin], 
    userController.updateUser
);

// [DELETE] /api/users/:id
// Supprime un utilisateur. Nécessite d'être connecté et d'être Admin.
router.delete('/users/:id', 
   // [authJwt.verifyToken, authJwt.isAdmin], 
    userController.deleteUser
);

module.exports = router; 
// N'oubliez pas d'importer ce module dans votre fichier principal (server.js/app.js) sous le chemin '/api' ou '/api/users'