
const db = require('../models'); 
const Client = db.Client; 
const Utilisateur = db.utilisateur;
const Location = db.Location;
const Reservation = db.Reservation;
const Salle = db.Salle;
const Materiel = db.Materiel;
const sequelize = db.sequelize;
const Paiement = db.Paiement;

/* --- CREATE (POST) : Associe une nouvelle fiche client à un utilisateur existant --- */
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

/* --- READ ALL (GET) : Récupère tous les clients avec un résumé de l'activité --- */
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll({
            attributes: {
                include: []
            },
        });
        res.status(200).send(clients);
    } catch (error) {
        console.error("Erreur Sequelize lors de la récupération des clients:", error);
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
    try {
        console.log('📝 req.params:', req.params);
        console.log('📝 req.body:', req.body);
        
        const id = req.params.id;
        
        if (id === undefined || id === null) {
            return res.status(400).send({
                message: "ID client manquant dans l'URL"
            });
        }

        const clientId = parseInt(id);
        
        if (isNaN(clientId)) {
            return res.status(400).send({
                message: "ID client invalide"
            });
        }

        console.log('🔄 Mise à jour client ID:', clientId);

        const [updated] = await Client.update(req.body, {
            where: { idCli: clientId }
        });

        if (updated) {
            const updatedClient = await Client.findByPk(clientId);
            res.send(updatedClient);
        } else {
            res.status(404).send({
                message: `Client non trouvé avec l'id=${clientId}`
            });
        }
    } catch (error) {
        console.error('❌ Erreur mise à jour client:', error);
        res.status(500).send({
            message: "Erreur lors de la mise à jour du client",
            error: error.message
        });
    }
};

/* --- DELETE (DELETE) --- */
exports.deleteClient = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('🗑️ Suppression client ID:', id);
        
        const deleted = await Client.destroy({
            where: { idCli: id }
        });

        if (deleted) {
            res.send({ 
                message: "Client supprimé avec succès",
                deletedId: id
            });
        } else {
            res.status(404).send({
                message: `Client non trouvé avec l'id=${id}`
            });
        }
    } catch (error) {
        console.error('❌ Erreur suppression client:', error);
        res.status(500).send({
            message: "Erreur lors de la suppression du client",
            error: error.message
        });
    }
}; // 🚨 CORRECTION: Fermeture correcte de la fonction deleteClient

// ----------------------------------------------------------------------
// GESTION DES CLASSEMENTS
// ----------------------------------------------------------------------

const sqlTopClient = `
    SELECT 
        C.idCli,
        C.nomCli, 
        C.prenomCli, 
        COALESCE(SUM(P.montantPaie), 0) AS totalRevenue
    FROM client C 
    LEFT JOIN reservation R ON C.idCli = R.idCli 
    LEFT JOIN location L ON R.idRes = L.idRes 
    LEFT JOIN paiement P ON L.idLo = P.idLo
    WHERE P.statutPaie = 'Effectué' 
        AND P.dateCre >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
    GROUP BY C.idCli, C.nomCli, C.prenomCli
    ORDER BY totalRevenue DESC 
    LIMIT 1;
`;

const sqlActiveClient = `
    SELECT 
        C.idCli,
        C.nomCli, 
        C.prenomCli, 
        COUNT(L.idLo) AS totalLocations
    FROM client C 
    INNER JOIN reservation R ON C.idCli = R.idCli 
    INNER JOIN location L ON R.idRes = L.idRes
    WHERE L.etatLo IN ('Confirmée', 'Terminée')
    GROUP BY C.idCli, C.nomCli, C.prenomCli
    ORDER BY totalLocations DESC 
    LIMIT 1;
`;

