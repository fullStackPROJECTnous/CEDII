<template>
    <div class="materiel-bureau-management p-4">
        <!-- En-tête -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 text-primary">
                <i class="bi bi-laptop me-2"></i>Gestion du Matériel de Bureau
            </h1>
            <button class="btn cedii-btn-primary" @click="openModal('add')">
                <i class="bi bi-plus-circle me-2"></i>Nouveau Matériel
            </button>
        </div>

        <!-- Filtres -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Statut</label>
                        <select v-model="filters.statut" class="form-select" @change="fetchMateriels">
                            <option value="">Tous les statuts</option>
                            <option value="En service">En service</option>
                            <option value="En panne">En panne</option>
                            <option value="En maintenance">En maintenance</option>
                            <option value="Hors service">Hors service</option>
                            <option value="En stock">En stock</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Type</label>
                        <select v-model="filters.type" class="form-select" @change="fetchMateriels">
                            <option value="">Tous les types</option>
                            <option value="Ordinateur portable">Ordinateur portable</option>
                            <option value="Ordinateur fixe">Ordinateur fixe</option>
                            <option value="Écran">Écran</option>
                            <option value="Imprimante">Imprimante</option>
                            <option value="Téléphone">Téléphone</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Recherche</label>
                        <input type="text" v-model="filters.search" class="form-control" 
                               placeholder="Code, modèle, utilisateur..." @input="onSearchInput">
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Alertes -->
        <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
            {{ message }}
        </div>

        <!-- Statistiques -->
        <div class="row mb-4">
            <div class="col-md-2" v-for="stat in statistiques" :key="stat.label">
                <div class="card stat-card" :class="stat.class">
                    <div class="card-body text-center">
                        <h4 class="card-title">{{ stat.value }}</h4>
                        <p class="card-text small">{{ stat.label }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tableau -->
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Type</th>
                                <th>Modèle</th>
                                <th>Utilisateur</th>
                                <th>Statut</th>
                                <th>Date Acquisition</th>
                                <th>Garantie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredMateriels.length === 0">
                                <td colspan="8" class="text-center text-muted">
                                    Aucun matériel trouvé
                                </td>
                            </tr>
                            <tr v-for="materiel in filteredMateriels" :key="materiel.code"
                                :class="getRowClass(materiel)">
                                <td class="fw-bold">{{ materiel.code }}</td>
                                <td>{{ materiel.type }}</td>
                                <td>{{ materiel.marque }} {{ materiel.modele }}</td>
                                <td>
                                    <span v-if="materiel.utilisateur" class="badge bg-info">
                                        {{ materiel.utilisateur }}
                                    </span>
                                    <span v-else class="text-muted">Non assigné</span>
                                </td>
                                <td>
                                    <span :class="getStatusClass(materiel.statut)">
                                        {{ materiel.statut }}
                                    </span>
                                </td>
                                <td>{{ formatDate(materiel.dateAcquisition) }}</td>
                                <td>
                                    <span :class="getGarantieClass(materiel.dateFinGarantie)">
                                        {{ formatDate(materiel.dateFinGarantie) }}
                                        <span v-if="isGarantieExpiree(materiel.dateFinGarantie)" 
                                              class="badge bg-danger ms-1">Expirée</span>
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-info" @click="openModal('edit', materiel)"
                                                title="Modifier">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-warning" @click="openAssignationModal(materiel)"
                                                title="Assigner">
                                            <i class="bi bi-person"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" @click="deleteMateriel(materiel.code)"
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
        <div class="modal fade" id="materielModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <form @submit.prevent="saveMateriel">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                {{ isEditMode ? 'Modifier le Matériel' : 'Nouveau Matériel' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Code *</label>
                                    <input type="text" v-model="currentMateriel.code" class="form-control" required
                                           :readonly="isEditMode">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Type *</label>
                                    <select v-model="currentMateriel.type" class="form-select" required>
                                        <option value="">Sélectionner...</option>
                                        <option value="Ordinateur portable">Ordinateur portable</option>
                                        <option value="Ordinateur fixe">Ordinateur fixe</option>
                                        <option value="Écran">Écran</option>
                                        <option value="Imprimante">Imprimante</option>
                                        <option value="Téléphone">Téléphone</option>
                                        <option value="Tablette">Tablette</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Marque</label>
                                    <input type="text" v-model="currentMateriel.marque" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Modèle *</label>
                                    <input type="text" v-model="currentMateriel.modele" class="form-control" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Numéro de série</label>
                                    <input type="text" v-model="currentMateriel.numeroSerie" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fournisseur</label>
                                    <input type="text" v-model="currentMateriel.fournisseur" class="form-control">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Date d'acquisition *</label>
                                    <input type="date" v-model="currentMateriel.dateAcquisition" class="form-control" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Fin de garantie</label>
                                    <input type="date" v-model="currentMateriel.dateFinGarantie" class="form-control">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Prix d'achat (MGA)</label>
                                    <input type="number" v-model="currentMateriel.prixAchat" class="form-control" step="0.01">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Utilisateur</label>
                                    <input type="text" v-model="currentMateriel.utilisateur" class="form-control"
                                           placeholder="Nom de l'utilisateur">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Département</label>
                                    <input type="text" v-model="currentMateriel.departement" class="form-control">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Statut *</label>
                                    <select v-model="currentMateriel.statut" class="form-select" required>
                                        <option value="En stock">En stock</option>
                                        <option value="En service">En service</option>
                                        <option value="En maintenance">En maintenance</option>
                                        <option value="En panne">En panne</option>
                                        <option value="Hors service">Hors service</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Emplacement</label>
                                    <input type="text" v-model="currentMateriel.emplacement" class="form-control">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea v-model="currentMateriel.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn cedii-btn-primary" :disabled="isLoading">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ isEditMode ? 'Modifier' : 'Créer' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal d'assignation -->
        <div class="modal fade" id="assignationModal" tabindex="-1">
            <div class="modal-dialog">
                <form @submit.prevent="assignerUtilisateur">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">Assigner le matériel</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>{{ currentMateriel.code }}</strong> - {{ currentMateriel.marque }} {{ currentMateriel.modele }}</p>
                            <div class="mb-3">
                                <label class="form-label">Assigner à</label>
                                <input type="text" v-model="assignationData.utilisateur" class="form-control"
                                       placeholder="Nom de l'utilisateur">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Département</label>
                                <input type="text" v-model="assignationData.departement" class="form-control">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn btn-warning">Assigner</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MaterielBureauService from '../services/MaterielBureau';
import * as bootstrap from 'bootstrap';

// États
const materiels = ref([]);
const currentMateriel = ref({});
const assignationData = ref({});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

// Filtres
const filters = ref({
    statut: '',
    type: '',
    search: ''
});

// Modaux
let materielModalInstance = null;
let assignationModalInstance = null;

// Computed
const filteredMateriels = computed(() => {
    let filtered = materiels.value;

    if (filters.value.statut) {
        filtered = filtered.filter(m => m.statut === filters.value.statut);
    }

    if (filters.value.type) {
        filtered = filtered.filter(m => m.type === filters.value.type);
    }

    if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase();
        filtered = filtered.filter(m => 
            m.code.toLowerCase().includes(searchLower) ||
            m.modele.toLowerCase().includes(searchLower) ||
            m.utilisateur?.toLowerCase().includes(searchLower) ||
            m.marque?.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
});

const statistiques = computed(() => [
    { label: 'Total', value: materiels.value.length, class: 'bg-primary text-white' },
    { label: 'En service', value: materiels.value.filter(m => m.statut === 'En service').length, class: 'bg-success text-white' },
    { label: 'En stock', value: materiels.value.filter(m => m.statut === 'En stock').length, class: 'bg-info text-white' },
    { label: 'En maintenance', value: materiels.value.filter(m => m.statut === 'En maintenance').length, class: 'bg-warning text-dark' },
    { label: 'Hors service', value: materiels.value.filter(m => m.statut === 'Hors service').length, class: 'bg-danger text-white' }
]);

// Lifecycle
onMounted(() => {
    fetchMateriels();
    initModals();
});

function initModals() {
    materielModalInstance = new bootstrap.Modal(document.getElementById('materielModal'));
    assignationModalInstance = new bootstrap.Modal(document.getElementById('assignationModal'));
}

// Méthodes
async function fetchMateriels() {
    try {
        const response = await MaterielBureauService.getAllMateriels(filters.value);
        materiels.value = response.data;
    } catch (error) {
        showError('Erreur de chargement: ' + error.message);
    }
}

async function saveMateriel() {
    isLoading.value = true;
    try {
        if (isEditMode.value) {
            await MaterielBureauService.updateMateriel(currentMateriel.value.code, currentMateriel.value);
            showSuccess('Matériel modifié avec succès');
        } else {
            await MaterielBureauService.createMateriel(currentMateriel.value);
            showSuccess('Matériel créé avec succès');
        }
        await fetchMateriels();
        materielModalInstance.hide();
    } catch (error) {
        showError('Erreur de sauvegarde: ' + error.message);
    } finally {
        isLoading.value = false;
    }
}

async function deleteMateriel(code) {
    if (!confirm(`Supprimer le matériel ${code} ?`)) return;
    
    try {
        await MaterielBureauService.deleteMateriel(code);
        showSuccess('Matériel supprimé');
        await fetchMateriels();
    } catch (error) {
        showError('Erreur de suppression: ' + error.message);
    }
}

async function assignerUtilisateur() {
    try {
        await MaterielBureauService.assignerUtilisateur(currentMateriel.value.code, assignationData.value);
        showSuccess('Utilisateur assigné');
        await fetchMateriels();
        assignationModalInstance.hide();
    } catch (error) {
        showError('Erreur d\'assignation: ' + error.message);
    }
}

// Modals
function openModal(mode, materiel = null) {
    isEditMode.value = mode === 'edit';
    currentMateriel.value = materiel ? { ...materiel } : getDefaultMateriel();
    materielModalInstance.show();
}

function openAssignationModal(materiel) {
    currentMateriel.value = { ...materiel };
    assignationData.value = {
        utilisateur: materiel.utilisateur || '',
        departement: materiel.departement || ''
    };
    assignationModalInstance.show();
}

function getDefaultMateriel() {
    return {
        code: '',
        type: '',
        marque: '',
        modele: '',
        utilisateur: '',
        departement: '',
        statut: 'En stock',
        dateAcquisition: new Date().toISOString().split('T')[0],
        dateFinGarantie: '',
        prixAchat: null,
        numeroSerie: '',
        emplacement: '',
        fournisseur: '',
        notes: ''
    };
}

// Utilitaires
function resetFilters() {
    filters.value = { statut: '', type: '', search: '' };
    fetchMateriels();
}

function onSearchInput() {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(fetchMateriels, 500);
}

function getStatusClass(statut) {
    const classes = {
        'En service': 'badge bg-success',
        'En stock': 'badge bg-info',
        'En maintenance': 'badge bg-warning text-dark',
        'En panne': 'badge bg-danger',
        'Hors service': 'badge bg-secondary'
    };
    return classes[statut] || 'badge bg-light text-dark';
}

function getRowClass(materiel) {
    if (materiel.statut === 'Hors service') return 'table-secondary';
    if (materiel.statut === 'En panne') return 'table-danger';
    if (materiel.statut === 'En maintenance') return 'table-warning';
    return '';
}

function getGarantieClass(dateFinGarantie) {
    if (!dateFinGarantie) return 'text-muted';
    return isGarantieExpiree(dateFinGarantie) ? 'text-danger' : 'text-success';
}

function isGarantieExpiree(dateFinGarantie) {
    if (!dateFinGarantie) return false;
    return new Date(dateFinGarantie) < new Date();
}

function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
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
</script>

<style scoped>
.stat-card {
    transition: transform 0.2s;
}
.stat-card:hover {
    transform: translateY(-2px);
}
.cedii-btn-primary {
    background-color: #5B11EE;
    border-color: #5B11EE;
}
.cedii-btn-primary:hover {
    background-color: #4a0fd6;
    border-color: #4a0fd6;
}
</style>