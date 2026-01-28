

<template>
  <div class="container-fluid py-4">
    <!-- EN-TÊTE AMÉLIORÉE -->
    <div class="page-header mb-4">
      <div class="header-container p-4 rounded-4 shadow-sm">
        <!-- Première ligne : Titre principal et badge -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon-container">
              <i class="bi bi-tools header-icon"></i>
            </div>
            <div>
              <h1 class="header-title mb-0"> Matériel CEDII</h1>
              <p class="header-subtitle mb-0 text-muted">Inventaire complet et gestion des équipements</p>
            </div>
          </div>
          
          <n-tag type="info" size="large" class="custom-tag">
            <template #icon>
              <n-icon>
                <i class="bi bi-box-seam"></i>
              </n-icon>
            </template>
            {{ statistiques.total }} équipements
          </n-tag>
        </div>
        
      
        
        <!-- Troisième ligne : Actions principales -->
        <div class="header-actions mt-4 pt-3 border-top">
          <div class="row g-3 align-items-center">
            <div class="col-md-8">
              <div class="d-flex gap-3">
                <n-button type="primary" size="small" class="action-btn" @click="openModal('add')">
                  <template #icon>
                    <i class="bi bi-plus-circle"></i>
                  </template>
                  Ajouter un équipement
                </n-button>
                <n-button type="info" ghost size="small" class="action-btn" @click="fetchMateriel">
                  <template #icon>
                    <i class="bi bi-arrow-clockwise"></i>
                  </template>
                  Actualiser
                </n-button>
             
              </div>
            </div>
            <div class="col-md-4">
              <div class="d-flex justify-content-end gap-2">
                <n-text depth="3" class="small">
                  <i class="bi bi-clock me-1"></i>
                  Dernière mise à jour : {{ lastUpdate }}
                </n-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertes compactes -->
    <n-alert v-if="message" :type="isError ? 'error' : 'success'" class="mb-4" closable @close="message = ''">
      <div class="d-flex align-items-center">
        <i :class="`bi ${isError ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`"></i>
        <div class="flex-grow-1">{{ message }}</div>
        <n-button size="tiny" text @click="message = ''">
          <i class="bi bi-x"></i>
        </n-button>
      </div>
    </n-alert>

    <!-- SECTION FILTRES EN HAUT -->
    <div class="filters-section mb-4">
      <n-card class="shadow-sm">
        <template #header>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-funnel"></i>
            <span class="fw-semibold">Filtres de recherche</span>
          </div>
        </template>
        
        <div class="row g-3">
          <div class="col-md-3">
            <n-form-item label="État" size="small">
              <n-select
                v-model:value="filters.etatMat"
                placeholder="Tous les états"
                :options="etatOptions"
                clearable
              />
            </n-form-item>
          </div>
          
          <div class="col-md-3">
            <n-form-item label="Catégorie" size="small">
              <n-select
                v-model:value="filters.categorieMat"
                placeholder="Toutes catégories"
                :options="categorieOptions"
                clearable
              />
            </n-form-item>
          </div>
          
          <div class="col-md-4">
            <n-form-item label="Recherche" size="small">
              <n-input
                v-model:value="filters.search"
                placeholder="Rechercher par code, désignation, description..."
                clearable
              >
                <template #prefix>
                  <i class="bi bi-search"></i>
                </template>
              </n-input>
            </n-form-item>
          </div>
          
          <div class="col-md-2">
            <n-form-item label="Actions" size="small">
              <div class="d-flex gap-2">
                <n-button @click="resetFilters" size="small" ghost class="w-100">
                  <template #icon>
                    <i class="bi bi-arrow-clockwise"></i>
                  </template>
                  Réinitialiser
                </n-button>
              </div>
            </n-form-item>
          </div>
        </div>
        
        <!-- Indicateurs de filtres actifs -->
        <div v-if="hasActiveFilters" class="mt-3 pt-3 border-top">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-funnel-fill text-primary"></i>
            <span class="small text-muted">Filtres actifs :</span>
            <n-tag v-if="filters.etatMat" size="small" type="info" closable @close="filters.etatMat = null">
              État: {{ filters.etatMat }}
            </n-tag>
            <n-tag v-if="filters.categorieMat" size="small" type="info" closable @close="filters.categorieMat = null">
              Catégorie: {{ filters.categorieMat }}
            </n-tag>
            <n-tag v-if="filters.search" size="small" type="info" closable @close="filters.search = ''">
              Recherche: "{{ filters.search }}"
            </n-tag>
          </div>
        </div>
        
        <template #footer>
          <div class="d-flex justify-content-between align-items-center">
            <n-text depth="3" class="small">
              <i class="bi bi-info-circle me-1"></i>
              {{ filteredMateriel.length }} équipement(s) trouvé(s)
            </n-text>
            
          </div>
        </template>
      </n-card>
    </div>

    <!-- TABLEAU PRINCIPAL - PREND TOUT L'ESPACE -->
    <n-card class="main-card shadow-sm">
      <template #header>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="d-flex align-items-center gap-2">
              <div class="card-icon">
                <i class="bi bi-table"></i>
              </div>
              <div>
                <h3 class="card-title mb-0">Inventaire des Équipements</h3>
                <p class="card-subtitle text-muted mb-0">
                  {{ filteredMateriel.length }} équipement(s) - {{ totalStock }} unités totales
                </p>
              </div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <n-button type="success" secondary size="small" @click="openQuickAdd">
              <template #icon>
                <n-icon><i class="bi bi-lightning"></i></n-icon>
              </template>
              Ajout rapide
            </n-button>
          </div>
        </div>
      </template>

      <div class="table-container">
        <n-data-table
          :columns="columns"
          :data="filteredMateriel"
          :pagination="pagination"
          size="small"
          :bordered="false"
          :row-class-name="getRowClass"
          virtual-scroll
          :max-height="550"
        />
      </div>

      <template #footer>
        <div class="d-flex justify-content-between align-items-center">
          <n-text depth="3" class="small">
            <i class="bi bi-box-seam me-1"></i>
            Total stock : {{ totalStock }} unités
          </n-text>
          <div class="d-flex gap-3">
            <n-text depth="3" class="small">
              <i class="bi bi-check-circle text-success me-1"></i>
              Disponible : {{ statistiques.disponibles }}
            </n-text>
            
          </div>
        </div>
      </template>
    </n-card>

    <!-- Modal Ajout/Modification compact -->
    <n-modal v-model:show="showMaterielModal" transform-origin="center">
      <n-card
        :style="{ width: '600px', maxWidth: '95vw' }"
        :title="isEditMode ? 'Modifier le Matériel' : 'Nouveau Matériel'"
        :bordered="false"
        size="small"
        role="dialog"
      >
        <template #header-extra>
          <n-button type="error" text @click="showMaterielModal = false" size="small">
            <i class="bi bi-x-lg"></i>
          </n-button>
        </template>

        <n-form ref="formRef" :model="currentMateriel" :rules="rules" size="small">
          <div class="row g-2">
            <!-- Informations de base -->
            <div class="col-12">
              <n-form-item label="Désignation" path="designationMat">
                <n-input v-model:value="currentMateriel.designationMat" placeholder="Nom du matériel" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Catégorie" path="categorieMat">
                <n-input v-model:value="currentMateriel.categorieMat" placeholder="Type de matériel" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="État" path="etatMat">
                <n-select
                  v-model:value="currentMateriel.etatMat"
                  :options="etatOptions.filter(opt => opt.value !== null)"
                />
              </n-form-item>
            </div>

            <!-- Quantités -->
            <div class="col-12">
              <n-divider class="my-1">Quantités</n-divider>
            </div>

            <div class="col-4">
              <n-form-item label="Stock Total" path="qteActuelStock"> 
                <n-input-number
                v-model:value="currentMateriel.qteActuelStock"
                :min="1"
                :show-button="false"
                @update:value="onQuantityInput" />
              </n-form-item>
            </div>

            <div class="col-4">
              <n-form-item label="Disponible" path="qteTotDispo"> 
                <n-input-number
                v-model:value="currentMateriel.qteTotDispo"
                :min="0"
                :max="currentMateriel.qteActuelStock - currentMateriel.qteEnLocation"
                :show-button="false"
                :disabled="currentMateriel.qteEnLocation > 0"
                @update:value="onQuantityInput"
                />
              </n-form-item>
            </div>

            <div class="col-4">
              <n-form-item label="En location" path="qteEnLocation">
                <n-input-number
                  v-model:value="currentMateriel.qteEnLocation"
                  :min="0"
                  :max="currentMateriel.qteActuelStock"
                  :show-button="false"
                  @update:value="onQuantityInput"
                />
              </n-form-item>
            </div>

            <!-- Alertes de quantité -->
            <div class="col-12" v-if="quantityWarning">
              <n-alert type="warning" size="small" class="py-1">
                <i class="bi bi-exclamation-triangle me-1"></i>{{ quantityWarning }}
              </n-alert>
            </div>

            <!-- Tarifs -->
            <div class="col-12">
              <n-divider class="my-1">Tarifs (MGA)</n-divider>
            </div>

            <div class="col-4">
              <n-form-item label="Heure" path="tarifHeure">
                <n-input-number
                  v-model:value="currentMateriel.tarifHeure"
                  :min="0"
                  :step="100"
                  :show-button="false"
                />
              </n-form-item>
            </div>

            <div class="col-4">
              <n-form-item label="½ Journée" path="tarifDemiJournee">
                <n-input-number
                  v-model:value="currentMateriel.tarifDemiJournee"
                  :min="0"
                  :step="100"
                  :show-button="false"
                />
              </n-form-item>
            </div>

            <div class="col-4">
              <n-form-item label="Jour" path="tarifJour">
                <n-input-number
                  v-model:value="currentMateriel.tarifJour"
                  :min="0"
                  :step="100"
                  :show-button="false"
                />
              </n-form-item>
            </div>

            <!-- Date et Description -->
            <div class="col-6">
              <n-form-item label="Date acquisition" path="dateAcquisition">
                <n-date-picker
                  v-model:value="currentMateriel.dateAcquisition"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </n-form-item>
            </div>

            <div class="col-12">
              <n-form-item label="Description">
                <n-input
                  v-model:value="currentMateriel.descriptionMat"
                  type="textarea"
                  :rows="2"
                  placeholder="Description du matériel..."
                />
              </n-form-item>
            </div>
          </div>
        </n-form>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showMaterielModal = false">Annuler</n-button>
            <n-button 
              type="primary" 
              size="small" 
              @click="saveMateriel" 
              :loading="isLoading"
              :disabled="hasQuantityError"
            >
              {{ isEditMode ? 'Sauvegarder' : 'Ajouter' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>


    <!-- Modal de confirmation de suppression -->
    <n-modal v-model:show="showDeleteModal" transform-origin="center">
      <n-card
        :style="{ width: '400px', maxWidth: '90vw' }"
        :title="`Supprimer le matériel`"
        :bordered="false"
        size="small"
      >
        <div class="text-center">
          <i class="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3 d-block"></i>
          <h5>Êtes-vous sûr de vouloir supprimer ?</h5>
          <p class="text-muted">
            Matériel : <strong>{{ materialToDelete?.codeMat }}</strong><br>
            {{ materialToDelete?.designationMat }}
          </p>
          <div v-if="materialToDelete?.qteEnLocation > 0" class="alert alert-warning py-2">
            <i class="bi bi-exclamation-circle me-2"></i>
            Attention : {{ materialToDelete?.qteEnLocation }} unité(s) en location
          </div>
        </div>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showDeleteModal = false">Annuler</n-button>
            <n-button type="error" size="small" @click="confirmDelete">
              <i class="bi bi-trash me-1"></i>Supprimer
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { 
  NCard, 
  NButton, 
  NDataTable, 
  NTag,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NDatePicker,
  NAlert,
  NDivider,
  NSpin,
  NText,
  NIcon
} from 'naive-ui';
import MaterielService from '../services/MaterielService';

// États
const materiels = ref([]);
const currentMateriel = ref({});
const historiqueEmprunt = ref([]);
const isEditMode = ref(false);
const isLoading = ref(false);
const historiqueLoading = ref(false);
const showMaterielModal = ref(false);
const showHistoriqueModal = ref(false);
const showEtatModal = ref(false);
const showDeleteModal = ref(false);
const quantityWarning = ref('');
const hasQuantityError = ref(false);
const message = ref('');
const isError = ref(false);
const materialToDelete = ref(null);

// Filtres
const filters = ref({
  etatMat: null,
  categorieMat: null,
  search: ''
});

// Données pour changement d'état
const etatData = ref({
  etatMat: '',
  notes: ''
});

// Options pour les sélecteurs
const etatOptions = [
  { label: 'Tous les états', value: null },
  { label: 'Neuf', value: 'Neuf' },
  { label: 'Bon état', value: 'Bon état' },
  { label: 'Endommagé', value: 'Endommagé' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Hors-Service', value: 'Hors-Service' }
];

const categorieOptions = ref([{ label: 'Toutes les catégories', value: null }]);

// Propriétés calculées améliorées
const statistiques = computed(() => {
  const filtered = filteredMateriel.value;
  return {
    total: filtered.length,
    disponibles: filtered.filter(mat => mat.etatMat === 'Bon état' && mat.qteTotDispo > 0).length,
    enLocation: filtered.reduce((sum, mat) => sum + (mat.qteEnLocation || 0), 0),
    maintenance: filtered.filter(mat => ['Maintenance', 'Endommagé', 'Hors-Service'].includes(mat.etatMat)).length
  };
});

const valeurTotale = computed(() => {
  return filteredMateriel.value.reduce((sum, mat) => {
    return sum + ((mat.tarifJour || 0) * (mat.qteActuelStock || 0) * 30);
  }, 0);
});

const tauxUtilisation = computed(() => {
  const total = filteredMateriel.value.reduce((sum, mat) => sum + (mat.qteActuelStock || 0), 0);
  const enLocation = filteredMateriel.value.reduce((sum, mat) => sum + (mat.qteEnLocation || 0), 0);
  
  if (total === 0) return 0;
  return Math.round((enLocation / total) * 100);
});

const totalStock = computed(() => {
  return filteredMateriel.value.reduce((sum, mat) => sum + (mat.qteActuelStock || 0), 0);
});

const lastUpdate = computed(() => {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
});

const hasActiveFilters = computed(() => {
  return filters.value.etatMat || filters.value.categorieMat || filters.value.search;
});

const filteredMateriel = computed(() => {
  if (!materiels.value || !Array.isArray(materiels.value)) return [];

  let filtered = [...materiels.value];

  if (filters.value.etatMat) {
    filtered = filtered.filter(mat => mat.etatMat === filters.value.etatMat);
  }

  if (filters.value.categorieMat) {
    filtered = filtered.filter(mat => mat.categorieMat === filters.value.categorieMat);
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    filtered = filtered.filter(mat => 
      (mat.codeMat && mat.codeMat.toLowerCase().includes(searchLower)) ||
      (mat.designationMat && mat.designationMat.toLowerCase().includes(searchLower)) ||
      (mat.descriptionMat && mat.descriptionMat.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
});

// Règles de validation
const rules = {
  designationMat: { required: true, message: 'La désignation est requise', trigger: 'blur' },
  qteActuelStock: { 
    required: true, 
    type: 'number', 
    min: 1, 
    message: 'Le stock total doit être au moins de 1', 
    trigger: 'blur' 
  },
  qteTotDispo: { 
    required: true, 
    type: 'number', 
    min: 0, 
    message: 'La quantité disponible ne peut pas être négative', 
    trigger: 'blur' 
  },
  qteEnLocation: { 
    required: true, 
    type: 'number', 
    min: 0, 
    message: 'La quantité en location ne peut pas être négative', 
    trigger: 'blur' 
  },
  tarifHeure: { required: true, type: 'number', min: 0, message: 'Le tarif horaire est requis', trigger: 'blur' },
  tarifDemiJournee: { required: true, type: 'number', min: 0, message: 'Le tarif demi-journée est requis', trigger: 'blur' },
  tarifJour: { required: true, type: 'number', min: 0, message: 'Le tarif journalier est requis', trigger: 'blur' },
  etatMat: { required: true, message: "L'état est requis", trigger: 'change' },
  dateAcquisition: { required: true, message: "La date d'acquisition est requise", trigger: 'change' }
};

// Colonnes du tableau principal avec boutons améliorés
const columns = [
  {
    title: 'Code',
    key: 'codeMat',
    width: 160,
    fixed: 'left',
    render: (row) => h('div', { class: 'd-flex align-items-center gap-1' }, [
      h('i', { class: 'bi bi-box text-primary' }),
      h('span', { class: 'fw-bold text-primary' }, row.codeMat)
    ])
  },
  {
    title: 'Désignation',
    key: 'designationMat',
    ellipsis: { tooltip: true },
    width: 180
  },
  {
    title: 'Catégorie',
    key: 'categorieMat',
    width: 130,
    render: (row) => row.categorieMat ? 
      h(NTag, { type: 'info', size: 'small' }, { default: () => row.categorieMat }) : 
      h('span', { class: 'text-muted' }, '-')
  },
  {
    title: 'Description',
    key: 'descriptionMat',
    width: 160,
    ellipsis: { tooltip: true },
    render: (row) => h('span', { class: 'small' }, row.descriptionMat || '-')
  },
  {
    title: 'État',
    key: 'etatMat',
    width: 100,
    fixed: 'left',
    render: (row) => {
      const type = getEtatType(row.etatMat);
      const short = getEtatShort(row.etatMat);
      return h(NTag, { 
        type,
        size: 'small',
        round: true,
        class: 'fw-bold'
      }, { default: () => short });
    }
  },
  {
    title: 'Quantités',
    key: 'quantites',
    width: 140,
    render: (row) => h('div', { class: 'quantities-container' }, [
      // Stock Total
      h('div', { class: 'quantity-row' }, [
        h('span', { class: 'quantity-label' }, 'Stock:'),
        h('span', { 
          class: row.qteActuelStock <= 2 ? 'quantity-value text-danger fw-bold' : 'quantity-value text-primary fw-bold' 
        }, row.qteActuelStock)
      ]),
      // Disponible
      h('div', { class: 'quantity-row' }, [
        h('span', { class: 'quantity-label' }, 'Dispo:'),
        h('span', { 
          class: row.qteTotDispo === 0 ? 'quantity-value text-danger fw-bold' : 'quantity-value text-success fw-bold' 
        }, row.qteTotDispo)
      ]),
      // En location
      h('div', { class: 'quantity-row' }, [
        h('span', { class: 'quantity-label' }, 'Loc:'),
        h('span', { 
          class: row.qteEnLocation > 0 ? 'quantity-value text-warning fw-bold' : 'quantity-value' 
        }, row.qteEnLocation)
      ])
    ])
  },
  {
    title: 'Tarifs (Ar)',
    key: 'tarifs',
    width: 150,
    render: (row) => h('div', { class: 'tarifs-container' }, [
      h('div', { class: 'tarif-row' }, [
        h('span', { class: 'tarif-label' }, 'Heure:'),
        h('span', { class: 'tarif-value fw-bold text-success' }, formatCurrency(row.tarifHeure))
      ]),
      h('div', { class: 'tarif-row' }, [
        h('span', { class: 'tarif-label' }, 'Jour:'),
        h('span', { class: 'tarif-value fw-bold text-primary' }, formatCurrency(row.tarifJour))
      ])
    ])
  },
  {
    title: 'Date Acquisition',
    key: 'dateAcquisition',
    width: 120,
    render: (row) => h('div', { class: 'date-container' }, [
      h('i', { class: 'bi bi-calendar text-muted me-1' }),
      h('span', { class: 'small' }, formatDate(row.dateAcquisition))
    ])
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'actions-container' }, [
        // Bouton Modifier
        h(NButton, {
          size: 'small',
          type: 'primary',
          quaternary: true,
          circle: true,
          onClick: () => openModal('edit', row),
          class: 'action-btn edit-btn',
          title: 'Modifier'
        }, {
          default: () => h('i', { class: 'bi bi-pencil' })
        }),
       
       
        // Bouton Supprimer
        h(NButton, {
          size: 'small',
          type: 'error',
          quaternary: true,
          circle: true,
          onClick: () => openDeleteModal(row),
          class: 'action-btn delete-btn',
          title: 'Supprimer'
        }, {
          default: () => h('i', { class: 'bi bi-trash' })
        })
      ]);
    }
  }
];

// Colonnes pour l'historique
const historiqueColumns = [
  { title: 'Réservation', key: 'idRes', width: 80, render: (row) => `#${row.idRes}` },
  { title: 'Date Début', key: 'debLo', width: 140, render: (row) => formatDateTime(row.debLo) },
  { title: 'Date Fin', key: 'finLo', width: 140, render: (row) => formatDateTime(row.finLo) },
  { 
    title: 'Retard', 
    key: 'dureeRetardHeures', 
    width: 80,
    render: (row) => row.dureeRetardHeures > 0 
      ? h(NTag, { type: 'error', size: 'small' }, { default: () => `${row.dureeRetardHeures}h` })
      : h(NTag, { type: 'success', size: 'small' }, { default: () => 'À l\'heure' })
  },
  { title: 'Frais', key: 'fraisRetard', width: 100, render: (row) => formatCurrency(row.fraisRetard) }
];

const pagination = { pageSize: 15 };

// Cycle de vie
onMounted(() => {
  fetchMateriel();
});

// Fonctions principales
async function fetchMateriel() {
  try {
    isLoading.value = true;
    const response = await MaterielService.getAllMateriel();
    materiels.value = Array.isArray(response) ? response : (response.data || []);
    updateCategories();
    showMessage('Données chargées avec succès', false);
  } catch (error) {
    console.error("Erreur de chargement:", error);
    showMessage("Erreur de chargement du matériel", true);
  } finally {
    isLoading.value = false;
  }
}

async function saveMateriel() {
  if (hasQuantityError.value) {
    showMessage("Veuillez corriger les erreurs de quantité", true);
    return;
  }

  isLoading.value = true;
  try {
    const materielData = {
      ...currentMateriel.value,
      qteTotDispo: Number(currentMateriel.value.qteTotDispo) || 0,
      qteActuelStock: Number(currentMateriel.value.qteActuelStock) || 0,
      qteEnLocation: Number(currentMateriel.value.qteEnLocation) || 0,
      qteMat: Number(currentMateriel.value.qteActuelStock) || 0
    };

    if (isEditMode.value) {
      await MaterielService.updateMateriel(currentMateriel.value.codeMat, materielData);
      showMessage('Matériel modifié avec succès', false);
    } else {
      const { codeMat, ...newMaterielData } = materielData;
      await MaterielService.createMateriel(newMaterielData);
      showMessage('Matériel ajouté avec succès', false);
    }
    await fetchMateriel();
    showMaterielModal.value = false;
  } catch (error) {
    showMessage("Erreur de sauvegarde: " + (error.response?.data?.message || error.message), true);
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(material) {
  materialToDelete.value = material;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!materialToDelete.value) return;
  
  try {
    await MaterielService.deleteMateriel(materialToDelete.value.codeMat);
    showMessage('Matériel supprimé avec succès', false);
    await fetchMateriel();
  } catch (error) {
    showMessage("Erreur de suppression: " + (error.response?.data?.message || error.message), true);
  } finally {
    showDeleteModal.value = false;
    materialToDelete.value = null;
  }
}

async function openHistorique(codeMat) {
  historiqueLoading.value = true;
  try {
    const response = await MaterielService.getHistoriqueEmprunt(codeMat);
    historiqueEmprunt.value = response.data || [];
    showHistoriqueModal.value = true;
  } catch (error) {
    showMessage("Erreur de chargement de l'historique", true);
  } finally {
    historiqueLoading.value = false;
  }
}

async function updateEtatMateriel() {
  try {
    await MaterielService.updateEtatMateriel(currentMateriel.value.codeMat, etatData.value);
    showMessage('État mis à jour avec succès', false);
    await fetchMateriel();
    showEtatModal.value = false;
  } catch (error) {
    showMessage("Erreur de mise à jour de l'état", true);
  }
}

// Gestion des quantités
function updateQuantities() {
  const total = Number(currentMateriel.value.qteActuelStock) || 0;
  const dispo = Number(currentMateriel.value.qteTotDispo) || 0;
  const location = Number(currentMateriel.value.qteEnLocation) || 0;
  
  if (dispo + location > total) {
    quantityWarning.value = 'Erreur: La somme (Disponible + En location) est supérieure au Stock Total.';
    hasQuantityError.value = true;
  } else if (location < 0 || dispo < 0) {
    quantityWarning.value = 'Erreur: Les quantités ne peuvent pas être négatives.';
    hasQuantityError.value = true;
  } else {
    quantityWarning.value = '';
    hasQuantityError.value = false;
  }
}

const onQuantityInput = () => {
  updateQuantities();
};

function resetFilters() {
  filters.value = { etatMat: null, categorieMat: null, search: '' };
}

function updateCategories() {
  if (!materiels.value || !Array.isArray(materiels.value)) {
    categorieOptions.value = [{ label: 'Toutes les catégories', value: null }];
    return;
  }
  const uniqueCategories = [...new Set(materiels.value.map(mat => mat.categorieMat).filter(Boolean))];
  categorieOptions.value = [
    { label: 'Toutes les catégories', value: null },
    ...uniqueCategories.map(cat => ({ label: cat, value: cat }))
  ];
}

// Fonctions utilitaires
function getEtatType(etat) {
  const types = {
    'Neuf': 'success',
    'Bon état': 'primary',
    'Endommagé': 'warning',
    'Maintenance': 'info',
    'Hors-Service': 'error'
  };
  return types[etat] || 'default';
}

function getEtatShort(etat) {
  const shorts = {
    'Neuf': 'Neuf',
    'Bon état': 'Bon',
    'Endommagé': 'Endom.',
    'Maintenance': 'Maint.',
    'Hors-Service': 'H.S.'
  };
  return shorts[etat] || etat;
}

function getRowClass(row) {
  if (row.etatMat === 'Hors-Service') return 'table-row-danger';
  if (row.etatMat === 'Maintenance') return 'table-row-warning';
  if (row.etatMat === 'Endommagé') return 'table-row-info';
  if (row.qteActuelStock <= 2) return 'table-row-danger';
  if (row.qteTotDispo === 0) return 'table-row-warning-light';
  return '';
}

function showMessage(msg, error = false) {
  message.value = msg;
  isError.value = error;
  setTimeout(() => {
    message.value = '';
  }, error ? 5000 : 3000);
}

// Fonctions d'interface
function openModal(mode, materielData = null) {
  isEditMode.value = mode === 'edit';
  hasQuantityError.value = false;
  
  if (isEditMode.value && materielData) {
    currentMateriel.value = { ...materielData };
    if (currentMateriel.value.dateAcquisition) {
      currentMateriel.value.dateAcquisition = new Date(currentMateriel.value.dateAcquisition).getTime();
    }
    updateQuantities();
  } else {
    currentMateriel.value = {
      designationMat: '',
      categorieMat: '',
      descriptionMat: '',
      qteActuelStock: 1, 
      qteTotDispo: 1,
      qteEnLocation: 0,
      tarifHeure: 0,
      tarifDemiJournee: 0,
      tarifJour: 0,
      etatMat: 'Bon état',
      dateAcquisition: Date.now()
    };
    quantityWarning.value = '';
  }
  
  showMaterielModal.value = true;
}

function openEtatModal(materiel) {
  currentMateriel.value = { ...materiel };
  etatData.value = {
    etatMat: materiel.etatMat,
    notes: ''
  };
  showEtatModal.value = true;
}

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 Ar';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0 Ar';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M Ar';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k Ar';
  } else {
    return new Intl.NumberFormat('fr-MG').format(num) + ' Ar';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (datetime) => {
  if (!datetime) return '';
  try {
    return new Date(datetime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

const exportData = () => {
  const data = filteredMateriel.value.map(mat => ({
    Code: mat.codeMat,
    Désignation: mat.designationMat,
    Catégorie: mat.categorieMat || '-',
    État: mat.etatMat,
    'Stock total': mat.qteActuelStock,
    Disponible: mat.qteTotDispo,
    'En location': mat.qteEnLocation,
    'Tarif/heure': formatCurrency(mat.tarifHeure),
    'Tarif/jour': formatCurrency(mat.tarifJour),
    'Date acquisition': formatDate(mat.dateAcquisition)
  }));
  
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `materiel-cedii-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  showMessage('Exportation des données effectuée', false);
};

const openReport = () => {
  showMessage('Génération du rapport en cours...', false);
};

const openQuickAdd = () => {
  openModal('add', {
    designationMat: '',
    categorieMat: 'Standard',
    etatMat: 'Neuf',
    qteActuelStock: 1,
    qteTotDispo: 1,
    qteEnLocation: 0,
    tarifHeure: 0,
    tarifDemiJournee: 0,
    tarifJour: 0,
    dateAcquisition: Date.now()
  });
};
</script>

<style scoped>
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
}

/* STYLES DU HEADER AMÉLIORÉ */
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
  font-size: 1.25rem;
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

/* Section filtres */
.filters-section {
  background: white;
}

.filters-section :deep(.n-card-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.filters-section :deep(.n-card-content) {
  padding: 20px;
}

/* Carte principale */
.main-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.main-card :deep(.n-card-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5811EE;
}

/* Tableau */
.table-container {
  border-radius: 8px;
  overflow: hidden;
}

/* Styles spécifiques au tableau */
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 12px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #555;
  border-bottom: 2px solid #e9ecef;
}

:deep(.n-data-table .n-data-table-td) {
  padding: 8px 8px;
  font-size: 0.85rem;
  border-bottom: 1px solid #f8f9fa;
}

:deep(.n-data-table .n-data-table-tr:hover) {
  background-color: #f8f9ff !important;
}

/* Styles des boutons d'actions dans le tableau */
.actions-container {
  display: flex;
  gap: 6px;
  align-items: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.edit-btn:hover {
  background-color: rgba(24, 144, 255, 0.2);
  border-color: #1890ff;
}

.history-btn {
  color: #52c41a;
  background-color: rgba(82, 196, 26, 0.1);
}

.history-btn:hover {
  background-color: rgba(82, 196, 26, 0.2);
  border-color: #52c41a;
}

.state-btn {
  color: #faad14;
  background-color: rgba(250, 173, 20, 0.1);
}

.state-btn:hover {
  background-color: rgba(250, 173, 20, 0.2);
  border-color: #faad14;
}

.delete-btn {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
}

.delete-btn:hover {
  background-color: rgba(255, 77, 79, 0.2);
  border-color: #ff4d4f;
}

/* Styles pour les quantités */
.quantities-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quantity-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.quantity-label {
  color: #666;
  font-weight: 500;
}

.quantity-value {
  font-weight: 600;
}

/* Styles pour les tarifs */
.tarifs-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tarif-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.tarif-label {
  color: #666;
  font-weight: 500;
}

.tarif-value {
  font-weight: 600;
}

/* Classes pour les lignes du tableau */
:deep(.table-row-danger) {
  background-color: #fff1f0 !important;
}

:deep(.table-row-warning) {
  background-color: #fffbe6 !important;
}

:deep(.table-row-info) {
  background-color: #e6f7ff !important;
}

:deep(.table-row-warning-light) {
  background-color: #fff7e6 !important;
}

/* Palette CEDII */
:root {
  --cedii-primary: #5811EE;
  --cedii-primary-dark: #04058F;
  --cedii-dark: #02061E;
  --cedii-info: #067186;
  --cedii-secondary: #55555E;
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
  
  .header-actions .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions .d-flex {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filters-section .row {
    flex-direction: column;
  }
  
  .col-md-3, .col-md-4, .col-md-2 {
    width: 100%;
  }
  
  .actions-container {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
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
  
  :deep(.n-data-table) {
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .container-fluid {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .info-value {
    font-size: 1rem;
  }
}


</style>