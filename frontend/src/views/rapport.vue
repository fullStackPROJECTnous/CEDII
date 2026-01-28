

<template>
  <div class="full-height-container">
    <!-- Structure principale avec sidebar et contenu -->
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
            <h4 class="sidebar-title mb-0 fs-6">CEDII Patrimoine Plus</h4>
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
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                </n-icon>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">
             <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
       
       
       <!-- Dans la partie header du template -->
 <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-3">
  <!-- Partie gauche -->
  <div class="d-flex align-items-center">
    <n-button 
      @click="$router.go(-1)" 
      type="default" 
      size="small"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-left"></i>
      </template>
      Retour
    </n-button>
  </div>
  
  <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-graph-up me-2"></i>
                Tableau de Bord & Rapports d'Activité
              </h1>
              <p class="custom-subtitle">Analysez les performances et suivez l'activité de location</p>
            </div>
  <!-- Partie droite -->
  <div class="d-flex align-items-center gap-3">
    <n-button 
      @click="refreshPage" 
      type="info" 
      size="small"
      :loading="isLoading"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-clockwise"></i>
      </template>
      Actualiser
    </n-button>
    
    <n-tag type="info" size="small" class="custom-tag">
      Rôle: {{ userLogin }}
    </n-tag>
  </div>
</n-layout-header>
   <!-- ... votre header existant ... -->
        </n-layout-header>

