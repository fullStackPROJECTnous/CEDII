// backend/models/historiqueEmail.js
module.exports = (sequelize, DataTypes) => {
    const HistoriqueEmail = sequelize.define('HistoriqueEmail', {
        idHist: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idPaie: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dateEnvoi: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        destinataire: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sujet: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        statutEnvoi: {
            type: DataTypes.ENUM('Envoyé', 'Échec'),
            defaultValue: 'Envoyé'
        },
        erreurMessage: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'historique_email',
        timestamps: false
    });

    HistoriqueEmail.associate = (models) => {
        HistoriqueEmail.belongsTo(models.Paiement, {
            foreignKey: 'idPaie',
            as: 'paiement'
        });
    };

    return HistoriqueEmail;
};