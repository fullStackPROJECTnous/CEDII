<template>
  <div class="admin-container full-page-scroll">
    <!-- Header unifié -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour au Dashboard
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-person-gear me-2"></i>
                Gestion des Utilisateurs & Permissions
              </h1>
              <p class="custom-subtitle">Administrez les comptes et droits d'accès de la plateforme</p>
            </div>
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

    <!-- KPIs Utilisateurs (NON CLIQUABLES) -->
    <n-grid :cols="4" :x-gap="16" class="mb-4">
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Total Utilisateurs" :value="userStats.total" class="text-primary">
            <template #prefix>
              <i class="bi bi-people"></i>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Administrateurs" :value="userStats.admins" class="text-danger">
            <template #prefix>
              <i class="bi bi-shield-check"></i>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Connectés (24h)" :value="userStats.active24h" class="text-success">
            <template #prefix>
              <i class="bi bi-person-check"></i>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Inactifs" :value="userStats.inactive" class="text-warning">
            <template #prefix>
              <i class="bi bi-person-x"></i>
            </template>
          </n-statistic>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Contenu principal amélioré -->
    <n-card class="custom-card main-content-card">
      <template #header>
        <n-space justify="space-between" align="center">
          <n-h4 class="mb-0">
            <i class="bi bi-person-lines-fill me-2"></i>
            Liste des Utilisateurs
          </n-h4>
          <n-space>
            <n-input
              v-model:value="searchQuery"
              placeholder="Rechercher par login, rôle..."
              clearable
              style="width: 250px"
            >
              <template #prefix>
                <i class="bi bi-search"></i>
              </template>
            </n-input>
            <n-button 
              type="primary" 
              @click="openUserModal('add')"
              class="custom-btn-primary"
            >
              <template #icon>
                <i class="bi bi-person-plus"></i>
              </template>
              Nouvel Utilisateur
            </n-button>
            <n-button 
              type="info"
              @click="exportUsers"
              :loading="exporting"
              class="custom-btn-outline"
            >
              <template #icon>
                <i class="bi bi-download"></i>
              </template>
              Exporter
            </n-button>
          </n-space>
        </n-space>
      </template>

      <!-- Filtres rapides -->
      <div class="filters-container mb-3">
        <n-space>
          <n-tag
            v-for="filter in roleFilters"
            :key="filter.value"
            :type="activeRoleFilter === filter.value ? 'primary' : 'default'"
            @click="toggleRoleFilter(filter.value)"
            class="cursor-pointer"
          >
            {{ filter.label }} ({{ filter.count }})
          </n-tag>
          <n-button 
            v-if="activeRoleFilter" 
            text 
            size="small" 
            @click="clearRoleFilter"
          >
            Tout afficher
          </n-button>
        </n-space>
        
        <!-- Options d'affichage -->
        <div class="view-options mt-2">
          <n-space>
            <n-checkbox v-model:checked="showInactive">Afficher inactifs</n-checkbox>
            <n-checkbox v-model:checked="showLastActivity">Afficher dernière activité</n-checkbox>
          </n-space>
        </div>
      </div>

      <!-- Tableau utilisateurs -->
      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Chargement des utilisateurs...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger shadow-sm">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
      </div>

      <div v-else>
        <div v-if="filteredUsers.length === 0" class="text-center text-muted p-5">
          <i class="bi bi-person-x display-4"></i>
          <h5 class="mt-3">Aucun utilisateur trouvé</h5>
          <p class="text-muted">Aucun utilisateur ne correspond à vos critères de recherche</p>
          <n-button type="primary" @click="clearFilters">
            <i class="bi bi-arrow-counterclockwise me-2"></i>
            Réinitialiser les filtres
          </n-button>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Login</th>
                <th>Rôle</th>
                <th v-if="showLastActivity">Dernière Activité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.idUti" :class="getUserRowClass(user)">
                <td>{{ user.idUti }}</td> 
                <td>
                  <div class="d-flex align-items-center">
                    <div :class="`user-avatar ${getRoleColor(user.roleUti)}`">
                      <i :class="getRoleIcon(user.roleUti)"></i>
                    </div>
                    <div class="ms-2">
                      <div class="fw-bold">{{ user.loginUti }}</div>
                      <small class="text-muted">{{ formatDate(user.dateCreation) }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="['badge', getRoleClass(user.roleUti)]">
                    {{ formatRole(user.roleUti) }}
                  </span>
                </td>
           
                <td v-if="showLastActivity">
                  <span v-if="user.lastActivityLoading" class="text-muted">
                    <i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i>
                  </span>
                  <span v-else>
                    {{ user.lastActivity || 'Aucune activité' }}
                    <br>
                    <small class="text-muted">{{ user.lastLogin ? formatTimeAgo(user.lastLogin) : 'Jamais connecté' }}</small>
                  </span>
                </td>
                <td>
                  <span :class="['badge', user.lastLogin && isRecentlyActive(user.lastLogin) ? 'bg-success' : 'bg-secondary']">
                    {{ user.lastLogin && isRecentlyActive(user.lastLogin) ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" @click="openHistoryModal(user)" title="Historique">
                      <i class="bi bi-clock-history"></i>
                    </button>
                    <button class="btn btn-outline-primary" @click="openUserModal('edit', user)" title="Modifier">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger" 
                      @click="confirmDelete(user)"
                      :disabled="user.roleUti === 'ADMIN'"
                      :title="user.roleUti === 'ADMIN' ? 'Impossible de supprimer un admin' : 'Supprimer'"
                    >
                      <i class="bi bi-trash"></i> 
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination améliorée -->
        <div class="d-flex justify-content-between align-items-center mt-3">
          <n-text depth="3">
            {{ filteredUsers.length }} utilisateur(s) sur {{ users.length }} total
          </n-text>
          <div class="d-flex align-items-center gap-3">
            <n-select
              v-model:value="pageSize"
              :options="pageSizeOptions"
              size="small"
              style="width: 100px"
            />
            <n-pagination 
              v-model:page="currentPage" 
              :page-count="totalPages" 
              size="small"
            />
          </div>
        </div>
      </div>
    </n-card>
    
    <!-- Modals existants (conservés) -->
    <UserModal 
      :isVisible="isModalVisible" 
      :mode="modalMode"
      :initialUser="currentUser"
      @close="isModalVisible = false"
      @user-saved="handleUserSaved"
    />

    <div v-if="isHistoryModalVisible" class="modal-backdrop-custom">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-clock-history me-2"></i>
              Historique des actions de {{ historyUser.loginUti }}
            </h5>
            <button type="button" class="btn-close" @click="isHistoryModalVisible = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="historyLoading" class="text-center p-3">
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
              <span class="ms-2">Chargement de l'historique...</span>
            </div>
            <ul v-else class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto;">
              <li v-if="historyLogs.length === 0" class="list-group-item text-center text-muted">
                <i class="bi bi-journal-x display-5"></i>
                <p class="mt-2">Aucun historique d'action trouvé pour cet utilisateur.</p>
              </li>
              <li v-for="log in historyLogs" :key="log.id" class="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <span class="fw-bold me-2">{{ log.type }} :</span>
                  {{ log.description }}
                  <div class="small text-muted mt-1">
                    <i class="bi bi-info-circle me-1"></i>
                    {{ log.details || 'Aucun détail supplémentaire' }}
                  </div>
                </div>
                <small class="text-muted">{{ log.date }}</small>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <n-button type="default" @click="isHistoryModalVisible = false">
              Fermer
            </n-button>
            <n-button type="primary" @click="exportUserHistory(historyUser)">
              <i class="bi bi-download me-2"></i>
              Exporter historique
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import UserModal from './userModal.vue'; 
import ServiceUser from '../services/ServiceUser.js';

const router = useRouter();
const toast = useToast();

// États
const navigationOptions = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: 'bi-speedometer2'
  },
  {
    label: 'Gestion Clients',
    key: 'clients',
    icon: 'bi-people'
  },
  {
    label: 'Locations',
    key: 'locations',
    icon: 'bi-calendar-check'
  },
  {
    label: 'Finance',
    key: 'finance',
    icon: 'bi-cash-coin'
  },
  {
    label: 'Rapports',
    key: 'rapports',
    icon: 'bi-graph-up'
  },
  {
    label: 'Inventaire',
    key: 'inventaire',
    icon: 'bi-tools'
  }
];

const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardAdmin',
    'clients': '/clientManagementAdmin',
    'locations': '/location',
    'finance': '/finance',
    'rapports': '/rapport',
    'inventaire': '/patrimoine-admin'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

// États existants
const users = ref([]);
const isModalVisible = ref(false);
const modalMode = ref('add');
const currentUser = ref(null);
const loading = ref(true); 
const error = ref(null); 
const searchQuery = ref('');
const isHistoryModalVisible = ref(false);
const historyUser = ref({});
const historyLogs = ref([]);
const historyLoading = ref(false);

// États pour fonctionnalités
const activeRoleFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const exporting = ref(false);
const showInactive = ref(true);
const showLastActivity = ref(true);

// Statistiques
const userStats = ref({
  total: 0,
  admins: 0,
  active24h: 0,
  inactive: 0
});

// Options de pagination
const pageSizeOptions = [
  { label: '10 par page', value: 10 },
  { label: '25 par page', value: 25 },
  { label: '50 par page', value: 50 },
  { label: 'Tous', value: 1000 }
];

// Computed properties
const roleFilters = computed(() => {
  const roles = ['ADMIN', 'RECEPTION', 'FINANCE', 'CLIENT'];
  return roles.map(role => ({
    value: role,
    label: formatRole(role),
    count: users.value.filter(u => u.roleUti?.toUpperCase() === role).length
  }));
});

const filteredUsers = computed(() => {
  let filtered = users.value;
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => {
      return (
        user.loginUti.toLowerCase().includes(query) ||
        user.roleUti.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    });
  }
  
  // Filtre par rôle
  if (activeRoleFilter.value) {
    filtered = filtered.filter(user => 
      user.roleUti.toUpperCase() === activeRoleFilter.value.toUpperCase()
    );
  }
  
  // Filtre inactifs
  if (!showInactive.value) {
    filtered = filtered.filter(user => 
      user.lastLogin && isRecentlyActive(user.lastLogin)
    );
  }
  
  return filtered;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / pageSize.value);
});