<!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="reports-container">
            <!-- KPIs Rapides -->
            <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
              <n-gi>
                <n-card class="kpi-card custom-card" @click="filterByType('all')">
                  <n-statistic label="Total Réservations" :value="reportStats.totalReservations">
                    <template #prefix>
                      <i class="bi bi-calendar-check"></i>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card" @click="filterByStatus('Confirmée')">
                  <n-statistic label="Confirmées" :value="reportStats.confirmed" class="text-success">
                    <template #prefix>
                      <i class="bi bi-check-circle"></i>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card" @click="filterByStatus('En attente')">
                  <n-statistic label="En Attente" :value="reportStats.pending" class="text-warning">
                    <template #prefix>
                      <i class="bi bi-clock"></i>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card" @click="showTrendChart">
                  <n-statistic label="Tendance" :value="`${reportStats.trend}%`" 
                    :class="reportStats.trend >= 0 ? 'text-success' : 'text-error'">
                    <template #prefix>
                      <i :class="reportStats.trend >= 0 ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
            </n-grid>

            <!-- Messages d'état -->
            <n-alert v-if="apiError" type="warning" class="mb-4">
              <template #icon>
                <i class="bi bi-exclamation-triangle"></i>
              </template>
              Certaines données ne sont pas disponibles. Vérifiez la connexion au serveur.
            </n-alert>

            <!-- Filtres avancés -->
            <n-card class="mb-4 custom-card">
              <template #header>
                <n-space justify="space-between" align="center">
                  <n-text strong>Options d'analyse</n-text>
                  <n-space>
                    <n-button 
                      size="small" 
                      @click="exportToPDF" 
                      :loading="exporting" 
                      class="custom-btn-outline"
                    >
                      <template #icon>
                        <i class="bi bi-file-earmark-pdf"></i>
                      </template>
                      Exporter PDF
                    </n-button>
                    <n-button 
                      size="small" 
                      type="primary" 
                      @click="fetchData" 
                      :loading="loading" 
                      class="custom-btn-primary"
                    >
                      <template #icon>
                        <i class="bi bi-arrow-clockwise"></i>
                      </template>
                      Actualiser
                    </n-button>
                  </n-space>
                </n-space>
              </template>
              
              <n-space>
                <!-- Période -->
                <n-date-picker
                  v-model:value="dateRange"
                  type="daterange"
                  clearable
                  placeholder="Période personnalisée"
                  style="width: 220px"
                />
                
                <!-- Période rapide -->
                <n-select
                  v-model:value="selectedPeriod"
                  :options="periodOptions"
                  style="width: 180px"
                  placeholder="Période rapide"
                />
                
                <!-- Grouper par -->
                <n-select
                  v-model:value="groupBy"
                  :options="groupByOptions"
                  style="width: 150px"
                  placeholder="Grouper par"
                  clearable
                />
                
                <!-- Type ressource -->
                <n-select
                  v-model:value="resourceFilter"
                  :options="resourceOptions"
                  placeholder="Filtrer ressource"
                  style="width: 180px"
                  clearable
                  filterable
                />
                
                <!-- Réinitialiser -->
                <n-button 
                  text 
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  Réinitialiser
                </n-button>
              </n-space>
            </n-card>

            <!-- Cartes KPIs améliorées -->
            <n-grid :cols="3" :x-gap="16" :y-gap="16" class="mb-4">
              <n-gi v-for="(kpi, key) in kpis" :key="key">
                <n-card class="kpi-card custom-card" :class="`kpi-${key}`" @click="handleKpiClick(key)">
                  <n-space align="center">
                    <div class="kpi-icon">
                      {{ getKpiIcon(key) }}
                    </div>
                    <n-space vertical size="small" class="flex-grow-1">
                      <n-text depth="3" class="kpi-title">
                        {{ getKpiTitle(key) }}
                      </n-text>
                      <n-text strong class="kpi-value">
                        {{ formatKpiValue(key, kpi) }}
                      </n-text>
                      <n-text v-if="getKpiTrend(key)" depth="3" class="kpi-trend" 
                        :class="getKpiTrend(key) >= 0 ? 'text-success' : 'text-error'">
                        {{ getKpiTrend(key) >= 0 ? '↗' : '↘' }} {{ Math.abs(getKpiTrend(key)) }}%
                      </n-text>
                    </n-space>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>

            <!-- Graphiques et statistiques -->
            <!-- Onglets principaux -->
            <n-card class="custom-card mb-4">
              <n-tabs
                v-model:value="activeTab"
                type="line"
                justify-content="space-evenly"
              >
                <!-- Onglet Réservations -->
                <n-tab-pane name="reservations" tab="Réservations">
                  <template #tab>
                    <n-badge :value="totalReservations" type="info">
                      📅 Réservations
                    </n-badge>
                  </template>
                  
                  <div class="row">
                    <div class="col-lg-6">
                      <!-- Graphique circulaire -->
                      <div class="chart-container">
                        <canvas ref="reservationChart"></canvas>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <!-- Statistiques détaillées -->
                      <n-space vertical>
                        <n-progress
                          v-for="item in reservationData"
                          :key="item.etatRes"
                          type="line"
                          :percentage="calculatePercentage(item.count)"
                          :color="getStatusColor(item.etatRes)"
                          :height="24"
                          :border-radius="4"
                          :fill-color="getStatusBgColor(item.etatRes)"
                        >
                          <template #default>
                            <n-space justify="space-between" class="w-100">
                              <n-text>{{ item.etatRes }}</n-text>
                              <n-text strong>{{ item.count }}</n-text>
                            </n-space>
                          </template>
                        </n-progress>
                      </n-space>
                      
                      <!-- Résumé -->
                      <n-card size="small" class="mt-3">
                        <n-space vertical>
                          <n-text strong>Résumé:</n-text>
                          <n-space justify="space-between">
                            <n-text>Taux de confirmation:</n-text>
                            <n-text strong class="text-success">
                              {{ calculateConfirmationRate() }}%
                            </n-text>
                          </n-space>
                          <n-space justify="space-between">
                            <n-text>Moyenne par jour:</n-text>
                            <n-text strong>
                              {{ calculateDailyAverage() }}
                            </n-text>
                          </n-space>
                        </n-space>
                      </n-card>
                    </div>
                  </div>
                </n-tab-pane>
                
                <!-- Onglet Performance -->
                <n-tab-pane name="performance" tab="Performance">
                  <template #tab>
                    <n-badge :value="performanceScore" type="success">
                      🏆 Performance
                    </n-badge>
                  </template>
                  
                  <n-grid :cols="2" :x-gap="16" :y-gap="16">
                   
                    <n-gi>
                      <n-card class="custom-card">
                        <template #header>
                          <n-space align="center">
                            <n-icon size="20">🎯</n-icon>
                            <n-text strong>Objectifs</n-text>
                          </n-space>
                        </template>
                        <n-space vertical>
                          <n-progress
                            v-for="goal in performanceGoals"
                            :key="goal.name"
                            type="line"
                            :percentage="goal.progress"
                            :height="16"
                            :border-radius="4"
                          >
                            <template #default>
                              <n-space justify="space-between" class="w-100">
                                <n-text class="small">{{ goal.name }}</n-text>
                                <n-text strong class="small">{{ goal.progress }}%</n-text>
                              </n-space>
                            </template>
                          </n-progress>
                        </n-space>
                      </n-card>
                    </n-gi>
                  </n-grid>
                </n-tab-pane>
                
                <!-- Onglet Top Matériels -->
                <n-tab-pane name="topMaterials" tab="Top Matériels">
                  <template #tab>
                    <n-badge :value="topMateriel.length" type="warning">
                      🏆 Top Matériels
                    </n-badge>
                  </template>
                  
                  <div class="row">
                    <div class="col-lg-6">
                      <n-list hoverable>
                        <n-list-item v-for="(mat, index) in topMateriel" :key="mat.codeMat">
                          <template #prefix>
                            <n-badge :value="index + 1" type="primary" class="custom-tag" />
                          </template>
                          
                          <n-thing :title="mat.designationMat || 'Matériel Inconnu'">
                            <template #description>
                              <n-space vertical size="small">
                                <n-text depth="3">
                                  Code: {{ mat.codeMat }}
                                </n-text>
                                <n-space align="center">
                                  <n-tag size="small" type="info" class="custom-tag">
                                    {{ mat.categorieMat || 'Non catégorisé' }}
                                  </n-tag>
                                  <n-text depth="3" class="small">
                                    {{ mat.totalLocations || mat.count || 0 }} locations
                                  </n-text>
                                </n-space>
                              </n-space>
                            </template>
                          </n-thing>
                          
                          <template #suffix>
                            <n-progress
                              type="circle"
                              :percentage="calculateMaterialUsage(mat)"
                              :stroke-width="6"
                              :width="60"
                            />
                          </template>
                        </n-list-item>
                      </n-list>
                    </div>
                    
                    <div class="col-lg-6">
                      <!-- Graphique top matériels -->
                      <div class="chart-container">
                        <canvas ref="topMaterialsChart"></canvas>
                      </div>
                    </div>
                  </div>
                </n-tab-pane>
              </n-tabs>
            </n-card>

  
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import {
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag,
  NText,
  NSpace,
  NCard,
  NGrid,
  NGi,
  NStatistic,
  NAlert,
  NProgress,
  NList,
  NListItem,
  NThing,
  NBadge,
  NDatePicker,
  NSelect,
  NTabs,
  NTabPane
} from 'naive-ui';
import jsPDF from 'jspdf';
import RapportService from '../services/RapportService';
import AuthService from '../services/AuthService';

