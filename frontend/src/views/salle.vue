<template>
    <div class="salle-management p-4">
        
        <!-- EN-TÊTE ET BOUTONS DE NAVIGATION -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3 text-primary"><i class="bi bi-door-open-fill me-2"></i> Gestion des Salles</h1>
            
            <button v-if="currentView === 'calendar'" class="btn btn-secondary" @click="returnToList">
                <i class="bi bi-arrow-left me-2"></i> Retour à la Liste
            </button>
        </div>

        <!-- FILTRES ET RECHERCHE -->
        <div class="card mb-4" v-if="currentView === 'list'">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Disponibilité</label>
                        <select v-model="filters.disponibilite" class="form-select" @change="fetchSalles">
                            <option value="tous">Tous les statuts</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Occupée">Occupée</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Recherche</label>
                        <input type="text" v-model="filters.search" class="form-control" 
                               placeholder="Nom, numéro..." @input="onSearchInput">
                    </div>
                    <div class="col-md-3 d-flex align-items-end">
                        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                            <i class="bi bi-arrow-clockwise"></i> Réinitialiser
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MESSAGES D'ALERTE -->
        <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
            {{ message }}
        </div>

        <!-- -------------------- VUE 1: LISTE ET INVENTAIRE -------------------- -->
        <div v-if="currentView === 'list'" class="card shadow">
            <div class="card-body">
                <div class="d-flex justify-content-between mb-4">
                    <button class="btn cedii-btn-primary" @click="openModal('add')">
                        <i class="bi bi-plus-circle-fill me-2"></i> Ajouter une Salle
                    </button>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" @click="showStatistiques = !showStatistiques">
                            <i class="bi bi-graph-up me-2"></i>Statistiques
                        </button>
                    </div>
                </div>

                <!-- STATISTIQUES -->
                <div v-if="showStatistiques" class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-bar-chart me-2"></i>Statistiques des Salles</h5>
                        <div class="row text-center">
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-primary">{{ statistiques.total }}</h3>
                                    <small>Total Salles</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-success">{{ statistiques.disponibles }}</h3>
                                    <small>Disponibles</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-warning">{{ statistiques.occupees }}</h3>
                                    <small>Occupées</small>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card">
                                    <h3 class="text-danger">{{ statistiques.maintenance }}</h3>
                                    <small>Maintenance</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TABLEAU DES SALLES -->
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Numéro</th>
                                <th>Capacité</th>
                                <th>Tarif/Heure</th>
                                <th>Tarif/Demi-journée</th>
                                <th>Tarif/Jour</th>
                                <th>Disponibilité</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredSalles.length === 0">
                                <td colspan="9" class="text-center text-muted">Aucune salle trouvée.</td>
                            </tr>
                            <tr v-for="salle in filteredSalles" :key="salle.idSalle" 
                                :class="getRowClass(salle)">
                                <td class="fw-bold">{{ salle.idSalle }}</td>
                                <td>{{ salle.nomSalle }}</td>
                                <td>{{ salle.numeroSalle }}</td>
                                <td>{{ salle.capaciteSalle }} personnes</td>
                                <td>{{ formatCurrency(salle.tarifHeure) }}</td>
                                <td>{{ formatCurrency(salle.tarifDemiJournee) }}</td>
                                <td>{{ formatCurrency(salle.tarifJour) }}</td>
                                <td>
                                    <span :class="getStatusClass(salle.disponibiliteSalle)">
                                        {{ salle.disponibiliteSalle }}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-success" @click="openCalendar(salle)" 
                                                title="Consulter Calendrier">
                                            <i class="bi bi-calendar-check"></i>
                                        </button>
                                        <button class="btn btn-outline-info" @click="openModal('edit', salle)" 
                                                title="Modifier">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" @click="deleteSalle(salle.idSalle)" 
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

        <!-- -------------------- VUE 2: CALENDRIER DE DISPONIBILITÉ -------------------- -->
        <div v-if="currentView === 'calendar' && selectedSalleForCalendar" class="card shadow">
            <div class="card-header bg-info text-white">
                <h5 class="mb-0">
                    <i class="bi bi-calendar-week me-2"></i>
                    Calendrier de Réservation : {{ selectedSalleForCalendar.nomSalle }} ({{ selectedSalleForCalendar.numeroSalle }})
                </h5>
                <small>
                    Tarifs : {{ formatCurrency(selectedSalleForCalendar.tarifHeure) }}/h | 
                    {{ formatCurrency(selectedSalleForCalendar.tarifDemiJournee) }}/½j | 
                    {{ formatCurrency(selectedSalleForCalendar.tarifJour) }}/jour | 
                    Capacité : {{ selectedSalleForCalendar.capaciteSalle }} personnes |
                    Statut : <span :class="getStatusClass(selectedSalleForCalendar.disponibiliteSalle)">{{ selectedSalleForCalendar.disponibiliteSalle }}</span>
                </small>
            </div>
            <div class="card-body">
                
                <!-- CONTROLES DU CALENDRIER -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <button class="btn btn-outline-primary" @click="prevMonth">
                        <i class="bi bi-arrow-left"></i> Précédent
                    </button>
                    <h4 class="mb-0 text-primary">
                        {{ currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) }}
                        <span v-if="calendarLoading" class="spinner-border spinner-border-sm ms-2" role="status"></span>
                    </h4>
                    <button class="btn btn-outline-primary" @click="nextMonth">
                        Suivant <i class="bi bi-arrow-right"></i>
                    </button>
                </div>

                <!-- GRILLE DU CALENDRIER -->
                <div class="calendar-grid">
                    <!-- En-têtes des jours de la semaine -->
                    <div class="day-header" v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']" :key="day">
                        {{ day }}
                    </div>

                    <!-- Jours du mois -->
                    <div v-for="day in daysInMonth" :key="day.date.getTime()" 
                         :class="['calendar-day', { 
                             'reserved': isReserved(day.date),
                             'today': isToday(day.date),
                             'weekend': day.isWeekend
                         }]">
                         
                        <span class="day-number">{{ day.date.getDate() }}</span>
                        
                        <!-- Indicateur de réservation -->
                        <div v-if="isReserved(day.date)" class="reservation-info">
                            <small class="text-danger fw-bold">
                                <i class="bi bi-clock"></i> Réservé
                            </small>
                            <div v-for="res in getReservationsForDay(day.date)" :key="res.idRes" 
                                 class="reservation-detail">
                                <small>{{ formatTime(res.debRes) }} - {{ formatTime(res.finRes) }}</small>
                                <br>
                                <small>{{ res.Client.nomCli }}</small>
                            </div>
                        </div>
                        
                        <!-- Bouton de réservation pour les jours disponibles -->
                        <button v-else class="btn btn-sm btn-success mt-1" 
                                @click="openReservationModal(day.date)"
                                :disabled="selectedSalleForCalendar.disponibiliteSalle !== 'Disponible'"
                                title="Réserver ce jour">
                            <i class="bi bi-plus-circle"></i>
                        </button>
                    </div>
                </div>

                <!-- LÉGENDE -->
                <div class="mt-4">
                    <div class="row text-center">
                        <div class="col-md-4">
                            <span class="badge bg-success me-2">●</span> Disponible
                        </div>
                        <div class="col-md-4">
                            <span class="badge bg-danger me-2">●</span> Réservé
                        </div>
                        <div class="col-md-4">
                            <span class="badge bg-primary me-2">●</span> Aujourd'hui
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- -------------------- MODAL AJOUT/MODIFICATION SALLE -------------------- -->
        <div class="modal fade" id="salleModal" tabindex="-1" aria-labelledby="salleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <form @submit.prevent="saveSalle">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="salleModalLabel">
                                {{ isEditMode ? 'Modifier la Salle' : 'Ajouter une Nouvelle Salle' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            
                            <!-- Nom de la Salle -->
                            <div class="mb-3">
                                <label for="nomSalle" class="form-label">Nom de la Salle *</label>
                                <input type="text" id="nomSalle" v-model="currentSalle.nomSalle" class="form-control" required />
                            </div>
                            
                            <div class="row">
                                <!-- Numéro/Code -->
                                <div class="col-md-6 mb-3">
                                    <label for="numeroSalle" class="form-label">Numéro/Code *</label>
                                    <input type="text" id="numeroSalle" v-model="currentSalle.numeroSalle" class="form-control" required />
                                </div>
                                <!-- Capacité -->
                                <div class="col-md-6 mb-3">
                                    <label for="capaciteSalle" class="form-label">Capacité (personnes) *</label>
                                    <input type="number" id="capaciteSalle" v-model.number="currentSalle.capaciteSalle" 
                                           class="form-control" required min="1" />
                                </div>
                            </div>

                            <!-- TARIFS -->
                            <div class="row">
                                <!-- Tarif Heure -->
                                <div class="col-md-4 mb-3">
                                    <label for="tarifHeure" class="form-label">Tarif/Heure (MGA) *</label>
                                    <div class="input-group">
                                        <input type="number" id="tarifHeure" v-model.number="currentSalle.tarifHeure" 
                                               class="form-control" required min="0" step="1000" />
                                        <span class="input-group-text">MGA</span>
                                    </div>
                                </div>
                                <!-- Tarif Demi-journée -->
                                <div class="col-md-4 mb-3">
                                    <label for="tarifDemiJournee" class="form-label">Tarif/Demi-journée (MGA) *</label>
                                    <div class="input-group">
                                        <input type="number" id="tarifDemiJournee" v-model.number="currentSalle.tarifDemiJournee" 
                                               class="form-control" required min="0" step="1000" />
                                        <span class="input-group-text">MGA</span>
                                    </div>
                                </div>
                                <!-- Tarif Jour -->
                                <div class="col-md-4 mb-3">
                                    <label for="tarifJour" class="form-label">Tarif/Jour (MGA) *</label>
                                    <div class="input-group">
                                        <input type="number" id="tarifJour" v-model.number="currentSalle.tarifJour" 
                                               class="form-control" required min="0" step="1000" />
                                        <span class="input-group-text">MGA</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Statut -->
                            <div class="mb-3">
                                <label for="disponibiliteSalle" class="form-label">Statut *</label>
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
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                                {{ isEditMode ? 'Sauvegarder' : 'Ajouter' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- -------------------- MODAL RÉSERVATION -------------------- -->
        <div class="modal fade" id="reservationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <form @submit.prevent="createReservation">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">Nouvelle Réservation</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Salle</label>
                                <input type="text" class="form-control" 
                                       :value="`${selectedSalleForCalendar?.nomSalle} (${selectedSalleForCalendar?.numeroSalle})`" 
                                       disabled />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Date *</label>
                                <input type="date" v-model="newReservation.date" class="form-control" required />
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Heure de début *</label>
                                    <input type="time" v-model="newReservation.heureDebut" class="form-control" required />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Heure de fin *</label>
                                    <input type="time" v-model="newReservation.heureFin" class="form-control" required />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Client *</label>
                                <select v-model="newReservation.idClient" class="form-select" required>
                                    <option value="">Sélectionner un client</option>
                                    <option v-for="client in clients" :key="client.idCli" :value="client.idCli">
                                        {{ client.nomCli }} {{ client.prenomCli }}
                                    </option>
                                </select>
                            </div>
                            <div v-if="disponibiliteCheck" class="alert" 
                                 :class="disponibiliteCheck.disponible ? 'alert-success' : 'alert-danger'">
                                <i class="bi" :class="disponibiliteCheck.disponible ? 'bi-check-circle' : 'bi-exclamation-circle'"></i>
                                {{ disponibiliteCheck.disponible ? 'Salle disponible pour cette période' : 'Salle non disponible pour cette période' }}
                                <div v-if="disponibiliteCheck.conflits.length > 0">
                                    <small>Conflits : {{ disponibiliteCheck.conflits.map(c => formatDateTime(c.debRes)).join(', ') }}</small>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn btn-success" :disabled="!disponibiliteCheck?.disponible">
                                <i class="bi bi-check-circle me-2"></i>Réserver
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import SalleService from '../services/SalleService';
import * as bootstrap from 'bootstrap';

// États principaux
const salles = ref([]);
const currentSalle = ref({});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const showStatistiques = ref(false);

// Filtres
const filters = ref({
    disponibilite: 'tous',
    search: ''
});

// États pour le calendrier
const currentView = ref('list');
const selectedSalleForCalendar = ref(null);
const reservations = ref([]);
const calendarLoading = ref(false);
const currentMonth = ref(new Date());

// États pour la réservation
const newReservation = ref({
    date: '',
    heureDebut: '08:00',
    heureFin: '17:00',
    idClient: ''
});
const disponibiliteCheck = ref(null);
const clients = ref([]);

// Instances des modaux
let salleModalInstance = null;
let reservationModalInstance = null;

// Propriétés calculées
const filteredSalles = computed(() => {
    let filtered = salles.value;

    // Filtre par disponibilité
    if (filters.value.disponibilite !== 'tous') {
        filtered = filtered.filter(salle => 
            salle.disponibiliteSalle === filters.value.disponibilite
        );
    }

    // Filtre par recherche
    if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase();
        filtered = filtered.filter(salle => 
            salle.nomSalle.toLowerCase().includes(searchLower) ||
            salle.numeroSalle.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
});

const daysInMonth = computed(() => {
    const year = currentMonth.value.getFullYear();
    const month = currentMonth.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Jours du mois précédent pour compléter la première semaine
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startDay; i > 0; i--) {
        const date = new Date(year, month, -i + 1);
        days.push({ date, isCurrentMonth: false, isWeekend: date.getDay() === 0 || date.getDay() === 6 });
    }

    // Jours du mois courant
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({ date, isCurrentMonth: true, isWeekend: date.getDay() === 0 || date.getDay() === 6 });
    }

    return days;
});

const statistiques = computed(() => {
    return {
        total: salles.value.length,
        disponibles: salles.value.filter(s => s.disponibiliteSalle === 'Disponible').length,
        occupees: salles.value.filter(s => s.disponibiliteSalle === 'Occupée').length,
        maintenance: salles.value.filter(s => s.disponibiliteSalle === 'Maintenance').length
    };
});

// Cycle de vie
onMounted(() => {
    fetchSalles();
    initModals();
});

// Initialisation des modaux
function initModals() {
    salleModalInstance = new bootstrap.Modal(document.getElementById('salleModal'));
    reservationModalInstance = new bootstrap.Modal(document.getElementById('reservationModal'));
}

// Fonctions principales
async function fetchSalles() {
    try {
        const response = await SalleService.getAllSalles(filters.value);
        salles.value = response.data;
    } catch (error) {
        showError("Erreur de chargement des salles: " + (error.response?.data?.message || error.message));
    }
}

async function saveSalle() {
    isLoading.value = true;
    try {
        if (isEditMode.value) {
            await SalleService.updateSalle(currentSalle.value.idSalle, currentSalle.value);
            showSuccess('Salle modifiée avec succès');
        } else {
            await SalleService.createSalle(currentSalle.value);
            showSuccess('Salle ajoutée avec succès');
        }
        await fetchSalles();
        salleModalInstance.hide();
    } catch (error) {
        showError("Erreur de sauvegarde: " + (error.response?.data?.message || error.message));
    } finally {
        isLoading.value = false;
    }
}

async function deleteSalle(idSalle) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la salle ${idSalle} ?`)) return;
    
    try {
        await SalleService.deleteSalle(idSalle);
        showSuccess('Salle supprimée avec succès');
        await fetchSalles();
    } catch (error) {
        showError("Erreur de suppression: " + (error.response?.data?.message || error.message));
    }
}

// Fonctions d'interface
function openModal(mode, salleData = null) {
    isEditMode.value = mode === 'edit';
    
    if (isEditMode.value && salleData) {
        currentSalle.value = { ...salleData };
    } else {
        currentSalle.value = { 
            nomSalle: '', 
            numeroSalle: '', 
            capaciteSalle: 10, 
            tarifHeure: 0,
            tarifDemiJournee: 0,
            tarifJour: 0,
            disponibiliteSalle: 'Disponible'
        };
    }

    salleModalInstance.show();
}

function openCalendar(salle) {
    selectedSalleForCalendar.value = { ...salle };
    currentView.value = 'calendar';
    fetchCalendrierSalle();
}

function returnToList() {
    selectedSalleForCalendar.value = null;
    currentView.value = 'list';
    reservations.value = [];
}

// Fonctions du calendrier
async function fetchCalendrierSalle() {
    if (!selectedSalleForCalendar.value) return;

    calendarLoading.value = true;
    try {
        const mois = currentMonth.value.getMonth() + 1;
        const annee = currentMonth.value.getFullYear();
        const response = await SalleService.getCalendrierSalle(
            selectedSalleForCalendar.value.idSalle, 
            mois, 
            annee
        );
        reservations.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement du calendrier:", error);
    } finally {
        calendarLoading.value = false;
    }
}

function isReserved(date) {
    return reservations.value.some(res => {
        const resDate = new Date(res.debRes).toDateString();
        const checkDate = date.toDateString();
        return resDate === checkDate;
    });
}

function getReservationsForDay(date) {
    return reservations.value.filter(res => {
        const resDate = new Date(res.debRes).toDateString();
        return resDate === date.toDateString();
    });
}

function isToday(date) {
    return new Date().toDateString() === date.toDateString();
}

function nextMonth() {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
    fetchCalendrierSalle();
}

function prevMonth() {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
    fetchCalendrierSalle();
}

// Fonctions de réservation
async function openReservationModal(date) {
    newReservation.value = {
        date: date.toISOString().split('T')[0],
        heureDebut: '08:00',
        heureFin: '17:00',
        idClient: ''
    };
    await checkDisponibilite();
    reservationModalInstance.show();
}

async function checkDisponibilite() {
    try {
        const dateDebut = `${newReservation.value.date}T${newReservation.value.heureDebut}`;
        const dateFin = `${newReservation.value.date}T${newReservation.value.heureFin}`;
        
        const response = await SalleService.checkDisponibilite(
            selectedSalleForCalendar.value.idSalle,
            dateDebut,
            dateFin
        );
        disponibiliteCheck.value = response.data;
    } catch (error) {
        console.error("Erreur de vérification de disponibilité:", error);
    }
}

async function createReservation() {
    // Implémentation de la création de réservation
    console.log("Création de réservation:", newReservation.value);
    // À implémenter avec votre service de réservation
}

// Utilitaires
function resetFilters() {
    filters.value = { disponibilite: 'tous', search: '' };
    fetchSalles();
}

function onSearchInput() {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        fetchSalles();
    }, 500);
}

function getStatusClass(status) {
    const classes = {
        'Disponible': 'badge bg-success',
        'Occupée': 'badge bg-warning text-dark',
        'Maintenance': 'badge bg-danger'
    };
    return classes[status] || 'badge bg-secondary';
}

function getRowClass(salle) {
    if (salle.disponibiliteSalle === 'Maintenance') return 'table-danger';
    if (salle.disponibiliteSalle === 'Occupée') return 'table-warning';
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
    if (isNaN(value)) return '0 Ar';
    return new Intl.NumberFormat('fr-MG', { 
        style: 'currency', 
        currency: 'MGA', 
        minimumFractionDigits: 0 
    }).format(value);
};

const formatTime = (datetime) => {
    if (!datetime) return '';
    return new Date(datetime).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

const formatDateTime = (datetime) => {
    if (!datetime) return '';
    return new Date(datetime).toLocaleString('fr-FR');
};

// Watchers
watch([() => newReservation.value.date, () => newReservation.value.heureDebut, () => newReservation.value.heureFin], 
    () => {
        if (newReservation.value.date && newReservation.value.heureDebut && newReservation.value.heureFin) {
            checkDisponibilite();
        }
    }
);
</script>

<style scoped>
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

.stat-card {
    padding: 10px;
    border-radius: 8px;
    background-color: #f8f9fa;
}
.stat-card h3 {
    margin: 0;
    font-weight: bold;
}

/* Styles pour le calendrier */
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
}
.day-header {
    background-color: #5B11EE;
    color: white;
    text-align: center;
    padding: 10px 5px;
    font-weight: bold;
}
.calendar-day {
    min-height: 100px;
    padding: 5px;
    border: 1px solid #dee2e6;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.day-number {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 5px;
}
.calendar-day.today {
    background-color: #e3f2fd;
    border: 2px solid #2196f3;
}
.calendar-day.weekend {
    background-color: #f8f9fa;
}
.calendar-day.reserved {
    background-color: #ffebee;
    border-color: #f44336;
}
.reservation-info {
    font-size: 0.7em;
    text-align: center;
}
.reservation-detail {
    background: white;
    padding: 2px 4px;
    margin: 1px 0;
    border-radius: 3px;
    border: 1px solid #ddd;
}
</style>