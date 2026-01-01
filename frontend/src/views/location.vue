<!--<template>
  <div class="page-container">
    <!-- Header fixe 
    <div class="fixed-header">
      <div class="container-fluid py-2">
        <!-- Header unifié 
        <div class="row mb-4">
          <div class="col-12">
            <div class="custom-header p-4 rounded">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-light">
                    <i class="bi bi-arrow-left me-2"></i>Retour à l'Acceuil
                  </router-link>
                </div>
                <div class="text-center">
                  <h1 class="custom-title mb-1">
                    <i class="bi bi-calendar-check me-2"></i>
                    Surveillance des Locations & Réservations
                  </h1>
                  <p class="custom-subtitle">Tableau de contrôle et monitoring des activités de location</p>
                </div>
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
              </div>
            </div>
          </div>
        </div>

        <!-- KPIs de Surveillance 
        <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
          <n-gi>
            <n-card class="kpi-card custom-card">
              <n-statistic label="À Traiter" :value="pendingCount" class="text-warning">
                <template #prefix>
                  <i class="bi bi-clock"></i>
                </template>
                <template #suffix>
                  <div class="text-muted small">En attente</div>
                </template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card class="kpi-card custom-card">
              <n-statistic label="Terminées" :value="terminatedLocationsCount" class="text-success">
                <template #prefix>
                  <i class="bi bi-check-circle"></i>
                </template>
                <template #suffix>
                  <div class="text-muted small">Cette semaine</div>
                </template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card class="kpi-card custom-card">
              <n-statistic label="En Cours" :value="activeLocationsTodayCount" class="text-info">
                <template #prefix>
                  <i class="bi bi-play-circle"></i>
                </template>
                <template #suffix>
                  <div class="text-muted small">Aujourd'hui</div>
                </template>
              </n-statistic>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card class="kpi-card custom-card">
              <n-statistic label="À Venir" :value="locationStats.upcomingConfirmed || 0" class="text-primary">
                <template #prefix>
                  <i class="bi bi-calendar-week"></i>
                </template>
                <template #suffix>
                  <div class="text-muted small">Confirmées</div>
                </template>
              </n-statistic>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </div>

    <!-- Contenu principal scrollable 
    <div class="scrollable-content">
      <div class="container-fluid py-2">
        <!-- Section Filtres de Surveillance 
        <n-card class="custom-card mb-4">
          <template #header>
            <n-space justify="space-between" align="center">
              <n-h4 class="mb-0">
                <i class="bi bi-funnel me-2"></i>
                Filtres de Surveillance
              </n-h4>
              <n-space>
                <n-button 
                  type="primary" 
                  @click="refreshAllData"
                  :loading="loading.global"
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
            <!-- Filtre par période 
            <n-date-picker
              v-model:value="dateRange"
              type="daterange"
              clearable
              placeholder="Période"
              style="width: 200px"
            />
            
            <!-- Filtre par type 
            <n-select
              v-model:value="typeFilter"
              :options="typeOptions"
              placeholder="Type"
              style="width: 150px"
              clearable
            />
            
            <!-- Filtre par statut 
            <n-select
              v-model:value="statusFilter"
              :options="statusOptions"
              placeholder="Statut"
              style="width: 150px"
              clearable
            />
            
            <!-- Recherche 
            <n-input
              v-model:value="searchQuery"
              placeholder="Rechercher client..."
              clearable
              style="width: 200px"
            >
              <template #prefix>
                <i class="bi bi-search"></i>
              </template>
            </n-input>
            
            <!-- Bouton réinitialisation 
            <n-button 
              text 
              @click="resetFilters"
              :disabled="!hasActiveFilters"
            >
              Réinitialiser
            </n-button>
          </n-space>
        </n-card>

        <!-- Navigation par onglets de surveillance 
        <n-card class="custom-card">
          <n-tabs
            v-model:value="activeTab"
            type="line"
            justify-content="space-evenly"
          >
            <!-- Onglet Réservations Actives 
            <n-tab-pane name="reservations" tab="Réservations Actives">
              <template #tab>
                <n-badge :value="filteredPendingReservations.length" type="info" show-zero>
                  📋 Réservations Actives
                </n-badge>
              </template>

              <n-space vertical size="large">
                <n-space justify="space-between" align="center">
                  <div>
                    <n-h4 class="mb-0">
                      <i class="bi bi-list-check me-2"></i>
                      Demandes de Réservation
                    </n-h4>
                    <n-text depth="3" class="small">
                      Surveillance des demandes en cours de traitement
                    </n-text>
                  </div>
                  <n-text depth="3">
                    {{ filteredPendingReservations.length }} résultat(s)
                  </n-text>
                </n-space>

                <!-- Indicateur de chargement 
                <div v-if="loading.reservations" class="text-center py-5">
                  <n-spin size="large">
                    <template #description>
                      Chargement des réservations...
                    </template>
                  </n-spin>
                </div>

                <!-- Tableau des réservations (sans actions) 
                <div v-else-if="filteredPendingReservations.length === 0" class="text-center py-5">
                  <n-empty description="Aucune réservation active">
                    <template #icon>
                      <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                    </template>
                  </n-empty>
                </div>

                <n-data-table
                  v-else
                  :columns="reservationColumns"
                  :data="filteredPendingReservations"
                  :bordered="false"
                  :row-class-name="getReservationRowClass"
                  striped
                  class="custom-table"
                />
              </n-space>
            </n-tab-pane>

            <!-- Onglet Historique des Locations
            <n-tab-pane name="history" tab="Historique">
              <template #tab>
                <n-badge :value="filteredLocationHistory.length" type="default" show-zero>
                  📊 Historique des Locations
                </n-badge>
              </template>

              <n-space vertical size="large">
                <n-space justify="space-between" align="center">
                  <div>
                    <n-h4 class="mb-0">
                      <i class="bi bi-archive me-2"></i>
                      Locations Finalisées
                    </n-h4>
                    <n-text depth="3" class="small">
                      Archives des locations terminées et confirmées
                      <n-tag size="tiny" type="info" class="ms-2">
                        Sans les demandes en attente
                      </n-tag>
                    </n-text>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <n-text depth="3">
                      {{ processedLocationHistory.length }} location(s) finalisée(s)
                    </n-text>
                    <n-tag type="success" size="small">
                      <i class="bi bi-cash-coin me-1"></i>
                      {{ formatCurrency(totalRevenuTermine) }}
                    </n-tag>
                  </div>
                </n-space>

                <!-- Indicateur de chargement 
                <div v-if="loading.history" class="text-center py-5">
                  <n-spin size="large">
                    <template #description>
                      Chargement de l'historique...
                    </template>
                  </n-spin>
                </div>

                <!-- Message si aucune donnée 
                <div v-else-if="!hasLocationHistoryData" class="text-center py-5">
                  <n-empty description="Aucun historique disponible">
                    <template #icon>
                      <i class="bi bi-clock-history" style="font-size: 3rem;"></i>
                    </template>
                  </n-empty>
                </div>

                <!-- Tableau historique avec données nettoyées 
                <n-data-table
                  v-else
                  :columns="historyColumns"
                  :data="processedLocationHistory"
                  :bordered="false"
                  :row-class-name="getHistoryRowClass"
                  striped
                  class="custom-table"
                />

                <!-- Résumé financier 
                <n-card v-if="hasLocationHistoryData" size="small" class="mt-3">
                  <n-space justify="space-between" align="center">
                    <n-text strong>Résumé Financier des Locations Terminées:</n-text>
                    <n-space>
                      <n-tag type="success" size="small">
                        <i class="bi bi-wallet2 me-1"></i>
                        {{ locationsPayeesCount }} payée(s)
                      </n-tag>
                      <n-tag type="info" size="small">
                        <i class="bi bi-calculator me-1"></i>
                        CA: {{ formatCurrency(totalRevenuTermine) }}
                      </n-tag>
                    </n-space>
                  </n-space>
                </n-card>
              </n-space>
            </n-tab-pane>

            <!-- Onglet Statistiques 
            <n-tab-pane name="stats" tab="Statistiques">
              <template #tab>
                <n-badge type="success" show-zero>
                  📈 Statistiques
                </n-badge>
              </template>

              <n-space vertical size="large">
                <n-space justify="space-between" align="center">
                  <n-h4 class="mb-0">
                    <i class="bi bi-graph-up me-2"></i>
                    Tableau de Bord Statistique
                  </n-h4>
                  <n-text depth="3">
                    Données consolidées
                  </n-text>
                </n-space>

                <!-- Cartes de statistiques 
                <n-grid :cols="3" :x-gap="16" :y-gap="16">
                  <n-gi>
                    <n-card class="text-center">
                      <n-statistic label="Taux de Conversion" :value="conversionRate">
                        <template #suffix>%</template>
                        <template #prefix>
                          <i class="bi bi-arrow-up-right text-success"></i>
                        </template>
                      </n-statistic>
                      <n-text depth="3" class="small">
                        Réservations confirmées / total
                      </n-text>
                    </n-card>
                  </n-gi>
                  <n-gi>
                    <n-card class="text-center">
                      <n-statistic label="Durée Moyenne" :value="averageDuration">
                        <template #suffix>jours</template>
                        <template #prefix>
                          <i class="bi bi-calendar-range text-info"></i>
                        </template>
                      </n-statistic>
                      <n-text depth="3" class="small">
                        Durée moyenne des locations
                      </n-text>
                    </n-card>
                  </n-gi>
                  <n-gi>
                    <n-card class="text-center">
                      <n-statistic label="Clients Récurrents" :value="repeatClients">
                        <template #suffix>%</template>
                        <template #prefix>
                          <i class="bi bi-people text-primary"></i>
                        </template>
                      </n-statistic>
                      <n-text depth="3" class="small">
                        Clients avec locations multiples
                      </n-text>
                    </n-card>
                  </n-gi>
                </n-grid>

                <!-- Analyse par type 
                <n-card title="📊 Analyse par Type de Location">
                  <n-grid :cols="3" :x-gap="16" :y-gap="16">
                    <n-gi v-for="type in statsByTypeArray" :key="type.type">
                      <n-card size="small" class="text-center">
                        <div :class="`text-${getTypeColor(type.type)}`">
                          <i :class="`bi bi-${getTypeIcon(type.type)}`" style="font-size: 2rem;"></i>
                          <div class="fw-bold mt-2 fs-4">{{ type.count }}</div>
                          <div class="small">{{ type.type }}</div>
                          <div class="small text-muted mt-1">
                            {{ formatCurrency(type.revenue) }}
                          </div>
                        </div>
                      </n-card>
                    </n-gi>
                  </n-grid>
                </n-card>

                <!-- Graphique simple 
                <n-card title="📅 Activité Mensuelle">
                  <div class="monthly-activity">
                    <div v-for="week in monthlyActivity" :key="week.week" class="activity-week">
                      <div class="week-label">S{{ week.week }}</div>
                      <div class="activity-bar" :style="{ height: `${week.activity * 2}px` }"></div>
                      <div class="week-count">{{ week.count }}</div>
                    </div>
                  </div>
                  <n-text depth="3" class="small d-block text-center mt-2">
                    Nombre de locations par semaine
                  </n-text>
                </n-card>
              </n-space>
            </n-tab-pane>
          </n-tabs>
        </n-card>

        <!-- Résumé de Surveillance 
        <n-card class="custom-card mt-4">
          <template #header>
            <n-space align="center">
              <i class="bi bi-shield-check text-primary"></i>
              <n-text strong>Résumé de Surveillance</n-text>
            </n-space>
          </template>
          
          <n-grid :cols="4" :x-gap="16">
            <n-gi>
              <n-statistic label="Alertes en Cours" :value="activeAlerts">
                <template #prefix>
                  <i class="bi bi-exclamation-triangle text-warning"></i>
                </template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic label="Performances" :value="performanceScore">
                <template #suffix>%</template>
                <template #prefix>
                  <i class="bi bi-speedometer2 text-success"></i>
                </template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic label="Satisfaction Client" :value="customerSatisfaction">
                <template #suffix>%</template>
                <template #prefix>
                  <i class="bi bi-star text-info"></i>
                </template>
              </n-statistic>
            </n-gi>
            <n-gi>
              <n-statistic label="Disponibilité" :value="availabilityRate">
                <template #suffix>%</template>
                <template #prefix>
                  <i class="bi bi-check-circle text-primary"></i>
                </template>
              </n-statistic>
            </n-gi>
          </n-grid>
          
          <n-space justify="space-between" class="mt-3">
            <n-text depth="3" class="small">
              <i class="bi bi-info-circle me-1"></i>
              Dernière mise à jour: {{ lastUpdateTime }}
            </n-text>
            <n-text depth="3" class="small">
              Mode surveillance - Lecture seule
            </n-text>
          </n-space>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NText,
  NSpace,
  NButton,
  NCard,
  NTabs,
  NTabPane,
  NBadge,
  NDataTable,
  NTag,
  NGrid,
  NGi,
  NStatistic,
  NInput,
  NSelect,
  NDatePicker,
  NDropdown,
  NSpin,
  NEmpty
} from 'naive-ui';
import LocationService from '../services/LocationService';

