<template>
  <div class="demandes-container">
    <!-- Header amélioré avec navigation -->
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
                <i class="bi bi-bell-fill me-2"></i>
                Demandes de Réservation à Traiter
              </h1>
              <p class="custom-subtitle">Gestion et validation des demandes en attente</p>
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

    <!-- Carte principale -->
    <n-card class="main-card custom-card" content-class="p-0">
      <template #header>
        <div class="card-header-content">
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

            <n-tag :bordered="false" type="warning" size="large" class="custom-tag">
              <template #icon>
                <n-icon><i class="bi bi-clock-history"></i></n-icon>
              </template>
              En attente
            </n-tag>
          </div>
        </div>
      </template>

      <div class="card-body-content">
        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <n-space vertical align="center" class="py-5">
            <n-spin size="large" />
            <n-text type="primary" class="mt-3">Chargement des demandes en cours...</n-text>
          </n-space>
        </div>

        <!-- Vide -->
        <div v-else-if="pendingRequests.length === 0" class="empty-state">
          <n-empty size="large" description="Aucune demande en attente">
            <template #icon>
              <n-icon size="80" color="#28a745">
                <i class="bi bi-check-circle-fill"></i>
              </n-icon>
            </template>

            <template #extra>
              <n-text depth="3">Toutes les demandes ont été traitées. 🎉</n-text>
            </template>
          </n-empty>
        </div>

        <!-- Tableau des demandes - Version HTML simple -->
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-primary">
              <tr>
                <th width="80">ID</th>
                <th width="200">Demandeur</th>
                <th width="120">Type</th>
                <th width="180">Date Début</th>
                <th width="180">Soumission</th>
                <th width="180" class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingRequests" :key="request.idRes">
                <td>
                  <span class="badge bg-info">#{{ request.idRes }}</span>
                </td>
                <td>
                  <div class="fw-bold">
                    {{ request.client?.nomCli || 'N/A' }} {{ request.client?.prenomCli || '' }}
                  </div>
                  <div class="small text-muted">
                    ID: {{ request.client?.idCli || 'N/A' }}
                  </div>
                </td>
                <td class="text-center">
                  <span :class="{
                    'badge bg-primary': request.typeRes === 'Salle',
                    'badge bg-warning text-dark': request.typeRes === 'Materiel',
                    'badge bg-success': request.typeRes === 'Mixte'
                  }">
                    <i :class="{
                      'bi bi-house-door me-1': request.typeRes === 'Salle',
                      'bi bi-tools me-1': request.typeRes === 'Materiel',
                      'bi bi-collection me-1': request.typeRes === 'Mixte'
                    }"></i>
                    {{ getRessourceType(request) }}
                  </span>
                </td>
                <td>
                  <div class="fw-bold">{{ formatDateTime(request.debRes) }}</div>
                  <div class="small text-muted">Début prévu</div>
                </td>
                <td>
                  <div class="fw-medium">{{ formatDateOnly(request.dateCre) }}</div>
                  <div class="small text-muted">Date de soumission</div>
                </td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <!-- Bouton Gérer -->
                    <button 
                      class="btn btn-primary btn-sm"
                      @click="handleManage(request)"
                    >
                      <i class="bi bi-eye me-1"></i>
                      Gérer
                    </button>
                    <!-- Bouton Refuser -->
                    <button 
                      class="btn btn-danger btn-sm"
                      @click="handleRefuse(request)"
                    >
                      <i class="bi bi-x-lg me-1"></i>
                      Refuser
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Erreur -->
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

    <!-- Modal refus -->
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
            class="flex-grow-1 custom-btn-danger"
            @click="confirmRefuse"
            :loading="refuseLoading"
          >
            <template #icon>
              <n-icon><i class="bi bi-x-lg"></i></n-icon>
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
  NButton, NIcon, NCard, NTag, NSpin, NSpace,
  NText, NEmpty, NAlert, NModal, NDropdown
} from 'naive-ui';
import LocationService from '../services/LocationService';

const router = useRouter();

/* --- Menu navigation --- */
const navigationOptions = [
  { label: 'Nouvelle Réservation', key: 'nouvelle-reservation', icon: () => h('i', { class: 'bi bi-calendar-plus me-2' }) },
  { label: 'Calendrier & Disponibilités', key: 'calendrier', icon: () => h('i', { class: 'bi bi-calendar-day me-2' }) },
  { type: 'divider' },
  { label: 'Inventaire & Patrimoine', key: 'inventaire', icon: () => h('i', { class: 'bi bi-tools me-2' }) },
  { label: 'Matériel de Bureau', key: 'bureau', icon: () => h('i', { class: 'bi bi-laptop me-2' }) },
  { label: 'Fiches Clients', key: 'clients', icon: () => h('i', { class: 'bi bi-people me-2' }) },
  { type: 'divider' },
  { label: 'Tableau de Bord', key: 'dashboard', icon: () => h('i', { class: 'bi bi-house me-2' }) }
];