Chart.register(...registerables);

const router = useRouter();

// États utilisateur
const userRole = ref('');
const userLogin = ref('');
const activeMenuKey = ref('rapports'); // Activer l'item "rapports" dans le menu

// Options du menu
const menuOptions = [
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
  },
 
  {
    label: () => h('span', { class: 'text-white' }, 'Gestion des Clients'),
    key: 'clients',
    icon: renderIcon('bi-people-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Inventaire & Patrimoine'),
    key: 'inventaire',
    icon: renderIcon('bi-tools')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Matériel de Bureau'),
    key: 'bureau',
    icon: renderIcon('bi-briefcase-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Locations & Réservations'),
    key: 'locations',
    icon: renderIcon('bi-calendar-check')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Gestion Financière'),
    key: 'finance',
    icon: renderIcon('bi-bank')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Suivi & Rapports'),
    key: 'rapports',
    icon: renderIcon('bi-graph-up')
  },
 
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
    'accueil': 'AdminDashboard',
    'utilisateurs': 'UserManagement',
    'clients': 'ClientManagement1',
    'inventaire': 'InventairePatrimoineAD',
    'locations': 'Location',
    'finance': 'Finance',
    'bureau': 'Bureau1',
    'rapports': 'Rapport',
    'logs': 'SystemLogs'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Navigation
const goToDashboard = () => {
  router.push({ name: 'AdminDashboard' });
};

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// NOUVEAUX États
const activeTab = ref('reservations');
const loading = ref(false);
const exporting = ref(false);
const apiError = ref(false);
const dateRange = ref(null);
const selectedPeriod = ref('month');
const groupBy = ref(null);
const resourceFilter = ref(null);

// NOUVELLES Options
const periodOptions = [
  { label: 'Aujourd\'hui', value: 'today' },
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
  { label: 'Ce trimestre', value: 'quarter' },
  { label: 'Cette année', value: 'year' }
];

const groupByOptions = [
  { label: 'Par jour', value: 'day' },
  { label: 'Par semaine', value: 'week' },
  { label: 'Par mois', value: 'month' },
  { label: 'Par type', value: 'type' },
  { label: 'Par statut', value: 'status' }
];

const resourceOptions = [
  { label: 'Salles', value: 'Salle' },
  { label: 'Matériels', value: 'Materiel' },
  { label: 'Mixte', value: 'Mixte' }
];

// NOUVELLES Computed properties
const hasActiveFilters = computed(() => {
  return dateRange.value || selectedPeriod.value !== 'month' || groupBy.value || resourceFilter.value;
});

const reportStats = computed(() => {
  return {
    totalReservations: totalReservations.value,
    confirmed: reservationData.value.find(r => r.etatRes === 'Confirmée')?.count || 0,
    pending: reservationData.value.find(r => r.etatRes === 'En attente')?.count || 0,
    trend: calculateTrend()
  };
});

const performanceScore = computed(() => {
  return Math.round((monthlyStats.value.conversionRate || 0) * 0.4 + 
                    (calculateConfirmationRate() || 0) * 0.3 + 
                    (monthlyStats.value.satisfaction || 0) * 0.3);
});

