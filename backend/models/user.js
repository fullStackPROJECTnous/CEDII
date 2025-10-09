/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
  loginUti: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motDePasseUti: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = User;
*/

// backend/models/user.js (CORRIGÉ)

// Exporte une fonction qui prend l'objet Sequelize (sequelize) et le type de données (DataTypes)

module.exports = (sequelize, DataTypes) => { 
    
    // Définition du modèle avec le nom de table 'User' (ou 'utilisateur', selon votre convention)
    const User = sequelize.define('User', {
        idUti: { // 💡 Ajoutez une clé primaire explicite si non auto-générée ailleurs
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        loginUti: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        motDePasseUti: {
            type: DataTypes.STRING,
            allowNull: false,
            // 💡 unique: true sur le mot de passe est étrange, devrait être sur loginUti ou email
            // Assumons qu'il est sur motDePasseUti pour le moment, mais vérifiez votre schéma
        },
        roleUti: {
            type: DataTypes.ENUM('admin', 'reception', 'finance', 'client'),
          
           // defaultValue: 'client' 
              allowNull: false
        },
        // Assurez-vous d'avoir tous les autres champs si nécessaire (timestamps sont par défaut)
    }, {
        tableName: 'utilisateur' // 💡 Nom réel de votre table si elle n'est pas 'users' ou 'User'
    });

    return User;
};

// 💡 Si vous utilisez le Sequelize CLI (recommandé), vous n'aurez pas besoin de require('../config/db'); ici.