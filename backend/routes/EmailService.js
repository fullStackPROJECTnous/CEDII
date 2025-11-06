const nodemailer = require('nodemailer');

// Exemple de configuration SMTP pour Gmail (nécessite un mot de passe d'application)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'miharinandrasana@gmail.com', // ⬅️ Votre adresse d'envoi
        pass: 'wrbx faim eamk twdt' // ⬅️ Mot de passe d'application généré
    }
    // Si vous utilisez un autre service, remplacez 'service: "gmail"' par host, port, etc.
});

module.exports = {
    transporter
    // Vous pouvez ajouter ici une fonction 'sendReminderEmail'
};