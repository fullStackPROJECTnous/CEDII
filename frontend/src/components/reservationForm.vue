
<!--<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    
    <main class="main-content flex-grow-1 overflow-auto bg-light">
      <div class="container-fluid py-4">
         EN-TÊTE AMÉLIORÉE 
        <div class="page-header mb-4">
          <div class="header-container p-4 rounded-4 shadow-sm">
            <!-- Première ligne : Titre principal et statut 
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon-container">
                  <i class="bi bi-calendar-plus-fill header-icon"></i>
                </div>
                <div>
                  <h1 class="header-title mb-0">Nouvelle Réservation</h1>
                  <p class="header-subtitle mb-0 text-muted">Soumettez votre demande de location ou réservation</p>
                </div>
              </div>
              
              <n-tag type="info" size="large" class="custom-tag">
                <template #icon>
                  <n-icon>
                    <i class="bi bi-clock"></i>
                  </n-icon>
                </template>
                Étape 1 sur 2
              </n-tag>
            </div>
            
            <!-- Deuxième ligne : Guide de progression 
            <div class="header-info-row">
              <div class="row g-4">
                <!-- Étape 1
                <div class="col-md-6">
                  <div class="info-card p-3 rounded-3 active-step">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="step-number active">1</div>
                      <div>
                        <span class="info-label">Étape actuelle</span>
                        <div class="info-value fw-bold text-dark">Formulaire de réservation</div>
                      </div>
                    </div>
                    <n-progress
                      type="line"
                      :percentage="formCompletion"
                      :height="4"
                      :border-radius="0"
                      :show-indicator="false"
                      status="success"
                      class="mt-2"
                    />
                  </div>
                </div>
                
                <!-- Étape 2 
                <div class="col-md-6">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="step-number">2</div>
                      <div>
                        <span class="info-label">Prochaine étape</span>
                        <div class="info-value fw-bold text-dark">Confirmation et validation</div>
                      </div>
                    </div>
                    <n-text depth="3" class="small d-block mt-2">
                      Votre demande sera traitée sous 24-48h
                    </n-text>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Troisième ligne : Actions rapides 
            <div class="header-actions mt-4 pt-3 border-top">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-lightbulb text-warning"></i>
                  <n-text class="small text-muted">
                    Conseil : Remplissez tous les champs obligatoires (<span class="text-danger">*</span>) avant de soumettre
                  </n-text>
                </div>
                
                <div class="d-flex gap-3">
                  <n-button 
                    type="default" 
                    size="small" 
                    class="action-btn"
                    @click="router.go(-1)"
                  >
                    <template #icon>
                      <i class="bi bi-arrow-left"></i>
                    </template>
                    Retour
                  </n-button>
                  <n-button 
                    type="info" 
                    size="small" 
                    class="action-btn"
                    @click="scrollToSection('summary')"
                    :disabled="!form.typeRes"
                  >
                    <template #icon>
                      <i class="bi bi-eye"></i>
                    </template>
                    Voir récapitulatif
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENU PRINCIPAL 
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <n-card class="shadow-sm border-0" content-style="padding: 0;">
              <div class="card-header p-4 border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <div class="step-indicator active">
                    <i class="bi bi-pencil-fill"></i>
                  </div>
                  <div>
                    <n-h3 class="mb-1 fs-5" style="color: #02061E;">
                      <i class="bi bi-card-checklist me-2 cedii-text-primary"></i>
                      Remplissez le formulaire de réservation
                    </n-h3>
                    <n-text class="text-muted small">
                      Tous les champs marqués d'un <span class="text-danger">*</span> sont obligatoires
                    </n-text>
                  </div>
                </div>
              </div>

              <form @submit.prevent="submitForm" class="p-4">
                <n-grid :cols="2" :x-gap="24" :y-gap="20">
                  <!-- Colonne gauche : Type de réservation 
                  <n-gi>
                    <div class="type-section">
                      <div class="section-header mb-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <div class="section-icon">
                            <i class="bi bi-tags-fill"></i>
                          </div>
                          <n-h4 class="mb-0 fs-5" style="color: #02061E;">Type de Réservation</n-h4>
                        </div>
                        <n-text depth="3" class="small">
                          Sélectionnez le type de service dont vous avez besoin
                        </n-text>
                      </div>
                      
                      <n-radio-group v-model:value="form.typeRes" name="typeRes" size="medium">
                        <n-space vertical :size="16">
                          <n-radio value="Salle" class="type-option">
                            <n-card class="type-card p-4" :class="{ 'active': form.typeRes === 'Salle' }">
                              <div class="d-flex align-items-start">
                                <div class="type-icon me-3">
                                  <i class="bi bi-house-door-fill" :class="{ 'active-icon': form.typeRes === 'Salle' }"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="d-flex justify-content-between align-items-start mb-2">
                                    <n-text strong style="color: #02061E; font-size: 1rem;">
                                      Réservation de Salle
                                    </n-text>
                                    <n-tag v-if="form.typeRes === 'Salle'" type="success" size="small" round>
                                      <template #icon>
                                        <i class="bi bi-check"></i>
                                      </template>
                                      Sélectionné
                                    </n-tag>
                                  </div>
                                  <n-text depth="3" class="d-block small mb-2">
                                    Salles de réunion, espaces événementiels, amphithéâtres
                                  </n-text>
                                  <div class="d-flex gap-3 mt-2">
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-people me-1"></i>
                                      Capacité adaptée
                                    </n-text>
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-wifi me-1"></i>
                                      Équipement inclus
                                    </n-text>
                                  </div>
                                </div>
                              </div>
                            </n-card>
                          </n-radio>
                          
                          <n-radio value="Materiel" class="type-option">
                            <n-card class="type-card p-4" :class="{ 'active': form.typeRes === 'Materiel' }">
                              <div class="d-flex align-items-start">
                                <div class="type-icon me-3">
                                  <i class="bi bi-tools" :class="{ 'active-icon': form.typeRes === 'Materiel' }"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="d-flex justify-content-between align-items-start mb-2">
                                    <n-text strong style="color: #02061E; font-size: 1rem;">
                                      Location de Matériel
                                    </n-text>
                                    <n-tag v-if="form.typeRes === 'Materiel'" type="success" size="small" round>
                                      <template #icon>
                                        <i class="bi bi-check"></i>
                                      </template>
                                      Sélectionné
                                    </n-tag>
                                  </div>
                                  <n-text depth="3" class="d-block small mb-2">
                                    Équipements audiovisuels, matériel technique, mobilier
                                  </n-text>
                                  <div class="d-flex gap-3 mt-2">
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-box-seam me-1"></i>
                                      Livraison possible
                                    </n-text>
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-gear me-1"></i>
                                      Installation incluse
                                    </n-text>
                                  </div>
                                </div>
                              </div>
                            </n-card>
                          </n-radio>
                        </n-space>
                      </n-radio-group>
                    </div>
                  </n-gi>

                  <!-- Colonne droite : Détails de la réservation 
                  <n-gi>
                    <div v-if="form.typeRes" class="details-section">
                      <div class="section-header mb-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <div class="section-icon">
                            <i class="bi bi-gear-fill"></i>
                          </div>
                          <n-h4 class="mb-0 fs-5" style="color: #02061E;">
                            Détails de la Réservation
                          </n-h4>
                        </div>
                        <n-text depth="3" class="small">
                          Configurez les spécificités de votre demande
                        </n-text>
                      </div>

                      <!-- Sélection de la ressource 
                      <n-form-item label="Ressource" :required="true" class="mb-4">
                        <n-select
                          v-model:value="form.idCatalogue"
                          :placeholder="form.typeRes === 'Salle' ? 'Choisir une salle disponible...' : 'Choisir un matériel disponible...'"
                          :options="resourceOptions"
                          :loading="loading.catalogue"
                          clearable
                          filterable
                          class="resource-select"
                        >
                          <template #arrow>
                            <i class="bi bi-chevron-down"></i>
                          </template>
                        </n-select>
                        <template #feedback>
                          <div v-if="selectedResource" class="d-flex align-items-center gap-2 mt-1">
                            <n-tag size="tiny" type="info">
                              <template #icon>
                                <i class="bi bi-info-circle"></i>
                              </template>
                              {{ form.typeRes === 'Salle' ? 'Capacité' : 'Disponibilité' }} : 
                              {{ form.typeRes === 'Salle' ? selectedResource.capaciteSalle + ' personnes' : selectedResource.qteTotDispo + ' unités' }}
                            </n-tag>
                            <n-text depth="3" class="small">
                              Tarif journalier : {{ selectedResource.tarifJour?.toFixed(2) || '0.00' }} MGA
                            </n-text>
                          </div>
                        </template>
                      </n-form-item>

                      <!-- Quantité ou Personnes 
                      <n-grid :cols="form.typeRes === 'Salle' ? 1 : 2" :x-gap="16" class="mb-4">
                        <n-gi v-if="form.typeRes === 'Materiel'">
                          <n-form-item 
                            label="Quantité nécessaire" 
                            :required="true"
                            :feedback="qteMatFeedback"
                            :validation-status="qteMatValidationStatus"
                          >
                            <n-input-number
                              v-model:value="form.qteMat"
                              :min="1"
                              :max="selectedResource ? selectedResource.qteTotDispo : null"
                              placeholder="Ex: 2"
                              class="w-100 quantity-input"
                              @update:value="validateQuantities"
                            >
                              <template #suffix>
                                unité(s)
                              </template>
                            </n-input-number>
                          </n-form-item>
                        </n-gi>
                        
                        <n-gi v-if="form.typeRes === 'Salle'">
                          <n-form-item 
                            label="Nombre de personnes" 
                            :required="true"
                            :feedback="nbPersoFeedback"
                            :validation-status="nbPersoValidationStatus"
                          >
                            <n-input-number
                              v-model:value="form.nbPerso"
                              :min="1"
                              :max="selectedResource ? selectedResource.capaciteSalle : null"
                              placeholder="Ex: 10"
                              class="w-100 quantity-input"
                              @update:value="validateQuantities"
                            >
                              <template #suffix>
                                personne(s)
                              </template>
                            </n-input-number>
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!-- Type de durée 
                      <n-form-item label="Durée de location" :required="true" class="mb-4">
                        <div class="duration-grid">
                          <n-radio-group v-model:value="form.typeDuree" name="typeDuree" size="medium">
                            <n-grid :cols="2" :x-gap="12" :y-gap="12">
                              <n-gi>
                                <n-radio value="heure" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-clock-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Par Heure</div>
                                      <div class="duration-sub">Flexibilité maximale</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                              <n-gi>
                                <n-radio value="demi-journee" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-sun-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Demi-Journée</div>
                                      <div class="duration-sub">4 heures</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                              <n-gi>
                                <n-radio value="Jour" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-calendar-day-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Journée Complète</div>
                                      <div class="duration-sub">8 heures</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                              <n-gi>
                                <n-radio value="plus-jours" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-calendar-week-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Plusieurs Jours</div>
                                      <div class="duration-sub">Sur mesure</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                            </n-grid>
                          </n-radio-group>
                        </div>
                      </n-form-item>

                      <!-- Dates 
                      <n-grid :cols="2" :x-gap="16" class="mb-4">
                        <n-gi>
                          <n-form-item label="Date et heure de début" :required="true">
                            <n-date-picker
                              v-model:value="form.debRes"
                              type="datetime"
                              :is-date-disabled="disablePreviousDate"
                              class="w-100 date-picker"
                              placeholder="Sélectionnez..."
                              :clearable="false"
                            />
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item label="Date et heure de fin" :required="true">
                            <n-date-picker
                              v-model:value="form.finRes"
                              type="datetime"
                              :is-date-disabled="disablePreviousDate"
                              class="w-100 date-picker"
                              placeholder="Sélectionnez..."
                              :clearable="false"
                              :disabled="!form.debRes"
                            />
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!-- Récapitulatif et tarif 
                      <div v-if="form.typeRes && form.idCatalogue" class="summary-section" id="summary">
                        <div class="summary-header mb-3">
                          <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-receipt cedii-text-primary"></i>
                            <n-h4 class="mb-0 fs-5" style="color: #02061E;">Récapitulatif et Tarif</n-h4>
                          </div>
                        </div>
                        
                        <!-- Carte de tarif 
                        <n-card class="tarif-card border-0 mb-4">
                          <div class="text-center p-3">
                            <n-text class="d-block text-muted mb-2 small">ESTIMATION DU TARIF TOTAL</n-text>
                            <n-h1 class="cedii-text-primary mb-2 display-6 fw-bold">{{ formattedTarif }}</n-h1>
                            <n-text depth="3" class="small" style="color: #067186;">
                              <i class="bi bi-info-circle me-1"></i>
                              {{ tarifDetails }}
                            </n-text>
                          </div>
                        </n-card>

                        <!-- Détails de la réservation 
                        <n-card class="border-0 details-card">
                          <n-descriptions label-placement="left" bordered size="small" class="w-100">
                            <n-descriptions-item label="Type de réservation">
                              <div class="d-flex align-items-center gap-2">
                                <n-tag :type="form.typeRes === 'Salle' ? 'info' : 'warning'" size="small" round>
                                  <template #icon>
                                    <i :class="form.typeRes === 'Salle' ? 'bi bi-house-door' : 'bi bi-tools'"></i>
                                  </template>
                                  {{ form.typeRes === 'Salle' ? 'Salle' : 'Matériel' }}
                                </n-tag>
                              </div>
                            </n-descriptions-item>
                            <n-descriptions-item label="Ressource">
                              <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-success"></i>
                                <n-text strong style="color: #02061E;">
                                  {{ selectedResource?.nom || 'Non sélectionné' }}
                                </n-text>
                              </div>
                            </n-descriptions-item>
                            <n-descriptions-item :label="form.typeRes === 'Salle' ? 'Nombre de personnes' : 'Quantité'">
                              <div class="d-flex align-items-center gap-2">
                                <i :class="hasValidationErrors ? 'bi bi-exclamation-triangle text-warning' : 'bi bi-check-circle text-success'"></i>
                                <n-text 
                                  strong 
                                  :style="{ color: hasValidationErrors ? '#ff4d4f' : '#067186' }"
                                >
                                  {{ form.typeRes === 'Salle' ? form.nbPerso : form.qteMat }}
                                  {{ form.typeRes === 'Salle' ? 'personne(s)' : 'unité(s)' }}
                                </n-text>
                              </div>
                            </n-descriptions-item>
                            <n-descriptions-item label="Période de location">
                              <div class="d-flex align-items-center gap-2">
                                <n-tag :type="getDurationTagType(form.typeDuree)" size="small" round>
                                  <i class="bi bi-calendar-event me-1"></i>
                                  {{ durationLabel }}
                                </n-tag>
                              </div>
                            </n-descriptions-item>
                          </n-descriptions>
                        </n-card>
                      </div>
                    </div>

                    <!-- Message quand aucun type sélectionné 
                    <div v-else class="empty-state text-center py-5">
                      <div class="empty-icon mb-3">
                        <i class="bi bi-calendar-check"></i>
                      </div>
                      <n-h4 class="mb-2" style="color: #55555E;">
                        Sélectionnez un type de réservation
                      </n-h4>
                      <n-text depth="3" class="d-block mb-3">
                        Choisissez entre la réservation d'une salle ou la location de matériel pour continuer
                      </n-text>
                      <n-button type="primary" size="small" ghost>
                        <template #icon>
                          <i class="bi bi-arrow-right"></i>
                        </template>
                        Commencer
                      </n-button>
                    </div>
                  </n-gi>
                </n-grid>

                <!-- Bouton de soumission 
                <div class="submit-section mt-5 pt-4 border-top">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <div class="d-flex align-items-center gap-2">
                        <div class="completion-indicator">
                          <n-progress
                            type="circle"
                            :percentage="formCompletion"
                            :radius="20"
                            :stroke-width="4"
                            status="success"
                          />
                        </div>
                        <div>
                          <n-text class="d-block small fw-semibold" style="color: #02061E;">
                            Formulaire {{ formCompletion }}% complet
                          </n-text>
                          <n-text depth="3" class="small">
                            {{ isFormValid ? 'Prêt à soumettre' : 'Remplissez tous les champs' }}
                          </n-text>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="d-grid">
                        <n-button 
                          type="primary" 
                          size="large" 
                          :disabled="!isFormValid || isSubmitting || hasValidationErrors" 
                          :loading="isSubmitting"
                          @click="submitForm"
                          class="cedii-btn-primary fw-bold submit-btn"
                        >
                          <template #icon>
                            <i :class="isSubmitting ? 'bi bi-hourglass-split' : 'bi bi-check-circle-fill'"></i>
                          </template>
                          {{ isSubmitting ? 'Enregistrement en cours...' : 'Soumettre la Demande' }}
                        </n-button>
                        
                        <!-- Message d'aide pour la validation 
                        <div v-if="!isFormValid" class="text-center mt-2">
                          <n-text depth="3" class="small d-flex align-items-center justify-content-center gap-1">
                            <i class="bi bi-info-circle"></i>
                            Tous les champs obligatoires doivent être remplis pour soumettre
                          </n-text>
                        </div>
                      </div>
                    </div>
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
  NH4, 
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
  NProgress,
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
  catalogue: true,
  client: false
});

