<template>
  <div class="container-fluid py-2">
    <!-- En-tête compact -->
    <div class="row mb-2">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i class="bi bi-tools me-2 custom-icon fs-5"></i>
            <div>
              <h4 class="mb-0 fw-bold">Gestion Matériels</h4>
              <small class="text-muted">{{ filteredMateriel.length }} matériel(s)</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <n-button type="primary" @click="fetchMateriel" size="small" secondary>
              <i class="bi bi-arrow-clockwise"></i>
            </n-button>
            <n-button type="primary" @click="openModal('add')" size="small">
              <i class="bi bi-plus-lg"></i>
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-2 custom-divider">

    <!-- Alertes compactes -->
    <n-alert v-if="message" :type="isError ? 'error' : 'success'" class="mb-2" closable @close="message = ''" size="small">
      <i :class="`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-1`"></i>{{ message }}
    </n-alert>

    <!-- Filtres et Statistiques combinés -->
    <div class="card mb-2">
      <div class="card-body py-1">
        <div class="row g-1 align-items-center">
          <!-- Filtres -->
          <div class="col-md-8">
            <div class="d-flex gap-1 flex-wrap">
              <n-select
                v-model:value="filters.etatMat"
                placeholder="État"
                size="small"
                style="width: 120px"
                :options="etatOptions"
              />
              <n-select
                v-model:value="filters.categorieMat"
                placeholder="Catégorie"
                size="small"
                style="width: 140px"
                :options="categorieOptions"
              />
              <n-input
                v-model:value="filters.search"
                placeholder="Recherche..."
                size="small"
                style="width: 180px"
                clearable
              >
                <template #prefix>
                  <i class="bi bi-search"></i>
                </template>
              </n-input>
              <n-button size="small" @click="resetFilters" secondary>
                <i class="bi bi-arrow-clockwise"></i>
              </n-button>
            </div>
          </div>
          
          <!-- Statistiques rapides -->
          <div class="col-md-4">
            <div class="d-flex justify-content-end gap-2 text-center">
              <div class="stat-item">
                <div class="stat-number text-primary">{{ statistiques.total }}</div>
                <div class="stat-label">Total</div>
              </div>
              <div class="stat-item">
                <div class="stat-number text-success">{{ statistiques.disponibles }}</div>
                <div class="stat-label">Stock</div>
              </div>
              <div class="stat-item">
                <div class="stat-number text-warning">{{ statistiques.enLocation }}</div>
                <div class="stat-label">Location</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau compact -->
    <n-card class="custom-card" content-style="padding: 0">
      <div class="compact-table-container">
        <n-data-table
          :columns="columns"
          :data="filteredMateriel"
          :pagination="pagination"
          size="small"
          :bordered="false"
          :row-class-name="getRowClass"
          virtual-scroll
          :max-height="400"
        />
      </div>
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
                  :options="etatOptions"
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

    <!-- Modal Historique compact -->
    <n-modal v-model:show="showHistoriqueModal" transform-origin="center">
      <n-card
        :style="{ width: '800px', maxWidth: '95vw' }"
        :title="`Historique - ${currentMateriel?.codeMat}`"
        :bordered="false"
        size="small"
      >
        <template #header-extra>
          <n-button type="error" text @click="showHistoriqueModal = false" size="small">
            <i class="bi bi-x-lg"></i>
          </n-button>
        </template>

        <n-spin :show="historiqueLoading">
          <div v-if="historiqueEmprunt.length === 0" class="text-center text-muted py-3">
            <i class="bi bi-clock-history fs-1 mb-2 d-block"></i>
            Aucun historique d'emprunt
          </div>
          <n-data-table
            v-else
            :columns="historiqueColumns"
            :data="historiqueEmprunt"
            size="small"
            :max-height="300"
            virtual-scroll
          />
        </n-spin>
      </n-card>
    </n-modal>

    <!-- Modal État compact -->
    <n-modal v-model:show="showEtatModal" transform-origin="center">
      <n-card
        :style="{ width: '400px', maxWidth: '90vw' }"
        :title="`Changer État - ${currentMateriel?.codeMat}`"
        :bordered="false"
        size="small"
      >
        <n-form :model="etatData" size="small">
          <n-form-item label="Nouvel état">
            <n-select
              v-model:value="etatData.etatMat"
              :options="etatOptions"
            />
          </n-form-item>
          <n-form-item label="Notes">
            <n-input
              v-model:value="etatData.notes"
              type="textarea"
              :rows="2"
              placeholder="Raison du changement..."
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showEtatModal = false">Annuler</n-button>
            <n-button type="warning" size="small" @click="updateEtatMateriel">
              Mettre à jour
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
  NSpin
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
const quantityWarning = ref('');
const hasQuantityError = ref(false);
const message = ref('');
const isError = ref(false);

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

