module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
        idRes: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idCli: { // Clé étrangère vers Client
            type: DataTypes.INTEGER,
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
            type: DataTypes.INTEGER,
            allowNull: false
        },
        typeRes: {
            type: DataTypes.ENUM('Salle', 'Materiel', 'Mixte'),
            allowNull: false
        },
        nbPerso: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        debRes: {
            type: DataTypes.DATE,
            allowNull: false
        },
        finRes: {
            type: DataTypes.DATE,
            allowNull: false
        },
        tarifTot: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        etatRes: {
            type: DataTypes.ENUM('En attente', 'Confirmée', 'Annulée'),
            defaultValue: 'En attente',
            allowNull: true
        },
        idSalle: { // Clé étrangère vers Salle
            type: DataTypes.INTEGER,
            allowNull: true
        },
        codeMat: { // Clé étrangère vers Materiel
            type: DataTypes.STRING(30),
            allowNull: true
        }
    }, { 
        tableName: 'reservation', 
        timestamps: false 
    });

   // Définition des associations
Reservation.associate = (models) => {
        // La réservation appartient à un Client (c'est l'association que vous essayez d'inclure)
        Reservation.belongsTo(models.Client, {
            foreignKey: 'idCli', // ⬅️ Clé étrangère dans la table 'reservation'
            as: 'client'         // ⬅️ DOIT CORRESPONDRE à l'alias utilisé dans locationController.js
        });
        
        // Ajoutez vos autres associations ici (ex: Salle, Materiel, si non déjà fait)
        Reservation.belongsTo(models.Salle, {
            foreignKey: 'idSalle',
            as: 'salle'
        });
    };


    return Reservation;
};