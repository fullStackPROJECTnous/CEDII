// controllers/clientController.js

const db = require('../models'); // Assuming you have an index.js in models to export the models
const Client = db.Client; // Access the Client model

// --- CREATE (POST) ---
exports.createClient = async (req, res) => {
    try {
        // You might want to sanitize and validate req.body here
        const client = await Client.create(req.body);
        res.status(201).send(client);
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(500).send({ message: "Error creating client", error: error.message });
    }
};

exports.getAllClients = async (req, res) => {
    try {
        // La méthode findAll() de Sequelize récupère toutes les lignes de la table `client`.
        const clients = await Client.findAll({
            // Vous pouvez inclure ici des options comme `order`, `attributes`, ou `include` (si vous avez des associations)
            order: [['nomCli', 'ASC']]
        });
        
        // Retourne les données en JSON
        res.status(200).json(clients);
        
    } catch (error) {
        console.error("Erreur Sequelize lors de la récupération des clients:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des clients.", 
            error: error.message 
        });
    }
};


// --- READ ALL (GET) ---
/*exports.findAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).send(clients);
    } catch (error) {
        console.error("Error retrieving clients:", error);
        res.status(500).send({ message: "Error retrieving clients", error: error.message });
    }
};*/

// --- READ ONE (GET by ID) ---
exports.findOneClient = async (req, res) => {
    const id = req.params.id; // Get the ID from the route parameter
    try {
        const client = await Client.findByPk(id);
        if (client) {
            res.status(200).send(client);
        } else {
            res.status(404).send({ message: `Client with id=${id} not found.` });
        }
    } catch (error) {
        console.error(`Error retrieving client with id=${id}:`, error);
        res.status(500).send({ message: "Error retrieving client", error: error.message });
    }
};

// --- UPDATE (PUT/PATCH) ---
exports.updateClient = async (req, res) => {
    const id = req.params.id;
    try {
        const [numAffectedRows] = await Client.update(req.body, {
            where: { idCli: id }
        });

        if (numAffectedRows === 1) {
            res.send({ message: "Client was updated successfully." });
        } else {
            // Either 0 rows (not found) or more than 1 (which shouldn't happen with a primary key)
            res.status(404).send({
                message: `Cannot update Client with id=${id}. Maybe Client was not found or req.body is empty!`
            });
        }
    } catch (error) {
        console.error(`Error updating client with id=${id}:`, error);
        res.status(500).send({ message: "Error updating client", error: error.message });
    }
};

// --- DELETE (DELETE) ---
exports.deleteClient = async (req, res) => {
    const id = req.params.id;
    try {
        const numDeletedRows = await Client.destroy({
            where: { idCli: id }
        });

        if (numDeletedRows === 1) {
            res.send({ message: "Client was deleted successfully!" });
        } else {
            res.status(404).send({
                message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
            });
        }
    } catch (error) {
        console.error(`Error deleting client with id=${id}:`, error);
        res.status(500).send({ message: "Could not delete client", error: error.message });
    }
};