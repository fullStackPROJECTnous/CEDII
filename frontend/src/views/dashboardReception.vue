<!--<template>
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
                    trend="" 
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
                        <tr v-for="req in lastPendingRequests" :key="req.idRes"> 
                            <td>#{{ req.idRes }}</td> 
                            <td>{{ req.client ? `${req.client.prenomCli} ${req.client.nomCli}` : 'Client Inconnu' }}</td> 
                            <td>{{ req.typeRes === 'S' ? 'Salle' : 'Matériel' }}</td> 
                            <td>{{ formatDate(req.debRes) }}</td> 
                            <td>
                                <button 
                                    class="btn btn-sm cedii-btn-primary me-2"
                                    @click="router.push({ name: 'ReservationValidation', params: { idRes: req.idRes } })"> 
                                    <i class="bi bi-search"></i> Examiner
                                </button>
                                <button 
                                    class="btn btn-sm btn-outline-danger"
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

const lastPendingRequests = computed(() => {
    // 💡 Le backend doit renvoyer toutes les réservations 'En attente'
    // Nous supposons que le backend a déjà filtré/trié, mais ici, on filtre juste au cas où.
    return allRequests.value
        .filter(r => r.etatRes === 'En attente' || r.etatRes === 'En attente de paiement') // Utilisez les vrais statuts de votre DB
        .sort((a, b) => new Date(b.dateCre) - new Date(a.dateCre)) // Tri par date de création (dateCre)
        .slice(0, 5);
});

// 🚨 NOUVEAU: Fonction pour valider ou refuser une demande
const handleRequest = async (request, action) => {
    // ... (logique inchangée pour l'action et le message)
    if (confirm(message)) {
        try {
            // 🚨 Utiliser l'ID réel de la réservation (idRes)
            await LocationService.updateReservationStatus(request.idRes, newStatus); 
            // ... (suite de la logique)
            await fetchReceptionData(); 
        } catch (error) {
             console.error(`Erreur de traitement de la demande #${request.id}:`, error.response?.data || error);
        }
    }
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
.cedii-bg-dark { background-color: var(--cedii-dark, #5E5E5E) !important; }
.cedii-text-primary { color: var(--cedii-primary-light, white) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: #02061E;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0671b6);
    border-color: var(--cedii-primary-dark, #0671b6);
}

.sidebar { width: 250px; flex-shrink: 0; display: flex; flex-direction: column; }
.sidebar-logo { width: 60px; height: 60px; border-radius: 50%; border: 2px solid white; object-fit: cover; }
.sidebar .nav-link { transition: background-color 0.3s; border-radius: 5px; }
.sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: var(--cedii-primary-dark, white); }
.sidebar .nav-link { 
    color: #02061E !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}

.sidebar .nav-link.active { 
    color: purple !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}
</style>
-->

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
                            trend="" 
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
                
                <!-- NOUVEAU CONTENEUR DE STATISTIQUES (Remplace l'Aperçu des Demandes) -->
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-white border-bottom">
                        <h5 class="card-title mb-0 text-dark">Statistiques des Réservations (Matériel vs. Salle)</h5>
                    </div>
                    <div class="card-body d-flex justify-content-center align-items-center" style="height: 350px;">
                        
                        <div v-if="loadingStats" class="text-center text-muted">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Chargement...</span>
                            </div>
                            <p class="mt-2">Chargement des statistiques...</p>
                        </div>
                        <div v-else-if="!hasStats" class="text-center text-muted">
                            Aucune donnée de réservation disponible pour l'analyse.
                        </div>
                        <div v-else style="max-width: 400px; max-height: 400px;">
                            <canvas ref="statsChartCanvas"></canvas>
                        </div>

                    </div>
                </div>
                <!-- FIN NOUVEAU CONTENEUR -->

            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService'; 
import LocationService from '../services/LocationService'; 
import KpiCard from '../views/KpiCard.vue'; 
import Chart from 'chart.js/auto'; // 🚨 ASSUREZ-VOUS D'AVOIR INSTALLÉ CHART.JS

const userRole = ref('');
const router = useRouter(); 
const kpis = ref({ pendingRequests: 0, urgentRequests: 0, todayEvents: 0, unavailableResources: 0 });
const allRequests = ref([]);
const statsChartCanvas = ref(null); // Référence au canvas
const chartInstance = ref(null);
const reservationStats = ref({ materiel: 0, salle: 0 }); // NOUVEL ÉTAT
const loadingStats = ref(true); // NOUVEL ÉTAT

// Propriétés calculées
const pendingRequestsCount = computed(() => kpis.value.pendingRequests);
const hasStats = computed(() => reservationStats.value.materiel > 0 || reservationStats.value.salle > 0);


// 🚨 NOUVELLE LOGIQUE POUR LES STATISTIQUES 🚨
const fetchReservationStats = async () => {
    loadingStats.value = true;
    console.log("STATUT LOG 1: Début du chargement."); 

    try {
        // --- 1. CHARGEMENT DES DONNÉES ---

        // 💡 REMPLACER PAR VOTRE VRAI APPEL API (DECOMMENTER)
        // const response = await LocationService.getReservationStatistics(); 
        // reservationStats.value = response.data;
        
        // Simule le chargement des données (Si vous le laissez temporairement)
        await new Promise(resolve => setTimeout(resolve, 800)); 
        reservationStats.value.materiel = 120; 
        reservationStats.value.salle = 80;
        // -----------------------------------------------------

        console.log("STATUT LOG 2: Données chargées (simulées ou réelles).", reservationStats.value); 

    } catch (error) {
        console.error("Erreur de chargement des statistiques:", error);
    } finally {
        // --- 2. RENDU DU GRAPHIQUE APRÈS CHARGEMENT ---

        // A. Désactiver le chargement. Ceci déclenche le rendu du <canvas> via v-else.
        loadingStats.value = false;
        
        // B. Attendre que Vue ait rendu le <canvas> dans le DOM.
        if (hasStats.value) {
            // ✅ CORRECTION CRITIQUE : Utiliser await nextTick() après que loadingStats = false
            await nextTick(); 
            
            // C. Rendre le graphique. Le canvas est maintenant garanti d'exister.
            renderChart();
            console.log("STATUT LOG 3: Graphique rendu via await nextTick.");
        }
        
        console.log("STATUT LOG 4: Chargement désactivé (loadingStats = false)."); 
    }
};
const renderChart = () => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }
    
    // Ajout d'une vérification pour s'assurer que le canvas existe
    if (!statsChartCanvas.value) {
        console.error("Erreur de rendu: Le canvas n'est pas disponible.");
        return;
    }

    const total = reservationStats.value.materiel + reservationStats.value.salle;
    
    // ✅ CORRECTION : Si le total est zéro, nous arrêtons le rendu pour éviter NaN.
    if (total === 0) {
        console.warn("Rendu annulé : Aucune réservation (total est zéro).");
        return; 
    }

    // Fonction d'aide pour calculer le pourcentage en toute sécurité
    const safePercentage = (value) => {
        return ((value / total) * 100).toFixed(1);
    };

    const data = {
        labels: [
            // Utilisation de la fonction safePercentage
            `Matériel (${safePercentage(reservationStats.value.materiel)}%)`, 
            `Salle (${safePercentage(reservationStats.value.salle)}%)`
        ],
        datasets: [{
            data: [reservationStats.value.materiel, reservationStats.value.salle],
            backgroundColor: [
                'rgba(94, 94, 94, 0.8)', // Gris foncé pour le matériel
                'rgba(91, 17, 238, 0.8)' // Violet CEDII pour la salle
            ],
            hoverOffset: 10
        }]
    };

    chartInstance.value = new Chart(statsChartCanvas.value, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: false,
                }
            }
        }
    });
};// 🚨 FIN NOUVELLE LOGIQUE 🚨


