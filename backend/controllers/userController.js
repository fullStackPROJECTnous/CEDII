
// backend/controllers/userController.js (CORRIGÉ)

const db = require('../models');
const User = db.User; // 💡 On utilise 'User' (avec une majuscule) pour le modèle importé
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = db.utilisateur;
const Client = db.Client;
//import ServiceUser from '../../frontend/src/services/ServiceUser';

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

// 🚨 AJOUT DE LA FONCTION MANQUANTE POUR LA ROUTE /clients/list 🚨
exports.getAllClientUsers = async (req, res) => {
    try {
        // 1. Trouver tous les idUti qui sont déjà associés à un client
        // 🚨 CORRECTION : On attend la résolution de la promesse avant d'appeler .map()
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
/*
 // backend/controllers/userController.js
 exports.getAllClientUsers = async (req, res) => {
    try {
        // 1. Trouver tous les idUti qui sont déjà associés à un client
        // 🚨 CORRECTION : On attend la résolution de la promesse avant d'appeler .map()
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
};*/