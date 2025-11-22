<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    
    <main class="main-content flex-grow-1 overflow-auto bg-white">
      <div class="container-fluid py-3">
        <!-- En-tête de page simplifié -->
        <n-card class="mb-3 border-0" content-style="padding: 0;">
          <div class="p-3">
            <n-h1 class="mb-1 fs-4" style="color: #02061E;">
              <i class="bi bi-calendar-plus me-2 cedii-text-primary"></i>Nouvelle Réservation
            </n-h1>
            <n-text class="text-muted small">Soumettez votre demande de réservation</n-text>
          </div>
        </n-card>

        <div class="row justify-content-center">
          <div class="col-lg-10">
            <n-card class="shadow-sm border-0">
              <form @submit.prevent="submitForm">
                <n-grid :cols="2" :x-gap="24" :y-gap="16">
                  <!-- Colonne gauche : Type de réservation -->
                  <n-gi>
                    <div class="type-section">
                      <n-h3 class="mb-3 fs-5" style="color: #02061E;">
                        <i class="bi bi-tags me-2 cedii-text-primary"></i>Type de Réservation
                      </n-h3>
                      
                      <n-radio-group v-model:value="form.typeRes" name="typeRes" size="medium">
                        <n-space vertical :size="12">
                          <n-radio value="Salle" class="type-option">
                            <n-card class="type-card p-3" :class="{ 'active': form.typeRes === 'Salle' }">
                              <div class="d-flex align-items-center">
                                <n-icon size="20" class="me-3" :color="form.typeRes === 'Salle' ? '#5811EE' : '#55555E'">
                                  <i class="bi bi-house-door-fill"></i>
                                </n-icon>
                                <div>
                                  <n-text strong style="color: #02061E;">Réservation de Salle</n-text>
                                  <n-text depth="3" class="d-block small">
                                    Salles de réunion, espaces événementiels
                                  </n-text>
                                </div>
                              </div>
                            </n-card>
                          </n-radio>
                          
                          <n-radio value="Materiel" class="type-option">
                            <n-card class="type-card p-3" :class="{ 'active': form.typeRes === 'Materiel' }">
                              <div class="d-flex align-items-center">
                                <n-icon size="20" class="me-3" :color="form.typeRes === 'Materiel' ? '#5811EE' : '#55555E'">
                                  <i class="bi bi-tools"></i>
                                </n-icon>
                                <div>
                                  <n-text strong style="color: #02061E;">Location de Matériel</n-text>
                                  <n-text depth="3" class="d-block small">
                                    Équipements audiovisuels, technique
                                  </n-text>
                                </div>
                              </div>
                            </n-card>
                          </n-radio>
                        </n-space>
                      </n-radio-group>
                    </div>
                  </n-gi>

                  <!-- Colonne droite : Détails de la réservation -->
                  <n-gi>
                    <div v-if="form.typeRes" class="details-section">
                      <n-h3 class="mb-3 fs-5" style="color: #02061E;">
                        <i class="bi bi-info-circle me-2 cedii-text-primary"></i>Détails
                      </n-h3>

                      <!-- Sélection de la ressource -->
                      <n-form-item label="Ressource" :required="true" class="mb-3">
                        <n-select
                          v-model:value="form.idCatalogue"
                          :placeholder="form.typeRes === 'Salle' ? 'Choisir une salle' : 'Choisir un matériel'"
                          :options="resourceOptions"
                          :loading="loading.catalogue"
                          clearable
                          filterable
                        />
                      </n-form-item>

                      <n-grid :cols="form.typeRes === 'Salle' ? 1 : 2" :x-gap="12" class="mb-3">
                        <!-- Quantité pour matériel -->
                        <n-gi v-if="form.typeRes === 'Materiel'">
                          <n-form-item 
                            label="Quantité" 
                            :required="true"
                            :feedback="qteMatFeedback"
                            :validation-status="qteMatValidationStatus"
                          >
                            <n-input-number
                              v-model:value="form.qteMat"
                              :min="1"
                              :max="selectedResource ? selectedResource.qteTotDispo : null"
                              placeholder="Quantité"
                              class="w-100"
                              @update:value="validateQuantities"
                            />
                          </n-form-item>
                        </n-gi>
                        
                        <!-- Nombre de personnes pour salle -->
                        <n-gi v-if="form.typeRes === 'Salle'">
                          <n-form-item 
                            label="Personnes" 
                            :required="true"
                            :feedback="nbPersoFeedback"
                            :validation-status="nbPersoValidationStatus"
                          >
                            <n-input-number
                              v-model:value="form.nbPerso"
                              :min="1"
                              :max="selectedResource ? selectedResource.capaciteSalle : null"
                              placeholder="Nombre"
                              class="w-100"
                              @update:value="validateQuantities"
                            />
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!-- Type de durée -->
                      <n-form-item label="Type de durée" :required="true" class="mb-3">
                        <n-radio-group v-model:value="form.typeDuree" name="typeDuree">
                          <n-grid :cols="2" :x-gap="8" :y-gap="8">
                            <n-gi>
                              <n-radio value="heure" class="duration-option">Par Heure</n-radio>
                            </n-gi>
                            <n-gi>
                              <n-radio value="demi-journee" class="duration-option">Demi-Journée</n-radio>
                            </n-gi>
                            <n-gi>
                              <n-radio value="Jour" class="duration-option">Journée</n-radio>
                            </n-gi>
                            <n-gi>
                              <n-radio value="plus-jours" class="duration-option">Plusieurs Jours</n-radio>
                            </n-gi>
                          </n-grid>
                        </n-radio-group>
                      </n-form-item>

                      <!-- Dates -->
                      <n-grid :cols="2" :x-gap="12" class="mb-3">
                        <n-gi>
                          <n-form-item label="Début" :required="true">
                            <n-date-picker
                              v-model:value="form.debRes"
                              type="datetime"
                              :is-date-disabled="disablePreviousDate"
                              class="w-100"
                              placeholder="Sélectionnez la date et heure de début"
                            />
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item label="Fin" :required="true">
                            <n-date-picker
                              v-model:value="form.finRes"
                              type="datetime"
                              :is-date-disabled="disablePreviousDate"
                              class="w-100"
                              placeholder="Sélectionnez la date et heure de fin"
                            />
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!-- Récapitulatif et tarif -->
                      <div v-if="form.typeRes && form.idCatalogue" class="summary-section">
                        <n-divider class="my-3" />
                        
                        <!-- Carte de tarif colorée -->
                        <n-card class="cedii-card-primary border-0 mb-3">
                          <div class="text-center p-2">
                            <n-text class="d-block text-muted mb-1 small">Tarif Total Estimé</n-text>
                            <n-h1 class="cedii-text-primary mb-1 fs-3">{{ formattedTarif }}</n-h1>
                            <n-text depth="3" class="small" style="color: #067186;">
                              {{ tarifDetails }}
                            </n-text>
                          </div>
                        </n-card>

                        <!-- Détails de la réservation -->
                        <n-descriptions label-placement="left" bordered size="small" class="summary-card">
                          <n-descriptions-item label="Type">
                            <n-tag :type="form.typeRes === 'Salle' ? 'info' : 'warning'" size="small">
                              {{ form.typeRes === 'Salle' ? 'Salle' : 'Matériel' }}
                            </n-tag>
                          </n-descriptions-item>
                          <n-descriptions-item label="Ressource">
                            <n-text strong style="color: #02061E;">{{ selectedResource?.nom || 'Non sélectionné' }}</n-text>
                          </n-descriptions-item>
                          <n-descriptions-item :label="form.typeRes === 'Salle' ? 'Personnes' : 'Quantité'">
                            <n-text 
                              strong 
                              :style="{ color: hasValidationErrors ? '#ff4d4f' : '#067186' }"
                            >
                              {{ form.typeRes === 'Salle' ? form.nbPerso : form.qteMat }}
                            </n-text>
                          </n-descriptions-item>
                          <n-descriptions-item label="Durée">
                            <n-tag :type="getDurationTagType(form.typeDuree)" size="small">
                              {{ durationLabel }}
                            </n-tag>
                          </n-descriptions-item>
                        </n-descriptions>
                      </div>
                    </div>

                    <!-- Message quand aucun type sélectionné -->
                    <div v-else class="empty-state text-center py-5">
                      <n-icon size="48" color="#55555E" class="mb-3">
                        <i class="bi bi-calendar-check"></i>
                      </n-icon>
                      <n-text depth="3" class="d-block">
                        Sélectionnez un type de réservation pour continuer
                      </n-text>
                    </div>
                  </n-gi>
                </n-grid>

                <!-- Bouton de soumission (pleine largeur en bas) -->
                <n-divider class="my-4" />
                <div class="d-grid">
                  <n-button 
                    type="primary" 
                    size="large" 
                    :disabled="!isFormValid || isSubmitting || hasValidationErrors" 
                    :loading="isSubmitting"
                    @click="submitForm"
                    class="cedii-btn-primary fw-bold"
                  >
                    <template #icon>
                      <i class="bi bi-check-circle-fill"></i>
                    </template>
                    {{ isSubmitting ? 'Enregistrement...' : 'Confirmer la Réservation' }}
                  </n-button>
                  
                  <!-- Message d'aide pour la validation -->
                  <div v-if="!isFormValid" class="text-center mt-2">
                    <n-text depth="3" class="small">
                      ⚠️ Remplissez tous les champs obligatoires pour activer le bouton
                    </n-text>
                  </div>
                </div>
              </form>
            </n-card>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'; 
