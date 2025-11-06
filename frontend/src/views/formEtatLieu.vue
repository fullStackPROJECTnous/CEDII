<template>
    <div class="container py-4">
        <div class="d-flex justify-content-end mb-4">
            <router-link :to="{ name: 'EtatLieux' }" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-arrow-left"></i> Retour à la liste
            </router-link>
        </div>

        <h2 class="mb-4 text-dark">
            <i :class="mode === 'depart' ? 'bi bi-box-arrow-right' : 'bi bi-box-arrow-left'" class="me-2"></i> 
            État des Lieux de {{ mode === 'depart' ? 'Départ' : 'Retour' }} Location #{{ idLo }}
        </h2>
        <hr>

        <div v-if="loading" class="text-center p-5">Chargement des détails de la location...</div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <div v-else-if="locationDetails">
            <div class="card shadow mb-4">
                <div class="card-header bg-light">Matériel à Vérifier pour {{ locationDetails.client.nomCli }}</div>
                <div class="card-body">
                    
                    <form @submit.prevent="handleSubmitEtatLieux">
                        <p class="text-muted">Veuillez vérifier l'état du matériel au moment du {{ mode }}.</p>
                        
                        <div v-for="(item, index) in materielState" :key="index" class="mb-4 p-3 border rounded">
                            
                            <h5 class="text-primary">{{ item.materiel?.nomMat || 'Ressource Inconnue' }} (Qté : {{ item.qteMat }})</h5>

                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'damaged-' + index" :id="'ok-' + index" 
                                       :value="false" v-model="item.estEndommage" required>
                                <label class="form-check-label" :for="'ok-' + index">État OK</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'damaged-' + index" :id="'damaged-' + index" 
                                       :value="true" v-model="item.estEndommage" required>
                                <label class="form-check-label text-danger" :for="'damaged-' + index">Endommagé</label>
                            </div>

                            <div v-if="item.estEndommage === true" class="mt-3 p-3 bg-light rounded">
                                <div class="mb-3">
                                    <label :for="'description-' + index" class="form-label">Description de la Dégradation :</label>
                                    <textarea :id="'description-' + index" v-model="item.descriptionDegradation" 
                                              class="form-control" rows="2" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label :for="'cost-' + index" class="form-label">Coût Estimé de la Réparation (Ar) :</label>
                                    <input type="number" :id="'cost-' + index" v-model.number="item.coutReparation" 
                                           class="form-control" min="0" required>
                                </div>
                            </div>
                        </div>

                        <button type="submit" :disabled="isSubmitting" class="btn btn-lg btn-primary w-100 mt-4">
                            <i v-if="isSubmitting" class="bi bi-arrow-clockwise spin me-2"></i>
                            {{ mode === 'depart' ? 'Confirmer le Départ du Matériel' : 'Confirmer le Retour et Enregistrer les Frais' }}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LocationService from '../services/LocationService'; // Votre service

const route = useRoute();
const router = useRouter();

const idLo = ref(route.params.idLo); // ID de la Location
const mode = ref(route.params.mode); // 'depart' ou 'retour'

const locationDetails = ref(null);
const materielState = ref([]); // Liste des articles avec leur état
const loading = ref(true);
const errorMessage = ref(null);
const isSubmitting = ref(false);

// Fonction simulée pour charger les détails de la location et du matériel
const fetchLocationDetails = async () => {
    loading.value = true;
    errorMessage.value = null;
    try {
        // 🚀 ÉTAPE 1 : Appel à la nouvelle route backend /locations/:idLo/details
        const response = await LocationService.getLocationDetails(idLo.value); 
        locationDetails.value = response.data; // Affectation des vraies données

        // 🚨 Sécurité : S'assurer que le tableau 'details' existe
        if (!locationDetails.value.details || locationDetails.value.details.length === 0) {
            errorMessage.value = "Aucun article/salle n'est associé à cette location.";
            materielState.value = [];
            return;
        }

        // 🚀 ÉTAPE 2 : Initialisation de l'état du matériel pour le formulaire
        materielState.value = locationDetails.value.details.map(item => ({
            // Utilise l'ID du Matériel (codeMat) ou de la Salle (idSalle)
            // L'un des deux devrait être défini par le backend.
            idMat: item.idMat || item.idSalle, 
            materielCode: item.materiel?.nomMat, // Le nom pour la référence visuelle
            qteMat: item.qteMat,
            estEndommage: false, // Par défaut, l'état est OK
            coutReparation: 0,
            descriptionDegradation: ""
        }));

    } catch (error) {
        console.error("Erreur de chargement des détails de la location:", error);
        // Affiche le message d'erreur du backend s'il est disponible
        errorMessage.value = `Impossible de charger la location : ${error.response?.data?.message || error.message}`;
    } finally {
        loading.value = false;
    }
};

const handleSubmitEtatLieux = async () => {
    isSubmitting.value = true;
    errorMessage.value = null;

    // 1. Filtrer et préparer le payload pour le backend
    const payload = materielState.value.map(item => ({
        // 🚨 CORRECTION : Utiliser la clé 'idMat' (ou 'idSalle') que le backend attend
        idMat: item.idMat, 
        qteMat: item.qteMat,
        estEndommage: item.estEndommage,
        // Ces champs ne sont requis que si estEndommage est true
        coutReparation: item.estEndommage ? item.coutReparation : 0, 
        descriptionDegradation: item.estEndommage ? item.descriptionDegradation : ""
    }));

    try {
        // 2. Appel au service : POST /locations/:idLo/etat-lieux
        const response = await LocationService.submitEtatLieux(idLo.value, mode.value, payload);
        
        alert(`✅ État des Lieux de ${mode.value} enregistré avec succès. Message: ${response.data.message}`);

        // Rediriger vers la liste des événements
        router.push({ name: 'EtatLieux' }); 
        
    } catch (error) {
        console.error("Erreur lors de la soumission de l'état des lieux:", error);
        errorMessage.value = `Échec de l'enregistrement : ${error.response?.data?.message || error.message}`;
        alert(errorMessage.value);
    } finally {
        isSubmitting.value = false;
    }
};


onMounted(() => {
    if (!idLo.value || !mode.value) {
        errorMessage.value = "Erreur: ID de Location ou Mode manquant.";
        loading.value = false;
        return;
    }
    fetchLocationDetails();
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
/* Styles pour la distinction des modes */
.bg-light { background-color: #f8f9fa !important; }
</style>