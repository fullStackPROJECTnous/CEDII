
<template>
  <div class="salle-management-container">
    <!-- EN-TÊTE AMÉLIORÉE -->
    <div class="page-header mb-4">
      <div class="header-container p-4 rounded-4 shadow-sm">
        <!-- Première ligne : Titre principal et badge -->
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon-container">
              <i class="bi bi-door-open-fill header-icon"></i>
            </div>
            <div>
              <h1 class="header-title mb-0">Salles CEDII</h1>
              <p class="header-subtitle mb-0 text-muted">Administration complète du parc immobilier</p>
            </div>
          </div>
          
          <n-tag type="info" size="large" class="custom-tag">
            <template #icon>
              <n-icon>
                <i class="bi bi-building"></i>
              </n-icon>
            </template>
            {{ statistiques.total }} salles
          </n-tag>
        </div>
        
        
        <!-- Troisième ligne : Actions rapides -->
        <div class="header-actions mt-4 pt-3 border-top">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
              <n-button type="primary" size="small" class="action-btn" @click="openModal('add')">
                <template #icon>
                  <i class="bi bi-plus-circle"></i>
                </template>
                Ajouter une salle
              </n-button>
              <n-button type="info" ghost size="small" class="action-btn" @click="fetchSalles">
                <template #icon>
                  <i class="bi bi-arrow-clockwise"></i>
                </template>
                Actualiser
              </n-button>
              <n-button type="default" ghost size="small" class="action-btn" @click="resetFilters">
                <template #icon>
                  <i class="bi bi-funnel"></i>
                </template>
                Réinitialiser filtres
              </n-button>
            </div>
            
           
          </div>
        </div>
      </div>
    </div>

    <!-- Messages d'alerte -->
    <n-alert
      v-if="message"
      :type="isError ? 'error' : 'success'"
      :title="isError ? 'Erreur' : 'Succès'"
      class="mb-4"
      closable
      @close="message = ''"
    >
      {{ message }}
    </n-alert>

    <!-- VUE LISTE DES SALLES -->
    <div v-if="currentView === 'list'" class="list-view">
      <!-- Filtres avancés -->
      <n-card class="filters-card mb-4">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <n-form-item label="Disponibilité" size="small">
              <n-select
                v-model:value="filters.disponibilite"
                :options="disponibiliteOptions"
                placeholder="Tous les statuts"
                @update:value="fetchSalles"
              />
            </n-form-item>
          </div>
          <div class="col-md-6">
            <n-form-item label="Recherche" size="small">
              <n-input
                v-model:value="filters.search"
                placeholder="Rechercher par nom, numéro..."
                clearable
                @input="onSearchInput"
              >
                <template #prefix>
                  <n-icon><i class="bi bi-search"></i></n-icon>
                </template>
              </n-input>
            </n-form-item>
          </div>
          <div class="col-md-3">
            <div class="d-flex gap-2">
              <n-form-item label=" " size="small" style="flex: 1">
                <n-button class="w-100" @click="resetFilters" ghost>
                  <template #icon>
                    <n-icon><i class="bi bi-arrow-clockwise"></i></n-icon>
                  </template>
                  Réinitialiser
                </n-button>
              </n-form-item>
            </div>
          </div>
        </div>
      </n-card>

      <!-- Tableau des salles -->
      <n-card class="main-card">
        <template #header>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="d-flex align-items-center gap-2">
                <div class="card-icon">
                  <i class="bi bi-list-ul"></i>
                </div>
                <div>
                  <h3 class="card-title mb-0">Liste des Salles</h3>
                  <p class="card-subtitle text-muted mb-0">
                    {{ filteredSalles.length }} salle(s) trouvée(s) - <span class="text-success">{{ statistiques.disponibles }} disponible(s)</span>
                  </p>
                </div>
              </div>
            </div>
           
          </div>
        </template>

        <div class="table-scroll-container">
          <n-data-table
            :columns="tableColumns"
            :data="filteredSalles"
            :bordered="false"
            :loading="isLoading"
            size="small"
            class="salles-table"
            :row-class-name="getRowClass"
            @dblclick="onRowDblclick"
          />
        </div>

        <template #footer>
          <div class="d-flex justify-content-between align-items-center">
            
            <n-text depth="3" class="small">
              Capacité totale : {{ totalCapacite }} personnes
            </n-text>
          </div>
        </template>
      </n-card>
    </div>


    <!-- Modal Salle -->
    <n-modal
      v-model:show="showSalleModal"
      preset="dialog"
      :title="isEditMode ? 'Modifier la Salle' : 'Ajouter une Salle'"
      positive-text="Sauvegarder"
      negative-text="Annuler"
      :loading="isLoading"
      @positive-click="saveSalle"
      @negative-click="showSalleModal = false"
      style="width: 600px"
    >
      <n-form :model="currentSalle" :rules="salleRules" ref="salleFormRef">
        <n-grid :cols="2" :x-gap="12" :y-gap="12">
          <n-gi :span="2">
            <n-form-item label="Nom de la salle" path="nomSalle">
              <n-input v-model:value="currentSalle.nomSalle" placeholder="Ex: Salle de conférence" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Numéro/Code" path="numeroSalle">
              <n-input v-model:value="currentSalle.numeroSalle" placeholder="Ex: A001" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Capacité" path="capaciteSalle">
              <n-input-number v-model:value="currentSalle.capaciteSalle" :min="1" class="w-100" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Tarif/heure (MGA)" path="tarifHeure">
              <n-input-number v-model:value="currentSalle.tarifHeure" :min="0" class="w-100">
                <template #suffix>MGA</template>
              </n-input-number>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Tarif/demi-journée (MGA)" path="tarifDemiJournee">
              <n-input-number v-model:value="currentSalle.tarifDemiJournee" :min="0" class="w-100">
                <template #suffix>MGA</template>
              </n-input-number>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="Tarif/jour (MGA)" path="tarifJour">
              <n-input-number v-model:value="currentSalle.tarifJour" :min="0" class="w-100">
                <template #suffix>MGA</template>
              </n-input-number>
            </n-form-item>
          </n-gi>
          <n-gi :span="2">
            <n-form-item label="Statut" path="disponibiliteSalle">
              <n-select
                v-model:value="currentSalle.disponibiliteSalle"
                :options="disponibiliteOptions"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>
    </n-modal>

    <!-- Modal Réservation -->
    <n-modal
      v-model:show="showReservationModal"
      preset="dialog"
      title="Nouvelle Réservation"
      positive-text="Réserver"
      negative-text="Annuler"
      :loading="isSubmitting"
      @positive-click="createReservation"
      @negative-click="showReservationModal = false"
      style="width: 500px"
    >
      <n-form :model="newReservation" :rules="reservationRules" ref="reservationFormRef">
        <n-space vertical :size="16">
          <n-form-item label="Salle" path="salle">
            <n-input
              :value="selectedSalleForCalendar ? `${selectedSalleForCalendar.nomSalle} (${selectedSalleForCalendar.numeroSalle})` : ''"
              disabled
            />
          </n-form-item>
          
          <n-form-item label="Date" path="date">
            <n-date-picker
              v-model:value="newReservation.date"
              type="date"
              class="w-100"
              @update:value="checkDisponibilite"
            />
          </n-form-item>
          
          <n-grid :cols="2" :x-gap="12">
            <n-gi>
              <n-form-item label="Heure début" path="heureDebut">
                <n-time-picker
                  v-model:value="newReservation.heureDebut"
                  class="w-100"
                  @update:value="checkDisponibilite"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Heure fin" path="heureFin">
                <n-time-picker
                  v-model:value="newReservation.heureFin"
                  class="w-100"
                  @update:value="checkDisponibilite"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
          
          <n-form-item label="Client" path="idClient">
            <n-select
              v-model:value="newReservation.idClient"
              :options="clientOptions"
              placeholder="Sélectionner un client"
            />
          </n-form-item>
          
          <n-form-item label="Nombre de personnes" path="nbPerso">
            <n-input-number v-model:value="newReservation.nbPerso" :min="1" class="w-100" />
          </n-form-item>
          
          <n-form-item label="Type de durée" path="typeDuree">
            <n-radio-group v-model:value="newReservation.typeDuree">
              <n-space>
                <n-radio value="heure">Heure</n-radio>
                <n-radio value="demi-journee">Demi-journée</n-radio>
                <n-radio value="Jour">Journée</n-radio>
                <n-radio value="plus-jours">Plusieurs jours</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          
          <n-card v-if="tarifEstime > 0" class="tarif-card">
            <n-statistic label="Tarif estimé" :value="tarifEstime">
              <template #suffix>MGA</template>
            </n-statistic>
          </n-card>
          
          <n-alert
            v-if="disponibiliteCheck"
            :type="disponibiliteCheck.disponible ? 'success' : 'error'"
            :title="disponibiliteCheck.disponible ? 'Disponible' : 'Non disponible'"
          >
            {{ disponibiliteCheck.message }}
          </n-alert>
        </n-space>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, h } from 'vue';
