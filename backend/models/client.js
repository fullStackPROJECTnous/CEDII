// models/client.js

/*const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const Client = sequelize.define('Client', {
        idCli: {
            type: DataTypes.INTEGER(11), // Corresponds to varchar(11)
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: 'idCli' // Ensures the model attribute name maps to the table column name
        },
        nomCli: {
            type: DataTypes.STRING(60), // Corresponds to varchar(60)
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
            type: DataTypes.STRING(13), // Corresponds to int(13)
            allowNull: false,
            field: 'telephoneCli'
        },
        addresseCli: {
            type: DataTypes.STRING(45), // Corresponds to varchar(45)
            allowNull: false,
            field: 'addresseCli'
        },
        typeCli: {
            type: DataTypes.STRING(31), // Corresponds to varchar(31)
            allowNull: false,
            field: 'typeCli'
        },
        statutCli: {
            type: DataTypes.STRING(23), // Corresponds to varchar(23)
            allowNull: false,
            field: 'statutCli'
        },
          idUti: { 
            type: DataTypes.INTEGER,
            allowNull: true, // Peut être null si c'est un client "libre" non enregistré
            references: {
                model: 'utilisateur', // Nom de la table Utilisateur
                key: 'idUti'
            }
        }

        
    }, {
        tableName: 'client', // Explicitly set the table name
        timestamps: false, // Assuming you don't want Sequelize to manage 'createdAt' and 'updatedAt'
        freezeTableName: true // Prevents Sequelize from pluralizing the table name
    });

    
         // DOIT être un modèle Sequelize valide.
    Client.belongsTo(models.User, { // Supposition : Le client est lié à un utilisateur
        foreignKey: 'userId', // Clé étrangère dans la table 'client'
        as: 'creator'
    });
   };


    return Client;
}
    */

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
            allowNull: false,
            field: 'typeCli'
        },
        statutCli: {
            type: DataTypes.STRING(23),
            allowNull: false,
            field: 'statutCli'
        },
        idUti: { 
            type: DataTypes.INTEGER,
            allowNull: true, 
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
    
 

     Client.associate = (models) => {
        // Un client peut avoir plusieurs locations.
        // L'alias 'locations' DOIT correspondre à l'alias utilisé dans le contrôleur (as: 'locations').
        // 'foreignKey' doit pointer vers la clé étrangère dans la table Location qui référence Client.
        Client.hasMany(models.location, {
            foreignKey: 'idCli', // 🚨 Assurez-vous que c'est la bonne clé étrangère dans la table Location
            as: 'locations' 
        });
    }
    Client.associate = (models) => {
        // Un client peut avoir plusieurs réservations
        Client.hasMany(models.Reservation, {
            foreignKey: 'idCli', // ⬅️ Clé étrangère dans la table 'reservation'
            as: 'reservations'
        });
    };

    // 🚨 AJOUT CRITIQUE : RELATION INVERSE 🚨
    Client.associate = (models) => {
        // Un client appartient à un seul utilisateur via sa clé étrangère 'idUti'
        Client.belongsTo(models.utilisateur, { 
            foreignKey: 'idUti',
            
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
  



 




 
