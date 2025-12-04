// backend/controllers/locationController.js

const db = require('../models');
const Location = db.Location; 
const Reservation = db.Reservation;
const Client = db.Client; 
//const sequelize = db.Sequelize;
const Op = db.Sequelize.Op;
const Materiel = db.Materiel;
const Salle = db.Salle;
const { sequelize } = db; // ⬅️ Ajoutez cette ligne
//const { QueryTypes } = require('sequelize');
const { QueryTypes } = require('sequelize'); // Gardez cet import

// Requêtes SQL pour le dashboard
const sqlKpiPending = `
    SELECT COUNT(*) AS count
    FROM reservation
    WHERE etatRes = 'En attente';
`;

const sqlLatestPendingRequests = `
    SELECT 
        R.idRes AS id, 
        CONCAT(C.nomCli, ' ', C.prenomCli) AS demandeur,
        R.typeRes AS ressource,
        R.debRes AS dateDebut, 
        R.etatRes AS etat, 
        R.dateCre AS dateSoumission
    FROM reservation R
    JOIN client C ON R.idCli = C.idCli
    WHERE R.etatRes = 'En attente'
    ORDER BY R.dateCre DESC
    LIMIT 5;
`;

// Requête corrigée pour les ressources indisponibles
const sqlKpiUnavailable = `
    SELECT 
        (SELECT COUNT(*) FROM salle WHERE disponibiliteSalle IN ('Occupée', 'Maintenance')) +
        (SELECT COUNT(*) FROM materiel WHERE etatMat IN ('En location', 'Maintenance', 'Hors service')) 
    AS total_unavailable
`;

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll({
            include: [{
                model: Reservation,
                include: [{
                    model: Client,
                    as: 'client'
                }]
            }],
            order: [['dateCre', 'DESC']]
        });
        
        res.status(200).json(locations);
        
    } catch (error) {
        console.error("Erreur de chargement des locations:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des locations.", 
            error: error.message 
        });
    }
};

exports.getPendingReservations = async (req, res) => {
    try {
        const pendingRequests = await Reservation.findAll({
            where: {
                etatRes: 'En attente' 
            },
            include: [{
                model: Client,
                as: 'client',
                attributes: ['nomCli', 'prenomCli'] 
            }],
            order: [
                ['dateCre', 'DESC'] 
            ]
        });
        
        res.status(200).json(pendingRequests);

    } catch (error) {
        console.error("Erreur lors de la récupération des réservations en attente:", error);
        res.status(500).json({ 
            message: "Échec de la récupération des demandes en attente.", 
            error: error.message
        });
    }
};

// 🚨 FONCTION CORRIGÉE : Récupération des données du Tableau de Bord Réception
exports.getReceptionDashboardData = async (req, res) => {
    try {
        console.log("🔄 Chargement des données du dashboard réception...");

        // Exécution en parallèle pour meilleures performances
        const [
            pendingResult,
            todayEventsResult,
            unavailableResult,
            urgentRequestsResult,
            latestRequests,
            unavailableDetailed
        ] = await Promise.all([
            // 1. Demandes en attente
            db.sequelize.query(sqlKpiPending, { type: db.sequelize.QueryTypes.SELECT }),
            
            // 2. Événements du jour (locations confirmées aujourd'hui)
            db.sequelize.query(`
                SELECT COUNT(*) AS count 
                FROM location 
                WHERE etatLo = 'Confirmée' 
                AND DATE(debLo) = CURDATE()
            `, { type: db.sequelize.QueryTypes.SELECT }),
            
            // 3. Ressources indisponibles (CORRIGÉ)
            db.sequelize.query(sqlKpiUnavailable, { type: db.sequelize.QueryTypes.SELECT }),
            
            // 4. Demandes urgentes (pour aujourd'hui)
            db.sequelize.query(`
                SELECT COUNT(*) AS count 
                FROM reservation 
                WHERE etatRes = 'En attente' 
                AND DATE(debRes) = CURDATE()
            `, { type: db.sequelize.QueryTypes.SELECT }),
            
            // 5. Dernières demandes
            db.sequelize.query(sqlLatestPendingRequests, { type: db.sequelize.QueryTypes.SELECT }),
            
            // 6. Détails des indisponibilités (optionnel)
            db.sequelize.query(`
                SELECT 
                    (SELECT COUNT(*) FROM salle WHERE disponibiliteSalle = 'Occupée') AS salles_occupees,
                    (SELECT COUNT(*) FROM salle WHERE disponibiliteSalle = 'Maintenance') AS salles_maintenance,
                    (SELECT COUNT(*) FROM materiel WHERE etatMat = 'En location') AS materiel_location,
                    (SELECT COUNT(*) FROM materiel WHERE etatMat = 'Maintenance') AS materiel_maintenance,
                    (SELECT COUNT(*) FROM materiel WHERE etatMat = 'Hors service') AS materiel_hors_service
            `, { type: db.sequelize.QueryTypes.SELECT })
        ]);

        const responseData = {
            pendingRequests: pendingResult[0]?.count || 0,
            todayEvents: todayEventsResult[0]?.count || 0,
            unavailableResources: unavailableResult[0]?.total_unavailable || 0,
            urgentRequests: urgentRequestsResult[0]?.count || 0,
            latestRequests: latestRequests,
            detailedUnavailable: unavailableDetailed[0] || {}
        };

        console.log("✅ Données dashboard chargées:", responseData);

        res.status(200).send(responseData);

    } catch (error) {
        console.error("❌ ERREUR - Dashboard réception:", error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des données du tableau de bord.", 
            error: error.message
        });
    }
};

