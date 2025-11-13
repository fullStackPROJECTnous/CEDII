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
                class="cedii-sidebar"
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
                        class="flex-grow-1 cedii-menu"
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
                                <n-icon>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                    </svg>
                                </n-icon>
                            </template>
                            Déconnexion
                        </n-button>
                    </div>
                </div>
            </n-layout-sider>

            <!-- Contenu Principal -->
            <n-layout class="main-content">
                <!-- Header -->
                <n-layout-header bordered class="d-flex justify-content-between align-items-center p-4 pb-0 bg-white">
                    <h1 class="text-secondary mb-0 fs-4">Tableau de bord Réception</h1>
                    <n-tag type="info" size="small">
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
                        class="mb-4 shadow-sm"
                    >
                        <template #icon>
                            <n-icon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                            </n-icon>
                        </template>
                        Vous avez <strong>{{ pendingRequestsCount }} demandes de location/réservation</strong> en attente de validation. Veuillez les traiter en priorité.
                    </n-alert>

                    <!-- Disposition horizontale compacte -->
                    <div class="row g-3">
                        <!-- Colonne KPIs (gauche) - Plus compacte -->
                        <div class="col-lg-8">
                            <n-card title="Indicateurs Clés" class="shadow-sm h-100" content-class="p-2">
                                <div class="kpis-grid">
                                    <div class="kpi-item">
                                        <KpiCard 
                                            icon="bi-hourglass-split" 
                                            title="Demandes en Attente" 
                                            :value="kpis.pendingRequests" 
                                            :trend="`Urgent : ${kpis.urgentRequests}`" 
                                            color="cedii-text-primary"
                                            linkName="DemandesEnAttente"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item">
                                        <KpiCard 
                                            icon="bi-bell" 
                                            title="Locations du Jour" 
                                            :value="kpis.todayEvents" 
                                            trend="" 
                                            color="text-info"
                                            linkName="Disponibilites"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item">
                                        <KpiCard 
                                            icon="bi-bricks" 
                                            title="Ressources Indisponibles" 
                                            :value="kpis.unavailableResources" 
                                            trend="Rapport de maintenance" 
                                            color="text-danger"
                                            linkName="InventaireSimple"
                                            compact
                                        />
                                    </div>
                                </div>
                            </n-card>
                        </div>

                        <!-- Colonne Statistiques (droite) -->
                        <div class="col-lg-4">
                            <n-card title="Statistiques des Réservations" class="shadow-sm h-100">
                                <template #header-extra>
                                    <n-button 
                                        text 
                                        @click="refreshStats" 
                                        :loading="loadingStats" 
                                        size="small"
                                    >
                                        <template #icon>
                                            <n-icon>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </template>
                                
                                <div class="chart-container d-flex flex-column justify-content-center align-items-center" style="height: 250px;">
                                    <div v-if="loadingStats" class="text-center text-muted">
                                        <n-spin size="medium" />
                                        <p class="mt-2 mb-0 small">Chargement...</p>
                                    </div>
                                    <div v-else-if="!hasStats" class="text-center text-muted">
                                        <n-empty description="Aucune donnée" size="small">
                                            <template #icon>
                                                <n-icon>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
                                                        <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                                                    </svg>
                                                </n-icon>
                                            </template>
                                        </n-empty>
                                    </div>
                                    <div v-else class="w-100 h-100 d-flex flex-column">
                                        <div class="text-center mb-2">
                                            <h6 class="mb-1 fw-bold">Matériel vs Salle</h6>
                                            <small class="text-muted">Total: {{ reservationStats.materiel + reservationStats.salle }} réservations</small>
                                        </div>
                                        <div class="flex-grow-1 position-relative">
                                            <canvas ref="statsChartCanvas" class="w-100 h-100"></canvas>
                                        </div>
                                        <div class="mt-2">
                                            <div class="row text-center small">
                                                <div class="col-6">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(94, 94, 94, 0.8); border-radius: 2px;"></span>
                                                    Matériel: {{ reservationStats.materiel }}
                                                </div>
                                                <div class="col-6">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(91, 17, 238, 0.8); border-radius: 2px;"></span>
                                                    Salle: {{ reservationStats.salle }}
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
import KpiCard from '../views/KpiCard.vue'; 
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
const reservationStats = ref({ materiel: 0, salle: 0 });
const loadingStats = ref(true);
const activeMenuKey = ref('accueil');