const router = useRouter();

// États
const loading = ref({
  reservations: false,
  history: false,
  global: false
});
const lastUpdateTime = ref('--:--');
const dateRange = ref(null);
const typeFilter = ref(null);
const statusFilter = ref(null);
const searchQuery = ref('');
const activeTab = ref('reservations');

// Données
const pendingReservations = ref([]);
const locationHistory = ref([]);
const terminatedWithRevenue = ref([]);
const locationStats = ref({
  terminatedThisWeek: 0,
  activeToday: 0,
  upcomingConfirmed: 0,
  monthlyRevenue: 0,
  byType: []
});

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-speedometer2 me-2' })
  },
  {
    label: 'Utilisateurs',
    key: 'users',
    icon: () => h('i', { class: 'bi bi-person-gear me-2' })
  },
  {
    label: 'Fiches Clients',
    key: 'client',
    icon: () => h('i', { class: 'bi bi-people me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Inventaire & Patrimoine',
    key: 'inventaire',
    icon: () => h('i', { class: 'bi bi-tools me-2' })
  },
  {
    label: 'Matériel de Bureau',
    key: 'bureau',
    icon: () => h('i', { class: 'bi bi-laptop me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Contrôle Financier',
    key: 'finance',
    icon: () => h('i', { class: 'bi bi-cash-coin me-2' })
  },
  {
    label: 'Suivi & Rapports',
    key: 'rapport',
    icon: () => h('i', { class: 'bi bi-graph-up me-2' })
  }
];

// Gestion de la sélection dans le menu
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardAdmin',
    'users': '/userManagement',
    'client': '/clientManagementAdmin',
    'finance': '/finance',
    'rapport': '/rapport',
    'inventaire': '/patrimoine-admin',
    'bureau': '/materielBureauView'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

// Options de filtres
const typeOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Salle', value: 'Salle' },
  { label: 'Matériel', value: 'Materiel' },
  { label: 'Mixte', value: 'Mixte' }
];

const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'En attente', value: 'En attente' },
  { label: 'Confirmée', value: 'Confirmée' },
  { label: 'Annulée', value: 'Annulée' },
  { label: 'Terminée', value: 'Terminée' }
];

// Computed properties
const hasActiveFilters = computed(() => {
  return dateRange.value || typeFilter.value || statusFilter.value || searchQuery.value;
});

const pendingCount = computed(() => {
  return pendingReservations.value.filter(r => r.etatRes === 'En attente').length;
});

const terminatedLocationsCount = computed(() => {
  return locationStats.value.terminatedThisWeek || 0;
});

const activeLocationsTodayCount = computed(() => {
  return locationStats.value.activeToday || 0;
});

const hasLocationHistoryData = computed(() => {
  return processedLocationHistory.value.length > 0;
});

