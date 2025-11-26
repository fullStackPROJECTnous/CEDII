<template>
    <div class="container-fluid py-4">
        <!-- En-tête avec bouton retour -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="custom-header p-4 rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <router-link to="/dashboardFinance" class="btn btn-sm btn-outline-light">
                                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
                            </router-link>
                        </div>
                        <div class="text-center">
                            <h1 class="custom-title mb-1">
                                <i class="bi bi-graph-up me-2"></i>
                                Rapports et Synthèse Financière
                            </h1>
                            <p class="custom-subtitle">Analyse complète des performances financières</p>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Préparation des données financières...</p>
        </div>

        <div v-else>
            <!-- Cartes de statistiques principales -->
            <div class="row mb-4">
                <!-- Revenus Totaux -->
                <div class="col-md-4 mb-3">
                    <n-card class="custom-card-success h-100" size="small">
                        <div class="d-flex align-items-center">
                            <div class="custom-icon-success me-3">
                                <i class="bi bi-wallet2 text-white"></i>
                            </div>
                            <div>
                                <h6 class="mb-1 text-white">Revenus Totaux</h6>
                                <h4 class="mb-0 text-success">{{ formatCurrency(rapportData.totalRevenue) }}</h4>
                            </div>
                        </div>
                    </n-card>
                </div>

                <!-- Montant en Attente -->
                <div class="col-md-4 mb-3">
                    <n-card class="custom-card-warning h-100" size="small">
                        <div class="d-flex align-items-center">
                            <div class="custom-icon-warning me-3">
                                <i class="bi bi-clock text-white"></i>
                            </div>
                            <div>
                                <h6 class="mb-1 text-white">Montant en Attente</h6>
                                <h4 class="mb-0 text-warning">{{ formatCurrency(rapportData.pendingAmount) }}</h4>
                            </div>
                        </div>
                    </n-card>
                </div>
                
                <!-- Locations Actives -->
                <div class="col-md-4 mb-3">
                    <n-card class="custom-card-primary h-100" size="small">
                        <div class="d-flex align-items-center">
                            <div class="custom-icon-primary me-3">
                                <i class="bi bi-geo-alt text-white"></i>
                            </div>
                            <div>
                                <h6 class="mb-1 text-white">Locations Actives</h6>
                                <h4 class="mb-0 text-info">{{ rapportData.activeLocationsCount }}</h4>
                            </div>
                        </div>
                    </n-card>
                </div>
            </div>

            <!-- Ligne des Graphiques et Distributions -->
            <div class="row">
                <!-- Distribution des Moyens de Paiement -->
                <div class="col-lg-6 mb-4">
                    <n-card class="shadow-lg" title="Distribution des Moyens de Paiement">
                        <template #header-extra>
                            <n-tag type="info" class="custom-tag">{{ rapportData.paymentMethodDistribution?.length || 0 }} méthodes</n-tag>
                        </template>
                        
                        <p class="text-muted mb-3">Répartition des transactions payées</p>
                        
                        <n-list class="custom-list">
                            <n-list-item v-for="method in rapportData.paymentMethodDistribution" :key="method.modePaie" class="custom-list-item">
                                <template #prefix>
                                    <div class="custom-icon-primary-small">
                                        <i class="bi bi-credit-card text-white"></i>
                                    </div>
                                </template>
                                
                                <n-thing
                                    :title="method.modePaie || 'Inconnu'"
                                    :description="`${method.count} transactions`"
                                />
                                
                                <template #suffix>
                                    <n-tag type="primary" class="custom-tag">
                                        {{ Math.round((method.count / totalTransactions) * 100) || 0 }}%
                                    </n-tag>
                                </template>
                            </n-list-item>
                            
                            <n-list-item v-if="!rapportData.paymentMethodDistribution || rapportData.paymentMethodDistribution.length === 0" class="custom-list-item">
                                <div class="text-center text-muted py-3">
                                    <i class="bi bi-credit-card me-2"></i>Aucune donnée de paiement validée
                                </div>
                            </n-list-item>
                        </n-list>
                    </n-card>
                </div>

                <!-- Tendance des Revenus (Graphique) -->
                <div class="col-lg-6 mb-4">
                    <n-card class="shadow-lg" title="Tendance des Revenus (12 derniers mois)">
                        <template #header-extra>
                            <n-tag type="info" class="custom-tag">{{ monthlyTrend.length }} mois</n-tag>
                        </template>
                        
                        <div class="chart-container" style="height: 300px; position: relative;">
                            <!-- Canvas avec ID explicite et dimensions fixes -->
                            <canvas 
                                ref="chartCanvas" 
                                id="revenueChart"
                                style="width: 100%; height: 100%;"
                            ></canvas>
                            
                            <div v-if="monthlyTrend && monthlyTrend.length === 0" class="text-center p-5 text-muted position-absolute top-50 start-50 translate-middle">
                                <i class="bi bi-bar-chart-line me-2"></i> Aucune donnée de revenus disponible
                            </div>
                        </div>
                    </n-card>
                </div>
            </div>

            <!-- Section statistiques détaillées -->
            <div class="row mt-3">
                <div class="col-12">
                    <n-card class="shadow-lg" title="Indicateurs de Performance">
                        <div class="row text-center">
                            <div class="col-md-3 mb-3">
                                <div class="border rounded p-3">
                                    <i class="bi bi-cash-coin text-primary fs-1 mb-2"></i>
                                    <h5 class="text-muted">Taux de Conversion</h5>
                                    <h4 class="text-success">{{ calculateConversionRate() }}%</h4>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="border rounded p-3">
                                    <i class="bi bi-graph-up-arrow text-success fs-1 mb-2"></i>
                                    <h5 class="text-muted">Croissance Mensuelle</h5>
                                    <h4 class="text-info">{{ calculateMonthlyGrowth() }}%</h4>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="border rounded p-3">
                                    <i class="bi bi-clock-history text-warning fs-1 mb-2"></i>
                                    <h5 class="text-muted">Délai Moyen Paiement</h5>
                                    <h4 class="text-warning">{{ averagePaymentDelay }} jours</h4>
                                </div>
                            </div>
                            <div class="col-md-3 mb-3">
                                <div class="border rounded p-3">
                                    <i class="bi bi-check-circle text-success fs-1 mb-2"></i>
                                    <h5 class="text-muted">Taux de Réussite</h5>
                                    <h4 class="text-success">98%</h4>
                                </div>
                            </div>
                        </div>
                    </n-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { NCard, NTag, NList, NListItem, NThing } from 'naive-ui';
