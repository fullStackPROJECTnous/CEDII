/*module.exports = (sequelize, DataTypes) => {
    const Salle = sequelize.define('Salle', {
        idSalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nomSalle: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        numeroSalle: { // Ajouté
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true 
        },
        capaciteSalle: { // Renommé
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tarifSalle: { // Ajouté
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        disponibiliteSalle: { // Renommé
            type: DataTypes.ENUM('Disponible', 'Occupée', 'Maintenance'),
            defaultValue: 'Disponible',
            allowNull: true // Laisse allowNull à true car le DEFAULT existe
        }
    }, {
        tableName: 'salle', // Nom de la table
        timestamps: false // S'il n'y a pas de createdAt/updatedAt dans la table SQL
    });
    return Salle;
};*/
// backend/models/salle.model.js (Test Temporaire)
// backend/models/salle.model.js (Code Final Recommandé)

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
        tarifSalle: {
            type: DataTypes.DECIMAL(10, 2),
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
};