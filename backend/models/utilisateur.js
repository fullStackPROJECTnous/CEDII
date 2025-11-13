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


      // 🚨 CORRECTION DES ASSOCIATIONS SEQUELIZE (Inverse)
    Utilisateur.associate = (models) => {
        // Un Utilisateur a une Fiche Client
        Utilisateur.hasOne(models.Client, {
            foreignKey: 'idUti', 
            as: 'clientProfile'
        });
    };    
    return Utilisateur;
};