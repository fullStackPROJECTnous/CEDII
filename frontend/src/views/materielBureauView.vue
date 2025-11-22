<template>
  <div class="container-fluid py-2">
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
                <i class="bi bi-laptop me-2"></i>
                Matériel de Bureau
              </h1>
              <p class="custom-subtitle">Gestion des équipements informatiques et bureautiques</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-2 custom-divider">

    <!-- Alertes compactes -->
    <n-alert v-if="message" :type="isError ? 'error' : 'success'" class="mb-2" closable @close="message = ''" size="small">
      <i :class="`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-1`"></i>{{ message }}
    </n-alert>

    <!-- Filtres et Actions combinés -->
    <div class="card mb-2">
      <div class="card-body py-1">
        <div class="row g-1 align-items-center">
          <!-- Filtres -->
          <div class="col-md-9">
            <div class="d-flex gap-1 flex-wrap">
              <n-select
                v-model:value="filters.statut"
                placeholder="Statut"
                size="small"
                style="width: 140px"
                :options="statutOptions"
                @update:value="fetchData"
              />
              <n-select
                v-model:value="filters.type"
                placeholder="Type"
                size="small"
                style="width: 160px"
                :options="typeOptions"
                @update:value="fetchData"
              />
              <n-input
                v-model:value="filters.search"
                placeholder="Recherche..."
                size="small"
                style="width: 200px"
                clearable
                @input="onSearch"
                @keydown.enter="fetchData"
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
          
          <!-- Bouton d'action -->
          <div class="col-md-3">
            <div class="d-flex justify-content-end">
              <n-button type="primary" @click="openModal('add')" size="small" class="custom-btn-primary">
                <i class="bi bi-plus-lg me-1"></i>Nouveau
              </n-button>
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
          :data="filteredMateriels"
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
        :style="{ width: '700px', maxWidth: '95vw' }"
        :title="isEdit ? 'Modifier le Matériel' : 'Nouveau Matériel'"
        :bordered="false"
        size="small"
        role="dialog"
      >
        <template #header-extra>
          <n-button type="error" text @click="showMaterielModal = false" size="small">
            <i class="bi bi-x-lg"></i>
          </n-button>
        </template>

        <n-form :model="current" size="small">
          <div class="row g-2">
            <!-- Informations de base -->
            <div class="col-6">
              <n-form-item label="Code" path="code">
                <n-input 
                  v-model:value="current.code" 
                  placeholder="Code unique" 
                  :disabled="isEdit"
                />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Type" path="type">
                <n-select
                  v-model:value="current.type"
                  :options="typeOptions.filter(opt => opt.value)"
                  placeholder="Sélectionner..."
                />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Marque">
                <n-input v-model:value="current.marque" placeholder="Marque" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Modèle">
                <n-input v-model:value="current.modele" placeholder="Modèle" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="N° Série">
                <n-input v-model:value="current.numeroSerie" placeholder="Numéro de série" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Fournisseur">
                <n-input v-model:value="current.fournisseur" placeholder="Fournisseur" />
              </n-form-item>
            </div>

            <!-- Dates et Prix -->
            <div class="col-12">
              <n-divider class="my-1">Informations d'acquisition</n-divider>
            </div>

            <div class="col-4">
              <n-form-item label="Date acquisition">
                <n-date-picker
                  v-model:value="current.dateAcquisition"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </n-form-item>
            </div>

            <div class="col-4">
              <n-form-item label="Fin garantie">
                <n-date-picker
                  v-model:value="current.dateFinGarantie"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </n-form-item>
            </div>

            <div class="col-4">
              <n-form-item label="Prix (MGA)">
                <n-input-number
                  v-model:value="current.prixAchat"
                  :min="0"
                  :step="1000"
                  :show-button="false"
                  placeholder="0"
                  style="width: 100%"
                />
              </n-form-item>
            </div>

            <!-- Affectation -->
            <div class="col-12">
              <n-divider class="my-1">Affectation</n-divider>
            </div>

            <div class="col-6">
              <n-form-item label="Utilisateur">
                <n-input v-model:value="current.utilisateur" placeholder="Nom utilisateur" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Département">
                <n-input v-model:value="current.departement" placeholder="Département" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Statut" path="statut">
                <n-select
                  v-model:value="current.statut"
                  :options="statutOptions.filter(opt => opt.value)"
                />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Emplacement">
                <n-input v-model:value="current.emplacement" placeholder="Emplacement" />
              </n-form-item>
            </div>

            <div class="col-12">
              <n-form-item label="Notes">
                <n-input
                  v-model:value="current.notes"
                  type="textarea"
                  :rows="2"
                  placeholder="Notes supplémentaires..."
                />
              </n-form-item>
            </div>
          </div>
        </n-form>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showMaterielModal = false">Annuler</n-button>
            <n-button type="primary" size="small" @click="saveItem" :loading="isLoading" class="custom-btn-primary">
              {{ isEdit ? 'Sauvegarder' : 'Ajouter' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Modal Assignation compact -->
    <n-modal v-model:show="showAssignModal" transform-origin="center">
      <n-card
        :style="{ width: '400px', maxWidth: '90vw' }"
        :title="`Assigner - ${current.code}`"
        :bordered="false"
        size="small"
      >
        <div class="mb-2">
          <p class="mb-1"><strong>{{ current.marque }} {{ current.modele }}</strong></p>
          <p class="text-muted small mb-3">{{ current.numeroSerie || 'Sans numéro de série' }}</p>
        </div>

        <n-form :model="assignData" size="small">
          <n-form-item label="Utilisateur">
            <n-input
              v-model:value="assignData.utilisateur"
              placeholder="Nom de l'utilisateur"
            />
          </n-form-item>
          <n-form-item label="Département">
            <n-input
              v-model:value="assignData.departement"
              placeholder="Département"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showAssignModal = false">Annuler</n-button>
            <n-button type="warning" size="small" @click="assignUser" class="custom-btn-warning">
              Assigner
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
  NDivider
} from 'naive-ui';
import MaterielBureauService from '../services/MaterielBureauService';

// États
const materiels = ref([]);
const current = ref({});
const assignData = ref({});
const isEdit = ref(false);
const isLoading = ref(false);
const showMaterielModal = ref(false);
const showAssignModal = ref(false);
const message = ref('');
const isError = ref(false);

// Filtres
const filters = ref({
  statut: null,
  type: null,
  search: ''
});

// Options pour les sélecteurs
const statutOptions = [
  { label: 'Tous statuts', value: null },
  { label: 'En service', value: 'En service' },
  { label: 'En stock', value: 'En stock' },
  { label: 'En maintenance', value: 'En maintenance' },
  { label: 'En panne', value: 'En panne' },
  { label: 'Hors service', value: 'Hors service' }
];

const typeOptions = [
  { label: 'Tous types', value: null },
  { label: 'Ordinateur portable', value: 'Ordinateur portable' },
  { label: 'Ordinateur fixe', value: 'Ordinateur fixe' },
  { label: 'Imprimante', value: 'Imprimante' },
  { label: 'Écran', value: 'Écran' },
  { label: 'Téléphone', value: 'Téléphone' },
  { label: 'Tablette', value: 'Tablette' },
  { label: 'Autre', value: 'Autre' }
];

// Colonnes du tableau
const columns = [
  {
    title: 'Code',
    key: 'code',
    width: 120,
    render: (row) => h('span', { class: 'fw-bold text-primary' }, row.code)
  },
  {
    title: 'Type',
    key: 'type',
    width: 140,
    render: (row) => h('span', row.type)
  },
  {
    title: 'Modèle',
    key: 'modele',
    ellipsis: { tooltip: true },
    render: (row) => h('div', [
      h('div', { class: 'fw-medium' }, `${row.marque || ''} ${row.modele || ''}`.trim()),
      row.numeroSerie ? h('small', { class: 'text-muted' }, row.numeroSerie) : null
    ])
  },
  {
    title: 'Affectation',
    key: 'affectation',
    width: 150,
    render: (row) => h('div', [
      row.utilisateur ? h(NTag, { 
        type: 'info', 
        size: 'small',
        class: 'mb-1'
      }, { default: () => row.utilisateur }) : null,
      row.departement ? h('div', { class: 'small text-muted' }, row.departement) : null
    ])
  },
  {
    title: 'Statut',
    key: 'statut',
    width: 120,
    render: (row) => h(NTag, { 
      type: getStatutType(row.statut),
      size: 'small'
    }, { default: () => getStatutShort(row.statut) })
  },
  {
    title: 'Acquisition',
    key: 'dateAcquisition',
    width: 100,
    render: (row) => h('small', formatDate(row.dateAcquisition))
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
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
        onClick: () => openAssignModal(row),
        disabled: row.statut === 'Hors service'
      }, { default: () => h('i', { class: 'bi bi-person-plus' }) }),
      h(NButton, {
        size: 'small',
        type: 'error',
        secondary: true,
        onClick: () => deleteItem(row.id)
      }, { default: () => h('i', { class: 'bi bi-trash' }) })
    ])
  }
];

