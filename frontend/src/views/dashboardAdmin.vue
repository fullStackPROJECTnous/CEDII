<template>
  <div class="d-flex vh-100"> 

    <nav class="sidebar cedii-bg-dark text-white p-3 shadow d-flex flex-column">
      <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
        <h4 class="cedii-text-primary mb-0">CEDII Patrimoine Plus</h4>
      </div>
      
      <ul class="nav flex-column mb-auto">
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'AdminDashboard'}" class="nav-link text-white active">
            <i class="bi bi-house-door-fill me-2"></i> Accueil 
          </router-link>
        </li>

        <li class="nav-item mb-2" >
          <router-link :to="{ name: 'UserManagement' }"  v-if="isAdmin" class="nav-link text-white">
            <i class="bi bi-person-gear me-2"></i> Gestion des Utilisateurs
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'ClientManagement' }" class="nav-link text-white">
            <i class="bi bi-people-fill me-2"></i> Gestion des Clients
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'InventairePatrimoine' }" class="nav-link text-white">
            <i class="bi bi-tools me-2"></i> Inventaire & Patrimoine
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'Location' }" class="nav-link text-white">
            <i class="bi bi-calendar-check me-2"></i> Locations & Réservations
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'Finance' }" class="nav-link text-white">
            <i class="bi bi-bank me-2"></i> Géstion Financière
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'Rapport' }" class="nav-link text-white">
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

    <main class="main-content flex-grow-1 overflow-auto bg-light"> 
      
      <header class="d-flex justify-content-end align-items-center p-4 pb-0">
        <small class="text-muted">Utilisateur: {{ userRole }}</small>
      </header>
      
      <div class="p-4">
        <h1 class="text-secondary mb-4"><em>Bienvenue sur la Gestion Patrimoniale du CEDII </em> </h1> 

        <div class="row mb-5">
            <div class="col-md-3 mb-4">
                <KpiCard icon="bi-people-fill" title="Clients Actifs" :value="kpis.totalClients" trend="+12 ce mois" color="cedii-text-primary" />
            </div>
            <div class="col-md-3 mb-4">
                <KpiCard icon="bi-calendar-check" title="Locations (Mois)" :value="kpis.locationsMois" trend="Taux de réussite : 0%" color="text-success" />
            </div>
            <div class="col-md-3 mb-4">
                <KpiCard icon="bi-bar-chart-line" title="Taux Occup. Matériels" :value="`${kpis.tauxOccupationMateriel}%`" color="text-info" />
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
                  <ul class="list-group list-group-flush mb-3"></ul>
                  <h6 class="mb-2 text-muted">Locations Début/Fin ({{ todayEvents.length }})</h6>
                  <ul class="list-group list-group-flush"></ul>
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
      </div>
      
      </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// 🚨 Assurez-vous que KpiCard est importé ou retirez-le si vous l'avez supprimé
import KpiCard from '../views/KpiCard.vue'; 
import RapportService from '../services/RapportService'; 
import LocationService from '../services/LocationService'; 
import AuthService from '../services/AuthService'; 

const userRole = ref('');
const router = useRouter(); 
const isAdmin = computed(() => userRole.value === 'ADMIN'); // Ajoutez cette propriété si elle est nécessaire pour isAdmin

onMounted(() => {
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    
    // Si ce composant est utilisé pour tous les rôles, décommentez la redirection ci-dessous.
    // Si ce fichier est UNIQUEMENT pour l'Admin, l'AdminDashboard est la bonne destination.
    
  } else {
    router.push('/');
  }
});

function logout() {
  AuthService.logout();
  router.push('/');
}

// Données (KPIs et événements)
const kpis = ref({ totalClients: 0, locationsMois: 0, revenuTotal: 0, tauxOccupationSalle: 0 });
const allPendingReservations = ref([]);

// Propriétés calculées
const urgentReservations = computed(() => {
    return allPendingReservations.value
        .filter(res => res.etatRes === 'En attente')
        .slice(0, 3);
});

const todayEvents = computed(() => {
    // Logique de filtrage des événements (début/fin de location du jour)
    const today = new Date().toISOString().split('T')[0];
    const events = allPendingReservations.value.filter(res => {
        const debDate = res.debRes ? new Date(res.debRes).toISOString().split('T')[0] : null;
        const finDate = res.finRes ? new Date(res.finRes).toISOString().split('T')[0] : null;
        return debDate === today || finDate === today;
    }).map(res => ({
        idLo: res.idRes, 
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
        const response = await LocationService.getPendingReservations();
        allPendingReservations.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des événements:", error);
    }
};

onMounted(() => {
    // 🚨 Assurez-vous que la vérification utilisateur est faite avant les appels API
    if (AuthService.getCurrentUser()) {
      fetchKPIs();
      fetchReservations();
    }
});

// --- Fonctions utilitaires (non incluses dans le code source mais mentionnées) ---
// Vous devriez les inclure si elles sont utilisées
// const formatCurrency = (value) => { /* ... */ };
// const formatDate = (datetime) => { /* ... */ };

</script>

<style scoped>
/* Assurez-vous d'avoir le CSS global corrigé (html, body, #app { height: 100%; }) */

.d-flex.vh-100 { /* Cible le conteneur racine pour la pleine hauteur */
    min-height: 100vh;
}

.cedii-bg-dark {
    background-color: var(--cedii-dark, #02061E) !important;
}
.cedii-text-primary {
    color: var(--cedii-primary-light, #5B11EE) !important;
}

.sidebar {
    width: 250px;
    flex-shrink: 0; 
    /* D-flex et flex-column sont essentiels ici pour aligner le bouton 'Déconnexion' en bas */
    display: flex; 
    flex-direction: column;
}

.sidebar-logo {
    width: 60px; 
    height: 60px;
    border-radius: 50%; 
    border: 2px solid white; 
    object-fit: cover; 
}

.sidebar .nav-link {
    transition: background-color 0.3s;
    border-radius: 5px;
}

.sidebar .nav-link:hover, .sidebar .nav-link.active {
    background-color: var(--cedii-primary-dark, #0405BF);
}

.main-content {
    flex-grow: 1; 
    /* 🚨 bg-light (de Bootstrap) ou background-color: #f8f9fa assure le fond blanc/clair */
    /* overflow-auto est dans le template */
}

.cedii-widget {
    border-left: 5px solid var(--cedii-primary-light, #5B11EE);
}
</style>
