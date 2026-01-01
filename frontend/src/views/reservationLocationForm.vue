

<template>
  <div class="full-height-container">
    <!-- Structure principale avec sidebar et contenu -->
    <n-layout has-sider class="h-100">
      <!-- Sidebar Naive UI -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        show-trigger="bar"
        class="custom-sidebar"
      >
        <div class="sidebar-content d-flex flex-column h-100 p-3">
          <!-- Logo et Titre -->
          <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
            <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
            <h4 class="sidebar-title mb-0 fs-6">CEDII Patrimoine Plus</h4>
          </div>
          
          <!-- Menu Navigation -->
          <n-menu
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
            class="flex-grow-1 custom-menu"
          />
          
          <!-- Bouton Déconnexion -->
          <div class="mt-auto pt-3 border-top border-white">
            <n-button 
              @click="logout" 
              type="error"
              size="small"
              class="w-100"
              ghost
            >
              <template #icon>
                <i class="bi bi-box-arrow-right"></i>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">
        <!-- Header -->
        <n-layout-header bordered class="custom-header d-flex align-items-center p-3">
          <!-- Bouton Retour -->
          <div class="d-flex align-items-center">
            <n-button 
              @click="$router.go(-1)" 
              type="default" 
              size="small"
              class="me-3"
              ghost
            >
              <template #icon>
                <i class="bi bi-arrow-left"></i>
              </template>
              Retour
            </n-button>
          </div>
          
          <!-- Titre centré -->
          <div class="flex-grow-1 text-center">
            <h1 class="custom-title mb-1">
              <i class="bi bi-calendar-plus-fill me-2"></i>
              Nouvelle Réservation / Location
            </h1>
            <p class="custom-subtitle">Formulaire de création de nouvelle demande</p>
          </div>
          
          <!-- Informations utilisateur -->
          <div class="d-flex align-items-center gap-3">
            <n-tag type="info" size="small" class="custom-tag">
              Rôle: {{ userRole }}
            </n-tag>
          </div>
        </n-layout-header>

        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="reservation-page-container">
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
                        Basé sur {{ selectedResource.nom || selectedResource.designation }} - 
                        {{ form.typeDuree === 'heure' ? 'Heure' : 
                          form.typeDuree === 'demi-journee' ? 'Demi-journée' : 
                          form.typeDuree === 'Jour' ? 'Journée' : 'Plusieurs jours' }}
                        <span v-if="form.typeRes === 'Materiel' && form.qteMat > 1">
                          × {{ form.qteMat }} unités
                        </span>
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
                            <i class="bi bi-info-circle"></i>
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
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag, 
  NCard, 
  NForm,
  NSelect,
  NInputNumber,
  NDatePicker,
  NInput,
  NInputGroup,
  NAlert
} from 'naive-ui';
import LocationService from '../services/LocationService';
import AuthService from '../services/AuthService';

const router = useRouter();
const route = useRoute();

// États utilisateur
const userRole = ref('');
const activeMenuKey = ref('nouvelle-reservation'); // Activer l'item "nouvelle-reservation" dans le menu
const badgeCount = ref(0); // Pour afficher le nombre de demandes en attente

// Options du menu avec texte blanc
const menuOptions = ref([
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Nouvelle Réservation / Location'),
    key: 'nouvelle-reservation',
    icon: renderIcon('bi-calendar-plus-fill')
  },
  {
    label: () => {
      // Créer le label avec badge conditionnel
      const children = [
        h('span', { class: 'text-white' }, 'Demandes à Traiter')
      ];
      
      if (badgeCount.value > 0) {
        children.push(
          h(NTag, {
            type: 'warning',
            size: 'small',
            class: 'ms-2 custom-tag'
          }, { default: () => badgeCount.value.toString() })
        );
      }
      
      return h('div', {
        class: 'd-flex align-items-center'
      }, children);
    },
    key: 'demandes-attente',
    icon: renderIcon('bi-bell-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Calendrier & Disponibilités'),
    key: 'calendrier',
    icon: renderIcon('bi-calendar-day')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Inventaire & Patrimoine'),
    key: 'inventaire',
    icon: renderIcon('bi-tools')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Matériel de Bureau'),
    key: 'bureau',
    icon: renderIcon('bi-briefcase-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Fiches Clients'),
    key: 'clients',
    icon: renderIcon('bi-people-fill')
  }
]);

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'accueil': 'ReceptionDashboard',
    'nouvelle-reservation': 'NouvelleReservation',
    'demandes-attente': 'DemandesEnAttente',
    'calendrier': 'CalendrierDisponibilites',
    'inventaire': 'InventairePatrimoine',
    'bureau': 'Bureau',
    'clients': 'ClientManagement'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

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