// Statistiques
const statistiques = computed(() => {
  const filtered = filteredMateriel.value;
  return {
    total: filtered.length,
    disponibles: filtered.filter(mat => mat.etatMat === 'Bon état' && mat.qteActuelStock > 0).length,
    enLocation: filtered.reduce((sum, mat) => sum + (mat.qteEnLocation || 0), 0),
    maintenance: filtered.filter(mat => ['Maintenance', 'Endommagé', 'Hors-Service'].includes(mat.etatMat)).length
  };
});

// Règles de validation
const rules = {
  designationMat: { required: true, message: 'La désignation est requise', trigger: 'blur' },
  
  // CORRIGÉ: qteActuelStock est le Stock Total, doit être >= 1
  qteActuelStock: { 
    required: true, 
    type: 'number', 
    min: 1, 
    message: 'Le stock total doit être au moins de 1', 
    trigger: 'blur' 
  },
  // CORRIGÉ: qteTotDispo est la Quantité Disponible, doit être >= 0
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

// Colonnes du tableau principal - CORRIGÉES
const columns = [
  {
    title: 'Code',
    key: 'codeMat',
    width: 160,
    render: (row) => h('span', { class: 'fw-bold text-primary' }, row.codeMat)
  },
  {
    title: 'Désignation',
    key: 'designationMat',
    ellipsis: { tooltip: true },
    width: 150
  },
  {
    title: 'Catégorie',
    key: 'categorieMat',
    width: 120,
    render: (row) => row.categorieMat || '-'
  },
  {
    title: 'Description',
    key: 'descriptionMat',
    width: 150,
    ellipsis: { tooltip: true },
    render: (row) => row.descriptionMat || '-'
  },
  {
    title: 'État',
    key: 'etatMat',
    width: 100,
    render: (row) => h(NTag, { 
      type: getEtatType(row.etatMat),
      size: 'small'
    }, { default: () => getEtatShort(row.etatMat) })
  },
  {
    title: 'Quantités',
    key: 'quantites',
    width: 140,
    render: (row) => h('div', { class: 'text-center' }, [
      // Ligne 1: Quantité Totale (qteActuelStock)
      h('div', { class: 'd-flex justify-content-between small' }, [
        h('span', { class: 'text-muted' }, 'Total:'),
        // qteTotDispo (Quantité Disponible) - Nous laissons le violet pour le Stock Actuel
        h('span', row.qteTotDispo) 
      ]),

      // Ligne 2: Stock Actuel (qteActuelStock)
      h('div', { class: 'd-flex justify-content-between small' }, [
        h('span', { class: 'text-muted' }, 'Stock:'),
        h('span', { 
          // 🟣 Appliquer la classe 'text-purple' (violet) pour qteActuelStock
          // Maintenir la classe 'text-danger' si le stock est bas
          class: row.qteActuelStock <= 2 ? 'text-danger fw-bold' : 'text-purple fw-bold' 
        }, row.qteActuelStock)
      ]),

      // Ligne 3: En Location (qteEnLocation)
      h('div', { class: 'd-flex justify-content-between small' }, [
        h('span', { class: 'text-muted' }, 'Loc:'),
        h('span', { 
          // 🟢 Appliquer la classe 'text-success' (vert) pour qteEnLocation
          // Maintenir la classe 'text-warning' si > 0 (vous aviez warning, je passe au vert/success)
          class: row.qteEnLocation > 0 ? 'text-success fw-bold' : 'text-muted' 
        }, row.qteEnLocation)
      ])
    ])
},
  {
        title: 'Tarifs',
        key: 'tarifs',
        width: 140, // Augmenté légèrement la largeur pour accommoder "Demi-journée"
        render: (row) => h('div', { class: 'text-center' }, [
            
            // 🎯 Tarif Heure
            h('div', { class: 'd-flex justify-content-between small' }, [
                h('span', { class: 'text-muted' }, 'Heure:'),
                h('span', { class: 'fw-bold text-success' }, formatCurrency(row.tarifHeure))
            ]),
            
            // 🎯 Tarif Demi-journée
            h('div', { class: 'd-flex justify-content-between small' }, [
                h('span', { class: 'text-muted' }, '½ Jour:'), // Raccourci le libellé pour gagner de la place
                h('span', formatCurrency(row.tarifDemiJournee))
            ]),
            
            // 🎯 Tarif Jour
            h('div', { class: 'd-flex justify-content-between small' }, [
                h('span', { class: 'text-muted' }, 'Jour:'),
                h('span', { class: 'fw-bold text-primary' }, formatCurrency(row.tarifJour))
            ])
        ])
    },
  {
    title: 'Date Acquisition',
    key: 'dateAcquisition',
    width: 110,
    render: (row) => h('span', { class: 'small' }, formatDate(row.dateAcquisition))
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 140,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'info',
        secondary: true,
        onClick: () => openModal('edit', row)
      }, { default: () => h('i', { class: 'bi bi-pencil' }) }),
      h(NButton, {
        size: 'small',
        type: 'warning',
        secondary: true,
        onClick: () => openHistorique(row.codeMat)
      }, { default: () => h('i', { class: 'bi bi-clock-history' }) }),
      h(NButton, {
        size: 'small',
        type: 'primary',
        secondary: true,
        onClick: () => openEtatModal(row)
      }, { default: () => h('i', { class: 'bi bi-gear' }) }),
      h(NButton, {
        size: 'small',
        type: 'error',
        secondary: true,
        onClick: () => deleteMateriel(row.codeMat)
      }, { default: () => h('i', { class: 'bi bi-trash' }) })
    ])
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

