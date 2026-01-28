

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
        <!-- Header unique avec navigation et actions -->
        <n-layout-header bordered class="custom-header fixed-header d-flex justify-content-between align-items-center p-3">
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
          
          <!-- Titre central -->
          <div class="text-center">
            <h1 class="custom-title mb-1">
              <i class="bi bi-laptop me-2"></i>
              Matériel de Bureau
            </h1>
            <p class="custom-subtitle">Gestion des équipements et mobiliers de bureau</p>
          </div>
          
          <!-- Partie droite -->
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
                        v-model:value="filters.categorie"
                        placeholder="Catégorie"
                        size="small"
                        style="width: 160px"
                        :options="categorieOptions"
                        @update:value="handleCategorieFilterChange"
                      />
                      <n-select
                        v-model:value="filters.type"
                        placeholder="Type"
                        size="small"
                        style="width: 160px"
                        :options="getTypeOptions(filters.categorie)"
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

            <!-- Tableau compact SANS les prix -->
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

    <!-- Modal Ajout/Modification -->
    <n-modal v-model:show="showMaterielModal" transform-origin="center">
      <n-card
        :style="{ width: '800px', maxWidth: '95vw' }"
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
              <n-form-item label="Code" path="code" required>
                <n-input 
                  v-model:value="current.code" 
                  placeholder="MAT-001" 
                  :disabled="isEdit"
                />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Catégorie" path="categorie" required>
                <n-select
                  v-model:value="current.categorie"
                  :options="categorieOptions.filter(opt => opt.value)"
                  placeholder="Sélectionner..."
                  @update:value="handleCategorieChange"
                />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Type" path="type" required>
                <n-select
                  v-model:value="current.type"
                  :options="getTypeOptions(current.categorie)"
                  placeholder="Sélectionner..."
                />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Marque/Fabricant" required>
                <n-input v-model:value="current.marque" placeholder="Dell, IKEA, Steelcase..." />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Modèle/Référence" required>
                <n-input v-model:value="current.modele" placeholder="Latitude 5420, Markus, Aeron..." />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Fournisseur">
                <n-input v-model:value="current.fournisseur" placeholder="Fournisseur..." />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Couleur">
                <n-input v-model:value="current.couleur" placeholder="Noir, Blanc, Bois..." />
              </n-form-item>
            </div>

            <!-- Dates et Prix -->
            <div class="col-12">
              <n-divider class="my-1">Informations d'acquisition</n-divider>
            </div>

            <div class="col-4">
              <n-form-item label="Date acquisition" required>
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
              <n-form-item label="Prix d'achat (MGA)" required>
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

            <!-- Durée d'amortissement -->
            <div class="col-6">
              <n-form-item label="Durée d'amortissement (ans)" required>
                <n-input-number
                  v-model:value="current.dureeAmortissement"
                  :min="1"
                  :max="20"
                  :step="1"
                  :show-button="false"
                  placeholder="Nombre d'années"
                  style="width: 100%"
                >
                  <template #suffix>
                    <span class="text-muted">ans</span>
                  </template>
                </n-input-number>
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Amortissement mensuel (MGA)" required>
                <n-input-number
                  v-model:value="current.amortissementMensuel"
                  :min="0"
                  :step="1000"
                  :show-button="false"
                  placeholder="À remplir"
                  style="width: 100%"
                >
                  <template #suffix>
                    <span class="text-muted">MGA/mois</span>
                  </template>
                </n-input-number>
              </n-form-item>
            </div>

            <!-- Affectation -->
            <div class="col-12">
              <n-divider class="my-1">Affectation au bureau</n-divider>
            </div>

            <div class="col-6">
              <n-form-item label="Titulaire du bureau" required>
                <n-input v-model:value="current.titulaire" placeholder="Nom du titulaire du bureau" />
              </n-form-item>
            </div>

            <div class="col-6">
              <n-form-item label="Bureau/Poste">
                <n-input v-model:value="current.bureau" placeholder="Bureau 101, Poste A12..." />
              </n-form-item>
            </div>

            <div class="col-12">
              <n-form-item label="Statut" path="statut" required>
                <n-select
                  v-model:value="current.statut"
                  :options="statutOptions.filter(opt => opt.value)"
                />
              </n-form-item>
            </div>

            <div class="col-12">
              <n-form-item label="Notes/Observations">
                <n-input
                  v-model:value="current.notes"
                  type="textarea"
                  :rows="3"
                  placeholder="État, usure, réparations, observations spécifiques..."
                />
              </n-form-item>
            </div>
          </div>
        </n-form>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showMaterielModal = false">Annuler</n-button>
            <n-button type="primary" size="small" @click="saveItemWithConfirmation" :loading="isLoading" class="custom-btn-primary">
              {{ isEdit ? 'Sauvegarder' : 'Ajouter' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>

    <!-- Modal Assignation -->
    <n-modal v-model:show="showAssignModal" transform-origin="center">
      <n-card
        :style="{ width: '500px', maxWidth: '90vw' }"
        :title="`Assigner au bureau - ${current.code}`"
        :bordered="false"
        size="small"
      >
        <div class="mb-2">
          <p class="mb-1"><strong>{{ current.marque }} {{ current.modele }}</strong></p>
          <p class="text-muted small mb-3">{{ current.code }}</p>
          <p class="small mb-1">Catégorie: <strong>{{ getCategorieLabel(current.categorie) }}</strong></p>
          <p class="small mb-3">Type: <strong>{{ current.type }}</strong></p>
        </div>

        <n-form :model="assignData" size="small">
          <n-form-item label="Titulaire du bureau" required>
            <n-input
              v-model:value="assignData.titulaire"
              placeholder="Nom du titulaire"
            />
          </n-form-item>
          <n-form-item label="Bureau/Poste">
            <n-input
              v-model:value="assignData.bureau"
              placeholder="Bureau 101, Poste A12..."
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="d-flex justify-content-end gap-2">
            <n-button size="small" @click="showAssignModal = false">Annuler</n-button>
            <n-button type="warning" size="small" @click="assignUserWithConfirmation" class="custom-btn-warning">
              Assigner au bureau
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h, watch } from 'vue';
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

// États du composant
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
  categorie: null,
  type: null,
  search: ''
});

