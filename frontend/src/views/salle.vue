<template>
    <div class="salle-management p-3">
        
        <!-- EN-TÊTE ET BOUTONS DE NAVIGATION -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h4 text-primary mb-0"><i class="bi bi-door-open-fill me-2"></i> Gestion des Salles</h1>
            
            <button v-if="currentView === 'calendar'" class="btn btn-secondary btn-sm" @click="returnToList">
                <i class="bi bi-arrow-left me-1"></i> Retour
            </button>
        </div>

        <!-- FILTRES ET RECHERCHE -->
        <div class="card mb-3" v-if="currentView === 'list'">
            <div class="card-body py-2">
                <div class="row g-2 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label small mb-1">Disponibilité</label>
                        <select v-model="filters.disponibilite" class="form-select form-select-sm" @change="fetchSalles">
                            <option value="tous">Tous</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Occupée">Occupée</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small mb-1">Recherche</label>
                        <input type="text" v-model="filters.search" class="form-control form-control-sm" 
                               placeholder="Nom, numéro..." @input="onSearchInput">
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilters">
                            <i class="bi bi-arrow-clockwise"></i> Réinitialiser
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MESSAGES D'ALERTE -->
        <div v-if="message" :class="['alert', 'py-2', isError ? 'alert-danger' : 'alert-success']">
            <small>{{ message }}</small>
        </div>

        <!-- -------------------- VUE 1: LISTE ET INVENTAIRE -------------------- -->
        <div v-if="currentView === 'list'" class="card shadow-sm">
            <div class="card-body p-2">
                <div class="d-flex justify-content-between mb-2">
                    <button class="btn cedii-btn-primary btn-sm" @click="openModal('add')">
                        <i class="bi bi-plus-circle me-1"></i> Ajouter
                    </button>
                    <div class="d-flex gap-1">
                        <button class="btn btn-outline-info btn-sm" @click="showStatistiques = !showStatistiques">
                            <i class="bi bi-graph-up me-1"></i>Stats
                        </button>
                    </div>
                </div>

                <!-- STATISTIQUES -->
                <div v-if="showStatistiques" class="card mb-2">
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
                                    <small class="text-muted">Disponibles</small>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="stat-card p-1">
                                    <h6 class="text-warning mb-0">{{ statistiques.occupees }}</h6>
                                    <small class="text-muted">Occupées</small>
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

                <!-- TABLEAU DES SALLES AVEC SCROLL -->
                <div class="table-container" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-sm table-striped table-hover mb-0">
                        <thead class="sticky-top bg-light">
                            <tr>
                                <th class="py-1">ID</th>
                                <th class="py-1">Nom</th>
                                <th class="py-1">Numéro</th>
                                <th class="py-1">Capacité</th>
                                <th class="py-1">Tarif/H</th>
                                <th class="py-1">Tarif/½J</th>
                                <th class="py-1">Tarif/J</th>
                                <th class="py-1">Statut</th>
                                <th class="py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredSalles.length === 0">
                                <td colspan="9" class="text-center text-muted py-2">Aucune salle trouvée.</td>
                            </tr>
                            <tr v-for="salle in filteredSalles" :key="salle.idSalle" 
                                :class="getRowClass(salle)" class="small">
                                <td class="fw-bold">{{ salle.idSalle }}</td>
                                <td>{{ salle.nomSalle }}</td>
                                <td>{{ salle.numeroSalle }}</td>
                                <td>{{ salle.capaciteSalle }}p</td>
                                <td>{{ formatCurrency(salle.tarifHeure) }}</td>
                                <td>{{ formatCurrency(salle.tarifDemiJournee) }}</td>
                                <td>{{ formatCurrency(salle.tarifJour) }}</td>
                                <td>
                                    <span :class="getStatusClass(salle.disponibiliteSalle)" class="small">
                                        {{ getStatusShort(salle.disponibiliteSalle) }}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-success btn-sm" @click="openCalendar(salle)" 
                                                title="Calendrier">
                                            <i class="bi bi-calendar-check"></i>
                                        </button>
                                        <button class="btn btn-outline-info btn-sm" @click="openModal('edit', salle)" 
                                                title="Modifier">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-danger btn-sm" @click="deleteSalle(salle.idSalle)" 
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
        <div v-if="currentView === 'calendar' && selectedSalleForCalendar" class="card shadow-sm">
            <div class="card-header bg-info text-white py-2">
                <h6 class="mb-0">
                    <i class="bi bi-calendar-week me-1"></i>
                    Calendrier : {{ selectedSalleForCalendar.nomSalle }} ({{ selectedSalleForCalendar.numeroSalle }})
                </h6>
                <small class="opacity-75">
                    {{ formatCurrency(selectedSalleForCalendar.tarifHeure) }}/h • 
                    {{ formatCurrency(selectedSalleForCalendar.tarifDemiJournee) }}/½j • 
                    {{ formatCurrency(selectedSalleForCalendar.tarifJour) }}/j • 
                    {{ selectedSalleForCalendar.capaciteSalle }}p •
                    <span :class="getStatusClass(selectedSalleForCalendar.disponibiliteSalle)">
                        {{ getStatusShort(selectedSalleForCalendar.disponibiliteSalle) }}
                    </span>
                </small>
            </div>
            <div class="card-body p-2">
                
                <!-- CONTROLES DU CALENDRIER -->
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <button class="btn btn-outline-primary btn-sm" @click="prevMonth">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <h6 class="mb-0 text-primary">
                        {{ currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) }}
                        <span v-if="calendarLoading" class="spinner-border spinner-border-sm ms-1" role="status"></span>
                    </h6>
                    <button class="btn btn-outline-primary btn-sm" @click="nextMonth">
                        <i class="bi bi-arrow-right"></i>
                    </button>
                </div>

                <!-- GRILLE DU CALENDRIER AVEC SCROLL -->
                <div class="calendar-container" style="max-height: 500px; overflow-y: auto;">
                    <div class="calendar-grid compact">
                        <!-- En-têtes des jours de la semaine -->
                        <div class="day-header compact" v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']" :key="day">
                            {{ day }}
                        </div>

                        <!-- Jours du mois -->
                        <div v-for="day in daysInMonth" :key="day.date.getTime()" 
                             :class="['calendar-day', 'compact', { 
                                 'reserved': isReserved(day.date),
                                 'today': isToday(day.date),
                                 'weekend': day.isWeekend
                             }]">
                             
                            <span class="day-number small">{{ day.date.getDate() }}</span>
                            
                            <!-- Indicateur de réservation -->
                            <div v-if="isReserved(day.date)" class="reservation-info">
                                <small class="text-danger fw-bold">
                                    <i class="bi bi-clock"></i>
                                </small>
                                <div v-for="res in getReservationsForDay(day.date)" :key="res.idRes" 
                                     class="reservation-detail">
                                    <small>{{ formatTime(res.debRes) }}-{{ formatTime(res.finRes) }}</small>
                                    <br>
                                    <small class="text-truncate">{{ res.Client?.nomCli || 'Client' }}</small>
                                </div>
                            </div>
                            
                            <!-- Bouton de réservation pour les jours disponibles -->
                            <button v-else class="btn btn-success btn-xs mt-1" 
                                    @click="openReservationModal(day.date)"
                                    :disabled="selectedSalleForCalendar.disponibiliteSalle !== 'Disponible'"
                                    title="Réserver">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- LÉGENDE -->
                <div class="mt-2">
                    <div class="row text-center g-1">
                        <div class="col-4">
                            <span class="badge bg-success me-1">●</span> 
                            <small>Disponible</small>
                        </div>
                        <div class="col-4">
                            <span class="badge bg-danger me-1">●</span> 
                            <small>Réservé</small>
                        </div>
                        <div class="col-4">
                            <span class="badge bg-primary me-1">●</span> 
                            <small>Aujourd'hui</small>
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
                        <div class="modal-header bg-primary text-white py-2">
                            <h6 class="modal-title" id="salleModalLabel">
                                {{ isEditMode ? 'Modifier la Salle' : 'Ajouter une Salle' }}
                            </h6>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body modal-scroll">
                            
                            <!-- Nom de la Salle -->
                            <div class="row g-3 align-items-center">
                                <div class="col-md-3">
                                    <label for="nomSalle" class="col-form-label small fw-medium">Nom de la Salle *</label>
                                </div>
                                <div class="col-md-9">
                                    <input type="text" id="nomSalle" v-model="currentSalle.nomSalle" 
                                           class="form-control form-control-sm" required />
                                </div>
                            </div>

                            <!-- Numéro/Code et Capacité -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label for="numeroSalle" class="col-form-label small fw-medium">Numéro/Code *</label>
                                </div>
                                <div class="col-md-3">
                                    <input type="text" id="numeroSalle" v-model="currentSalle.numeroSalle" 
                                           class="form-control form-control-sm" required />
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="capaciteSalle" class="col-form-label small fw-medium">Capacité *</label>
                                </div>
                                <div class="col-md-3">
                                    <input type="number" id="capaciteSalle" v-model.number="currentSalle.capaciteSalle" 
                                           class="form-control form-control-sm" required min="1" />
                                </div>
                            </div>

                            <!-- TARIFS -->
                            <h6 class="mt-4 mb-3 text-primary small fw-bold">Tarifs de Location (MGA)</h6>
                            
                            <div class="row g-3 align-items-center">
                                <div class="col-md-3">
                                    <label for="tarifHeure" class="col-form-label small fw-medium">Par Heure *</label>
                                </div>
                                <div class="col-md-3">
                                    <div class="input-group input-group-sm">
                                        <input type="number" id="tarifHeure" v-model.number="currentSalle.tarifHeure" 
                                               class="form-control" required min="0" step="1000" />
                                        <span class="input-group-text">MGA</span>
                                    </div>
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="tarifDemiJournee" class="col-form-label small fw-medium">Demi-Journée *</label>
                                </div>
                                <div class="col-md-3">
                                    <div class="input-group input-group-sm">
                                        <input type="number" id="tarifDemiJournee" v-model.number="currentSalle.tarifDemiJournee" 
                                               class="form-control" required min="0" step="1000" />
                                        <span class="input-group-text">MGA</span>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label for="tarifJour" class="col-form-label small fw-medium">Par Jour *</label>
                                </div>
                                <div class="col-md-3">
                                    <div class="input-group input-group-sm">
                                        <input type="number" id="tarifJour" v-model.number="currentSalle.tarifJour" 
                                               class="form-control" required min="0" step="1000" />
                                        <span class="input-group-text">MGA</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Statut -->
                            <div class="row g-3 align-items-center mt-3">
                                <div class="col-md-3">
                                    <label for="disponibiliteSalle" class="col-form-label small fw-medium">Statut *</label>
                                </div>
                                <div class="col-md-3">
                                    <select id="disponibiliteSalle" v-model="currentSalle.disponibiliteSalle" 
                                            class="form-select form-select-sm" required>
                                        <option value="Disponible">Disponible</option>
                                        <option value="Occupée">Occupée</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn cedii-btn-primary btn-sm" :disabled="isLoading">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                                {{ isEditMode ? 'Sauvegarder' : 'Ajouter' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- -------------------- MODAL RÉSERVATION -------------------- -->
        <div class="modal fade" id="reservationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <form @submit.prevent="createReservation">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white py-2">
                            <h6 class="modal-title">Nouvelle Réservation</h6>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body modal-scroll">
                            
                            <!-- Salle -->
                            <div class="row g-3 align-items-center">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Salle</label>
                                </div>
                                <div class="col-md-9">
                                    <input type="text" class="form-control form-control-sm" 
                                           :value="selectedSalleForCalendar ? `${selectedSalleForCalendar.nomSalle} (${selectedSalleForCalendar.numeroSalle})` : ''" 
                                           disabled />
                                </div>
                            </div>

                            <!-- Date -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Date *</label>
                                </div>
                                <div class="col-md-9">
                                    <input type="date" v-model="newReservation.date" 
                                           class="form-control form-control-sm" required 
                                           @change="checkDisponibilite" />
                                </div>
                            </div>

                            <!-- Heures début et fin -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Heure début *</label>
                                </div>
                                <div class="col-md-3">
                                    <input type="time" v-model="newReservation.heureDebut" 
                                           class="form-control form-control-sm" required 
                                           @change="checkDisponibilite" />
                                </div>
                                
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Heure fin *</label>
                                </div>
                                <div class="col-md-3">
                                    <input type="time" v-model="newReservation.heureFin" 
                                           class="form-control form-control-sm" required 
                                           @change="checkDisponibilite" />
                                </div>
                            </div>

                            <!-- Client -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Client *</label>
                                </div>
                                <div class="col-md-9">
                                    <select v-model="newReservation.idClient" 
                                            class="form-select form-select-sm" required>
                                        <option value="">Sélectionner un client</option>
                                        <option v-for="client in clients" :key="client.idCli" :value="client.idCli">
                                            {{ client.nomCli }} {{ client.prenomCli }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Nombre de personnes -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Nb. Personnes *</label>
                                </div>
                                <div class="col-md-3">
                                    <input type="number" v-model.number="newReservation.nbPerso" 
                                           class="form-control form-control-sm" min="1" required />
                                </div>
                            </div>

                            <!-- Type de durée -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Durée *</label>
                                </div>
                                <div class="col-md-9">
                                    <div class="row g-2">
                                        <div class="col-6 col-md-3">
                                            <input type="radio" class="btn-check" id="duree-heure-modal" value="heure" v-model="newReservation.typeDuree" required>
                                            <label class="btn btn-outline-secondary w-100 btn-sm" for="duree-heure-modal" :class="{ 'active': newReservation.typeDuree === 'heure' }">Heure</label>
                                        </div>
                                        <div class="col-6 col-md-3">
                                            <input type="radio" class="btn-check" id="duree-demijournee-modal" value="demi-journee" v-model="newReservation.typeDuree" required>
                                            <label class="btn btn-outline-secondary w-100 btn-sm" for="duree-demijournee-modal" :class="{ 'active': newReservation.typeDuree === 'demi-journee' }">Demi-Journée</label>
                                        </div>
                                        <div class="col-6 col-md-3">
                                            <input type="radio" class="btn-check" id="duree-journee-modal" value="Jour" v-model="newReservation.typeDuree" required>
                                            <label class="btn btn-outline-secondary w-100 btn-sm" for="duree-journee-modal" :class="{ 'active': newReservation.typeDuree === 'Jour' }">Journée</label>
                                        </div>
                                        <div class="col-6 col-md-3">
                                            <input type="radio" class="btn-check" id="duree-parjour-modal" value="plus-jours" v-model="newReservation.typeDuree" required>
                                            <label class="btn btn-outline-secondary w-100 btn-sm" for="duree-parjour-modal" :class="{ 'active': newReservation.typeDuree === 'plus-jours' }">Plusieurs Jours</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tarif estimé -->
                            <div class="row g-3 align-items-center mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Tarif estimé</label>
                                </div>
                                <div class="col-md-9">
                                    <div class="p-2 border rounded bg-light text-end">
                                        <span class="cedii-text-primary fw-bold">{{ tarifEstime }} MGA</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Vérification disponibilité -->
                            <div v-if="disponibiliteCheck" class="row g-3 align-items-start mt-2">
                                <div class="col-md-3">
                                    <label class="col-form-label small fw-medium">Disponibilité</label>
                                </div>
                                <div class="col-md-9">
                                    <div class="alert py-2 mb-0" 
                                         :class="disponibiliteCheck.disponible ? 'alert-success' : 'alert-danger'">
                                        <i class="bi me-1" :class="disponibiliteCheck.disponible ? 'bi-check-circle' : 'bi-exclamation-circle'"></i>
                                        <small>
                                            {{ disponibiliteCheck.disponible ? 'Salle disponible' : 'Salle non disponible' }}
                                            <div v-if="disponibiliteCheck.conflits && disponibiliteCheck.conflits.length > 0" class="mt-1">
                                                <small>Conflits : {{ disponibiliteCheck.conflits.map(c => formatDateTime(c.debRes)).join(', ') }}</small>
                                            </div>
                                        </small>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer py-2">
                            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" class="btn btn-success btn-sm" :disabled="isSubmitting || !disponibiliteCheck?.disponible">
                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-check-circle me-1"></i>
                                {{ isSubmitting ? 'Création...' : 'Réserver' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import SalleService from '../services/SalleService';
import ReservationService from '../services/LocationService';
import ClientService from '../services/ClientService';
import * as bootstrap from 'bootstrap';

// États principaux
const salles = ref([]);
const currentSalle = ref({});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const showStatistiques = ref(false);
const selectedSalleForCalendar = ref(null);

// Filtres
const filters = ref({
    disponibilite: 'tous',
    search: ''
});

// États pour le calendrier
const currentView = ref('list');
const reservations = ref([]);
const calendarLoading = ref(false);
const currentMonth = ref(new Date());

// États pour la réservation
const newReservation = reactive({
    date: '',
    heureDebut: '',
    heureFin: '',
    idClient: '',
    nbPerso: 1,
    typeDuree: 'Jour'
});

const disponibiliteCheck = ref(null);
const clients = ref([]);
const tarifEstime = ref('0.00');
const isSubmitting = ref(false);

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
    fetchClients();
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
        const response = await SalleService.getAllSalles();
        salles.value = response.data;
    } catch (error) {
        showError("Erreur de chargement des salles: " + (error.response?.data?.message || error.message));
    }
}

async function fetchClients() {
    try {
        const response = await ClientService.getAllClients();
        clients.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des clients:", error);
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
        const response = await SalleService.getReservationsBySalleAndMonth(
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
    newReservation.date = date.toISOString().split('T')[0];
    newReservation.heureDebut = '08:00';
    newReservation.heureFin = '17:00';
    newReservation.idClient = '';
    newReservation.nbPerso = 1;
    newReservation.typeDuree = 'Jour';
    
    await updateTarifEstime();
    await checkDisponibilite();
    reservationModalInstance.show();
}

async function checkDisponibilite() {
    if (!selectedSalleForCalendar.value || !newReservation.date || !newReservation.heureDebut || !newReservation.heureFin) {
        disponibiliteCheck.value = null;
        return;
    }
    
    try {
        const response = await SalleService.checkDisponibilite(
            selectedSalleForCalendar.value.idSalle,
            `${newReservation.date}T${newReservation.heureDebut}`,
            `${newReservation.date}T${newReservation.heureFin}`
        );
        disponibiliteCheck.value = response.data;
    } catch (error) {
        console.error("Erreur de vérification de disponibilité:", error);
        disponibiliteCheck.value = null;
    }
}

async function createReservation() {
    isSubmitting.value = true;
    try {
        const reservationData = {
            idSalle: selectedSalleForCalendar.value.idSalle,
            idClient: newReservation.idClient,
            debRes: `${newReservation.date}T${newReservation.heureDebut}`,
            finRes: `${newReservation.date}T${newReservation.heureFin}`,
            typeRes: 'Salle',
            nbPerso: newReservation.nbPerso,
            tarifTot: parseFloat(tarifEstime.value),
            etatRes: 'Confirmée'
        };

        await ReservationService.createReservation(reservationData);
        showSuccess('Réservation créée avec succès');
        reservationModalInstance.hide();
        fetchCalendrierSalle();
    } catch (error) {
        showError("Erreur de création de réservation: " + (error.response?.data?.message || error.message));
    } finally {
        isSubmitting.value = false;
    }
}

// Fonction pour mettre à jour le tarif estimé
const updateTarifEstime = async () => {
    if (!selectedSalleForCalendar.value || !newReservation.typeDuree) {
        tarifEstime.value = '0.00';
        return;
    }

    try {
        const salle = selectedSalleForCalendar.value;
        let tarif = 0;

        switch (newReservation.typeDuree) {
            case 'heure':
                tarif = salle.tarifHeure || 0;
                break;
            case 'demi-journee':
                tarif = salle.tarifDemiJournee || 0;
                break;
            case 'Jour':
                tarif = salle.tarifJour || 0;
                break;
            case 'plus-jours':
                tarif = salle.tarifJour || 0;
                break;
            default:
                tarif = 0;
        }

        tarifEstime.value = tarif.toFixed(2);
        
    } catch (error) {
        console.error('Erreur calcul tarif:', error);
        tarifEstime.value = '0.00';
    }
};

// Watchers pour mettre à jour automatiquement le tarif
watch(() => newReservation.typeDuree, updateTarifEstime);
watch(() => selectedSalleForCalendar.value, updateTarifEstime);

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

function getStatusShort(status) {
    const shorts = {
        'Disponible': 'Disp.',
        'Occupée': 'Occupée',
        'Maintenance': 'Maint.'
    };
    return shorts[status] || status;
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
        minimumFractionDigits: 0 
    }).format(value) + ' Ar';
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
    border-radius: 6px;
    background-color: #f8f9fa;
}

/* Styles pour le tableau avec scroll */
.table-container {
    border: 1px solid #dee2e6;
    border-radius: 6px;
}
.table-container thead th {
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 2px solid #dee2e6;
}

/* Styles pour le calendrier compact */
.calendar-container {
    border: 1px solid #dee2e6;
    border-radius: 6px;
}
.calendar-grid.compact {
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
}
.day-header.compact {
    padding: 6px 2px;
    font-size: 0.8em;
}
.calendar-day.compact {
    min-height: 70px;
    padding: 3px;
    font-size: 0.8em;
}
.day-number.small {
    font-size: 0.9em;
}

.btn-xs {
    padding: 0.1rem 0.3rem;
    font-size: 0.7rem;
}

/* Amélioration du responsive */
@media (max-width: 768px) {
    .salle-management {
        padding: 0.5rem !important;
    }
    .card-body {
        padding: 0.5rem !important;
    }
    .table-container {
        font-size: 0.8rem;
    }
    .calendar-day.compact {
        min-height: 60px;
    }
}

/* Scrollbar personnalisée */
.table-container::-webkit-scrollbar,
.calendar-container::-webkit-scrollbar {
    width: 6px;
}
.table-container::-webkit-scrollbar-track,
.calendar-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}
.table-container::-webkit-scrollbar-thumb,
.calendar-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}
.table-container::-webkit-scrollbar-thumb:hover,
.calendar-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>