/*
const db = require('../models'); 
const Client = db.Client; 
const Utilisateur = db.utilisateur;
const Location = db.location; // 🚨 Assurez-vous d'avoir ce modèle
const sequelize = db.sequelize; // Nécessaire pour les fonctions d'agrégation (Fn, literal)

/* --- CREATE (POST) : Associe une nouvelle fiche client à un utilisateur existant --- 
exports.createClient = async (req, res) => {
    const { idUti, nomCli, prenomCli, emailCli, telephoneCli, addresseCli, typeCli, statutCli } = req.body; 

    if (!idUti || !nomCli) {
        return res.status(400).send({ 
            message: "L'ID Utilisateur (idUti) et le Nom du Client (nomCli) sont requis pour la création de la fiche." 
        });
    }

    try {
        const utilisateur = await Utilisateur.findByPk(idUti);
        if (!utilisateur) {
            return res.status(404).send({ 
                message: `L'Utilisateur avec l'ID ${idUti} n'existe pas.` 
            });
        }
        
        const existingClient = await Client.findOne({ where: { idUti: idUti } });
        if (existingClient) {
            return res.status(409).send({ 
                message: "Cet Utilisateur est déjà associé à une fiche client." 
            });
        }

        const newClient = await Client.create({
            nomCli, prenomCli, emailCli, telephoneCli, addresseCli, typeCli, statutCli, idUti
        });

        res.status(201).send(newClient); 

    } catch (error) {
        console.error("Erreur de création Client/Association:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la création de la fiche client.", 
            error: error.message 
        });
    }
};

/* --- READ ALL (GET) : Récupère tous les clients avec un résumé de l'activité --- 
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            // 🚨 Inclure le compte des locations pour le classement "actif"
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('locations.idLoc')), 'nbLocations'],
                    // Ajoutez le calcul du revenu total si vous avez le champ 'montantTotal' dans la table Location
                    [sequelize.fn('SUM', sequelize.col('locations.tarifTot')), 'revenuTotal']
                ]
            },
            include: [{
                model: Location, // Assurez-vous que l'alias 'locations' dans client.js correspond
                as: 'locations',
                attributes: [], // Ne pas afficher les détails des locations, juste les compter
                required: false // LEFT JOIN: inclut les clients sans location
            }],
           group: ['Client.idCli', 'locations.idLo']  // Grouper par client pour que COUNT et SUM fonctionnent
        });
        res.status(200).send(clients);
    } catch (error) {
        console.error("Erreur Sequelize lors de la récupération des clients:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des clients.", 
            error: error.message 
        });
    }
};

/* --- READ ONE (GET by ID) ---
exports.findOneClient = async (req, res) => {
    // ... (Code inchangé)
    const id = req.params.id; 
    try {
        const client = await Client.findByPk(id);
        if (client) {
            res.status(200).send(client);
        } else {
            res.status(404).send({ message: `Client with id=${id} not found.` });
        }
    } catch (error) {
        console.error(`Error retrieving client with id=${id}:`, error);
        res.status(500).send({ message: "Error retrieving client", error: error.message });
    }
};

/* --- UPDATE (PUT/PATCH) --- 
exports.updateClient = async (req, res) => {
    // ... (Code inchangé)
    const idCli = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "Le corps de la requête (req.body) ne doit pas être vide pour la mise à jour."
        });
    }

    try {
         const [numAffectedRows] = await Client.update(req.body, {
            where: { idCli: idCli }
        });

        if (numAffectedRows === 1) {
            res.send({ message: "Client a été mis à jour avec succès." });
        } else {
            res.status(404).send({
                message: `Cannot update Client with id=${idCli}. Maybe Client was not found or the data was identical!`
            });
        }
    } catch(error) {
         console.error(`Error updating client with id=${idCli}:`, error);
         res.status(500).send({ message: "Error updating client", error: error.message });
    }
};

/* --- DELETE (DELETE) --- 
exports.deleteClient = async (req, res) => {
    // ... (Code inchangé)
    const id = req.params.id;
    try {
        const numDeletedRows = await Client.destroy({
            where: { idCli: id }
        });

        if (numDeletedRows === 1) {
            res.send({ message: "Client was deleted successfully!" });
        } else {
            res.status(404).send({
                message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
            });
        }
    } catch (error) {
        console.error(`Error deleting client with id=${id}:`, error);
        res.status(500).send({ message: "Could not delete client", error: error.message });
    }
};


/* ================================================= */
/*               NOUVELLES FONCTIONNALITÉS            */
/* ================================================= */


