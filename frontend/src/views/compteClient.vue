<!--<template>
  <div class="p-4">
    <h1>Mon Compte Client 👤</h1>
    <p>Historique de mes locations et mes informations personnelles.</p>
    </div>
</template>
<script setup>
// Logique Client
</script>

<template>
  <div class="vh-100 d-flex flex-column"> 

    <ClientNavbar />

    <main class="main-content flex-grow-1 overflow-auto bg-light p-4"> 
      
      <header class="pb-3 border-bottom d-flex justify-content-between align-items-center">
        <h1 class="text-secondary">Bienvenue, {{ clientName }} !</h1>
        <p class="text-muted mb-0">Espace Client</p>
      </header>
      
      <div class="mt-4">
        <h2 class="h4 mb-4 cedii-text-primary"><i class="bi bi-arrow-right-circle-fill me-2"></i> Ma Prochaine Location</h2>
        
        <div class="row mb-5">
          <div class="col-lg-8">
            <div class="card shadow border-2 next-reservation-card" :class="nextReservation.status === 'Confirmée' ? 'border-success' : 'border-warning'">
              <div class="card-body">
                <h5 class="card-title text-dark">{{ nextReservation.title || 'Aucune réservation à venir.' }}</h5>
                <p class="card-text text-muted" v-if="nextReservation.title">
                  **Période :** {{ formatDate(nextReservation.startDate) }} au {{ formatDate(nextReservation.endDate) }}<br>
                  **Statut :** <span class="fw-bold" :class="nextReservation.status === 'Confirmée' ? 'text-success' : 'text-warning'">{{ nextReservation.status }}</span>
                </p>
                <button v-if="nextReservation.title" class="btn cedii-btn-primary btn-sm mt-3"><i class="bi bi-search"></i> Voir Détails</button>
                <router-link v-else :to="{ name: 'ReservationForm'}" class="btn cedii-btn-primary mt-3"><i class="bi bi-calendar-plus"></i> Réserver Maintenant</router-link>
              </div>
            </div>
          </div>
        </div>

        <h2 class="h4 mb-4 text-secondary"><i class="bi bi-clock-history me-2"></i> Historique des Locations</h2>
        
        <div class="card shadow">
          <div class="card-body">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ressource</th>
                  <th>Date Début</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="req in pastReservations" :key="req.id">
                  <td>{{ req.id }}</td>
                  <td>{{ req.resource }}</td>
                  <td>{{ formatDate(req.startDate) }}</td>
                  <td><span class="text-success">{{ req.status }}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-secondary me-2"><i class="bi bi-file-earmark-text"></i> Facture</button>
                    <button class="btn btn-sm btn-info text-white"><i class="bi bi-chat"></i> Contacter</button>
                  </td>
                </tr>
                <tr v-if="pastReservations.length === 0">
                  <td colspan="5" class="text-center text-muted">Aucune réservation passée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 🚨 Import du composant Navbar
import ClientNavbar from '../components/clientNavbar.vue';

const clientName = ref('Client'); 
const nextReservation = ref({});
const pastReservations = ref([]);

const fetchClientData = async () => {
    clientName.value = 'Alice Dupont'; 
    nextReservation.value = {
        id: 101,
        title: 'Location Salle Polyvalente A',
        resource: 'Salle Polyvalente A (ID 45)',
        startDate: '2025-11-10',
        endDate: '2025-11-12',
        status: 'Confirmée'
    };
    pastReservations.value = [
        { id: 98, resource: 'Bureau Privé B', startDate: '2025-09-01', status: 'Terminée' },
        { id: 85, resource: 'Véhicule Utilitaire C', startDate: '2025-07-20', status: 'Terminée' },
    ];
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
    fetchClientData();
});
</script>