// Options du menu avec texte blanc
const menuOptions = [
    {
        label: () => h('span', { style: 'color: white;' }, 'Accueil'),
        key: 'accueil',
        icon: renderIcon('bi-house-door-fill')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Nouvelle Réservation / Location'),
        key: 'nouvelle-reservation',
        icon: renderIcon('bi-calendar-plus-fill')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { style: 'color: white;' }, 'Demandes à Traiter'),
            kpis.value.pendingRequests > 0 ? h(NBadge, {
                value: kpis.value.pendingRequests,
                type: 'error',
                max: 99,
                class: 'ms-2',
                style: 'color: black !important;'
            }) : null
        ]),
        key: 'demandes-attente',
        icon: renderIcon('bi-bell-fill')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Calendrier & Disponibilités'),
        key: 'calendrier',
        icon: renderIcon('bi-calendar-day')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Inventaire & Patrimoine'),
        key: 'inventaire',
        icon: renderIcon('bi-tools')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Matériel de Bureau'),
        key: 'bureau',
        icon: renderIcon('bi-briefcase-fill')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Fiches Clients'),
        key: 'clients',
        icon: renderIcon('bi-people-fill')
    }
];

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
    return () => h(NIcon, null, {
        default: () => h('i', { class: iconClass, style: 'color: white;' })
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
const hasStats = computed(() => reservationStats.value.materiel > 0 || reservationStats.value.salle > 0);

// Fonctions de données
const fetchReservationStats = async () => {
    loadingStats.value = true;
    try {
        reservationStats.value.materiel = 120; 
        reservationStats.value.salle = 80;
    } catch (error) {
        console.error("Erreur de chargement des statistiques:", error);
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

const renderChart = () => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }
    
    if (!statsChartCanvas.value) {
        console.error("Erreur de rendu: Le canvas n'est pas disponible.");
        return;
    }

    const total = reservationStats.value.materiel + reservationStats.value.salle;
    
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
            `Salle (${safePercentage(reservationStats.value.salle)}%)`
        ],
        datasets: [{
            data: [reservationStats.value.materiel, reservationStats.value.salle],
            backgroundColor: [
                'rgba(94, 94, 94, 0.8)',
                'rgba(91, 17, 238, 0.8)'
            ],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 15
        }]
    };

    chartInstance.value = new Chart(statsChartCanvas.value, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 11
                        },
                        color: '#333',
                        usePointStyle: true,
                        padding: 10
                    }
                }
            }
        }
    });
};

const fetchReceptionData = async () => {
    try {
        const response = await LocationService.getReceptionDashboardData(); 
        const data = response.data;
        
        console.log("📊 Données reçues du backend:", data); // 🎯 AJOUTEZ CE LOG
        
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

/* Sidebar en bleu nuit identique à la navbar */
.cedii-sidebar {
    background-color: #02061E !important; /* Même bleu nuit que la navbar */
}

.sidebar-content {
    background: transparent;
}

.sidebar-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3); /* Bordure similaire à la navbar */
    object-fit: cover;
}

.sidebar-title {
    color: white !important;
    font-weight: 600;
    font-size: 0.9rem; /* Taille similaire à la navbar */
}

/* Styles pour le menu - Texte blanc */
:deep(.cedii-menu) {
    background-color: transparent !important;
}

:deep(.cedii-menu .n-menu-item) {
    border-radius: 8px;
    margin-bottom: 4px;
}

:deep(.cedii-menu .n-menu-item .n-menu-item-content) {
    color: white !important;
    transition: all 0.3s ease;
    background-color: transparent !important;
}

/* HOVER COMPLÈTEMENT SUPPRIMÉ - AUCUN CHANGEMENT AU SURVOL */
:deep(.cedii-menu .n-menu-item .n-menu-item-content:hover) {
    /* RIEN - HOVER SUPPRIMÉ */
    background-color: transparent !important;
    color: white !important;
}

/* Élément actif avec soulignage bleu comme la navbar */
:deep(.cedii-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
    background-color: transparent !important;
    color: white !important;
    font-weight: 600;
    border-bottom: 2px solid #04058F; /* Même bleu que la navbar active */
    border-radius: 0;
}

:deep(.cedii-menu .n-menu-item .n-menu-item-content .n-menu-item-content__icon) {
    color: white !important;
}

/* HOVER DES ICÔNES SUPPRIMÉ */
:deep(.cedii-menu .n-menu-item .n-menu-item-content:hover .n-menu-item-content__icon) {
    color: white !important; /* Reste blanc au hover */
}

:deep(.cedii-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected .n-menu-item-content__icon) {
    color: white !important;
}

:deep(.cedii-menu .n-menu-item .n-menu-item-content .n-menu-item-content__arrow) {
    color: white !important;
}

/* HOVER DES FLÈCHES SUPPRIMÉ */
:deep(.cedii-menu .n-menu-item .n-menu-item-content:hover .n-menu-item-content__arrow) {
    color: white !important; /* Reste blanc au hover */
}

/* Style pour le bouton de déconnexion cohérent avec la navbar */
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
:deep(.cedii-menu .n-badge .n-badge-sup) {
    color: white !important;
    background-color: #dc3545;
    font-weight: bold;
}

:deep(.n-layout-header) {
    background-color: white !important;
    border-bottom: 1px solid #e0e0e0;
}

/* Disposition KPIs en grille compacte */
.kpis-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
}

.kpi-item {
    min-height: 80px;
}

.chart-container {
    min-height: 250px;
}

/* Responsive */
@media (max-width: 992px) {
    .row {
        flex-direction: column;
    }
    
    .col-lg-8, .col-lg-4 {
        width: 100%;
    }
    
    .kpis-grid {
        gap: 0.5rem;
    }
}

@media (min-width: 1200px) {
    .kpis-grid {
        grid-template-columns: 1fr;
        gap: 0.8rem;
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
    padding: 12px 16px;
}

/* Amélioration de l'espacement général */
.main-content {
    overflow-y: auto;
}

.bg-light {
    background-color: #f8f9fa !important;
}
</style>