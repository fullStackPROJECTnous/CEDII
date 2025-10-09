// frontend/src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue'; 
// Renommez ce fichier si votre gestion client est dans un autre fichier que HelloWorld.vue

import Register from '../views/register.vue';
import Dashboard from '../views/Dashboard.vue';

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



// frontend/src/router/index.js

/*import { createRouter, createWebHistory } from 'vue-router';
// ... autres imports ...

const routes = [
  // Route de base (Login / Logout)
  { path: '/', name: 'Login', component: () => import('../components/Login.vue') }, 
  { path: '/deconnexion', name: 'Logout', component: () => import('../views/Dashboard.vue') }, 

  // 🚨 ROUTE PARENTE : Le layout complet (Sidebar + Header)
  { 
    path: '/home', 
    name: 'Dashboard', 
    component: () => import('../views/Dashboard.vue'), // Le composant qui contient la sidebar
    meta: { requiresAuth: true },
  
    // 🚨 ROUTES IMBRIQUÉES (CHILDREN)
    children: [
      {
        // Chemin complet sera : /home
        path: '', 
        name: 'Dashboard', 
        component: () => import('../views/Dashboard.vue') // Créez ce composant si votre page Home doit montrer un dashboard différent de Home.vue
        // Alternative : Si le contenu du Dashboard est DÉJÀ dans Home.vue, vous pouvez OMETTRE cette route enfant.
      },
      {
        // Chemin complet sera : /home/clients (Le lien sera toujours /clientManagement)
        path: 'clientManagement', 
        name: 'ClientManagement', 
        component: () => import('../views/clientManagement.vue')
      },
      {
        // Chemin complet sera : /home/patrimoine
        path: 'patrimoine', 
        name: 'Patrimoine', 
        component: () => import('../views/patrimoine.vue')
      },
      {
        // Chemin complet sera : /home/locations
        path: 'locations', 
        name: 'Locations', 
        component: () => import('../views/locations.vue')
      }
    

     
    ]
];*/
 
  
  // Si vous aviez d'anciennes routes non imbriquées, supprimez-les ici.


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
    path: '/home',
    name: 'Dashboard',
    component: Dashboard 
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },
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

 /*  {
    path: '/patrimoine/materiel',
    name: 'PatrimoineMateriel',
    component: Materiel
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },
    {
    path: '/patrimoine/salle',
    name: 'PatrimoineSalle',
    component: Salle
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },*/
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Facultatif: Rediriger vers la page de login si non authentifié
// router.beforeEach((to, from, next) => {
//     // Implémentez ici la vérification du token de session/utilisateur
//     if (to.meta.requiresAuth && !userIsLoggedIn) {
//         next('/'); 
//     } else {
//         next();
//     }
// });


export default router;

// frontend/src/router/router.js (CORRIGÉ)

/*import { createRouter, createWebHistory } from 'vue-router'; 
//                     ^ On utilise le mode History pour des URLs propres (recommandé)

const routes = [
  // 1. Route de connexion (Route publique)
  { 
    path: '/', 
    name: 'Login', 
    component: () => import('../components/Login.vue') // Assurez-vous que Login.vue est bien dans 'components'
  }, 
  
  // 2. Route de déconnexion (Redirection)
  // NOTE: La déconnexion est une fonction JS, cette route sert surtout à vider l'historique
  { 
    path: '/deconnexion', 
    name: 'Logout', 
    // On peut utiliser la vue Login pour cette page ou créer une page de déconnexion spécifique (Logout.vue)
    component: () => import('../components/Login.vue') 
  }, 

  // 3. 🚨 ROUTE PARENTE : Le layout principal avec la Sidebar
  { 
    path: '/home', 
    name: 'Dashboard', 
    component: () => import('../views/Dashboard.vue'), // 💡 Assurez-vous que c'est le composant Home.vue qui contient la <router-view>
    meta: { requiresAuth: true },
    
    // 🚨 ROUTES IMBRIQUÉES (CHILDREN) : Le contenu qui s'affiche DANS le HomeLayout
    children: [
      {
        // Chemin: /home (sera le Dashboard par défaut du layout)
        path: '', 
        name: 'Dashboard', 
        component: () => import('../views/Dashboard.vue') // 💡 Assurez-vous que Dashboard.vue est le contenu des statistiques
      },
      {
        // Chemin: /home/clientManagement
        path: 'clientManagement', 
        name: 'ClientManagement', 
        component: () => import('../views/clientManagement.vue') // ⚠️ Casse ajustée
      },
      {
        // Chemin: /home/patrimoine
        path: 'patrimoine', 
        name: 'Patrimoine', 
        component: () => import('../views/patrimoine.vue') // ⚠️ Casse ajustée
      },
      {
        // Chemin: /home/locations
        path: 'locations', 
        name: 'Locations', 
        component: () => import('../views/Locations.vue') // ⚠️ Casse ajustée
      },
      // ... Autres routes de gestion ...
    ]
  },
];
 
const router = createRouter({
  history: createWebHistory(), // 🚨 Utilisation du Mode History
  routes
});

// Facultatif: Rediriger vers la page de login si non authentifié
// Incluez votre garde de navigation (router.beforeEach) ici

export default router;*/