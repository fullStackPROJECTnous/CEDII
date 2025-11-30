const { Reservation, Client, Materiel, Salle, Utilisateur, Notification, Catalogue } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// 🆕 MAPPING MANUEL idCatalogue → Ressources
const getRessourceFromCatalogue = (idCatalogue, typeRes) => {
    const mapping = {
        // Salles
        'CAT001': { idSalle: 1, codeMat: null },
        'CAT002': { idSalle: 2, codeMat: null },
        'CAT003': { idSalle: 3, codeMat: null },
        
        // Matériels  
        'CAT401': { idSalle: null, codeMat: 'MAT-A2024-CEDII/001' },
        'CAT402': { idSalle: null, codeMat: 'MAT-A2024-CEDII/002' },
        'CAT501': { idSalle: null, codeMat: 'MAT-A2025-CEDII/001' },
        'CAT502': { idSalle: null, codeMat: 'MAT-A2025-CEDII/002' },
        'CAT503': { idSalle: null, codeMat: 'MAT-A2025-CEDII/003' },
        'CAT504': { idSalle: null, codeMat: 'MAT-A2025-CEDII/004' },
        'CAT505': { idSalle: null, codeMat: 'MAT-A2025-CEDII/005' }
    };
    
    return mapping[idCatalogue] || { idSalle: null, codeMat: null };
};

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