// Options pour les sélecteurs - CATÉGORIES ÉTENDUES
const categorieOptions = [
  { label: 'Toutes catégories', value: null },
  { label: 'Informatique', value: 'informatique' },
  { label: 'Mobilier', value: 'mobilier' },
  { label: 'Textile', value: 'textile' },
  { label: 'Éclairage', value: 'éclairage' },
  { label: 'Divers', value: 'divers' }
];

// Types par catégorie
const typesByCategorie = {
  informatique: [
    { label: 'Ordinateur portable', value: 'Ordinateur portable' },
    { label: 'Ordinateur fixe', value: 'Ordinateur fixe' },
    { label: 'Écran/Moniteur', value: 'Écran/Moniteur' },
    { label: 'Imprimante', value: 'Imprimante' },
    { label: 'Scanner', value: 'Scanner' },
    { label: 'Photocopieur', value: 'Photocopieur' },
    { label: 'Téléphone', value: 'Téléphone' },
    { label: 'Tablette', value: 'Tablette' },
    { label: 'Serveur', value: 'Serveur' },
    { label: 'Autre équipement informatique', value: 'Autre équipement informatique' }
  ],
  mobilier: [
    { label: 'Table de bureau', value: 'Table de bureau' },
    { label: 'Chaise de bureau', value: 'Chaise de bureau' },
    { label: 'Fauteuil', value: 'Fauteuil' },
    { label: 'Armoire', value: 'Armoire' },
    { label: 'Étagère', value: 'Étagère' },
    { label: 'Tableau blanc', value: 'Tableau blanc' },
    { label: 'Table basse', value: 'Table basse' },
    { label: 'Meuble de rangement', value: 'Meuble de rangement' },
    { label: 'Autre mobilier', value: 'Autre mobilier' }
  ],
  textile: [
    { label: 'Rideau', value: 'Rideau' },
    { label: 'Tapis', value: 'Tapis' },
    { label: 'Store', value: 'Store' },
    { label: 'Voilage', value: 'Voilage' },
    { label: 'Nappe', value: 'Nappe' },
    { label: 'Autre textile', value: 'Autre textile' }
  ],
  éclairage: [
    { label: 'Lampadaire', value: 'Lampadaire' },
    { label: 'Lampe de bureau', value: 'Lampe de bureau' },
    { label: 'Spot', value: 'Spot' },
    { label: 'Lustre', value: 'Lustre' },
    { label: 'Autre éclairage', value: 'Autre éclairage' }
  ],
  divers: [
    { label: 'Climatiseur', value: 'Climatiseur' },
    { label: 'Chauffage', value: 'Chauffage' },
    { label: 'Ventilateur', value: 'Ventilateur' },
    { label: 'Horloge', value: 'Horloge' },
    { label: 'Cadre photo', value: 'Cadre photo' },
    { label: 'Plante décorative', value: 'Plante décorative' },
    { label: 'Autre équipement', value: 'Autre équipement' }
  ]
};

