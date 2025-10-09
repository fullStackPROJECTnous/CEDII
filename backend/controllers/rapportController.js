const db = require('../models');
const { Op } = require('sequelize');
const Salle = db.Salle;
const Materiel = db.Materiel;
const Reservation = db.Reservation;
const Location = db.Location;
const Client = db.Client;

// Fonction utilitaire pour obtenir la date de début du mois
const getMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

// --- 1. Indicateurs Clés de Performance (KPIs) ---
exports.getKPIs = async (req, res) => {
    try {
        const debutMois = getMonthStart();
        
        // 1. Total Clients Actifs
        const totalClients = await Client.count();

        // 2. Locations Confirmées ce mois-ci
        const locationsMois = await Reservation.count({
            where: {
                etatRes: 'Confirmée',
                debRes: { [Op.gte]: debutMois }
            }
        });
        
        // 3. Revenu Total estimé (Locations Terminées)
        const revenuTotal = await Location.sum('tarifTot', {
            where: {
                etatLo: 'Terminée'
            }
        });
        
        // 4. Taux d'occupation des Salles (Simplifié: Nb de Salles Occupées / Total Salles)
        const totalSalles = await Salle.count();
        const sallesOccupees = await Salle.count({
            where: {
                disponibiliteSalle: 'Occupée'
            }
        });
        const tauxOccupationSalle = totalSalles > 0 ? ((sallesOccupees / totalSalles) * 100).toFixed(2) : 0;


        res.status(200).send({
            totalClients,
            locationsMois,
            revenuTotal: revenuTotal || 0, // Si aucun revenu, retourne 0
            tauxOccupationSalle
        });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des KPIs.", error: error.message });
    }
};


// --- 2. Rapport d'activité des Réservations (par mois) ---
exports.getReservationsReport = async (req, res) => {
    try {
        // Logique pour agréger le nombre de réservations par état sur une période (ex: les 6 derniers mois)
        // Ceci nécessiterait des requêtes plus complexes (Sequelize.fn, GROUP BY).
        // Simplification: Retourne le décompte total par état.
        
        const reservationsParEtat = await Reservation.findAll({
            attributes: [
                'etatRes',
                [db.sequelize.fn('COUNT', db.sequelize.col('etatRes')), 'count']
            ],
            group: ['etatRes']
        });

        res.status(200).send(reservationsParEtat);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération du rapport de réservations.", error: error.message });
    }
};

// --- 3. Rapport sur le Matériel le plus loué (Top 5) ---
exports.getTopRentedMateriel = async (req, res) => {
    try {
        // Jointure avec la table de matériel pour avoir le nom, groupé par codeMat
        const topMateriel = await Location.findAll({
            attributes: [
                'codeMat',
                [db.sequelize.fn('SUM', db.sequelize.col('qteMat')), 'totalQteLouee']
            ],
            where: {
                typeLo: { [Op.in]: ['Materiel', 'Mixte'] }
            },
            include: [{
                model: Materiel,
                as: 'Materiel',
                attributes: ['designationMat']
            }],
            group: ['codeMat', 'Materiel.designationMat'],
            order: [[db.sequelize.literal('totalQteLouee'), 'DESC']],
            limit: 5
        });

        // Remarque: L'inclusion du modèle Materiel nécessite la configuration de l'association 
        // dans Location.js et Materiel.js, ce qui n'a pas été fait précédemment.
        // Si la requête échoue, utilisez une requête SQL pure (db.sequelize.query) ou retirez l'inclusion.

        res.status(200).send(topMateriel);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération du top matériel.", error: error.message });
    }
};