// 🆕 MÉTHODE POUR LES CLIENTS PUBLICS - VERSION CORRIGÉE
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
            clientData
        } = req.body;

        console.log('📨 Réservation publique reçue:', { 
            idCatalogue, typeRes, debRes, finRes, 
            client: { nom: clientData?.nomCli, email: clientData?.emailCli } 
        });

        // 🎯 VALIDATION RENFORCÉE
        const errors = [];

        if (!idCatalogue || idCatalogue === 'null' || idCatalogue === 'undefined') {
            errors.push('La ressource (idCatalogue) est requise');
        }

        if (!typeRes) {
            errors.push('Le type de réservation est requis');
        }

        if (!debRes) {
            errors.push('La date de début est requise');
        }

        if (!finRes) {
            errors.push('La date de fin est requise');
        }

        if (debRes && finRes && new Date(debRes) >= new Date(finRes)) {
            errors.push('La date de fin doit être après la date de début');
        }

        if (!clientData?.nomCli) {
            errors.push('Le nom du client est requis');
        }

        if (!clientData?.emailCli) {
            errors.push('L\'email du client est requis');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Données invalides',
                errors: errors
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
                telephoneCli: clientData.telephoneCli || '+261000000000',
                addresseCli: clientData.addresseCli || 'Non spécifiée',
                typeCli: 'Public',
                statutCli: 'Actif',
                idUti: temporaryUser.idUti
            });
        }

        // 🎯 VÉRIFICATION DES CONFLITS - VERSION CORRIGÉE
        console.log('🔍 Vérification des conflits...');
        
        const whereClause = {
            etatRes: { [Op.in]: ['Confirmée', 'En cours'] }, // Seulement les réservations actives
            typeRes: typeRes,
            idCatalogue: idCatalogue,
            [Op.and]: [
                { debRes: { [Op.lt]: new Date(finRes) } },
                { finRes: { [Op.gt]: new Date(debRes) } }
            ]
        };

        console.log('🔍 Clause WHERE:', JSON.stringify(whereClause, null, 2));

        const conflictingReservation = await Reservation.findOne({
            where: whereClause,
            attributes: ['idRes', 'etatRes', 'debRes', 'finRes', 'idCatalogue', 'typeRes']
        });

        if (conflictingReservation) {
            console.log('🚨 CONFLIT DÉTECTÉ:', conflictingReservation.toJSON());
            return res.status(409).json({
                success: false,
                message: `La ressource est déjà réservée du ${formatDate(conflictingReservation.debRes)} au ${formatDate(conflictingReservation.finRes)}`,
                conflit: {
                    reservationId: conflictingReservation.idRes,
                    periode: `${formatDate(conflictingReservation.debRes)} - ${formatDate(conflictingReservation.finRes)}`,
                    statut: conflictingReservation.etatRes
                }
            });
        }

        console.log('✅ Aucun conflit détecté - Création de la réservation...');

        // 🎯 CORRECTION : Gestion des valeurs avec MAPPING
        const reservationData = {
            idCli: client.idCli,
            idCatalogue: idCatalogue,
            typeRes: typeRes,
            typeDuree: 'Jour',
            debRes: new Date(debRes),
            finRes: new Date(finRes),
            tarifTot: parseFloat(tarifTot),
            etatRes: 'En attente',
            dateCre: new Date()
        };

        // 🆕 ASSOCIATION AUTOMATIQUE DES RESSOURCES VIA MAPPING
        const ressourceMapping = getRessourceFromCatalogue(idCatalogue, typeRes);
        reservationData.idSalle = ressourceMapping.idSalle;
        reservationData.codeMat = ressourceMapping.codeMat;

        console.log('🗺️ Mapping ressource:', { idCatalogue, typeRes, ressourceMapping });

        // 🎯 CORRECTION : Gestion conditionnelle AVEC VALEURS PAR DÉFAUT
        if (typeRes.toLowerCase() === 'materiel') {
            reservationData.qteMat = qteMat || 1; // Au moins 1 pour le matériel
            reservationData.nbPerso = 0; // 0 pour le matériel au lieu de null
            // S'assurer que codeMat est défini pour le matériel
            if (!reservationData.codeMat) {
                console.warn('⚠️ Aucun codeMat défini pour le matériel, utilisation de idCatalogue');
                reservationData.codeMat = idCatalogue; // Fallback
            }
        } else if (typeRes.toLowerCase() === 'salle') {
            reservationData.nbPerso = nbPerso || 1; // Au moins 1 pour les salles
            reservationData.qteMat = 0; // 0 pour les salles au lieu de null
            // S'assurer que idSalle est défini pour la salle
            if (!reservationData.idSalle) {
                console.warn('⚠️ Aucun idSalle défini pour la salle, utilisation par défaut');
                reservationData.idSalle = 1; // Fallback - première salle
            }
        } else {
            // Pour les autres types, valeurs par défaut
            reservationData.qteMat = qteMat || 0;
            reservationData.nbPerso = nbPerso || 0;
        }

        console.log('📦 Données réservation préparées:', reservationData);

        // 🎯 CRÉATION DE LA RÉSERVATION
        const nouvelleReservation = await Reservation.create(reservationData);

        console.log('🎉 RÉSERVATION CRÉÉE:', nouvelleReservation.idRes);

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

        // 🎯 RÉCUPÉRER LA RÉSERVATION COMPLÈTE AVEC LES ASSOCIATIONS
        const reservationComplete = await Reservation.findByPk(nouvelleReservation.idRes, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli']
                },
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['idSalle', 'nomSalle', 'numeroSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['codeMat', 'designationMat', 'categorieMat'],
                    required: false
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: "✅ Votre demande de réservation a été envoyée avec succès ! Notre équipe vous contactera rapidement.",
            data: {
                reservationId: nouvelleReservation.idRes,
                client: {
                    nom: client.nomCli,
                    prenom: client.prenomCli,
                    email: client.emailCli
                },
                reservation: reservationComplete,
                details: {
                    type: typeRes,
                    dates: `${new Date(debRes).toLocaleDateString()} - ${new Date(finRes).toLocaleDateString()}`,
                    statut: 'En attente'
                }
            }
        });

    } catch (error) {
        console.error('❌ Erreur création réservation publique:', error);
        
        // Message d'erreur plus détaillé
        let errorMessage = "Erreur technique lors de l'envoi de votre demande";
        if (error.name === 'SequelizeValidationError') {
            errorMessage = "Erreur de validation des données: " + error.errors.map(e => e.message).join(', ');
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
};

// 🆕 MÉTHODE POUR RÉCUPÉRER LES DEMANDES EN ATTENTE
exports.getPendingReservations = async (req, res) => {
    try {
        console.log('📍 Récupération des réservations en attente...');
        
        const reservations = await Reservation.findAll({
            where: { 
                etatRes: 'En attente'
            },
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli', 'typeCli']
                },
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['idSalle', 'nomSalle', 'numeroSalle', 'capaciteSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['codeMat', 'designationMat', 'categorieMat', 'tarifJour'],
                    required: false
                }
            ],
            order: [['dateCre', 'DESC']]
        });

        console.log(`✅ ${reservations.length} réservation(s) en attente trouvée(s)`);

        res.json({
            success: true,
            count: reservations.length,
            pendingCount: reservations.length,
            reservations: reservations
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

        const [updated] = await Notification.update({
            statutNotif: 'lu',
            dateLecture: new Date()
        }, {
            where: { idNotif }
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Notification non trouvée"
            });
        }

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

// MÉTHODE POUR LES RÉSERVATIONS CLIENTS AUTHENTIFIÉS
exports.createReservation = async (req, res) => {
    try {
        const {
            idCatalogue,
            typeRes,
            nbPerso,
            debRes,
            finRes,
            tarifTot,
            qteMat
        } = req.body;

        const clientId = req.user.idCli || req.user.id;
        console.log('👤 Client authentifié ID:', clientId);

        // Validation des données
        if (!clientId || !typeRes || !debRes || !finRes || !tarifTot) {
            return res.status(400).json({
                success: false,
                message: 'Données manquantes: typeRes, debRes, finRes et tarifTot sont obligatoires'
            });
        }

        // Vérifier que le client existe
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client non trouvé'
            });
        }

        // Vérification des conflits
        const conflictingReservation = await Reservation.findOne({
            where: {
                etatRes: { [Op.in]: ['Confirmée', 'En cours'] },
                typeRes: typeRes,
                idCatalogue: idCatalogue,
                [Op.and]: [
                    { debRes: { [Op.lt]: new Date(finRes) } },
                    { finRes: { [Op.gt]: new Date(debRes) } }
                ]
            }
        });

        if (conflictingReservation) {
            return res.status(409).json({
                success: false,
                message: `Conflit de réservation: la ressource est déjà réservée du ${formatDate(conflictingReservation.debRes)} au ${formatDate(conflictingReservation.finRes)}`
            });
        }

        // CORRECTION : Gestion conditionnelle avec MAPPING
        const reservationData = {
            idCli: clientId,
            idCatalogue: idCatalogue,
            typeRes: typeRes,
            typeDuree: 'Jour',
            debRes: new Date(debRes),
            finRes: new Date(finRes),
            tarifTot: parseFloat(tarifTot),
            etatRes: 'En attente',
            dateCre: new Date()
        };

        // 🆕 ASSOCIATION AUTOMATIQUE DES RESSOURCES VIA MAPPING
        const ressourceMapping = getRessourceFromCatalogue(idCatalogue, typeRes);
        reservationData.idSalle = ressourceMapping.idSalle;
        reservationData.codeMat = ressourceMapping.codeMat;

        console.log('🗺️ Mapping ressource:', { idCatalogue, typeRes, ressourceMapping });

        // 🎯 CORRECTION : Gestion conditionnelle AVEC VALEURS PAR DÉFAUT
        if (typeRes.toLowerCase() === 'materiel') {
            reservationData.qteMat = qteMat || 1;
            reservationData.nbPerso = 0; // 0 pour le matériel au lieu de null
            if (!reservationData.codeMat) {
                reservationData.codeMat = idCatalogue; // Fallback
            }
        } else if (typeRes.toLowerCase() === 'salle') {
            reservationData.nbPerso = nbPerso || 1;
            reservationData.qteMat = 0; // 0 pour les salles au lieu de null
            if (!reservationData.idSalle) {
                reservationData.idSalle = 1; // Fallback
            }
        } else {
            reservationData.qteMat = qteMat || 0;
            reservationData.nbPerso = nbPerso || 0;
        }

        // Création de la réservation
        const nouvelleReservation = await Reservation.create(reservationData);

        console.log('✅ Réservation client créée:', nouvelleReservation.idRes);

        // Créer les notifications
        await creerNotificationsReservation(nouvelleReservation, client);

        // Récupération des données complètes
        const reservationComplete = await Reservation.findByPk(nouvelleReservation.idRes, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli']
                },
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['idSalle', 'nomSalle', 'numeroSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['codeMat', 'designationMat', 'categorieMat'],
                    required: false
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Réservation créée avec succès',
            data: reservationComplete
        });

    } catch (error) {
        console.error('❌ Erreur création réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la réservation',
            error: error.message
        });
    }
};