const catalogueData = ref([]);
const clientProfile = ref(null);

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

// NOUVEAU : Calcul du pourcentage de complétion du formulaire
const formCompletion = computed(() => {
  let totalFields = 6; // typeRes, idCatalogue, qteMat/nbPerso, typeDuree, debRes, finRes
  let completedFields = 0;
  
  if (form.typeRes) completedFields++;
  if (form.idCatalogue) completedFields++;
  if (form.typeRes === 'Materiel' ? form.qteMat > 0 : form.nbPerso > 0) completedFields++;
  if (form.typeDuree) completedFields++;
  if (form.debRes) completedFields++;
  if (form.finRes && new Date(form.debRes) < new Date(form.finRes)) completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
});

// Fonctions existantes (inchangées)
const fetchClientProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('❌ Aucun token trouvé');
      return null;
    }

    const response = await axios.get('http://localhost:5000/api/clients/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.data.idCli) {
      console.log('✅ Profil client récupéré via API:', response.data);
      return response.data;
    } else {
      console.warn('❌ Réponse API incomplète:', response.data);
    }
  } catch (error) {
    console.warn('⚠️ Impossible de récupérer le profil client via API:', error.response?.data?.message || error.message);
  }
  return null;
};

const transformApiData = (apiData) => {
  if (!apiData) return null;
  
  return {
    idCli: apiData.idCli || apiData.id,
    nomCli: apiData.nomCli || apiData.nom || '',
    prenomCli: apiData.prenomCli || apiData.prenom || '',
    emailCli: apiData.emailCli || apiData.email || '',
    telephoneCli: apiData.telephoneCli || apiData.telephone || '',
    addresseCli: apiData.addresseCli || apiData.adresse || '',
    
    typeClient: apiData.typeCli 
      ? (apiData.typeCli === 'entreprise' ? 'Entreprise' : 
         apiData.typeCli === 'particulier' ? 'Particulier' : 
         apiData.typeCli.charAt(0).toUpperCase() + apiData.typeCli.slice(1))
      : (apiData.typeClient || 'Particulier'),
    
    statutCompte: apiData.statutCli 
      ? (apiData.statutCli === 'actif' ? 'Actif' : 
         apiData.statutCli === 'inactif' ? 'Inactif' : 
         apiData.statutCli === 'suspendu' ? 'Suspendu' : 
         apiData.statutCli.charAt(0).toUpperCase() + apiData.statutCli.slice(1))
      : (apiData.statutCompte || 'Actif'),
    
    ...apiData
  };
};

