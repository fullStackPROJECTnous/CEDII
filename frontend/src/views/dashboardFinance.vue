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
                        <h4 class="sidebar-title mb-0 fs-6">CEDII Finance</h4>
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
                    <h1 class="text-secondary mb-0 fs-4">Espace Financier 💰</h1>
                    <n-tag type="info" size="small">
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
                            <n-icon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                            </n-icon>
                        </template>
                        <strong>{{ litigeCount }}</strong> dossiers de pénalités ou dégradations requièrent votre action. Traitez-les pour déclencher les calculs de jours de retard.
                    </n-alert>

                    <!-- Disposition horizontale compacte - MODIFIÉE -->
                    <div class="row g-3">
                        <!-- Colonne KPIs (gauche) - RÉDUITE -->
                        <div class="col-lg-6">
                            <n-card title="Indicateurs Financiers" class="shadow-sm h-100" content-class="p-2">
                                <div class="kpis-grid-compact">
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-file-earmark-plus" 
                                            title="Factures à Générer" 
                                            :value="invoicesToProcess" 
                                            trend="Automatique" 
                                            color="text-info"
                                            linkName="FacturationGeneration"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-hourglass-split" 
                                            title="Paiements en Attente" 
                                            :value="pendingPaymentsCount" 
                                            :trend="`${formatCurrency(kpis.pendingAmount)}`" 
                                            color="text-warning"
                                            linkName="SuiviPaiements"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-receipt" 
                                            title="Jours Retard (Moy)" 
                                            :value="kpis.avgDaysLate" 
                                            trend="-2 jours" 
                                            color="text-danger"
                                            linkName="PenalitesLitiges"
                                            compact
                                        />
                                    </div>
                                    <div class="kpi-item-compact">
                                        <KpiCard 
                                            icon="bi-currency-euro" 
                                            title="Paiements Auto" 
                                            :value="kpis.autoPaymentRate" 
                                            trend="98% réussite" 
                                            color="text-success"
                                            linkName="SuiviPaiements"
                                            compact
                                        />
                                    </div>
                                </div>
                            </n-card>
                        </div>

                        <!-- Colonne Synthèse Cashflow (droite) - AGRANDIE -->
                        <div class="col-lg-6">
                            <n-card title="Synthèse Cashflow" class="shadow-sm h-100">
                                <template #header-extra>
                                    <n-button 
                                        text 
                                        @click="loadCashflowData" 
                                        :loading="loadingCashflow" 
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
                                
                                <div class="cashflow-container-expanded">
                                    <div v-if="loadingCashflow" class="text-center text-muted">
                                        <n-spin size="medium" />
                                        <p class="mt-2 mb-0 small">Calcul des indicateurs...</p>
                                    </div>
                                    <div v-else-if="!hasCashflowData" class="text-center text-muted">
                                        <n-empty description="Données non disponibles" size="small">
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

                    <!-- Tableaux sous les KPIs -->
                    <div class="row g-3 mt-3">
                        <!-- Factures à envoyer -->
                        <div class="col-lg-7">
                            <n-card title="Factures Prêtes à l'Envoi Automatique" class="shadow-sm">
                                <template #header-extra>
                                    <n-tag type="info" size="small">
                                        {{ invoicesToSend.length }} en attente
                                    </n-tag>
                                </template>
                                
                                <n-data-table
                                    :columns="invoiceColumns"
                                    :data="invoicesToSend"
                                    :pagination="pagination"
                                    size="small"
                                    striped
                                />
                                
                                <template #footer v-if="invoicesToSend.length === 0">
                                    <div class="text-center text-muted py-3">
                                        Aucune nouvelle facture prête à l'envoi.
                                    </div>
                                </template>
                            </n-card>
                        </div>

                        <!-- Pénalités -->
                        <div class="col-lg-5">
                            <n-card title="Pénalités Requérant Notification" class="shadow-sm">
                                <template #header-extra>
                                    <n-tag type="error" size="small">
                                        {{ pendingPenalties.length }} en attente
                                    </n-tag>
                                </template>

                                <n-list>
                                    <n-list-item v-for="penalty in pendingPenalties" :key="penalty.id">
                                        <template #prefix>
                                            <n-icon color="#FF4757" size="20">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-x-fill" viewBox="0 0 16 16">
                                                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM6.854 8.146 8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 1 1 .708-.708z"/>
                                                </svg>
                                            </n-icon>
                                        </template>
                                        
                                        <n-thing
                                            :title="penalty.client"
                                            :description="`Retard de ${penalty.daysLate} jours`"
                                        />
                                        
                                        <template #suffix>
                                            <n-button size="small" type="error" ghost>
                                                <template #icon>
                                                    <n-icon>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                                                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                                                        </svg>
                                                    </n-icon>
                                                </template>
                                                Notifier
                                            </n-button>
                                        </template>
                                    </n-list-item>
                                    
                                    <n-list-item v-if="pendingPenalties.length === 0">
                                        <div class="text-center text-muted py-3">
                                            Aucune pénalité en attente de notification.
                                        </div>
                                    </n-list-item>
                                </n-list>

                                <template #footer>
                                    <div class="text-end">
                                        <router-link :to="{ name: 'SuiviPaie' }">
                                            <n-button size="small" type="default">
                                                Voir tout
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
    NBadge,
    NDataTable,
    NList,
    NListItem,
    NThing
} from 'naive-ui';

