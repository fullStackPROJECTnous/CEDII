// controllers/salleController.js

/*const db = require('../models/salle'); // Assuming you have an index.js in models to export the models
const Salle = db.Salle; // Access the Salle model

// --- CREATE (POST) ---
exports.createSalle = async (req, res) => {
    try {
        // You might want to sanitize and validate req.body here
        const newSalle = await Salle.create(req.body);
        res.status(201).send(newSalle);
    } catch (error) {
        console.error("Error creating salle:", error);
        res.status(500).send({ message: "Error creating salle", error: error.message });
    }
};


// --- READ ALL (GET) ---
exports.getAllSalles = async (req, res) => {
    try {
        const salles = await salle.findAll();
        res.status(200).send(salles);
    } catch (error) {
        console.error("Error retrieving salles:", error);
        res.status(500).send({ message: "Error retrieving salles", error: error.message });
    }
};

// --- READ ONE (GET by ID) ---
exports.findOneSalle = async (req, res) => {
    const id = req.params.id; // Get the ID from the route parameter
    try {
        const salle = await salle.findByPk(id);
        if (salle) {
            res.status(200).send(salle);
        } else {
            res.status(404).send({ message: `salle with id=${id} not found.` });
        }
    } catch (error) {
        console.error(`Error retrieving salle with id=${id}:`, error);
        res.status(500).send({ message: "Error retrieving salle", error: error.message });
    }
};

// --- UPDATE (PUT/PATCH) ---
exports.updateSalle = async (req, res) => {
    const id = req.params.id;
    try {
        const [numAffectedRows] = await salle.update(req.body, {
            where: { idSalle: id }
        });

        if (numAffectedRows === 1) {
            res.send({ message: "salle was updated successfully." });
        } else {
            // Either 0 rows (not found) or more than 1 (which shouldn't happen with a primary key)
            res.status(404).send({
                message: `Cannot update salle with id=${id}. Maybe salle was not found or req.body is empty!`
            });
        }
    } catch (error) {
        console.error(`Error updating salle with id=${id}:`, error);
        res.status(500).send({ message: "Error updating salle", error: error.message });
    }
};

// --- DELETE (DELETE) ---
exports.deleteSalle = async (req, res) => {
    const id = req.params.id;
    try {
        const numDeletedRows = await salle.destroy({
            where: { idSalle: id }
        });

        if (numDeletedRows === 1) {
            res.send({ message: "Salle was deleted successfully!" });
        } else {
            res.status(404).send({
                message: `Cannot delete salle with id=${id}. Maybe salle was not found!`
            });
        }
    } catch (error) {
        console.error(`Error deleting salle with id=${id}:`, error);
        res.status(500).send({ message: "Could not delete salle", error: error.message });
    }
};*/

const db = require('../models');
// 🚨 Assurez-vous que le modèle est Salle (avec la première lettre en majuscule pour la convention) 
// et qu'il est bien assigné à db.salle (en minuscule pour la clé d'export de l'index).
const Salle = db.salle; 

// 🚨 Assurez-vous que cette fonction est bien nommée 'getAllSalles' et exportée avec 'exports.'
exports.getAllSalles = async (req, res) => {
    try {
        // Le code ici peut planter si db.salle est undefined, mais l'erreur TypeError 
        // signifie que nous n'arrivons même pas à ce point.
        const salles = await Salle.findAll(); 
        
        res.status(200).json(salles);

    } catch (error) {
        console.error("Erreur Sequelize lors de la récupération des salles:", error); 
        res.status(500).json({ 
            message: "Error retrieving salles", 
            error: error.message 
        });
    }
};

// Si vous avez d'autres routes dans salleRoutes.js (comme POST, PUT, DELETE),
// ajoutez des stubs (fonctions vides) pour elles ici, sinon le serveur plantera à nouveau :
/*
exports.createSalle = (req, res) => {
    res.status(501).send({ message: "Not Implemented" });
};
*/