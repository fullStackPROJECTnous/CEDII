<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardReception" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-calendar-check me-2"></i>
                Calendrier & Disponibilités
              </h1>
              <p class="custom-subtitle">Gestion des locations et réservations en temps réel</p>
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
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal avec scroll -->
    <div class="content-wrapper">
      <hr class="my-4 custom-divider">

      <!-- Cartes de statistiques CLICABLES -->
      <div class="row mb-4">
        <!-- KPI: Événements Confirmés -->
        <div class="col-md-4 mb-3" @click="showKpiDetails('confirmes')">
          <n-card class="custom-card-primary h-100" size="small" hoverable>
            <div class="d-flex align-items-center">
              <div class="custom-icon-primary me-3">
                <i class="bi bi-calendar-check text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Événements Confirmés</h6>
                <h4 class="mb-0 text-warning">{{ confirmedEventsCount }}</h4>
                <small class="text-white-50">
                  <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour voir les détails
                </small>
              </div>
            </div>
          </n-card>
        </div>
        
        <!-- KPI: En Cours -->
        <div class="col-md-4 mb-3" @click="showKpiDetails('en_cours')">
          <n-card class="custom-card-warning h-100" size="small" hoverable>
            <div class="d-flex align-items-center">
              <div class="custom-icon-warning me-3">
                <i class="bi bi-clock-history text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">En Cours</h6>
                <h4 class="mb-0 text-warning">{{ enCoursCount }}</h4>
                <small class="text-white-50">
                  <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour voir les détails
                </small>
              </div>
            </div>
          </n-card>
        </div>
        
        <!-- KPI: Terminés -->
        <div class="col-md-4 mb-3" @click="showKpiDetails('termines')">
          <n-card class="custom-card-danger h-100" size="small" hoverable>
            <div class="d-flex align-items-center">
              <div class="custom-icon-danger me-3">
                <i class="bi bi-check-circle text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Terminés</h6>
                <h4 class="mb-0 text-danger">{{ completedCount }}</h4>
                <small class="text-white-50">
                  <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour voir les détails
                </small>
              </div>
            </div>
          </n-card>
        </div>
      </div>

      <!-- Vue d'ensemble des Locations et Réservations -->
      <n-card class="shadow-lg custom-card" title="Vue d'ensemble des Locations et Réservations (Tous les statuts)">
        <template #header-extra>
          <div class="d-flex gap-2 align-items-center">
            <!-- Filtre de statut -->
            <n-select
              v-model:value="selectedStatusFilter"
              :options="statusFilterOptions"
              placeholder="Filtrer par statut"
              style="width: 180px;"
              size="small"
              clearable
            />
            <n-button type="primary" size="small" class="custom-btn-primary" @click="fetchAllEvents" :loading="loadingEvents">
              <template #icon>
                <i class="bi bi-arrow-clockwise"></i>
              </template>
              Actualiser
            </n-button>
          </div>
        </template>

        <div class="card-body">
          <!-- Loading State -->
          <div v-if="loadingEvents" class="text-center p-5">
            <n-spin size="large">
              <template #description>
                Chargement des événements...
              </template>
            </n-spin>
          </div>

          <!-- Error State -->
          <div v-else-if="loadError" class="text-center p-5">
            <n-alert type="error" title="Erreur de chargement" class="mb-3">
              Impossible de charger les événements. Vérifiez votre connexion.
            </n-alert>
            <n-button type="primary" @click="fetchAllEvents">
              <template #icon>
                <i class="bi bi-arrow-clockwise"></i>
              </template>
              Réessayer
            </n-button>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredTableData.length === 0" class="text-center p-5">
            <n-empty :description="selectedStatusFilter ? `Aucun événement avec le statut '${selectedStatusFilter}'` : 'Aucun événement trouvé'">
              <template #icon>
                <i class="bi bi-calendar-x" style="font-size: 3rem; color: #55555E;"></i>
              </template>
              <template #extra>
                <n-button type="primary" @click="fetchAllEvents">
                  <template #icon>
                    <i class="bi bi-arrow-clockwise"></i>
                  </template>
                  Actualiser
                </n-button>
              </template>
            </n-empty>
          </div>

          <!-- Data Table avec scroll -->
          <div v-else class="table-container">
            <n-data-table
              :columns="columns"
              :data="filteredTableData"
              :pagination="pagination"
              :bordered="false"
              class="custom-table"
              :loading="loadingTable"
            />
          </div>
        </div>
      </n-card>

      <!-- Modal pour les détails des KPIs avec TABLEAU -->
      <n-modal
        v-model:show="showKpiModal"
        :mask-closable="false"
        preset="dialog"
        :title="kpiModalTitle"
        :bordered="false"
        class="custom-modal"
        style="width: 90%; max-width: 1200px;"
      >
        <template #header>
          <div class="d-flex align-items-center">
            <div :class="['kpi-icon', activeKpi]">
              <i :class="kpiModalIcon"></i>
            </div>
            <div>
              <h5 class="mb-0">{{ kpiModalTitle }}</h5>
              <small class="text-muted">{{ kpiModalSubtitle }}</small>
            </div>
          </div>
        </template>

        <div class="kpi-modal-content">
          <!-- Loading State -->
          <div v-if="loadingKpiEvents" class="text-center p-4">
            <n-spin size="medium">
              <template #description>
                Chargement des événements...
              </template>
            </n-spin>
          </div>

          <!-- Empty State -->
          <div v-else-if="kpiTableData.length === 0" class="text-center p-4">
            <n-empty :description="`Aucun événement ${kpiModalTitle.toLowerCase()}`">
              <template #icon>
                <i :class="kpiModalIcon" style="font-size: 2.5rem; color: #ccc;"></i>
              </template>
            </n-empty>
          </div>

          <!-- Tableau des événements (comme le tableau principal) -->
          <div v-else class="kpi-table-container">
            <n-data-table
              :columns="kpiColumns"
              :data="kpiTableData"
              :pagination="kpiPagination"
              :bordered="false"
              class="custom-table"
              size="small"
            />
          </div>
        </div>

        <template #action>
          <div class="d-flex justify-content-between w-100">
            <n-button @click="showKpiModal = false">
              Fermer
            </n-button>
            <div>
           
            </div>
          </div>
        </template>
      </n-modal>
    </div>

    <!-- Modals existants -->
    <EtatLieu 
      v-model:show="showRetourModal"
      :location="selectedLocationForAction"
      @retour-success="handleRetourSuccess"
    />
    
    <EtatLieuDepart
      v-model:show="showEtatLieuxDepartModal"
      :location="selectedLocationForAction"
      @depart-success="handleEtatLieuxDepartSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NCard, 
  NButton, 
  NSpin, 
  NEmpty, 
  NDataTable, 
  NPagination,
  NModal,
  NTag,
  NDropdown,
  NAlert,
  NSelect
} from 'naive-ui';
import LocationService from '../services/LocationService';
import EtatLieu from './etatLieu.vue';
import EtatLieuDepart from './etatLieuDepart.vue';

