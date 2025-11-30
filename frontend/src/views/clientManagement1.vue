<template>
  <div class="client-management-container">
    <!-- Header amélioré -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-people-fill me-2"></i>
                Gestion des Clients
              </h1>
              <p class="custom-subtitle">Gestion complète du portefeuille clients et suivi des activités</p>
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
    <div class="main-content-scroll">
      <!-- Cartes de statistiques -->
      <n-grid :cols="2" :x-gap="12" :y-gap="12" class="mb-4">
        <n-gi>
          <n-card class="stat-card top-client custom-card-primary" content-class="text-center">
            <div class="stat-content">
              <n-icon color="#faad14" size="24" class="mb-2">
                <i class="bi bi-trophy"></i>
              </n-icon>
              <div class="stat-value">{{ formatCurrency(topClient.revenue) }}</div>
              <div class="stat-label text-white">Client le plus rentable</div>
              <n-text class="small text-white-50">{{ topClient.name }}</n-text>
            </div>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card class="stat-card active-client custom-card-warning" content-class="text-center">
            <div class="stat-content">
              <n-icon color="#ffc107" size="24" class="mb-2">
                <i class="bi bi-lightning-charge"></i>
              </n-icon>
              <div class="stat-value">{{ activeClient.count }}</div>
              <div class="stat-label text-white">Client le plus actif</div>
              <n-text class="small text-white-50">{{ activeClient.name }}</n-text>
            </div>
          </n-card>
        </n-gi>
      </n-grid>

      <!-- Barre d'actions et recherche -->
      <n-card class="filters-card custom-card mb-4">
        <div class="d-flex justify-content-between align-items-center">
          <n-button type="primary" @click="openModal('create')" class="me-3 custom-btn-primary">
            <template #icon>
              <n-icon><i class="bi bi-plus-circle"></i></n-icon>
            </template>
            Ajouter un Client
          </n-button>
          
          <n-input
            v-model:value="searchQuery"
            placeholder="Rechercher par nom, email, téléphone..."
            clearable
            class="search-input"
            style="max-width: 400px;"
          >
            <template #prefix>
              <n-icon><i class="bi bi-search"></i></n-icon>
            </template>
          </n-input>
        </div>
      </n-card>

      <!-- Tableau des clients -->
      <n-card class="main-card custom-card">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="card-title mb-0">
                <i class="bi bi-list-ul me-2"></i>
                Liste des Clients
              </h3>
              <p class="card-subtitle text-muted mb-0">
                {{ filteredClients.length }} client(s) trouvé(s)
              </p>
            </div>
          </div>
        </template>

        <div class="table-scroll-container">
          <n-data-table
            :columns="tableColumns"
            :data="filteredClients"
            :bordered="false"
            :loading="isLoading"
            size="small"
            class="clients-table"
            flex-height
            :min-height="400"
            :max-height="600"
            :scroll-x="1200"
          />
        </div>

        <template #footer>
          <div class="text-center text-muted small">
            <n-text depth="3">
              <i class="bi bi-info-circle me-1"></i>
              Double-cliquez sur un client pour voir son historique détaillé
            </n-text>
          </div>
        </template>
      </n-card>
    </div>

    <!-- Modal Création/Modification Client -->
    <n-modal
      v-model:show="showClientModal"
      preset="dialog"
      :title="modalMode === 'create' ? 'Ajouter un nouveau Client' : 'Modifier le Client'"
      positive-text="Sauvegarder"
      negative-text="Annuler"
      :loading="isSubmitting"
      @positive-click="saveClient"
      @negative-click="showClientModal = false"
      style="width: 700px"
      class="scrollable-modal"
    >
      <div class="modal-scroll-content">
        <n-form :model="currentClient" :rules="clientRules" ref="clientFormRef">
          <n-grid :cols="2" :x-gap="16" :y-gap="16">
            <!-- Association Utilisateur -->
            <n-gi :span="2">
              <n-form-item 
                v-if="modalMode === 'create'" 
                label="Utilisateur à Associer" 
                path="idUti"
              >
                <n-select
                  v-model:value="currentClient.idUti"
                  :options="clientUserOptions"
                  placeholder="Sélectionner un utilisateur..."
                  clearable
                  filterable
                />
              </n-form-item>
              <n-form-item 
                v-else 
                label="ID Utilisateur Associé"
              >
                <n-input
                  :value="currentClient.idUti"
                  disabled
                  placeholder="ID utilisateur non modifiable"
                />
              </n-form-item>
            </n-gi>

            <!-- Informations personnelles -->
            <n-gi>
              <n-form-item label="Nom" path="nomCli">
                <n-input v-model:value="currentClient.nomCli" placeholder="Nom du client" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Prénom" path="prenomCli">
                <n-input v-model:value="currentClient.prenomCli" placeholder="Prénom du client" />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Email" path="emailCli">
                <n-input v-model:value="currentClient.emailCli" placeholder="email@exemple.com" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Téléphone" path="telephoneCli">
                <n-input v-model:value="currentClient.telephoneCli" placeholder="+261 XX XX XXX XX" />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Adresse" path="addresseCli">
                <n-input
                  v-model:value="currentClient.addresseCli"
                  type="textarea"
                  placeholder="Adresse complète du client"
                  :rows="2"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="Type Client" path="typeCli">
                <n-select
                  v-model:value="currentClient.typeCli"
                  :options="typeOptions"
                  placeholder="Sélectionner le type"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Statut" path="statutCli">
                <n-select
                  v-model:value="currentClient.statutCli"
                  :options="statusOptions"
                  placeholder="Sélectionner le statut"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-form>
      </div>
    </n-modal>

    <!-- Modal Historique Client -->
    <n-modal
      v-model:show="showHistoryModal"
      preset="dialog"
      :title="`Historique - ${historyClient.nomCli} ${historyClient.prenomCli}`"
      style="width: 900px; max-height: 90vh;"
      :show-icon="false"
      class="scrollable-modal"
    >
      <div class="history-modal-scroll">
        <n-tabs type="line" v-model:value="historyTab">
          <n-tab-pane name="locations" tab="Historique Locations">
            <n-card size="small" :bordered="false">
              <template #header>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Locations Passées</h6>
                  <n-tag type="info" size="small" class="custom-tag">
                    {{ historyClient.locations?.length || 0 }} location(s)
                  </n-tag>
                </div>
              </template>
              
              <n-data-table
                :columns="locationColumns"
                :data="historyClient.locations || []"
                size="small"
                :bordered="false"
                :loading="historyLoading"
                :max-height="300"
                :scroll-x="800"
              />
            </n-card>
          </n-tab-pane>

          <n-tab-pane name="reservations" tab="Réservations Actuelles">
            <n-card size="small" :bordered="false">
              <template #header>
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Réservations en Cours</h6>
                  <n-tag type="info" size="small" class="custom-tag">
                    {{ historyClient.reservations?.length || 0 }} réservation(s)
                  </n-tag>
                </div>
              </template>
              
              <n-data-table
                :columns="reservationColumns"
                :data="historyClient.reservations || []"
                size="small"
                :bordered="false"
                :max-height="300"
                :scroll-x="800"
              />
            </n-card>
          </n-tab-pane>

          <n-tab-pane name="activite" tab="Suivi d'Activité">
            <n-card size="small" :bordered="false">
              <template #header>
                <h6 class="mb-0">Journal des Activités</h6>
              </template>
              
              <div class="timeline-scroll">
                <n-timeline>
                  <n-timeline-item
                    v-for="(activity, index) in historyClient.activityLogs || []"
                    :key="index"
                    :type="getTimelineType(activity.type)"
                    :time="activity.date"
                  >
                    {{ activity.description }}
                  </n-timeline-item>
                  <n-timeline-item v-if="!historyClient.activityLogs?.length">
                    <n-empty description="Aucune activité récente">
                      <template #icon>
                        <n-icon>
                          <i class="bi bi-clock-history"></i>
                        </n-icon>
                      </template>
                    </n-empty>
                  </n-timeline-item>
                </n-timeline>
              </div>
            </n-card>
          </n-tab-pane>
        </n-tabs>
      </div>

      <template #action>
        <n-button @click="showHistoryModal = false" class="custom-btn-primary">Fermer</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NTag, NBadge, NDropdown   } from 'naive-ui';

