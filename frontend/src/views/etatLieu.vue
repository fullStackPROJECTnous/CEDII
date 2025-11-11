<template>
  <div class="container-fluid py-3">
    <!-- En-tête compact -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i class="bi bi-truck-flatbed me-2 custom-icon fs-5"></i>
            <div>
              <h4 class="mb-0 fw-bold">Départs & Retours</h4>
              <small class="text-muted">État des lieux</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <n-badge :value="confirmedEvents.length" type="info" :max="99" />
            <n-button type="primary" @click="fetchConfirmedEvents" size="small" secondary>
              <i class="bi bi-arrow-clockwise"></i>
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-3 custom-divider">

    <!-- Alertes compactes -->
    <n-alert v-if="errorMessage" type="error" class="mb-3" closable @close="errorMessage = null" size="small">
      <i class="bi bi-exclamation-triangle me-1"></i>{{ errorMessage }}
    </n-alert>

    <n-alert v-if="successMessage" type="success" class="mb-3" closable @close="successMessage = null" size="small">
      <i class="bi bi-check-circle me-1"></i>{{ successMessage }}
    </n-alert>

    <!-- Statistiques compactes -->
    <div class="row g-2 mb-3">
      <div class="col-6 col-sm-3">
        <n-card size="small" class="h-100 text-center stats-card">
          <div class="stats-number text-primary">{{ confirmedEvents.length }}</div>
          <div class="stats-label">Total</div>
        </n-card>
      </div>
      <div class="col-6 col-sm-3">
        <n-card size="small" class="h-100 text-center stats-card">
          <div class="stats-number text-warning">{{ pendingReturnsCount }}</div>
          <div class="stats-label">En Retour</div>
        </n-card>
      </div>
      <div class="col-6 col-sm-3">
        <n-card size="small" class="h-100 text-center stats-card">
          <div class="stats-number text-success">{{ todayDeparturesCount }}</div>
          <div class="stats-label">Départs</div>
        </n-card>
      </div>
      <div class="col-6 col-sm-3">
        <n-card size="small" class="h-100 text-center stats-card">
          <div class="stats-number text-info">{{ todayReturnsCount }}</div>
          <div class="stats-label">Retours</div>
        </n-card>
      </div>
    </div>

    <!-- Carte principale compacte -->
    <n-card class="custom-card" title="Événements du jour" size="small">
      <template #header-extra>
        <n-tag type="info" size="small">
          {{ new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }}
        </n-tag>
      </template>

      <div class="card-body p-0">
        <!-- État de chargement compact -->
        <div v-if="loading" class="text-center p-4">
          <n-spin size="medium">
            <template #description>
              <small class="text-muted">Chargement...</small>
            </template>
          </n-spin>
        </div>

        <!-- État vide compact -->
        <div v-else-if="confirmedEvents.length === 0" class="text-center p-4">
          <n-empty size="small" description="Aucun événement aujourd'hui">
            <template #icon>
              <i class="bi bi-calendar-x" style="font-size: 2rem; color: var(--cedii-secondary);"></i>
            </template>
          </n-empty>
        </div>

        <!-- Liste compacte des événements -->
        <div v-else class="compact-events-list">
          <n-collapse arrow-placement="right" :default-expanded-names="expandedEvents" accordion>
            <n-collapse-item 
              v-for="event in confirmedEvents" 
              :key="event.idLo" 
              :name="event.idLo"
              class="compact-event-item"
            >
              <template #header>
                <div class="d-flex align-items-center w-100 py-1">
                  <n-tag :type="getEventType(event)" size="small" class="me-2">
                    #{{ event.idLo }}
                  </n-tag>
                  <div class="flex-grow-1">
                    <strong class="d-block text-sm">{{ event.client.nomCli }} {{ event.client.prenomCli }}</strong>
                    <small class="text-muted">
                      {{ formatCompactDate(event.debLoc) }} → {{ formatCompactDate(event.finLoc) }}
                    </small>
                  </div>
                  <n-tag v-if="isPastEvent(event.finLoc)" type="warning" size="small">
                    Retour
                  </n-tag>
                  <n-tag v-else type="success" size="small">
                    Départ
                  </n-tag>
                </div>
              </template>

              <div class="compact-event-details p-2">
                <!-- Informations compactes -->
                <div class="row g-2 mb-2">
                  <div class="col-6">
                    <div class="compact-info-group">
                      <label class="compact-label">Client</label>
                      <div class="compact-value">{{ event.client.nomCli }} {{ event.client.prenomCli }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="compact-info-group">
                      <label class="compact-label">Type</label>
                      <n-tag :type="event.typeLo === 'Salle' ? 'primary' : 'info'" size="tiny">
                        {{ event.typeLo }}
                      </n-tag>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="compact-info-group">
                      <label class="compact-label">Téléphone</label>
                      <div class="compact-value">{{ event.client.telephoneCli || 'N/A' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="compact-info-group">
                      <label class="compact-label">Tarif</label>
                      <div class="compact-value text-primary fw-bold">
                        {{ parseFloat(event.tarifTot).toLocaleString('fr-FR') }} Ar
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions compactes -->
                <div class="d-flex gap-1 flex-wrap">
                  <router-link
                    :to="{ name: 'FormEtatLieu', params: { idLo: event.idLo, mode: 'depart' } }"
                    class="text-decoration-none flex-fill"
                  >
                    <n-button type="primary" size="small" class="w-100 compact-action-btn">
                      <i class="bi bi-box-arrow-up me-1"></i>
                      Départ
                    </n-button>
                  </router-link>

                  <router-link
                    v-if="isPastEvent(event.finLoc)"
                    :to="{ name: 'FormEtatLieu', params: { idLo: event.idLo, mode: 'retour' } }"
                    class="text-decoration-none flex-fill"
                  >
                    <n-button type="warning" size="small" class="w-100 compact-action-btn">
                      <i class="bi bi-box-arrow-down me-1"></i>
                      Retour
                    </n-button>
                  </router-link>

                  <n-button 
                    type="info" 
                    size="small"
                    @click="viewDetails(event)"
                    class="compact-action-btn"
                    secondary
                  >
                    <i class="bi bi-eye"></i>
                  </n-button>

                  <n-button 
                    type="error" 
                    size="small"
                    @click="handleAnnulation(event)"
                    class="compact-action-btn"
                    secondary
                    v-if="!isPastEvent(event.finLoc)"
                  >
                    <i class="bi bi-x"></i>
                  </n-button>
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </div>
    </n-card>

    <!-- Modal de confirmation compact -->
    <n-modal v-model:show="showCancelModal" transform-origin="center">
      <n-card
        style="width: 400px; max-width: 90vw;"
        title="Confirmer l'annulation"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
      >
        <p class="mb-2">Annuler la location #{{ selectedEvent?.idLo }} ?</p>
        <p class="text-muted small mb-3">Action irréversible</p>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showCancelModal = false">Non</n-button>
            <n-button type="error" size="small" @click="confirmCancellation" :loading="cancelling">
              Oui, annuler
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NCard, 
  NButton, 
  NSpin, 
  NEmpty, 
  NAlert, 
  NTag, 
  NCollapse, 
  NCollapseItem, 
  NBadge,
  NModal
} from 'naive-ui';
import LocationService from '../services/LocationService';

const router = useRouter();

// Variables réactives
const confirmedEvents = ref([]);
const loading = ref(true);
const errorMessage = ref(null);
const successMessage = ref(null);
const expandedEvents = ref([]);
const showCancelModal = ref(false);
const selectedEvent = ref(null);
const cancelling = ref(false);

// Computed properties
const pendingReturnsCount = computed(() => {
  return confirmedEvents.value.filter(event => isPastEvent(event.finLoc)).length;
});

const todayDeparturesCount = computed(() => {
  const today = new Date().toDateString();
  return confirmedEvents.value.filter(event => 
    new Date(event.debLoc).toDateString() === today
  ).length;
});

const todayReturnsCount = computed(() => {
  const today = new Date().toDateString();
  return confirmedEvents.value.filter(event => 
    new Date(event.finLoc).toDateString() === today
  ).length;
});

// Méthodes
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString.substring(0, 16);
  }
};

const formatCompactDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString.substring(11, 16);
  }
};

const isPastEvent = (dateString) => {
  return new Date(dateString) < new Date();
};

const getEventType = (event) => {
  if (isPastEvent(event.finLoc)) return 'warning';
  return 'success';
};

const getStatusType = (status) => {
  const types = {
    'Confirmée': 'success',
    'En attente': 'warning',
    'Annulée': 'error',
    'Terminée': 'default'
  };
  return types[status] || 'default';
};

const viewDetails = (event) => {
  successMessage.value = `Détails #${event.idLo} - ${event.client.nomCli}`;
  setTimeout(() => { successMessage.value = null; }, 2000);
};

const handleAnnulation = (event) => {
  selectedEvent.value = event;
  showCancelModal.value = true;
};

const confirmCancellation = async () => {
  cancelling.value = true;
  try {
    // await LocationService.cancelLocation(selectedEvent.value.idLo);
    successMessage.value = `Location #${selectedEvent.value.idLo} annulée`;
    showCancelModal.value = false;
    await fetchConfirmedEvents();
  } catch (error) {
    errorMessage.value = `Erreur: ${error.message}`;
  } finally {
    cancelling.value = false;
  }
};

const fetchConfirmedEvents = async () => {
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await LocationService.getConfirmedEvents();
    confirmedEvents.value = response.data;
    
    if (confirmedEvents.value.length > 0) {
      expandedEvents.value = [confirmedEvents.value[0].idLo];
    }
    
    successMessage.value = `${confirmedEvents.value.length} événements`;
    setTimeout(() => { successMessage.value = null; }, 2000);
  } catch (error) {
    console.error("Erreur:", error);
    errorMessage.value = `Chargement impossible: ${error.response?.data?.message || error.message}`;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchConfirmedEvents();
});
</script>

