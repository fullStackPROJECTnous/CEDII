<!--<template>
  <div class="p-4">
    <h1>Espace Réception 🛎️</h1>
    <p>Vue d'ensemble des réservations et des locations en cours/à venir.</p>
    </div>
</template>
<script setup>
// Logique Réception
</script>


<template>
  <div class="d-flex vh-100"> 

    <nav class="sidebar cedii-bg-dark text-white p-3 shadow d-flex flex-column">
      <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
        <h4 class="cedii-text-primary mb-0">CEDII Patrimoine Plus</h4>
      </div>
      
      <ul class="nav flex-column mb-auto">
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'ReceptionDashboard'}" class="nav-link text-white active">
            <i class="bi bi-house-door-fill me-2"></i> Accueil  
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'InventairePatrimoine' }" class="nav-link text-white">
            <i class="bi bi-bell-fill me-2"></i> Demandes à Traiter <span class="badge rounded-pill bg-danger ms-auto">{{ pendingRequestsCount }}</span>
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'UserManagement' }" class="nav-link text-white">
            <i class="bi bi-calendar-day me-2"></i> Calendrier & Disponibilités
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'ClientManagement' }" class="nav-link text-white">
            <i class="bi bi-people-fill me-2"></i> Fiches Clients
          </router-link>
        </li>
       
      </ul>
      
      <div class="mt-auto pt-3 border-top">
        <button @click="logout" class="btn btn-sm btn-danger w-100">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </nav>

    <main class="main-content flex-grow-1 overflow-auto bg-light"> 
      
      <header class="d-flex justify-content-between align-items-center p-4 pb-0">
        <h1 class="text-secondary mb-0">Tableau de bord Réception</h1>
        <small class="text-muted">Rôle: {{ userRole }}</small>
      </header>
      
      <div class="p-4">
        
        <div class="alert alert-warning shadow-sm border-2 border-warning" role="alert" v-if="pendingRequestsCount > 0">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> 
            Vous avez **{{ pendingRequestsCount }} demandes de location/réservation** en attente de validation. Veuillez les traiter en priorité.
        </div>
        
        <div class="row mb-5">
            <div class="col-md-4 mb-4">
                <KpiCard 
                    icon="bi-hourglass-split" 
                    title="Demandes en Attente" 
                    :value="kpis.pendingRequests" 
                    :trend="`Urgent : ${kpis.urgentRequests}`" 
                    color="cedii-text-primary"
                    linkName="DemandesEnAttente"
                />
            </div>
            <div class="col-md-4 mb-4">
                <KpiCard 
                    icon="bi-bell" 
                    title="Locations du Jour" 
                    :value="kpis.todayEvents" 
                    trend="Départs et arrivées" 
                    color="text-info"
                    linkName="Disponibilites"
                />
            </div>
            <div class="col-md-4 mb-4">
                <KpiCard 
                    icon="bi-bricks" 
                    title="Ressources Indisponibles" 
                    :value="kpis.unavailableResources" 
                    trend="Rapport de maintenance" 
                    color="text-danger"
                    linkName="InventaireSimple"
                />
            </div>
        </div>
        
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white border-bottom">
                <h5 class="card-title mb-0 text-dark">Aperçu des 5 Dernières Demandes</h5>
            </div>
            <div class="card-body">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Demandeur</th>
                            <th>Ressource</th>
                            <th>Date Début</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="lastPendingRequests.length === 0">
                            <td colspan="5" class="text-center text-muted">Aucune demande en attente.</td>
                        </tr>
                        <tr v-for="req in lastPendingRequests" :key="req.id">
                            <td>{{ req.id }}</td>
                            <td>{{ req.demandeur }}</td>
                            <td>{{ req.ressource }}</td>
                            <td>{{ formatDate(req.dateDebut) }}</td>
                            <td>
                                <button class="btn btn-sm cedii-btn-primary me-2"><i class="bi bi-check-lg"></i> Valider</button>
                                <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-x-lg"></i> Refuser</button>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService'; 
import LocationService from '../services/LocationService'; // Service pour les demandes
import KpiCard from '../views/KpiCard.vue'; // Assurez-vous que le composant est là

const userRole = ref('');
const router = useRouter(); 
const kpis = ref({ pendingRequests: 0, urgentRequests: 0, todayEvents: 0, unavailableResources: 0 });
const allRequests = ref([]);

// Propriétés calculées
const pendingRequestsCount = computed(() => kpis.value.pendingRequests);

