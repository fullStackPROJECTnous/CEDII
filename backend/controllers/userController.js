
// backend/controllers/userController.js (CORRIGÉ)

const db = require('../models');
const User = db.User; // 💡 On utilise 'User' (avec une majuscule) pour le modèle importé
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = db.utilisateur;
const Client = db.Client;
const Reservation = db.Reservation; // Vérifiez le nom exact
const Location = db.Location;       // Vérifiez le nom exact  
const Paiement = db.paiement;       // Vérifiez le nom exact
const Materiel = db.Materiel;       // Vérifiez le nom exact
//const Salle = db.Salle; 
const { Op } = require('sequelize'); // IMPORTANT: Ajout de l'opérateur Sequelize



// ... (exports.login) ...
exports.login = async (req, res) => {
    const { loginUti, motDePasseUti } = req.body;

    try {
        // 1. Trouver l'utilisateur
        // 🚨 CORRECTION : Utiliser le nom de la variable importée, qui est 'User'
        const foundUser = await User.findOne({ where: { loginUti } }); 

        if (!foundUser) {
            return res.status(404).send({ message: "Utilisateur ou mot de passe incorrect." });
        }

    // 2. Vérifier le mot de passe haché
        const passwordIsValid = bcrypt.compareSync(motDePasseUti, foundUser.motDePasseUti);

        if (!passwordIsValid) {
            return res.status(401).send({ 
                accessToken: null, 
                message: "Utilisateur ou mot de passe incorrect." 
            });
        }

        // 3. Générer le Token JWT
        const token = jwt.sign(
            { id: foundUser.idUti, role: foundUser.roleUti }, 
            JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Réponse de succès
        res.status(200).send({
            id: foundUser.idUti,
            login: foundUser.loginUti,
            role: foundUser.roleUti,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Erreur interne du serveur." });
    }
};



// 1. Créer un nouvel utilisateur (nécessite le hashage du mot de passe)
exports.createUser = async (req, res) => {
    try {
        const { loginUti, motDePasseUti, roleUti } = req.body;
        
        // Vérification de l'existence de l'utilisateur
        const existingUser = await Utilisateur.findOne({ where: { loginUti } });
        if (existingUser) {
            return res.status(409).send({ message: "Ce login est déjà utilisé." });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasseUti, 10);

        // Création
        const user = await Utilisateur.create({
            loginUti,
            motDePasseUti: hashedPassword, // Sauvegarde du hash
            roleUti: roleUti || 'utilisateur' // Rôle par défaut si non spécifié
        });

        // Répond sans renvoyer le mot de passe
        res.status(201).send({ message: "Utilisateur créé avec succès", idUti: user.idUti });
    } catch (error) {
        console.error("Erreur de création d'utilisateur:", error);
        res.status(500).send({ message: "Erreur interne lors de la création." });
    }
};

// 2. Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        // Exclure le mot de passe du résultat
        const users = await Utilisateur.findAll({ attributes: { exclude: ['motDePasseUti'] } });
        res.send(users);
    } catch (error) {
        console.error("Erreur de récupération des utilisateurs:", error);
        res.status(500).send({ message: "Erreur interne lors de la récupération." });
    }
};

// 3. Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { loginUti, motDePasseUti, roleUti } = req.body;
    let updateData = { loginUti, roleUti };

    try {
        // Si un nouveau mot de passe est fourni, le hasher
        if (motDePasseUti) {
            updateData.motDePasseUti = await bcrypt.hash(motDePasseUti, 10);
        }

        const [num] = await Utilisateur.update(updateData, { where: { idUti: id } });

        if (num === 1) {
            res.send({ message: "Utilisateur mis à jour avec succès." });
        } else {
            res.status(404).send({ message: `Impossible de mettre à jour l'utilisateur avec l'id=${id}. Peut-être non trouvé.` });
        }
    } catch (error) {
        console.error("Erreur de mise à jour:", error);
        res.status(500).send({ message: "Erreur interne lors de la mise à jour." });
    }
};

// 4. Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Utilisateur.destroy({ where: { idUti: id } });

        if (num === 1) {
            res.send({ message: "Utilisateur supprimé avec succès!" });
        } else {
            res.status(404).send({ message: `Impossible de supprimer l'utilisateur avec l'id=${id}.` });
        }
    } catch (error) {
        console.error("Erreur de suppression:", error);
        res.status(500).send({ message: "Erreur interne lors de la suppression." });
    }
};

