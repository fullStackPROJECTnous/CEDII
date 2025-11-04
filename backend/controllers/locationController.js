

// backend/controllers/locationController.js

const db = require('../models');
// 🚨 db.location doit être en minuscules, correspondant à la clé dans index.js
const Location = db.Location; 
const Reservation = db.Reservation; // Importez les modèles nécessaires
const Client = db.Client; 
const sequelize = db.Sequelize;
const Op = db.Sequelize.Op;
const Materiel = db.Materiel;
const Salle = db.Salle

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll({
            // 🚨 Correction du 'Include'
            include: [{ // ⬅️ Utilisez 'include' en minuscule et OUVERTURE d'objet {
                // Inclure la Réservation
                model: Reservation,
                // Dans la Reservation, inclure le Client
                include: [{
                    model: Client,
                    as: 'client'
                }]
            }], // ⬅️ FERMETURE d'objet } et du tableau []
            order: [['dateCre', 'DESC']]
        });
// ...
        
        res.status(200).json(locations);
        
    } catch (error) {
        console.error("Erreur de chargement des locations:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des locations.", 
            error: error.message 
        });
    }
};

// Assurez-vous d'importer l'instance de Sequelize
//const sequelize = require('../config/db'); 
const { QueryTypes } = require('sequelize');
//const db = require('../models'); 
// Nécessaire pour typer la requête


exports.getPendingReservations = async (req, res) => { // 🚨 AJOUT DE req, res
    try {
        const pendingRequests = await Reservation.findAll({ // 🚨 Utilisation de l'alias local 'Reservation'
            // 1. Condition de filtre
            where: {
                etatRes: 'En attente' 
            },
            // 2. Jointure pour récupérer les informations du client
           include: [{
                model: Client, // 🚨 Utilisation de l'alias local 'Client'
                as: 'client',
                attributes: ['nomCli', 'prenomCli'] 
            }],
            order: [
                ['dateCre', 'DESC'] 
            ]
        });
        
        // 🚨 CRITIQUE : ENVOI DE LA RÉPONSE HTTP DE SUCCÈS
        res.status(200).json(pendingRequests); 

    } catch (error) {
        console.error("Erreur critique lors de la récupération des réservations en attente:", error);
        
        // 🚨 CRITIQUE : ENVOI DE LA RÉPONSE HTTP D'ERREUR
        res.status(500).json({ 
            message: "Échec de la récupération des demandes en attente (Erreur de base de données).", 
            error: error.message // Utile pour le débogage local
        });
    }
};
// Récupère les 5 dernières réservations en attente avec le nom du demandeur (Utilisateur)
const sqlLatestPendingRequests = `
    SELECT 
        R.idRes AS id, 
        CONCAT(C.nomCli, ' ', C.prenomCli) AS demandeur,
        R.typeRes AS ressource, -- Utilisation de typeRes comme placeholder pour la ressource demandée
        R.debRes AS dateDebut, 
        R.etatRes AS etat, 
        R.dateCre AS dateSoumission
        FROM reservation R
        JOIN client C ON R.idCli = C.idCli
        WHERE R.etatRes = 'En attente'
        ORDER BY R.dateCre DESC
        LIMIT 5;
`;

// Requête pour les KPI
const sqlKpiPending = `
    SELECT COUNT(*) AS count
    FROM reservation
    WHERE etatRes = 'En attente';
`;

const sqlKpiTodayEvents = `
    SELECT COUNT(*) AS count
    FROM location
    WHERE DATE(debLo) = DATE(NOW()) OR DATE(finLo) = DATE(NOW());
`;

