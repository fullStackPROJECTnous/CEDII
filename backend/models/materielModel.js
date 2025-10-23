'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MaterielBureau extends Model {
    static associate(models) {
      // associations peuvent être définies ici si nécessaire
    }
  }
  
  MaterielBureau.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    marque: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modele: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    numeroSerie: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    utilisateur: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    departement: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    statut: {
      type: DataTypes.ENUM('En service', 'En stock', 'En maintenance', 'En panne', 'Hors service'),
      defaultValue: 'En stock'
    },
    dateAcquisition: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dateFinGarantie: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    prixAchat: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fournisseur: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    emplacement: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'MaterielBureau',
    tableName: 'materiel_bureau',
    timestamps: true,
    underscored: false
  });

  return MaterielBureau;
};