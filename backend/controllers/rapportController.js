

// ⚠️ Correction de la structure du fichier de contrôleur. Tous les exports doivent être au niveau racine du module.

const db = require('../models'); 
const { Op } = require('sequelize'); 
const sequelize = require('../config/db'); // 👈 Doit pointer vers l'instance de Sequelize exportée
const { QueryTypes } = require('sequelize'); 

// Référencez les modèles locaux (adaptez les noms de propriétés si nécessaire)
const Client = db.Client;
const Reservation =  db.Reservation;
const Location =  db.Location;
const Salle =  db.Salle;
const Materiel =  db.Materiel;
const paiement = db.Paiement
//const sequelize = db.sequelize; // Instance Sequelize pour les fonctions d'agrégation


// Fonction utilitaire pour obtenir la date de début du mois
const getMonthStart = () => {
    const now = new Date();
    // Retourne le premier jour du mois actuel (ex: 2025-10-01 00:00:00)
    return new Date(now.getFullYear(), now.getMonth(), 1); 
};

exports.getKPIs = async (req, res) => {
    try {
        console.log('=== DÉBUT CALCUL KPIs ===');
        const debutMois = getMonthStart();
        
        // 1. Total Clients Actifs
        const totalClients = await Client.count();
        console.log('✅ Clients actifs:', totalClients);

        // 2. Locations Confirmées ce mois-ci
        const locationsMois = await Reservation.count({
            where: {
                etatRes: 'Confirmée',
                debRes: { [Op.gte]: debutMois }
            }
        });
        console.log('✅ Locations ce mois:', locationsMois);
        
        // 3. Revenu Total estimé
        const revenuTotal = await Location.sum('tarifTot', {
            where: { etatLo: 'Terminée' }
        });
        console.log('✅ Revenu total:', revenuTotal);
        
        // 4. Taux d'occupation des Salles
        const totalSalles = await Salle.count();
        const sallesOccupees = await Salle.count({
            where: { disponibiliteSalle: 'Occupée' }
        });
        const tauxOccupationSalle = totalSalles > 0 ? ((sallesOccupees / totalSalles) * 100).toFixed(2) : 0;
        console.log('✅ Taux salles:', tauxOccupationSalle + '%');

        // 5. Taux d'occupation des Matériels - AVEC DÉBOGAGE
        console.log('=== DÉBUT CALCUL MATÉRIELS ===');
        let tauxOccupationMateriel = 0;
        
        // A. Récupération des statistiques
        const statsMateriels = await Materiel.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('qteTotDispo')), 'totalDisponible'],
                [sequelize.fn('SUM', sequelize.col('qteEnLocation')), 'enLocation'],
                [sequelize.fn('SUM', sequelize.col('qteActuelStock')), 'enStock']
            ],
            raw: true
        });

        console.log('📊 Stats matériels brutes:', statsMateriels);

        const totalDisponible = parseFloat(statsMateriels?.totalDisponible) || 0;
        const enLocation = parseFloat(statsMateriels?.enLocation) || 0;
        const enStock = parseFloat(statsMateriels?.enStock) || 0;
        
        console.log('📊 Champs analysés:');
        console.log('  - totalDisponible:', totalDisponible);
        console.log('  - enLocation:', enLocation);
        console.log('  - enStock:', enStock);
        
        if (totalDisponible > 0) {
            tauxOccupationMateriel = ((enLocation / totalDisponible) * 100).toFixed(2);
            console.log('✅ Calcul réussi:', enLocation + ' / ' + totalDisponible + ' = ' + tauxOccupationMateriel + '%');
        } else {
            console.log('❌ totalDisponible = 0, calcul impossible');
            
            // Méthode alternative : vérifier les données individuelles
            const tousMateriels = await Materiel.findAll({
                attributes: ['codeMat', 'designationMat', 'qteTotDispo', 'qteEnLocation', 'qteActuelStock'],
                limit: 5
            });
            console.log('📋 Échantillon matériels:', JSON.stringify(tousMateriels, null, 2));
        }

        console.log('=== FIN CALCUL MATÉRIELS ===');

        res.status(200).send({
            totalClients,
            locationsMois,
            revenuTotal: revenuTotal || 0,
            tauxOccupationSalle: parseFloat(tauxOccupationSalle),
            tauxOccupationMateriel: parseFloat(tauxOccupationMateriel)
        });
        
    } catch (error) {
        console.error("❌ Erreur KPIs:", error);
        res.status(500).send({
            message: "Erreur serveur lors du calcul des KPIs.",
            detail: error.message 
        });
    }
};

// --- 1. Indicateurs Clés de Performance (KPIs) ---
/*exports.getKPIs = async (req, res) => {
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
*/

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

const { ReservationSalle} = require('../models');

