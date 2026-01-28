

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
                        <h4 class="sidebar-title mb-0 fs-6">CEDII Finance</h4>
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
                     <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
       
                <!-- Header -->
                <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
                    <h1 class="custom-title mb-0">Espace Financier <i class="bi bi-cash-coin ms-2"></i></h1>
                    <n-tag type="info" size="small" class="custom-tag">
                        Rôle: {{ userRole }}
                    </n-tag>
                </n-layout-header>
                   <!-- ... votre header existant ... -->
        </n-layout-header>

                <!-- Contenu -->
                <n-layout-content class="p-4 bg-light">
                    <!-- Alerte Litiges -->
                   

                    <!-- Cartes de statistiques principales -->
                    <div class="row mb-4">
                        <div class="col-md-4 mb-3">
                            <n-card class="custom-card-primary h-100" size="small">
                                <div class="d-flex align-items-center">
                                    <div class="custom-icon-primary me-3">
                                        <i class="bi bi-file-earmark-plus text-white"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1 text-white">Factures à Générer</h6>
                                        <h4 class="mb-0 text-warning">{{ invoicesToProcess }}</h4>
                                    </div>
                                </div>
                            </n-card>
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <n-card class="custom-card-warning h-100" size="small">
                                <div class="d-flex align-items-center">
                                    <div class="custom-icon-warning me-3">
                                        <i class="bi bi-hourglass-split text-white"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1 text-white">Paiements en Attente</h6>
                                        <h4 class="mb-0 text-warning">{{ pendingPaymentsCount }}</h4>
                                        <small class="text-white-50">{{ formatCurrency(kpis.pendingAmount) }}</small>
                                    </div>
                                </div>
                            </n-card>
                        </div>
                        
                        <div class="col-md-4 mb-3">
                            <n-card class="custom-card-danger h-100" size="small">
                                <div class="d-flex align-items-center">
                                    <div class="custom-icon-danger me-3">
                                        <i class="bi bi-receipt text-white"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1 text-white">Jours Retard (Moy)</h6>
                                        <h4 class="mb-0 text-danger">{{ kpis.avgDaysLate }}</h4>
                                        <small class="text-white-50">-2 jours</small>
                                    </div>
                                </div>
                            </n-card>
                        </div>

                    </div>

                    <!-- Disposition horizontale compacte -->
                    <div class="row g-3">
                        <!-- Colonne Actions Rapides (gauche) -->
                        <div class="col-lg-6">
                            <n-card title="Actions Rapides" class="shadow-sm h-100">
                                <div class="quick-actions-grid">
                                    <router-link :to="{ name: 'FactureGene' }" class="quick-action-item custom-card-primary">
                                        <div class="d-flex align-items-center p-3">
                                            <div class="custom-icon-primary me-3">
                                                <i class="bi bi-file-earmark-plus text-white"></i>
                                            </div>
                                            <div>
                                                <h6 class="mb-1 text-white">Générer Factures</h6>
                                                <small class="text-white-50">{{ invoicesToProcess }} en attente</small>
                                            </div>
                                        </div>
                                    </router-link>
                                    
                                    <router-link :to="{ name: 'SuiviPaie' }" class="quick-action-item custom-card-warning">
                                        <div class="d-flex align-items-center p-3">
                                            <div class="custom-icon-warning me-3">
                                                <i class="bi bi-cash-stack text-white"></i>
                                            </div>
                                            <div>
                                                <h6 class="mb-1 text-white">Suivi Paiements</h6>
                                                <small class="text-white-50">{{ pendingPaymentsCount }} en attente</small>
                                            </div>
                                        </div>
                                    </router-link>
                                    
                                    <router-link :to="{ name: 'PenaliteLiti' }" class="quick-action-item custom-card-danger">
                                        <div class="d-flex align-items-center p-3">
                                            <div class="custom-icon-danger me-3">
                                                <i class="bi bi-exclamation-octagon text-white"></i>
                                            </div>
                                            <div>
                                                <h6 class="mb-1 text-white">Pénalités </h6>
                                                <small class="text-white-50">{{ litigeCount }} à traiter</small>
                                            </div>
                                        </div>
                                    </router-link>
                                    
                                    <router-link :to="{ name: 'RapportSynth' }" class="quick-action-item custom-card-success">
                                        <div class="d-flex align-items-center p-3">
                                            <div class="custom-icon-success me-3">
                                                <i class="bi bi-graph-up text-white"></i>
                                            </div>
                                            <div>
                                                <h6 class="mb-1 text-white">Rapports</h6>
                                                <small class="text-white-50">Analyses détaillées</small>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </n-card>
                        </div>

                        <!-- Colonne Statistiques de Performance (droite) -->
                        <div class="col-lg-6">
                            <n-card title="Statistiques de Performance" class="shadow-sm h-100">
                                <template #header-extra>
                                    <n-button 
                                        text 
                                        @click="loadPerformanceStats" 
                                        :loading="loadingPerformance" 
                                        size="small"
                                        class="custom-btn-primary"
                                    >
                                        <template #icon>
                                            <i class="bi bi-arrow-clockwise"></i>
                                        </template>
                                    </n-button>
                                </template>
                                
                                <div class="performance-container">
                                    <div v-if="loadingPerformance" class="text-center text-muted">
                                        <n-spin size="medium" />
                                        <p class="mt-2 mb-0 small">Chargement des statistiques...</p>
                                    </div>
                                    <div v-else-if="!hasPerformanceData" class="text-center text-muted">
                                        <n-empty description="Aucune donnée disponible" size="small">
                                            <template #icon>
                                                <i class="bi bi-graph-up" style="font-size: 2rem; color: #55555E;"></i>
                                            </template>
                                        </n-empty>
                                    </div>
                                    <div v-else class="performance-stats-grid">
                                        <!-- Indicateur 1 : Taux de paiement à temps -->
                                        <div class="performance-stat-item">
                                            <div class="stat-icon text-primary">
                                                <i class="bi bi-clock-history"></i>
                                            </div>
                                            <div class="stat-content">
                                                <h6 class="stat-title mb-1">Paiements à temps</h6>
                                                <div class="stat-value fw-bold">{{ performanceData.onTimePaymentRate }}%</div>
                                                <div class="stat-trend" :class="performanceData.onTimeTrend >= 0 ? 'text-success' : 'text-danger'">
                                                    <i :class="performanceData.onTimeTrend >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i> 
                                                    {{ Math.abs(performanceData.onTimeTrend) }}%
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Indicateur 2 : Factures traitées -->
                                        <div class="performance-stat-item">
                                            <div class="stat-icon text-warning">
                                                <i class="bi bi-file-earmark-check"></i>
                                            </div>
                                            <div class="stat-content">
                                                <h6 class="stat-title mb-1">Factures traitées</h6>
                                                <div class="stat-value fw-bold">{{ performanceData.invoicesProcessed }}</div>
                                                <div class="stat-info small">ce mois</div>
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
import { ref, onMounted, computed, h } from 'vue';
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
import FinanceService from '../services/FinanceService'; 

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const activeMenuKey = ref('dashboard');

