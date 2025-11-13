<template>
  <div class="demandes-container">
    <!-- Header avec navigation -->
    <div class="header-section mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <n-button 
          type="primary" 
          ghost 
          @click="$router.push('/dashboardReception')"
          class="back-button"
          size="small"
        >
          <template #icon>
            <n-icon>
              <i class="bi bi-arrow-left"></i>
            </n-icon>
          </template>
          Retour à l'Accueil
        </n-button>

        <div class="header-title text-center flex-grow-1">
          <h1 class="page-title cedii-text-primary mb-2">
            <i class="bi bi-bell-fill me-3"></i> 
            Demandes de Réservation à Traiter
          </h1>
          <p class="page-subtitle text-muted mb-0">
            Gestion et validation des demandes en attente
          </p>
        </div>
      </div>
    </div>

    <!-- Carte principale -->
    <n-card class="main-card" content-class="p-0">
      <!-- En-tête de la carte -->
      <template #header>
        <div class="card-header-content">
          <!-- Message de succès/erreur pour les actions -->
          <n-alert
            v-if="actionMessage"
            :type="actionMessageType"
            :title="actionMessageType === 'success' ? 'Succès' : 'Erreur'"
            class="m-4"
            closable
            @close="actionMessage = ''"
          >
            {{ actionMessage }}
          </n-alert>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="card-title mb-1">
                <i class="bi bi-list-check me-2"></i>
                Liste des Demandes en Attente
              </h3>
              <p class="card-subtitle text-muted mb-0">
                {{ pendingRequests.length }} demande(s) nécessite(nt) votre attention
              </p>
            </div>
            <n-tag :bordered="false" type="warning" size="large">
              <template #icon>
                <n-icon>
                  <i class="bi bi-clock-history"></i>
                </n-icon>
              </template>
              En attente
            </n-tag>
          </div>
        </div>
      </template>

      <!-- Contenu de la carte -->
      <div class="card-body-content">
        <!-- État de chargement -->
        <div v-if="loading" class="loading-state">
          <n-space vertical align="center" class="py-5">
            <n-spin size="large" />
            <n-text type="primary" class="mt-3">
              Chargement des demandes en cours...
            </n-text>
          </n-space>
        </div>

        <!-- État vide -->
        <div v-else-if="pendingRequests.length === 0" class="empty-state">
          <n-empty size="large" description="Aucune demande en attente">
            <template #icon>
              <n-icon size="80" color="#28a745">
                <i class="bi bi-check-circle-fill"></i>
              </n-icon>
            </template>
            <template #extra>
              <n-text depth="3">
                Toutes les demandes ont été traitées. 🎉
              </n-text>
            </template>
          </n-empty>
        </div>

        <!-- Tableau des demandes avec scroll -->
        <div v-else class="table-scroll-container">
          <div class="table-container">
            <n-data-table
              :columns="columns"
              :data="pendingRequests"
              :bordered="false"
              class="demandes-table"
              size="small"
              :single-line="false"
              :max-height="500"
              virtual-scroll
            />
          </div>
        </div>

        <!-- Message d'erreur -->
        <n-alert
          v-if="errorMessage"
          type="error"
          title="Erreur de chargement"
          class="m-4"
          closable
          @close="errorMessage = null"
        >
          {{ errorMessage }}
        </n-alert>
      </div>
    </n-card>

    <!-- Modal de confirmation pour le refus -->
    <n-modal v-model:show="showRefuseModal" preset="dialog" title="Confirmation de refus">
      <template #header>
        <div class="d-flex align-items-center">
          <n-icon size="24" color="#f5222d" class="me-2">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </n-icon>
          <span>Confirmer le refus</span>
        </div>
      </template>
      
      <div class="modal-content">
        <p>Êtes-vous sûr de vouloir <strong>refuser</strong> la demande <strong>#{{ selectedRequest?.idRes }}</strong> ?</p>
        <p class="text-muted small">Cette action est irréversible.</p>
      </div>

      <template #action>
        <div class="d-flex gap-2 w-100">
          <n-button class="flex-grow-1" @click="showRefuseModal = false">
            Annuler
          </n-button>
          <n-button 
            type="error" 
            class="flex-grow-1" 
            @click="confirmRefuse"
            :loading="refuseLoading"
          >
            <template #icon>
              <n-icon>
                <i class="bi bi-x-lg"></i>
              </n-icon>
            </template>
            Confirmer le refus
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NButton,
  NIcon,
  NCard,
  NTag,
  NDataTable,
  NSpin,
  NSpace,
  NText,
  NEmpty,
  NAlert,
  NModal
} from 'naive-ui';
import LocationService from '../services/LocationService';

const router = useRouter();

