<!--<template>
  <div class="p-4">
    <h1>Tableau de Bord Administrateur 👑</h1>
    <p class="text-muted">Gestion complète des comptes utilisateurs.</p>

    <div class="card mt-4 shadow-sm">
      <div class="card-header bg-primary text-white">
        Liste des Utilisateurs ({{ users.length }})
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">Chargement des utilisateurs...</div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
        
        <table v-else class="table table-striped">
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
              <td><span :class="['badge', getRoleClass(user.role)]">{{ user.role?.toUpperCase() }}</span></td>
              <td>
                <button @click="editUser(user)" class="btn btn-sm btn-info me-2">Éditer</button>
                <button @click="deleteUser(user.idUti)" class="btn btn-sm btn-danger">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
//import UserService from '../services/UserService'; // Assurez-vous que ce chemin est correct
//import ServiceUser from '../services/ServiceUser';
import ServiceUser from '../services/ServiceUser.js';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

// Fonction pour charger les données
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    // 🚨 CET APPEL API DOIT ÊTRE PROTÉGÉ PAR isAdmin CÔTÉ BACKEND !
    const response = await ServiceUser.getAllUsers();
    users.value = response.data;
     console.log("Données Utilisateurs reçues:", users.value);
  } catch (err) {
    console.error("Erreur de chargement des utilisateurs:", err);
    error.value = "Échec du chargement. Vérifiez les permissions API (403) ou la route (500).";
    users.value = [];
  } finally {
    loading.value = false;
  }
};

// Fonctions d'action (à compléter avec la logique modale/API)
const editUser = (user) => {
  alert(`Éditer l'utilisateur: ${user.loginUti}`);
};

const deleteUser = async (idUti) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ID: ${idUti}?`)) {
        try {
            await ServiceUser.deleteUser(idUti);
            alert("Utilisateur supprimé !");
            fetchUsers(); // Recharger la liste
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    }
};

// Fonction utilitaire pour l'affichage
const getRoleClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-danger';
    case 'reception': return 'bg-success';
    case 'finance': return 'bg-warning text-dark';
    case 'client': default: return 'bg-secondary';
  }
};

onMounted(() => {
  fetchUsers();
});
</script>-->

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