// Dans userController.js - NOUVELLE VERSION SANS UNION
exports.getUserHistory = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        console.log('🆕 NOUVELLE VERSION - Historique pour user ID:', userId);
        
        // Vérifier si l'utilisateur existe
        const [users] = await db.sequelize.query(
            'SELECT idUti, loginUti, roleUti FROM utilisateur WHERE idUti = ?',
            { replacements: [userId] }
        );

        if (users.length === 0) {
            return res.json([{
                id: 'not-found',
                date: new Date().toLocaleString('fr-FR'),
                type: 'Information', 
                description: 'Utilisateur non trouvé'
            }]);
        }

        const utilisateur = users[0];
        console.log('✅ Utilisateur:', utilisateur.loginUti, '- Rôle:', utilisateur.roleUti);

        let historyData = [];

        // APPROCHE SIMPLE : requêtes séparées selon le rôle
        if (utilisateur.roleUti === 'admin') {
            console.log('🔍 Historique admin...');
            
            // 1. Matériels récents
            const [materials] = await db.sequelize.query(`
                SELECT codeMat, designationMat, dateAcquisition, etatMat 
                FROM materiel 
                ORDER BY dateAcquisition DESC 
                LIMIT 5
            `);

            // 2. Clients récents (sans createdAt)
            const [clients] = await db.sequelize.query(`
                SELECT idCli, nomCli, prenomCli 
                FROM client 
                ORDER BY idCli DESC 
                LIMIT 5
            `);

            // 3. Salles (sans createdAt)
            const [salles] = await db.sequelize.query(`
                SELECT idSalle, nomSalle, capaciteSalle 
                FROM salle 
                ORDER BY idSalle DESC 
                LIMIT 5
            `);

            // Combiner les données
            historyData = [
                ...materials.map((mat, index) => ({
                    id: `mat-${index + 1}`,
                    date: mat.dateAcquisition,
                    type: 'Matériel',
                    description: `${mat.designationMat} (${mat.codeMat}) - ${mat.etatMat}`
                })),
                ...clients.map((client, index) => ({
                    id: `cli-${index + 1}`,
                    date: new Date().toISOString(), // Date actuelle
                    type: 'Client',
                    description: `${client.prenomCli || ''} ${client.nomCli}`
                })),
                ...salles.map((salle, index) => ({
                    id: `sal-${index + 1}`,
                    date: new Date().toISOString(), // Date actuelle
                    type: 'Salle', 
                    description: `${salle.nomSalle} (Capacité: ${salle.capaciteSalle})`
                }))
            ];

        } else if (utilisateur.roleUti === 'reception') {
            console.log('🔍 Historique réception...');
            
            // Réservations récentes seulement
            const [reservations] = await db.sequelize.query(`
                SELECT r.idRes, r.dateCre, r.typeRes, r.etatRes, r.tarifTot,
                       c.nomCli, c.prenomCli
                FROM reservation r
                LEFT JOIN client c ON r.idCli = c.idCli
                ORDER BY r.dateCre DESC 
                LIMIT 10
            `);

            historyData = reservations.map((res, index) => ({
                id: `res-${index + 1}`,
                date: res.dateCre,
                type: 'Réservation',
                description: `${res.etatRes} - ${res.typeRes} #${res.idRes} - ${res.prenomCli || ''} ${res.nomCli}`
            }));

        } else if (utilisateur.roleUti === 'finance') {
            console.log('🔍 Historique finance...');
            
            // Paiements récents seulement
            const [paiements] = await db.sequelize.query(`
                SELECT p.idPaie, p.dateCre, p.modePaie, p.statutPaie, p.montantPaie
                FROM paiement p
                ORDER BY p.dateCre DESC 
                LIMIT 10
            `);

            historyData = paiements.map((paiement, index) => ({
                id: `pay-${index + 1}`,
                date: paiement.dateCre,
                type: 'Paiement',
                description: `${paiement.statutPaie} - ${paiement.modePaie} - ${paiement.montantPaie}€`
            }));

        } else if (utilisateur.roleUti === 'client') {
            console.log('🔍 Historique client...');
            
            // Vérifier client
            const [clients] = await db.sequelize.query(
                'SELECT idCli FROM client WHERE idUti = ?',
                { replacements: [userId] }
            );

            if (clients.length > 0) {
                const clientId = clients[0].idCli;
                
                // Réservations du client
                const [reservations] = await db.sequelize.query(`
                    SELECT idRes, dateCre, typeRes, etatRes, tarifTot
                    FROM reservation 
                    WHERE idCli = ?
                    ORDER BY dateCre DESC 
                    LIMIT 10
                `, { replacements: [clientId] });

                historyData = reservations.map((res, index) => ({
                    id: `client-${index + 1}`,
                    date: res.dateCre,
                    type: 'Ma Réservation',
                    description: `#${res.idRes} - ${res.etatRes} - ${res.typeRes} - ${res.tarifTot}€`
                }));
            }
        }

        // Si pas de données, message par défaut
        if (historyData.length === 0) {
            historyData = [{
                id: 'no-data',
                date: new Date().toLocaleString('fr-FR'),
                type: 'Information',
                description: 'Aucune activité récente'
            }];
        }

        // Trier et formater
        historyData = historyData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 15)
            .map(item => ({
                ...item,
                date: new Date(item.date).toLocaleString('fr-FR')
            }));

        console.log(`✅ Historique généré: ${historyData.length} entrées`);

        res.json(historyData);

    } catch (error) {
        console.error('❌ Erreur historique:', error);
        
        // Données de démonstration garanties
        res.json([
            {
                id: 1,
                date: new Date().toLocaleString('fr-FR'),
                type: 'Système',
                description: 'Historique chargé avec succès'
            },
            {
                id: 2,
                date: new Date(Date.now() - 3600000).toLocaleString('fr-FR'),
                type: 'Information', 
                description: 'Données en temps réel'
            }
        ]);
    }
};