import FinanceService from '@/services/FinanceService'; 
import Chart from 'chart.js/auto'; 

// --- Variables d'état ---
const rapportData = ref({
  totalRevenue: 0,
  pendingAmount: 0,
  activeLocationsCount: 0,
  paymentMethodDistribution: [],
  averagePaymentDelay: 0
});
const isLoading = ref(true);
const monthlyTrend = ref([]);
let revenueChartInstance = null;
const chartCanvas = ref(null);

// --- Propriétés calculées ---
const totalTransactions = computed(() => {
  if (!rapportData.value.paymentMethodDistribution) return 0;
  return rapportData.value.paymentMethodDistribution.reduce((sum, method) => sum + method.count, 0);
});

const averagePaymentDelay = computed(() => {
  return rapportData.value.averagePaymentDelay || 3;
});

// Fonction pour formater en Malagasy Ariary (MGA)
const formatCurrency = (value) => {
  const numValue = parseFloat(value); 
  if (isNaN(numValue)) return '0 Ar'; 
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

// --- Calcul des indicateurs ---
const calculateConversionRate = () => {
  const total = parseFloat(rapportData.value.totalRevenue || 0);
  const pending = parseFloat(rapportData.value.pendingAmount || 0);
  if (total + pending === 0) return 0;
  return Math.round((total / (total + pending)) * 100);
};

const calculateMonthlyGrowth = () => {
  if (monthlyTrend.value.length < 2) return 0;
  const current = monthlyTrend.value[monthlyTrend.value.length - 1]?.totalMensuel || 0;
  const previous = monthlyTrend.value[monthlyTrend.value.length - 2]?.totalMensuel || 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const fetchRapportsData = async () => {
  isLoading.value = true;
  try {
    const response = await FinanceService.getRapportsData();
    rapportData.value = response.data;
    console.log('📊 Données réelles chargées:', rapportData.value);
  } catch (error) {
    console.error("ERREUR CRITIQUE - Impossible de charger les données:", error);
    // Ne pas utiliser de données de démo
    rapportData.value = {
      totalRevenue: 0,
      pendingAmount: 0,
      activeLocationsCount: 0,
      paymentMethodDistribution: [],
      averagePaymentDelay: 0
    };
  }
};
const fetchMonthlyTrend = async () => {
  try {
    const response = await FinanceService.getMonthlyRevenue();
    monthlyTrend.value = response.data;
    console.log('📈 Tendance mensuelle chargée:', monthlyTrend.value);
    
    // Attendre que le DOM soit mis à jour avant de rendre le graphique
    await nextTick();
    
    // Vérifier que le canvas est disponible
    if (chartCanvas.value) {
      renderRevenueChart();
    } else {
      console.warn('Canvas non disponible, réessayer dans 100ms');
      setTimeout(() => {
        if (chartCanvas.value) {
          renderRevenueChart();
        } else {
          console.error('Canvas toujours non disponible après délai');
        }
      }, 100);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la tendance mensuelle:", error);
    monthlyTrend.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- Fonction de Rendu du Graphique ---
const renderRevenueChart = () => {
  console.log('🔄 Début du rendu du graphique...');
  
  if (typeof Chart === 'undefined') {
    console.error("Erreur: Chart.js n'est pas disponible.");
    return;
  }

  const canvasElement = chartCanvas.value;
  if (!canvasElement) {
    console.error("❌ L'élément canvas est introuvable - vérifiez la référence");
    return;
  }

  console.log('✅ Canvas trouvé:', canvasElement);

  // Détruire l'instance précédente si elle existe
  if (revenueChartInstance) {
    console.log('🗑️ Destruction instance précédente du graphique');
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  // Vérifier qu'il y a des données à afficher
  if (!monthlyTrend.value || monthlyTrend.value.length === 0) {
    console.warn('⚠️ Aucune donnée pour le graphique');
    return;
  }

  try {
    const ctx = canvasElement.getContext('2d');
    
    // Préparer les données pour le graphique
    const labels = monthlyTrend.value.map(item => `${item.moisNom} ${item.annee}`);
    const dataValues = monthlyTrend.value.map(item => item.totalMensuel);

    console.log('📊 Données du graphique:', { labels, dataValues });

    revenueChartInstance = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenus Mensuels (Ar)',
          data: dataValues,
          backgroundColor: 'rgba(78, 115, 223, 0.1)',
          borderColor: 'rgba(78, 115, 223, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Revenus: ${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        },
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
        }
      }
    });

    console.log('✅ Graphique rendu avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du rendu du graphique:', error);
  }
};

// Surveiller les changements de données pour re-rendre le graphique
watch(monthlyTrend, (newValue) => {
  if (newValue && newValue.length > 0) {
    console.log('🔄 Données mensuelles mises à jour, re-rendu du graphique');
    // Petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      if (chartCanvas.value) {
        renderRevenueChart();
      }
    }, 100);
  }
});