exports.updateReservationStatus = async (req, res) => {
    const { idRes } = req.params;
    const { newStatus } = req.body;

    if (newStatus !== 'Confirmée' && newStatus !== 'Refusée') {
        return res.status(400).send({ message: "Statut non valide." });
    }

    try {
        const [numAffectedRows] = await Reservation.update({ etatRes: newStatus }, {
            where: { idRes: idRes, etatRes: 'En attente' }
        });

        if (numAffectedRows === 1) {
            res.send({ message: `Réservation #${idRes} mise à jour à '${newStatus}' avec succès.` });
        } else {
            res.status(404).send({ message: `Réservation #${idRes} non trouvée ou déjà traitée.` });
        }
    } catch(error) {
        console.error(`Erreur lors de la mise à jour de la réservation #${idRes}:`, error);
        res.status(500).send({ message: "Erreur serveur lors de la mise à jour.", error: error.message });
    }
};
exports.getConfirmedEvents = async (req, res) => {
    try {
        console.log('📍 getConfirmedEvents - Début');
        
        const sql = `
            SELECT 
                l.*,
                c.nomCli,
                c.prenomCli,
                c.emailCli,
                c.telephoneCli,
                r.typeRes,
                r.qteMat,
                m.codeMat,
                m.designationMat,
                s.idSalle,
                s.nomSalle
            FROM location l
            JOIN reservation r ON l.idRes = r.idRes
            JOIN client c ON r.idCli = c.idCli
            LEFT JOIN materiel m ON r.codeMat = m.codeMat
            LEFT JOIN salle s ON r.idSalle = s.idSalle
            WHERE l.etatLo IN ('Confirmée', 'En cours', 'Terminée')
            -- SUPPRIMER la condition de paiement pour garder TOUTES les locations actives
            ORDER BY l.debLo ASC
        `;

        console.log('📍 Exécution requête SQL...');
        
        const locations = await sequelize.query(sql, {
            type: sequelize.QueryTypes.SELECT
        });

        console.log(`📍 ${locations.length} locations trouvées avec statuts:`, 
            locations.map(l => `${l.idLo}(${l.etatLo})`).join(', '));

        res.status(200).send(locations);
        
    } catch (error) {
        console.error("❌ ERREUR getConfirmedEvents:", error);
        res.status(500).send({ 
            message: "Erreur serveur",
            error: error.message 
        });
    }
};

