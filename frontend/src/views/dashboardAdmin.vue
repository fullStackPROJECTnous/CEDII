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
                <!-- Header amélioré avec bouton actualisation -->
                <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
                    <h1 class="custom-title mb-0">
                        <em>Tableau de Bord Administrateur</em>
                        <i class="bi bi-speedometer2 ms-2"></i>
                    </h1>
                    <div class="d-flex align-items-center gap-3">
                        <n-button 
                            @click="refreshAll" 
                            type="primary" 
                            size="small"
                            :loading="loading.global"
                            class="custom-btn-primary"
                        >
                            <template #icon>
                                <i class="bi bi-arrow-clockwise"></i>
                            </template>
                            Actualiser
                        </n-button>
                        <n-tag type="info" size="small" class="custom-tag">
                            Rôle: {{ userLogin }}
                        </n-tag>
                        <!-- Bouton de débogage temporaire -->
                        <n-button 
                            @click="debugRevenueData" 
                            type="warning" 
                            size="small"
                            v-if="false"  
                        >
                            Debug
                        </n-button>
                    </div>
                </n-layout-header>

                <!-- Contenu -->
                <n-layout-content class="p-4 bg-light">
                    <!-- Section Alertes système -->
                    <n-alert v-if="systemAlerts.length > 0" type="warning" class="mb-4">
                        <template #icon>
                            <i class="bi bi-exclamation-triangle"></i>
                        </template>
                        <n-space vertical>
                            <div v-for="alert in systemAlerts" :key="alert.id" class="small">
                                {{ alert.message }}
                            </div>
                        </n-space>
                    </n-alert>

                    <!-- Indicateurs de chargement -->
                    <n-alert v-if="loading.kpis" title="Chargement" type="info" class="mb-4">
                        Chargement des statistiques...
                    </n-alert>

                    <!-- Disposition horizontale compacte -->
                    <div class="row g-3">
                        <!-- Colonne KPIs (gauche) -->
                        <div class="col-lg-6">
                            <n-card title="Indicateurs Clés" class="shadow-sm h-100" content-class="p-2">
                                <!-- KPIs cliquables -->
                                <div class="kpis-grid-compact">
                                    <div class="kpi-item-compact" @click="goToClientManagement">
                                        <div class="custom-card-primary h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-primary me-3">
                                                    <i class="bi bi-people-fill text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Clients Actifs</h6>
                                                    <h4 class="mb-0 text-warning">{{ kpis.totalClients }}</h4>
                                                    <small class="text-white opacity-75">Cliquez pour gérer</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kpi-item-compact" @click="goToLocationManagement">
                                        <div class="custom-card-warning h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-warning me-3">
                                                    <i class="bi bi-calendar-check text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Locations (Mois)</h6>
                                                    <h4 class="mb-0 text-warning">{{ kpis.locationsMois }}</h4>
                                                    <small class="text-white opacity-75">Cliquez pour voir</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kpi-item-compact" @click="goToInventaire">
                                        <div class="custom-card-danger h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-danger me-3">
                                                    <i class="bi bi-bar-chart-line text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Occup. Matériels</h6>
                                                    <h4 class="mb-0 text-danger">{{ kpis.tauxOccupationMateriel }}%</h4>
                                                    <small class="text-white opacity-75">Cliquez pour inventaire</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="kpi-item-compact" @click="goToFinance">
                                        <div class="custom-card-success h-100 p-3">
                                            <div class="d-flex align-items-center">
                                                <div class="custom-icon-success me-3">
                                                    <i class="bi bi-bar-chart-line text-white"></i>
                                                </div>
                                                <div>
                                                    <h6 class="mb-1 text-white">Occup. Salles</h6>
                                                    <h4 class="mb-0 text-success">{{ kpis.tauxOccupationSalle }}%</h4>
                                                    <small class="text-white opacity-75">Cliquez pour finances</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </n-card>
                        </div>

                        <!-- Colonne Statistiques (droite) -->
                        <div class="col-lg-6">
                            <n-card title="Distribution du Revenu par Type de Client" class="shadow-sm h-100">
                                <template #header-extra>
                                    <div class="d-flex gap-2">
                                        <n-select
                                            v-model:value="revenuePeriod"
                                            :options="revenuePeriodOptions"
                                            size="small"
                                            style="width: 120px"
                                        />
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
                                    </div>
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
                                            <div class="mt-1">
                                                <n-tag :type="revenueTrend >= 0 ? 'success' : 'error'" size="tiny">
                                                    {{ revenueTrend >= 0 ? '↗' : '↘' }} {{ Math.abs(revenueTrend) }}% vs période précédente
                                                </n-tag>
                                            </div>
                                        </div>
                                        <div class="cashflow-chart-expanded">
                                            <canvas ref="revenueChartCanvas" class="w-100 h-100"></canvas>
                                        </div>
                                        <!-- Légende améliorée - CORRIGÉE -->
                                        <div class="mt-3">
                                            <div class="row text-center small g-2">
                                                <template v-for="(item, index) in revenueData.labels" :key="index">
                                                    <div class="col-4" v-if="revenueData.datasets[0].data[index] > 0">
                                                        <div class="d-flex align-items-center justify-content-center">
                                                            <span class="d-inline-block me-1" 
                                                                :style="`width: 10px; height: 10px; background-color: ${revenueData.datasets[0].backgroundColor[index] || '#cccccc'}; border-radius: 2px;`">
                                                            </span>
                                                            {{ item }}
                                                        </div>
                                                        <div class="fw-bold mt-1">
                                                            {{ formatCurrency(revenueData.datasets[0].data[index]) }}
                                                        </div>
                                                        <div class="text-muted" style="font-size: 0.75rem">
                                                            {{ calculatePercentage(revenueData.datasets[0].data[index], totalRevenue) }}%
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Pied de carte avec actions rapides -->
                                <template #footer>
                                    <div class="d-flex justify-content-between">
                                        <n-button size="small" text @click="goToRapports">
                                            <i class="bi bi-graph-up me-1"></i>
                                            Plus de statistiques
                                        </n-button>
                                        <n-button size="small" type="primary" @click="exportRevenueData">
                                            <i class="bi bi-download me-1"></i>
                                            Exporter
                                        </n-button>
                                    </div>
                                </template>
                            </n-card>
                        </div>
                    </div>

                    <!-- Section Actions Rapides -->
                    <div class="row g-3 mt-3">
                        <div class="col-12">
                            <n-card title="Actions Rapides" class="shadow-sm">
                                <n-space>
                                    <n-button type="primary" size="small" @click="goToUserManagement">
                                        <template #icon>
                                            <i class="bi bi-person-plus"></i>
                                        </template>
                                        Ajouter utilisateur
                                    </n-button>
                                    <n-button type="info" size="small" @click="openUserModal">
                                        <template #icon>
                                            <i class="bi bi-gear"></i>
                                        </template>
                                        Configuration
                                    </n-button>
                                    <n-button type="success" size="small" @click="generateDailyReport">
                                        <template #icon>
                                            <i class="bi bi-file-earmark-text"></i>
                                        </template>
                                        Rapport quotidien
                                    </n-button>
                                    <n-button type="warning" size="small" @click="showSystemStatus">
                                        <template #icon>
                                            <i class="bi bi-heart-pulse"></i>
                                        </template>
                                        Status système
                                    </n-button>
                                </n-space>
                            </n-card>
                        </div>
                    </div>

                    <!-- Tableaux sous les KPIs -->
                    <div class="row g-3 mt-3">
                        <!-- Actions & Événements du Jour -->
                        <div class="col-lg-6">
                            <n-card title="Actions & Événements du Jour" class="shadow-sm">
                                <template #header-extra>
                                    <n-space>
                                        <n-tag type="error" size="small" class="custom-tag">
                                            {{ urgentActionsCount }} urgentes
                                        </n-tag>
                                        <n-button size="tiny" text @click="markAllAsRead">
                                            Tout marquer comme lu
                                        </n-button>
                                    </n-space>
                                </template>

                                <n-tabs type="line" size="small">
                                    <n-tab-pane name="reservations" tab="Réservations">
                                        <n-list class="custom-list" hoverable>
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
                                                >
                                                    <template #header-extra>
                                                        <n-tag size="small" type="warning">
                                                            {{ formatCurrency(res.tarifTot) }}
                                                        </n-tag>
                                                    </template>
                                                </n-thing>
                                                
                                                <template #suffix>
                                                    <n-space>
                                                        <n-button 
                                                            size="tiny" 
                                                            type="success"
                                                            @click="updateReservationStatus(res.idRes, 'Confirmée')"
                                                        >
                                                            ✓
                                                        </n-button>
                                                        <n-button 
                                                            size="tiny" 
                                                            type="error"
                                                            @click="updateReservationStatus(res.idRes, 'Annulée')"
                                                        >
                                                            ✗
                                                        </n-button>
                                                    </n-space>
                                                </template>
                                            </n-list-item>
                                        </n-list>
                                    </n-tab-pane>
                                    
                                    <n-tab-pane name="system" tab="Système">
                                        <!-- Logs système récents -->
                                        <n-list class="custom-list" hoverable>
                                            <n-list-item v-for="log in systemLogs" :key="log.id">
                                                <template #prefix>
                                                    <div :class="`log-icon ${log.type}`">
                                                        <i :class="getLogIcon(log.type)"></i>
                                                    </div>
                                                </template>
                                                
                                                <n-thing
                                                    :title="log.message"
                                                    :description="log.details"
                                                />
                                                
                                                <template #suffix>
                                                    <n-text depth="3" class="small">
                                                        {{ formatTimeAgo(log.timestamp) }}
                                                    </n-text>
                                                </template>
                                            </n-list-item>
                                        </n-list>
                                    </n-tab-pane>
                                </n-tabs>
                            </n-card>
                        </div>

                        <!-- Informations supplémentaires améliorées -->
                        <div class="col-lg-6">
                            <n-card title="Aperçu du Patrimoine" class="shadow-sm">
                                <template #header-extra>
                                    <n-button size="tiny" text @click="refreshResources">
                                        <i class="bi bi-arrow-clockwise"></i>
                                    </n-button>
                                </template>
                                
                                <n-space vertical>
                                    <!-- Statistiques ressources -->
                                    <div class="row text-center mb-3">
                                        <div class="col-4">
                                            <div class="fs-4 fw-bold text-success">{{ resourcesStats.operational }}</div>
                                            <div class="small text-muted">Opérationnelles</div>
                                        </div>
                                        <div class="col-4">
                                            <div class="fs-4 fw-bold text-warning">{{ resourcesStats.maintenance }}</div>
                                            <div class="small text-muted">Maintenance</div>
                                        </div>
                                        <div class="col-4">
                                            <div class="fs-4 fw-bold text-error">{{ resourcesStats.inactive }}</div>
                                            <div class="small text-muted">Inactives</div>
                                        </div>
                                    </div>
                                    
                                    <!-- Barre de progression -->
                                    <n-progress
                                        type="line"
                                        :percentage="resourcesStats.availability"
                                        :color="getAvailabilityColor(resourcesStats.availability)"
                                        :height="12"
                                        :border-radius="6"
                                    >
                                        <template #default>
                                            <n-space justify="space-between" class="w-100">
                                                <n-text>Disponibilité globale</n-text>
                                                <n-text strong>{{ resourcesStats.availability }}%</n-text>
                                            </n-space>
                                        </template>
                                    </n-progress>
                                    
                                    <!-- Liste des ressources par catégorie -->
                                    <n-list class="custom-list mt-3">
                                        <n-list-item v-for="category in resourceCategories" :key="category.name">
                                            <template #prefix>
                                                <div :class="`category-icon ${category.color}`">
                                                    <i :class="category.icon"></i>
                                                </div>
                                            </template>
                                            
                                            <n-thing
                                                :title="category.name"
                                                :description="`${category.count} items`"
                                            />
                                            
                                            <template #suffix>
                                                <n-tag :type="category.status" size="small">
                                                    {{ category.available }}/{{ category.count }}
                                                </n-tag>
                                            </template>
                                        </n-list-item>
                                    </n-list>
                                </n-space>

                                <template #footer>
                                    <div class="d-flex justify-content-between">
                                        <router-link :to="{ name: 'InventairePatrimoineAD' }">
                                            <n-button size="small" type="default" class="custom-btn-outline">
                                                Voir le détail complet
                                            </n-button>
                                        </router-link>
                                        <n-button size="small" type="info" @click="exportInventory">
                                            Exporter inventaire
                                        </n-button>
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
import { useToast } from 'vue-toastification';
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
    NThing,
    NSpace,
    NTabs,
    NTabPane,
    NSelect,
    NProgress
} from 'naive-ui';

