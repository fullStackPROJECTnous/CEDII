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
                <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
                    <h1 class="custom-title mb-0">
                        <em>Bienvenue sur la Gestion Patrimoniale du CEDII</em>
                        <i class="bi bi-cash-coin ms-2"></i>
                    </h1>
                    <n-tag type="info" size="small" class="custom-tag">
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
                                        <div class="custom-card-primary h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-primary me-3">
                                                    <i class="bi bi-people-fill text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Clients Actifs</h6>
                                                    <h4 class="mb-0 text-warning">{{ kpis.totalClients }}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kpi-item-compact">
                                        <div class="custom-card-warning h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-warning me-3">
                                                    <i class="bi bi-calendar-check text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Locations (Mois)</h6>
                                                    <h4 class="mb-0 text-warning">{{ kpis.locationsMois }}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kpi-item-compact">
                                        <div class="custom-card-danger h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-danger me-3">
                                                    <i class="bi bi-bar-chart-line text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Occup. Matériels</h6>
                                                    <h4 class="mb-0 text-danger">{{ kpis.tauxOccupationMateriel }}%</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kpi-item-compact">
                                        <div class="custom-card-success h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-success me-3">
                                                    <i class="bi bi-bar-chart-line text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Occup. Salles</h6>
                                                    <h4 class="mb-0 text-success">{{ kpis.tauxOccupationSalle }}%</h4>
                                                </div>
                                            </div>
                                        </div>
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
                                        class="custom-btn-primary"
                                    >
                                        <template #icon>
                                            <i class="bi bi-arrow-clockwise"></i>
                                        </template>
                                    </n-button>
                                </template>
                                
                                <div class="cashflow-container-expanded">
                                    <div v-if="loading.revenue" class="text-center text-muted">
                                        <n-spin size="medium" />
                                        <p class="mt-2 mb-0 small">Calcul des indicateurs...</p>
                                    </div>
                                    <div v-else class="w-100 h-100 d-flex flex-column">
                                        <div class="text-center mb-3">
                                            <h6 class="mb-1 fw-bold">Répartition des Revenus</h6>
                                            <small class="text-muted">Total: {{ formatCurrency(totalRevenue) }} Ar</small>
                                        </div>
                                        <div class="cashflow-chart-expanded">
                                            <canvas ref="revenueChartCanvas" class="w-100 h-100"></canvas>
                                        </div>
                                        <div class="mt-3">
                                            <div class="row text-center small">
                                                <div class="col-4">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(255, 99, 132, 0.8); border-radius: 2px;"></span>
                                                    Entreprises
                                                </div>
                                                <div class="col-4">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(54, 162, 235, 0.8); border-radius: 2px;"></span>
                                                    Particuliers
                                                </div>
                                                <div class="col-4">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(255, 206, 86, 0.8); border-radius: 2px;"></span>
                                                    ONG
                                                </div>
                                                <div class="col-6">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(75, 192, 192, 0.8); border-radius: 2px;"></span>
                                                    Associations
                                                </div>
                                                <div class="col-6">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(153, 102, 255, 0.8); border-radius: 2px;"></span>
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
                            <n-card title="Actions & Événements du Jour" class="shadow-sm">
                                <template #header-extra>
                                    <n-tag type="error" size="small" class="custom-tag">
                                        {{ urgentReservations.length + todayEvents.length }} actions
                                    </n-tag>
                                </template>

                                <n-list class="custom-list">
                                    <!-- Réservations à valider -->
                                    <n-list-item>
                                        <template #prefix>
                                            <div class="custom-icon-danger-small">
                                                <i class="bi bi-exclamation-triangle-fill text-white"></i>
                                            </div>
                                        </template>
                                        <n-thing
                                            title="Réservations à valider"
                                            :description="`${urgentReservations.length} en attente`"
                                        />
                                    </n-list-item>

                                    <n-list-item v-for="res in urgentReservations" :key="res.idRes" class="custom-list-item">
                                        <template #prefix>
                                            <div class="custom-icon-warning me-2" style="width: 36px; height: 36px;">
                                                <i class="bi bi-clock text-white"></i>
                                            </div>
                                        </template>
                                        
                                        <n-thing
                                            :title="getClientName(res)"
                                            :description="`${res.typeRes === 'Salle' ? 'Salle' : 'Matériel'} - ${formatDateSimple(res.debRes)}`"
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
                                            <div class="custom-icon-success me-2" style="width: 36px; height: 36px;">
                                                <i class="bi bi-calendar-event text-white"></i>
                                            </div>
                                        </template>
                                        <n-thing
                                            title="Locations Début/Fin"
                                            :description="`${todayEvents.length} événements aujourd'hui`"
                                        />
                                    </n-list-item>

                                    <n-list-item v-for="event in todayEvents" :key="event.idRes + event.type" class="custom-list-item">
                                        <template #prefix>
                                            <div class="custom-icon-primary me-2" style="width: 36px; height: 36px;">
                                                <i class="bi bi-arrow-right-circle text-white"></i>
                                            </div>
                                        </template>
                                        
                                        <n-thing
                                            :title="getClientName(event)"
                                            :description="`${event.typeRes === 'Salle' ? 'Salle' : 'Matériel'}`"
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
                            <n-card title="Aperçu du Patrimoine" class="shadow-sm">
                                <n-list class="custom-list">
                                    <n-list-item>
                                        <n-thing
                                            title="État du Patrimoine"
                                            description="Vue d'ensemble des ressources"
                                        />
                                    </n-list-item>
                                    
                                    <n-list-item class="custom-list-item">
                                        <template #prefix>
                                            <div class="custom-icon-success me-2" style="width: 36px; height: 36px;">
                                                <i class="bi bi-check-circle-fill text-white"></i>
                                            </div>
                                        </template>
                                        <n-thing
                                            title="Ressources Disponibles"
                                            description="Matériels et salles opérationnels"
                                        />
                                        <template #suffix>
                                            <n-tag type="success" size="small">
                                                85%
                                            </n-tag>
                                        </template>
                                    </n-list-item>

                                    <n-list-item class="custom-list-item">
                                        <template #prefix>
                                            <div class="custom-icon-warning me-2" style="width: 36px; height: 36px;">
                                                <i class="bi bi-tools text-white"></i>
                                            </div>
                                        </template>
                                        <n-thing
                                            title="Maintenance Requise"
                                            description="Ressources nécessitant entretien"
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
                                        <router-link :to="{ name: 'InventairePatrimoineAD' }">
                                            <n-button size="small" type="default" class="custom-btn-outline">
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