// Fonction pour obtenir les types par catégorie
const getTypeOptions = (categorie) => {
  if (!categorie) {
    return [{ label: 'Tous types', value: null }];
  }
  return [
    { label: 'Tous types', value: null },
    ...(typesByCategorie[categorie] || [])
  ];
};

const statutOptions = [
  { label: 'Tous statuts', value: null },
  { label: 'En service', value: 'En service' },
  { label: 'En stock', value: 'En stock' },
  { label: 'En maintenance', value: 'En maintenance' },
  { label: 'En réparation', value: 'En réparation' },
  { label: 'En panne', value: 'En panne' },
  { label: 'À remplacer', value: 'À remplacer' },
  { label: 'Hors service', value: 'Hors service' }
];

// Colonnes du tableau SANS les prix
const columns = [
  {
    title: 'Code',
    key: 'code',
    width: 100,
    render: (row) => h('span', { class: 'fw-bold text-primary' }, row.code)
  },
  {
    title: 'Type',
    key: 'type',
    width: 140,
    render: (row) => h('span', row.type)
  },
  {
    title: 'Description',
    key: 'description',
    ellipsis: { tooltip: true },
    render: (row) => h('div', [
      h('div', { class: 'fw-medium' }, `${row.marque || ''} ${row.modele || ''}`.trim()),
      row.couleur ? h('small', { class: 'text-muted ms-2' }, row.couleur) : null
    ])
  },
 /* {
    title: 'Affectation',
    key: 'affectation',
    width: 180,
    render: (row) => h('div', [
      row.titulaire ? h(NTag, { 
        type: 'info', 
        size: 'small',
        class: 'mb-1'
      }, { default: () => row.titulaire }) : null,
      row.bureau ? h('div', { class: 'small text-muted' }, `Bureau: ${row.bureau}`) : null
    ])
  },*/
  {
    title: 'Statut',
    key: 'statut',
    width: 110,
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
    width: 130,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'info',
        secondary: true,
        onClick: () => openModal('edit', row)
      }, { default: () => h('i', { class: 'bi bi-pencil' }) }),
   
      h(NButton, {
        size: 'small',
        type: 'error',
        secondary: true,
        onClick: () => deleteItemWithConfirmation(row.id)
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

  if (filters.value.categorie) {
    filtered = filtered.filter(mat => mat.categorie === filters.value.categorie);
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
      (mat.titulaire && mat.titulaire.toLowerCase().includes(searchLower)) ||
      (mat.bureau && mat.bureau.toLowerCase().includes(searchLower)) ||
      (mat.type && mat.type.toLowerCase().includes(searchLower)) ||
      (mat.categorie && mat.categorie.toLowerCase().includes(searchLower))
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


/*
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
}*/


async function fetchData() {
  try {
    isLoading.value = true;
    const response = await MaterielBureauService.getAll(filters.value);
    materiels.value = response.data;
    
    // Log pour voir la structure des données
    if (materiels.value.length > 0) {
      console.log('Premier élément:', materiels.value[0]);
      console.log('Clés du premier élément:', Object.keys(materiels.value[0]));
    }
    
    showMessage('Données chargées', false);
  } catch (error) {
    showMessage('Erreur de chargement: ' + (error.response?.data?.message || error.message), true);
  } finally {
    isLoading.value = false;
  }
}


/*
// Fonction avec confirmation pour ajout/modification
async function saveItemWithConfirmation() {
  const action = isEdit.value ? 'modifier' : 'ajouter';
  const messageText = isEdit.value 
    ? `Êtes-vous sûr de vouloir modifier le matériel "${current.value.code}" ?`
    : `Êtes-vous sûr de vouloir ajouter le nouveau matériel "${current.value.code}" ?`;
  
  const isConfirmed = window.confirm(messageText);
  if (!isConfirmed) return;
  
  try {
    // Validation
    if (!current.value.code || !current.value.categorie || !current.value.type || !current.value.marque || !current.value.modele) {
      showMessage('Veuillez remplir tous les champs obligatoires', true);
      return;
    }

    // Préparation des données
    const materielData = {
      ...current.value,
      dateAcquisition: current.value.dateAcquisition ? new Date(current.value.dateAcquisition).toISOString().split('T')[0] : null,
      dateFinGarantie: current.value.dateFinGarantie ? new Date(current.value.dateFinGarantie).toISOString().split('T')[0] : null,
      prixAchat: parseFloat(current.value.prixAchat) || 0,
      dureeAmortissement: parseInt(current.value.dureeAmortissement) || 0,
      amortissementMensuel: parseFloat(current.value.amortissementMensuel) || 0,
      // Renommer utilisateur en titulaire pour cohérence
      titulaire: current.value.titulaire || current.value.utilisateur || ''
    };

    if (isEdit.value) {
      await MaterielBureauService.update(current.value.id, materielData);
      showMessage('Matériel modifié avec succès', false);
    } else {
      await MaterielBureauService.create(materielData);
      showMessage('Matériel créé avec succès', false);
    }
    await fetchData();
    showMaterielModal.value = false;
  } catch (error) {
    showMessage('Erreur de sauvegarde: ' + (error.response?.data?.message || error.message), true);
  }
}*/


async function saveItemWithConfirmation() {
  const messageText = isEdit.value 
    ? `Êtes-vous sûr de vouloir modifier le matériel "${current.value.code}" ?`
    : `Êtes-vous sûr de vouloir ajouter le nouveau matériel "${current.value.code}" ?`;
  
  const isConfirmed = window.confirm(messageText);
  if (!isConfirmed) return;
  
  try {
    // Validation
    if (!current.value.code || !current.value.categorie || !current.value.type || !current.value.marque || !current.value.modele) {
      showMessage('Veuillez remplir tous les champs obligatoires', true);
      return;
    }

    // Préparation des données dans le format attendu par l'API
    const materielData = {
      // Champs obligatoires
      code: current.value.code,
      type: current.value.type,
      marque: current.value.marque,
      modele: current.value.modele,
      statut: current.value.statut,
      
      // Champs avec compatibilité ascendante
      utilisateur: current.value.titulaire || '', // Envoyer comme 'utilisateur' pour l'API
      titulaire: current.value.titulaire || '', // Nouveau champ
      
      // Champs optionnels
      categorie: current.value.categorie || 'informatique',
      bureau: current.value.bureau || '',
      couleur: current.value.couleur || '',
      numeroSerie: current.value.numeroSerie || '',
      departement: current.value.departement || '',
      fournisseur: current.value.fournisseur || '',
      emplacement: current.value.emplacement || '',
      notes: current.value.notes || '',
      
      // Champs numériques et dates
      prixAchat: parseFloat(current.value.prixAchat) || 0,
      dureeAmortissement: parseInt(current.value.dureeAmortissement) || 3,
      amortissementMensuel: parseFloat(current.value.amortissementMensuel) || 0,
      dateAcquisition: current.value.dateAcquisition ? new Date(current.value.dateAcquisition).toISOString().split('T')[0] : null,
      dateFinGarantie: current.value.dateFinGarantie ? new Date(current.value.dateFinGarantie).toISOString().split('T')[0] : null
    };

    // Ajouter l'ID pour la modification
    if (isEdit.value && current.value.id) {
      materielData.id = current.value.id;
    }

    if (isEdit.value) {
      await MaterielBureauService.update(current.value.id, materielData);
      showMessage('Matériel modifié avec succès', false);
    } else {
      await MaterielBureauService.create(materielData);
      showMessage('Matériel créé avec succès', false);
    }
    await fetchData();
    showMaterielModal.value = false;
  } catch (error) {
    showMessage('Erreur de sauvegarde: ' + (error.response?.data?.message || error.message), true);
  }
}

// Fonction avec confirmation pour suppression
async function deleteItemWithConfirmation(id) {
  const item = materiels.value.find(m => m.id === id);
  if (!item) return;
  
  const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le matériel "${item.code}" ?\n\nCette action est irréversible.`);
  if (!isConfirmed) return;
  
  try {
    await MaterielBureauService.delete(id);
    showMessage('Matériel supprimé avec succès', false);
    await fetchData();
  } catch (error) {
    showMessage('Erreur de suppression: ' + (error.response?.data?.message || error.message), true);
  }
}

// Fonction avec confirmation pour assignation
async function assignUserWithConfirmation() {
  const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir assigner le matériel "${current.value.code}" au bureau ?`);
  if (!isConfirmed) return;
  
  try {
    const assignDataToSend = {
      titulaire: assignData.value.titulaire,
      bureau: assignData.value.bureau,
      // Compatibilité ascendante
      utilisateur: assignData.value.titulaire
    };
    
    await MaterielBureauService.assignerUtilisateur(current.value.id, assignDataToSend);
    showMessage('Matériel assigné au bureau avec succès', false);
    await fetchData();
    showAssignModal.value = false;
  } catch (error) {
    showMessage('Erreur d\'assignation: ' + (error.response?.data?.message || error.message), true);
  }
}


/*
// Fonctions d'interface
function openModal(mode, item = null) {
  isEdit.value = mode === 'edit';
  
  if (isEdit.value && item) {
    current.value = { 
      ...item,
      // Convertir les dates pour le date-picker
      dateAcquisition: item.dateAcquisition ? new Date(item.dateAcquisition).getTime() : Date.now(),
      dateFinGarantie: item.dateFinGarantie ? new Date(item.dateFinGarantie).getTime() : null,
      // Assurer les valeurs numériques
      prixAchat: parseFloat(item.prixAchat) || 0,
      dureeAmortissement: parseInt(item.dureeAmortissement) || 0,
      amortissementMensuel: parseFloat(item.amortissementMensuel) || 0,
      // Compatibilité avec l'ancien champ utilisateur
      titulaire: item.titulaire || item.utilisateur || ''
    };
  } else {
    current.value = getDefaultMateriel();
  }
  showMaterielModal.value = true;
}
*/
function openModal(mode, item = null) {
  isEdit.value = mode === 'edit';
  
  if (isEdit.value && item) {
    current.value = { 
      // Copier toutes les propriétés de l'item
      ...item,
      
      // Mapper les champs API vers les champs formulaire
      titulaire: item.titulaire || item.utilisateur || '',
      bureau: item.bureau || '',
      couleur: item.couleur || '',
      
      // Assurer la présence des champs obligatoires (avec valeurs par défaut)
      categorie: item.categorie || 'informatique',
      dureeAmortissement: parseInt(item.dureeAmortissement) || 3,
      amortissementMensuel: parseFloat(item.amortissementMensuel) || 0,
      
      // Convertir les dates pour le date-picker
      dateAcquisition: item.dateAcquisition ? new Date(item.dateAcquisition).getTime() : Date.now(),
      dateFinGarantie: item.dateFinGarantie ? new Date(item.dateFinGarantie).getTime() : null,
      
      // Assurer les valeurs numériques
      prixAchat: parseFloat(item.prixAchat) || 0,
      
      // Renommer utilisateur en titulaire pour cohérence
      titulaire: item.titulaire || item.utilisateur || ''
    };
  } else {
    current.value = getDefaultMateriel();
  }
  
  showMaterielModal.value = true;
}

function openAssignModal(item) {
  current.value = { ...item };
  assignData.value = { 
    titulaire: item.titulaire || item.utilisateur || '', 
    bureau: item.bureau || ''
  };
  showAssignModal.value = true;
}

function handleCategorieChange(categorie) {
  // Réinitialiser le type quand la catégorie change
  current.value.type = null;
}

function handleCategorieFilterChange(categorie) {
  // Réinitialiser le type du filtre quand la catégorie change
  filters.value.type = null;
}


/*
function getDefaultMateriel() {
  const code = generateMaterielCode();
  return {
    code: code,
    categorie: 'informatique',
    type: '',
    marque: '',
    modele: '',
    couleur: '',
    titulaire: '',
    bureau: '',
    statut: 'En stock',
    dateAcquisition: Date.now(),
    dateFinGarantie: null,
    prixAchat: 0,
    dureeAmortissement: 3,
    amortissementMensuel: 0,
    fournisseur: '',
    notes: ''
  };
}*/
function getDefaultMateriel() {
  const code = generateMaterielCode();
  return {
    code: code,
    categorie: 'informatique',
    type: '',
    marque: '',
    modele: '',
    numeroSerie: '',
    couleur: '',
    titulaire: '',
    bureau: '',
    departement: '',
    statut: 'En stock',
    dateAcquisition: Date.now(),
    dateFinGarantie: null,
    prixAchat: 0,
    dureeAmortissement: 3,
    amortissementMensuel: 0,
    fournisseur: '',
    emplacement: '',
    notes: ''
  };
}

// Génération automatique de code avec préfixe catégorie
function generateMaterielCode() {
  const existingCodes = materiels.value.map(m => m.code);
  let newCode = '';
  let counter = 1;
  
  const prefixMap = {
    'informatique': 'INF',
    'mobilier': 'MOB',
    'textile': 'TEX',
    'éclairage': 'ECL',
    'divers': 'DIV'
  };
  
  const defaultPrefix = 'MAT';
  const selectedPrefix = prefixMap[current.value.categorie] || defaultPrefix;
  
  do {
    newCode = `${selectedPrefix}-${String(counter).padStart(3, '0')}`;
    counter++;
  } while (existingCodes.includes(newCode) && counter < 1000);
  
  return newCode;
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
  filters.value = { statut: null, categorie: null, type: null, search: '' };
  fetchData();
}

// Fonctions utilitaires
function getCategorieLabel(categorie) {
  const labels = {
    'informatique': 'Informatique',
    'mobilier': 'Mobilier',
    'textile': 'Textile',
    'éclairage': 'Éclairage',
    'divers': 'Divers'
  };
  return labels[categorie] || categorie;
}

function getStatutType(statut) {
  const types = {
    'En service': 'success',
    'En stock': 'info',
    'En maintenance': 'warning',
    'En réparation': 'warning',
    'En panne': 'error',
    'À remplacer': 'error',
    'Hors service': 'default'
  };
  return types[statut] || 'default';
}

function getStatutShort(statut) {
  const shorts = {
    'En service': 'Service',
    'En stock': 'Stock',
    'En maintenance': 'Maint.',
    'En réparation': 'Répar.',
    'En panne': 'Panne',
    'À remplacer': 'Rempl.',
    'Hors service': 'H.S.'
  };
  return shorts[statut] || statut;
}

function getRowClass(row) {
  if (row.statut === 'Hors service') return 'table-row-secondary';
  if (row.statut === 'En panne' || row.statut === 'À remplacer') return 'table-row-danger';
  if (row.statut === 'En maintenance' || row.statut === 'En réparation') return 'table-row-warning';
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

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

function refreshPage() {
  fetchData();
}
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

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
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
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
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

/* Cartes d'information améliorées */
.bg-light .n-card {
  background-color: rgba(0, 123, 255, 0.05) !important;
  border-left: 3px solid #007bff;
}

/* Responsive */
@media (max-width: 992px) {
  .custom-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem !important;
  }
  
  .custom-header > div {
    width: 100%;
    justify-content: center !important;
  }
  
  .custom-title {
    font-size: 1.3rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .col-md-9, .col-md-3 {
    width: 100%;
  }
  
  .custom-title {
    font-size: 1.2rem;
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


/* Layout principal */
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
}

/* Header fixé */
.fixed-header {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  flex-shrink: 0; /* Empêche le header de rétrécir */
}

/* Contenu avec scroll */
.content-with-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 0; /* Pas de marge car header est sticky */
  padding-top: 16px; /* Espace entre le header et le contenu */
}

/* Ajustement du conteneur de réservation */
.reservation-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 20px 20px; /* Pas de padding-top car déjà géré */
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ajustement du conteneur de scroll existant */
.content-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  padding-top: 0;
}

/* Ajustement responsive */
@media (max-width: 768px) {
  .content-with-scroll {
    padding: 12px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 12px !important;
  }
  
  .reservation-page-container {
    padding: 0 12px 12px 12px;
  }
}

@media (max-width: 576px) {
  .content-with-scroll {
    padding: 8px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 8px !important;
  }
  
  .reservation-page-container {
    padding: 0 8px 8px 8px;
  }
}

</style>