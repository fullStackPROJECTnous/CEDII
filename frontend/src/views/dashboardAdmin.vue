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
                    <h1 class="text-secondary mb-0 fs-4">
                        <em>Bienvenue sur la Gestion Patrimoniale du CEDII</em>
                    </h1>
                    <n-tag type="info" size="small">
                        Utilisateur: {{ userRole }}
                    </n-tag>
                </n-layout-header>

                <!-- Contenu -->
                <n-layout-content class="p-4 bg-light">
                    <!-- Indicateurs de chargement -->
                    <n-alert v-if="loading.kpis" title="Chargement" type="info" class="mb-4">
                        Chargement des statistiques...
                    </n-alert>

                    <!-- Disposition horizontale compacte - MODIFIÉE -->
                    <div class="row g-3">
                        <!-- Colonne KPIs (gauche) - RÉDUITE -->
                        <div class="col-lg-6">
                            <n-card title="Indicateurs Clés" class="shadow-sm h-100" content-class="p-2">
                                <div class="kpis-grid-compact">
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-people-fill" 
                                            title="Clients Actifs" 
                                            :value="kpis.totalClients" 
                                            color="cedii-text-primary" 
                                            border-color="border-primary"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-calendar-check" 
                                            title="Locations (Mois)" 
                                            :value="kpis.locationsMois" 
                                            color="text-success" 
                                            border-color="border-success"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-bar-chart-line" 
                                            title="Occup. Matériels" 
                                            :value="`${kpis.tauxOccupationMateriel}%`" 
                                            color="text-info" 
                                            border-color="border-info"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-bar-chart-line" 
                                            title="Occup. Salles" 
                                            :value="`${kpis.tauxOccupationSalle}%`" 
                                            color="text-warning" 
                                            border-color="border-warning"
                                            compact
                                        />
                                    </div>
                                </div>
                            </n-card>
                        </div>

                        <!-- Colonne Statistiques (droite) - AGRANDIE -->
                        <div class="col-lg-6">
                            <n-card title="Distribution du Revenu par Type de Client" class="shadow-sm h-100">
                                <template #header-extra>
                                    <n-button 
                                        text 
                                        @click="refreshChart" 
                                        :loading="loading.revenue" 
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
                                
                                <div class="chart-container-expanded d-flex flex-column justify-content-center align-items-center">
                                    <div v-if="loading.revenue" class="text-center text-muted">
                                        <n-spin size="medium" />
                                        <p class="mt-2 mb-0 small">Chargement...</p>
                                    </div>
                                    <div v-else class="w-100 h-100 d-flex flex-column">
                                        <div class="text-center mb-3">
                                            <h6 class="mb-1 fw-bold">Répartition des Revenus</h6>
                                            <small class="text-muted">Total: {{ formatCurrency(totalRevenue) }} Ar</small>
                                        </div>
                                        <div class="chart-canvas-container">
                                            <!-- CANVAS AVEC PLUS D'ESPACE -->
                                            <canvas 
                                                ref="revenueChartCanvas" 
                                                :key="chartKey"
                                                class="revenue-chart"
                                            ></canvas>
                                        </div>
                                        <div class="chart-legend mt-3">
                                            <div class="row text-center small g-2">
                                                <div class="col-4">
                                                    <span class="legend-dot" style="background-color: #FF6384;"></span>
                                                    Entreprises
                                                </div>
                                                <div class="col-4">
                                                    <span class="legend-dot" style="background-color: #36A2EB;"></span>
                                                    Particuliers
                                                </div>
                                                <div class="col-4">
                                                    <span class="legend-dot" style="background-color: #FFCE56;"></span>
                                                    ONG
                                                </div>
                                                <div class="col-6">
                                                    <span class="legend-dot" style="background-color: #4BC0C0;"></span>
                                                    Associations
                                                </div>
                                                <div class="col-6">
                                                    <span class="legend-dot" style="background-color: #9966FF;"></span>
                                                    Institutions
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </n-card>
                        </div>
                    </div>

                    <!-- Tableaux sous les KPIs -->
                    <div class="row g-3 mt-3">
                        <!-- Actions & Événements du Jour -->
                        <div class="col-lg-6">
                            <n-card title="Actions & Événements du Jour" class="shadow-sm border-danger">
                                <template #header-extra>
                                    <n-tag type="error" size="small">
                                        {{ urgentReservations.length + todayEvents.length }} actions
                                    </n-tag>
                                </template>

                                <n-list class="compact-list">
                                    <!-- Réservations à valider -->
                                    <n-list-item>
                                        <template #prefix>
                                            <n-icon color="#FF4757" size="18">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        <n-thing
                                            title="Réservations à valider"
                                            :description="`${urgentReservations.length} en attente`"
                                            class="compact-thing"
                                        />
                                    </n-list-item>

                                    <n-list-item v-for="res in urgentReservations" :key="res.idRes" class="compact-list-item">
                                        <template #prefix>
                                            <n-icon color="#FFA500" size="16">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        
                                        <n-thing
                                            :title="getClientName(res)"
                                            :description="`${res.typeRes === 'Salle' ? 'Salle' : 'Matériel'} - ${formatDateSimple(res.debRes)}`"
                                            class="compact-thing"
                                        />
                                        
                                        <template #suffix>
                                            <n-tag type="warning" size="small">
                                                À valider
                                            </n-tag>
                                        </template>
                                    </n-list-item>

                                    <!-- Locations Début/Fin -->
                                    <n-list-item>
                                        <template #prefix>
                                            <n-icon color="#18A058" size="18">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
                                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        <n-thing
                                            title="Locations Début/Fin"
                                            :description="`${todayEvents.length} événements aujourd'hui`"
                                            class="compact-thing"
                                        />
                                    </n-list-item>

                                    <n-list-item v-for="event in todayEvents" :key="event.idRes + event.type" class="compact-list-item">
                                        <template #prefix>
                                            <n-icon :color="event.type === 'start' ? '#18A058' : '#2080F0'" size="16">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        
                                        <n-thing
                                            :title="getClientName(event)"
                                            :description="`${event.typeRes === 'Salle' ? 'Salle' : 'Matériel'}`"
                                            class="compact-thing"
                                        />
                                        
                                        <template #suffix>
                                            <n-tag :type="event.type === 'start' ? 'success' : 'info'" size="small">
                                                {{ event.type === 'start' ? 'DÉBUT' : 'FIN' }}
                                            </n-tag>
                                        </template>
                                    </n-list-item>

                                    <!-- États vides -->
                                    <n-list-item v-if="urgentReservations.length === 0 && todayEvents.length === 0 && !loading.reservations">
                                        <div class="text-center text-muted py-2">
                                            Aucune action requise aujourd'hui
                                        </div>
                                    </n-list-item>

                                    <n-list-item v-if="loading.reservations">
                                        <div class="text-center py-2">
                                            <n-spin size="small" />
                                            <p class="mt-2 mb-0 small text-muted">Chargement des réservations...</p>
                                        </div>
                                    </n-list-item>
                                </n-list>
                            </n-card>
                        </div>

                        <!-- Informations supplémentaires -->
                        <div class="col-lg-6">
                            <n-card title="Aperçu du Patrimoine" class="shadow-sm border-secondary">
                                <n-list class="compact-list">
                                    <n-list-item>
                                        <n-thing
                                            title="État du Patrimoine"
                                            description="Vue d'ensemble des ressources"
                                            class="compact-thing"
                                        />
                                    </n-list-item>
                                    
                                    <n-list-item class="compact-list-item">
                                        <template #prefix>
                                            <n-icon color="#18A058" size="18">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        <n-thing
                                            title="Ressources Disponibles"
                                            description="Matériels et salles opérationnels"
                                            class="compact-thing"
                                        />
                                        <template #suffix>
                                            <n-tag type="success" size="small">
                                                85%
                                            </n-tag>
                                        </template>
                                    </n-list-item>

                                    <n-list-item class="compact-list-item">
                                        <template #prefix>
                                            <n-icon color="#FFA500" size="18">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                                                    <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        <n-thing
                                            title="Maintenance Requise"
                                            description="Ressources nécessitant entretien"
                                            class="compact-thing"
                                        />
                                        <template #suffix>
                                            <n-tag type="warning" size="small">
                                                12%
                                            </n-tag>
                                        </template>
                                    </n-list-item>
                                </n-list>

                                <template #footer>
                                    <div class="text-end">
                                        <router-link :to="{ name: 'InventairePatrimoine' }">
                                            <n-button size="small" type="primary">
                                                Voir le détail
                                            </n-button>
                                        </router-link>
                                    </div>
                                </template>
                            </n-card>
                        </div>
                    </div>
                </n-layout-content>
            </n-layout>
        </n-layout>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, h, onUnmounted } from 'vue';
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
    NBadge,
    NList,
    NListItem,
    NThing
} from 'naive-ui';

