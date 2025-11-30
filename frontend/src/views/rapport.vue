<template>
  <div class="reports-management-container">
    <!-- Header amélioré comme dans la gestion des clients -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-graph-up me-2"></i>
                Tableau de Bord & Rapports d'Activité
              </h1>
              <p class="custom-subtitle">Analysez les performances et suivez l'activité de location</p>
            </div>
                <!-- Menu trois points -->
            <div class="position-relative">
              <n-dropdown
                trigger="click"
                :options="navigationOptions"
                @select="handleNavigationSelect"
                placement="bottom-end"
              >
                <n-button type="primary" size="small" class="custom-btn-primary">
                  <i class="bi bi-three-dots-vertical"></i>
                </n-button>
              </n-dropdown>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages d'état -->
    <n-alert v-if="apiError" type="warning" class="mb-4">
      <template #icon>
        <n-icon>⚠️</n-icon>
      </template>
      Certaines données ne sont pas disponibles. Vérifiez la connexion au serveur.
    </n-alert>

    <!-- Filtres de période -->
    <n-card class="mb-4 custom-card">
      <template #header>
        <n-space justify="space-between" align="center">
          <n-text strong>Période d'analyse</n-text>
          <n-space>
            <n-button size="small" @click="exportToPDF" :loading="exporting" class="custom-btn-outline">
              📥 Exporter PDF
            </n-button>
            <n-button size="small" type="primary" @click="fetchData" :loading="loading" class="custom-btn-primary">
              🔄 Actualiser
            </n-button>
          </n-space>
        </n-space>
      </template>
      <n-space>
        <n-date-picker
          v-model:value="dateRange"
          type="daterange"
          clearable
          placeholder="Sélectionnez une période"
        />
        <n-select
          v-model:value="selectedPeriod"
          :options="periodOptions"
          style="width: 200px"
          placeholder="Période rapide"
        />
      </n-space>
    </n-card>

    <!-- Cartes KPIs -->
    <n-grid :cols="3" :x-gap="16" :y-gap="16" class="mb-4">
      <n-gi v-for="(kpi, key) in kpis" :key="key">
        <n-card class="kpi-card custom-card" :class="`kpi-${key}`">
          <n-space align="center">
            <div class="kpi-icon">
              {{ getKpiIcon(key) }}
            </div>
            <n-space vertical size="small" class="flex-grow-1">
              <n-text depth="3" class="kpi-title">
                {{ getKpiTitle(key) }}
              </n-text>
              <n-text strong class="kpi-value">
                {{ formatKpiValue(key, kpi) }}
              </n-text>
            </n-space>
          </n-space>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Graphiques et statistiques avec scroll -->
    <div class="scrollable-content">
      <n-grid :cols="2" :x-gap="16" :y-gap="16">
        <!-- Statut des réservations -->
        <n-gi>
          <n-card class="custom-card">
            <template #header>
              <n-space align="center">
                <n-icon size="20">📅</n-icon>
                <n-text strong>Répartition des Réservations</n-text>
              </n-space>
            </template>
            
            <n-empty v-if="!reservationData || reservationData.length === 0" description="Aucune donnée disponible">
              <template #icon>
                <n-icon>📊</n-icon>
              </template>
            </n-empty>
            
            <n-space vertical v-else>
              <n-progress
                v-for="item in reservationData"
                :key="item.etatRes"
                type="line"
                :percentage="calculatePercentage(item.count)"
                :color="getStatusColor(item.etatRes)"
                :height="24"
                :border-radius="4"
                :fill-color="getStatusBgColor(item.etatRes)"
              >
                <template #default>
                  <n-space justify="space-between" class="w-100">
                    <n-text>{{ item.etatRes }}</n-text>
                    <n-text strong>{{ item.count }}</n-text>
                  </n-space>
                </template>
              </n-progress>
            </n-space>
            
            <template #footer>
              <n-text depth="3" class="small">
                Basé sur {{ totalReservations }} réservations enregistrées
              </n-text>
            </template>
          </n-card>
        </n-gi>

        <!-- Top matériels -->
        <n-gi>
          <n-card class="custom-card">
            <template #header>
              <n-space align="center">
                <n-icon size="20">🏆</n-icon>
                <n-text strong>Top Matériels les Plus Demandés</n-text>
              </n-space>
            </template>
            
            <n-empty v-if="!topMateriel || topMateriel.length === 0" description="Aucune donnée de location">
              <template #icon>
                <n-icon>📦</n-icon>
              </template>
            </n-empty>
            
            <div class="scrollable-list" v-else>
              <n-list>
                <n-list-item v-for="(mat, index) in topMateriel" :key="mat.codeMat">
                  <template #prefix>
                    <n-badge :value="index + 1" type="primary" class="custom-tag" />
                  </template>
                  
                  <n-thing :title="mat.designationMat || 'Matériel Inconnu'">
                    <template #description>
                      <n-space vertical size="small">
                        <n-text depth="3">
                          Code: {{ mat.codeMat }}
                        </n-text>
                        <n-space align="center">
                          <n-tag size="small" type="info" class="custom-tag">
                            {{ mat.categorieMat || 'Non catégorisé' }}
                          </n-tag>
                        </n-space>
                      </n-space>
                    </template>
                  </n-thing>
                  
                  <template #suffix>
                    <n-statistic
                      :value="mat.totalLocations || mat.count || 0"
                      label="locations"
                      size="small"
                    />
                  </template>
                </n-list-item>
              </n-list>
            </div>
            
            <template #footer>
              <n-text depth="3" class="small">
                Basé sur l'historique des locations
              </n-text>
            </template>
          </n-card>
        </n-gi>
      </n-grid>

      <!-- Statistiques supplémentaires -->
      <n-grid :cols="2" :x-gap="16" :y-gap="16" class="mt-4">
        <!-- Performance mensuelle -->
        <n-gi>
          <n-card class="custom-card">
            <template #header>
              <n-space align="center">
                <n-icon size="20">📈</n-icon>
                <n-text strong>Performance du Mois</n-text>
              </n-space>
            </template>
            <n-space vertical>
              <n-statistic label="Nouvelles réservations" :value="monthlyStats.newReservations || 0" />
              <n-statistic label="Revenu mensuel" :value="formatCurrency(monthlyStats.monthlyRevenue || 0)">
                <template #suffix> MGA</template>
              </n-statistic>
              <n-statistic label="Taux de conversion" :value="monthlyStats.conversionRate || 0">
                <template #suffix>%</template>
              </n-statistic>
            </n-space>
          </n-card>
        </n-gi>

        <!-- Types de location -->
        <n-gi>
          <n-card class="custom-card">
            <template #header>
              <n-space align="center">
                <n-icon size="20">📋</n-icon>
                <n-text strong>Répartition par Type</n-text>
              </n-space>
            </template>
            <n-space vertical>
              <n-space v-for="type in locationTypes" :key="type.type" justify="space-between" class="w-100">
                <n-tag :type="getLocationTypeColor(type.type)" class="custom-tag">
                  {{ getTypeLabel(type.type) }}
                </n-tag>
                <n-text strong>{{ type.count }}</n-text>
              </n-space>
              <n-space v-if="!locationTypes || locationTypes.length === 0" justify="center" class="py-3">
                <n-text depth="3">Aucune donnée disponible</n-text>
              </n-space>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import {
  NH2,
  NText,
  NSpace,
  NButton,
  NCard,
  NGrid,
  NGi,
  NStatistic,
  NEmpty,
  NProgress,
  NList,
  NListItem,
  NThing,
  NTag,
  NBadge,
  NDatePicker,
  NSelect,
  NIcon,
  NAlert
} from 'naive-ui';
import jsPDF from 'jspdf';
import { useRouter } from 'vue-router';
import RapportService from '../services/RapportService';

