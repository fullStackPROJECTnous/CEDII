<!--<template>
  <div class="p-4">
    <h1>Calendrier🛎️</h1>
    <p>Vue d'ensemble </p>
    </div>
</template>
<script setup>
// Logique Réception
</script>
-->  

<template>
    <hr class="my-5">

    <div class="card shadow-lg">
         <div class="mt-auto pt-3 border-top">
        <button @click="logout" class="btn btn-sm btn-danger w-100">
          <i class="bi bi-box-arrow-right"></i> Retour à l'acceuil
        </button>
      </div>
    
        <div class="card-header bg-white border-bottom">
            <h5 class="card-title mb-0">Vue Calendrier des Événements Confirmés ({{ confirmedEvents.length }})</h5>
        </div>
        <div class="card-body">
            <div v-if="loadingEvents" class="text-center p-5 text-primary">
                <i class="bi bi-arrow-clockwise spin me-2"></i> Chargement des événements...
            </div>
            <div v-else-if="confirmedEvents.length === 0" class="alert alert-warning text-center">
                Aucun événement confirmé trouvé.
            </div>
            <div v-else id="calendar-view" style="height: 600px;" class="p-3">
                <div class="alert alert-success text-start">
                    Données prêtes pour le calendrier. Total: {{ confirmedEvents.length }} événements.
                    <details>
                        <summary>Voir le format des données</summary>
                        <pre style="font-size: 0.75rem;">{{ formattedCalendarEvents.slice(0, 1).toString() }}</pre>
                    </details>
                </div>
                </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LocationService from '../services/LocationService'; 

// ... (vos déclarations search, availabilityResult, loadingAvailability) ...
const confirmedEvents = ref([]);
const loadingEvents = ref(true);


// --- Nouvelle Logique pour le Calendrier ---

// Calcule le format standard attendu par une librairie de calendrier (FullCalendar par exemple)
const formattedCalendarEvents = computed(() => {
    return confirmedEvents.value.map(event => {
        // Crée un titre descriptif
        const title = `${event.typeLo} - ${event.reservation?.client ? event.reservation.client.nomCli : 'N/A'}`;
        
        return {
            id: event.idLo,
            title: title,
            start: event.debLo, // Le champ Date/Heure de début
            end: event.finLo,   // Le champ Date/Heure de fin
            classNames: ['bg-info'] // Classe CSS pour la couleur de l'événement
        };
    });
});

const logout = () => {
    AuthService.logout();
    router.push('/dashboardReception');
};

const fetchConfirmedEvents = async () => {
    loadingEvents.value = true;
    try {
        const response = await LocationService.getConfirmedEvents();
        confirmedEvents.value = response.data;
    } catch (error) {
        console.error("Erreur lors du chargement des événements confirmés:", error);
        // Gérer l'erreur d'affichage ici si nécessaire
    } finally {
        loadingEvents.value = false;
    }
};

onMounted(() => {
    // ... (Appel de fetchAvailability si nécessaire) ...
    fetchConfirmedEvents(); // 🚨 Lancement du chargement des événements
});
</script>