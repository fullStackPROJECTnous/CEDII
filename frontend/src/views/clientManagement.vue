
<template>
  <div class="retour">
     <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-primary mt-3">
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
        
            <th>Nom</th>
            <th>Prenom</th>
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
            <td colspan="8" class="text-center text-muted">Aucun client trouvé.</td>
          </tr>
          <tr v-for="client in filteredClients" :key="client.idCli">
            <td>#{{ client.idCli }}</td>
            
            <td>{{ client.nomCli }} </td>
            <td> {{ client.prenomCli }}</td>
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
                 <div v-if="modalMode === 'create'" class="mb-3">
            <label for="idUti" class="form-label">ID Utilisateur à Associer <span class="text-danger">*</span></label>
            <input 
                type="number" 
                id="idUti" 
                v-model.number="currentClient.idUti" 
                class="form-control" 
                required 
                placeholder="ID d'un utilisateur existant (rôle client)"
            />
        </div>

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
                  <option value="ONG" >ONG</option>
                  <option value="association">Association</option>
                  <option value="particulier">Particulier</option>
                    <option value="entreprise">Entreprise</option>
                      <option value="institution Public">Institution Publique</option>

                </select>
                </div>
                 <div class="mb-3">
                    <label class="form-label">Statut Client</label>
                      <select id="statutCli" v-model="currentClient.statutCli" class="form-select" required>
                     <option value="actif">Actif</option>
                      <option value="inactif" >Inactif</option>
                      <option value="bloqué">Bloqué</option>

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
//const Utilisateur = db.utilisateur; 
//import utilisateur from '../../../backend/models/utilisateur';

//import UserServices from '../services/UserServices';

// --- États Locaux ---
const clients = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create' ou 'update'