// MÉTHODE POUR METTRE À JOUR LE STATUT D'UNE RÉSERVATION
exports.updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { etatRes } = req.body;

        console.log(`📍 Mise à jour statut réservation #${id} -> ${etatRes}`);

        const statutsValides = ['En attente', 'Confirmée', 'Refusée', 'Annulée', 'Terminée'];
        
        if (!statutsValides.includes(etatRes)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide',
                statutsValides
            });
        }

        const reservation = await Reservation.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli']
                }
            ]
        });
        
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        // Mettre à jour le statut
        await reservation.update({ etatRes });

        // Créer une notification pour le changement de statut
        if (etatRes === 'Refusée' || etatRes === 'Confirmée') {
            await Notification.create({
                idRes: reservation.idRes,
                typeNotif: 'statut_modifie',
                titre: etatRes === 'Confirmée' ? '✅ Réservation Confirmée' : '❌ Réservation Refusée',
                message: `La réservation #${reservation.idRes} de ${reservation.client.nomCli} a été ${etatRes.toLowerCase()}.`,
                destinataireRole: 'reception',
                urgence: 'moyenne'
            });
        }

        console.log(`✅ Statut réservation #${id} mis à jour avec succès: ${etatRes}`);

        res.json({
            success: true,
            message: `Statut de la réservation #${id} mis à jour avec succès: ${etatRes}`,
            data: {
                idRes: reservation.idRes,
                etatRes: reservation.etatRes,
                client: reservation.client
            }
        });

    } catch (error) {
        console.error('❌ Erreur changement statut réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de statut',
            error: error.message
        });
    }
};