const getClientData = async () => {
  console.log('🔄 Récupération des données client...');
  
  const apiProfile = await fetchClientProfile();
  if (apiProfile && apiProfile.idCli) {
    const transformedData = transformApiData(apiProfile);
    console.log('✅ Données client transformées depuis API:', transformedData);
    return transformedData;
  }

  const possibleKeys = ['clientInfo', 'userInfo', 'currentUser', 'clientProfile', 'user', 'client'];
  
  for (const key of possibleKeys) {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log(`📁 Données ${key} trouvées:`, data);
        
        const hasClientInfo = (data.idCli || data.id) && (data.nomCli || data.nom) && (data.emailCli || data.email);
        
        if (hasClientInfo) {
          const transformedData = transformApiData(data);
          console.log(`✅ Données client transformées depuis ${key}:`, transformedData);
          return transformedData;
        }
      } catch (e) {
        console.warn(`❌ Erreur parsing ${key}:`, e);
      }
    }
  }

  console.error('❌ Aucune donnée client valide trouvée');
  message.error('Impossible de récupérer vos informations client. Veuillez vous reconnecter ou contacter l\'administrateur.');
  
  return {
    idCli: null,
    nomCli: '',
    prenomCli: '',
    emailCli: '',
    telephoneCli: '',
    addresseCli: '',
    typeClient: 'Particulier',
    statutCompte: 'Actif'
  };
};

