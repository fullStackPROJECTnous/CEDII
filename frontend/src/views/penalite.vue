<!--<template>
  <div class="container-fluid py-4">
    <!-- En-tête avec bouton retour 
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
                <i class="bi bi-exclamation-octagon-fill me-2"></i>
                Suivi des Pénalités de Retard
              </h1>
              <p class="custom-subtitle">Gestion des retards de paiement clients</p>
            </div>
             <!-- Menu trois points 
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

    <!-- Conteneur principal avec scroll 
    <div class="main-content-wrapper">
      <!-- Statistiques résumées 
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-danger h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-danger me-3">
                <i class="bi bi-clock-history text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Total Pénalités</h6>
                <h4 class="mb-0 text-warning">{{ formatCurrency(totalPenalties) }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-warning h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-warning me-3">
                <i class="bi bi-calendar-x text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Dossiers en Retard</h6>
                <h4 class="mb-0 text-warning">{{ penalitesList.length }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-primary h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-primary me-3">
                <i class="bi bi-cash-coin text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Montant Initial Total</h6>
                <h4 class="mb-0 text-info">{{ formatCurrency(totalBaseAmount) }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
          <n-card class="custom-card-success h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-success me-3">
                <i class="bi bi-currency-exchange text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Total à Payer</h6>
                <h4 class="mb-0 text-success">{{ formatCurrency(totalFinalAmount) }}</h4>
              </div>
            </div>
          </n-card>
        </div>
      </div>

      <!-- Carte principale des pénalités 
      <n-card class="shadow-lg mb-4" title="Détail des Pénalités de Retard">
        <template #header-extra>
          <n-space>
            <n-button type="primary" @click="fetchPenalitesData" class="custom-btn-primary">
              <template #icon>
                <i class="bi bi-arrow-clockwise"></i>
              </template>
              Actualiser
            </n-button>
            <n-tag :type="penalitesList.length > 0 ? 'error' : 'success'" round class="custom-tag">
              {{ penalitesList.length }} dossier(s)
            </n-tag>
          </n-space>
        </template>

        <n-alert type="info" class="mb-3">
          <template #icon>
            <i class="bi bi-percent"></i>
          </template>
          Taux de pénalité appliqué : <strong>1% par jour de retard</strong> sur le montant initial de la location.
        </n-alert>

        <!-- État de chargement 
        <n-empty v-if="isLoading" description="Chargement des données de pénalités...">
          <template #icon>
            <n-spin size="large" />
          </template>
        </n-empty>

        <!-- Aucune pénalité 
        <n-empty v-else-if="penalitesList.length === 0" description="Aucune pénalité de retard détectée">
          <template #icon>
            <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
          </template>
        </n-empty>

        <!-- Table des pénalités avec scroll 
        <div v-else class="table-container">
          <n-data-table
            :columns="penalitesColumns"
            :data="penalitesList"
            :scroll-x="1400"
            :max-height="500"
            virtual-scroll
            class="custom-table"
            :row-class-name="rowClassName"
          />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NButton, 
  NCard, 
  NDataTable, 
  NTag, 
  NEmpty, 
  NIcon, 
  NAlert,
  NSpin,
  NSpace,
  NDropdown
} from 'naive-ui';
import FinanceService from '@/services/FinanceService';

const router = useRouter();

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Facturation',
    key: 'fact',
    icon: () => h('i', { class: 'bi-file-earmark-text' })
  },
  {
    label: 'Suivi des paiements',
    key: 'suiviPaie',
    icon: () => h('i', { class: 'bi-cash-stack' })
  },
  {
    label: 'Rapports $ Synthèses',
    key: 'syntheseRapp',
    icon: () => h('i', { class: 'bi-graph-up' })
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
    'dashboard': '/dashboardFinance',
    'fact': '/facturation',
    'suiviPaie': '/suivi',
    'syntheseRapp': '/synthese'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

// --- Variables d'état ---
const penalitesList = ref([]);
const isLoading = ref(true);
const loading = ref(false);

// --- Propriétés calculées ---
const totalBaseAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.baseAmount || 0), 0);
});