// ------------------------------------
// ÉTATS RÉACTIFS
// ------------------------------------
const pendingRequests = ref([]);
const loading = ref(true);
const errorMessage = ref(null);
const actionMessage = ref('');
const actionMessageType = ref('success');
const showRefuseModal = ref(false);
const selectedRequest = ref(null);
const refuseLoading = ref(false);

// ------------------------------------
// PROPRIÉTÉS CALCULÉES
// ------------------------------------
const salleCount = computed(() => {
  return pendingRequests.value.filter(req => req.typeRes === 'Salle').length;
});

const materielCount = computed(() => {
  return pendingRequests.value.filter(req => req.typeRes === 'Materiel').length;
});

// ------------------------------------
// COLONNES DU TABLEAU
// ------------------------------------
const columns = [
  {
    title: 'ID',
    key: 'idRes',
    width: 80,
    align: 'center',
    render: (row) => {
      return h(NTag, { type: 'info', size: 'small', bordered: false }, {
        default: () => `#${row.idRes}`
      });
    }
  },
  {
    title: 'Demandeur',
    key: 'client',
    width: 200,
    render: (row) => {
      return h('div', { class: 'client-info' }, [
        h('div', { class: 'client-name fw-bold' }, 
          `${row.client.nomCli} ${row.client.prenomCli}`
        ),
        h('div', { class: 'client-id small text-muted' }, 
          `ID: ${row.client.idCli}`
        )
      ]);
    }
  },
  {
    title: 'Type',
    key: 'typeRes',
    width: 120,
    align: 'center',
    render: (row) => {
      const typeConfig = {
        'Salle': { type: 'primary', icon: 'bi-house-door' },
        'Materiel': { type: 'warning', icon: 'bi-tools' },
        'Mixte': { type: 'success', icon: 'bi-collection' }
      };
      
      const config = typeConfig[row.typeRes] || { type: 'default', icon: 'bi-question' };
      
      return h(NTag, { 
        type: config.type, 
        size: 'small',
        bordered: false 
      }, {
        default: () => h('div', { class: 'd-flex align-items-center justify-content-center' }, [
          h(NIcon, { class: 'me-1', size: '14' }, {
            default: () => h('i', { class: config.icon })
          }),
          h('span', getRessourceType(row))
        ])
      });
    }
  },
  {
    title: 'Date Début',
    key: 'debRes',
    width: 180,
    render: (row) => {
      return h('div', { class: 'date-info' }, [
        h('div', { class: 'fw-bold' }, formatDateTime(row.debRes)),
        h('div', { class: 'small text-muted' }, 'Début prévu')
      ]);
    }
  },
  {
    title: 'Soumission',
    key: 'dateCre',
    width: 180,
    render: (row) => {
      return h('div', { class: 'submission-info' }, [
        h('div', { class: 'fw-medium' }, formatDateOnly(row.dateCre)),
        h('div', { class: 'small text-muted' }, 'Date de soumission')
      ]);
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    align: 'center',
    fixed: 'right',
    render: (row) => {
      return h(NSpace, { justify: 'center', size: 'small' }, [
        h(NButton, {
          type: 'primary',
          size: 'small',
          onClick: () => handleManage(row)
        }, {
          default: () => h('div', { class: 'd-flex align-items-center' }, [
            h(NIcon, { class: 'me-1', size: '14' }, {
              default: () => h('i', { class: 'bi bi-eye' })
            }),
            'Gérer'
          ])
        }),
        h(NButton, {
          type: 'error',
          size: 'small',
          ghost: true,
          onClick: () => handleRefuse(row)
        }, {
          default: () => h('div', { class: 'd-flex align-items-center' }, [
            h(NIcon, { class: 'me-1', size: '14' }, {
              default: () => h('i', { class: 'bi bi-x-lg' })
            }),
            'Refuser'
          ])
        })
      ]);
    }
  }
];

// ------------------------------------
// MÉTHODES DE FORMATAGE DES DATES CORRIGÉES
// ------------------------------------
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseDate(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Formater en français : JJ/MM/AAAA HH:MM
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Si c'est une date sans heure (minuit), afficher seulement la date
    if (hours === '00' && minutes === '00') {
      return `${day}/${month}/${year}`;
    }
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Erreur formatage date:', error, dateString);
    return 'N/A';
  }
};

const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseDate(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Formater seulement la date : JJ/MM/AAAA
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erreur formatage date:', error, dateString);
    return 'N/A';
  }
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = parseDate(dateString);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  } catch (error) {
    return '';
  }
};

const parseDate = (dateString) => {
  if (!dateString) return new Date(NaN);
  
  // Si c'est déjà un objet Date
  if (dateString instanceof Date) return dateString;
  
  // Gérer les différents formats de date
  if (typeof dateString === 'string') {
    // Format MySQL datetime : '2025-11-05 00:00:00'
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
      return new Date(dateString.replace(' ', 'T'));
    }
    
    // Format date seule : '2025-11-05'
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString + 'T00:00:00');
    }
    
    // Format ISO
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
  }
  
  // Fallback
  return new Date(dateString);
};

