<template>
  <div class="materiel-management p-3">
    <h1 class="h4 mb-3 text-primary"><i class="bi bi-tools me-2"></i> Gestion des Matériels</h1>

    <!-- Filtres et Recherche -->
    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="row g-2 align-items-end">
          <div class="col-md-3">
            <label class="form-label small mb-1">État</label>
            <select v-model="filters.etatMat" class="form-select form-select-sm">
              <option value="tous">Tous</option>
              <option value="Neuf">Neuf</option>
              <option value="Bon état">Bon état</option>
              <option value="Endommagé">Endommagé</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Hors-Service">Hors-Service</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small mb-1">Catégorie</label>
            <select v-model="filters.categorieMat" class="form-select form-select-sm">
              <option value="toutes">Toutes</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small mb-1">Recherche</label>
            <input type="text" v-model="filters.search" class="form-control form-control-sm" 
                   placeholder="Code, désignation...">
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilters">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="d-flex justify-content-between mb-3">
      <button class="btn cedii-btn-primary btn-sm" @click="openModal('add')">
        <i class="bi bi-plus-circle me-1"></i> Ajouter
      </button>
      <div class="d-flex gap-1">
        <button class="btn btn-outline-info btn-sm" @click="showStatistiques = !showStatistiques">
          <i class="bi bi-graph-up me-1"></i>Stats
        </button>
      </div>
    </div>

    <!-- Statistiques -->
    <div v-if="showStatistiques" class="card mb-3">
      <div class="card-body py-2">
        <h6 class="card-title mb-2"><i class="bi bi-bar-chart me-1"></i>Statistiques</h6>
        <div class="row text-center g-1">
          <div class="col-3">
            <div class="stat-card p-1">
              <h6 class="text-primary mb-0">{{ statistiques.total }}</h6>
              <small class="text-muted">Total</small>
            </div>
          </div>
          <div class="col-3">
            <div class="stat-card p-1">
              <h6 class="text-success mb-0">{{ statistiques.disponibles }}</h6>
              <small class="text-muted">En Stock</small>
            </div>
          </div>
          <div class="col-3">
            <div class="stat-card p-1">
              <h6 class="text-warning mb-0">{{ statistiques.enLocation }}</h6>
              <small class="text-muted">En Location</small>
            </div>
          </div>
          <div class="col-3">
            <div class="stat-card p-1">
              <h6 class="text-danger mb-0">{{ statistiques.maintenance }}</h6>
              <small class="text-muted">Maintenance</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'alerte -->
    <div v-if="message" :class="['alert', 'py-2', isError ? 'alert-danger' : 'alert-success']">
      <small>{{ message }}</small>
    </div>

    <!-- Tableau des matériels AVEC SCROLL -->
    <div class="card shadow-sm">
      <div class="card-body p-2">
        <div class="table-container">
          <table class="table table-sm table-striped table-hover mb-0">
            <thead class="sticky-top bg-light">
              <tr>
                <th class="py-1">Code</th>
                <th class="py-1">Désignation</th>
                <th class="py-1">Catégorie</th>
                <th class="py-1">État</th>
                <th class="py-1">Qté T</th>
                <th class="py-1">Qté S</th>
                <th class="py-1">Qté L</th>
                <th class="py-1">Tarifs</th>
                <th class="py-1">Acquisition</th>
                <th class="py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredMateriel.length === 0">
                <td colspan="10" class="text-center text-muted py-2">Aucun matériel trouvé.</td>
              </tr>
              <tr v-for="mat in filteredMateriel" :key="mat.codeMat" 
                  :class="getRowClass(mat)" class="small">
                <td class="fw-bold">{{ mat.codeMat }}</td>
                <td>{{ mat.designationMat }}</td>
                <td>{{ mat.categorieMat || '-' }}</td>
                <td>
                  <span :class="`badge bg-${getEtatBadgeClass(mat.etatMat)}`">
                    {{ getEtatShort(mat.etatMat) }}
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
                  <small class="d-block">J: {{ formatCurrency(mat.tarifJour) }}</small>
                  <small class="d-block">½J: {{ formatCurrency(mat.tarifDemiJournee) }}</small>
                  <small class="d-block">H: {{ formatCurrency(mat.tarifHeure) }}</small>
                </td>
                <td>{{ formatDate(mat.dateAcquisition) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info btn-sm" @click="openModal('edit', mat)"
                            title="Modifier">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" @click="openHistorique(mat.codeMat)"
                            title="Historique">
                      <i class="bi bi-clock-history"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="openEtatModal(mat)"
                            title="Changer état">
                      <i class="bi bi-gear"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" @click="deleteMateriel(mat.codeMat)"
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
            <div class="modal-header bg-primary text-white py-2">
              <h6 class="modal-title" id="materielModalLabel">
                {{ isEditMode ? 'Modifier le Matériel' : 'Ajouter un Matériel' }}
              </h6>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body modal-scroll">
              
              <!-- Informations de base -->
              <div class="row g-3 align-items-center">
                <div class="col-md-3">
                  <label for="designationMat" class="col-form-label small fw-medium">Désignation *</label>
                </div>
                <div class="col-md-9">
                  <input type="text" id="designationMat" v-model="currentMateriel.designationMat" 
                         class="form-control form-control-sm" required />
                </div>
              </div>

              <div class="row g-3 align-items-center mt-2">
                <div class="col-md-3">
                  <label for="categorieMat" class="col-form-label small fw-medium">Catégorie</label>
                </div>
                <div class="col-md-9">
                  <input type="text" id="categorieMat" v-model="currentMateriel.categorieMat" 
                         class="form-control form-control-sm" list="categoriesList" />
                  <datalist id="categoriesList">
                    <option v-for="cat in categories" :key="cat" :value="cat"></option>
                  </datalist>
                </div>
              </div>

              <div class="row g-3 align-items-start mt-2">
                <div class="col-md-3">
                  <label for="descriptionMat" class="col-form-label small fw-medium">Description</label>
                </div>
                <div class="col-md-9">
                  <textarea id="descriptionMat" v-model="currentMateriel.descriptionMat" 
                            class="form-control form-control-sm" rows="2"></textarea>
                </div>
              </div>

              <!-- Quantités - SECTION MODIFIÉE -->
              <h6 class="mt-4 mb-3 text-primary small fw-bold">Gestion des Quantités</h6>
              
              <div class="row g-3 align-items-center">
                <div class="col-md-4 mb-2">
                  <label for="qteActuelStock" class="form-label small fw-medium">Quantité en Stock *</label>
                  <input type="number" id="qteActuelStock" v-model.number="currentMateriel.qteActuelStock" 
                         class="form-control form-control-sm" required min="1" @input="onQuantityInput" />
                </div>
                <div class="col-md-4 mb-2">
                  <label for="qteEnLocation" class="form-label small fw-medium">Quantité en Location *</label>
                  <input type="number" id="qteEnLocation" v-model.number="currentMateriel.qteEnLocation" 
                         class="form-control form-control-sm" required min="0" @input="onQuantityInput" 
                         :max="currentMateriel.qteActuelStock" />
                </div>
                <div class="col-md-4 mb-2">
                  <label for="qteTotDispo" class="form-label small fw-medium">Quantité Totale Disponible *</label>
                  <input type="number" id="qteTotDispo" v-model.number="currentMateriel.qteTotDispo" 
                         class="form-control form-control-sm bg-light" disabled />
                </div>
              </div>

              <div class="alert alert-info py-1 small mt-2" v-if="quantityWarning">
                <i class="bi bi-info-circle me-1"></i>{{ quantityWarning }}
              </div>

              <!-- État et Date -->
              <div class="row g-3 align-items-center mt-2">
                <div class="col-md-3">
                  <label for="etatMat" class="col-form-label small fw-medium">État *</label>
                </div>
                <div class="col-md-3">
                  <select id="etatMat" v-model="currentMateriel.etatMat" class="form-select form-select-sm" required>
                    <option value="Neuf">Neuf</option>
                    <option value="Bon état">Bon état</option>
                    <option value="Endommagé">Endommagé</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Hors-Service">Hors-Service</option>
                  </select>
                </div>
                
                <div class="col-md-3">
                  <label for="dateAcquisition" class="col-form-label small fw-medium">Date Acquisition *</label>
                </div>
                <div class="col-md-3">
                  <input type="date" id="dateAcquisition" v-model="currentMateriel.dateAcquisition" 
                         class="form-control form-control-sm" required />
                </div>
              </div>

              <!-- Tarifs de Location -->
              <h6 class="mt-4 mb-3 text-primary small fw-bold">Tarifs de Location (MGA)</h6>
              
              <div class="row g-3 align-items-center">
                <div class="col-md-3">
                  <label for="tarifHeure" class="col-form-label small fw-medium">Par Heure *</label>
                </div>
                <div class="col-md-3">
                  <input type="number" id="tarifHeure" v-model.number="currentMateriel.tarifHeure" 
                         class="form-control form-control-sm" required min="0" step="0.01" />
                </div>
                
                <div class="col-md-3">
                  <label for="tarifDemiJournee" class="col-form-label small fw-medium">Demi-Journée *</label>
                </div>
                <div class="col-md-3">
                  <input type="number" id="tarifDemiJournee" v-model.number="currentMateriel.tarifDemiJournee" 
                         class="form-control form-control-sm" required min="0" step="0.01" />
                </div>
              </div>

              <div class="row g-3 align-items-center mt-2">
                <div class="col-md-3">
                  <label for="tarifJour" class="col-form-label small fw-medium">Par Jour *</label>
                </div>
                <div class="col-md-3">
                  <input type="number" id="tarifJour" v-model.number="currentMateriel.tarifJour" 
                         class="form-control form-control-sm" required min="0" step="0.01" />
                </div>
              </div>

            </div>
            <div class="modal-footer py-2">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Annuler</button>
             <button type="submit" class="btn cedii-btn-primary btn-sm" :disabled="isLoading || hasQuantityError">
  <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
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
          <div class="modal-header bg-info text-white py-2">
            <h6 class="modal-title">Historique - {{ currentMateriel?.codeMat }}</h6>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body modal-scroll">
            <div v-if="historiqueLoading" class="text-center">
              <div class="spinner-border spinner-border-sm text-primary"></div>
            </div>
            <div v-else>
              <div v-if="historiqueEmprunt.length === 0" class="text-center text-muted">
                Aucun historique d'emprunt.
              </div>
              <div v-else class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th class="small">Réservation</th>
                      <th class="small">Date Début</th>
                      <th class="small">Date Fin</th>
                      <th class="small">Date Retour</th>
                      <th class="small">Retard</th>
                      <th class="small">Frais</th>
                      <th class="small">État</th>
                      <th class="small">Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="hist in historiqueEmprunt" :key="hist.idHistorique" class="small">
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
                          {{ getEtatShort(hist.etatDebut) }}
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
            <div class="modal-header bg-warning text-dark py-2">
              <h6 class="modal-title">Changer État - {{ currentMateriel?.codeMat }}</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-2">
                <label class="form-label small">Nouvel État *</label>
                <select v-model="etatData.etatMat" class="form-select form-select-sm" required>
                  <option value="Neuf">Neuf</option>
                  <option value="Bon état">Bon état</option>
                  <option value="Endommagé">Endommagé</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Hors-Service">Hors-Service</option>
                </select>
              </div>
              <div class="mb-2">
                <label class="form-label small">Notes (optionnel)</label>
                <textarea v-model="etatData.notes" class="form-control form-control-sm" rows="2" 
                          placeholder="Raison du changement d'état..."></textarea>
              </div>
            </div>
            <div class="modal-footer py-2">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="btn btn-warning btn-sm">Mettre à jour</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
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
const quantityWarning = ref('');
const hasQuantityError = ref(false); // NOUVEAU: pour distinguer avertissement et erreur

// Filtres
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

// Propriétés calculées - CORRIGÉE
const filteredMateriel = computed(() => {
  // Vérification que materiels.value existe et est un tableau
  if (!materiels.value || !Array.isArray(materiels.value)) {
    return [];
  }

  let filtered = [...materiels.value];

  // Filtre par état
  if (filters.value.etatMat !== 'tous') {
    filtered = filtered.filter(mat => mat.etatMat === filters.value.etatMat);
  }

  // Filtre par catégorie
  if (filters.value.categorieMat !== 'toutes') {
    filtered = filtered.filter(mat => mat.categorieMat === filters.value.categorieMat);
  }

  // Filtre par recherche
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase();
    filtered = filtered.filter(mat => 
      (mat.codeMat && mat.codeMat.toLowerCase().includes(searchLower)) ||
      (mat.designationMat && mat.designationMat.toLowerCase().includes(searchLower)) ||
      (mat.categorieMat && mat.categorieMat.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
});

// Cycle de vie
onMounted(() => {
  fetchMateriel();
  initModals();
});

// Watcher pour les filtres
watch(filters, () => {
  updateStatistiques();
}, { deep: true });

// Initialisation des modaux Bootstrap - CORRIGÉE
function initModals() {
  const materielModalEl = document.getElementById('materielModal');
  const historiqueModalEl = document.getElementById('historiqueModal');
  const etatModalEl = document.getElementById('etatModal');
  
  if (materielModalEl) {
    materielModalInstance = new bootstrap.Modal(materielModalEl);
  }
  if (historiqueModalEl) {
    historiqueModalInstance = new bootstrap.Modal(historiqueModalEl);
  }
  if (etatModalEl) {
    etatModalInstance = new bootstrap.Modal(etatModalEl);
  }
}

// Fonctions principales - CORRIGÉES
async function fetchMateriel() {
  try {
    isLoading.value = true;
    const response = await MaterielService.getAllMateriel();
    // S'assurer que nous avons bien un tableau
    materiels.value = Array.isArray(response) ? response : (response.data || []);
    updateCategories();
    updateStatistiques();
  } catch (error) {
    console.error("Erreur de chargement du matériel:", error);
    materiels.value = []; // Toujours définir comme tableau vide
    showError("Erreur de chargement du matériel: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function saveMateriel() {
  // Validation des quantités avant sauvegarde - CORRIGÉ
  if (hasQuantityError.value) {
    showError("Veuillez corriger les erreurs de quantité avant de sauvegarder");
    return;
  }

  isLoading.value = true;
  try {
    if (isEditMode.value) {
      await MaterielService.updateMateriel(currentMateriel.value.codeMat, currentMateriel.value);
      showSuccess('Matériel modifié avec succès');
    } else {
      // Pour l'ajout, le codeMat est généré automatiquement par le trigger SQL
      const { codeMat, ...materielData } = currentMateriel.value;
      await MaterielService.createMateriel(materielData);
      showSuccess('Matériel ajouté avec succès');
    }
    await fetchMateriel();
    if (materielModalInstance) {
      materielModalInstance.hide();
    }
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
    historiqueEmprunt.value = response.data || [];
    if (historiqueModalInstance) {
      historiqueModalInstance.show();
    }
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
    if (etatModalInstance) {
      etatModalInstance.hide();
    }
  } catch (error) {
    showError("Erreur de mise à jour de l'état: " + (error.response?.data?.message || error.message));
  }
}

// NOUVELLES FONCTIONS POUR LA GESTION DES QUANTITÉS - CORRIGÉES

// Met à jour qteTotDispo (Disponible) en fonction des deux autres
function updateQteTotDispo() {
  const qteActuelStock = Number(currentMateriel.value.qteActuelStock) || 0;
  const qteEnLocation = Number(currentMateriel.value.qteEnLocation) || 0;

  // Logique: Disponible = Stock Total - En Location
  const qteTotDispo = qteActuelStock - qteEnLocation;
  
  // Protection contre les erreurs
  if (qteTotDispo < 0) {
    currentMateriel.value.qteTotDispo = 0;
    quantityWarning.value = 'Attention: La quantité en location ne peut pas dépasser le stock total';
    hasQuantityError.value = true; // C'est une erreur bloquante
  } else {
    currentMateriel.value.qteTotDispo = qteTotDispo;
    quantityWarning.value = '';
    hasQuantityError.value = false;
  }

  // Validation supplémentaire
  validateQuantities();
}

// Déclencher le calcul lors de l'édition des champs dépendants
const onQuantityInput = () => {
  updateQteTotDispo();
};

// Validation des quantités - CORRIGÉE
function validateQuantities() {
  const stock = Number(currentMateriel.value.qteActuelStock) || 0;
  const location = Number(currentMateriel.value.qteEnLocation) || 0;
  const disponible = Number(currentMateriel.value.qteTotDispo) || 0;

  // Réinitialiser l'état d'erreur
  hasQuantityError.value = false;

  if (location > stock) {
    quantityWarning.value = 'Erreur: La quantité en location ne peut pas dépasser le stock total';
    hasQuantityError.value = true;
    return false;
  }

  // Cette validation est maintenant plus permissive - elle vérifie mais ne bloque pas
  if (stock !== (disponible + location)) {
    quantityWarning.value = 'Attention: Incohérence détectée dans les quantités';
    // Ce n'est plus une erreur bloquante, juste un avertissement
    hasQuantityError.value = false;
    return true; // Permet la sauvegarde
  }

  if (stock < 1) {
    quantityWarning.value = 'Erreur: Le stock total doit être au moins de 1';
    hasQuantityError.value = true;
    return false;
  }

  quantityWarning.value = '';
  hasQuantityError.value = false;
  return true;
}

// Fonctions d'interface - CORRIGÉES
function openModal(mode, materielData = null) {
  isEditMode.value = mode === 'edit';
  hasQuantityError.value = false; // Réinitialiser l'état d'erreur
  
  if (isEditMode.value && materielData) {
    currentMateriel.value = { ...materielData };
    // Formater la date pour l'input
    if (currentMateriel.value.dateAcquisition) {
      currentMateriel.value.dateAcquisition = formatDateForInput(currentMateriel.value.dateAcquisition);
    }
    // S'assurer que les quantités sont cohérentes
    updateQteTotDispo();
  } else {
    currentMateriel.value = {
      designationMat: '',
      categorieMat: '',
      descriptionMat: '',
      qteTotDispo: 1,
      qteActuelStock: 1,
      qteEnLocation: 0,
      tarifHeure: 0,
      tarifDemiJournee: 0,
      tarifJour: 0,
      etatMat: 'Bon état',
      dateAcquisition: new Date().toISOString().split('T')[0]
    };
    quantityWarning.value = '';
    hasQuantityError.value = false;
  }
  
  if (materielModalInstance) {
    materielModalInstance.show();
  }
}

function openEtatModal(materiel) {
  currentMateriel.value = { ...materiel };
  etatData.value = {
    etatMat: materiel.etatMat,
    notes: ''
  };
  if (etatModalInstance) {
    etatModalInstance.show();
  }
}

function resetFilters() {
  filters.value = { etatMat: 'tous', categorieMat: 'toutes', search: '' };
}

// Fonctions utilitaires - CORRIGÉES
function updateCategories() {
  if (!materiels.value || !Array.isArray(materiels.value)) {
    categories.value = [];
    return;
  }
  const uniqueCategories = [...new Set(materiels.value.map(mat => mat.categorieMat).filter(Boolean))];
  categories.value = uniqueCategories;
}

function updateStatistiques() {
  const filtered = filteredMateriel.value;
  const stats = {
    total: filtered.length,
    disponibles: filtered.filter(mat => 
      mat.etatMat === 'Bon état' && mat.qteActuelStock > 0).length,
    enLocation: filtered.reduce((sum, mat) => sum + (mat.qteEnLocation || 0), 0),
    maintenance: filtered.filter(mat => 
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

function getEtatShort(etat) {
  const shorts = {
    'Neuf': 'Neuf',
    'Bon état': 'Bon',
    'Endommagé': 'Endom.',
    'Maintenance': 'Maint.',
    'Hors-Service': 'H.S.'
  };
  return shorts[etat] || etat;
}

function getRowClass(mat) {
  if (!mat) return '';
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
  if (value === null || value === undefined) return '0 Ar';
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0 Ar';
  return new Intl.NumberFormat('fr-MG', { 
    minimumFractionDigits: 0 
  }).format(value) + ' Ar';
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  try {
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '';
  }
};

const formatDateForInput = (datetime) => {
  if (!datetime) return '';
  try {
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

const formatDateTime = (datetime) => {
  if (!datetime) return '';
  try {
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '';
  }
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

.cedii-btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

.stat-card {
  border-radius: 6px;
  background-color: #f8f9fa;
}

/* Styles pour le tableau avec scroll */
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}

.table-container thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #dee2e6;
  background-color: #f8f9fa;
}

/* Styles pour les modaux avec scroll */
.modal-scroll {
  max-height: 60vh;
  overflow-y: auto;
}

.text-danger.fw-bold {
  background-color: #fee;
  padding: 2px 4px;
  border-radius: 3px;
}

.btn-group-sm > .btn {
  padding: 0.2rem 0.4rem;
}

/* Scrollbar personnalisée */
.table-container::-webkit-scrollbar,
.modal-scroll::-webkit-scrollbar {
  width: 6px;
}

.table-container::-webkit-scrollbar-track,
.modal-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb,
.modal-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover,
.modal-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Amélioration du responsive */
@media (max-width: 768px) {
  .materiel-management {
    padding: 0.5rem !important;
  }
  .card-body {
    padding: 0.5rem !important;
  }
  .table-container {
    font-size: 0.8rem;
  }
}

/* Style pour le champ désactivé */
.bg-light:disabled {
  background-color: #e9ecef !important;
  opacity: 1;
}
</style>