// MÉTHODE POUR ANNULER UNE RÉSERVATION
exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id, {
            include: [{
                model: Client,
                as: 'client',
                attributes: ['idCli', 'nomCli', 'prenomCli']
            }]
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        // Vérifier si l'annulation est possible
        if (reservation.etatRes === 'Annulée') {
            return res.status(400).json({
                success: false,
                message: 'Cette réservation est déjà annulée'
            });
        }

        if (reservation.etatRes === 'Terminée') {
            return res.status(400).json({
                success: false,
                message: 'Impossible d\'annuler une réservation terminée'
            });
        }

        // Calculer si l'annulation est trop proche de la date de début
        const now = new Date();
        const debRes = new Date(reservation.debRes);
        const diffHeures = (debRes - now) / (1000 * 60 * 60);

        if (diffHeures < 24) {
            return res.status(400).json({
                success: false,
                message: 'Annulation impossible moins de 24h avant le début de la réservation'
            });
        }

        await reservation.update({ etatRes: 'Annulée' });

        // Créer une notification d'annulation
        if (reservation.client) {
            await Notification.create({
                idRes: reservation.idRes,
                typeNotif: 'annulation',
                titre: '❌ Réservation Annulée',
                message: `La réservation #${reservation.idRes} de ${reservation.client.nomCli} a été annulée.`,
                destinataireRole: 'reception',
                urgence: 'moyenne'
            });
        }

        res.json({
            success: true,
            message: 'Réservation annulée avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur annulation réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'annulation de la réservation',
            error: error.message
        });
    }
};

