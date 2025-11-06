const jwt = require('jsonwebtoken');
const db = require('../models');
const Utilisateur = db.utilisateur; // Assurez-vous que le modèle est correct

// ======================================================
// 1. Middleware de Vérification du Token JWT (JWT Verification)
// ======================================================

const verifyToken = (req, res, next) => {
    // 1. Récupérer le token (utilise 'Authorization: Bearer <token>' ou 'x-access-token')
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            message: "Accès refusé. Aucun token fourni!"
        });
    }

    // Retirer 'Bearer ' si présent
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    // 2. Vérifier et décoder le token
    jwt.verify(token, process.env.JWT_SECRET || 'votre_cle_secrete', (err, decoded) => {
        if (err) {
            // Token expiré ou invalide
            return res.status(401).send({
                message: "Non autorisé! Le token est invalide ou expiré."
            });
        }
        
        // 🚨 CORRECTION MAJEURE: Prioriser les clés 'idUti' ou 'id' du payload du token
        const rawId = decoded.idUti || decoded.id; 

        if (rawId) {
            // Conversion forcée en entier pour prévenir le 'NaN'
            const idUtiNumber = parseInt(rawId, 10); 

            if (isNaN(idUtiNumber)) {
                // Si la valeur est bien là mais non numérique
                 return res.status(401).send({
                    message: "Authentification requise. ID utilisateur non disponible ou invalide."
                });
            }
            
            // 3. Stocker l'ID sous le nom ATTENDU par le contrôleur
            req.idUti = idUtiNumber; 
            
            // Stocker le rôle
            req.userRole = decoded.role; 

            next(); // Succès
        } else {
             // Si le token est valide mais ne contient pas l'ID
             return res.status(401).send({
                message: "Authentification requise. ID utilisateur non disponible ou invalide."
            });
        }
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