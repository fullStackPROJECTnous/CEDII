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
db.user = require('./user')(sequelize, DataTypes); 
db.utilisateur = require('./utilisateur.js')(sequelize, DataTypes); 
db.location = require('./location.js')(sequelize, DataTypes);
db.reservation = require('./reservation.js')(sequelize, DataTypes); 
db.materiel = require("./materiel.js")(sequelize, DataTypes); 
db.salle = require("./salle.js")(sequelize, DataTypes); 
db.materielBureau = require('./materielModel.js')(sequelize, DataTypes) ;

// --- FIN DU CHARGEMENT DES MODÈLES ---


// models/index.js

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synchronized successfully.");
    })
    .catch((err) => {
        console.error("Failed to synchronize database:", err);
    });

module.exports = db;