import { Chart, registerables } from 'chart.js';

import AuthService from '../services/AuthService'; 
import RapportService from '../services/RapportService'; 
import LocationService from '../services/LocationService'; 
import ClientService from '../services/ClientService';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const userRole = ref('');
const userLogin = ref('');
const isAdmin = computed(() => userRole.value === 'ADMIN');
const activeMenuKey = ref('accueil');

// États
const systemAlerts = ref([]);
const systemLogs = ref([]);
const loading = ref({ 
    kpis: false, 
    reservations: false, 
    revenue: false,
    global: false 
});
const revenuePeriod = ref('month');
const revenuePeriodOptions = [
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Ce trimestre', value: 'quarter' },
    { label: 'Cette année', value: 'year'} ]
;

// Références Chart.js
const revenueChartCanvas = ref(null);
const chartInstance = ref(null);

// Enregistrement des composants Chart.js
Chart.register(...registerables);

// Données existantes
const kpis = ref({ 
    totalClients: 0, 
    locationsMois: 0, 
    revenuTotal: 0, 
    tauxOccupationSalle: 0,
    tauxOccupationMateriel: 0 
});
const allPendingReservations = ref([]);

// Nouvelles données
const resourcesStats = ref({
    operational: 42,
    maintenance: 8,
    inactive: 5,
    availability: 85
});