import { useRoute, useRouter } from 'vue-router'; 
import { 
  NCard, 
  NH1, 
  NH3, 
  NText, 
  NButton, 
  NIcon, 
  NRadioGroup, 
  NRadio,
  NSelect,
  NFormItem,
  NInputNumber,
  NGrid,
  NGi,
  NDatePicker,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NSpace,
  NDivider,
  useMessage
} from 'naive-ui';
import ClientNavbar from '../components/clientNavbar.vue';
import LocationService from '../services/LocationService'; 
import axios from 'axios';

const message = useMessage(); 
const route = useRoute();
const router = useRouter();

const isSubmitting = ref(false);
const loading = reactive({
  catalogue: true
});

const catalogueData = ref([]);

const urlCategory = route.query.category;
const urlResourceId = route.query.resourceId; 

const initialTypeRes = urlCategory === 'Matériel' ? 'Materiel' : (urlCategory === 'Immobilier' ? 'Salle' : 'Salle');

const initialFormState = {
  typeRes: initialTypeRes, 
  idCatalogue: '', 
  qteMat: 1, 
  typeDuree: 'Jour', 
  nbPerso: 1, 
  debRes: null, 
  finRes: null,
  tarifTot: 0, 
};

const form = reactive({ ...initialFormState });

// VARIABLES DE VALIDATION
const validationErrors = reactive({
  qteMat: null,
  nbPerso: null
});

