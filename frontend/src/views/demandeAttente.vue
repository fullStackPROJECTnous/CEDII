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
            <div></div> <!-- Placeholder pour l'alignement -->
          </div>
        </div>
      </div>
    </div>

    <!-- Carte principale -->
    <n-card class="main-card custom-card" content-class="p-0">
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
            <n-tag :bordered="false" type="warning" size="large" class="custom-tag">
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

        <!-- Tableau des demandes SIMPLIFIÉ -->
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
            class="flex-grow-1 custom-btn-danger" 
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard,
  NTag,
  NSpin,
  NSpace,
  NText,
  NEmpty,
  NAlert,
  NModal,
  NButton,
  NIcon
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
// MÉTHODES DE FORMATAGE DES DATES
// ------------------------------------
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseDate(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
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
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erreur formatage date:', error, dateString);
    return 'N/A';
  }
};

const parseDate = (dateString) => {
  if (!dateString) return new Date(NaN);
  
  if (dateString instanceof Date) return dateString;
  
  if (typeof dateString === 'string') {
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
      return new Date(dateString.replace(' ', 'T'));
    }
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString + 'T00:00:00');
    }
    
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
  }
  
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

// FONCTION POUR RÉCUPÉRER LES DEMANDES
const fetchPendingRequests = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await LocationService.getPendingReservations();
    
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        pendingRequests.value = response.data;
      } 
      else if (response.data.data && Array.isArray(response.data.data)) {
        pendingRequests.value = response.data.data;
      }
      else if (response.data.reservations && Array.isArray(response.data.reservations)) {
        pendingRequests.value = response.data.reservations;
      }
      else if (typeof response.data === 'object') {
        const arrayKey = Object.keys(response.data).find(key => 
          Array.isArray(response.data[key])
        );
        if (arrayKey) {
          pendingRequests.value = response.data[arrayKey];
        } else {
          pendingRequests.value = [];
          console.warn('Aucun tableau trouvé dans la réponse:', response.data);
        }
      }
      else {
        pendingRequests.value = [];
        console.warn('Format de réponse inattendu:', response.data);
      }
    } else {
      pendingRequests.value = [];
      console.warn('Réponse vide ou invalide:', response);
    }
    
    console.log('Demandes chargées:', pendingRequests.value);
    
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    errorMessage.value = `Impossible de charger les demandes : ${error.response?.data?.message || error.message}`;
    pendingRequests.value = [];
  } finally {
    loading.value = false;
  }
};

// MÉTHODE POUR GÉRER LA DEMANDE
const handleManage = (request) => {
  console.log('📝 Gérer la demande:', request.idRes);
  router.push({ 
    name: 'ReservationValid', 
    params: { idRes: request.idRes } 
  });
};

// MÉTHODE POUR REFUSER LA DEMANDE
const handleRefuse = (request) => {
  console.log('❌ Refuser la demande:', request.idRes);
  selectedRequest.value = request;
  showRefuseModal.value = true;
};

// MÉTHODE POUR CONFIRMER LE REFUS
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

// CHARGEMENT INITIAL
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
}

/* Header Section */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%);
  color: white;
  border-left: 4px solid #007bff;
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

/* Main Card */
.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
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
}

.table td {
  vertical-align: middle;
  padding: 12px 16px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9ff;
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
}
</style>