<style scoped>
/* COHÉRENCE AVEC LES STYLES */
.cedii-text-primary { color: var(--cedii-primary-light, #5B11EE) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}
</style> -->
<template>
  <div class="vh-100 d-flex flex-column"> 

    <ClientNavbar />

    <main class="main-content flex-grow-1 overflow-auto bg-light p-4"> 
      
      <header class="pb-3 border-bottom d-flex justify-content-between align-items-center">
        <h1 class="text-secondary">Mon Compte Client 👤</h1>
        <p class="text-muted mb-0">Bienvenue, {{ clientName }} !</p>
      </header>
      
      <div class="mt-4">

        <div class="alert alert-info shadow-sm border-0 mb-5" role="alert">
            <i class="bi bi-info-circle-fill me-2"></i> 
            Vous pouvez consulter vos informations et votre historique ci-dessous, ou <router-link :to="{ name: 'ReservationForm'}" class="alert-link cedii-text-primary">faire une nouvelle réservation</router-link>.
        </div>

        <div class="row mb-5">
            <div class="col-lg-5 mb-4">
                <h2 class="h4 mb-3 text-dark"><i class="bi bi-person-badge me-2"></i> Mes Coordonnées</h2>
                <div class="card shadow-sm h-100 p-3">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">**Nom complet :** {{ clientInfo.name }}</li>
                        <li class="list-group-item">**Email :** {{ clientInfo.email }}</li>
                        <li class="list-group-item">**Téléphone :** {{ clientInfo.phone }}</li>
                        <li class="list-group-item">**Adresse :** {{ clientInfo.address }}</li>
                        <li class="list-group-item">**Membre depuis :** {{ formatDate(clientInfo.memberSince) }}</li>
                    </ul>
                    <div class="card-footer bg-white border-0 text-end">
                        <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil-square"></i> Modifier</button>
                    </div>
                </div>
            </div>

            <div class="col-lg-7 mb-4">
                <h2 class="h4 mb-3 cedii-text-primary"><i class="bi bi-arrow-right-circle-fill me-2"></i> Ma Prochaine Location</h2>
                <div class="card shadow border-2 h-100 next-reservation-card" :class="nextReservation.status === 'Confirmée' ? 'border-success' : 'border-warning'">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title text-dark">{{ nextReservation.title || 'Aucune réservation à venir.' }}</h5>
                        <p class="card-text text-muted" v-if="nextReservation.title">
                            **Ressource :** {{ nextReservation.resource }}<br>
                            **Période :** {{ formatDate(nextReservation.startDate) }} au {{ formatDate(nextReservation.endDate) }}<br>
                            **Statut :** <span class="fw-bold" :class="nextReservation.status === 'Confirmée' ? 'text-success' : 'text-warning'">{{ nextReservation.status }}</span>
                        </p>
                        <div class="mt-auto">
                            <button v-if="nextReservation.title" class="btn cedii-btn-primary btn-sm me-2"><i class="bi bi-search"></i> Détails</button>
                            <button v-if="nextReservation.status === 'Confirmée'" class="btn btn-warning btn-sm"><i class="bi bi-calendar-x"></i> Annuler</button>
                            <router-link v-else :to="{ name: 'ReservationForm'}" class="btn cedii-btn-primary"><i class="bi bi-calendar-plus"></i> Réserver Maintenant</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="h4 mb-4 text-secondary"><i class="bi bi-clock-history me-2"></i> Historique des Locations</h2>
        
        <div class="card shadow">
          <div class="card-body">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ressource</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="req in pastReservations" :key="req.id">
                  <td>{{ req.id }}</td>
                  <td>{{ req.resource }}</td>
                  <td>{{ formatDate(req.startDate) }}</td>
                  <td>{{ formatDate(req.endDate) }}</td>
                  <td><span class="text-success">{{ req.status }}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline-secondary me-2"><i class="bi bi-file-earmark-text"></i> Facture</button>
                    <button class="btn btn-sm btn-info text-white"><i class="bi bi-chat"></i> Contacter</button>
                  </td>
                </tr>
                <tr v-if="pastReservations.length === 0">
                  <td colspan="6" class="text-center text-muted">Aucune réservation passée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 🚨 Le chemin d'importation doit être adapté à votre structure
import ClientNavbar from '../components/clientNavbar.vue'; 

const clientName = ref('Client'); 
const clientInfo = ref({}); // Nouvel état pour les informations du client
const nextReservation = ref({});
const pastReservations = ref([]);

const fetchClientData = async () => {
    // 💡 Simulation des données de profil
    clientName.value = 'Alice Dupont'; 
    clientInfo.value = {
        name: 'Alice Dupont',
        email: 'alice.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        address: '12 Rue du Patrimoine, 75000 Paris',
        memberSince: '2024-01-15',
    };
    
    // 💡 Simulation des données de réservation
    nextReservation.value = {
        id: 101,
        title: 'Location Salle Polyvalente A',
        resource: 'Salle Polyvalente A (ID 45)',
        startDate: '2025-11-10',
        endDate: '2025-11-12',
        status: 'Confirmée' // ou 'En attente'
    };
    
    // 💡 Simulation de l'historique
    pastReservations.value = [
        { id: 98, resource: 'Bureau Privé B', startDate: '2025-09-01', endDate: '2025-09-05', status: 'Terminée' },
        { id: 85, resource: 'Véhicule Utilitaire C', startDate: '2025-07-20', endDate: '2025-07-20', status: 'Terminée' },
    ];
};

const formatDate = (dateString) => {
    // Fonction utilitaire pour formater la date
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
    fetchClientData();
});
</script>

<style scoped>
/* COHÉRENCE AVEC LES STYLES */
.cedii-text-primary { color: var(--cedii-primary-light, #5B11EE) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}

.list-group-item {
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
}
.card-footer {
    padding-top: 1rem;
}
</style>