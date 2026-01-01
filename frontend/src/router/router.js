// frontend/src/router/index.js

/*import { createRouter, createWebHashHistory } from 'vue-router';
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
import MaterielBureauView from '../views/materielBureauView.vue';
import EtatLieu from '../views/etatLieu.vue';
import ReservationValidation from '../views/reservationValidation.vue';
import FormEtatLieu from '../views/formEtatLieu.vue';
import ReservationLocationForm from '../views/reservationLocationForm.vue';
import ClientManagement1 from '../views/clientManagement1.vue';
import InventairePatrimoine1 from '../views/inventairePatrimoine1.vue';
import MaterielBureauView1 from '../views/materielBureauView1.vue';
import DashboardEnfant from '../views/dashboardEnfant.vue';



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
    path: '/clientManagementAdmin',
    name: 'ClientManagement1',
    component: ClientManagement1,
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

     {
    path: '/materielBureauView',
    name: 'Bureau',
    component: MaterielBureauView
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },
    {
    path: '/materielBureauView1',
    name: 'Bureau1',
    component: MaterielBureauView1
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

  
     {
    path: '/etatLieu',
    name: 'EtatLieux',
    component: EtatLieu
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

   {
    path: '/reservationLocationForm',
    name: 'NouvelleReservation',
    component: ReservationLocationForm
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },
  
     {
    path: '/reservations/:idRes/validate',
    name: 'ReservationValid',
    component: ReservationValidation,
    props: true
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

   {
    path: '/locations/:idLo/etat-lieux/:mode',
    name: 'FormEtatLieu',
    component: FormEtatLieu,
    props: true
    // Optionnel: ajouter un meta field pour la vérification du login
    // meta: { requiresAuth: true }
  },

   
  // 🚨 CORRECTION : Route pour la réception
  {
    path: '/patrimoine',
    name: 'InventairePatrimoine',
    component: InventairePatrimoine,
    redirect: '/patrimoine/materiel',
    children: [
      {
        path: 'materiel',
        name: 'PatrimoineMateriel',
        component: Materiel
      },
      {
        path: 'salle',
        name: 'PatrimoineSalle',
        component: Salle
      }
    ]
  },

  // 🚨 CORRECTION : Route pour l'admin avec un chemin différent
  {
    path: '/patrimoine-admin',
    name: 'InventairePatrimoineAD',
    component: InventairePatrimoine1,
    redirect: '/patrimoine-admin/materiel',
    children: [
      {
        path: 'materiel',
        name: 'PatrimoineMaterielAdmin',
        component: Materiel
      },
      {
        path: 'salle',
        name: 'PatrimoineSalleAdmin',
        component: Salle
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

   // NOUVELLE STRUCTURE POUR LE DASHBOARD RECEPTION
  {
    path: '/dashboardReception',
    name: 'ReceptionDashboard',
    component: DashboardReception,
    meta: { roles: ['admin', 'reception'] },
    // Redirection vers la section accueil par défaut
    redirect: { name: 'ReceptionDashboardenfant' },
    children: [
      {
        path: 'acceuil',
        name: 'ReceptionDashboardenfant',
        component: DashboardEnfant
      },
      {
       path: '/reservationLocationForm',
       name: 'NouvelleReservation',
       component: ReservationLocationForm
      },
      {
        path: '/demandeAttente',
        name: 'DemandesEnAttente',
        component: DemandeAttente
      },
      {
        path: '/calendrier',
    name: 'CalendrierDisponibilites',
    component: Calendrier
      },
      
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
        path: '/materielBureauView',
    name: 'Bureau',
    component: MaterielBureauView
      },
      {
       path: '/clientManagement',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true }
      }
    ]
  },


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
*/