const validateClientData = (clientData) => {
  const errors = [];
  
  if (!clientData.nomCli || clientData.nomCli.trim() === '') {
    errors.push('Le nom est requis');
  }
  
  if (!clientData.emailCli || clientData.emailCli.trim() === '') {
    errors.push('L\'email est requis');
  }
  
  if (!clientData.telephoneCli || clientData.telephoneCli.trim() === '') {
    errors.push('Le téléphone est requis');
  }
  
  if (!clientData.idCli) {
    errors.push('ID client manquant - impossible de créer la réservation');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const validateQuantities = () => {
  validationErrors.qteMat = null;
  validationErrors.nbPerso = null;

  const resource = selectedResource.value;
  if (!resource) return;

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
  return resource;
});

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

const fetchInitialData = async () => {
  loading.catalogue = true;
  try {
    await fetchResources();

    const clientData = await getClientData();
    console.log('👤 Données client finales pour notification:', clientData);
    console.log('📊 Type client réel:', clientData.typeClient);
    console.log('📊 Statut compte réel:', clientData.statutCompte);

  } catch (error) {
    console.error("Erreur de chargement des données:", error);
    message.error("Erreur lors du chargement des ressources.");
  } finally {
    loading.catalogue = false;
  }
};

const fetchResources = async () => {
  try {
    const sallesResponse = await LocationService.getSalles();
    const materielsResponse = await LocationService.getMateriels();

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

    if (urlResourceId && catalogueData.value.length > 0) {
      const resource = catalogueData.value.find(item => item.id === urlResourceId);

      if (resource) {
        form.typeRes = resource.type; 
        form.idCatalogue = resource.id;
        resetQuantities(resource.type); 
        
        setTimeout(() => {
          validateQuantities();
        }, 100);
      } else {
        message.warn(`Ressource (ID:${urlResourceId}) non trouvée. Veuillez la sélectionner.`);
      }
    }

  } catch (error) {
    console.error("Erreur de chargement des ressources:", error);
    throw error;
  }
};

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
    const clientData = await getClientData();
    
    console.log('📨 Données client pour notification:', clientData);
    console.log('📨 Type client envoyé:', clientData.typeClient);
    console.log('📨 Statut compte envoyé:', clientData.statutCompte);

    const validation = validateClientData(clientData);
    if (!validation.isValid) {
      message.error(`Informations client incomplètes: ${validation.errors.join(', ')}. Veuillez compléter votre profil avant de faire une réservation.`);
      
      setTimeout(() => {
        router.push('/client/mon-compte');
      }, 2000);
      
      isSubmitting.value = false;
      return;
    }

    const requestData = {
      idCatalogue: form.idCatalogue,
      typeRes: form.typeRes,
      debRes: new Date(form.debRes).toISOString(),
      finRes: new Date(form.finRes).toISOString(),
      qteMat: form.qteMat || 0,
      nbPerso: form.nbPerso || 0,
      tarifTot: form.tarifTot,
      clientData: clientData
    };

    console.log('📤 Données envoyées à l\'API:', requestData);

    const response = await axios.post(
      'http://localhost:5000/api/reservations/public/reservations',
      requestData
    );

    console.log('✅ Réservation créée avec notifications:', response.data);

    message.success('Votre demande de réservation a été envoyée avec succès ! Notre équipe vous contactera rapidement.');
    
    setTimeout(() => {
      router.push('/compteClient'); 
    }, 1500);

  } catch (error) {
    console.error('❌ Erreur réservation:', error);
    console.error('❌ Détails de l\'erreur:', error.response?.data);
    
    if (error.response?.status === 401) {
      message.error('Session expirée. Veuillez vous reconnecter.');
      router.push('/');
    } else if (error.response?.data?.message) {
      message.error('Erreur: ' + error.response.data.message);
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      message.error('Erreur de connexion. Vérifiez votre connexion internet.');
    } else if (error.response?.status === 400) {
      message.error('Données invalides. Vérifiez les informations saisies.');
    } else {
      message.error('Erreur lors de l\'envoi de votre demande. Veuillez réessayer.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped>
.main-content {
  background-color: #f8f9fa;
}

/* STYLES DU HEADER AMÉLIORÉ (cohérent avec les autres composants) */
.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid rgba(4, 5, 143, 0.1);
}

.header-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.header-icon-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #04058f 0%, #5811EE 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 2rem;
  color: white;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #02061E;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.custom-tag {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2);
}

/* Étape active */
.active-step {
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.05) 0%, rgba(4, 5, 143, 0.05) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2) !important;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  background: #e9ecef;
  color: #6c757d;
}

.step-number.active {
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%);
  color: white;
}

/* Cartes d'informations */
.info-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.1);
  border-color: rgba(88, 17, 238, 0.2);
}

.info-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #02061E;
}

/* Boutons d'actions */
.action-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-width: 2px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* STYLES DU FORMULAIRE AMÉLIORÉ */
.cedii-text-primary { 
  color: #5811EE !important; 
}

.cedii-btn-primary { 
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%) !important;
  color: white !important;
  border: none !important;
}

.cedii-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.3);
}

.cedii-btn-primary:disabled {
  background: #e9ecef !important;
  color: #6c757d !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* En-tête de carte */
.card-header {
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.02) 0%, rgba(4, 5, 143, 0.02) 100%);
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.step-indicator.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(88, 17, 238, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(88, 17, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(88, 17, 238, 0); }
}

.section-header {
  margin-bottom: 24px;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5811EE;
}

/* Cartes de type */
.type-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  height: 100%;
  border-radius: 12px;
}

.type-card:hover {
  border-color: #5811EE60;
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(88, 17, 238, 0.15);
}

.type-card.active {
  border-color: #5811EE;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.05) 0%, rgba(4, 5, 143, 0.05) 100%);
  box-shadow: 0 8px 25px rgba(88, 17, 238, 0.2);
}

.type-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #55555E;
  transition: all 0.3s ease;
}

.type-card.active .type-icon {
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%);
  color: white;
}

.active-icon {
  color: white;
}

/* Sélection de ressource */
.resource-select:deep(.n-base-selection) {
  border-radius: 10px;
  border: 2px solid rgba(88, 17, 238, 0.1);
  transition: all 0.3s ease;
}

.resource-select:deep(.n-base-selection:hover) {
  border-color: rgba(88, 17, 238, 0.3);
}

.resource-select:deep(.n-base-selection--focus) {
  border-color: #5811EE !important;
  box-shadow: 0 0 0 2px rgba(88, 17, 238, 0.1);
}

/* Champs de quantité */
.quantity-input:deep(.n-input) {
  border-radius: 10px;
}

/* Durées */
.duration-grid {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
}

.duration-option {
  width: 100%;
}

.duration-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  height: 100%;
}

.duration-option.n-radio--checked .duration-card {
  border-color: #5811EE;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.05) 0%, rgba(4, 5, 143, 0.05) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.15);
}

.duration-icon {
  font-size: 1.5rem;
  color: #5811EE;
  margin-right: 12px;
}

.duration-text {
  flex-grow: 1;
}

.duration-label {
  font-weight: 600;
  color: #02061E;
  margin-bottom: 2px;
}

.duration-sub {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Date picker */
.date-picker:deep(.n-input) {
  border-radius: 10px;
}

/* Tarif card */
.tarif-card {
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%) !important;
  color: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.tarif-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
}

.tarif-card * {
  position: relative;
  z-index: 1;
}

/* Details card */
.details-card {
  background: #f8f9fa;
  border-radius: 12px;
}

/* Empty state */
.empty-state {
  border: 2px dashed #dee2e6;
  border-radius: 16px;
  background: white;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: #5811EE;
  background: rgba(88, 17, 238, 0.02);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #5811EE;
}

/* Section de soumission */
.submit-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 255, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.completion-indicator {
  position: relative;
}

