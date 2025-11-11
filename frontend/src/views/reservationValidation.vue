<template>
  <div class="validation-container">
    <!-- Header avec navigation fixe -->
    <div class="header-section">
      <div class="d-flex justify-content-between align-items-center">
        <n-button 
          type="primary" 
          ghost 
          @click="$router.push('/demandeAttente')"
          class="back-button"
          size="small"
        >
          <template #icon>
            <n-icon>
              <i class="bi bi-arrow-left"></i>
            </n-icon>
          </template>
          Retour aux demandes
        </n-button>

        <div class="header-title text-center flex-grow-1">
          <h1 class="page-title cedii-text-primary mb-2">
            <i class="bi bi-file-earmark-check-fill me-2"></i> 
            Validation de la Demande #{{ idRes }}
          </h1>
          <p class="page-subtitle text-muted mb-0">
            Processus de validation et création de contrat
          </p>
        </div>
      </div>
    </div>

    <!-- Messages d'alerte -->
    <n-alert
      v-if="errorMessage"
      type="error"
      title="Erreur"
      class="mb-4 alert-fixed"
      closable
      @close="errorMessage = null"
    >
      {{ errorMessage }}
    </n-alert>

    <n-alert
      v-if="successMessage"
      type="success"
      title="Succès"
      class="mb-4 alert-fixed"
      closable
      @close="successMessage = null"
    >
      {{ successMessage }}
    </n-alert>

    <!-- Contenu scrollable -->
    <div class="scrollable-content">
      <!-- État de chargement -->
      <div v-if="loading" class="loading-state">
        <n-card class="text-center">
          <n-space vertical align="center" class="py-5">
            <n-spin size="large" />
            <n-text type="primary" class="mt-3 fs-5">
              Chargement des détails de la réservation...
            </n-text>
          </n-space>
        </n-card>
      </div>

      <!-- Contenu principal -->
      <div v-else-if="reservation" class="content-section">
        <!-- Carte Détails de la Demande -->
        <n-card class="main-card mb-4" title="Détails de la Demande">
          <template #header-extra>
            <n-tag :type="getStatusType(reservation.etatRes)" size="small">
              {{ reservation.etatRes }}
            </n-tag>
          </template>

          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <!-- Informations Client -->
            <n-gi>
              <n-card title="Informations Client" size="small" class="h-100">
                <template #header-extra>
                  <n-icon size="20" color="var(--cedii-primary-light)">
                    <i class="bi bi-person-badge"></i>
                  </n-icon>
                </template>
                
                <n-space vertical>
                  <div class="info-item">
                    <n-text strong>Nom complet :</n-text>
                    <n-text class="ms-2">
                      {{ reservation.client.nomCli }} {{ reservation.client.prenomCli }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Email :</n-text>
                    <n-text class="ms-2" type="info">
                      {{ reservation.client.emailCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Téléphone :</n-text>
                    <n-text class="ms-2">
                      {{ reservation.client.telephoneCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>ID Client :</n-text>
                    <n-tag size="small" type="info" class="ms-2">
                      {{ reservation.client.idCli }}
                    </n-tag>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Ressource Demandée -->
            <n-gi>
              <n-card title="Ressource Demandée" size="small" class="h-100">
                <template #header-extra>
                  <n-icon size="20" color="var(--cedii-primary-light)">
                    <i class="bi" :class="getResourceIcon(reservation.typeRes)"></i>
                  </n-icon>
                </template>

                <n-space vertical>
                  <div class="info-item">
                    <n-text strong>Type :</n-text>
                    <n-tag :type="getResourceTagType(reservation.typeRes)" size="small" class="ms-2">
                      {{ getRessourceType(reservation) }}
                    </n-tag>
                  </div>
                  <div class="info-item">
                    <n-text strong>Période :</n-text>
                    <n-text class="ms-2">
                      Du {{ formatDate(reservation.debRes) }}<br>
                      Au {{ formatDate(reservation.finRes) }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>{{ reservation.typeRes === 'Materiel' ? 'Quantité' : 'Personnes' }} :</n-text>
                    <n-text class="ms-2" strong>
                      {{ reservation.qteMat || reservation.nbPerso }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Tarif Total :</n-text>
                    <n-text class="ms-2 cedii-text-primary fw-bold fs-6">
                      {{ reservation.tarifTot }} MGA
                    </n-text>
                  </div>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </n-card>

        <!-- Processus de Validation -->
        <n-card class="validation-card" title="Processus de Validation">
          <template #header-extra>
            <n-steps :current="currentStep" status="process">
              <n-step title="Contrat" description="Génération du document" />
              <n-step title="Signature" description="Validation client" />
              <n-step title="Activation" description="Finalisation" />
            </n-steps>
          </template>

          <!-- Étape 1: Contrat -->
          <n-card title="1. Génération du Contrat" size="small" class="mb-4">
            <n-alert type="info" class="mb-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-info-circle"></i>
                </n-icon>
              </template>
              Le système a vérifié la disponibilité. Vous confirmez le transfert vers une location active.
            </n-alert>

            <n-button 
              type="primary" 
              ghost 
              @click="simulerContrat"
              class="me-3"
              :disabled="contractReady"
            >
              <template #icon>
                <n-icon>
                  <i class="bi bi-file-earmark-text"></i>
                </n-icon>
              </template>
              Générer le Contrat PDF
            </n-button>

            <n-alert v-if="contractReady" type="success" class="mt-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-check-circle"></i>
                </n-icon>
              </template>
              Contrat généré et prêt pour la signature électronique
            </n-alert>
          </n-card>

          <!-- Étape 2: Signature -->
          <n-card title="2. Signature Électronique" size="small" class="mb-4">
            <n-form :model="signatureForm" :rules="signatureRules">
              <n-form-item label="Signature électronique" path="signature">
                <n-input
                  v-model:value="signatureData"
                  placeholder="Entrez 'SIGNÉ' pour simuler la signature"
                  :disabled="!contractReady"
                  clearable
                />
                <template #feedback>
                  <n-text depth="3" class="small">
                    Ce champ simule l'étape de signature électronique du client
                  </n-text>
                </template>
              </n-form-item>
            </n-form>
          </n-card>

          <!-- Étape 3: Finalisation -->
          <n-card title="3. Finalisation" size="small">
            <n-button
              type="primary"
              size="large"
              :disabled="!isReadyToValidate || isProcessing"
              :loading="isProcessing"
              @click="handleValidation"
              class="w-100 validate-btn"
            >
              <template #icon>
                <n-icon>
                  <i class="bi bi-check-circle-fill"></i>
                </n-icon>
              </template>
              {{ isProcessing ? 'Traitement en cours...' : 'Confirmer la Location et Activer le Contrat' }}
            </n-button>

            <n-alert v-if="!isReadyToValidate && contractReady" type="warning" class="mt-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-exclamation-triangle"></i>
                </n-icon>
              </template>
              Veuillez compléter la signature électronique pour finaliser la validation
            </n-alert>
          </n-card>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NButton,
  NIcon,
  NCard,
  NTag,
  NGrid,
  NGi,
  NSpace,
  NText,
  NAlert,
  NSpin,
  NSteps,
  NStep,
  NForm,
  NFormItem,
  NInput
} from 'naive-ui';
import LocationService from '../services/LocationService';

const route = useRoute();
const router = useRouter();

const idRes = ref(null);
const reservation = ref(null);
const loading = ref(true);
const errorMessage = ref(null);
const successMessage = ref(null);
const isProcessing = ref(false);
const contractReady = ref(false);
const signatureData = ref('');

// ------------------------------------
// PROPRIÉTÉS CALCULÉES
// ------------------------------------
const currentStep = computed(() => {
  if (!contractReady.value) return 0;
  if (contractReady.value && !isReadyToValidate.value) return 1;
  return 2;
});

const isReadyToValidate = computed(() => {
  return contractReady.value && signatureData.value.toUpperCase() === 'SIGNÉ';
});

// ------------------------------------
// RÈGLES DE VALIDATION
// ------------------------------------
const signatureRules = {
  signature: {
    validator: (rule, value) => {
      if (!value) {
        return new Error('La signature est requise');
      }
      if (value.toUpperCase() !== 'SIGNÉ') {
        return new Error('Veuillez entrer "SIGNÉ" pour valider');
      }
      return true;
    },
    trigger: ['input', 'blur']
  }
};

const signatureForm = computed(() => ({
  signature: signatureData.value
}));

// ------------------------------------
// MÉTHODES
// ------------------------------------
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  } catch {
    return dateString.substring(0, 16);
  }
};

const getRessourceType = (request) => {
  const typeMap = {
    'Salle': 'Salle',
    'Materiel': 'Matériel',
    'Mixte': 'Salle & Matériel'
  };
  return typeMap[request.typeRes] || 'Non spécifié';
};

const getResourceIcon = (type) => {
  const icons = {
    'Salle': 'bi-house-door',
    'Materiel': 'bi-tools',
    'Mixte': 'bi-collection'
  };
  return icons[type] || 'bi-question-circle';
};

const getResourceTagType = (type) => {
  const types = {
    'Salle': 'primary',
    'Materiel': 'warning',
    'Mixte': 'success'
  };
  return types[type] || 'default';
};

const getStatusType = (status) => {
  const types = {
    'En attente': 'warning',
    'Confirmée': 'success',
    'Refusée': 'error',
    'Annulée': 'default'
  };
  return types[status] || 'default';
};

const fetchReservationDetails = async () => {
  if (!idRes.value) {
    loading.value = false;
    errorMessage.value = "Erreur: L'identifiant de la réservation est manquant.";
    return;
  }
  
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await LocationService.getReservationDetails(idRes.value);
    reservation.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement des détails:", error);
    errorMessage.value = `Impossible de charger la réservation : ${error.response?.data?.message || error.message}`;
  } finally {
    loading.value = false;
  }
};

const simulerContrat = () => {
  contractReady.value = true;
};

const handleValidation = async () => {
  if (!isReadyToValidate.value) return;

  isProcessing.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await LocationService.validateReservation(idRes.value, signatureData.value);
    
    successMessage.value = response.data.message;
    
    // Redirection après délai pour voir le message de succès
    setTimeout(() => {
      router.push({ name: 'DemandesEnAttente' });
    }, 2000);
    
  } catch (error) {
    console.error("Erreur de validation:", error);
    errorMessage.value = `Échec de la validation : ${error.response?.data?.message || error.message}`;
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  const routeId = route.params.idRes;
  console.log("Paramètres de la route:", route.params);
  
  if (routeId) {
    idRes.value = routeId;
    fetchReservationDetails();
  } else {
    loading.value = false;
    errorMessage.value = "Erreur: L'identifiant de la réservation est introuvable.";
  }
});
</script>

<style scoped>
.validation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header Section fixe */
.header-section {
  background: transparent;
  flex-shrink: 0;
  margin-bottom: 1rem;
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
  min-width: 160px;
}

/* Alertes fixes */
.alert-fixed {
  flex-shrink: 0;
}

/* Contenu scrollable */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

/* Scrollbar personnalisée */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: var(--cedii-primary-light, #5B11EE);
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: var(--cedii-primary-dark, #0671b6);
}

/* Pour Firefox */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: var(--cedii-primary-light, #5B11EE) #f1f1f1;
}

/* Cards */
.main-card, .validation-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Loading State */
.loading-state {
  padding: 2rem 0;
}

/* Content Section */
.content-section {
  min-height: min-content;
  padding-bottom: 20px;
}

/* Info Items */
.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

/* Validation Button */
.validate-btn {
  height: 50px;
  font-weight: 600;
  font-size: 16px;
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

/* Steps customization */
:deep(.n-steps .n-step .n-step__indicator) {
  border-color: var(--cedii-primary-light, #5B11EE);
}

:deep(.n-steps .n-step.n-step--active .n-step__indicator) {
  background-color: var(--cedii-primary-light, #5B11EE);
}

/* Responsive */
@media (max-width: 768px) {
  .validation-container {
    padding: 12px;
    height: 100vh;
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
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }

  .scrollable-content {
    padding-right: 4px;
  }
}

@media (max-width: 576px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .validation-container {
    padding: 8px;
  }
}
</style>