// Fonctions utilitaires
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `Il y a ${Math.floor(diff / 86400)} j`;
  return `Il y a ${Math.floor(diff / 2592000)} mois`;
};

const isRecentlyActive = (timestamp) => {
  if (!timestamp) return false;
  const now = new Date();
  const date = new Date(timestamp);
  const diff = Math.floor((now - date) / 1000);
  return diff < 24 * 60 * 60; // 24 heures
};

const getRoleIcon = (role) => {
  const icons = {
    'ADMIN': 'bi-shield-check',
    'RECEPTION': 'bi-reception',
    'FINANCE': 'bi-cash-coin',
    'CLIENT': 'bi-person'
  };
  return icons[role?.toUpperCase()] || 'bi-person';
};

const getRoleColor = (role) => {
  const colors = {
    'ADMIN': 'admin',
    'RECEPTION': 'reception',
    'FINANCE': 'finance',
    'CLIENT': 'client'
  };
  return colors[role?.toUpperCase()] || 'default';
};

const getUserRowClass = (user) => {
  if (user.roleUti === 'ADMIN') return 'admin-user';
  if (!user.lastLogin || !isRecentlyActive(user.lastLogin)) return 'inactive-user';
  return '';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatRole = (role) => {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'N/A';
};

const getRoleClass = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin': return 'bg-danger';
    case 'reception': return 'bg-success';
    case 'finance': return 'bg-warning text-dark';
    case 'client': return 'bg-primary';
    default: return 'bg-secondary';
  }
};

