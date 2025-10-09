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
    // Note: Le codeMat est généré par un TRIGGER dans votre DB. 
    // Si Sequelize doit insérer, il faudra soit désactiver le TRIGGER côté DB, 
    // soit vous assurer que Sequelize n'envoie pas le codeMat (si il est auto-généré), ou l'envoie si la logique est dans l'app.
    try {
        const nouveauMateriel = await Materiel.create(req.body);
        res.status(201).send(nouveauMateriel);
    } catch (error) {
        res.status(400).send({ message: "Erreur de validation lors de la création du matériel.", error: error.message });
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