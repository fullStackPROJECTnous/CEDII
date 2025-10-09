// router.js
import { createRouter, createWebHistory } from 'vue-router';
//import Home from './components/HelloWorld.vue';
//import Client from './client.vue';
//import HelloWorld from './components/clientManagement.vue';
//import Client from './client.vue';
//import Utilisateur from './utilisateur.vue';
//import Register from './views/Register.vue';


const routes = [
  { path: '/', name: 'Home', component: HelloWorld },
  { path: '/client', name: 'Client', src: Client },
  {path: '/utilisateur', name: 'Utilisateur', src: Utilisateur },
  {path: '/Register', name: 'Register', src: Register},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


// frontend/src/router/index.js

/*import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue'; 
// Renommez ce fichier si votre gestion client est dans un autre fichier que HelloWorld.vue

import Register from './views/register.vue';
import Dashboard from './views/Dashboard.vue';

import ClientManagement from './components/ClientManagement.vue';

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
    path: '/clients',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true } // Exemple de protection de route
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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

*/