import { NButton, NTag, NIcon, NText, NAlert, NFormItem, NSelect, NInput, NCard, NStatistic, NProgress } from 'naive-ui';
import SalleService from '../services/SalleService';
import ReservationService from '../services/LocationService';
import ClientService from '../services/ClientService';

// États principaux
const salles = ref([]);
const currentSalle = ref({});
const isEditMode = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const showSalleModal = ref(false);
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
  date: null,
  heureDebut: null,
  heureFin: null,
  idClient: null,
  nbPerso: 1,
  typeDuree: 'Jour'
});

const disponibiliteCheck = ref(null);
const clients = ref([]);
const tarifEstime = ref(0);
const isSubmitting = ref(false);
const showReservationModal = ref(false);

// Références des formulaires
const salleFormRef = ref(null);
const reservationFormRef = ref(null);

// Options pour les selects
const disponibiliteOptions = [
  { label: 'Tous les statuts', value: 'tous' },
  { label: 'Disponible', value: 'Disponible' },
  { label: 'Occupée', value: 'Occupée' },
  { label: 'Maintenance', value: 'Maintenance' }
];

const clientOptions = computed(() => {
  return clients.value.map(client => ({
    label: `${client.nomCli} ${client.prenomCli}`,
    value: client.idCli
  }));
});

