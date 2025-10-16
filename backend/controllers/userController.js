/*const db = require('../models');
const user = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ⚠️ Assurez-vous d'avoir une clé secrète dans votre .env
const JWT_SECRET = process.env.JWT_SECRET || 'clé_secrète_par_défaut'; 


// 2. Fonction de Connexion (LOGIN)
exports.login = async (req, res) => {
    const { loginUti, motDePasseUti } = req.body;

    try {
        // 1. Trouver l'utilisateur
        const user = await utilisateur.findOne({ where: { loginUti } });

        if (!user) {
            return res.status(404).send({ message: "Utilisateur ou mot de passe incorrect." });
        }

    // 2. Vérifier le mot de passe haché
        const passwordIsValid = bcrypt.compareSync(motDePasseUti, user.motDePasseUti);

        if (!passwordIsValid) {
            return res.status(401).send({ 
                accessToken: null, 
                message: "Utilisateur ou mot de passe incorrect." 
            });
        }

        // 3. Générer le Token JWT
        const token = jwt.sign(
            { id: user.idUti, role: user.roleUti }, 
            JWT_SECRET, 
            { expiresIn: '24h' } // Token valable 24 heures
        );

        // 4. Réponse de succès
        res.status(200).send({
            id: user.idUti,
            login: user.loginUti,
            role: user.roleUti,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Erreur interne du serveur." });
    }
};
// backend/controllers/authController.js

// ... imports et autres fonctions (register, login) ...

// 🚨 NOUVELLE FONCTION POUR LE TEST DE ROUTE

// ...*/

// backend/controllers/userController.js (CORRIGÉ)

const db = require('../models');
const User = db.user; // 💡 On utilise 'User' (avec une majuscule) pour le modèle importé
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = db.utilisateur;
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