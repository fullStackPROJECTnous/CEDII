// backend/models/utilisateur.js

module.exports = (sequelize, DataTypes) => {
    const Utilisateur = sequelize.define('utilisateur', {
        idUti: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        loginUti: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        motDePasseUti: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        roleUti: {
             // 🚨 VÉRIFIEZ QUE CES VALEURS CORRESPONDENT À VOTRE BASE DE DONNÉES
         type: DataTypes.ENUM('admin', 'reception', 'finance', 'client'),
         defaultValue: 'client'
        }
    }, {
        tableName: 'utilisateur', //Assurez-vous que le nom de la table correspond à la base de données
        timestamps: false //Pas de colonnes 'createdAt' ou 'updatedAt'
    });

    // 🚨 AJOUT CRITIQUE : DÉFINITION DE L'ASSOCIATION 🚨
    Utilisateur.associate = (models) => {
        // Un utilisateur est associé à un seul client via la clé étrangère 'idUti' dans la table Client
        
        Utilisateur.hasOne(models.Client, { 
            foreignKey: 'idUti' 
        });
    };

    return Utilisateur;
};