// Propriétés calculées améliorées
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
      salle.nomSalle?.toLowerCase().includes(searchLower) ||
      salle.numeroSalle?.toLowerCase().includes(searchLower)
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
    days.push({ 
      date, 
      isCurrentMonth: false, 
      isWeekend: date.getDay() === 0 || date.getDay() === 6 
    });
  }

  // Jours du mois courant
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({ 
      date, 
      isCurrentMonth: true, 
      isWeekend: date.getDay() === 0 || date.getDay() === 6 
    });
  }

  return days;
});

const statistiques = computed(() => {
  const total = salles.value.length;
  const disponibles = salles.value.filter(s => s.disponibiliteSalle === 'Disponible').length;
  const occupees = salles.value.filter(s => s.disponibiliteSalle === 'Occupée').length;
  const maintenance = salles.value.filter(s => s.disponibiliteSalle === 'Maintenance').length;

  return { total, disponibles, occupees, maintenance };
});

const tauxOccupation = computed(() => {
  if (statistiques.value.total === 0) return 0;
  const taux = Math.round((statistiques.value.occupees / statistiques.value.total) * 100);
  return Math.min(taux, 100);
});

const totalTarifJournalier = computed(() => {
  return filteredSalles.value.reduce((sum, salle) => sum + (salle.tarifJour || 0), 0);
});

const totalCapacite = computed(() => {
  return filteredSalles.value.reduce((sum, salle) => sum + (salle.capaciteSalle || 0), 0);
});