// MÉTHODE POUR RÉCUPÉRER LES RÉSERVATIONS D'UN CLIENT
exports.getClientReservations = async (req, res) => {
    try {
        const { clientId } = req.params;

        const reservations = await Reservation.findAll({
            where: { idCli: clientId },
            include: [
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['idSalle', 'nomSalle', 'numeroSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['codeMat', 'designationMat', 'categorieMat'],
                    required: false
                }
            ],
            order: [['debRes', 'DESC']]
        });

        res.json({
            success: true,
            message: `Réservations du client ${clientId} récupérées avec succès`,
            count: reservations.length,
            data: reservations
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservations client:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

// MÉTHODE POUR RÉCUPÉRER UNE RÉSERVATION PAR ID
exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli', 'telephoneCli']
                },
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['idSalle', 'nomSalle', 'numeroSalle', 'capaciteSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['codeMat', 'designationMat', 'categorieMat', 'tarifJour'],
                    required: false
                }
            ]
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Réservation récupérée avec succès',
            data: reservation
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la réservation',
            error: error.message
        });
    }
};

// MÉTHODE POUR METTRE À JOUR UNE RÉSERVATION
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
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        const reservationUpdated = await Reservation.findByPk(id);

        res.json({
            success: true,
            message: 'Réservation mise à jour avec succès',
            data: reservationUpdated
        });

    } catch (error) {
        console.error('❌ Erreur mise à jour réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de la réservation',
            error: error.message
        });
    }
};

// MÉTHODE POUR RÉCUPÉRER LES RÉSERVATIONS PAR STATUT
exports.getReservationsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const reservations = await Reservation.findAll({
            where: { etatRes: status },
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli']
                }
            ],
            order: [['debRes', 'ASC']]
        });

        res.json({
            success: true,
            message: `Réservations avec statut ${status} récupérées`,
            count: reservations.length,
            data: reservations
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservations par statut:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

// MÉTHODE POUR RÉCUPÉRER TOUTES LES RÉSERVATIONS
exports.getAllReservations = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: reservations } = await Reservation.findAndCountAll({
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli']
                },
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['nomSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['designationMat'],
                    required: false
                }
            ],
            order: [['dateCre', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            message: 'Toutes les réservations récupérées',
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: reservations
        });

    } catch (error) {
        console.error('❌ Erreur récupération toutes les réservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

// MÉTHODE POUR SUPPRIMER UNE RÉSERVATION
exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Reservation.destroy({
            where: { idRes: id }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Réservation non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Réservation supprimée avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur suppression réservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la réservation',
            error: error.message
        });
    }
};

// MÉTHODE POUR RÉCUPÉRER LES RÉSERVATIONS PAR PÉRIODE
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
                    as: 'client',
                    attributes: ['nomCli', 'prenomCli']
                },
                {
                    model: Salle,
                    as: 'salle',
                    attributes: ['nomSalle'],
                    required: false
                },
                {
                    model: Materiel,
                    as: 'materiel',
                    attributes: ['designationMat'],
                    required: false
                }
            ],
            order: [['debRes', 'ASC']]
        });

        res.json({
            success: true,
            message: `Réservations pour la période ${startDate} à ${endDate}`,
            count: reservations.length,
            data: reservations
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservations par période:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations',
            error: error.message
        });
    }
};

// MÉTHODE POUR RÉCUPÉRER LES NOTIFICATIONS NON LUES
exports.getUnreadNotifications = async (req, res) => {
    try {
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
                    as: 'client',
                    attributes: ['nomCli', 'prenomCli']
                }]
            }],
            order: [['dateEnvoi', 'DESC']]
        });

        res.json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {
        console.error('❌ Erreur récupération notifications:', error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des notifications",
            error: error.message
        });
    }
};

// FONCTION UTILITAIRE POUR FORMATER LES DATES
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 🆕 AJOUTEZ CETTE LIGNE POUR VÉRIFIER LES EXPORTS
console.log('✅ Reservation Controller exports:', Object.keys(exports));