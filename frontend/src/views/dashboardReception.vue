<template>
    <div class="dashboard-wrapper"> 
        <n-layout has-sider class="h-100">
            <!-- Sidebar Naive UI -->
            <n-layout-sider
                bordered
                collapse-mode="width"
                :collapsed-width="64"
                :width="240"
                :native-scrollbar="false"
                show-trigger="bar"
                class="custom-sidebar"
            >
                <div class="sidebar-content d-flex flex-column h-100 p-3">
                    <!-- Logo et Titre -->
                    <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
                        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
                        <h4 class="sidebar-title mb-0 fs-6">CEDII Patrimoine Plus</h4>
                    </div>
                    
                    <!-- Menu Navigation -->
                    <n-menu
                        :options="menuOptions"
                        :value="activeMenuKey"
                        @update:value="handleMenuSelect"
                        class="flex-grow-1 custom-menu"
                    />
                    
                    <!-- Bouton Déconnexion -->
                    <div class="mt-auto pt-3 border-top border-white">
                        <n-button 
                            @click="logout" 
                            type="error"
                            size="small"
                            class="w-100"
                            ghost
                        >
                            <template #icon>
                                <i class="bi bi-box-arrow-right"></i>
                            </template>
                            Déconnexion
                        </n-button>
                    </div>
                </div>
            </n-layout-sider>

            <!-- Contenu Principal -->
            <n-layout class="main-content">
                <!-- Header -->
                <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
                    <h1 class="custom-title mb-0">Tableau de Bord Réception <i class="bi bi-house-door ms-2"></i></h1>
                    <n-tag type="info" size="small" class="custom-tag">
                        Rôle: {{ userRole }}
                    </n-tag>
                </n-layout-header>

                <!-- Contenu -->
                <n-layout-content class="p-4 bg-light">
                    <!-- Alerte Demandes en Attente -->
                    <n-alert 
                        v-if="pendingRequestsCount > 0"
                        type="warning"
                        title="Demandes en attente"
                        class="mb-4 shadow-sm custom-alert-warning"
                    >
                        <template #icon>
                            <i class="bi bi-exclamation-triangle-fill"></i>
                        </template>
                        Vous avez <strong>{{ pendingRequestsCount }} demandes de location/réservation</strong> en attente de validation. Veuillez les traiter en priorité.
                    </n-alert>

                    <!-- Disposition horizontale avec KPIs à gauche et graphique à droite -->
                    <div class="row g-3">
                        <!-- Colonne KPIs (gauche) - Disposition verticale -->
                        <div class="col-lg-4">
                            <n-card title="Indicateurs Clés" class="shadow-sm h-100 custom-card">
                                <div class="kpis-vertical">
                                    <!-- KPI Demandes en Attente -->
                                    <div class="kpi-vertical-item mb-3">
                                        <div class="custom-card-primary p-3 rounded">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-primary me-3">
                                                    <i class="bi bi-hourglass-split text-white"></i>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="mb-1 text-white">Demandes en Attente</h6>
                                                    <h4 class="mb-0 text-warning">{{ kpis.pendingRequests }}</h4>
                                                    <small class="text-white-50">Urgent: {{ kpis.urgentRequests }}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- KPI Locations du Jour -->
                                    <div class="kpi-vertical-item mb-3">
                                        <div class="custom-card-warning p-3 rounded">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-warning me-3">
                                                    <i class="bi bi-bell text-white"></i>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="mb-1 text-white">Locations du Jour</h6>
                                                    <h4 class="mb-0 text-warning">{{ kpis.todayEvents }}</h4>
                                                    <small class="text-white-50">À préparer</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- KPI Ressources Indisponibles -->
                                    <div class="kpi-vertical-item">
                                        <div class="custom-card-danger p-3 rounded">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-danger me-3">
                                                    <i class="bi bi-bricks text-white"></i>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h6 class="mb-1 text-white">Ressources Indisponibles</h6>
                                                    <h4 class="mb-0 text-danger">{{ kpis.unavailableResources }}</h4>
                                                    <small class="text-white-50">Maintenance</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </n-card>
                        </div>

                        <!-- Colonne Statistiques (droite) -->
                     <!-- Dans le template, section de la carte "Statistiques des Réservations" -->
