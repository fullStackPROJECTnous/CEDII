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
const Location = db.Location; 
const Reservation = db.reservation; // Importez les modèles nécessaires
const Client = db.Client; 
const sequelize = db.Sequelize;
const Op = db.Sequelize.Op;
const Materiel = db.Materiel;
const Salle = db.Salle

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
                    as: 'client'
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

/*
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


*/

// Fonction corrigée pour récupérer les Réservations en attente (et non les Locations)
// backend/controllers/locationController.js (VERSION CORRIGÉE)

// Assurez-vous d'importer l'instance de Sequelize
//const sequelize = require('../config/db'); 
const { QueryTypes } = require('sequelize');
//const db = require('../models'); 
// Nécessaire pour typer la requête



exports.getPendingReservations = async (req, res) => {
    try {
        console.log('Tentative de chargement des réservations en attente...');
        
        // Requête SQL pour récupérer les réservations 'En attente' et 'Confirmée' avec le nom du client
        const sqlQuery = `
            SELECT 
                r.*, 
                c.nomCli, 
                c.prenomCli 
            FROM reservation r 
            LEFT JOIN client c ON r.idCli = c.idCli 
            WHERE r.etatRes IN ('En attente', 'Confirmée') 
            ORDER BY r.debRes ASC;
        `;
        
        // 🚨 Utilisation de sequelize.query, qui est la méthode correcte
        const [reservations] = await sequelize.query(sqlQuery, {
            type: QueryTypes.SELECT, // Pour retourner un tableau d'objets JSON
            raw: true 
        });
        
        console.log(`Réservations trouvées: ${reservations.length}`);
        res.json(reservations);
        
    } catch (error) {
        // 🚨 Renvoyer l'erreur exacte pour le diagnostic
        console.error('Erreur FATALE chargement réservations (500):', error.message);
        res.status(500).json({ 
            error: 'Erreur serveur lors du chargement des réservations', 
            detail: error.message 
        });
    }
};
// Récupère les 5 dernières réservations en attente avec le nom du demandeur (Utilisateur)
const sqlLatestPendingRequests = `
    SELECT 
        R.idRes AS id, 
        CONCAT(C.nomCli, ' ', C.prenomCli) AS demandeur,
        R.typeRes AS ressource, -- Utilisation de typeRes comme placeholder pour la ressource demandée
        R.debRes AS dateDebut, 
        R.etatRes AS etat, 
        R.dateCre AS dateSoumission
        FROM reservation R
        JOIN client C ON R.idCli = C.idCli
        WHERE R.etatRes = 'En attente'
        ORDER BY R.dateCre DESC
        LIMIT 5;
`;

// Requête pour les KPI
const sqlKpiPending = `
    SELECT COUNT(*) AS count
    FROM reservation
    WHERE etatRes = 'En attente';
`;

const sqlKpiTodayEvents = `
    SELECT COUNT(*) AS count
    FROM location
    WHERE DATE(debLo) = DATE(NOW()) OR DATE(finLo) = DATE(NOW());
`;

