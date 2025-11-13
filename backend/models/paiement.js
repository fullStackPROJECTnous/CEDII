// backend/models/paiement.js (Adapté à votre schéma existant)
/*module.exports = (sequelize, DataTypes) => {
    const Paiement = sequelize.define('Paiement', {
        idPaie: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idLo: { // Clé étrangère vers Location (selon votre SQL)
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dateCre: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        modePaie: { 
            type: DataTypes.ENUM('Cash', 'Virement'),
            allowNull: false
        },
        montantPaie: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        statutPaie: { // 'En attente', 'Effectué', 'Annulé'
            type: DataTypes.ENUM('En attente', 'Effectué', 'Annulé'),
            defaultValue: 'En attente'
        }
    }, {
        tableName: 'paiement',
        timestamps: false
    });

  

     Paiement.associate = (models) => {
        // Lier Paiement à Location via idLo
        Paiement.belongsTo(models.Location, { foreignKey: 'idLo', as: 'Location' });
    };

    return Paiement;
};*/

// backend/models/paiement.js

module.exports = (sequelize, DataTypes) => {
    const Paiement = sequelize.define('Paiement', {
        idPaie: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numeroFacture: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: true
        },
        idLo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dateCre: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        dateFacture: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        dateEcheance: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        modePaie: {
            type: DataTypes.ENUM('Cash', 'Virement'),
            allowNull: false
        },
        montantPaie: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        fichierFacture: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        emailEnvoye: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        dateEnvoiEmail: {
            type: DataTypes.DATE,
            allowNull: true
        },
        libellePaie: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        statutPaie: {
            type: DataTypes.ENUM('En attente', 'Effectué', 'Annulé'),
            defaultValue: 'En attente'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'paiement',
        timestamps: false
    });

    // 🔗 Associations
    Paiement.associate = (models) => {
        // Paiement → Location (clé étrangère idLo)
        Paiement.belongsTo(models.Location, {
            foreignKey: 'idLo',
            as: 'locations',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Paiement → HistoriqueEmail (relation 1:N)
        Paiement.hasMany(models.HistoriqueEmail, {
            foreignKey: 'idPaie',
            as: 'historiquesEmail',
            onDelete: 'CASCADE'
        });
    };

    return Paiement;
};
