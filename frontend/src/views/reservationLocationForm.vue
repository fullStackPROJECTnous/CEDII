<template>
  <div class="reservation-page-container">
    <!-- Header amélioré -->
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
                <i class="bi bi-calendar-plus-fill me-2"></i>
                Nouvelle Réservation / Location
              </h1>
              <p class="custom-subtitle">Formulaire de création de nouvelle demande</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteneur principal avec scroll -->
    <div class="content-scroll-container">
      <!-- Formulaire principal -->
      <n-card class="reservation-form-card">
        <n-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          @submit.prevent="submitForm"
          class="p-4"
        >
          <!-- Type de Demande -->
          <div class="mb-4">
           <!-- Message de résultat -->
            <n-alert
              v-if="message"
              :type="isSuccess ? 'success' : 'error'"
              :title="isSuccess ? 'Succès' : 'Erreur'"
              class="mt-3"
              closable
              @close="message = ''"
            >
              {{ message }}
            </n-alert>
            <label class="form-label fw-bold section-title">Type de Demande <span class="text-danger">*</span></label>
            <div class="d-flex btn-group w-100" role="group">
              <input type="radio" class="btn-check" id="type-salle" value="Salle" v-model="form.typeRes" required>
              <label class="btn btn-outline-primary type-btn" for="type-salle" :class="{ 'active': form.typeRes === 'Salle' }">
                <i class="bi bi-house-door me-1"></i> Réservation de Salle
              </label>
              
              <input type="radio" class="btn-check" id="type-materiel" value="Materiel" v-model="form.typeRes" required>
              <label class="btn btn-outline-primary type-btn" for="type-materiel" :class="{ 'active': form.typeRes === 'Materiel' }">
                <i class="bi bi-tools me-1"></i> Location de Matériel
              </label>
            </div>
          </div>

          <div v-if="form.typeRes">
            <!-- Sélection Ressource et Client -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="row align-items-center">
                  <label for="catalogueId" class="col-md-4 col-form-label fw-bold field-label">
                    {{ form.typeRes === 'Salle' ? 'Salle' : 'Matériel' }} <span class="text-danger">*</span>
                  </label>
                  <div class="col-md-8">
                    <n-select
                      v-model:value="form.idCatalogue"
                      :options="filteredCatalogueOptions"
                      :loading="loading.catalogue"
                      placeholder="Veuillez choisir une ressource"
                      filterable
                      class="custom-select"
                    />
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="row align-items-center">
                  <label for="clientId" class="col-md-4 col-form-label fw-bold field-label">
                    Client <span class="text-danger">*</span>
                  </label>
                  <div class="col-md-8">
                    <n-select
                      v-model:value="form.idCli"
                      :options="clientOptions"
                      :loading="loading.clients"
                      placeholder="Sélectionner le client"
                      filterable
                      class="custom-select"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Quantité ou Nombre de personnes -->
            <div class="row mb-4">
              <div class="col-md-6" v-if="form.typeRes === 'Materiel'">
                <div class="row align-items-center">
                  <label for="qteMat" class="col-md-4 col-form-label fw-bold field-label">
                    Quantité <span class="text-danger">*</span>
                  </label>
                  <div class="col-md-8">
                    <n-input-number
                      v-model:value="form.qteMat"
                      :min="1"
                      :max="100"
                      class="w-100 custom-input"
                      placeholder="Quantité"
                    />
                  </div>
                </div>
              </div>
              
              <div class="col-md-6" v-if="form.typeRes === 'Salle'">
                <div class="row align-items-center">
                  <label for="nbPerso" class="col-md-4 col-form-label fw-bold field-label">
                    Nb. Personnes <span class="text-danger">*</span>
                  </label>
                  <div class="col-md-8">
                    <n-input-number
                      v-model:value="form.nbPerso"
                      :min="1"
                      :max="1000"
                      class="w-100 custom-input"
                      placeholder="Nombre de personnes"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Durée de location -->
            <div class="mb-4">
              <label class="form-label fw-bold section-title">Durée de la Location/Réservation <span class="text-danger">*</span></label>
              <div class="row g-2">
                <div class="col-6 col-md-3">
                  <input type="radio" class="btn-check" id="duree-heure" value="heure" v-model="form.typeDuree" required>
                  <label class="btn btn-outline-secondary w-100 duration-btn" for="duree-heure" :class="{ 'active': form.typeDuree === 'heure' }">
                    Par Heure
                  </label>
                </div>
                <div class="col-6 col-md-3">
                  <input type="radio" class="btn-check" id="duree-demijournee" value="demi-journee" v-model="form.typeDuree" required>
                  <label class="btn btn-outline-secondary w-100 duration-btn" for="duree-demijournee" :class="{ 'active': form.typeDuree === 'demi-journee' }">
                    Demi-Journée
                  </label>
                </div>
                <div class="col-6 col-md-3">
                  <input type="radio" class="btn-check" id="duree-journee" value="Jour" v-model="form.typeDuree" required>
                  <label class="btn btn-outline-secondary w-100 duration-btn" for="duree-journee" :class="{ 'active': form.typeDuree === 'Jour' }">
                    Journée Complète
                  </label>
                </div>
                <div class="col-6 col-md-3">
                  <input type="radio" class="btn-check" id="duree-parjour" value="plus-jours" v-model="form.typeDuree" required>
                  <label class="btn btn-outline-secondary w-100 duration-btn" for="duree-parjour" :class="{ 'active': form.typeDuree === 'plus-jours' }">
                    Plusieurs Jours
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Dates de début et fin -->
            <div class="row mb-4">
              <div class="col-md-6">
                <div class="row align-items-center">
                  <label for="debRes" class="col-md-4 col-form-label fw-bold field-label">
                    Début <span class="text-danger">*</span>
                  </label>
                  <div class="col-md-8">
                    <n-date-picker
                      v-model:value="form.debRes"
                      type="datetime"
                      class="w-100 custom-datepicker"
                      :is-date-disabled="disablePreviousDate"
                      placeholder="Sélectionner la date de début"
                    />
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="row align-items-center">
                  <label for="finRes" class="col-md-4 col-form-label fw-bold field-label">
                    Fin/Retour <span class="text-danger">*</span>
                  </label>
                  <div class="col-md-8">
                    <n-date-picker
                      v-model:value="form.finRes"
                      type="datetime"
                      class="w-100 custom-datepicker"
                      :is-date-disabled="disablePreviousDate"
                      :disabled="!form.debRes"
                      placeholder="Sélectionner la date de fin"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tarif total -->
            <div class="mb-4 p-4 border rounded text-center bg-light tarif-section">
              <h5 class="mb-2 text-dark section-title">Tarif Total Estimé</h5>
              <div class="cedii-text-primary fs-1 fw-bold tarif-amount">
                {{ formattedTarif }}
              </div>
              <small class="text-muted" v-if="selectedResource">
                Basé sur {{ selectedResource.nom }} - {{ form.typeDuree }}
              </small>
            </div>

            <!-- État de la demande -->
            <div class="mb-4">
              <label class="form-label fw-bold section-title">État de la Demande</label>
              <n-input-group>
                <n-input
                  :value="form.etatRes"
                  disabled
                  class="w-100 custom-input"
                />
                <n-button type="info" ghost disabled>
                  <template #icon>
                    <n-icon><i class="bi bi-info-circle"></i></n-icon>
                  </template>
                </n-button>
              </n-input-group>
              <small class="form-text text-muted info-text">
                La demande sera créée en état <strong>"{{ form.etatRes }}"</strong> (En attente de validation)
              </small>
            </div>
            
            <!-- Bouton de soumission -->
            <div class="d-grid gap-2">
              <n-button
                type="primary"
                size="large"
                :loading="isSubmitting"
                :disabled="!isFormValid"
                attr-type="submit"
                class="w-100 submit-btn cedii-btn-primary"
              >
                <template #icon>
                  <n-icon>
                    <i :class="isSubmitting ? 'spinner-border spinner-border-sm' : 'bi bi-check-circle-fill'"></i>
                  </n-icon>
                </template>
                {{ isSubmitting ? 'Envoi en cours...' : 'Enregistrer la Réservation/Location' }}
              </n-button>
            </div>
          </div>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  NButton,
  NIcon,
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NInputNumber,
  NDatePicker,
  NInput,
  NInputGroup,
  NAlert
} from 'naive-ui';
import LocationService from '../services/LocationService';