// Données réactives
const kpis = ref({ 
    monthlyRevenue: 0,
    pendingAmount: 0,
    avgDaysLate: 0,
    autoPaymentRate: '0%'
});

const pendingPaymentsCount = ref(0);
const invoicesToSend = ref([]);
const pendingPenalties = ref([]);
const loadingPerformance = ref(false);

// Données de performance
const performanceData = ref({
    onTimePaymentRate: 0,
    onTimeTrend: 0,
    invoicesProcessed: 0,
    disputeResolutionRate: 0,
    disputesResolved: 0,
    efficiencyScore: 0,
    efficiencyTrend: 0
});

// Options du menu avec texte blanc
const menuOptions = [
    {
        label: () => h('span', { class: 'text-white' }, 'Tableau de Bord'),
        key: 'dashboard',
        icon: renderIcon('bi-wallet-fill')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { class: 'text-white' }, 'Facturation & Génération'),
            invoicesToProcess.value > 0 ? h(NBadge, {
                value: invoicesToProcess.value,
                type: 'info',
                max: 99,
                class: 'ms-2 custom-badge'
            }) : null
        ]),
        key: 'facturation',
        icon: renderIcon('bi-file-earmark-text')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { class: 'text-white' }, 'Suivi des Paiements'),
            pendingPaymentsCount.value > 0 ? h(NBadge, {
                value: pendingPaymentsCount.value,
                type: 'warning',
                max: 99,
                class: 'ms-2 custom-badge'
            }) : null
        ]),
        key: 'paiements',
        icon: renderIcon('bi-cash-stack')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { class: 'text-white' }, 'Pénalités'),
            litigeCount.value > 0 ? h(NBadge, {
                value: litigeCount.value,
                type: 'error',
                max: 99,
                class: 'ms-2 custom-badge'
            }) : null
        ]),
        key: 'penalites',
        icon: renderIcon('bi-exclamation-octagon-fill')
    },
    {
        label: () => h('span', { class: 'text-white' }, 'Rapports & Synthèse'),
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
        'dashboard': 'FinanceDashboard',
        'facturation': 'FactureGene',
        'paiements': 'SuiviPaie',
        'penalites': 'PenaliteLiti',
        'rapports': 'RapportSynth'
    };
    
    if (routeMap[key]) {
        router.push({ name: routeMap[key] });
    }
};