.submit-btn {
  border-radius: 12px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(88, 17, 238, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1.5rem !important;
  }
  
  .header-icon-container {
    width: 50px;
    height: 50px;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .header-info-row .row {
    flex-direction: column;
  }
  
  .header-actions .d-flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch !important;
  }
  
  .action-btn {
    width: 100%;
  }
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
  
  .type-section {
    margin-bottom: 24px;
  }
  
  .submit-section .row {
    flex-direction: column;
    gap: 20px;
  }
  
  .completion-indicator {
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .submit-btn {
    padding: 14px;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.25rem;
  }
  
  .custom-tag {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .info-card {
    padding: 1rem !important;
  }
  
  .action-btn {
    font-size: 0.85rem;
  }
  
  .duration-grid {
    padding: 12px;
  }
  
  .duration-card {
    padding: 10px;
  }
  
  .duration-icon {
    font-size: 1.25rem;
    margin-right: 8px;
  }
}
</style>-->


<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    
    <main class="main-content flex-grow-1 overflow-auto bg-light">
      <div class="container-fluid py-4">
        <!-- EN-TÊTE AMÉLIORÉE -->
        <div class="page-header mb-4">
          <div class="header-container p-4 rounded-4 shadow-sm">
            <!-- Première ligne : Titre principal et statut -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon-container">
                  <i class="bi bi-calendar-plus-fill header-icon"></i>
                </div>
                <div>
                  <h1 class="header-title mb-0">Nouvelle Réservation</h1>
                  <p class="header-subtitle mb-0 text-muted">Soumettez votre demande de location ou réservation</p>
                </div>
              </div>
              
              <n-tag type="info" size="large" class="custom-tag">
                <template #icon>
                  <n-icon>
                    <i class="bi bi-clock"></i>
                  </n-icon>
                </template>
                Étape 1 sur 2
              </n-tag>
            </div>
            
            <!-- Deuxième ligne : Guide de progression -->
            <div class="header-info-row">
              <div class="row g-4">
                <!-- Étape 1 -->
                <div class="col-md-6">
                  <div class="info-card p-3 rounded-3 active-step">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="step-number active">1</div>
                      <div>
                        <span class="info-label">Étape actuelle</span>
                        <div class="info-value fw-bold text-dark">Formulaire de réservation</div>
                      </div>
                    </div>
                    <n-progress
                      type="line"
                      :percentage="formCompletion"
                      :height="4"
                      :border-radius="0"
                      :show-indicator="false"
                      status="success"
                      class="mt-2"
                    />
                  </div>
                </div>
                
                <!-- Étape 2 -->
                <div class="col-md-6">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="step-number">2</div>
                      <div>
                        <span class="info-label">Prochaine étape</span>
                        <div class="info-value fw-bold text-dark">Confirmation et validation</div>
                      </div>
                    </div>
                    <n-text depth="3" class="small d-block mt-2">
                      Votre demande sera traitée sous 24-48h
                    </n-text>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Troisième ligne : Actions rapides -->
            <div class="header-actions mt-4 pt-3 border-top">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-lightbulb text-warning"></i>
                  <n-text class="small text-muted">
                    Conseil : Remplissez tous les champs obligatoires (<span class="text-danger">*</span>) avant de soumettre
                  </n-text>
                </div>
                
                <div class="d-flex gap-3">
                  <n-button 
                    type="default" 
                    size="small" 
                    class="action-btn"
                    @click="router.go(-1)"
                  >
                    <template #icon>
                      <i class="bi bi-arrow-left"></i>
                    </template>
                    Retour
                  </n-button>
                  <n-button 
                    type="info" 
                    size="small" 
                    class="action-btn"
                    @click="scrollToSection('summary')"
                    :disabled="!form.typeRes"
                  >
                    <template #icon>
                      <i class="bi bi-eye"></i>
                    </template>
                    Voir récapitulatif
                  </n-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENU PRINCIPAL -->
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <n-card class="shadow-sm border-0" content-style="padding: 0;">
              <div class="card-header p-4 border-bottom">
                <div class="d-flex align-items-center gap-3">
                  <div class="step-indicator active">
                    <i class="bi bi-pencil-fill"></i>
                  </div>
                  <div>
                    <n-h3 class="mb-1 fs-5" style="color: #02061E;">
                      <i class="bi bi-card-checklist me-2 cedii-text-primary"></i>
                      Remplissez le formulaire de réservation
                    </n-h3>
                    <n-text class="text-muted small">
                      Tous les champs marqués d'un <span class="text-danger">*</span> sont obligatoires
                    </n-text>
                  </div>
                </div>
              </div>

              <form @submit.prevent="submitForm" class="p-4">
                <n-grid :cols="2" :x-gap="24" :y-gap="20">
                  <!-- Colonne gauche : Type de réservation -->
                  <n-gi>
                    <div class="type-section">
                      <div class="section-header mb-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <div class="section-icon">
                            <i class="bi bi-tags-fill"></i>
                          </div>
                          <n-h4 class="mb-0 fs-5" style="color: #02061E;">Type de Réservation</n-h4>
                        </div>
                        <n-text depth="3" class="small">
                          Sélectionnez le type de service dont vous avez besoin
                        </n-text>
                      </div>
                      
                      <n-radio-group v-model:value="form.typeRes" name="typeRes" size="medium">
                        <n-space vertical :size="16">
                          <n-radio value="Salle" class="type-option">
                            <n-card class="type-card p-4" :class="{ 'active': form.typeRes === 'Salle' }">
                              <div class="d-flex align-items-start">
                                <div class="type-icon me-3">
                                  <i class="bi bi-house-door-fill" :class="{ 'active-icon': form.typeRes === 'Salle' }"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="d-flex justify-content-between align-items-start mb-2">
                                    <n-text strong style="color: #02061E; font-size: 1rem;">
                                      Réservation de Salle
                                    </n-text>
                                    <n-tag v-if="form.typeRes === 'Salle'" type="success" size="small" round>
                                      <template #icon>
                                        <i class="bi bi-check"></i>
                                      </template>
                                      Sélectionné
                                    </n-tag>
                                  </div>
                                  <n-text depth="3" class="d-block small mb-2">
                                    Salles de réunion, espaces événementiels, amphithéâtres
                                  </n-text>
                                  <div class="d-flex gap-3 mt-2">
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-people me-1"></i>
                                      Capacité adaptée
                                    </n-text>
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-wifi me-1"></i>
                                      Équipement inclus
                                    </n-text>
                                  </div>
                                </div>
                              </div>
                            </n-card>
                          </n-radio>
                          
                          <n-radio value="Materiel" class="type-option">
                            <n-card class="type-card p-4" :class="{ 'active': form.typeRes === 'Materiel' }">
                              <div class="d-flex align-items-start">
                                <div class="type-icon me-3">
                                  <i class="bi bi-tools" :class="{ 'active-icon': form.typeRes === 'Materiel' }"></i>
                                </div>
                                <div class="flex-grow-1">
                                  <div class="d-flex justify-content-between align-items-start mb-2">
                                    <n-text strong style="color: #02061E; font-size: 1rem;">
                                      Location de Matériel
                                    </n-text>
                                    <n-tag v-if="form.typeRes === 'Materiel'" type="success" size="small" round>
                                      <template #icon>
                                        <i class="bi bi-check"></i>
                                      </template>
                                      Sélectionné
                                    </n-tag>
                                  </div>
                                  <n-text depth="3" class="d-block small mb-2">
                                    Équipements audiovisuels, matériel technique, mobilier
                                  </n-text>
                                  <div class="d-flex gap-3 mt-2">
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-box-seam me-1"></i>
                                      Livraison possible
                                    </n-text>
                                    <n-text depth="3" class="small d-flex align-items-center">
                                      <i class="bi bi-gear me-1"></i>
                                      Installation incluse
                                    </n-text>
                                  </div>
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
                      <div class="section-header mb-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                          <div class="section-icon">
                            <i class="bi bi-gear-fill"></i>
                          </div>
                          <n-h4 class="mb-0 fs-5" style="color: #02061E;">
                            Détails de la Réservation
                          </n-h4>
                        </div>
                        <n-text depth="3" class="small">
                          Configurez les spécificités de votre demande
                        </n-text>
                      </div>

                      <!-- Sélection de la ressource -->
                      <n-form-item label="Ressource" :required="true" class="mb-4">
                        <n-select
                          v-model:value="form.idCatalogue"
                          :placeholder="form.typeRes === 'Salle' ? 'Choisir une salle disponible...' : 'Choisir un matériel disponible...'"
                          :options="resourceOptions"
                          :loading="loading.catalogue"
                          clearable
                          filterable
                          class="resource-select"
                        >
                          <template #arrow>
                            <i class="bi bi-chevron-down"></i>
                          </template>
                        </n-select>
                        <template #feedback>
                          <div v-if="selectedResource" class="d-flex align-items-center gap-2 mt-1">
                            <n-tag size="tiny" type="info">
                              <template #icon>
                                <i class="bi bi-info-circle"></i>
                              </template>
                              {{ form.typeRes === 'Salle' ? 'Capacité' : 'Disponibilité' }} : 
                              {{ form.typeRes === 'Salle' ? selectedResource.capaciteSalle + ' personnes' : selectedResource.qteTotDispo + ' unités' }}
                            </n-tag>
                            <n-text depth="3" class="small">
                              Tarif journalier : {{ selectedResource.tarifJour?.toFixed(2) || '0.00' }} MGA
                            </n-text>
                          </div>
                        </template>
                      </n-form-item>

                      <!-- Quantité ou Personnes -->
                      <n-grid :cols="form.typeRes === 'Salle' ? 1 : 2" :x-gap="16" class="mb-4">
                        <n-gi v-if="form.typeRes === 'Materiel'">
                          <n-form-item 
                            label="Quantité nécessaire" 
                            :required="true"
                            :feedback="qteMatFeedback"
                            :validation-status="qteMatValidationStatus"
                          >
                            <n-input-number
                              v-model:value="form.qteMat"
                              :min="1"
                              :max="selectedResource ? selectedResource.qteTotDispo : null"
                              placeholder="Ex: 2"
                              class="w-100 quantity-input"
                              @update:value="validateQuantities"
                            >
                              <template #suffix>
                                unité(s)
                              </template>
                            </n-input-number>
                          </n-form-item>
                        </n-gi>
                        
                        <n-gi v-if="form.typeRes === 'Salle'">
                          <n-form-item 
                            label="Nombre de personnes" 
                            :required="true"
                            :feedback="nbPersoFeedback"
                            :validation-status="nbPersoValidationStatus"
                          >
                            <n-input-number
                              v-model:value="form.nbPerso"
                              :min="1"
                              :max="selectedResource ? selectedResource.capaciteSalle : null"
                              placeholder="Ex: 10"
                              class="w-100 quantity-input"
                              @update:value="validateQuantities"
                            >
                              <template #suffix>
                                personne(s)
                              </template>
                            </n-input-number>
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!-- Type de durée -->
                      <n-form-item label="Durée de location" :required="true" class="mb-4">
                        <div class="duration-grid">
                          <n-radio-group v-model:value="form.typeDuree" name="typeDuree" size="medium">
                            <n-grid :cols="2" :x-gap="12" :y-gap="12">
                              <n-gi>
                                <n-radio value="heure" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-clock-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Par Heure</div>
                                      <div class="duration-sub">Flexibilité maximale</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                              <n-gi>
                                <n-radio value="demi-journee" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-sun-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Demi-Journée</div>
                                      <div class="duration-sub">4 heures</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                              <n-gi>
                                <n-radio value="Jour" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-calendar-day-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Journée Complète</div>
                                      <div class="duration-sub">8 heures</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                              <n-gi>
                                <n-radio value="plus-jours" class="duration-option">
                                  <div class="duration-card">
                                    <i class="bi bi-calendar-week-fill duration-icon"></i>
                                    <div class="duration-text">
                                      <div class="duration-label">Plusieurs Jours</div>
                                      <div class="duration-sub">Sur mesure</div>
                                    </div>
                                  </div>
                                </n-radio>
                              </n-gi>
                            </n-grid>
                          </n-radio-group>
                        </div>
                      </n-form-item>

                      <!-- Dates -->
                      <n-grid :cols="2" :x-gap="16" class="mb-4">
                        <n-gi>
                          <n-form-item label="Date et heure de début" :required="true">
                            <n-date-picker
                              v-model:value="form.debRes"
                              type="datetime"
                              :is-date-disabled="disablePreviousDate"
                              class="w-100 date-picker"
                              placeholder="Sélectionnez..."
                              :clearable="false"
                            />
                          </n-form-item>
                        </n-gi>
                        <n-gi>
                          <n-form-item label="Date et heure de fin" :required="true">
                            <n-date-picker
                              v-model:value="form.finRes"
                              type="datetime"
                              :is-date-disabled="disablePreviousDate"
                              class="w-100 date-picker"
                              placeholder="Sélectionnez..."
                              :clearable="false"
                              :disabled="!form.debRes"
                            />
                          </n-form-item>
                        </n-gi>
                      </n-grid>

                      <!-- Récapitulatif et tarif -->
                      <div v-if="form.typeRes && form.idCatalogue" class="summary-section" id="summary">
                        <div class="summary-header mb-3">
                          <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-receipt cedii-text-primary"></i>
                            <n-h4 class="mb-0 fs-5" style="color: #02061E;">Récapitulatif et Tarif</n-h4>
                          </div>
                        </div>
                        
                        <!-- Carte de tarif -->
                        <n-card class="tarif-card border-0 mb-4">
                          <div class="text-center p-3">
                            <n-text class="d-block text-muted mb-2 small">ESTIMATION DU TARIF TOTAL</n-text>
                            <n-h1 class="cedii-text-primary mb-2 display-6 fw-bold">{{ formattedTarif }}</n-h1>
                            <n-text depth="3" class="small" style="color: #067186;">
                              <i class="bi bi-info-circle me-1"></i>
                              {{ tarifDetails }}
                            </n-text>
                          </div>
                        </n-card>

                        <!-- Détails de la réservation -->
                        <n-card class="border-0 details-card">
                          <n-descriptions label-placement="left" bordered size="small" class="w-100">
                            <n-descriptions-item label="Type de réservation">
                              <div class="d-flex align-items-center gap-2">
                                <n-tag :type="form.typeRes === 'Salle' ? 'info' : 'warning'" size="small" round>
                                  <template #icon>
                                    <i :class="form.typeRes === 'Salle' ? 'bi bi-house-door' : 'bi bi-tools'"></i>
                                  </template>
                                  {{ form.typeRes === 'Salle' ? 'Salle' : 'Matériel' }}
                                </n-tag>
                              </div>
                            </n-descriptions-item>
                            <n-descriptions-item label="Ressource">
                              <div class="d-flex align-items-center gap-2">
                                <i class="bi bi-check-circle-fill text-success"></i>
                                <n-text strong style="color: #02061E;">
                                  {{ selectedResource?.nom || 'Non sélectionné' }}
                                </n-text>
                              </div>
                            </n-descriptions-item>
                            <n-descriptions-item :label="form.typeRes === 'Salle' ? 'Nombre de personnes' : 'Quantité'">
                              <div class="d-flex align-items-center gap-2">
                                <i :class="hasValidationErrors ? 'bi bi-exclamation-triangle text-warning' : 'bi bi-check-circle text-success'"></i>
                                <n-text 
                                  strong 
                                  :style="{ color: hasValidationErrors ? '#ff4d4f' : '#067186' }"
                                >
                                  {{ form.typeRes === 'Salle' ? form.nbPerso : form.qteMat }}
                                  {{ form.typeRes === 'Salle' ? 'personne(s)' : 'unité(s)' }}
                                </n-text>
                              </div>
                            </n-descriptions-item>
                            <n-descriptions-item label="Période de location">
                              <div class="d-flex align-items-center gap-2">
                                <n-tag :type="getDurationTagType(form.typeDuree)" size="small" round>
                                  <i class="bi bi-calendar-event me-1"></i>
                                  {{ durationLabel }}
                                </n-tag>
                              </div>
                            </n-descriptions-item>
                          </n-descriptions>
                        </n-card>
                      </div>
                    </div>

                    <!-- Message quand aucun type sélectionné -->
                    <div v-else class="empty-state text-center py-5">
                      <div class="empty-icon mb-3">
                        <i class="bi bi-calendar-check"></i>
                      </div>
                      <n-h4 class="mb-2" style="color: #55555E;">
                        Sélectionnez un type de réservation
                      </n-h4>
                      <n-text depth="3" class="d-block mb-3">
                        Choisissez entre la réservation d'une salle ou la location de matériel pour continuer
                      </n-text>
                      <n-button type="primary" size="small" ghost>
                        <template #icon>
                          <i class="bi bi-arrow-right"></i>
                        </template>
                        Commencer
                      </n-button>
                    </div>
                  </n-gi>
                </n-grid>

                <!-- Bouton de soumission -->
                <div class="submit-section mt-5 pt-4 border-top">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <div class="d-flex align-items-center gap-2">
                        <div class="completion-indicator">
                          <n-progress
                            type="circle"
                            :percentage="formCompletion"
                            :radius="20"
                            :stroke-width="4"
                            status="success"
                          />
                        </div>
                        <div>
                          <n-text class="d-block small fw-semibold" style="color: #02061E;">
                            Formulaire {{ formCompletion }}% complet
                          </n-text>
                          <n-text depth="3" class="small">
                            {{ isFormValid ? 'Prêt à soumettre' : 'Remplissez tous les champs' }}
                          </n-text>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="d-grid">
                        <n-button 
                          type="primary" 
                          size="large" 
                          :disabled="!isFormValid || isSubmitting || hasValidationErrors" 
                          :loading="isSubmitting"
                          @click="submitForm"
                          class="cedii-btn-primary fw-bold submit-btn"
                        >
                          <template #icon>
                            <i :class="isSubmitting ? 'bi bi-hourglass-split' : 'bi bi-check-circle-fill'"></i>
                          </template>
                          {{ isSubmitting ? 'Enregistrement en cours...' : 'Soumettre la Demande' }}
                        </n-button>
                        
                        <!-- Message d'aide pour la validation -->
                        <div v-if="!isFormValid" class="text-center mt-2">
                          <n-text depth="3" class="small d-flex align-items-center justify-content-center gap-1">
                            <i class="bi bi-info-circle"></i>
                            Tous les champs obligatoires doivent être remplis pour soumettre
                          </n-text>
                        </div>
                      </div>
                    </div>
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
  NH4, 
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
  NProgress
} from 'naive-ui';
import ClientNavbar from '../components/clientNavbar.vue';
import LocationService from '../services/LocationService'; 
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const isSubmitting = ref(false);
const loading = reactive({
  catalogue: true,
  client: false
});

const catalogueData = ref([]);
const clientProfile = ref(null);

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

// NOUVEAU : Calcul du pourcentage de complétion du formulaire
const formCompletion = computed(() => {
  let totalFields = 6; // typeRes, idCatalogue, qteMat/nbPerso, typeDuree, debRes, finRes
  let completedFields = 0;
  
  if (form.typeRes) completedFields++;
  if (form.idCatalogue) completedFields++;
  if (form.typeRes === 'Materiel' ? form.qteMat > 0 : form.nbPerso > 0) completedFields++;
  if (form.typeDuree) completedFields++;
  if (form.debRes) completedFields++;
  if (form.finRes && new Date(form.debRes) < new Date(form.finRes)) completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
});

// Fonctions existantes (inchangées)
const fetchClientProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('❌ Aucun token trouvé');
      return null;
    }

    const response = await axios.get('http://localhost:5000/api/clients/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.data.idCli) {
      console.log('✅ Profil client récupéré via API:', response.data);
      return response.data;
    } else {
      console.warn('❌ Réponse API incomplète:', response.data);
    }
  } catch (error) {
    console.warn('⚠️ Impossible de récupérer le profil client via API:', error.response?.data?.message || error.message);
  }
  return null;
};