const resourceCategories = ref([
    { name: 'Salles', icon: 'bi-building', count: 15, available: 12, color: 'primary', status: 'success' },
    { name: 'Matériel IT', icon: 'bi-pc-display', count: 25, available: 22, color: 'info', status: 'info' },
    { name: 'Mobilier', icon: 'bi-chair', count: 50, available: 45, color: 'warning', status: 'warning' },
    { name: 'Équipement', icon: 'bi-tools', count: 30, available: 28, color: 'success', status: 'success' }
]);

// Données réactives pour le graphique (initialement vides)
const revenueData = ref({
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',    // Rouge - Particuliers
                'rgba(54, 162, 235, 0.8)',     // Bleu - Entreprises
                'rgba(255, 206, 86, 0.8)',     // Jaune - ONG
                'rgba(75, 192, 192, 0.8)',     // Turquoise - Associations
                'rgba(153, 102, 255, 0.8)',    // Violet - Institutions Publiques
                'rgba(255, 159, 64, 0.8)'      // Orange - Autres
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 15
        }
    ],
    total: 0
});

// Options du menu
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
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Journal Système'),
        key: 'logs',
        icon: renderIcon('bi-journal-text'),
        show: isAdmin.value
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
        'rapports': 'Rapport',
        'logs': 'SystemLogs'
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

