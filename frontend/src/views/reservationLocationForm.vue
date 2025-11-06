<template>
  <div class="reservation-form-container p-4 border rounded shadow-sm bg-white">
    <form @submit.prevent="submitForm">
      
      <div class="mb-4">
        <label class="form-label fw-bold">Type de Demande <span class="text-danger">*</span></label>
        <div class="d-flex btn-group w-100" role="group">
          <input type="radio" class="btn-check" id="type-salle" value="Salle" v-model="form.typeRes" required>
          <label class="btn btn-outline-primary" for="type-salle">
            <i class="bi bi-house-door me-1"></i> Réservation de Salle
          </label>
          
          <input type="radio" class="btn-check" id="type-materiel" value="Materiel" v-model="form.typeRes" required>
          <label class="btn btn-outline-primary" for="type-materiel">
            <i class="bi bi-tools me-1"></i> Location de Matériel
          </label>
        </div>
      </div>

      <div v-if="form.typeRes">
        
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="row align-items-center">
                    <label for="catalogueId" class="col-md-4 col-form-label fw-bold">{{ form.typeRes === 'Salle' ? 'Salle' : 'Matériel' }} <span class="text-danger">*</span></label>
                    <div class="col-md-8">
                        <select 
                            id="catalogueId" 
                            v-model="form.idCatalogue" 
                            class="form-select" 
                            required
                            :disabled="loading.catalogue"
                        >
                            <option disabled value="">Veuillez choisir une ressource</option>
                            <option v-if="loading.catalogue" disabled>Chargement...</option>
                            <option v-for="item in filteredCatalogue" :key="item.id" :value="item.id">
                              {{ item.nom }} (Tarif Jour: {{ item.tarifJour ? item.tarifJour.toFixed(2) : 'N/A' }} XOF)
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="row align-items-center">
                    <label for="clientId" class="col-md-4 col-form-label fw-bold">Client <span class="text-danger">*</span></label>
                    <div class="col-md-8">
                        <select 
                            id="clientId" 
                            v-model.number="form.idCli" 
                            class="form-select" 
                            required
                            :disabled="loading.clients"
                        >
                            <option disabled value="">Sélectionner le client</option>
                            <option v-if="loading.clients" disabled>Chargement...</option>
                            <option v-for="client in clients" :key="client.idCli" :value="client.idCli">
                              {{ client.nomCli }} {{ client.prenomCli }} (ID: {{ client.idCli }})
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-6" v-if="form.typeRes === 'Materiel'">
            <div class="row align-items-center">
                <label for="qteMat" class="col-md-4 col-form-label fw-bold">Quantité <span class="text-danger">*</span></label>
                <div class="col-md-8">
                    <input 
                      type="number" 
                      id="qteMat" 
                      v-model.number="form.qteMat" 
                      class="form-control" 
                      min="1" 
                      required
                    >
                </div>
            </div>
          </div>
          
          <div class="col-md-6" v-if="form.typeRes === 'Salle'">
            <div class="row align-items-center">
                <label for="nbPerso" class="col-md-4 col-form-label fw-bold">Nb. Personnes <span class="text-danger">*</span></label>
                <div class="col-md-8">
                    <input 
                      type="number" 
                      id="nbPerso" 
                      v-model.number="form.nbPerso" 
                      class="form-control" 
                      min="1" 
                      required
                    >
                </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
            <label class="form-label fw-bold">Durée de la Location/Réservation <span class="text-danger">*</span></label>
            <div class="row g-2">
                <div class="col-6 col-md-3">
                    <input type="radio" class="btn-check" id="duree-heure" value="heure" v-model="form.typeDuree" required>
                    <label class="btn btn-outline-secondary w-100" for="duree-heure">Par Heure</label>
                </div>
                <div class="col-6 col-md-3">
                    <input type="radio" class="btn-check" id="duree-demijournee" value="demi-journee" v-model="form.typeDuree" required>
                    <label class="btn btn-outline-secondary w-100" for="duree-demijournee">Demi-Journée</label>
                </div>
                <div class="col-6 col-md-3">
                    <input type="radio" class="btn-check" id="duree-journee" value="Jour" v-model="form.typeDuree" required>
                    <label class="btn btn-outline-secondary w-100" for="duree-journee">Journée Complète</label>
                </div>
                <div class="col-6 col-md-3">
                    <input type="radio" class="btn-check" id="duree-parjour" value="plus-jours" v-model="form.typeDuree" required>
                    <label class="btn btn-outline-secondary w-100" for="duree-parjour">Plusieurs Jours</label>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="row align-items-center">
                    <label for="debRes" class="col-md-4 col-form-label fw-bold">Début <span class="text-danger">*</span></label>
                    <div class="col-md-8">
                        <input type="datetime-local" id="debRes" v-model="form.debRes" class="form-control" required>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="row align-items-center">
                    <label for="finRes" class="col-md-4 col-form-label fw-bold">Fin/Retour <span class="text-danger">*</span></label>
                    <div class="col-md-8">
                        <input type="datetime-local" id="finRes" v-model="form.finRes" class="form-control" required>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mb-4 p-3 border rounded text-end bg-light">
            <h5 class="mb-0 text-dark">Tarif Total Estimé : <span class="cedii-text-primary fs-3 fw-bold">{{ formattedTarif }}</span></h5>
        </div>

        <div class="mb-4">
            <label class="form-label fw-bold">État de la Demande</label>
            <input type="text" :value="form.etatRes" class="form-control" disabled>
            <small class="form-text text-muted">La demande sera créée en état **{{ form.etatRes }}** (En attente de validation).</small>
        </div>
        
        <div class="d-grid gap-2">
            <button type="submit" :disabled="isSubmitting" class="btn cedii-btn-primary fw-bold text-white">
                <i :class="isSubmitting ? 'spinner-border spinner-border-sm' : 'bi bi-check-circle-fill'"></i>
                {{ isSubmitting ? 'Envoi en cours...' : 'Enregistrer la Réservation/Location' }}
            </button>
        </div>
        
        <div v-if="message" :class="['mt-3 alert', isSuccess ? 'alert-success' : 'alert-danger']">
            {{ message }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import LocationService from '../services/LocationService'; 

// ------------------------------------
// ÉTATS LOCAUX
// ------------------------------------
const isSubmitting = ref(false);
const message = ref('');
const isSuccess = ref(false);
const loading = reactive({
    catalogue: true,
    clients: true
});

const catalogueData = ref([]); 
const clients = ref([]); 

const initialFormState = {
  typeRes: null, 
  idCli: '', 
  idCatalogue: '', 
  dateCre: new Date().toISOString().split('T')[0], 
  qteMat: 1, 
  typeDuree: 'Jour', 
  nbPerso: 1, 
  debRes: '', 
  finRes: '',
  tarifTot: 0, 
  etatRes: 'En attente', 
};

const form = reactive({ ...initialFormState });

// ------------------------------------
// PROPRIÉTÉS CALCULÉES
// ------------------------------------

const filteredCatalogue = computed(() => {
    return catalogueData.value.filter(item => item.type === form.typeRes);
});

const selectedResource = computed(() => {
    return filteredCatalogue.value.find(item => item.id === form.idCatalogue);
});

const formattedTarif = computed(() => {
    let tarif = 0;
    const resource = selectedResource.value;
    
    if (resource && form.typeDuree) {
        let baseTarif = 0;

        if (form.typeDuree === 'heure') {
            baseTarif = resource.tarifHeure || 0;
        } else if (form.typeDuree === 'demi-journee') {
            baseTarif = resource.tarifDemiJournee || 0;
        } else if (form.typeDuree === 'Jour' || form.typeDuree === 'plus-jours') {
            baseTarif = resource.tarifJour || 0;
            
            if (form.typeDuree === 'plus-jours' && form.debRes && form.finRes) {
                const start = new Date(form.debRes);
                const end = new Date(form.finRes);
                
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 0) {
                     baseTarif = (resource.tarifJour || 0) * diffDays;
                }
            }
        }
        
        if (form.typeRes === 'Materiel') {
            tarif = baseTarif * (form.qteMat || 1);
        } else {
            tarif = baseTarif;
        }
    }

    form.tarifTot = parseFloat(tarif.toFixed(2));
    return form.tarifTot.toFixed(2) + ' XOF';
});