import { Chart, registerables } from 'chart.js';
import AuthService from '../services/AuthService'; 
import RapportService from '../services/RapportService'; 
import LocationService from '../services/LocationService'; 
import KpiCard from '../views/KpiCard.vue'; 

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const isAdmin = computed(() => userRole.value === 'ADMIN');
const activeMenuKey = ref('accueil');

// Références Chart.js
const revenueChartCanvas = ref(null);
const chartInstance = ref(null);
const chartKey = ref(0);

// Enregistrement des composants Chart.js
Chart.register(...registerables);

// Données
const kpis = ref({ 
    totalClients: 0, 
    locationsMois: 0, 
    revenuTotal: 0, 
    tauxOccupationSalle: 0,
    tauxOccupationMateriel: 0 
});
const allPendingReservations = ref([]);
const loading = ref({ kpis: false, reservations: false, revenue: false });

// Données du graphique
const revenueData = {
    labels: ['Entreprises', 'Particuliers', 'ONG', 'Associations', 'Institutions Publiques'],
    datasets: [
        {
            data: [45000, 25000, 15000, 10000, 5000],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 15
        }
    ]
};

// Options du menu
const menuOptions = [
    {
        label: () => h('span', { style: 'color: white;' }, 'Accueil'),
        key: 'accueil',
        icon: renderIcon('bi-house-door-fill')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Gestion des Utilisateurs'),
        key: 'utilisateurs',
        icon: renderIcon('bi-person-gear'),
        show: isAdmin.value
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Gestion des Clients'),
        key: 'clients',
        icon: renderIcon('bi-people-fill')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Inventaire & Patrimoine'),
        key: 'inventaire',
        icon: renderIcon('bi-tools')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Locations & Réservations'),
        key: 'locations',
        icon: renderIcon('bi-calendar-check')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Gestion Financière'),
        key: 'finance',
        icon: renderIcon('bi-bank')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Suivi & Rapports'),
        key: 'rapports',
        icon: renderIcon('bi-graph-up')
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
        'accueil': 'AdminDashboard',
        'utilisateurs': 'UserManagement',
        'clients': 'ClientManagement',
        'inventaire': 'InventairePatrimoine',
        'locations': 'Location',
        'finance': 'Finance',
        'rapports': 'Rapport'
    };
    
    if (routeMap[key]) {
        router.push({ name: routeMap[key] });
    }
};