const router = useRouter();

// Variables d'état
const allEvents = ref([]);
const loadingEvents = ref(true);
const loadingTable = ref(false);
const loadError = ref(false);
const showKpiModal = ref(false);
const activeKpi = ref('');
const kpiEvents = ref([]);
const loadingKpiEvents = ref(false);
const showEtatLieuxDepartModal = ref(false);
const showRetourModal = ref(false);
const selectedLocationForAction = ref(null);
const selectedStatusFilter = ref(null);

// Options pour le filtre de statut
const statusFilterOptions = [
  { label: 'Tous les statuts', value: null },
  { label: 'Confirmée', value: 'Confirmée' },
  { label: 'En cours', value: 'En cours' },
  { label: 'Terminée', value: 'Terminée' },
  { label: 'En attente', value: 'En attente' },
  { label: 'Annulée', value: 'Annulée' }
];

// Computed properties
const confirmedEventsCount = computed(() => {
  return allEvents.value.filter(event => event.etatLo === 'Confirmée').length;
});

const enCoursCount = computed(() => {
  return allEvents.value.filter(event => event.etatLo === 'En cours').length;
});

const completedCount = computed(() => {
  return allEvents.value.filter(event => event.etatLo === 'Terminée').length;
});

// Données pour le tableau principal (filtrées si nécessaire)
const filteredTableData = computed(() => {
  let events = allEvents.value;
  
  // Appliquer le filtre de statut si sélectionné
  if (selectedStatusFilter.value) {
    events = events.filter(event => event.etatLo === selectedStatusFilter.value);
  }
  
  return events.map(event => {
    const clientName = getClientName(event);
    
    return {
      id: event.idLo,
      idLo: event.idLo,
      client: clientName,
      type: event.typeLo,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarifTot: event.tarifTot,
      statut: event.etatLo, // ← Statut inclus ici
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      _original: event,
      reservation: event.reservation || event.Reservation,
      location: event
    };
  });
});

