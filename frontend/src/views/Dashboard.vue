<template>
  
  <div class="main-layout">
    <nav class="sidebar cedii-bg-dark text-white p-3 shadow">
       <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
        
        <h4 class="cedii-text-primary mb-0">CEDII Patrimoine Plus</h4>
    </div>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/home" class="nav-link text-white active">
            <i class="bi bi-house-door-fill me-2"></i> Accueil 
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link to="/clientManagement" class="nav-link text-white">
            <i class="bi bi-people-fill me-2"></i> Gestion des Clients
          </router-link>
        </li>

         
        
        <li class="nav-item mb-2">
          <router-link to="/patrimoine" class="nav-link text-white">
            <i class="bi bi-tools me-2"></i> Inventaire & Patrimoine
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link to="/location" class="nav-link text-white">
            <i class="bi bi-calendar-check me-2"></i> Locations & Réservations
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link to="/finance" class="nav-link text-white">
            <i class="bi bi-bank me-2"></i> Géstion Financière
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link to="/rapport" class="nav-link text-white">
            <i class="bi bi-graph-up me-2"></i> Suivi & Rapports
          </router-link>
        </li>
      </ul>
      
      <div class="mt-auto pt-3 border-top">
        <button @click="logout" class="btn btn-sm btn-danger w-100">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </nav>

   <!--<div class="main-content p-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-secondary">Tableau de Bord</h2>
        <small class="text-muted">Utilisateur: {{ userRole }}</small>
    </header>

    <div class="row mb-5">
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-people-fill" title="Clients Actifs" :value="kpis.totalClients" trend="+12 ce mois" color="cedii-text-primary" />
        </div>
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-calendar-check" title="Locations (Mois)" :value="kpis.locationsMois" trend="Taux de réussite : 95%" color="text-success" />
        </div>
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-currency-dollar" title="Revenu Total (Archivé)" :value="formatCurrency(kpis.revenuTotal)" color="text-info" />
        </div>
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-bar-chart-line" title="Taux Occup. Salles" :value="`${kpis.tauxOccupationSalle}%`" trend="Cible : 85%" color="text-warning" />
        </div>
    </div>
    
    <div class="row">
        
        <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-3 border-danger border-3">
                <h4 class="card-title text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i> Actions & Événements du Jour</h4>
                
                <h6 class="mt-3 mb-2 text-muted">Réservations à valider ({{ urgentReservations.length }})</h6>
                <ul class="list-group list-group-flush mb-3">
                    <li v-if="urgentReservations.length === 0" class="list-group-item text-success fst-italic">
                        Toutes les réservations sont validées !
                    </li>
                    <li v-for="res in urgentReservations" :key="res.idRes"
                        class="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <span class="fw-bold me-2">{{ res.Client ? res.Client.nomCli : 'Client ID ' + res.idCli }}</span>
                        <span class="badge bg-warning text-dark">{{ res.typeRes }} - {{ formatDate(res.debRes) }}</span>
                        <router-link :to="`/home/locations?resId=${res.idRes}`" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-arrow-right-circle"></i> Confirmer
                        </router-link>
                    </li>
                </ul>

                <h6 class="mb-2 text-muted">Locations Début/Fin ({{ todayEvents.length }})</h6>
                <ul class="list-group list-group-flush">
                     <li v-for="event in todayEvents" :key="event.idLo"
                        class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="me-2">{{ event.Client ? event.Client.nomCli : 'Location ID ' + event.idLo }}</span>
                        <span :class="event.type === 'start' ? 'badge bg-primary' : 'badge bg-success'">
                            {{ event.type === 'start' ? 'DÉPART' : 'FIN' }}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-4">
                <h4 class="card-title text-secondary">Tendance des Locations (6 derniers mois)</h4>
                <img src="placeholder-chart.png" alt="Graphe des 6 derniers mois" class="img-fluid" style="height: 250px; background-color: #f0f0f0; border: 1px dashed #ccc;">
                <p class="text-center text-muted mt-2">Intégration d'un graphique (Ex: Barres ou Ligne)</p>
            </div>
        </div>
        
    </div>

    </div>
  <div class="main-content p-4">
      <header class="d-flex justify-content-between align-items-center mb-4">
       
        <small class="text-muted">Utilisateur: {{ userRole }}</small>
      </header>

      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="card p-3 shadow-sm cedii-widget">
            <h5 class="card-title">Clients Actifs</h5>
            <p class="h1"></p>
          </div>
        </div>

        <div class="col-md-3 mb-4">
          <div class="card p-3 shadow-sm cedii-widget">
            <h5 class="card-title">Locations en Cours</h5>
            <p class="h1"></p>
          </div>
        </div>
        
        
        <div class="col-12 mt-4">
            <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
  -->

  <div class="main-content p-4">
    <header class="d-flex justify-content-between align-items-center mb-4">
      
        <small class="text-muted">Utilisateur: {{ userRole }}</small>
    </header>
    <div>
      <h1 color="crimson"><em>Bienvenue sur la Gestion Patrimoniale du CEDII </em> </h1> 
    </div>

    <div class="row mb-5">
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-people-fill" title="Clients Actifs" :value="kpis.totalClients" trend="+12 ce mois" color="cedii-text-primary" />
        </div>
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-calendar-check" title="Locations (Mois)" :value="kpis.locationsMois" trend="Taux de réussite : 0%" color="text-success" />
        </div>
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-bar-chart-line" title="Taux Occup. Matériels" :value="`${kpis.tauxOccupationSalle}%`" color="text-info" />
        </div>
        <div class="col-md-3 mb-4">
            <KpiCard icon="bi-bar-chart-line" title="Taux Occup. Salles" :value="`${kpis.tauxOccupationSalle}%`" trend="Cible : 0%" color="text-warning" />
        </div>
    </div>
    <div class="row">
    
    <div class="col-lg-6 mb-4">
        <div class="card shadow-sm p-3 border-danger border-3 h-100">
            <h4 class="card-title text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i> Actions & Événements du Jour</h4>
            
            <h6 class="mt-3 mb-2 text-muted">Réservations à valider ({{ urgentReservations.length }})</h6>
            <ul class="list-group list-group-flush mb-3">
                </ul>

            <h6 class="mb-2 text-muted">Locations Début/Fin ({{ todayEvents.length }})</h6>
            <ul class="list-group list-group-flush">
                </ul>
        </div>
    </div>
    
    <div class="col-lg-6 mb-4">
        <div class="card shadow-sm p-4 h-100">
            <h4 class="card-title text-secondary">Distribution du Revenu par Type de Client</h4>
            
            <div class="chart-container d-flex justify-content-center align-items-center" style="height: 300px;">
                <canvas id="revenuePieChart"></canvas> 
                
                <p class="text-muted text-center" style="position: absolute;">
                    [Placeholder Chart.js / Vue-Chartjs]
                </p>
            </div>
            
            <p class="text-center text-muted mt-2">
                Ce graphique visualise la part du revenu total généré par chaque type de client.
            </p>
        </div>
    </div>

