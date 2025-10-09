<template>
    
  <div class="materiel-management p-4">
    <h1 class="mb-4 text-primary"><i class="bi bi-tools me-2"></i> Gestion des Matériels</h1>

    <div class="d-flex justify-content-between mb-4">
      <button class="btn cedii-btn-primary" @click="openModal('add')">
        <i class="bi bi-plus-circle-fill me-2"></i> Ajouter un Matériel
      </button>
      <input type="text" v-model="searchQuery" class="form-control w-25" placeholder="Rechercher par désignation..." />
    </div>

    <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">{{ message }}</div>

    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Désignation</th>
                <th>Catégorie</th>
                <th>Qté Totale</th>
                <th>Qté Disponible</th>
                <th>Tarif/Jour (MGA)</th>
                <th>Acquisition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredMateriel.length === 0">
                <td colspan="8" class="text-center text-muted">Aucun matériel trouvé.</td>
              </tr>
              <tr v-for="mat in filteredMateriel" :key="mat.codeMat">
                <td class="fw-bold">{{ mat.codeMat }}</td>
                <td>{{ mat.designationMat }}</td>
                <td>{{ mat.categorieMat || 'N/A' }}</td>
                <td>{{ mat.qteTotDispo }}</td>
                <td><span :class="{'text-danger fw-bold': mat.qteActuelDispo <= 5}">{{ mat.qteActuelDispo }}</span></td>
                <td>{{ formatCurrency(mat.tarifLocation) }}</td>
                <td>{{ formatDate(mat.dateAcquisition) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="openModal('edit', mat)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteMateriel(mat.codeMat)">
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

  <div class="modal fade" id="materielModal" tabindex="-1" aria-labelledby="materielModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <form @submit.prevent="saveMateriel">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="materielModalLabel">
              {{ isEditMode ? 'Modifier le Matériel' : 'Ajouter un Nouveau Matériel' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            
            <div class="mb-3">
              <label for="codeMat" class="form-label">Code Matériel</label>
              <input type="text" id="codeMat" v-model="currentMateriel.codeMat" class="form-control" required :disabled="isEditMode" />
            </div>
            
            <div class="mb-3">
              <label for="designationMat" class="form-label">Désignation</label>
              <input type="text" id="designationMat" v-model="currentMateriel.designationMat" class="form-control" required />
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="qteTotDispo" class="form-label">Quantité Totale</label>
                    <input type="number" id="qteTotDispo" v-model.number="currentMateriel.qteTotDispo" class="form-control" required min="1" />
                </div>
                <div class="col-md-6 mb-3">
                    <label for="qteActuelDispo" class="form-label">Qté Actuellement Disponible</label>
                    <input type="number" id="qteActuelDispo" v-model.number="currentMateriel.qteActuelDispo" class="form-control" required :max="currentMateriel.qteTotDispo" min="0" />
                </div>
            </div>

            <div class="mb-3">
              <label for="tarifLocation" class="form-label">Tarif Location/Jour (MGA)</label>
              <input type="number" id="tarifLocation" v-model.number="currentMateriel.tarifLocation" class="form-control" required min="0" step="0.01" />
            </div>
            
            <div class="mb-3">
              <label for="categorieMat" class="form-label">Catégorie</label>
              <input type="text" id="categorieMat" v-model="currentMateriel.categorieMat" class="form-control" />
            </div>

            <div class="mb-3">
              <label for="dateAcquisition" class="form-label">Date d'Acquisition</label>
              <input type="date" id="dateAcquisition" v-model="currentMateriel.dateAcquisition" class="form-control" required />
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
import MaterielService from '../services/MaterielService';
import * as bootstrap from 'bootstrap'; // Nécessaire pour contrôler le modal

// --- États Locaux ---
const materiels = ref([]);
const currentMateriel = ref({});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const searchQuery = ref('');

let materielModalInstance = null; // Instance Bootstrap du modal

// --- Propriétés Calculées ---

// Filtrer la liste du matériel en fonction de la recherche
const filteredMateriel = computed(() => {
  if (!searchQuery.value) {
    return materiels.value;
  }
  const query = searchQuery.value.toLowerCase();
  return materiels.value.filter(mat => 
    mat.designationMat.toLowerCase().includes(query) ||
    mat.codeMat.toLowerCase().includes(query) ||
    (mat.categorieMat && mat.categorieMat.toLowerCase().includes(query))
  );
});

// --- Fonctions de Démarrage ---

onMounted(() => {
  fetchMateriel();
  // Initialiser l'instance du modal Bootstrap
  const modalElement = document.getElementById('materielModal');
  materielModalInstance = new bootstrap.Modal(modalElement);
});

// --- Requêtes API (CRUD) ---

async function fetchMateriel() {
  message.value = '';
  isError.value = false;
  try {
    const response = await MaterielService.getAllMateriel();
    materiels.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement du matériel:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Échec de la récupération du matériel.";
  }
}

async function saveMateriel() {
  isLoading.value = true;
  message.value = '';
  isError.value = false;
  
  try {
    let response;
    
    // Assurez-vous que la date est au bon format 'YYYY-MM-DD'
    if (currentMateriel.value.dateAcquisition && !(currentMateriel.value.dateAcquisition instanceof Date)) {
        currentMateriel.value.dateAcquisition = new Date(currentMateriel.value.dateAcquisition).toISOString().split('T')[0];
    }


    if (isEditMode.value) {
      // MODE MODIFICATION
      response = await MaterielService.updateMateriel(currentMateriel.value.codeMat, currentMateriel.value);
      message.value = 'Matériel modifié avec succès !';
    } else {
      // MODE AJOUT
      response = await MaterielService.createMateriel(currentMateriel.value);
      message.value = 'Matériel ajouté avec succès !';
    }
    
    await fetchMateriel(); // Recharger les données
    materielModalInstance.hide(); // Fermer le modal

  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Échec de l'opération de sauvegarde.";
  } finally {
    isLoading.value = false;
  }
}

async function deleteMateriel(codeMat) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le matériel avec le code ${codeMat} ?`)) {
    return;
  }
  
  message.value = '';
  isError.value = false;

  try {
    await MaterielService.deleteMateriel(codeMat);
    message.value = 'Matériel supprimé avec succès.';
    await fetchMateriel(); // Recharger les données
  } catch (error) {
    console.error("Erreur de suppression:", error);
    isError.value = true;
    message.value = error.response?.data?.message || "Échec de la suppression du matériel.";
  }
}


// --- Fonctions d'Interface (Modal) ---

function openModal(mode, materielData = null) {
  isError.value = false;
  message.value = '';
  isEditMode.value = mode === 'edit';
  
  if (isEditMode.value && materielData) {
    // Copier les données pour l'édition (pour éviter de modifier directement le tableau)
    currentMateriel.value = { ...materielData }; 
    // Formatage de la date pour l'input type="date"
    if (currentMateriel.value.dateAcquisition) {
        currentMateriel.value.dateAcquisition = formatDate(currentMateriel.value.dateAcquisition, 'YYYY-MM-DD');
    }
  } else {
    // Initialiser un nouvel objet pour l'ajout
    currentMateriel.value = { 
        codeMat: '', 
        designationMat: '', 
        categorieMat: '', 
        qteTotDispo: 1, 
        qteActuelDispo: 1,
        tarifLocation: 0, 
        dateAcquisition: new Date().toISOString().split('T')[0] 
    };
  }

  materielModalInstance.show();
}


// --- Fonctions Utilitaire ---

const formatCurrency = (value) => {
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return '0,00';
    return value.toLocaleString('fr-MG', { minimumFractionDigits: 2 });
};

const formatDate = (datetime, format = 'DD/MM/YYYY') => {
    if (!datetime) return '';
    
    // Gère le cas où la date vient déjà d'une base de données (format ISO ou SQL)
    const date = new Date(datetime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    }
    return `${day}/${month}/${year}`;
};


</script>

<style scoped>
/* Les couleurs CEDII peuvent être réutilisées ici ou définies dans un fichier global */
.text-primary { color: #5B11EE !important; } /* cedii-text-primary */
.cedii-btn-primary {
    background-color: #5B11EE; /* cedii-primary-light */
    border-color: #5B11EE;
    color: white;
}
.cedii-btn-primary:hover {
    background-color: #0405BF; /* cedii-primary-dark */
    border-color: #0405BF;
}

.table-responsive {
    overflow-x: auto;
}

/* Style pour mettre en évidence les faibles stocks */
.text-danger.fw-bold {
    background-color: #fee;
    padding: 3px 6px;
    border-radius: 4px;
}
</style>