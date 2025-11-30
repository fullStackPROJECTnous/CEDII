
module.exports = (sequelize, DataTypes) => {
    const Salle = sequelize.define('Salle', {
        idSalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nomSalle: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        numeroSalle: {
            type: DataTypes.STRING(20),
            unique: true
        },
        capaciteSalle: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        disponibiliteSalle: {
            type: DataTypes.ENUM('Disponible', 'Occupée', 'Maintenance'), 
            defaultValue: 'Disponible'
        },
        // COLONNES MANQUANTES - À AJOUTER
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
        }
    }, {
        tableName: 'salle', 
        timestamps: false,     
        freezeTableName: true 
    });

    Salle.associate = (models) => {
        Salle.hasMany(models.Reservation, {
            foreignKey: 'idSalle',
            as: 'reservations'
        });
    };
    
    return Salle;
};