const validationErrors = reactive({
  qteMat: null,
  nbPerso: null
});

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
    message: 'La quantité est requise', 
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
  if (!catalogueData.value || !Array.isArray(catalogueData.value)) {
    return [];
  }
  
  const filteredItems = catalogueData.value.filter(item => item && item.type === form.typeRes);
  
  console.log('🔍 Options filtrées:', {
    typeRes: form.typeRes,
    totalItems: catalogueData.value.length,
    filteredCount: filteredItems.length,
    items: filteredItems.map(item => ({ id: item.id, nom: item.nom, type: item.type }))
  });
  
  return filteredItems.map(item => ({
    label: `${item.nom} (${item.type === 'Salle' ? 'Capacité: ' + (item.capacite || 'N/A') + ' pers.' : 'Disponible: ' + (item.qteDispo || 'N/A')}) - Tarif Jour: ${item.tarifJour ? item.tarifJour.toFixed(2) : '0.00'} MGA`,
    value: item.id,
    raw: item
  }));
});

const clientOptions = computed(() => {
  if (!clients.value || !Array.isArray(clients.value)) {
    return [];
  }
  return clients.value.map(client => ({
    label: `${client.nomCli} ${client.prenomCli} (ID: ${client.idCli})`,
    value: client.idCli
  }));
});