const router = useRouter();

// ------------------------------------
// ÉTATS LOCAUX
// ------------------------------------
const isSubmitting = ref(false);
const message = ref('');
const isSuccess = ref(false);
const loading = reactive({
  catalogue: true,
  clients: true
});

const catalogueData = ref([]);
const clients = ref([]);

const initialFormState = {
  typeRes: 'Salle',
  idCli: null,
  idCatalogue: null,
  dateCre: new Date().getTime(),
  qteMat: 1,
  typeDuree: 'Jour',
  nbPerso: 1,
  debRes: null,
  finRes: null,
  tarifTot: 0,
  etatRes: 'En attente',
};

const form = reactive({ ...initialFormState });

// ------------------------------------
// RÈGLES DE VALIDATION
// ------------------------------------
const rules = {
  typeRes: { required: true, message: 'Veuillez sélectionner le type de demande', trigger: 'change' },
  idCatalogue: { required: true, message: 'Veuillez sélectionner une ressource', trigger: 'change' },
  idCli: { required: true, message: 'Veuillez sélectionner un client', trigger: 'change' },
  qteMat: { 
    required: true, 
    type: 'number', 
    min: 1, 
    message: 'La quantité doit être au moins 1', 
    trigger: 'blur' 
  },
  nbPerso: { 
    required: true, 
    type: 'number', 
    min: 1, 
    message: 'Le nombre de personnes doit être au moins 1', 
    trigger: 'blur' 
  },
  typeDuree: { required: true, message: 'Veuillez sélectionner la durée', trigger: 'change' },
  debRes: { required: true, message: 'Veuillez sélectionner la date de début', trigger: 'change' },
  finRes: { 
    required: true, 
    validator: (rule, value) => {
      if (!value) return new Error('Veuillez sélectionner la date de fin');
      if (form.debRes && value <= form.debRes) {
        return new Error('La date de fin doit être après la date de début');
      }
      return true;
    },
    trigger: 'change' 
  }
};