exports.checkAvailability = async (req, res) => {
    const { type, codeId, debRes, finRes, quantite } = req.query; 
    const qte = parseInt(quantite);

    if (!type || !codeId || !debRes || !finRes || isNaN(qte) || qte <= 0) {
        return res.status(400).send({ message: "Paramètres de disponibilité manquants ou invalides." });
    }
    
    const overlapCondition = {
        debRes: { [Op.lt]: new Date(finRes) },
        finRes: { [Op.gt]: new Date(debRes) },
        etatRes: 'Confirmée' 
    };

    try {
        let isAvailable = false;

        if (type === 'Materiel') {
            const materiel = await Materiel.findByPk(codeId, { attributes: ['qteActuelStock'] });
            if (!materiel) return res.status(404).json({ message: "Matériel non trouvé." });
            const totalStock = materiel.qteActuelStock;

            const occupied = await Reservation.findAll({
                attributes: [
                    [db.sequelize.fn('SUM', db.sequelize.col('qteMat')), 'total_occupied']
                ],
                where: { codeMat: codeId, ...overlapCondition },
                raw: true
            });

            const occupiedQty = parseInt(occupied[0]?.total_occupied || 0);
            const remaining = totalStock - occupiedQty;
            isAvailable = remaining >= qte;

        } else if (type === 'Salle') {
            const occupiedCount = await Reservation.count({
                where: { idSalle: codeId, ...overlapCondition }
            });

            const salle = await Salle.findByPk(codeId, { attributes: ['capaciteSalle'] });
            isAvailable = (occupiedCount === 0) && (qte <= (salle?.capaciteSalle || 0));
            
        } else {
            return res.status(400).send({ message: "Type de ressource non valide." });
        }

        res.json({ available: isAvailable });

    } catch (error) {
        console.error("Erreur de vérification de disponibilité:", error);
        res.status(500).send({ message: "Erreur serveur lors de la vérification de disponibilité.", error: error.message });
    }
};

