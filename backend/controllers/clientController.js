// controllers/clientController.js

const db = require('../models'); 
//const database = require('../config/db'); 
const Client = db.Client; 
const Utilisateur = db.utilisateur;
const Location = db.Location; // Modèle de location
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


exports.getClientProfileByUtiId = async (req, res) => {
    
    // 1. Récupérer l'ID de l'utilisateur. 
    //    Priorité 1: L'ID attaché par le middleware JWT (req.userId). C'est la source pour /profile.
    //    Priorité 2: L'ID passé dans l'URL (req.params.id). C'est la source pour /clients/:id.
    const idUtiFromSources = req.userId || req.params.id; 
    
    // Assurer que l'ID est un nombre entier.
    // La variable de travail est maintenant nommée 'idUti' pour correspondre au champ BDD.
    const idUti = parseInt(idUtiFromSources, 10);
    
    console.log(`[VERIF FINALE] Tentative de récupération pour idUti : ${idUti}`);

    // Si le middleware 'verifyToken' n'a pas pu attacher l'ID ou si aucun paramètre n'est passé.
    if (!idUti || isNaN(idUti)) {
        console.error("[VERIF FINALE] ÉCHEC 401 : ID utilisateur manquant ou invalide.");
        return res.status(401).send({ message: "Authentification requise. ID utilisateur non disponible ou invalide." });
    }

    try {
        // Utilisation de Client.findOne pour chercher le profil lié à l'idUti
        const clientProfile = await Client.findOne({
            // ✅ UTILISATION DU NOM DE CHAMP BDD DIRECTEMENT DANS LE WHERE
            where: { idUti: idUti }, 
            attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli', 'adresseCli']
        });
        
        // 3. Traitement des résultats
        if (clientProfile) {
            console.log(`[VERIF FINALE] SUCCÈS : Fiche client trouvée (idCli: ${clientProfile.idCli})`);
            res.status(200).send(clientProfile); 
        } else {
            console.warn(`[VERIF FINALE] ÉCHEC 404 : AUCUNE fiche client trouvée pour idUti=${idUti}.`);
            res.status(404).send({ 
                message: `Fiche Client non trouvée pour l'Utilisateur avec idUti=${idUti}.` 
            });
        }
    } catch (error) {
        console.error(`Erreur critique lors de la récupération du client par idUti=${idUti}:`, error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération du profil client. Problème de connexion BDD/SQL.", 
            error: error.message 
        });
    }
};

// Supposons que db est votre objet de connexion à la base de données

exports.getMyProfile = async (req, res) => {
    // 🚀 Récupère l'ID de l'utilisateur de la requête (injecté par verifyToken)
    const idUtilisateur = req.idUti; 

    // Vérification de sécurité (ne devrait pas être undefined si le 401 a été évité)
    if (!idUtilisateur) {
        return res.status(400).send({ message: "ID utilisateur non disponible. Problème d'authentification interne." });
    }

    try {
        // Requête pour joindre les tables utilisateur et client pour obtenir toutes les infos
        const sql = `
            SELECT 
                C.idCli, 
                C.nomCli, 
                C.prenomCli, 
                C.emailCli, 
                C.telephoneCli, 
                C.addresseCli, 
                C.typeCli, 
                C.statutCli,
                U.loginUti,
                U.roleUti
            FROM client C
            JOIN utilisateur U ON C.idUti = U.idUti
            WHERE C.idUti = ?; 
        `;
        
        // Exécutez la requête avec l'idUtilisateur
        // 🚨 Remplacez 'db.query' par la méthode utilisée dans votre projet (ex: pool.execute, Model.findOne)
        const [clientData] = await db.query(sql, [idUtilisateur]); 

        if (clientData.length === 0) {
            // Le token est valide, mais aucun enregistrement client ne correspond à cet idUti
            return res.status(404).send({ message: "Profil client non trouvé. L'utilisateur n'est pas lié à un client." });
        }

        // Succès
        res.status(200).send(clientData[0]); 

    } catch (error) {
        console.error("Erreur serveur lors de la récupération du profil:", error);
        res.status(500).send({ message: "Erreur serveur lors de la récupération du profil." });
    }
};