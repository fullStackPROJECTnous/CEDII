

const db = require('../models');
const Materiel = db.Materiel;
const HistoriqueEmprunt = db.historiqueEmprunt;
const { Op } = require('sequelize');

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

// ------------------------------------
// 2. Créer un nouveau matériel (avec génération automatique du code)
// URL: POST /api/patrimoine
// ------------------------------------
exports.createMateriel = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({ message: "Le corps de la requête est vide." });
    }

    const { 
        designationMat, categorieMat, descriptionMat, 
        qteTotDispo, qteActuelStock, qteEnLocation,
        tarifHeure, tarifDemiJournee, tarifJour, 
        dateAcquisition, etatMat 
    } = req.body;
    
    // Convertir les quantités en nombres
    const stock = Number(qteActuelStock) || 0;
    const dispo = Number(qteTotDispo) || 0;
    const location = Number(qteEnLocation) || 0;
    
    // Validation des champs requis
    if (!designationMat || dispo === undefined || stock === undefined || tarifJour === undefined || !dateAcquisition) {
        return res.status(400).send({ 
            message: "Les champs désignation, quantités (stock, dispo), tarif journalier et date d'acquisition sont requis." 
        });
    }

    // Validation de la logique des quantités
    if (stock !== (dispo + location)) {
         return res.status(400).send({ 
             message: "Incohérence des quantités: qteActuelStock (Total) doit être égal à (qteTotDispo + qteEnLocation)."
         });
    }

    try {
        // 1. Déterminer l'année d'acquisition
        const acquisitionYear = new Date(dateAcquisition).getFullYear();

        // 2. Trouver le dernier codeMat pour cette année
        const lastMateriel = await Materiel.findOne({
            where: {
                codeMat: {
                    [Op.like]: `MAT-A${acquisitionYear}-CEDII/%`
                }
            },
            order: [['codeMat', 'DESC']]
        });

        let nextSequentialNumber = 1;

        if (lastMateriel) {
            // Extraire le numéro séquentiel du dernier code
            const parts = lastMateriel.codeMat.split('/');
            const lastNumber = parseInt(parts[parts.length - 1], 10);
            nextSequentialNumber = lastNumber + 1;
        }

        // 3. Formatter le nouveau codeMat (padding à trois chiffres)
        const codeMat = `MAT-A${acquisitionYear}-CEDII/${nextSequentialNumber.toString().padStart(3, '0')}`;
        
        // 4. Création de l'enregistrement
        const materiel = await Materiel.create({
            codeMat,
            designationMat, 
            categorieMat, 
            descriptionMat, 
            qteTotDispo: dispo, 
            qteActuelStock: stock, 
            qteEnLocation: location, 
            tarifHeure, 
            tarifDemiJournee, 
            tarifJour, 
            dateAcquisition, 
            etatMat 
        });

        res.status(201).send({ 
            message: "Matériel créé avec succès.", 
            data: materiel 
        });

    } catch (error) {
        console.error("Erreur Sequelize lors de la création du matériel:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la création du matériel.", 
            error: error.message 
        });
    }
};

