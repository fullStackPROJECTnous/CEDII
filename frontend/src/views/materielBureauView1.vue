<!--<template>
  <div class="page-container">
    <!-- Header fixe 
    <div class="fixed-header">
      <div class="container-fluid py-2">
        <!-- Header amélioré avec menu de navigation 
        <div class="row mb-4">
          <div class="col-12">
            <div class="custom-header p-4 rounded">
              <div class="d-flex justify-content-between align-items-center">
                <!-- Bouton Retour
                <div>
                  <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-light">
                    <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
                  </router-link>
                </div>
                
                <!-- Titre central 
                <div class="text-center">
                  <h1 class="custom-title mb-1">
                    <i class="bi bi-laptop me-2"></i>
                    Matériel de Bureau
                  </h1>
                  <p class="custom-subtitle">Gestion des équipements informatiques et bureautiques</p>
                </div>
                
                <!-- Menu trois points 
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
              </div>
            </div>
          </div>
        </div>

        <hr class="my-2 custom-divider">

        <!-- Alertes compactes 
        <n-alert v-if="message" :type="isError ? 'error' : 'success'" class="mb-2" closable @close="message = ''" size="small">
          <i :class="`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-1`"></i>{{ message }}
        </n-alert>
      </div>
    </div>

    <!-- Contenu principal scrollable 
    <div class="scrollable-content">
      <div class="container-fluid py-2">
        <!-- Filtres et Actions combinés
        <div class="card mb-2">
          <div class="card-body py-1">
            <div class="row g-1 align-items-center">
              <!-- Filtres 
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
              
              <!-- Bouton d'action 
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

        <!-- Tableau compact 
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

        <!-- Modal Ajout/Modification compact
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
                <!-- Informations de base 
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

                <!-- Dates et Prix 
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

                <!-- Affectation 
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

        <!-- Modal Assignation compact 
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
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
  NDropdown
} from 'naive-ui';
import MaterielBureauService from '../services/MaterielBureauService';

