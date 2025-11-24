const { Reservation, Client, Materiel, Salle, Utilisateur, Notification } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// 🆕 MÉTHODE POUR CRÉER LES NOTIFICATIONS
const creerNotificationsReservation = async (reservation, client) => {
    try {
        console.log(`🎯 Création de notifications pour la réservation #${reservation.idRes}`);
        
        // Notification 1: Nouvelle réservation (Urgence haute)
        await Notification.create({
            idRes: reservation.idRes,
            typeNotif: 'nouvelle_reservation',
            titre: '📋 Nouvelle Demande de Réservation',
            message: `Le client ${client.nomCli} ${client.prenomCli || ''} a fait une nouvelle réservation pour ${reservation.typeRes}. Date: ${new Date(reservation.debRes).toLocaleDateString()} ${new Date(reservation.debRes).toLocaleTimeString()} à ${new Date(reservation.finRes).toLocaleDateString()} ${new Date(reservation.finRes).toLocaleTimeString()}`,
            destinataireRole: 'reception',
            urgence: 'haute'
        });

        // Notification 2: Détails de la réservation (Urgence moyenne)
        await Notification.create({
            idRes: reservation.idRes,
            typeNotif: 'details_reservation',
            titre: '📊 Détails Réservation',
            message: `Réservation #${reservation.idRes}: ${reservation.typeRes} - ${reservation.nbPerso || reservation.qteMat || 1} ${reservation.typeRes === 'Salle' ? 'personnes' : 'unités'}. Total: ${reservation.tarifTot} MGA`,
            destinataireRole: 'reception',
            urgence: 'moyenne'
        });

        // Notification 3: Rappel de traitement (Urgence faible)
        await Notification.create({
            idRes: reservation.idRes,
            typeNotif: 'rappel',
            titre: '⏰ Action Requise',
            message: `Veuillez traiter la réservation #${reservation.idRes} de ${client.nomCli} ${client.prenomCli || ''} dans les plus brefs délais.`,
            destinataireRole: 'reception',
            urgence: 'faible'
        });

        console.log(`✅ 3 notifications créées pour la réservation #${reservation.idRes}`);
        
    } catch (error) {
        console.error('❌ Erreur création notifications:', error);
    }
};

// 🆕 MÉTHODE POUR LES CLIENTS PUBLICS
exports.createPublicReservation = async (req, res) => {
    try {
        const {
            idCatalogue,
            typeRes,
            nbPerso,
            debRes,
            finRes,
            tarifTot,
            qteMat,
            clientData // Données du client public
        } = req.body;

        console.log('📨 Réservation publique reçue:', { clientData, reservationData: req.body });

        // Validation des données client
        if (!clientData || !clientData.nomCli || !clientData.emailCli || !clientData.telephoneCli) {
            return res.status(400).json({
                success: false,
                message: "Informations client incomplètes (nom, email, téléphone requis)"
            });
        }

        // Validation des dates
        if (new Date(debRes) >= new Date(finRes)) {
            return res.status(400).json({
                success: false,
                message: "La date de fin doit être après la date de début"
            });
        }

        // Vérifier si le client existe déjà par email
        let client = await Client.findOne({
            where: { emailCli: clientData.emailCli }
        });

        if (!client) {
            console.log('👤 Création d\'un nouveau client public');
            
            // Créer un utilisateur temporaire pour le client
            const temporaryUser = await Utilisateur.create({
                loginUti: clientData.emailCli,
                motDePasseUti: await bcrypt.hash('temporary_password', 10),
                roleUti: 'client'
            });

            // Créer le client
            client = await Client.create({
                nomCli: clientData.nomCli,
                prenomCli: clientData.prenomCli || null,
                emailCli: clientData.emailCli,
                telephoneCli: clientData.telephoneCli,
                addresseCli: clientData.addresseCli || 'Non spécifiée',
                typeCli: 'Public',
                statutCli: 'Actif',
                idUti: temporaryUser.idUti
            });
        }

        // Vérification des conflits de dates
        const conflictingReservation = await Reservation.findOne({
            where: {
                [Op.or]: [
                    { debRes: { [Op.lte]: new Date(debRes) }, finRes: { [Op.gt]: new Date(debRes) } },
                    { debRes: { [Op.lt]: new Date(finRes) }, finRes: { [Op.gte]: new Date(finRes) } },
                    { debRes: { [Op.gte]: new Date(debRes) }, finRes: { [Op.lte]: new Date(finRes) } }
                ],
                etatRes: { [Op.in]: ['En attente', 'Confirmée'] }
            }
        });

        if (conflictingReservation) {
            return res.status(409).json({
                message: 'Conflit de réservation: la ressource est déjà réservée pour cette période'
            });
        }

        // Déterminer idSalle ou codeMat selon le type
        let idSalle = null;
        let codeMat = null;
        
        if (typeRes === 'Salle') {
            idSalle = idCatalogue;
        } else {
            codeMat = idCatalogue;
        }

        // Créer la réservation
        const nouvelleReservation = await Reservation.create({
            idCli: client.idCli,
            typeRes,
            nbPerso: nbPerso || null,
            debRes: new Date(debRes),
            finRes: new Date(finRes),
            tarifTot,
            idSalle: idSalle,
            codeMat: codeMat,
            qteMat: qteMat || 1,
            dateCre: new Date(),
            etatRes: 'En attente',
            notifiedReception: false,
            receptionViewed: false
        });

        console.log('✅ Réservation publique créée:', nouvelleReservation.idRes);

        // 🎯 CRÉER LES NOTIFICATIONS POUR LA RÉCEPTION
        await creerNotificationsReservation(nouvelleReservation, client);

        // 🎯 ÉMETTRE L'ÉVÉNEMENT SOCKET.IO AUX RÉCEPTIONNISTES
        if (req.app.get('io')) {
            const io = req.app.get('io');
            
            io.to('reception_room').emit('nouvelle_reservation', {
                type: 'nouvelle_reservation',
                titre: '📋 Nouvelle Demande Publique',
                message: `Nouvelle réservation de ${client.nomCli} ${client.prenomCli || ''} (Client public)`,
                reservation: {
                    idRes: nouvelleReservation.idRes,
                    client: `${client.nomCli} ${client.prenomCli || ''}`,
                    email: client.emailCli,
                    telephone: client.telephoneCli,
                    type: typeRes,
                    dateDebut: debRes,
                    dateFin: finRes,
                    tarifTotal: tarifTot
                },
                timestamp: new Date(),
                urgence: 'haute'
            });

            console.log('📢 Notification Socket.io envoyée aux réceptionnistes');
        }

        res.status(201).json({
            success: true,
            message: "Votre demande de réservation a été envoyée avec succès. Notre équipe vous contactera rapidement.",
            data: {
                reservationId: nouvelleReservation.idRes,
                client: {
                    nom: client.nomCli,
                    prenom: client.prenomCli,
                    email: client.emailCli
                }
            }
        });

    } catch (error) {
        console.error('❌ Erreur création réservation publique:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi de votre demande",
            error: error.message
        });
    }
};

