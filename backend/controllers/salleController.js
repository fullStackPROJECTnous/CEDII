

const db = require('../models');
const Salle = db.Salle;
const Reservation = db.Reservation;
const { Op } = require('sequelize');

// Récupérer toutes les salles avec filtres
exports.getAllSalles = async (req, res) => {
    try {
        const { disponibilite, search } = req.query;
        
        let whereClause = {};
        
        // Filtre par disponibilité
        if (disponibilite && disponibilite !== 'tous') {
            whereClause.disponibiliteSalle = disponibilite;
        }
        
        // Recherche par nom ou numéro
        if (search) {
            whereClause[Op.or] = [
                { nomSalle: { [Op.like]: `%${search}%` } },
                { numeroSalle: { [Op.like]: `%${search}%` } }
            ];
        }

        const salles = await Salle.findAll({
            where: whereClause,
            order: [['nomSalle', 'ASC']]
        });
        
        console.log(`✅ ${salles.length} salles trouvées`);
        res.status(200).json(salles);
        
    } catch (error) {
        console.error("❌ Erreur de chargement des salles:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des salles.", 
            error: error.message 
        });
    }
};

// Récupérer une salle par ID
exports.getSalle = async (req, res) => {
    try {
        const idSalle = req.params.idSalle;
        const salle = await Salle.findByPk(idSalle);
        
        if (!salle) {
            return res.status(404).json({ message: "Salle non trouvée." });
        }

        res.status(200).json(salle);
        
    } catch (error) {
        console.error("❌ Erreur de récupération de la salle:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération de la salle.", 
            error: error.message 
        });
    }
};

// Créer une nouvelle salle
exports.createSalle = async (req, res) => {
    try {
        console.log("Données reçues pour création salle:", req.body);
        
        // Vérifier si le numéro de salle existe déjà
        const salleExistante = await Salle.findOne({ 
            where: { numeroSalle: req.body.numeroSalle } 
        });
        
        if (salleExistante) {
            return res.status(400).json({ 
                message: "Une salle avec ce numéro existe déjà." 
            });
        }

        const salle = await Salle.create(req.body);
        console.log("✅ Salle créée:", salle.idSalle);
        res.status(201).json(salle);
        
    } catch (error) {
        console.error("❌ Erreur de création de la salle:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la création de la salle.", 
            error: error.message 
        });
    }
};

// Mettre à jour une salle
exports.updateSalle = async (req, res) => {
    try {
        const idSalle = req.params.idSalle;
        console.log(`Mise à jour de la salle ${idSalle}:`, req.body);
        
        const salle = await Salle.findByPk(idSalle);
        
        if (!salle) {
            return res.status(404).json({ message: "Salle non trouvée." });
        }

        // Vérifier si le numéro est déjà utilisé par une autre salle
        if (req.body.numeroSalle && req.body.numeroSalle !== salle.numeroSalle) {
            const salleAvecMemeNumero = await Salle.findOne({ 
                where: { 
                    numeroSalle: req.body.numeroSalle,
                    idSalle: { [Op.ne]: idSalle }
                } 
            });
            
            if (salleAvecMemeNumero) {
                return res.status(400).json({ 
                    message: "Une autre salle avec ce numéro existe déjà." 
                });
            }
        }

        await salle.update(req.body);
        console.log("✅ Salle mise à jour:", idSalle);
        res.status(200).json(salle);
        
    } catch (error) {
        console.error("❌ Erreur de mise à jour de la salle:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la mise à jour de la salle.", 
            error: error.message 
        });
    }
};

