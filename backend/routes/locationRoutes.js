

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// --- Gestion des Locations et Réservations ---

// 1. Consultation du catalogue & Vérification de disponibilité en temps réel
router.get('/availability', locationController.checkAvailability);

// 2. Formulaire de demande de réservation ou de location
router.post('/reservations', locationController.createReservation); 

// 3. Récupérer les détails d'une réservation (pour la validation)
// AJOUTER cette fonction au contrôleur si elle n'existe pas.
router.get('/reservations/:idRes/details', locationController.getReservationDetails);

// 4. Validation par la Réception, Génération Contrat, Signature (transfert à Location)
router.post('/reservations/:idRes/validate', locationController.validateReservation);

// 5. Mise à jour de statut simple (Annuler/Refuser)
router.put('/reservations/:idRes/status', locationController.updateReservationStatus); 

// --- Gestion des Locations (État des Lieux & Stock) ---

// Récupération des Locations Confirmées (pour les départs/retours à venir)
router.get('/events/confirmed', locationController.getConfirmedEvents);

// 6. État de lieux de départ/Vérification de l’état au retour/Facturation des dégradations/Remise en stock
router.post('/locations/:idLo/etat-lieux', locationController.submitEtatLieux);

// --- Routes Générales ---

router.get('/reception/dashboard', locationController.getReceptionDashboardData); 
router.get('/reservations/pending', locationController.getPendingReservations); // Liste des résa en attente
router.get('/', locationController.getAllLocations); // Historique des locations/réservations

module.exports = router;