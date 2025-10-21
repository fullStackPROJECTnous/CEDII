module.exports = (sequelize, DataTypes) => {
    const HistoriqueEmprunt = sequelize.define('HistoriqueEmprunt', {
        idHistorique: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codeMat: {
            type: DataTypes.STRING(30),
            allowNull: false,
            references: {
                model: 'materiel',
                key: 'codeMat'
            }
        },
        idRes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'reservation',
                key: 'idRes'
            }
        },
        idLo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'location',
                key: 'idLo'
            }
        },
        dateDebutPrevue: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateFinPrevue: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateRetourReelle: {
            type: DataTypes.DATE,
            allowNull: true
        },
        dureeRetardHeures: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fraisRetard: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0.00
        },
        etatDebut: {
            type: DataTypes.ENUM('Neuf', 'Bon état', 'Endommagé', 'Maintenance', 'Hors-Service'),
            allowNull: false
        },
        etatRetour: {
            type: DataTypes.ENUM('Neuf', 'Bon état', 'Endommagé', 'Maintenance', 'Hors-Service'),
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'historique_emprunt',
        timestamps: true,
        createdAt: 'dateCreation',
        updatedAt: 'dateModification'
    });

    return HistoriqueEmprunt;
};