const handleNavigationSelect = (key) => {
  const routes = {
    'dashboard': '/dashboardReception',
    'nouvelle-reservation': '/reservationLocationForm',
    'calendrier': '/calendrier',
    'inventaire': '/patrimoine',
    'bureau': '/materielBureauView',
    'clients': '/clientManagement'
  };
  if (routes[key]) router.push(routes[key]);
};

/* --- states --- */
const pendingRequests = ref([]);
const loading = ref(true);
const errorMessage = ref(null);
const actionMessage = ref('');
const actionMessageType = ref('success');
const showRefuseModal = ref(false);
const selectedRequest = ref(null);
const refuseLoading = ref(false);

/* --- Utilities --- */
const parseDate = (str) => {
  if (!str) return new Date(NaN);
  if (str instanceof Date) return str;

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str + 'T00:00:00');
  if (str.includes(' ')) return new Date(str.replace(' ', 'T'));

  return new Date(str);
};

const formatDateTime = (d) => {
  if (!d) return 'N/A';
  const date = parseDate(d);
  if (isNaN(date)) return 'Date invalide';
  const DD = String(date.getDate()).padStart(2, '0');
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const YY = date.getFullYear();
  const HH = String(date.getHours()).padStart(2, '0');
  const MIN = String(date.getMinutes()).padStart(2, '0');
  return HH === '00' && MIN === '00' ? `${DD}/${MM}/${YY}` : `${DD}/${MM}/${YY} ${HH}:${MIN}`;
};

const formatDateOnly = (d) => {
  if (!d) return 'N/A';
  const date = parseDate(d);
  if (isNaN(date)) return 'Date invalide';
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

/* --- get type --- */
const getRessourceType = (req) =>
  ({ 'Salle': 'Salle', 'Materiel': 'Matériel', 'Mixte': 'Salle & Matériel' }[req.typeRes] || 'Non spécifié');

/* --- Fetch data --- */
const fetchPendingRequests = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const res = await LocationService.getPendingReservations();
    const data = res?.data;
    if (Array.isArray(data)) {
      pendingRequests.value = data;
    } else if (Array.isArray(data?.data)) {
      pendingRequests.value = data.data;
    } else if (Array.isArray(data?.reservations)) {
      pendingRequests.value = data.reservations;
    } else {
      const key = Object.keys(data || {}).find(k => Array.isArray(data[k]));
      pendingRequests.value = key ? data[key] : [];
    }
  } catch (e) {
    console.error("Erreur récupération demandes:", e);
    pendingRequests.value = [];
    errorMessage.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
};

/* --- actions --- */
const handleManage = (row) => {
  console.log('📝 Gérer la demande:', row.idRes);
  router.push({ name: 'ReservationValid', params: { idRes: row.idRes } });
};

const handleRefuse = (row) => {
  console.log('❌ Refuser la demande:', row.idRes);
  selectedRequest.value = row;
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
  } catch (e) {
    console.error("Erreur refus:", e);
    actionMessage.value = e.response?.data?.message || e.message;
    actionMessageType.value = 'error';
  }

  refuseLoading.value = false;
};

onMounted(fetchPendingRequests);
</script>

<style scoped>
.demandes-container {
  max-width: 1400px;
  padding: 20px;
  margin: auto;
  min-height: 100vh;
}

.custom-header {
  background: linear-gradient(135deg, #04058f, #02061e);
  color: white;
  border-left: 4px solid #007bff;
}

.custom-title {
  font-weight: bold;
  color: white;
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

.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.card-header-content {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
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
  padding: 1.5rem;
}

/* Loading State */
.loading-state {
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Empty State */
.empty-state {
  padding: 4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Table Styles */
.table-responsive {
  overflow-x: auto;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding: 12px 16px;
}

.table td {
  vertical-align: middle;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.table-hover tbody tr:hover {
  background-color: #f8f9ff !important;
}

.badge {
  font-size: 0.85em;
  padding: 0.4em 0.8em;
}

/* Button Styles */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}

.custom-btn-primary {
  background-color: #0d6efd;
  border: none;
}

.custom-btn-danger {
  background-color: #dc3545;
  border: none;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .demandes-container {
    padding: 12px;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>