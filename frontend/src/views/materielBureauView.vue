<template>
    <div class="materiel-bureau-management p-4">
        <!-- En-tête -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 text-primary">
                <i class="bi bi-laptop me-2"></i>Matériel de Bureau
            </h1>
            <button class="btn cedii-btn-primary" @click="openModal('add')">
                <i class="bi bi-plus-circle me-2"></i>Nouveau
            </button>
        </div>

        <!-- Filtres complets -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Statut</label>
                        <select v-model="filters.statut" class="form-select" @change="fetchData">
                            <option value="">Tous statuts</option>
                            <option value="En service">En service</option>
                            <option value="En stock">En stock</option>
                            <option value="En maintenance">Maintenance</option>
                            <option value="En panne">En panne</option>
                            <option value="Hors service">Hors service</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Type</label>
                        <select v-model="filters.type" class="form-select" @change="fetchData">
                            <option value="">Tous types</option>
                            <option value="Ordinateur portable">Ordinateur portable</option>
                            <option value="Ordinateur fixe">Ordinateur fixe</option>
                            <option value="Imprimante">Imprimante</option>
                            <option value="Écran">Écran</option>
                            <option value="Téléphone">Téléphone</option>
                            <option value="Tablette">Tablette</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                   <div class="col-md-4">
    <label class="form-label">Recherche</label>
    <input type="text" v-model="filters.search" class="form-control" 
           placeholder="Code, modèle, utilisateur..." 
           @input="onSearch"
           @keypress="onSearchKeypress">
</div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Message -->
        <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
            {{ message }}
        </div>

        <!-- Tableau avec plus d'informations -->
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Type</th>
                                <th>Modèle</th>
                                <th>N° Série</th>
                                <th>Utilisateur</th>
                                <th>Département</th>
                                <th>Statut</th>
                                <th>Acquisition</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="materiels.length === 0">
                                <td colspan="9" class="text-center text-muted">Aucun matériel</td>
                            </tr>
                            <tr v-for="m in materiels" :key="m.id" :class="getRowClass(m)">
                                <td class="fw-bold">{{ m.code }}</td>
                                <td>{{ m.type }}</td>
                                <td>{{ m.marque }} {{ m.modele }}</td>
                                <td>
                                    <small class="text-muted">{{ m.numeroSerie || '-' }}</small>
                                </td>
                                <td>
                                    <span v-if="m.utilisateur" class="badge bg-info">{{ m.utilisateur }}</span>
                                    <span v-else class="text-muted">-</span>
                                </td>
                                <td>
                                    <span v-if="m.departement" class="badge bg-secondary">{{ m.departement }}</span>
                                    <span v-else class="text-muted">-</span>
                                </td>
                                <td>
                                    <span :class="getStatusClass(m.statut)">{{ m.statut }}</span>
                                </td>
                                <td>
                                    <small>{{ formatDate(m.dateAcquisition) }}</small>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-info me-1" @click="openModal('edit', m)"
                                                title="Modifier">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-warning me-1" 
                                                @click="openAssignModal(m)"
                                                :disabled="m.statut !== 'En stock' && m.statut !== 'En panne'"
                                                title="Assigner">
                                            <i class="bi bi-person"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" @click="deleteItem(m.id)"
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

        <!-- Modal complet -->
        <div class="modal fade" id="materielModal">
            <div class="modal-dialog modal-lg">
                <form @submit.prevent="saveItem">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">{{ isEdit ? 'Modifier le Matériel' : 'Nouveau Matériel' }}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Code *</label>
                                    <input type="text" v-model="current.code" class="form-control" required
                                           :readonly="isEdit">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Type *</label>
                                    <select v-model="current.type" class="form-select" required>
                                        <option value="">Sélectionner...</option>
                                        <option value="Ordinateur portable">Ordinateur portable</option>
                                        <option value="Ordinateur fixe">Ordinateur fixe</option>
                                        <option value="Imprimante">Imprimante</option>
                                        <option value="Écran">Écran</option>
                                        <option value="Téléphone">Téléphone</option>
                                        <option value="Tablette">Tablette</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Marque</label>
                                    <input type="text" v-model="current.marque" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Modèle</label>
                                    <input type="text" v-model="current.modele" class="form-control">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Numéro de série</label>
                                    <input type="text" v-model="current.numeroSerie" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fournisseur</label>
                                    <input type="text" v-model="current.fournisseur" class="form-control">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Date d'acquisition</label>
                                    <input type="date" v-model="current.dateAcquisition" class="form-control">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Fin de garantie</label>
                                    <input type="date" v-model="current.dateFinGarantie" class="form-control">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Prix d'achat (MGA)</label>
                                    <input type="number" v-model="current.prixAchat" class="form-control" step="0.01">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Utilisateur</label>
                                    <input type="text" v-model="current.utilisateur" class="form-control"
                                           placeholder="Nom de l'utilisateur">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Département</label>
                                    <input type="text" v-model="current.departement" class="form-control">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Statut *</label>
                                    <select v-model="current.statut" class="form-select" required>
                                        <option value="En stock">En stock</option>
                                        <option value="En service">En service</option>
                                        <option value="En maintenance">En maintenance</option>
                                        <option value="En panne">En panne</option>
                                        <option value="Hors service">Hors service</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Emplacement</label>
                                    <input type="text" v-model="current.emplacement" class="form-control">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea v-model="current.notes" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn cedii-btn-primary">Sauvegarder</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal assignation -->
        <div class="modal fade" id="assignModal">
            <div class="modal-dialog">
                <form @submit.prevent="assignUser">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">Assigner le Matériel</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>{{ current.code }}</strong> - {{ current.marque }} {{ current.modele }}</p>
                            <div class="mb-3">
                                <label class="form-label">Assigner à *</label>
                                <input type="text" v-model="assignData.utilisateur" class="form-control" required
                                       placeholder="Nom de l'utilisateur">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Département</label>
                                <input type="text" v-model="assignData.departement" class="form-control">
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
import { ref, onMounted } from 'vue';
import MaterielBureauService from '../services/MaterielBureauService';
import * as bootstrap from 'bootstrap';

