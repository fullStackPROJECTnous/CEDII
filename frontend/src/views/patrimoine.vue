<template>
    <div class="retour">
     <router-link to="/home" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="patrimoine-management p-3 bg-white rounded shadow-sm">
    <h3 class="mb-4">Inventaire et Patrimoine</h3>
    
    <ul class="nav nav-tabs mb-4">
        </ul>

    <div class="tab-content">
      <div v-if="activeTab === 'salles'" class="tab-pane fade show active">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>Liste des Salles ({{ salles.length }})</h5>
          <button class="btn btn-sm cedii-btn-primary" @click="addSalle">
            <i class="bi bi-plus-lg me-1"></i> Ajouter une Salle
          </button>
        </div>
        
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nom Salle</th>
                <th>Numéro</th> <th>Capacité</th> <th>Tarif (Jour)</th> <th>Statut</th> <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="salle in salles" :key="salle.idSalle">
                <td>{{ salle.nomSalle }}</td>
                <td>{{ salle.numeroSalle }}</td> 
                <td>{{ salle.capaciteSalle }} pers.</td> 
                <td>{{ formatCurrency(salle.tarifSalle) }}</td> 
                <td><span :class="getStatusBadge(salle.disponibiliteSalle)">{{ salle.disponibiliteSalle }}</span></td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="editSalle(salle.idSalle)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteSalle(salle.idSalle)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'equipements'" class="tab-pane fade show active">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>Liste des Équipements ({{ equipements.length }})</h5>
          <button class="btn btn-sm cedii-btn-primary" @click="addEquipement">
            <i class="bi bi-plus-lg me-1"></i> Ajouter un Équipement
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Code Mat</th> <th>Désignation</th> <th>Catégorie</th> <th>Qté Totale</th> <th>Qté Actuelle Dispo</th> <th>Tarif Location</th> <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="equipement in equipements" :key="equipement.codeMat">
                <td>{{ equipement.codeMat }}</td>
                <td>{{ equipement.designationMat }}</td>
                <td>{{ equipement.categorieMat }}</td>
                <td>{{ equipement.qteTotDispo }}</td>
                <td><span :class="getAvailabilityBadge(equipement.qteActuelDispo)">{{ equipement.qteActuelDispo }}</span></td>
                <td>{{ formatCurrency(equipement.tarifLocation) }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="editMateriel(equipement.codeMat)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteMateriel(equipement.codeMat)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PatrimoineService from '../services/PatrimoineService'; 

const activeTab = ref('salles');
const salles = ref([]);
const equipements = ref([]);

// --- Fonctions de chargement des données ---

const fetchSalles = async () => {
    try {
        const response = await PatrimoineService.getAllSalles();
        salles.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement des salles:", error);
    }
};

const fetchEquipements = async () => {
    try {
        const response = await PatrimoineService.getAllMateriel();
        equipements.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement du matériel:", error);
    }
};

onMounted(() => {
    fetchSalles();
    fetchEquipements();
});

// --- Fonctions utilitaires ---

const formatCurrency = (value) => {
    if (!value) return '0,00 MGA'; // Assurez-vous d'utiliser la bonne devise
    return `${parseFloat(value).toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const getStatusBadge = (statut) => {
    if (statut === 'Disponible') return 'badge bg-success';
    if (statut === 'Occupée') return 'badge bg-warning text-dark';
    return 'badge bg-danger';
};

const getAvailabilityBadge = (quantity) => {
    if (quantity > 5) return 'badge bg-success';
    if (quantity > 0) return 'badge bg-warning text-dark';
    return 'badge bg-danger';
};

// --- Fonctions CRUD (Exemples d'appel au service) ---

const deleteSalle = async (idSalle) => {
    if (confirm(`Voulez-vous vraiment supprimer la salle #${idSalle} ?`)) {
        try {
            await PatrimoineService.deleteSalle(idSalle); // Implémentez la fonction de suppression dans le controller
            fetchSalles();
        } catch (error) {
            alert("Erreur lors de la suppression.");
            console.error(error);
        }
    }
};

const deleteMateriel = async (codeMat) => {
    if (confirm(`Voulez-vous vraiment supprimer le matériel ${codeMat} ?`)) {
        try {
            await PatrimoineService.deleteMateriel(codeMat);
            fetchEquipements();
        } catch (error) {
            alert("Erreur lors de la suppression.");
            console.error(error);
        }
    }
};

// Fonctions d'ajout/édition (à développer)
const addSalle = () => { /* ... */ };
const editSalle = (id) => { /* ... */ };
const addEquipement = () => { /* ... */ };
const editMateriel = (codeMat) => { /* ... */ };

</script>

<style scoped>
/* Les styles de base restent inchangés (cedii-btn-primary, nav-tabs, etc.) */
/* Style personnalisé pour les boutons CEDII */
.cedii-btn-primary {
    background-color: var(--cedii-primary-light, #5B11EE);
    border-color: var(--cedii-primary-light, #5B11EE);
    color: white;
}
/* Styles de base pour le modal (à remplacer par une implémentation réelle) */
.modal-placeholder {
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
.modal-content-simulated {
    width: 450px;
    border-radius: 8px;
}
</style>