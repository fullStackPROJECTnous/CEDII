<template>
  <div class="container-fluid py-4">
    <h2 class="mb-4 cedii-text-dark">Gestion du Patrimoine : Salles</h2>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: currentTab === 'inventaire' }" 
          @click="currentTab = 'inventaire'">
          <i class="bi bi-list-check me-2"></i> Inventaire & Tarifs (CRUD)
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: currentTab === 'calendrier' }" 
          @click="currentTab = 'calendrier'">
          <i class="bi bi-calendar-check me-2"></i> Calendrier & Réservations
        </button>
      </li>
    </ul>

    <div v-if="currentTab === 'inventaire'">
      <button class="btn cedii-btn-primary mb-4" @click="openModal('create')">
        <i class="bi bi-plus-circle me-2"></i> Ajouter une Nouvelle Salle
      </button>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nom Salle</th>
                  <th>Numéro</th>
                  <th>Type</th>
                  <th>Capacité</th>
                  <th>Tarif/Jour (FCFA)</th>
                  <th>Disponibilité Actuelle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="salle in salles" :key="salle.idSalle">
                  <td>{{ salle.nomSalle }}</td>
                  <td>{{ salle.numeroSalle }}</td>
                  <td>{{ salle.typeEspace }}</td>
                  <td>{{ salle.capaciteSalle }} pers.</td>
                  <td>{{ salle.tarifSalle.toLocaleString() }}</td>
                  <td>
                    <span :class="['badge', getDispoClass(salle.disponibiliteSalle)]">
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

    <div v-if="currentTab === 'calendrier'">
      <div class="row mb-3">
        <div class="col-md-4">
          <select v-model="selectedSalleId" class="form-select">
            <option disabled value="">Sélectionnez une salle</option>
            <option v-for="salle in salles" :key="salle.idSalle" :value="salle.idSalle">
              {{ salle.nomSalle }} ({{ salle.numeroSalle }})
            </option>
          </select>
        </div>
      </div>

      <div class="card shadow-sm p-4">
        <p class="text-muted text-center py-5">
          <i class="bi bi-calendar3 me-2"></i> Intégrez ici un composant de calendrier pour visualiser les réservations et les conflits.
        </p>
        <div v-if="selectedSalleId" class="mt-3">
            <h5>Réservations pour {{ getSalleName(selectedSalleId) }} :</h5>
            <ul class="list-group">
                <li class="list-group-item" v-for="res in filteredReservations" :key="res.idRes">
                    {{ res.dateDebut }} - {{ res.dateFin }} : {{ res.client }} 
                    <span class="badge bg-warning text-dark ms-2">Conflit</span> 
                </li>
                 <li v-if="filteredReservations.length === 0" class="list-group-item text-muted">
                    Aucune réservation prévue pour cette salle.
                </li>
            </ul>
        </div>
      </div>
    </div>
    
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Modifier' : 'Créer' }} la Salle</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveSalle">
            <div class="modal-body">
              
              <div class="mb-3">
                <label for="nomSalle" class="form-label">Nom de la Salle *</label>
                <input type="text" id="nomSalle" v-model="currentSalle.nomSalle" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="numeroSalle" class="form-label">Numéro de Salle *</label>
                <input type="text" id="numeroSalle" v-model="currentSalle.numeroSalle" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="typeEspace" class="form-label">Type d'Espace *</label>
                <select id="typeEspace" v-model="currentSalle.typeEspace" class="form-select" required>
                  <option value="salle de formation">Salle de formation</option>
                  <option value="espace bibliothécaire">Espace bibliothécaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="capaciteSalle" class="form-label">Capacité d'Accueil (max) *</label>
                <input type="number" id="capaciteSalle" v-model.number="currentSalle.capaciteSalle" class="form-control" required min="1" />
              </div>

              <hr>

              <h5>Tarification (FCFA)</h5>
              <div class="row">
                  <div class="col-4 mb-3">
                    <label for="tarifJour" class="form-label">Par Jour *</label>
                    <input type="number" id="tarifJour" v-model.number="currentSalle.tarifSalle" class="form-control" required min="0" />
                  </div>
                  <div class="col-4 mb-3">
                    <label for="tarifDemiJour" class="form-label">Demi-Journée</label>
                    <input type="number" id="tarifDemiJour" v-model.number="currentSalle.tarifDemiJour" class="form-control" min="0" />
                  </div>
                  <div class="col-4 mb-3">
                    <label for="tarifHeure" class="form-label">Par Heure</label>
                    <input type="number" id="tarifHeure" v-model.number="currentSalle.tarifHeure" class="form-control" min="0" />
                  </div>
              </div>
              
              <div class="mb-3">
                <label for="disponibiliteSalle" class="form-label">Statut Actuel *</label>
                <select id="disponibiliteSalle" v-model="currentSalle.disponibiliteSalle" class="form-select" required>
                  <option value="Disponible">Disponible</option>
                  <option value="Occupée">Occupée</option>
                  <option>Maintenance</option>
                </select>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn cedii-btn-primary" :disabled="isLoading">
                {{ isEditMode ? 'Sauvegarder' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SalleService from '../services/SalleService'; // Le service que vous avez fourni

const currentTab = ref('inventaire'); // 'inventaire' ou 'calendrier'

// --- Données d'état du composant ---
const salles = ref([]);
const reservations = ref([]); 
const selectedSalleId = ref('');

const currentSalle = ref({});
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');


// --- DONNÉES DE DÉMO POUR LES RÉSERVATIONS (Calendrier) ---
// Ces données simulent la présence de réservations. Vous devrez créer un service
// ReservationService ou étendre SalleService pour les récupérer réellement.
reservations.value = [
    { idRes: 1, idSalle: 2, dateDebut: '2025-10-15 09:00', dateFin: '2025-10-15 17:00', client: 'Alpha Corp', hasConflict: false },
    { idRes: 2, idSalle: 1, dateDebut: '2025-10-20 14:00', dateFin: '2025-10-20 18:00', client: 'Beta PME', hasConflict: true },
];
// -------------------------------------------------------------------


// Création d'un gabarit pour une nouvelle salle
const newSalleTemplate = () => ({
    nomSalle: '',
    numeroSalle: '',
    typeEspace: 'salle de formation', 
    capaciteSalle: 10,
    tarifSalle: 50000, // Tarif Jour (obligatoire pour la BDD)
    tarifDemiJour: null,
    tarifHeure: null,
    disponibiliteSalle: 'Disponible',
});


onMounted(() => {
  fetchSalles();
});


// --- LOGIQUE D'AFFICHAGE & CALCUL ---

function getDispoClass(dispo) {
    if (dispo === 'Disponible') return 'bg-success';
    if (dispo === 'Occupée') return 'bg-warning text-dark';
    if (dispo === 'Maintenance') return 'bg-danger';
    return 'bg-secondary';
}

function getSalleName(id) {
    const salle = salles.value.find(s => s.idSalle === id);
    return salle ? salle.nomSalle : 'Salle inconnue';
}

const filteredReservations = computed(() => {
    if (!selectedSalleId.value) return [];
    return reservations.value
        .filter(res => res.idSalle === selectedSalleId.value)
        .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
});


// --- LOGIQUE CRUD (Interactions avec SalleService) ---

/**
 * Récupère toutes les salles via l'API.
 */
async function fetchSalles() {
  isLoading.value = true;
  try {
    const response = await SalleService.getAll();
    salles.value = response;
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des salles. Assurez-vous que le backend est en cours d'exécution.";
    // Afficher une alerte ou un message dans le tableau si l'API est injoignable
    salles.value = []; 
  } finally {
    isLoading.value = false;
  }
}

function openModal(mode, salle = null) {
  isEditMode.value = mode === 'edit';
  errorMessage.value = '';
  // Utilise les champs tarifaires étendus (même s'ils ne sont pas en BDD pour l'instant)
  currentSalle.value = isEditMode.value ? { ...salle } : newSalleTemplate(); 
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentSalle.value = newSalleTemplate();
}

/**
 * Sauvegarde (Création ou Mise à jour) d'une salle.
 */
async function saveSalle() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 1. Préparation des données: Sequelize est strict sur les champs NOT NULL.
    // S'assurer que les champs tarifaires non obligatoires sont envoyés comme 0 ou null.
    const dataToSend = { ...currentSalle.value };
    
    // Si tarifDemiJour/tarifHeure n'existent pas dans le modèle BDD, ils doivent être ignorés.
    // Si vous décidez d'étendre votre modèle Sequelize, ceci garantit qu'ils sont des nombres.
    if (dataToSend.tarifDemiJour === null || dataToSend.tarifDemiJour === '') dataToSend.tarifDemiJour = 0;
    if (dataToSend.tarifHeure === null || dataToSend.tarifHeure === '') dataToSend.tarifHeure = 0;

    // 2. Appel API
    if (isEditMode.value) {
      await SalleService.update(currentSalle.value.idSalle, dataToSend);
      alert(`Salle ${currentSalle.value.nomSalle} mise à jour avec succès.`);
    } else {
      await SalleService.create(dataToSend);
      alert('Nouvelle salle créée avec succès.');
    }
    
    closeModal();
    fetchSalles(); // Recharger les données après succès
    
  } catch (error) {
    // Gérer l'erreur "notNull Violation" ou toute autre erreur de validation
    const apiMessage = error.response?.data?.error || error.response?.data?.message;
    errorMessage.value = apiMessage || "Échec de l'opération. Vérifiez que le formulaire est complet et valide.";
  } finally {
    isLoading.value = false;
  }
}