exports.validateReservation = async (req, res) => {
    const { idRes } = req.params;
    const { signatureData } = req.body;

    const transaction = await db.sequelize.transaction();
    
    try {
        const reservation = await Reservation.findByPk(idRes, { transaction });
        
        if (!reservation || reservation.etatRes !== 'En attente') {
            await transaction.rollback();
            return res.status(404).send({ message: "Réservation introuvable ou déjà traitée." });
        }

        console.log(`[CONTRAT] Génération et archivage de Contrat-RES-${idRes}.pdf suite à signature.`);
        
        const locationData = {
            idRes: reservation.idRes,
            idCatalogue: reservation.idCatalogue,
            dateCre: new Date(), 
            qteMat: reservation.qteMat,
            typeLo: reservation.typeRes,
            nbPersp: reservation.nbPerso,
            debLo: reservation.debRes,
            finLo: reservation.finRes,
            tarifTot: reservation.tarifTot,
            etatLo: 'Confirmée'
        };
        const newLocation = await Location.create(locationData, { transaction });

        await Reservation.update({ etatRes: 'Confirmée' }, { where: { idRes: idRes }, transaction });

        if (reservation.codeMat) {
            await Materiel.update({ 
                qteActuelStock: db.sequelize.literal(`qteActuelStock - ${reservation.qteMat}`), 
                qteEnLocation: db.sequelize.literal(`qteEnLocation + ${reservation.qteMat}`)
            }, { where: { codeMat: reservation.codeMat }, transaction });
        }
        
        await transaction.commit();
        res.status(200).send({ 
            message: "Validation réussie : Réservation Confirmée, Location #"+newLocation.idLo+" créée et Stock mis à jour.", 
            idLocation: newLocation.idLo 
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de la validation/transfert:", error);
        res.status(500).send({ message: "Échec de la validation de la réservation.", error: error.message });
    }
};

exports.submitEtatLieux = async (req, res) => {
    const { idLo } = req.params;
    const { mode, details } = req.body; 

    if (!idLo || !mode) return res.status(400).send({ message: "ID Location et mode requis." });
    
    if (!details || !Array.isArray(details)) return res.status(400).send({ message: "Les données de matériel (details) sont requises." });

    const normalizedMode = mode.toLowerCase();
    
    const transaction = await db.sequelize.transaction();

    try {
        // CORRECTION : Utilisez db.sequelize.query au lieu de sequelize.query
        const sql = "SELECT * FROM location WHERE idLo = ?";
        const locations = await db.sequelize.query(sql, {
            replacements: [idLo],
            type: db.sequelize.QueryTypes.SELECT, // CORRECTION ici aussi
            transaction
        });
        
        if (locations.length === 0) { 
            await transaction.rollback(); 
            return res.status(404).send({ message: "Location non trouvée." }); 
        }

        const location = locations[0];

        if (normalizedMode === 'depart') {
            await Location.update({ etatLo: 'En cours' }, { where: { idLo: idLo }, transaction });
            
        } else if (normalizedMode === 'retour') {
            await Location.update({ etatLo: 'Terminée' }, { where: { idLo: idLo }, transaction });
            
            for (const item of details) {
                if (item.idMat && item.qteMat) { 
                    await Materiel.update({ 
                        qteActuelStock: db.sequelize.literal(`qteActuelStock + ${item.qteMat}`), 
                        qteEnLocation: db.sequelize.literal(`qteEnLocation - ${item.qteMat}`)
                    }, { where: { codeMat: item.idMat }, transaction });
                }

                if (item.estEndommage && item.coutReparation > 0) {
                    // CORRECTION : Utilisez db.sequelize.query
                    const reservationSql = `
                        SELECT r.idCli 
                        FROM reservation r 
                        JOIN location l ON r.idRes = l.idRes 
                        WHERE l.idLo = ?
                    `;
                    const reservations = await db.sequelize.query(reservationSql, {
                        replacements: [idLo],
                        type: db.sequelize.QueryTypes.SELECT, // CORRECTION ici aussi
                        transaction
                    });

                    if (reservations.length > 0 && db.Paiement) {
                        await db.Paiement.create({ 
                            idLo: idLo,
                            idCli: reservations[0].idCli,
                            dateCre: new Date(),
                            montantPaie: item.coutReparation,
                            statutPaie: 'En attente', 
                            libellePaie: `Frais de réparation pour ${item.materielCode} (État des lieux Retour)`
                        }, { transaction });
                    }
                }
            }

        } else {
            await transaction.rollback();
            return res.status(400).send({ message: "Mode d'état des lieux non valide." });
        }
        
        await transaction.commit();
        res.status(200).send({ message: `Opération d'état des lieux ${mode} enregistrée avec succès.` });

    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de l'enregistrement de l'état des lieux:", error);
        res.status(500).send({ message: "Échec de l'enregistrement de l'état des lieux.", error: error.message });
    }
};

exports.getLocationDetails = async (req, res) => {
    const { idLo } = req.params;

    try {
        // CORRECTION : Utilisez db.sequelize.query
        const sql = `
            SELECT 
                l.*,
                r.idCli,
                c.nomCli,
                c.prenomCli,
                c.emailCli,
                c.telephoneCli
            FROM location l
            JOIN reservation r ON l.idRes = r.idRes
            JOIN client c ON r.idCli = c.idCli
            WHERE l.idLo = ?
        `;

        const locations = await db.sequelize.query(sql, {
            replacements: [idLo],
            type: db.sequelize.QueryTypes.SELECT // CORRECTION ici aussi
        });

        if (locations.length === 0) {
            return res.status(404).send({ message: "Location introuvable." });
        }

        const location = locations[0];
        
        const responseData = {
            idLo: location.idLo,
            client: {
                nomCli: location.nomCli,
                prenomCli: location.prenomCli,
                emailCli: location.emailCli,
                telephoneCli: location.telephoneCli
            },
            debLo: location.debLo,
            finLo: location.finLo,
            details: []
        };
        
        // Récupérer les détails du matériel si disponible
        if (location.codeMat) {
            const materiel = await Materiel.findByPk(location.codeMat, {
                attributes: ['codeMat', 'designationMat'] 
            });

            if (materiel) {
                 responseData.details.push({
                     idMat: materiel.codeMat, 
                     materiel: { nomMat: materiel.designationMat }, 
                     qteMat: location.qteMat 
                 });
            }
        } 
        
        // Récupérer les détails de la salle si disponible
        if (location.idSalle) {
            const salle = await Salle.findByPk(location.idSalle, {
                attributes: ['idSalle', 'nomSalle']
            });
            
            if (salle) {
                 responseData.details.push({
                     idSalle: salle.idSalle, 
                     materiel: { nomMat: salle.nomSalle },
                     qteMat: location.nbPersp 
                 });
            }
        }

        res.status(200).json(responseData);

    } catch (error) {
        console.error(`Erreur lors du chargement des détails de la location #${idLo}:`, error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des détails de la location.", 
            error: error.message 
        });
    }
};


exports.createReservation = async (req, res) => {
    const { 
        idCli, 
        idCatalogue,
        typeRes,
        dateCre, 
        qteMat, 
        nbPerso, 
        debRes, 
        finRes, 
        tarifTot,
        etatRes 
    } = req.body;

    if (!idCli || !typeRes || !debRes || !finRes || !tarifTot) {
        return res.status(400).send({ 
            message: "Champs requis manquants: idCli, typeRes, debRes, finRes, tarifTot" 
        });
    }

    let idSalle = null;
    let codeMat = null;

    if (typeRes === 'Salle') {
        idSalle = idCatalogue;
    } else if (typeRes === 'Materiel') {
        codeMat = idCatalogue;
    }

    try {
        const nouvelleReservation = await Reservation.create({
            idCli, 
            idSalle,
            codeMat,
            dateCre: dateCre || new Date(),
            qteMat: qteMat || 0, 
            typeRes, 
            nbPerso: nbPerso || 0, 
            debRes, 
            finRes, 
            tarifTot,
            etatRes: etatRes || 'En attente'
        });
        
        res.status(201).send({
            message: "Demande de réservation créée avec succès.",
            id: nouvelleReservation.idRes,
            reservation: nouvelleReservation
        });
       
    } catch (error) {
        console.error("Erreur création réservation:", error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                message: "Données invalides",
                errors: error.errors ? error.errors.map(e => e.message) : [error.message]
            });
        }
        
        res.status(500).json({ 
            message: "Erreur interne du serveur",
            error: error.message 
        });
    }
};

