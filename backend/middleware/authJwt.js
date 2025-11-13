const jwt = require('jsonwebtoken');
const db = require('../models');
const Utilisateur = db.utilisateur; // Assurez-vous que le modèle est correct

// ======================================================
// 1. Middleware de Vérification du Token JWT (JWT Verification)
// ======================================================

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'] || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            message: "Accès refusé. Aucun token fourni dans les en-têtes."
        });
    }

    // Nettoyer le jeton : retirer "Bearer " s'il est présent
    token = token.trim();
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    
    // 1. VÉRIFICATION ET DÉCODAGE DU JETON
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Loggez l'erreur exacte dans le terminal du backend
            console.error("Échec de la vérification JWT. Erreur :", err.name, ":", err.message); 
            
            // Renvoie une erreur 401 avec le message d'erreur exact du JWT
            return res.status(401).send({
                message: "Non autorisé! Le token est invalide ou expiré.",
                // Ceci vous montrera la raison exacte dans Postman (ex: 'invalid signature')
                debug: err.message 
            });
        }
        
        // 🚨 AJOUTEZ CE LOG CRITIQUE
        console.log("Contenu du token décodé:", decoded);

        // 2. 🚨 INJECTION DE L'ID (Correction basée sur le payload réel)
        // Le token contient { idUti: 14, loginUti: 'Daniella', ... }
        req.idUti = decoded.id; // ⬅️ Utilisez la clé idUti du payload
        req.userRole = decoded.roleUti; 
        
        // Log de vérification (à retirer en production)
        console.log("Token décodé avec succès. ID injecté dans req.idUti:", req.idUti);
        
        next(); // Passe au contrôleur (clientController.getMyProfile)
    });
};

// Le reste du fichier 'middleware/auth.js' reste inchangé (exports, isAdmin, etc.)
// ======================================================
// 2. Middleware de Vérification du Rôle (Admin Check)
// ======================================================
const isAdmin = async (req, res, next) => {
    // Le rôle a été décodé et stocké dans req.userRole par verifyToken
    try {
        if (req.userRole && req.userRole.toUpperCase() === 'ADMINISTRATEUR') {
            next(); // L'utilisateur est Administrateur, accès autorisé
            return;
        }

        // Si le rôle n'est pas Administrateur
        res.status(403).send({
            message: "Accès refusé! Requiert le rôle ADMINISTRATEUR."
        });
    } catch (error) {
        // En cas d'erreur de base de données ou autre
        res.status(500).send({
            message: "Erreur de vérification des permissions.",
            error: error.message
        });
    }
};

// ======================================================
// 3. Exportation des fonctions
// ======================================================
const authJwt = {
    verifyToken,
    isAdmin
};

module.exports = authJwt;