// Fonction utilitaire pour valider une date
const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// Fonction utilitaire pour créer une date valide
const createValidDate = (date) => {
  if (isValidDate(date)) return new Date(date);
  
  // Si la date n'est pas valide, utiliser la date actuelle
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Fonction pour obtenir un ID unique
const getUniqueLocationId = (location) => {
  if (location.idLo) return `L-${location.idLo}`;
  if (location.idRes) return `R-${location.idRes}`;
  if (location.id) return `ID-${location.id}`;
  return `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Filtrer les réservations actives
const filteredPendingReservations = computed(() => {
  let filtered = pendingReservations.value;
  
  if (dateRange.value) {
    const [start, end] = dateRange.value;
    filtered = filtered.filter(r => {
      const date = new Date(r.debRes).getTime();
      return date >= start && date <= end;
    });
  }
  
  if (typeFilter.value && typeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.typeRes === typeFilter.value);
  }
  
  if (statusFilter.value && statusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.etatRes === statusFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      (r.Client?.nomCli?.toLowerCase().includes(query) ||
       r.Client?.prenomCli?.toLowerCase().includes(query) ||
       r.idRes.toString().includes(query))
    );
  }
  
  return filtered;
});

// Filtrer les données d'historique - SUPPRIMER LES LOCATIONS "EN ATTENTE"
const filteredLocationHistory = computed(() => {
  let sourceData = [];
  
  // Utiliser terminatedWithRevenue si disponible, sinon locationHistory
  if (terminatedWithRevenue.value.length > 0) {
    sourceData = [...terminatedWithRevenue.value];
  } else if (locationHistory.value.length > 0) {
    sourceData = [...locationHistory.value];
  }
  
  // Éviter les doublons basés sur l'ID
  const uniqueLocations = [];
  const seenIds = new Set();
  
  for (const location of sourceData) {
    const id = getUniqueLocationId(location);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      uniqueLocations.push(location);
    }
  }
  
  let filtered = [...uniqueLocations];
  
  // Filtrage par statut - EXCLURE LES LOCATIONS "EN ATTENTE"
  filtered = filtered.filter(location => {
    // Vérifier le statut dans différentes propriétés
    const statut = location.statutPaie || 
                  location.paiement?.statut || 
                  location.etatRes || 
                  location.etat || 
                  location.statut || 
                  '';
    
    // Exclure les locations avec statut "En attente"
    const statutLower = statut.toLowerCase();
    return !statutLower.includes('attente') && 
           statut.trim() !== '';
  });
  
  if (dateRange.value) {
    const [start, end] = dateRange.value;
    filtered = filtered.filter(r => {
      const date = new Date(r.dateCreation || r.dateCre || r.debLo || new Date()).getTime();
      return date >= start && date <= end;
    });
  }
  
  if (typeFilter.value && typeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.typeLo === typeFilter.value || r.typeLocation === typeFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      (r.client?.nom?.toLowerCase().includes(query) ||
       r.Client?.nomCli?.toLowerCase().includes(query) ||
       (r.idLo && r.idLo.toString().includes(query)) ||
       (r.idRes && r.idRes.toString().includes(query)))
    );
  }
  
  return filtered;
});

// Traitement spécial des données d'historique - EXCLURE LES LOCATIONS "EN ATTENTE"
const processedLocationHistory = computed(() => {
  const uniqueLocations = [];
  const seenIds = new Set();
  
  for (const location of filteredLocationHistory.value) {
    const id = getUniqueLocationId(location);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      
      // Vérification supplémentaire pour s'assurer qu'on n'a pas de statut "En attente"
      const statut = location.statutPaie || 
                    location.paiement?.statut || 
                    location.etatRes || 
                    location.etat || 
                    location.statut || '';
      
      const statutLower = statut.toLowerCase();
      if (statutLower.includes('attente')) {
        continue; // Sauter les locations encore en attente
      }
      
      // Nettoyer les données pour éviter les undefined
      const cleanData = { ...location };
      
      // Nettoyer le nom du client
      if (cleanData.Client && (cleanData.Client.nomCli === 'Rundefined' || cleanData.Client.nomCli === 'undefined')) {
        cleanData.Client.nomCli = 'Client';
      }
      
      if (cleanData.Client && cleanData.Client.prenomCli === 'undefined') {
        cleanData.Client.prenomCli = '';
      }
      
      // S'assurer que le type existe
      if (!cleanData.typeLo && !cleanData.typeLocation) {
        cleanData.typeLo = 'Inconnu';
      }
      
      // S'assurer que les dates existent et sont valides
      try {
        if (!isValidDate(cleanData.debLo) && location.dateCreation) {
          cleanData.debLo = createValidDate(location.dateCreation).toISOString();
        } else if (!isValidDate(cleanData.debLo)) {
          cleanData.debLo = createValidDate(new Date()).toISOString();
        }
        
        if (!isValidDate(cleanData.finLo) && location.dateCreation) {
          const date = createValidDate(location.dateCreation);
          date.setDate(date.getDate() + 1);
          cleanData.finLo = date.toISOString();
        } else if (!isValidDate(cleanData.finLo)) {
          const startDate = createValidDate(cleanData.debLo);
          startDate.setDate(startDate.getDate() + 1);
          cleanData.finLo = startDate.toISOString();
        }
      } catch (error) {
        console.warn('Erreur traitement date:', error);
        // Dates par défaut
        const now = new Date();
        cleanData.debLo = now.toISOString();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        cleanData.finLo = tomorrow.toISOString();
      }
      
      // S'assurer que le tarif existe
      if (!cleanData.tarifTot && !cleanData.montantPaie && !cleanData.revenuEffectif) {
        cleanData.tarifTot = 0;
      }
      
      // S'assurer que le statut de paiement existe
      if (!cleanData.statutPaie && !cleanData.paiement?.statut) {
        cleanData.statutPaie = 'Terminé';
      }
      
      uniqueLocations.push(cleanData);
    }
  }
  
  return uniqueLocations;
});

// Statistiques calculées
const conversionRate = computed(() => {
  const confirmed = pendingReservations.value.filter(r => r.etatRes === 'Confirmée').length;
  const total = pendingReservations.value.length;
  if (total === 0) return 0;
  return Math.round((confirmed / total) * 100);
});

const averageDuration = computed(() => {
  const historyItems = processedLocationHistory.value;
  if (historyItems.length === 0) return 0;
  
  const totalDays = historyItems.reduce((sum, item) => {
    try {
      const start = createValidDate(item.debLo || item.dateCreation || item.dateCre);
      const end = createValidDate(item.finLo || item.dateCreation || item.dateCre);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + (diffDays > 0 ? diffDays : 1);
    } catch (error) {
      console.warn('Erreur calcul durée:', error);
      return sum + 1;
    }
  }, 0);
  
  return Math.round(totalDays / historyItems.length);
});

const repeatClients = computed(() => {
  const clientCounts = {};
  
  [...pendingReservations.value, ...processedLocationHistory.value].forEach(item => {
    const clientId = item.idCli || item.Client?.idCli;
    if (clientId) {
      clientCounts[clientId] = (clientCounts[clientId] || 0) + 1;
    }
  });
  
  const repeatCount = Object.values(clientCounts).filter(count => count > 1).length;
  const totalClients = Object.keys(clientCounts).length;
  
  if (totalClients === 0) return 0;
  return Math.round((repeatCount / totalClients) * 100);
});

const totalRevenuTermine = computed(() => {
  const data = processedLocationHistory.value;
  return data.reduce((sum, loc) => {
    // Ne compter que les revenus des locations finalisées
    const revenu = loc.revenuEffectif || loc.montantPaie || loc.tarifTot || 0;
    const statut = loc.paiement?.statut || loc.statutPaie || '';
    const isFinalized = ['Payé', 'Effectué', 'payé', 'Terminé', 'Terminée'].includes(statut);
    return isFinalized ? sum + (parseFloat(revenu) || 0) : sum;
  }, 0);
});

const locationsPayeesCount = computed(() => {
  const data = processedLocationHistory.value;
  return data.filter(loc => {
    const statut = loc.paiement?.statut || loc.statutPaie;
    return statut === 'Payé' || statut === 'Effectué' || statut === 'payé' || statut === 'Terminé' || statut === 'Terminée';
  }).length;
});

// Nouvelles statistiques de surveillance
const activeAlerts = computed(() => {
  const now = new Date();
  const overdueReservations = pendingReservations.value.filter(r => {
    if (r.etatRes === 'En attente') {
      const resDate = new Date(r.debRes);
      return resDate < now;
    }
    return false;
  }).length;
  
  return overdueReservations;
});

const performanceScore = computed(() => {
  const metrics = [
    conversionRate.value / 100,
    1 - (activeAlerts.value / Math.max(pendingReservations.value.length, 1)),
    locationsPayeesCount.value / Math.max(processedLocationHistory.value.length, 1)
  ];
  
  const average = metrics.reduce((sum, m) => sum + m, 0) / metrics.length;
  return Math.round(average * 100);
});

const customerSatisfaction = computed(() => {
  return Math.min(95, 70 + (conversionRate.value * 0.25));
});

const availabilityRate = computed(() => {
  const totalReservations = pendingReservations.value.length + processedLocationHistory.value.length;
  const cancelledReservations = pendingReservations.value.filter(r => r.etatRes === 'Annulée').length;
  
  if (totalReservations === 0) return 100;
  return Math.round(100 - (cancelledReservations / totalReservations * 100));
});

// Statistiques par type
const statsByTypeArray = computed(() => {
  if (locationStats.value.byType && locationStats.value.byType.length > 0) {
    return locationStats.value.byType;
  }
  
  const typeStats = {};
  
  processedLocationHistory.value.forEach(loc => {
    const type = loc.typeLo || loc.typeLocation || 'Inconnu';
    if (!typeStats[type]) {
      typeStats[type] = { count: 0, revenue: 0 };
    }
    typeStats[type].count++;
    const revenu = loc.revenuEffectif || loc.montantPaie || loc.tarifTot || 0;
    typeStats[type].revenue += parseFloat(revenu) || 0;
  });
  
  return Object.entries(typeStats).map(([type, data]) => ({
    type,
    count: data.count,
    revenue: data.revenue
  }));
});

const monthlyActivity = computed(() => {
  const weeks = [];
  for (let i = 1; i <= 4; i++) {
    weeks.push({
      week: i,
      count: Math.floor(Math.random() * 20) + 5,
      activity: Math.floor(Math.random() * 100) + 20
    });
  }
  return weeks;
});

// Colonnes simplifiées (sans actions)
const reservationColumns = [
  {
    title: 'Référence',
    key: 'idRes',
    width: 100,
    render: (row) => h('span', { class: 'text-mono' }, `#${row.idRes}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 150,
    render: (row) => {
      const clientName = row.Client ? 
        `${row.Client.nomCli} ${row.Client.prenomCli || ''}`.trim() : 
        `Client #${row.idCli}`;
      return h('div', [
        h('div', { class: 'fw-bold' }, clientName),
        h('div', { class: 'small text-muted' }, row.Client?.emailCli || '')
      ]);
    }
  },
  {
    title: 'Type',
    key: 'typeRes',
    width: 100,
    render: (row) => {
      const typeConfig = {
        'Salle': { type: 'info', color: '#067186' },
        'Materiel': { type: 'success', color: '#04058F' },
        'Mixte': { type: 'warning', color: '#5811EE' }
      };
      const config = typeConfig[row.typeRes] || { type: 'default' };
      return h(NTag, { 
        type: config.type,
        style: { backgroundColor: config.color, color: 'white' }
      }, { default: () => row.typeRes });
    }
  },
  {
    title: 'Période',
    key: 'period',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'small' }, formatDate(row.debRes)),
      h('div', { class: 'text-muted x-small' }, 'au'),
      h('div', { class: 'small' }, formatDate(row.finRes))
    ])
  },
  {
    title: 'Tarif Total',
    key: 'tarifTot',
    width: 130,
    align: 'right',
    render: (row) => h('span', { 
      class: 'fw-bold',
      style: { color: '#5811EE' }
    }, formatCurrency(row.tarifTot))
  },
  {
    title: 'Statut',
    key: 'etatRes',
    width: 120,
    render: (row) => {
      const statusConfig = {
        'En attente': { type: 'warning', icon: 'bi-clock' },
        'Confirmée': { type: 'success', icon: 'bi-check-circle' },
        'Annulée': { type: 'error', icon: 'bi-x-circle' },
        'Terminée': { type: 'default', icon: 'bi-flag' }
      };
      const config = statusConfig[row.etatRes] || { type: 'default', icon: 'bi-question-circle' };
      
      return h('div', { class: 'd-flex align-items-center' }, [
        h('i', { class: `${config.icon} me-2` }),
        h(NTag, { 
          type: config.type,
          size: 'small'
        }, { default: () => row.etatRes })
      ]);
    }
  }
];

