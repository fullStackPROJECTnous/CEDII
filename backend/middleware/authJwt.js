const jwt = require('jsonwebtoken');
const db = require('../models');
const Utilisateur = db.utilisateur; // Assurez-vous que le modèle est correct

// ======================================================
// 1. Middleware de Vérification du Token JWT (JWT Verification)
// ======================================================
const verifyToken = (req, res, next) => {
    // 1. Récupérer le token depuis l'en-tête (standard: 'x-access-token' ou 'Authorization: Bearer <token>')
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            message: "Accès refusé. Aucun token fourni!"
        });
    }

    // Si le format est 'Bearer <token>', extraire uniquement le token
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    // 2. Vérifier et décoder le token
    // Le secret doit correspondre à celui utilisé lors de la connexion (authController.js)
    jwt.verify(token, process.env.JWT_SECRET || 'votre_cle_secrete', (err, decoded) => {
        if (err) {
            // Le token est expiré, invalide, ou falsifié
            return res.status(401).send({
                message: "Non autorisé! Le token est invalide ou expiré."
            });
        }
        
        // 3. Stocker l'ID de l'utilisateur et son rôle pour les middlewares suivants
        req.userId = decoded.id; 
        req.userRole = decoded.role; // Nous stockons également le rôle dans le req pour plus de facilité
        
        next(); // Passer au prochain middleware ou au contrôleur
    });
};

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