exports.getReservationDetails = async (req, res) => {
    const { idRes } = req.params;

    try {
        const reservation = await Reservation.findByPk(idRes, {
            include: [{
                model: Client,
                as: 'client',
                attributes: ['nomCli', 'prenomCli', 'emailCli', 'telephoneCli']
            }],
            where: {
                etatRes: 'En attente'
            }
        });

        if (!reservation) {
            return res.status(404).send({ message: "Réservation en attente non trouvée." });
        }

        res.status(200).json(reservation);

    } catch (error) {
        console.error(`Erreur lors du chargement des détails de la réservation #${idRes}:`, error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la récupération des détails.", 
            error: error.message 
        });
    }
};

exports.updateReservationStatus = async (req, res) => {
    const { idRes } = req.params;
    const { newStatus } = req.body;

    console.log('📍 Backend - updateReservationStatus:');
    console.log('📍 ID Réservation:', idRes);
    console.log('📍 Nouveau statut:', newStatus);
    console.log('📍 Body complet:', req.body);

    // CORRECTION : Validation améliorée
    if (!newStatus) {
        return res.status(400).send({ 
            message: "Le champ 'newStatus' est requis dans le body." 
        });
    }

    const statutsValides = ['Confirmée', 'Refusée', 'En attente', 'Annulée'];
    if (!statutsValides.includes(newStatus)) {
        return res.status(400).send({ 
            message: `Statut non valide. Statuts autorisés: ${statutsValides.join(', ')}` 
        });
    }

    try {
        const [numAffectedRows] = await Reservation.update(
            { etatRes: newStatus }, 
            {
                where: { 
                    idRes: idRes 
                    // Retirez cette condition si vous voulez pouvoir mettre à jour même les réservations déjà traitées
                    // etatRes: 'En attente' 
                }
            }
        );

        console.log('📍 Lignes affectées:', numAffectedRows);

        if (numAffectedRows === 1) {
            res.send({ 
                message: `Réservation #${idRes} mise à jour à '${newStatus}' avec succès.`,
                reservationId: idRes,
                newStatus: newStatus
            });
        } else {
            res.status(404).send({ 
                message: `Réservation #${idRes} non trouvée ou déjà traitée.` 
            });
        }
    } catch(error) {
        console.error(`Erreur lors de la mise à jour de la réservation #${idRes}:`, error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la mise à jour.", 
            error: error.message 
        });
    }
};
/*
// 🔥 NOUVELLE MÉTHODE : Mettre à jour le statut d'une LOCATION
exports.updateLocationStatus = async (req, res) => {
    const { idLo } = req.params;
    const { newStatus } = req.body;

    console.log('📍 Backend - updateLocationStatus:');
    console.log('📍 ID Location:', idLo);
    console.log('📍 Nouveau statut:', newStatus);

    // CORRECTION : Statuts valides pour les LOCATIONS
    const statutsValides = ['Confirmée', 'En cours', 'Terminée', 'Annulée'];
    
    if (!newStatus) {
        return res.status(400).send({ 
            message: "Le champ 'newStatus' est requis dans le body." 
        });
    }

    if (!statutsValides.includes(newStatus)) {
        return res.status(400).send({ 
            message: `Statut non valide. Statuts autorisés: ${statutsValides.join(', ')}` 
        });
    }

    try {
        const [numAffectedRows] = await Location.update(
            { etatLo: newStatus }, 
            {
                where: { 
                    idLo: idLo 
                }
            }
        );

        console.log('📍 Lignes affectées:', numAffectedRows);

        if (numAffectedRows === 1) {
            res.send({ 
                message: `Location #${idLo} mise à jour à '${newStatus}' avec succès.`,
                locationId: idLo,
                newStatus: newStatus
            });
        } else {
            res.status(404).send({ 
                message: `Location #${idLo} non trouvée.` 
            });
        }
    } catch(error) {
        console.error(`Erreur lors de la mise à jour de la location #${idLo}:`, error);
        res.status(500).send({ 
            message: "Erreur serveur lors de la mise à jour.", 
            error: error.message 
        });
    }
};
*/