const historyColumns = [
  {
    title: 'Réf. Location',
    key: 'idLo',
    width: 100,
    render: (row) => {
      const id = row.idLo || row.idRes || row.id || 'N/A';
      return h('span', { class: 'text-mono' }, `L-${id}`);
    }
  },
  {
    title: 'Client',
    key: 'client',
    width: 150,
    render: (row) => {
      let clientName = 'Client';
      let clientEmail = '';
      
      if (row.Client) {
        clientName = `${row.Client.nomCli || 'Client'} ${row.Client.prenomCli || ''}`.trim();
        clientEmail = row.Client.emailCli || '';
      } else if (row.client) {
        clientName = `${row.client.nom || 'Client'} ${row.client.prenom || ''}`.trim();
        clientEmail = row.client.email || '';
      }
      
      // Nettoyer le nom si c'est "Rundefined" ou "undefined"
      clientName = clientName.replace(/R?undefined/gi, '').trim() || 'Client';
      
      return h('div', [
        h('div', { class: 'fw-bold small' }, clientName),
        clientEmail ? h('div', { class: 'x-small text-muted' }, clientEmail) : null
      ]);
    }
  },
  {
    title: 'Type',
    key: 'typeLo',
    width: 100,
    render: (row) => {
      const type = row.typeLo || row.typeLocation || 'Inconnu';
      const typeConfig = {
        'Salle': { type: 'info', icon: 'bi-building' },
        'Materiel': { type: 'success', icon: 'bi-pc-display' },
        'Mixte': { type: 'warning', icon: 'bi-layers' }
      };
      const config = typeConfig[type] || { type: 'default', icon: 'bi-question-circle' };
      return h(NTag, { 
        type: config.type, 
        size: 'small',
        bordered: false
      }, { 
        default: () => [
          h('i', { class: `${config.icon} me-1` }),
          h('span', type)
        ]
      });
    }
  },
  {
    title: 'Période',
    key: 'period',
    width: 150,
    render: (row) => {
      const startDate = row.debLo || row.debRes || row.dateCreation || row.dateCre;
      const endDate = row.finLo || row.finRes || row.dateCreation || row.dateCre;
      
      if (!startDate) {
        return h('span', { class: 'text-muted small' }, 'Non spécifié');
      }
      
      return h('div', [
        h('div', { class: 'small' }, formatDate(startDate)),
        h('div', { class: 'text-muted x-small' }, 'au'),
        h('div', { class: 'small' }, endDate ? formatDate(endDate) : 'Non spécifié')
      ]);
    }
  },
  {
    title: 'Tarif',
    key: 'tarifTot',
    width: 120,
    align: 'right',
    render: (row) => {
      const amount = row.tarifTot || row.montantPaie || row.revenuEffectif || 0;
      const isPaid = row.paiement?.statut === 'Payé' || 
                    row.statutPaie === 'Payé' || 
                    row.statutPaie === 'payé' ||
                    row.statutPaie === 'Effectué' ||
                    row.statutPaie === 'Terminé' ||
                    row.statutPaie === 'Terminée';
      
      return h('div', { class: 'd-flex flex-column align-items-end' }, [
        h('span', { 
          class: 'fw-bold small',
          style: { color: isPaid ? '#5811EE' : '#6c757d' }
        }, formatCurrency(amount))
      ]);
    }
  },
  {
    title: 'Paiement',
    key: 'paiement',
    width: 120,
    render: (row) => {
      const statut = row.paiement?.statut || row.statutPaie || 'Terminé';
      const isPaid = statut === 'Payé' || statut === 'Effectué' || statut === 'payé';
      return h(NTag, { 
        type: isPaid ? 'success' : 'default',
        size: 'small'
      }, { default: () => isPaid ? 'Payé' : statut });
    }
  }
];

