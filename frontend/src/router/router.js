// frontend/src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router';
import AuthService from '../services/AuthService'; 

import Login from '../components/Login.vue'; 
// Renommez ce fichier si votre gestion client est dans un autre fichier que HelloWorld.vue

import Register from '../views/register.vue';
//import Dashboard from '../views/Dashboard.vue';

import ClientManagement from '../views/clientManagement.vue';
import SalleManagement from '../views/salleManagement.vue';
//import Patrimoine from '../views/patrimoine.vue';
//import Finance from '../views/finance.vue';
import Location from '../views/location.vue';
import Rapport from '../views/rapport.vue';
import Materiel from '../views/materiel.vue';
//import { Salle } from '../../../backend/models';
import Salle from '../views/salle.vue';
import InventairePatrimoine from '../views/inventairePatrimoine.vue';
import Finance from '../views/finance.vue';
import UserManagement from '../views/userManagement.vue';
import DashboardAdmin from '../views/dashboardAdmin.vue';
import DashboardReception from '../views/dashboardReception.vue';
import DashboardFinance from '../views/dashboardFinance.vue';
import CompteClient from '../views/compteClient.vue';
import DashboardRedirector from '../views/DashboardRedirector.vue';
import ReservationForm from '../components/reservationForm.vue';
import Catalogue from '../components/catalogue.vue';
import DemandeAttente from '../views/demandeAttente.vue';
import Calendrier from '../views/calendrier.vue';
import Facturation from '../views/facturation.vue';
import Suivi from '../views/suivi.vue';
import Penalite from '../views/penalite.vue';
import Synthese from '../views/synthese.vue';


// ... (Garde de Navigation) ...
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login 
  },
   {
    path: '/register', // 🚨 Nouvelle route pour l'inscription
    name: 'Register',
    component: Register
  },
    {
    path: '/redirect', // Nouvelle route temporaire
    name: 'DashboardRedirector',
    component: DashboardRedirector,
    // PAS de meta: { requiresAuth: true } ici, car il doit être accessible temporairement
  },
   {
        path: '/reservationForm',
        name: 'ReservationForm',
        component: ReservationForm,
        meta: { requiresAuth: true, roles: ['client'] }
    },
     {
        path: '/catalogue',
        name: 'CatalogView',
        component: Catalogue,
        // Accessible à tous les rôles logués pour faciliter la navigation
        meta: { requiresAuth: true, roles: ['administrateur', 'réception', 'client'] }
    },
            // Vues spécifiques aux rôles
            {
                path: '/dashboardAdmin',
                name: 'AdminDashboard',
                component: DashboardAdmin,
                meta: { roles: ['admin'] }
            },
            {
                path: '/dashboardReception',
                name: 'ReceptionDashboard',
                component: DashboardReception,
                meta: { roles: ['admin', 'reception'] }
            },
            {
                path: '/dashboardFinance',
                name: 'FinanceDashboard',
                component: DashboardFinance,
                meta: { roles: ['admin', 'finance'] }
            },
            {
                path: '/compteClient',
                name: 'ClientDashboard',
                component: CompteClient,
                meta: { roles: ['admin', 'client'] }
            },
            // Autres routes d'application...
          
 
        

    {
    path: '/clientManagement',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true } // Exemple de protection de route
  },
   {
    path: '/salleManagement',
    name: 'SalleManagement',
    component: SalleManagement
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

    {
    path: '/demandeAttente',
    name: 'DemandesEnAttente',
    component: DemandeAttente
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

    {
    path: '/calendrier',
    name: 'CalendrierDisponibilites',
    component: Calendrier
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

   {
    path: '/facturation',
    name: 'FactureGene',
    component: Facturation
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

    {
    path: '/suivi',
    name: 'SuiviPaie',
    component: Suivi
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

   {
    path: '/penalite',
    name: 'PenaliteLiti',
    component: Penalite
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

   {
    path: '/synthese',
    name: 'RapportSynth',
    component: Synthese
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

    // 🚨 AJOUTEZ CETTE REDIRECTION 🚨

     {
    path: '/patrimoine',
    name: 'InventairePatrimoine',
    component: InventairePatrimoine, // 🚨 Nouveau composant Parent
    redirect: '/patrimoine/materiel', // Redirige par défaut vers le Matériel
     
    // 🚨 Routes Enfants
    children: [
      {
        path: 'materiel', // Chemin complet: /patrimoine/materiel
        name: 'PatrimoineMateriel',
        component: Materiel // Utilise le composant Materiel.vue existant
      },
      {
        path: 'salle', // Chemin complet: /patrimoine/salle
        name: 'PatrimoineSalle',
        component: Salle // Utilise le composant Salle.vue existant
      }
    ]
  },
  {
    path: '/patrimoine',
    redirect: '/patrimoine/materiel' // Redirige l'utilisateur vers la liste du matériel par défaut
  },


    {
    path: '/rapport',
    name: 'Rapport',
    component: Rapport,
    meta: { requiresAuth: true } // Exemple de protection de route
  },
    {
    path: '/location',
    name: 'Location',
    component: Location,
    meta: { requiresAuth: true } // Exemple de protection de route
  },
   {
    path: '/finance',
    name: 'Finance',
    component: Finance,
    meta: { requiresAuth: true } // Exemple de protection de route
  },
  
  // ... vos routes existantes
  {
    path: '/userManagement',
    name: 'UserManagement',
    component: UserManagement, // Assurez-vous du chemin
    meta: { requiresAuth: true, roles: ['admin'] } // SEUL l'admin y accède
  },
 /* {
     path: '/patrimoine',
      name: 'InventairePatrimoine',
    component: InventairePatrimoine, // 🚨 Nouveau composant Parent
    redirect: '/patrimoine/materiel', // Redirige par défaut vers le Matériel
     
    // 🚨 Routes Enfants
    children: [
      {
        path: 'materiel', // Chemin complet: /patrimoine/materiel
        name: 'PatrimoineMateriel',
        component: Materiel // Utilise le composant Materiel.vue existant
      },
    ]
  }*/

]
    

      
    

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiredRoles = to.meta.roles;
    const user = AuthService.getCurrentUser();

    // 1. Protection de l'Authentification
    if (requiresAuth && !user) {
        next({ name: 'Login' }); // Redirige vers login si non authentifié
    } 
    // 2. Protection des Rôles
    else if (requiresAuth && requiredRoles && !requiredRoles.includes(user.roleUti)) {
        // Redirige vers un message d'accès refusé ou la page par défaut
        alert("Accès non autorisé à cette page.");
        next(false); // Annule la navigation
    } 
    else {
        next(); // Autorise la navigation
    }
});


export default router;
