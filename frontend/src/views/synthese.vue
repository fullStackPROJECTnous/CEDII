<!--

<template>
  <div class="dashboard-wrapper">
    <n-layout has-sider class="h-100">
      <!-- Sidebar Naive UI 
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        show-trigger="bar"
        class="custom-sidebar"
      >
        <div class="sidebar-content d-flex flex-column h-100 p-3">
          <!-- Logo et Titre 
          <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
            <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
            <h4 class="sidebar-title mb-0 fs-6">CEDII Finance</h4>
          </div>
          
          <!-- Menu Navigation 
          <n-menu
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
            class="flex-grow-1 custom-menu"
          />
          
          <!-- Bouton Déconnexion 
          <div class="mt-auto pt-3 border-top border-white">
            <n-button 
              @click="logout" 
              type="error"
              size="small"
              class="w-100"
              ghost
            >
              <template #icon>
                <i class="bi bi-box-arrow-right"></i>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal 
      <n-layout class="main-content">
        <!-- Header 
        <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
  <div>
            <n-button 
              @click="goBack" 
              type="default"
              size="small"
              class="btn-back"
            >
              <template #icon>
                <i class="bi bi-arrow-left me-1"></i>
              </template>
              Retour
            </n-button>
          </div>
          <div class="text-center">
            <h2 class="custom-subtitle mb-1">
              Rapports et Synthèse Financière
            </h2>
            <p class="text-white-50 mb-0">Analyse complète des performances financières</p>
          </div>
          <!-- Menu trois points 
          <div class="position-relative">
            <n-dropdown
              trigger="click"
              :options="navigationOptions"
              @select="handleNavigationSelect"
              placement="bottom-end"
            >
              <n-button type="primary" size="small" class="custom-btn-primary">
                <i class="bi bi-three-dots-vertical"></i>
              </n-button>
            </n-dropdown>
          </div>
          <n-tag type="info" size="small" class="custom-tag">
            Rôle: {{ userRole }}
          </n-tag>
        </n-layout-header>

        <!-- Contenu 
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4">
            <!-- Conteneur principal avec scroll 
            <div class="main-content-wrapper">
              <div v-if="isLoading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Préparation des données financières...</p>
              </div>

              <div v-else>
                <!-- Cartes de statistiques principales 
                <div class="row mb-4">
                  <!-- Revenus Totaux 
                  <div class="col-md-4 mb-3">
                    <n-card class="custom-card-success h-100" size="small">
                      <div class="d-flex align-items-center">
                        <div class="custom-icon-success me-3">
                          <i class="bi bi-wallet2 text-white"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 text-white">Revenus Totaux</h6>
                          <h4 class="mb-0 text-success">{{ formatCurrency(rapportData.totalRevenue) }}</h4>
                        </div>
                      </div>
                    </n-card>
                  </div>

                  <!-- Montant en Attente 
                  <div class="col-md-4 mb-3">
                    <n-card class="custom-card-warning h-100" size="small">
                      <div class="d-flex align-items-center">
                        <div class="custom-icon-warning me-3">
                          <i class="bi bi-clock text-white"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 text-white">Montant en Attente</h6>
                          <h4 class="mb-0 text-warning">{{ formatCurrency(rapportData.pendingAmount) }}</h4>
                        </div>
                      </div>
                    </n-card>
                  </div>
                  
                  <!-- Locations Actives 
                  <div class="col-md-4 mb-3">
                    <n-card class="custom-card-primary h-100" size="small">
                      <div class="d-flex align-items-center">
                        <div class="custom-icon-primary me-3">
                          <i class="bi bi-geo-alt text-white"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 text-white">Locations Actives</h6>
                          <h4 class="mb-0 text-info">{{ rapportData.activeLocationsCount }}</h4>
                        </div>
                      </div>
                    </n-card>
                  </div>
                </div>

                <!-- Ligne des Graphiques et Distributions 
                <div class="row">
                  <!-- Distribution des Moyens de Paiement 
                  <div class="col-lg-6 mb-4">
                    <n-card class="shadow-lg" title="Distribution des Moyens de Paiement">
                      <template #header-extra>
                        <n-tag type="info" class="custom-tag">{{ rapportData.paymentMethodDistribution?.length || 0 }} méthodes</n-tag>
                      </template>
                      
                      <p class="text-muted mb-3">Répartition des transactions payées</p>
                      
                      <n-list class="custom-list">
                        <n-list-item v-for="method in rapportData.paymentMethodDistribution" :key="method.modePaie" class="custom-list-item">
                          <template #prefix>
                            <div class="custom-icon-primary-small">
                              <i class="bi bi-credit-card text-white"></i>
                            </div>
                          </template>
                          
                          <n-thing
                            :title="method.modePaie || 'Inconnu'"
                            :description="`${method.count} transactions`"
                          />
                          
                          <template #suffix>
                            <n-tag type="primary" class="custom-tag">
                              {{ Math.round((method.count / totalTransactions) * 100) || 0 }}%
                            </n-tag>
                          </template>
                        </n-list-item>
                        
                        <n-list-item v-if="!rapportData.paymentMethodDistribution || rapportData.paymentMethodDistribution.length === 0" class="custom-list-item">
                          <div class="text-center text-muted py-3">
                            <i class="bi bi-credit-card me-2"></i>Aucune donnée de paiement validée
                          </div>
                        </n-list-item>
                      </n-list>
                    </n-card>
                  </div>

                  <!-- Tendance des Revenus (Graphique) 
                  <div class="col-lg-6 mb-4">
                    <n-card class="shadow-lg" title="Tendance des Revenus (12 derniers mois)">
                      <template #header-extra>
                        <n-tag type="info" class="custom-tag">{{ monthlyTrend.length }} mois</n-tag>
                      </template>
                      
                      <div class="chart-container" style="height: 300px; position: relative;">
                        <!-- Canvas avec ID explicite et dimensions fixes 
                        <canvas 
                          ref="chartCanvas" 
                          id="revenueChart"
                          style="width: 100%; height: 100%;"
                        ></canvas>
                        
                        <div v-if="monthlyTrend && monthlyTrend.length === 0" class="text-center p-5 text-muted position-absolute top-50 start-50 translate-middle">
                          <i class="bi bi-bar-chart-line me-2"></i> Aucune donnée de revenus disponible
                        </div>
                      </div>
                    </n-card>
                  </div>
                </div>

                <!-- Section statistiques détaillées 
                <div class="row mt-3">
                  <div class="col-12">
                    <n-card class="shadow-lg" title="Indicateurs de Performance">
                      <div class="row text-center">
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-cash-coin text-primary fs-1 mb-2"></i>
                            <h5 class="text-muted">Taux de Conversion</h5>
                            <h4 class="text-success">{{ calculateConversionRate() }}%</h4>
                          </div>
                        </div>
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-graph-up-arrow text-success fs-1 mb-2"></i>
                            <h5 class="text-muted">Croissance Mensuelle</h5>
                            <h4 class="text-info">{{ calculateMonthlyGrowth() }}%</h4>
                          </div>
                        </div>
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-clock-history text-warning fs-1 mb-2"></i>
                            <h5 class="text-muted">Délai Moyen Paiement</h5>
                            <h4 class="text-warning">{{ averagePaymentDelay }} jours</h4>
                          </div>
                        </div>
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-check-circle text-success fs-1 mb-2"></i>
                            <h5 class="text-muted">Taux de Réussite</h5>
                            <h4 class="text-success">98%</h4>
                          </div>
                        </div>
                      </div>
                    </n-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch, h, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag, 
  NCard, 
  NBadge,
  NList, 
  NListItem, 
  NThing,
  NDropdown
} from 'naive-ui';