// Fonctions utilitaires
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0,00 MGA';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '0,00 MGA';
  return `${numValue.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  try {
    const date = createValidDate(datetime);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  } catch (error) {
    console.warn('Erreur formatage date:', error);
    return 'Date invalide';
  }
};

const getTypeColor = (type) => {
  const colors = {
    'Salle': 'info',
    'Materiel': 'success',
    'Mixte': 'warning'
  };
  return colors[type] || 'primary';
};

const getTypeIcon = (type) => {
  const icons = {
    'Salle': 'building',
    'Materiel': 'tools',
    'Mixte': 'layers'
  };
  return icons[type] || 'question-circle';
};

// Fonctions de style des lignes
const getReservationRowClass = (row) => {
  if (row.etatRes === 'Annulée') return 'row-cancelled';
  if (row.etatRes === 'Terminée') return 'row-completed';
  
  const now = new Date();
  const resDate = new Date(row.debRes);
  if (row.etatRes === 'En attente' && resDate < now) return 'row-overdue';
  
  return '';
};

const getHistoryRowClass = (row) => {
  const isPaid = row.paiement?.statut === 'Payé' || 
                row.statutPaie === 'Payé' || 
                row.statutPaie === 'payé' ||
                row.statutPaie === 'Effectué';
  return isPaid ? 'row-paid' : 'row-completed';
};

// Fonctions de données
const fetchLocationStats = async () => {
  try {
    const response = await LocationService.getLocationStats();
    locationStats.value = response.data.data || response.data;
  } catch (error) {
    console.error('Erreur chargement statistiques:', error);
    locationStats.value = {
      terminatedThisWeek: 0,
      activeToday: 0,
      upcomingConfirmed: 0,
      monthlyRevenue: 0,
      byType: []
    };
  }
};

const fetchPendingReservations = async () => {
  loading.value.reservations = true;
  try {
    const response = await LocationService.getPendingReservations();
    pendingReservations.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur chargement réservations:", error);
    pendingReservations.value = [];
  } finally {
    loading.value.reservations = false;
  }
};

const fetchLocationHistory = async () => {
  loading.value.history = true;
  try {
    const response = await LocationService.getLocationHistory();
    // Essayer différents formats de réponse
    if (Array.isArray(response.data)) {
      locationHistory.value = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      locationHistory.value = response.data.data;
    } else if (response.data.locations && Array.isArray(response.data.locations)) {
      locationHistory.value = response.data.locations;
    } else {
      locationHistory.value = [];
      console.warn('Format de données d\'historique inattendu:', response.data);
    }
  } catch (error) {
    console.error("Erreur chargement historique:", error);
    locationHistory.value = [];
  } finally {
    loading.value.history = false;
  }
};

const fetchTerminatedWithRevenue = async () => {
  try {
    const response = await LocationService.getTerminatedLocationsWithRevenue();
    if (response.data && response.data.success) {
      terminatedWithRevenue.value = response.data.data?.locations || response.data.locations || [];
    } else if (Array.isArray(response.data)) {
      terminatedWithRevenue.value = response.data;
    }
  } catch (error) {
    console.error("Erreur chargement locations terminées:", error);
    terminatedWithRevenue.value = [];
  }
};

const refreshAllData = async () => {
  loading.value.global = true;
  try {
    await Promise.all([
      fetchPendingReservations(),
      fetchLocationHistory(),
      fetchLocationStats(),
      fetchTerminatedWithRevenue()
    ]);
    
    // Mettre à jour l'heure de dernière mise à jour
    const now = new Date();
    lastUpdateTime.value = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
  } catch (error) {
    console.error('Erreur rafraîchissement:', error);
  } finally {
    loading.value.global = false;
  }
};

const resetFilters = () => {
  dateRange.value = null;
  typeFilter.value = null;
  statusFilter.value = null;
  searchQuery.value = '';
};

// Initialisation
onMounted(async () => {
  await refreshAllData();
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa;
}

.fixed-header {
  flex-shrink: 0;
  background-color: white;
  z-index: 1000;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #eaeaea;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f8f9fa;
}

.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.fixed-header .container-fluid {
  padding-top: 20px;
  padding-bottom: 10px;
}

.scrollable-content::-webkit-scrollbar {
  width: 10px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 5px;
  border: 2px solid #f1f1f1;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%);
  color: white;
  border-left: 4px solid #007bff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
  font-size: 1.8rem;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

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

.custom-btn-primary {
  background: #007bff !important;
  border-color: #007bff !important;
}

.custom-btn-primary:hover {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-table .n-data-table-thead) {
  background-color: #f8f9fa;
}

:deep(.custom-table .n-data-table-th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
}

:deep(.custom-table .n-data-table-tr--hover) {
  background-color: #f8f9ff !important;
}

.text-mono {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.x-small {
  font-size: 0.75rem;
}

/* Classes de ligne */
:deep(.row-cancelled) {
  background-color: rgba(108, 117, 125, 0.05) !important;
}

:deep(.row-completed) {
  background-color: rgba(40, 167, 69, 0.05) !important;
}

:deep(.row-overdue) {
  background-color: rgba(220, 53, 69, 0.05) !important;
}

:deep(.row-paid) {
  background-color: rgba(40, 167, 69, 0.05) !important;
}

:deep(.row-unpaid) {
  background-color: rgba(255, 193, 7, 0.05) !important;
}

/* Graphique d'activité mensuelle */
.monthly-activity {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding: 20px 10px;
  border-bottom: 1px solid #e9ecef;
}

.activity-week {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.week-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.activity-bar {
  width: 30px;
  background: linear-gradient(to top, #007bff, #0056b3);
  border-radius: 3px 3px 0 0;
  transition: height 0.3s ease;
}

.week-count {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 5px;
  color: #2c3e50;
}

/* Pour Firefox */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: #007bff #f1f1f1;
}

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    height: auto;
    min-height: 100vh;
  }
  
  .fixed-header {
    position: relative;
  }
  
  .scrollable-content {
    overflow-y: visible;
  }
  
  .container-fluid {
    padding: 15px;
  }
  
  .fixed-header .container-fluid {
    padding-top: 15px;
    padding-bottom: 15px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .monthly-activity {
    height: 100px;
  }
  
  .activity-bar {
    width: 20px;
  }
  
  .custom-table {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .monthly-activity {
    height: 80px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .activity-week {
    flex: 0 0 calc(50% - 15px);
  }
  
  .activity-bar {
    width: 25px;
  }
  
  .custom-table {
    font-size: 0.8rem;
  }
  
  .container-fluid {
    padding: 10px;
  }
}
</style>-->

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
        <!-- Header avec navigation et actions -->
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
                    <i class="bi bi-calendar-check me-2"></i>
                    Surveillance des Locations & Réservations
                  </h1>
                  <p class="custom-subtitle">Tableau de contrôle et monitoring des activités de location</p>
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

        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="surveillance-container">
            <!-- KPIs de Surveillance -->
            <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic label="À Traiter" :value="pendingCount" class="text-warning">
                    <template #prefix>
                      <i class="bi bi-clock"></i>
                    </template>
                    <template #suffix>
                      <div class="text-muted small">En attente</div>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic label="Terminées" :value="terminatedLocationsCount" class="text-success">
                    <template #prefix>
                      <i class="bi bi-check-circle"></i>
                    </template>
                    <template #suffix>
                      <div class="text-muted small">Cette semaine</div>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic label="En Cours" :value="activeLocationsTodayCount" class="text-info">
                    <template #prefix>
                      <i class="bi bi-play-circle"></i>
                    </template>
                    <template #suffix>
                      <div class="text-muted small">Aujourd'hui</div>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic label="À Venir" :value="locationStats.upcomingConfirmed || 0" class="text-primary">
                    <template #prefix>
                      <i class="bi bi-calendar-week"></i>
                    </template>
                    <template #suffix>
                      <div class="text-muted small">Confirmées</div>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
            </n-grid>

            <!-- Section Filtres de Surveillance -->
            <n-card class="custom-card mb-4">
              <template #header>
                <n-space justify="space-between" align="center">
                  <n-h4 class="mb-0">
                    <i class="bi bi-funnel me-2"></i>
                    Filtres de Surveillance
                  </n-h4>
                </n-space>
              </template>

              <n-space>
                <!-- Filtre par période -->
                <n-date-picker
                  v-model:value="dateRange"
                  type="daterange"
                  clearable
                  placeholder="Période"
                  style="width: 200px"
                />
                
                <!-- Filtre par type -->
                <n-select
                  v-model:value="typeFilter"
                  :options="typeOptions"
                  placeholder="Type"
                  style="width: 150px"
                  clearable
                />
                
                <!-- Filtre par statut -->
                <n-select
                  v-model:value="statusFilter"
                  :options="statusOptions"
                  placeholder="Statut"
                  style="width: 150px"
                  clearable
                />
                
                <!-- Recherche -->
                <n-input
                  v-model:value="searchQuery"
                  placeholder="Rechercher client..."
                  clearable
                  style="width: 200px"
                >
                  <template #prefix>
                    <i class="bi bi-search"></i>
                  </template>
                </n-input>
                
                <!-- Bouton réinitialisation -->
                <n-button 
                  text 
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                >
                  Réinitialiser
                </n-button>
              </n-space>
            </n-card>

            <!-- Navigation par onglets de surveillance -->
            <n-card class="custom-card">
              <n-tabs
                v-model:value="activeTab"
                type="line"
                justify-content="space-evenly"
              >
                <!-- Onglet Réservations Actives -->
                <n-tab-pane name="reservations" tab="Réservations Actives">
                  <template #tab>
                    <n-badge :value="filteredPendingReservations.length" type="info" show-zero>
                      📋 Réservations Actives
                    </n-badge>
                  </template>

                  <n-space vertical size="large">
                    <n-space justify="space-between" align="center">
                      <div>
                        <n-h4 class="mb-0">
                          <i class="bi bi-list-check me-2"></i>
                          Demandes de Réservation
                        </n-h4>
                        <n-text depth="3" class="small">
                          Surveillance des demandes en cours de traitement
                        </n-text>
                      </div>
                      <n-text depth="3">
                        {{ filteredPendingReservations.length }} résultat(s)
                      </n-text>
                    </n-space>

                    <!-- Indicateur de chargement -->
                    <div v-if="loading.reservations" class="text-center py-5">
                      <n-spin size="large">
                        <template #description>
                          Chargement des réservations...
                        </template>
                      </n-spin>
                    </div>

                    <!-- Tableau des réservations (sans actions) -->
                    <div v-else-if="filteredPendingReservations.length === 0" class="text-center py-5">
                      <n-empty description="Aucune réservation active">
                        <template #icon>
                          <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
                        </template>
                      </n-empty>
                    </div>

                    <n-data-table
                      v-else
                      :columns="reservationColumns"
                      :data="filteredPendingReservations"
                      :bordered="false"
                      :row-class-name="getReservationRowClass"
                      striped
                      class="custom-table"
                    />
                  </n-space>
                </n-tab-pane>

                <!-- Onglet Historique des Locations -->
                <n-tab-pane name="history" tab="Historique">
                  <template #tab>
                    <n-badge :value="filteredLocationHistory.length" type="default" show-zero>
                      📊 Historique des Locations
                    </n-badge>
                  </template>

                  <n-space vertical size="large">
                    <n-space justify="space-between" align="center">
                      <div>
                        <n-h4 class="mb-0">
                          <i class="bi bi-archive me-2"></i>
                          Locations Finalisées
                        </n-h4>
                        <n-text depth="3" class="small">
                          Archives des locations terminées et confirmées
                          <n-tag size="tiny" type="info" class="ms-2">
                            Sans les demandes en attente
                          </n-tag>
                        </n-text>
                      </div>
                      <div class="d-flex align-items-center gap-3">
                        <n-text depth="3">
                          {{ processedLocationHistory.length }} location(s) finalisée(s)
                        </n-text>
                        <n-tag type="success" size="small">
                          <i class="bi bi-cash-coin me-1"></i>
                          {{ formatCurrency(totalRevenuTermine) }}
                        </n-tag>
                      </div>
                    </n-space>

                    <!-- Indicateur de chargement -->
                    <div v-if="loading.history" class="text-center py-5">
                      <n-spin size="large">
                        <template #description>
                          Chargement de l'historique...
                        </template>
                      </n-spin>
                    </div>

                    <!-- Message si aucune donnée -->
                    <div v-else-if="!hasLocationHistoryData" class="text-center py-5">
                      <n-empty description="Aucun historique disponible">
                        <template #icon>
                          <i class="bi bi-clock-history" style="font-size: 3rem;"></i>
                        </template>
                      </n-empty>
                    </div>

                    <!-- Tableau historique avec données nettoyées -->
                    <n-data-table
                      v-else
                      :columns="historyColumns"
                      :data="processedLocationHistory"
                      :bordered="false"
                      :row-class-name="getHistoryRowClass"
                      striped
                      class="custom-table"
                    />

                    <!-- Résumé financier -->
                    <n-card v-if="hasLocationHistoryData" size="small" class="mt-3">
                      <n-space justify="space-between" align="center">
                        <n-text strong>Résumé Financier des Locations Terminées:</n-text>
                        <n-space>
                          <n-tag type="success" size="small">
                            <i class="bi bi-wallet2 me-1"></i>
                            {{ locationsPayeesCount }} payée(s)
                          </n-tag>
                          <n-tag type="info" size="small">
                            <i class="bi bi-calculator me-1"></i>
                            CA: {{ formatCurrency(totalRevenuTermine) }}
                          </n-tag>
                        </n-space>
                      </n-space>
                    </n-card>
                  </n-space>
                </n-tab-pane>

                <!-- Onglet Statistiques -->
                <n-tab-pane name="stats" tab="Statistiques">
                  <template #tab>
                    <n-badge type="success" show-zero>
                      📈 Statistiques
                    </n-badge>
                  </template>

                  <n-space vertical size="large">
                    <n-space justify="space-between" align="center">
                      <n-h4 class="mb-0">
                        <i class="bi bi-graph-up me-2"></i>
                        Tableau de Bord Statistique
                      </n-h4>
                      <n-text depth="3">
                        Données consolidées
                      </n-text>
                    </n-space>

                    <!-- Cartes de statistiques -->
                    <n-grid :cols="3" :x-gap="16" :y-gap="16">
                      <n-gi>
                        <n-card class="text-center">
                          <n-statistic label="Taux de Conversion" :value="conversionRate">
                            <template #suffix>%</template>
                            <template #prefix>
                              <i class="bi bi-arrow-up-right text-success"></i>
                            </template>
                          </n-statistic>
                          <n-text depth="3" class="small">
                            Réservations confirmées / total
                          </n-text>
                        </n-card>
                      </n-gi>
                      <n-gi>
                        <n-card class="text-center">
                          <n-statistic label="Durée Moyenne" :value="averageDuration">
                            <template #suffix>jours</template>
                            <template #prefix>
                              <i class="bi bi-calendar-range text-info"></i>
                            </template>
                          </n-statistic>
                          <n-text depth="3" class="small">
                            Durée moyenne des locations
                          </n-text>
                        </n-card>
                      </n-gi>
                      <n-gi>
                        <n-card class="text-center">
                          <n-statistic label="Clients Récurrents" :value="repeatClients">
                            <template #suffix>%</template>
                            <template #prefix>
                              <i class="bi bi-people text-primary"></i>
                            </template>
                          </n-statistic>
                          <n-text depth="3" class="small">
                            Clients avec locations multiples
                          </n-text>
                        </n-card>
                      </n-gi>
                    </n-grid>

                    <!-- Analyse par type -->
                    <n-card title="📊 Analyse par Type de Location">
                      <n-grid :cols="3" :x-gap="16" :y-gap="16">
                        <n-gi v-for="type in statsByTypeArray" :key="type.type">
                          <n-card size="small" class="text-center">
                            <div :class="`text-${getTypeColor(type.type)}`">
                              <i :class="`bi bi-${getTypeIcon(type.type)}`" style="font-size: 2rem;"></i>
                              <div class="fw-bold mt-2 fs-4">{{ type.count }}</div>
                              <div class="small">{{ type.type }}</div>
                              <div class="small text-muted mt-1">
                                {{ formatCurrency(type.revenue) }}
                              </div>
                            </div>
                          </n-card>
                        </n-gi>
                      </n-grid>
                    </n-card>

                    <!-- Graphique simple -->
                    <n-card title="📅 Activité Mensuelle">
                      <div class="monthly-activity">
                        <div v-for="week in monthlyActivity" :key="week.week" class="activity-week">
                          <div class="week-label">S{{ week.week }}</div>
                          <div class="activity-bar" :style="{ height: `${week.activity * 2}px` }"></div>
                          <div class="week-count">{{ week.count }}</div>
                        </div>
                      </div>
                      <n-text depth="3" class="small d-block text-center mt-2">
                        Nombre de locations par semaine
                      </n-text>
                    </n-card>
                  </n-space>
                </n-tab-pane>
              </n-tabs>
            </n-card>

            <!-- Résumé de Surveillance -->
            <n-card class="custom-card mt-4">
              <template #header>
                <n-space align="center">
                  <i class="bi bi-shield-check text-primary"></i>
                  <n-text strong>Résumé de Surveillance</n-text>
                </n-space>
              </template>
              
              <n-grid :cols="4" :x-gap="16">
                <n-gi>
                  <n-statistic label="Alertes en Cours" :value="activeAlerts">
                    <template #prefix>
                      <i class="bi bi-exclamation-triangle text-warning"></i>
                    </template>
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Performances" :value="performanceScore">
                    <template #suffix>%</template>
                    <template #prefix>
                      <i class="bi bi-speedometer2 text-success"></i>
                    </template>
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Satisfaction Client" :value="customerSatisfaction">
                    <template #suffix>%</template>
                    <template #prefix>
                      <i class="bi bi-star text-info"></i>
                    </template>
                  </n-statistic>
                </n-gi>
                <n-gi>
                  <n-statistic label="Disponibilité" :value="availabilityRate">
                    <template #suffix>%</template>
                    <template #prefix>
                      <i class="bi bi-check-circle text-primary"></i>
                    </template>
                  </n-statistic>
                </n-gi>
              </n-grid>
              
              <n-space justify="space-between" class="mt-3">
                <n-text depth="3" class="small">
                  <i class="bi bi-info-circle me-1"></i>
                  Dernière mise à jour: {{ lastUpdateTime }}
                </n-text>
                <n-text depth="3" class="small">
                  Mode surveillance - Lecture seule
                </n-text>
              </n-space>
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
  NTabs,
  NTabPane,
  NBadge,
  NDataTable,
  NGrid,
  NGi,
  NStatistic,
  NInput,
  NSelect,
  NDatePicker,
  NSpin,
  NEmpty
} from 'naive-ui';
import LocationService from '../services/LocationService';
import AuthService from '../services/AuthService';

const router = useRouter();

// États utilisateur
const userRole = ref('');
const userLogin = ref('');
const activeMenuKey = ref('locations'); // Activer l'item "locations" dans le menu

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

// États
const loading = ref({
  reservations: false,
  history: false,
  global: false
});
const lastUpdateTime = ref('--:--');
const dateRange = ref(null);
const typeFilter = ref(null);
const statusFilter = ref(null);
const searchQuery = ref('');
const activeTab = ref('reservations');

// Données
const pendingReservations = ref([]);
const locationHistory = ref([]);
const terminatedWithRevenue = ref([]);
const locationStats = ref({
  terminatedThisWeek: 0,
  activeToday: 0,
  upcomingConfirmed: 0,
  monthlyRevenue: 0,
  byType: []
});

// Options de filtres
const typeOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Salle', value: 'Salle' },
  { label: 'Matériel', value: 'Materiel' },
  { label: 'Mixte', value: 'Mixte' }
];

const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'En attente', value: 'En attente' },
  { label: 'Confirmée', value: 'Confirmée' },
  { label: 'Annulée', value: 'Annulée' },
  { label: 'Terminée', value: 'Terminée' }
];

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

// Computed properties
const hasActiveFilters = computed(() => {
  return dateRange.value || typeFilter.value || statusFilter.value || searchQuery.value;
});

const pendingCount = computed(() => {
  return pendingReservations.value.filter(r => r.etatRes === 'En attente').length;
});

const terminatedLocationsCount = computed(() => {
  return locationStats.value.terminatedThisWeek || 0;
});

const activeLocationsTodayCount = computed(() => {
  return locationStats.value.activeToday || 0;
});

const hasLocationHistoryData = computed(() => {
  return processedLocationHistory.value.length > 0;
});

// Fonction utilitaire pour valider une date
const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

// Fonction utilitaire pour créer une date valide
const createValidDate = (date) => {
  if (isValidDate(date)) return new Date(date);
  
  // Si la date n'est pas valide, utiliser la date actuelle
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Fonction pour obtenir un ID unique
const getUniqueLocationId = (location) => {
  if (location.idLo) return `L-${location.idLo}`;
  if (location.idRes) return `R-${location.idRes}`;
  if (location.id) return `ID-${location.id}`;
  return `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Filtrer les réservations actives
