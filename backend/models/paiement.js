// backend/models/paiement.js (Adapté à votre schéma existant)
module.exports = (sequelize, DataTypes) => {
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
            type: DataTypes.ENUM('Cash', 'Carte', 'MobileMoney', 'Virement'),
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
};