const loading = ref(false);
const exporting = ref(false);
const apiError = ref(false);
const dateRange = ref(null);
const selectedPeriod = ref('month');



const router = useRouter();

// Options du menu de navigation
const navigationOptions = [

  {
    label: 'Location & Reservation',
    key: 'calendrier',
    icon: () => h('i', { class: 'bi bi-calendar-day me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Inventaire & Patrimoine',
    key: 'inventaire',
    icon: () => h('i', { class: 'bi bi-tools me-2' })
  },
  {
    label: 'Matériel de Bureau',
    key: 'bureau',
    icon: () => h('i', { class: 'bi bi-laptop me-2' })
  },
  
  {
    type: 'divider'
  },
    {
    label: 'Fiches Clients',
    key: 'client',
    icon: () => h('i', { class: 'bi bi-people me-2' })
  },
  {
    label: 'Gestion Financière',
    key: 'finance',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
  },
  
  
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardAdmin',
    'finance': '/finance',
    //'rapport': '/rapport',
    'calendrier': '/location',
    'inventaire': '/patrimoine-admin',
    'bureau': '/materielBureauView',
    'client': '/clientManagementAdmin'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

// KPIs simplifiés sans taux d'occupation
const kpis = ref({
  totalClients: 0,
  locationsMois: 0,
  revenuTotal: 0
});

const reservationData = ref([]);
const topMateriel = ref([]);
const locationTypes = ref([]);
const monthlyStats = ref({
  newReservations: 0,
  monthlyRevenue: 0,
  conversionRate: 0
});

const periodOptions = [
  { label: 'Aujourd\'hui', value: 'today' },
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
  { label: 'Ce trimestre', value: 'quarter' },
  { label: 'Cette année', value: 'year' }
];

// --- Computed properties ---
const totalReservations = computed(() => {
  if (!reservationData.value || !Array.isArray(reservationData.value)) return 0;
  return reservationData.value.reduce((sum, item) => sum + (item.count || 0), 0);
});

// --- Chargement des données ---
const fetchData = async () => {
  loading.value = true;
  apiError.value = false;
  
  try {
    // Charger uniquement les API qui existent
    const promises = [
      RapportService.getKPIs().catch(handleApiError),
      RapportService.getReservationsReport().catch(handleApiError),
      RapportService.getTopRentedMateriel().catch(handleApiError),
      RapportService.getMonthlyStats().catch(handleApiError),
      RapportService.getLocationTypes().catch(handleApiError)
    ];

    const [kpiRes, reportRes, topMatRes, monthlyRes, typesRes] = await Promise.all(promises);

    // Mettre à jour les données seulement si la réponse est valide
    if (kpiRes?.data) {
      kpis.value = {
        totalClients: kpiRes.data.totalClients || 0,
        locationsMois: kpiRes.data.locationsMois || 0,
        revenuTotal: kpiRes.data.revenuTotal || 0
      };
    }
    
    if (reportRes?.data && Array.isArray(reportRes.data)) {
      reservationData.value = reportRes.data;
    } else {
      reservationData.value = [];
    }
    
    if (topMatRes?.data && Array.isArray(topMatRes.data)) {
      topMateriel.value = topMatRes.data;
    } else {
      topMateriel.value = [];
    }
    
    if (monthlyRes?.data) {
      monthlyStats.value = monthlyRes.data;
    }
    
    if (typesRes?.data && Array.isArray(typesRes.data)) {
      locationTypes.value = typesRes.data;
    } else {
      locationTypes.value = [];
    }

  } catch (error) {
    console.error("Erreur de chargement des rapports:", error);
    apiError.value = true;
  } finally {
    loading.value = false;
  }
};

// --- Fonction de gestion d'erreur d'API ---
const handleApiError = (error) => {
  console.warn('API non disponible:', error.config?.url);
  return null;
};

// --- Export des rapports en PDF ---
const exportToPDF = async () => {
  exporting.value = true;
  try {
    const doc = new jsPDF();
    let yPosition = 20;

    // En-tête du document
    doc.setFontSize(20);
    doc.setTextColor(4, 5, 143);
    doc.text('RAPPORT D\'ACTIVITÉ - CEDII', 105, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Section KPIs
    doc.setFontSize(16);
    doc.setTextColor(4, 5, 143);
    doc.text('INDICATEURS CLÉS DE PERFORMANCE', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const kpiLabels = {
      totalClients: 'Clients Actifs',
      locationsMois: 'Locations ce Mois', 
      revenuTotal: 'Revenu Total'
    };

    Object.entries(kpis.value).forEach(([key, value]) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${kpiLabels[key]}:`, 25, yPosition);
      doc.text(formatKpiValueForPDF(key, value), 80, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Section Réservations
    if (reservationData.value && reservationData.value.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(4, 5, 143);
      doc.text('RÉPARTITION DES RÉSERVATIONS', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      reservationData.value.forEach(item => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        const percentage = calculatePercentage(item.count);
        doc.text(`${item.etatRes}:`, 25, yPosition);
        doc.text(`${item.count} (${percentage}%)`, 80, yPosition);
        yPosition += 8;
      });

      yPosition += 5;
      doc.text(`Total: ${totalReservations.value} réservations`, 25, yPosition);
      yPosition += 10;
    }

    // Section Top Matériels
    if (topMateriel.value && topMateriel.value.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(4, 5, 143);
      doc.text('TOP MATÉRIELS LES PLUS DEMANDÉS', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      topMateriel.value.forEach((mat, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${index + 1}. ${mat.designationMat || 'Matériel Inconnu'}`, 25, yPosition);
        yPosition += 6;
        doc.text(`   Code: ${mat.codeMat} | Catégorie: ${mat.categorieMat || 'N/A'}`, 25, yPosition);
        yPosition += 6;
        doc.text(`   Locations: ${mat.totalLocations || mat.count || 0}`, 25, yPosition);
        yPosition += 8;
      });
      
      yPosition += 5;
    }

    // Section Performance Mensuelle
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(4, 5, 143);
    doc.text('PERFORMANCE DU MOIS', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Nouvelles réservations: ${monthlyStats.value.newReservations || 0}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Revenu mensuel: ${formatCurrency(monthlyStats.value.monthlyRevenue || 0)} MGA`, 25, yPosition);
    yPosition += 8;
    doc.text(`Taux de conversion: ${monthlyStats.value.conversionRate || 0}%`, 25, yPosition);
    yPosition += 15;

    // Section Types de Location
    if (locationTypes.value && locationTypes.value.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(4, 5, 143);
      doc.text('RÉPARTITION PAR TYPE DE LOCATION', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      locationTypes.value.forEach(type => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${getTypeLabel(type.type)}: ${type.count}`, 25, yPosition);
        yPosition += 8;
      });
    }

    // Pied de page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} sur ${pageCount} - CEDII Patrimoine Plus`, 105, 290, { align: 'center' });
    }

    const date = new Date().toISOString().split('T')[0];
    doc.save(`rapport-cedii-${date}.pdf`);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du rapport PDF');
  } finally {
    exporting.value = false;
  }
};

