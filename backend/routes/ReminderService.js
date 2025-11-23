// Assurez-vous d'importer les modèles nécessaires
const cron = require('node-cron');
const { Location, Reservation, Client } = require('../models');
const { Op } = require('sequelize');

// 🔥 CORRECTION : Essayer différents chemins possibles
let createTransporter;

try {
    // Essayer le chemin services/emailService
    const emailService = require('../services/emailService');
    createTransporter = emailService.createTransporter;
} catch (error) {
    try {
        // Essayer le chemin relatif
        const emailService = require('./emailService');
        createTransporter = emailService.createTransporter;
    } catch (error2) {
        console.log('❌ Service email non trouvé, création locale...');
        // 🔥 SOLUTION DE SECOURS : Créer le transporter localement
        const nodemailer = require('nodemailer');
        createTransporter = function() {
            return nodemailer.createTransporter({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'miharinandrasana@gmail.com',
                    pass: process.env.EMAIL_PASS || 'zpaa nrcm eqli jpqf'
                }
            });
        };
    }
}

async function checkAndSendReminders() {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 2); 
    
    // 🔥 CORRECTION : Créer le transporter ici
    const transporter = createTransporter();
    
    // 1. Trouver les locations "En cours" dont la date de fin est dans les 48h
    const locationsToRemind = await Location.findAll({
        where: {
            etatLo: 'En cours',
            finLo: {
                [Op.lte]: reminderDate 
            }
        },
        attributes: [
            'idLo', 
            'idRes', 
            'debLo', 
            'finLo', 
            'etatLo'
        ],
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

    console.log(`📍 ${locationsToRemind.length} location(s) à rappeler`);

    // 2. Boucler et envoyer l'e-mail
    for (const location of locationsToRemind) {
        const clientEmail = location.reservation.client.emailCli;
        const returnDate = location.finLo.toLocaleDateString('fr-FR');
        const clientName = location.reservation.client.prenomCli;

        if (clientEmail) {
            try {
                await transporter.sendMail({
                    from: {
                        name: 'CEDII Locations - Rappel',
                        address: process.env.EMAIL_USER || 'miharinandrasana@gmail.com'
                    },
                    to: clientEmail,
                    subject: `🔔 RAPPEL: Retour de votre matériel - Location #${location.idLo}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #5811EE, #04058F); color: white; padding: 20px; text-align: center;">
                                <h1>🏢 CEDII LOCATIONS</h1>
                                <h2>RAPPEL DE RETOUR</h2>
                            </div>
                            <div style="padding: 20px;">
                                <p>Bonjour <strong>${clientName}</strong>,</p>
                                <p>Nous vous rappelons que le retour de votre location <strong>#${location.idLo}</strong> est prévu le <strong>${returnDate}</strong>.</p>
                                
                                <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0;">
                                    <h3 style="color: #856404; margin: 0;">📍 Détails de la location</h3>
                                    <p><strong>Référence:</strong> #${location.idLo}</p>
                                    <p><strong>Date de fin:</strong> ${returnDate}</p>
                                    <p><strong>Type:</strong> ${location.typeLo || 'Location'}</p>
                                </div>
                                
                                <p>Merci de vous présenter à l'heure convenue à la réception avec le matériel en bon état.</p>
                                
                                <p>Cordialement,<br>
                                <strong>L'équipe CEDII Locations</strong></p>
                            </div>
                            <div style="background: #343a40; color: white; padding: 15px; text-align: center;">
                                <p>🏢 <strong>CEDII Locations</strong></p>
                                <p>📧 contact@cedii.com | 📞 +261 XX XX XXX XX</p>
                            </div>
                        </div>
                    `
                });
                console.log(`✅ Rappel envoyé avec succès à ${clientEmail}`);
            } catch (error) {
                console.error(`❌ Échec de l'envoi du rappel à ${clientEmail}:`, error.message);
            }
        } else {
            console.log(`⚠️ Aucun email trouvé pour la location #${location.idLo}`);
        }
    }
    
    console.log(`📧 Service de rappel terminé. ${locationsToRemind.length} location(s) traitées.`);
}

// 3. Planifier l'exécution quotidienne
exports.startReminderScheduler = () => {
    // Exécute la fonction checkAndSendReminders tous les jours à 8h00 du matin
    cron.schedule('0 8 * * *', () => {
        console.log('🕒 Exécution du service de rappels quotidiens...');
        checkAndSendReminders();
    }, {
        timezone: "Africa/Nairobi"
    });
    
    console.log('✅ Planificateur de rappels démarré (tous les jours à 8h00)');
};

// Export pour les tests
exports.checkAndSendReminders = checkAndSendReminders;