// backend/controllers/materielController.js

const db = require('../models');
// 🚨 Assurez-vous que le nom utilisé (ici 'materiel') correspond au nom du modèle exporté
const Materiel = db.materiel; 

exports.getAllMateriel = async (req, res) => {
    try {
        const materiels = await Materiel.findAll({
            order: [['designationMat', 'ASC']]
        });
        
        res.status(200).json(materiels);
        
    } catch (error) {
        console.error("Erreur de chargement du patrimoine (matériel):", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération du matériel.", 
            error: error.message 
        });
    }
};

// backend/controllers/materielController.js (Ajouter cette fonction)

// ... (vos fonctions existantes : getAllMateriel, createMateriel, etc.) ...

// 🚨 AJOUTEZ CETTE NOUVELLE FONCTION pour la suppression (DELETE)
exports.deleteMateriel = async (req, res) => {
    // ⚠️ Cette fonction est un stub temporaire pour éviter l'erreur "must be a function"
    
    try {
        const codeMat = req.params.codeMat;
        
        // Logique de suppression à implémenter plus tard avec Materiel.destroy({ where: ... })
        
        res.status(501).send({ 
            message: `Suppression du matériel ${codeMat} non implémentée (fonctionne pour le démarrage).` 
        });

    } catch (error) {
        console.error("Erreur de suppression du matériel:", error);
        res.status(500).send({ message: "Erreur interne du serveur lors de la suppression." });
    }
};