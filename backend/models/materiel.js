// backend/models/materiel.model.js

/*module.exports = (sequelize, DataTypes) => {
    const Materiel = sequelize.define('Materiel', {
        codeMat: {
            type: DataTypes.STRING(30),
            primaryKey: true,
            allowNull: false
        },
        designationMat: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        categorieMat: {
            type: DataTypes.STRING(50),
            allowNull: true // DEFAULT NULL dans SQL
        },
        descriptionMat: {
            type: DataTypes.TEXT,
            allowNull: true // DEFAULT NULL dans SQL
        },
        qteTotDispo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        qteActuelDispo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        qteEnLocation: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // DEFAULT 0 dans SQL
        },
        // Colonne qteMat: Inclus car elle existe dans la table, même si elle semble redondante avec qteTotDispo
        qteMat: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tarifLocation: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        dateAcquisition: {
            type: DataTypes.DATEONLY, // Utilisez DATEONLY pour les champs DATE SQL
            allowNull: false
        }
    }, {
        // Options de la table
        tableName: 'materiel',         // 🚨 NOM DE LA TABLE EN MINUSCULE
        timestamps: false,             // Pas de champs createdAt/updatedAt dans votre schéma
        freezeTableName: true          // Empêche Sequelize de mettre le nom au pluriel
    });

    return Materiel;
};*/

module.exports = (sequelize, DataTypes) => {
    const Materiel = sequelize.define('Materiel', {
        codeMat: {
            type: DataTypes.STRING(30),
            primaryKey: true,
            allowNull: false
        },
        designationMat: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        categorieMat: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        descriptionMat: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        qteTotDispo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        qteActuelStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        qteEnLocation: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tarifHeure: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        tarifDemiJournee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        tarifJour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        qteMat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dateAcquisition: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        etatMat: {
            type: DataTypes.ENUM('Neuf', 'Bon état', 'Endommagé', 'Maintenance', 'Hors-Service'),
            allowNull: false,
            defaultValue: 'Bon état'
        }
    }, {
        tableName: 'materiel',
        timestamps: false,
        freezeTableName: true
    });
     Materiel.associate = (models) => {
        Materiel.hasMany(models.Reservation, {
            foreignKey: 'codeMat',
            as: 'reservations'
        });
    };

    return Materiel;
};