// Placeholder pour les ressources indisponibles (à adapter à votre table patrimoine/matériel)
const sqlKpiUnavailable = `
    SELECT COUNT(*) AS count
    FROM salle
    WHERE disponibiliteSalle = 'Maintenance';
`;
// --- Fonctions du Contrôleur ---


        
// 🚨 NOUVELLE FONCTION MAJEURE : Récupération des données du Tableau de Bord Réception
exports.getReceptionDashboardData = async (req, res) => {
    try {
        // Exécution des requêtes avec db.sequelize.query
        // 1. KPI Pending Requests
        const pendingResult = await db.sequelize.query(sqlKpiPending, { type: db.sequelize.QueryTypes.SELECT });
        const pendingRequests = pendingResult[0]?.count || 0;

        // 2. KPI Today Events
        const todayEventsResult = await db.sequelize.query(sqlKpiTodayEvents, { type: db.sequelize.QueryTypes.SELECT });
        const todayEvents = todayEventsResult[0]?.count || 0;

        // 3. KPI Unavailable Resources (peut-être urgentRequests à la place)
        const unavailableResult = await db.sequelize.query(sqlKpiUnavailable, { type: db.sequelize.QueryTypes.SELECT });
        const unavailableResources = unavailableResult[0]?.count || 0;
        
        // * Urgent Requests est ici un KPI arbitraire que nous mettons à 0, 
        //   vous pouvez le remplacer par un autre KPI si nécessaire
        const urgentRequests = 0; 

        // 4. Latest Requests (la liste du tableau)
        const latestRequests = await db.sequelize.query(sqlLatestPendingRequests, { type: db.sequelize.QueryTypes.SELECT });

        res.status(200).send({
            pendingRequests,
            urgentRequests,
            todayEvents,
            unavailableResources,
            latestRequests: latestRequests, // 🚨 C'est ici que les données du tableau sont envoyées
        });

 
        } catch (error) {
        console.error("Erreur de chargement du tableau de bord Réception:", error);
        res.status(500).send({ message: "Erreur serveur lors de la récupération des données du tableau de bord.", error: error.message });
    }
};


exports.updateReservationStatus = async (req, res) => {
    const { idRes } = req.params;
    const { newStatus } = req.body; // 'Confirmée' ou 'Refusée'

    if (newStatus !== 'Confirmée' && newStatus !== 'Refusée') {
        return res.status(400).send({ message: "Statut non valide." });
    }

    try {
        // Supposons que db.reservation est votre modèle
        const [numAffectedRows] = await db.reservation.update({ etatRes: newStatus }, {
            where: { idRes: idRes, etatRes: 'En attente' }
        });

        if (numAffectedRows === 1) {
            // 💡 Logique de notification à implémenter ici (ex: envoi d'email au client)
            res.send({ message: `Réservation #${idRes} mise à jour à '${newStatus}' avec succès.` });
        } else {
            res.status(404).send({ message: `Réservation #${idRes} non trouvée ou déjà traitée.` });
        }
    } catch(error) {
        console.error(`Erreur lors de la mise à jour de la réservation #${idRes}:`, error);
        res.status(500).send({ message: "Erreur serveur lors de la mise à jour.", error: error.message });
    }
}



;

// locationController.js


