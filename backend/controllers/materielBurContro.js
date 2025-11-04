const db = require('../models');
const { Op } = require('sequelize');

// Fonction utilitaire pour obtenir le modèle
function getModel() {
  const model = db.MaterielBureau;
  if (!model) {
    console.error('❌ Modèle materielBureau non disponible');
    throw new Error('Modèle non disponible');
  }
  return model;
}

// Récupérer tous les matériels
const getAll = async (req, res) => {
  try {
    console.log('🔍 Début getAll - Connexion BD réelle');
    const MaterielBureau = getModel();

    const { statut, type, search } = req.query;
    let where = {};

    if (statut && statut !== '') where.statut = statut;
    if (type && type !== '') where.type = type;
    if (search && search !== '') {
      where[Op.or] = [
        { code: { [Op.like]: `%${search}%` } },
        { modele: { [Op.like]: `%${search}%` } },
        { utilisateur: { [Op.like]: `%${search}%` } },
        { marque: { [Op.like]: `%${search}%` } }
      ];
    }

    const materiels = await MaterielBureau.findAll({ 
      where,
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ ${materiels.length} matériels trouvés dans la BD`);
    res.json(materiels);
    
  } catch (error) {
    console.error('❌ Erreur getAll BD:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des matériels",
      error: error.message 
    });
  }
};

// Créer un nouveau matériel
const create = async (req, res) => {
  try {
    console.log('📝 Création matériel BD:', req.body);
    const MaterielBureau = getModel();

    // Vérifier si le code existe déjà
    const existing = await MaterielBureau.findOne({ 
      where: { code: req.body.code } 
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: "Un matériel avec ce code existe déjà" 
      });
    }

    const materiel = await MaterielBureau.create(req.body);
    console.log('✅ Matériel créé dans BD:', materiel.code);
    res.status(201).json(materiel);
    
  } catch (error) {
    console.error('❌ Erreur create BD:', error);
    res.status(500).json({ 
      message: "Erreur lors de la création du matériel",
      error: error.message 
    });
  }
};

// Mettre à jour un matériel
const update = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('✏️  Mise à jour matériel BD:', id, req.body);
    const MaterielBureau = getModel();

    const materiel = await MaterielBureau.findByPk(id);
    if (!materiel) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    // Vérifier si le code est déjà utilisé par un autre matériel
    if (req.body.code && req.body.code !== materiel.code) {
      const codeExist = await MaterielBureau.findOne({ 
        where: { 
          code: req.body.code,
          id: { [Op.ne]: id }
        } 
      });
      
      if (codeExist) {
        return res.status(400).json({ 
          message: "Ce code est déjà utilisé par un autre matériel" 
        });
      }
    }

    await materiel.update(req.body);
    console.log('✅ Matériel mis à jour dans BD:', materiel.code);
    res.json(materiel);
    
  } catch (error) {
    console.error('❌ Erreur update BD:', error);
    res.status(500).json({ 
      message: "Erreur lors de la mise à jour du matériel",
      error: error.message 
    });
  }
};

// Supprimer un matériel
const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('🗑️  Suppression matériel BD:', id);
    const MaterielBureau = getModel();

    const materiel = await MaterielBureau.findByPk(id);
    if (!materiel) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    await materiel.destroy();
    console.log('✅ Matériel supprimé de la BD:', materiel.code);
    res.json({ message: 'Matériel supprimé avec succès' });
    
  } catch (error) {
    console.error('❌ Erreur delete BD:', error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression du matériel",
      error: error.message 
    });
  }
};

// Assigner un utilisateur
const assignerUtilisateur = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('👤 Assignation utilisateur BD:', id, req.body);
    const MaterielBureau = getModel();

    const materiel = await MaterielBureau.findByPk(id);
    if (!materiel) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    await materiel.update({
      utilisateur: req.body.utilisateur,
      departement: req.body.departement,
      statut: 'En service'
    });
    
    console.log('✅ Utilisateur assigné dans BD:', materiel.code);
    res.json(materiel);
    
  } catch (error) {
    console.error('❌ Erreur assignerUtilisateur BD:', error);
    res.status(500).json({ 
      message: "Erreur lors de l'assignation de l'utilisateur",
      error: error.message 
    });
  }
};

// Debug
const debug = async (req, res) => {
  try {
    const MaterielBureau = getModel();
    const count = await MaterielBureau.count();
    
    res.json({
      message: "API Materiel Bureau - Connexion BD réelle",
      totalMateriels: count,
      mode: "Base de données réelle",
      modelAvailable: true
    });
  } catch (error) {
    res.json({
      message: "API Materiel Bureau - Mode simulation",
      error: error.message,
      mode: "Simulation",
      modelAvailable: false
    });
  }
};

// Export
module.exports = {
  getAll,
  create,
  update, 
  delete: deleteItem,
  assignerUtilisateur,
  debug
};