// ------------------------------------
// PROPRIÉTÉS CALCULÉES
// ------------------------------------
const filteredCatalogueOptions = computed(() => {
  return catalogueData.value
    .filter(item => item.type === form.typeRes)
    .map(item => ({
      label: `${item.nom} (Tarif Jour: ${item.tarifJour ? item.tarifJour.toFixed(2) : 'N/A'} MGA)`,
      value: item.id
    }));
});

const clientOptions = computed(() => {
  return clients.value.map(client => ({
    label: `${client.nomCli} ${client.prenomCli} (ID: ${client.idCli})`,
    value: client.idCli
  }));
});

const selectedResource = computed(() => {
  return catalogueData.value.find(item => item.id === form.idCatalogue);
});

const formattedTarif = computed(() => {
  let tarif = 0;
  const resource = selectedResource.value;
  
  if (resource && form.typeDuree) {
    let baseTarif = 0;

    if (form.typeDuree === 'heure') {
      baseTarif = resource.tarifHeure || 0;
    } else if (form.typeDuree === 'demi-journee') {
      baseTarif = resource.tarifDemiJournee || 0;
    } else if (form.typeDuree === 'Jour' || form.typeDuree === 'plus-jours') {
      baseTarif = resource.tarifJour || 0;
      
      if (form.typeDuree === 'plus-jours' && form.debRes && form.finRes) {
        const start = new Date(form.debRes);
        const end = new Date(form.finRes);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
          baseTarif = (resource.tarifJour || 0) * diffDays;
        }
      }
    }
    
    if (form.typeRes === 'Materiel') {
      tarif = baseTarif * (form.qteMat || 1);
    } else {
      tarif = baseTarif;
    }
  }

  form.tarifTot = parseFloat(tarif.toFixed(2));
  return form.tarifTot.toFixed(2) + ' MGA';
});

