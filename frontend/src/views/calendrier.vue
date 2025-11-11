<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <router-link to="/dashboardReception" class="btn btn-sm custom-btn-outline">
            <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
          </router-link>
        </div>
      </div>
    </div>

    <hr class="my-4 custom-divider">

    <!-- Cartes de statistiques -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3">
              <i class="bi bi-calendar-check text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Événements Confirmés</h6>
              <h4 class="mb-0 text-primary">{{ confirmedEvents.length }}</h4>
            </div>
          </div>
        </n-card>
      </div>
      
      <div class="col-md-4 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #067186;">
              <i class="bi bi-clock-history text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">En Attente</h6>
              <h4 class="mb-0 text-info">{{ pendingCount }}</h4>
            </div>
          </div>
        </n-card>
      </div>
      
      <div class="col-md-4 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #55555E;">
              <i class="bi bi-check-circle text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Terminés</h6>
              <h4 class="mb-0 text-secondary">{{ completedCount }}</h4>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Tableau des locations et réservations -->
    <n-card class="custom-card shadow-lg" title="Vue d'ensemble des Locations et Réservations">
      <template #header-extra>
        <n-button type="primary" size="small" @click="fetchConfirmedEvents">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </n-button>
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

        <!-- Empty State -->
        <div v-else-if="confirmedEvents.length === 0" class="text-center p-5">
          <n-empty description="Aucun événement trouvé">
            <template #icon>
              <i class="bi bi-calendar-x" style="font-size: 3rem; color: #55555E;"></i>
            </template>
          </n-empty>
        </div>

        <!-- Data Table -->
        <div v-else>
          <n-data-table
            :columns="columns"
            :data="tableData"
            :pagination="pagination"
            :bordered="false"
            class="custom-table"
          />
        </div>
      </div>
    </n-card>

    <!-- Détails des données (collapsible) -->
    <n-collapse class="mt-4" :default-expanded-names="[]">
      <n-collapse-item title="Détails techniques des données" name="1">
        <n-alert type="info" class="mb-0">
          <template #icon>
            <i class="bi bi-info-circle"></i>
          </template>
          <div class="mb-2">Format des données chargées :</div>
          <pre class="bg-light p-3 rounded small">{{ JSON.stringify(formattedCalendarEvents[0], null, 2) }}</pre>
        </n-alert>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { 
  NCard, 
  NButton, 
  NSpin, 
  NEmpty, 
  NDataTable, 
  NPagination, 
  NCollapse, 
  NCollapseItem, 
  NAlert,
  NTag 
} from 'naive-ui';
import LocationService from '../services/LocationService';

// Variables réactives
const confirmedEvents = ref([]);
const loadingEvents = ref(true);

// Computed properties
const formattedCalendarEvents = computed(() => {
  return confirmedEvents.value.map(event => ({
    id: event.idLo,
    title: `${event.typeLo} - ${event.reservation?.client ? event.reservation.client.nomCli : 'N/A'}`,
    start: event.debLo,
    end: event.finLo,
    classNames: ['bg-primary']
  }));
});

const tableData = computed(() => {
  return confirmedEvents.value.map(event => ({
    id: event.idLo,
    client: event.reservation?.client ? 
      `${event.reservation.client.nomCli} ${event.reservation.client.prenomCli || ''}` : 'N/A',
    type: event.typeLo,
    dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
    dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
    tarif: `${parseFloat(event.tarifTot).toLocaleString('fr-FR')} Ar`,
    statut: event.etatLo,
    materiel: event.reservation?.codeMat || 'N/A',
    salle: event.reservation?.idSalle || 'N/A'
  }));
});

const pendingCount = computed(() => {
  return confirmedEvents.value.filter(event => event.etatLo === 'En attente').length;
});

const completedCount = computed(() => {
  return confirmedEvents.value.filter(event => event.etatLo === 'Terminée').length;
});

// Configuration du tableau
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
    sorter: (a, b) => a.client.localeCompare(b.client)
  },
  {
    title: 'Type',
    key: 'type',
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small'
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
    align: 'right',
    render: (row) => h('strong', { class: 'text-primary' }, row.tarif)
  },
  {
    title: 'Statut',
    key: 'statut',
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En attente': 'warning',
        'Annulée': 'error',
        'Terminée': 'default'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small'
      }, { default: () => row.statut })
    }
  }
];

const pagination = {
  pageSize: 10
};

// Méthodes
const fetchConfirmedEvents = async () => {
  loadingEvents.value = true;
  try {
    const response = await LocationService.getConfirmedEvents();
    confirmedEvents.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des événements confirmés:", error);
  } finally {
    loadingEvents.value = false;
  }
};

// Cycle de vie
onMounted(() => {
  fetchConfirmedEvents();
});
</script>

<style scoped>
/* Variables CSS avec votre palette CEDII */
:root {
  --cedii-primary: #5811EE;
  --cedii-primary-dark: #04058F;
  --cedii-dark: #02061E;
  --cedii-info: #067186;
  --cedii-secondary: #55555E;
}

/* Styles personnalisés */
.custom-btn-outline {
  border-color: var(--cedii-primary);
  color: var(--cedii-primary);
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: var(--cedii-primary);
  color: white;
}

.custom-nav-link {
  color: var(--cedii-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.custom-nav-link:hover,
.custom-nav-link.router-link-active {
  color: var(--cedii-primary);
}

.custom-divider {
  border-color: var(--cedii-info);
  opacity: 0.3;
}

.custom-card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}

.custom-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--cedii-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.custom-table {
  --n-border-color: #f0f0f0;
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: var(--cedii-dark);
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

.text-primary {
  color: var(--cedii-primary) !important;
}

.text-info {
  color: var(--cedii-info) !important;
}

.bg-primary {
  background-color: var(--cedii-primary) !important;
}
</style>