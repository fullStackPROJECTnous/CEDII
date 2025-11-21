<template>
  <div class="location-management-container">
    <!-- Header amélioré comme dans la gestion des clients -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-calendar-check me-2"></i>
                Gestion des Locations & Réservations
              </h1>
              <p class="custom-subtitle">Gérez les réservations en attente et consultez l'historique des locations</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation par onglets -->
    <n-card class="custom-card">
      <n-tabs
        v-model:value="activeTab"
        type="line"
        justify-content="space-evenly"
      >
        <n-tab-pane name="reservations" tab="Réservations Actives">
          <template #tab>
            <n-badge :value="pendingReservations.length" type="info" show-zero>
              📋 Réservations Actives
            </n-badge>
          </template>

          <!-- Actions et tableau des réservations -->
          <n-space vertical size="large">
            <n-space justify="space-between" align="center">
              <n-h4 class="mb-0">
                📝 Demandes de Réservation
              </n-h4>
            </n-space>

            <!-- Tableau des réservations -->
            <n-data-table
              :columns="reservationColumns"
              :data="pendingReservations"
              :loading="loading"
              :bordered="false"
              striped
              class="custom-table"
            />
          </n-space>
        </n-tab-pane>

        <n-tab-pane name="history" tab="Historique">
          <template #tab>
            <n-badge :value="locationHistory.length" type="default" show-zero>
              📊 Historique des Locations
            </n-badge>
          </template>

          <!-- Historique des locations -->
          <n-space vertical size="large">
            <n-h4 class="mb-0">
              🗃️ Locations Terminées (Archivées)
            </n-h4>

            <n-data-table
              :columns="historyColumns"
              :data="locationHistory"
              :loading="loading"
              :bordered="false"
              striped
              class="custom-table"
            />
          </n-space>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import {
  NH2,
  NText,
  NSpace,
  NButton,
  NCard,
  NTabs,
  NTabPane,
  NBadge,
  NDataTable,
  NTag
} from 'naive-ui';
import LocationService from '../services/LocationService';

const activeTab = ref('reservations');
const pendingReservations = ref([]);
const locationHistory = ref([]);
const loading = ref(false);

