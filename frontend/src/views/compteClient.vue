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
          Vous pouvez consulter vos informations et votre historique ci-dessous.
        </div>

        <div class="row mb-5">
          <div class="col-lg-5 mb-4">
            <h2 class="h4 mb-3 text-dark"><i class="bi bi-person-badge me-2"></i> Mes Coordonnées</h2>
            <div class="card shadow-sm h-100 p-3">
              <ul class="list-group list-group-flush" v-if="clientInfo.name">
                <li class="list-group-item"><strong>Nom complet :</strong> {{ clientInfo.name }}</li>
                <li class="list-group-item"><strong>Email :</strong> {{ clientInfo.email }}</li>
                <li class="list-group-item"><strong>Téléphone :</strong> {{ clientInfo.phone }}</li>
                <li class="list-group-item"><strong>Adresse :</strong> {{ clientInfo.address }}</li>
                <li class="list-group-item"><strong>Type :</strong> {{ clientInfo.type }}</li>
                <li class="list-group-item"><strong>Statut :</strong> {{ clientInfo.status }}</li>
              </ul>
              <div class="text-center p-4" v-else>
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-2 text-muted">Chargement des données...</p>
              </div>
             
            </div>
          </div>

          <div class="col-lg-7 mb-4">
            <h2 class="h4 mb-3 cedii-text-primary"><i class="bi bi-arrow-right-circle-fill me-2"></i> Ma Prochaine Location</h2>
            <div class="card shadow border-2 h-100" :class="nextReservation.etatRes === 'Confirmée' ? 'border-success' : 'border-warning'">
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title text-dark">{{ nextReservation.idRes ? `Réservation #${nextReservation.idRes}` : 'Aucune réservation à venir.' }}</h5>
                <p class="card-text text-muted" v-if="nextReservation.idRes">
                  <strong>Type :</strong> {{ nextReservation.typeRes }}<br>
                  <strong>Date début :</strong> {{ formatDate(nextReservation.debRes) }}<br>
                  <strong>Date fin :</strong> {{ formatDate(nextReservation.finRes) }}<br>
                  <strong>Statut :</strong> <span class="fw-bold" :class="getStatusClass(nextReservation.etatRes)">{{ nextReservation.etatRes }}</span>
                </p>
                <div class="mt-auto">
                  <button v-if="nextReservation.idRes" class="btn cedii-btn-primary btn-sm me-2">
                    <i class="bi bi-search"></i> Détails
                  </button>
                  <router-link v-else :to="{ name: 'ReservationForm'}" class="btn cedii-btn-primary">
                    <i class="bi bi-calendar-plus"></i> Réserver Maintenant
                  </router-link>
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
                  <th>Type</th>
                  <th>Date Début</th>
                  <th>Date Fin</th>
                  <th>Statut</th>
                  <th>Tarif</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reservation in pastReservations" :key="reservation.idRes">
                  <td>{{ reservation.idRes }}</td>
                  <td>{{ reservation.typeRes }}</td>
                  <td>{{ formatDate(reservation.debRes) }}</td>
                  <td>{{ formatDate(reservation.finRes) }}</td>
                  <td>
                    <span :class="getStatusClass(reservation.etatRes)">
                      {{ reservation.etatRes }}
                    </span>
                  </td>
                  <td>{{ formatCurrency(reservation.tarifTot) }}</td>
                </tr>
                <tr v-if="pastReservations.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    Aucune réservation dans votre historique
                  </td>
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
import ClientNavbar from '../components/clientNavbar.vue'; 
import ClientService from '../services/ClientService'; 

const clientName = ref('Client'); 
const clientInfo = ref({});
const nextReservation = ref({});
const pastReservations = ref([]);
const isLoading = ref(true);

const fetchClientData = async () => {
  try {
    console.log("🔍 Chargement des données client...");
    
    const clientData = await ClientService.getMyProfile(); 
    console.log("✅ Données client reçues:", clientData);
    
    // 🚨 CORRECTION: Plus de .utilisateur puisque l'association est supprimée
    clientName.value = `${clientData.prenomCli || ''} ${clientData.nomCli || ''}`.trim() || 'Client';
    
    // Mise à jour des coordonnées
    clientInfo.value = {
      name: `${clientData.nomCli || ''} ${clientData.prenomCli || ''}`.trim(),
      email: clientData.emailCli || 'Non spécifié',
      phone: clientData.telephoneCli || 'Non spécifié',
      address: clientData.addresseCli || 'Non spécifiée',
      type: clientData.typeCli === 'particulier' ? 'Particulier' : 'Entreprise',
      status: clientData.statutCli === 'actif' ? 'Actif' : 'Inactif',
      memberSince: clientData.createdAt ? new Date(clientData.createdAt).toLocaleDateString('fr-FR') : 'Non spécifiée'
    };

    // Charger les réservations
    await fetchReservations(clientData.idCli);
    
  } catch (error) {
    console.error("❌ Erreur chargement données:", error);
    clientName.value = 'Erreur de chargement';
  } finally {
    isLoading.value = false;
  }
};

const fetchReservations = async (clientId) => {
  try {
    const response = await ClientService.getClientReservations(clientId);
    const reservations = response.reservations || [];
    
    // Trouver la prochaine réservation
    const now = new Date();
    const upcoming = reservations
      .filter(res => new Date(res.debRes) > now)
      .sort((a, b) => new Date(a.debRes) - new Date(b.debRes))[0];
    
    nextReservation.value = upcoming || {};
    
    // Historique
    pastReservations.value = reservations
      .filter(res => res !== upcoming)
      .sort((a, b) => new Date(b.debRes) - new Date(a.debRes));
      
  } catch (error) {
    console.error("❌ Erreur chargement réservations:", error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Date invalide';
  }
};

const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA'
  }).format(amount);
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Confirmée': return 'text-success';
    case 'En attente': return 'text-warning';
    case 'Annulée': return 'text-danger';
    case 'Terminée': return 'text-info';
    default: return 'text-muted';
  }
};

onMounted(() => {
  fetchClientData();
});
</script>

<style scoped>
.cedii-text-primary { color: #5B11EE !important; }
.cedii-btn-primary { 
  background-color: #5B11EE;
  color: white;
  border-color: #5B11EE;
}
.cedii-btn-primary:hover {
  background-color: #0405BF;
  border-color: #0405BF;
}
</style>