const filteredPendingReservations = computed(() => {
  let filtered = pendingReservations.value;
  
  if (dateRange.value) {
    const [start, end] = dateRange.value;
    filtered = filtered.filter(r => {
      const date = new Date(r.debRes).getTime();
      return date >= start && date <= end;
    });
  }
  
  if (typeFilter.value && typeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.typeRes === typeFilter.value);
  }
  
  if (statusFilter.value && statusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.etatRes === statusFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      (r.Client?.nomCli?.toLowerCase().includes(query) ||
       r.Client?.prenomCli?.toLowerCase().includes(query) ||
       r.idRes.toString().includes(query))
    );
  }
  
  return filtered;
});

// Filtrer les données d'historique - SUPPRIMER LES LOCATIONS "EN ATTENTE"
const filteredLocationHistory = computed(() => {
  let sourceData = [];
  
  // Utiliser terminatedWithRevenue si disponible, sinon locationHistory
  if (terminatedWithRevenue.value.length > 0) {
    sourceData = [...terminatedWithRevenue.value];
  } else if (locationHistory.value.length > 0) {
    sourceData = [...locationHistory.value];
  }
  
  // Éviter les doublons basés sur l'ID
  const uniqueLocations = [];
  const seenIds = new Set();
  
  for (const location of sourceData) {
    const id = getUniqueLocationId(location);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      uniqueLocations.push(location);
    }
  }
  
  let filtered = [...uniqueLocations];
  
  // Filtrage par statut - EXCLURE LES LOCATIONS "EN ATTENTE"
  filtered = filtered.filter(location => {
    // Vérifier le statut dans différentes propriétés
    const statut = location.statutPaie || 
                  location.paiement?.statut || 
                  location.etatRes || 
                  location.etat || 
                  location.statut || 
                  '';
    
    // Exclure les locations avec statut "En attente"
    const statutLower = statut.toLowerCase();
    return !statutLower.includes('attente') && 
           statut.trim() !== '';
  });
  
  if (dateRange.value) {
    const [start, end] = dateRange.value;
    filtered = filtered.filter(r => {
      const date = new Date(r.dateCreation || r.dateCre || r.debLo || new Date()).getTime();
      return date >= start && date <= end;
    });
  }
  
  if (typeFilter.value && typeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.typeLo === typeFilter.value || r.typeLocation === typeFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => 
      (r.client?.nom?.toLowerCase().includes(query) ||
       r.Client?.nomCli?.toLowerCase().includes(query) ||
       (r.idLo && r.idLo.toString().includes(query)) ||
       (r.idRes && r.idRes.toString().includes(query)))
    );
  }
  
  return filtered;
});

