<template>
    <div class="container py-4">
        <h2 class="mb-4 text-dark"><i class="bi bi-truck-flatbed me-2"></i> Gestion des Départs & Retours (État des Lieux)</h2>
        <hr>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        
        <div class="card shadow">
            <div class="card-header bg-primary text-white">Événements Confirmés Aujourd'hui</div>
            <div class="card-body">

                <div v-if="loading" class="text-center p-5">
                    <i class="bi bi-arrow-clockwise spin fs-3 text-primary"></i>
                    <p class="mt-2">Chargement des événements...</p>
                </div>

                <div v-else-if="confirmedEvents.length === 0" class="alert alert-info text-center">
                    Aucun départ ou retour de matériel planifié pour aujourd'hui.
                </div>

                <div v-else class="list-group">
                    <div 
                        v-for="event in confirmedEvents" 
                        :key="event.idLo" 
                        class="list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm rounded">
                        
                        <div>
                            <h5 class="mb-1 text-primary">Location #{{ event.idLo }}</h5>
                            <small class="text-muted">Client : {{ event.client.nomCli }} {{ event.client.prenomCli }}</small>
                            <p class="mb-1">
                                Période : Du **{{ formatDate(event.debLoc) }}** au **{{ formatDate(event.finLoc) }}**
                            </p>
                        </div>

                        <div class="btn-group">
                            <router-link 
                                :to="{ name: 'FormEtatLieu', params: { idLo: event.idLo, mode: 'depart' } }" 
                                class="btn btn-success btn-sm me-2"
                                title="Enregistrer l'état du matériel au départ">
                                <i class="bi bi-box-arrow-right"></i> Départ (État des Lieux)
                            </router-link>

                            <router-link 
                                v-if="isPastEvent(event.finLoc)"
                                :to="{ name: 'FormEtatLieu', params: { idLo: event.idLo, mode: 'retour' } }" 
                                class="btn btn-warning btn-sm"
                                title="Enregistrer l'état du matériel au retour">
                                <i class="bi bi-box-arrow-left"></i> Retour
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LocationService from '../services/LocationService'; // Votre service

const confirmedEvents = ref([]);
const loading = ref(true);
const errorMessage = ref(null);

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

const isPastEvent = (dateString) => {
    return new Date(dateString) < new Date();
};

// --- Fonctions API ---

const fetchConfirmedEvents = async () => {
    loading.value = true;
    errorMessage.value = null;
    try {
        // Appel GET /api/locations/events/confirmed
        const response = await LocationService.getConfirmedEvents(); 
        confirmedEvents.value = response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des événements:", error);
        errorMessage.value = `Impossible de charger les événements : ${error.response?.data?.message || error.message}`;
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchConfirmedEvents();
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
</style>