const pagination = { pageSize: 10 };

// Propriétés calculées
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
    // Préparer les données selon votre structure de base de données
    const materielData = {
      ...currentMateriel.value,
      // S'assurer que les quantités sont cohérentes
      qteTotDispo: Number(currentMateriel.value.qteTotDispo) || 0,
      qteActuelStock: Number(currentMateriel.value.qteActuelStock) || 0,
      qteEnLocation: Number(currentMateriel.value.qteEnLocation) || 0,
      // qteMat est présent dans votre table mais semble redondant - à adapter selon vos besoins
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

async function deleteMateriel(codeMat) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le matériel ${codeMat} ?`)) return;
  
  try {
    await MaterielService.deleteMateriel(codeMat);
    showMessage('Matériel supprimé avec succès', false);
    await fetchMateriel();
  } catch (error) {
    showMessage("Erreur de suppression: " + (error.response?.data?.message || error.message), true);
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

// Gestion des quantités - CORRIGÉE
function updateQuantities() {
  // L'utilisateur peut modifier Stock Total (qteActuelStock) et En Location (qteEnLocation)
  const total = Number(currentMateriel.value.qteActuelStock) || 0;
  const dispo = Number(currentMateriel.value.qteTotDispo) || 0;
  const location = Number(currentMateriel.value.qteEnLocation) || 0;
  
  // Validation de cohérence Front-end
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

// Fonctions utilitaires - AJOUTÉES
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
      // CORRIGÉ: Stock Total (qteActuelStock) initialisé à 1
      qteActuelStock: 1, 
      // CORRIGÉ: Disponible (qteTotDispo) initialisé à 1
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
  return isNaN(num) ? '0 Ar' : new Intl.NumberFormat('fr-MG').format(num) + ' Ar';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
</script>

<style scoped>
/* Votre CSS existant reste inchangé */
:root {
  --cedii-primary: #5811EE;
  --cedii-primary-dark: #04058F;
  --cedii-dark: #02061E;
  --cedii-info: #067186;
  --cedii-secondary: #55555E;
}

.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
}

.custom-icon {
  color: var(--cedii-primary);
}

.custom-divider {
  border-color: var(--cedii-info);
  opacity: 0.2;
  margin: 0.5rem 0;
}

.custom-card {
  border: none;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.stat-item {
  min-width: 50px;
}

.stat-number {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--cedii-secondary);
  font-weight: 500;
}

.compact-table-container {
  border-radius: 6px;
  overflow: hidden;
}

:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 6px 8px;
}

:deep(.n-data-table .n-data-table-td) {
  padding: 4px 8px;
  font-size: 0.8rem;
}

:deep(.table-row-danger) {
  background-color: #fee !important;
}

:deep(.table-row-warning) {
  background-color: #fff3cd !important;
}

:deep(.table-row-info) {
  background-color: #d1ecf1 !important;
}

:deep(.n-form-item .n-form-item-label) {
  font-size: 0.8rem;
  font-weight: 500;
}

:deep(.n-input) {
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .container-fluid {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .stat-item {
    min-width: 40px;
  }
  
  .stat-number {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.65rem;
  }
}
</style>