// Propriétés calculées
const urgentReservations = computed(() => {
    return allPendingReservations.value
        .filter(res => res.etatRes === 'En attente')
        .sort((a, b) => new Date(a.debRes) - new Date(b.debRes))
        .slice(0, 5);
});

const todayEvents = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const events = [];
    
    allPendingReservations.value.forEach(res => {
        const debDate = res.debRes ? new Date(res.debRes).toISOString().split('T')[0] : null;
        const finDate = res.finRes ? new Date(res.finRes).toISOString().split('T')[0] : null;
        
        if (res.etatRes === 'Confirmée') {
            if (debDate === today) {
                events.push({ ...res, type: 'start' });
            }
            if (finDate === today) {
                events.push({ ...res, type: 'end' });
            }
        }
    });
    
    return events;
});

const totalRevenue = computed(() => {
    return revenueData.datasets[0].data.reduce((a, b) => a + b, 0);
});

// Fonctions du graphique
const initRevenueChart = async () => {
    try {
        console.log('🟡 Initialisation du graphique...');
        
        if (chartInstance.value) {
            chartInstance.value.destroy();
            chartInstance.value = null;
        }

        await nextTick();
        
        if (!revenueChartCanvas.value) {
            console.error('❌ Canvas non disponible');
            return;
        }

        const ctx = revenueChartCanvas.value.getContext('2d');
        if (!ctx) {
            console.error('❌ Context 2D non disponible');
            return;
        }

        console.log('✅ Canvas et contexte disponibles');

        chartInstance.value = new Chart(ctx, {
            type: 'doughnut',
            data: revenueData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false, // On utilise notre légende personnalisée
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: { size: 12 },
                        bodyFont: { size: 11 },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${percentage}% (${formatCurrency(value)} Ar)`;
                            }
                        }
                    }
                },
                cutout: '55%',
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000
                }
            }
        });

        console.log('✅ Graphique créé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur initialisation graphique:', error);
    }
};

const refreshChart = async () => {
    loading.value.revenue = true;
    try {
        chartKey.value++;
        await nextTick();
        await initRevenueChart();
    } catch (error) {
        console.error('Erreur rafraîchissement graphique:', error);
    } finally {
        loading.value.revenue = false;
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
};

// Fonctions utilitaires
const formatDateSimple = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getClientName = (reservation) => {
    if (reservation.Client && reservation.Client.idCli) {
        return `${reservation.Client.idCli}`;
    }
    if (reservation.idCli) {
        return `${reservation.idCli}`;
    }
    return 'Client inconnu';
};

// Fonctions de chargement
const fetchKPIs = async () => {
    try {
        loading.value.kpis = true;
        const response = await RapportService.getKPIs();
        kpis.value = response.data;
    } catch (error) {
        console.error("Erreur chargement KPIs:", error);
        kpis.value = { 
            totalClients: 0, 
            locationsMois: 0, 
            revenuTotal: 0, 
            tauxOccupationSalle: 0,
            tauxOccupationMateriel: 0
        };
    } finally {
        loading.value.kpis = false;
    }
};

const fetchReservations = async () => {
    try {
        loading.value.reservations = true;
        const response = await LocationService.getPendingReservations();
        allPendingReservations.value = response.data;
    } catch (error) {
        console.error("Erreur chargement réservations:", error);
        allPendingReservations.value = [];
    } finally {
        loading.value.reservations = false;
    }
};

const logout = () => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (isConfirmed) {
        AuthService.logout();
        router.push('/');
    }
};

// Lifecycle
onMounted(async () => {
    const user = AuthService.getCurrentUser();
    if (user && user.roleUti) {
        userRole.value = user.roleUti.toUpperCase();
        
        const routeToKeyMap = {
            'AdminDashboard': 'accueil',
            'UserManagement': 'utilisateurs',
            'ClientManagement': 'clients',
            'InventairePatrimoine': 'inventaire',
            'Location': 'locations',
            'Finance': 'finance',
            'Rapport': 'rapports'
        };
        
        activeMenuKey.value = routeToKeyMap[route.name] || 'accueil';
        
        await fetchKPIs();
        await fetchReservations();
        
        setTimeout(async () => {
            await initRevenueChart();
        }, 1000);
        
    } else {
        router.push('/');
    }
});

onUnmounted(() => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }
});
</script>

<style scoped>
.dashboard-wrapper {
    height: 100vh;
}

/* Sidebar */
.cedii-sidebar {
    background-color: #02061E !important;
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

/* Styles pour le menu */
:deep(.cedii-menu) {
    background-color: transparent !important;
}

:deep(.cedii-menu .n-menu-item .n-menu-item-content) {
    color: white !important;
}

:deep(.cedii-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
    background-color: transparent !important;
    color: white !important;
    font-weight: 600;
    border-bottom: 2px solid #04058F;
    border-radius: 0;
}

/* INDICATEURS CLÉS COMPACT */
.kpis-grid-compact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.kpi-item-compact {
    min-height: 60px;
}

/* CHART EXPANDED */
.chart-container-expanded {
    height: 320px;
    min-height: 320px;
}

.chart-canvas-container {
    flex-grow: 1;
    min-height: 180px;
    position: relative;
}

.revenue-chart {
    display: block;
    width: 100% !important;
    height: 100% !important;
    max-height: 200px;
}

.chart-legend {
    margin-top: auto;
}

.legend-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
}

/* LISTES COMPACTES */
.compact-list :deep(.n-list-item) {
    padding: 6px 0;
}

.compact-list-item :deep(.n-list-item) {
    padding: 4px 0;
}

.compact-thing :deep(.n-thing-main) {
    padding: 4px 0;
}

.compact-thing :deep(.n-thing-main .n-thing-body) {
    margin-top: 2px;
}

/* Style pour le bouton de déconnexion */
:deep(.n-button.n-button--error-type.n-button--ghost) {
    color: #dc3545 !important;
    border-color: #dc3545 !important;
    background-color: transparent;
}

:deep(.n-button.n-button--error-type.n-button--ghost:hover) {
    background-color: #dc3545 !important;
    color: white !important;
}

:deep(.n-layout-header) {
    background-color: white !important;
    border-bottom: 1px solid #e0e0e0;
}

/* Bordures personnalisées pour les cartes */
:deep(.border-danger) {
    border: 2px solid #dc3545 !important;
}

:deep(.border-secondary) {
    border: 2px solid #6c757d !important;
}

/* Responsive */
@media (max-width: 992px) {
    .row {
        flex-direction: column;
    }
    
    .col-lg-6 {
        width: 100%;
    }
    
    .kpis-grid-compact {
        grid-template-columns: 1fr;
        gap: 0.4rem;
    }
    
    .chart-container-expanded {
        height: 280px;
        min-height: 280px;
    }
}

@media (min-width: 1200px) {
    .kpis-grid-compact {
        grid-template-columns: 1fr 1fr;
        gap: 0.6rem;
    }
    
    .chart-container-expanded {
        height: 340px;
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
    padding: 10px 14px;
}

:deep(.n-card .n-card-content) {
    padding: 10px 14px;
}

/* Amélioration de l'espacement général */
.main-content {
    overflow-y: auto;
}

.bg-light {
    background-color: #f8f9fa !important;
}
</style>