// --- Montage ---
onMounted(async () => {
  console.log('🚀 Composant Synthese monté');
  
  // Charger les données en parallèle
  await Promise.all([
    fetchRapportsData(),
    fetchMonthlyTrend()
  ]);
  
  console.log('✅ Toutes les données chargées');
});

// Nettoyage lors du démontage du composant
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }
});
</script>

<style scoped>
/* COULEURS ORIGINALES */

.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%);
  color: white;
  border-left: 4px solid #007bff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Cartes avec couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, gray 0%, gray 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, black 0%, black 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

/* Icônes avec fond original */
.custom-icon-primary, 
.custom-icon-success,
.custom-icon-warning {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

.custom-icon-primary-small {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: rgba(0, 123, 255, 0.2);
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Listes */
.custom-list {
    background: transparent;
}

.custom-list-item {
    border-bottom: 1px solid #dee2e6;
}

/* Conteneur de graphique */
.chart-container {
    position: relative;
    min-height: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-success,
  .custom-icon-warning {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .chart-container {
    height: 250px;
  }
}

/* Styles pour les indicateurs */
.border.rounded {
    transition: all 0.3s ease;
}

.border.rounded:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fs-1 {
    font-size: 2.5rem !important;
}

/* Assurer que le canvas est visible */
canvas {
    display: block;
    max-width: 100%;
}
</style>