// Propriétés calculées
const invoicesToProcess = computed(() => invoicesToSend.value.length);
const litigeCount = computed(() => pendingPenalties.value.length);
const hasPerformanceData = computed(() => 
    performanceData.value.onTimePaymentRate > 0 || 
    performanceData.value.invoicesProcessed > 0
);

// Fonctions de données
const fetchFinanceData = async () => {
    try {
        const response = await FinanceService.getFinanceDashboardData();
        const data = response.data;

        pendingPaymentsCount.value = data.pendingPaymentsCount || 0;
        kpis.value.pendingAmount = data.pendingAmount || 0;
        kpis.value.monthlyRevenue = data.monthlyRevenue || 0;
        kpis.value.avgDaysLate = data.avgDaysLate || 0;
        kpis.value.autoPaymentRate = data.autoPaymentRate || '0%';
        invoicesToSend.value = data.invoicesToSend || [];
        pendingPenalties.value = data.pendingPenalties || [];

    } catch (error) {
        console.error("Erreur lors du chargement des données financières:", error);
        pendingPaymentsCount.value = 0;
        kpis.value.pendingAmount = 0;
    }
};

// Fonction pour charger les statistiques de performance
const loadPerformanceStats = async () => {
    loadingPerformance.value = true;
    try {
        const response = await FinanceService.getPerformanceStats();
        if (response.data) {
            performanceData.value = {
                onTimePaymentRate: response.data.onTimePaymentRate || 0,
                onTimeTrend: response.data.onTimeTrend || 0,
                invoicesProcessed: response.data.invoicesProcessed || 0,
                disputeResolutionRate: response.data.disputeResolutionRate || 0,
                disputesResolved: response.data.disputesResolved || 0,
                efficiencyScore: response.data.efficiencyScore || 0,
                efficiencyTrend: response.data.efficiencyTrend || 0
            };
        } else {
            // Données mockées en attendant l'API
            performanceData.value = {
                onTimePaymentRate: 85,
                onTimeTrend: 3.5,
                invoicesProcessed: 42,
                disputeResolutionRate: 92,
                disputesResolved: 23,
                efficiencyScore: 8.5,
                efficiencyTrend: 1.2
            };
        }
    } catch (error) {
        console.error('Erreur chargement statistiques:', error);
        // Données mockées en cas d'erreur
        performanceData.value = {
            onTimePaymentRate: 85,
            onTimeTrend: 3.5,
            invoicesProcessed: 42,
            disputeResolutionRate: 92,
            disputesResolved: 23,
            efficiencyScore: 8.5,
            efficiencyTrend: 1.2
        };
    } finally {
        loadingPerformance.value = false;
    }
};