// Modèle de données correspondant aux colonnes de votre BDD
const emptyClient = {
    idCli: null, 
    // IMPORTANT: idUti doit être rempli par l'ID de l'utilisateur connecté lors de la création
    idUti: '', 
    nomCli: '', 
    prenomCli: '', 
    emailCli: '', 
    telephoneCli: '', 
    addresseCli: '' ,
    typeCli: 'particulier',
    statutCli: 'actif'
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




/*const fetchClients = async () => {
    try {
        const response = await ClientService.getAllClients();
        clients.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des clients:", error);
    }
};*/

const fetchClients = async () => {
    // isLoading.value = true; // Si vous utilisez une variable de chargement
    try {
        const clientsData = await ClientService.getAllClients();
        clients.value = clientsData; // 🚨 AFFECTATION CORRIGÉE
        
    } catch (error) {
        console.error("Erreur de chargement des clients:", error);
    } 
    // finally {
    //   isLoading.value = false;
    // }
};

const saveClient = async () => {
    try {
        if (modalMode.value === 'create') {
            await ClientService.createClient(currentClient.value);
            alert("Client créé avec succès!");
        }
         else {
    // 1. On récupère l'ID
    const clientId = currentClient.value.idCli;
    
    // 2. On clone l'objet et on retire l'ID (optionnel, mais propre)
    const dataToSend = { ...currentClient.value };
    delete dataToSend.idCli;
    
    // 3. Appel du service
    await ClientService.updateClient(clientId, dataToSend); // dataToSend est l'objet sans l'ID
    alert("Client mis à jour avec succès!");
}
       /* } else {
            await ClientService.updateClient(currentClient.value.idCli, currentClient.value);
            alert("Client mis à jour avec succès!");
        }
        */
        isModalOpen.value = false;
        fetchClients(); // Recharger les données
        } catch (error) {
        // 🚨 MODIFICATION CRITIQUE ICI : Affiche l'erreur du backend
        const errorMessage = error.response?.data?.message || error.message || "Erreur inconnue lors de la sauvegarde.";
        
        // Affiche l'erreur dans la console pour l'analyse
        console.error("Erreur de sauvegarde détaillée:", error.response?.data || error); 
        
        // Utilise l'alerte pour l'utilisateur avec l'information détaillée
        alert(`Échec de la sauvegarde : ${errorMessage}`); 
    }
};
   /* } catch (error) {
        alert("Erreur lors de la sauvegarde du client. Vérifiez les données.");
        console.error("Erreur de sauvegarde:", error);
    }*/


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
   /* 🚨 CORRECTION: Hauteur basée sur le contenu, avec une limite maximale */
    width: 450px;
    
    /* Empêche le contenu de dépasser la hauteur de la fenêtre */
    max-height: 90vh; 
    
    /* Ajoute un défilement si le contenu dépasse max-height */
    overflow-y: auto; 
    
    border-radius: 8px;
    padding: 20px;
  
   
}
</style>
<!--
<template>
  <div class="client-management p-4 bg-white rounded shadow-sm">
    <div class="retour">
      <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Accueil
    </router-link>
    </div>
    
    <h3 class="mb-4">Gestion des Clients</h3>

    <!-- Nouvelle Section: Classement des Clients 
    <div class="ranking-section mb-5 p-3 border rounded bg-light">
        <h5><i class="bi bi-bar-chart-line-fill me-2"></i> Classement (Activité et Rentabilité)</h5>
        <button class="btn btn-sm btn-outline-info mb-3" @click="loadRankings">
            Actualiser le Classement
        </button>
        
        <div class="table-responsive" v-if="rankedClients.length">
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>Rang</th>
                        <th>Nom</th>
                        <th>Locations Total</th>
                        <th>Revenu Total (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(client, index) in rankedClients.slice(0, 5)" :key="client.idCli">
                        <td>{{ index + 1 }}</td>
                        <td>{{ client.nomComplet }}</td>
                        <td>{{ client.nbLocations }}</td>
                        <td>{{ client.revenuTotal }} €</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-else-if="rankingLoaded">Aucune donnée de classement disponible.</p>
        <p v-else>Cliquez sur "Actualiser le Classement" pour voir le top 5.</p>
    </div>

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
            <th>Nom & Prénom</th>
            <th>Contact</th>
            <th>Type/Statut</th>
            <th>Activité (Locations)</th>
            <th>Revenu (€)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredClients.length === 0">
            <td colspan="7" class="text-center text-muted">Aucun client trouvé.</td>
          </tr>
          <tr v-for="client in filteredClients" :key="client.idCli">
            <td>#{{ client.idCli }}</td>
            <td>{{ client.nomCli }} {{ client.prenomCli }}</td>
            <td>{{ client.telephoneCli }}<br><small>{{ client.emailCli }}</small></td>
            <td>{{ client.typeCli }}<br><span :class="{'badge bg-success': client.statutCli === 'actif', 'badge bg-warning text-dark': client.statutCli === 'inactif'}">{{ client.statutCli }}</span></td>
            <td>
                <span class="badge bg-primary">{{ client.nbLocations || 0 }} Locations</span>
            </td>
            <td>
                <strong>{{ formatCurrency(client.revenuTotal || 0) }}</strong>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-info" @click="viewHistory(client)">
                    <i class="bi bi-clock-history"></i>
                </button>
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

   
    <!-- Modale CRUD (inchangée) 
    <div v-if="isModalOpen" class="modal-placeholder">
        <div class="modal-content-simulated p-4 bg-light shadow-lg">
            <h5>{{ modalMode === 'create' ? 'Ajouter un nouveau Client' : 'Modifier Client' }}</h5>
            
            <form @submit.prevent="saveClient">
                 <!-- Champ ID Utilisateur visible uniquement en création 
                <div v-if="modalMode === 'create'" class="mb-3">
                  <label for="idUti" class="form-label">ID Utilisateur à Associer <span class="text-danger">*</span></label>
                  <input 
                      type="number" 
                      id="idUti" 
                      v-model.number="currentClient.idUti" 
                      class="form-control" 
                      required 
                      placeholder="ID d'un utilisateur existant (rôle client)"
                  />
                </div>
                
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
                      <option value="ONG" >ONG</option>
                      <option value="association">Association</option>
                      <option value="particulier">Particulier</option>
                      <option value="entreprise">Entreprise</option>
                      <option value="institution Public">Institution Publique</option>

                    </select>
                </div>
                 <div class="mb-3">
                    <label class="form-label">Statut Client</label>
                      <select id="statutCli" v-model="currentClient.statutCli" class="form-select" required>
                        <option value="actif">Actif</option>
                        <option value="inactif" >Inactif</option>
                        <option value="bloqué">Bloqué</option>
                    </select>
                </div>

                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary me-2" @click="isModalOpen = false">Annuler</button>
                    <button type="submit" class="btn cedii-btn-primary">{{ modalMode === 'create' ? 'Créer' : 'Sauvegarder' }}</button>
                </div>
            </form>
        </div>
    </div>
   
    <!-- Nouvelle Modale: Historique des Locations 
    <div v-if="isHistoryModalOpen" class="modal-placeholder">
        <div class="modal-content-simulated p-4 bg-white shadow-lg" style="width: 600px;">
            <h5>Historique des Locations de {{ historyClientName }}</h5>
            <div v-if="historyLoading" class="text-center text-muted">Chargement de l'historique...</div>
            
            <div v-else-if="clientHistory.length">
                <table class="table table-sm table-striped">
                    <thead>
                        <tr>
                            <th>ID Loc</th>
                            <th>Date Début</th>
                            <th>Date Fin</th>
                            <th>Montant</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="loc in clientHistory" :key="loc.idLoc">
                            <td>#{{ loc.idLoc }}</td>
                            <td>{{ formatDate(loc.dateDebutLoc) }}</td>
                            <td>{{ formatDate(loc.dateFinLoc) }}</td>
                            <td>{{ formatCurrency(loc.montantTotalLoc) }}</td>
                            <td>{{ loc.statutLoc }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p class="text-center text-muted">Ce client n'a pas encore d'historique de location.</p>
            </div>

            <div class="d-flex justify-content-end mt-3">
                <button type="button" class="btn btn-secondary" @click="isHistoryModalOpen = false">Fermer</button>
            </div>
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
const modalMode = ref('create'); 
const rankedClients = ref([]); // Nouveau: pour stocker les classements
const rankingLoaded = ref(false);

// États pour la modale Historique
const isHistoryModalOpen = ref(false);
const historyLoading = ref(false);
const clientHistory = ref([]);
const historyClientName = ref('');

// Modèle de données Client
const emptyClient = {
    idCli: null, 
    idUti: null, // Initialisé à null
    nomCli: '', 
    prenomCli: '', 
    emailCli: '', 
    telephoneCli: '', 
    addresseCli: '' ,
    typeCli: 'particulier',
    statutCli: 'actif'
};
const currentClient = ref({...emptyClient});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '0.00 €';
    return parseFloat(value).toFixed(2) + ' €';
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

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

// --- Fonctions API : Clients ---
const fetchClients = async () => {
    try {
        const clientsData = await ClientService.getAllClients();
        // Les données contiennent maintenant nbLocations et revenuTotal
        clients.value = clientsData; 
        
    } catch (error) {
        console.error("Erreur de chargement des clients:", error);
        alert("Échec du chargement des clients. Vérifiez la console (Erreur 403/404 possible).");
    } 
};

const saveClient = async () => {
    try {
        if (modalMode.value === 'create') {
            await ClientService.createClient(currentClient.value);
            
        } else {
            const clientId = currentClient.value.idCli;
            const dataToSend = { ...currentClient.value };
            // Retirer les champs non modifiables ou inutiles pour la mise à jour
            delete dataToSend.idCli;
            delete dataToSend.idUti; // L'ID utilisateur ne devrait pas changer
            
            await ClientService.updateClient(clientId, dataToSend); 
        }
        
        alert(`Client ${modalMode.value === 'create' ? 'créé' : 'mis à jour'} avec succès!`);
        isModalOpen.value = false;
        fetchClients(); // Recharger les données
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Erreur inconnue lors de la sauvegarde.";
        console.error("Erreur de sauvegarde détaillée:", error.response?.data || error); 
        alert(`Échec de la sauvegarde : ${errorMessage}`); 
    }
};

const deleteClient = async (idCli) => {
    // 🚨 Remplacer confirm() par une modale custom dans une application Vue réelle
    if (window.confirm(`Voulez-vous vraiment supprimer le client #${idCli} ? Cette action est irréversible.`)) {
        try {
            await ClientService.deleteClient(idCli);
            alert("Client supprimé avec succès.");
            fetchClients(); // Recharger les données
        } catch (error) {
            console.error("Erreur de suppression:", error);
            alert(`Erreur lors de la suppression du client: ${error.response?.data?.message || error.message}`);
        }
    }
};

// --- Fonctions API : Classement & Historique ---

const loadRankings = async () => {
    try {
        const data = await ClientService.getClientRankings();
        rankedClients.value = data;
        rankingLoaded.value = true;
    } catch (error) {
        console.error("Erreur de chargement des classements:", error);
        alert("Échec du chargement des classements.");
    }
};

const viewHistory = async (client) => {
    isHistoryModalOpen.value = true;
    historyLoading.value = true;
    historyClientName.value = `${client.nomCli} ${client.prenomCli}`;
    clientHistory.value = []; // Vider l'historique précédent

    try {
        const historyData = await ClientService.getClientHistory(client.idCli);
        clientHistory.value = historyData;
    } catch (error) {
        console.error(`Erreur de chargement de l'historique pour ${client.idCli}:`, error);
        alert(`Impossible de charger l'historique: ${error.response?.data?.message || error.message}`);
    } finally {
        historyLoading.value = false;
    }
};


// --- Logique Modale CRUD ---
const openModal = (mode, clientData = null) => {
    modalMode.value = mode;
    if (mode === 'create') {
        currentClient.value = { ...emptyClient }; 
    } else {
        currentClient.value = { ...clientData }; 
    }
    isModalOpen.value = true;
};

// --- Point d'entrée ---
onMounted(() => {
    fetchClients();
    loadRankings(); // Charger le classement au démarrage
});
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
    max-height: 90vh; 
    overflow-y: auto; 
    border-radius: 8px;
    padding: 20px;
}
.ranking-section {
    border-left: 5px solid var(--cedii-primary-light, #5B11EE) !important;
}
</style>
-->