import AuthService from '../services/AuthService'; 
import FinanceService from '../services/FinanceService'; 
import KpiCard from '../views/KpiCard.vue'; 
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

// Configuration de la table des factures
const invoiceColumns = [
    {
        title: 'ID Location',
        key: 'id',
        width: 120
    },
    {
        title: 'Client',
        key: 'client',
        ellipsis: true
    },
    {
        title: 'Montant Calculé',
        key: 'amount',
        render: (row) => formatCurrency(row.amount)
    },
    {
        title: 'Action',
        key: 'actions',
        render: (row) => h(
            NButton,
            {
                size: 'small',
                type: 'primary',
                onClick: () => sendInvoiceEmail(row.id)
            },
            {
                default: () => 'Envoyer Email',
                icon: () => h(NIcon, null, {
                    default: () => h('i', { class: 'bi bi-send-fill' })
                })
            }
        )
    }
];

const pagination = ref({
    pageSize: 5
});

// Options du menu avec texte blanc
const menuOptions = [
    {
        label: () => h('span', { style: 'color: white;' }, 'Tableau de Bord'),
        key: 'dashboard',
        icon: renderIcon('bi-wallet-fill')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { style: 'color: white;' }, 'Facturation & Génération'),
            invoicesToProcess.value > 0 ? h(NBadge, {
                value: invoicesToProcess.value,
                type: 'info',
                max: 99,
                class: 'ms-2',
                style: 'color: black !important;'
            }) : null
        ]),
        key: 'facturation',
        icon: renderIcon('bi-file-earmark-text')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { style: 'color: white;' }, 'Suivi des Paiements'),
            pendingPaymentsCount.value > 0 ? h(NBadge, {
                value: pendingPaymentsCount.value,
                type: 'warning',
                max: 99,
                class: 'ms-2',
                style: 'color: black !important;'
            }) : null
        ]),
        key: 'paiements',
        icon: renderIcon('bi-cash-stack')
    },
    {
        label: () => h('div', {
            class: 'd-flex justify-content-between align-items-center w-100'
        }, [
            h('span', { style: 'color: white;' }, 'Pénalités & Litiges'),
            litigeCount.value > 0 ? h(NBadge, {
                value: litigeCount.value,
                type: 'error',
                max: 99,
                class: 'ms-2',
                style: 'color: black !important;'
            }) : null
        ]),
        key: 'penalites',
        icon: renderIcon('bi-exclamation-octagon-fill')
    },
    {
        label: () => h('span', { style: 'color: white;' }, 'Rapports & Synthèse'),
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

const loadCashflowData = async () => {
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
};

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

const sendInvoiceEmail = (invoiceId) => {
    console.log('Envoi email pour facture:', invoiceId);
    // Implémentation de l'envoi d'email
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
.dashboard-wrapper {
    height: 100vh;
}

/* Sidebar en bleu nuit identique à la navbar */
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

/* Responsive */
@media (max-width: 992px) {
    .row {
        flex-direction: column;
    }
    
    .col-lg-6, .col-lg-7, .col-lg-5 {
        width: 100%;
    }
    
    .kpis-grid-compact {
        grid-template-columns: 1fr;
        gap: 0.4rem;
    }
    
    .cashflow-container-expanded {
        height: 250px;
        min-height: 250px;
    }
}

@media (min-width: 1200px) {
    .kpis-grid-compact {
        grid-template-columns: 1fr 1fr;
        gap: 0.6rem;
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

/* Styles pour les tables */
:deep(.n-data-table) {
    font-size: 0.875rem;
}

:deep(.n-data-table .n-data-table-th) {
    background-color: #f8f9fa;
    font-weight: 600;
}
</style>