// Test rapide (à remplacer)
exports.getConfirmedEvents = async (req, res) => {
    try {
        const confirmedEvents = await Location.findAll({
            // Filtrer explicitement les événements Confirmés sur la table Location.
            // Si 'etatLo' est le champ qui indique la confirmation d'un événement,
            // ce filtre est correct.
            where: { 
                etatLo: 'Confirmée' 
            },
            
            // CRITIQUE : INCLUSIONS IMBRIQUÉES
            include: [{
                // 1. Inclure la Réservation (associée à la Location)
                model: Reservation, 
                as: 'reservation', 
                
                // ✅ AJOUT : Garantit qu'une Reservation existe pour chaque Location (JOIN INNER)
                // Ceci peut être utile si certaines Locations n'ont pas de Reservation.
                required: true, 
                
                // 2. Inclure le Client (associé à la Réservation)
                include: [{
                    model: Client,
                    as: 'client', 
                    attributes: ['nomCli', 'prenomCli'],
                    // ✅ AJOUT : Optionnel, mais sécurise la jointure
                    required: true, 
                }]
            }],

            order: [['debLo', 'ASC']],
            // Liste des attributs pour la performance
            attributes: ['idLo', 'debLo', 'finLo', 'typeLo', 'etatLo', 'idRes']
        });
        
        res.status(200).json(confirmedEvents);

    } catch (error) {
        // 🚨 POINT CRITIQUE : Affiche l'erreur complète dans la console du backend.
        // Cela vous aidera à identifier si l'erreur vient d'un alias ou d'une colonne manquante.
        console.error("Erreur critique lors de la récupération des événements confirmés (vérifiez l'alias!):", error.message, error.sql); 
        res.status(500).json({ message: "Échec de la récupération des événements confirmés." });
    }
};
exports.checkAvailability = async (req, res) => {
    // Le Frontend doit fournir: type ('Materiel' ou 'Salle'), codeId (codeMat ou idSalle), debRes, finRes, quantite (qteMat ou nbPerso)
    const { type, codeId, debRes, finRes, quantite } = req.query; 
    const qte = parseInt(quantite);

    if (!type || !codeId || !debRes || !finRes || isNaN(qte) || qte <= 0) {
        return res.status(400).send({ message: "Paramètres de disponibilité manquants ou invalides." });
    }
    
    // Condition d'overlap (réservations CONFIRMÉES qui chevauchent la période)
    const overlapCondition = {
        debRes: { [Op.lt]: new Date(finRes) }, // La date de début de l'événement précédent est avant la fin de celui-ci
        finRes: { [Op.gt]: new Date(debRes) },  // La date de fin de l'événement précédent est après le début de celui-ci
        etatRes: 'Confirmée' 
    };

    try {
        let isAvailable = false;

        if (type === 'Materiel') {
            // 1. Trouver le stock total actuel (qteActuelStock)
            const materiel = await Materiel.findByPk(codeId, { attributes: ['qteActuelStock'] });
            if (!materiel) return res.status(404).json({ message: "Matériel non trouvé." });
            const totalStock = materiel.qteActuelStock;

            // 2. Calculer la quantité déjà réservée sur cette période (SUM(qteMat))
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
            // Pour une salle, la logique la plus simple est : si une réservation CONFIRMÉE existe, la salle est prise.
            const occupiedCount = await Reservation.count({
                where: { idSalle: codeId, ...overlapCondition }
            });

            // Si aucune réservation confirmée ne chevauche ET que la capacité est suffisante
            isAvailable = (occupiedCount === 0) && (qte <= (await Salle.findByPk(codeId, { attributes: ['capaciteSalle'] })).capaciteSalle);
            
        } else {
            return res.status(400).send({ message: "Type de ressource non valide." });
        }

        res.json({ available: isAvailable });

    } catch (error) {
        console.error("Erreur de vérification de disponibilité:", error);
        res.status(500).send({ message: "Erreur serveur lors de la vérification de disponibilité.", error: error.message });
    }
};

// A AJOUTER dans backend/controllers/locationController.js