// FONCTION DE VALIDATION
const validateQuantities = () => {
  validationErrors.qteMat = null;
  validationErrors.nbPerso = null;

  const resource = selectedResource.value;
  if (!resource) return;

  console.log('🔍 Validation pour:', resource.nom, 'qteTotDispo:', resource.qteTotDispo, 'capaciteSalle:', resource.capaciteSalle);

  if (form.typeRes === 'Materiel') {
    if (resource.qteTotDispo === null || resource.qteTotDispo === undefined) {
      console.warn('⚠️ Quantité non disponible pour la validation');
      return;
    }
    
    const maxQte = resource.qteTotDispo;
    if (form.qteMat > maxQte) {
      validationErrors.qteMat = `Quantité indisponible. Maximum disponible : ${maxQte} unités`;
    } else if (form.qteMat < 1) {
      validationErrors.qteMat = 'La quantité doit être au moins 1';
    }
  } else if (form.typeRes === 'Salle') {
    if (resource.capaciteSalle === null || resource.capaciteSalle === undefined) {
      console.warn('⚠️ Capacité non disponible pour la validation');
      return;
    }
    
    const maxCapacite = resource.capaciteSalle;
    if (form.nbPerso > maxCapacite) {
      validationErrors.nbPerso = `Capacité dépassée. Maximum : ${maxCapacite} personnes`;
    } else if (form.nbPerso < 1) {
      validationErrors.nbPerso = 'Le nombre de personnes doit être au moins 1';
    }
  }
};

