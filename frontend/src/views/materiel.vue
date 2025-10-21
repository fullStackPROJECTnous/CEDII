<template>
  <div class="materiel-management p-4">
    <h1 class="mb-4 text-primary"><i class="bi bi-tools me-2"></i> Gestion des Matériels</h1>

    <!-- Filtres et Recherche -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">État</label>
            <select v-model="filters.etatMat" class="form-select" @change="fetchMateriel">
              <option value="tous">Tous les états</option>
              <option value="Neuf">Neuf</option>
              <option value="Bon état">Bon état</option>
              <option value="Endommagé">Endommagé</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Hors-Service">Hors-Service</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Catégorie</label>
            <select v-model="filters.categorieMat" class="form-select" @change="fetchMateriel">
              <option value="toutes">Toutes les catégories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Recherche</label>
            <input type="text" v-model="filters.search" class="form-control" 
                   placeholder="Code, désignation..." @input="onSearchInput">
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" @click="resetFilters">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="d-flex justify-content-between mb-4">
      <button class="btn cedii-btn-primary" @click="openModal('add')">
        <i class="bi bi-plus-circle-fill me-2"></i> Ajouter un Matériel
      </button>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-info" @click="showStatistiques = !showStatistiques">
          <i class="bi bi-graph-up me-2"></i>Statistiques
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div v-if="showStatistiques" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title"><i class="bi bi-bar-chart me-2"></i>Statistiques des Matériels</h5>
        <div class="row text-center">
          <div class="col-md-3">
            <div class="stat-card">
              <h3 class="text-primary">{{ statistiques.total }}</h3>
              <small>Total Matériels</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <h3 class="text-success">{{ statistiques.disponibles }}</h3>
              <small>En Stock</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <h3 class="text-warning">{{ statistiques.enLocation }}</h3>
              <small>En Location</small>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <h3 class="text-danger">{{ statistiques.maintenance }}</h3>
              <small>En Maintenance</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'alerte -->
    <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
      {{ message }}
    </div>

    <!-- Tableau des matériels -->
    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Code</th>
                <th>Désignation</th>
                <th>Catégorie</th>
                <th>État</th>
                <th>Qté Totale</th>
                <th>Qté Stock</th>
                <th>Qté Location</th>
                <th>Tarifs (MGA)</th>
                <th>Acquisition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredMateriel.length === 0">
                <td colspan="10" class="text-center text-muted">Aucun matériel trouvé.</td>
              </tr>
              <tr v-for="mat in filteredMateriel" :key="mat.codeMat" 
                  :class="getRowClass(mat)">
                <td class="fw-bold">{{ mat.codeMat }}</td>
                <td>{{ mat.designationMat }}</td>
                <td>{{ mat.categorieMat || 'N/A' }}</td>
                <td>
                  <span :class="`badge bg-${getEtatBadgeClass(mat.etatMat)}`">
                    {{ mat.etatMat }}
                  </span>
                </td>
                <td>{{ mat.qteTotDispo }}</td>
                <td>
                  <span :class="{'text-danger fw-bold': mat.qteActuelStock <= 2}">
                    {{ mat.qteActuelStock }}
                  </span>
                </td>
                <td>
                  <span :class="{'text-warning fw-bold': mat.qteEnLocation > 0}">
                    {{ mat.qteEnLocation }}
                  </span>
                </td>
                <td>
                  <small class="d-block">Jour: {{ formatCurrency(mat.tarifJour) }}</small>
                  <small class="d-block">Demi-jour: {{ formatCurrency(mat.tarifDemiJournee) }}</small>
                  <small class="d-block">Heure: {{ formatCurrency(mat.tarifHeure) }}</small>
                </td>
                <td>{{ formatDate(mat.dateAcquisition) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" @click="openModal('edit', mat)"
                            title="Modifier">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-warning" @click="openHistorique(mat.codeMat)"
                            title="Historique">
                      <i class="bi bi-clock-history"></i>
                    </button>
                    <button class="btn btn-outline-secondary" @click="openEtatModal(mat)"
                            title="Changer état">
                      <i class="bi bi-gear"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="deleteMateriel(mat.codeMat)"
                            title="Supprimer">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Ajout/Modification -->
    <div class="modal fade" id="materielModal" tabindex="-1" aria-labelledby="materielModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <form @submit.prevent="saveMateriel">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="materielModalLabel">
                {{ isEditMode ? 'Modifier le Matériel' : 'Ajouter un Nouveau Matériel' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="designationMat" class="form-label">Désignation *</label>
                  <input type="text" id="designationMat" v-model="currentMateriel.designationMat" 
                         class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="categorieMat" class="form-label">Catégorie</label>
                  <input type="text" id="categorieMat" v-model="currentMateriel.categorieMat" 
                         class="form-control" list="categoriesList" />
                  <datalist id="categoriesList">
                    <option v-for="cat in categories" :key="cat" :value="cat"></option>
                  </datalist>
                </div>
              </div>

              <div class="mb-3">
                <label for="descriptionMat" class="form-label">Description</label>
                <textarea id="descriptionMat" v-model="currentMateriel.descriptionMat" 
                          class="form-control" rows="2"></textarea>
              </div>

              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="qteTotDispo" class="form-label">Quantité Totale *</label>
                  <input type="number" id="qteTotDispo" v-model.number="currentMateriel.qteTotDispo" 
                         class="form-control" required min="1" />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="qteActuelStock" class="form-label">Quantité en Stock *</label>
                  <input type="number" id="qteActuelStock" v-model.number="currentMateriel.qteActuelStock" 
                         class="form-control" required min="0" :max="currentMateriel.qteTotDispo" />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="qteMat" class="form-label">Quantité Matériel</label>
                  <input type="number" id="qteMat" v-model.number="currentMateriel.qteMat" 
                         class="form-control" min="0" />
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="etatMat" class="form-label">État *</label>
                  <select id="etatMat" v-model="currentMateriel.etatMat" class="form-select" required>
                    <option value="Neuf">Neuf</option>
                    <option value="Bon état">Bon état</option>
                    <option value="Endommagé">Endommagé</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Hors-Service">Hors-Service</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="dateAcquisition" class="form-label">Date d'Acquisition *</label>
                  <input type="date" id="dateAcquisition" v-model="currentMateriel.dateAcquisition" 
                         class="form-control" required />
                </div>
              </div>

              <h6 class="mt-4 mb-3 text-primary">Tarifs de Location (MGA)</h6>
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="tarifHeure" class="form-label">Par Heure *</label>
                  <input type="number" id="tarifHeure" v-model.number="currentMateriel.tarifHeure" 
                         class="form-control" required min="0" step="0.01" />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="tarifDemiJournee" class="form-label">Demi-Journée *</label>
                  <input type="number" id="tarifDemiJournee" v-model.number="currentMateriel.tarifDemiJournee" 
                         class="form-control" required min="0" step="0.01" />
                </div>
                <div class="col-md-4 mb-3">
                  <label for="tarifJour" class="form-label">Par Jour *</label>
                  <input type="number" id="tarifJour" v-model.number="currentMateriel.tarifJour" 
                         class="form-control" required min="0" step="0.01" />
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="btn cedii-btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditMode ? 'Sauvegarder' : 'Ajouter' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Historique -->
    <div class="modal fade" id="historiqueModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Historique d'Emprunt - {{ currentMateriel?.codeMat }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="historiqueLoading" class="text-center">
              <div class="spinner-border text-primary"></div>
            </div>
            <div v-else>
              <div v-if="historiqueEmprunt.length === 0" class="text-center text-muted">
                Aucun historique d'emprunt pour ce matériel.
              </div>
              <div v-else class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Réservation</th>
                      <th>Date Début</th>
                      <th>Date Fin</th>
                      <th>Date Retour</th>
                      <th>Retard</th>
                      <th>Frais Retard</th>
                      <th>État</th>
                      <th>Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="hist in historiqueEmprunt" :key="hist.idHistorique">
                      <td>#{{ hist.idRes }}</td>
                      <td>{{ formatDateTime(hist.debLo) }}</td>
                      <td>{{ formatDateTime(hist.finLo) }}</td>
                      <td>{{ hist.dateRetourReelle ? formatDateTime(hist.dateRetourReelle) : 'Non retourné' }}</td>
                      <td>
                        <span v-if="hist.dureeRetardHeures > 0" class="badge bg-danger">
                          {{ hist.dureeRetardHeures }}h
                        </span>
                        <span v-else class="badge bg-success">À l'heure</span>
                      </td>
                      <td>{{ formatCurrency(hist.fraisRetard) }}</td>
                      <td>
                        <span :class="`badge bg-${getEtatBadgeClass(hist.etatDebut)}`">
                          {{ hist.etatDebut }}
                        </span>
                      </td>
                      <td>{{ hist.Reservation?.Client?.nomCli }} {{ hist.Reservation?.Client?.prenomCli }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Changement d'État -->
    <div class="modal fade" id="etatModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form @submit.prevent="updateEtatMateriel">
          <div class="modal-content">
            <div class="modal-header bg-warning text-dark">
              <h5 class="modal-title">Changer l'État - {{ currentMateriel?.codeMat }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nouvel État *</label>
                <select v-model="etatData.etatMat" class="form-select" required>
                  <option value="Neuf">Neuf</option>
                  <option value="Bon état">Bon état</option>
                  <option value="Endommagé">Endommagé</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Hors-Service">Hors-Service</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Notes (optionnel)</label>
                <textarea v-model="etatData.notes" class="form-control" rows="3" 
                          placeholder="Raison du changement d'état..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="btn btn-warning">Mettre à jour l'état</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MaterielService from '../services/MaterielService';
import * as bootstrap from 'bootstrap';

// États
const materiels = ref([]);
const currentMateriel = ref({});
const historiqueEmprunt = ref([]);
const isEditMode = ref(false);
const isLoading = ref(false);
const historiqueLoading = ref(false);
const message = ref('');
const isError = ref(false);
const showStatistiques = ref(false);
const categories = ref([]);

// Filtres - CORRIGÉ avec les bons noms de colonnes
const filters = ref({
  etatMat: 'tous',
  categorieMat: 'toutes',
  search: ''
});

// Données pour changement d'état
const etatData = ref({
  etatMat: '',
  notes: ''
});

// Statistiques
const statistiques = ref({
  total: 0,
  disponibles: 0,
  enLocation: 0,
  maintenance: 0
});

// Instances des modaux
let materielModalInstance = null;
let historiqueModalInstance = null;
let etatModalInstance = null;

// Propriétés calculées
const filteredMateriel = computed(() => {
  return materiels.value;
});

// Cycle de vie
onMounted(() => {
  fetchMateriel();
  initModals();
});

// Initialisation des modaux Bootstrap
function initModals() {
  materielModalInstance = new bootstrap.Modal(document.getElementById('materielModal'));
  historiqueModalInstance = new bootstrap.Modal(document.getElementById('historiqueModal'));
  etatModalInstance = new bootstrap.Modal(document.getElementById('etatModal'));
}

// Fonctions principales
async function fetchMateriel() {
  try {
    const response = await MaterielService.getAllMateriel(filters.value);
    materiels.value = response.data;
    updateCategories();
    updateStatistiques();
  } catch (error) {
    showError("Erreur de chargement du matériel: " + (error.response?.data?.message || error.message));
  }
}

async function saveMateriel() {
  isLoading.value = true;
  try {
    if (isEditMode.value) {
      await MaterielService.updateMateriel(currentMateriel.value.codeMat, currentMateriel.value);
      showSuccess('Matériel modifié avec succès');
    } else {
      // Pour l'ajout, le codeMat est généré automatiquement par le trigger SQL
      // On envoie les données sans codeMat
      const { codeMat, ...materielData } = currentMateriel.value;
      await MaterielService.createMateriel(materielData);
      showSuccess('Matériel ajouté avec succès');
    }
    await fetchMateriel();
    materielModalInstance.hide();
  } catch (error) {
    showError("Erreur de sauvegarde: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function deleteMateriel(codeMat) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le matériel ${codeMat} ?`)) return;
  
  try {
    await MaterielService.deleteMateriel(codeMat);
    showSuccess('Matériel supprimé avec succès');
    await fetchMateriel();
  } catch (error) {
    showError("Erreur de suppression: " + (error.response?.data?.message || error.message));
  }
}

async function openHistorique(codeMat) {
  historiqueLoading.value = true;
  try {
    const response = await MaterielService.getHistoriqueEmprunt(codeMat);
    historiqueEmprunt.value = response.data;
    historiqueModalInstance.show();
  } catch (error) {
    showError("Erreur de chargement de l'historique: " + (error.response?.data?.message || error.message));
  } finally {
    historiqueLoading.value = false;
  }
}

async function updateEtatMateriel() {
  try {
    await MaterielService.updateEtatMateriel(currentMateriel.value.codeMat, etatData.value);
    showSuccess('État mis à jour avec succès');
    await fetchMateriel();
    etatModalInstance.hide();
  } catch (error) {
    showError("Erreur de mise à jour de l'état: " + (error.response?.data?.message || error.message));
  }
}

// Fonctions d'interface
function openModal(mode, materielData = null) {
  isEditMode.value = mode === 'edit';
  
  if (isEditMode.value && materielData) {
    currentMateriel.value = { ...materielData };
    // Formater la date pour l'input
    if (currentMateriel.value.dateAcquisition) {
      currentMateriel.value.dateAcquisition = formatDateForInput(currentMateriel.value.dateAcquisition);
    }
  } else {
    currentMateriel.value = {
      designationMat: '',
      categorieMat: '',
      descriptionMat: '',
      qteTotDispo: 1,
      qteActuelStock: 1,
      qteEnLocation: 0,
      qteMat: 1,
      tarifHeure: 0,
      tarifDemiJournee: 0,
      tarifJour: 0,
      etatMat: 'Bon état',
      dateAcquisition: new Date().toISOString().split('T')[0]
    };
  }
  
  materielModalInstance.show();
}

function openEtatModal(materiel) {
  currentMateriel.value = { ...materiel };
  etatData.value = {
    etatMat: materiel.etatMat,
    notes: ''
  };
  etatModalInstance.show();
}

function resetFilters() {
  filters.value = { etatMat: 'tous', categorieMat: 'toutes', search: '' };
  fetchMateriel();
}

function onSearchInput() {
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    fetchMateriel();
  }, 500);
}

// Fonctions utilitaires
function updateCategories() {
  const uniqueCategories = [...new Set(materiels.value.map(mat => mat.categorieMat).filter(Boolean))];
  categories.value = uniqueCategories;
}

function updateStatistiques() {
  const stats = {
    total: materiels.value.length,
    disponibles: materiels.value.filter(mat => 
      mat.etatMat === 'Bon état' && mat.qteActuelStock > 0).length,
    enLocation: materiels.value.reduce((sum, mat) => sum + (mat.qteEnLocation || 0), 0),
    maintenance: materiels.value.filter(mat => 
      ['Maintenance', 'Endommagé', 'Hors-Service'].includes(mat.etatMat)).length
  };
  statistiques.value = stats;
}

function getEtatBadgeClass(etat) {
  const classes = {
    'Neuf': 'success',
    'Bon état': 'primary',
    'Endommagé': 'warning',
    'Maintenance': 'info',
    'Hors-Service': 'danger'
  };
  return classes[etat] || 'secondary';
}

function getRowClass(mat) {
  if (mat.etatMat === 'Hors-Service') return 'table-danger';
  if (mat.etatMat === 'Maintenance') return 'table-warning';
  if (mat.etatMat === 'Endommagé') return 'table-info';
  if (mat.qteActuelStock <= 2) return 'table-danger';
  return '';
}

function showSuccess(msg) {
  message.value = msg;
  isError.value = false;
  setTimeout(() => message.value = '', 3000);
}

function showError(msg) {
  message.value = msg;
  isError.value = true;
  setTimeout(() => message.value = '', 5000);
}

const formatCurrency = (value) => {
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0,00';
  return value.toLocaleString('fr-MG', { minimumFractionDigits: 2 });
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateForInput = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  return date.toISOString().split('T')[0];
};

const formatDateTime = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  return date.toLocaleString('fr-FR');
};
</script>

<style scoped>
.text-primary { color: #5B11EE !important; }

.cedii-btn-primary {
  background-color: #5B11EE;
  border-color: #5B11EE;
  color: white;
}

.cedii-btn-primary:hover {
  background-color: #0405BF;
  border-color: #0405BF;
}

.stat-card {
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.stat-card h3 {
  margin: 0;
  font-weight: bold;
}

.table-responsive {
  overflow-x: auto;
}

.text-danger.fw-bold {
  background-color: #fee;
  padding: 3px 6px;
  border-radius: 4px;
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
}
</style>