// Options du menu avec texte blanc
const menuOptions = [
    {
        label: () => h('span', { class: 'text-white' }, 'Accueil'),
        key: 'accueil',
        icon: renderIcon('bi-house-door-fill')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Gestion des Utilisateurs'),
        key: 'utilisateurs',
        icon: renderIcon('bi-person-gear'),
        show: isAdmin.value
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Gestion des Clients'),
        key: 'clients',
        icon: renderIcon('bi-people-fill')
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
        label: () => h('span', { class: 'text-white' }, 'Locations & Réservations'),
        key: 'locations',
        icon: renderIcon('bi-calendar-check')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Gestion Financière'),
        key: 'finance',
        icon: renderIcon('bi-bank')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Suivi & Rapports'),
        key: 'rapports',
        icon: renderIcon('bi-graph-up')
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
        'accueil': 'AdminDashboard',
        'utilisateurs': 'UserManagement',
        'clients': 'ClientManagement1',
        'inventaire': 'InventairePatrimoineAD',
        'locations': 'Location',
        'finance': 'Finance',
        'bureau': 'Bureau1',
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
                        display: false,
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
                cutout: '60%',
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
/* COULEURS DU DASHBOARD FINANCE */

.dashboard-wrapper {
    height: 100vh;
}

/* Sidebar en bleu nuit */
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

/* Styles pour le menu */
:deep(.custom-menu) {
    background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
    color: white !important;
    transition: all 0.3s ease;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
    background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
    color: white !important;
    font-weight: 600;
    border-left: 4px solid #007bff;
    border-radius: 4px;
}

/* Header */
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

/* Cartes avec couleurs du dashboard finance */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, #dc3545 0%, #dc3545 100%);
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

/* Icônes avec fond du dashboard finance */
.custom-icon-primary, 
.custom-icon-success,
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

.custom-icon-danger-small {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: rgba(220, 53, 69, 0.2);
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Boutons */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.custom-btn-outline {
  border-color: rgba(255, 255, 255, 0.3);
  color: #6c757d;
  background: transparent;
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
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

/* SYNTHÈSE CASHFLOW AGRANDIE */
.cashflow-container-expanded {
    height: 320px;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.cashflow-chart-expanded {
    flex-grow: 1;
    min-height: 180px;
    position: relative;
    width: 100%;
}

/* Listes */
.custom-list {
    background: transparent;
}

.custom-list-item {
    border-bottom: 1px solid #dee2e6;
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
    
    .cashflow-container-expanded {
        height: 280px;
        min-height: 280px;
    }
}

@media (min-width: 1200px) {
    .kpis-grid-compact {
        grid-template-columns: 1fr 1fr;
        gap: 0.6rem;
    }
    
    .cashflow-container-expanded {
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

/* Styles pour les cartes */
:deep(.n-card .n-card-header) {
    padding: 12px 16px;
    border-bottom: 1px solid #dee2e6;
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
</style>