const isFormValid = computed(() => {
  return form.typeRes && form.idCatalogue && form.idCli && form.debRes && form.finRes;
});

// ------------------------------------
// MÉTHODES
// ------------------------------------
const disablePreviousDate = (timestamp) => {
  return timestamp < Date.now() - 24 * 60 * 60 * 1000;
};

const fetchInitialData = async () => {
  loading.catalogue = true;
  loading.clients = true;
  try {
    // Récupération des clients
    const clientData = await LocationService.getClients();
    clients.value = clientData.map(c => ({ 
      idCli: c.idCli, 
      nomCli: c.nomCli, 
      prenomCli: c.prenomCli 
    }));

    // Récupération des salles et matériels
    const [sallesData, materielsData] = await Promise.all([
      LocationService.getSalles(),
      LocationService.getMateriels()
    ]);

    const mappedSalles = sallesData.map(s => ({
      id: s.idSalle,
      nom: s.nomSalle,
      type: 'Salle',
      tarifHeure: parseFloat(s.tarifHeure) || 0,
      tarifDemiJournee: parseFloat(s.tarifDemiJournee) || 0,
      tarifJour: parseFloat(s.tarifJour) || 0,
    }));
    
    const mappedMateriels = materielsData.map(m => ({
      id: m.codeMat,
      nom: m.designationMat,
      type: 'Materiel',
      tarifHeure: parseFloat(m.tarifHeure) || 0,
      tarifDemiJournee: parseFloat(m.tarifDemiJournee) || 0,
      tarifJour: parseFloat(m.tarifJour) || 0,
    }));
    
    catalogueData.value = [...mappedSalles, ...mappedMateriels];
    
  } catch (error) {
    console.error("Erreur de chargement des données initiales:", error);
    message.value = `❌ Erreur de connexion : ${error.message || 'Impossible de charger les données initiales.'}`;
    isSuccess.value = false;
  } finally {
    loading.catalogue = false;
    loading.clients = false;
  }
};