const urgentActionsCount = computed(() => {
    return urgentReservations.value.length;
});

const revenueTrend = computed(() => {
    return 12;
});

const totalRevenue = computed(() => {
    if (!revenueData.value.datasets[0].data.length) return 0;
    return revenueData.value.datasets[0].data.reduce((a, b) => a + b, 0);
});

// Fonction pour calculer le pourcentage
const calculatePercentage = (value, total) => {
    if (!total || total === 0) return '0.0';
    return ((value / total) * 100).toFixed(1);
};

// Fonctions utilitaires
const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    return `Il y a ${Math.floor(diff / 86400)} j`;
};

const getLogIcon = (type) => {
    const icons = {
        'info': 'bi-info-circle',
        'warning': 'bi-exclamation-triangle',
        'error': 'bi-x-circle',
        'success': 'bi-check-circle'
    };
    return icons[type] || 'bi-info-circle';
};

const getAvailabilityColor = (percentage) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 60) return '#ffc107';
    return '#dc3545';
};
const initRevenueChart = async () => {
    try {
        console.log('🟡 Initialisation du graphique...');
        console.log('📊 Données disponibles:', revenueData.value);
        
        // Détruire l'instance précédente
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

        // Vérifier si nous avons des données, sinon attendre
        if (!revenueData.value.datasets[0].data.length) {
            console.warn('⚠️ Aucune donnée disponible, attente de 100ms...');
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Si toujours pas de données, charger
            if (!revenueData.value.datasets[0].data.length) {
                console.log('🔄 Chargement des données...');
                await fetchRevenueData(revenuePeriod.value);
            }
        }

        // VÉRIFICATION CRITIQUE : S'assurer que les données sont correctes
        console.log('🔍 Vérification finale des données:');
        console.log('- Labels:', revenueData.value.labels);
        console.log('- Data:', revenueData.value.datasets[0].data);
        console.log('- Labels length:', revenueData.value.labels.length);
        console.log('- Data length:', revenueData.value.datasets[0].data.length);
        
        // S'assurer que les tableaux ont la même longueur
        const dataLength = revenueData.value.datasets[0].data.length;
        const labelsLength = revenueData.value.labels.length;
        
        if (dataLength !== labelsLength) {
            console.warn(`⚠️ Incohérence: ${dataLength} données vs ${labelsLength} labels`);
            // Ajuster pour avoir la même longueur
            const minLength = Math.min(dataLength, labelsLength);
            revenueData.value.datasets[0].data = revenueData.value.datasets[0].data.slice(0, minLength);
            revenueData.value.labels = revenueData.value.labels.slice(0, minLength);
            console.log('✅ Données ajustées:', revenueData.value);
        }

        // Créer le graphique avec les données CORRIGÉES
        chartInstance.value = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: revenueData.value.labels,
                datasets: [{
                    data: revenueData.value.datasets[0].data,
                    backgroundColor: revenueData.value.datasets[0].backgroundColor,
                    borderColor: revenueData.value.datasets[0].borderColor,
                    borderWidth: revenueData.value.datasets[0].borderWidth,
                    hoverOffset: revenueData.value.datasets[0].hoverOffset
                }]
            },
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
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
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
        console.log('📊 Détails du graphique:', {
            type: chartInstance.value.config.type,
            dataPoints: chartInstance.value.data.datasets[0].data.length,
            labels: chartInstance.value.data.labels
        });
        
    } catch (error) {
        console.error('❌ Erreur initialisation graphique:', error);
        console.error('Stack:', error.stack);
        
        if (typeof toast !== 'undefined') {
            toast.error('Erreur lors de l\'initialisation du graphique');
        }
    }
};