const selectedResource = computed(() => {
  if (!catalogueData.value || !Array.isArray(catalogueData.value) || !form.idCatalogue) {
    return null;
  }
  
  const resource = catalogueData.value.find(item => item && item.id === form.idCatalogue);
  
  if (resource) {
    console.log('✅ Ressource sélectionnée:', {
      id: resource.id,
      nom: resource.nom,
      type: resource.type,
      tarifs: {
        heure: resource.tarifHeure,
        demiJournee: resource.tarifDemiJournee,
        jour: resource.tarifJour
      }
    });
  } else {
    console.warn('⚠️ Ressource non trouvée pour idCatalogue:', form.idCatalogue);
    console.log('📋 Toutes les ressources disponibles:', catalogueData.value.map(r => ({ id: r.id, nom: r.nom, type: r.type })));
  }
  
  return resource;
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

const hasValidationErrors = computed(() => {
  return validationErrors.qteMat !== null || validationErrors.nbPerso !== null;
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
    if (clientData && Array.isArray(clientData)) {
      clients.value = clientData.map(c => ({ 
        idCli: c.idCli, 
        nomCli: c.nomCli, 
        prenomCli: c.prenomCli 
      }));
    } else {
      console.warn('Aucune donnée client reçue ou format invalide');
      clients.value = [];
    }

    // Récupération des salles et matériels
    let sallesData = [];
    let materielsData = [];

    try {
      sallesData = await LocationService.getSalles();
      console.log('📊 Salles récupérées:', sallesData);
    } catch (salleError) {
      console.error('Erreur lors du chargement des salles:', salleError);
      sallesData = [];
    }

    try {
      materielsData = await LocationService.getMateriels();
      console.log('📊 Matériels récupérés:', materielsData);
    } catch (materielError) {
      console.error('Erreur lors du chargement des matériels:', materielError);
      materielsData = [];
    }

    // Mapping des salles
    const mappedSalles = (sallesData && Array.isArray(sallesData)) 
      ? sallesData.map(s => ({
          id: s.idSalle,
          nom: s.nomSalle || `Salle ${s.numeroSalle || s.idSalle}`,
          designation: s.nomSalle,
          type: 'Salle',
          tarifHeure: parseFloat(s.tarifHeure) || 0,
          tarifDemiJournee: parseFloat(s.tarifDemiJournee) || 0,
          tarifJour: parseFloat(s.tarifJour) || 0,
          capacite: s.capaciteSalle || 0,
          numeroSalle: s.numeroSalle
        }))
      : [];

    // Mapping des matériels
    const mappedMateriels = (materielsData && Array.isArray(materielsData))
      ? materielsData.map(m => ({
          id: m.codeMat,
          nom: m.designationMat || m.codeMat,
          designation: m.designationMat,
          type: 'Materiel',
          tarifHeure: parseFloat(m.tarifHeure) || 0,
          tarifDemiJournee: parseFloat(m.tarifDemiJournee) || 0,
          tarifJour: parseFloat(m.tarifJour) || 0,
          qteDispo: m.qteTotDispo || 0
        }))
      : [];
    
    catalogueData.value = [...mappedSalles, ...mappedMateriels];
    
    console.log('📋 Données chargées:', {
      clients: clients.value.length,
      salles: mappedSalles.length,
      materiels: mappedMateriels.length,
      catalogue: catalogueData.value.length,
      'exemple salle': mappedSalles[0],
      'exemple materiel': mappedMateriels[0]
    });
    
  } catch (error) {
    console.error("❌ Erreur de chargement des données initiales:", error);
    message.value = `Erreur de connexion : ${error.message || 'Impossible de charger les données initiales.'}`;
    isSuccess.value = false;
  } finally {
    loading.catalogue = false;
    loading.clients = false;
  }
};

// Fonction pour récupérer le nombre de demandes en attente
const fetchPendingRequestsCount = async () => {
  try {
    // À implémenter selon votre API
    // Exemple: const response = await LocationService.getPendingRequestsCount();
    // badgeCount.value = response.count || 0;
    badgeCount.value = 0; // Valeur temporaire
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes en attente:', error);
  }
};

const submitForm = async () => {
  // Validation basique
  if (!isFormValid.value) {
    message.value = 'Veuillez remplir tous les champs obligatoires';
    isSuccess.value = false;
    return;
  }
  
  // Validation des dates
  if (form.debRes && form.finRes && form.debRes >= form.finRes) {
    message.value = 'La date de fin doit être après la date de début';
    isSuccess.value = false;
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Récupérer la ressource sélectionnée pour vérification
    const resource = selectedResource.value;
    if (!resource) {
      message.value = 'Erreur: Ressource non trouvée';
      isSuccess.value = false;
      isSubmitting.value = false;
      return;
    }
    
    console.log('🔍 Ressource sélectionnée pour envoi:', resource);
    
    // Préparer les données selon le type
    let requestData = {
      idCli: parseInt(form.idCli),
      typeRes: form.typeRes,
      debRes: new Date(form.debRes).toISOString(),
      finRes: new Date(form.finRes).toISOString(),
      tarifTot: parseFloat(form.tarifTot),
      etatRes: 'En attente',
      dateCre: new Date().toISOString(),
      qteMat: 0,
      nbPerso: 0
    };
    
    // Ajouter les champs spécifiques selon le type
    if (form.typeRes === 'Materiel') {
      requestData.qteMat = parseInt(form.qteMat) || 1;
      requestData.codeMat = form.idCatalogue;
      requestData.nbPerso = 0;
      
      // Vérifier la disponibilité
      if (resource.qteDispo && requestData.qteMat > resource.qteDispo) {
        message.value = `Quantité insuffisante. Disponible: ${resource.qteDispo}`;
        isSuccess.value = false;
        isSubmitting.value = false;
        return;
      }
      
    } else if (form.typeRes === 'Salle') {
      requestData.nbPerso = parseInt(form.nbPerso) || 1;
      requestData.idSalle = form.idCatalogue;
      requestData.qteMat = 0;
      
      // Vérifier la capacité
      if (resource.capacite && requestData.nbPerso > resource.capacite) {
        message.value = `Capacité dépassée. Capacité max: ${resource.capacite} personnes`;
        isSuccess.value = false;
        isSubmitting.value = false;
        return;
      }
    }
    
    console.log('📤 DONNÉES ENVOYÉES AU BACKEND:', JSON.stringify(requestData, null, 2));

    const response = await LocationService.createReservation(requestData);

    console.log('✅ RÉPONSE SERVEUR:', response.data);

    message.value = 'Votre demande de réservation a été envoyée avec succès !';
    isSuccess.value = true;
    
    // Mettre à jour le compteur de demandes en attente
    await fetchPendingRequestsCount();
    
    // Rediriger après succès
    setTimeout(() => {
      router.push({ name: 'DemandesEnAttente' });
    }, 2000);

  } catch (error) {
    console.error('❌ ERREUR DÉTAILLÉE:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
      data: error.response?.data,
      config: error.config
    });
    
    // Messages d'erreur plus clairs
    if (error.response?.status === 400) {
      message.value = 'Données invalides. Veuillez vérifier les informations saisies.';
    } else if (error.response?.status === 409) {
      message.value = 'Conflit: La ressource n\'est pas disponible à cette date.';
    } else if (error.response?.data?.message) {
      message.value = 'Erreur: ' + error.response.data.message;
    } else if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors.map(err => err.message || err).join(', ');
      message.value = `Erreurs de validation: ${errorMessages}`;
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message.value = 'Délai d\'attente dépassé. Veuillez réessayer.';
    } else {
      message.value = 'Erreur lors de l\'envoi de votre demande. Veuillez réessayer.';
    }
    isSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

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
  console.log('🔄 Type changé:', form.typeRes);
});

