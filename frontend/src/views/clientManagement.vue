<!--<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4 cedii-text-dark">Gestion des Clients</h2>

    <button class="btn cedii-btn-primary mb-4" @click="openModal('create')">
      <i class="bi bi-plus-circle me-2"></i> Ajouter un Nouveau Client
    </button>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nom Complet</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in clients" :key="client.idCli">
                <td>{{ client.nomCli }} {{ client.prenomCli }}</td>
                <td>{{ client.emailCli }} / {{ client.telephoneCli }}</td>
                <td>
                  <span :class="['badge', client.typeCli === 'entreprise' ? 'bg-info' : 'bg-secondary']">
                    {{ client.typeCli }}
                  </span>
                </td>
                <td>
                  <span :class="['badge', client.statutCli === 'actif' ? 'bg-success' : 'bg-danger']">
                    {{ client.statutCli }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="openModal('edit', client)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteClient(client.idCli)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="clients.length === 0" class="text-center p-3 text-muted">
            Aucun client trouvé.
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Modifier' : 'Créer' }} un Client</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveClient">
            <div class="modal-body">
              
              <div class="mb-3">
                <label for="nomCli" class="form-label">Nom *</label>
                <input type="text" id="nomCli" v-model="currentClient.nomCli" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="prenomCli" class="form-label">Prénom</label>
                <input type="text" id="prenomCli" v-model="currentClient.prenomCli" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="emailCli" class="form-label">Email</label>
                <input type="email" id="emailCli" v-model="currentClient.emailCli" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="telephoneCli" class="form-label">Téléphone</label>
                <input type="tel" id="telephoneCli" v-model="currentClient.telephoneCli" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="addresseCli" class="form-label">Adresse</label>
                <input type="text" id="addresseCli" v-model="currentClient.addresseCli" class="form-control" />
              </div>

              <div class="mb-3">
                <label for="typeCli" class="form-label">Type de Client *</label>
                <select id="typeCli" v-model="currentClient.typeCli" class="form-select" required>
                  <option value="particulier">Particulier</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="statutCli" class="form-label">Statut *</label>
                <select id="statutCli" v-model="currentClient.statutCli" class="form-select" required>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn cedii-btn-primary" :disabled="isLoading">
                {{ isEditMode ? 'Sauvegarder' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 🚨 NOTE: Créez ce service pour gérer les appels à votre API Express
// import ClientService from '../services/ClientService';

const clients = ref([
    // Données de démonstration basées sur votre BDD
    { idCli: 1, nomCli: 'Rakoto', prenomCli: 'Andry', emailCli: 'andry.rakoto@gmail.com', telephoneCli: '0331234567', addresseCli: 'Antananarivo', typeCli: 'particulier', statutCli: 'actif' },
    { idCli: 2, nomCli: 'Rabe', prenomCli: 'Fanja', emailCli: 'fanja.rabe@gmail.com', telephoneCli: '0329876543', addresseCli: 'Antsirabe', typeCli: 'particulier', statutCli: 'actif' },
]);

const currentClient = ref({});
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

// Initialisation du client vide pour la création
const newClientTemplate = () => ({
    nomCli: '',
    prenomCli: '',
    emailCli: '',
    telephoneCli: '',
    addresseCli: '',
    typeCli: 'particulier', // Valeur par défaut
    statutCli: 'actif',     // Valeur par défaut
    // idUti est géré par le backend à la création du client utilisateur
});


onMounted(() => {
  fetchClients();
});

// --- LOGIQUE CRUD (Placeholders) ---

async function fetchClients() {
  // isLoading.value = true;
  // try {
  //   const response = await ClientService.getAllClients();
  //   clients.value = response.data;
  // } catch (error) {
  //   errorMessage.value = "Erreur lors du chargement des clients.";
  // } finally {
  //   isLoading.value = false;
  // }
}

function openModal(mode, client = null) {
  isEditMode.value = mode === 'edit';
  errorMessage.value = '';
  
  if (isEditMode.value && client) {
    // Copie profonde pour éviter de modifier directement le client dans la liste
    currentClient.value = { ...client }; 
  } else {
    currentClient.value = newClientTemplate();
  }
  
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentClient.value = newClientTemplate();
}

async function saveClient() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    if (isEditMode.value) {
      // await ClientService.updateClient(currentClient.value.idCli, currentClient.value);
      alert(`Client ${currentClient.value.idCli} mis à jour.`); // Simulation
    } else {
      // await ClientService.createClient(currentClient.value);
      alert('Nouveau client créé.'); // Simulation
      // Après création, on recharge les données
      // fetchClients(); 
    }
    
    closeModal();
    // fetchClients(); // Réaliser l'appel API pour recharger
    
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Échec de l'opération.";
  } finally {
    isLoading.value = false;
  }
}

async function deleteClient(idCli) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${idCli} ?`)) {
    // try {
    //   await ClientService.deleteClient(idCli);
    //   fetchClients(); 
    // } catch (error) {
    //   alert("Erreur lors de la suppression.");
    // }
    alert(`Client ${idCli} supprimé.`); // Simulation
    clients.value = clients.value.filter(c => c.idCli !== idCli); // Simulation
  }
}
</script>

<style scoped>
/* Styles de la palette CEDII */
.cedii-btn-primary {
  background-color: var(--cedii-primary-light, #5B11EE); 
  border-color: var(--cedii-primary-light, #5B11EE);
  color: white;
}
.cedii-btn-primary:hover {
  background-color: var(--cedii-primary-dark, #0405BF);
  border-color: var(--cedii-primary-dark, #0405BF);
}
.cedii-text-dark {
  color: var(--cedii-dark, #02061E);
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-dialog {
  max-width: 600px;
}
</style>

-->
<template>
  <div class="retour">
     <router-link to="/home" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="client-management p-4 bg-white rounded shadow-sm">
    
    <h3 class="mb-4">Gestion des Clients</h3>
     
    <div class="d-flex justify-content-between align-items-center mb-3">
        <button class="btn btn-sm cedii-btn-primary" @click="openModal('create')">
            <i class="bi bi-plus-lg me-1"></i> Ajouter un Client
        </button>
        <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher par Nom, Email ou Téléphone..." 
            class="form-control form-control-sm w-50"
        />
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom Complet</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Type Client</th>
            <th>Statut Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredClients.length === 0">
            <td colspan="6" class="text-center text-muted">Aucun client trouvé.</td>
          </tr>
          <tr v-for="client in filteredClients" :key="client.idCli">
            <td>#{{ client.idCli }}</td>
            <td>{{ client.nomCli }} {{ client.prenomCli }}</td>
            <td>{{ client.emailCli }}</td>
            <td>{{ client.telephoneCli }}</td>
            <td>{{ client.addresseCli }}</td>
            <td>{{ client.typeCli }}</td>
            <td>{{ client.statutCli }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" @click="openModal('update', client)">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger" @click="deleteClient(client.idCli)">
                    <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

   
    <div v-if="isModalOpen" class="modal-placeholder">
        <div class="modal-content-simulated p-4 bg-light shadow-lg">
            <h5>{{ modalMode === 'create' ? 'Ajouter un nouveau Client' : 'Modifier Client' }}</h5>
            
            <form @submit.prevent="saveClient">
                <div class="mb-3">
                    <label class="form-label">Nom <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" v-model="currentClient.nomCli" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Prénom</label>
                    <input type="text" class="form-control" v-model="currentClient.prenomCli">
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="currentClient.emailCli">
                </div>
                <div class="mb-3">
                    <label class="form-label">Téléphone</label>
                    <input type="text" class="form-control" v-model="currentClient.telephoneCli">
                </div>
                <div class="mb-3">
                    <label class="form-label">Adresse</label>
                    <input type="text" class="form-control" v-model="currentClient.addresseCli">
                </div>
                 <div class="mb-3">
                    <label class="form-label">Type Client</label>
                    <select id="typeCli" v-model="currentClient.typeCli" class="form-select" required>
                  <option >ONG</option>
                  <option >Association</option>
                  <option>Particulier</option>
                    <option value="entreprise">Entreprise</option>
                      <option >Institution Publique</option>

                </select>
                </div>
                 <div class="mb-3">
                    <label class="form-label">Statut Client</label>
                      <select id="statutCli" v-model="currentClient.statutCli" class="form-select" required>
                     <option value="actif">Actif</option>
                      <option value="inactif" >Inactif</option>

                </select>
                </div>




                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary me-2" @click="isModalOpen = false">Annuler</button>
                    <button type="submit" class="btn cedii-btn-primary">{{ modalMode === 'create' ? 'Créer' : 'Sauvegarder' }}</button>
                </div>
            </form>
        </div>
    </div>
   

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ClientService from '../services/ClientService'; 

// --- États Locaux ---
const clients = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create' ou 'update'

// Modèle de données correspondant aux colonnes de votre BDD
const emptyClient = {
    idCli: null, 
    // IMPORTANT: idUti doit être rempli par l'ID de l'utilisateur connecté lors de la création
    idUti: 1, 
    nomCli: '', 
    prenomCli: '', 
    emailCli: '', 
    telephoneCli: '', 
    addresseCli: '' 
};
const currentClient = ref({...emptyClient});

// --- Logique de Recherche ---
const filteredClients = computed(() => {
    if (!searchQuery.value) {
        return clients.value;
    }
    const query = searchQuery.value.toLowerCase();
    return clients.value.filter(client => {
        return (
            client.nomCli.toLowerCase().includes(query) ||
            (client.prenomCli && client.prenomCli.toLowerCase().includes(query)) ||
            (client.emailCli && client.emailCli.toLowerCase().includes(query)) ||
            (client.telephoneCli && client.telephoneCli.includes(query))
        );
    });
});


// --- Opérations CRUD ---

const fetchClients = async () => {
    try {
        const response = await ClientService.getAllClients();
        clients.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des clients:", error);
    }
};

const saveClient = async () => {
    try {
        if (modalMode.value === 'create') {
            await ClientService.createClient(currentClient.value);
            alert("Client créé avec succès!");
        } else {
            await ClientService.updateClient(currentClient.value.idCli, currentClient.value);
            alert("Client mis à jour avec succès!");
        }
        
        isModalOpen.value = false;
        fetchClients(); // Recharger les données
    } catch (error) {
        alert("Erreur lors de la sauvegarde du client. Vérifiez les données.");
        console.error("Erreur de sauvegarde:", error);
    }
};

const deleteClient = async (idCli) => {
    if (confirm(`Voulez-vous vraiment supprimer le client #${idCli} ? Cette action est irréversible.`)) {
        try {
            await ClientService.deleteClient(idCli);
            alert("Client supprimé avec succès.");
            fetchClients(); // Recharger les données
        } catch (error) {
            alert("Erreur lors de la suppression du client.");
            console.error("Erreur de suppression:", error);
        }
    }
};

// --- Logique Modale ---

const openModal = (mode, clientData = null) => {
    modalMode.value = mode;
    if (mode === 'create') {
        currentClient.value = { ...emptyClient, idUti: 1 }; // Réinitialiser pour la création
    } else {
        // Copie profonde pour éviter de modifier directement le client du tableau
        currentClient.value = { ...clientData }; 
    }
    isModalOpen.value = true;
};

// --- Point d'entrée ---
onMounted(fetchClients);
</script>

<style scoped>
/* Style personnalisé pour les boutons CEDII */
.cedii-btn-primary {
    background-color: var(--cedii-primary-light, #5B11EE);
    border-color: var(--cedii-primary-light, #5B11EE);
    color: white;
}
/* Styles de base pour le modal (à remplacer par une implémentation réelle) */
.modal-placeholder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}
.retour{
  float: right;
}
.modal-content-simulated {
    width: 450px;
    border-radius: 8px;
}
</style>