

// ⚠️ ASSUREZ-VOUS QUE CES IMPORTS SONT CORRECTS SELON VOTRE STRUCTURE DE FICHIERS ⚠️

// 1. Importez les modèles et Sequelize Op
/*const db = require('../models'); // Assurez-vous que ce chemin est correct
const { Op } = require('sequelize'); 

// 2. Référencez les modèles locaux pour plus de clarté
const Client = db.Client;
const Reservation = db.reservation;
const Location = db.location;
const Salle = db.salle;
const Materiel = db.materiel;

// 3. Importez la fonction utilitaire (exemple de fonction simple pour le début du mois)
// ⚠️ Si cette fonction se trouve ailleurs, changez le chemin d'accès.
function getMonthStart() {
    const now = new Date();
    // Retourne le premier jour du mois actuel (ex: 2025-10-01 00:00:00)
    return new Date(now.getFullYear(), now.getMonth(), 1); 
}

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
        // 🚨 ATTENTION: 'tarifTot' doit exister dans le modèle Location et la DB.
        // Si vous avez eu un problème avec 'montantTotal' avant, vérifiez bien ce nom.
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
        // Correction de la variable dans le calcul
        const tauxOccupationSalle = totalSalles > 0 ? ((sallesOccupees / totalSalles) * 100).toFixed(2) : 0;


        res.status(200).send({
            totalClients,
            locationsMois,
            revenuTotal: revenuTotal || 0, // Si aucun revenu, retourne 0
            tauxOccupationSalle, // Ici c'est le taux d'occupation des Salles
            // Ajoutez un KPI factice pour les matériels en attendant le vrai calcul
            tauxOccupationMateriels: "N/A" 
        });
        
    } catch (error) {
        // 💡 L'erreur complète sera affichée ici si l'importation est réussie.
        console.error("Erreur critique détaillée lors de la récupération des KPIs:", error);
        
        // Renvoie une erreur 500 au client
        res.status(500).send({
            message: "Erreur serveur lors du calcul des KPIs.",
            detail: error.message 
        });
    }

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
}
};

*/

// ⚠️ Correction de la structure du fichier de contrôleur. Tous les exports doivent être au niveau racine du module.

const db = require('../models'); 
const { Op } = require('sequelize'); 
const sequelize = require('../config/db'); // 👈 Doit pointer vers l'instance de Sequelize exportée
const { QueryTypes } = require('sequelize'); 

// Référencez les modèles locaux (adaptez les noms de propriétés si nécessaire)
const Client = db.client || db.Client;
const Reservation = db.reservation || db.Reservation;
const Location = db.location || db.Location;
const Salle = db.salle || db.Salle;
const Materiel = db.materiel || db.Materiel;
//const sequelize = db.sequelize; // Instance Sequelize pour les fonctions d'agrégation


// Fonction utilitaire pour obtenir la date de début du mois
const getMonthStart = () => {
    const now = new Date();
    // Retourne le premier jour du mois actuel (ex: 2025-10-01 00:00:00)
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
        // Vérifiez le nom de colonne 'tarifTot' dans votre modèle Location.js
        const revenuTotal = await Location.sum('tarifTot', {
            where: {
                etatLo: 'Terminée'
            }
        });
        
        // 4. Taux d'occupation des Salles
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
            revenuTotal: revenuTotal || 0,
            tauxOccupationSalle,
            // Ajout d'une valeur par défaut pour les matériels
            tauxOccupationMateriels: "N/A" 
        });
        
    } catch (error) {
        console.error("Erreur critique détaillée lors de la récupération des KPIs:", error);
        res.status(500).send({
            message: "Erreur serveur lors du calcul des KPIs.",
            detail: error.message 
        });
    }
};


// --- 2. Rapport d'activité des Réservations (par mois) ---
// 💡 CE BLOC EST MAINTENANT AU NIVEAU RACINE DU MODULE
exports.getReservationsReport = async (req, res) => {
    try {
        const reservationsParEtat = await Reservation.findAll({
            attributes: [
                'etatRes',
                [sequelize.fn('COUNT', sequelize.col('etatRes')), 'count']
            ],
            group: ['etatRes']
        });

        res.status(200).send(reservationsParEtat);
    } catch (error) {
        console.error("Erreur lors de la récupération du rapport de réservations:", error);
        res.status(500).send({ message: "Erreur lors de la récupération du rapport de réservations.", error: error.message });
    }
};

// --- 3. Rapport sur le Matériel le plus loué (Top 5) ---
// 💡 CE BLOC EST MAINTENANT AU NIVEAU RACINE DU MODULE
// 🚨 CORRECTION POUR /api/rapports/top-materiel
// backend/controllers/rapportController.js

exports.getTopRentedMateriel = async (req, res) => {
    try {
        console.log('Tentative de récupération du top matériel loué...');
        
        const sqlQuery = `
            SELECT 
                m.codeMat, 
                m.nomMat, 
                COUNT(r.codeMat) AS totalLocations 
            FROM reservation r
            JOIN materiel m ON r.codeMat = m.codeMat 
            WHERE r.etatRes = 'Confirmée'
            AND r.typeRes = 'Materiel'
            -- Optionnel : s'assurer que le matériel est en état louable
            AND m.etatMat IN ('Neuf', 'Bon état')
            GROUP BY m.codeMat, m.nomMat
            ORDER BY totalLocations DESC
            LIMIT 5;
        `;
        
        // 🚨 EXECUTION CRITIQUE: Utilisation de sequelize.query
        const [topMateriel] = await sequelize.query(sqlQuery, {
            type: QueryTypes.SELECT, 
            raw: true 
        });
        
        console.log(`Top ${topMateriel.length} matériels trouvés.`);
        res.json(topMateriel);
        
    } catch (error) {
        console.error('Erreur FATALE lors du chargement du top matériel:', error.message);
        // Renvoyer le message d'erreur détaillé au frontend pour le diagnostic
        res.status(500).json({ 
            error: 'Erreur serveur lors du chargement des rapports de matériel',
            detail: error.message // 👈 Ceci nous donnera la cause exacte
        });
    }
};

// backend/controllers/rapportController.js

exports.getRevenueByClientType = async (req, res) => {
    try {
        const sqlQuery = `
            SELECT 
                c.typeCli, 
                COALESCE(SUM(p.montantPaie), 0) AS totalRevenu 
            FROM client c
            JOIN reservation r ON c.idCli = r.idCli  /* Jointure Client -> Réservation */
            JOIN location l ON r.idRes = l.idRes      /* Jointure Réservation -> Location */
            JOIN paiement p ON l.idLo = p.idLo        /* Jointure Location -> Paiement */
            WHERE p.statutPaie = 'Effectué'
            GROUP BY c.typeCli
            ORDER BY totalRevenu DESC;
        `;
        
        // ... (utilisation de sequelize.query)
        
    } catch (error) {
        // 🚨 SI CETTE ERREUR APPARAÎT DANS VOTRE CONSOLE NODE.JS, 
        // C'EST LA VRAIE CAUSE DU 500
        console.error('Erreur SQL ou Sequelize:', error.message);
        res.status(500).json({ 
            error: 'Erreur serveur lors du chargement du revenu par client',
            detail: error.message 
        });
    }
};