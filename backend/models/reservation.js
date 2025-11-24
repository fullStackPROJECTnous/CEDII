// backend/models/reservation.js - VERSION CORRIGÉE
module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
        idRes: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idCli: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'client',
                key: 'idCli'
            }
        },
        idCatalogue: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'ID de la ressource (salle ou matériel)'
        },
        dateCre: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        qteMat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        typeRes: {
            type: DataTypes.ENUM('Salle', 'Materiel'),
            allowNull: false
        },
        nbPerso: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1
            }
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
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                min: 0
            }
        },
        etatRes: {
            type: DataTypes.ENUM('En attente', 'Confirmée', 'Refusée', 'Annulée', 'En cours', 'Terminée'),
            defaultValue: 'En attente',
            allowNull: false
        },
        idSalle: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'salle',
                key: 'idSalle'
            }
        },
        codeMat: {
            type: DataTypes.STRING(30),
            allowNull: true,
            references: {
                model: 'materiel',
                key: 'codeMat'
            }
        }
    }, { 
        tableName: 'reservation', 
        timestamps: false, // 🚨 CORRECTION IMPORTANTE
        hooks: {
            beforeValidate: (reservation) => {
                // S'assurer que les champs sont cohérents avec le type
                if (reservation.typeRes === 'Salle') {
                    reservation.codeMat = null;
                    reservation.qteMat = 0;
                } else if (reservation.typeRes === 'Materiel') {
                    reservation.idSalle = null;
                    reservation.nbPerso = 0;
                }
            }
        }
    });

    // Définition des associations
    Reservation.associate = (models) => {
        Reservation.belongsTo(models.Client, {
            foreignKey: 'idCli',
            as: 'client'
        });
        
        if (models.Salle) {
            Reservation.belongsTo(models.Salle, {
                foreignKey: 'idSalle',
                as: 'salle'
            });
        }
        
        if (models.Materiel) {
            Reservation.belongsTo(models.Materiel, {
                foreignKey: 'codeMat',
                as: 'materiel'
            });
        }

        if (models.Location) {
            Reservation.hasMany(models.Location, {
                foreignKey: 'idRes',
                as: 'locations'
            });
        }

        if (models.Notification) {
            Reservation.hasMany(models.Notification, {
                foreignKey: 'idRes',
                as: 'notifications'
            });
        }
    };

    return Reservation;
};