// Placeholder pour les ressources indisponibles (à adapter à votre table patrimoine/matériel)
const sqlKpiUnavailable = `
    SELECT COUNT(*) AS count
    FROM salle
    WHERE disponibiliteSalle = 'Maintenance';
`;
// --- Fonctions du Contrôleur ---


        
// 🚨 NOUVELLE FONCTION MAJEURE : Récupération des données du Tableau de Bord Réception
exports.getReceptionDashboardData = async (req, res) => {
    try {
        // Exécution des requêtes avec db.sequelize.query
        // 1. KPI Pending Requests
        const pendingResult = await db.sequelize.query(sqlKpiPending, { type: db.sequelize.QueryTypes.SELECT });
        const pendingRequests = pendingResult[0]?.count || 0;

        // 2. KPI Today Events
        const todayEventsResult = await db.sequelize.query(sqlKpiTodayEvents, { type: db.sequelize.QueryTypes.SELECT });
        const todayEvents = todayEventsResult[0]?.count || 0;

        // 3. KPI Unavailable Resources (peut-être urgentRequests à la place)
        const unavailableResult = await db.sequelize.query(sqlKpiUnavailable, { type: db.sequelize.QueryTypes.SELECT });
        const unavailableResources = unavailableResult[0]?.count || 0;
        
        // * Urgent Requests est ici un KPI arbitraire que nous mettons à 0, 
        //   vous pouvez le remplacer par un autre KPI si nécessaire
        const urgentRequests = 0; 

        // 4. Latest Requests (la liste du tableau)
        const latestRequests = await db.sequelize.query(sqlLatestPendingRequests, { type: db.sequelize.QueryTypes.SELECT });

        res.status(200).send({
            pendingRequests,
            urgentRequests,
            todayEvents,
            unavailableResources,
            latestRequests: latestRequests, // 🚨 C'est ici que les données du tableau sont envoyées
        });

 
        } catch (error) {
        console.error("Erreur de chargement du tableau de bord Réception:", error);
        res.status(500).send({ message: "Erreur serveur lors de la récupération des données du tableau de bord.", error: error.message });
    }
};


exports.updateReservationStatus = async (req, res) => {
    const { idRes } = req.params;
    const { newStatus } = req.body; // 'Confirmée' ou 'Refusée'

    if (newStatus !== 'Confirmée' && newStatus !== 'Refusée') {
        return res.status(400).send({ message: "Statut non valide." });
    }

    try {
        // Supposons que db.reservation est votre modèle
        const [numAffectedRows] = await db.reservation.update({ etatRes: newStatus }, {
            where: { idRes: idRes, etatRes: 'En attente' }
        });

        if (numAffectedRows === 1) {
            // 💡 Logique de notification à implémenter ici (ex: envoi d'email au client)
            res.send({ message: `Réservation #${idRes} mise à jour à '${newStatus}' avec succès.` });
        } else {
            res.status(404).send({ message: `Réservation #${idRes} non trouvée ou déjà traitée.` });
        }
    } catch(error) {
        console.error(`Erreur lors de la mise à jour de la réservation #${idRes}:`, error);
        res.status(500).send({ message: "Erreur serveur lors de la mise à jour.", error: error.message });
    }
}



;

// locationController.js

// ... (vos autres fonctions exports.getPendingReservations, etc.)

exports.getConfirmedEvents = async (req, res) => {
    try {
        const confirmedEvents = await Location.findAll({
            // Filtrer explicitement les événements Confirmés
            where: { 
                etatLo: 'Confirmée' 
            },
            
            // CRITIQUE : INCLUSIONS IMBRIQUÉES
            include: [{
                // 1. Inclure la Réservation (associée à la Location)
                model: Reservation, 
                as: 'reservation', // 🚨 CET ALIAS DOIT ÊTRE DÉFINI DANS models/location.js
                
                // 2. Inclure le Client (associé à la Réservation)
                include: [{
                    model: Client,
                    as: 'client', // 🚨 CET ALIAS DOIT ÊTRE DÉFINI DANS models/reservation.js
                    attributes: ['nomCli', 'prenomCli']
                }]
            }],

            order: [['debLo', 'ASC']],
            // Liste des attributs pour la performance
            attributes: ['idLo', 'debLo', 'finLo', 'typeLo', 'etatLo', 'idRes']
        });

        res.status(200).json(confirmedEvents);
        
    } catch (error) {
        // En cas d'échec de la requête SQL (500), renvoyer l'erreur réelle
        console.error("Erreur critique lors de la récupération des événements confirmés (Vérifiez les associations Sequelize) :", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des événements confirmés.", 
            error: error.message // 💡 Renvoyer l'erreur Sequelize pour débogage
        });
    }
};


