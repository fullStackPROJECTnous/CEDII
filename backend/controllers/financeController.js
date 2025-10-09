const db = require('../models');
const { Op } = require('sequelize');
const Paiement = db.Paiement; // Table existante
const Location = db.Location;
const Client = db.Client;
const Reservation = db.Reservation; // Nécessaire pour lier Location -> Client

// Utilitaire : Calcul des jours de retard (en utilisant la date de fin de location comme échéance)
const calculerJoursRetard = (dateEcheance) => {
    const aujourdhui = new Date();
    const echeance = new Date(dateEcheance);
    aujourdhui.setHours(0, 0, 0, 0);
    echeance.setHours(0, 0, 0, 0);

    if (aujourdhui <= echeance) return 0;

    const diffTime = Math.abs(aujourdhui.getTime() - echeance.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Utilitaire : Détermination du statut financier
const deriveStatutFinancier = (montantTotal, montantPaye) => {
    const montantDu = montantTotal - montantPaye;
    if (montantDu <= 0) return 'Payée';
    if (montantPaye > 0) return 'Partiellement Payée';
    return 'Émise (Non Payée)';
};


// 1. Génération Automatique des Factures (Virtuelle)
exports.getFactureDetails = async (req, res) => {
    const idLo = req.params.idLo;
    try {
        const location = await Location.findByPk(idLo, {
             include: [{
                model: Reservation, 
                as: 'Reservation',
                include: [{ model: Client, as: 'Client', attributes: ['nomCli', 'prenomCli', 'emailCli'] }]
            }]
        });
        if (!location) {
            return res.status(404).send({ message: "Location non trouvée." });
        }
        
        // Calcul du montant déjà payé par la somme des paiements "Effectué"
        const paiementsEffectues = await Paiement.sum('montantPaie', {
            where: { idLo: idLo, statutPaie: 'Effectué' }
        });
        const montantPaye = paiementsEffectues || 0;
        
        const montantTotal = parseFloat(location.tarifTot);
        const montantDuInitial = montantTotal - montantPaye;

        // "Facture" Virtuelle retournée
        const factureVirtuelle = {
            idLo: location.idLo,
            numeroFacture: `FAC-VIR-${location.idLo}`, // Génération d'un numéro de référence
            montantTotal: montantTotal,
            montantPaye: montantPaye,
            montantDu: montantDuInitial,
            statutFinancier: deriveStatutFinancier(montantTotal, montantPaye),
            dateEcheance: location.finLo,
            Client: location.Reservation.Client
        };

        res.status(200).send(factureVirtuelle);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des détails financiers.", error: error.message });
    }
};

// 2. Enregistrement des Paiements & Envoi d'Email
exports.recordPaiement = async (req, res) => {
    const idLo = req.params.idLo;
    const { montantPaye, modePaie } = req.body;
    
    const location = await Location.findByPk(idLo, {
        include: [{
            model: Reservation, 
            as: 'Reservation',
            include: [{ model: Client, as: 'Client', attributes: ['nomCli', 'emailCli'] }]
        }]
    });
    if (!location) { return res.status(404).send({ message: "Location non trouvée." }); }

    try {
        // Enregistrement du paiement (mise à jour de la table existante 'paiement')
        await Paiement.create({
            idLo: idLo,
            montantPaie: montantPaye,
            modePaie: modePaie,
            statutPaie: 'Effectué', 
        });

        // Recalcul du statut
        const paiementsEffectues = await Paiement.sum('montantPaie', { where: { idLo: idLo, statutPaie: 'Effectué' } });
        const montantTotal = parseFloat(location.tarifTot);
        const nouveauStatutFinancier = deriveStatutFinancier(montantTotal, paiementsEffectues);
        
        // 🚨 ENVOI D'EMAIL : Si le statut est 'Payée', c'est l'endroit pour déclencher l'email
        if (nouveauStatutFinancier === 'Payée') {
            // Logique pour l'envoi d'email de confirmation au client
            // Ex: envoyerEmailConfirmation(location.Reservation.Client);
        }

        res.status(200).send({ 
            statutFinancier: nouveauStatutFinancier, 
            message: "Paiement enregistré et statut mis à jour. Email de confirmation déclenché si paiement complet." 
        });

    } catch (error) {
        res.status(500).send({ message: "Erreur lors de l'enregistrement du paiement.", error: error.message });
    }
};


// 3. Suivi des Paiements, Notification des Pénalités et Calcul de Retard
exports.getAllLocationsFinancieresSuivi = async (req, res) => {
    try {
        // Récupère toutes les locations qui ne sont pas Terminées ou Annulées
        const locations = await Location.findAll({
            where: {
                etatLo: { [Op.in]: ['En attente', 'Confirmée'] }
            },
            include: [{
                model: Reservation, 
                as: 'Reservation',
                include: [{ model: Client, as: 'Client', attributes: ['nomCli', 'prenomCli', 'emailCli'] }]
            }]
        });

        const suiviFinancier = [];
        
        for (const location of locations) {
            // Calcul du montant payé et dû
            const paiementsEffectues = await Paiement.sum('montantPaie', { where: { idLo: location.idLo, statutPaie: 'Effectué' } });
            const montantPaye = paiementsEffectues || 0;
            const montantTotal = parseFloat(location.tarifTot);
            const montantDuInitial = montantTotal - montantPaye;
            
            // Ne suivre que ce qui reste à payer
            if (montantDuInitial <= 0) continue; 

            // Calcul des jours de retard et pénalités
            const joursRetard = calculerJoursRetard(location.finLo); // finLo = échéance
            const tauxPenalite = 0.01; // Pénalité de 1% du montant dû par jour de retard
            const penalite = joursRetard > 0 ? (montantDuInitial * tauxPenalite * joursRetard) : 0;
            const montantTotalDuAvecPenalite = montantDuInitial + penalite;
            
            suiviFinancier.push({
                idLo: location.idLo,
                numeroFacture: `FAC-VIR-${location.idLo}`,
                dateEcheance: location.finLo,
                montantTotal: montantTotal,
                montantDuInitial: parseFloat(montantDuInitial.toFixed(2)),
                montantPenalite: parseFloat(penalite.toFixed(2)),
                montantTotalDu: parseFloat(montantTotalDuAvecPenalite.toFixed(2)),
                statutFinancier: deriveStatutFinancier(montantTotal, montantPaye),
                joursRetard: joursRetard,
                Client: location.Reservation.Client
            });
            
            // 🚨 NOTIFICATION PÉNALITÉS : Si joursRetard > 0, vous pouvez déclencher un email de notification ici.
        }

        res.status(200).send(suiviFinancier);
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération du suivi financier.", error: error.message });
    }
};