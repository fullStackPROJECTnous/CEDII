// backend/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js'); // Importe le fichier créé ci-dessus


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false, // Met à false pour éviter trop de logs dans le terminal
    pool: dbConfig.pool
});



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
        db[modelName].associate(db);
    }
});
db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Database synchronized successfully.");
    })
    .catch((err) => {
        console.error("Failed to synchronize database:", err);
    });

module.exports = db;