/**
 * Suppression d'une salle.
 */
async function deleteSalle(idSalle) {
  const salle = salles.value.find(s => s.idSalle === idSalle);
  if (confirm(`Êtes-vous sûr de vouloir supprimer la salle "${salle.nomSalle}" ? Cette action est irréversible.`)) {
    try {
      await SalleService.delete(idSalle);
      alert(`Salle ${salle.nomSalle} a été supprimée.`); 
      fetchSalles(); // Recharger les données après suppression
    } catch (error) {
      alert("Erreur lors de la suppression de la salle.");
    }
  }
}
</script>

<style scoped>
/* Les styles CEDII sont nécessaires pour le rendu */
:root {
  --cedii-primary-light: #5B11EE;
  --cedii-primary-dark: #0405BF;
  --cedii-dark: #02061E;
}
.cedii-btn-primary {
  background-color: var(--cedii-primary-light, #5B11EE); 
  border-color: var(--cedii-primary-light, #5B11EE);
  color: white;
}
.cedii-btn-primary:hover {
  background-color: var(--cedii-primary-dark, #0405BF);
  border-color: var(--cedii-primary-dark, #0405BF);
}
.cedii-text-dark {
  color: var(--cedii-dark, #02061E);
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-dialog {
  max-width: 700px;
}
</style>