// COMPUTED PROPERTIES POUR LA VALIDATION
const qteMatValidationStatus = computed(() => {
  return validationErrors.qteMat ? 'error' : null;
});

const qteMatFeedback = computed(() => {
  return validationErrors.qteMat || '';
});

const nbPersoValidationStatus = computed(() => {
  return validationErrors.nbPerso ? 'error' : null;
});

const nbPersoFeedback = computed(() => {
  return validationErrors.nbPerso || '';
});

const hasValidationErrors = computed(() => {
  return validationErrors.qteMat !== null || validationErrors.nbPerso !== null;
});

// VALIDATION AVANT SOUMISSION
const validateBeforeSubmit = () => {
  validateQuantities();
  
  if (hasValidationErrors.value) {
    message.error('Veuillez corriger les erreurs de quantité avant de soumettre');
    return false;
  }
  
  return true;
};

const resetQuantities = (newType) => {
  if (newType === 'Materiel') {
    form.nbPerso = 0;
    if (form.qteMat < 1) form.qteMat = 1;
  } else {
    form.qteMat = 0;
    if (form.nbPerso < 1) form.nbPerso = 1;
  }
  validationErrors.qteMat = null;
  validationErrors.nbPerso = null;
};

// WATCHERS
watch(() => form.typeRes, (newType, oldType) => {
  if (newType !== oldType) {
    form.idCatalogue = ''; 
  }
  resetQuantities(newType);
});

watch(() => form.idCatalogue, (newId) => {
  console.log('🔄 Ressource changée:', newId);
  validateQuantities();
});

watch([() => form.qteMat, () => form.nbPerso], () => {
  validateQuantities();
});

// COMPUTED PROPERTIES 
const resourceOptions = computed(() => {
  return catalogueData.value
    .filter(item => item.type === form.typeRes)
    .map(item => ({
      label: `${item.nom} - ${item.tarifJour?.toFixed(2) || '0.00'} MGA/jour`,
      value: item.id,
      ...item
    }));
});

const selectedResource = computed(() => {
  const resource = catalogueData.value.find(item => item.id === form.idCatalogue);
  console.log('🎯 Ressource sélectionnée:', resource);
  return resource;
});

// COMPUTED PROPERTY POUR LE BOUTON
const isFormValid = computed(() => {
  const basicValid = form.typeRes && 
         form.idCatalogue && 
         form.debRes && 
         form.finRes && 
         new Date(form.debRes) < new Date(form.finRes);
  
  const quantitiesValid = form.typeRes === 'Materiel' ? 
    (form.qteMat > 0) : 
    (form.nbPerso > 0);
  
  return basicValid && quantitiesValid && !hasValidationErrors.value;
});

const formattedTarif = computed(() => {
  calculateTarif();
  return form.tarifTot.toFixed(2) + ' MGA';
});

const tarifDetails = computed(() => {
  if (!selectedResource.value) return '';
  
  const resource = selectedResource.value;
  let base = '';
  
  if (form.typeDuree === 'heure') {
    base = `${resource.tarifHeure?.toFixed(2) || '0.00'} MGA/heure`;
  } else if (form.typeDuree === 'demi-journee') {
    base = `${resource.tarifDemiJournee?.toFixed(2) || '0.00'} MGA/demi-journée`;
  } else {
    base = `${resource.tarifJour?.toFixed(2) || '0.00'} MGA/jour`;
  }
  
  if (form.typeRes === 'Materiel') {
    return `${base} × ${form.qteMat} unités`;
  }
  
  return base;
});