import AuthService from '../services/AuthService'; 
import FinanceService from '../services/FinanceService'; 
import Chart from 'chart.js/auto'; 

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const activeMenuKey = ref('rapports');

// Options du menu avec texte blanc
const menuOptions = [
  {
    label: () => h('span', { class: 'text-white' }, 'Tableau de Bord'),
    key: 'dashboard',
    icon: renderIcon('bi-wallet-fill')
  },
  {
    label: () => h('div', {
      class: 'd-flex justify-content-between align-items-center w-100'
    }, [
      h('span', { class: 'text-white' }, 'Facturation & Génération'),
      invoicesToProcess.value > 0 ? h(NBadge, {
        value: invoicesToProcess.value,
        type: 'info',
        max: 99,
        class: 'ms-2 custom-badge'
      }) : null
    ]),
    key: 'facturation',
    icon: renderIcon('bi-file-earmark-text')
  },
  {
    label: () => h('div', {
      class: 'd-flex justify-content-between align-items-center w-100'
    }, [
      h('span', { class: 'text-white' }, 'Suivi des Paiements'),
      pendingPaymentsCount.value > 0 ? h(NBadge, {
        value: pendingPaymentsCount.value,
        type: 'warning',
        max: 99,
        class: 'ms-2 custom-badge'
      }) : null
    ]),
    key: 'paiements',
    icon: renderIcon('bi-cash-stack')
  },
  {
    label: () => h('div', {
      class: 'd-flex justify-content-between align-items-center w-100'
    }, [
      h('span', { class: 'text-white' }, 'Pénalités'),
      litigeCount.value > 0 ? h(NBadge, {
        value: litigeCount.value,
        type: 'error',
        max: 99,
        class: 'ms-2 custom-badge'
      }) : null
    ]),
    key: 'penalites',
    icon: renderIcon('bi-exclamation-octagon-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Rapports & Synthèse'),
    key: 'rapports',
    icon: renderIcon('bi-graph-up')
  }
];

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}



// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'dashboard': 'FinanceDashboard',
    'facturation': 'FactureGene',
    'paiements': 'SuiviPaie',
    'penalites': 'PenaliteLiti',
    'rapports': 'RapportSynth'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Options du menu de navigation trois points