import ClientService from '../services/ClientService'; 
import UserServices from '../services/ServiceUser';


const router = useRouter();

// Options du menu de navigation
const navigationOptions = [

  {
    label: 'Location & Reservation',
    key: 'calendrier',
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
    label: 'Matériel de Bureau',
    key: 'bureau',
    icon: () => h('i', { class: 'bi bi-laptop me-2' })
  },
  
  {
    type: 'divider'
  },
  {
    label: 'Gestion Financière',
    key: 'finance',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
  },
  {
    label: 'Suivi & Rapports',
    key: 'rapport',
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
    'dashboard': '/dashboardAdmin',
    'finance': '/finance',
    'rapport': '/rapport',
    'calendrier': '/location',
    'inventaire': '/patrimoine1',
    'bureau': '/materielBureauView1'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};


// États principaux
const clients = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const isSubmitting = ref(false);
const historyLoading = ref(false);

// États modales
const showClientModal = ref(false);
const showHistoryModal = ref(false);
const modalMode = ref('create');
const historyTab = ref('locations');

// Données courantes
const currentClient = ref({});
const historyClient = ref({});
const clientUsers = ref([]);

// Modèle de données
const emptyClient = {
  idCli: null, 
  idUti: '', 
  nomCli: '', 
  prenomCli: '', 
  emailCli: '', 
  telephoneCli: '', 
  addresseCli: '',
  typeCli: 'particulier',
  statutCli: 'actif'
};

// Métriques
const topClient = ref({ name: 'N/A', revenue: 0 });
const activeClient = ref({ name: 'N/A', count: 0 });

// Options pour les selects
const typeOptions = [
  { label: 'Particulier', value: 'particulier' },
  { label: 'Entreprise', value: 'entreprise' },
  { label: 'ONG', value: 'ONG' },
  { label: 'Association', value: 'association' },
  { label: 'Institution Publique', value: 'institution Public' }
];

const statusOptions = [
  { label: 'Actif', value: 'actif' },
  { label: 'Inactif', value: 'inactif' },
  { label: 'Bloqué', value: 'bloqué' }
];

const clientUserOptions = computed(() => {
  return clientUsers.value.map(user => ({
    label: `ID ${user.idUti} - ${user.nom} ${user.prenom}`,
    value: user.idUti
  }));
});

// Règles de validation
const clientRules = {
  nomCli: {
    required: true,
    message: 'Le nom est requis',
    trigger: 'blur'
  },
  emailCli: {
    type: 'email',
    message: 'Format email invalide',
    trigger: 'blur'
  }
};

// Configuration des colonnes du tableau
const tableColumns = [
  {
    title: 'ID',
    key: 'idCli',
    width: 80,
    render: (row) => h('span', { class: 'fw-bold text-muted' }, `#${row.idCli}`)
  },
  {
    title: 'Nom Complet',
    key: 'nomComplet',
    ellipsis: true,
    render: (row) => `${row.nomCli} ${row.prenomCli || ''}`
  },
  {
    title: 'Email',
    key: 'emailCli',
    ellipsis: true
  },
  {
    title: 'Téléphone',
    key: 'telephoneCli',
    width: 150
  },
  {
    title: 'Type',
    key: 'typeCli',
    width: 140,
    render: (row) => h(NTag, { 
      type: getClientTypeTagType(row.typeCli),
      size: 'small',
      bordered: false,
      class: 'custom-tag'
    }, { default: () => row.typeCli })
  },
  {
    title: 'Statut',
    key: 'statutCli',
    width: 120,
    render: (row) => h(NBadge, {
      type: getStatusBadgeType(row.statutCli),
      value: getStatusText(row.statutCli)
    })
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (row) => h('div', { class: 'action-buttons' }, [
      h(NButton, {
        size: 'small',
        type: 'info',
        ghost: true,
        onClick: () => openHistoryModal(row),
        class: 'me-1'
      }, {
        icon: () => h('i', { class: 'bi bi-clock-history' })
      }),
      h(NButton, {
        size: 'small',
        type: 'primary',
        ghost: true,
        onClick: () => openModal('update', row),
        class: 'me-1 custom-btn-primary'
      }, {
        icon: () => h('i', { class: 'bi bi-pencil' })
      }),
      h(NButton, {
        size: 'small',
        type: 'error',
        ghost: true,
        onClick: () => deleteClient(row),
        class: 'custom-btn-danger'
      }, {
        icon: () => h('i', { class: 'bi bi-trash' })
      })
    ])
  }
];

// Colonnes pour l'historique
const locationColumns = [
  { title: 'ID Location', key: 'idLo', width: 100 },
  { title: 'Date Début', key: 'dateDebut', render: (row) => formatDate(row.dateDebut) },
  { title: 'Date Fin', key: 'dateFin', render: (row) => formatDate(row.dateFin) },
  { title: 'Type', key: 'typeLo' },
  { title: 'Montant', key: 'montant', render: (row) => formatCurrency(row.montant) }
];

const reservationColumns = [
  { title: 'ID Réservation', key: 'idResa', width: 120 },
  { title: 'Date Réservation', key: 'dateResa', render: (row) => formatDate(row.dateResa) },
  { title: 'Date Début', key: 'dateDebut', render: (row) => formatDate(row.dateDebut) },
  { title: 'Date Fin', key: 'dateFin', render: (row) => formatDate(row.dateFin) },
  { title: 'Type', key: 'type' },
  { 
    title: 'Statut', 
    key: 'statut', 
    render: (row) => h(NTag, { 
      type: getStatusBadgeType(row.statut),
      size: 'small',
      class: 'custom-tag'
    }, { default: () => row.statut })
  }
];

// Propriétés calculées
const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  
  const query = searchQuery.value.toLowerCase();
  return clients.value.filter(client => 
    client.nomCli?.toLowerCase().includes(query) ||
    client.prenomCli?.toLowerCase().includes(query) ||
    client.emailCli?.toLowerCase().includes(query) ||
    client.telephoneCli?.includes(query)
  );
});

