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

        <!-- Tableau des demandes avec défilement -->
        <div v-else class="table-container">
          <div class="table-responsive" style="overflow-x: auto; max-height: 600px;">
            <table class="table table-hover table-fixed">
              <thead class="table-primary sticky-header">
                <tr>
                  <th width="80">ID</th>
                  <th width="200">Demandeur</th>
                  <th width="120">Type</th>
                  <th width="250">Date & Heure Soumission</th>
                  <th width="250">Début Réservation</th>
                  <th width="180" class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in pendingRequests" :key="request.idRes">
                  <td>
                    <span class="badge bg-info">#{{ request.idRes }}</span>
                  </td>
                  <td>
                    <div class="fw-bold text-ellipsis">
                      {{ request.client?.nomCli || 'N/A' }} {{ request.client?.prenomCli || '' }}
                    </div>
                    <div class="small text-muted text-ellipsis">
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
                    <!-- DATE ET HEURE EXACTE DE SOUMISSION À MADAGASCAR -->
                    <div class="datetime-cell">
                      <div class="fw-bold text-primary text-scroll">
                        {{ getExactSubmissionDateTime(request) }}
                      </div>
                      <div class="small text-muted text-scroll">
                        <i class="bi bi-clock me-1"></i>
                        {{ getTimeAgo(request) }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <!-- DATE ET HEURE EXACTE DE DEBUT À MADAGASCAR -->
                    <div class="datetime-cell">
                      <div class="fw-bold text-scroll">
                        {{ getExactReservationStart(request) }}
                      </div>
                      <div class="small text-muted text-scroll">
                        <i class="bi bi-calendar-event me-1"></i>
                        {{ getTimeUntil(request) }}
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="d-flex justify-content-center gap-2 action-buttons">
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
          
          <!-- Indicateur de défilement -->
          <div v-if="pendingRequests.length > 5" class="scroll-hint mt-2">
            <i class="bi bi-arrow-left-right me-1"></i>
            Défilez horizontalement pour voir toutes les colonnes
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
import { ref, onMounted, h } from 'vue';
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

/* --- Fonctions d'affichage SIMPLIFIÉES --- */
const getExactSubmissionDateTime = (request) => {
  return request.dateCreFormatted || 'Date non disponible';
};

const getExactReservationStart = (request) => {
  return request.debResFormatted || 'Date non disponible';
};

const getTimeAgo = (request) => {
  return request.timeAgo || 'inconnu';
};

const getTimeUntil = (request) => {
  return request.timeUntil || 'inconnu';
};

/* --- get type --- */
const getRessourceType = (req) =>
  ({ 'Salle': 'Salle', 'Materiel': 'Matériel', 'Mixte': 'Salle & Matériel' }[req.typeRes] || 'Non spécifié');

/* --- Fetch data --- */
const fetchPendingRequests = async () => {
  loading.value = true;
  errorMessage.value = null;
  
  try {
    console.log('🔄 Récupération des demandes en attente...');
    const res = await LocationService.getPendingReservations();
    
    const data = res?.data;
    console.log('📊 Données API reçues:', data);
    
    let requestsArray = [];
    
    // Extraction selon différents formats possibles
    if (data && data.success && Array.isArray(data.reservations)) {
      requestsArray = data.reservations;
      console.log('✅ Format moderne détecté');
    } else if (Array.isArray(data)) {
      requestsArray = data;
      console.log('⚠ Format tableau direct');
    } else if (data && Array.isArray(data.data)) {
      requestsArray = data.data;
      console.log('⚠ Format data.data');
    } else {
      const key = Object.keys(data || {}).find(k => Array.isArray(data[k]));
      requestsArray = key ? data[key] : [];
      console.log('❓ Format inconnu, tableau trouvé via clé:', key);
    }
    
    console.log(`✅ ${requestsArray.length} demande(s) chargée(s)`);
    
    // Log de débogage
    if (requestsArray.length > 0) {
      console.log('🔍 PREMIÈRE DEMANDE:');
      const sample = requestsArray[0];
      console.log({
        idRes: sample.idRes,
        dateCreFormatted: sample.dateCreFormatted,
        debResFormatted: sample.debResFormatted,
        timeAgo: sample.timeAgo,
        timeUntil: sample.timeUntil,
        client: sample.client ? `${sample.client.nomCli} ${sample.client.prenomCli}` : 'N/A'
      });
    }
    
    pendingRequests.value = requestsArray;
    
  } catch (e) {
    console.error("❌ Erreur récupération demandes:", e);
    pendingRequests.value = [];
    errorMessage.value = e.response?.data?.message || e.message || "Erreur de connexion au serveur";
  } finally {
    loading.value = false;
  }
};

/* --- actions --- */
const handleManage = (request) => {
  console.log('📝 Gérer la demande:', request.idRes);
  router.push({ name: 'ReservationValid', params: { idRes: request.idRes } });
};

const handleRefuse = (request) => {
  console.log('❌ Refuser la demande:', request.idRes);
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
  } catch (e) {
    console.error("Erreur refus:", e);
    actionMessage.value = e.response?.data?.message || e.message || "Erreur lors du refus";
    actionMessageType.value = 'error';
  }

  refuseLoading.value = false;
};

onMounted(() => {
  fetchPendingRequests();
});
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

/* Table Container */
.table-container {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

/* Table Styles */
.table-responsive {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #007bff #f8f9fa;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.table {
  margin-bottom: 0;
  min-width: 1100px; /* Force horizontal scroll */
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa !important;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding: 12px 16px;
  white-space: nowrap;
  position: relative;
}

.table td {
  vertical-align: middle;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  max-width: 250px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9ff !important;
}

/* Cellules de date avec scroll de texte */
.datetime-cell {
  max-width: 250px;
  overflow: hidden;
}

.text-scroll {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
  position: relative;
}

.text-scroll:hover {
  overflow: auto;
  text-overflow: clip;
  white-space: normal;
  cursor: ew-resize;
  background-color: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Badge */
.badge {
  font-size: 0.85em;
  padding: 0.4em 0.8em;
  white-space: nowrap;
}

/* Style pour les colonnes de date */
.table td:nth-child(4) .fw-bold {
  color: #5811EE; /* Violet pour date de soumission */
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.table td:nth-child(5) .fw-bold {
  color: #067186; /* Bleu pour date de début */
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.table td .small {
  color: #6c757d;
  font-size: 0.8rem;
}

/* Action buttons */
.action-buttons {
  min-width: 160px;
}

/* Button Styles */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
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

/* Scroll hint */
.scroll-hint {
  text-align: center;
  font-size: 0.8rem;
  color: #6c757d;
  padding: 4px;
  background-color: #f8f9fa;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
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
  
  .table td, .table th {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
  
  .table td:nth-child(4) .fw-bold,
  .table td:nth-child(5) .fw-bold {
    font-size: 0.8rem;
  }
  
  .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
    min-width: auto;
  }
  
  .table-responsive {
    max-height: 500px;
  }
}

@media (max-width: 480px) {
  .table-responsive {
    max-height: 400px;
  }
  
  .datetime-cell {
    max-width: 180px;
  }
}
</style>