// Configuration des colonnes du tableau
const tableColumns = computed(() => [
  {
    title: 'ID',
    key: 'idSalle',
    width: 80,
    render: (row) => h('span', { class: 'fw-bold' }, row.idSalle)
  },
  {
    title: 'Nom',
    key: 'nomSalle',
    ellipsis: true
  },
  {
    title: 'Numéro',
    key: 'numeroSalle',
    width: 100
  },
  {
    title: 'Capacité',
    key: 'capaciteSalle',
    width: 100,
    render: (row) => `${row.capaciteSalle}p`
  },
  {
    title: 'Tarif/H',
    key: 'tarifHeure',
    width: 120,
    render: (row) => formatCurrency(row.tarifHeure)
  },
  {
    title: 'Tarif/½J',
    key: 'tarifDemiJournee',
    width: 120,
    render: (row) => formatCurrency(row.tarifDemiJournee)
  },
  {
    title: 'Tarif/J',
    key: 'tarifJour',
    width: 120,
    render: (row) => formatCurrency(row.tarifJour)
  },

  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (row) => h('div', { class: 'action-buttons' }, [
    
      h(NButton, {
        size: 'small',
        type: 'info',
        ghost: true,
        onClick: () => openModal('edit', row),
        class: 'me-1'
      }, {
        icon: () => h('i', { class: 'bi bi-pencil' })
      }),
      h(NButton, {
        size: 'small',
        type: 'error',
        ghost: true,
        onClick: () => deleteSalle(row.idSalle)
      }, {
        icon: () => h('i', { class: 'bi bi-trash' })
      })
    ])
  }
]);

// Règles de validation
const salleRules = {
  nomSalle: {
    required: true,
    message: 'Le nom de la salle est requis',
    trigger: 'blur'
  },
  numeroSalle: {
    required: true,
    message: 'Le numéro de salle est requis',
    trigger: 'blur'
  },
  capaciteSalle: {
    required: true,
    type: 'number',
    min: 1,
    message: 'La capacité doit être au moins 1',
    trigger: 'blur'
  }
};

const reservationRules = {
  date: {
    required: true,
    message: 'La date est requise',
    trigger: 'blur'
  },
  idClient: {
    required: true,
    message: 'Le client est requis',
    trigger: 'blur'
  }
};

// Cycle de vie
onMounted(() => {
  fetchSalles();
  fetchClients();
});