const submitForm = async () => {
  isSubmitting.value = true;
  message.value = '';
  isSuccess.value = false;
  
  if (form.debRes && form.finRes && form.debRes >= form.finRes) {
    message.value = "La date de fin doit être strictement postérieure à la date de début.";
    isSuccess.value = false;
    isSubmitting.value = false;
    return;
  }
  
  const payload = {
    idCli: form.idCli,
    typeRes: form.typeRes,
    debRes: new Date(form.debRes).toISOString(),
    finRes: new Date(form.finRes).toISOString(),
    tarifTot: form.tarifTot,
    etatRes: form.etatRes,
    dateCre: new Date().toISOString().split('T')[0],
    qteMat: form.typeRes === 'Materiel' ? form.qteMat : 0,
    nbPerso: form.typeRes === 'Salle' ? form.nbPerso : 0
  };

  // Ajouter idSalle ou codeMat selon le type
  if (form.typeRes === 'Salle') {
    payload.idSalle = form.idCatalogue;
  } else if (form.typeRes === 'Materiel') {
    payload.codeMat = form.idCatalogue;
  }

  console.log("Données envoyées:", payload);
  
  try {
    const response = await LocationService.createReservation(payload);
    const resId = response.id || response.reservation?.idRes || Math.floor(Math.random() * 1000);
    
    // 🎯 SUCCÈS : Message de confirmation amélioré
    message.value = `✅ Réservation #${resId} créée avec succès ! Redirection dans 3 secondes...`;
    isSuccess.value = true;
    
    // 🎯 RÉINITIALISATION du formulaire après succès
    setTimeout(() => {
      resetForm();
    }, 1000);
    
    // 🎯 REDIRECTION vers la section demandes en attente après 3 secondes
    setTimeout(() => {
      router.push('/demandeAttente');
    }, 3000);
    
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    
    // 🎯 MESSAGE D'ERREUR DÉTAILLÉ
    if (error.response) {
      message.value = `❌ Erreur ${error.response.status}: ${error.response.data?.message || 'Données invalides'}`;
    } else if (error.request) {
      message.value = "❌ Erreur réseau : Impossible de contacter le serveur";
    } else {
      message.value = `❌ Erreur : ${error.message}`;
    }
    isSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

// 🎯 FONCTION DE RÉINITIALISATION DU FORMULAIRE
const resetForm = () => {
  Object.assign(form, {
    typeRes: 'Salle',
    idCli: null,
    idCatalogue: null,
    dateCre: new Date().getTime(),
    qteMat: 1,
    typeDuree: 'Jour',
    nbPerso: 1,
    debRes: null,
    finRes: null,
    tarifTot: 0,
    etatRes: 'En attente',
  });
};

// Watchers
watch(() => form.typeRes, () => {
  form.idCatalogue = null;
  form.nbPerso = 1;
  form.qteMat = 1;
});

onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped>
.reservation-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header amélioré */
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

/* Conteneur avec scroll */
.content-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-top: 16px;
}

/* Style de la barre de défilement */
.content-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.content-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-scroll-container::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.content-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.reservation-form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

/* Styles de texte améliorés */
.section-title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
  display: block;
}

.field-label {
  font-size: 0.95rem;
  color: #495057;
  font-weight: 600;
}

.info-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 6px;
  display: block;
}

/* Boutons type */
.type-btn {
  padding: 12px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.type-btn:hover {
  transform: translateY(-1px);
}

/* Boutons durée */
.duration-btn {
  padding: 10px 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.duration-btn:hover {
  transform: translateY(-1px);
}

/* Section tarif */
.tarif-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%) !important;
  border: 2px solid #007bff !important;
}

.tarif-amount {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

/* Composants Naive UI customisés */
:deep(.custom-select .n-base-selection) {
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s ease;
}

:deep(.custom-select .n-base-selection:hover) {
  border-color: #007bff;
}

:deep(.custom-input .n-input) {
  border-radius: 8px;
}

:deep(.custom-datepicker .n-input) {
  border-radius: 8px;
}

/* Boutons cohérents */
:deep(.n-button--primary-type) {
  background: #007bff !important;
  border-color: #007bff !important;
}

:deep(.n-button--primary-type:hover) {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
  font-weight: 500;
}

.btn-check:checked + .btn-outline-primary,
.btn-outline-primary.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-outline-secondary.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.submit-btn {
  height: 52px;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .reservation-page-container {
    padding: 12px;
    height: 100vh;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .field-label {
    margin-bottom: 8px;
  }
  
  .row.align-items-center {
    margin-bottom: 16px;
  }
  
  .content-scroll-container {
    padding-right: 4px;
  }
}

@media (max-width: 576px) {
  .type-btn, .duration-btn {
    font-size: 0.875rem;
    padding: 10px 8px;
  }
  
  .tarif-amount {
    font-size: 1.75rem !important;
  }
  
  .content-scroll-container {
    padding-right: 2px;
  }
}

/* Animation de défilement fluide */
.content-scroll-container {
  scroll-behavior: smooth;
}

/* Effet de focus pour les éléments interactifs */
.type-btn:focus,
.duration-btn:focus,
:deep(.custom-select .n-base-selection:focus),
:deep(.custom-input .n-input:focus),
:deep(.custom-datepicker .n-input:focus) {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  outline: none;
}
</style>