const performanceGoals = computed(() => [

  { name: 'Revenu mensuel', target: 10000000, current: monthlyStats.value.monthlyRevenue || 0, progress: Math.min(100, ((monthlyStats.value.monthlyRevenue || 0) / 10000000) * 100) },
  { name: 'Satisfaction client', target: 90, current: monthlyStats.value.satisfaction || 0, progress: Math.min(100, ((monthlyStats.value.satisfaction || 0) / 90) * 100) }
]);

const keyIndicators = computed(() => [
  { name: 'CA moyen par location', value: formatCurrency(calculateAverageRevenue()), trend: 5, suffix: 'MGA' },
  { name: 'Durée moyenne', value: calculateAverageDuration(), trend: 3, suffix: 'jours' },
  { name: 'Taux d\'occupation', value: calculateOccupancyRate(), trend: 2, suffix: '%' },
  { name: 'Taux de récidive', value: calculateRepeatRate(), trend: 8, suffix: '%' }
]);

// Données existantes
const kpis = ref({
  totalClients: 0,
  locationsMois: 0,
  revenuTotal: 0
});

const reservationData = ref([]);
const topMateriel = ref([]);
const locationTypes = ref([]);
const monthlyStats = ref({
  newReservations: 0,
  monthlyRevenue: 0,
  conversionRate: 0,
  satisfaction: 85
});

// Références chart
const reservationChart = ref(null);
const topMaterialsChart = ref(null);

const totalReservations = computed(() => {
  if (!reservationData.value || !Array.isArray(reservationData.value)) return 0;
  return reservationData.value.reduce((sum, item) => sum + (item.count || 0), 0);
});

// NOUVELLES Fonctions utilitaires
const calculateTrend = () => {
  // Calcul simple de tendance
  const confirmed = reservationData.value.find(r => r.etatRes === 'Confirmée')?.count || 0;
  const total = totalReservations.value;
  if (total === 0) return 0;
  return Math.round((confirmed / total) * 100 - 50); // Tendance basée sur taux de confirmation
};

const calculateConfirmationRate = () => {
  const confirmed = reservationData.value.find(r => r.etatRes === 'Confirmée')?.count || 0;
  const total = totalReservations.value;
  if (total === 0) return 0;
  return Math.round((confirmed / total) * 100);
};

const calculateDailyAverage = () => {
  const total = totalReservations.value;
  return Math.round(total / 30); // Approximation sur 30 jours
};

const calculateMaterialUsage = (material) => {
  const maxLocations = Math.max(...topMateriel.value.map(m => m.totalLocations || m.count || 0));
  if (maxLocations === 0) return 0;
  return Math.round(((material.totalLocations || material.count || 0) / maxLocations) * 100);
};

const calculateAverageRevenue = () => {
  const revenue = kpis.value.revenuTotal || 0;
  const locations = kpis.value.locationsMois || 1;
  return Math.round(revenue / locations);
};

const calculateAverageDuration = () => {
  // Simuler calcul durée moyenne
  return 3.5;
};

const calculateOccupancyRate = () => {
  // Simuler taux d'occupation
  return Math.round((Math.random() * 30) + 60);
};

const calculateRepeatRate = () => {
  // Simuler taux de récidive
  return Math.round((Math.random() * 20) + 10);
};

