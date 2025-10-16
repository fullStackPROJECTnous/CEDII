// routes/clientRoutes.js

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController'); // Adjust path as needed

// CRUD Routes
router.post('/', clientController.createClient);          // Create (POST)
router.get('/', clientController.getAllClients);
//router.get('/', clientController.findAllClients);         // Read All (GET)
router.get('/:id', clientController.findOneClient);       // Read One (GET by ID)
router.put('/:id', clientController.updateClient);        // Update (PUT)
router.delete('/:id', clientController.deleteClient);     // Delete (DELETE)

// [GET] /api/clients/rankings : Classement des clients
//router.get('/rankings', clientController.getRankings);

// [GET] /api/clients/:id/history : Historique des locations d'un client
//router.get('/:id/history', clientController.getClientHistory);


module.exports = router;