exports.updateLocationStatus = async (req, res) => {
    const { idLo } = req.params;
    const { newStatus } = req.body;

    console.log('📍 Backend - updateLocationStatus:');
    console.log('📍 ID Location reçu:', idLo);
    console.log('📍 Type ID:', typeof idLo);
    console.log('📍 Nouveau statut:', newStatus);
    console.log('📍 Body complet:', req.body);

    // CORRECTION : Convertir l'ID en nombre si besoin
    const locationId = parseInt(idLo, 10);
    
    if (isNaN(locationId)) {
        return res.status(400).send({ 
            message: "ID de location invalide" 
        });
    }

    const statutsValides = ['Confirmée', 'En cours', 'Terminée', 'Annulée'];
    
    if (!newStatus) {
        return res.status(400).send({ 
            message: "Le champ 'newStatus' est requis dans le body." 
        });
    }

    if (!statutsValides.includes(newStatus)) {
        return res.status(400).send({ 
            message: `Statut non valide. Statuts autorisés: ${statutsValides.join(', ')}` 
        });
    }

    try {
        // 🔥 CORRECTION : Vérifier d'abord si la location existe
        const location = await Location.findByPk(locationId);
        console.log('📍 Location trouvée dans DB:', location ? `Oui (ID: ${location.idLo})` : 'Non');
        
        if (!location) {
            return res.status(404).send({ 
                message: `Location #${locationId} non trouvée.`,
                debug: {
                    locationId: locationId,
                    type: typeof locationId,
                    table: 'Location'
                }
            });
        }

        const [numAffectedRows] = await Location.update(
            { etatLo: newStatus }, 
            {
                where: { 
                    idLo: locationId 
                }
            }
        );

        console.log('📍 Lignes affectées:', numAffectedRows);

        if (numAffectedRows === 1) {
            res.send({ 
                success: true,
                message: `Location #${locationId} mise à jour à '${newStatus}' avec succès.`,
                locationId: locationId,
                newStatus: newStatus
            });
        } else {
            res.status(404).send({ 
                success: false,
                message: `Location #${locationId} non trouvée pour mise à jour.` 
            });
        }
    } catch(error) {
        console.error(`❌ Erreur lors de la mise à jour de la location #${locationId}:`, error);
        res.status(500).send({ 
            success: false,
            message: "Erreur serveur lors de la mise à jour.", 
            error: error.message 
        });
    }
};