exports.validateReservation = async (req, res) => {
    const { idRes } = req.params;
    const { signatureData } = req.body; // Simule la réception de la signature

    const transaction = await db.sequelize.transaction();
    
    try {
        const reservation = await Reservation.findByPk(idRes, { transaction });
        
        if (!reservation || reservation.etatRes !== 'En attente') {
            await transaction.rollback();
            return res.status(404).send({ message: "Réservation introuvable ou déjà traitée." });
        }

        // 1. Génération Contrat (SIMULATION de l'étape de Service de PDF)
        // La présence de la signatureData prouve que le client a signé.
        console.log(`[CONTRAT] Génération et archivage de Contrat-RES-${idRes}.pdf suite à signature.`);
        
        // 2. Créer l'entrée dans la table 'location'
        const locationData = {
            idRes: reservation.idRes,
            idCatalogue: reservation.idCatalogue,
            dateCre: new Date(), 
            qteMat: reservation.qteMat,
            typeLo: reservation.typeRes, // typeLo = typeRes
            nbPersp: reservation.nbPerso, // nbPersp = nbPerso
            debLo: reservation.debRes,
            finLo: reservation.finRes,
            tarifTot: reservation.tarifTot,
            etatLo: 'Confirmée' // La location est active et en attente de départ
        };
        const newLocation = await Location.create(locationData, { transaction });

        // 3. Mettre à jour le statut de la réservation
        await Reservation.update({ etatRes: 'Confirmée' }, { where: { idRes: idRes }, transaction });

        // 4. Mettre à jour le stock (si Matériel)
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

// A AJOUTER dans backend/controllers/locationController.js

exports.submitEtatLieux = async (req, res) => {
    const { idLo } = req.params;
    const { mode, materielCode, qteMat, estEndommage, coutReparation, descriptionDegradation } = req.body;
    
    if (!idLo || !mode) return res.status(400).send({ message: "ID Location et mode requis." });
    
    const transaction = await db.sequelize.transaction();

    try {
        const location = await Location.findByPk(idLo, { transaction });
        if (!location) { await transaction.rollback(); return res.status(404).send({ message: "Location non trouvée." }); }
        
        if (mode === 'depart') {
            // L'état de location passe de 'Confirmée' à 'En cours' (si vous avez cet état, sinon il reste 'Confirmée')
            // Ici, nous supposons qu'un ÉtatLieux de départ a simplement pour effet d'archiver la vérification
            
        } else if (mode === 'retour') {
            
            // 1. Mettre à jour la Location comme 'Terminée'
            await Location.update({ etatLo: 'Terminée' }, { where: { idLo: idLo }, transaction });

            // 2. Remise en stock automatique (si Matériel)
            if (materielCode && qteMat) { 
                await Materiel.update({ 
                    qteActuelStock: db.sequelize.literal(`qteActuelStock + ${qteMat}`), 
                    qteEnLocation: db.sequelize.literal(`qteEnLocation - ${qteMat}`)
                }, { where: { codeMat: materielCode }, transaction });
            }

            // 3. Facturation des dégradations éventuelles (Insertion dans la table Paiement)
            if (estEndommage && coutReparation > 0) {
                await db.Paiement.create({ // Assurez-vous que le modèle Paiement est bien db.Paiement
                    idLo: idLo,
                    dateCre: new Date(),
                    montantPaie: coutReparation,
                    statutPaie: 'En attente', 
                    // Ajoutez ici un libellé ou type de paiement si la table Paiement l'exige
                }, { transaction });
            }
        } else {
            await transaction.rollback();
            return res.status(400).send({ message: "Mode d'état des lieux non valide." });
        }
        
        await transaction.commit();
        res.status(200).send({ message: `Opération d'état des lieux '${mode}' enregistrée avec succès.` });

    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de l'enregistrement de l'état des lieux:", error);
        res.status(500).send({ message: "Échec de l'enregistrement de l'état des lieux.", error: error.message });
    }
};

// ... (Vos autres fonctions exports.getPendingReservations, exports.checkAvailability, etc.)

// --- Fonction manquante ou mal exportée ---
// 3. Créer une nouvelle réservation (Utilisé par la route router.post('/reservations'))
exports.createReservation = async (req, res) => {
    // 🚨 Assurez-vous que db.Reservation est bien importé en tant que Reservation
    const { 
        idCli, 
        idSalle, 
        codeMat, 
        dateCre, 
        qteMat, 
        typeRes, 
        nbPerso, 
        debRes, 
        finRes, 
        tarifTot 
    } = req.body;

    // Petite validation rapide
    if (!idCli || !qteMat || !typeRes || !debRes || !finRes || !tarifTot) {
        return res.status(400).send({ message: "Champs requis manquants pour la réservation." });
    }

    try {
        const nouvelleReservation = await Reservation.create({
            idCli, 
            idSalle: idSalle || null, // Peut être null si c'est du matériel
            codeMat: codeMat || null, // Peut être null si c'est une salle
            dateCre: dateCre || new Date(),
            qteMat, 
            typeRes, 
            nbPerso, 
            debRes, 
            finRes, 
            tarifTot,
            etatRes: 'En attente' // Statut initial par défaut
        });
        
        // 💡 Logique de notification : Envoyer un email de confirmation de demande au client.

        res.status(201).send({
            message: "Demande de réservation créée avec succès. En attente de validation.",
            reservation: nouvelleReservation
        });
    } catch (error) {
        console.error("Erreur de création de la réservation:", error);
        // Renvoyer l'erreur détaillée pour aider au débogage du client
        res.status(500).send({ 
            message: "Erreur serveur lors de la création de la réservation.", 
            error: error.message 
        });
    }
};

// ... (Vos autres fonctions exports.createReservation, exports.getPendingReservations, etc.)

// --- Ajout de la fonction getReservationDetails ---
// 4. Récupérer les détails complets d'une réservation (pour la page de validation)
exports.getReservationDetails = async (req, res) => {
    const { idRes } = req.params;

    try {
        // Option d'inclusion pour récupérer les infos du Client et du Matériel/Salle
        const reservation = await Reservation.findByPk(idRes, {
            // Inclure le Client
            include: [{
                model: Client,
                as: 'client', // Alias défini dans models/reservation.js
                attributes: ['nomCli', 'prenomCli', 'emailCli', 'telephoneCli']
            }, 
            // 💡 OPTIONNEL : Inclure le Matériel ou la Salle si nécessaire (doit être configuré dans les associations)
            /*
            {
                model: Materiel,
                as: 'materiel'
            },
            {
                model: Salle,
                as: 'salle'
            }
            */
            ],
            where: {
                etatRes: 'En attente' // Seules les réservations en attente peuvent être validées
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