// ------------------------------------
// LOGIQUE DE RÉCUPÉRATION DE DONNÉES (CORRIGÉE)
// ------------------------------------

const fetchInitialData = async () => {
    loading.catalogue = true;
    loading.clients = true;
    try {
        
        // 1. Récupération des Clients (CORRIGÉ: La fonction getClients est maintenant dans LocationService)
        const clientData = await LocationService.getClients(); 
        clients.value = clientData.map(c => ({ idCli: c.idCli, nomCli: c.nomCli, prenomCli: c.prenomCli }));

        // 2. Récupération des Salles et Matériels
        const sallesData = await LocationService.getSalles();
        const materielsData = await LocationService.getMateriels();

        // 3. Mapping et Fusion
        const mappedSalles = sallesData.map(s => ({
            id: s.idSalle,
            nom: s.nomSalle,
            type: 'Salle',
           tarifHeure: parseFloat(s.tarifHeure) || 0,
            tarifDemiJournee: parseFloat(s.tarifDemiJournee) || 0,
            tarifJour: parseFloat(s.tarifJour) || 0,
        }));
        
        const mappedMateriels = materielsData.map(m => ({
            id: m.codeMat,
            nom: m.designationMat,
            type: 'Materiel',
            tarifHeure: parseFloat(m.tarifHeure) || 0,
            tarifDemiJournee: parseFloat(m.tarifDemiJournee) || 0,
            tarifJour: parseFloat(m.tarifJour) || 0,
        }));
        
        catalogueData.value = [...mappedSalles, ...mappedMateriels];
        
    } catch (error) {
        console.error("Erreur de chargement des données initiales:", error);
        // Utilisation de error.message pour un meilleur affichage de l'erreur (si elle provient d'Axios)
        message.value = `❌ Erreur de connexion : ${error.message || 'Impossible de charger les données initiales.'}`;
    } finally {
        loading.catalogue = false;
        loading.clients = false;
    }
};