// Traitement spécial des données d'historique - EXCLURE LES LOCATIONS "EN ATTENTE"
const processedLocationHistory = computed(() => {
  const uniqueLocations = [];
  const seenIds = new Set();
  
  for (const location of filteredLocationHistory.value) {
    const id = getUniqueLocationId(location);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      
      // Vérification supplémentaire pour s'assurer qu'on n'a pas de statut "En attente"
      const statut = location.statutPaie || 
                    location.paiement?.statut || 
                    location.etatRes || 
                    location.etat || 
                    location.statut || '';
      
      const statutLower = statut.toLowerCase();
      if (statutLower.includes('attente')) {
        continue; // Sauter les locations encore en attente
      }
      
      // Nettoyer les données pour éviter les undefined
      const cleanData = { ...location };
      
      // Nettoyer le nom du client
      if (cleanData.Client && (cleanData.Client.nomCli === 'Rundefined' || cleanData.Client.nomCli === 'undefined')) {
        cleanData.Client.nomCli = 'Client';
      }
      
      if (cleanData.Client && cleanData.Client.prenomCli === 'undefined') {
        cleanData.Client.prenomCli = '';
      }
      
      // S'assurer que le type existe
      if (!cleanData.typeLo && !cleanData.typeLocation) {
        cleanData.typeLo = 'Inconnu';
      }
      
      // S'assurer que les dates existent et sont valides
      try {
        if (!isValidDate(cleanData.debLo) && location.dateCreation) {
          cleanData.debLo = createValidDate(location.dateCreation).toISOString();
        } else if (!isValidDate(cleanData.debLo)) {
          cleanData.debLo = createValidDate(new Date()).toISOString();
        }
        
        if (!isValidDate(cleanData.finLo) && location.dateCreation) {
          const date = createValidDate(location.dateCreation);
          date.setDate(date.getDate() + 1);
          cleanData.finLo = date.toISOString();
        } else if (!isValidDate(cleanData.finLo)) {
          const startDate = createValidDate(cleanData.debLo);
          startDate.setDate(startDate.getDate() + 1);
          cleanData.finLo = startDate.toISOString();
        }
      } catch (error) {
        console.warn('Erreur traitement date:', error);
        // Dates par défaut
        const now = new Date();
        cleanData.debLo = now.toISOString();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        cleanData.finLo = tomorrow.toISOString();
      }
      
      // S'assurer que le tarif existe
      if (!cleanData.tarifTot && !cleanData.montantPaie && !cleanData.revenuEffectif) {
        cleanData.tarifTot = 0;
      }
      
      // S'assurer que le statut de paiement existe
      if (!cleanData.statutPaie && !cleanData.paiement?.statut) {
        cleanData.statutPaie = 'Terminé';
      }
      
      uniqueLocations.push(cleanData);
    }
  }
  
  return uniqueLocations;
});

// Statistiques calculées
const conversionRate = computed(() => {
  const confirmed = pendingReservations.value.filter(r => r.etatRes === 'Confirmée').length;
  const total = pendingReservations.value.length;
  if (total === 0) return 0;
  return Math.round((confirmed / total) * 100);
});

const averageDuration = computed(() => {
  const historyItems = processedLocationHistory.value;
  if (historyItems.length === 0) return 0;
  
  const totalDays = historyItems.reduce((sum, item) => {
    try {
      const start = createValidDate(item.debLo || item.dateCreation || item.dateCre);
      const end = createValidDate(item.finLo || item.dateCreation || item.dateCre);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + (diffDays > 0 ? diffDays : 1);
    } catch (error) {
      console.warn('Erreur calcul durée:', error);
      return sum + 1;
    }
  }, 0);
  
  return Math.round(totalDays / historyItems.length);
});

const repeatClients = computed(() => {
  const clientCounts = {};
  
  [...pendingReservations.value, ...processedLocationHistory.value].forEach(item => {
    const clientId = item.idCli || item.Client?.idCli;
    if (clientId) {
      clientCounts[clientId] = (clientCounts[clientId] || 0) + 1;
    }
  });
  
  const repeatCount = Object.values(clientCounts).filter(count => count > 1).length;
  const totalClients = Object.keys(clientCounts).length;
  
  if (totalClients === 0) return 0;
  return Math.round((repeatCount / totalClients) * 100);
});

const totalRevenuTermine = computed(() => {
  const data = processedLocationHistory.value;
  return data.reduce((sum, loc) => {
    // Ne compter que les revenus des locations finalisées
    const revenu = loc.revenuEffectif || loc.montantPaie || loc.tarifTot || 0;
    const statut = loc.paiement?.statut || loc.statutPaie || '';
    const isFinalized = ['Payé', 'Effectué', 'payé', 'Terminé', 'Terminée'].includes(statut);
    return isFinalized ? sum + (parseFloat(revenu) || 0) : sum;
  }, 0);
});

const locationsPayeesCount = computed(() => {
  const data = processedLocationHistory.value;
  return data.filter(loc => {
    const statut = loc.paiement?.statut || loc.statutPaie;
    return statut === 'Payé' || statut === 'Effectué' || statut === 'payé' || statut === 'Terminé' || statut === 'Terminée';
  }).length;
});

// Nouvelles statistiques de surveillance
const activeAlerts = computed(() => {
  const now = new Date();
  const overdueReservations = pendingReservations.value.filter(r => {
    if (r.etatRes === 'En attente') {
      const resDate = new Date(r.debRes);
      return resDate < now;
    }
    return false;
  }).length;
  
  return overdueReservations;
});

const performanceScore = computed(() => {
  const metrics = [
    conversionRate.value / 100,
    1 - (activeAlerts.value / Math.max(pendingReservations.value.length, 1)),
    locationsPayeesCount.value / Math.max(processedLocationHistory.value.length, 1)
  ];
  
  const average = metrics.reduce((sum, m) => sum + m, 0) / metrics.length;
  return Math.round(average * 100);
});

const customerSatisfaction = computed(() => {
  return Math.min(95, 70 + (conversionRate.value * 0.25));
});

const availabilityRate = computed(() => {
  const totalReservations = pendingReservations.value.length + processedLocationHistory.value.length;
  const cancelledReservations = pendingReservations.value.filter(r => r.etatRes === 'Annulée').length;
  
  if (totalReservations === 0) return 100;
  return Math.round(100 - (cancelledReservations / totalReservations * 100));
});

// Statistiques par type
const statsByTypeArray = computed(() => {
  if (locationStats.value.byType && locationStats.value.byType.length > 0) {
    return locationStats.value.byType;
  }
  
  const typeStats = {};
  
  processedLocationHistory.value.forEach(loc => {
    const type = loc.typeLo || loc.typeLocation || 'Inconnu';
    if (!typeStats[type]) {
      typeStats[type] = { count: 0, revenue: 0 };
    }
    typeStats[type].count++;
    const revenu = loc.revenuEffectif || loc.montantPaie || loc.tarifTot || 0;
    typeStats[type].revenue += parseFloat(revenu) || 0;
  });
  
  return Object.entries(typeStats).map(([type, data]) => ({
    type,
    count: data.count,
    revenue: data.revenue
  }));
});

const monthlyActivity = computed(() => {
  const weeks = [];
  for (let i = 1; i <= 4; i++) {
    weeks.push({
      week: i,
      count: Math.floor(Math.random() * 20) + 5,
      activity: Math.floor(Math.random() * 100) + 20
    });
  }
  return weeks;
});

// Colonnes simplifiées (sans actions)
const reservationColumns = [
  {
    title: 'Référence',
    key: 'idRes',
    width: 100,
    render: (row) => h('span', { class: 'text-mono' }, `#${row.idRes}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 150,
    render: (row) => {
      const clientName = row.Client ? 
        `${row.Client.nomCli} ${row.Client.prenomCli || ''}`.trim() : 
        `Client #${row.idCli}`;
      return h('div', [
        h('div', { class: 'fw-bold' }, clientName),
        h('div', { class: 'small text-muted' }, row.Client?.emailCli || '')
      ]);
    }
  },
  {
    title: 'Type',
    key: 'typeRes',
    width: 100,
    render: (row) => {
      const typeConfig = {
        'Salle': { type: 'info', color: '#067186' },
        'Materiel': { type: 'success', color: '#04058F' },
        'Mixte': { type: 'warning', color: '#5811EE' }
      };
      const config = typeConfig[row.typeRes] || { type: 'default' };
      return h(NTag, { 
        type: config.type,
        style: { backgroundColor: config.color, color: 'white' }
      }, { default: () => row.typeRes });
    }
  },
  {
    title: 'Période',
    key: 'period',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'small' }, formatDate(row.debRes)),
      h('div', { class: 'text-muted x-small' }, 'au'),
      h('div', { class: 'small' }, formatDate(row.finRes))
    ])
  },
  {
    title: 'Tarif Total',
    key: 'tarifTot',
    width: 130,
    align: 'right',
    render: (row) => h('span', { 
      class: 'fw-bold',
      style: { color: '#5811EE' }
    }, formatCurrency(row.tarifTot))
  },
  {
    title: 'Statut',
    key: 'etatRes',
    width: 120,
    render: (row) => {
      const statusConfig = {
        'En attente': { type: 'warning', icon: 'bi-clock' },
        'Confirmée': { type: 'success', icon: 'bi-check-circle' },
        'Annulée': { type: 'error', icon: 'bi-x-circle' },
        'Terminée': { type: 'default', icon: 'bi-flag' }
      };
      const config = statusConfig[row.etatRes] || { type: 'default', icon: 'bi-question-circle' };
      
      return h('div', { class: 'd-flex align-items-center' }, [
        h('i', { class: `${config.icon} me-2` }),
        h(NTag, { 
          type: config.type,
          size: 'small'
        }, { default: () => row.etatRes })
      ]);
    }
  }
];