<div class="col-lg-8">
    <n-card title="Statistiques des Réservations" class="shadow-sm h-100 custom-card">
        <template #header-extra>
            <n-button 
                text 
                @click="refreshStats" 
                :loading="loadingStats" 
                size="small"
                class="custom-btn-primary"
            >
                <template #icon>
                    <i class="bi bi-arrow-clockwise"></i>
                </template>
            </n-button>
        </template>
        
        <div class="chart-container d-flex flex-column" style="height: 300px;">
            <div v-if="loadingStats" class="text-center text-muted h-100 d-flex flex-column justify-content-center">
                <n-spin size="medium" />
                <p class="mt-2 mb-0 small">Chargement...</p>
            </div>
            <div v-else-if="!hasStats" class="text-center text-muted h-100 d-flex flex-column justify-content-center">
                <n-empty description="Aucune donnée" size="small">
                    <template #icon>
                        <i class="bi bi-bar-chart" style="font-size: 2rem; color: #55555E;"></i>
                    </template>
                </n-empty>
            </div>
            <div v-else class="h-100 d-flex flex-column">
                <div class="text-center mb-2">
                    <h6 class="mb-1 fw-bold">Répartition des Réservations</h6>
                    <small class="text-muted">Total: {{ totalReservations }} réservations</small>
                </div>
                
                <!-- WRAPPER POUR CONTENIR LE GRAPHIQUE -->
                <div class="chart-wrapper flex-grow-1 position-relative" style="overflow: hidden;">
                    <canvas 
                        ref="statsChartCanvas" 
                        class="chart-canvas"
                        style="max-width: 100%; max-height: 100%;"
                    ></canvas>
                </div>
                
                <div class="legend-container mt-2 pt-2 border-top">
                    <div class="row text-center small">
                        <div class="col-4">
                            <span class="legend-dot" style="background-color: rgba(94, 94, 94, 0.8);"></span>
                            Matériel: {{ reservationStats.materiel }}
                        </div>
                        <div class="col-4">
                            <span class="legend-dot" style="background-color: rgba(91, 17, 238, 0.8);"></span>
                            Salle: {{ reservationStats.salle }}
                        </div>
                        <div class="col-4">
                            <span class="legend-dot" style="background-color: rgba(6, 113, 134, 0.8);"></span>
                            Mixte: {{ reservationStats.mixte }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </n-card>
</div>
                    </div>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
    NLayout, 
    NLayoutSider, 
    NLayoutContent, 
    NLayoutHeader, 
    NMenu, 
    NButton, 
    NIcon, 
    NAlert, 
    NTag, 
    NCard, 
    NSpin, 
    NEmpty,
    NBadge
} from 'naive-ui';

import AuthService from '../services/AuthService'; 
import LocationService from '../services/LocationService'; 
import ReservationService from '../services/ReservationService';
import Chart from 'chart.js/auto';

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const kpis = ref({ 
    pendingRequests: 0, 
    urgentRequests: 0, 
    todayEvents: 0, 
    unavailableResources: 0
});
const allRequests = ref([]);
const statsChartCanvas = ref(null);
const chartInstance = ref(null);
const reservationStats = ref({ materiel: 0, salle: 0, mixte: 0 });
const loadingStats = ref(true);
const activeMenuKey = ref('accueil');

// Options du menu avec texte blanc
const menuOptions = [
    {
        label: () => h('span', { class: 'text-white' }, 'Accueil'),
        key: 'accueil',
        icon: renderIcon('bi-house-door-fill')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Nouvelle Réservation / Location'),
        key: 'nouvelle-reservation',
        icon: renderIcon('bi-calendar-plus-fill')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { class: 'text-white' }, 'Demandes à Traiter'),
            kpis.value.pendingRequests > 0 ? h(NBadge, {
                value: kpis.value.pendingRequests,
                type: 'warning',
                max: 99,
                class: 'ms-2 custom-badge'
            }) : null
        ]),
        key: 'demandes-attente',
        icon: renderIcon('bi-bell-fill')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Calendrier & Disponibilités'),
        key: 'calendrier',
        icon: renderIcon('bi-calendar-day')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Inventaire & Patrimoine'),
        key: 'inventaire',
        icon: renderIcon('bi-tools')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Matériel de Bureau'),
        key: 'bureau',
        icon: renderIcon('bi-briefcase-fill')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Fiches Clients'),
        key: 'clients',
        icon: renderIcon('bi-people-fill')
    }
];

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
    return () => h(NIcon, null, {
        default: () => h('i', { class: iconClass + ' text-white' })
    });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
    const routeMap = {
        'accueil': 'ReceptionDashboard',
        'nouvelle-reservation': 'NouvelleReservation',
        'demandes-attente': 'DemandesEnAttente',
        'calendrier': 'CalendrierDisponibilites',
        'inventaire': 'InventairePatrimoine',
        'bureau': 'Bureau',
        'clients': 'ClientManagement'
    };
    
    if (routeMap[key]) {
        router.push({ name: routeMap[key] });
    }
};

