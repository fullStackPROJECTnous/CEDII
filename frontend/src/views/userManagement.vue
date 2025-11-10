<template>
    <div class="retour">
        <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-primary mt-3">
            Retour à l'Acceuil
        </router-link>
    </div>
    <div class="user-management p-4">
        <h2 class="mb-4 cedii-text-primary">Gestion des Utilisateurs</h2>

        <div class="d-flex justify-content-between mb-3">
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Rechercher par Login ou Rôle..." 
                class="form-control form-control-sm w-50"
            />
            <button class="btn btn-success" @click="openUserModal('add')">
                <i class="bi bi-person-plus-fill me-2"></i> Ajouter un Utilisateur
            </button>
        </div>

        <div v-if="loading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-2">Chargement des utilisateurs...</p>
        </div>
        
        <div v-else-if="error" class="alert alert-danger shadow-sm">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
        </div>

        <div v-else class="card shadow-sm">
            <div class="card-body">
                <div v-if="filteredUsers.length === 0" class="text-center text-muted p-3">
                    Aucun utilisateur trouvé.
                </div>
                
                <div v-else class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Login</th>
                                <th>Rôle</th>
                                <th>Dernière Action</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredUsers" :key="user.idUti">
                                <td>{{ user.idUti }}</td> 
                                <td>{{ user.loginUti }}</td>
                                <td>
                                    <span :class="['badge', getRoleClass(user.roleUti)]">
                                        {{ formatRole(user.roleUti) }}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="user.lastActivityLoading" class="text-muted">
                                        <i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i>
                                    </span>
                                    <span v-else>{{ user.lastActivity || 'Aucune activité' }}</span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-info" @click="openHistoryModal(user)">
                                            <i class="bi bi-clock-history"></i> Log
                                        </button>
                                        <button class="btn btn-outline-primary" @click="openUserModal('edit', user)">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" @click="confirmDelete(user)">
                                            <i class="bi bi-trash"></i> 
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <UserModal 
            :isVisible="isModalVisible" 
            :mode="modalMode"
            :initialUser="currentUser"
            @close="isModalVisible = false"
            @user-saved="fetchUsers"
        />

        <div v-if="isHistoryModalVisible" class="modal-backdrop-custom">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Historique des actions de {{ historyUser.loginUti }}</h5>
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
                                Aucun historique d'action trouvé pour cet utilisateur.
                            </li>
                            <li v-for="log in historyLogs" :key="log.id" class="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                    <span class="fw-bold me-2">{{ log.type }} :</span>
                                    {{ log.description }}
                                </div>
                                <small class="text-muted">{{ log.date }}</small>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="isHistoryModalVisible = false">Fermer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import UserModal from './userModal.vue'; 
import { useToast } from 'vue-toastification'; 
import ServiceUser from '../services/ServiceUser.js';

// États Réactifs
const users = ref([]);
const isModalVisible = ref(false);
const modalMode = ref('add');
const currentUser = ref(null);
const loading = ref(true); 
const error = ref(null); 
const searchQuery = ref('');

// États pour l'Historique des Actions
const isHistoryModalVisible = ref(false);
const historyUser = ref({});
const historyLogs = ref([]);
const historyLoading = ref(false);

const toast = useToast(); 

// Fonctions Utilitaires
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

const filteredUsers = computed(() => {
    if (!searchQuery.value) {
        return users.value;
    }
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(user => {
        return (
            user.loginUti.toLowerCase().includes(query) ||
            user.roleUti.toLowerCase().includes(query)
        );
    });
});

// Fonction pour récupérer la dernière activité d'un utilisateur
// Dans userManagement.vue - Version tolérante aux erreurs
const fetchUserLastActivity = async (user) => {
    try {
        user.lastActivityLoading = true;
        const response = await ServiceUser.getLastActivity(user.idUti);
        
        console.log('📊 Réponse dernière activité:', response.data);
        
        // 🟢 Gestion robuste des réponses
        if (response.data && response.data.success !== false) {
            user.lastActivity = response.data.lastActivity || 'Activité récente';
        } else {
            user.lastActivity = 'Information limitée';
        }
        
    } catch (error) {
        console.error(`⚠️ Erreur activité user ${user.idUti}:`, error);
        
        // 🟢 Valeur par défaut en cas d'erreur
        user.lastActivity = 'Données temporairement indisponibles';
    } finally {
        user.lastActivityLoading = false;
    }
};

// CRUD & API
const fetchUsers = async () => {
    loading.value = true; 
    error.value = null; 
    try {
        const response = await ServiceUser.getAllUsers();
        
        // Initialiser les utilisateurs avec un état de chargement
        users.value = response.data.map(user => ({
            ...user,
            lastActivity: null,
            lastActivityLoading: true
        }));
        
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
        
        console.log('📋 Réponse historique:', response.data);
        
        // 🟢 Gestion robuste des différents formats de réponse
        if (Array.isArray(response.data)) {
            historyLogs.value = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            historyLogs.value = response.data.data;
        } else {
            console.warn('Format de réponse inattendu:', response.data);
            historyLogs.value = [{
                id: 'no-data',
                date: new Date().toLocaleString('fr-FR'),
                type: 'Information',
                description: 'Aucun historique disponible'
            }];
        }
        
    } catch (error) {
        console.error("❌ Erreur lors du chargement de l'historique:", error);
        
        // 🟢 Données de fallback en cas d'erreur
        historyLogs.value = [
            {
                id: 'error-1',
                date: new Date().toLocaleString('fr-FR'),
                type: 'Erreur',
                description: `Impossible de charger l'historique: ${error.response?.data?.message || error.message}`
            },
            {
                id: 'error-2', 
                date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('fr-FR'),
                type: 'Information',
                description: 'Veuillez réessayer plus tard'
            }
        ];
        
        toast.error("Erreur lors du chargement de l'historique");
    } finally {
        historyLoading.value = false;
        isHistoryModalVisible.value = true;
    }
};

const confirmDelete = async (user) => {
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
.retour{
    float: right;
}
.cedii-text-primary {
    color: var(--cedii-primary-light, #5B11EE);
}
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
</style>