const totalPenalties = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.penaltyAmount || 0), 0);
});

const totalFinalAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.finalAmount || 0), 0);
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
};

// --- Colonnes pour le tableau des pénalités ---
const penalitesColumns = [
  {
    title: 'N°Location',
    key: 'id',
    width: 120,
    sorter: (a, b) => a.id - b.id,
    render: (row) => h('span', { class: 'fw-bold' }, `LO-${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'fw-semibold' }, row.client),
      h('div', { class: 'text-muted small' }, row.email || 'Email non disponible')
    ])
  },
  {
    title: 'Jours de Retard',
    key: 'daysLate',
    width: 130,
    sorter: (a, b) => a.daysLate - b.daysLate,
    render: (row) => {
      const getTagType = (days) => {
        if (days <= 3) return 'warning';
        if (days <= 7) return 'error';
        return 'error';
      };
      
      return h(NTag, { 
        type: getTagType(row.daysLate),
        size: 'small',
        class: 'custom-tag'
      }, { default: () => `${row.daysLate} jours` });
    }
  },
  {
    title: 'Montant Initial',
    key: 'baseAmount',
    width: 150,
    sorter: (a, b) => parseFloat(a.baseAmount) - parseFloat(b.baseAmount),
    render: (row) => h('span', { class: 'text-dark fw-semibold' }, formatCurrency(parseFloat(row.baseAmount)))
  },
  {
    title: 'Taux Pénalité',
    key: 'penaltyRate',
    width: 120,
    render: () => h('span', { class: 'text-info fw-semibold' }, '1% / jour')
  },
  {
    title: 'Frais de Retard',
    key: 'penaltyAmount',
    width: 150,
    sorter: (a, b) => parseFloat(a.penaltyAmount) - parseFloat(b.penaltyAmount),
    render: (row) => {
      const penalty = parseFloat(row.penaltyAmount || 0);
      return h('div', [
        h('span', { class: 'text-warning fw-bold' }, formatCurrency(penalty)),
        penalty > 0 ? h('div', { class: 'text-muted small' }, `${(penalty / parseFloat(row.baseAmount) * 100).toFixed(1)}% du montant initial`) : null
      ]);
    }
  },
  {
    title: 'Total à Payer',
    key: 'finalAmount',
    width: 160,
    sorter: (a, b) => parseFloat(a.finalAmount) - parseFloat(b.finalAmount),
    render: (row) => h('span', { class: 'text-success fw-bold' }, formatCurrency(parseFloat(row.finalAmount)))
  },
  {
    title: 'Détails Calcul',
    key: 'calculation',
    width: 200,
    render: (row) => {
      const base = parseFloat(row.baseAmount || 0);
      const penalty = parseFloat(row.penaltyAmount || 0);
      const days = row.daysLate || 0;
      
      return h('div', { class: 'small text-muted' }, [
        h('div', `Base: ${formatCurrency(base)}`),
        h('div', `Pénalité (${days}j): ${formatCurrency(penalty)}`),
        h('div', { class: 'fw-semibold' }, `Total: ${formatCurrency(base + penalty)}`)
      ]);
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'd-flex gap-2' }, [
        h(NButton, {
          type: 'warning',
          size: 'small',
          class: 'custom-btn-warning',
          onClick: () => sendReminderEmail(row),
          loading: loading.value
        }, {
          default: () => 'Relance',
          icon: () => h('i', { class: 'bi bi-bell' })
        }),
        h(NButton, {
          type: 'info',
          size: 'small',
          class: 'custom-btn-primary',
          ghost: true,
          onClick: () => viewDetails(row.id)
        }, {
          default: () => 'Détails',
          icon: () => h('i', { class: 'bi bi-eye' })
        })
      ]);
    }
  }
];

const rowClassName = (row, index) => {
  return row.daysLate > 7 ? 'table-row-critical' : 'table-row-warning';
};

// --- Logique d'appel API ---
const fetchPenalitesData = async () => {
  isLoading.value = true;
  try {
    console.log('🔄 Chargement des données de pénalités...');
    const response = await FinanceService.getPenalitesData();
    
    penalitesList.value = response.data.map(item => ({
      id: item.id,
      client: item.client,
      email: item.email,
      telephone: item.telephone,
      daysLate: item.daysLate || 0,
      baseAmount: item.baseAmount || 0,
      penaltyAmount: item.penaltyAmount || 0,
      finalAmount: item.finalAmount || 0,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      typeLocation: item.typeLocation,
      statutPaiement: item.statutPaiement
    }));

    console.log(`✅ ${penalitesList.value.length} pénalités chargées depuis la base de données`);
    
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données de pénalités:", error);
    alert("Erreur de chargement des pénalités");
    penalitesList.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fonction d'envoi de rappel
const sendReminderEmail = async (location) => {
  try {
    loading.value = true;
    
    console.log('📧 Envoi rappel pour location:', location);

    // Préparer les données REQUISES
    const requestData = {
      locationId: location.id,
      clientData: {
        name: location.client,
        email: location.email,
        amount: location.finalAmount,
        phone: location.telephone
      }
    };

    // Validation côté frontend
    if (!requestData.locationId) {
      alert('ID de location manquant');
      return;
    }

    if (!requestData.clientData.email) {
      alert('Email du client manquant');
      return;
    }

    console.log('📤 Envoi rappel avec données:', requestData);

    const response = await FinanceService.sendPenaltyReminder(requestData);
    
    if (response.data.success) {
      alert(`✅ Rappel envoyé à ${requestData.clientData.name}`);
    } else {
      throw new Error(response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur envoi rappel:', error);
    
    if (error.response?.status === 400) {
      alert('❌ Données invalides: ' + (error.response.data.message || 'Vérifiez les informations du client'));
    } else if (error.response?.status === 404) {
      alert('❌ Location non trouvée');
    } else {
      alert('❌ Erreur lors de l\'envoi du rappel: ' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

const viewDetails = (locationId) => {
  const location = penalitesList.value.find(item => item.id === locationId);
  if (location) {
    const details = `
Détails de la location #${locationId}:

Client: ${location.client}
Email: ${location.email || 'Non renseigné'}
Téléphone: ${location.telephone || 'Non renseigné'}
Type: ${location.typeLocation || 'Non spécifié'}
Date début: ${new Date(location.dateDebut).toLocaleDateString('fr-FR')}
Date fin: ${new Date(location.dateFin).toLocaleDateString('fr-FR')}
Jours de retard: ${location.daysLate} jours
Montant initial: ${formatCurrency(location.baseAmount)}
Frais de retard (1%/jour): ${formatCurrency(location.penaltyAmount)}
Total à payer: ${formatCurrency(location.finalAmount)}
Statut: ${location.statutPaiement}
    `;
    alert(details);
  }
};

// --- Initialisation ---
onMounted(() => {
  fetchPenalitesData();
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

/* Conteneur principal avec scroll */
.main-content-wrapper {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Scrollbar personnalisée pour le conteneur principal */
.main-content-wrapper::-webkit-scrollbar {
  width: 10px;
}

.main-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
  border: 2px solid #f1f1f1;
}

.main-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Pour Firefox */
.main-content-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Cartes avec couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, black 0%, black 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, gray 0%, gray 100%);
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
.custom-icon-danger, 
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

.custom-btn-warning {
  background: #ffc107;
  border-color: #ffc107;
}

/* Conteneur de table avec scroll */
.table-container {
  max-height: 500px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 100%;
}

/* Styles pour le scroll personnalisé */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Styles pour les lignes critiques */
:deep(.table-row-critical) {
  background-color: #f8d7da !important;
}

:deep(.table-row-warning) {
  background-color: #fff3cd !important;
}

/* Amélioration du scroll pour la table Naive UI */
:deep(.n-data-table) {
  --n-scrollbar-width: 8px;
  --n-scrollbar-height: 8px;
}

:deep(.n-data-table-base-table-body) {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
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
  .custom-icon-danger, 
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

  .table-container {
    max-height: 400px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 160px);
    padding-right: 5px;
  }
}

@media (max-width: 576px) {
  .table-container {
    max-height: 350px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 140px);
  }
}

/* Styles pour les tables */
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.d-flex.gap-2 {
  gap: 8px;
}

/* Amélioration de l'apparence du scroll virtuel */
:deep(.n-data-table .n-data-table-base-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.n-data-table .n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

/* Effet de survol amélioré */
:deep(.n-data-table .n-data-table-tr:hover .n-data-table-td) {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

/* Animation de chargement pour le scroll */
.main-content-wrapper {
  scroll-behavior: smooth;
}

/* Ombre pour indiquer le défilement */
.main-content-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.05));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-content-wrapper.scrolling::after {
  opacity: 1;
}

/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>-->

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
 <div>
            <!-- Changement: Retour en arrière avec historique du navigateur -->
            <n-button 
              @click="goBack" 
              type="default"
              size="small"
              class="btn-back"
            >
              <template #icon>
                <i class="bi bi-arrow-left me-1"></i>
              </template>
              Retour
            </n-button>
          </div>
                    <div class="text-center">
                      <h2 class="custom-subtitle mb-1">
                        Gestion des retards de paiement clients
                      </h2>
                      <p class="text-white-50 mb-0">Suivi détaillé des pénalités applicables</p>
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
          <n-tag type="info" size="small" class="custom-tag">
            Rôle: {{ userRole }}
          </n-tag>
        </n-layout-header>

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4">
            <!-- En-tête avec bouton retour -->
           

            <!-- Conteneur principal avec scroll -->
            <div class="main-content-wrapper">
              <!-- Statistiques résumées -->
              <div class="row mb-4">
                <div class="col-xl-3 col-md-6 mb-3">
                  <n-card class="custom-card-danger h-100" size="small">
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-danger me-3">
                        <i class="bi bi-clock-history text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">Total Pénalités</h6>
                        <h4 class="mb-0 text-warning">{{ formatCurrency(totalPenalties) }}</h4>
                      </div>
                    </div>
                  </n-card>
                </div>
                <div class="col-xl-3 col-md-6 mb-3">
                  <n-card class="custom-card-warning h-100" size="small">
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-warning me-3">
                        <i class="bi bi-calendar-x text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">Dossiers en Retard</h6>
                        <h4 class="mb-0 text-warning">{{ penalitesList.length }}</h4>
                      </div>
                    </div>
                  </n-card>
                </div>
                <div class="col-xl-3 col-md-6 mb-3">
                  <n-card class="custom-card-primary h-100" size="small">
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-primary me-3">
                        <i class="bi bi-cash-coin text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">Montant Initial Total</h6>
                        <h4 class="mb-0 text-info">{{ formatCurrency(totalBaseAmount) }}</h4>
                      </div>
                    </div>
                  </n-card>
                </div>
                <div class="col-xl-3 col-md-6 mb-3">
                  <n-card class="custom-card-success h-100" size="small">
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-success me-3">
                        <i class="bi bi-currency-exchange text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">Total à Payer</h6>
                        <h4 class="mb-0 text-success">{{ formatCurrency(totalFinalAmount) }}</h4>
                      </div>
                    </div>
                  </n-card>
                </div>
              </div>

              <!-- Carte principale des pénalités -->
              <n-card class="shadow-lg mb-4" title="Détail des Pénalités de Retard">
                <template #header-extra>
                  <n-space>
                    <n-button type="primary" @click="fetchPenalitesData" class="custom-btn-primary">
                      <template #icon>
                        <i class="bi bi-arrow-clockwise"></i>
                      </template>
                      Actualiser
                    </n-button>
                    <n-tag :type="penalitesList.length > 0 ? 'error' : 'success'" round class="custom-tag">
                      {{ penalitesList.length }} dossier(s)
                    </n-tag>
                  </n-space>
                </template>

                <n-alert type="info" class="mb-3">
                  <template #icon>
                    <i class="bi bi-percent"></i>
                  </template>
                  Taux de pénalité appliqué : <strong>1% par jour de retard</strong> sur le montant initial de la location.
                </n-alert>

                <!-- État de chargement -->
                <n-empty v-if="isLoading" description="Chargement des données de pénalités...">
                  <template #icon>
                    <n-spin size="large" />
                  </template>
                </n-empty>

                <!-- Aucune pénalité -->
                <n-empty v-else-if="penalitesList.length === 0" description="Aucune pénalité de retard détectée">
                  <template #icon>
                    <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
                  </template>
                </n-empty>

                <!-- Table des pénalités avec scroll -->
                <div v-else class="table-container">
                  <n-data-table
                    :columns="penalitesColumns"
                    :data="penalitesList"
                    :scroll-x="1400"
                    :max-height="500"
                    virtual-scroll
                    class="custom-table"
                    :row-class-name="rowClassName"
                  />
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
import { ref, onMounted, h, computed, nextTick } from 'vue';
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
  NSpace,
  NDropdown
} from 'naive-ui';

import AuthService from '../services/AuthService'; 
import FinanceService from '../services/FinanceService'; 

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const activeMenuKey = ref('penalites');

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

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Facturation',
    key: 'fact',
    icon: () => h('i', { class: 'bi-file-earmark-text' })
  },
  {
    label: 'Suivi des paiements',
    key: 'suiviPaie',
    icon: () => h('i', { class: 'bi-cash-stack' })
  },
  {
    label: 'Rapports $ Synthèses',
    key: 'syntheseRapp',
    icon: () => h('i', { class: 'bi-graph-up' })
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu trois points
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': 'FinanceDashboard',
    'fact': 'FactureGene',
    'suiviPaie': 'SuiviPaie',
    'syntheseRapp': 'RapportSynth'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// --- Variables d'état ---
const penalitesList = ref([]);
const isLoading = ref(true);
const loading = ref(false);

// Données réactives du tableau de bord
const kpis = ref({ 
  monthlyRevenue: 0,
  pendingAmount: 0,
  avgDaysLate: 0,
  autoPaymentRate: '0%'
});

const pendingPaymentsCount = ref(0);
const invoicesToSend = ref([]);
const pendingPenalties = ref([]);

// Propriétés calculées pour le tableau de bord
const invoicesToProcess = computed(() => invoicesToSend.value.length);
const litigeCount = computed(() => pendingPenalties.value.length);

// --- Propriétés calculées pour les pénalités ---
const totalBaseAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.baseAmount || 0), 0);
});

const totalPenalties = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.penaltyAmount || 0), 0);
});

const totalFinalAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.finalAmount || 0), 0);
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
};

// --- Fonctions du tableau de bord ---
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

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// --- Colonnes pour le tableau des pénalités ---
const penalitesColumns = [
  {
    title: 'N°Location',
    key: 'id',
    width: 120,
    sorter: (a, b) => a.id - b.id,
    render: (row) => h('span', { class: 'fw-bold' }, `LO-${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'fw-semibold' }, row.client),
      h('div', { class: 'text-muted small' }, row.email || 'Email non disponible')
    ])
  },
  {
    title: 'Jours de Retard',
    key: 'daysLate',
    width: 130,
    sorter: (a, b) => a.daysLate - b.daysLate,
    render: (row) => {
      const getTagType = (days) => {
        if (days <= 3) return 'warning';
        if (days <= 7) return 'error';
        return 'error';
      };
      
      return h(NTag, { 
        type: getTagType(row.daysLate),
        size: 'small',
        class: 'custom-tag'
      }, { default: () => `${row.daysLate} jours` });
    }
  },
  {
    title: 'Montant Initial',
    key: 'baseAmount',
    width: 150,
    sorter: (a, b) => parseFloat(a.baseAmount) - parseFloat(b.baseAmount),
    render: (row) => h('span', { class: 'text-dark fw-semibold' }, formatCurrency(parseFloat(row.baseAmount)))
  },
  {
    title: 'Taux Pénalité',
    key: 'penaltyRate',
    width: 120,
    render: () => h('span', { class: 'text-info fw-semibold' }, '1% / jour')
  },
  {
    title: 'Frais de Retard',
    key: 'penaltyAmount',
    width: 150,
    sorter: (a, b) => parseFloat(a.penaltyAmount) - parseFloat(b.penaltyAmount),
    render: (row) => {
      const penalty = parseFloat(row.penaltyAmount || 0);
      return h('div', [
        h('span', { class: 'text-warning fw-bold' }, formatCurrency(penalty)),
        penalty > 0 ? h('div', { class: 'text-muted small' }, `${(penalty / parseFloat(row.baseAmount) * 100).toFixed(1)}% du montant initial`) : null
      ]);
    }
  },
  {
    title: 'Total à Payer',
    key: 'finalAmount',
    width: 160,
    sorter: (a, b) => parseFloat(a.finalAmount) - parseFloat(b.finalAmount),
    render: (row) => h('span', { class: 'text-success fw-bold' }, formatCurrency(parseFloat(row.finalAmount)))
  },
  {
    title: 'Détails Calcul',
    key: 'calculation',
    width: 200,
    render: (row) => {
      const base = parseFloat(row.baseAmount || 0);
      const penalty = parseFloat(row.penaltyAmount || 0);
      const days = row.daysLate || 0;
      
      return h('div', { class: 'small text-muted' }, [
        h('div', `Base: ${formatCurrency(base)}`),
        h('div', `Pénalité (${days}j): ${formatCurrency(penalty)}`),
        h('div', { class: 'fw-semibold' }, `Total: ${formatCurrency(base + penalty)}`)
      ]);
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'd-flex gap-2' }, [
        h(NButton, {
          type: 'warning',
          size: 'small',
          class: 'custom-btn-warning',
          onClick: () => sendReminderEmail(row),
          loading: loading.value
        }, {
          default: () => 'Relance',
          icon: () => h('i', { class: 'bi bi-bell' })
        }),
        h(NButton, {
          type: 'info',
          size: 'small',
          class: 'custom-btn-primary',
          ghost: true,
          onClick: () => viewDetails(row.id)
        }, {
          default: () => 'Détails',
          icon: () => h('i', { class: 'bi bi-eye' })
        })
      ]);
    }
  }
];