// Propriétés calculées
const pendingRequestsCount = computed(() => kpis.value.pendingRequests);
const totalReservations = computed(() => 
    reservationStats.value.materiel + reservationStats.value.salle + reservationStats.value.mixte
);
const hasStats = computed(() => 
    reservationStats.value.materiel > 0 || 
    reservationStats.value.salle > 0 || 
    reservationStats.value.mixte > 0
);
const fetchReservationStats = async () => {
    loadingStats.value = true;
    try {
        // Essayez d'abord avec ReservationService
        const response = await ReservationService.getReservationStats();
        
        // Adaptez la structure de réponse selon votre API
        reservationStats.value = {
            materiel: response.materiel || response.materielCount || 0,
            salle: response.salle || response.salleCount || 0,
            mixte: response.mixte || response.mixteCount || 0
        };
        
        console.log('📊 Statistiques chargées:', reservationStats.value);
        
    } catch (error) {
        console.error("Erreur de chargement des statistiques:", error);
        
        // 🎯 DONNÉES SIMULÉES TEMPORAIRES
        // Si vous avez un backend en développement, vous pouvez commenter cette partie
        // une fois l'API disponible
        reservationStats.value = { 
            materiel: Math.floor(Math.random() * 50) + 20, 
            salle: Math.floor(Math.random() * 40) + 15,
            mixte: Math.floor(Math.random() * 20) + 5
        };
        
        console.log('📊 Statistiques simulées utilisées:', reservationStats.value);
    } finally {
        loadingStats.value = false;
        if (hasStats.value) {
            await nextTick();
            renderChart();
        }
    }
};

const refreshStats = () => {
    fetchReservationStats();
};

