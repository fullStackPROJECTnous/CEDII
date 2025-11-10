<template>
    <div class="d-flex vh-100"> 
        <nav class="sidebar cedii-bg-dark text-white p-3 shadow d-flex flex-column">
            <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
                <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
                <h4 class="cedii-text-primary mb-0">CEDII Patrimoine Plus</h4>
            </div>
            
            <ul class="nav flex-column mb-auto">
                <!-- CORRECTION : Utilisation correcte des noms de routes enfants -->
                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'ReceptionAccueil' }" 
                        class="nav-link text-white"
                        active-class="active"
                        exact-active-class="active"
                    >
                        <i class="bi bi-house-door-fill me-2"></i> Accueil 
                    </router-link>
                </li>

                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'NouvelleReservation' }" 
                        class="nav-link text-white cedii-btn-primary"
                        active-class="active"
                        exact-active-class="active"
                    >
                        <i class="bi bi-calendar-plus-fill me-2"></i> Nouvelle Réservation / Location
                    </router-link>
                </li>

                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'DemandesEnAttente' }" 
                        class="nav-link text-white"
                        active-class="active"
                        exact-active-class="active"
                    >
                        <i class="bi bi-bell-fill me-2"></i> Demandes à Traiter 
                        <span class="badge rounded-pill bg-danger ms-auto">{{ pendingRequestsCount }}</span>
                    </router-link>
                </li>
                
                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'CalendrierDisponibilites' }" 
                        class="nav-link text-white"
                        active-class="active"
                        exact-active-class="active"
                    >
                        <i class="bi bi-calendar-day me-2"></i> Calendrier & Disponibilités
                    </router-link>
                </li>

                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'InventairePatrimoine' }" 
                        class="nav-link text-white"
                        active-class="active"
                        exact-active-class="active"
                    >
                        <i class="bi bi-tools me-2"></i> Inventaire & Patrimoine
                    </router-link>
                </li>

                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'Bureau' }" 
                        class="nav-link text-white"
                        active-class="active"
                        exact-active-class="active"
                    >
                        <i class="bi bi-tools me-2"></i> Matériel de Bureau
                    </router-link>
                </li>

                <li class="nav-item mb-2">
                    <router-link 
                        :to="{ name: 'ClientManagement' }" 
                        class="nav-link text-white"
                        active-class="active"
                        exact-active-class="active"
                    >
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
                <h1 class="text-secondary mb-0">{{ currentSectionTitle }}</h1>
                <small class="text-muted">Rôle: {{ userRole }}</small>
            </header>
            
            <div class="p-4">
                <!-- CORRECTION : Utilisation de $route.name pour détecter la section active -->
                <div v-if="$route.name === 'ReceptionAccueil'">
                    <!-- Contenu de l'accueil -->
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
                                :linkName="'DemandesEnAttente'"
                            />
                        </div>
                        <div class="col-md-4 mb-4">
                            <KpiCard 
                                icon="bi-bell" 
                                title="Locations du Jour" 
                                :value="kpis.todayEvents" 
                                trend="" 
                                color="text-info"
                                :linkName="'CalendrierDisponibilites'"
                            />
                        </div>
                        <div class="col-md-4 mb-4">
                            <KpiCard 
                                icon="bi-bricks" 
                                title="Ressources Indisponibles" 
                                :value="kpis.unavailableResources" 
                                trend="Rapport de maintenance" 
                                color="text-danger"
                                :linkName="'InventairePatrimoine'"
                            />
                        </div>
                    </div>
                    
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
                </div>
                
                <!-- Sections conditionnelles pour les autres routes -->
                <div v-else-if="$route.name === 'NouvelleReservation'">
                    <h3>Nouvelle Réservation / Location</h3>
                    <!-- Votre contenu pour nouvelle réservation -->
                </div>
                
                <div v-else-if="$route.name === 'DemandesEnAttente'">
                    <h3>Demandes à Traiter</h3>
                    <!-- Votre contenu pour demandes en attente -->
                </div>
                
                <!-- ... autres sections conditionnelles ... -->
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthService from '../services/AuthService'; 
import LocationService from '../services/LocationService'; 
import KpiCard from '../views/KpiCard.vue'; 
import Chart from 'chart.js/auto';

const router = useRouter(); 
const route = useRoute();

// CORRECTION : Vérifiez que useRoute() fonctionne
console.log('Route actuelle:', route.name);

// ... le reste de votre code ...

// Dans onMounted, redirigez vers la bonne route
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && user.roleUti.toLowerCase() === 'reception') {
        userRole.value = user.roleUti.toUpperCase();
        fetchReceptionData();
        fetchReservationStats();
        
        // Si on est sur l'ancienne route, rediriger vers la nouvelle
        if (route.name === 'ReceptionDashboardOld') {
            router.replace({ name: 'ReceptionAccueil' });
        }
    } else {
        router.push('/'); 
    }
});
</script>