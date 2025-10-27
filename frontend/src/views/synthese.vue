<!--<template>
  <div class="p-4">
    <h1>Calendrier🛎️</h1>
    <p>Vue d'ensemble </p>
    </div>
</template>
<script setup>
// Logique Réception
</script>-->


<script setup>
import { ref, onMounted, nextTick } from 'vue'; // 🚨 nextTick importé ici
import FinanceService from '@/services/FinanceService'; 
import Chart from 'chart.js/auto'; 

// --- Variables d'état ---
const rapportData = ref({});
const isLoading = ref(true);

const monthlyTrend = ref([]);
let revenueChartInstance = null;
const chartCanvas = ref(null); // 🚨 Template Ref pour le canvas

// Fonction pour formater en Malagasy Ariary (MGA)
const formatCurrency = (value) => {
    // Vérifie si la valeur est valide pour éviter les erreurs de formatage
    const numValue = parseFloat(value); 
    if (isNaN(numValue)) return '0 Ar'; 

    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(numValue);
};

// --- Récupération des données de Synthèse (KPIs) ---
const fetchRapportsData = async () => {
    isLoading.value = true;
    try {
        const response = await FinanceService.getRapportsData();
        rapportData.value = response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données de rapport:", error);
        
        // Initialisation des données en cas d'erreur pour éviter le crash du template
        rapportData.value = {
            totalRevenue: 0,
            activeLocationsCount: 0,
            pendingAmount: 0,
            paymentMethodDistribution: []
        };
    } finally {
        // NOTE: isLoading devient faux seulement APRÈS que fetchMonthlyTrend soit exécuté 
        // ou géré dans onMounted pour une meilleure synchronisation, mais nous laissons ici pour l'instant.
    }
};

// --- Récupération des données pour le Graphique de Tendance ---
const fetchMonthlyTrend = async () => {
    try {
        const response = await FinanceService.getMonthlyRevenue();
        monthlyTrend.value = response.data;
        
        // 🚨 CRITICAL: Appel de nextTick pour s'assurer que le canvas est monté
        if (monthlyTrend.value.length > 0) {
            await nextTick(); 
            renderRevenueChart();
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la tendance mensuelle:", error);
        monthlyTrend.value = [];
    } finally {
        isLoading.value = false; // Mettre isLoading à false ici après les deux appels si vous voulez attendre les deux
    }
};

// --- Fonction de Rendu du Graphique ---
const renderRevenueChart = () => {
    if (typeof Chart === 'undefined') {
        console.error("Erreur: Chart.js n'est pas disponible.");
        return;
    }

    // 🚨 CORRECTION MAJEURE: Utiliser chartCanvas.value (Template Ref)
    const canvasElement = chartCanvas.value;

    if (!canvasElement) {
        console.warn("L'élément canvas 'revenueChart' est introuvable (null). Le rendu est ignoré.");
        return;
    }

    // Si une instance existe déjà, la détruire pour la mettre à jour
    if (revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    // L'élément est trouvé, nous pouvons obtenir le contexte
    const ctx = canvasElement.getContext('2d');
    
    // Préparation des données pour Chart.js
    const labels = monthlyTrend.value.map(item => `${item.mois}/${item.annee}`);
    const dataValues = monthlyTrend.value.map(item => item.totalMensuel);

    revenueChartInstance = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenus Mensuels (Ar)',
                data: dataValues,
                backgroundColor: 'rgba(78, 115, 223, 0.5)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true, 
            height: 300,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Montant (MGA)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value); 
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mois/Année'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
};


// --- Montage ---
onMounted(() => {
    fetchRapportsData();
    fetchMonthlyTrend(); 
});
</script>

<template>
    <div class="container-fluid">
        <div class="retour">
    <router-link to="/dashboardFinance" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800"><i class="bi bi-graph-up me-2"></i> Rapports et Synthèse Financière</h1>
        </div>

        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Préparation des données financières...</p>
        </div>

        <div v-else>
            <!-- Ligne des KPIs -->
            <div class="row">
                <!-- Revenus Totaux (Payés) -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-success shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Revenus Totaux (Payés)
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{{ formatCurrency(rapportData.totalRevenue) }}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="bi bi-wallet2 fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Montant en Attente -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-warning shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Montant en Attente
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{{ formatCurrency(rapportData.pendingAmount) }}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="bi bi-clock fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Locations Actives (En cours) -->
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-primary shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Locations Actives (En cours)
                                    </div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800">{{ rapportData.activeLocationsCount }}</div>
                                </div>
                                <div class="col-auto">
                                    <i class="bi bi-geo-alt fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ligne des Graphiques et Distributions -->
            <div class="row">
                <!-- Distribution des Moyens de Paiement -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-primary">Distribution des Moyens de Paiement</h6>
                        </div>
                        <div class="card-body">
                            <p class="text-muted small">Répartition des transactions payées.</p>
                            <ul class="list-group list-group-flush">
                                <li v-for="method in rapportData.paymentMethodDistribution" :key="method.modePaie" class="list-group-item d-flex justify-content-between align-items-center">
                                    {{ method.modePaie || 'Inconnu' }}
                                    <span class="badge bg-primary rounded-pill">{{ method.count }} transactions</span>
                                </li>
                                <li v-if="rapportData.paymentMethodDistribution && rapportData.paymentMethodDistribution.length === 0" class="list-group-item text-center text-muted">
                                    Aucune donnée de paiement validée.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Tendance des Revenus (Graphique) -->
                <div class="col-lg-6 mb-4">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="m-0 font-weight-bold text-info">Tendance des Revenus (12 derniers mois)</h6>
                        </div>
                        <div class="card-body">
                            <!-- 🚨 CRITICAL: La référence 'ref="chartCanvas"' doit être présente ici -->
                            <canvas ref="chartCanvas" id="revenueChart"></canvas> 
                            
                            <div v-if="monthlyTrend && monthlyTrend.length === 0" class="text-center p-5 text-muted">
                                <i class="bi bi-bar-chart-line me-2"></i> Aucune donnée de revenus disponible sur les 12 derniers mois.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.border-left-success {
    border-left: 0.25rem solid #1cc88a !important;
}
.border-left-warning {
    border-left: 0.25rem solid #f6c23e !important;
}
.border-left-primary {
    border-left: 0.25rem solid #4e73df !important;
}
/* Styles d'icônes pour les couleurs Bootstrap */
.fa-2x {
    font-size: 2em;
}
.text-gray-300 {
    color: #dddfeb !important;
}
</style>
