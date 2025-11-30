<template>
  <div class="container-fluid py-4">
    <!-- En-tête avec bouton retour -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardFinance" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-exclamation-octagon-fill me-2"></i>
                Suivi des Pénalités et Litiges
              </h1>
              <p class="custom-subtitle">Gestion des retards de paiement et litiges clients</p>
            </div>
             <!-- Menu trois points -->
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

    <!-- Conteneur principal avec scroll -->
    <div class="main-content-wrapper">
      <!-- Statistiques résumées -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-danger h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-danger me-3">
                <i class="bi bi-clock-history text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Total Pénalités</h6>
                <h4 class="mb-0 text-warning">{{ formatCurrency(totalPenalties) }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-warning h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-warning me-3">
                <i class="bi bi-calendar-x text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Dossiers en Retard</h6>
                <h4 class="mb-0 text-warning">{{ penalitesList.length }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-primary h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-primary me-3">
                <i class="bi bi-cash-coin text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Montant Initial Total</h6>
                <h4 class="mb-0 text-info">{{ formatCurrency(totalBaseAmount) }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-success h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-success me-3">
                <i class="bi bi-currency-exchange text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Litiges Actifs</h6>
                <h4 class="mb-0 text-success">{{ litigesActifs.length }}</h4>
              </div>
            </div>
          </n-card>
        </div>
      </div>

      <!-- Carte principale des pénalités -->
      <n-card class="shadow-lg mb-4" title="Détail des Pénalités de Retard">
        <template #header-extra>
          <n-space>
            <n-button type="primary" @click="fetchPenalitesData" class="custom-btn-primary">
              <template #icon>
                <i class="bi bi-arrow-clockwise"></i>
              </template>
              Actualiser
            </n-button>
            <n-tag :type="penalitesList.length > 0 ? 'error' : 'success'" round class="custom-tag">
              {{ penalitesList.length }} dossier(s)
            </n-tag>
          </n-space>
        </template>

        <n-alert type="info" class="mb-3">
          <template #icon>
            <i class="bi bi-percent"></i>
          </template>
          Taux de pénalité appliqué : <strong>1% par jour de retard</strong> sur le montant initial de la location.
        </n-alert>

        <!-- État de chargement -->
        <n-empty v-if="isLoading" description="Chargement des données de pénalités...">
          <template #icon>
            <n-spin size="large" />
          </template>
        </n-empty>

        <!-- Aucune pénalité -->
        <n-empty v-else-if="penalitesList.length === 0" description="Aucune pénalité de retard détectée">
          <template #icon>
            <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
          </template>
        </n-empty>

        <!-- Table des pénalités avec scroll -->
        <div v-else class="table-container">
          <n-data-table
            :columns="penalitesColumns"
            :data="penalitesList"
            :scroll-x="1400"
            :max-height="500"
            virtual-scroll
            class="custom-table"
            :row-class-name="rowClassName"
          />
        </div>
      </n-card>

      <!-- Section Litiges de Location - DÉVELOPPÉE -->
      <n-card class="shadow-lg" title="Gestion des Litiges de Location">
        <template #header-extra>
          <n-space>
            <n-button type="primary" @click="showCreateModal = true" class="custom-btn-primary">
              <template #icon>
                <i class="bi bi-plus-circle"></i>
              </template>
              Nouveau Litige
            </n-button>
            <n-tag :type="litigesActifs.length > 0 ? 'warning' : 'success'" class="custom-tag">
              {{ litigesActifs.length }} actif(s)
            </n-tag>
          </n-space>
        </template>

        <!-- Filtres et recherche -->
        <div class="row mb-4">
          <div class="col-md-6">
            <n-input
              v-model:value="searchLitige"
              placeholder="Rechercher un litige..."
              clearable
            >
              <template #prefix>
                <i class="bi bi-search"></i>
              </template>
            </n-input>
          </div>
          <div class="col-md-3">
            <n-select
              v-model:value="filterStatut"
              :options="statutOptions"
              placeholder="Statut"
              clearable
            />
          </div>
          <div class="col-md-3">
            <n-select
              v-model:value="filterGravite"
              :options="graviteOptions"
              placeholder="Gravité"
              clearable
            />
          </div>
        </div>

        <!-- Liste des litiges -->
        <div v-if="litigesList.length === 0" class="text-center p-5">
          <i class="bi bi-file-earmark-excel" style="font-size: 4rem; color: #6c757d;"></i>
          <h5 class="text-muted mt-3">Aucun litige enregistré</h5>
          <p class="text-muted">Cliquez sur "Nouveau Litige" pour créer votre premier dossier.</p>
        </div>

        <div v-else class="litiges-container">
          <n-list>
            <n-list-item v-for="litige in litigesFiltres" :key="litige.id" class="litige-item">
              <template #prefix>
                <n-tag :type="getGraviteColor(litige.gravite)" round>
                  <i :class="getGraviteIcon(litige.gravite)"></i>
                </n-tag>
              </template>
              
              <template #suffix>
                <n-space>
                  <n-button size="small" @click="editLitige(litige)">
                    <template #icon>
                      <i class="bi bi-pencil"></i>
                    </template>
                    Modifier
                  </n-button>
                  <n-button size="small" type="info" @click="viewLitigeDetails(litige)">
                    <template #icon>
                      <i class="bi bi-eye"></i>
                    </template>
                    Détails
                  </n-button>
                  <n-button 
                    size="small" 
                    :type="litige.statut === 'Résolu' ? 'warning' : 'success'" 
                    @click="toggleStatutLitige(litige)"
                  >
                    <template #icon>
                      <i :class="litige.statut === 'Résolu' ? 'bi bi-arrow-counterclockwise' : 'bi bi-check-circle'"></i>
                    </template>
                    {{ litige.statut === 'Résolu' ? 'Rouvrir' : 'Résoudre' }}
                  </n-button>
                </n-space>
              </template>

              <n-thing :title="litige.titre" :description="`Location #${litige.locationId} - ${litige.client}`">
                <template #avatar>
                  <n-avatar>
                    <i class="bi bi-exclamation-triangle"></i>
                  </n-avatar>
                </template>
                
                <n-space vertical size="small">
                  <n-space>
                    <n-tag :type="getStatutColor(litige.statut)" size="small">
                      {{ litige.statut }}
                    </n-tag>
                    <n-tag :type="getGraviteColor(litige.gravite)" size="small">
                      {{ litige.gravite }}
                    </n-tag>
                    <n-text depth="3">
                      <i class="bi bi-calendar me-1"></i>
                      {{ formatDate(litige.dateCreation) }}
                    </n-text>
                  </n-space>
                  
                  <n-text depth="2">
                    {{ litige.description }}
                  </n-text>
                  
                  <n-space v-if="litige.montantCompensation > 0">
                    <n-text strong>Compensation:</n-text>
                    <n-text type="error">{{ formatCurrency(litige.montantCompensation) }}</n-text>
                  </n-space>
                </n-space>
              </n-thing>
            </n-list-item>
          </n-list>
        </div>

        <!-- Pagination -->
        <div v-if="litigesFiltres.length > 0" class="d-flex justify-content-between align-items-center mt-3">
          <div class="text-muted small">
            Affichage de {{ litigesFiltres.length }} litige(s)
          </div>
          <n-pagination
            v-model:page="currentPage"
            :page-count="Math.ceil(litigesFiltres.length / pageSize)"
            :page-slot="5"
          />
        </div>
      </n-card>
    </div>

    <!-- Modal de création/édition de litige -->
    <n-modal v-model:show="showCreateModal" :mask-closable="false">
      <n-card
        style="width: 600px; max-width: 90vw;"
        :title="editingLitige ? 'Modifier le Litige' : 'Nouveau Litige'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button quaternary circle @click="showCreateModal = false">
            <template #icon>
              <i class="bi bi-x"></i>
            </template>
          </n-button>
        </template>

        <n-form ref="litigeFormRef" :model="litigeForm" :rules="litigeRules">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <n-form-item label="Location ID" path="locationId">
                <n-input
                  v-model:value="litigeForm.locationId"
                  placeholder="ID de la location"
                  :disabled="editingLitige"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Client" path="client">
                <n-input
                  v-model:value="litigeForm.client"
                  placeholder="Nom du client"
                />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-form-item label="Titre du litige" path="titre">
            <n-input
              v-model:value="litigeForm.titre"
              placeholder="Titre descriptif du litige"
            />
          </n-form-item>

          <n-form-item label="Description" path="description">
            <n-input
              v-model:value="litigeForm.description"
              type="textarea"
              placeholder="Description détaillée du litige..."
              :rows="3"
            />
          </n-form-item>

          <n-grid :cols="3" :x-gap="24">
            <n-gi>
              <n-form-item label="Type de litige" path="typeLitige">
                <n-select
                  v-model:value="litigeForm.typeLitige"
                  :options="typeLitigeOptions"
                  placeholder="Sélectionner"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Niveau de gravité" path="gravite">
                <n-select
                  v-model:value="litigeForm.gravite"
                  :options="graviteOptions"
                  placeholder="Sélectionner"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Statut" path="statut">
                <n-select
                  v-model:value="litigeForm.statut"
                  :options="statutOptions"
                  placeholder="Sélectionner"
                />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-form-item label="Montant de compensation" path="montantCompensation">
            <n-input-number
              v-model:value="litigeForm.montantCompensation"
              :min="0"
              :step="1000"
              placeholder="0"
              style="width: 100%"
            >
              <template #suffix>
                <span class="text-muted">Ar</span>
              </template>
            </n-input-number>
          </n-form-item>

          <n-form-item label="Commentaires internes" path="commentaires">
            <n-input
              v-model:value="litigeForm.commentaires"
              type="textarea"
              placeholder="Notes internes..."
              :rows="2"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showCreateModal = false">
              Annuler
            </n-button>
            <n-button 
              type="primary" 
              @click="saveLitige"
              :loading="savingLitige"
            >
              {{ editingLitige ? 'Modifier' : 'Créer' }}
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <!-- Modal de détails du litige -->
    <n-modal v-model:show="showDetailsModal">
      <n-card
        style="width: 700px; max-width: 95vw;"
        :title="`Détails du Litige - ${selectedLitige?.titre}`"
        :bordered="false"
        size="huge"
      >
        <template #header-extra>
          <n-button quaternary circle @click="showDetailsModal = false">
            <template #icon>
              <i class="bi bi-x"></i>
            </template>
          </n-button>
        </template>

        <div v-if="selectedLitige" class="litige-details">
          <n-descriptions label-placement="left" bordered>
            <n-descriptions-item label="Location ID">
              {{ selectedLitige.locationId }}
            </n-descriptions-item>
            <n-descriptions-item label="Client">
              {{ selectedLitige.client }}
            </n-descriptions-item>
            <n-descriptions-item label="Date création">
              {{ formatDate(selectedLitige.dateCreation) }}
            </n-descriptions-item>
            <n-descriptions-item label="Type">
              <n-tag :type="getTypeColor(selectedLitige.typeLitige)">
                {{ selectedLitige.typeLitige }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Gravité">
              <n-tag :type="getGraviteColor(selectedLitige.gravite)">
                <i :class="getGraviteIcon(selectedLitige.gravite)" class="me-1"></i>
                {{ selectedLitige.gravite }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Statut">
              <n-tag :type="getStatutColor(selectedLitige.statut)">
                {{ selectedLitige.statut }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Montant compensation" span="2">
              <n-text v-if="selectedLitige.montantCompensation > 0" type="error" strong>
                {{ formatCurrency(selectedLitige.montantCompensation) }}
              </n-text>
              <n-text v-else depth="3">
                Aucune compensation
              </n-text>
            </n-descriptions-item>
          </n-descriptions>

          <n-card title="Description" class="mt-3" size="small">
            <p>{{ selectedLitige.description }}</p>
          </n-card>

          <n-card v-if="selectedLitige.commentaires" title="Commentaires internes" class="mt-3" size="small">
            <p>{{ selectedLitige.commentaires }}</p>
          </n-card>
        </div>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showDetailsModal = false">
              Fermer
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, h, computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NButton, 
  NCard, 
  NDataTable, 
  NTag, 
  NEmpty, 
  NIcon, 
  NAlert,
  NSpin,
  NSpace,
  NInput,
  NSelect,
  NList,
  NListItem,
  NThing,
  NAvatar,
  NText,
  NModal,
  NForm,
  NFormItem,
  NGrid,
  NGi,
  NDropdown,
  NInputNumber,
  NPagination,
  NDescriptions,
  NDescriptionsItem
} from 'naive-ui';
import FinanceService from '@/services/FinanceService';



const router = useRouter();


// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Facturation',
    key: 'fact',
    icon: () => h('i', { class: 'bi-file-earmark-text' })
  },
  {
    label: 'Suivi des paiements',
    key: 'suiviPaie',
    icon: () => h('i', { class: 'bi-cash-stack' })
  },
  {
    label: 'Rapports $ Synthèses',
    key: 'syntheseRapp',
    icon: () => h('i', { class: 'bi-graph-up' })
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardFinance',
    'fact': '/facturation',
    'suiviPaie': '/suivi',
    'syntheseRapp': '/synthese'
    
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};


// --- Variables d'état ---
const penalitesList = ref([]);
const isLoading = ref(true);
const loading = ref(false);

// --- Variables pour les litiges ---
const litigesList = ref([]);
const showCreateModal = ref(false);
const showDetailsModal = ref(false);
const savingLitige = ref(false);
const editingLitige = ref(null);
const selectedLitige = ref(null);
const searchLitige = ref('');
const filterStatut = ref(null);
const filterGravite = ref(null);
const currentPage = ref(1);
const pageSize = 10;

// --- Formulaire litige ---
const litigeForm = reactive({
  locationId: '',
  client: '',
  titre: '',
  description: '',
  typeLitige: 'Dommage matériel',
  gravite: 'Moyen',
  statut: 'En cours',
  montantCompensation: 0,
  commentaires: ''
});

const litigeFormRef = ref(null);

// --- Options pour les sélecteurs ---
const typeLitigeOptions = [
  { label: 'Dommage matériel', value: 'Dommage matériel' },
  { label: 'Retard de restitution', value: 'Retard de restitution' },
  { label: 'Non-respect conditions', value: 'Non-respect conditions' },
  { label: 'Litige financier', value: 'Litige financier' },
  { label: 'Problème qualité', value: 'Problème qualité' },
  { label: 'Autre', value: 'Autre' }
];

const graviteOptions = [
  { label: 'Faible', value: 'Faible' },
  { label: 'Moyen', value: 'Moyen' },
  { label: 'Élevé', value: 'Élevé' },
  { label: 'Critique', value: 'Critique' }
];

const statutOptions = [
  { label: 'En cours', value: 'En cours' },
  { label: 'En investigation', value: 'En investigation' },
  { label: 'En négociation', value: 'En négociation' },
  { label: 'Résolu', value: 'Résolu' },
  { label: 'Fermé', value: 'Fermé' }
];

// --- Règles de validation ---
const litigeRules = {
  locationId: {
    required: true,
    message: 'L\'ID de location est requis',
    trigger: 'blur'
  },
  client: {
    required: true,
    message: 'Le client est requis',
    trigger: 'blur'
  },
  titre: {
    required: true,
    message: 'Le titre est requis',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: 'La description est requise',
    trigger: 'blur'
  }
};

// --- Propriétés calculées ---
const totalBaseAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.baseAmount || 0), 0);
});