const navigationOptions = [
  {
    label: 'Facturation',
    key: 'fact',
    icon: () => h('i', { class: 'bi-file-earmark-text' })
  },
  {
    label: 'Suivi des paiements',
    key: 'suiviPaie',
    icon: () => h('i', { class: 'bi-cash-stack' })
  },
  {
    label: 'Penalités $ Litiges',
    key: 'penaliteLiti',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu trois points
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': 'FinanceDashboard',
    'fact': 'FactureGene',
    'suiviPaie': 'SuiviPaie',
    'penaliteLiti': 'PenaliteLiti'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// --- Variables d'état ---
const rapportData = ref({
  totalRevenue: 0,
  pendingAmount: 0,
  activeLocationsCount: 0,
  paymentMethodDistribution: [],
  averagePaymentDelay: 0
});
const isLoading = ref(true);
const monthlyTrend = ref([]);
let revenueChartInstance = null;
const chartCanvas = ref(null);

// Données réactives du tableau de bord
const kpis = ref({ 
  monthlyRevenue: 0,
  pendingAmount: 0,
  avgDaysLate: 0,
  autoPaymentRate: '0%'
});

const pendingPaymentsCount = ref(0);
const invoicesToSend = ref([]);
const pendingPenalties = ref([]);

// Propriétés calculées pour le tableau de bord
const invoicesToProcess = computed(() => invoicesToSend.value.length);
const litigeCount = computed(() => pendingPenalties.value.length);

// --- Propriétés calculées pour les rapports ---
const totalTransactions = computed(() => {
  if (!rapportData.value.paymentMethodDistribution) return 0;
  return rapportData.value.paymentMethodDistribution.reduce((sum, method) => sum + method.count, 0);
});

const averagePaymentDelay = computed(() => {
  return rapportData.value.averagePaymentDelay || 3;
});

// Fonction pour formater en Malagasy Ariary (MGA)
const formatCurrency = (value) => {
  const numValue = parseFloat(value); 
  if (isNaN(numValue)) return '0 Ar'; 
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

// --- Calcul des indicateurs ---
const calculateConversionRate = () => {
  const total = parseFloat(rapportData.value.totalRevenue || 0);
  const pending = parseFloat(rapportData.value.pendingAmount || 0);
  if (total + pending === 0) return 0;
  return Math.round((total / (total + pending)) * 100);
};

// Fonction pour retourner en arrière
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1); // Retourne d'une page dans l'historique
  } else {
    // Si pas d'historique, redirige vers le tableau de bord
    router.push({ name: 'FinanceDashboard' });
  }
};

const calculateMonthlyGrowth = () => {
  if (monthlyTrend.value.length < 2) return 0;
  const current = monthlyTrend.value[monthlyTrend.value.length - 1]?.totalMensuel || 0;
  const previous = monthlyTrend.value[monthlyTrend.value.length - 2]?.totalMensuel || 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// --- Fonctions du tableau de bord ---
const fetchFinanceData = async () => {
  try {
    const response = await FinanceService.getFinanceDashboardData();
    const data = response.data;

    pendingPaymentsCount.value = data.pendingPaymentsCount || 0;
    kpis.value.pendingAmount = data.pendingAmount || 0;
    kpis.value.monthlyRevenue = data.monthlyRevenue || 0;
    kpis.value.avgDaysLate = data.avgDaysLate || 0;
    kpis.value.autoPaymentRate = data.autoPaymentRate || '0%';
    invoicesToSend.value = data.invoicesToSend || [];
    pendingPenalties.value = data.pendingPenalties || [];

  } catch (error) {
    console.error("Erreur lors du chargement des données financières:", error);
    pendingPaymentsCount.value = 0;
    kpis.value.pendingAmount = 0;
  }
};

const fetchRapportsData = async () => {
  try {
    const response = await FinanceService.getRapportsData();
    rapportData.value = response.data;
    console.log('📊 Données réelles chargées:', rapportData.value);
  } catch (error) {
    console.error("ERREUR CRITIQUE - Impossible de charger les données:", error);
    rapportData.value = {
      totalRevenue: 0,
      pendingAmount: 0,
      activeLocationsCount: 0,
      paymentMethodDistribution: [],
      averagePaymentDelay: 0
    };
  }
};

const fetchMonthlyTrend = async () => {
  try {
    const response = await FinanceService.getMonthlyRevenue();
    monthlyTrend.value = response.data;
    console.log('📈 Tendance mensuelle chargée:', monthlyTrend.value);
    
    await nextTick();
    
    if (chartCanvas.value) {
      renderRevenueChart();
    } else {
      setTimeout(() => {
        if (chartCanvas.value) {
          renderRevenueChart();
        }
      }, 100);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la tendance mensuelle:", error);
    monthlyTrend.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- Fonction de Rendu du Graphique ---
const renderRevenueChart = () => {
  console.log('🔄 Début du rendu du graphique...');
  
  if (typeof Chart === 'undefined') {
    console.error("Erreur: Chart.js n'est pas disponible.");
    return;
  }

  const canvasElement = chartCanvas.value;
  if (!canvasElement) {
    console.error("❌ L'élément canvas est introuvable");
    return;
  }

  if (revenueChartInstance) {
    console.log('🗑️ Destruction instance précédente du graphique');
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  if (!monthlyTrend.value || monthlyTrend.value.length === 0) {
    console.warn('⚠️ Aucune donnée pour le graphique');
    return;
  }

  try {
    const ctx = canvasElement.getContext('2d');
    
    const labels = monthlyTrend.value.map(item => `${item.moisNom} ${item.annee}`);
    const dataValues = monthlyTrend.value.map(item => item.totalMensuel);

    console.log('📊 Données du graphique:', { labels, dataValues });

    revenueChartInstance = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenus Mensuels (Ar)',
          data: dataValues,
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          borderColor: 'rgba(78, 115, 223, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Revenus: ${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Montant (MGA)'
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value); 
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mois/Année'
            }
          }
        }
      }
    });

    console.log('✅ Graphique rendu avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du rendu du graphique:', error);
  }
};

