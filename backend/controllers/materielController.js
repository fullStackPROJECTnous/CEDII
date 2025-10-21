// backend/controllers/materielController.js

/*const db = require('../models');
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
};*/

const db = require('../models');
const Materiel = db.materiel;
const HistoriqueEmprunt = db.historiqueEmprunt;
const { Op } = require('sequelize');

// Récupérer tous les matériels avec filtres
exports.getAllMateriel = async (req, res) => {
    try {
        const { etat, categorie, search } = req.query;
        
        let whereClause = {};
        
        // Filtre par état
        if (etat && etat !== 'tous') {
            whereClause.etatMat = etat;
        }
        
        // Filtre par catégorie
        if (categorie && categorie !== 'toutes') {
            whereClause.categorieMat = categorie;
        }
        
        // Recherche par désignation ou code
        if (search) {
            whereClause[Op.or] = [
                { designationMat: { [Op.like]: `%${search}%` } },
                { codeMat: { [Op.like]: `%${search}%` } }
            ];
        }

        const materiels = await Materiel.findAll({
            where: whereClause,
            order: [['designationMat', 'ASC']]
        });
        
        res.status(200).json(materiels);
        
    } catch (error) {
        console.error("Erreur de chargement du matériel:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération du matériel.", 
            error: error.message 
        });
    }
};

// Créer un nouveau matériel
exports.createMateriel = async (req, res) => {
    try {
        const materielData = {
            ...req.body,
            qteActuelStock: req.body.qteTotDispo, // Initialiser le stock actuel
            qteEnLocation: 0 // Initialiser à 0
        };

        const materiel = await Materiel.create(materielData);
        res.status(201).json(materiel);
        
    } catch (error) {
        console.error("Erreur de création du matériel:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la création du matériel.", 
            error: error.message 
        });
    }
};

// Mettre à jour un matériel
exports.updateMateriel = async (req, res) => {
    try {
        const codeMat = req.params.codeMat;
        const materiel = await Materiel.findByPk(codeMat);
        
        if (!materiel) {
            return res.status(404).json({ message: "Matériel non trouvé." });
        }

        await materiel.update(req.body);
        res.status(200).json(materiel);
        
    } catch (error) {
        console.error("Erreur de mise à jour du matériel:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la mise à jour du matériel.", 
            error: error.message 
        });
    }
};

// Supprimer un matériel
exports.deleteMateriel = async (req, res) => {
    try {
        const codeMat = req.params.codeMat;
        const materiel = await Materiel.findByPk(codeMat);
        
        if (!materiel) {
            return res.status(404).json({ message: "Matériel non trouvé." });
        }

        // Vérifier si le matériel est en cours de location
        if (materiel.qteEnLocation > 0) {
            return res.status(400).json({ 
                message: "Impossible de supprimer ce matériel car il est actuellement en location." 
            });
        }

        await materiel.destroy();
        res.status(200).json({ message: "Matériel supprimé avec succès." });
        
    } catch (error) {
        console.error("Erreur de suppression du matériel:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la suppression du matériel.", 
            error: error.message 
        });
    }
};

// Récupérer l'historique d'emprunt d'un matériel
exports.getHistoriqueEmprunt = async (req, res) => {
    try {
        const codeMat = req.params.codeMat;
        
        const historique = await HistoriqueEmprunt.findAll({
            where: { codeMat },
            include: [
                {
                    model: db.reservation,
                    include: [{ model: db.client }]
                }
            ],
            order: [['dateDebutPrevue', 'DESC']]
        });

        res.status(200).json(historique);
        
    } catch (error) {
        console.error("Erreur de récupération de l'historique:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération de l'historique.", 
            error: error.message 
        });
    }
};

// Calculer les frais de retard
exports.calculerFraisRetard = async (req, res) => {
    try {
        const { codeMat, dateRetourReelle, dateFinPrevue } = req.body;
        const materiel = await Materiel.findByPk(codeMat);
        
        if (!materiel) {
            return res.status(404).json({ message: "Matériel non trouvé." });
        }

        const finPrevue = new Date(dateFinPrevue);
        const retourReel = new Date(dateRetourReelle);
        
        let fraisRetard = 0;
        let dureeRetardHeures = 0;

        if (retourReel > finPrevue) {
            const diffMs = retourReel - finPrevue;
            dureeRetardHeures = Math.ceil(diffMs / (1000 * 60 * 60));
            
            // Calcul selon le tarif de retard par heure
            fraisRetard = dureeRetardHeures * parseFloat(materiel.tarifRetardHeure);
            
            // Si plus de 24h de retard, appliquer également le tarif journalier
            if (dureeRetardHeures >= 24) {
                const joursRetard = Math.ceil(dureeRetardHeures / 24);
                fraisRetard += joursRetard * parseFloat(materiel.tarifRetardJour);
            }
        }

        res.status(200).json({
            dureeRetardHeures,
            fraisRetard: fraisRetard.toFixed(2),
            tarifRetardHeure: materiel.tarifRetardHeure,
            tarifRetardJour: materiel.tarifRetardJour
        });
        
    } catch (error) {
        console.error("Erreur de calcul des frais de retard:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors du calcul des frais de retard.", 
            error: error.message 
        });
    }
};

// Mettre à jour l'état d'un matériel
exports.updateEtatMateriel = async (req, res) => {
    try {
        const codeMat = req.params.codeMat;
        const { etatMat, dateProchaineMaintenance, notes } = req.body;
        
        const materiel = await Materiel.findByPk(codeMat);
        if (!materiel) {
            return res.status(404).json({ message: "Matériel non trouvé." });
        }

        const updateData = { etatMat };
        
        // Si mise en maintenance, enregistrer la date
        if (etatMat === 'Maintenance') {
            updateData.dateDerniereMaintenance = new Date();
            updateData.dateProchaineMaintenance = dateProchaineMaintenance;
        }

        await materiel.update(updateData);
        
        // Log de l'historique des changements d'état
        await db.historiqueEtatMateriel.create({
            codeMat,
            ancienEtat: materiel.etatMat,
            nouvelEtat: etatMat,
            notes,
            dateChangement: new Date()
        });

        res.status(200).json(materiel);
        
    } catch (error) {
        console.error("Erreur de mise à jour de l'état:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la mise à jour de l'état.", 
            error: error.message 
        });
    }
};