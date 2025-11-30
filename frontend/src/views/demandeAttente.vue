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

            <div></div>
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

        <!-- Tableau -->
        <div v-else class="table-scroll-container">
          <div class="table-wrapper">
            <n-data-table
              :columns="columns"
              :data="pendingRequests"
              :bordered="false"
              class="demandes-table custom-table"
              size="small"
              :single-line="false"
              :max-height="600"
              :scroll-x="1200"
              virtual-scroll
              flex-height
            />
          </div>
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
/* --- imports --- */
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NButton, NIcon, NCard, NTag, NDataTable, NSpin, NSpace,
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
    if (Array.isArray(data)) pendingRequests.value = data;
    else if (Array.isArray(data?.data)) pendingRequests.value = data.data;
    else {
      const key = Object.keys(data || {}).find(k => Array.isArray(data[k]));
      pendingRequests.value = key ? data[key] : [];
    }
  } catch (e) {
    pendingRequests.value = [];
    errorMessage.value = e.response?.data?.message || e.message;
  }
  loading.value = false;
};

/* --- actions --- */
const handleManage = (row) =>
  router.push({ name: 'ReservationValid', params: { idRes: row.idRes } });

const handleRefuse = (row) => {
  selectedRequest.value = row;
  showRefuseModal.value = true;
};

const confirmRefuse = async () => {
  if (!selectedRequest.value) return;
  refuseLoading.value = true;

  try {
    await LocationService.updateReservationStatus(selectedRequest.value.idRes, 'Refusée');
    actionMessage.value = `Demande #${selectedRequest.value.idRes} refusée`;
    actionMessageType.value = 'success';
    await fetchPendingRequests();
    showRefuseModal.value = false;
    selectedRequest.value = null;
  } catch (e) {
    actionMessage.value = e.response?.data?.message || e.message;
    actionMessageType.value = 'error';
  }

  refuseLoading.value = false;
};

onMounted(fetchPendingRequests);

/* --- Colonnes tableau --- */
const columns = [
  {
    title: 'ID',
    key: 'idRes',
    width: 80,
    fixed: 'left',
    align: 'center',
    render: (row) => h(NTag, { type: 'info', size: 'small', bordered: false }, () => `#${row.idRes}`)
  },
  {
    title: 'Demandeur',
    key: 'client',
    width: 200,
    render: (row) =>
      h('div', { class: 'client-info' }, [
        h('div', { class: 'fw-bold' }, `${row.client?.nomCli || ''} ${row.client?.prenomCli || ''}`),
        h('div', { class: 'small text-muted' }, `ID: ${row.client?.idCli || 'N/A'}`)
      ])
  },
  {
    title: 'Type',
    key: 'typeRes',
    width: 140,
    align: 'center',
    render: (row) =>
      h(NTag, { type: 'primary', size: 'small', bordered: false }, () =>
        h('div', { class: 'd-flex align-items-center' }, [
          h(NIcon, { size: 14, class: 'me-1' }, () => h('i', { class: 'bi bi-house-door' })),
          getRessourceType(row)
        ])
      )
  },
  {
    title: 'Date Début',
    key: 'debRes',
    width: 180,
    render: (row) =>
      h('div', [
        h('div', { class: 'fw-bold' }, formatDateTime(row.debRes)),
        h('div', { class: 'small text-muted' }, 'Début prévu')
      ])
  },
  {
    title: 'Soumission',
    key: 'dateCre',
    width: 180,
    render: (row) =>
      h('div', [
        h('div', { class: 'fw-medium' }, formatDateOnly(row.dateCre)),
        h('div', { class: 'small text-muted' }, 'Date de soumission')
      ])
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
    align: 'center',
    render: (row) =>
      h(NSpace, { justify: 'center' }, [
        h(
          NButton,
          { type: 'primary', size: 'small', onClick: () => handleManage(row) },
          () => h('span', 'Gérer')
        ),
        h(
          NButton,
          { type: 'error', size: 'small', ghost: true, onClick: () => handleRefuse(row) },
          () => h('span', 'Refuser')
        )
      ])
  }
];
</script>

<style scoped>
.demandes-container {
  max-width: 1400px;
  padding: 20px;
  margin: auto;
}

.custom-header {
  background: linear-gradient(135deg, #04058f, #02061e);
  color: white;
}

.custom-title {
  font-weight: bold;
}

.main-card {
  border-radius: 12px;
  overflow: hidden;
}

.table-scroll-container {
  max-height: 650px;
  overflow: auto;
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
</style>