// Surveiller les changements de données
watch(monthlyTrend, (newValue) => {
  if (newValue && newValue.length > 0) {
    console.log('🔄 Données mensuelles mises à jour, re-rendu du graphique');
    setTimeout(() => {
      if (chartCanvas.value) {
        renderRevenueChart();
      }
    }, 100);
  }
});

// Logout
const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// --- Initialisation ---
onMounted(async () => {
  console.log('🚀 Composant Synthese monté');
  
  const user = AuthService.getCurrentUser();
  
  if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
    userRole.value = user.roleUti.toUpperCase();
    
    // Charger les données du tableau de bord
    fetchFinanceData();
    
    // Définir l'élément de menu actif basé sur la route actuelle
    const routeToKeyMap = {
      'FinanceDashboard': 'dashboard',
      'FactureGene': 'facturation',
      'SuiviPaie': 'paiements',
      'PenaliteLiti': 'penalites',
      'RapportSynth': 'rapports'
    };
    
    activeMenuKey.value = routeToKeyMap[route.name] || 'rapports';
    
    // Charger les données des rapports
    await Promise.all([
      fetchRapportsData(),
      fetchMonthlyTrend()
    ]);
    
    console.log('✅ Toutes les données chargées');
  } else {
    router.push('/'); 
  }
});

// Nettoyage
onUnmounted(() => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }
});
</script>

<style scoped>
/* COULEURS ORIGINALES */

.dashboard-wrapper {
  height: 100vh;
}