const logout = () => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (isConfirmed) {
        AuthService.logout();
        router.push('/');
    }
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value);
};

// Lifecycle
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
        userRole.value = user.roleUti.toUpperCase();
        fetchFinanceData();
        
        // Définir l'élément de menu actif basé sur la route actuelle
        const routeToKeyMap = {
            'FinanceDashboard': 'dashboard',
            'FactureGene': 'facturation',
            'SuiviPaie': 'paiements',
            'PenaliteLiti': 'penalites',
            'RapportSynth': 'rapports'
        };
        
        activeMenuKey.value = routeToKeyMap[route.name] || 'dashboard';
        
        // Charger les statistiques de performance après un délai
        setTimeout(() => {
            loadPerformanceStats();
        }, 1000);
    } else {
        router.push('/'); 
    }
});
</script>

<style scoped>
/* COULEURS ORIGINALES */

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

.custom-badge {
    font-weight: 600;
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

/* Cartes avec couleurs originales */
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

/* Icônes avec fond original */
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

/* Actions rapides */
.quick-actions-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
}

.quick-action-item {
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.quick-action-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    text-decoration: none;
}

/* CONTAINER STATISTIQUES DE PERFORMANCE */
.performance-container {
    height: 300px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.performance-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    padding: 0.5rem;
}

.performance-stat-item {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.performance-stat-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-color: #007bff;
}

.stat-icon {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    opacity: 0.9;
}

.stat-content {
    text-align: center;
}

.stat-title {
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 1.8rem;
    color: #212529;
    margin-bottom: 0.25rem;
}

.stat-trend {
    font-size: 0.75rem;
    font-weight: 600;
}

.stat-trend.text-success {
    color: #28a745;
}

.stat-trend.text-danger {
    color: #dc3545;
}

.stat-info {
    color: #6c757d;
    margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 992px) {
    .row {
        flex-direction: column;
    }
    
    .col-lg-6 {
        width: 100%;
    }
    
    .quick-actions-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .performance-container {
        height: 250px;
        min-height: 250px;
    }
    
    .performance-stats-grid {
        gap: 0.75rem;
        padding: 0.25rem;
    }
    
    .performance-stat-item {
        padding: 0.75rem;
    }
    
    .stat-icon {
        font-size: 1.5rem;
    }
    
    .stat-value {
        font-size: 1.5rem;
    }
}

@media (min-width: 1200px) {
    .quick-actions-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .performance-container {
        height: 320px;
    }
    
    .performance-stats-grid {
        gap: 1.25rem;
        padding: 1rem;
    }
}

@media (max-width: 576px) {
    .performance-stats-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
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


/* Layout principal */
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
}

/* Header fixé */
.fixed-header {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  flex-shrink: 0; /* Empêche le header de rétrécir */
}

/* Contenu avec scroll */
.content-with-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 0; /* Pas de marge car header est sticky */
  padding-top: 16px; /* Espace entre le header et le contenu */
}

/* Ajustement du conteneur de réservation */
.reservation-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 20px 20px; /* Pas de padding-top car déjà géré */
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ajustement du conteneur de scroll existant */
.content-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  padding-top: 0;
}

/* Ajustement responsive */
@media (max-width: 768px) {
  .content-with-scroll {
    padding: 12px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 12px !important;
  }
  
  .reservation-page-container {
    padding: 0 12px 12px 12px;
  }
}

@media (max-width: 576px) {
  .content-with-scroll {
    padding: 8px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 8px !important;
  }
  
  .reservation-page-container {
    padding: 0 8px 8px 8px;
  }
}

</style>