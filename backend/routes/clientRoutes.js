// routes/clientRoutes.js
/*
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController'); 
//const { authJwt } = require('../middlewares');
// Adjust path as needed

router.get('/rankings',
    // [authJwt.verifyToken, /* autres middlewares ],*/
    /*  clientController.getRankings);

            router.get('/profile', 
                  //[authJwt.verifyToken],
                   clientController.getClientProfileByUtiId);

// NOUVELLE ROUTE : Historique d'un client spécifique
router.get('/:idCli/history',
   //  [authJwt.verifyToken, /* autres middlewares],*/
   /*   clientController.getClientHistory);



// CRUD Routes
router.post('/', clientController.createClient);          // Create (POST)
router.get('/', clientController.getAllClients);
//router.get('/', clientController.findAllClients);         // Read All (GET)
router.get('/:id', clientController.findOneClient);       // Read One (GET by ID)
router.put('/:id', clientController.updateClient);        // Update (PUT)
router.delete('/:id', clientController.deleteClient);     // Delete (DELETE)
router.get('/:id',
      // [authJwt.verifyToken],
       clientController.getClientProfileByUtiId);


// NOUVELLE ROUTE : Classements généraux
// [GET] /api/clients/rankings : Classement des clients
//router.get('/rankings', clientController.getRankings);

// [GET] /api/clients/:id/history : Historique des locations d'un client
//router.get('/:id/history', clientController.getClientHistory);


module.exports = router;*/

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController'); 
// 🚨 DÉCOMMENTER ET S'ASSURER DU CHEMIN CORRECT
const { verifyToken } = require('../middleware/authJwt'); // Supposons que le chemin est correct

// ===============================================
// 1. ROUTES SPÉCIFIQUES (DOIVENT VENIR EN PREMIER)
// ===============================================

// [GET] /api/clients/rankings (Ne nécessite probablement pas d'authentification pour un classement public)
router.get('/rankings', clientController.getRankings);


// [GET] /api/clients/profile (CRITIQUE : Récupère le profil de l'utilisateur connecté via TOKEN)
// Doit être PROTÉGÉE par le middleware
router.get('/profile', 
    verifyToken, // 🚨 AUTHENTIFICATION OBLIGATOIRE
    clientController.getProfile // 🚨 Utiliser le nom de fonction correct (getProfile, comme dans les corrections précédentes)
);

// [GET] /api/clients/:idCli/history (Historique d'un client spécifique par son ID client)
router.get('/:idCli/history',
     verifyToken, // Probablement protégé
     clientController.getClientHistory);

// ===============================================
// 2. ROUTES GÉNÉRIQUES (CRUD)
// ===============================================

// CRUD Routes (Protégées si elles modifient la DB)
router.post('/', clientController.createClient);          
router.get('/', clientController.getAllClients);          // Read All 
router.get('/:idCli', clientController.findOneClient);     // Read One (GET by ID client)
router.put('/:idCli', clientController.updateClient);      
router.delete('/:idCli', clientController.deleteClient);     

module.exports = router;