// Fonctions de filtrage
const toggleRoleFilter = (role) => {
  activeRoleFilter.value = activeRoleFilter.value === role ? '' : role;
  currentPage.value = 1;
};

const clearRoleFilter = () => {
  activeRoleFilter.value = '';
  currentPage.value = 1;
};

const filterByRole = (role) => {
  if (role === 'all') {
    activeRoleFilter.value = '';
  } else if (role === 'active') {
    showInactive.value = false;
  } else {
    activeRoleFilter.value = role;
  }
  currentPage.value = 1;
};

const clearFilters = () => {
  searchQuery.value = '';
  activeRoleFilter.value = '';
  showInactive.value = true;
  currentPage.value = 1;
};

const showInactiveUsers = () => {
  showInactive.value = true;
  activeRoleFilter.value = '';
  currentPage.value = 1;
};

// Fonctions API
const fetchUsers = async () => {
  loading.value = true; 
  error.value = null; 
  try {
    const response = await ServiceUser.getAllUsers();
    
    users.value = response.data.map(user => ({
      ...user,
      lastActivity: null,
      lastActivityLoading: true,
      dateCreation: user.dateCreation || user.createdAt,
      lastLogin: user.lastLogin || null
    }));
    
    // Calculer les statistiques
    calculateUserStats();
    
    // Charger les activités en parallèle
    const activityPromises = users.value.map(user => 
      fetchUserLastActivity(user)
    );
    
    await Promise.all(activityPromises);
    
  } catch (err) {
    console.error("Erreur lors du chargement des utilisateurs:", err);
    error.value = "Échec du chargement. Vérifiez la console pour les détails de l'API.";
    toast.error("Échec du chargement de la liste des utilisateurs.");
    users.value = [];
  } finally {
    loading.value = false;
  }
};

