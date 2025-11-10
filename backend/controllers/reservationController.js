const { Reservation, Client, Materiel, Salle, Utilisateur } = require('../models');
const { Op } = require('sequelize');

exports.createReservation = async (req, res) => {
  try {
    const {
      idCli,
      typeRes,
      nbPerso,
      debRes,
      finRes,
      tarifTot,
      idSalle,
      codeMat,
      qteMat
    } = req.body;

    // Validation des données requises
    if (!idCli || !typeRes || !debRes || !finRes || !tarifTot) {
      return res.status(400).json({
        message: 'Données manquantes: idCli, typeRes, debRes, finRes et tarifTot sont obligatoires'
      });
    }

    // Vérification des conflits de dates
    const conflictingReservation = await Reservation.findOne({
      where: {
        [Op.or]: [
          // Conflit: nouvelle réservation commence pendant une existante
          {
            debRes: { [Op.lte]: new Date(debRes) },
            finRes: { [Op.gt]: new Date(debRes) }
          },
          // Conflit: nouvelle réservation termine pendant une existante
          {
            debRes: { [Op.lt]: new Date(finRes) },
            finRes: { [Op.gte]: new Date(finRes) }
          },
          // Conflit: nouvelle réservation englobe une existante
          {
            debRes: { [Op.gte]: new Date(debRes) },
            finRes: { [Op.lte]: new Date(finRes) }
          }
        ],
        etatRes: { [Op.in]: ['En attente', 'Confirmée'] }
      }
    });

    if (conflictingReservation) {
      return res.status(409).json({
        message: 'Conflit de réservation: la ressource est déjà réservée pour cette période'
      });
    }

    // Création de la réservation
    const nouvelleReservation = await Reservation.create({
      idCli,
      typeRes,
      nbPerso: nbPerso || null,
      debRes: new Date(debRes),
      finRes: new Date(finRes),
      tarifTot,
      idSalle: idSalle || null,
      codeMat: codeMat || null,
      qteMat: qteMat || 1,
      dateCre: new Date(),
      etatRes: 'En attente'
    });

    // Récupération des données complètes pour la réponse
    const reservationComplete = await Reservation.findByPk(nouvelleReservation.idRes, {
      include: [
        {
          model: Client,
          attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli'],
          include: [{
            model: Utilisateur,
            attributes: ['loginUti']
          }]
        },
        {
          model: Salle,
          attributes: ['idSalle', 'nomSalle', 'numeroSalle', 'capaciteSalle']
        },
        {
          model: Materiel,
          attributes: ['codeMat', 'designationMat', 'categorieMat']
        }
      ]
    });

    res.status(201).json({
      message: 'Réservation créée avec succès',
      reservation: reservationComplete
    });

  } catch (error) {
    console.error('Erreur création réservation:', error);
    res.status(500).json({
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};

exports.getClientReservations = async (req, res) => {
  try {
    const { clientId } = req.params;

    const reservations = await Reservation.findAll({
      where: { idCli: clientId },
      include: [
        {
          model: Salle,
          attributes: ['idSalle', 'nomSalle', 'numeroSalle']
        },
        {
          model: Materiel,
          attributes: ['codeMat', 'designationMat', 'categorieMat']
        }
      ],
      order: [['debRes', 'DESC']]
    });

    res.json({
      message: `Réservations du client ${clientId} récupérées avec succès`,
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('Erreur récupération réservations client:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli'],
          include: [{
            model: Utilisateur,
            attributes: ['loginUti']
          }]
        },
        {
          model: Salle,
          attributes: ['idSalle', 'nomSalle', 'numeroSalle', 'capaciteSalle']
        },
        {
          model: Materiel,
          attributes: ['codeMat', 'designationMat', 'categorieMat', 'tarifJour']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      message: 'Réservation récupérée avec succès',
      reservation
    });

  } catch (error) {
    console.error('Erreur récupération réservation:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de la réservation',
      error: error.message
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ne pas permettre la modification du statut via cette route
    if (updates.etatRes) {
      delete updates.etatRes;
    }

    const [updated] = await Reservation.update(updates, {
      where: { idRes: id }
    });

    if (!updated) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    const reservationUpdated = await Reservation.findByPk(id);

    res.json({
      message: 'Réservation mise à jour avec succès',
      reservation: reservationUpdated
    });

  } catch (error) {
    console.error('Erreur mise à jour réservation:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la réservation',
      error: error.message
    });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier si l'annulation est possible
    if (reservation.etatRes === 'Annulée') {
      return res.status(400).json({
        message: 'Cette réservation est déjà annulée'
      });
    }

    if (reservation.etatRes === 'Terminée') {
      return res.status(400).json({
        message: 'Impossible d\'annuler une réservation terminée'
      });
    }

    // Calculer si l'annulation est trop proche de la date de début
    const now = new Date();
    const debRes = new Date(reservation.debRes);
    const diffHeures = (debRes - now) / (1000 * 60 * 60);

    if (diffHeures < 24) {
      return res.status(400).json({
        message: 'Annulation impossible moins de 24h avant le début de la réservation'
      });
    }

    await Reservation.update(
      { etatRes: 'Annulée' },
      { where: { idRes: id } }
    );

    res.json({
      message: 'Réservation annulée avec succès'
    });

  } catch (error) {
    console.error('Erreur annulation réservation:', error);
    res.status(500).json({
      message: 'Erreur lors de l\'annulation de la réservation',
      error: error.message
    });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { etatRes } = req.body;

    const statutsValides = ['En attente', 'Confirmée', 'Annulée', 'Terminée'];
    
    if (!statutsValides.includes(etatRes)) {
      return res.status(400).json({
        message: 'Statut invalide',
        statutsValides
      });
    }

    const [updated] = await Reservation.update(
      { etatRes },
      { where: { idRes: id } }
    );

    if (!updated) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      message: `Statut de la réservation mis à jour: ${etatRes}`
    });

  } catch (error) {
    console.error('Erreur changement statut réservation:', error);
    res.status(500).json({
      message: 'Erreur lors du changement de statut',
      error: error.message
    });
  }
};

exports.getReservationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const reservations = await Reservation.findAll({
      where: { etatRes: status },
      include: [
        {
          model: Client,
          attributes: ['idCli', 'nomCli', 'prenomCli']
        }
      ],
      order: [['debRes', 'ASC']]
    });

    res.json({
      message: `Réservations avec statut ${status} récupérées`,
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('Erreur récupération réservations par statut:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      include: [
        {
          model: Client,
          attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli']
        },
        {
          model: Salle,
          attributes: ['nomSalle']
        },
        {
          model: Materiel,
          attributes: ['designationMat']
        }
      ],
      order: [['dateCre', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      message: 'Toutes les réservations récupérées',
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      reservations
    });

  } catch (error) {
    console.error('Erreur récupération toutes les réservations:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Reservation.destroy({
      where: { idRes: id }
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Réservation non trouvée'
      });
    }

    res.json({
      message: 'Réservation supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression réservation:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la réservation',
      error: error.message
    });
  }
};

exports.getReservationsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    const reservations = await Reservation.findAll({
      where: {
        debRes: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      include: [
        {
          model: Client,
          attributes: ['nomCli', 'prenomCli']
        },
        {
          model: Salle,
          attributes: ['nomSalle']
        },
        {
          model: Materiel,
          attributes: ['designationMat']
        }
      ],
      order: [['debRes', 'ASC']]
    });

    res.json({
      message: `Réservations pour la période ${startDate} à ${endDate}`,
      count: reservations.length,
      reservations
    });

  } catch (error) {
    console.error('Erreur récupération réservations par période:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};