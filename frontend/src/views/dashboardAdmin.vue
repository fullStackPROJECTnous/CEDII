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

        <li class="nav-item mb-2">
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
            <i class="bi bi-bank me-2"></i> Gestion Financière
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
              
              color="cedii-text-primary" 
              border-color="border-primary"
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-calendar-check" 
              title="Locations (Mois)" 
              :value="kpis.locationsMois" 
               
              color="text-success" 
              border-color="border-success"
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-bar-chart-line" 
              title="Taux Occup. Matériels" 
              :value="`${kpis.tauxOccupationMateriel}%`" 
              color="text-info" 
              border-color="border-info"
            />
          </div>
          <div class="col-md-3 mb-4">
            <KpiCard 
              icon="bi-bar-chart-line" 
              title="Taux Occup. Salles" 
              :value="`${kpis.tauxOccupationSalle}%`" 
              
              color="text-warning" 
              border-color="border-warning"
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
                <li v-for="res in urgentReservations" :key="res.idRes" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ getClientName(res) }}</strong> 
                    <small class="text-muted ms-2">{{ res.typeRes === 'Salle' ? 'Salle' : 'Matériel' }}</small>
                  </div>
                  <span class="badge" style="background-color:#001f3f; color:white;">
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
            <div class="card shadow-sm p-4 border-secondary border-2 h-100">
              <h4 class="card-title text-secondary">
                <i class="bi bi-pie-chart-fill me-2"></i>
                Distribution du Revenu par Type de Client
              </h4>
              <div class="chart-container d-flex justify-content-center align-items-center" style="height: 300px;">
                <canvas id="revenuePieChart" ref="revenuePieChart"></canvas>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import KpiCard from '../views/KpiCard.vue'; 
import RapportService from '../services/RapportService'; 
import LocationService from '../services/LocationService'; 
import AuthService from '../services/AuthService'; 

const router = useRouter(); 
const userRole = ref('');
const isAdmin = computed(() => userRole.value === 'ADMIN');

// Références Chart.js
const revenuePieChart = ref(null);
const chartInstance = ref(null);

// Enregistrement des composants Chart.js
Chart.register(...registerables);

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

// Données du graphique
const revenueData = {
  labels: ['Entreprises', 'Particuliers', 'ONG', 'Associations', 'Institutions Publiques'],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderColor: '#FFFFFF',
      borderWidth: 2
    }
  ]
};

// Fonctions du graphique
const initRevenueChart = () => {
  try {
    // Détruire l'ancien graphique si existe
    if (chartInstance.value && typeof chartInstance.value.destroy === 'function') {
      chartInstance.value.destroy();
    }

    const ctx = revenuePieChart.value?.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context non disponible');
      return;
    }

    // Créer le nouveau graphique
    chartInstance.value = new Chart(ctx, {
      type: 'doughnut',
      data: revenueData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}% (${formatCurrency(value * 10000)} Ar)`;
              }
            }
          }
        },
        cutout: '50%'
      }
    });
  } catch (error) {
    console.error('Erreur initialisation graphique:', error);
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount);
};

const loadRevenueData = async () => {
  try {
    // À remplacer par votre API réelle
    // const response = await ClientService.getRevenueByClientType();
    console.log('Chargement des données de revenus...');
  } catch (error) {
    console.error('Erreur chargement données revenus:', error);
  }
};

// Fonctions utilitaires
const formatDateSimple = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getClientName = (reservation) => {
  if (reservation.Client && reservation.Client.idCli) {
    return `${reservation.Client.idCli}`;
  }
  if (reservation.idCli) {
    return `${reservation.idCli}`;
  }
  return 'Client inconnu';
};

// Propriétés calculées
const urgentReservations = computed(() => {
  return allPendingReservations.value
    .filter(res => res.etatRes === 'En attente')
    .sort((a, b) => new Date(a.debRes) - new Date(b.debRes))
    .slice(0, 5);
});

const todayEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const events = [];
  
  allPendingReservations.value.forEach(res => {
    const debDate = res.debRes ? new Date(res.debRes).toISOString().split('T')[0] : null;
    const finDate = res.finRes ? new Date(res.finRes).toISOString().split('T')[0] : null;
    
    if (res.etatRes === 'Confirmée') {
      if (debDate === today) {
        events.push({ ...res, type: 'start' });
      }
      if (finDate === today) {
        events.push({ ...res, type: 'end' });
      }
    }
  });
  
  return events;
});

// Fonctions de chargement
const fetchKPIs = async () => {
  try {
    loading.value.kpis = true;
    const response = await RapportService.getKPIs();
    kpis.value = response.data;
  } catch (error) {
    console.error("Erreur chargement KPIs:", error);
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
    const response = await LocationService.getPendingReservations();
    allPendingReservations.value = response.data;
  } catch (error) {
    console.error("Erreur chargement réservations:", error);
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
    
    setTimeout(() => {
      initRevenueChart();
      loadRevenueData();
    }, 500);
  } else {
    router.push('/');
  }
});

onUnmounted(() => {
  if (chartInstance.value && typeof chartInstance.value.destroy === 'function') {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};
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

.chart-container {
  position: relative;
  min-height: 300px;
}

.card {
  border-radius: 12px;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
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
  color: #02061E !important;
  font-weight: 600; 
}

.sidebar .nav-link:hover, .sidebar .nav-link.active {
  background-color: var(--cedii-primary-dark, white);
}

.sidebar .nav-link.active { 
  color: purple !important;
  font-weight: 600; 
}

.main-content {
  flex-grow: 1; 
}

/* Bordures personnalisées pour les KPI */
.border-primary {
  border: 2px solid #007bff !important;
}

.border-success {
  border: 2px solid #28a745 !important;
}

.border-info {
  border: 2px solid #17a2b8 !important;
}

.border-warning {
  border: 2px solid #ffc107 !important;
}

.border-danger {
  border: 3px solid #dc3545 !important;
}

.border-secondary {
  border: 2px solid #6c757d !important;
}
</style>