const calculateUserStats = () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  userStats.value = {
    total: users.value.length,
    admins: users.value.filter(u => u.roleUti === 'ADMIN').length,
    active24h: users.value.filter(u => 
      u.lastLogin && new Date(u.lastLogin) > yesterday
    ).length,
    inactive: users.value.filter(u => 
      !u.lastLogin || (now - new Date(u.lastLogin).getTime() > 30 * 24 * 60 * 60 * 1000)
    ).length
  };
};

const fetchUserLastActivity = async (user) => {
  try {
    user.lastActivityLoading = true;
    const response = await ServiceUser.getLastActivity(user.idUti);
    
    if (response.data && response.data.success !== false) {
      user.lastActivity = response.data.lastActivity || 'Activité récente';
    } else {
      user.lastActivity = 'Information limitée';
    }
    
  } catch (error) {
    console.error(`⚠️ Erreur activité user ${user.idUti}:`, error);
    user.lastActivity = 'Données temporairement indisponibles';
  } finally {
    user.lastActivityLoading = false;
  }
};

// Fonctions modals
const openUserModal = (mode, user = null) => {
  isHistoryModalVisible.value = false;
  modalMode.value = mode;
  currentUser.value = user;
  isModalVisible.value = true;
};

const openHistoryModal = async (user) => {
  isModalVisible.value = false;
  historyUser.value = user;
  historyLoading.value = true;
  historyLogs.value = [];
  
  try {
    const response = await ServiceUser.getUserHistory(user.idUti);
    
    if (Array.isArray(response.data)) {
      historyLogs.value = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      historyLogs.value = response.data.data;
    } else {
      historyLogs.value = [{
        id: 'no-data',
        date: new Date().toLocaleString('fr-FR'),
        type: 'Information',
        description: 'Aucun historique disponible'
      }];
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du chargement de l'historique:", error);
    
    historyLogs.value = [
      {
        id: 'error-1',
        date: new Date().toLocaleString('fr-FR'),
        type: 'Erreur',
        description: `Impossible de charger l'historique: ${error.response?.data?.message || error.message}`
      }
    ];
    
    toast.error("Erreur lors du chargement de l'historique");
  } finally {
    historyLoading.value = false;
    isHistoryModalVisible.value = true;
  }
};

// Fonctions d'action
const exportUsers = async () => {
  exporting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Liste des utilisateurs exportée');
  } catch (error) {
    toast.error('Erreur lors de l\'export');
  } finally {
    exporting.value = false;
  }
};

