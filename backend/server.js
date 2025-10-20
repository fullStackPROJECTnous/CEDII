const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Routes exemple
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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

const locationRoutes = require('./routes/locationRoutes');
app.use('/api/locations', locationRoutes);
app.use('/api/reception', locationRoutes);

const rapportRoutes = require('./routes/rapportRoutes');
app.use('/api/rapports', rapportRoutes);


const routesUsers = require('./routes/routeUsers');
// ... autres imports de routes

app.use('/api', routesUsers); 
// ... autres app.use

const financeRoute = require('./routes/financeRoute');

// Définition de la route de base pour la finance
app.use('/api/finance', financeRoute);