// Fonction pour charger les données de revenus
const fetchRevenueData = async (period = 'month') => {
    loading.value.revenue = true;
    
    try {
        console.log('📡 Chargement données revenus par type client...');
        console.log('🔄 Appel API vers ClientService.getRevenueByClientType()');
        
        // TEST: Vérifier d'abord que ClientService existe
        console.log('🔍 ClientService existe?', typeof ClientService);
        console.log('🔍 Méthode getRevenueByClientType existe?', typeof ClientService.getRevenueByClientType);
        
        // TEST: Appel avec un timeout
        const apiPromise = ClientService.getRevenueByClientType();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout après 10 secondes')), 10000)
        );
        
        // Utiliser Promise.race pour éviter les appels trop longs
        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        console.log('✅ Données API reçues:', response);
        console.log('📊 Structure de la réponse:', {
            data: response.data,
            status: response.status,
            headers: response.headers
        });
        
        // Vérifier la structure de la réponse
        if (!response) {
            console.error('❌ Réponse vide');
            throw new Error('Réponse vide de l\'API');
        }
        
        if (!response.data) {
            console.error('❌ Pas de data dans la réponse');
            throw new Error('Données manquantes dans la réponse');
        }
        
        // Votre logique de traitement des données...
        if (response.data && response.data.success && response.data.data) {
            const apiData = response.data.data;
            
            console.log('📋 Données brutes de l\'API:', apiData);
            
            const labels = [];
            const dataValues = [];
            
            // Transformer les données
            apiData.forEach((item, index) => {
                console.log(`📝 Traitement item ${index}:`, item);
                
                let label = '';
                switch(item.typeClient?.toLowerCase()) {
                    case 'particulier':
                        label = 'Particuliers';
                        break;
                    case 'entreprise':
                        label = 'Entreprises';
                        break;
                    case 'ong':
                        label = 'ONG';
                        break;
                    case 'association':
                        label = 'Associations';
                        break;
                    case 'institution':
                    case 'institution publique':
                        label = 'Institutions Publiques';
                        break;
                    default:
                        label = item.typeClient || 'Autre';
                        console.log(`⚠️ Type client non reconnu: "${item.typeClient}"`);
                }
                
                labels.push(label);
                dataValues.push(item.totalRevenue || 0);
                
                console.log(`✅ Item ${index} traité: label="${label}", value=${item.totalRevenue}`);
            });
            
            // Vérifier que nous avons des données
            if (labels.length === 0 || dataValues.length === 0) {
                console.warn('⚠️ Aucune donnée valide après transformation');
                throw new Error('Données transformées vides');
            }
            
            // Mettre à jour l'état réactif
            revenueData.value.labels = labels;
            revenueData.value.datasets[0].data = dataValues;
            revenueData.value.total = response.data.totalRevenue || dataValues.reduce((a, b) => a + b, 0);
            
            console.log('📊 Données transformées pour graphique:', revenueData.value);
            console.log(`📈 Total calculé: ${revenueData.value.total}`);
            
        } else {
            console.warn('⚠️ Format de réponse inattendu:', response.data);
            
            // Log plus détaillé
            console.log('🔍 Analyse de la structure réponse:');
            console.log('- response.data existe?', !!response.data);
            console.log('- response.data.success?', response.data?.success);
            console.log('- response.data.data?', response.data?.data);
            console.log('- Type de response.data.data:', typeof response.data?.data);
            
            // Données par défaut
            revenueData.value.labels = ['Particuliers', 'Entreprises'];
            revenueData.value.datasets[0].data = [1500000, 1000000];
            revenueData.value.total = 2500000;
        }
        
        // Mettre à jour le graphique si déjà initialisé
        if (chartInstance.value) {
            console.log('🔄 Mise à jour du graphique existant');
            chartInstance.value.data.labels = revenueData.value.labels;
            chartInstance.value.data.datasets[0].data = revenueData.value.datasets[0].data;
            chartInstance.value.update();
            console.log('✅ Graphique mis à jour');
        } else {
            console.log('ℹ️ Aucune instance de graphique à mettre à jour');
        }
        
    } catch (error) {
        console.error('❌ Erreur détaillée chargement revenus:');
        console.error('- Message:', error.message);
        console.error('- Stack:', error.stack);
        console.error('- Type:', typeof error);
        
        // Vérifier si c'est une erreur axios
        if (error.response) {
            console.error('📡 Erreur API détaillée:');
            console.error('- Status:', error.response.status);
            console.error('- Status Text:', error.response.statusText);
            console.error('- Headers:', error.response.headers);
            console.error('- Data:', error.response.data);
        } else if (error.request) {
            console.error('🌐 Erreur réseau - Requête envoyée mais pas de réponse:');
            console.error('- Request:', error.request);
        } else {
            console.error('⚙️ Erreur configuration/autre:', error.message);
        }
        
        // Données de secours
        revenueData.value.labels = ['Particuliers', 'Entreprises'];
        revenueData.value.datasets[0].data = [1500000, 1000000];
        revenueData.value.total = 2500000;
        
        console.log('🛡️ Données de secours chargées:', revenueData.value);
        
        if (typeof toast !== 'undefined' && toast.error) {
            toast.error("Données de revenus temporairement indisponibles");
        } else {
            console.warn('⚠️ Toast non disponible pour afficher l\'erreur');
        }
        
    } finally {
        loading.value.revenue = false;
        console.log('🏁 Chargement terminé, loading.revenue = false');
    }
};