const fetchReceptionData = async () => {
    try {
        // Le service devrait retourner un objet { data: { ... KPIs et listes ... } }
        const response = await LocationService.getReceptionDashboardData(); 
        const data = response.data;
        
        kpis.value.pendingRequests = data.pendingRequests || 0;
        kpis.value.urgentRequests = data.urgentRequests || 0;
        kpis.value.todayEvents = data.todayEvents || 0;
        kpis.value.unavailableResources = data.unavailableResources || 0;
        
        allRequests.value = data.latestRequests || []; // Reste pour d'autres usages futurs
        
    } catch (error) {
        console.error("Erreur de chargement des données de réception:", error.response?.data || error);
    }
};



// La fonction formatDate est conservée mais n'est plus utilisée dans le template
// const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
// };


// CONSOLIDATION de onMounted
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && user.roleUti.toLowerCase() === 'reception') {
        userRole.value = user.roleUti.toUpperCase();
        fetchReceptionData();
        fetchReservationStats(); // 💡 Déclenchement du chargement des stats
    } else {
        router.push('/'); 
    }
});

function logout() {
    // 1. Afficher la boîte de dialogue de confirmation native du navigateur.
    // confirm() retourne true si l'utilisateur clique sur "OK" ou "Oui", et false si "Annuler" ou "Non".
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");

    // 2. Vérifier la réponse de l'utilisateur.
    if (isConfirmed) {
        console.log("Déconnexion confirmée. Exécution de la déconnexion...");
        
        // 3. Exécuter l'action de déconnexion
        AuthService.logout();
        
        // 4. Rediriger l'utilisateur vers la page de connexion
        router.push('/');
    } else {
        console.log("Déconnexion annulée.");
        // Optionnel : ne rien faire, l'utilisateur reste sur la page actuelle.
    }
}

</script>

<style scoped>
/* Styles existants */
.cedii-bg-dark { background-color: var(--cedii-dark, #5E5E5E) !important; }
.cedii-text-primary { color: var(--cedii-primary-light, white) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: #02061E;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0671b6);
    border-color: var(--cedii-primary-dark, #0671b6);
}

.sidebar { width: 250px; flex-shrink: 0; display: flex; flex-direction: column; }
.sidebar-logo { width: 60px; height: 60px; border-radius: 50%; border: 2px solid white; object-fit: cover; }
.sidebar .nav-link { transition: background-color 0.3s; border-radius: 5px; }
.sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: var(--cedii-primary-dark, white); }
.sidebar .nav-link { 
    color: #02061E !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}

.sidebar .nav-link.active { 
    color: purple !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}
</style>
