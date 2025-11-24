const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
require('dotenv').config();
const ReminderService = require('./routes/ReminderService');
const app = express();

// ⭐ Import des modèles
const { Salle } = require('./models');
const { Materiel } = require('./models');

// --- 1. CONFIGURATION CORS ---
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route de base
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// 📦 IMPORT DES ROUTES
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const salleRoutes = require('./routes/salleRoutes');
const patrimoineRoutes = require('./routes/patrimoineRoutes');
const routesUsers = require('./routes/routeUsers');
const financeRoute = require('./routes/financeRoute');
const rapportRoutes = require('./routes/rapportRoutes');
const locationRoutes = require('./routes/locationRoutes');
const materielBureauRoutes = require('./routes/materielBureauRoutes');

// 🎯 CORRECTION : UNE SEULE DÉCLARATION POUR LES RÉSERVATIONS
const reservationRoutes = require('./routes/reservationRoute');

// 🚀 CONFIGURATION DES ROUTES
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/salle', salleRoutes);
app.use('/api/patrimoine', patrimoineRoutes);
app.use('/api', routesUsers);
app.use('/api/finance', financeRoute);
app.use('/api/rapports', rapportRoutes);
app.use('/api/locations', locationRoutes);

// ✅ CORRIGÉ : Une seule déclaration pour les réservations
app.use('/api/reservations', reservationRoutes); // 👈 CHEMIN UNIFIÉ

app.use('/api/materiel-bureau', materielBureauRoutes);

// 🐛 Routes de débogage
app.get('/api/salles/debug/salles', async (req, res) => {
  try {
    const salles = await Salle.findAll();
    res.json({
      success: true,
      count: salles.length,
      data: salles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/patrimoine/debug/materiel', async (req, res) => {
  try {
    const materiel = await Materiel.findAll();
    res.json({
      success: true,
      count: materiel.length,
      data: materiel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🚀 DÉMARRAGE DU SERVEUR
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  ReminderService.startReminderScheduler();
});