exports.getReservationStatistics = async (req, res) => {
    try {
        const materialCount = await Reservation.count({
            where: { typeRes: 'Materiel' }
        });

        const salleCount = await Reservation.count({
            where: { typeRes: 'Salle' }
        });

        res.status(200).json({
            materiel: materialCount,
            salle: salleCount
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        res.status(500).json({ message: "Échec de la récupération des statistiques." });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await db.Client.findAll({ 
            attributes: ['idCli', 'nomCli', 'prenomCli'],
            where: { statutCli: 'actif' } 
        });
        res.status(200).json(clients);
    } catch (error) {
        console.error('Erreur SQL Clients:', error);
        res.status(500).json({ message: "Erreur serveur lors du chargement des clients." });
    }
};

exports.getSalles = async (req, res) => {
    try {
        const salles = await db.Salle.findAll({
            attributes: ['idSalle', 'nomSalle', 'tarifHeure', 'tarifDemiJournee', 'tarifJour'],
            where: { disponibiliteSalle: 'Disponible' }
        });
        res.status(200).json(salles);
    } catch (error) {
        console.error('Erreur SQL Salles:', error);
        res.status(500).json({ message: "Erreur serveur lors du chargement des salles." });
    }
};

exports.getMateriels = async (req, res) => {
    try {
        const materiels = await db.Materiel.findAll({
            attributes: [
                'codeMat', 
                'designationMat', 
                'tarifHeure', 
                'tarifDemiJournee', 
                'tarifJour'
            ]
        });
        return res.status(200).json(materiels);
    } catch (error) {
        console.error('Erreur SQL Matériels:', error);
        return res.status(500).json({ message: "Erreur serveur lors du chargement du matériel." });
    }
};

exports.getLocationHistory = async (req, res) => {
    try {
        const locationsHistory = await Location.findAll({
            include: [
                {
                    model: Reservation,
                    attributes: ['idRes', 'dateCre', 'typeRes', 'tarifTot'],
                    include: [
                        {
                            model: Client,
                            attributes: ['nomCli', 'prenomCli']
                        }
                    ]
                }
            ],
            where: {
                etatLo: ['Terminée', 'Annulée']
            },
            order: [['dateCre', 'DESC']],
            limit: 50
        });

        const formattedHistory = locationsHistory.map(location => ({
            idLo: location.idLo,
            idRes: location.idRes,
            dateCre: location.dateCre,
            typeLo: location.typeLo,
            tarifTot: location.tarifTot,
            client: location.Reservation?.Client ? 
                `${location.Reservation.Client.prenomCli || ''} ${location.Reservation.Client.nomCli}`.trim() : 'N/A'
        }));

        res.json({
            success: true,
            data: formattedHistory,
            count: formattedHistory.length
        });

    } catch (error) {
        console.error('Erreur récupération historique locations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'historique des locations',
            error: error.message
        });
    }
};
exports.getConfirmedLocations = async (req, res) => {
    try {
        console.log('📍 Début getConfirmedLocations');
        
        // Vérifiez d'abord que sequelize.query existe
        if (!sequelize || typeof sequelize.query !== 'function') {
            console.error('❌ Sequelize.query non disponible');
            return res.status(500).send({ 
                message: "Erreur de configuration de la base de données" 
            });
        }

        const sqlConfirmedLocations = `
            SELECT 
                l.idLo,
                l.idRes,
                l.debLo,
                l.finLo,
                l.typeLo,
                l.tarifTot,
                l.etatLo,
                l.qteMat,
                l.nbPersp,
                c.idCli,
                c.nomCli,
                c.prenomCli,
                c.emailCli,
                c.telephoneCli,
                r.typeRes,
                r.qteMat as reservationQteMat,
                m.codeMat,
                m.designationMat,
                m.tarifHeure as materielTarifHeure,
                m.tarifDemiJournee as materielTarifDemiJournee,
                m.tarifJour as materielTarifJour,
                s.idSalle,
                s.nomSalle,
                s.tarifHeure as salleTarifHeure,
                s.tarifDemiJournee as salleTarifDemiJournee,
                s.tarifJour as salleTarifJour,
                DATEDIFF(DATE(l.debLo), CURDATE()) AS joursAvantDebut
            FROM 
                location l
            JOIN 
                reservation r ON l.idRes = r.idRes
            JOIN 
                client c ON r.idCli = c.idCli
            LEFT JOIN 
                materiel m ON r.codeMat = m.codeMat
            LEFT JOIN 
                salle s ON r.idSalle = s.idSalle
            LEFT JOIN 
                paiement p ON l.idLo = p.idLo AND p.statutPaie = 'Effectué'
            WHERE 
                l.etatLo = 'Confirmée'
                AND p.idPaie IS NULL
            ORDER BY 
                l.debLo ASC;
        `;

        console.log('📍 Exécution de la requête SQL...');
        
        // CORRECTION : Utilisez la syntaxe correcte pour sequelize.query
        const confirmedLocations = await sequelize.query(sqlConfirmedLocations, { 
            type: sequelize.QueryTypes.SELECT 
        });

        console.log('📍 Nombre de locations trouvées:', confirmedLocations.length);
        
        if (confirmedLocations.length > 0) {
            console.log('📍 Premier élément:', {
                idLo: confirmedLocations[0].idLo,
                nomCli: confirmedLocations[0].nomCli,
                prenomCli: confirmedLocations[0].prenomCli,
                emailCli: confirmedLocations[0].emailCli
            });
        }

        // Formater la réponse
        const formattedLocations = confirmedLocations.map(location => ({
            idLo: location.idLo,
            idRes: location.idRes,
            debLo: location.debLo,
            finLo: location.finLo,
            typeLo: location.typeLo,
            tarifTot: location.tarifTot,
            etatLo: location.etatLo,
            qteMat: location.qteMat,
            nbPersp: location.nbPersp,
            reservation: {
                typeRes: location.typeRes,
                qteMat: location.reservationQteMat,
                client: {
                    idCli: location.idCli,
                    nomCli: location.nomCli,
                    prenomCli: location.prenomCli,
                    emailCli: location.emailCli,
                    telephoneCli: location.telephoneCli
                },
                codeMat: location.codeMat,
                idSalle: location.idSalle
            },
            materiel: location.codeMat ? {
                codeMat: location.codeMat,
                designationMat: location.designationMat,
                tarifHeure: location.materielTarifHeure,
                tarifDemiJournee: location.materielTarifDemiJournee,
                tarifJour: location.materielTarifJour
            } : null,
            salle: location.idSalle ? {
                idSalle: location.idSalle,
                nomSalle: location.nomSalle,
                tarifHeure: location.salleTarifHeure,
                tarifDemiJournee: location.salleTarifDemiJournee,
                tarifJour: location.salleTarifJour
            } : null,
            joursAvantDebut: location.joursAvantDebut
        }));

        res.status(200).send(formattedLocations);

    } catch (error) {
        console.error("❌ ERREUR getConfirmedLocations:", error);
        res.status(500).send({ 
            message: "Échec de la récupération des locations confirmées.",
            error: error.message,
            stack: error.stack
        });
    }
};

exports.createClientReservation = async (req, res) => {
    try {
        console.log('User object:', req.user); // Debug
        
        // Vérifier si l'utilisateur est authentifié
        if (!req.user || !req.user.idUti) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié"
            });
        }

        // Récupérer le client associé à l'utilisateur
        const [clients] = await db.query(
            "SELECT idCli FROM client WHERE idUti = ?", 
            [req.user.idUti] // ← Utilisez req.user.idUti
        );

        if (clients.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Client non trouvé pour cet utilisateur"
            });
        }

        const idCli = clients[0].idCli;
        const { typeRes, nbPerso, debRes, finRes, tarifTot, idSalle, codeMat, qteMat } = req.body;

        // Validation des données requises
        if (!typeRes || !debRes || !finRes || !tarifTot) {
            return res.status(400).json({
                success: false,
                message: "Données manquantes: typeRes, debRes, finRes et tarifTot sont requis"
            });
        }

        console.log('Création réservation pour client:', idCli, 'données:', req.body);

        // Insertion de la réservation
        const [result] = await db.query(
            `INSERT INTO reservation 
             (idCli, typeRes, nbPerso, debRes, finRes, tarifTot, etatRes, idSalle, codeMat, qteMat) 
             VALUES (?, ?, ?, ?, ?, ?, 'En attente', ?, ?, ?)`,
            [idCli, typeRes, nbPerso || null, debRes, finRes, tarifTot, idSalle || null, codeMat || null, qteMat || 0]
        );

        res.status(201).json({
            success: true,
            message: "Réservation créée avec succès",
            data: {
                idRes: result.insertId,
                idCli: idCli
            }
        });

    } catch (error) {
        console.error('❌ Erreur création réservation client:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la création de la réservation",
            error: error.message
        });
    }
};