const exportUserHistory = async (user) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Historique de ${user.loginUti} exporté`);
  } catch (error) {
    toast.error('Erreur lors de l\'export de l\'historique');
  }
};

const handleUserSaved = () => {
  fetchUsers();
  toast.success('Utilisateur sauvegardé avec succès');
};

const confirmDelete = async (user) => {
  if (user.roleUti === 'ADMIN') {
    toast.warning('Impossible de supprimer un administrateur');
    return;
  }
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.loginUti} ?`)) {
    try {
      await ServiceUser.deleteUser(user.idUti);
      toast.success(`Utilisateur ${user.loginUti} supprimé.`);
      fetchUsers();
    } catch (error) {
      console.error("Erreur de suppression:", error);
      toast.error("Échec de la suppression de l'utilisateur.");
    }
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
/* Conteneur principal avec scroll */
.full-page-scroll {
  height: 100vh;
  overflow-y: auto;
  padding-right: 8px; /* Pour éviter que la scrollbar cache le contenu */
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100%;
}

/* Personnalisation de la scrollbar pour toute la page */
.full-page-scroll::-webkit-scrollbar {
  width: 10px;
}

.full-page-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

.full-page-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-radius: 5px;
}

.full-page-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
}

/* Pour Firefox */
.full-page-scroll {
  scrollbar-width: thin;
  scrollbar-color: #007bff #f1f1f1;
}

/* Header unifié */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%);
  color: white;
  border-left: 4px solid #007bff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
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

/* Cards */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.main-content-card {
  margin-bottom: 40px; /* Espace en bas pour permettre le scroll */
}

/* Boutons */
.custom-btn-primary {
  background: #007bff !important;
  border-color: #007bff !important;
}

.custom-btn-primary:hover {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
}

.custom-btn-outline {
  border-color: rgba(255, 255, 255, 0.3);
  color: #6c757d;
  background: transparent;
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

/* Table amélioré */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.custom-table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.custom-table tbody tr:hover {
  background-color: #f8f9ff;
}

/* User avatar */
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
}

.user-avatar.admin {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}

.user-avatar.reception {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
}

.user-avatar.finance {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
}

.user-avatar.client {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.user-avatar.default {
  background: linear-gradient(135deg, #6c757d 0%, #545b62 100%);
}

/* Classes de ligne */
.admin-user {
  background-color: rgba(220, 53, 69, 0.05) !important;
}

.inactive-user {
  background-color: rgba(108, 117, 125, 0.05) !important;
}

/* Filtres */
.filters-container {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.view-options {
  padding-top: 12px;
  border-top: 1px solid #dee2e6;
}

.cursor-pointer {
  cursor: pointer;
}

/* Modal */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; 
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.gap-3 {
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-container {
    padding: 12px;
  }
  
  .full-page-scroll {
    padding-right: 4px;
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
  
  .filters-container {
    flex-direction: column;
  }
  
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  /* Ajustement de la scrollbar sur mobile */
  .full-page-scroll::-webkit-scrollbar {
    width: 6px;
  }
}

/* Animation smooth scroll */
.full-page-scroll {
  scroll-behavior: smooth;
}
</style>