const transformApiData = (apiData) => {
  if (!apiData) return null;
  
  return {
    idCli: apiData.idCli || apiData.id,
    nomCli: apiData.nomCli || apiData.nom || '',
    prenomCli: apiData.prenomCli || apiData.prenom || '',
    emailCli: apiData.emailCli || apiData.email || '',
    telephoneCli: apiData.telephoneCli || apiData.telephone || '',
    addresseCli: apiData.addresseCli || apiData.adresse || '',
    
    typeClient: apiData.typeCli 
      ? (apiData.typeCli === 'entreprise' ? 'Entreprise' : 
         apiData.typeCli === 'particulier' ? 'Particulier' : 
         apiData.typeCli.charAt(0).toUpperCase() + apiData.typeCli.slice(1))
      : (apiData.typeClient || 'Particulier'),
    
    statutCompte: apiData.statutCli 
      ? (apiData.statutCli === 'actif' ? 'Actif' : 
         apiData.statutCli === 'inactif' ? 'Inactif' : 
         apiData.statutCli === 'suspendu' ? 'Suspendu' : 
         apiData.statutCli.charAt(0).toUpperCase() + apiData.statutCli.slice(1))
      : (apiData.statutCompte || 'Actif'),
    
    ...apiData
  };
};

const getClientData = async () => {
  console.log('🔄 Récupération des données client...');
  
  const apiProfile = await fetchClientProfile();
  if (apiProfile && apiProfile.idCli) {
    const transformedData = transformApiData(apiProfile);
    console.log('✅ Données client transformées depuis API:', transformedData);
    return transformedData;
  }

  const possibleKeys = ['clientInfo', 'userInfo', 'currentUser', 'clientProfile', 'user', 'client'];
  
  for (const key of possibleKeys) {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log(`📁 Données ${key} trouvées:`, data);
        
        const hasClientInfo = (data.idCli || data.id) && (data.nomCli || data.nom) && (data.emailCli || data.email);
        
        if (hasClientInfo) {
          const transformedData = transformApiData(data);
          console.log(`✅ Données client transformées depuis ${key}:`, transformedData);
          return transformedData;
        }
      } catch (e) {
        console.warn(`❌ Erreur parsing ${key}:`, e);
      }
    }
  }

  console.error('❌ Aucune donnée client valide trouvée');
  window.alert('Impossible de récupérer vos informations client. Veuillez vous reconnecter ou contacter l\'administrateur.');
  
  return {
    idCli: null,
    nomCli: '',
    prenomCli: '',
    emailCli: '',
    telephoneCli: '',
    addresseCli: '',
    typeClient: 'Particulier',
    statutCompte: 'Actif'
  };
};