const lastPendingRequests = computed(() => {
    // Simuler le filtrage et la prise des 5 derniers pour l'aperçu rapide
    return allRequests.value
        .filter(r => r.etat === 'En attente')
        .sort((a, b) => new Date(b.dateSoumission) - new Date(a.dateSoumission)) // Plus récent d'abord
        .slice(0, 5); 
});

// --- Fonctions de chargement ---
const fetchReceptionData = async () => {
    try {
        // 💡 Remplacez par votre endpoint API réel
        const response = await LocationService.getReceptionDashboardData(); 
        
        kpis.value.pendingRequests = response.data.pendingRequests;
        kpis.value.urgentRequests = response.data.urgentRequests;
        kpis.value.todayEvents = response.data.todayEvents;
        kpis.value.unavailableResources = response.data.unavailableResources;
        allRequests.value = response.data.latestRequests; // Récupère les données brutes pour la table
        
    } catch (error) {
        console.error("Erreur de chargement des données de réception:", error);
        // Afficher un message d'erreur à l'utilisateur si nécessaire
    }
};

const logout = () => {
    AuthService.logout();
    router.push('/');
};

const formatDate = (dateString) => {
    // Fonction utilitaire pour formater la date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};


// 🚨 CONSOLIDATION de onMounted
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    // Vérification du rôle (utilisez 'roleUti' si c'est ce que votre backend envoie)
    if (user && user.roleUti && user.roleUti.toLowerCase() === 'reception') {
        userRole.value = user.roleUti.toUpperCase();
        fetchReceptionData();
    } else {
        // Si l'utilisateur n'est pas Réception, le router guard devrait déjà bloquer, 
        // mais on peut le rediriger si ce composant est atteint accidentellement.
        router.push('/'); 
    }
});

</script>

<style scoped>
/* Les styles spécifiques (sidebar, couleurs CEDII, etc.) sont les mêmes que dans AdminDashboard.vue */
.cedii-bg-dark { background-color: var(--cedii-dark, #02061E) !important; }
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

.sidebar { width: 250px; flex-shrink: 0; display: flex; flex-direction: column; }
.sidebar-logo { width: 60px; height: 60px; border-radius: 50%; border: 2px solid white; object-fit: cover; }
.sidebar .nav-link { transition: background-color 0.3s; border-radius: 5px; }
.sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: var(--cedii-primary-dark, #0405BF); }
</style>-->

<template>
  <div class="d-flex vh-100"> 

    <nav class="sidebar cedii-bg-dark text-white p-3 shadow d-flex flex-column">
      <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
        <h4 class="cedii-text-primary mb-0">CEDII Patrimoine Plus</h4>
      </div>
      
      <ul class="nav flex-column mb-auto">
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'ReceptionDashboard'}" class="nav-link text-white active">
            <i class="bi bi-house-door-fill me-2"></i> Accueil  
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'DemandesEnAttente' }" class="nav-link text-white">
            <i class="bi bi-bell-fill me-2"></i> Demandes à Traiter <span class="badge rounded-pill bg-danger ms-auto">{{ pendingRequestsCount }}</span>
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'CalendrierDisponibilites' }" class="nav-link text-white">
            <i class="bi bi-calendar-day me-2"></i> Calendrier & Disponibilités
          </router-link>
        </li>

          <li class="nav-item mb-2">
          <router-link :to="{ name: 'InventairePatrimoine' }" class="nav-link text-white">
            <i class="bi bi-tools me-2"></i> Inventaire & Patrimoine
          </router-link>
        </li>

          <li class="nav-item mb-2">
          <router-link :to="{ name: 'Bureau' }" class="nav-link text-white">
            <i class="bi bi-tools me-2"></i> Matériel de Bureau
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'ClientManagement' }" class="nav-link text-white">
            <i class="bi bi-people-fill me-2"></i> Fiches Clients
          </router-link>
        </li>
        
      </ul>
      
      <div class="mt-auto pt-3 border-top">
        <button @click="logout" class="btn btn-sm btn-danger w-100">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </nav>

    <main class="main-content flex-grow-1 overflow-auto bg-light"> 
      
      <header class="d-flex justify-content-between align-items-center p-4 pb-0">
        <h1 class="text-secondary mb-0">Tableau de bord Réception</h1>
        <small class="text-muted">Rôle: {{ userRole }}</small>
      </header>
      
      <div class="p-4">
        
        <div class="alert alert-warning shadow-sm border-2 border-warning" role="alert" v-if="pendingRequestsCount > 0">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> 
            Vous avez **{{ pendingRequestsCount }} demandes de location/réservation** en attente de validation. Veuillez les traiter en priorité.
        </div>
        
        <div class="row mb-5">
            <div class="col-md-4 mb-4">
                <KpiCard 
                    icon="bi-hourglass-split" 
                    title="Demandes en Attente" 
                    :value="kpis.pendingRequests" 
                    :trend="`Urgent : ${kpis.urgentRequests}`" 
                    color="cedii-text-primary"
                    linkName="DemandesEnAttente"
                />
            </div>
            <div class="col-md-4 mb-4">
                <KpiCard 
                    icon="bi-bell" 
                    title="Locations du Jour" 
                    :value="kpis.todayEvents" 
                    trend="Départs et arrivées" 
                    color="text-info"
                    linkName="Disponibilites"
                />
            </div>
            <div class="col-md-4 mb-4">
                <KpiCard 
                    icon="bi-bricks" 
                    title="Ressources Indisponibles" 
                    :value="kpis.unavailableResources" 
                    trend="Rapport de maintenance" 
                    color="text-danger"
                    linkName="InventaireSimple"
                />
            </div>
        </div>
        
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-white border-bottom">
                <h5 class="card-title mb-0 text-dark">Aperçu des 5 Dernières Demandes</h5>
            </div>
            <div class="card-body">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Demandeur</th>
                            <th>Ressource</th>
                            <th>Date Début</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="lastPendingRequests.length === 0">
                            <td colspan="5" class="text-center text-muted">Aucune demande en attente.</td>
                        </tr>
                        <tr v-for="req in lastPendingRequests" :key="req.id">
                            <td>#{{ req.id }}</td>
                            <td>{{ req.demandeur }}</td>
                            <td>{{ req.ressource }}</td>
                            <td>{{ formatDate(req.dateDebut) }}</td>
                            <td>
                                <button 
                                    class="btn btn-sm cedii-btn-primary me-2"
                                    @click="handleRequest(req, 'validate')">
                                    <i class="bi bi-check-lg"></i> Valider
                                </button>
                                <button 
                                    class="btn btn-sm btn-outline-secondary"
                                    @click="handleRequest(req, 'refuse')">
                                    <i class="bi bi-x-lg"></i> Refuser
                                </button>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService'; 