// 🔥 NOUVELLE MÉTHODE : Récupérer les locations terminées
exports.getTerminatedLocations = async (req, res) => {
    try {
        const sqlTerminatedLocations = `
            SELECT 
                l.*,
                c.nomCli,
                c.prenomCli,
                c.emailCli,
                c.telephoneCli,
                r.typeRes,
                m.codeMat,
                m.designationMat,
                s.idSalle,
                s.nomSalle,
                p.numeroFacture,
                p.montantPaie,
                p.dateCre,
                p.statutPaie
            FROM location l
            JOIN reservation r ON l.idRes = r.idRes
            JOIN client c ON r.idCli = c.idCli
            LEFT JOIN materiel m ON r.codeMat = m.codeMat
            LEFT JOIN salle s ON r.idSalle = s.idSalle
            LEFT JOIN paiement p ON l.idLo = p.idLo
            WHERE l.etatLo = 'Terminée'
            AND p.statutPaie = 'Effectué'
            ORDER BY p.dateCre DESC
        `;

        const terminatedLocations = await sequelize.query(sqlTerminatedLocations, { 
            type: sequelize.QueryTypes.SELECT 
        });

        res.status(200).send(terminatedLocations);

    } catch (error) {
        console.error("Erreur getTerminatedLocations:", error);
        res.status(500).send({ 
            message: "Échec de la récupération des locations terminées",
            error: error.message 
        });
    }
};