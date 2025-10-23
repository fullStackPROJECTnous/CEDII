// backend/routes/rapportRoutes.js (NETTOYÉ ET SÉCURISÉ)

const express = require('express');
const router = express.Router();
const rapportCtrl = require('../controllers/rapportController'); // Gardons-le pour les autres routes
// Si votre fichier db.js exporte l'instance de Sequelize :
const sequelize = require('../config/db'); // Renommez l'import en 'sequelize'
// Si votre fichier db.js exporte la fonction execute (ce qui n'est pas le cas ici) :
// const { execute } = require('../config/db'); 


// GET /api/rapports/kpis
router.get('/kpis', async (req, res) => {
    try {
        console.log('Requête KPIs reçue');
        
        // Clients actifs - Utilisation de sequelize.query(sql, options)
        // [results, metadata] = await sequelize.query(sql, { replacements: [], type: QueryTypes.SELECT })
        
        // Note: Nous utilisons { raw: true } et la structure des résultats pour simplifier l'accès
        
        // --- Clients actifs ---
        const [clients] = await sequelize.query('SELECT COUNT(*) as total FROM client WHERE statutCli = "actif"', { raw: true });
        
        // --- Locations ce mois ---
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        // Utilisez des remplacements sécurisés (?) avec Sequelize, et pas seulement des valeurs injectées
        const [locations] = await sequelize.query(
            'SELECT COUNT(*) as total FROM location WHERE MONTH(debLo) = ? AND YEAR(debLo) = ? AND etatLo = "Confirmée"',
            { replacements: [currentMonth, currentYear], raw: true }
        );
        
        // --- Taux d'occupation salles ---
        const [sallesOccup] = await sequelize.query(
            'SELECT COUNT(DISTINCT idSalle) as total FROM reservation WHERE typeRes = "Salle" AND etatRes = "Confirmée" AND debRes >= CURDATE()',
            { raw: true }
        );
        const [sallesTotal] = await sequelize.query('SELECT COUNT(*) as total FROM salle', { raw: true });
        
        const totalSalles = sallesTotal[0]?.total || 0; 
        const totalSallesOccup = sallesOccup[0]?.total || 0; 
        const tauxSalle = totalSalles > 0 ? Math.round((totalSallesOccup / totalSalles) * 100) : 0;
        
        // --- Taux d'occupation matériel ---
        const [matOccup] = await sequelize.query(
            'SELECT COUNT(DISTINCT codeMat) as total FROM reservation WHERE typeRes = "Materiel" AND etatRes = "Confirmée" AND debRes >= CURDATE() AND codeMat IS NOT NULL',
            { raw: true }
        );
        const [matTotal] = await sequelize.query('SELECT COUNT(*) as total FROM materiel WHERE etatMat IN ("Neuf", "Bon état")', { raw: true });
        
        const totalMat = matTotal[0]?.total || 0;
        const totalMatOccup = matOccup[0]?.total || 0;
        const tauxMateriel = totalMat > 0 ? Math.round((totalMatOccup / totalMat) / 100) : 0; // Correction de l'erreur mathématique
        
        // --- Revenu total ---
        const [revenuResult] = await sequelize.query(`
            SELECT COALESCE(SUM(montantPaie), 0) as total 
            FROM paiement 
            WHERE statutPaie = 'Effectué'
        `, { raw: true });
        
        const revenuTotal = parseFloat(revenuResult[0]?.total || 0); 

        const result = {
            totalClients: clients[0]?.total || 0,
            locationsMois: locations[0]?.total || 0,
            tauxOccupationSalle: tauxSalle,
            tauxOccupationMateriel: tauxMateriel,
            revenuTotal: revenuTotal
        };

        console.log('KPIs envoyés:', result);
        res.json(result);
        
    } catch (error) {
        console.error('Erreur KPIs:', error);
        res.status(500).json({ 
            error: 'Erreur serveur lors du calcul des KPIs',
            detail: error.message 
        });
    }
});

// Les autres routes qui utilisent le contrôleur sont conservées
router.get('/reservations-report', rapportCtrl.getReservationsReport);
router.get('/top-materiel', rapportCtrl.getTopRentedMateriel);

router.get('/revenu-par-client', rapportCtrl.getRevenueByClientType); // 👈 Nouvelle route
// ...

module.exports = router;