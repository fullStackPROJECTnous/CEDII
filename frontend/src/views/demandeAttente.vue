

<template>

    
         <div class="retour">
    <router-link to="/dashboardReception" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>

    <div class="container-fluid py-4">
        <h2 class="mb-4 text-dark"><i class="bi bi-bell-fill me-3"></i> Demandes de Réservation à Traiter</h2>
        <hr>

        <div class="card shadow-lg">
            <div class="card-header bg-white border-bottom">
                <h5 class="card-title mb-0">Liste Complète des Demandes en Attente ({{ pendingRequests.length }})</h5>
            </div>
            <div class="card-body">
                
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Demandeur</th>
                                <th>Ressource</th>
                                <th>Date Début</th>
                                <th>Date Soumission</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="6" class="text-center text-primary">
                                    <i class="bi bi-arrow-clockwise spin me-2"></i> Chargement des demandes...
                                </td>
                            </tr>
                            <tr v-else-if="pendingRequests.length === 0">
                                <td colspan="6" class="text-center text-muted">🎉 Aucune demande de réservation en attente pour le moment.</td>
                            </tr>
                            <tr v-for="request in pendingRequests" :key="request.idRes">
                                <td>#{{ request.idRes }}</td>
                                <td>{{ request.client.nomCli }} {{ request.client.prenomCli }}</td>
                                <td>{{ getRessourceType(request) }}</td>
                                <td>{{ formatDate(request.debRes) }}</td>
                                <td>{{ formatDate(request.dateCre) }}</td>
                               <td>
    <router-link 
        :to="{ name: 'ReservationValid', params: { idRes: request.idRes } }"
        class="btn btn-sm btn-primary me-2">
        <i class="bi bi-eye"></i> Gérer/Valider
    </router-link>

    <button 
        class="btn btn-sm btn-danger"
        @click="handleRefuse(request)"> 
        <i class="bi bi-x-lg"></i> Refuser
    </button>
</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LocationService from '../services/LocationService'; // Votre service d'API
import { useRouter } from 'vue-router'; // Pour la redirection ou le rafraîchissement si nécessaire

const pendingRequests = ref([]);
const loading = ref(true);
const errorMessage = ref(null);
const router = useRouter();


// --- Fonctions d'Utilité ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    try {
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch {
        return dateString.substring(0, 16);
    }
};

// Fonction pour déterminer le type de ressource (corrigée)
const getRessourceType = (request) => {
    // typeRes est une chaîne de caractères ('Salle', 'Materiel', 'Mixte')
    if (request.typeRes === 'Salle') {
        return 'Salle';
    }
    if (request.typeRes === 'Materiel') {
        return 'Matériel';
    }
    if (request.typeRes === 'Mixte') {
        return 'Salle & Matériel';
    }
    return 'Non spécifié';
};

// --- Fonctions API ---

const fetchPendingRequests = async () => {
    loading.value = true;
    errorMessage.value = null;
    try {
        // 🚨 IMPORTANT : Cette méthode suppose que LocationService.getPendingReservations
        // renvoie la liste complète des objets Réservation avec le client associé (via include).
        const response = await LocationService.getPendingReservations(); 
        pendingRequests.value = response.data;

    } catch (error) {
        console.error("Erreur lors de la récupération des demandes:", error);
        errorMessage.value = `Impossible de charger les demandes : ${error.response?.data?.message || error.message}`;
    } finally {
        loading.value = false;
    }
};


/*const handleRequest = async (request, newStatus) => {
    // 🚨 Correction : Le statut 'Refusée' doit être 'Annulée' selon votre ENUM
    const statusToSend = (newStatus === 'Refusée' || newStatus === 'Annulée') ? 'Annulée' : 'Confirmée';
    const action = statusToSend === 'Confirmée' ? 'Valider' : 'Refuser';
    const message = `Êtes-vous sûr de vouloir ${action.toLowerCase()} la demande #${request.idRes}?`;

    if (confirm(message)) {
        try {
            // Utiliser statusToSend
            await LocationService.updateReservationStatus(request.idRes, statusToSend); 
            
            alert(`Demande #${request.idRes} mise à jour à '${statusToSend}' avec succès.`);
            
            await fetchPendingRequests(); 

        } catch (error) {
            console.error(`Erreur de traitement de la demande #${request.idRes}:`, error.response?.data || error);
            alert(`Échec du traitement de la demande : ${error.response?.data?.message || error.message}`);
        }
    }
};
*/

// ...

const handleRefuse = async (request) => {
    const message = `Êtes-vous sûr de vouloir REFUSER la demande #${request.idRes}?`;

    if (confirm(message)) {
        try {
            // Utilisation de 'Refusée'
            await LocationService.updateReservationStatus(request.idRes, 'Refusée'); 
            
            alert(`Demande #${request.idRes} refusée avec succès.`);
            await fetchPendingRequests(); 
        } catch (error) {
            console.error(`Erreur de refus de la demande #${request.idRes}:`, error.response?.data || error);
            alert(`Échec du refus : ${error.response?.data?.message || error.message}`);
        }
    }
};

onMounted(() => {
    fetchPendingRequests();
    // La mise à jour du badge `pendingRequestsCount` sur le menu devra être gérée 
    // par un système de Store (Vuex/Pinia) ou par un événement global lors de la validation.
});
</script>

<style scoped>
/* Ajoutez un style de base pour l'icône de chargement */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.spin {
    animation: spin 1s linear infinite;
}
.retour{
    float: right;
}
</style>