// --- Fonction utilitaire pour formater les valeurs dans le PDF ---
const formatKpiValueForPDF = (key, value) => {
  if (key === 'revenuTotal') {
    return `${formatCurrency(value)} MGA`;
  }
  return value.toString();
};

onMounted(() => {
  fetchData();
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0';
  return value.toLocaleString('fr-MG');
};

const calculatePercentage = (count) => {
  if (totalReservations.value === 0) return 0;
  return Math.round((count / totalReservations.value) * 100);
};

const getKpiTitle = (key) => {
  const titles = {
    totalClients: 'Clients Actifs',
    locationsMois: 'Locations (Mois)',
    revenuTotal: 'Revenu Total'
  };
  return titles[key] || key;
};

const getKpiIcon = (key) => {
  const icons = {
    totalClients: '👥',
    locationsMois: '📅',
    revenuTotal: '💰'
  };
  return icons[key] || '❓';
};

const formatKpiValue = (key, value) => {
  if (key === 'revenuTotal') {
    return formatCurrency(value);
  }
  return value.toString();
};

const getStatusColor = (statut) => {
  const colors = {
    'Confirmée': '#5cb85c',
    'En attente': '#f0ad4e',
    'Annulée': '#d9534f',
    'Terminée': '#067186'
  };
  return colors[statut] || '#5811EE';
};

const getStatusBgColor = (statut) => {
  const colors = {
    'Confirmée': 'rgba(92, 184, 92, 0.1)',
    'En attente': 'rgba(240, 173, 78, 0.1)',
    'Annulée': 'rgba(217, 83, 79, 0.1)',
    'Terminée': 'rgba(6, 113, 134, 0.1)'
  };
  return colors[statut] || 'rgba(88, 17, 238, 0.1)';
};

const getLocationTypeColor = (type) => {
  const colors = {
    'Salle': 'info',
    'Materiel': 'success',
    'Mixte': 'warning'
  };
  return colors[type] || 'default';
};

const getTypeLabel = (type) => {
  const labels = {
    'Salle': 'Salle',
    'Materiel': 'Matériel',
    'Mixte': 'Mixte'
  };
  return labels[type] || type;
};
</script>

<style scoped>
.reports-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header amélioré comme dans la gestion des clients */
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
  font-size: 1.8rem;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

/* Cards */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Boutons cohérents */
.custom-btn-primary {
  background: #007bff !important;
  border-color: #007bff !important;
}

.custom-btn-primary:hover {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
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

.custom-tag {
  font-weight: 600;
}

/* Reste des styles existants */
.scrollable-content {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-right: 8px;
}

.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.kpi-card {
  border-left: 4px solid #5811EE;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 100px;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.15);
}

.kpi-icon {
  font-size: 2rem;
  padding: 12px;
  background: rgba(88, 17, 238, 0.1);
  border-radius: 8px;
  margin-right: 12px;
}

.kpi-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.kpi-value {
  font-size: 1.5rem;
  color: #04058F;
}

.kpi-totalClients {
  border-left-color: #067186;
}

.kpi-totalClients .kpi-icon {
  background: rgba(6, 113, 134, 0.1);
}

.kpi-locationsMois {
  border-left-color: #04058F;
}

.kpi-locationsMois .kpi-icon {
  background: rgba(4, 5, 143, 0.1);
}

.kpi-revenuTotal {
  border-left-color: #5811EE;
}

.kpi-revenuTotal .kpi-icon {
  background: rgba(88, 17, 238, 0.1);
}

@media (max-width: 768px) {
  .reports-management-container {
    padding: 10px;
  }
  
  .scrollable-content {
    max-height: none;
    overflow-y: visible;
  }
  
  .kpi-icon {
    font-size: 1.5rem;
    padding: 8px;
  }
  
  .kpi-value {
    font-size: 1.25rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
}

.small {
  font-size: 0.875em;
}

.py-3 {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>