import LocationService from '../services/LocationService'; // Nécessite l'implémentation
import KpiCard from '../views/KpiCard.vue'; 


const userRole = ref('');
const router = useRouter(); 
const kpis = ref({ pendingRequests: 0, urgentRequests: 0, todayEvents: 0, unavailableResources: 0 });
const allRequests = ref([]);

// Propriétés calculées
const pendingRequestsCount = computed(() => kpis.value.pendingRequests);

const lastPendingRequests = computed(() => {
   /* return allRequests.value
        .filter(r => r.etat === 'En attente') // Filtrage basé sur l'état renvoyé par le backend
        .sort((a, b) => new Date(b.dateSoumission) - new Date(a.dateSoumission)) 
        .slice(0, 5); */

        return allRequests.value
        .filter(r => r.etat === 'En attente')
        .sort((a, b) => {
            // Sécurisation du tri : s'assurer que les dates sont valides
            const dateA = new Date(a.dateSoumission).getTime() || 0;
            const dateB = new Date(b.dateSoumission).getTime() || 0;
            return dateB - dateA;
        }) 
        .slice(0, 5);
});

// --- Fonctions de chargement et d'action ---

// 🚨 NOUVEAU: Fonction pour valider ou refuser une demande
/*const handleRequest = async (request, action) => {
    const newStatus = action === 'validate' ? 'Confirmée' : 'Refusée';
    const message = action === 'validate' 
        ? `Confirmer la demande #${request.id} (${request.ressource}) pour ${request.demandeur}?`
        : `Refuser la demande #${request.id} pour ${request.demandeur}?`;

    if (confirm(message)) {
        try {
            await LocationService.updateReservationStatus(request.id, newStatus); // Nouvelle méthode de service
            alert(`Demande #${request.id} mise à jour à '${newStatus}' avec succès. L'utilisateur sera notifié.`);
            
            // Recharger le tableau de bord pour mettre à jour les KPIs et la liste
            fetchReceptionData(); 
        } catch (error) {
            console.error(`Erreur de traitement de la demande #${request.id}:`, error.response?.data || error);
            alert(`Échec du traitement de la demande : ${error.response?.data?.message || error.message}`);
        }
    }
};*/