// ------------------------------------
// LOGIQUE D'ENVOI DE DONNÉES
// ------------------------------------

watch(() => form.typeRes, () => {
    form.idCatalogue = '';
    form.nbPerso = 1;
    form.qteMat = 1;
});

const submitForm = async () => {
    isSubmitting.value = true;
    message.value = '';
    
    if (new Date(form.debRes) >= new Date(form.finRes)) {
         message.value = "La Date de Fin/Retour doit être strictement postérieure à la Date de Début.";
         isSubmitting.value = false;
         isSuccess.value = false;
         return;
    }
    
    const payload = {
        idCli: form.idCli,
        idCatalogue: form.idCatalogue, 
        dateCre: form.dateCre, 
        // 🚨 CORRECTION: Envoyer 0 au lieu de null pour les champs numériques non utilisés
        qteMat: form.typeRes === 'Materiel' ? form.qteMat : 0, 
        typeRes: form.typeRes, 
        // 🚨 CORRECTION: Envoyer 0 au lieu de null pour les champs numériques non utilisés
        nbPerso: form.typeRes === 'Salle' ? form.nbPerso : 0, 
        debRes: form.debRes, 
        finRes: form.finRes,
        tarifTot: form.tarifTot,
        etatRes: form.etatRes,
    };

    console.log("Données envoyées:", payload);
    
    try {
        const response = await LocationService.createReservation(payload);
        
        const resId = response.id || Math.floor(Math.random() * 1000);
        message.value = `✅ Demande #${resId} (${form.typeRes}) enregistrée avec succès !`;
        isSuccess.value = true;

        Object.assign(form, { ...initialFormState, typeRes: null });
        
        } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        message.value = `❌ Échec de l'enregistrement. Détails: ${error.message || 'Problème de connexion/validation.'}`;
        isSuccess.value = false;
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    fetchInitialData();
});
</script>

<style scoped>
.cedii-text-primary { color: var(--cedii-primary-light, #5B11EE) !important; }

.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white !important; 
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0671b6);
    border-color: var(--cedii-primary-dark, #0671b6);
}
.btn-outline-primary {
    color: var(--cedii-primary-light, #5B11EE);
    border-color: var(--cedii-primary-light, #5B11EE);
}
.btn-check:checked + .btn-outline-primary {
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
}
</style>