// 🆕 MÉTHODE POUR RÉCUPÉRER LES DEMANDES EN ATTENTE
exports.getPendingReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { 
                etatRes: 'En attente'
            },
            include: [
                {
                    model: Client,
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli', 'typeCli']
                },
                {
                    model: Salle,
                    attributes: ['idSalle', 'nomSalle', 'numeroSalle']
                },
                {
                    model: Materiel,
                    attributes: ['codeMat', 'designationMat', 'categorieMat']
                }
            ],
            order: [['dateCre', 'DESC']]
        });

        // Récupérer aussi les notifications non lues
        const notifications = await Notification.findAll({
            where: {
                destinataireRole: 'reception',
                statutNotif: 'non_lu'
            },
            include: [{
                model: Reservation,
                as: 'reservation',
                include: [{
                    model: Client,
                    attributes: ['nomCli', 'prenomCli']
                }]
            }],
            order: [['dateEnvoi', 'DESC']]
        });

        res.json({
            success: true,
            count: reservations.length,
            pendingCount: reservations.length,
            reservations: reservations,
            notifications: notifications
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservations en attente:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des demandes",
            error: error.message
        });
    }
};

// 🆕 MÉTHODE POUR METTRE À JOUR LE STATUT DE NOTIFICATION
exports.marquerNotificationLue = async (req, res) => {
    try {
        const { idNotif } = req.params;

        await Notification.update({
            statutNotif: 'lu',
            dateLecture: new Date()
        }, {
            where: { idNotif }
        });

        res.json({
            success: true,
            message: "Notification marquée comme lue"
        });

    } catch (error) {
        console.error('❌ Erreur mise à jour notification:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de la notification",
            error: error.message
        });
    }
};

// MÉTHODE EXISTANTE - MODIFIÉE POUR AJOUTER LES NOTIFICATIONS
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

    // Récupérer le client pour les notifications
    const client = await Client.findByPk(idCli);
    
    // 🎯 CRÉER LES NOTIFICATIONS POUR LA RÉCEPTION
    if (client) {
        await creerNotificationsReservation(nouvelleReservation, client);
    }

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

// MÉTHODE EXISTANTE - MODIFIÉE POUR LES NOTIFICATIONS D'ANNULATION
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id, {
        include: [{
            model: Client,
            attributes: ['idCli', 'nomCli', 'prenomCli']
        }]
    });

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

    // 🎯 CRÉER UNE NOTIFICATION D'ANNULATION
    if (reservation.Client) {
        await Notification.create({
            idRes: reservation.idRes,
            typeNotif: 'annulation',
            titre: '❌ Réservation Annulée',
            message: `La réservation #${reservation.idRes} de ${reservation.Client.nomCli} a été annulée.`,
            destinataireRole: 'reception',
            urgence: 'moyenne'
        });
    }

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

// MÉTHODES EXISTANTES (conservées telles quelles)
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