const pagination = { pageSize: 10 };

// Propriétés calculées
const filteredMateriels = computed(() => {
  if (!materiels.value || !Array.isArray(materiels.value)) return [];

  let filtered = [...materiels.value];

  if (filters.value.statut) {
    filtered = filtered.filter(mat => mat.statut === filters.value.statut);
  }

  if (filters.value.type) {
    filtered = filtered.filter(mat => mat.type === filters.value.type);
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    filtered = filtered.filter(mat => 
      (mat.code && mat.code.toLowerCase().includes(searchLower)) ||
      (mat.marque && mat.marque.toLowerCase().includes(searchLower)) ||
      (mat.modele && mat.modele.toLowerCase().includes(searchLower)) ||
      (mat.utilisateur && mat.utilisateur.toLowerCase().includes(searchLower)) ||
      (mat.numeroSerie && mat.numeroSerie.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
});

// Cycle de vie
onMounted(() => {
  fetchData();
});

// Fonctions principales
async function fetchData() {
  try {
    isLoading.value = true;
    const response = await MaterielBureauService.getAll(filters.value);
    materiels.value = response.data;
    showMessage('Données chargées', false);
  } catch (error) {
    showMessage('Erreur de chargement: ' + (error.response?.data?.message || error.message), true);
  } finally {
    isLoading.value = false;
  }
}

async function saveItem() {
  try {
    if (isEdit.value) {
      await MaterielBureauService.update(current.value.id, current.value);
      showMessage('Matériel modifié avec succès', false);
    } else {
      await MaterielBureauService.create(current.value);
      showMessage('Matériel créé avec succès', false);
    }
    await fetchData();
    showMaterielModal.value = false;
  } catch (error) {
    showMessage('Erreur de sauvegarde: ' + (error.response?.data?.message || error.message), true);
  }
}

async function deleteItem(id) {
  const item = materiels.value.find(m => m.id === id);
  if (!item || !confirm(`Supprimer le matériel ${item.code} ?`)) return;
  
  try {
    await MaterielBureauService.delete(id);
    showMessage('Matériel supprimé avec succès', false);
    await fetchData();
  } catch (error) {
    showMessage('Erreur de suppression: ' + (error.response?.data?.message || error.message), true);
  }
}

async function assignUser() {
  try {
    await MaterielBureauService.assignerUtilisateur(current.value.id, assignData.value);
    showMessage('Utilisateur assigné avec succès', false);
    await fetchData();
    showAssignModal.value = false;
  } catch (error) {
    showMessage('Erreur d\'assignation: ' + (error.response?.data?.message || error.message), true);
  }
}

// Fonctions d'interface
function openModal(mode, item = null) {
  isEdit.value = mode === 'edit';
  
  if (isEdit.value && item) {
    current.value = { ...item };
    // Convertir les dates pour le date-picker
    if (current.value.dateAcquisition) {
      current.value.dateAcquisition = new Date(current.value.dateAcquisition).getTime();
    }
    if (current.value.dateFinGarantie) {
      current.value.dateFinGarantie = new Date(current.value.dateFinGarantie).getTime();
    }
  } else {
    current.value = getDefaultMateriel();
  }
  showMaterielModal.value = true;
}

function openAssignModal(item) {
  current.value = { ...item };
  assignData.value = { 
    utilisateur: item.utilisateur || '', 
    departement: item.departement || '' 
  };
  showAssignModal.value = true;
}

function getDefaultMateriel() {
  return {
    code: '',
    type: '',
    marque: '',
    modele: '',
    numeroSerie: '',
    utilisateur: '',
    departement: '',
    statut: 'En stock',
    dateAcquisition: Date.now(),
    dateFinGarantie: null,
    prixAchat: null,
    fournisseur: '',
    emplacement: '',
    notes: ''
  };
}

// Recherche avec debounce
function onSearch() {
  if (window.searchTimeout) {
    clearTimeout(window.searchTimeout);
  }
  
  if (!filters.value.search || filters.value.search.trim() === '') {
    fetchData();
    return;
  }
  
  window.searchTimeout = setTimeout(() => {
    fetchData();
  }, 300);
}

function resetFilters() {
  filters.value = { statut: null, type: null, search: '' };
  fetchData();
}

// Fonctions utilitaires
function getStatutType(statut) {
  const types = {
    'En service': 'success',
    'En stock': 'info',
    'En maintenance': 'warning',
    'En panne': 'error',
    'Hors service': 'default'
  };
  return types[statut] || 'default';
}

function getStatutShort(statut) {
  const shorts = {
    'En service': 'Service',
    'En stock': 'Stock',
    'En maintenance': 'Maint.',
    'En panne': 'Panne',
    'Hors service': 'H.S.'
  };
  return shorts[statut] || statut;
}

function getRowClass(row) {
  if (row.statut === 'Hors service') return 'table-row-secondary';
  if (row.statut === 'En panne') return 'table-row-danger';
  if (row.statut === 'En maintenance') return 'table-row-warning';
  return '';
}

function showMessage(msg, error = false) {
  message.value = msg;
  isError.value = error;
  setTimeout(() => {
    message.value = '';
  }, error ? 5000 : 3000);
}

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};
</script>

<style scoped>
.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
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

.custom-divider {
  border-color: #007bff;
  opacity: 0.2;
  margin: 0.5rem 0;
}

.custom-card {
  border: none;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* Boutons cohérents */
.custom-btn-primary {
  background: #007bff !important;
  border-color: #007bff !important;
}

.custom-btn-primary:hover {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
}

.custom-btn-warning {
  background: #0405BF !important;
  border-color: #0405BF !important;
  color: white !important;
}

.custom-btn-warning:hover {
  background: #0304a3 !important;
  border-color: #0304a3 !important;
}

/* Tableau compact */
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

:deep(.table-row-secondary) {
  background-color: #f8f9fa !important;
}

:deep(.table-row-danger) {
  background-color: #fee !important;
}

:deep(.table-row-warning) {
  background-color: #fff3cd !important;
}

/* Formulaires compacts */
:deep(.n-form-item .n-form-item-label) {
  font-size: 0.8rem;
  font-weight: 500;
}

:deep(.n-input) {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container-fluid {
    padding: 12px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
}
</style>