/*
import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore'; // Utiliser Pinia

// Pages d'authentification
import LoginWithRegister from '@/components/Auth/LoginWithRegister.vue';
import LoginWithoutRegister from '@/components/Auth/LoginWithoutRegister.vue';
import AdminRegister from '@/components/Auth/AdminRegister.vue';
import ReceptionRegister from '@/components/Auth/ReceptionRegister.vue';

// Vos composants existants
import Register from '../views/register.vue'; // Ancien register général
import ClientManagement from '../views/clientManagement.vue';
import ClientManagement1 from '../views/clientManagement1.vue';
import SalleManagement from '../views/salleManagement.vue';
import Location from '../views/location.vue';
import Rapport from '../views/rapport.vue';
import Materiel from '../views/materiel.vue';
import Salle from '../views/salle.vue';
import InventairePatrimoine from '../views/inventairePatrimoine.vue';
import InventairePatrimoine1 from '../views/inventairePatrimoine1.vue';
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
import MaterielBureauView from '../views/materielBureauView.vue';
import MaterielBureauView1 from '../views/materielBureauView1.vue';
import EtatLieu from '../views/etatLieu.vue';
import ReservationValidation from '../views/reservationValidation.vue';
import FormEtatLieu from '../views/formEtatLieu.vue';
import ReservationLocationForm from '../views/reservationLocationForm.vue';

const routes = [
  // ==================== PAGES D'AUTHENTIFICATION ====================
  {
    path: '/',
    name: 'LoginWithRegister',
    component: LoginWithRegister,
    meta: { hideNavbar: true, public: true }
  },
  {
    path: '/login-internal',
    name: 'LoginWithoutRegister',
    component: LoginWithoutRegister,
    meta: { hideNavbar: true, public: true }
  },
  {
    path: '/register',
    name: 'RegisterOld', // Ancienne route pour compatibilité
    component: Register,
    meta: { hideNavbar: true, public: true }
  },
  {
    path: '/register/admin',
    name: 'AdminRegister',
    component: AdminRegister,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/register/reception',
    name: 'ReceptionRegister',
    component: ReceptionRegister,
    meta: { requiresAuth: true, roles: ['reception', 'admin'] }
  },

  // ==================== DASHBOARDS ====================
  {
    path: '/redirect',
    name: 'DashboardRedirector',
    component: DashboardRedirector
  },
  {
    path: '/dashboard/admin',
    name: 'AdminDashboard',
    component: DashboardAdmin,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/dashboard/reception',
    name: 'ReceptionDashboard',
    component: DashboardReception,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },
  {
    path: '/dashboard/finance',
    name: 'FinanceDashboard',
    component: DashboardFinance,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] }
  },
  {
    path: '/dashboard/client',
    name: 'ClientDashboard',
    component: CompteClient,
    meta: { requiresAuth: true, roles: ['admin', 'client'] }
  },

  // ==================== GESTION CLIENTS ====================
  {
    path: '/clients',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },
  {
    path: '/clients-admin',
    name: 'ClientManagementAdmin',
    component: ClientManagement1,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  // ==================== GESTION SALLES ====================
  {
    path: '/salles',
    name: 'SalleManagement',
    component: SalleManagement,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },

  // ==================== RÉSERVATIONS ====================
  {
    path: '/reservations',
    name: 'ReservationForm',
    component: ReservationForm,
    meta: { requiresAuth: true, roles: ['client'] }
  },
  {
    path: '/reservations/new',
    name: 'NouvelleReservation',
    component: ReservationLocationForm,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },
  {
    path: '/reservations/:idRes/validate',
    name: 'ReservationValid',
    component: ReservationValidation,
    props: true,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },

  // ==================== CATALOGUE ====================
  {
    path: '/catalogue',
    name: 'CatalogView',
    component: Catalogue,
    meta: { requiresAuth: true, roles: ['admin', 'reception', 'client', 'finance'] }
  },

  // ==================== DEMANDES ====================
  {
    path: '/demandes',
    name: 'DemandesEnAttente',
    component: DemandeAttente,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },

  // ==================== CALENDRIER ====================
  {
    path: '/calendrier',
    name: 'CalendrierDisponibilites',
    component: Calendrier,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },

  // ==================== FINANCE ====================
  {
    path: '/finance',
    name: 'Finance',
    component: Finance,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] }
  },
  {
    path: '/facturation',
    name: 'FactureGene',
    component: Facturation,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] }
  },
  {
    path: '/suivi',
    name: 'SuiviPaie',
    component: Suivi,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] }
  },
  {
    path: '/penalites',
    name: 'PenaliteLiti',
    component: Penalite,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] }
  },
  {
    path: '/synthese',
    name: 'RapportSynth',
    component: Synthese,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] }
  },

  // ==================== PATRIMOINE ====================
  {
    path: '/patrimoine',
    name: 'InventairePatrimoine',
    component: InventairePatrimoine,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] },
    children: [
      {
        path: 'materiel',
        name: 'PatrimoineMateriel',
        component: Materiel
      },
      {
        path: 'salle',
        name: 'PatrimoineSalle',
        component: Salle
      }
    ]
  },
  {
    path: '/patrimoine-admin',
    name: 'InventairePatrimoineAD',
    component: InventairePatrimoine1,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: 'materiel',
        name: 'PatrimoineMaterielAdmin',
        component: Materiel
      },
      {
        path: 'salle',
        name: 'PatrimoineSalleAdmin',
        component: Salle
      }
    ]
  },

  // ==================== MATÉRIEL BUREAU ====================
  {
    path: '/materiel-bureau',
    name: 'Bureau',
    component: MaterielBureauView,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },
  {
    path: '/materiel-bureau-admin',
    name: 'Bureau1',
    component: MaterielBureauView1,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  // ==================== ÉTATS DES LIEUX ====================
  {
    path: '/etats-lieux',
    name: 'EtatLieux',
    component: EtatLieu,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },
  {
    path: '/locations/:idLo/etat-lieux/:mode',
    name: 'FormEtatLieu',
    component: FormEtatLieu,
    props: true,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },

  // ==================== LOCATIONS ====================
  {
    path: '/locations',
    name: 'Location',
    component: Location,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] }
  },

  // ==================== RAPPORTS ====================
  {
    path: '/rapports',
    name: 'Rapport',
    component: Rapport,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  // ==================== UTILISATEURS ====================
  {
    path: '/utilisateurs',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, roles: ['admin'] }
  },

  // ==================== REDIRECTION PAR DÉFAUT ====================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Garde de navigation améliorée
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.userRole;

  // Si la route est publique, autoriser l'accès
  if (to.meta.public) {
    next();
    return;
  }

  // Vérifier l'authentification
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion appropriée
    next({ name: 'LoginWithRegister' });
    return;
  }

  // Vérifier les rôles
  if (to.meta.roles && userRole) {
    const hasRole = to.meta.roles.includes(userRole);
    if (!hasRole) {
      // Rediriger vers le dashboard approprié
      switch (userRole) {
        case 'admin':
          next({ name: 'AdminDashboard' });
          break;
        case 'reception':
          next({ name: 'ReceptionDashboard' });
          break;
        case 'finance':
          next({ name: 'FinanceDashboard' });
          break;
        case 'client':
          next({ name: 'ClientDashboard' });
          break;
        default:
          next({ name: 'LoginWithRegister' });
      }
      return;
    }
  }

  next();
});

export default router;*/

