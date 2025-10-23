module.exports = (sequelize, DataTypes) => {
    const Materiel = sequelize.define('Materiel', {
        code: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        modele: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        marque: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        utilisateur: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        departement: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        statut: {
            type: DataTypes.ENUM('En service', 'En panne', 'En maintenance', 'Hors service', 'En stock'),
            defaultValue: 'En stock'
        },
        dateAcquisition: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateFinGarantie: {
            type: DataTypes.DATE,
            allowNull: true
        },
        prixAchat: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        numeroSerie: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        emplacement: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        fournisseur: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'materiel_bureau',
        timestamps: true,
        underscored: true
    });

    return Materiel;
};