// 🚨 NOUVEAU: Fonction pour valider ou refuser une demande
const handleRequest = async (request, action) => {
    // 🚨 N'oubliez pas que vous devez également utiliser la bonne casse pour les valeurs que vous ENVOYEZ au backend
    // 'Confirmée' et 'Refusée' correspondent aux ENUM de la DB (doivent être corrects)
    const newStatus = action === 'validate' ? 'Confirmée' : 'Refusée';
    const message = action === 'validate' 
        ? `Confirmer la demande #${request.id} (${request.ressource}) pour ${request.demandeur}?`
        : `Refuser la demande #${request.id} pour ${request.demandeur}?`;

    // 🚨 NOTE IMPORTANTE: J'ai retiré le `confirm()` et `alert()` qui ne doivent pas être utilisés
    // dans cet environnement. Veuillez utiliser un composant modal personnalisé si vous voulez une confirmation.
    
    // Remplacement temporaire pour l'exercice : 
    // Pour que le code s'exécute, nous allons simuler la confirmation.
    if (confirm(message)) {
        try {
            // Le statut doit être 'Confirmée' ou 'Refusée' selon votre ENUM
            await LocationService.updateReservationStatus(request.id, newStatus); 
            // alert(`Demande #${request.id} mise à jour à '${newStatus}' avec succès. L'utilisateur sera notifié.`);
            console.log(`Demande #${request.id} mise à jour à '${newStatus}' avec succès.`);
            
            // Recharger le tableau de bord pour mettre à jour les KPIs et la liste
            await fetchReceptionData(); 
        } catch (error) {
            console.error(`Erreur de traitement de la demande #${request.id}:`, error.response?.data || error);
            // alert(`Échec du traitement de la demande : ${error.response?.data?.message || error.message}`);
        }
    }

  };



const fetchReceptionData = async () => {
    try {
        // Le service devrait retourner un objet { data: { ... KPIs et listes ... } }
        const response = await LocationService.getReceptionDashboardData(); 
        const data = response.data;
        
        kpis.value.pendingRequests = data.pendingRequests || 0;
        kpis.value.urgentRequests = data.urgentRequests || 0;
        kpis.value.todayEvents = data.todayEvents || 0;
        kpis.value.unavailableResources = data.unavailableResources || 0;
        
        allRequests.value = data.latestRequests || []; // Récupère les données brutes pour la table
        
    } catch (error) {
        console.error("Erreur de chargement des données de réception:", error.response?.data || error);
      //  alert("Impossible de charger les données du tableau de bord. Vérifiez la connexion API.");
    }
};

const logout = () => {
    AuthService.logout();
    router.push('/');
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};


// 🚨 CONSOLIDATION de onMounted
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && user.roleUti.toLowerCase() === 'reception') {
        userRole.value = user.roleUti.toUpperCase();
        fetchReceptionData();
    } else {
        router.push('/'); 
    }
});

</script>

<style scoped>
/* Styles existants */
.cedii-bg-dark { background-color: var(--cedii-dark, #02061E) !important; }
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

.sidebar { width: 250px; flex-shrink: 0; display: flex; flex-direction: column; }
.sidebar-logo { width: 60px; height: 60px; border-radius: 50%; border: 2px solid white; object-fit: cover; }
.sidebar .nav-link { transition: background-color 0.3s; border-radius: 5px; }
.sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: var(--cedii-primary-dark, #0405BF); }
</style>

---

## 2. Logique Service et Backend (À Implémenter)

Ces fichiers ne sont pas fournis, mais sont essentiels pour que le frontend fonctionne.

### 2.1. Mise à jour du Service (`LocationService.js` - Extrait)

Vous devez ajouter la méthode de récupération du tableau de bord et la méthode d'action.

```javascript
// LocationService.js (Extrait)

const API_BASE_URL = '/api/reception'; // Assurez-vous que c'est la bonne route

// ...

// Méthode pour récupérer les KPI et la liste des demandes
getReceptionDashboardData() {
    return axios.get(`${API_BASE_URL}/dashboard`, { 
        headers: authHeader() 
    });
},

// Méthode pour confirmer/refuser une demande
updateReservationStatus(idRes, newStatus) {
    return axios.put(`${API_BASE_URL}/reservations/${idRes}/status`, { newStatus }, {
        headers: authHeader() 
    });
}