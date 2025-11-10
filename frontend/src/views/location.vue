<template>
    <div class="retour">
     <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="location-management p-3 bg-white rounded shadow-sm">
    <h3 class="mb-4">Locations & Réservations</h3>
    
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: activeTab === 'reservations' }" 
          @click.prevent="activeTab = 'reservations'" 
          href="#"
        >
          <i class="bi bi-calendar-check me-2"></i> Réservations Actives ({{ pendingReservations.length }})
        </a>
      </li>
      <li class="nav-item">
        <a 
          class="nav-link" 
          :class="{ active: activeTab === 'history' }" 
          @click.prevent="activeTab = 'history'" 
          href="#"
        >
          <i class="bi bi-clock-history me-2"></i> Historique des Locations ({{ locationHistory.length }})
        </a>
      </li>
    </ul>

    <div class="tab-content">
      <div v-if="activeTab === 'reservations'" class="tab-pane fade show active">
        <div class="d-flex justify-content-end mb-3">
          <button class="btn btn-sm cedii-btn-primary" >
             <router-link :to="{ name: 'NouvelleReservation' }" class="nav-link text-white">
              <i class="bi bi-plus-lg me-1"></i> Nouvelle Reservation
             </router-link>
          </button>
         
        </div>
        
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Client</th>
                <th>Type</th>
                <th>Période</th>
                <th>Tarif Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in pendingReservations" :key="res.idRes">
                <td>#{{ res.idRes }}</td>
                <td>{{ res.Client ? `${res.Client.nomCli} ${res.Client.prenomCli}` : 'ID Client: ' + res.idCli }}</td>
                <td>{{ res.typeRes }}</td>
                <td>{{ formatDate(res.debRes) }} au {{ formatDate(res.finRes) }}</td>
                <td>{{ formatCurrency(res.tarifTot) }}</td>
                <td><span :class="getStatusBadge(res.etatRes)">{{ res.etatRes }}</span></td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button v-if="res.etatRes === 'En attente'" class="btn btn-success" @click="updateStatus(res.idRes, 'Confirmée')">
                        Confirmer
                    </button>
                    <button v-else-if="res.etatRes === 'Confirmée'" class="btn btn-outline-secondary" @click="updateStatus(res.idRes, 'Terminée')">
                        Terminer
                    </button>
                    <button class="btn btn-warning text-dark" @click="updateStatus(res.idRes, 'Annulée')">
                        Annuler
                    </button>
                    <button class="btn btn-danger" @click="deleteReservation(res.idRes)">
                        <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'history'" class="tab-pane fade show active">
        <h5>Locations Terminées (Archivées)</h5>
        
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Réf. Location</th>
                <th>Réf. Réservation</th>
                <th>Date Création</th>
                <th>Type</th>
                <th>Tarif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="loc in locationHistory" :key="loc.idLo">
                <td>L-{{ loc.idLo }}</td>
                <td>R-{{ loc.idRes }}</td>
                <td>{{ formatDate(loc.dateCre) }}</td>
                <td>{{ loc.typeLo }}</td>
                <td>{{ formatCurrency(loc.tarifTot) }}</td>
                <td>
                     <button class="btn btn-sm btn-outline-info" @click="viewDetails(loc.idLo)">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LocationService from '../services/LocationService'; 

const activeTab = ref('reservations');
const pendingReservations = ref([]);
const locationHistory = ref([]);

// --- Chargement des données ---

const fetchPendingReservations = async () => {
    try {
        // Le service inclut le nom du client (si l'association Sequelize est configurée)
        const response = await LocationService.getPendingReservations();
        pendingReservations.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des réservations:", error);
    }
};

const fetchLocationHistory = async () => {
    try {
        const response = await LocationService.getLocationHistory();
        locationHistory.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement de l'historique:", error);
    }
};

onMounted(() => {
    fetchPendingReservations();
    fetchLocationHistory();
});

// --- Fonctions utilitaires ---

const formatCurrency = (value) => {
    if (!value) return '0,00 MGA';
    return `${parseFloat(value).toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
    if (!datetime) return '';
    // Formatte la date et l'heure
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(datetime).toLocaleDateString('fr-FR', options);
};

const getStatusBadge = (statut) => {
    if (statut === 'Confirmée') return 'badge bg-success';
    if (statut === 'En attente') return 'badge bg-warning text-dark';
    if (statut === 'Annulée') return 'badge bg-danger';
    if (statut === 'Terminée') return 'badge bg-secondary';
    return 'badge bg-info';
};

// --- Fonctions d'action (CRUD) ---

const updateStatus = async (idRes, status) => {
    if (confirm(`Voulez-vous changer le statut de la réservation #${idRes} à "${status}" ?`)) {
        try {
            await LocationService.updateReservationStatus(idRes, status);
            // Recharger les listes après la mise à jour
            fetchPendingReservations();
            if (status === 'Terminée') {
                 fetchLocationHistory();
            }
        } catch (error) {
            alert(`Erreur lors de la mise à jour du statut.`);
            console.error(error);
        }
    }
};

const deleteReservation = async (idRes) => {
    if (confirm(`ATTENTION : Voulez-vous supprimer définitivement la réservation #${idRes} ?`)) {
        try {
            await LocationService.deleteReservation(idRes);
            fetchPendingReservations();
        } catch (error) {
            alert(`Erreur lors de la suppression.`);
            console.error(error);
        }
    }
};


const viewDetails = (id) => {
    alert(`Afficher les détails du ID: #${id}`);
};
</script>

<style scoped>
/* Les styles spécifiques aux boutons et onglets doivent être inclus ici */
.cedii-btn-primary {
    background-color: var(--cedii-primary-light, #5B11EE);
    border-color: var(--cedii-primary-light, #5B11EE);
    color: white;
}
.nav-tabs .nav-link.active {
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.retour{
    float: right;
}
</style>