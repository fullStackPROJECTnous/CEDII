/*

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
            // Assurez-vous que l'ENUM est bien supporté ou remplacez par STRING si vous avez des problèmes
            type: DataTypes.ENUM('Disponible', 'Occupée', 'Maintenance'), 
            defaultValue: 'Disponible'
        }
    }, {
        tableName: 'salle', 
        timestamps: false,     
        freezeTableName: true 
    });
    return Salle;
};*/

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