// ------------------------------------
// 3. Récupérer un seul matériel par Code
// URL: GET /api/patrimoine/:code
// ------------------------------------
exports.getMaterielByCode = async (req, res) => {
    const code = req.params.code;

    try {
        const materiel = await Materiel.findOne({
            where: { codeMat: code }
        });
        
        if (materiel) {
            res.status(200).send(materiel);
        } else {
            res.status(404).send({ message: `Matériel avec Code=${code} non trouvé.` });
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération du matériel Code=${code}:`, error);
        res.status(500).send({ message: "Erreur interne lors de la récupération du matériel." });
    }
};

// ------------------------------------
// 4. Mettre à jour un matériel
// URL: PUT /api/patrimoine/:code
// ------------------------------------
exports.updateMateriel = async (req, res) => {
    try {
        const codeMat = req.params.code;
        const { qteTotDispo, qteActuelStock, qteEnLocation } = req.body;

        const materiel = await Materiel.findByPk(codeMat);
        
        if (!materiel) {
            return res.status(404).json({ message: "Matériel non trouvé." });
        }

        // Re-validation de la logique des quantités si elles sont modifiées
        if (qteActuelStock !== undefined && qteTotDispo !== undefined && qteEnLocation !== undefined) {
            if (qteActuelStock !== (qteTotDispo + qteEnLocation)) {
                return res.status(400).send({ 
                    message: "Incohérence des quantités lors de la mise à jour : Stock Total doit être égal à (Prêt à louer + En Location)."
                });
            }
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

// ------------------------------------
// 5. Supprimer un matériel
// URL: DELETE /api/patrimoine/:code
// ------------------------------------
exports.deleteMateriel = async (req, res) => {
    try {
        const codeMat = req.params.code;
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

// ------------------------------------
// 6. Récupérer l'historique d'emprunt d'un matériel
// URL: GET /api/patrimoine/:code/historique
// ------------------------------------
exports.getHistoriqueEmprunt = async (req, res) => {
    try {
        const codeMat = req.params.code;
        
        // Note: Vous devrez adapter cette partie selon vos modèles
        // Pour l'instant, cette fonction nécessite les modèles HistoriqueEmprunt, Reservation et Client
        /*
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
        */

        // Version temporaire - retourne un message indiquant que la fonctionnalité est en développement
        res.status(200).json({ 
            message: "Fonctionnalité d'historique en cours de développement",
            codeMat: codeMat
        });
        
    } catch (error) {
        console.error("Erreur de récupération de l'historique:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération de l'historique.", 
            error: error.message 
        });
    }
};

// ------------------------------------
// 7. Calculer les frais de retard
// URL: POST /api/patrimoine/calculer-retard
// ------------------------------------
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
            // Note: Ajoutez les champs tarifRetardHeure et tarifRetardJour dans votre modèle si nécessaire
            const tarifRetardHeure = materiel.tarifRetardHeure || 0;
            const tarifRetardJour = materiel.tarifRetardJour || 0;
            
            fraisRetard = dureeRetardHeures * parseFloat(tarifRetardHeure);
            
            // Si plus de 24h de retard, appliquer également le tarif journalier
            if (dureeRetardHeures >= 24) {
                const joursRetard = Math.ceil(dureeRetardHeures / 24);
                fraisRetard += joursRetard * parseFloat(tarifRetardJour);
            }
        }

        res.status(200).json({
            dureeRetardHeures,
            fraisRetard: fraisRetard.toFixed(2),
            tarifRetardHeure: materiel.tarifRetardHeure || 0,
            tarifRetardJour: materiel.tarifRetardJour || 0
        });
        
    } catch (error) {
        console.error("Erreur de calcul des frais de retard:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors du calcul des frais de retard.", 
            error: error.message 
        });
    }
};

// ------------------------------------
// 8. Mettre à jour l'état d'un matériel
// URL: PUT /api/patrimoine/:code/etat
// ------------------------------------
exports.updateEtatMateriel = async (req, res) => {
    try {
        const codeMat = req.params.code;
        const { etatMat, dateProchaineMaintenance, notes } = req.body;
        
        const materiel = await Materiel.findByPk(codeMat);
        if (!materiel) {
            return res.status(404).json({ message: "Matériel non trouvé." });
        }

        const ancienEtat = materiel.etatMat;
        const updateData = { etatMat };
        
        // Si mise en maintenance, enregistrer la date
        if (etatMat === 'Maintenance') {
            updateData.dateDerniereMaintenance = new Date();
            updateData.dateProchaineMaintenance = dateProchaineMaintenance;
        }

        await materiel.update(updateData);
        
        // Log de l'historique des changements d'état
        // Note: Vous devrez créer le modèle historiqueEtatMateriel si nécessaire
        /*
        await db.historiqueEtatMateriel.create({
            codeMat,
            ancienEtat: ancienEtat,
            nouvelEtat: etatMat,
            notes,
            dateChangement: new Date()
        });
        */

        res.status(200).json({
            message: "État du matériel mis à jour avec succès",
            materiel: materiel,
            ancienEtat: ancienEtat,
            nouvelEtat: etatMat
        });
        
    } catch (error) {
        console.error("Erreur de mise à jour de l'état:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la mise à jour de l'état.", 
            error: error.message 
        });
    }
};

// ------------------------------------
// 9. Récupérer tous les matériels (version alternative)
// URL: GET /api/patrimoine/all
// ------------------------------------
exports.getAllMateriels = async (req, res) => {
    try {
        const materiels = await Materiel.findAll({
            order: [['designationMat', 'ASC']]
        });
        res.status(200).send(materiels);
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les matériels:", error);
        res.status(500).send({ message: "Erreur interne lors de la récupération des matériels." });
    }
};
/*
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
};*/