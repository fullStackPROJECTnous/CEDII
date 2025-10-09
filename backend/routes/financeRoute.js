const express = require('express');
const router = express.Router();
const financeCtrl = require('../controllers/financeController');

// Simule la "génération" de facture en obtenant les détails financiers d'une location
router.get('/facture/details/:idLo', financeCtrl.getFactureDetails);

// Suivi des paiements et retards (liste de toutes les locations non soldées)
router.get('/suivi', financeCtrl.getAllLocationsFinancieresSuivi); 

// Enregistrement d'un paiement (utilisant l'ID de la Location, idLo)
router.post('/paiements/record/:idLo', financeCtrl.recordPaiement);

module.exports = router;