exports.getRankings = async (req, res) => {
    try {
        const topClientResult = await sequelize.query(sqlTopClient, { 
            type: sequelize.QueryTypes.SELECT 
        });
        
        const activeClientResult = await sequelize.query(sqlActiveClient, { 
            type: sequelize.QueryTypes.SELECT 
        });

        res.status(200).send({
            topClient: topClientResult[0] || {},
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
        const locations = await sequelize.query(sqlLocations, { 
            replacements: [idCli],
            type: sequelize.QueryTypes.SELECT
        });
        
        const reservations = await sequelize.query(sqlReservations, { 
            replacements: [idCli],
            type: sequelize.QueryTypes.SELECT
        });

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
    const idUtiFromSources = req.userId || req.params.id; 
    const idUti = parseInt(idUtiFromSources, 10);
    
    console.log(`[VERIF FINALE] Tentative de récupération pour idUti : ${idUti}`);

    if (!idUti || isNaN(idUti)) {
        console.error("[VERIF FINALE] ÉCHEC 401 : ID utilisateur manquant ou invalide.");
        return res.status(401).send({ message: "Authentification requise. ID utilisateur non disponible ou invalide." });
    }

    try {
        const clientProfile = await Client.findOne({
            where: { idUti: idUti }, 
            attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli', 'adresseCli']
        });
        
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


exports.getRevenueByClientType = async (req, res) => {
    try {
        // VERSION AVEC VRAIES DONNÉES
        // Récupérer les paiements groupés par type de client
        const revenueByClientType = await Paiement.findAll({
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('montantPaie')), 'totalRevenue'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('idPaie')), 'transactionCount']
            ],
            include: [{
                model: Location,
                attributes: ['idLo'],
                include: [{
                    model: Client,
                    attributes: ['typeCli'],
                    where: { typeCli: { [db.Sequelize.Op.not]: null } }
                }]
            }],
            where: {
                statutPaie: 'Effectué' // Seulement les paiements validés
            },
            group: ['Location.Client.typeCli'],
            raw: true
        });

        console.log('📊 Données réelles récupérées:', revenueByClientType);

        // Si pas de données, retourner des statistiques de base
        if (!revenueByClientType || revenueByClientType.length === 0) {
            return res.json({
                success: true,
                data: [
                    { typeClient: 'particulier', totalRevenue: 0, transactionCount: 0, percentage: 0 },
                    { typeClient: 'entreprise', totalRevenue: 0, transactionCount: 0, percentage: 0 }
                ],
                totalRevenue: 0,
                message: 'Aucune donnée financière disponible'
            });
        }

        // Calculer le total pour les pourcentages
        const totalRevenue = revenueByClientType.reduce((sum, item) => 
            sum + (parseFloat(item.totalRevenue) || 0), 0
        );

        // Formater les données
        const formattedData = revenueByClientType.map(item => {
            const revenue = parseFloat(item.totalRevenue) || 0;
            return {
                typeClient: item['Location.Client.typeCli'] || 'non spécifié',
                totalRevenue: revenue,
                transactionCount: parseInt(item.transactionCount) || 0,
                percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
            };
        });

        // Ajouter les types manquants avec valeur 0
        const allClientTypes = ['particulier', 'entreprise', 'ONG', 'association', 'institution publique'];
        const completeData = allClientTypes.map(type => {
            const existingData = formattedData.find(item => 
                item.typeClient.toLowerCase() === type.toLowerCase()
            );
            
            return existingData || {
                typeClient: type,
                totalRevenue: 0,
                transactionCount: 0,
                percentage: 0
            };
        });

        res.json({
            success: true,
            data: completeData,
            totalRevenue: totalRevenue,
            period: 'month', // Vous pouvez ajouter un paramètre pour la période
            timestamp: new Date()
        });

    } catch (error) {
        console.error('❌ Erreur récupération revenus par type client:', error);
        
        // Version de secours avec données minimales
        res.status(500).json({
            success: false,
            data: [
                { typeClient: 'particulier', totalRevenue: 0, transactionCount: 0, percentage: 0 },
                { typeClient: 'entreprise', totalRevenue: 0, transactionCount: 0, percentage: 0 }
            ],
            totalRevenue: 0,
            message: 'Erreur lors de la récupération des données de revenus'
        });
    }
};

// 🚨 CORRECTION: FONCTIONS GETMYPROFILE ET GETCLIENTRESERVATIONS DÉPLACÉES ICI

exports.getMyProfile = async (req, res) => {
    // 1. Récupère l'ID utilisateur (req.userId doit être injecté par le middleware JWT)
    const userId = req.idUti; 
    
    // Vérification de sécurité (si le middleware JWT n'a pas pu décoder l'ID)
    if (!userId) {
        return res.status(401).send({ message: "Authentification requise. ID utilisateur non disponible ou invalide." });
    }

    try {
        // 2. Requête Sequelize : Trouver la fiche Client et joindre l'Utilisateur
        const clientProfile = await Client.findOne({ 
            // Critère de recherche : l'idUti doit correspondre à l'ID de l'utilisateur connecté
            where: { idUti: userId }, 
            
            // Jointure : Inclure les données de la table Utilisateur
            include: [{ 
                model: Utilisateur, 
                as: 'utilisateur', // 🚨 Doit correspondre à l'alias défini dans votre association
                attributes: ['loginUti', 'roleUti'] 
            }], 
            
            // Sélectionner tous les attributs du Client (nomCli, prenomCli, etc.)
            attributes: [
                'idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli', 
                'addresseCli', 'typeCli', 'statutCli'
            ],
            
            // Convertir en objet JavaScript simple pour l'envoi
            raw: false, // Important pour garder les données de l'inclusion (Utilisateur)
            nest: true // Optionnel, mais rend l'objet plus propre
        });

        // 3. Vérification du résultat
        if (!clientProfile) {
            // Si le token est valide mais qu'aucune fiche client n'a été créée pour cet utilisateur
            return res.status(404).send({ message: "Fiche client introuvable. Veuillez compléter votre profil." });
        }
        
        // 4. Succès : Envoyer les données du profil (Client + Utilisateur)
        res.status(200).send(clientProfile);

    } catch (error) {
        console.error("Erreur lors de la récupération du profil par ID utilisateur:", error);
        res.status(500).send({ message: "Erreur interne lors de la récupération du profil client." });
    }
};


exports.getClientReservations = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔍 getClientReservations appelé pour client ID:", id);
        
        // 🚨 VERSION SIMPLIFIÉE POUR TESTER
        const reservations = await db.Reservation.findAll({
            where: { idCli: parseInt(id) },
            order: [['debRes', 'DESC']]
        });

        console.log("✅ Réservations trouvées:", reservations.length);
        
        res.json({
            message: `Réservations du client ${id} récupérées`,
            count: reservations.length,
            reservations: reservations || []
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservations:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};
exports.getCurrentClient = async (req, res) => {
  try {
    console.log('🔍 Recherche du client pour userId:', req.user.idUti);
    
    // Vérifier que l'utilisateur est bien authentifié
    if (!req.user || !req.user.idUti) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    const client = await Client.findOne({
      where: { idUti: req.user.idUti }
    });

    if (!client) {
      console.log('❌ Aucun client trouvé pour userId:', req.user.idUti);
      return res.status(404).json({
        success: false,
        message: 'Aucun profil client trouvé pour votre compte'
      });
    }

    console.log('✅ Client trouvé:', client.nomCli);
    res.json({
      success: true,
      data: client
    });

  } catch (error) {
    console.error('💥 Erreur getCurrentClient:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du client'
    });
  }
};
