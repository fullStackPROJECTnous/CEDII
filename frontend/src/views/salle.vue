<template>
    
  <div class="salle-management p-4">
    <h1 class="mb-4 text-primary"><i class="bi bi-door-open-fill me-2"></i> Gestion des Salles</h1>

    <div class="d-flex justify-content-between mb-4">
      <button class="btn cedii-btn-primary" @click="openModal('add')">
        <i class="bi bi-plus-circle-fill me-2"></i> Ajouter une Salle
      </button>
      <input type="text" v-model="searchQuery" class="form-control w-25" placeholder="Rechercher par nom ou numéro..." />
    </div>

    <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">{{ message }}</div>

    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom de la Salle</th>
                <th>Numéro</th>
                <th>Capacité</th>
                <th>Tarif/Jour (MGA)</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredSalles.length === 0">
                <td colspan="7" class="text-center text-muted">Aucune salle trouvée.</td>
              </tr>
              <tr v-for="salle in filteredSalles" :key="salle.idSalle">
                <td class="fw-bold">{{ salle.idSalle }}</td>
                <td>{{ salle.nomSalle }}</td>
                <td>{{ salle.numeroSalle }}</td>
                <td>{{ salle.capaciteSalle }}</td>
                <td>{{ formatCurrency(salle.tarifSalle) }}</td>
                <td>
                  <span :class="getStatusClass(salle.disponibiliteSalle)">
                    {{ salle.disponibiliteSalle }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="openModal('edit', salle)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteSalle(salle.idSalle)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="salleModal" tabindex="-1" aria-labelledby="salleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form @submit.prevent="saveSalle">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="salleModalLabel">
              {{ isEditMode ? 'Modifier la Salle' : 'Ajouter une Nouvelle Salle' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            
            <div class="mb-3">
              <label for="nomSalle" class="form-label">Nom de la Salle</label>
              <input type="text" id="nomSalle" v-model="currentSalle.nomSalle" class="form-control" required />
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="numeroSalle" class="form-label">Numéro/Code</label>
                    <input type="text" id="numeroSalle" v-model="currentSalle.numeroSalle" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="capaciteSalle" class="form-label">Capacité (personnes)</label>
                    <input type="number" id="capaciteSalle" v-model.number="currentSalle.capaciteSalle" class="form-control" required min="1" />
                </div>
            </div>

            <div class="mb-3">
              <label for="tarifSalle" class="form-label">Tarif Location/Jour (MGA)</label>
              <input type="number" id="tarifSalle" v-model.number="currentSalle.tarifSalle" class="form-control" required min="0" step="0.01" />
            </div>
            
            <div class="mb-3">
              <label for="disponibiliteSalle" class="form-label">Statut</label>
              <select id="disponibiliteSalle" v-model="currentSalle.disponibiliteSalle" class="form-select" required>
                <option value="Disponible">Disponible</option>
                <option value="Occupée">Occupée</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="submit" class="btn cedii-btn-primary" :disabled="isLoading">
              {{ isEditMode ? 'Sauvegarder les modifications' : 'Ajouter' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SalleService from '../services/SalleService';
import * as bootstrap from 'bootstrap'; 

// --- États Locaux ---
const salles = ref([]);
const currentSalle = ref({});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const searchQuery = ref('');

let salleModalInstance = null; 

// --- Propriétés Calculées ---

// Filtrer la liste des salles
const filteredSalles = computed(() => {
  if (!searchQuery.value) {
    return salles.value;
  }
  const query = searchQuery.value.toLowerCase();
  return salles.value.filter(salle => 
    salle.nomSalle.toLowerCase().includes(query) ||
    salle.numeroSalle.toLowerCase().includes(query)
  );
});

// --- Fonctions de Démarrage ---

onMounted(() => {
  fetchSalles();
  // Initialiser l'instance du modal Bootstrap
  const modalElement = document.getElementById('salleModal');
  salleModalInstance = new bootstrap.Modal(modalElement);
});

// --- Requêtes API (CRUD) ---

async function fetchSalles() {
  message.value = '';
  isError.value = false;
  try {
    const response = await SalleService.getAllSalles();
    salles.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement des salles:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Échec de la récupération des salles.";
  }
}

async function saveSalle() {
  isLoading.value = true;
  message.value = '';
  isError.value = false;
  
  try {
    let response;
    
    if (isEditMode.value) {
      // MODE MODIFICATION
      response = await SalleService.updateSalle(currentSalle.value.idSalle, currentSalle.value);
      message.value = 'Salle modifiée avec succès !';
    } else {
      // MODE AJOUT
      response = await SalleService.createSalle(currentSalle.value);
      message.value = 'Salle ajoutée avec succès !';
    }
    
    await fetchSalles(); // Recharger les données
    salleModalInstance.hide(); // Fermer le modal

  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Échec de l'opération de sauvegarde.";
  } finally {
    isLoading.value = false;
  }
}

async function deleteSalle(idSalle) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer la salle ID ${idSalle} ?`)) {
    return;
  }
  
  message.value = '';
  isError.value = false;

  try {
    await SalleService.deleteSalle(idSalle);
    message.value = 'Salle supprimée avec succès.';
    await fetchSalles(); // Recharger les données
  } catch (error) {
    console.error("Erreur de suppression:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Échec de la suppression de la salle.";
  }
}


// --- Fonctions d'Interface (Modal) ---

function openModal(mode, salleData = null) {
  isError.value = false;
  message.value = '';
  isEditMode.value = mode === 'edit';
  
  if (isEditMode.value && salleData) {
    currentSalle.value = { ...salleData }; 
  } else {
    currentSalle.value = { 
        nomSalle: '', 
        numeroSalle: '', 
        capaciteSalle: 10, 
        tarifSalle: 0, 
        disponibiliteSalle: 'Disponible'
    };
  }

  salleModalInstance.show();
}


// --- Fonctions Utilitaire ---

const formatCurrency = (value) => {
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return '0,00';
    return value.toLocaleString('fr-MG', { minimumFractionDigits: 2 });
};

const getStatusClass = (status) => {
    if (status === 'Disponible') return 'badge bg-success';
    if (status === 'Occupée') return 'badge bg-warning text-dark';
    if (status === 'Maintenance') return 'badge bg-danger';
    return 'badge bg-secondary';
};

</script>

<style scoped>
/* Styles spécifiques pour le composant Salle.vue */
.text-primary { color: #5B11EE !important; }
.bg-primary { background-color: #5B11EE !important; }
.cedii-btn-primary {
    background-color: #5B11EE;
    border-color: #5B11EE;
    color: white;
}
.cedii-btn-primary:hover {
    background-color: #0405BF;
    border-color: #0405BF;
}
.badge {
    padding: 0.6em 0.8em;
}
</style>