exports.checkAvailability = async (req, res) => {
    // Récupération des paramètres de la requête GET (via req.query)
    const { type, start, end } = req.query;

    if (!start || !end || !type) {
        return res.status(400).send({ message: "Veuillez spécifier le type de ressource, la date de début et la date de fin." });
    }

    try {
        const Op = db.Sequelize.Op; // Opérateur Sequelize pour les conditions complexes
        
        const startTime = new Date(start);
        const endTime = new Date(end);

        if (startTime >= endTime) {
            return res.status(400).send({ message: "La date de début doit être antérieure à la date de fin." });
        }

        let totalResources = [];
        
        // 🚨 Condition d'overlap : 
        // Une Location occupe l'intervalle [start, end] si :
        // (Location.debLo < end) ET (Location.finLo > start)
        const overlapCondition = {
            debLo: { [Op.lt]: endTime },
            finLo: { [Op.gt]: startTime },
            etatLo: 'Confirmée'
            // N'inclut que les événements qui ne sont PAS en attente ou annulés
          //  etatLo: { [Op.notIn]: ['En attente', 'Annulée'] } 
        };

        // --- Logique pour les Salles (Type 'Salle' ou 'Mixte') ---
        if (type === 'Salle' || type === 'Mixte') {
            
            // 1. Trouver les ID des Salles occupées
            const occupiedLocations = await Location.findAll({
                where: {
                    ...overlapCondition,
                    idSalle: { [Op.ne]: null } // Se concentrer sur les Salles
                },
                attributes: ['idSalle'],
                group: ['idSalle'] 
            });

            const occupiedSalleIds = occupiedLocations.map(loc => loc.idSalle);
            
            // 2. Trouver toutes les Salles
            const allSalles = await Salle.findAll({
                attributes: ['idSalle', 'nomSalle'] // Supposons 'nomSalle' existe
            });

            // 3. Filtrer les Salles disponibles
            const availableSalles = allSalles
                .filter(salle => !occupiedSalleIds.includes(salle.idSalle))
                .map(salle => ({
                    id: salle.idSalle,
                    nom: salle.nomSalle,
                    type: 'Salle',
                    disponible: true
                }));
            
            totalResources.push(...availableSalles);
        }

        // --- Logique pour le Matériel (Type 'Materiel' ou 'Mixte') ---
        if (type === 'Materiel' || type === 'Mixte') {
            
            // ⚠️ ATTENTION: Cette logique est une simplification. 
            // La gestion réelle du matériel doit considérer la QUANTITÉ disponible.
            // Ici, nous considérons le matériel comme occupé si AU MOINS UNE unité est réservée.

            // 1. Trouver les codes Matériel occupés
            const occupiedMateriels = await Location.findAll({
                where: {
                    ...overlapCondition,
                    codeMat: { [Op.ne]: null } // Se concentrer sur le Matériel
                },
                attributes: ['codeMat'],
                group: ['codeMat'] 
            });

            const occupiedMaterielCodes = occupiedMateriels.map(loc => loc.codeMat);
            
            // 2. Trouver tout le Matériel
            const allMateriel = await Materiel.findAll({
                attributes: ['codeMat', 'nomMat'] // Supposons 'nomMat' existe
            });

            // 3. Filtrer le Matériel disponible (s'il n'est pas dans la liste des codes occupés)
            const availableMateriel = allMateriel
                .filter(mat => !occupiedMaterielCodes.includes(mat.codeMat))
                .map(mat => ({
                    id: mat.codeMat,
                    nom: mat.nomMat,
                    type: 'Matériel',
                    disponible: true // Simplifié (devrait vérifier la quantité)
                }));
            
            totalResources.push(...availableMateriel);
        }

        // Renvoi final, filtré si le type est spécifique
        if (type === 'Salle') {
             return res.status(200).json(totalResources.filter(res => res.type === 'Salle'));
        } else if (type === 'Materiel') {
             return res.status(200).json(totalResources.filter(res => res.type === 'Matériel'));
        }
        
        // Si 'Mixte', on renvoie toutes les ressources disponibles trouvées
        res.status(200).json(totalResources);


    } catch (error) {
        console.error("Erreur lors de la vérification de disponibilité:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la vérification de disponibilité.", 
            error: error.message 
        });
    }
};