const totalPenalties = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.penaltyAmount || 0), 0);
});

const totalFinalAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.finalAmount || 0), 0);
});

const litigesActifs = computed(() => {
  return litigesList.value.filter(l => l.statut !== 'Résolu' && l.statut !== 'Fermé');
});

const litigesFiltres = computed(() => {
  let filtered = litigesList.value;
  
  if (searchLitige.value) {
    const query = searchLitige.value.toLowerCase();
    filtered = filtered.filter(litige => 
      litige.titre.toLowerCase().includes(query) ||
      litige.client.toLowerCase().includes(query) ||
      litige.locationId.toString().includes(query)
    );
  }
  
  if (filterStatut.value) {
    filtered = filtered.filter(litige => litige.statut === filterStatut.value);
  }
  
  if (filterGravite.value) {
    filtered = filtered.filter(litige => litige.gravite === filterGravite.value);
  }
  
  return filtered;
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const getGraviteColor = (gravite) => {
  const colors = {
    'Faible': 'success',
    'Moyen': 'warning',
    'Élevé': 'error',
    'Critique': 'error'
  };
  return colors[gravite] || 'default';
};

const getGraviteIcon = (gravite) => {
  const icons = {
    'Faible': 'bi bi-info-circle',
    'Moyen': 'bi bi-exclamation-triangle',
    'Élevé': 'bi bi-exclamation-octagon',
    'Critique': 'bi bi-exclamation-diamond'
  };
  return icons[gravite] || 'bi bi-question-circle';
};

const getStatutColor = (statut) => {
  const colors = {
    'En cours': 'info',
    'En investigation': 'warning',
    'En négociation': 'warning',
    'Résolu': 'success',
    'Fermé': 'default'
  };
  return colors[statut] || 'default';
};

const getTypeColor = (type) => {
  const colors = {
    'Dommage matériel': 'error',
    'Retard de restitution': 'warning',
    'Non-respect conditions': 'warning',
    'Litige financier': 'error',
    'Problème qualité': 'info',
    'Autre': 'default'
  };
  return colors[type] || 'default';
};

// --- Gestion des litiges ---
const createLitige = () => {
  editingLitige.value = null;
  Object.assign(litigeForm, {
    locationId: '',
    client: '',
    titre: '',
    description: '',
    typeLitige: 'Dommage matériel',
    gravite: 'Moyen',
    statut: 'En cours',
    montantCompensation: 0,
    commentaires: ''
  });
  showCreateModal.value = true;
};

const editLitige = (litige) => {
  editingLitige.value = litige.id;
  Object.assign(litigeForm, { ...litige });
  showCreateModal.value = true;
};

const saveLitige = async () => {
  try {
    savingLitige.value = true;
    
    if (editingLitige.value) {
      // Modification
      const index = litigesList.value.findIndex(l => l.id === editingLitige.value);
      if (index !== -1) {
        litigesList.value[index] = {
          ...litigesList.value[index],
          ...litigeForm,
          dateModification: new Date().toISOString()
        };
      }
    } else {
      // Création
      const newLitige = {
        id: Date.now(),
        ...litigeForm,
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString()
      };
      litigesList.value.unshift(newLitige);
    }
    
    showCreateModal.value = false;
    alert(editingLitige.value ? 'Litige modifié avec succès' : 'Litige créé avec succès');
    
  } catch (error) {
    console.error('Erreur sauvegarde litige:', error);
    alert('Erreur lors de la sauvegarde');
  } finally {
    savingLitige.value = false;
  }
};

const viewLitigeDetails = (litige) => {
  selectedLitige.value = litige;
  showDetailsModal.value = true;
};

const toggleStatutLitige = (litige) => {
  const newStatut = litige.statut === 'Résolu' ? 'En cours' : 'Résolu';
  litige.statut = newStatut;
  litige.dateModification = new Date().toISOString();
  
  alert(`Litige marqué comme "${newStatut}"`);
};

// --- Colonnes pour le tableau des pénalités ---
const penalitesColumns = [
  {
    title: 'ID Location',
    key: 'id',
    width: 120,
    sorter: (a, b) => a.id - b.id,
    render: (row) => h('span', { class: 'fw-bold' }, `LO-${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'fw-semibold' }, row.client),
      h('div', { class: 'text-muted small' }, row.email || 'Email non disponible')
    ])
  },
  {
    title: 'Jours de Retard',
    key: 'daysLate',
    width: 130,
    sorter: (a, b) => a.daysLate - b.daysLate,
    render: (row) => {
      const getTagType = (days) => {
        if (days <= 3) return 'warning';
        if (days <= 7) return 'error';
        return 'error';
      };
      
      return h(NTag, { 
        type: getTagType(row.daysLate),
        size: 'small',
        class: 'custom-tag'
      }, { default: () => `${row.daysLate} jours` });
    }
  },
  {
    title: 'Montant Initial',
    key: 'baseAmount',
    width: 150,
    sorter: (a, b) => parseFloat(a.baseAmount) - parseFloat(b.baseAmount),
    render: (row) => h('span', { class: 'text-dark fw-semibold' }, formatCurrency(parseFloat(row.baseAmount)))
  },
  {
    title: 'Taux Pénalité',
    key: 'penaltyRate',
    width: 120,
    render: () => h('span', { class: 'text-info fw-semibold' }, '1% / jour')
  },
  {
    title: 'Frais de Retard',
    key: 'penaltyAmount',
    width: 150,
    sorter: (a, b) => parseFloat(a.penaltyAmount) - parseFloat(b.penaltyAmount),
    render: (row) => {
      const penalty = parseFloat(row.penaltyAmount || 0);
      return h('div', [
        h('span', { class: 'text-warning fw-bold' }, formatCurrency(penalty)),
        penalty > 0 ? h('div', { class: 'text-muted small' }, `${(penalty / parseFloat(row.baseAmount) * 100).toFixed(1)}% du montant initial`) : null
      ]);
    }
  },
  {
    title: 'Total à Payer',
    key: 'finalAmount',
    width: 160,
    sorter: (a, b) => parseFloat(a.finalAmount) - parseFloat(b.finalAmount),
    render: (row) => h('span', { class: 'text-success fw-bold' }, formatCurrency(parseFloat(row.finalAmount)))
  },
  {
    title: 'Détails Calcul',
    key: 'calculation',
    width: 200,
    render: (row) => {
      const base = parseFloat(row.baseAmount || 0);
      const penalty = parseFloat(row.penaltyAmount || 0);
      const days = row.daysLate || 0;
      
      return h('div', { class: 'small text-muted' }, [
        h('div', `Base: ${formatCurrency(base)}`),
        h('div', `Pénalité (${days}j): ${formatCurrency(penalty)}`),
        h('div', { class: 'fw-semibold' }, `Total: ${formatCurrency(base + penalty)}`)
      ]);
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'd-flex gap-2' }, [
        h(NButton, {
          type: 'warning',
          size: 'small',
          class: 'custom-btn-warning',
          onClick: () => sendReminderEmail(row),
          loading: loading.value
        }, {
          default: () => 'Relance',
          icon: () => h('i', { class: 'bi bi-bell' })
        }),
        h(NButton, {
          type: 'info',
          size: 'small',
          class: 'custom-btn-primary',
          ghost: true,
          onClick: () => viewDetails(row.id)
        }, {
          default: () => 'Détails',
          icon: () => h('i', { class: 'bi bi-eye' })
        })
      ]);
    }
  }
];

const rowClassName = (row, index) => {
  return row.daysLate > 7 ? 'table-row-critical' : 'table-row-warning';
};

// --- Logique d'appel API ---
const fetchPenalitesData = async () => {
  isLoading.value = true;
  try {
    console.log('🔄 Chargement des données de pénalités...');
    const response = await FinanceService.getPenalitesData();
    
    penalitesList.value = response.data.map(item => ({
      id: item.id,
      client: item.client,
      email: item.email,
      telephone: item.telephone,
      daysLate: item.daysLate || 0,
      baseAmount: item.baseAmount || 0,
      penaltyAmount: item.penaltyAmount || 0,
      finalAmount: item.finalAmount || 0,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      typeLocation: item.typeLocation,
      statutPaiement: item.statutPaiement
    }));

    console.log(`✅ ${penalitesList.value.length} pénalités chargées depuis la base de données`);
    
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données de pénalités:", error);
    alert("Erreur de chargement des pénalités");
    penalitesList.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fonction d'envoi de rappel CORRIGÉE (sans useMessage)
const sendReminderEmail = async (location) => {
  try {
    loading.value = true;
    
    console.log('📧 Envoi rappel pour location:', location);

    // Préparer les données REQUISES
    const requestData = {
      locationId: location.id,
      clientData: {
        name: location.client,
        email: location.email,
        amount: location.finalAmount,
        phone: location.telephone
      }
    };

    // Validation côté frontend
    if (!requestData.locationId) {
      alert('ID de location manquant');
      return;
    }

    if (!requestData.clientData.email) {
      alert('Email du client manquant');
      return;
    }

    console.log('📤 Envoi rappel avec données:', requestData);

    const response = await FinanceService.sendPenaltyReminder(requestData);
    
    if (response.data.success) {
      alert(`✅ Rappel envoyé à ${requestData.clientData.name}`);
    } else {
      throw new Error(response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur envoi rappel:', error);
    
    if (error.response?.status === 400) {
      alert('❌ Données invalides: ' + (error.response.data.message || 'Vérifiez les informations du client'));
    } else if (error.response?.status === 404) {
      alert('❌ Location non trouvée');
    } else {
      alert('❌ Erreur lors de l\'envoi du rappel: ' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

const viewDetails = (locationId) => {
  const location = penalitesList.value.find(item => item.id === locationId);
  if (location) {
    const details = `
Détails de la location #${locationId}:

Client: ${location.client}
Email: ${location.email || 'Non renseigné'}
Téléphone: ${location.telephone || 'Non renseigné'}
Type: ${location.typeLocation || 'Non spécifié'}
Date début: ${new Date(location.dateDebut).toLocaleDateString('fr-FR')}
Date fin: ${new Date(location.dateFin).toLocaleDateString('fr-FR')}
Jours de retard: ${location.daysLate} jours
Montant initial: ${formatCurrency(location.baseAmount)}
Frais de retard (1%/jour): ${formatCurrency(location.penaltyAmount)}
Total à payer: ${formatCurrency(location.finalAmount)}
Statut: ${location.statutPaiement}
    `;
    alert(details);
  }
};

// --- Initialisation ---
onMounted(() => {
  fetchPenalitesData();
  
  // Charger les litiges depuis le localStorage (simulation)
  const savedLitiges = localStorage.getItem('litiges');
  if (savedLitiges) {
    litigesList.value = JSON.parse(savedLitiges);
  }
});

// Sauvegarder les litiges dans le localStorage quand ils changent
watch(litigesList, (newVal) => {
  localStorage.setItem('litiges', JSON.stringify(newVal));
}, { deep: true });
</script>

<style scoped>
/* COULEURS ORIGINALES */

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
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Conteneur principal avec scroll */
.main-content-wrapper {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Scrollbar personnalisée pour le conteneur principal */
.main-content-wrapper::-webkit-scrollbar {
  width: 10px;
}

.main-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
  border: 2px solid #f1f1f1;
}

.main-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Pour Firefox */
.main-content-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Cartes avec couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, black 0%, black 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, gray 0%, gray 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

/* Icônes avec fond original */
.custom-icon-primary, 
.custom-icon-danger, 
.custom-icon-success,
.custom-icon-warning {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Boutons */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.custom-btn-warning {
  background: #ffc107;
  border-color: #ffc107;
}

/* Conteneur de table avec scroll */
.table-container {
  max-height: 500px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 100%;
}

/* Styles pour le scroll personnalisé */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Styles pour les lignes critiques */
:deep(.table-row-critical) {
  background-color: #f8d7da !important;
}

:deep(.table-row-warning) {
  background-color: #fff3cd !important;
}

/* Amélioration du scroll pour la table Naive UI */
:deep(.n-data-table) {
  --n-scrollbar-width: 8px;
  --n-scrollbar-height: 8px;
}

:deep(.n-data-table-base-table-body) {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* Styles spécifiques aux litiges */
.litiges-container {
  max-height: 600px;
  overflow-y: auto;
}

.litige-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
}

.litige-item:last-child {
  border-bottom: none;
}

.litige-details {
  max-height: 70vh;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-danger, 
  .custom-icon-success,
  .custom-icon-warning {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .table-container {
    max-height: 400px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 160px);
    padding-right: 5px;
  }

  .litige-item {
    padding: 12px 0;
  }
  
  :deep(.n-thing) {
    padding: 8px 0;
  }
}

@media (max-width: 576px) {
  .table-container {
    max-height: 350px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 140px);
  }
}

/* Styles pour les tables */
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.d-flex.gap-2 {
  gap: 8px;
}

/* Amélioration de l'apparence du scroll virtuel */
:deep(.n-data-table .n-data-table-base-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.n-data-table .n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

/* Effet de survol amélioré */
:deep(.n-data-table .n-data-table-tr:hover .n-data-table-td) {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

/* Animation de chargement pour le scroll */
.main-content-wrapper {
  scroll-behavior: smooth;
}

/* Ombre pour indiquer le défilement */
.main-content-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.05));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-content-wrapper.scrolling::after {
  opacity: 1;
}

/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

</style>