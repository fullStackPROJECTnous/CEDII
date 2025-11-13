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
db.HistoriqueEmail = require('./historiqueEmail.js')(sequelize, DataTypes);
db.Paiement = require("./paiement.js")(sequelize, DataTypes); 




// --- SECTION CRITIQUE : MISE EN PLACE DES ASSOCIATIONS ---
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) { 
    if (modelName !== 'Sequelize' && modelName !== 'sequelize') {
      db[modelName].associate(db); // ⬅️ CETTE LIGNE EST CRITIQUE
    }
  }
});

// 🚨 CORRECTION DÉFINITIVE : FORCER L'ASSOCIATION BELONGS TO
// Ceci contourne tout problème de casse ou d'exécution dans la boucle forEach.
/*if (db.Client && db.utilisateur) {
    db.Client.belongsTo(db.utilisateur, {
        foreignKey: 'idUti',
        as: 'utilisateur' // ⬅️ L'alias utilisé dans le contrôleur clientController.js
    });

    db.utilisateur.hasOne(db.Client, {
        foreignKey: 'idUti',
        as: 'clientProfile'
    });
}*/
// --- FIN DE LA MISE EN PLACE DES ASSOCIATIONS ---

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