/* --- Historique des Locations (GET /:id/history) --- 
exports.getClientHistory = async (req, res) => {
    const idCli = req.params.id;

    try {
        const client = await Client.findByPk(idCli, {
            // Inclure toutes les locations associées
            include: [{
                model: Location,
                as: 'locations',
                // Vous pouvez ajouter des attributs spécifiques de Location ici si besoin
                // attributes: ['idLoc', 'dateDebutLoc', 'dateFinLoc', 'montantTotalLoc', 'statutLoc'],
                order: [['dateDebutLoc', 'DESC']] // Les plus récentes en premier
            }]
        });

        if (!client) {
            return res.status(404).send({ message: `Client with id=${idCli} not found.` });
        }

        // Retourne les informations du client + son tableau de locations
        res.status(200).send(client.locations);

    } catch (error) {
        console.error("Erreur de récupération de l'historique client:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération de l'historique des locations.", 
            error: error.message 
        });
    }
};


/* --- Classements (GET /rankings) --- 
exports.getRankings = async (req, res) => {
    try {
        // La logique est principalement gérée dans getAllClients (agrégation)
        // Ici, nous récupérons les données agrégées et les trions
        const rankedClients = await Client.findAll({
            attributes: [
                'idCli', 'nomCli', 'prenomCli', 'telephoneCli',
                [sequelize.fn('COUNT', sequelize.col('locations.idLoc')), 'nbLocations'],
                [sequelize.fn('SUM', sequelize.col('locations.montantTotalLoc')), 'revenuTotal']
            ],
            include: [{
                model: Location,
                as: 'locations',
                attributes: [],
                required: false // Inclure même ceux sans location
            }],
            group: ['Client.idCli'],
            order: [
                [sequelize.literal('nbLocations'), 'DESC'],   // Classement par activité
                [sequelize.literal('revenuTotal'), 'DESC']   // Classement par rentabilité
            ],
            // Limiter si nécessaire (ex: TOP 10)
            // limit: 10
        });

        // Formater les données pour une meilleure lisibilité (gestion des NULL)
        const formattedRankings = rankedClients.map(client => ({
            idCli: client.idCli,
            nomComplet: `${client.nomCli} ${client.prenomCli}`,
            telephone: client.telephoneCli,
            nbLocations: parseInt(client.dataValues.nbLocations || 0, 10),
            revenuTotal: parseFloat(client.dataValues.revenuTotal || 0).toFixed(2)
        }));


        res.status(200).send(formattedRankings);

    } catch (error) {
        console.error("Erreur de récupération des classements clients:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des classements.", 
            error: error.message 
        });
    }
};*/

// controllers/clientController.js

const db = require('../models'); 
//const database = require('../config/db'); 
const Client = db.Client; 
const Utilisateur = db.utilisateur;
const Location = db.location; // Modèle de location
const sequelize = db.sequelize; // Instance Sequelize pour les fonctions d'agrégation

/* --- CREATE (POST) : Associe une nouvelle fiche client à un utilisateur existant --- */
exports.createClient = async (req, res) => {
    const { idUti, nomCli, prenomCli, emailCli, telephoneCli, addresseCli, typeCli, statutCli } = req.body; 

    if (!idUti || !nomCli) {
        return res.status(400).send({ 
            message: "L'ID Utilisateur (idUti) et le Nom du Client (nomCli) sont requis pour la création de la fiche." 
        });
    }

    try {
        // 1. Vérification de l'existence de l'utilisateur
        const utilisateur = await Utilisateur.findByPk(idUti);
        if (!utilisateur) {
            return res.status(404).send({ 
                message: `L'Utilisateur avec l'ID ${idUti} n'existe pas.` 
            });
        }
        
        // 2. Vérification que l'Utilisateur n'a pas déjà une fiche client
        const existingClient = await Client.findOne({ where: { idUti: idUti } });
        if (existingClient) {
            return res.status(409).send({ 
                message: "Cet Utilisateur est déjà associé à une fiche client." 
            });
        }

        // 3. Création du client
        const newClient = await Client.create({
            nomCli, prenomCli, emailCli, telephoneCli, addresseCli, typeCli, statutCli, idUti
        });

        res.status(201).send(newClient); 

    } catch (error) {
        console.error("Erreur de création Client/Association:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la création de la fiche client.", 
            error: error.message 
        });
    }
};