const calculateTypePercentage = (count) => {
  const total = locationTypes.value.reduce((sum, type) => sum + type.count, 0);
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

const getTypeIcon = (type) => {
  const icons = {
    'Salle': 'bi-building',
    'Materiel': 'bi-pc-display',
    'Mixte': 'bi-layers'
  };
  return icons[type] || 'bi-question-circle';
};

// Fonctions existantes améliorées
const formatCurrency = (value) => {
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0';
  return value.toLocaleString('fr-MG');
};

const calculatePercentage = (count) => {
  if (totalReservations.value === 0) return 0;
  return Math.round((count / totalReservations.value) * 100);
};

const getKpiTitle = (key) => {
  const titles = {
    totalClients: 'Clients Actifs',
    locationsMois: 'Locations (Mois)',
    revenuTotal: 'Revenu Total'
  };
  return titles[key] || key;
};

const getKpiIcon = (key) => {
  const icons = {
    totalClients: '👥',
    locationsMois: '📅',
    revenuTotal: '💰'
  };
  return icons[key] || '❓';
};

const formatKpiValue = (key, value) => {
  if (key === 'revenuTotal') {
    return formatCurrency(value);
  }
  return value.toString();
};

const getKpiTrend = (key) => {
  // Simuler des tendances
  const trends = {
    totalClients: 12,
    locationsMois: 8,
    revenuTotal: 15
  };
  return trends[key] || 0;
};

const getStatusColor = (statut) => {
  const colors = {
    'Confirmée': '#5cb85c',
    'En attente': '#f0ad4e',
    'Annulée': '#d9534f',
    'Terminée': '#067186'
  };
  return colors[statut] || '#5811EE';
};

const getStatusBgColor = (statut) => {
  const colors = {
    'Confirmée': 'rgba(92, 184, 92, 0.1)',
    'En attente': 'rgba(240, 173, 78, 0.1)',
    'Annulée': 'rgba(217, 83, 79, 0.1)',
    'Terminée': 'rgba(6, 113, 134, 0.1)'
  };
  return colors[statut] || 'rgba(88, 17, 238, 0.1)';
};

const getLocationTypeColor = (type) => {
  const colors = {
    'Salle': 'primary',
    'Materiel': 'success',
    'Mixte': 'warning'
  };
  return colors[type] || 'default';
};

const getTypeLabel = (type) => {
  const labels = {
    'Salle': 'Salle',
    'Materiel': 'Matériel',
    'Mixte': 'Mixte'
  };
  return labels[type] || type;
};

// NOUVELLES Fonctions d'action
const handleKpiClick = (key) => {
  switch (key) {
    case 'totalClients':
      router.push({ name: 'ClientManagement1' });
      break;
    case 'locationsMois':
      router.push({ name: 'Location' });
      break;
    case 'revenuTotal':
      router.push({ name: 'Finance' });
      break;
  }
};

const filterByType = (type) => {
  resourceFilter.value = type === 'all' ? null : type;
};

const filterByStatus = (status) => {
  // Filtrer les réservations par statut
  // Implémenter selon vos besoins
};

const showTrendChart = () => {
  activeTab.value = 'performance';
};

const resetFilters = () => {
  dateRange.value = null;
  selectedPeriod.value = 'month';
  groupBy.value = null;
  resourceFilter.value = null;
};

const exportToPDF = async () => {
  exporting.value = true;
  try {
    const doc = new jsPDF();
    
    // Variables pour la mise en page
    const margeGauche = 15;
    const ligneCentre = 105;
    let yPosition = 50;
    
    // --- EN-TÊTE PROFESSIONNELLE ---
    // Logo CEDII (à gauche)
    const cheminsLogo = [
      '/images/logo.jpg',
      '/public/images/logo.jpg',
      './images/logo.jpg',
      window.location.origin + '/images/logo.jpg',
      'logo.jpg'
    ];
    
    let logoAjoute = false;
    for (const chemin of cheminsLogo) {
      try {
        doc.addImage(chemin, 'JPEG', margeGauche, 15, 30, 30);
        logoAjoute = true;
        console.log('✅ Logo ajouté avec chemin:', chemin);
        break;
      } catch (e) {
        console.log('❌ Échec avec chemin:', chemin);
        continue;
      }
    }
    
    if (!logoAjoute) {
      console.warn('⚠️ Logo non trouvé, ajout du texte CEDII');
      doc.setFontSize(14);
      doc.setTextColor(91, 17, 238);
      doc.setFont("helvetica", "bold");
      doc.text('CEDII', margeGauche + 5, 25);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Centre d'Échange et de", margeGauche + 5, 32);
      doc.text("Diffusion d'Informations", margeGauche + 5, 37);
      doc.text("Informatiques", margeGauche + 5, 42);
    }
    
    // Titre principal
    doc.setFontSize(18);
    doc.setTextColor(4, 5, 191);
    doc.setFont("helvetica", "bold");
    doc.text('RAPPORT D\'ACTIVITÉ', ligneCentre, 25, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(11);
    doc.setTextColor(94, 94, 94);
    doc.setFont("helvetica", "normal");
    doc.text('Centre d\'Échange et de Diffusion d\'Informations Informatiques', ligneCentre, 32, { align: 'center' });
    
    // Dates
    doc.text(`Période: ${getPeriodLabel()}`, ligneCentre, 39, { align: 'center' });
    
    const dateFormatted = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Généré le ${dateFormatted}`, ligneCentre, 46, { align: 'center' });
    
    // Ligne séparatrice
    doc.setDrawColor(6, 113, 182);
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    
    yPosition = 60;
    
    // --- INDICATEURS CLÉS ---
    doc.setFontSize(14);
    doc.setTextColor(4, 5, 143);
    doc.setFont("helvetica", "bold");
    doc.text('INDICATEURS CLÉS DE PERFORMANCE', margeGauche, yPosition);
    
    yPosition += 10;
    
    // Encadré pour les KPIs
    doc.setDrawColor(91, 17, 238);
    doc.setFillColor(250, 250, 255);
    doc.rect(margeGauche, yPosition - 5, 175, 45, 'F');
    doc.setDrawColor(200, 200, 220);
    doc.rect(margeGauche, yPosition - 5, 175, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    
    const kpiEntries = Object.entries(kpis.value);
    const kpisPerColumn = Math.ceil(kpiEntries.length / 2);
    
    // Colonne gauche
    kpiEntries.slice(0, kpisPerColumn).forEach(([key, value], index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${getKpiTitle(key)}:`, margeGauche + 10, yPosition + (index * 7));
      doc.setFont("helvetica", "normal");
      doc.text(formatKpiValue(key, value), margeGauche + 50, yPosition + (index * 7));
    });
   
    yPosition += 50;
    
    // --- RÉPARTITION DES RÉSERVATIONS ---
    if (reservationData.value && reservationData.value.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(4, 5, 143);
      doc.setFont("helvetica", "bold");
      doc.text('RÉPARTITION DES RÉSERVATIONS', margeGauche, yPosition);
      
      yPosition += 10;
      
      // Tableau des réservations
      doc.setDrawColor(91, 17, 238);
      doc.setFillColor(250, 250, 255);
      const headerHeight = 10;
      const rowHeight = 8;
      const startY = yPosition;
      
      // En-tête du tableau
      doc.rect(margeGauche, startY - 5, 175, headerHeight, 'F');
      doc.setDrawColor(91, 17, 238);
      doc.rect(margeGauche, startY - 5, 175, headerHeight);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(4, 5, 143);
      doc.text('STATUT', margeGauche + 10, startY + 2);
      doc.text('NOMBRE', margeGauche + 80, startY + 2);
      doc.text('POURCENTAGE', margeGauche + 130, startY + 2);
      
      yPosition = startY + headerHeight;
      
      // Données du tableau
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      
      reservationData.value.forEach((item, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
          // Réafficher l'en-tête du tableau sur la nouvelle page
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(4, 5, 143);
          doc.text('STATUT', margeGauche + 10, yPosition - 3);
          doc.text('NOMBRE', margeGauche + 80, yPosition - 3);
          doc.text('POURCENTAGE', margeGauche + 130, yPosition - 3);
          yPosition += 3;
        }
        
        const percentage = calculatePercentage(item.count);
        const rowY = yPosition + (index * rowHeight);
        
        // Fond alterné pour les lignes
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 250);
          doc.rect(margeGauche, rowY - 3, 175, rowHeight, 'F');
        }
        
        doc.setDrawColor(220, 220, 220);
        doc.line(margeGauche, rowY + 5, margeGauche + 175, rowY + 5);
        
        doc.text(item.etatRes, margeGauche + 10, rowY + 2);
        doc.text(String(item.count), margeGauche + 80, rowY + 2);
        doc.text(`${percentage}%`, margeGauche + 130, rowY + 2);
      });
      
      yPosition += (reservationData.value.length * rowHeight) + 10;
    }
    
    // --- ANALYSE ET COMMENTAIRES ---
    if (yPosition < 200) {
      doc.setFontSize(14);
      doc.setTextColor(4, 5, 143);
      doc.setFont("helvetica", "bold");
      doc.text('ANALYSE ET OBSERVATIONS', margeGauche, yPosition);
      
      yPosition += 10;
      
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "italic");
      
      const observations = [
        "Ce rapport présente une synthèse des activités du CEDII pour la période spécifiée.",
        "Les indicateurs clés permettent d'évaluer la performance et l'efficacité opérationnelle.",
        "La répartition des réservations donne un aperçu de l'utilisation des ressources."
      ];
      
      observations.forEach(observation => {
        const splitText = doc.splitTextToSize(observation, 170);
        splitText.forEach(line => {
          doc.text(line, margeGauche + 5, yPosition);
          yPosition += 5;
        });
        yPosition += 2;
      });
    }
    
    // --- PIED DE PAGE ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(94, 94, 94);
      doc.text(`CEDII - Centre d'Echanges, de Documentation et d'Information Inter-Institutionnelles`, ligneCentre, 287, { align: 'center' });
      doc.text(`Boulevard Philibert Tsiranana Tsianonlondroa Fianarantsoa 301 - Tél:+261 34 03 931 91/ +261 34 60 020 34 - Email:  cedii.fia@gmail.com`, ligneCentre, 292, { align: 'center' });
      doc.text(`Page ${i} / ${pageCount}`, ligneCentre, 297, { align: 'center' });
    }
    
    // --- NOM DU FICHIER ---
    const date = new Date().toISOString().split('T')[0];
    doc.save(`rapport-activite-cedii-${date}.pdf`);
    
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    
    // Fallback simple en cas d'erreur
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setTextColor(4, 5, 191);
      doc.text('RAPPORT D\'ACTIVITÉ CEDII', 105, 50, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Période: ${getPeriodLabel()}`, 105, 60, { align: 'center' });
      doc.text('Document généré avec succès', 105, 70, { align: 'center' });
      
      const date = new Date().toISOString().split('T')[0];
      doc.save(`rapport-cedii-${date}.pdf`);
    } catch (fallbackError) {
      console.error('Erreur fallback:', fallbackError);
      alert('Erreur lors de la génération du rapport');
    }
  } finally {
    exporting.value = false;
  }
};


const getPeriodLabel = () => {
  const labels = {
    'today': 'Aujourd\'hui',
    'week': 'Cette semaine',
    'month': 'Ce mois',
    'quarter': 'Ce trimestre',
    'year': 'Cette année'
  };
  return labels[selectedPeriod.value] || 'Période personnalisée';
};


/*
// Fonctions existantes
const fetchData = async () => {
  loading.value = true;
  apiError.value = false;
  
  try {
    const promises = [
      RapportService.getKPIs().catch(handleApiError),
      RapportService.getReservationsReport().catch(handleApiError),
      RapportService.getTopRentedMateriel().catch(handleApiError),
      RapportService.getMonthlyStats().catch(handleApiError),
      RapportService.getLocationTypes().catch(handleApiError)
    ];

    const [kpiRes, reportRes, topMatRes, monthlyRes, typesRes] = await Promise.all(promises);

    if (kpiRes?.data) {
      kpis.value = {
        totalClients: kpiRes.data.totalClients || 0,
        locationsMois: kpiRes.data.locationsMois || 0,
        revenuTotal: kpiRes.data.revenuTotal || 0
      };
    }
    
    if (reportRes?.data && Array.isArray(reportRes.data)) {
      reservationData.value = reportRes.data;
    } else {
      reservationData.value = [];
    }
    
    if (topMatRes?.data && Array.isArray(topMatRes.data)) {
      topMateriel.value = topMatRes.data;
    } else {
      topMateriel.value = [];
    }
    
    if (monthlyRes?.data) {
      monthlyStats.value = monthlyRes.data;
    }
    
    if (typesRes?.data && Array.isArray(typesRes.data)) {
      locationTypes.value = typesRes.data;
    } else {
      locationTypes.value = [];
    }

  } catch (error) {
    console.error("Erreur de chargement des rapports:", error);
    apiError.value = true;
  } finally {
    loading.value = false;
  }
};*/

const fetchData = async () => {
  loading.value = true;
  apiError.value = false;
  
  try {
    console.log('🔄 Chargement des rapports...');
    
    // STRATÉGIE: Récupérer le CA depuis plusieurs sources
    let revenuTotal = 0;
    
    // 1. Vérifier ce qui est disponible dans localStorage
    console.log('🔍 Recherche du CA dans localStorage...');
    
    // Clés possibles (par ordre de priorité)
    const storageKeys = [
      'chiffreAffairesGlobal',
      'financialStats_chiffreAffaires',
      'ca_total',
      'revenue_total',
      'chiffreAffaires'
    ];
    
    for (const key of storageKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        const parsed = parseInt(value);
        if (!isNaN(parsed) && parsed > 0) {
          revenuTotal = parsed;
          console.log(`✅ CA trouvé dans ${key}:`, revenuTotal);
          break;
        }
      }
    }
    
    // 2. Préparer les appels API pour autres données
    const promises = [
      RapportService.getKPIs().catch(handleApiError),
      RapportService.getReservationsReport().catch(handleApiError),
      RapportService.getTopRentedMateriel().catch(handleApiError),
      RapportService.getMonthlyStats().catch(handleApiError),
      RapportService.getLocationTypes().catch(handleApiError)
    ];

    const [kpiRes, reportRes, topMatRes, monthlyRes, typesRes] = await Promise.all(promises);
    
    // 3. Si pas de CA dans localStorage, essayer l'API Rapports
    if (revenuTotal === 0 && kpiRes?.data?.revenuTotal) {
      revenuTotal = kpiRes.data.revenuTotal;
      console.log('⚠️ CA depuis API Rapports:', revenuTotal);
    }
    
    // 4. Si toujours 0, vérifier s'il y a une erreur de stockage
    if (revenuTotal === 0) {
      console.warn('⚠️ Aucun CA trouvé');
      
      // Vérifier toutes les clés localStorage pour debug
      console.log('🔍 Toutes les clés localStorage:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`  ${key}: ${value}`);
      }
    }
    
    // 5. Mettre à jour les KPIs (sans caSource et caDetails)
    kpis.value = {
      totalClients: kpiRes?.data?.totalClients || 0,
      locationsMois: kpiRes?.data?.locationsMois || 0,
      revenuTotal: revenuTotal
      // caSource et caDetails ont été supprimés
    };
    
    // 6. Mettre à jour les autres données
    if (reportRes?.data && Array.isArray(reportRes.data)) {
      reservationData.value = reportRes.data;
    } else {
      reservationData.value = [];
    }
    
    if (topMatRes?.data && Array.isArray(topMatRes.data)) {
      topMateriel.value = topMatRes.data;
    } else {
      topMateriel.value = [];
    }
    
    if (monthlyRes?.data) {
      monthlyStats.value = monthlyRes.data;
      
      // Si le revenu mensuel n'est pas défini, utiliser le CA total
      if (!monthlyStats.value.monthlyRevenue && revenuTotal > 0) {
        monthlyStats.value.monthlyRevenue = revenuTotal;
      }
    } else {
      monthlyStats.value = {
        newReservations: 0,
        monthlyRevenue: revenuTotal,
        conversionRate: 0,
        satisfaction: 85
      };
    }
    
    if (typesRes?.data && Array.isArray(typesRes.data)) {
      locationTypes.value = typesRes.data;
    } else {
      locationTypes.value = [];
    }
    
    // 7. Journaliser le résultat
    console.log('📊 Rapport finalisé:', {
      revenuTotal: revenuTotal,
      formaté: formatCurrency(revenuTotal),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Erreur de chargement des rapports:", error);
    apiError.value = true;
    
  } finally {
    loading.value = false;
  }
};


// AJOUTEZ cette fonction pour rafraîchir spécifiquement le CA
const refreshChiffreAffaires = async () => {
  console.log('🔄 Rafraîchissement du CA...');
  
  // 1. Vérifier localStorage
  const storedCA = localStorage.getItem('chiffreAffairesGlobal');
  if (storedCA) {
    const parsed = parseInt(storedCA);
    if (!isNaN(parsed) && parsed > 0) {
      kpis.value.revenuTotal = parsed;
      kpis.value.caSource = 'Finance Module (rafraîchi)';
      
      // Mettre à jour aussi monthlyStats
      if (monthlyStats.value) {
        monthlyStats.value.monthlyRevenue = parsed;
      }
      
      console.log('✅ CA rafraîchi:', parsed);
      return parsed;
    }
  }
  
  // 2. Sinon, recharger les données
  await fetchData();
  return kpis.value.revenuTotal;
};

// ⚠️ SUPPRIMEZ la fonction handleApiError DUPLIQUÉE si elle existe déjà
// (La fonction originale doit rester dans la partie supérieure de votre script)




const handleApiError = (error) => {
  console.warn('API non disponible:', error.config?.url);
  return null;
};

// Cycle de vie
onMounted(() => {
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    userLogin.value = user.loginUti || '';
  }
  
  fetchData();
});
</script>

<style scoped>
.full-height-container {
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

/* Header amélioré */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
  font-size: 1.5rem;
}

/* Contenu principal */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.bg-light {
  background-color: #f8f9fa !important;
  flex: 1;
  overflow-y: auto;
}

.reports-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Boutons cohérents */
.custom-btn-primary {
  background: #007bff !important;
  border-color: #007bff !important;
}

.custom-btn-primary:hover {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
}

.custom-btn-outline {
  border-color: rgba(255, 255, 255, 0.3);
  color: #6c757d;
  background: transparent;
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

.custom-tag {
  font-weight: 600;
}

/* KPI styles */
.kpi-icon {
  font-size: 2rem;
  padding: 12px;
  background: rgba(88, 17, 238, 0.1);
  border-radius: 8px;
  margin-right: 12px;
}

.kpi-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.kpi-value {
  font-size: 1.5rem;
  color: #04058F;
}

.kpi-trend {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Cards */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.kpi-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

/* Chart containers */
.chart-container {
  height: 300px;
  position: relative;
}

/* Type items */
.type-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.type-item:last-child {
  border-bottom: none;
}

.type-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.type-icon.primary {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.type-icon.success {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.type-icon.warning {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.type-icon.default {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

/* Scrollbars personnalisées */
.bg-light::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .kpi-icon {
    font-size: 1.5rem;
    padding: 8px;
  }
  
  .kpi-value {
    font-size: 1.25rem;
  }
  
  .chart-container {
    height: 250px;
  }
}

.small {
  font-size: 0.875em;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}


/* Layout principal */
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
}

/* Header fixé */
.fixed-header {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  flex-shrink: 0; /* Empêche le header de rétrécir */
}

/* Contenu avec scroll */
.content-with-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 0; /* Pas de marge car header est sticky */
  padding-top: 16px; /* Espace entre le header et le contenu */
}

/* Ajustement du conteneur de réservation */
.reservation-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 20px 20px; /* Pas de padding-top car déjà géré */
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ajustement du conteneur de scroll existant */
.content-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  padding-top: 0;
}

/* Ajustement responsive */
@media (max-width: 768px) {
  .content-with-scroll {
    padding: 12px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 12px !important;
  }
  
  .reservation-page-container {
    padding: 0 12px 12px 12px;
  }
}

@media (max-width: 576px) {
  .content-with-scroll {
    padding: 8px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 8px !important;
  }
  
  .reservation-page-container {
    padding: 0 8px 8px 8px;
  }
}

</style>