// Fonction pour rafraîchir le graphique
const refreshChart = async () => {
    loading.value.revenue = true;
    try {
        // Charger les données
        await fetchRevenueData(revenuePeriod.value);
        
        // Réinitialiser le graphique
        if (chartInstance.value) {
            chartInstance.value.destroy();
            chartInstance.value = null;
        }
        
        // Recréer le graphique
        await nextTick();
        await initRevenueChart();
        
    } catch (error) {
        console.error('Erreur rafraîchissement graphique:', error);
        toast.error('Erreur lors du rafraîchissement des données');
    } finally {
        loading.value.revenue = false;
    }
};

// Fonctions utilitaires
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
};

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

// Fonctions de navigation
const goToUserManagement = () => router.push({ name: 'UserManagement' });
const goToClientManagement = () => router.push({ name: 'ClientManagement1' });
const goToLocationManagement = () => router.push({ name: 'Location' });
const goToInventaire = () => router.push({ name: 'InventairePatrimoineAD' });
const goToFinance = () => router.push({ name: 'Finance' });
const goToRapports = () => router.push({ name: 'Rapport' });

// Fonctions de chargement
const fetchKPIs = async () => {
    try {
        loading.value.kpis = true;
        const response = await RapportService.getKPIs();
        kpis.value = response.data;
        
        systemAlerts.value = [
            { id: 1, message: '3 réservations en attente depuis plus de 24h' },
            { id: 2, message: '2 salles nécessitent maintenance' }
        ];
        
        systemLogs.value = [
            { id: 1, type: 'info', message: 'Sauvegarde automatique', details: 'Sauvegarde quotidienne effectuée', timestamp: new Date(Date.now() - 3600000) },
            { id: 2, type: 'success', message: 'Nouveau client', details: 'Client #1234 créé', timestamp: new Date(Date.now() - 7200000) },
            { id: 3, type: 'warning', message: 'Occupation élevée', details: 'Salle A occupée à 95%', timestamp: new Date(Date.now() - 10800000) }
        ];
        
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

// Fonctions d'action
const refreshAll = async () => {
    loading.value.global = true;
    try {
        await Promise.all([
            fetchKPIs(),
            fetchReservations(),
            fetchRevenueData(revenuePeriod.value)
        ]);
        
        // Réinitialiser le graphique
        if (chartInstance.value) {
            chartInstance.value.destroy();
            chartInstance.value = null;
        }
        await nextTick();
        await initRevenueChart();
        
    } catch (error) {
        console.error("Erreur rafraîchissement:", error);
        toast.error("Erreur lors du rafraîchissement");
    } finally {
        loading.value.global = false;
    }
};

const updateReservationStatus = async (idRes, status) => {
    if (confirm(`Changer le statut de la réservation #${idRes} à "${status}" ?`)) {
        try {
            await LocationService.updateReservationStatus(idRes, status);
            await fetchReservations();
            systemLogs.value.unshift({
                id: Date.now(),
                type: 'success',
                message: `Réservation #${idRes} ${status.toLowerCase()}`,
                details: 'Statut mis à jour depuis le dashboard',
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Erreur mise à jour statut:", error);
            toast.error("Erreur lors de la mise à jour");
        }
    }
};

// Fonction de débogage
const debugRevenueData = () => {
    console.log('=== DÉBOGAGE REVENUE DATA ===');
    console.log('Labels:', revenueData.value.labels);
    console.log('Data:', revenueData.value.datasets[0].data);
    console.log('Total:', totalRevenue.value);
    console.log('Chart instance:', chartInstance.value);
    
    if (revenueChartCanvas.value) {
        console.log('Canvas dimensions:', {
            width: revenueChartCanvas.value.width,
            height: revenueChartCanvas.value.height,
            parent: revenueChartCanvas.value.parentElement?.clientWidth
        });
    }
    
    // Test API
    fetchRevenueData();
};

// Autres fonctions
const markAllAsRead = () => {
    systemAlerts.value = [];
};

const refreshResources = () => {
    resourcesStats.value.availability = Math.min(100, resourcesStats.value.availability + 5);
};

const openUserModal = () => {
    router.push({ name: 'UserManagement' });
};

const generateDailyReport = () => {
    alert("Génération du rapport quotidien...");
};

const showSystemStatus = () => {
    alert("Status système: Tout fonctionne normalement");
};

const exportRevenueData = () => {
    alert("Export des données de revenue...");
};

const exportInventory = () => {
    alert("Export de l'inventaire...");
};

const logout = () => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (isConfirmed) {
        AuthService.logout();
        router.push('/');
    }
};
onMounted(async () => {
    const user = AuthService.getCurrentUser();
    if (user && user.roleUti) {
        userRole.value = user.roleUti.toUpperCase();
        userLogin.value = user.loginUti || '';
        
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
        
        console.log('🚀 Démarrage du dashboard...');
        
        // 1. D'abord charger les données du graphique
        console.log('📥 Étape 1: Chargement des données de revenus...');
        await fetchRevenueData(revenuePeriod.value);
        
        // 2. Ensuite charger les autres données
        console.log('📥 Étape 2: Chargement des KPIs...');
        await fetchKPIs();
        
        console.log('📥 Étape 3: Chargement des réservations...');
        await fetchReservations();
        
        // 3. Enfin initialiser le graphique
        console.log('📊 Étape 4: Initialisation du graphique...');
        await nextTick(); // S'assurer que le DOM est mis à jour
        await initRevenueChart();
        
        console.log('✅ Dashboard initialisé avec succès');
        
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

/* Header amélioré */
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
    cursor: pointer;
    transition: all 0.3s ease;
}

.kpi-item-compact:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

/* NOUVEAUX STYLES */

/* Log icons */
.log-icon {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

.log-icon.info {
    background: rgba(0, 123, 255, 0.1);
    color: #007bff;
}

.log-icon.warning {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
}

.log-icon.error {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.log-icon.success {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
}

/* Category icons */
.category-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.category-icon.primary {
    background: rgba(0, 123, 255, 0.1);
    color: #007bff;
}

.category-icon.info {
    background: rgba(23, 162, 184, 0.1);
    color: #17a2b8;
}

.category-icon.warning {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
}

.category-icon.success {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
}

/* Text utilities */
.opacity-75 {
    opacity: 0.75;
}

.text-error {
    color: #dc3545 !important;
}

.gap-2 {
    gap: 0.5rem;
}

.gap-3 {
    gap: 1rem;
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