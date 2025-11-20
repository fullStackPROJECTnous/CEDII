const db = require('../models');

const Salle = db.Salle;
const Materiel = db.Materiel;

// --- Salles CRUD ---

exports.getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.findAll();
        res.status(200).send(salles);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des salles.", error: error.message });
    }
};

exports.createSalle = async (req, res) => {
    try {
        const nouvelleSalle = await Salle.create(req.body);
        res.status(201).send(nouvelleSalle);
    } catch (error) {
        res.status(400).send({ message: "Erreur de validation lors de la création de la salle.", error: error.message });
    }
};

exports.updateSalle = async (req, res) => {
    try {
        const [updated] = await Salle.update(req.body, {
            where: { idSalle: req.params.id } // Clé primaire: idSalle
        });

        if (updated) {
            const updatedSalle = await Salle.findByPk(req.params.id);
            return res.status(200).send(updatedSalle);
        }
        res.status(404).send({ message: 'Salle non trouvée.' });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la mise à jour de la salle.", error: error.message });
    }
};

// --- Matériel CRUD ---

exports.getAllMateriel = async (req, res) => {
    try {
        const materiels = await Materiel.findAll();
        res.status(200).send(materiels);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération du matériel.", error: error.message });
    }
};

exports.createMateriel = async (req, res) => {
    try {
        // 1. Déconstruire les champs envoyés par le client.
        const {
            designationMat, 
            categorieMat, 
            descriptionMat, 
            qteActuelStock, // C'est la quantité totale que vous entrez (ex: 6)
            tarifHeure, 
            tarifDemiJournee, 
            tarifJour, 
            dateAcquisition, 
            etatMat
        } = req.body;

        // 2. Définir les quantités de manière cohérente.
        
        // Assurer que le stock est un nombre entier valide
        const stock = parseInt(qteActuelStock) || 0;
        
        // Pour une nouvelle insertion, la quantité en location est 0.
        const location = 0; 
        
        // Calculer la quantité disponible (Disponible = Stock - Loué).
        // Le résultat doit être cohérent avec la validation : Stock (6) = Disponible (6) + Loué (0).
        const dispo = stock - location; 

        // 3. Création de l'enregistrement avec un objet complet et cohérent.
        const nouveauMateriel = await Materiel.create({
            // NOTE: N'incluez pas 'codeMat' ici si un TRIGGER ou Sequelize 
            // le génère automatiquement dans la base de données.
            designationMat, 
            categorieMat, 
            descriptionMat, 
            
            // 🎯 L'élément clé : Les trois champs sont présents et cohérents
            qteActuelStock: stock,     // Ex: 6
            qteEnLocation: location,   // Ex: 0
            qteTotDispo: dispo,        // Ex: 6
            
            tarifHeure, 
            tarifDemiJournee, 
            tarifJour, 
            dateAcquisition, 
            etatMat 
        });

        res.status(201).send(nouveauMateriel);

    } catch (error) {
        // Gestion des erreurs de validation spécifiques (y compris l'incohérence des quantités)
        console.error("Erreur lors de la création de matériel:", error);
        
        let errorMessage = error.message;
        // Tenter d'extraire le message d'erreur spécifique de Sequelize si c'est une validation
        if (error.name === 'SequelizeValidationError' && error.errors && error.errors.length > 0) {
            errorMessage = error.errors[0].message;
        } 
        
        res.status(400).send({ message: errorMessage || "Erreur de validation lors de la création du matériel." });
    }
};

exports.deleteMateriel = async (req, res) => {
    try {
        const deleted = await Materiel.destroy({
            where: { codeMat: req.params.id } // Clé primaire: codeMat
        });
        
        if (deleted) {
            return res.status(204).send({ message: "Matériel supprimé avec succès." });
        }
        res.status(404).send({ message: "Matériel non trouvé." });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la suppression du matériel.", error: error.message });
    }
};