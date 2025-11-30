// backend/routes/debugRoutes.js - CRÉEZ CE FICHIER
const express = require('express');
const router = express.Router();
const { Reservation, Client } = require('../models');
const { Op } = require('sequelize');

// 🎯 ROUTE DE DÉBOGAGE POUR LES CONFLITS
router.get('/conflicts', async (req, res) => {
    try {
        const { idCatalogue, typeRes, debRes, finRes } = req.query;

        console.log('🔍 Paramètres de débogage reçus:', { idCatalogue, typeRes, debRes, finRes });

        if (!idCatalogue || !typeRes) {
            return res.status(400).json({
                success: false,
                message: "Paramètres manquants: idCatalogue et typeRes sont requis"
            });
        }

        // 1. Toutes les réservations pour cette ressource
        const allReservations = await Reservation.findAll({
            where: {
                typeRes: typeRes,
                idCatalogue: idCatalogue
            },
            attributes: ['idRes', 'etatRes', 'debRes', 'finRes', 'idCatalogue', 'typeRes'],
            order: [['debRes', 'ASC']]
        });

        // 2. Vérification spécifique de conflit
        const potentialConflict = await Reservation.findOne({
            where: {
                etatRes: { [Op.in]: ['En attente', 'Confirmée', 'En cours'] },
                typeRes: typeRes,
                idCatalogue: idCatalogue,
                [Op.and]: [
                    { debRes: { [Op.lt]: new Date(finRes || '2024-12-31T23:59:59.000Z') } },
                    { finRes: { [Op.gt]: new Date(debRes || '2024-01-01T00:00:00.000Z') } }
                ]
            },
            attributes: ['idRes', 'etatRes', 'debRes', 'finRes', 'idCatalogue', 'typeRes']
        });

        // 3. Toutes les réservations (pour voir l'état global)
        const toutesReservations = await Reservation.findAll({
            attributes: ['idRes', 'etatRes', 'debRes', 'finRes', 'idCatalogue', 'typeRes'],
            order: [['debRes', 'ASC']],
            limit: 50
        });

        res.json({
            success: true,
            testData: {
                idCatalogue,
                typeRes, 
                debRes: debRes || 'Non spécifié',
                finRes: finRes || 'Non spécifié'
            },
            reservationsExistantes: allReservations,
            conflitDetecte: potentialConflict,
            toutesReservations: toutesReservations, // Pour debug global
            analyse: {
                totalReservations: allReservations.length,
                aConflit: !!potentialConflict,
                message: potentialConflict 
                    ? `🚨 Conflit avec la réservation #${potentialConflict.idRes} (${potentialConflict.etatRes}) du ${potentialConflict.debRes} au ${potentialConflict.finRes}`
                    : '✅ Aucun conflit détecté pour ces paramètres'
            }
        });

    } catch (error) {
        console.error('❌ Erreur débogage:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

// 🎯 ROUTE POUR VOIR TOUTES LES RÉSERVATIONS
router.get('/all-reservations', async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [{
                model: Client,
                as: 'client',
                attributes: ['nomCli', 'prenomCli']
            }],
            attributes: ['idRes', 'etatRes', 'debRes', 'finRes', 'idCatalogue', 'typeRes'],
            order: [['idRes', 'DESC']],
            limit: 100
        });

        res.json({
            success: true,
            count: reservations.length,
            reservations: reservations
        });

    } catch (error) {
        console.error('❌ Erreur récupération réservations:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;