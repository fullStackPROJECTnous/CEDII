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
        idCli: { // Si la location est aussi liée directement au client
            type: DataTypes.INTEGER,
            allowNull: true // Supposition
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
    type: DataTypes.ENUM('En attente', 'Confirmée', 'Annulée'),
    defaultValue: 'En attente' 
},
      
        tarifTot: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
        // Ajoutez ici les autres colonnes de votre table 'location'
    }, {
        tableName: 'location', // 🚨 Nom exact de la table dans MySQL
        timestamps: false,
        freezeTableName: true
    });


    
        

  Location.associate = (models) => {
        // Association 1 : La Location appartient à une Réservation (idRes)
        Location.belongsTo(models.Reservation, {
            foreignKey: 'idRes', 
            as: 'reservation' // Alias utilisé pour l'inclusion dans le contrôleur
        });
    // 🚨 N'oubliez pas les associations ici si nécessaire (ex: Location.belongsTo(db.client))
        // Une location appartient à un client.
        Location.belongsTo(models.Client, {
            foreignKey: 'idCli', 
            as: 'client' 
        });
   } 

    return Location;
};