// backend/models/location.model.js (Exemple basé sur une table de location standard)

module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        idLo: { // Clé primaire réelle de la table 'location' dans la BD
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idRes: { // Clé étrangère vers le client
            type: DataTypes.INTEGER,
            allowNull: false
        },
         debLo: {
            // Le type est DATETIME dans votre base de données
            type: DataTypes.DATE, 
            allowNull: false
        },
        
        // 🚨 CORRECTION 2 : Utilisez finLo
        finLo: {
            // Le type est DATETIME dans votre base de données
            type: DataTypes.DATE, 
            allowNull: false
        },
        typeLo: {
    type: DataTypes.ENUM('Salle', 'Materiel', 'Mixte'),
    allowNull: false
     },
    etatLo: {
    type: DataTypes.ENUM('En attente', 'Confirmée', 'Annulée', 'Terminée'),
    defaultValue: 'En attente' 
},
      
        montantTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
        // Ajoutez ici les autres colonnes de votre table 'location'
    }, {
        tableName: 'location', // 🚨 Nom exact de la table dans MySQL
        timestamps: false,
        freezeTableName: true
    });

    // 🚨 N'oubliez pas les associations ici si nécessaire (ex: Location.belongsTo(db.client))
    
    return Location;
};