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
                <!-- Header -->
                <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
                    <h1 class="custom-title mb-0">Espace Financier <i class="bi bi-cash-coin ms-2"></i></h1>
                    <n-tag type="info" size="small" class="custom-tag">
                        Rôle: {{ userRole }}
                    </n-tag>
                </n-layout-header>

                <!-- Contenu -->
                <n-layout-content class="p-4 bg-light">
                    <!-- Alerte Litiges -->
                    <n-alert 
                        v-if="litigeCount > 0"
                        type="error"
                        title="ATTENTION"
                        class="mb-4 shadow-sm"
                    >
                        <template #icon>
                            <i class="bi bi-exclamation-triangle-fill"></i>
                        </template>
                        <strong>{{ litigeCount }}</strong> dossiers de pénalités ou dégradations requièrent votre action. Traitez-les pour déclencher les calculs de jours de retard.
                    </n-alert>

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

                        <!-- Colonne Synthèse Cashflow (droite) -->
                        <div class="col-lg-6">
                            <n-card title="Synthèse Cashflow" class="shadow-sm h-100">
                                <template #header-extra>
                                    <n-button 
                                        text 
                                        @click="loadCashflowData" 
                                        :loading="loadingCashflow" 
                                        size="small"
                                        class="custom-btn-primary"
                                    >
                                        <template #icon>
                                            <i class="bi bi-arrow-clockwise"></i>
                                        </template>
                                    </n-button>
                                </template>
                                
                                <div class="cashflow-container-expanded">
                                    <div v-if="loadingCashflow" class="text-center text-muted">
                                        <n-spin size="medium" />
                                        <p class="mt-2 mb-0 small">Calcul des indicateurs...</p>
                                    </div>
                                    <div v-else-if="!hasCashflowData" class="text-center text-muted">
                                        <n-empty description="Données non disponibles" size="small">
                                            <template #icon>
                                                <i class="bi bi-bar-chart" style="font-size: 2rem; color: #55555E;"></i>
                                            </template>
                                        </n-empty>
                                    </div>
                                    <div v-else class="w-100 h-100 d-flex flex-column">
                                        <div class="text-center mb-3">
                                            <h6 class="mb-1 fw-bold">État Financier</h6>
                                            <small class="text-muted">Solde: {{ formatCurrency(cashflowData.kpis.soldeNet) }}</small>
                                        </div>
                                        <div class="cashflow-chart-expanded">
                                            <canvas ref="cashflowChartCanvas" class="w-100 h-100"></canvas>
                                        </div>
                                        <div class="mt-3">
                                            <div class="row text-center small">
                                                <div class="col-6">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(24, 160, 88, 0.8); border-radius: 2px;"></span>
                                                    Revenus: {{ formatCurrency(cashflowData.kpis.totalRevenus) }}
                                                </div>
                                                <div class="col-6">
                                                    <span class="d-inline-block me-1" style="width: 10px; height: 10px; background-color: rgba(208, 48, 80, 0.8); border-radius: 2px;"></span>
                                                    Dépenses: {{ formatCurrency(cashflowData.kpis.totalDepenses) }}
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
import FinanceService from '../services/FinanceService'; 
import Chart from 'chart.js/auto';

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
const loadingCashflow = ref(false);
const cashflowChartCanvas = ref(null);
const chartInstance = ref(null);

const cashflowData = ref({
    kpis: {
        totalRevenus: 0,
        totalDepenses: 0,
        soldeNet: 0,
        tauxEpargne: '0%'
    }
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
const hasCashflowData = computed(() => cashflowData.value.kpis && cashflowData.value.kpis.totalRevenus > 0);

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

/*const loadCashflowData = async () => {
    loadingCashflow.value = true;
    try {
        const response = await FinanceService.getCashflowSynthese();
        if (response.data && response.data.kpis) {
            cashflowData.value = response.data;
            await nextTick();
            renderCashflowChart();
        }
    } catch (error) {
        console.error('Erreur API cashflow:', error);
    } finally {
        loadingCashflow.value = false;
    }
};*/

const renderCashflowChart = () => {
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }
    
    if (!cashflowChartCanvas.value || !hasCashflowData.value) {
        return;
    }

    const data = {
        labels: ['Revenus', 'Dépenses'],
        datasets: [{
            data: [cashflowData.value.kpis.totalRevenus, cashflowData.value.kpis.totalDepenses],
            backgroundColor: [
                'rgba(24, 160, 88, 0.8)',
                'rgba(208, 48, 80, 0.8)'
            ],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 15
        }]
    };

    chartInstance.value = new Chart(cashflowChartCanvas.value, {
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
        
        // Charger les données cashflow après un délai
        setTimeout(() => {
            loadCashflowData();
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

/* SYNTHÈSE CASHFLOW AGRANDIE */
.cashflow-container-expanded {
    height: 300px;
    min-height: 300px;
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
    
    .cashflow-container-expanded {
        height: 250px;
        min-height: 250px;
    }
}

@media (min-width: 1200px) {
    .quick-actions-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    
    .cashflow-container-expanded {
        height: 320px;
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