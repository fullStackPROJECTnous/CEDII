// Assurez-vous d'importer les modèles nécessaires (Location, Reservation, Client, et Sequelize Op)
const cron = require('node-cron');
const { Location, Reservation, Client } = require('../models'); // Ex: db.models
const { Op } = require('sequelize');
const { transporter } = require('./EmailService'); // Importez votre transporteur

async function checkAndSendReminders() {
    const reminderDate = new Date();
    // Rappeler pour les retours dans les 2 prochains jours
    reminderDate.setDate(reminderDate.getDate() + 2); 
    
    // 1. Trouver les locations "En cours" dont la date de fin est dans les 48h
    const locationsToRemind = await Location.findAll({
        where: {
            etatLo: 'En cours',
            finLo: {
                [Op.lte]: reminderDate 
            }
        },
        include: [{
            model: Reservation,
            as: 'reservation',
            include: [{
                model: Client,
                as: 'client',
                attributes: ['emailCli', 'nomCli', 'prenomCli']
            }]
        }],
    });

    // 2. Boucler et envoyer l'e-mail
    for (const location of locationsToRemind) {
        const clientEmail = location.reservation.client.emailCli;
        const returnDate = location.finLo.toLocaleDateString('fr-FR');
        const clientName = location.reservation.client.prenomCli;

        if (clientEmail) {
            try {
                await transporter.sendMail({
                    to: clientEmail,
                    subject: `RAPPEL: Retour de votre matériel - Location #${location.idLo}`,
                    html: `
                        <p>Bonjour ${clientName},</p>
                        <p>Nous vous rappelons que le retour de votre location #${location.idLo} est prévu le **${returnDate}**.</p>
                        <p>Merci de vous présenter à l'heure convenue à la réception.</p>
                    `
                });
                console.log(`Rappel envoyé avec succès à ${clientEmail}`);
            } catch (error) {
                console.error(`Échec de l'envoi du rappel à ${clientEmail}:`, error);
            }
        }
    }
}
// 3. Planifier l'exécution quotidienne
exports.startReminderScheduler = () => {
    // Exécute la fonction checkAndSendReminders tous les jours à 8h00 du matin
    cron.schedule('0 8 * * *', () => {
        console.log('Exécution du service de rappels quotidiens...');
        checkAndSendReminders();
    }, {
        timezone: "Africa/Nairobi" // ⬅️ Très important pour la bonne heure
    });
    // Optionnel: Exécuter une fois au démarrage pour tester
    checkAndSendReminders(); 
};