</div>
    
   <!-- <div class="row">
        
        <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-3 border-danger border-3">
                <h4 class="card-title text-danger"><i class="bi bi-exclamation-triangle-fill me-2"></i> Actions & Événements du Jour</h4>
                
                <h6 class="mt-3 mb-2 text-muted">Réservations à valider ({{ urgentReservations.length }})</h6>
                <ul class="list-group list-group-flush mb-3">
                    <li v-if="urgentReservations.length === 0" class="list-group-item text-success fst-italic">
                        Toutes les réservations sont validées !
                    </li>
                    <li v-for="res in urgentReservations" :key="res.idRes"
                        class="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <span class="fw-bold me-2">{{ res.Client ? res.Client.nomCli : 'Client ID ' + res.idCli }}</span>
                        <span class="badge bg-warning text-dark">{{ res.typeRes }} - {{ formatDate(res.debRes) }}</span>
                        <router-link :to="`/home/locations?resId=${res.idRes}`" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-arrow-right-circle"></i> Confirmer
                        </router-link>
                    </li>
                </ul>

                <h6 class="mb-2 text-muted">Locations Début/Fin ({{ todayEvents.length }})</h6>
                <ul class="list-group list-group-flush">
                     <li v-for="event in todayEvents" :key="event.idLo"
                        class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="me-2">{{ event.Client ? event.Client.nomCli : 'Location ID ' + event.idLo }}</span>
                        <span :class="event.type === 'start' ? 'badge bg-primary' : 'badge bg-success'">
                            {{ event.type === 'start' ? 'DÉPART' : 'FIN' }}
                        </span>
                    </li>
                </ul>>
     
            </div
     
        </div>
        -->
      <!--  <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-4">
                <h4 class="card-title text-secondary">Tendance des Locations (6 derniers mois)</h4>
                <img src="placeholder-chart.png" alt="Graphe des 6 derniers mois" class="img-fluid" style="height: 250px; background-color: #f0f0f0; border: 1px dashed #ccc;">
                <p class="text-center text-muted mt-2">Intégration d'un graphique (Ex: Barres ou Ligne)</p>
            </div>
            -->
  
        </div>
      

    </div>
     <div class="">
            <router-view></router-view>
        
    </div>

    


</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
//import UserServices from '../services/UserServices'; 
import RapportService from '../services/RapportService'; // Service pour les KPIs
import LocationService from '../services/LocationService'; // Service pour les Réservations/Locations
import KpiCard from '../views/KpiCard.vue'; // Créez ce composant simple pour les widgets
import AuthService from '../services/AuthService'; // Assurez-vous que ce chemin est correct