<style scoped>
:root {
  --cedii-primary: #5811EE;
  --cedii-primary-dark: #04058F;
  --cedii-dark: #02061E;
  --cedii-info: #067186;
  --cedii-secondary: #55555E;
}

.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
}

.custom-icon {
  color: var(--cedii-primary);
}

.custom-divider {
  border-color: var(--cedii-info);
  opacity: 0.2;
  margin: 1rem 0;
}

.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Statistiques compactes */
.stats-card {
  border: none !important;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
}

.stats-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stats-label {
  font-size: 0.75rem;
  color: var(--cedii-secondary);
  font-weight: 500;
}

/* Liste compacte des événements */
.compact-events-list {
  border-radius: 6px;
  overflow: hidden;
}

.compact-event-item {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.compact-event-item:last-child {
  border-bottom: none;
}

.compact-event-item:hover {
  background-color: #f8f9fa;
}

.compact-event-details {
  background-color: #fafbfc;
  border-radius: 0 0 6px 6px;
  margin: 0 -12px -12px -12px;
}

/* Groupes d'information compactes */
.compact-info-group {
  margin-bottom: 0.5rem;
}

.compact-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--cedii-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.125rem;
  display: block;
}

.compact-value {
  font-size: 0.8rem;
  color: var(--cedii-dark);
  line-height: 1.2;
}

/* Boutons d'action compacts */
.compact-action-btn {
  border-radius: 4px;
  font-size: 0.75rem;
  min-height: 28px;
}

/* Overrides pour Naive UI components plus compacts */
:deep(.n-card .n-card-header) {
  padding: 12px 16px;
}

:deep(.n-card .n-card-content) {
  padding: 0;
}

:deep(.n-collapse-item .n-collapse-item__header) {
  padding: 8px 12px;
  min-height: auto;
}

:deep(.n-collapse-item .n-collapse-item__content-inner) {
  padding: 0;
}

:deep(.n-tag) {
  font-size: 0.7rem;
  line-height: 1.2;
}

:deep(.n-button) {
  font-weight: 500;
}

.text-sm {
  font-size: 0.875rem;
}

.flex-fill {
  flex: 1 1 0%;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .container-fluid {
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .compact-action-btn {
    font-size: 0.7rem;
  }
  
  .stats-number {
    font-size: 1.25rem;
  }
}
</style>