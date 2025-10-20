


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

    <!-- Affichage des Classements Clés (Nouveauté) -->
    <div class="row mb-4">
        <div class="col-md-6">
            <div class="card p-3 shadow-sm border-start border-success border-4 h-100">
                <p class="mb-1 fw-bold text-success">Client le plus rentable du mois</p>
                <h5 class="mb-0">{{ topClient.name || 'N/A' }} <span class="badge bg-success ms-2">{{ formatCurrency(topClient.revenue) }}</span></h5>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card p-3 shadow-sm border-start border-primary border-4 h-100">
                <p class="mb-1 fw-bold text-primary">Client le plus actif (Locations)</p>
                <h5 class="mb-0">{{ activeClient.name || 'N/A' }} <span class="badge bg-primary ms-2">{{ activeClient.count }} Locations</span></h5>
            </div>
        </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom Complet</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Type Client</th>
            <th>Statut</th>
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
            <td>{{ client.emailCli }}</td>
            <td>{{ client.telephoneCli }}</td>
            <td>{{ client.typeCli }}</td>
            <td>
              <span :class="getStatusBadgeClass(client.statutCli)">{{ client.statutCli }}</span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <!-- NOUVEAU: Bouton pour l'Historique/Suivi d'Activité -->
                <button class="btn btn-outline-info" @click="openHistoryModal(client)">
                  <i class="bi bi-clock-history"></i> Historique
                </button>
                <button class="btn btn-outline-primary" @click="openModal('update', client)">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <!-- Changement: Désactivation au lieu de suppression pure pour l'historique -->
                <button 
                  :class="client.statutCli === 'désactivé' ? 'btn-success' : 'btn-warning'"
                  @click="toggleClientStatus(client)">
                    <i :class="client.statutCli === 'désactivé' ? 'bi bi-check-lg' : 'bi bi-x-octagon'"></i> 
                    {{ client.statutCli === 'désactivé' ? 'Activer' : 'Désactiver' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <!-- MODAL PRINCIPAL (Création/Modification) -->
    <div v-if="isModalOpen" class="modal-placeholder">
        <div class="modal-content-simulated p-4 bg-light shadow-lg">
            <h5>{{ modalMode === 'create' ? 'Ajouter un nouveau Client' : 'Modifier Client' }}</h5>
            
            <form @submit.prevent="saveClient">
                <!-- ID Utilisateur pour l'association -->
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

    <!-- NOUVEAU: MODAL D'HISTORIQUE ET SUIVI -->
    <div v-if="isHistoryModalOpen" class="modal-placeholder">
      <div class="modal-content-simulated p-4 bg-white shadow-lg large-modal">
        <h5 class="mb-4">Historique et Activité pour: {{ historyClient.nomCli }} {{ historyClient.prenomCli }}</h5>
        
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: historyTab === 'locations' }" @click="historyTab = 'locations'">Historique Locations</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: historyTab === 'reservations' }" @click="historyTab = 'reservations'">Réservations Actuelles</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: historyTab === 'activite' }" @click="historyTab = 'activite'">Suivi d'Activité (Logs)</button>
          </li>
        </ul>

      <div v-if="historyTab === 'locations'">
        <h6>Locations Passées</h6>
       <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th>ID Loc</th>
              <th>Date Début</th>
              <th>Date Fin</th>
             <th>Type de Bien Loué</th> <th>Montant (€)</th>
             </tr>
         </thead>
     <tbody>
      <tr v-for="loc in historyClient.locations" :key="loc.idLo">
        <td>#{{ loc.idLo }}</td>
        <td>{{ formatDate(loc.dateDebut) }}</td>
        <td>{{ formatDate(loc.dateFin) }}</td>
        <td>{{ loc.typeLo }}</td> <td class="fw-bold">{{ formatCurrency(loc.montant) }}</td>
      </tr>
      <tr v-if="historyClient.locations.length === 0">
        <td colspan="5" class="text-center text-muted">Aucune location enregistrée.</td>
      </tr>
    </tbody>
  </table>
</div>
          <div v-if="historyTab === 'reservations'">
  <h6>Réservations en Cours/Futures</h6>
  <table class="table table-sm table-striped">
    <thead>
      <tr>
        <th>ID Résa</th>
        <th>Date Résa</th>
        <th>Date Début</th>
        <th>Type de Réservation</th> <th>Statut</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="resa in historyClient.reservations" :key="resa.idResa">
        <td>#{{ resa.idResa }}</td>
        <td>{{ formatDate(resa.dateResa) }}</td>
        <td>{{ formatDate(resa.dateDebut) }}</td>
        <td>{{ resa.type }}</td> <td><span :class="getStatusBadgeClass(resa.statut)">{{ resa.statut }}</span></td>
      </tr>
      <tr v-if="historyClient.reservations.length === 0">
        <td colspan="5" class="text-center text-muted">Aucune réservation en cours.</td>
      </tr>
    </tbody>
  </table>