// --- Colonnes du tableau des réservations ---
const reservationColumns = [
  {
    title: 'Référence',
    key: 'idRes',
    render: (row) => h('span', { class: 'text-mono' }, `#${row.idRes}`)
  },
  {
    title: 'Client',
    key: 'client',
    render: (row) => {
      const clientName = row.Client ? 
        `${row.Client.nomCli} ${row.Client.prenomCli || ''}`.trim() : 
        `Client #${row.idCli}`;
      return h('span', clientName);
    }
  },
  {
    title: 'Type',
    key: 'typeRes',
    render: (row) => {
      const typeConfig = {
        'Salle': { type: 'info', color: '#067186' },
        'Materiel': { type: 'success', color: '#04058F' },
        'Mixte': { type: 'warning', color: '#5811EE' }
      };
      const config = typeConfig[row.typeRes] || { type: 'default' };
      return h(NTag, { type: config.type, style: { backgroundColor: config.color, color: 'white' } }, {
        default: () => row.typeRes
      });
    }
  },
  {
    title: 'Période',
    key: 'period',
    render: (row) => h('div', [
      h('div', { class: 'fw-bold' }, formatDate(row.debRes)),
      h('div', { class: 'text-muted small' }, 'au'),
      h('div', { class: 'fw-bold' }, formatDate(row.finRes))
    ])
  },
  {
    title: 'Tarif Total',
    key: 'tarifTot',
    align: 'right',
    render: (row) => h('span', { class: 'fw-bold text-primary' }, formatCurrency(row.tarifTot))
  },
  {
    title: 'Statut',
    key: 'etatRes',
    render: (row) => {
      const statusConfig = {
        'En attente': { type: 'warning', color: '#f0ad4e' },
        'Confirmée': { type: 'success', color: '#5cb85c' },
        'Annulée': { type: 'error', color: '#d9534f' },
        'Terminée': { type: 'default', color: '#6c757d' }
      };
      const config = statusConfig[row.etatRes] || { type: 'default' };
      return h(NTag, { type: config.type, style: { backgroundColor: config.color, color: 'white' } }, {
        default: () => row.etatRes
      });
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (row) => h(NSpace, { justify: 'center' }, {
      default: () => [
        // Bouton Confirmer
        row.etatRes === 'En attente' && h(NButton, {
          size: 'small',
          type: 'success',
          class: 'custom-btn-success',
          onClick: () => updateStatus(row.idRes, 'Confirmée')
        }, { default: () => 'Confirmer' }),

        // Bouton Terminer
        row.etatRes === 'Confirmée' && h(NButton, {
          size: 'small',
          type: 'primary',
          class: 'custom-btn-primary',
          onClick: () => updateStatus(row.idRes, 'Terminée')
        }, { default: () => 'Terminer' }),

        // Bouton Annuler
        h(NButton, {
          size: 'small',
          type: 'warning',
          class: 'custom-btn-warning',
          onClick: () => updateStatus(row.idRes, 'Annulée')
        }, { default: () => 'Annuler' }),

        // Bouton Supprimer
        h(NButton, {
          size: 'small',
          type: 'error',
          class: 'custom-btn-danger',
          onClick: () => deleteReservation(row.idRes)
        }, { default: () => 'Supprimer' })
      ].filter(Boolean)
    })
  }
];

// --- Colonnes du tableau historique ---
const historyColumns = [
  {
    title: 'Réf. Location',
    key: 'idLo',
    render: (row) => h('span', { class: 'text-mono' }, `L-${row.idLo}`)
  },
  {
    title: 'Réf. Réservation',
    key: 'idRes',
    render: (row) => h('span', { class: 'text-mono' }, `R-${row.idRes}`)
  },
  {
    title: 'Date Création',
    key: 'dateCre',
    render: (row) => h('span', formatDate(row.dateCre))
  },
  {
    title: 'Type',
    key: 'typeLo',
    render: (row) => {
      const typeConfig = {
        'Salle': { type: 'info' },
        'Materiel': { type: 'success' },
        'Mixte': { type: 'warning' }
      };
      const config = typeConfig[row.typeLo] || { type: 'default' };
      return h(NTag, { type: config.type, class: 'custom-tag' }, { default: () => row.typeLo });
    }
  },
  {
    title: 'Tarif',
    key: 'tarifTot',
    align: 'right',
    render: (row) => h('span', { class: 'fw-bold text-primary' }, formatCurrency(row.tarifTot))
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (row) => h(NButton, {
      size: 'small',
      type: 'primary',
      class: 'custom-btn-primary',
      onClick: () => viewDetails(row)
    }, { default: () => 'Voir' })
  }
];

// --- Chargement des données ---
const fetchPendingReservations = async () => {
  loading.value = true;
  try {
    const response = await LocationService.getPendingReservations();
    pendingReservations.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement des réservations:", error);
    alert('Erreur lors du chargement des réservations');
  } finally {
    loading.value = false;
  }
};

const fetchLocationHistory = async () => {
  loading.value = true;
  try {
    const response = await LocationService.getLocationHistory();
    locationHistory.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement de l'historique:", error);
    alert('Erreur lors du chargement de l\'historique');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPendingReservations();
  fetchLocationHistory();
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  if (!value) return '0,00 MGA';
  return `${parseFloat(value).toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(datetime).toLocaleDateString('fr-FR', options);
};

// --- Fonctions d'action ---
const updateStatus = async (idRes, status) => {
  if (confirm(`Voulez-vous changer le statut de la réservation #${idRes} à "${status}" ?`)) {
    try {
      await LocationService.updateReservationStatus(idRes, status);
      alert(`Statut de la réservation #${idRes} mis à jour avec succès`);
      fetchPendingReservations();
      if (status === 'Terminée') {
        fetchLocationHistory();
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut');
      console.error(error);
    }
  }
};

const deleteReservation = async (idRes) => {
  if (confirm(`ATTENTION : Voulez-vous supprimer définitivement la réservation #${idRes} ?`)) {
    try {
      await LocationService.deleteReservation(idRes);
      alert('Réservation supprimée avec succès');
      fetchPendingReservations();
    } catch (error) {
      alert('Erreur lors de la suppression');
      console.error(error);
    }
  }
};

const viewDetails = (location) => {
  alert(`Détails de la location L-${location.idLo}:\n\n` +
        `Réservation: R-${location.idRes}\n` +
        `Type: ${location.typeLo}\n` +
        `Date création: ${formatDate(location.dateCre)}\n` +
        `Tarif: ${formatCurrency(location.tarifTot)}`);
};
</script>

<style scoped>
.location-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header amélioré comme dans la gestion des clients */
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

/* Cards */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
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

.custom-btn-success {
  background: #28a745 !important;
  border-color: #28a745 !important;
}

.custom-btn-success:hover {
  background: #218838 !important;
  border-color: #218838 !important;
}

.custom-btn-warning {
  background: #ffc107 !important;
  border-color: #ffc107 !important;
  color: #212529 !important;
}

.custom-btn-warning:hover {
  background: #e0a800 !important;
  border-color: #e0a800 !important;
}

.custom-btn-danger {
  background: #5E5E5E !important;
  border-color: #5E5E5E !important;
  color: white !important;
}

.custom-btn-danger:hover {
  background: #4a4a4a !important;
  border-color: #4a4a4a !important;
}

.custom-tag {
  font-weight: 600;
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
  cursor: pointer;
}

.text-mono {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

/* Tabs améliorés */
:deep(.n-tabs .n-tabs-tab) {
  font-weight: 500;
}

:deep(.n-tabs .n-tabs-tab--active) {
  color: #007bff;
}

:deep(.n-tabs .n-tabs-bar) {
  background-color: #007bff;
}

:deep(.n-button) {
  border-radius: 6px;
}

:deep(.n-tag) {
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .location-management-container {
    padding: 12px;
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
}

@media (max-width: 576px) {
  .custom-table {
    font-size: 0.8rem;
  }
}
</style>