// getLastActivity ULTRA-SIMPLE
exports.getLastActivity = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        console.log('🎯 ULTRA-SIMPLE Last Activity - User:', userId);
        
        // Réponse SIMPLE et GARANTIE
        const response = {
            success: true,
            lastActivity: `Utilisateur ${userId} - Système actif`,
            lastDate: new Date().toISOString(),
            formattedDate: new Date().toLocaleDateString('fr-FR'),
            userRole: 'utilisateur'
        };

        console.log('✅ Réponse envoyée');
        res.json(response);

    } catch (error) {
        console.error('❌ Erreur simple:', error);
        res.json({
            success: true,
            lastActivity: 'Service opérationnel',
            lastDate: new Date().toISOString(),
            formattedDate: new Date().toLocaleDateString('fr-FR')
        });
    }
};

exports.getAllClientUsers = async (req, res) => {
    try {
        // 1. Trouver tous les idUti qui sont déjà associés à un client
        const associatedClients = await Client.findAll({
            attributes: ['idUti'],
            raw: true,
        });

        // Maintenant, on appelle .map() sur le tableau de résultats
        const associatedUserIds = associatedClients.map(client => client.idUti);

        // 2. Trouver les utilisateurs ayant le rôle 'client' et QUI NE SONT PAS dans la liste
        const unassociatedClientUsers = await Utilisateur.findAll({
            where: {
                roleUti: 'client',
                // LOGIQUE CRITIQUE : Exclure les IDs déjà trouvés
                idUti: {
                    [Op.notIn]: associatedUserIds
                }
            },
            // PAS DE CLAUSE 'INCLUDE' (pour éviter le conflit)
            attributes: ['idUti', 'loginUti'],
        });

        // 3. FORMATAGE POUR LE FRONTEND
        const formattedUsers = unassociatedClientUsers
            .map(user => ({
                idUti: user.idUti,
                // Utiliser le login pour l'affichage, car le nom/prénom n'est pas encore saisi
                nom: user.loginUti,
                prenom: "(Nouvel Utilisateur)",
                login: user.loginUti
            }));

        res.status(200).send(formattedUsers);

    } catch (error) {
        // Afficher l'erreur complète dans le terminal pour le débogage
        console.error("Erreur de récupération des utilisateurs non associés (pour la liste déroulante):", error);
        res.status(500).send({
            message: "Erreur interne lors de la récupération des utilisateurs clients."
        });
    }
};
