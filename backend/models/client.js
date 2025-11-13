

const { DataTypes } = require('sequelize');



module.exports = (sequelize) => {
    const Client = sequelize.define('Client', {
        idCli: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: 'idCli'
        },
        nomCli: {
            type: DataTypes.STRING(60),
            allowNull: false,
            field: 'nomCli'
        },
        prenomCli: {
            type: DataTypes.STRING(60),
            allowNull: true,
            field:'prenomCli'
        },
        emailCli: {
            type:DataTypes.STRING(90),
            allowNull: true,
            field:'emailCli'
        },
        telephoneCli: {
            type: DataTypes.STRING(13), 
            allowNull: false,
            field: 'telephoneCli'
        },
        addresseCli: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'addresseCli'
        },
        typeCli: {
            type: DataTypes.STRING(31),


            allowNull: true,
            field: 'typeCli'
        },
        statutCli: {
            type: DataTypes.STRING(23),
            allowNull: false,
            field: 'statutCli'
        },
        idUti: { 
            type: DataTypes.INTEGER,
            allowNull: false, 
            references: {
                model: 'utilisateur', 
                key: 'idUti'
            }
        }

    }, {
        tableName: 'client', 
        timestamps: false, 
        freezeTableName: true 
    });
    
 
    // 🚨 CORRECTION DES ASSOCIATIONS SEQUELIZE
    Client.associate = (models) => {
        
        // 1. ASSOCIATION AVEC UTILISATEUR (Pour le profil) - CELLE QUI ÉCHAIT
        Client.belongsTo(models.utilisateur, { 
            foreignKey: 'idUti', 
            as: 'utilisateur' // ⬅️ Ceci est maintenant correctement inclus
        });
        
        // 2. ASSOCIATION AVEC LOCATION
        Client.hasMany(models.Location, {
            foreignKey: 'idCli', 
            as: 'locations' 
        });

        // 3. ASSOCIATION AVEC RESERVATION
        // Note: Assurez-vous que l'alias du modèle est 'Reservation' ou 'reservation' selon index.js
        Client.hasMany(models.Reservation, {
            foreignKey: 'idCli', 
            as: 'reservations'
        });
    };
    
    return Client;
};
   

        
        // 2. Un Client appartient à un Utilisateur (l'association que vous aviez commencée)
        /*Client.belongsTo(models.Utilisateur, { 
             foreignKey: 'idUti', 
             as: 'utilisateur'
        });
         };*/
        
        // Si vous avez un modèle Reservation distinct, il faudrait aussi ajouter :
        // Client.hasMany(models.Reservation, { foreignKey: 'idCli', as: 'reservations' });
  



 




 