const durationLabel = computed(() => {
  const labels = {
    'heure': 'Par heure',
    'demi-journee': 'Demi-journée',
    'Jour': 'Journée complète',
    'plus-jours': 'Plusieurs jours'
  };
  return labels[form.typeDuree] || form.typeDuree;
});

// METHODS
const disablePreviousDate = (timestamp) => {
  return timestamp < Date.now() - 24 * 60 * 60 * 1000;
};

const getDurationTagType = (duration) => {
  const types = {
    'heure': 'success',
    'demi-journee': 'info',
    'Jour': 'warning',
    'plus-jours': 'error'
  };
  return types[duration] || 'default';
};

const calculateTarif = () => {
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
      
      if (form.debRes && form.finRes) {
        const start = new Date(form.debRes);
        const end = new Date(form.finRes);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        baseTarif *= Math.max(1, diffDays);
      }
    }
    
    if (form.typeRes === 'Materiel') {
      tarif = baseTarif * (form.qteMat || 1);
    } else {
      tarif = baseTarif;
    }
  }

  form.tarifTot = parseFloat(tarif.toFixed(2));
};

// FONCTION DE CHARGEMENT DES DONNÉES
const fetchInitialData = async () => {
  loading.catalogue = true;
  try {
    const sallesResponse = await LocationService.getSalles();
    const materielsResponse = await LocationService.getMateriels();

    console.log('=== 🏢 DONNÉES SALLES BRUTES ===', sallesResponse);
    console.log('=== 🛠️ DONNÉES MATÉRIELS BRUTES ===', materielsResponse);

    // MAPPING CORRECT - UTILISER LES PROPRIÉTÉS EXACTES DE LA BD
    const mappedSalles = sallesResponse.map(s => {
      return {
        id: String(s.idSalle),
        nom: s.nomSalle,
        type: 'Salle',
        tarifHeure: parseFloat(s.tarifHeure) || 0,
        tarifDemiJournee: parseFloat(s.tarifDemiJournee) || 0,
        tarifJour: parseFloat(s.tarifJour) || 0,
        capaciteSalle: parseInt(s.capaciteSalle) || 0,
        numeroSalle: s.numeroSalle,
        disponibiliteSalle: s.disponibiliteSalle
      };
    });
    
    const mappedMateriels = materielsResponse.map(m => {
      return {
        id: String(m.codeMat),
        nom: m.designationMat,
        type: 'Materiel',
        tarifHeure: parseFloat(m.tarifHeure) || 0,
        tarifDemiJournee: parseFloat(m.tarifDemiJournee) || 0,
        tarifJour: parseFloat(m.tarifJour) || 0,
        qteTotDispo: parseInt(m.qteTotDispo) || 0,
        qteActuelStock: parseInt(m.qteActuelStock) || 0,
        qteEnLocation: parseInt(m.qteEnLocation) || 0,
        categorieMat: m.categorieMat,
        etatMat: m.etatMat
      };
    });
    
    catalogueData.value = [...mappedSalles, ...mappedMateriels];
    
    console.log('=== 📊 DONNÉES MAPPÉES FINALES ===');
    catalogueData.value.forEach(item => {
      if (item.type === 'Salle') {
        console.log(`🏢 ${item.nom}: capaciteSalle = ${item.capaciteSalle}`);
      } else {
        console.log(`🛠️ ${item.nom}: qteTotDispo = ${item.qteTotDispo}`);
      }
    });

    // INITIALISATION PAR URL 
    if (urlResourceId && catalogueData.value.length > 0) {
      const resource = catalogueData.value.find(item => item.id === urlResourceId);

      if (resource) {
        form.typeRes = resource.type; 
        form.idCatalogue = resource.id;
        resetQuantities(resource.type); 
        console.log('🎯 Ressource initialisée depuis URL:', resource);
        
        setTimeout(() => {
          validateQuantities();
        }, 100);
      } else {
        message.warn(`Ressource (ID:${urlResourceId}) non trouvée. Veuillez la sélectionner.`);
      }
    }

  } catch (error) {
    console.error("Erreur de chargement des données:", error);
    message.error("Erreur lors du chargement des ressources.");
  } finally {
    loading.catalogue = false;
  }
};

