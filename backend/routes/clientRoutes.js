
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
router.get('/me', clientController.getCurrentClient);


// [GET] /api/clients/profile (CRITIQUE : Récupère le profil de l'utilisateur connecté via TOKEN)
// Doit être PROTÉGÉE par le middleware
router.get('/profile', clientController.getMyProfile);
// 🚨 AJOUTEZ CETTE ROUTE POUR LES RÉSERVATIONS
router.get('/:id/reservations', clientController.getClientReservations);

router.get('/revenue-by-client-type', clientController.getRevenueByClientType);

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
router.put('/:id', clientController.updateClient);      
router.delete('/:id', clientController.deleteClient);     

module.exports = router;