// Cycle de vie
onMounted(() => {
  fetchClients();
  fetchClientUsers();
  fetchMetrics();
});

// Fonctions principales
async function fetchClients() {
  try {
    isLoading.value = true;
    const clientsData = await ClientService.getAllClients();
    clients.value = clientsData || [];
  } catch (error) {
    console.error("Erreur de chargement des clients:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchClientUsers() {
  try {
    const usersData = await UserServices.getAllClientUsers();
    clientUsers.value = usersData || [];
  } catch (error) {
    console.error("Erreur de chargement des utilisateurs clients:", error);
  }
}

async function fetchMetrics() {
  try {
    const metricsData = await ClientService.getRankingMetrics();
    const top = metricsData?.topClient || {};
    const active = metricsData?.activeClient || {};

    topClient.value = {
      name: top.nomCli ? `${top.nomCli} ${top.prenomCli || ''}`.trim() : 'Aucun client rentable',
      revenue: parseFloat(top.totalRevenue) || 0
    };

    activeClient.value = {
      name: active.nomCli ? `${active.nomCli} ${active.prenomCli || ''}`.trim() : 'Aucun client actif',
      count: parseInt(active.totalLocations) || 0
    };
  } catch (error) {
    console.error("Erreur de chargement des métriques:", error);
  }
}

async function saveClient() {
  try {
    isSubmitting.value = true;
    
    if (modalMode.value === 'create') {
      await ClientService.createClient(currentClient.value);
    } else {
      await ClientService.updateClient(currentClient.value.idCli, currentClient.value);
    }
    
    showClientModal.value = false;
    await fetchClients();
    await fetchMetrics();
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteClient(client) {
  const clientName = `${client.nomCli} ${client.prenomCli || ''}`.trim();
  
  if (!confirm(`Supprimer définitivement le client "${clientName}" ?`)) return;
  
  try {
    await ClientService.deleteClient(client.idCli);
    await fetchClients();
    await fetchMetrics();
  } catch (error) {
    console.error("Erreur de suppression:", error);
  }
}

// Fonctions d'interface
function openModal(mode, clientData = null) {
  modalMode.value = mode;
  
  if (mode === 'create') {
    currentClient.value = { ...emptyClient };
  } else {
    currentClient.value = { ...clientData };
  }
  
  showClientModal.value = true;
}

async function openHistoryModal(client) {
  try {
    historyLoading.value = true;
    const historyData = await ClientService.getClientHistory(client.idCli);
    
    historyClient.value = {
      ...client,
      locations: historyData?.locations || [],
      reservations: historyData?.reservations || [],
      activityLogs: [
        { date: '2025-10-15 14:30', description: 'Connexion réussie', type: 'success' },
        { date: '2025-09-15 10:00', description: 'Facture payée automatiquement', type: 'info' },
      ]
    };
    
    historyTab.value = 'locations';
    showHistoryModal.value = true;
  } catch (error) {
    console.error("Erreur de chargement de l'historique:", error);
    historyClient.value = { ...client, locations: [], reservations: [], activityLogs: [] };
    showHistoryModal.value = true;
  } finally {
    historyLoading.value = false;
  }
}

// Utilitaires
function getClientTypeTagType(type) {
  const types = {
    'particulier': 'default',
    'entreprise': 'info',
    'ONG': 'success',
    'association': 'warning',
    'institution Public': 'error'
  };
  return types[type] || 'default';
}

function getStatusBadgeType(status) {
  const types = {
    'actif': 'success',
    'inactif': 'default',
    'bloqué': 'error',
    'confirmée': 'info',
    'en attente': 'warning'
  };
  return types[status?.toLowerCase()] || 'default';
}

function getStatusText(status) {
  const texts = {
    'actif': 'Actif',
    'inactif': 'Inactif',
    'bloqué': 'Bloqué'
  };
  return texts[status] || status;
}

function getTimelineType(type) {
  const types = {
    'success': 'success',
    'info': 'info',
    'warning': 'warning',
    'error': 'error'
  };
  return types[type] || 'default';
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-MG', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0
  }).format(value || 0);
};
</script>

<style scoped>
.client-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
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

/* Conteneur principal avec scroll */
.main-content-scroll {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  padding-right: 8px;
}

/* Cards */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Cartes de statistiques avec couleurs cohérentes */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.custom-card-warning {
  background: linear-gradient(135deg, #0405BF 0%, #0405BF 100%);
  color: white;
}

.stat-card {
  transition: transform 0.2s ease;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.top-client {
  border-left-color: #faad14;
}

.stat-card.active-client {
  border-left-color: #ffc107;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
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

.custom-btn-danger {
  background: #5E5E5E !important;
  border-color: #5E5E5E !important;
  color: white !important;
}

.custom-btn-danger:hover {
  background: #4a4a4a !important;
  border-color: #4a4a4a !important;
}

.custom-tag {
  font-weight: 600;
}

/* Table */
.table-scroll-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
}

:deep(.clients-table .n-data-table-thead) {
  background-color: #f8f9fa;
}

:deep(.clients-table .n-data-table-th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  position: sticky;
  top: 0;
  z-index: 1;
}

:deep(.clients-table .n-data-table-tr--hover) {
  background-color: #f8f9ff !important;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

/* Modales avec scroll */
:deep(.scrollable-modal .n-dialog) {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

:deep(.scrollable-modal .n-dialog__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-scroll-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.history-modal-scroll {
  max-height: 60vh;
  overflow-y: auto;
}

.timeline-scroll {
  max-height: 300px;
  overflow-y: auto;
}

/* Scrollbars personnalisées */
.main-content-scroll::-webkit-scrollbar,
.table-scroll-container::-webkit-scrollbar,
.history-modal-scroll::-webkit-scrollbar,
.timeline-scroll::-webkit-scrollbar,
.modal-scroll-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.main-content-scroll::-webkit-scrollbar-track,
.table-scroll-container::-webkit-scrollbar-track,
.history-modal-scroll::-webkit-scrollbar-track,
.timeline-scroll::-webkit-scrollbar-track,
.modal-scroll-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main-content-scroll::-webkit-scrollbar-thumb,
.table-scroll-container::-webkit-scrollbar-thumb,
.history-modal-scroll::-webkit-scrollbar-thumb,
.timeline-scroll::-webkit-scrollbar-thumb,
.modal-scroll-content::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.main-content-scroll::-webkit-scrollbar-thumb:hover,
.table-scroll-container::-webkit-scrollbar-thumb:hover,
.history-modal-scroll::-webkit-scrollbar-thumb:hover,
.timeline-scroll::-webkit-scrollbar-thumb:hover,
.modal-scroll-content::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .client-management-container {
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
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .table-scroll-container {
    max-height: 500px;
  }
  
  .main-content-scroll {
    max-height: calc(100vh - 100px);
  }
}

@media (max-width: 576px) {
  .table-scroll-container {
    font-size: 0.8rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .main-content-scroll {
    max-height: calc(100vh - 80px);
  }
}

/* Support pour le défilement fluide */
.main-content-scroll {
  scroll-behavior: smooth;
}
</style>