</div>

          <div v-if="historyTab === 'activite'">
            <h6>Journal des Activités Récentes (Logs de connexion, modifications, etc.)</h6>
            <ul class="list-group list-group-flush">
              <li v-for="(activity, index) in historyClient.activityLogs" :key="index" class="list-group-item">
                <small class="text-muted">{{ activity.date }}</small> - {{ activity.description }}
              </li>
              <li v-if="historyClient.activityLogs.length === 0" class="list-group-item text-center text-muted">
                    Aucun log d'activité récent.
              </li>
            </ul>
          </div>
            <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-secondary" @click="isHistoryModalOpen = false">Fermer</button>
        </div>
        </div>

      
      </div>
    </div>
  
    

 
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ClientService from '../services/ClientService'; 
// Assurez-vous d'avoir un service pour les réservations et locations pour ces fonctionnalités
// import ReservationService from '../services/ReservationService';
// import LocationService from '../services/LocationService';


// --- États Locaux ---
const clients = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create' ou 'update'
const isHistoryModalOpen = ref(false); // NOUVEAU: État de la modale Historique
const historyClient = ref({}); // NOUVEAU: Données du client pour l'historique
const historyTab = ref('locations'); // NOUVEAU: Onglet actif dans la modale d'historique

// Modèle de données correspondant aux colonnes de votre BDD
const emptyClient = {
    idCli: null, 
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


// --- Logique Calculée / Classement ---

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




// --- Fonctions API ---

const fetchClients = async () => {
    try {
        // Le service devrait idéalement retourner des données enrichies pour le classement
        const clientsData = await ClientService.getAllClients();
        clients.value = clientsData; 
    } catch (error) {
        console.error("Erreur de chargement des clients:", error);
    } 
};

const saveClient = async () => {
    try {
        if (modalMode.value === 'create') {
            // Création: Associe l'idUti
            await ClientService.createClient(currentClient.value);
            alert("Client créé avec succès!");
        } else {
            // Mise à jour: Désactive la modification de l'ID utilisateur ici pour la simplicité
            const clientId = currentClient.value.idCli;
            const dataToSend = { ...currentClient.value };
            delete dataToSend.idCli;
            await ClientService.updateClient(clientId, dataToSend); 
            alert("Client mis à jour avec succès!");
        }
        isModalOpen.value = false;
        fetchClients(); // Recharger les données
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Erreur inconnue lors de la sauvegarde.";
        console.error("Erreur de sauvegarde détaillée:", error.response?.data || error); 
        alert(`Échec de la sauvegarde : ${errorMessage}`); 
    }
};

const toggleClientStatus = async (client) => {
    const newStatus = client.statutCli === 'désactivé' ? 'actif' : 'désactivé';
    if (confirm(`Voulez-vous vraiment changer le statut de ${client.nomCli} à '${newStatus}' ?`)) {
        try {
            await ClientService.updateClient(client.idCli, { statutCli: newStatus });
            alert(`Statut mis à jour à '${newStatus}' avec succès.`);
            fetchClients();
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut.");
            console.error("Erreur de statut:", error);
        }
    }
};

// Suppression purement logique (si nécessaire, mais la désactivation est préférée)
/*
const deleteClient = async (idCli) => {
    // ... code de suppression ...
};
*/


// --- Logique Modale ---

const openModal = (mode, clientData = null) => {
    isHistoryModalOpen.value = false; // Fermer l'historique si ouvert
    modalMode.value = mode;
    if (mode === 'create') {
        currentClient.value = { ...emptyClient, idUti: '' };
    } else {
        currentClient.value = { ...clientData }; 
    }
    isModalOpen.value = true;
};

// NOUVEAU: Ouverture de la modale Historique/Suivi
/*const openHistoryModal = async (client) => {
    isModalOpen.value = false; // Fermer la modale principale si ouverte
    // 🚨 IDÉALEMENT, ces données seraient chargées dynamiquement via l'API (ex: client.idCli)
    // const locations = await LocationService.getHistory(client.idCli);
    // const reservations = await ReservationService.getCurrent(client.idCli);
    
    // Simulation des données de suivi et d'historique
    historyClient.value = {
        ...client,
        locations: [ 
            { idLoc: 501, dateDebut: '2025-09-01', dateFin: '2025-09-10', vehicule: 'Toyota Hilux #1', montant: 1500 },
            { idLoc: 450, dateDebut: '2025-07-20', dateFin: '2025-07-25', vehicule: 'Bus Coaster #3', montant: 3000 },
        ],
        reservations: [
            { idResa: 902, dateResa: '2025-10-10', dateDebut: '2025-11-01', vehicule: 'Berline V6 #2', statut: 'Confirmée' },
        ],
        activityLogs: [
            { date: '2025-10-15 14:30', description: 'Connexion réussie.' },
            { date: '2025-09-15 10:00', description: 'Facture #F-102 payée automatiquement.' },
        ]
    };
    historyTab.value = 'locations';
    isHistoryModalOpen.value = true;
};

// --- Utilitaires ---
*/
const getStatusBadgeClass = (statut) => {
    switch (statut.toLowerCase()) {
        case 'actif': return 'badge bg-success';
        case 'bloqué': return 'badge bg-danger';
        case 'inactif': return 'badge bg-secondary';
        case 'désactivé': return 'badge bg-warning text-dark';
        case 'confirmée': return 'badge bg-primary';
        case 'en attente': return 'badge bg-info text-dark';
        default: return 'badge bg-light text-dark';
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
};

const formatCurrency = (value) => {
    // Le code culturel (locale) pour Madagascar est 'mg-MG'.
    // Le code de devise pour l'Ariary Malgache est 'MGA'.
    return new Intl.NumberFormat('fr-MG', { 
        style: 'currency', 
        currency: 'MGA',
        // Optionnel : ajouter des chiffres après la virgule si nécessaire,
        // bien que l'Ariary n'ait traditionnellement pas de décimales.
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0
    }).format(value);
};


const topClient = ref({ name: 'N/A', revenue: 0 }); // Remplacer le computed simulé
const activeClient = ref({ name: 'N/A', count: 0 }); // Remplacer le computed simulé

// Nouvelle fonction pour charger les métriques
const fetchMetrics = async () => {
    try {
        // 🚨 APPEL AU SERVICE BACKEND
        const metricsData = await ClientService.getRankingMetrics();
        
       // Mise à jour des refs avec les données réelles du backend
      const top = metricsData.topClient || {};
        const active = metricsData.activeClient || {};

        topClient.value = {
            // Si top.nomCli est undefined, utilisez 'N/A'
            name: `${top.nomCli || 'N/A'} ${top.prenomCli || ''}`,
            revenue: top.totalRevenue || 0
        };
        activeClient.value = {
            name: `${active.nomCli || 'N/A'} ${active.prenomCli || ''}`,
            count: active.totalLocations || 0
        };

        // clientManagement.vue (dans la fonction fetchMetrics)

// ...


// ...
   } catch (error) {
        console.error("Erreur de chargement des métriques:", error);
        // En cas d'erreur complète, réinitialiser à N/A pour éviter les bugs d'affichage
        topClient.value = { name: 'N/A', revenue: 0 };
        activeClient.value = { name: 'N/A', count: 0 };
    }
};

// clientManagement.vue (Script setup)

// ... (autres fonctions)

// Mise à jour de la fonction d'ouverture de l'historique
// clientManagement.vue (Mise à jour de openHistoryModal)

const openHistoryModal = async (client) => {
    isModalOpen.value = false; 
    
    try {
        const historyData = await ClientService.getClientHistory(client.idCli); 

        historyClient.value = {
            ...client,
            locations: historyData.locations || [], 
            reservations: historyData.reservations || [], 
            
            // Simulation des logs d'activité
            activityLogs: [
                 { date: '2025-10-15 14:30', description: 'Connexion réussie.' },
                 { date: '2025-09-15 10:00', description: 'Facture #F-102 payée automatiquement.' },
            ] 
        };
        historyTab.value = 'locations';
        isHistoryModalOpen.value = true;
    } catch (error) {
        console.error("Erreur de chargement de l'historique:", error);
        alert("Échec du chargement de l'historique client.");
    }
};
// ... (fetchClients, saveClient, etc.)

// Point d'entrée
onMounted(() => {
    fetchClients();
    fetchMetrics(); // 👈 Appel ici
});


// --- Point d'entrée ---
//onMounted(fetchClients);
</script>

<style scoped>
/* Style personnalisé pour les boutons CEDII */
.cedii-btn-primary {
    background-color: var(--cedii-primary-light, #5B11EE);
    border-color: var(--cedii-primary-light, #5B11EE);
    color: white;
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}
.retour{
    float: right;
}

/* Styles pour les modales */
.modal-placeholder {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}
.modal-content-simulated {
    width: 450px;
    max-height: 90vh; 
    overflow-y: auto; 
    border-radius: 8px;
    
}
/* Style spécifique pour la modale d'historique */
.large-modal {
    width: 80%; /* Plus large pour l'historique */
    max-width: 900px;
}
</style>