/* Sidebar en bleu nuit */
.custom-sidebar {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  background: transparent;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.sidebar-title {
  color: white !important;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Styles pour le menu */
:deep(.custom-menu) {
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
  color: white !important;
  transition: all 0.3s ease;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
  color: white !important;
  font-weight: 600;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.custom-badge {
  font-weight: 600;
}

/* Header */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-subtitle {
  color: white;
  font-weight: 600;
  margin: 0;
  font-size: 1.2rem;
}

/* Conteneur principal avec scroll */
.main-content-wrapper {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Scrollbar personnalisée pour le conteneur principal */
.main-content-wrapper::-webkit-scrollbar {
  width: 10px;
}

.main-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
  border: 2px solid #f1f1f1;
}

.main-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Cartes avec couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, gray 0%, gray 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, black 0%, black 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

/* Icônes avec fond original */
.custom-icon-primary, 
.custom-icon-success,
.custom-icon-warning {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

.custom-icon-primary-small {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: rgba(0, 123, 255, 0.2);
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Boutons */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* Listes */
.custom-list {
  background: transparent;
}

.custom-list-item {
  border-bottom: 1px solid #dee2e6;
}

/* Conteneur de graphique */
.chart-container {
  position: relative;
  min-height: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-subtitle {
    font-size: 1rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-success,
  .custom-icon-warning {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .chart-container {
    height: 250px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 200px);
    padding-right: 5px;
  }
}

@media (max-width: 576px) {
  .main-content-wrapper {
    max-height: calc(100vh - 180px);
  }
}

/* Styles pour les indicateurs */
.border.rounded {
  transition: all 0.3s ease;
}

.border.rounded:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fs-1 {
  font-size: 2.5rem !important;
}

/* Assurer que le canvas est visible */
canvas {
  display: block;
  max-width: 100%;
}

/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Amélioration de l'espacement général */
.main-content {
  overflow-y: auto;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* Bordure de séparation */
.border-top.border-white {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

/* Styles pour les cartes */
:deep(.n-card .n-card-header) {
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
}

:deep(.n-card .n-card-content) {
  padding: 16px;
}
</style>-->


<template>
  <div class="dashboard-wrapper">
    <n-layout has-sider class="h-100">
      <!-- Sidebar Naive UI -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        show-trigger="bar"
        class="custom-sidebar"
      >
        <div class="sidebar-content d-flex flex-column h-100 p-3">
          <!-- Logo et Titre -->
          <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
            <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
            <h4 class="sidebar-title mb-0 fs-6">CEDII Finance</h4>
          </div>
          
          <!-- Menu Navigation -->
          <n-menu
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
            class="flex-grow-1 custom-menu"
          />
          
          <!-- Bouton Déconnexion -->
          <div class="mt-auto pt-3 border-top border-white">
            <n-button 
              @click="logout" 
              type="error"
              size="small"
              class="w-100"
              ghost
            >
              <template #icon>
                <i class="bi bi-box-arrow-right"></i>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">
        <!-- Header -->
        <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
          <div>
            <n-button 
              @click="goBack" 
              type="default"
              size="small"
              class="btn-back"
            >
              <template #icon>
                <i class="bi bi-arrow-left me-1"></i>
              </template>
              Retour
            </n-button>
          </div>
          <div class="text-center">
            <h2 class="custom-subtitle mb-1">
              Rapports et Synthèse Financière
            </h2>
            <p class="text-white-50 mb-0">Analyse complète des performances financières</p>
          </div>
          <!-- Menu trois points -->
          <div class="position-relative">
            <n-dropdown
              trigger="click"
              :options="navigationOptions"
              @select="handleNavigationSelect"
              placement="bottom-end"
            >
              <n-button type="primary" size="small" class="custom-btn-primary">
                <i class="bi bi-three-dots-vertical"></i>
              </n-button>
            </n-dropdown>
          </div>
          <n-tag type="info" size="small" class="custom-tag">
            Rôle: {{ userRole }}
          </n-tag>
        </n-layout-header>

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4">
            <!-- Conteneur principal avec scroll -->
            <div class="main-content-wrapper">
              <div v-if="isLoading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Préparation des données financières...</p>
              </div>

              <div v-else>
                <!-- Cartes de statistiques principales -->
                <div class="row mb-4">
                  <!-- Revenus Totaux -->
                  <div class="col-md-4 mb-3">
                    <n-card class="custom-card-success h-100" size="small">
                      <div class="d-flex align-items-center">
                        <div class="custom-icon-success me-3">
                          <i class="bi bi-wallet2 text-white"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 text-white">Revenus Totaux</h6>
                          <h4 class="mb-0 text-success">{{ formatCurrency(rapportData.totalRevenue) }}</h4>
                        </div>
                      </div>
                    </n-card>
                  </div>

                  <!-- Montant en Attente -->
                  <div class="col-md-4 mb-3">
                    <n-card class="custom-card-warning h-100" size="small">
                      <div class="d-flex align-items-center">
                        <div class="custom-icon-warning me-3">
                          <i class="bi bi-clock text-white"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 text-white">Montant en Attente</h6>
                          <h4 class="mb-0 text-warning">{{ formatCurrency(rapportData.pendingAmount) }}</h4>
                        </div>
                      </div>
                    </n-card>
                  </div>
                  
                  <!-- Locations Actives -->
                  <div class="col-md-4 mb-3">
                    <n-card class="custom-card-primary h-100" size="small">
                      <div class="d-flex align-items-center">
                        <div class="custom-icon-primary me-3">
                          <i class="bi bi-geo-alt text-white"></i>
                        </div>
                        <div>
                          <h6 class="mb-1 text-white">Locations Actives</h6>
                          <h4 class="mb-0 text-info">{{ rapportData.activeLocationsCount }}</h4>
                        </div>
                      </div>
                    </n-card>
                  </div>
                </div>

                <!-- Ligne des Graphiques et Distributions -->
                <div class="row">
                  <!-- Distribution des Moyens de Paiement -->
                  <div class="col-lg-6 mb-4">
                    <n-card class="shadow-lg" title="Distribution des Moyens de Paiement">
                      <template #header-extra>
                        <n-tag type="info" class="custom-tag">{{ normalizedPaymentMethods.length }} méthodes</n-tag>
                      </template>
                      
                      <p class="text-muted mb-3">Répartition des transactions payées</p>
                      
                      <n-list class="custom-list">
                        <n-list-item v-for="method in normalizedPaymentMethods" :key="method.modePaie" class="custom-list-item">
                          <template #prefix>
                            <div class="custom-icon-primary-small">
                              <i class="bi bi-credit-card text-white"></i>
                            </div>
                          </template>
                          
                          <!-- MODIFICATION ICI: Utilisation des méthodes normalisées -->
                          <n-thing
                            :title="method.displayName"
                            :description="`${method.count} transactions`"
                          />
                          
                          <template #suffix>
                            <n-tag type="primary" class="custom-tag">
                              {{ Math.round((method.count / totalTransactions) * 100) || 0 }}%
                            </n-tag>
                          </template>
                        </n-list-item>
                        
                        <n-list-item v-if="!normalizedPaymentMethods || normalizedPaymentMethods.length === 0" class="custom-list-item">
                          <div class="text-center text-muted py-3">
                            <i class="bi bi-credit-card me-2"></i>Aucune donnée de paiement validée
                          </div>
                        </n-list-item>
                      </n-list>
                    </n-card>
                  </div>

                  <!-- Tendance des Revenus (Graphique) -->
                  <div class="col-lg-6 mb-4">
                    <n-card class="shadow-lg" title="Tendance des Revenus (12 derniers mois)">
                      <template #header-extra>
                        <n-tag type="info" class="custom-tag">{{ monthlyTrend.length }} mois</n-tag>
                      </template>
                      
                      <div class="chart-container" style="height: 300px; position: relative;">
                        <!-- Canvas avec ID explicite et dimensions fixes -->
                        <canvas 
                          ref="chartCanvas" 
                          id="revenueChart"
                          style="width: 100%; height: 100%;"
                        ></canvas>
                        
                        <div v-if="monthlyTrend && monthlyTrend.length === 0" class="text-center p-5 text-muted position-absolute top-50 start-50 translate-middle">
                          <i class="bi bi-bar-chart-line me-2"></i> Aucune donnée de revenus disponible
                        </div>
                      </div>
                    </n-card>
                  </div>
                </div>

                <!-- Section statistiques détaillées -->
                <div class="row mt-3">
                  <div class="col-12">
                    <n-card class="shadow-lg" title="Indicateurs de Performance">
                      <div class="row text-center">
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-cash-coin text-primary fs-1 mb-2"></i>
                            <h5 class="text-muted">Taux de Conversion</h5>
                            <h4 class="text-success">{{ calculateConversionRate() }}%</h4>
                          </div>
                        </div>
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-graph-up-arrow text-success fs-1 mb-2"></i>
                            <h5 class="text-muted">Croissance Mensuelle</h5>
                            <h4 class="text-info">{{ calculateMonthlyGrowth() }}%</h4>
                          </div>
                        </div>
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-clock-history text-warning fs-1 mb-2"></i>
                            <h5 class="text-muted">Délai Moyen Paiement</h5>
                            <h4 class="text-warning">{{ averagePaymentDelay }} jours</h4>
                          </div>
                        </div>
                        <div class="col-md-3 mb-3">
                          <div class="border rounded p-3">
                            <i class="bi bi-check-circle text-success fs-1 mb-2"></i>
                            <h5 class="text-muted">Taux de Réussite</h5>
                            <h4 class="text-success">98%</h4>
                          </div>
                        </div>
                      </div>
                    </n-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch, h, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag, 
  NCard, 
  NBadge,
  NList, 
  NListItem, 
  NThing,
  NDropdown
} from 'naive-ui';

import AuthService from '../services/AuthService'; 
import FinanceService from '../services/FinanceService'; 
import Chart from 'chart.js/auto'; 

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const activeMenuKey = ref('rapports');

// Options du menu avec texte blanc
const menuOptions = [
  {
    label: () => h('span', { class: 'text-white' }, 'Tableau de Bord'),
    key: 'dashboard',
    icon: renderIcon('bi-wallet-fill')
  },
  {
    label: () => h('div', {
      class: 'd-flex justify-content-between align-items-center w-100'
    }, [
      h('span', { class: 'text-white' }, 'Facturation & Génération'),
      invoicesToProcess.value > 0 ? h(NBadge, {
        value: invoicesToProcess.value,
        type: 'info',
        max: 99,
        class: 'ms-2 custom-badge'
      }) : null
    ]),
    key: 'facturation',
    icon: renderIcon('bi-file-earmark-text')
  },
  {
    label: () => h('div', {
      class: 'd-flex justify-content-between align-items-center w-100'
    }, [
      h('span', { class: 'text-white' }, 'Suivi des Paiements'),
      pendingPaymentsCount.value > 0 ? h(NBadge, {
        value: pendingPaymentsCount.value,
        type: 'warning',
        max: 99,
        class: 'ms-2 custom-badge'
      }) : null
    ]),
    key: 'paiements',
    icon: renderIcon('bi-cash-stack')
  },
  {
    label: () => h('div', {
      class: 'd-flex justify-content-between align-items-center w-100'
    }, [
      h('span', { class: 'text-white' }, 'Pénalités'),
      litigeCount.value > 0 ? h(NBadge, {
        value: litigeCount.value,
        type: 'error',
        max: 99,
        class: 'ms-2 custom-badge'
      }) : null
    ]),
    key: 'penalites',
    icon: renderIcon('bi-exclamation-octagon-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Rapports & Synthèse'),
    key: 'rapports',
    icon: renderIcon('bi-graph-up')
  }
];

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'dashboard': 'FinanceDashboard',
    'facturation': 'FactureGene',
    'paiements': 'SuiviPaie',
    'penalites': 'PenaliteLiti',
    'rapports': 'RapportSynth'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Options du menu de navigation trois points
const navigationOptions = [
  {
    label: 'Facturation',
    key: 'fact',
    icon: () => h('i', { class: 'bi-file-earmark-text' })
  },
  {
    label: 'Suivi des paiements',
    key: 'suiviPaie',
    icon: () => h('i', { class: 'bi-cash-stack' })
  },
  {
    label: 'Penalités $ Litiges',
    key: 'penaliteLiti',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu trois points
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': 'FinanceDashboard',
    'fact': 'FactureGene',
    'suiviPaie': 'SuiviPaie',
    'penaliteLiti': 'PenaliteLiti'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// --- Variables d'état ---
const rapportData = ref({
  totalRevenue: 0,
  pendingAmount: 0,
  activeLocationsCount: 0,
  paymentMethodDistribution: [],
  averagePaymentDelay: 0
});
const isLoading = ref(true);
const monthlyTrend = ref([]);
let revenueChartInstance = null;
const chartCanvas = ref(null);

// Données réactives du tableau de bord
const kpis = ref({ 
  monthlyRevenue: 0,
  pendingAmount: 0,
  avgDaysLate: 0,
  autoPaymentRate: '0%'
});

const pendingPaymentsCount = ref(0);
const invoicesToSend = ref([]);
const pendingPenalties = ref([]);

// Propriétés calculées pour le tableau de bord
const invoicesToProcess = computed(() => invoicesToSend.value.length);
const litigeCount = computed(() => pendingPenalties.value.length);

// --- MODIFICATION IMPORTANTE: Propriété calculée pour normaliser les méthodes de paiement ---
const normalizedPaymentMethods = computed(() => {
  if (!rapportData.value.paymentMethodDistribution || !Array.isArray(rapportData.value.paymentMethodDistribution)) {
    return [];
  }
  
  // Créer une copie profonde des données
  const methods = JSON.parse(JSON.stringify(rapportData.value.paymentMethodDistribution));
  
  // Regrouper et transformer les données
  const methodMap = new Map();
  
  methods.forEach(method => {
    const originalMethod = method.modePaie || 'Inconnu';
    const methodLower = originalMethod.toString().toLowerCase().trim();
    
    // Déterminer le nom d'affichage
    let displayName = originalMethod;
    
    // Remplacer "inconnu" par "Chèque"
    if (methodLower === 'inconnu' || methodLower === 'unknown' || methodLower === 'non spécifié') {
      displayName = 'Chèque';
    }
    
    // Si cette méthode existe déjà dans la map, ajouter le count
    if (methodMap.has(displayName)) {
      const existing = methodMap.get(displayName);
      existing.count += method.count;
    } else {
      // Sinon, créer une nouvelle entrée
      methodMap.set(displayName, {
        modePaie: displayName,
        displayName: displayName,
        count: method.count
      });
    }
  });
  
  // Convertir la map en tableau
  return Array.from(methodMap.values());
});

// --- Propriétés calculées pour les rapports ---
const totalTransactions = computed(() => {
  return normalizedPaymentMethods.value.reduce((sum, method) => sum + method.count, 0);
});

const averagePaymentDelay = computed(() => {
  return rapportData.value.averagePaymentDelay || 3;
});

// Fonction pour formater en Malagasy Ariary (MGA)
const formatCurrency = (value) => {
  const numValue = parseFloat(value); 
  if (isNaN(numValue)) return '0 Ar'; 
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

// --- Calcul des indicateurs ---
const calculateConversionRate = () => {
  const total = parseFloat(rapportData.value.totalRevenue || 0);
  const pending = parseFloat(rapportData.value.pendingAmount || 0);
  if (total + pending === 0) return 0;
  return Math.round((total / (total + pending)) * 100);
};

// Fonction pour retourner en arrière
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push({ name: 'FinanceDashboard' });
  }
};

const calculateMonthlyGrowth = () => {
  if (monthlyTrend.value.length < 2) return 0;
  const current = monthlyTrend.value[monthlyTrend.value.length - 1]?.totalMensuel || 0;
  const previous = monthlyTrend.value[monthlyTrend.value.length - 2]?.totalMensuel || 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// --- Fonctions du tableau de bord ---
const fetchFinanceData = async () => {
  try {
    const response = await FinanceService.getFinanceDashboardData();
    const data = response.data;

    pendingPaymentsCount.value = data.pendingPaymentsCount || 0;
    kpis.value.pendingAmount = data.pendingAmount || 0;
    kpis.value.monthlyRevenue = data.monthlyRevenue || 0;
    kpis.value.avgDaysLate = data.avgDaysLate || 0;
    kpis.value.autoPaymentRate = data.autoPaymentRate || '0%';
    invoicesToSend.value = data.invoicesToSend || [];
    pendingPenalties.value = data.pendingPenalties || [];

  } catch (error) {
    console.error("Erreur lors du chargement des données financières:", error);
    pendingPaymentsCount.value = 0;
    kpis.value.pendingAmount = 0;
  }
};

const fetchRapportsData = async () => {
  isLoading.value = true;
  try {
    const response = await FinanceService.getRapportsData();
    rapportData.value = response.data;
    console.log('📊 Données réelles chargées:', rapportData.value);
    console.log('📊 Distribution des paiements brute:', rapportData.value.paymentMethodDistribution);
    console.log('📊 Distribution des paiements normalisée:', normalizedPaymentMethods.value);
  } catch (error) {
    console.error("ERREUR CRITIQUE - Impossible de charger les données:", error);
    rapportData.value = {
      totalRevenue: 0,
      pendingAmount: 0,
      activeLocationsCount: 0,
      paymentMethodDistribution: [],
      averagePaymentDelay: 0
    };
  }
};

const fetchMonthlyTrend = async () => {
  try {
    const response = await FinanceService.getMonthlyRevenue();
    monthlyTrend.value = response.data;
    console.log('📈 Tendance mensuelle chargée:', monthlyTrend.value);
    
    await nextTick();
    
    if (chartCanvas.value) {
      renderRevenueChart();
    } else {
      setTimeout(() => {
        if (chartCanvas.value) {
          renderRevenueChart();
        }
      }, 100);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la tendance mensuelle:", error);
    monthlyTrend.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- Fonction de Rendu du Graphique ---
const renderRevenueChart = () => {
  console.log('🔄 Début du rendu du graphique...');
  
  if (typeof Chart === 'undefined') {
    console.error("Erreur: Chart.js n'est pas disponible.");
    return;
  }

  const canvasElement = chartCanvas.value;
  if (!canvasElement) {
    console.error("❌ L'élément canvas est introuvable");
    return;
  }

  if (revenueChartInstance) {
    console.log('🗑️ Destruction instance précédente du graphique');
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  if (!monthlyTrend.value || monthlyTrend.value.length === 0) {
    console.warn('⚠️ Aucune donnée pour le graphique');
    return;
  }

  try {
    const ctx = canvasElement.getContext('2d');
    
    const labels = monthlyTrend.value.map(item => `${item.moisNom} ${item.annee}`);
    const dataValues = monthlyTrend.value.map(item => item.totalMensuel);

    console.log('📊 Données du graphique:', { labels, dataValues });

    revenueChartInstance = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenus Mensuels (Ar)',
          data: dataValues,
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          borderColor: 'rgba(78, 115, 223, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Revenus: ${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Montant (MGA)'
            },
            ticks: {
              callback: function(value) {
                return formatCurrency(value); 
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mois/Année'
            }
          }
        }
      }
    });

    console.log('✅ Graphique rendu avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du rendu du graphique:', error);
  }
};

// Surveiller les changements de données
watch(monthlyTrend, (newValue) => {
  if (newValue && newValue.length > 0) {
    console.log('🔄 Données mensuelles mises à jour, re-rendu du graphique');
    setTimeout(() => {
      if (chartCanvas.value) {
        renderRevenueChart();
      }
    }, 100);
  }
});

// Logout
const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// --- Initialisation ---
onMounted(async () => {
  console.log('🚀 Composant Synthese monté');
  
  const user = AuthService.getCurrentUser();
  
  if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
    userRole.value = user.roleUti.toUpperCase();
    
    // Charger les données du tableau de bord
    fetchFinanceData();
    
    // Définir l'élément de menu actif basé sur la route actuelle
    const routeToKeyMap = {
      'FinanceDashboard': 'dashboard',
      'FactureGene': 'facturation',
      'SuiviPaie': 'paiements',
      'PenaliteLiti': 'penalites',
      'RapportSynth': 'rapports'
    };
    
    activeMenuKey.value = routeToKeyMap[route.name] || 'rapports';
    
    // Charger les données des rapports
    await Promise.all([
      fetchRapportsData(),
      fetchMonthlyTrend()
    ]);
    
    console.log('✅ Toutes les données chargées');
  } else {
    router.push('/'); 
  }
});

// Nettoyage
onUnmounted(() => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }
});
</script>

<style scoped>
/* COULEURS ORIGINALES */

.dashboard-wrapper {
  height: 100vh;
}

/* Sidebar en bleu nuit */
.custom-sidebar {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  background: transparent;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.sidebar-title {
  color: white !important;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Styles pour le menu */
:deep(.custom-menu) {
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
  color: white !important;
  transition: all 0.3s ease;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
  color: white !important;
  font-weight: 600;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.custom-badge {
  font-weight: 600;
}

/* Header */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-subtitle {
  color: white;
  font-weight: 600;
  margin: 0;
  font-size: 1.2rem;
}

/* Conteneur principal avec scroll */
.main-content-wrapper {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Scrollbar personnalisée pour le conteneur principal */
.main-content-wrapper::-webkit-scrollbar {
  width: 10px;
}

.main-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
  border: 2px solid #f1f1f1;
}

.main-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Cartes avec couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, gray 0%, gray 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, black 0%, black 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

/* Icônes avec fond original */
.custom-icon-primary, 
.custom-icon-success,
.custom-icon-warning {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

.custom-icon-primary-small {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: rgba(0, 123, 255, 0.2);
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Boutons */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* Listes */
.custom-list {
  background: transparent;
}

.custom-list-item {
  border-bottom: 1px solid #dee2e6;
}

/* Conteneur de graphique */
.chart-container {
  position: relative;
  min-height: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-subtitle {
    font-size: 1rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-success,
  .custom-icon-warning {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .chart-container {
    height: 250px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 200px);
    padding-right: 5px;
  }
}

@media (max-width: 576px) {
  .main-content-wrapper {
    max-height: calc(100vh - 180px);
  }
}

/* Styles pour les indicateurs */
.border.rounded {
  transition: all 0.3s ease;
}

.border.rounded:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fs-1 {
  font-size: 2.5rem !important;
}

/* Assurer que le canvas est visible */
canvas {
  display: block;
  max-width: 100%;
}

/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Amélioration de l'espacement général */
.main-content {
  overflow-y: auto;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* Bordure de séparation */
.border-top.border-white {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

/* Styles pour les cartes */
:deep(.n-card .n-card-header) {
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
}

:deep(.n-card .n-card-content) {
  padding: 16px;
}
</style>