// Supprimer une salle
exports.deleteSalle = async (req, res) => {
    try {
        const idSalle = req.params.idSalle;
        console.log(`Suppression de la salle ${idSalle}`);
        
        const salle = await Salle.findByPk(idSalle);
        
        if (!salle) {
            return res.status(404).json({ message: "Salle non trouvée." });
        }

        // Vérifier si la salle a des réservations futures
        const reservationsFutures = await Reservation.count({
            where: {
                idSalle: idSalle,
                debRes: { [Op.gte]: new Date() }
            }
        });

        if (reservationsFutures > 0) {
            return res.status(400).json({ 
                message: "Impossible de supprimer cette salle car elle a des réservations futures." 
            });
        }

        await salle.destroy();
        console.log("✅ Salle supprimée:", idSalle);
        res.status(200).json({ message: "Salle supprimée avec succès." });
        
    } catch (error) {
        console.error("❌ Erreur de suppression de la salle:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la suppression de la salle.", 
            error: error.message 
        });
    }
};

// Récupérer les réservations d'une salle
exports.getReservationsSalle = async (req, res) => {
    try {
        const idSalle = req.params.idSalle;
        
        const reservations = await Reservation.findAll({
            where: { idSalle },
            include: [
                {
                    model: db.client,
                    attributes: ['idCli', 'nomCli', 'prenomCli', 'emailCli']
                }
            ],
            order: [['debRes', 'ASC']]
        });

        res.status(200).json(reservations);
        
    } catch (error) {
        console.error("❌ Erreur de récupération des réservations:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération des réservations.", 
            error: error.message 
        });
    }
};

// Vérifier la disponibilité d'une salle
exports.checkDisponibilite = async (req, res) => {
    try {
        const idSalle = req.params.idSalle;
        const { dateDebut, dateFin } = req.body;
        
        console.log(`Vérification disponibilité salle ${idSalle}: ${dateDebut} -> ${dateFin}`);

        const conflits = await Reservation.findAll({
            where: {
                idSalle: idSalle,
                etatRes: { [Op.notIn]: ['Annulée'] },
                [Op.or]: [
                    {
                        debRes: { [Op.between]: [dateDebut, dateFin] }
                    },
                    {
                        finRes: { [Op.between]: [dateDebut, dateFin] }
                    },
                    {
                        [Op.and]: [
                            { debRes: { [Op.lte]: dateDebut } },
                            { finRes: { [Op.gte]: dateFin } }
                        ]
                    }
                ]
            }
        });

        const disponible = conflits.length === 0;
        
        res.status(200).json({
            disponible,
            conflits: conflits.map(c => ({
                idRes: c.idRes,
                debRes: c.debRes,
                finRes: c.finRes,
                client: c.Client ? `${c.Client.nomCli} ${c.Client.prenomCli}` : 'N/A'
            }))
        });
        
    } catch (error) {
        console.error("❌ Erreur de vérification de disponibilité:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la vérification de disponibilité.", 
            error: error.message 
        });
    }
};

// Récupérer le calendrier d'une salle
exports.getCalendrierSalle = async (req, res) => {
    try {
        const idSalle = req.params.idSalle;
        const mois = parseInt(req.query.mois);
        const annee = parseInt(req.query.annee);
        
        const debutMois = new Date(annee, mois - 1, 1);
        const finMois = new Date(annee, mois, 0, 23, 59, 59);

        const reservations = await Reservation.findAll({
            where: {
                idSalle: idSalle,
                etatRes: { [Op.notIn]: ['Annulée'] },
                [Op.or]: [
                    {
                        debRes: { [Op.between]: [debutMois, finMois] }
                    },
                    {
                        finRes: { [Op.between]: [debutMois, finMois] }
                    },
                    {
                        [Op.and]: [
                            { debRes: { [Op.lte]: debutMois } },
                            { finRes: { [Op.gte]: finMois } }
                        ]
                    }
                ]
            },
            include: [
                {
                    model: db.client,
                    attributes: ['nomCli', 'prenomCli']
                }
            ],
            order: [['debRes', 'ASC']]
        });

        res.status(200).json(reservations);
        
    } catch (error) {
        console.error("❌ Erreur de récupération du calendrier:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de la récupération du calendrier.", 
            error: error.message 
        });
    }
};