/* --- READ ALL (GET) : Récupère tous les clients avec un résumé de l'activité --- */
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            attributes: {
                include: [
                   // [sequelize.fn('COUNT', sequelize.col('locations.idLoc')), 'nbLocations'],
                    // Assurez-vous que 'tarifTot' est le nom de colonne correct dans Location
                  //  [sequelize.fn('SUM', sequelize.col('locations.tarifTot')), 'revenuTotal']
                ]
            },
           /* include: [{
                model: Location, 
                as: 'locations',
                attributes: [], 
                required: false // LEFT JOIN
            }],
            // 🚨 CORRECTION CRITIQUE: 'locations.idLoc' est utilisé pour le groupement 
            // car 'idLoc' est probablement la clé primaire de la table Location (comme dans le COUNT)
            group: ['Client.idCli', 'locations.idLoc'] */
        });
        res.status(200).send(clients);
    } catch (error) {
        console.error("Erreur Sequelize lors de la récupération des clients:", error);
        // Retourne un 500 avec le message d'erreur Sequelize
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des clients. Vérifiez les logs.", 
            error: error.message 
        });
    }
};

/* --- READ ONE (GET by ID) --- */
exports.findOneClient = async (req, res) => {
    const id = req.params.id; 
    try {
        const client = await Client.findByPk(id);
        if (client) {
            res.status(200).send(client);
        } else {
            res.status(404).send({ message: `Client with id=${id} not found.` });
        }
    } catch (error) {
        console.error(`Error retrieving client with id=${id}:`, error);
        res.status(500).send({ message: "Error retrieving client", error: error.message });
    }
};

/* --- UPDATE (PUT/PATCH) --- */
exports.updateClient = async (req, res) => {
    const idCli = req.params.id;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({
            message: "Le corps de la requête ne doit pas être vide pour la mise à jour."
        });
    }

    try {
        const [numAffectedRows] = await Client.update(req.body, {
            where: { idCli: idCli }
        });

        if (numAffectedRows === 1) {
            res.send({ message: "Client a été mis à jour avec succès." });
        } else {
            res.status(404).send({
                message: `Cannot update Client with id=${idCli}. Le client n'a pas été trouvé ou les données étaient identiques!`
            });
        }
    } catch(error) {
        console.error(`Error updating client with id=${idCli}:`, error);
        res.status(500).send({ message: "Error updating client", error: error.message });
    }
};

/* --- DELETE (DELETE) --- */
exports.deleteClient = async (req, res) => {
    const id = req.params.id;
    try {
        const numDeletedRows = await Client.destroy({
            where: { idCli: id }
        });

        if (numDeletedRows === 1) {
            res.send({ message: "Client was deleted successfully!" });
        } else {
            res.status(404).send({
                message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
            });
        }
    } catch (error) {
        console.error(`Error deleting client with id=${id}:`, error);
        res.status(500).send({ message: "Could not delete client", error: error.message });
    }
};

/* --- Historique des Locations (GET /:id/history) --- */
/*exports.getClientHistory = async (req, res) => {
    const idCli = req.params.id;

    try {
        const client = await Client.findByPk(idCli, {
            include: [{
                model: Location,
                as: 'locations',
                order: [['dateDebutLoc', 'DESC']]
            }]
        });

        if (!client) {
            return res.status(404).send({ message: `Client with id=${idCli} not found.` });
        }

        res.status(200).send(client.locations);

    } catch (error) {
        console.error("Erreur de récupération de l'historique client:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération de l'historique des locations.", 
            error: error.message 
        });
    }
};
*/
/* --- Classements (GET /rankings) --- */
/*exports.getRankings = async (req, res) => {
    try {
        const rankedClients = await Client.findAll({
            attributes: [
                'idCli', 'nomCli', 'prenomCli', 'telephoneCli',
                [sequelize.fn('COUNT', sequelize.col('locations.idLoc')), 'nbLocations'],
                [sequelize.fn('SUM', sequelize.col('locations.tarifTot')), 'revenuTotal']
            ],
            include: [{
                model: Location,
                as: 'locations',
                attributes: [],
                required: false 
            }],
            group: ['Client.idCli', 'locations.idLoc'],
            order: [
                [sequelize.literal('nbLocations'), 'DESC'], 
                [sequelize.literal('revenuTotal'), 'DESC'] 
            ],
        });

        // Formater les données pour l'affichage
        const formattedRankings = rankedClients.map(client => ({
            idCli: client.idCli,
            nomComplet: `${client.nomCli} ${client.prenomCli}`,
            telephone: client.telephoneCli,
            nbLocations: parseInt(client.dataValues.nbLocations || 0, 10),
            revenuTotal: parseFloat(client.dataValues.revenuTotal || 0).toFixed(2)
        }));

        res.status(200).send(formattedRankings);

    } catch (error) {
        console.error("Erreur de récupération des classements clients:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des classements. Vérifiez les logs.", 
            error: error.message 
        });
    }
};

*/
// Côté BACKEND : controllers/ClientController.js (Exemple de nom de fichier)

