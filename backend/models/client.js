// models/client.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Client = sequelize.define('Client', {
        idCli: {
            type: DataTypes.STRING(11), // Corresponds to varchar(11)
            primaryKey: true,
            allowNull: false,
            field: 'idCli' // Ensures the model attribute name maps to the table column name
        },
        nomCli: {
            type: DataTypes.STRING(60), // Corresponds to varchar(60)
            allowNull: false,
            field: 'nomCli'
        },
        telephoneCli: {
            type: DataTypes.INTEGER(13), // Corresponds to int(13)
            allowNull: false,
            field: 'telephoneCli'
        },
        addresseCli: {
            type: DataTypes.STRING(45), // Corresponds to varchar(45)
            allowNull: false,
            field: 'addresseCli'
        },
        typeCli: {
            type: DataTypes.STRING(31), // Corresponds to varchar(31)
            allowNull: false,
            field: 'typeCli'
        },
        statutCli: {
            type: DataTypes.STRING(23), // Corresponds to varchar(23)
            allowNull: false,
            field: 'statutCli'
        }
    }, {
        tableName: 'client', // Explicitly set the table name
        timestamps: false, // Assuming you don't want Sequelize to manage 'createdAt' and 'updatedAt'
        freezeTableName: true // Prevents Sequelize from pluralizing the table name
    });

    return Client;
};