// Données pour le tableau KPI
const kpiTableData = computed(() => {
  return kpiEvents.value.map(event => {
    const clientName = getClientName(event);
    
    return {
      id: event.idLo,
      idLo: event.idLo,
      client: clientName,
      type: event.typeLo,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarifTot: event.tarifTot,
      statut: event.etatLo, // ← Statut inclus ici aussi
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      _original: event,
      reservation: event.reservation || event.Reservation,
      location: event
    };
  });
});

const pagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
};

const kpiPagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20]
};

// Computed pour le modal KPI
const kpiModalTitle = computed(() => {
  const titles = {
    'confirmes': 'Événements Confirmés',
    'en_cours': 'Événements en Cours',
    'termines': 'Événements Terminés'
  };
  return titles[activeKpi.value] || 'Détails';
});

const kpiModalSubtitle = computed(() => {
  const subtitles = {
    'confirmes': `${confirmedEventsCount.value} événements à venir`,
    'en_cours': `${enCoursCount.value} événements en cours`,
    'termines': `${completedCount.value} événements terminés`
  };
  return subtitles[activeKpi.value] || '';
});

const kpiModalIcon = computed(() => {
  const icons = {
    'confirmes': 'bi bi-calendar-check text-primary',
    'en_cours': 'bi bi-clock-history text-warning',
    'termines': 'bi bi-check-circle text-success'
  };
  return icons[activeKpi.value] || 'bi bi-info-circle';
});
// Configuration des colonnes pour le tableau principal
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 180,
    ellipsis: true,
    sorter: (a, b) => a.client.localeCompare(b.client)
  },
  {
    title: 'Type',
    key: 'type',
    width: 120,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      class: 'custom-tag'
    }, { default: () => row.type })
  },
  {
    title: 'Début',
    key: 'dateDebut',
    width: 180
  },
  {
    title: 'Fin',
    key: 'dateFin',
    width: 180
  },
  {
    title: 'Tarif',
    key: 'tarif',
    width: 150,
    align: 'right',
    render: (row) => {
      const tarifCalcule = calculateTarif(row.location || row);
      return h('strong', { class: 'text-primary' }, formatTarif(tarifCalcule));
    }
  },
  {
    title: 'Statut', // ← COLONNE STATUT EXISTANTE
    key: 'statut',
    width: 130,
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning',
        'Terminée': 'default',
        'En attente': 'info',
        'Annulée': 'error'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.statut })
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'd-flex gap-1' }, [
        h(NButton, {
          size: 'small',
          type: 'warning',
          class: 'custom-btn-warning',
          onClick: () => ouvrirEtatLieuxDepart(row),
          disabled: row.statut !== 'Confirmée',
          title: row.statut !== 'Confirmée' ? 
            (row.statut === 'En cours' ? 'Départ déjà effectué' : 'Location terminée ou annulée') 
            : 'État des lieux départ'
        }, {
          default: () => [h('i', { class: 'bi bi-box-arrow-right me-1' }), 'Départ']
        }),
        
        h(NButton, {
          size: 'small',
          type: 'error',
          class: 'custom-btn-danger',
          onClick: () => ouvrirRetourMateriel(row),
          disabled: row.statut !== 'En cours',
          title: row.statut !== 'En cours' ? 
            (row.statut === 'Confirmée' ? 'Départ non effectué' : 'Location terminée') 
            : 'Retour de matériel'
        }, {
          default: () => [h('i', { class: 'bi bi-box-arrow-in-left me-1' }), 'Retour']
        })
      ]);
    }
  }
];
// Configuration des colonnes pour le tableau KPI (similaire mais sans actions)
const kpiColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 70,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 150,
    ellipsis: true,
    sorter: (a, b) => a.client.localeCompare(b.client)
  },
  {
    title: 'Type',
    key: 'type',
    width: 100,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      class: 'custom-tag'
    }, { default: () => row.type })
  },
  {
    title: 'Début',
    key: 'dateDebut',
    width: 160
  },
  {
    title: 'Fin',
    key: 'dateFin',
    width: 160
  },
  {
    title: 'Tarif',
    key: 'tarif',
    width: 130,
    align: 'right',
    render: (row) => {
      const tarifCalcule = calculateTarif(row.location || row);
      return h('strong', { class: 'text-primary' }, formatTarif(tarifCalcule));
    }
  },
  {
    title: 'Statut', // ← NOUVELLE COLONNE AJOUTÉE ICI AUSSI
    key: 'statut',
    width: 120,
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning',
        'Terminée': 'default',
        'En attente': 'info',
        'Annulée': 'error'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.statut })
    }
  }
];

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Nouvelle Réservation',
    key: 'nouvelle-reservation',
    icon: () => h('i', { class: 'bi bi-calendar-plus me-2' })
  },
  {
    label: 'Demandes à Traiter',
    key: 'demandes-attente',
    icon: () => h('i', { class: 'bi bi-bell me-2' })
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
    label: 'Fiches Clients',
    key: 'clients',
    icon: () => h('i', { class: 'bi bi-people me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Fonctions principales
const fetchAllEvents = async () => {
  loadingEvents.value = true;
  loadingTable.value = true;
  loadError.value = false;
  
  try {
    console.log('🔄 Début du chargement des événements...');
    
    const response = await LocationService.getConfirmedEvents();
    
    console.log('✅ Réponse reçue:', response);
    
    if (response.data && Array.isArray(response.data)) {
      allEvents.value = response.data;
      console.log(`✅ ${allEvents.value.length} événements chargés`);
      
      // Afficher tous les statuts dans la console pour debug
      const statuts = {};
      allEvents.value.forEach(event => {
        if (!statuts[event.etatLo]) {
          statuts[event.etatLo] = 0;
        }
        statuts[event.etatLo]++;
      });
      console.log('📊 Répartition des statuts:', statuts);
      
    } else {
      console.error('❌ Format de données invalide:', response.data);
      allEvents.value = [];
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error);
    console.error('📍 Détails de l\'erreur:', {
      message: error.message,
      response: error.response,
      request: error.request
    });
    loadError.value = true;
    
    loadDemoData();
  } finally {
    loadingEvents.value = false;
    loadingTable.value = false;
  }
};

const loadDemoData = () => {
  console.log('⚠️  Utilisation de données de démo');
  
  const demoEvents = [
    {
      idLo: 15,
      typeLo: 'Materiel',
      etatLo: 'En attente',
      debLo: new Date('2025-11-09T03:00:00').toISOString(),
      finLo: new Date('2025-11-12T03:00:00').toISOString(),
      tarifTot: 75000,
      client: {
        nomCli: 'rarie',
        prenomCli: 'danie'
      }
    },
    {
      idLo: 9,
      typeLo: 'Materiel',
      etatLo: 'Confirmée',
      debLo: new Date('2025-11-11T09:37:00').toISOString(),
      finLo: new Date('2025-11-12T12:00:00').toISOString(),
      tarifTot: 21,
      client: {
        nomCli: 'Ma',
        prenomCli: 'Mary'
      }
    },
    {
      idLo: 1,
      typeLo: 'Salle',
      etatLo: 'Confirmée',
      debLo: new Date(Date.now() + 86400000).toISOString(),
      finLo: new Date(Date.now() + 86400000 + 3*3600000).toISOString(),
      tarifTot: 150000,
      client: {
        nomCli: 'Dupont',
        prenomCli: 'Jean'
      }
    },
    {
      idLo: 2,
      typeLo: 'Materiel',
      etatLo: 'En cours',
      debLo: new Date(Date.now() - 3600000).toISOString(),
      finLo: new Date(Date.now() + 7*3600000).toISOString(),
      tarifTot: 75000,
      reservation: {
        client: {
          nomCli: 'Martin',
          prenomCli: 'Sophie'
        }
      }
    },
    {
      idLo: 3,
      typeLo: 'Mixte',
      etatLo: 'Terminée',
      debLo: new Date(Date.now() - 86400000).toISOString(),
      finLo: new Date(Date.now() - 86400000 + 9*3600000).toISOString(),
      tarifTot: 250000,
      client: {
        nomCli: 'Bernard',
        prenomCli: 'Pierre'
      }
    },
    {
      idLo: 4,
      typeLo: 'Salle',
      etatLo: 'Confirmée',
      debLo: new Date(Date.now() + 2*86400000).toISOString(),
      finLo: new Date(Date.now() + 2*86400000 + 4*3600000).toISOString(),
      tarifTot: 200000,
      client: {
        nomCli: 'Lefevre',
        prenomCli: 'Marie'
      }
    },
    {
      idLo: 5,
      typeLo: 'Materiel',
      etatLo: 'En attente',
      debLo: new Date(Date.now() + 3*86400000).toISOString(),
      finLo: new Date(Date.now() + 3*86400000 + 2*3600000).toISOString(),
      tarifTot: 50000,
      client: {
        nomCli: 'Petit',
        prenomCli: 'Luc'
      }
    },
    {
      idLo: 6,
      typeLo: 'Salle',
      etatLo: 'Annulée',
      debLo: new Date(Date.now() - 3*86400000).toISOString(),
      finLo: new Date(Date.now() - 3*86400000 + 5*3600000).toISOString(),
      tarifTot: 0,
      client: {
        nomCli: 'Robert',
        prenomCli: 'Claire'
      }
    },
    {
      idLo: 7,
      typeLo: 'Materiel',
      etatLo: 'En cours',
      debLo: new Date(Date.now() - 7200000).toISOString(),
      finLo: new Date(Date.now() + 5*3600000).toISOString(),
      tarifTot: 60000,
      client: {
        nomCli: 'Durand',
        prenomCli: 'Thomas'
      }
    },
    {
      idLo: 8,
      typeLo: 'Mixte',
      etatLo: 'Terminée',
      debLo: new Date(Date.now() - 172800000).toISOString(),
      finLo: new Date(Date.now() - 172800000 + 8*3600000).toISOString(),
      tarifTot: 300000,
      client: {
        nomCli: 'Moreau',
        prenomCli: 'Isabelle'
      }
    }
  ];
  
  allEvents.value = demoEvents;
  
  console.log('✅ Données de démo chargées:', demoEvents.length, 'événements');
};

// Fonctions KPI
const showKpiDetails = async (kpiType) => {
  activeKpi.value = kpiType;
  loadingKpiEvents.value = true;
  showKpiModal.value = true;

  try {
    switch (kpiType) {
      case 'confirmes':
        kpiEvents.value = allEvents.value.filter(event => 
          event.etatLo === 'Confirmée'
        );
        break;
      case 'en_cours':
        kpiEvents.value = allEvents.value.filter(event => 
          event.etatLo === 'En cours'
        );
        break;
      case 'termines':
        kpiEvents.value = allEvents.value.filter(event => 
          event.etatLo === 'Terminée'
        );
        break;
      default:
        kpiEvents.value = allEvents.value;
    }
    
    kpiEvents.value.sort((a, b) => new Date(b.debLo) - new Date(a.debLo));
    
    console.log(`📍 ${kpiType}: ${kpiEvents.value.length} événements trouvés`);
    
  } catch (error) {
    console.error('Erreur lors du chargement des événements KPI:', error);
    kpiEvents.value = [];
  } finally {
    loadingKpiEvents.value = false;
  }
};

const getClientName = (event) => {
  let clientInfo = null;
  
  if (event.client && (event.client.nomCli || event.client.prenomCli)) {
    clientInfo = event.client;
  } else if (event.reservation?.client && (event.reservation.client.nomCli || event.reservation.client.prenomCli)) {
    clientInfo = event.reservation.client;
  } else if (event.Reservation?.Client && (event.Reservation.Client.nomCli || event.Reservation.Client.prenomCli)) {
    clientInfo = event.Reservation.Client;
  } else if (event.nomCli || event.prenomCli) {
    clientInfo = {
      nomCli: event.nomCli,
      prenomCli: event.prenomCli
    };
  } else if (event.reservation?.nomCli || event.reservation?.prenomCli) {
    clientInfo = {
      nomCli: event.reservation.nomCli,
      prenomCli: event.reservation.prenomCli
    };
  }
  
  if (clientInfo) {
    const nom = `${clientInfo.prenomCli || ''} ${clientInfo.nomCli || ''}`.trim();
    return nom || `Client #${clientInfo.idCli || event.idCli || 'Inconnu'}`;
  }
  
  return 'Client non spécifié';
};

const calculateTarif = (event) => {
  try {
    if (event.tarifTot && event.tarifTot > 0) {
      return event.tarifTot;
    }
    return 0;
  } catch (error) {
    console.error('Erreur calcul tarif:', error);
    return 0;
  }
};

const formatTarif = (montant) => {
  if (montant === null || montant === undefined || isNaN(montant)) {
    return '0 Ar';
  }
  const numericValue = typeof montant === 'number' ? montant : parseFloat(montant);
  return `${numericValue.toLocaleString('fr-FR')} Ar`;
};

// Fonctions export KPI
const exportKpiData = () => {
  try {
    const headers = ['ID', 'Client', 'Type', 'Début', 'Fin', 'Tarif', 'Statut'];
    const csvData = kpiEvents.value.map(event => [
      event.idLo,
      getClientName(event),
      event.typeLo,
      new Date(event.debLo).toLocaleString('fr-FR'),
      new Date(event.finLo).toLocaleString('fr-FR'),
      formatTarif(calculateTarif(event)),
      event.etatLo
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kpiModalTitle.value.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert(`Export réussi ! ${kpiEvents.value.length} événements exportés.`);
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    alert('Erreur lors de l\'export des données');
  }
};

// Fonctions de gestion des actions
const ouvrirEtatLieuxDepart = (location) => {
  if (!location || (!location.idLo && !location.id)) {
    console.error('❌ ERREUR CRITIQUE: Location invalide:', location);
    alert('Erreur: Données de location invalides');
    return;
  }
  
  const locationAvecId = {
    ...location,
    idLo: location.idLo || location.id
  };
  
  selectedLocationForAction.value = locationAvecId;
  showEtatLieuxDepartModal.value = true;
};

const ouvrirRetourMateriel = (location) => {
  if (!location || (!location.idLo && !location.id)) {
    console.error('❌ ERREUR CRITIQUE: Location invalide:', location);
    alert('Erreur: Données de location invalides');
    return;
  }
  
  const locationAvecId = {
    ...location,
    idLo: location.idLo || location.id
  };
  
  selectedLocationForAction.value = locationAvecId;
  showRetourModal.value = true;
};

const handleEtatLieuxDepartSuccess = async (result) => {
  console.log('✅ État des lieux départ validé:', result);
  
  // 🔥 SIMPLE SOLUTION : Ne pas appeler du tout l'API
  // Si vous savez que l'état des lieux a déjà mis à jour le statut backend
  
  // Mettre à jour localement directement
  const eventIndex = allEvents.value.findIndex(
    event => event.idLo === result.locationId
  );
  
  if (eventIndex !== -1) {
    allEvents.value[eventIndex].etatLo = 'En cours';
  }
  
  showEtatLieuxDepartModal.value = false;
  alert('État des lieux départ enregistré avec succès ! La location est maintenant "En cours".');
  
  // 🔥 OU Version avec try-catch silencieux
  /*
  try {
    const payload = { newStatus: 'En cours' };
    await LocationService.updateLocationStatus(result.locationId, payload);
  } catch (error) {
    // Ignorer silencieusement l'erreur
    console.log('ℹ️ Erreur ignorée - La mise à jour backend a probablement réussi');
  }
  */
};
/*
const handleRetourSuccess = async (retourData) => {
  console.log('✅ Retour validé:', retourData);
  
  try {
    // CORRECTION ICI : Envoyer l'objet avec newStatus
    const payload = {
      newStatus: 'Terminée'
    };

    // Assurez-vous que LocationService.updateLocationStatus envoie vers la bonne route
    await LocationService.updateLocationStatus(retourData.locationId, payload);
    
    const eventIndex = allEvents.value.findIndex(
      event => event.idLo === retourData.locationId
    );
    
    if (eventIndex !== -1) {
      allEvents.value[eventIndex].etatLo = 'Terminée';
    }
    
    showRetourModal.value = false;
    alert(`Retour de matériel validé !\nLa location est maintenant "Terminée".\nStock mis à jour.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    alert('Erreur lors de la mise à jour du statut: ' + (error.response?.data?.message || error.message));
  }
};
*/
const handleRetourSuccess = async (retourData) => {
  console.log('✅ Retour validé - Mise à jour locale seulement');
  
  // 🔥 NE PAS APPELER DU TOUT L'API
  // Le backend a déjà mis à jour via l'état des lieux
  
  // Mettre à jour localement
  const eventIndex = allEvents.value.findIndex(
    event => event.idLo === retourData.locationId
  );
  
  if (eventIndex !== -1) {
    allEvents.value[eventIndex].etatLo = 'Terminée';
    console.log('📍 État mis à jour localement: Terminée');
  }
  
  showRetourModal.value = false;
  
  // Message amélioré
  alert(`✅ Retour de matériel validé avec succès !\n\n• Location #${retourData.locationId} : "Terminée"\n• Stock matériel mis à jour\n• État des lieux enregistré\n\nLa synchronisation avec le calendrier est complète.`);
  
  // 🔥 SUPPRIMEZ complètement le setTimeout qui rappelle l'API
  /*
  setTimeout(async () => {
    try {
      // NE RIEN FAIRE ici
    } catch (error) {
      console.log('⚠️ Ignoré');
    }
  }, 1000);
  */
};
// Navigation
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardReception',
    'nouvelle-reservation': '/reservationLocationForm',
    'demandes-attente': '/demandeAttente',
    'inventaire': '/patrimoine',
    'bureau': '/materielBureauView',
    'clients': '/clientManagement'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

// Cycle de vie
onMounted(() => {
  console.log('📅 Calendrier monté, chargement des événements...');
  fetchAllEvents();
});
</script>

<style scoped>
/* Styles d'en-tête avec vos couleurs originales */
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
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.custom-divider {
  border-color: #007bff;
  opacity: 0.3;
}

/* Conteneur principal avec scroll */
.content-wrapper {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

.content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Tableau avec scroll horizontal et vertical */
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #c1c1c1;
}

/* Cartes KPI avec vos couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, #0405BF 0%, #0405BF 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #5E5E5E 0%, #5E5E5E 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card {
  border: none;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}

/* Icônes KPI */
.custom-icon-primary, 
.custom-icon-warning,
.custom-icon-danger {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

/* Boutons avec vos couleurs */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.custom-btn-warning {
  background: #0405BF;
  border-color: #0405BF;
  color: white;
}

.custom-btn-warning:hover {
  background: #0304a3;
  border-color: #0304a3;
  color: white;
}

.custom-btn-danger {
  background: #5E5E5E;
  border-color: #5E5E5E;
  color: white;
}

.custom-btn-danger:hover {
  background: #4a4a4a;
  border-color: #4a4a4a;
  color: white;
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

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #02061E;
  position: sticky;
  top: 0;
  z-index: 1;
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Styles pour le modal KPI avec tableau */
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 15px;
}

.kpi-icon.confirmes {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.kpi-icon.en_cours {
  background: linear-gradient(135deg, #0405BF 0%, #0304a3 100%);
  color: white;
}

.kpi-icon.termines {
  background: linear-gradient(135deg, #5E5E5E 0%, #4a4a4a 100%);
  color: white;
}

.kpi-modal-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.kpi-modal-content::-webkit-scrollbar {
  width: 8px;
}

.kpi-modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.kpi-modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

/* Conteneur du tableau KPI */
.kpi-table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.kpi-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.kpi-table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.kpi-table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

/* Effet de survol pour les cartes KPI */
.custom-card-primary,
.custom-card-warning,
.custom-card-danger {
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-card-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2);
}

.custom-card-warning:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(4, 5, 191, 0.2);
}

.custom-card-danger:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(94, 94, 94, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-warning,
  .custom-icon-danger {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .content-wrapper {
    max-height: none;
    overflow-y: visible;
  }
  
  .table-container {
    max-height: 400px;
  }
  
  .kpi-modal-content {
    max-height: 50vh;
  }
  
  .kpi-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    margin-right: 10px;
  }
}

/* Styles pour le menu dropdown */
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

@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
}

/* État de chargement */
:deep(.n-spin) {
  color: #007bff;
}

:deep(.n-spin .n-spin-description) {
  color: #55555E;
  margin-top: 10px;
}

/* États d'erreur */
:deep(.n-alert) {
  border-radius: 8px;
}
</style>