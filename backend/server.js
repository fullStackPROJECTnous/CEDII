const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();
const ReminderService = require('./routes/ReminderService');
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
  ReminderService.startReminderScheduler();
  
});


// --- IMPORTATIONS DES ROUTES ---

const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); // Le routeur qui contient getAllClientUsers
const salleRoutes = require('./routes/salleRoutes'); 
const patrimoineRoutes = require('./routes/patrimoineRoutes'); 
const routesUsers = require('./routes/routeUsers');
const financeRoute = require('./routes/financeRoute');
const rapportRoutes = require('./routes/rapportRoutes'); 
const locationRoutes = require('./routes/locationRoutes');
const materielBureauRoutes = require('./routes/materielBureauRoutes');

// --- MONTAGE DES ROUTES ---

app.use('/api/clients', clientRoutes); 
app.use('/api/auth', authRoutes); 

// 🚨 CORRECTION CRITIQUE : Monte le routeur utilisateur sous /api/users
// Ceci crée l'URL complète : /api/users/clients/list
app.use('/api/users', userRoutes); 
app.use('/api', routesUsers); 

// 💡 L'ancienne ligne (si elle causait le conflit) est gérée ci-dessus ou peut être modifiée/supprimée
// app.use('/api/auth', userRoutes); // <-- Si cette ligne existe, elle est maintenant un doublon/conflit pour /api/users

app.use('/api/salle', salleRoutes); 
app.use('/api/patrimoine', patrimoineRoutes); 

app.use('/api', routesUsers); 

app.use('/api/finance', financeRoute);

app.use('/api/rapports', rapportRoutes);
app.use('/api/locations', locationRoutes);

app.use('/api/materiel-bureau',materielBureauRoutes);