/* Ajustez les options du graphique dans la fonction renderChart */
const renderChart = () => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }
    
    if (!statsChartCanvas.value) {
        console.error("Erreur de rendu: Le canvas n'est pas disponible.");
        return;
    }

    const total = totalReservations.value;
    
    if (total === 0) {
        console.warn("Rendu annulé : Aucune réservation (total est zéro).");
        return; 
    }

    const safePercentage = (value) => {
        return ((value / total) * 100).toFixed(1);
    };

    const data = {
        labels: [
            `Matériel (${safePercentage(reservationStats.value.materiel)}%)`, 
            `Salle (${safePercentage(reservationStats.value.salle)}%)`,
            `Mixte (${safePercentage(reservationStats.value.mixte)}%)`
        ],
        datasets: [{
            data: [
                reservationStats.value.materiel, 
                reservationStats.value.salle,
                reservationStats.value.mixte
            ],
            backgroundColor: [
                'rgba(94, 94, 94, 0.8)',      // Gris - Matériel
                'rgba(91, 17, 238, 0.8)',     // Violet - Salle  
                'rgba(6, 113, 134, 0.8)'      // Bleu CEDII - Mixte
            ],
            borderWidth: 1,  // Réduisez la bordure
            borderColor: '#fff',
            hoverOffset: 8   // Réduisez l'offset
        }]
    };

    chartInstance.value = new Chart(statsChartCanvas.value, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%',  // Réduisez légèrement le trou au centre
            plugins: {
                legend: {
                    display: false,  // Cachez la légende intégrée, utilisez la nôtre
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = safePercentage(value);
                            return `${label.split(' (')[0]}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            }
        }
    });
};

const fetchReceptionData = async () => {
    try {
        const response = await LocationService.getReceptionDashboardData(); 
        const data = response.data;
        
        console.log("📊 Données reçues du backend:", data);
        
        kpis.value.pendingRequests = data.pendingRequests || 0;
        kpis.value.urgentRequests = data.urgentRequests || 0;
        kpis.value.todayEvents = data.todayEvents || 0;
        kpis.value.unavailableResources = data.unavailableResources || 0;
        
        allRequests.value = data.latestRequests || [];
        
    } catch (error) {
        console.error("Erreur de chargement des données de réception:", error.response?.data || error);
    }
};

// Lifecycle
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && user.roleUti.toLowerCase() === 'reception') {
        userRole.value = user.roleUti.toUpperCase();
        fetchReceptionData();
        fetchReservationStats();
        
        // Définir l'élément de menu actif basé sur la route actuelle
        const routeToKeyMap = {
            'ReceptionDashboard': 'accueil',
            'NouvelleReservation': 'nouvelle-reservation',
            'DemandesEnAttente': 'demandes-attente',
            'CalendrierDisponibilites': 'calendrier',
            'InventairePatrimoine': 'inventaire',
            'Bureau': 'bureau',
            'ClientManagement': 'clients'
        };
        
        activeMenuKey.value = routeToKeyMap[route.name] || 'accueil';
    } else {
        router.push('/'); 
    }
});

function logout() {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (isConfirmed) {
        AuthService.logout();
        router.push('/');
    }
}
</script>

<style scoped>
.dashboard-wrapper {
    height: 100vh;
}

/* Sidebar en bleu nuit identique au dashboard financier */
.custom-sidebar {
    background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
    background: transparent;
}

.sidebar-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    object-fit: cover;
}

.sidebar-title {
    color: white !important;
    font-weight: 600;
    font-size: 0.9rem;
}

/* Styles pour le menu - Texte blanc */
:deep(.custom-menu) {
    background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item) {
    border-radius: 8px;
    margin-bottom: 4px;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
    color: white !important;
    transition: all 0.3s ease;
    background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Élément actif avec style cohérent */
:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
    color: white !important;
    font-weight: 600;
    border-left: 4px solid #007bff;
    border-radius: 4px;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content .n-menu-item-content__icon) {
    color: white !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover .n-menu-item-content__icon) {
    color: white !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected .n-menu-item-content__icon) {
    color: white !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content .n-menu-item-content__arrow) {
    color: white !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover .n-menu-item-content__arrow) {
    color: white !important;
}

/* Style pour le bouton de déconnexion cohérent */
:deep(.n-button.n-button--error-type.n-button--ghost) {
    color: #dc3545 !important;
    border-color: #dc3545 !important;
    background-color: transparent;
}

:deep(.n-button.n-button--error-type.n-button--ghost:hover) {
    background-color: #dc3545 !important;
    color: white !important;
}

/* Style pour le badge */
:deep(.custom-badge .n-badge-sup) {
    color: white !important;
    background-color: #ffc107;
    font-weight: bold;
}

/* Header cohérent avec le dashboard financier */
.custom-header {
    background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-title {
    color: white;
    font-weight: 700;
    margin: 0;
    font-size: 1.5rem;
}

.custom-tag {
    font-weight: 600;
}

/* Cartes avec couleurs cohérentes du dashboard financier */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, #0405BF 0%, #0405BF 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #5E5E5E 0%, #5E5E5E 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

/* Icônes avec fond cohérent */
.custom-icon-primary, 
.custom-icon-warning,
.custom-icon-danger {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

/* Boutons cohérents */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* Alerte cohérente */
.custom-alert-warning {
  border-left: 4px solid #ffc107;
}

/* Cartes générales */
.custom-card {
  border: none;
  border-radius: 8px;
}

/* Disposition KPIs en vertical */
.kpis-vertical {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.kpi-vertical-item {
    flex: 1;
    min-height: 100px;
}

.kpi-vertical-item:last-child {
    margin-bottom: 0 !important;
}

.chart-container {
    min-height: 300px;
}

/* Responsive */
@media (max-width: 992px) {
    .row {
        flex-direction: column;
    }
    
    .col-lg-4, .col-lg-8 {
        width: 100%;
    }
    
    .kpis-vertical {
        gap: 1rem;
    }
    
    .kpi-vertical-item {
        min-height: 90px;
    }
}

@media (min-width: 1200px) {
    .kpis-vertical {
        gap: 1rem;
    }
}

/* Animation de chargement */
:deep(.n-spin-container) {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Bordure de séparation */
.border-top.border-white {
    border-color: rgba(255, 255, 255, 0.3) !important;
}

/* Styles pour les cartes compactes */
:deep(.n-card .n-card-header) {
    padding: 12px 16px;
}

:deep(.n-card .n-card-content) {
    padding: 16px;
}

/* Amélioration de l'espacement général */
.main-content {
    overflow-y: auto;
}

.bg-light {
    background-color: #f8f9fa !important;
}

/* Styles pour le conteneur du graphique */
.chart-container {
    min-height: 300px;
    max-height: 300px;
}

.chart-wrapper {
    width: 100%;
    height: 180px; /* Hauteur fixe pour le graphique */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: #f8f9fa;
    padding: 8px;
}

.chart-canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.legend-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
}

.legend-container {
    flex-shrink: 0;
}

/* Assurez-vous que la carte ne déborde pas */
.custom-card {
    overflow: hidden;
}

.custom-card :deep(.n-card-content) {
    overflow: hidden;
}

</style>