const router = useRouter();

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

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Location & Reservation',
    key: 'location',
    icon: () => h('i', { class: 'bi bi-calendar-plus me-2' })
  },
 
  {
    label: 'Gestion Financière',
    key: 'finance',
    icon: () => h('i', { class: 'bi bi-calendar-day me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Inventaire & Patrimoine',
    key: 'inventaire',
    icon: () => h('i', { class: 'bi bi-tools me-2' })
  },
  {
    label: 'Fiches Clients',
    key: 'clients',
    icon: () => h('i', { class: 'bi bi-people me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Suivi & Rapports',
    key: 'rapport',
    icon: () => h('i', { class: 'bi bi-people me-2' })
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
    'dashboard': '/dashboardAdmin',
    'location': '/location',
    'finance': '/finance',
    'rapport': '/rapport',
    'inventaire': '/patrimoine1',
    'clients': '/clientManagementAdmin'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

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
/* Conteneur principal de la page */
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa;
}

/* Header fixe */
.fixed-header {
  flex-shrink: 0;
  background-color: white;
  z-index: 1000;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #eaeaea;
}

/* Contenu scrollable */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f8f9fa;
}

.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Ajustements pour le header */
.fixed-header .container-fluid {
  padding-top: 20px;
  padding-bottom: 10px;
}

/* Style amélioré pour le scroll */
.scrollable-content::-webkit-scrollbar {
  width: 10px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
  border: 2px solid #f1f1f1;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
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
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  background-color: white;
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
  border-bottom: 1px solid #eaeaea;
}

:deep(.n-data-table .n-data-table-td) {
  padding: 4px 8px;
  font-size: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
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

/* Menu dropdown */
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

/* Modals - assurez-vous qu'ils soient au-dessus du contenu scrollable */
:deep(.n-modal) {
  z-index: 2000 !important;
}

:deep(.n-modal-mask) {
  z-index: 1999 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    height: auto;
    min-height: 100vh;
  }
  
  .fixed-header {
    position: relative;
  }
  
  .scrollable-content {
    overflow-y: visible;
  }
  
  .container-fluid {
    padding: 15px;
  }
  
  .fixed-header .container-fluid {
    padding-top: 15px;
    padding-bottom: 15px;
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
  
  /* Ajustement du menu trois points en mobile */
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  /* Ajustement des filtres en mobile */
  .d-flex.gap-1.flex-wrap {
    justify-content: center;
  }
  
  .d-flex.gap-1.flex-wrap > * {
    flex: 1 1 auto;
    margin-bottom: 5px;
  }
  
  .d-flex.gap-1.flex-wrap > n-select,
  .d-flex.gap-1.flex-wrap > n-input {
    width: 100% !important;
    max-width: 100%;
  }
}

/* Pour les écrans très petits */
@media (max-width: 576px) {
  .scrollable-content::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-header {
    padding: 15px !important;
  }
  
  .custom-title {
    font-size: 1.2rem;
  }
  
  .container-fluid {
    padding: 10px;
  }
}
</style>-->


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
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                </n-icon>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">
        <!-- Header avec navigation et actions -->
     <!-- Header avec navigation et actions -->
  <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-3">
  <!-- Partie gauche -->
  <div class="d-flex align-items-center">
    <n-button 
      @click="$router.go(-1)" 
      type="default" 
      size="small"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-left"></i>
      </template>
      Retour
    </n-button>
  </div>
  
   <div class="text-center">
                  <h1 class="custom-title mb-1">
                    <i class="bi bi-laptop me-2"></i>
                    Matériel de Bureau
                  </h1>
                  <p class="custom-subtitle">Gestion des équipements informatiques et bureautiques</p>
                </div>
                
  <div class="d-flex align-items-center gap-3">
    <n-button 
      @click="refreshPage" 
      type="info" 
      size="small"
      :loading="isLoading"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-clockwise"></i>
      </template>
      Actualiser
    </n-button>
    
    <n-tag type="info" size="small" class="custom-tag">
      Rôle: {{ userLogin }}
    </n-tag>
  </div>
</n-layout-header>
        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="materiel-container">
            <!-- Alertes -->
            <n-alert v-if="message" :type="isError ? 'error' : 'success'" class="mb-3" closable @close="message = ''" size="small">
              <i :class="`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-1`"></i>{{ message }}
            </n-alert>

            <!-- Filtres et Actions combinés -->
            <div class="card mb-3">
              <div class="card-body py-2">
                <div class="row g-2 align-items-center">
                  <!-- Filtres -->
                  <div class="col-md-9">
                    <div class="d-flex gap-2 flex-wrap">
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
                        <i class="bi bi-plus-lg me-1"></i>Nouveau Matériel
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
                  :max-height="500"
                />
              </div>
            </n-card>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>

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
import { useRouter } from 'vue-router';
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
  NDataTable, 
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
import AuthService from '../services/AuthService';

const router = useRouter();

// États utilisateur
const userRole = ref('');
const userLogin = ref('');
const activeMenuKey = ref('bureau'); // Activer l'item "bureau" dans le menu

// Options du menu
const menuOptions = [
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
  },
 
  {
    label: () => h('span', { class: 'text-white' }, 'Gestion des Clients'),
    key: 'clients',
    icon: renderIcon('bi-people-fill')
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
    label: () => h('span', { class: 'text-white' }, 'Locations & Réservations'),
    key: 'locations',
    icon: renderIcon('bi-calendar-check')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Gestion Financière'),
    key: 'finance',
    icon: renderIcon('bi-bank')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Suivi & Rapports'),
    key: 'rapports',
    icon: renderIcon('bi-graph-up')
  },

];

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'accueil': 'AdminDashboard',
    'utilisateurs': 'UserManagement',
    'clients': 'ClientManagement1',
    'inventaire': 'InventairePatrimoineAD',
    'locations': 'Location',
    'finance': 'Finance',
    'bureau': 'Bureau1',
    'rapports': 'Rapport',
    'logs': 'SystemLogs'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Navigation
const goToDashboard = () => {
  router.push({ name: 'AdminDashboard' });
};

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

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
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    userLogin.value = user.loginUti || '';
  }
  
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

.materiel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
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

.custom-tag {
  font-weight: 600;
}

/* Cards */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Tableau compact */
.compact-table-container {
  border-radius: 6px;
  overflow: hidden;
  flex: 1;
}

:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 8px 10px;
  border-bottom: 2px solid #007bff;
}

:deep(.n-data-table .n-data-table-td) {
  padding: 6px 10px;
  font-size: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.table-row-secondary) {
  background-color: #f8f9fa !important;
}

:deep(.table-row-danger) {
  background-color: rgba(220, 53, 69, 0.05) !important;
}

:deep(.table-row-warning) {
  background-color: rgba(255, 193, 7, 0.05) !important;
}

/* Formulaires */
:deep(.n-form-item .n-form-item-label) {
  font-size: 0.8rem;
  font-weight: 500;
}

:deep(.n-input) {
  font-size: 0.8rem;
}

/* Scrollbars personnalisées */
.bg-light::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .d-flex.gap-2.flex-wrap {
    justify-content: center;
  }
  
  .d-flex.gap-2.flex-wrap > * {
    flex: 1 1 auto;
    margin-bottom: 5px;
  }
  
  .d-flex.gap-2.flex-wrap > n-select,
  .d-flex.gap-2.flex-wrap > n-input {
    width: 100% !important;
    max-width: 100%;
  }
  
  .col-md-3 {
    margin-top: 10px;
  }
}
</style>