const getRessourceType = (request) => {
  const typeMap = {
    'Salle': 'Salle',
    'Materiel': 'Matériel',
    'Mixte': 'Salle & Matériel'
  };
  return typeMap[request.typeRes] || 'Non spécifié';
};

const fetchPendingRequests = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await LocationService.getPendingReservations();
    pendingRequests.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    errorMessage.value = `Impossible de charger les demandes : ${error.response?.data?.message || error.message}`;
  } finally {
    loading.value = false;
  }
};

const handleManage = (request) => {
  router.push({ 
    name: 'ReservationValid', 
    params: { idRes: request.idRes } 
  });
};

const handleRefuse = (request) => {
  selectedRequest.value = request;
  showRefuseModal.value = true;
};

const confirmRefuse = async () => {
  if (!selectedRequest.value) return;
  
  refuseLoading.value = true;
  try {
    await LocationService.updateReservationStatus(selectedRequest.value.idRes, 'Refusée');
    
    actionMessage.value = `Demande #${selectedRequest.value.idRes} refusée avec succès`;
    actionMessageType.value = 'success';
    
    await fetchPendingRequests();
    showRefuseModal.value = false;
    selectedRequest.value = null;
    
  } catch (error) {
    console.error(`Erreur de refus de la demande #${selectedRequest.value.idRes}:`, error);
    actionMessage.value = `Échec du refus : ${error.response?.data?.message || error.message}`;
    actionMessageType.value = 'error';
  } finally {
    refuseLoading.value = false;
  }
};

onMounted(() => {
  fetchPendingRequests();
});
</script>


<style scoped>
.demandes-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Section */
.header-section {
  background: transparent;
  flex-shrink: 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
}

.back-button {
  min-width: 140px;
}

/* Main Card */
.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header-content {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-subtitle {
  font-size: 0.875rem;
}

.card-body-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

/* Loading State */
.loading-state {
  padding: 3rem 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Empty State */
.empty-state {
  padding: 4rem 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Table Scroll Container */
.table-scroll-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Table Container */
.table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Modal Content */
.modal-content {
  padding: 1rem 0;
}

/* Custom Table Styles */
:deep(.demandes-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.demandes-table .n-data-table-base) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.demandes-table .n-data-table-base-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.demandes-table .n-data-table-base-table-body) {
  flex: 1;
  overflow-y: auto !important;
}

:deep(.demandes-table .n-data-table-thead) {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep(.demandes-table .n-data-table-th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid var(--cedii-primary-light, #5B11EE);
  padding: 12px 16px;
  position: sticky;
  top: 0;
}

:deep(.demandes-table .n-data-table-td) {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

:deep(.demandes-table .n-data-table-tr:hover) {
  background-color: #f8f9ff !important;
  transition: background-color 0.2s ease;
}

/* Scrollbar personnalisée */
:deep(.demandes-table .n-data-table-base-table-body::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.demandes-table .n-data-table-base-table-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.demandes-table .n-data-table-base-table-body::-webkit-scrollbar-thumb) {
  background: var(--cedii-primary-light, #5B11EE);
  border-radius: 4px;
}

:deep(.demandes-table .n-data-table-base-table-body::-webkit-scrollbar-thumb:hover) {
  background: var(--cedii-primary-dark, #0671b6);
}

/* Supprimer la pagination et les outils */
:deep(.demandes-table .n-data-table-pagination) {
  display: none !important;
}

:deep(.demandes-table .n-data-table-base-table-header) {
  border-bottom: 2px solid var(--cedii-primary-light, #5B11EE);
}

/* Client Info */
.client-info {
  line-height: 1.4;
}

.client-name {
  color: #2c3e50;
  font-size: 0.95rem;
}

.client-id {
  font-size: 0.8rem;
}

/* Date Info */
.date-info {
  line-height: 1.4;
}

.submission-info {
  line-height: 1.3;
}

/* Palette CEDII */
.cedii-text-primary { 
  color: var(--cedii-primary-light, #5B11EE) !important; 
}

:deep(.n-button--primary-type) {
  background-color: var(--cedii-primary-light, #5B11EE) !important;
  border-color: var(--cedii-primary-light, #5B11EE) !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--cedii-primary-dark, #0671b6) !important;
  border-color: var(--cedii-primary-dark, #0671b6) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .demandes-container {
    padding: 12px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-section .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .back-button {
    align-self: flex-start;
  }
  
  .table-scroll-container {
    overflow-x: auto;
  }
}

@media (max-width: 576px) {
  .table-container {
    min-width: 600px;
  }
}
</style>