watch(() => form.idCatalogue, (newId) => {
  if (newId) {
    const resource = selectedResource.value;
    console.log('📌 Ressource sélectionnée:', {
      id: newId,
      resource: resource,
      nom: resource?.nom,
      type: resource?.type
    });
  }
});

watch(() => [form.debRes, form.typeDuree], ([debRes, typeDuree]) => {
  if (!debRes) return;
  
  const startDate = new Date(debRes);
  let endDate = new Date(startDate);
  
  switch (typeDuree) {
    case 'heure':
      endDate.setHours(endDate.getHours() + 1);
      break;
    case 'demi-journee':
      endDate.setHours(endDate.getHours() + 4);
      break;
    case 'Jour':
      endDate.setDate(endDate.getDate() + 1);
      break;
    case 'plus-jours':
      return;
  }
  
  if (typeDuree !== 'plus-jours') {
    form.finRes = endDate.getTime();
  }
});

// Cycle de vie
onMounted(() => {
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
  }
  
  fetchInitialData();
  fetchPendingRequestsCount();
  
  // Définir l'élément de menu actif basé sur la route actuelle
  activeMenuKey.value = 'nouvelle-reservation';
});

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};
</script>

<style scoped>
.full-height-container {
  height: 100vh;
}

/* Sidebar en bleu nuit */
.custom-sidebar {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  background: transparent;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.sidebar-title {
  color: white !important;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Styles pour le menu */
:deep(.custom-menu) {
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
  color: white !important;
  transition: all 0.3s ease;
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
  color: white !important;
  font-weight: 600;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

/* Header amélioré */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
  font-size: 1.5rem;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.custom-tag {
  font-weight: 600;
}

/* Contenu principal */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.bg-light {
  background-color: #f8f9fa !important;
  flex: 1;
  overflow-y: auto;
}

.reservation-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

.reservation-form-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

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

.type-btn {
  padding: 12px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.type-btn:hover {
  transform: translateY(-1px);
}

.duration-btn {
  padding: 10px 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.duration-btn:hover {
  transform: translateY(-1px);
}

.tarif-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%) !important;
  border: 2px solid #007bff !important;
}

.tarif-amount {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

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

/* Scrollbars personnalisées */
.bg-light::-webkit-scrollbar,
.content-scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track,
.content-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb,
.content-scroll-container::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover,
.content-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .reservation-page-container {
    padding: 12px;
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

/* Animation de chargement */
:deep(.spinner-border) {
  vertical-align: middle;
}

/* Support pour le défilement fluide */
.content-scroll-container {
  scroll-behavior: smooth;
}

.type-btn:focus,
.duration-btn:focus,
:deep(.custom-select .n-base-selection:focus),
:deep(.custom-input .n-input:focus),
:deep(.custom-datepicker .n-input:focus) {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  outline: none;
}

/* Styles pour le badge dans le menu */
:deep(.custom-menu .n-menu-item .n-menu-item-content .custom-tag) {
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  min-width: 16px;
}
</style>