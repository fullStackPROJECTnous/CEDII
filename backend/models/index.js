// backend/models/index.js

/*const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js'); // Importe le fichier créé ci-dessus


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false, // Met à false pour éviter trop de logs dans le terminal
    pool: dbConfig.pool
});
'use strict';

const fs = require('fs');
const path = require('path');




// Assurez-vous que votre configuration est chargée correctement





const db = {}; 

db.Sequelize = Sequelize;
db.sequelize = sequelize;



// 🚨 LIAISON DU MODÈLE CLIENT (backend/models/client.js)
db.Client = require('./client.js')(sequelize, Sequelize); 
//db.Utilisateur = require('./utilisateur.js')(sequelize, Sequelize); 
db.user = require('./user')(sequelize, Sequelize); 
db.utilisateur = require('./utilisateur.js')(sequelize, Sequelize); 
db.location = require('./location.js')(sequelize, Sequelize.DataTypes);
db.reservation = require('./reservation.js')(sequelize, Sequelize.DataTypes); 
db.materiel = require("./materiel.js")(sequelize, Sequelize.DataTypes); 
db.salle = require("./salle.js")(sequelize, Sequelize.DataTypes); 
//db.Salle = require('./salle.js')(sequelize, DataTypes);
//db.User = require('./user.js')(sequelize, Sequelize);
// Synchronisation de la base de données

// 1. Location est liée à Reservation (FK: idRes dans Location)
//db.location.belongsTo(db.reservation, { foreignKey: 'idRes' });
//db.reservation.hasMany(db.location, { foreignKey: 'idRes' });

// 2. Reservation est liée à Client (FK: idCli dans Reservation)
//db.reservation.belongsTo(db.client, { foreignKey: 'idCli' });
//db.client.hasMany(db.reservation, { foreignKey: 'idCli' });

db.Client.belongsTo(db.utilisateur, { foreignKey: 'idUti' });

// 2.2 Associations Réservation ↔ Client (Reservation.idCli -> Client.idCli)
db.reservation.belongsTo(db.Client, { foreignKey: 'idCli' }); // 🚨 Ceci est la ligne qui semble planter (ligne 41 ?)
db.Client.hasMany(db.reservation, { foreignKey: 'idCli' });

// 2.3 Associations Location ↔ Réservation (Location.idRes -> Reservation.idRes)
db.location.belongsTo(db.reservation, { foreignKey: 'idRes' });

// 2.4 Associations Réservation ↔ Salle/Matériel
db.reservation.belongsTo(db.salle, { foreignKey: 'idSalle' });
db.reservation.belongsTo(db.materiel, { foreignKey: 'codeMat' });

db.reservation.belongsTo(db.Client, { 
    foreignKey: 'idCli',
    as: 'ClientData' // 🚨 AJOUTER L'ALIAS EXPLICITE
});

db.Client.hasMany(db.reservation, { 
    foreignKey: 'idCli' 
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // C'est ici que les associations sont exécutées!
  }
});


// models/index.js





// 1. CHARGEMENT DE TOUS LES MODÈLES
/*fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      // ... exclusions habituelles ...
      file.slice(-3) === '.js' // 🚨 Assurez-vous qu'il charge TOUS les fichiers .js
    );
  })

  .forEach(file => {
    // 🚨 VÉRIFIEZ L'IMPORTATION ICI : Sequelize recommande d'utiliser l'importation par défaut
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 2. EXÉCUTION DES ASSOCIATIONS
Object.keys(db).forEach(modelName => {
  // 🚨 Cette boucle parcourt tous les modèles et appelle la méthode 'associate'
  // SI la méthode 'associate' existe sur le modèle.
  if (db[modelName].associate) {
    db[modelName].associate(db); // Passe l'objet 'db' (qui contient tous les modèles)
  }
});




db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synchronized successfully.");
    })
    .catch((err) => {
        console.error("Failed to synchronize database:", err);
    });

module.exports = db;*/

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

// --- FIN DU CHARGEMENT DES MODÈLES ---


// 🚨 SUPPRESSION DES ASSOCIATIONS DIRECTES DANS index.js
// Elles doivent être définies DANS les fichiers de modèles pour éviter le plantage
// si le modèle associé n'est pas encore initialisé (d'où le "not a subclass of Sequelize.Model").

/*
// Anciennes associations supprimées pour utiliser la boucle 'associate'
db.Client.belongsTo(db.utilisateur, { foreignKey: 'idUti' });
db.reservation.belongsTo(db.Client, { foreignKey: 'idCli' }); 
db.Client.hasMany(db.reservation, { foreignKey: 'idCli' });
db.location.belongsTo(db.reservation, { foreignKey: 'idRes' });
db.reservation.belongsTo(db.salle, { foreignKey: 'idSalle' });
db.reservation.belongsTo(db.materiel, { foreignKey: 'codeMat' });
db.reservation.belongsTo(db.Client, { 
    foreignKey: 'idCli',
    as: 'ClientData' 
});
db.Client.hasMany(db.reservation, { 
    foreignKey: 'idCli' 
});
*/

// 2. EXÉCUTION DES ASSOCIATIONS (CETTE PARTIE EST CRUCIALE ET CORRECTE)
// Elle exécute la fonction `associate` définie dans CHAQUE fichier de modèle.
/*Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) { // Ajout d'une vérification pour s'assurer que l'objet existe
    db[modelName].associate(db); // C'est ici que les associations sont exécutées!
  }
});
*/

// models/index.js

db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synchronized successfully.");
    })
    .catch((err) => {
        console.error("Failed to synchronize database:", err);
    });

module.exports = db;