const validateClientData = (clientData) => {
  const errors = [];
  
  if (!clientData.nomCli || clientData.nomCli.trim() === '') {
    errors.push('Le nom est requis');
  }
  
  if (!clientData.emailCli || clientData.emailCli.trim() === '') {
    errors.push('L\'email est requis');
  }
  
  if (!clientData.telephoneCli || clientData.telephoneCli.trim() === '') {
    errors.push('Le téléphone est requis');
  }
  
  if (!clientData.idCli) {
    errors.push('ID client manquant - impossible de créer la réservation');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const validateQuantities = () => {
  validationErrors.qteMat = null;
  validationErrors.nbPerso = null;

  const resource = selectedResource.value;
  if (!resource) return;

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

const validateBeforeSubmit = () => {
  validateQuantities();
  
  if (hasValidationErrors.value) {
    window.alert('Veuillez corriger les erreurs de quantité avant de soumettre');
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
  return resource;
});

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

const fetchInitialData = async () => {
  loading.catalogue = true;
  try {
    await fetchResources();

    const clientData = await getClientData();
    console.log('👤 Données client finales pour notification:', clientData);
    console.log('📊 Type client réel:', clientData.typeClient);
    console.log('📊 Statut compte réel:', clientData.statutCompte);

  } catch (error) {
    console.error("Erreur de chargement des données:", error);
    window.alert("Erreur lors du chargement des ressources.");
  } finally {
    loading.catalogue = false;
  }
};

const fetchResources = async () => {
  try {
    const sallesResponse = await LocationService.getSalles();
    const materielsResponse = await LocationService.getMateriels();

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

    if (urlResourceId && catalogueData.value.length > 0) {
      const resource = catalogueData.value.find(item => item.id === urlResourceId);

      if (resource) {
        form.typeRes = resource.type; 
        form.idCatalogue = resource.id;
        resetQuantities(resource.type); 
        
        setTimeout(() => {
          validateQuantities();
        }, 100);
      } else {
        // CORRECTION : remplacer message.warn() par window.alert() ou console.warn()
        console.warn(`Ressource (ID:${urlResourceId}) non trouvée. Veuillez la sélectionner.`);
        // Ou utiliser une alerte :
        // window.alert(`Ressource (ID:${urlResourceId}) non trouvée. Veuillez la sélectionner.`);
      }
    }

  } catch (error) {
    console.error("Erreur de chargement des ressources:", error);
    throw error;
  }
};

const submitForm = async () => {
  if (!isFormValid.value) {
    window.alert('Veuillez corriger les erreurs dans le formulaire');
    return;
  }
  
  if (!validateBeforeSubmit()) {
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const clientData = await getClientData();
    
    console.log('📨 Données client pour notification:', clientData);
    console.log('📨 Type client envoyé:', clientData.typeClient);
    console.log('📨 Statut compte envoyé:', clientData.statutCompte);

    const validation = validateClientData(clientData);
    if (!validation.isValid) {
      window.alert(`Informations client incomplètes: ${validation.errors.join(', ')}. Veuillez compléter votre profil avant de faire une réservation.`);
      
      setTimeout(() => {
        router.push('/client/mon-compte');
      }, 2000);
      
      isSubmitting.value = false;
      return;
    }

    const requestData = {
      idCatalogue: form.idCatalogue,
      typeRes: form.typeRes,
      debRes: new Date(form.debRes).toISOString(),
      finRes: new Date(form.finRes).toISOString(),
      qteMat: form.qteMat || 0,
      nbPerso: form.nbPerso || 0,
      tarifTot: form.tarifTot,
      clientData: clientData
    };

    console.log('📤 Données envoyées à l\'API:', requestData);

    const response = await axios.post(
      'http://localhost:5000/api/reservations/public/reservations',
      requestData
    );

    console.log('✅ Réservation créée avec notifications:', response.data);

    window.alert('Votre demande de réservation a été envoyée avec succès ! Notre équipe vous contactera rapidement.');
    
    setTimeout(() => {
      router.push('/compteClient'); 
    }, 1500);

  } catch (error) {
    console.error('❌ Erreur réservation:', error);
    console.error('❌ Détails de l\'erreur:', error.response?.data);
    
    if (error.response?.status === 401) {
      window.alert('Session expirée. Veuillez vous reconnecter.');
      router.push('/');
    } else if (error.response?.data?.message) {
      window.alert('Erreur: ' + error.response.data.message);
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      window.alert('Erreur de connexion. Vérifiez votre connexion internet.');
    } else if (error.response?.status === 400) {
      window.alert('Données invalides. Vérifiez les informations saisies.');
    } else {
      window.alert('Erreur lors de l\'envoi de votre demande. Veuillez réessayer.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

onMounted(() => {
  fetchInitialData();
});
</script>

<style scoped>
.main-content {
  background-color: #f8f9fa;
}

/* STYLES DU HEADER AMÉLIORÉ (cohérent avec les autres composants) */
.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid rgba(4, 5, 143, 0.1);
}

.header-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.header-icon-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #04058f 0%, #5811EE 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 2rem;
  color: white;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #02061E;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.custom-tag {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2);
}

/* Étape active */
.active-step {
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.05) 0%, rgba(4, 5, 143, 0.05) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2) !important;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  background: #e9ecef;
  color: #6c757d;
}

.step-number.active {
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%);
  color: white;
}

/* Cartes d'informations */
.info-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.1);
  border-color: rgba(88, 17, 238, 0.2);
}