// frontend/src/router/index.js (Code inchangé par rapport à votre dernier envoi, mais vérifié)

import { createRouter, createWebHashHistory } from 'vue-router';
import AuthService from '../services/AuthService'; 

import Login from '../components/Login.vue'; 
import Register from '../views/register.vue';
// ... (imports restants) ...
import ClientManagement from '../views/clientManagement.vue';
import SalleManagement from '../views/salleManagement.vue';
import Location from '../views/location.vue';
import Rapport from '../views/rapport.vue';
import Materiel from '../views/materiel.vue';
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
import MaterielBureauView from '../views/materielBureauView.vue';
import EtatLieu from '../views/etatLieu.vue';
import ReservationValidation from '../views/reservationValidation.vue';
import FormEtatLieu from '../views/formEtatLieu.vue';
import ReservationLocationForm from '../views/reservationLocationForm.vue';
import ClientManagement1 from '../views/clientManagement1.vue';
import InventairePatrimoine1 from '../views/inventairePatrimoine1.vue';
import MaterielBureauView1 from '../views/materielBureauView1.vue';


const routes = [
  // ------------------------------------------
  // 🌟 ROUTES DE CONNEXION STANDARDISÉES 🌟
  // ------------------------------------------

  // 1. Client / Public (URL: / ou /login) -> Lien S'inscrire Masqué
  { path: '/', name: 'RootLogin', component: Login },
  { path: '/login', name: 'PublicLogin', component: Login },
  
  // 2. Administration (URL: /admin/login) -> Lien S'inscrire Affiché
  { path: '/admin/login', name: 'AdminLogin', component: Login }, 
  
  // 3. Réception (URL: /reception/login) -> Lien S'inscrire Affiché (mais redirige avec ?source=reception)
  { path: '/reception/login', name: 'ReceptionLogin', component: Login }, 
  
  // 4. Finance (URL: /finance/login) -> Lien S'inscrire Masqué
  { path: '/finance/login', name: 'FinanceLogin', component: Login }, 

  // ------------------------------------------
  
  {
    path: '/register', // Route pour l'inscription
    name: 'Register',
    component: Register
  },
// ... (le reste des routes est inchangé) ...

  {
    path: '/redirect', // Nouvelle route temporaire
    name: 'DashboardRedirector',
    component: DashboardRedirector,
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
    meta: { requiresAuth: true, roles: ['admin', 'reception', 'client'] }
  },
  
  // Vues spécifiques aux rôles (Dashboards)
  {
    path: '/dashboardAdmin',
    name: 'AdminDashboard',
    component: DashboardAdmin,
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  {
    path: '/dashboardReception',
    name: 'ReceptionDashboard',
    component: DashboardReception,
    meta: { requiresAuth: true, roles: ['admin', 'reception'] } 
  },
  {
    path: '/dashboardFinance',
    name: 'FinanceDashboard',
    component: DashboardFinance,
    meta: { requiresAuth: true, roles: ['admin', 'finance'] } 
  },
  {
    path: '/compteClient',
    name: 'ClientDashboard',
    component: CompteClient,
    meta: { requiresAuth: true, roles: ['admin', 'client'] } 
  },
  
  // ------------------------------------------
  // Autres routes d'application
  // ------------------------------------------
  {
    path: '/clientManagement',
    name: 'ClientManagement',
    component: ClientManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/clientManagementAdmin',
    name: 'ClientManagement1',
    component: ClientManagement1,
    meta: { requiresAuth: true }
  },
  {
    path: '/salleManagement',
    name: 'SalleManagement',
    component: SalleManagement,
    meta: { requiresAuth: true } 
  },
  {
    path: '/demandeAttente',
    name: 'DemandesEnAttente',
    component: DemandeAttente,
    meta: { requiresAuth: true } 
  },
  {
    path: '/calendrier',
    name: 'CalendrierDisponibilites',
    component: Calendrier,
    meta: { requiresAuth: true } 
  },
  {
    path: '/facturation',
    name: 'FactureGene',
    component: Facturation,
    meta: { requiresAuth: true } 
  },
  {
    path: '/suivi',
    name: 'SuiviPaie',
    component: Suivi,
    meta: { requiresAuth: true } 
  },
  {
    path: '/penalite',
    name: 'PenaliteLiti',
    component: Penalite,
    meta: { requiresAuth: true } 
  },
  {
    path: '/synthese',
    name: 'RapportSynth',
    component: Synthese,
    meta: { requiresAuth: true } 
  },
  {
    path: '/materielBureauView',
    name: 'Bureau',
    component: MaterielBureauView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/materielBureauView1',
    name: 'Bureau1',
    component: MaterielBureauView1,
    meta: { requiresAuth: true } 
  },
  {
    path: '/etatLieu',
    name: 'EtatLieux',
    component: EtatLieu,
    meta: { requiresAuth: true } 
  },
  {
    path: '/reservationLocationForm',
    name: 'NouvelleReservation',
    component: ReservationLocationForm,
    meta: { requiresAuth: true } 
  },
  {
    path: '/reservations/:idRes/validate',
    name: 'ReservationValid',
    component: ReservationValidation,
    props: true,
    meta: { requiresAuth: true } 
  },
  {
    path: '/locations/:idLo/etat-lieux/:mode',
    name: 'FormEtatLieu',
    component: FormEtatLieu,
    props: true,
    meta: { requiresAuth: true } 
  },
  
  // Patrimoine (Réception)
  {
    path: '/patrimoine',
    name: 'InventairePatrimoine',
    component: InventairePatrimoine,
    meta: { requiresAuth: true }, 
    redirect: '/patrimoine/materiel',
    children: [
      { path: 'materiel', name: 'PatrimoineMateriel', component: Materiel },
      { path: 'salle', name: 'PatrimoineSalle', component: Salle }
    ]
  },

  // Patrimoine (Admin)
  {
    path: '/patrimoine-admin',
    name: 'InventairePatrimoineAD',
    component: InventairePatrimoine1,
    meta: { requiresAuth: true }, 
    redirect: '/patrimoine-admin/materiel',
    children: [
      { path: 'materiel', name: 'PatrimoineMaterielAdmin', component: Materiel },
      { path: 'salle', name: 'PatrimoineSalleAdmin', component: Salle }
    ]
  },

  {
    path: '/rapport',
    name: 'Rapport',
    component: Rapport,
    meta: { requiresAuth: true }
  },
  {
    path: '/location',
    name: 'Location',
    component: Location,
    meta: { requiresAuth: true }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Finance,
    meta: { requiresAuth: true }
  },
  
  // Gestion Utilisateurs (Admin SEULEMENT)
  {
    path: '/userManagement',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Garde de Navigation (Middleware)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles;
  const user = AuthService.getCurrentUser();

  // 1. Protection de l'Authentification
  if (requiresAuth && !user) {
    next({ name: 'RootLogin' }); 
  } 
  // 2. Protection des Rôles
  else if (requiresAuth && requiredRoles && user && !requiredRoles.includes(user.roleUti)) {
    //alert('Accès non autorisé. Votre rôle est :' `${user.roleUti}`. 'Rôles requis :'  `${requiredRoles.join(', ')}`);
    next(false); 
  } 
  else {
    next(); 
  }
});

export default router;