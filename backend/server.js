const express = require('express');
const cors = require('cors');
const path = require('path'); // 💡 Ajout de 'path' pour les chemins absolus
const sequelize = require('./config/db');
require('dotenv').config();
const ReminderService = require('./routes/ReminderService');
const app = express();

// --- 1. CONFIGURATION CORS (Pour résoudre le 403 Forbidden) ---
const corsOptions = {
    // 🚨 Remplacez par l'URL exacte de votre front-end (souvent 5173, 3000, ou autre)
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // IMPORTANT: Autorise l'envoi du token Bearer
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Utilisez la configuration CORS
//app.use(cors());//
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Cela rend le contenu de 'backend/public' accessible via la racine de l'URL (ex: /uploads/projecteur.jpg)
app.use(express.static(path.join(__dirname, 'public')));

// Routes exemple
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ReminderService.startReminderScheduler();
  
});

// server.js (main file)

const clientRoutes = require('./routes/clientRoutes');
// ... other setup ...
app.use('/api/clients', clientRoutes); // All routes start with /api/clients


// 🚨 Nouvelle Route pour l'Authentification
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 

const userRoutes = require('./routes/userRoutes');
// 💡 Utilisez /api/auth comme base pour la connexion
app.use('/api/auth', userRoutes);


const salleRoutes = require('./routes/salleRoutes');
app.use('/api/salle', salleRoutes); 

const patrimoineRoutes = require('./routes/patrimoineRoutes');
app.use('/api/patrimoine', patrimoineRoutes); 



//app.use('/api/reception', locationRoutes);

const routesUsers = require('./routes/routeUsers');
// ... autres imports de routes

app.use('/api', routesUsers); 
// ... autres app.use

const financeRoute = require('./routes/financeRoute');

// Définition de la route de base pour la finance
app.use('/api/finance', financeRoute);

const rapportRoutes = require('./routes/rapportRoutes'); // 👈 CORRECTION
const locationRoutes = require('./routes/locationRoutes');

// Utilisation des routes - CORRECTION : pas de préfixe en double
app.use('/api/rapports', rapportRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/locations/reservations', require('./routes/reservationRoute'));



const materielBureauRoutes = require('./routes/materielBureauRoutes');
app.use('/api/materiel-bureau',materielBureauRoutes  ); 

// Ajouter cette ligne dans votre app.js
const reservationRoutes = require('./routes/reservationRoute');
app.use('/reservations', reservationRoutes);



