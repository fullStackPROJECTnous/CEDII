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
          <router-link :to="{ name: 'UserManagement' }" v-if="isAdmin" class="nav-link text-white">
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
        <h1 class="text-secondary mb-4"><em>Bienvenue sur la Gestion Patrimoniale du CEDII</em></h1>

        <!-- Indicateurs de chargement -->
        <div v-if="loading.kpis" class="alert alert-info">
          Chargement des statistiques...
        </div>

        <div class="row mb-5">
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-people-fill" 
              title="Clients Actifs" 
              :value="kpis.totalClients" 
              trend="+12 ce mois" 
              color="cedii-text-primary" 
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-calendar-check" 
              title="Locations (Mois)" 
              :value="kpis.locationsMois" 
              trend="Taux de réussite : 0%" 
              color="text-success" 
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-bar-chart-line" 
              title="Taux Occup. Matériels" 
              :value="`${kpis.tauxOccupationMateriel}%`" 
              color="text-info" 
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-bar-chart-line" 
              title="Taux Occup. Salles" 
              :value="`${kpis.tauxOccupationSalle}%`" 
              trend="Cible : 0%" 
              color="text-warning" 
            />
          </div>
        </div>
        
        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-3 border-danger border-3 h-100">
              <h4 class="card-title text-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i> 
                Actions & Événements du Jour
                <span v-if="loading.reservations" class="spinner-border spinner-border-sm ms-2"></span>
              </h4>
              
              <h6 class="mt-3 mb-2 text-muted">
                Réservations à valider ({{ urgentReservations.length }})
              </h6>
              
              <!-- 🚨 CORRECTION 1: Ajout du v-for pour afficher les réservations en attente -->
              <ul class="list-group list-group-flush mb-3">
                <li v-for="res in urgentReservations" :key="res.idRes" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ getClientName(res) }}</strong> 
                    <small class="text-muted ms-2">{{ res.typeRes === 'Salle' ? 'Salle' : 'Matériel' }}</small>
                  </div>
                  <span class="badge bg-warning">
                    À valider ({{ formatDateSimple(res.debRes) }})
                  </span>
                </li>
                <li v-if="urgentReservations.length === 0 && !loading.reservations" class="list-group-item text-muted">
                  Aucune réservation en attente
                </li>
              </ul>
              
              <h6 class="mb-2 text-muted">
                Locations Début/Fin ({{ todayEvents.length }})
              </h6>
              
              <!-- 🚨 CORRECTION 2: Ajout du v-for pour afficher les événements du jour -->
              <ul class="list-group list-group-flush">
                <li v-for="event in todayEvents" :key="event.idRes + event.type" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ getClientName(event) }}</strong> 
                    <small class="text-muted ms-2">{{ event.typeRes === 'Salle' ? 'Salle' : 'Matériel' }}</small>
                  </div>
                  <span :class="`badge ${event.type === 'start' ? 'bg-success' : 'bg-info'}`">
                    {{ event.type === 'start' ? 'DÉBUT' : 'FIN' }} Aujourd'hui
                  </span>
                </li>
                <li v-if="todayEvents.length === 0 && !loading.reservations" class="list-group-item text-muted">
                  Aucun événement aujourd'hui
                </li>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// NOTE: Assurez-vous que KpiCard.vue est bien dans le dossier `../views/` ou ajustez le chemin.
import KpiCard from '../views/KpiCard.vue'; 
import RapportService from '../services/RapportService'; 
import LocationService from '../services/LocationService'; 
import AuthService from '../services/AuthService'; 

const userRole = ref('');
const router = useRouter(); 
const isAdmin = computed(() => userRole.value === 'ADMIN');

import { Chart, registerables } from 'chart.js'; // 👈 Import de Chart.js
Chart.register(...registerables); // Enregistrement des composants nécessaires

const revenueChartData = ref([]);
let revenueChartInstance = null; // Pour stocker l'instance du graphique

// --- Fonctions de chargement ---

const fetchRevenueData = async () => {
    try {
        const response = await RapportService.getRevenueByClientType();
        revenueChartData.value = response.data;
        renderRevenueChart(); // 👈 Appel de la fonction de rendu après chargement
    } catch (error) {
        console.error("Erreur chargement données de revenu:", error);
    }
};

const renderRevenueChart = () => {
    // 🚨 AJOUT DE LA VÉRIFICATION DE TYPE
    if (!Array.isArray(revenueChartData.value) || revenueChartData.value.length === 0) {
        console.warn("Impossible de rendre le graphique: Les données ne sont pas un tableau ou sont vides.");
        if (revenueChartInstance) {
            revenueChartInstance.destroy();
            revenueChartInstance = null;
        }
        // Optionnel: Afficher un message de données non disponibles sur le canvas
        const ctx = document.getElementById('revenuePieChart').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return; 
    }
    
    // Si une instance existe déjà, la détruire pour la mettre à jour
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }
    
    const ctx = document.getElementById('revenuePieChart').getContext('2d');
    
    const data = {
        // Cette ligne ne provoquera plus d'erreur après la vérification
        labels: revenueChartData.value.map(d => d.typeCli || 'Non spécifié'),
        datasets: [{
            data: revenueChartData.value.map(d => parseFloat(d.totalRevenu)),
            // ... (reste de la configuration du graphique)
        }]
    };    // Création de l'instance du graphique
    revenueChartInstance = new Chart(ctx, {
        type: 'doughnut', // Type de graphique en anneau
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: false,
                }
            }
        }
      })
    };