// 🚨 REMPLACEZ PAR LE CHEMIN RÉEL VERS VOTRE CONNEXION DB 🚨


// REQUÊTES SQL PRÉCÉDEMMENT FOURNIES

// CORRECTION des requêtes SQL dans clientController.js
const sqlTopClient = `
    SELECT 
        C.nomCli, 
        C.prenomCli, 
        COALESCE(SUM(P.montantPaie), 0) AS totalRevenue
    FROM client C 
    LEFT JOIN reservation R ON C.idCli = R.idCli 
    LEFT JOIN location L ON R.idRes = L.idRes 
    LEFT JOIN paiement P ON L.idLo = P.idLo
    WHERE P.statutPaie = 'Effectué' 
        AND MONTH(P.dateCre) = MONTH(CURRENT_DATE())
        AND YEAR(P.dateCre) = YEAR(CURRENT_DATE())
    GROUP BY C.idCli, C.nomCli, C.prenomCli
    ORDER BY totalRevenue DESC 
    LIMIT 1;
`;

const sqlActiveClient = `
    SELECT 
        C.nomCli, 
        C.prenomCli, 
        COUNT(L.idLo) AS totalLocations
    FROM client C 
    LEFT JOIN reservation R ON C.idCli = R.idCli 
    LEFT JOIN location L ON R.idRes = L.idRes
    WHERE L.etatLo IN ('Confirmée', 'Terminée')
        AND MONTH(L.dateCre) = MONTH(CURRENT_DATE())
        AND YEAR(L.dateCre) = YEAR(CURRENT_DATE())
    GROUP BY C.idCli, C.nomCli, C.prenomCli
    ORDER BY totalLocations DESC 
    LIMIT 1;
`;


// ----------------------------------------------------------------------
// GESTION DES CLASSEMENTS
// ----------------------------------------------------------------------

// CORRECTION dans clientController.js - exports.getRankings
exports.getRankings = async (req, res) => {
    try {
        // 🚨 CORRECTION: Utilisation correcte de sequelize.query
        const topClientResult = await sequelize.query(sqlTopClient, { 
            type: sequelize.QueryTypes.SELECT 
        });
        
        const activeClientResult = await sequelize.query(sqlActiveClient, { 
            type: sequelize.QueryTypes.SELECT 
        });

        // 🚨 CORRECTION: Les résultats sont directement dans les variables
        res.status(200).send({
            topClient: topClientResult[0] || {}, // Premier élément du tableau
            activeClient: activeClientResult[0] || {}
        });
    } catch (error) {
        console.error("Erreur SQL lors de getRankings:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors du classement.", 
            details: error.message 
        });
    }
};


// ----------------------------------------------------------------------
// GESTION DE L'HISTORIQUE CLIENT
// ----------------------------------------------------------------------


// CORRECTION dans clientController.js - exports.getClientHistory
exports.getClientHistory = async (req, res) => {
    const idCli = req.params.idCli || req.params.id;    

    const sqlLocations = `
        SELECT 
            L.idLo, 
            L.dateCre, 
            L.debLo AS dateDebut, 
            L.finLo AS dateFin, 
            L.tarifTot AS montant, 
            L.typeLo
        FROM location L 
        JOIN reservation R ON L.idRes = R.idRes
        WHERE R.idCli = ? 
        AND L.etatLo = 'Terminée'
        ORDER BY L.dateCre DESC;
    `;
    
    const sqlReservations = `
        SELECT 
            R.idRes AS idResa, 
            R.dateCre AS dateResa, 
            R.debRes AS dateDebut, 
            R.finRes AS dateFin, 
            R.typeRes AS type, 
            R.etatRes AS statut
        FROM reservation R
        WHERE R.idCli = ? 
        AND R.etatRes IN ('En attente', 'Confirmée')
        ORDER BY R.debRes ASC;
    `;

    try {
        // 🚨 CORRECTION: Utilisation correcte de sequelize.query
        const locations = await sequelize.query(sqlLocations, { 
            replacements: [idCli],
            type: sequelize.QueryTypes.SELECT
        });
        
        const reservations = await sequelize.query(sqlReservations, { 
            replacements: [idCli],
            type: sequelize.QueryTypes.SELECT
        });

        // 🚨 CORRECTION: Envoyer directement les tableaux
        res.status(200).send({
            locations: locations || [],
            reservations: reservations || []
        });

    } catch (error) {
        console.error("Erreur SQL lors de getClientHistory:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération de l'historique.", 
            details: error.message 
        });
    }
};