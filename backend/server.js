const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
require('dotenv').config();
const ReminderService = require('./routes/ReminderService');
const app = express();

// ⭐ Import des modèles
const { Salle, Materiel } = require('./models');

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

// 🆕 IMPORT DES ROUTES DE DÉBOGAGE (AJOUTEZ CETTE LIGNE)
const debugRoutes = require('./routes/debugRoutes');

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
app.use('/api/reservations', reservationRoutes);

app.use('/api/materiel-bureau', materielBureauRoutes);

// 🆕 AJOUT DES ROUTES DE DÉBOGAGE (AJOUTEZ CETTE LIGNE)
app.use('/api/debug', debugRoutes);

// 🐛 Routes de débogage existantes
app.get('/api/salles/debug/salles', async (req, res) => {
  try {
    const salles = await Salle.findAll();
    res.json({
      success: true,
      count: salles.length,
      data: salles
    });
  } catch (error) {
    console.error('❌ Erreur route debug salles:', error);
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
    console.error('❌ Erreur route debug materiel:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🎯 ROUTE DE TEST POUR LES RÉSERVATIONS
app.get('/api/test/reservations', async (req, res) => {
  try {
    console.log('🧪 Route test réservations appelée');
    res.json({
      success: true,
      message: 'Route réservations fonctionnelle',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur route test réservations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🚀 DÉMARRAGE DU SERVEUR
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 URL: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🎯 Routes de débogage disponibles:');
    console.log('   - GET  /api/debug/conflicts');
    console.log('   - GET  /api/debug/all-reservations');
  });
  ReminderService.startReminderScheduler();
}).catch(error => {
  console.error('❌ Database connection failed:', error);
});

// 🎯 GESTION DES ERREURS GLOBALES
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});