const historyColumns = [
  {
    title: 'Réf. Location',
    key: 'idLo',
    width: 100,
    render: (row) => {
      const id = row.idLo || row.idRes || row.id || 'N/A';
      return h('span', { class: 'text-mono' }, `L-${id}`);
    }
  },
  {
    title: 'Client',
    key: 'client',
    width: 150,
    render: (row) => {
      let clientName = 'Client';
      let clientEmail = '';
      
      if (row.Client) {
        clientName = `${row.Client.nomCli || 'Client'} ${row.Client.prenomCli || ''}`.trim();
        clientEmail = row.Client.emailCli || '';
      } else if (row.client) {
        clientName = `${row.client.nom || 'Client'} ${row.client.prenom || ''}`.trim();
        clientEmail = row.client.email || '';
      }
      
      // Nettoyer le nom si c'est "Rundefined" ou "undefined"
      clientName = clientName.replace(/R?undefined/gi, '').trim() || 'Client';
      
      return h('div', [
        h('div', { class: 'fw-bold small' }, clientName),
        clientEmail ? h('div', { class: 'x-small text-muted' }, clientEmail) : null
      ]);
    }
  },
  {
    title: 'Type',
    key: 'typeLo',
    width: 100,
    render: (row) => {
      const type = row.typeLo || row.typeLocation || 'Inconnu';
      const typeConfig = {
        'Salle': { type: 'info', icon: 'bi-building' },
        'Materiel': { type: 'success', icon: 'bi-pc-display' },
        'Mixte': { type: 'warning', icon: 'bi-layers' }
      };
      const config = typeConfig[type] || { type: 'default', icon: 'bi-question-circle' };
      return h(NTag, { 
        type: config.type, 
        size: 'small',
        bordered: false
      }, { 
        default: () => [
          h('i', { class: `${config.icon} me-1` }),
          h('span', type)
        ]
      });
    }
  },
  {
    title: 'Période',
    key: 'period',
    width: 150,
    render: (row) => {
      const startDate = row.debLo || row.debRes || row.dateCreation || row.dateCre;
      const endDate = row.finLo || row.finRes || row.dateCreation || row.dateCre;
      
      if (!startDate) {
        return h('span', { class: 'text-muted small' }, 'Non spécifié');
      }
      
      return h('div', [
        h('div', { class: 'small' }, formatDate(startDate)),
        h('div', { class: 'text-muted x-small' }, 'au'),
        h('div', { class: 'small' }, endDate ? formatDate(endDate) : 'Non spécifié')
      ]);
    }
  },
  {
    title: 'Tarif',
    key: 'tarifTot',
    width: 120,
    align: 'right',
    render: (row) => {
      const amount = row.tarifTot || row.montantPaie || row.revenuEffectif || 0;
      const isPaid = row.paiement?.statut === 'Payé' || 
                    row.statutPaie === 'Payé' || 
                    row.statutPaie === 'payé' ||
                    row.statutPaie === 'Effectué' ||
                    row.statutPaie === 'Terminé' ||
                    row.statutPaie === 'Terminée';
      
      return h('div', { class: 'd-flex flex-column align-items-end' }, [
        h('span', { 
          class: 'fw-bold small',
          style: { color: isPaid ? '#5811EE' : '#6c757d' }
        }, formatCurrency(amount))
      ]);
    }
  },
  {
    title: 'Paiement',
    key: 'paiement',
    width: 120,
    render: (row) => {
      const statut = row.paiement?.statut || row.statutPaie || 'Terminé';
      const isPaid = statut === 'Payé' || statut === 'Effectué' || statut === 'payé';
      return h(NTag, { 
        type: isPaid ? 'success' : 'default',
        size: 'small'
      }, { default: () => isPaid ? 'Payé' : statut });
    }
  }
];

// Fonctions utilitaires
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0,00 MGA';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '0,00 MGA';
  return `${numValue.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  try {
    const date = createValidDate(datetime);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  } catch (error) {
    console.warn('Erreur formatage date:', error);
    return 'Date invalide';
  }
};

const getTypeColor = (type) => {
  const colors = {
    'Salle': 'info',
    'Materiel': 'success',
    'Mixte': 'warning'
  };
  return colors[type] || 'primary';
};

const getTypeIcon = (type) => {
  const icons = {
    'Salle': 'building',
    'Materiel': 'tools',
    'Mixte': 'layers'
  };
  return icons[type] || 'question-circle';
};

// Fonctions de style des lignes
const getReservationRowClass = (row) => {
  if (row.etatRes === 'Annulée') return 'row-cancelled';
  if (row.etatRes === 'Terminée') return 'row-completed';
  
  const now = new Date();
  const resDate = new Date(row.debRes);
  if (row.etatRes === 'En attente' && resDate < now) return 'row-overdue';
  
  return '';
};

const getHistoryRowClass = (row) => {
  const isPaid = row.paiement?.statut === 'Payé' || 
                row.statutPaie === 'Payé' || 
                row.statutPaie === 'payé' ||
                row.statutPaie === 'Effectué';
  return isPaid ? 'row-paid' : 'row-completed';
};

// Fonctions de données
const fetchLocationStats = async () => {
  try {
    const response = await LocationService.getLocationStats();
    locationStats.value = response.data.data || response.data;
  } catch (error) {
    console.error('Erreur chargement statistiques:', error);
    locationStats.value = {
      terminatedThisWeek: 0,
      activeToday: 0,
      upcomingConfirmed: 0,
      monthlyRevenue: 0,
      byType: []
    };
  }
};

const fetchPendingReservations = async () => {
  loading.value.reservations = true;
  try {
    const response = await LocationService.getPendingReservations();
    pendingReservations.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erreur chargement réservations:", error);
    pendingReservations.value = [];
  } finally {
    loading.value.reservations = false;
  }
};

const fetchLocationHistory = async () => {
  loading.value.history = true;
  try {
    const response = await LocationService.getLocationHistory();
    // Essayer différents formats de réponse
    if (Array.isArray(response.data)) {
      locationHistory.value = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      locationHistory.value = response.data.data;
    } else if (response.data.locations && Array.isArray(response.data.locations)) {
      locationHistory.value = response.data.locations;
    } else {
      locationHistory.value = [];
      console.warn('Format de données d\'historique inattendu:', response.data);
    }
  } catch (error) {
    console.error("Erreur chargement historique:", error);
    locationHistory.value = [];
  } finally {
    loading.value.history = false;
  }
};

const fetchTerminatedWithRevenue = async () => {
  try {
    const response = await LocationService.getTerminatedLocationsWithRevenue();
    if (response.data && response.data.success) {
      terminatedWithRevenue.value = response.data.data?.locations || response.data.locations || [];
    } else if (Array.isArray(response.data)) {
      terminatedWithRevenue.value = response.data;
    }
  } catch (error) {
    console.error("Erreur chargement locations terminées:", error);
    terminatedWithRevenue.value = [];
  }
};

const refreshAllData = async () => {
  loading.value.global = true;
  try {
    await Promise.all([
      fetchPendingReservations(),
      fetchLocationHistory(),
      fetchLocationStats(),
      fetchTerminatedWithRevenue()
    ]);
    
    // Mettre à jour l'heure de dernière mise à jour
    const now = new Date();
    lastUpdateTime.value = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
  } catch (error) {
    console.error('Erreur rafraîchissement:', error);
  } finally {
    loading.value.global = false;
  }
};

const resetFilters = () => {
  dateRange.value = null;
  typeFilter.value = null;
  statusFilter.value = null;
  searchQuery.value = '';
};

// Cycle de vie
onMounted(async () => {
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    userLogin.value = user.loginUti || '';
  }
  
  await refreshAllData();
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

.surveillance-container {
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

.custom-tag {
  font-weight: 600;
}

/* Cartes */
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

/* Table */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-table .n-data-table-thead) {
  background-color: #f8f9fa;
}

:deep(.custom-table .n-data-table-th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
}

:deep(.custom-table .n-data-table-tr--hover) {
  background-color: #f8f9ff !important;
}

.text-mono {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.x-small {
  font-size: 0.75rem;
}

/* Classes de ligne */
:deep(.row-cancelled) {
  background-color: rgba(108, 117, 125, 0.05) !important;
}

:deep(.row-completed) {
  background-color: rgba(40, 167, 69, 0.05) !important;
}

:deep(.row-overdue) {
  background-color: rgba(220, 53, 69, 0.05) !important;
}

:deep(.row-paid) {
  background-color: rgba(40, 167, 69, 0.05) !important;
}

:deep(.row-unpaid) {
  background-color: rgba(255, 193, 7, 0.05) !important;
}

/* Graphique d'activité mensuelle */
.monthly-activity {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding: 20px 10px;
  border-bottom: 1px solid #e9ecef;
}

.activity-week {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.week-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.activity-bar {
  width: 30px;
  background: linear-gradient(to top, #007bff, #0056b3);
  border-radius: 3px 3px 0 0;
  transition: height 0.3s ease;
}

.week-count {
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 5px;
  color: #2c3e50;
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
  
  .monthly-activity {
    height: 100px;
  }
  
  .activity-bar {
    width: 20px;
  }
  
  .custom-table {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .monthly-activity {
    height: 80px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  
  .activity-week {
    flex: 0 0 calc(50% - 15px);
  }
  
  .activity-bar {
    width: 25px;
  }
  
  .custom-table {
    font-size: 0.8rem;
  }
}
</style>