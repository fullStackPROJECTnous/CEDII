// backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js'); // Importe le fichier créé ci-dessus


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false, // Met à false pour éviter trop de logs dans le terminal
    pool: dbConfig.pool
});
'use strict';

// Retiré : const fs = require('fs');
// Retiré : const path = require('path');

// Assurez-vous que votre configuration est chargée correctement

const db = {}; 

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// 🚨 HARMONISATION ET LIAISON DES MODÈLES
// Nous passons (sequelize, DataTypes) à tous les fichiers de modèles pour cohérence.
// Assurez-vous que tous les fichiers de modèles (.js) acceptent ces deux arguments.

db.Client = require('./client.js')(sequelize, DataTypes); 
db.User = require('./user')(sequelize, DataTypes); 
db.utilisateur = require('./utilisateur.js')(sequelize, DataTypes); 
db.Location = require('./location.js')(sequelize, DataTypes);
db.Reservation = require('./reservation.js')(sequelize, DataTypes); 
db.Materiel = require("./materiel.js")(sequelize, DataTypes); 
db.Salle = require("./salle.js")(sequelize, DataTypes); 
db.MaterielBureau = require('./materielModel.js')(sequelize, DataTypes) ;

// --- SECTION CRITIQUE : MISE EN PLACE DES ASSOCIATIONS ---
Object.keys(db).forEach(modelName => {
    // Si un modèle charge 'undefined', la ligne db[modelName].associate échoue.
    if (db[modelName] && db[modelName].associate) { // 🚨 Ajout d'un contrôle 'db[modelName]'
        db[modelName].associate(db);
    }
});
// --- FIN DE LA MISE EN PLACE DES ASSOCIATIONS ---


// models/index.js

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synchronized successfully.");
    })
    .catch((err) => {
        console.error("Failed to synchronize database:", err);
    });

module.exports = db;