// Données
const kpis = ref({ 
  totalClients: 0, 
  locationsMois: 0, 
  revenuTotal: 0, 
  tauxOccupationSalle: 0,
  tauxOccupationMateriel: 0 
});
const allPendingReservations = ref([]);
const loading = ref({ kpis: false, reservations: false });

// Fonctions utilitaires
const formatDateSimple = (dateString) => {
  if (!dateString) return '';
  // Utilise le constructeur Date avec la date seule (YYYY-MM-DD)
  // Assure le fonctionnement même si la BDD ne renvoie pas l'heure ou le fuseau horaire
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getClientName = (reservation) => {
  // 🚨 CORRECTION 3: Tentative d'accès aux propriétés directes du client (suite à JOIN)
  if (reservation.Client && reservation.Client.nomCli && reservation.Client.prenomCli) {
    return `${reservation.Client.nomCli} ${reservation.Client.prenomCli}`;
  }
  // Fallback si les propriétés Client sont directement "flattened" sur l'objet reservation
  if (reservation.nomCli && reservation.prenomCli) {
    return `${reservation.nomCli} ${reservation.prenomCli}`;
  }
  return 'Client inconnu';
};

// Propriétés calculées
const urgentReservations = computed(() => {
  return allPendingReservations.value
    .filter(res => res.etatRes === 'En attente')
    .sort((a, b) => new Date(a.debRes) - new Date(b.debRes)) // Tri par date de début
    .slice(0, 5); // Afficher les 5 plus urgentes
});

const todayEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const events = [];
  
  allPendingReservations.value.forEach(res => {
    // Normalisation des dates pour la comparaison (YYYY-MM-DD)
    const debDate = res.debRes ? new Date(res.debRes).toISOString().split('T')[0] : null;
    const finDate = res.finRes ? new Date(res.finRes).toISOString().split('T')[0] : null;
    
    // Si l'état de la réservation est confirmé, on regarde les événements du jour
    if (res.etatRes === 'Confirmée') {
      if (debDate === today) {
        events.push({
          ...res,
          type: 'start'
        });
      }
      if (finDate === today) {
        events.push({
          ...res,
          type: 'end'
        });
      }
    }
  });
  
  return events;
});

// Fonctions de chargement
const fetchKPIs = async () => {
  try {
    loading.value.kpis = true;
    console.log('Début chargement KPIs...');
    const response = await RapportService.getKPIs();
    kpis.value = response.data;
    console.log('KPIs chargés:', response.data);
  } catch (error) {
    console.error("Erreur détaillée chargement KPIs:", error);
    kpis.value = { 
      totalClients: 0, 
      locationsMois: 0, 
      revenuTotal: 0, 
      tauxOccupationSalle: 0,
      tauxOccupationMateriel: 0
    };
  } finally {
    loading.value.kpis = false;
  }
};

const fetchReservations = async () => {
  try {
    loading.value.reservations = true;
    console.log('Début chargement réservations...');
    // Assurez-vous que getPendingReservations renvoie TOUTES les locations/réservations
    // qui sont "En attente" ou "Confirmées" car todayEvents filtre sur "Confirmée".
    const response = await LocationService.getPendingReservations();
    allPendingReservations.value = response.data;
    console.log('Réservations chargées:', response.data.length);
  } catch (error) {
    console.error("Erreur détaillée chargement réservations:", error);
    allPendingReservations.value = [];
  } finally {
    loading.value.reservations = false;
  }
};

// Initialisation
onMounted(() => {
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    fetchKPIs();
    fetchReservations();
    fetchRevenueData();
  } else {
    router.push('/');
  }
});

function logout() {
  AuthService.logout();
  router.push('/');
}
</script>

<style scoped>
.d-flex.vh-100 {
  min-height: 100vh;
}

