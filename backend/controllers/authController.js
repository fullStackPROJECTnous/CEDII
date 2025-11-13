// backend/controllers/authController.js

const db = require('../models');
const utilisateur = db.utilisateur;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ⚠️ Assurez-vous d'avoir une clé secrète dans votre .env
const JWT_SECRET = process.env.JWT_SECRET || 'clé_secrète_par_défaut'; 

// 1. Fonction pour l'inscription (non utilisée pour le login, mais nécessaire pour créer des users)
exports.register = async (req, res) => {
    const { loginUti, motDePasseUti, roleUti } = req.body;

    // Validation rapide
    if (!loginUti || !motDePasseUti || !roleUti) {
        return res.status(400).send({ message: "Tous les champs sont requis." });
    }

    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(motDePasseUti, 10);

        // Créer l'utilisateur
        const user = await utilisateur.create({
            loginUti,
            motDePasseUti: hashedPassword,
            roleUti
        });

        res.status(201).send({ message: "Utilisateur créé avec succès.", user: user.loginUti });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send({ message: "Ce login existe déjà." });
        }
        res.status(500).send({ message: error.message || "Erreur lors de l'inscription." });
    }
};

exports.home = (req, res) => {
    res.status(200).send({ 
        message: "Bienvenue sur l'API d'authentification CEDII. Utilisez /login (POST) ou /register (POST)."
    });
};

// 3. FONCTION DE CONNEXION (LOGIN) - 🚨 NOUVEAU CODE REQUIS
exports.login = async (req, res) => {
    const { loginUti, motDePasseUti } = req.body;

    try {
        // 1. Trouver l'utilisateur par son login
        const user = await utilisateur.findOne({ where: { loginUti } });

        if (!user) {
            return res.status(401).send({ message: "Identifiants invalides (login non trouvé)." });
        }

        // 2. Comparer le mot de passe haché
        const isPasswordValid = await bcrypt.compare(motDePasseUti, user.motDePasseUti);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Identifiants invalides (mot de passe incorrect)." });
        }

        // 3. Générer le token JWT
        const token = jwt.sign(
            { id: user.idUti, login: user.loginUti, roleUti: user.roleUti },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Le token expire après 24 heures
        );

        // 4. Succès : Renvoyer le token et les infos utilisateur
        res.status(200).send({
            message: "Connexion réussie.",
            idUti: user.idUti,
            loginUti: user.loginUti,
            roleUti: user.roleUti, // Nécessaire pour le Dashboard Vue
            accessToken: token
        });

    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).send({ message: "Erreur serveur lors de la connexion.", error: error.message });
    }
};

/*const db = require('../models');
const Utilisateur = db.utilisateur;
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { loginUti, motDePasseUti, roleUti } = req.body;

    // 🚨 NOUVELLE RÈGLE DE SÉCURITÉ : Définir les rôles autorisés
    const rolesAutorises = ['client']; 
    
    // 1. Validation de base
    if (!loginUti || !motDePasseUti || !roleUti) {
        return res.status(400).send({ message: "Veuillez remplir tous les champs." });
    }

    // 🚨 2. Vérification du Rôle Soumis
    if (!rolesAutorises.includes(roleUti)) {
        // Renvoie une erreur si le rôle n'est pas autorisé.
        // On peut renvoyer un 403 (Forbidden) ou 400 (Bad Request).
        return res.status(403).send({ 
            message: `Le rôle '${roleUti}' ne peut pas être attribué via l'inscription. Veuillez contacter un administrateur.` 
        });
    }

    try {
        // 3. Vérification de l'existence de l'utilisateur
        const existingUser = await Utilisateur.findOne({ where: { loginUti } });
        if (existingUser) {
            return res.status(400).send({ message: "Ce login est déjà utilisé." });
        }

        // 4. Hachage et création de l'utilisateur (le reste reste inchangé)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasseUti, salt);
        
        const newUser = await Utilisateur.create({
            loginUti,
            motDePasseUti: hashedPassword,
            roleUti // Le rôle est désormais garanti d'être 'client'
        });

        res.status(201).send({ 
            message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
            idUti: newUser.idUti
        });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).send({ 
            message: "Échec de l'inscription. Erreur interne du serveur.",
            error: error.message
        });
    }
};


// backend/controllers/authController.js (Ajoutez ceci)

// ... (exports.register et autres) ...

// authController.js
// ...

// ...

*/