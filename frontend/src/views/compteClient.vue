
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
        <td><span :class="{'text-success': req.status === 'Terminée', 'text-danger': req.status === 'Refusée'}">{{ req.status }}</span></td>
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
import ClientService from '../services/ClientService'; 
//import LocationService from '../services/LocationService';

const clientName = ref('Client'); 
const clientInfo = ref({}); // Nouvel état pour les informations du client
const nextReservation = ref({});
const pastReservations = ref([]);

// ...

const fetchClientData = async () => {
    try {
        // 🚀 CORRECTION MAJEURE : Utilisez getMyProfile() qui lit l'ID dans le token JWT
        const response = await ClientService.getMyProfile(); 
        
        clientData.value = response.data; // Assurez-vous d'accéder à .data si le service retourne la promesse axios complète
        
        console.log("✅ Données client chargées :", clientData.value);
        
        // Mettre à jour le nom dans la navbar si nécessaire
        // const { prenomCli, nomCli } = response.data;
        // clientName.value = `${prenomCli} ${nomCli}`;

    } catch (error) {
        console.error("❌ Échec du chargement des données client:", error.response?.data || error);
        // Gérer l'erreur (ex: déconnexion si le token est invalide)
    }
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