.cedii-bg-dark {
  background-color: var(--cedii-dark, #5E5E5E) !important;
}

.cedii-text-primary {
  color: var(--cedii-primary-light, white) !important;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
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
  background-color: var(--cedii-primary-dark, white);
}

.main-content {
  flex-grow: 1; 
}
.sidebar .nav-link.active { 
    color: purple !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}

.sidebar .nav-link { 
    color: #02061E !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}
</style>
<!--
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
          <router-link :to="{ name: 'UserManagement' }" v-if="isAdmin" class="nav-link text-white">
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
        <h1 class="text-secondary mb-4"><em>Bienvenue sur la Gestion Patrimoniale du CEDII</em></h1>

        <!-- Indicateurs de chargement 
        <div v-if="loading.kpis" class="alert alert-info">
          Chargement des statistiques...
        </div>

        <div class="row mb-5">
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-people-fill" 
              title="Clients Actifs" 
              :value="kpis.totalClients" 
              trend="+12 ce mois" 
              color="cedii-text-primary" 
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-calendar-check" 
              title="Locations (Mois)" 
              :value="kpis.locationsMois" 
              trend="Taux de réussite : 0%" 
              color="text-success" 
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-bar-chart-line" 
              title="Taux Occup. Matériels" 
              :value="`${kpis.tauxOccupationMateriel}%`" 
              color="text-info" 
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-bar-chart-line" 
              title="Taux Occup. Salles" 
              :value="`${kpis.tauxOccupationSalle}%`" 
              trend="Cible : 0%" 
              color="text-warning" 
            />
          </div>
        </div>
        
        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-3 border-danger border-3 h-100">
              <h4 class="card-title text-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i> 
                Actions & Événements du Jour
                <span v-if="loading.reservations" class="spinner-border spinner-border-sm ms-2"></span>
              </h4>
              
              <h6 class="mt-3 mb-2 text-muted">
                Réservations à valider ({{ urgentReservations.length }})
              </h6>
              <ul class="list-group list-group-flush mb-3">
                <li v-for="res in urgentReservations" :key="res.idRes" class="list-group-item">
                  {{ getClientName(res) }} - 
                  {{ formatDate(res.debRes) }}
                  <span class="badge bg-warning float-end">À valider</span>
                </li>
                <li v-if="urgentReservations.length === 0" class="list-group-item text-muted">
                  Aucune réservation en attente
                </li>
              </ul>
              
              <h6 class="mb-2 text-muted">
                Locations Début/Fin ({{ todayEvents.length }})
              </h6>
              <ul class="list-group list-group-flush">
                <li v-for="event in todayEvents" :key="event.idRes" class="list-group-item">
                  {{ getClientName(event) }} - 
                  {{ event.type === 'start' ? 'Début' : 'Fin' }}
                  <span :class="`badge float-end ${event.type === 'start' ? 'bg-success' : 'bg-info'}`">
                    {{ event.type === 'start' ? 'Début' : 'Fin' }}
                  </span>
                </li>
                <li v-if="todayEvents.length === 0" class="list-group-item text-muted">
                  Aucun événement aujourd'hui
                </li>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import KpiCard from '../views/KpiCard.vue'; 
import RapportService from '../services/RapportService'; 
import LocationService from '../services/LocationService'; 
import AuthService from '../services/AuthService'; 

const userRole = ref('');
const router = useRouter(); 
const isAdmin = computed(() => userRole.value === 'ADMIN');

// Données
const kpis = ref({ 
  totalClients: 0, 
  locationsMois: 0, 
  revenuTotal: 0, 
  tauxOccupationSalle: 0,
  tauxOccupationMateriel: 0 
});
const allPendingReservations = ref([]);
const loading = ref({ kpis: false, reservations: false });

// Fonctions utilitaires
const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getClientName = (reservation) => {
  if (reservation.nomCli && reservation.prenomCli) {
    return `${reservation.nomCli} ${reservation.prenomCli}`;
  }
  return 'Client inconnu';
};

// Propriétés calculées
const urgentReservations = computed(() => {
  return allPendingReservations.value
    .filter(res => res.etatRes === 'En attente')
    .slice(0, 3);
});

const todayEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const events = [];
  
  allPendingReservations.value.forEach(res => {
    const debDate = res.debRes ? new Date(res.debRes).toISOString().split('T')[0] : null;
    const finDate = res.finRes ? new Date(res.finRes).toISOString().split('T')[0] : null;
    
    if (debDate === today) {
      events.push({
        ...res,
        type: 'start'
      });
    }
    if (finDate === today) {
      events.push({
        ...res,
        type: 'end'
      });
    }
  });
  
  return events;
});

// Fonctions de chargement
const fetchKPIs = async () => {
  try {
    loading.value.kpis = true;
    console.log('Début chargement KPIs...');
    const response = await RapportService.getKPIs();
    kpis.value = response.data;
    console.log('KPIs chargés:', response.data);
  } catch (error) {
    console.error("Erreur détaillée chargement KPIs:", error);
    // Données par défaut
    kpis.value = { 
      totalClients: 0, 
      locationsMois: 0, 
      revenuTotal: 0, 
      tauxOccupationSalle: 0,
      tauxOccupationMateriel: 0
    };
  } finally {
    loading.value.kpis = false;
  }
};

const fetchReservations = async () => {
  try {
    loading.value.reservations = true;
    console.log('Début chargement réservations...');
    const response = await LocationService.getPendingReservations();
    allPendingReservations.value = response.data;
    console.log('Réservations chargées:', response.data.length);
  } catch (error) {
    console.error("Erreur détaillée chargement réservations:", error);
    allPendingReservations.value = [];
  } finally {
    loading.value.reservations = false;
  }
};

// Initialisation
onMounted(() => {
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    fetchKPIs();
    fetchReservations();
  } else {
    router.push('/');
  }
});

function logout() {
  AuthService.logout();
  router.push('/');
}
</script>

<style scoped>
.d-flex.vh-100 {
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
}
</style>-->