.info-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #02061E;
}

/* Boutons d'actions */
.action-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-width: 2px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* STYLES DU FORMULAIRE AMÉLIORÉ */
.cedii-text-primary { 
  color: #5811EE !important; 
}

.cedii-btn-primary { 
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%) !important;
  color: white !important;
  border: none !important;
}

.cedii-btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.3);
}

.cedii-btn-primary:disabled {
  background: #e9ecef !important;
  color: #6c757d !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* En-tête de carte */
.card-header {
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.02) 0%, rgba(4, 5, 143, 0.02) 100%);
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.step-indicator.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(88, 17, 238, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(88, 17, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(88, 17, 238, 0); }
}

.section-header {
  margin-bottom: 24px;
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  display: flex;
  align-items-center: center;
  justify-content: center;
  color: #5811EE;
}

/* Cartes de type */
.type-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  height: 100%;
  border-radius: 12px;
}

.type-card:hover {
  border-color: #5811EE60;
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(88, 17, 238, 0.15);
}

.type-card.active {
  border-color: #5811EE;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.05) 0%, rgba(4, 5, 143, 0.05) 100%);
  box-shadow: 0 8px 25px rgba(88, 17, 238, 0.2);
}

.type-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #55555E;
  transition: all 0.3s ease;
}

.type-card.active .type-icon {
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%);
  color: white;
}

.active-icon {
  color: white;
}

/* Sélection de ressource */
.resource-select:deep(.n-base-selection) {
  border-radius: 10px;
  border: 2px solid rgba(88, 17, 238, 0.1);
  transition: all 0.3s ease;
}

.resource-select:deep(.n-base-selection:hover) {
  border-color: rgba(88, 17, 238, 0.3);
}

.resource-select:deep(.n-base-selection--focus) {
  border-color: #5811EE !important;
  box-shadow: 0 0 0 2px rgba(88, 17, 238, 0.1);
}

/* Champs de quantité */
.quantity-input:deep(.n-input) {
  border-radius: 10px;
}

/* Durées */
.duration-grid {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
}

.duration-option {
  width: 100%;
}

.duration-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  height: 100%;
}

.duration-option.n-radio--checked .duration-card {
  border-color: #5811EE;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.05) 0%, rgba(4, 5, 143, 0.05) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.15);
}

.duration-icon {
  font-size: 1.5rem;
  color: #5811EE;
  margin-right: 12px;
}

.duration-text {
  flex-grow: 1;
}

.duration-label {
  font-weight: 600;
  color: #02061E;
  margin-bottom: 2px;
}

.duration-sub {
  font-size: 0.8rem;
  color: #6c757d;
}

/* Date picker */
.date-picker:deep(.n-input) {
  border-radius: 10px;
}

/* Tarif card */
.tarif-card {
  background: linear-gradient(135deg, #5811EE 0%, #04058F 100%) !important;
  color: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.tarif-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.1;
}

.tarif-card * {
  position: relative;
  z-index: 1;
}

/* Details card */
.details-card {
  background: #f8f9fa;
  border-radius: 12px;
}

/* Empty state */
.empty-state {
  border: 2px dashed #dee2e6;
  border-radius: 16px;
  background: white;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: #5811EE;
  background: rgba(88, 17, 238, 0.02);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #5811EE;
}

/* Section de soumission */
.submit-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 255, 0.9) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.completion-indicator {
  position: relative;
}

.submit-btn {
  border-radius: 12px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(88, 17, 238, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1.5rem !important;
  }
  
  .header-icon-container {
    width: 50px;
    height: 50px;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .header-info-row .row {
    flex-direction: column;
  }
  
  .header-actions .d-flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch !important;
  }
  
  .action-btn {
    width: 100%;
  }
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
  
  .type-section {
    margin-bottom: 24px;
  }
  
  .submit-section .row {
    flex-direction: column;
    gap: 20px;
  }
  
  .completion-indicator {
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .submit-btn {
    padding: 14px;
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.25rem;
  }
  
  .custom-tag {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .info-card {
    padding: 1rem !important;
  }
  
  .action-btn {
    font-size: 0.85rem;
  }
  
  .duration-grid {
    padding: 12px;
  }
  
  .duration-card {
    padding: 10px;
  }
  
  .duration-icon {
    font-size: 1.25rem;
    margin-right: 8px;
  }
}
</style>