// Données
const materiels = ref([]);
const current = ref({});
const assignData = ref({});
const isEdit = ref(false);
const message = ref('');
const isError = ref(false);

// Filtres
const filters = ref({
    statut: '',
    type: '', 
    search: ''
});

// Modaux
let materielModal = null;
let assignModal = null;

// Initialisation
onMounted(() => {
    fetchData();
    materielModal = new bootstrap.Modal(document.getElementById('materielModal'));
    assignModal = new bootstrap.Modal(document.getElementById('assignModal'));
});

// Méthodes
async function fetchData() {
    try {
        const response = await MaterielBureauService.getAll(filters.value);
        materiels.value = response.data;
    } catch (error) {
        showError('Erreur de chargement: ' + (error.response?.data?.message || error.message));
    }
}

async function saveItem() {
    try {
        if (isEdit.value) {
            await MaterielBureauService.update(current.value.id, current.value);
            showSuccess('Matériel modifié avec succès');
        } else {
            await MaterielBureauService.create(current.value);
            showSuccess('Matériel créé avec succès');
        }
        await fetchData();
        materielModal.hide();
    } catch (error) {
        showError('Erreur de sauvegarde: ' + (error.response?.data?.message || error.message));
    }
}

async function deleteItem(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) return;
    
    try {
        await MaterielBureauService.delete(id);
        showSuccess('Matériel supprimé avec succès');
        await fetchData();
    } catch (error) {
        showError('Erreur de suppression: ' + (error.response?.data?.message || error.message));
    }
}

async function assignUser() {
    try {
        await MaterielBureauService.assignerUtilisateur(current.value.id, assignData.value);
        showSuccess('Utilisateur assigné avec succès');
        await fetchData();
        assignModal.hide();
    } catch (error) {
        showError('Erreur d\'assignation: ' + (error.response?.data?.message || error.message));
    }
}

// Modals
function openModal(mode, item = null) {
    isEdit.value = mode === 'edit';
    
    if (isEdit.value && item) {
        current.value = { ...item };
        // Formater les dates pour les inputs
        if (current.value.dateAcquisition) {
            current.value.dateAcquisition = formatDateForInput(current.value.dateAcquisition);
        }
        if (current.value.dateFinGarantie) {
            current.value.dateFinGarantie = formatDateForInput(current.value.dateFinGarantie);
        }
    } else {
        current.value = getDefaultMateriel();
    }
    materielModal.show();
}

function openAssignModal(item) {
    current.value = { ...item };
    assignData.value = { 
        utilisateur: item.utilisateur || '', 
        departement: item.departement || '' 
    };
    assignModal.show();
}

function getDefaultMateriel() {
    return {
        code: '',
        type: '',
        marque: '',
        modele: '',
        numeroSerie: '',
        utilisateur: '',
        departement: '',
        statut: 'En stock',
        dateAcquisition: new Date().toISOString().split('T')[0],
        dateFinGarantie: '',
        prixAchat: null,
        fournisseur: '',
        emplacement: '',
        notes: ''
    };
}

// Utilitaires
function resetFilters() {
    filters.value = { statut: '', type: '', search: '' };
    fetchData();
}

// REMPLACEZ la fonction onSearch par cette version améliorée
function onSearch() {
    console.log('🔍 Recherche déclenchée:', filters.value.search);
    
    // Effacer le timeout précédent
    if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
    }
    
    // Si le champ est vide, recherche immédiate
    if (!filters.value.search || filters.value.search.trim() === '') {
        fetchData();
        return;
    }
    
    // Sinon, attendre 300ms après la dernière frappe
    window.searchTimeout = setTimeout(() => {
        console.log('🔄 Exécution recherche...');
        fetchData();
    }, 300);
}

// AJOUTEZ aussi cette fonction pour la touche Entrée
function onSearchKeypress(event) {
    if (event.key === 'Enter') {
        // Annuler le timeout et rechercher immédiatement
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }
        fetchData();
    }
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

function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
}

function formatDateForInput(date) {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
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
.cedii-btn-primary {
    background-color: #5B11EE;
    border-color: #5B11EE;
}
.cedii-btn-primary:hover {
    background-color: #4a0fd6;
    border-color: #4a0fd6;
}
</style>