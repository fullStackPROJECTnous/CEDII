<template>
    <div class="container py-4">
        <div class="d-flex justify-content-end mb-4">
            <router-link to="/demandeAttente" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-arrow-left"></i> Retour aux demandes
            </router-link>
        </div>

        <h2 class="mb-4 text-dark"><i class="bi bi-file-earmark-check-fill me-2"></i> Validation de la Demande #{{ idRes }}</h2>
        <hr>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <div v-if="loading" class="text-center p-5">
            <i class="bi bi-arrow-clockwise spin fs-3 text-primary"></i>
            <p class="mt-2">Chargement des détails de la réservation...</p>
        </div>
     
        <div v-else-if="reservation" class="scrollable-content"> 
            <div class="card shadow mb-4">

            <div class="card shadow mb-4">
                <div class="card-header bg-light">Détails de la Demande</div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5>Client</h5>
                            <ul class="list-unstyled">
                                <li>**Nom :** {{ reservation.client.nomCli }} {{ reservation.client.prenomCli }}</li>
                                <li>**Email :** {{ reservation.client.emailCli }}</li>
                                <li>**Téléphone :** {{ reservation.client.telephoneCli }}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h5>Ressource Demandée</h5>
                            <ul class="list-unstyled">
                                <li>**Type :** <span class="badge bg-info text-dark">{{ reservation.typeRes }}</span></li>
                                <li>**Période :** Du {{ formatDate(reservation.debRes) }} au {{ formatDate(reservation.finRes) }}</li>
                                <li>**Quantité :** {{ reservation.qteMat || reservation.nbPerso }}</li>
                                <li>**Tarif Total :** **{{ reservation.tarifTot }} MGA</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow">
                <div class="card-header bg-success text-white">Processus de Validation / Création du Contrat</div>
                <div class="card-body">
                    
                    <h5 class="mt-0">1. Vérification et Contrat</h5>
                    <div class="alert alert-info small">
                        Le système backend a déjà vérifié la disponibilité lors de la demande. Vous confirmez ici le **transfert de la Réservation vers une Location active**.
                    </div>
                    <button @click="simulerContrat" class="btn btn-outline-primary mb-3 me-2">
                        <i class="bi bi-file-earmark-text"></i> Visualiser Contrat PDF (Simulé)
                    </button>
                    <div v-if="contractReady" class="alert alert-success small">
                        Contrat généré et prêt pour la signature électronique.
                    </div>

                    <h5 class="mt-4">2. Finalisation et Activation</h5>
                    <div class="mb-3">
                        <label for="signature" class="form-label">Simulation de la Signature Électronique :</label>
                        <input type="text" id="signature" v-model="signatureData" class="form-control" placeholder="Entrez 'SIGNÉ' pour simuler la signature du client" :disabled="!contractReady">
                        <div class="form-text">Ce champ simule l'étape de signature.</div>
                    </div>

                    <button 
                        @click="handleValidation" 
                        :disabled="!isReadyToValidate || isProcessing"
                        class="btn btn-success btn-lg w-100">
                        <i v-if="isProcessing" class="bi bi-arrow-clockwise spin me-2"></i>
                        {{ isProcessing ? 'Traitement...' : 'Confirmer la Location et Créer le Contrat' }}
                    </button>
                    <p v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</p>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LocationService from '../services/LocationService'; // Assurez-vous que le chemin est correct

const route = useRoute();
const router = useRouter();

const idRes = ref(null); // Initialisé à null
const reservation = ref(null);
const loading = ref(true);
const errorMessage = ref(null);
const successMessage = ref(null);
const isProcessing = ref(false);

const contractReady = ref(false); 
const signatureData = ref('');    

// --- Fonctions d'Utilité (laissez telles quelles) ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    try {
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch {
        return dateString.substring(0, 16);
    }
};

const isReadyToValidate = computed(() => {
    return contractReady.value && signatureData.value.toUpperCase() === 'SIGNÉ';
});
// ---------------------------------------------------


// --- Fonctions API ---

const fetchReservationDetails = async () => {
    // 🚨 VÉRIFICATION CRITIQUE : Ne pas lancer la requête si l'ID est manquant
    if (!idRes.value) {
        loading.value = false;
        errorMessage.value = "Erreur fatale: L'identifiant de la réservation est manquant dans l'URL.";
        return;
    }
    
    loading.value = true;
    errorMessage.value = null;
    try {
        // Utilisation correcte de la valeur de la référence: idRes.value
        const response = await LocationService.getReservationDetails(idRes.value);
        reservation.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des détails:", error);
        errorMessage.value = `Impossible de charger la réservation : ${error.response?.data?.message || error.message}`;
    } finally {
        loading.value = false;
    }
};

const simulerContrat = () => {
    alert("Contrat de location généré pour le client. Le document est prêt pour la signature électronique.");
    contractReady.value = true;
};

const handleValidation = async () => {
    // ... (Logique de validation existante, non modifiée)
    if (!isReadyToValidate.value) return;

    isProcessing.value = true;
    errorMessage.value = null;
    successMessage.value = null;

    try {
        const response = await LocationService.validateReservation(idRes.value, signatureData.value);
        
        successMessage.value = response.data.message;
        alert(successMessage.value);

        router.push({ name: 'DemandesEnAttente' }); // Redirection vers la liste
    } catch (error) {
        console.error("Erreur de validation:", error);
        errorMessage.value = `Échec de la validation : ${error.response?.data?.message || error.message}`;
        alert(errorMessage.value);
    } finally {
        isProcessing.value = false;
    }
};


// --- Cycle de Vie ---

onMounted(() => {
    // 🚨 On lit directement la valeur du paramètre
    const routeId = route.params.idRes;
    
    // Ajout d'une vérification pour voir si l'objet params existe
    console.log("Paramètres de la route:", route.params); 
    
    if (routeId) {
        idRes.value = routeId;
        // On lance la récupération uniquement si l'ID est valide
        fetchReservationDetails();
    } else {
        // Gère le cas où la route n'a pas fourni l'ID
        loading.value = false;
        // Ceci est le message que vous voyez, il est déclenché car routeId est null/undefined
        errorMessage.value = "Erreur: L'identifiant de la réservation est introuvable."; 
    }
});
</script>

<style scoped>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.spin {
    animation: spin 1s linear infinite;
}
.scrollable-content {
    /* Définir une hauteur maximale, par exemple 80% de la hauteur de la fenêtre (viewport) */
    max-height: 80vh; 
    /* Appliquer le défilement vertical si le contenu dépasse la hauteur maximale */
    overflow-y: auto; 
    padding-right: 15px; /* Éviter que la barre de scroll ne colle au contenu */
}
/* Votre classe .retour si nécessaire */
/* .retour { float: right; } */ 
</style>