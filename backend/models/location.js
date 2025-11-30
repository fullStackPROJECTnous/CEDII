// backend/models/location.model.js
module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        idLo: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        idRes: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        idCatalogue: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        dateCre: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        qteMat: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        typeLo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        nbPerso: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        debLo: {
            type: DataTypes.DATE,
            allowNull: false
        },
        finLo: {
            type: DataTypes.DATE,
            allowNull: false
        },
        tarifTot: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        etatLo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'En attente'
        }
    }, {
        tableName: 'location',
        timestamps: false,
        freezeTableName: true
    });

    Location.associate = (models) => {
        // Association avec Reservation
        Location.belongsTo(models.Reservation, {
            foreignKey: 'idRes', 
            as: 'reservation'
        });
        
        // Association avec Paiement
        Location.hasMany(models.Paiement, {
            foreignKey: 'idLo',
            as: 'paiements',
            onDelete: 'CASCADE'
        });
        
        // Si vous n'avez pas de modèle Catalogue, supprimez cette association
        // Location.belongsTo(models.Catalogue, {
        //     foreignKey: 'idCatalogue',
        //     as: 'catalogue'
        // });
    };

    return Location;
};