// MÉTHODE DE SOUMISSION
const submitForm = async () => {
  if (!isFormValid.value) {
    message.error('Veuillez corriger les erreurs dans le formulaire');
    return;
  }
  
  if (!validateBeforeSubmit()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const token = localStorage.getItem('token');
    console.log('Token envoyé:', token);

    const response = await axios.post(
      'http://localhost:5000/api/locations/client/reservations',
      {
        idCatalogue: form.idCatalogue,
        typeRes: form.typeRes,
        typeDuree: form.typeDuree,
        debRes: form.debRes,
        finRes: form.finRes,
        qteMat: form.qteMat,
        nbPerso: form.nbPerso,
        tarifTot: form.tarifTot
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Réservation créée :', response.data);

    message.success('Réservation enregistrée avec succès !');
    router.push('/client/mes-reservations');

  } catch (error) {
    console.error('❌ Erreur réservation:', error);

    if (error.response?.status === 401) {
      message.error('Session expirée. Veuillez vous reconnecter.');
      router.push('/');
    } else {
      message.error('❌ Échec de l\'enregistrement');
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped>
/* Votre CSS reste inchangé */
.main-content {
  background-color: #ffffff;
}

.cedii-text-primary { 
  color: #5811EE !important; 
}

.cedii-btn-primary { 
  background-color: #5811EE !important;
  color: white !important;
  border-color: #5811EE !important;
}

.cedii-btn-primary:hover {
  background-color: #04058F !important;
  border-color: #04058F !important;
}

.cedii-card-primary {
  background: linear-gradient(135deg, #5811EE20, #04058F15);
  border: 1px solid #5811EE30 !important;
}

.type-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #e9ecef;
  height: 100%;
}

.type-card:hover {
  border-color: #5811EE60;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(88, 17, 238, 0.1);
}

.type-card.active {
  border-color: #5811EE;
  background: linear-gradient(135deg, #5811EE08, #04058F05);
  box-shadow: 0 2px 12px rgba(88, 17, 238, 0.15);
}

.duration-option {
  margin: 2px 0;
}

.summary-card {
  border-radius: 8px;
  overflow: hidden;
}

.empty-state {
  border: 2px dashed #e9ecef;
  border-radius: 10px;
  background-color: #f8f9fa;
}

.type-section, .details-section {
  height: 100%;
}

/* Styles pour les composants Naive UI */
:deep(.n-card) {
  border-radius: 10px;
}

:deep(.n-radio .n-radio__dot) {
  border-color: #5811EE;
}

:deep(.n-radio.n-radio--checked .n-radio__dot) {
  background-color: #5811EE;
  border-color: #5811EE;
}

:deep(.n-select .n-base-selection) {
  border-radius: 6px;
}

:deep(.n-button) {
  border-radius: 6px;
  font-weight: 600;
}

:deep(.n-form-item-label) {
  font-weight: 600;
  color: #02061E;
  font-size: 0.9rem;
}

:deep(.n-descriptions .n-descriptions-table) {
  border-radius: 6px;
}

/* Espacement plus serré */
:deep(.n-form-item) {
  margin-bottom: 12px;
}

:deep(.n-card .n-card-header) {
  padding: 12px 16px;
}

:deep(.n-card .n-card-content) {
  padding: 16px;
}

/* Responsive */
@media (max-width: 991.98px) {
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
  
  .type-section {
    margin-bottom: 20px;
  }
}
</style>