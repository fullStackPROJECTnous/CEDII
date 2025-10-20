<!--

<template>

         <div class="retour">
     <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="user-management p-4">
    <h2 class="mb-4 cedii-text-primary">Gestion des Utilisateurs</h2>


    <div class="d-flex justify-content-end mb-3">
   

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
             <div v-if="users.length === 0" class="text-center text-muted p-3">
                Aucun utilisateur trouvé.
            </div>
            
            <div v-else class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Login</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.idUti">
                            <td>{{ user.idUti }}</td> 
                            <td>{{ user.loginUti }}</td>
                            <td>
                                <span :class="['badge', getRoleClass(user.roleUti)]">
                                    {{ formatRole(user.roleUti) }}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-2" @click="openUserModal('edit', user)">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(user)">
                                    <i class="bi bi-trash"></i> 
                                </button>
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
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import UserModal from '../views/userModal.vue'; // VÉRIFIER CE CHEMIN : Est-ce dans 'views' ou 'components'?
//import UserService from '../services/ServiceUser.js'; // Le nom 'ServiceUser' est conservé
import { useToast } from 'vue-toastification'; // Si non utilisé, vous pouvez l'enlever
import ServiceUser from '../services/ServiceUser.js';

// --- États Réactifs ---
const users = ref([]);
const isModalVisible = ref(false);
const modalMode = ref('add'); // 'add' ou 'edit'
const currentUser = ref(null);
const loading = ref(true); // 🚨 Ajout de l'état de chargement
const error = ref(null);   // 🚨 Ajout de l'état d'erreur

// Optionnel: Initialiser la librairie de toast
const toast = useToast(); 

// --- Fonctions Utilitaires ---

// Fonction pour sécuriser l'affichage du rôle (prévient l'erreur .toUpperCase sur undefined)
const formatRole = (role) => {
    // Si le rôle est null/undefined/vide, affiche 'N/A', sinon le met en majuscules
    return role ? role.toUpperCase() : 'N/A';
};

/*const editUser = (user) => {
  // 🚨 Utilisez user.loginUti, qui est correct selon votre schéma
  alert(`Éditer l'utilisateur: ${user.loginUti}`);
};*/

const getRoleClass = (role) => {
    // Utilise la propriété 'roleUti' que j'ai vu dans le template commenté
    switch (role) {
        case 'admin': return 'bg-danger';
        case 'reception': return 'bg-success';
        case 'finance': return 'bg-warning text-dark';
        case 'client': default: return 'bg-secondary';
    }
};

// --- CRUD & API ---

const fetchUsers = async () => {
    loading.value = true; // Début du chargement
    error.value = null;   // Réinitialisation de l'erreur
    try {
        const response = await ServiceUser.getAllUsers();
        
        // 🚨 VÉRIFIEZ LA STRUCTURE DE LA RÉPONSE DE VOTRE API
        // Si response.data est directement le tableau d'utilisateurs :
        users.value = response.data; 

        console.log("Données Utilisateurs reçues et stockées:", users.value.length);
    } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs:", err);
        // Mise à jour de l'état d'erreur
        error.value = "Échec du chargement. Vérifiez la console pour les détails de l'API.";
        toast.error("Échec du chargement de la liste des utilisateurs.");
        users.value = []; // Vider en cas d'erreur pour ne rien afficher d'incorrect
    } finally {
        loading.value = false; // Fin du chargement
    }
};

const openUserModal = (mode, user = null) => {
    modalMode.value = mode;
    currentUser.value = user;
    isModalVisible.value = true;
};

const confirmDelete = async (user) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.loginUti} ?`)) {
        try {
            await ServiceUser.deleteUser(user.idUti);
            toast.success(`Utilisateur ${user.loginUti} supprimé.`);
            fetchUsers(); // Recharger la liste
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

</style>
-->

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
                                <th>Dernière Action</th> <!-- Ajout pour le suivi d'activité -->
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
                                <!-- Simulation de la dernière action -->
                                <td>{{ user.lastActivity || 'N/A' }}</td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <!-- NOUVEAU: Bouton Historique des actions -->
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
        
        <!-- Import de la modale d'ajout/édition -->
        <UserModal 
            :isVisible="isModalVisible" 
            :mode="modalMode"
            :initialUser="currentUser"
            @close="isModalVisible = false"
            @user-saved="fetchUsers"
        />

        <!-- NOUVEAU: Modale d'Historique des Actions -->
        <div v-if="isHistoryModalVisible" class="modal-backdrop-custom">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Historique des actions de {{ historyUser.loginUti }}</h5>
                        <button type="button" class="btn-close" @click="isHistoryModalVisible = false"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group list-group-flush" style="max-height: 400px; overflow-y: auto;">
                            <!-- Simulation des logs. L'API réelle doit fournir ces données -->
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

// --- États Réactifs ---
const users = ref([]);
const isModalVisible = ref(false);
const modalMode = ref('add'); // 'add' ou 'edit'
const currentUser = ref(null);
const loading = ref(true); 
const error = ref(null); 
const searchQuery = ref(''); // NOUVEAU: État pour la recherche

// NOUVEAU: États pour l'Historique des Actions
const isHistoryModalVisible = ref(false);
const historyUser = ref({});
const historyLogs = ref([]);

const toast = useToast(); 

// --- Fonctions Utilitaires ---

const formatRole = (role) => {
    // Si le rôle est null/undefined/vide, affiche 'N/A', sinon le met en majuscules
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'N/A';
};

const getRoleClass = (role) => {
    // Standardisation des classes en fonction des rôles
    switch (role?.toLowerCase()) {
        case 'admin': return 'bg-danger';
        case 'reception': return 'bg-success';
        case 'finance': return 'bg-warning text-dark';
        case 'client': return 'bg-primary'; // Client est aussi un utilisateur
        default: return 'bg-secondary';
    }
};

// NOUVEAU: Logique de Recherche
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

// --- CRUD & API ---

const fetchUsers = async () => {
    loading.value = true; 
    error.value = null; 
    try {
        const response = await ServiceUser.getAllUsers();
        
        // Simulation d'ajout de "lastActivity" pour l'affichage
        const usersData = response.data.map(user => ({
            ...user,
            lastActivity: user.roleUti === 'admin' ? 'Modifié un client (10/10/2025)' : 'Créé une réservation (12/10/2025)'
        }));
        
        users.value = usersData; 
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

// NOUVEAU: Logique pour ouvrir la modale d'historique
const openHistoryModal = async (user) => {
    isModalVisible.value = false;
    historyUser.value = user;
    
    // 🚨 Logique API à implémenter : await ServiceUser.getActionLogs(user.idUti);
    
    // Simulation des logs (à remplacer par l'appel API réel)
    historyLogs.value = [
        { id: 4, date: '2025-10-15 14:30', type: 'Connexion', description: `L'utilisateur s'est connecté.` },
        { id: 3, date: '2025-10-10 09:00', type: 'Modification', description: `A modifié le statut de la location #L452.` },
        { id: 2, date: '2025-09-01 10:15', type: 'Création', description: `A créé la réservation #R902 pour le client Alpha.` },
        { id: 1, date: '2025-08-20 18:00', type: 'Déconnexion', description: `Déconnexion automatique.` },
    ];
    
    isHistoryModalVisible.value = true;
};


const confirmDelete = async (user) => {
    // Utiliser une modale custom au lieu de confirm() si possible
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
/* Style pour la modale d'historique qui utilise le même principe que userModal */
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