const userRole = ref('');
const router = useRouter(); 

onMounted(() => {
  const user = AuthService.getCurrentUser();
  if (user && user.role) {
    userRole.value = user.role.toUpperCase();
  } else {
    // Redirection si l'utilisateur n'est pas logué
    router.push('/');
  }
});

function logout() {
  AuthService.logout();
  router.push('/');
}



// Données
const kpis = ref({ totalClients: 0, locationsMois: 0, revenuTotal: 0, tauxOccupationSalle: 0 });
const allPendingReservations = ref([]);

// Propriétés calculées pour le Dashboard
const urgentReservations = computed(() => {
    // Affiche les 3 premières réservations qui sont 'En attente'
    return allPendingReservations.value
        .filter(res => res.etatRes === 'En attente')
        .slice(0, 3);
});

const todayEvents = computed(() => {
    // Simule la récupération des événements du jour (début/fin)
    // Cette logique serait idéalement faite dans le backend
    const today = new Date().toISOString().split('T')[0];
    const events = allPendingReservations.value.filter(res => {
        const debDate = res.debRes ? new Date(res.debRes).toISOString().split('T')[0] : null;
        const finDate = res.finRes ? new Date(res.finRes).toISOString().split('T')[0] : null;
        return debDate === today || finDate === today;
    }).map(res => ({
        idLo: res.idRes, // Utilisation de l'ID de réservation comme référence
        Client: res.Client,
        type: res.debRes && new Date(res.debRes).toISOString().split('T')[0] === today ? 'start' : 'end'
    }));
    return events;
});

// --- Fonctions de chargement ---

const fetchKPIs = async () => {
    try {
        const response = await RapportService.getKPIs();
        kpis.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des KPIs:", error);
    }
};

const fetchReservations = async () => {
    try {
        // Récupère toutes les réservations actives pour les filtres du Dashboard
        const response = await LocationService.getPendingReservations();
        allPendingReservations.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des événements:", error);
    }
};

onMounted(() => {
    // ... (vérification utilisateur) ...
    fetchKPIs();
    fetchReservations();
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
    // ... (votre fonction de formatage) ...
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return '0,00 MGA';
    return `${value.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
    // ... (votre fonction de formatage de date) ...
    if (!datetime) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(datetime).toLocaleDateString('fr-FR', options);
};




// ... (le reste du script : logout) ...
</script>


<!--<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService'; // Assurez-vous que ce chemin est correct

const router = useRouter();
const userRole = ref('');

onMounted(() => {
  const user = AuthService.getCurrentUser();
  if (user && user.role) {
    userRole.value = user.role.toUpperCase();
  } else {
    // Redirection si l'utilisateur n'est pas logué
    router.push('/');
  }
});

function logout() {
  AuthService.logout();
  router.push('/');
}

// NOTE: Le code pour le masquage des liens par rôle sera ajouté plus tard si nécessaire.
</script>
-->
<style scoped>

/* --- 1. Remplir la fenêtre et utiliser Flexbox pour la division --- */
.main-layout {
    display: flex;
    min-height: 100vh; /* OCCUPE 100% de la hauteur de la fenêtre */
    width: 100vw;    /* OCCUPE 100% de la largeur de la fenêtre */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.cedii-bg-dark {
    background-color: var(--cedii-dark, #02061E) !important;
}
.cedii-text-primary {
    color: var(--cedii-primary-light, #5B11EE) !important;
}

.min-vh-100 {
    display: flex; /* Active Flexbox pour la mise en page principale */
    min-height: 100vh;
}
.app-logo{
  width: 100px;
  height: auto;
  margin-top: 10px;
}
.logo-container{
  display: flex;
  justify-content:left ;
  align-items: left;
}


.sidebar {
    width: 250px;
    flex-shrink: 0; /* Empêche la barre latérale de rétrécir */
}

.sidebar-logo {
    width: 60px; /* Taille du logo */
    height: 60px;
    
    /* 🚨 C'est ce qui rend la bordure parfaitement ronde */
    border-radius: 50%; 
    
    /* Optionnel : Ajoute une petite bordure blanche pour qu'il ressorte */
    border: 2px solid white; 
    
    object-fit: cover; /* Assure que l'image remplit la zone sans distorsion */
}

.sidebar .nav-link {
    transition: background-color 0.3s;
    border-radius: 5px;
}

.sidebar .nav-link:hover, .sidebar .nav-link.active {
    background-color: var(--cedii-primary-dark, #0405BF);
}

.main-content {
    flex-grow: 1; /* Permet au contenu principal de prendre l'espace restant */
    background-color: #f8f9fa;
}

.cedii-widget {
    border-left: 5px solid var(--cedii-primary-light, #5B11EE);
}
</style>