// Fonctions principales
async function fetchSalles() {
  try {
    isLoading.value = true;
    const response = await SalleService.getAllSalles();
    salles.value = response.data || [];
  } catch (error) {
    showError("Erreur de chargement des salles: " + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
}

async function fetchClients() {
  try {
    const response = await ClientService.getAllClients();
    clients.value = response.data || [];
  } catch (error) {
    console.error("Erreur de chargement des clients:", error);
  }
}

async function saveSalle() {
  try {
    if (salleFormRef.value) {
      await salleFormRef.value.validate();
    }

    isLoading.value = true;
    if (isEditMode.value) {
      await SalleService.updateSalle(currentSalle.value.idSalle, currentSalle.value);
      showSuccess('Salle modifiée avec succès');
    } else {
      await SalleService.createSalle(currentSalle.value);
      showSuccess('Salle ajoutée avec succès');
    }
    await fetchSalles();
    showSalleModal.value = false;
  } catch (error) {
    if (error.errors) {
      showError("Veuillez corriger les erreurs du formulaire");
    } else {
      showError("Erreur de sauvegarde: " + (error.response?.data?.message || error.message));
    }
  } finally {
    isLoading.value = false;
  }
}

async function deleteSalle(idSalle) {
  const salle = salles.value.find(s => s.idSalle === idSalle);
  if (!salle) return;

  if (!confirm(`Êtes-vous sûr de vouloir supprimer la salle "${salle.nomSalle}" ?`)) return;
  
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

  showSalleModal.value = true;
}

function onRowDblclick(row) {
  openCalendar(row);
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
    reservations.value = response.data || [];
  } catch (error) {
    console.error("Erreur de chargement du calendrier:", error);
    reservations.value = [];
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
  newReservation.date = date.getTime();
  newReservation.heureDebut = Date.now();
  newReservation.heureFin = Date.now() + 3600000; // +1 heure
  newReservation.idClient = null;
  newReservation.nbPerso = 1;
  newReservation.typeDuree = 'Jour';
  
  await updateTarifEstime();
  await checkDisponibilite();
  showReservationModal.value = true;
}

async function checkDisponibilite() {
  if (!selectedSalleForCalendar.value || !newReservation.date) {
    disponibiliteCheck.value = null;
    return;
  }
  
  try {
    const dateStr = new Date(newReservation.date).toISOString().split('T')[0];
    const heureDebutStr = new Date(newReservation.heureDebut).toTimeString().split(' ')[0];
    const heureFinStr = new Date(newReservation.heureFin).toTimeString().split(' ')[0];
    
    const response = await SalleService.checkDisponibilite(
      selectedSalleForCalendar.value.idSalle,
      `${dateStr}T${heureDebutStr}`,
      `${dateStr}T${heureFinStr}`
    );
    disponibiliteCheck.value = response.data;
  } catch (error) {
    console.error("Erreur de vérification de disponibilité:", error);
    disponibiliteCheck.value = null;
  }
}

async function createReservation() {
  try {
    if (reservationFormRef.value) {
      await reservationFormRef.value.validate();
    }

    isSubmitting.value = true;
    const reservationData = {
      idSalle: selectedSalleForCalendar.value.idSalle,
      idClient: newReservation.idClient,
      debRes: new Date(newReservation.heureDebut).toISOString(),
      finRes: new Date(newReservation.heureFin).toISOString(),
      typeRes: 'Salle',
      nbPerso: newReservation.nbPerso,
      tarifTot: parseFloat(tarifEstime.value),
      etatRes: 'Confirmée'
    };

    await ReservationService.createReservation(reservationData);
    showSuccess('Réservation créée avec succès');
    showReservationModal.value = false;
    fetchCalendrierSalle();
  } catch (error) {
    if (error.errors) {
      showError("Veuillez corriger les erreurs du formulaire");
    } else {
      showError("Erreur de création de réservation: " + (error.response?.data?.message || error.message));
    }
  } finally {
    isSubmitting.value = false;
  }
}

// Fonction pour mettre à jour le tarif estimé
const updateTarifEstime = async () => {
  if (!selectedSalleForCalendar.value || !newReservation.typeDuree) {
    tarifEstime.value = 0;
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

    tarifEstime.value = tarif;
  } catch (error) {
    console.error('Erreur calcul tarif:', error);
    tarifEstime.value = 0;
  }
};

// Watchers pour mettre à jour automatiquement le tarif
watch(() => newReservation.typeDuree, updateTarifEstime);
watch(() => selectedSalleForCalendar.value, updateTarifEstime);

// Fonctions utilitaires
function resetFilters() {
  filters.value = { disponibilite: 'tous', search: '' };
}

function onSearchInput() {
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {
    // Le filtrage se fait automatiquement via computed
  }, 500);
}

function getResourceTagType(status) {
  const types = {
    'Disponible': 'success',
    'Occupée': 'warning',
    'Maintenance': 'error'
  };
  return types[status] || 'default';
}

function getStatusText(status) {
  const texts = {
    'Disponible': 'Disponible',
    'Occupée': 'Occupée',
    'Maintenance': 'Maintenance'
  };
  return texts[status] || status;
}

function getRowClass(row) {
  if (row.disponibiliteSalle === 'Maintenance') return 'table-row-maintenance';
  if (row.disponibiliteSalle === 'Occupée') return 'table-row-occupied';
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

const formatTime = (datetime) => {
  if (!datetime) return '';
  return new Date(datetime).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const exportData = () => {
  const data = filteredSalles.value.map(salle => ({
    ID: salle.idSalle,
    Nom: salle.nomSalle,
    Numéro: salle.numeroSalle,
    Capacité: salle.capaciteSalle,
    'Tarif/heure': formatCurrency(salle.tarifHeure),
    'Tarif/demi-journée': formatCurrency(salle.tarifDemiJournee),
    'Tarif/jour': formatCurrency(salle.tarifJour),
    Statut: getStatusText(salle.disponibiliteSalle)
  }));
  
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `salles-cedii-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
  
  message.value = 'Exportation des données effectuée';
  isError.value = false;
};
</script>

<style scoped>
.salle-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* STYLES DU HEADER AMÉLIORÉ */
.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid rgba(4, 5, 143, 0.1);
}

.header-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.header-icon-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #04058f 0%, #5811EE 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 2rem;
  color: white;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #02061E;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.custom-tag {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2);
}

/* Cartes d'informations */
.info-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.1);
  border-color: rgba(88, 17, 238, 0.2);
}

.info-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #02061E;
}

/* Boutons d'actions */
.action-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-width: 2px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Cards */
.main-card, .filters-card, .stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

/* Icone de carte */
.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5811EE;
}

/* Table */
.table-scroll-container {
  max-height: 500px;
  overflow-y: auto;
}

:deep(.salles-table .n-data-table-thead) {
  background-color: #f8f9fa;
}

:deep(.salles-table .n-data-table-th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #5B11EE;
}

:deep(.salles-table .n-data-table-tr--hover) {
  background-color: #f8f9ff !important;
  cursor: pointer;
}

:deep(.table-row-maintenance) {
  background-color: #fff2f0 !important;
}

:deep(.table-row-occupied) {
  background-color: #fffbe6 !important;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

/* Calendar */
.calendar-scroll-container {
  max-height: 600px;
  overflow-y: auto;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-day-header {
  padding: 12px 8px;
  background-color: #5B11EE;
  color: white;
  font-weight: 600;
  text-align: center;
  font-size: 0.9rem;
}

.calendar-day {
  min-height: 120px;
  padding: 8px;
  background-color: white;
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.calendar-day.today {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.calendar-day.reserved {
  background-color: #fff2f0;
  border-color: #ffccc7;
}

.calendar-day.weekend {
  background-color: #fafafa;
}

.calendar-day.other-month {
  background-color: #f5f5f5;
  color: #d9d9d9;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.day-number {
  font-weight: 600;
  font-size: 0.9rem;
}

.reservations-list {
  flex: 1;
  overflow-y: auto;
}

.reservation-item {
  padding: 2px 4px;
  margin-bottom: 2px;
  background-color: #f0f0f0;
  border-radius: 3px;
  font-size: 0.75rem;
}

.reserve-btn {
  margin-top: auto;
}

/* Legend */
.calendar-legend {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.available {
  background-color: #52c41a;
}

.legend-color.reserved {
  background-color: #ff4d4f;
}

.legend-color.today {
  background-color: #1890ff;
}

/* Tarif Card */
.tarif-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border: 1px solid #5B11EE;
}

/* Palette CEDII */
.cedii-text-primary { 
  color: #5B11EE !important; 
}

:deep(.n-button--primary-type) {
  background-color: #5B11EE !important;
  border-color: #5B11EE !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: #04058F !important;
  border-color: #04058F !important;
}

/* Scrollbars */
.table-scroll-container::-webkit-scrollbar,
.calendar-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.table-scroll-container::-webkit-scrollbar-track,
.calendar-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-scroll-container::-webkit-scrollbar-thumb,
.calendar-scroll-container::-webkit-scrollbar-thumb {
  background: #5B11EE;
  border-radius: 3px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover,
.calendar-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #04058F;
}

/* Responsive */
@media (max-width: 768px) {
  .salle-management-container {
    padding: 12px;
  }
  
  .header-container {
    padding: 1.5rem !important;
  }
  
  .header-icon-container {
    width: 50px;
    height: 50px;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .header-info-row .row {
    flex-direction: column;
  }
  
  .header-actions .d-flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch !important;
  }
  
  .action-btn {
    width: 100%;
  }
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
  
  .calendar-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .calendar-day {
    min-height: 80px;
  }
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.25rem;
  }
  
  .custom-tag {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .info-card {
    padding: 1rem !important;
  }
  
  .action-btn {
    font-size: 0.85rem;
  }
  
  .table-scroll-container {
    font-size: 0.8rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>