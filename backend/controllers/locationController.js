/*const db = require('../models');

const Reservation = db.Reservation;
const Location = db.Location;
const Client = db.Client; // Pour inclure les informations du client

// Options pour inclure le nom du client dans les résultats de réservation
const includeOptions = {
    include: [{
        model: Client, 
        as: 'Client', // Utilise l'alias défini dans l'association
        attributes: ['nomCli', 'prenomCli', 'emailCli']
    }]
};


// 1. Récupérer les réservations actives (En attente ou Confirmée)
exports.getPendingReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: {
                etatRes: ['En attente', 'Confirmée']
            },
            ...includeOptions,
            order: [['debRes', 'ASC']]
        });
        res.status(200).send(reservations);
    } catch (error) {
        res.status(500).send({ message: "Erreur de récupération des réservations actives.", error: error.message });
    }
};

// 2. Récupérer l'historique des locations (Terminée)
exports.getLocationHistory = async (req, res) => {
    try {
        const locations = await Location.findAll({
            where: {
                etatLo: 'Terminée'
            },
            order: [['dateCre', 'DESC']]
        });
        res.status(200).send(locations);
    } catch (error) {
        res.status(500).send({ message: "Erreur de récupération de l'historique des locations.", error: error.message });
    }
};

// 3. Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
    try {
        const nouvelleReservation = await Reservation.create(req.body);
        res.status(201).send(nouvelleReservation);
    } catch (error) {
        res.status(400).send({ message: "Erreur de validation lors de la création de la réservation.", error: error.message });
    }
};

// 4. Mettre à jour le statut d'une réservation (Confirmer, Annuler)
exports.updateReservationStatus = async (req, res) => {
    const { status } = req.body; // Doit être 'Confirmée', 'Annulée', etc.
    const idRes = req.params.id;

    try {
        const [updated] = await Reservation.update({ etatRes: status }, {
            where: { idRes: idRes }
        });

        if (updated && status === 'Confirmée') {
            // OPTIONNEL: Si Confirmée, copier la réservation dans la table 'location'
            // Ceci est la logique métier qui doit être implémentée si votre location dépend de la reservation
        }

        if (updated) {
            const updatedRes = await Reservation.findByPk(idRes, includeOptions);
            return res.status(200).send(updatedRes);
        }
        res.status(404).send({ message: 'Réservation non trouvée.' });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la mise à jour du statut.", error: error.message });
    }
};

// 5. Supprimer une réservation
exports.deleteReservation = async (req, res) => {
    try {
        const deleted = await Reservation.destroy({
            where: { idRes: req.params.id }
        });
        if (deleted) {
            return res.status(204).send({ message: "Réservation supprimée avec succès." });
        }
        res.status(404).send({ message: "Réservation non trouvée." });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la suppression.", error: error.message });
    }
};*/

// backend/controllers/locationController.js

const db = require('../models');
// 🚨 db.location doit être en minuscules, correspondant à la clé dans index.js
const Location = db.location; 
const Reservation = db.reservation; // Importez les modèles nécessaires
const Client = db.Client; 
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll({
            // 🚨 Correction du 'Include'
            include: [{ // ⬅️ Utilisez 'include' en minuscule et OUVERTURE d'objet {
                // Inclure la Réservation
                model: Reservation,
                // Dans la Reservation, inclure le Client
                include: [{
                    model: Client,
                    as: 'ClientData'
                }]
            }], // ⬅️ FERMETURE d'objet } et du tableau []
            order: [['dateCre', 'DESC']]
        });
// ...
        
        res.status(200).json(locations);
        
    } catch (error) {
        console.error("Erreur de chargement des locations:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des locations.", 
            error: error.message 
        });
    }
};

/*exports.getPendingReservations = async (req, res) => {
    try {
        const Location = db.location; // Récupérez le modèle Location
        
        // Trouver les locations/réservations dont l'état est 'En attente'
        const pendingLocations = await Location.findAll({
            where: { etatLo: 'En attente' }, // 🚨 Utilisez le nom de colonne et la valeur ENUM corrects
            // Assurez-vous d'inclure les associations si nécessaire pour les afficher sur le dashboard
            order: [['debLo', 'ASC']]
        });

        res.status(200).json(pendingLocations);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des événements en attente:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des événements en attente.", 
            error: error.message 
        });
    }
};


// ... autres fonctions CRUD : createLocation, updateLocation, deleteLocation

*/

// Ligne 130 (Exemple)
exports.getPendingReservations = async (req, res) => {
    try {
        const Location = db.location; // Récupérez le modèle Location
        
        // Trouver les locations/réservations dont l'état est 'En attente'
        const pendingLocations = await Location.findAll({
            where: { etatLo: 'En attente' }, // Utilisez le nom de colonne et la valeur ENUM corrects
            order: [['debLo', 'ASC']],
            
            // 💡 CORRECTION POUR L'ERREUR 500 : 
            // Nous listons explicitement les attributs disponibles pour ignorer 'montantTotal'
            // qui est manquant dans la DB. Assurez-vous que cette liste reflète les vraies colonnes.
            attributes: [
                'idLo', 
                'idRes', 
                'debLo', 
                'finLo', 
                'typeLo', 
                'etatLo',
                'tarifTot'
                // Si vous avez d'autres colonnes existantes dans la table `location` et nécessaires, ajoutez-les ici.
            ], 
            
            // Si vous devez inclure des données d'association (par exemple, le Client ou le Matériel)
            // Vous ajouteriez l'option `include: [...]` ici.
        });

        res.status(200).json(pendingLocations);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des événements en attente:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des événements en attente.", 
            error: error.message 
        });
    }
};
