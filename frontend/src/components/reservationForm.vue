<template>
  <div class="vh-100 d-flex flex-column"> 

    <ClientNavbar />

    <main class="main-content flex-grow-1 overflow-auto bg-light p-4"> 
      <header class="pb-3 border-bottom">
        <h1 class="text-secondary">Soumettre une Nouvelle Demande de Réservation</h1>
      </header>
      
      <div class="row mt-4 justify-content-center">
        <div class="col-lg-8">
            <div class="card shadow p-4">
                <form @submit.prevent="submitReservation">
          
                    <div class="mb-3">
                        <label for="resource" class="form-label">Ressource Demandée</label>
                        <select id="resource" class="form-select" v-model="form.resourceId" required>
                        <option value="" disabled>Sélectionnez un bien...</option>
                        <option v-for="res in resources" :key="res.id" :value="res.id">{{ res.name }}</option>
                        </select>
                        <div class="form-text">Consultez le catalogue pour la description complète.</div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                        <label for="startDate" class="form-label">Date de Début</label>
                        <input type="date" id="startDate" class="form-control" v-model="form.startDate" required>
                        </div>
                        <div class="col-md-6 mb-3">
                        <label for="endDate" class="form-label">Date de Fin</label>
                        <input type="date" id="endDate" class="form-control" v-model="form.endDate" required>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="details" class="form-label">Détails de l'Utilisation / Justification</label>
                        <textarea id="details" class="form-control" rows="3" v-model="form.details"></textarea>
                    </div>
                    
                    <button type="submit" class="btn cedii-btn-primary w-100 mt-4" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span v-else><i class="bi bi-send-fill me-2"></i> Envoyer la Demande</span>
                    </button>
                </form>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ClientNavbar from '../components/clientNavbar.vue';

const isSubmitting = ref(false);

const form = ref({
  resourceId: '',
  startDate: '',
  endDate: '',
  details: '',
});

const resources = ref([
  
]);

const submitReservation = async () => {
  isSubmitting.value = true;
  console.log("Soumission:", form.value);
  // Simuler appel API
  await new Promise(resolve => setTimeout(resolve, 1500)); 
  isSubmitting.value = false;
};

onMounted(() => {
    // Charger les ressources disponibles
});
</script>

<style scoped>
/* COHÉRENCE AVEC LES STYLES */
.cedii-text-primary { color: var(--cedii-primary-light, #5B11EE) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}
</style>