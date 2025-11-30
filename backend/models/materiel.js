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
        freezeTableName: true,
        
        // 🎯 AJOUT DES HOOKS ET DE LA VALIDATION POUR LA COHÉRENCE
        hooks: {
            beforeValidate: (materiel, options) => {
                // 1. Convertir le stock en nombre (ou 0 si non défini)
                const stock = parseInt(materiel.qteActuelStock) || 0;
                
                // 2. Définir la quantité en location pour une nouvelle insertion
                // Si la requête ne la fournit pas, on suppose qu'elle est 0.
                const enLocation = parseInt(materiel.qteEnLocation) || 0;
                
                // 3. Mettre à jour les propriétés de l'instance Sequelize
                materiel.qteActuelStock = stock;
                materiel.qteEnLocation = enLocation;
                
                // 4. Calculer la quantité disponible (Disponible = Stock - Loué)
                // C'EST LA CLÉ : Cela garantit que qteTotDispo est cohérent avant la validation
                materiel.qteTotDispo = stock - enLocation;
            }
        },

        validate: {
            checkQuantities() {
                // 5. La validation s'exécute APRÈS le hook, et vérifie les valeurs qui viennent d'être calculées.
                if (this.qteActuelStock !== (this.qteTotDispo + this.qteEnLocation)) {
                    throw new Error("Incohérence des quantités: qteActuelStock (Total) doit être égal à (qteTotDispo + qteEnLocation).");
                }
            }
        }
        // FIN DES AJOUTS
    });
    
     Materiel.associate = (models) => {
        Materiel.hasMany(models.Reservation, {
            foreignKey: 'codeMat',
            as: 'reservations'
        });
    };

    return Materiel;
};