const rowClassName = (row, index) => {
  return row.daysLate > 7 ? 'table-row-critical' : 'table-row-warning';
};

// --- Logique d'appel API ---
const fetchPenalitesData = async () => {
  isLoading.value = true;
  try {
    console.log('🔄 Chargement des données de pénalités...');
    const response = await FinanceService.getPenalitesData();
    
    penalitesList.value = response.data.map(item => ({
      id: item.id,
      client: item.client,
      email: item.email,
      telephone: item.telephone,
      daysLate: item.daysLate || 0,
      baseAmount: item.baseAmount || 0,
      penaltyAmount: item.penaltyAmount || 0,
      finalAmount: item.finalAmount || 0,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      typeLocation: item.typeLocation,
      statutPaiement: item.statutPaiement
    }));

    console.log(`✅ ${penalitesList.value.length} pénalités chargées depuis la base de données`);
    
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données de pénalités:", error);
    alert("Erreur de chargement des pénalités");
    penalitesList.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fonction d'envoi de rappel
const sendReminderEmail = async (location) => {
  try {
    loading.value = true;
    
    console.log('📧 Envoi rappel pour location:', location);

    // Préparer les données REQUISES
    const requestData = {
      locationId: location.id,
      clientData: {
        name: location.client,
        email: location.email,
        amount: location.finalAmount,
        phone: location.telephone
      }
    };

    // Validation côté frontend
    if (!requestData.locationId) {
      alert('ID de location manquant');
      return;
    }

    if (!requestData.clientData.email) {
      alert('Email du client manquant');
      return;
    }

    console.log('📤 Envoi rappel avec données:', requestData);

    const response = await FinanceService.sendPenaltyReminder(requestData);
    
    if (response.data.success) {
      alert(`✅ Rappel envoyé à ${requestData.clientData.name}`);
    } else {
      throw new Error(response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur envoi rappel:', error);
    
    if (error.response?.status === 400) {
      alert('❌ Données invalides: ' + (error.response.data.message || 'Vérifiez les informations du client'));
    } else if (error.response?.status === 404) {
      alert('❌ Location non trouvée');
    } else {
      alert('❌ Erreur lors de l\'envoi du rappel: ' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

// Fonction pour retourner en arrière
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1); // Retourne d'une page dans l'historique
  } else {
    // Si pas d'historique, redirige vers le tableau de bord
    router.push({ name: 'FinanceDashboard' });
  }
};

const viewDetails = (locationId) => {
  const location = penalitesList.value.find(item => item.id === locationId);
  if (location) {
    const details = `
Détails de la location #${locationId}:

Client: ${location.client}
Email: ${location.email || 'Non renseigné'}
Téléphone: ${location.telephone || 'Non renseigné'}
Type: ${location.typeLocation || 'Non spécifié'}
Date début: ${new Date(location.dateDebut).toLocaleDateString('fr-FR')}
Date fin: ${new Date(location.dateFin).toLocaleDateString('fr-FR')}
Jours de retard: ${location.daysLate} jours
Montant initial: ${formatCurrency(location.baseAmount)}
Frais de retard (1%/jour): ${formatCurrency(location.penaltyAmount)}
Total à payer: ${formatCurrency(location.finalAmount)}
Statut: ${location.statutPaiement}
    `;
    alert(details);
  }
};

// --- Initialisation ---
onMounted(() => {
  const user = AuthService.getCurrentUser();
  
  if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
    userRole.value = user.roleUti.toUpperCase();
    fetchFinanceData();
    fetchPenalitesData();
    
    // Définir l'élément de menu actif basé sur la route actuelle
    const routeToKeyMap = {
      'FinanceDashboard': 'dashboard',
      'FactureGene': 'facturation',
      'SuiviPaie': 'paiements',
      'PenaliteLiti': 'penalites',
      'RapportSynth': 'rapports'
    };
    
    activeMenuKey.value = routeToKeyMap[route.name] || 'penalites';
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

/* Sous-header */
.custom-subheader {
  background: linear-gradient(135deg, #0405BF 0%, #04058f 100%);
  color: white;
  border-left: 4px solid #007bff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.custom-subtitle {
  color: white;
  font-weight: 600;
  margin: 0;
  font-size: 1.2rem;
}

/* Conteneur principal avec scroll */
.main-content-wrapper {
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 10px;
}

/* Scrollbar personnalisée pour le conteneur principal */
.main-content-wrapper::-webkit-scrollbar {
  width: 10px;
}

.main-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
  border: 2px solid #f1f1f1;
}

.main-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Pour Firefox */
.main-content-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Cartes avec couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-success {
  background: linear-gradient(135deg, black 0%, black 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, gray 0%, gray 100%);
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
.custom-icon-danger, 
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

.custom-btn-warning {
  background: #ffc107;
  border-color: #ffc107;
}

/* Conteneur de table avec scroll */
.table-container {
  max-height: 500px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 100%;
}

/* Styles pour le scroll personnalisé */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Styles pour les lignes critiques */
:deep(.table-row-critical) {
  background-color: #f8d7da !important;
}

:deep(.table-row-warning) {
  background-color: #fff3cd !important;
}

/* Amélioration du scroll pour la table Naive UI */
:deep(.n-data-table) {
  --n-scrollbar-width: 8px;
  --n-scrollbar-height: 8px;
}

:deep(.n-data-table-base-table-body) {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.n-data-table-base-table-body::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 1rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-subheader {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-danger, 
  .custom-icon-success,
  .custom-icon-warning {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-subheader .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .table-container {
    max-height: 400px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 200px);
    padding-right: 5px;
  }
}

@media (max-width: 576px) {
  .table-container {
    max-height: 350px;
  }

  .main-content-wrapper {
    max-height: calc(100vh - 180px);
  }
}

/* Styles pour les tables */
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.d-flex.gap-2 {
  gap: 8px;
}

/* Amélioration de l'apparence du scroll virtuel */
:deep(.n-data-table .n-data-table-base-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.n-data-table .n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

/* Effet de survol amélioré */
:deep(.n-data-table .n-data-table-tr:hover .n-data-table-td) {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  .custom-subheader .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Amélioration de l'espacement général */
.main-content {
  overflow-y: auto;
}

.bg-light {
  background-color: #f8f9fa !important;
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
</style>