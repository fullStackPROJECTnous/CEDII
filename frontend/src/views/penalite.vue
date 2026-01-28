

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
        <!-- Header FIXE -->
        <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-3" :style="{ position: 'sticky', top: 0, zIndex: 1000 }">
          <div>
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
              <i class="bi bi-exclamation-octagon-fill me-2"></i>
              Suivi des Pénalités de Retard
            </h2>
            <p class="custom-description">Gestion des retards de paiement clients</p>
          </div>
          <div class="d-flex align-items-center gap-2">
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
          </div>
        </n-layout-header>

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light" :style="{ marginTop: '0' }">
          <div class="container-fluid py-4 px-0 mx-0">
            <!-- Statistiques résumées -->
            <div class="row mb-4 g-3">
              <div class="col-xl-3 col-md-6 col-6">
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
              <div class="col-xl-3 col-md-6 col-6">
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
              <div class="col-xl-3 col-md-6 col-6">
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
              <div class="col-xl-3 col-md-6 col-6">
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
              <div v-else class="table-responsive">
                <n-data-table
                  :columns="penalitesColumns"
                  :data="penalitesList"
                  :scroll-x="1200"
                  :max-height="500"
                  virtual-scroll
                  class="custom-table"
                  :row-class-name="rowClassName"
                />
              </div>
            </n-card>
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
import LocationService from '../services/LocationService';

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
    label: 'Rapports & Synthèses',
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


/*
// Remplacer fetchPenalitesData() par :
const fetchLocationsEnRetard = async () => {
  isLoading.value = true;
  try {
    console.log('🔄 Chargement des locations en retard...');
    const response = await LocationService.getConfirmedEvents();
    
    // Filtrage et calcul identique au composant Facturation
    penalitesList.value = response.data
      .filter(event => event.etatLo === 'Confirmée' || event.etatLo === 'En cours')
      .map(event => {
        const clientEmail = event.client?.emailCli || event.reservation?.client?.emailCli || event.emailCli || '';
        const clientName = event.client ? `${event.client.nomCli} ${event.client.prenomCli || ''}`.trim() :
          event.reservation?.client ? `${event.reservation.client.nomCli} ${event.reservation.client.prenomCli || ''}`.trim() :
          event.nomCli && event.prenomCli ? `${event.nomCli} ${event.prenomCli}`.trim() : 'N/A';

        // MÊME CALCUL que dans Facturation
        const finLocation = new Date(event.finLo);
        const aujourdhui = new Date();
        const joursRetard = Math.max(0, Math.floor((aujourdhui - finLocation) / (1000 * 60 * 60 * 24)));
        
        // Seulement si en retard
        if (joursRetard > 0) {
          const tauxPenalite = 0.02; // 2% (ou 0.01 pour 1%)
          const tarifLocation = calculateTarif(event);
          const penalite = joursRetard * tauxPenalite * tarifLocation;
          
          return {
            id: event.idLo,
            client: clientName,
            email: clientEmail,
            telephone: event.client?.telCli || event.reservation?.client?.telCli || '',
            daysLate: joursRetard,
            baseAmount: tarifLocation,
            penaltyAmount: penalite,
            finalAmount: tarifLocation + penalite,
            dateDebut: event.debLo,
            dateFin: event.finLo,
            typeLocation: event.typeLo,
            statutPaiement: event.statutPaie || 'En attente'
          };
        }
        return null;
      })
      .filter(item => item !== null); // Enlever les nulls

    console.log(`✅ ${penalitesList.value.length} pénalités calculées`);
    
  } catch (error) {
    console.error("❌ Erreur chargement locations:", error);
    alert("Erreur de chargement");
    penalitesList.value = [];
  } finally {
    isLoading.value = false;
  }
};*/

const fetchLocationsEnRetard = async () => {
  isLoading.value = true;
  try {
    console.log('🔄 Chargement des locations en retard...');
    const response = await LocationService.getConfirmedEvents();
    
    penalitesList.value = response.data
      .filter(event => {
        // Même filtre que FactureGene
        return event.etatLo === 'Confirmée' || event.etatLo === 'En cours';
      })
      .map(event => {
        // Même extraction client que FactureGene
        const clientEmail = event.client?.emailCli || event.reservation?.client?.emailCli || event.emailCli || '';
        const clientName = event.client ? `${event.client.nomCli} ${event.prenomCli || ''}`.trim() :
          event.reservation?.client ? `${event.reservation.client.nomCli} ${event.prenomCli || ''}`.trim() :
          event.nomCli && event.prenomCli ? `${event.nomCli} ${event.prenomCli}`.trim() : 'N/A';

        // CALCUL DES JOURS DE RETARD CORRIGÉ
        const finLocation = new Date(event.finLo);
        const maintenant = new Date();
        
        // Normaliser les dates (ignorer les heures)
        finLocation.setHours(23, 59, 59, 999); // Fin de journée
        const aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
        
        // Calculer la différence
        const diffMs = aujourdhui.getTime() - finLocation.getTime();
        const joursRetard = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
        
        // Si en retard, calculer les pénalités
        if (joursRetard > 0) {
          const tauxPenalite = 0.01; // 1% par jour (comme indiqué dans l'alerte)
          const tarifLocation = calculateTarif(event);
          const penalite = joursRetard * tauxPenalite * tarifLocation;
          
          return {
            id: event.idLo,
            client: clientName,
            email: clientEmail,
            telephone: event.client?.telCli || event.reservation?.client?.telCli || '',
            daysLate: joursRetard,
            baseAmount: tarifLocation,
            penaltyAmount: penalite,
            finalAmount: tarifLocation + penalite,
            dateDebut: new Date(event.debLo).toLocaleDateString('fr-FR'),
            dateFin: new Date(event.finLo).toLocaleDateString('fr-FR'),
            typeLocation: event.typeLo,
            statutPaiement: event.statutPaie || 'En attente',
            etatLo: event.etatLo,
            // Données brutes pour débogage
            rawFinLo: event.finLo,
            rawDebLo: event.debLo
          };
        }
        return null;
      })
      .filter(item => item !== null);

    console.log(`✅ ${penalitesList.value.length} pénalités calculées`);
    
    // Debug: Afficher les premières pénalités
    if (penalitesList.value.length > 0) {
      console.log('📋 Exemples de pénalités:', penalitesList.value.slice(0, 3));
    }
    
  } catch (error) {
    console.error("❌ Erreur chargement locations:", error);
    alert("Erreur de chargement des pénalités");
    penalitesList.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Ajouter cette fonction
const calculateTarif = (event) => {
  try {
    if (event.tarifTot && event.tarifTot > 0) {
      return parseFloat(event.tarifTot);
    }
    return event.tarifNumerique || 0;
  } catch (error) {
    console.error('Erreur calcul tarif:', error);
    return 0;
  }
};

// Fonction pour retourner en arrière
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
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
    fetchLocationsEnRetard(); // Au lieu de fetchPenalitesData()
    
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
/* RESET ET CORRECTIONS PRINCIPALES */
* {
    box-sizing: border-box;
}

.dashboard-wrapper {
    height: 100vh;
    width: 100vw;
    max-width: 100vw;
    overflow-x: hidden !important;
    margin: 0;
    padding: 0;
}

/* Header FIXE - IMPORTANT */
.custom-header {
    background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky !important;
    top: 0 !important;
    z-index: 1000 !important;
    width: 100%;
}

/* Sidebar */
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

.custom-subtitle {
    color: white;
    font-weight: 700;
    margin: 0;
    font-size: 1.2rem;
}

.custom-description {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-size: 0.85rem;
}

.btn-back {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
}

/* Conteneur principal */
.container-fluid {
    width: 100%;
    max-width: 100%;
    padding-left: 12px !important;
    padding-right: 12px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    overflow-x: hidden;
}

.n-layout-content.p-4 {
    padding: 1.5rem !important;
    width: 100%;
    max-width: 100%;
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
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

/* Boutons */
.custom-btn-primary {
    background: #007bff !important;
    border-color: #007bff !important;
}

.custom-btn-primary:hover {
    background: #0056b3 !important;
    border-color: #0056b3 !important;
}

.custom-btn-warning {
    background: #ffc107 !important;
    border-color: #ffc107 !important;
}

/* Table responsive */
.table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 8px;
}

:deep(.custom-table) {
    min-width: 100%;
    table-layout: auto;
}

:deep(.custom-table .n-data-table-base-table) {
    width: 100% !important;
    min-width: 1000px;
}

/* Styles pour les lignes critiques */
:deep(.table-row-critical) {
    background-color: #f8d7da !important;
}

:deep(.table-row-warning) {
    background-color: #fff3cd !important;
}

/* Correction pour le scroll des tables */
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

/* Menu dropdown */
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

/* Background */
.bg-light {
    background-color: #f8f9fa !important;
    min-height: calc(100vh - 64px);
}

/* Conteneurs sans scroll horizontal */
.n-layout, .n-layout-sider, .n-layout-content, .n-layout-header {
    max-width: 100% !important;
    overflow-x: hidden !important;
}

.main-content {
    overflow-x: hidden !important;
    width: 100% !important;
}

.row {
    margin-left: -6px !important;
    margin-right: -6px !important;
}

.col-xl-3, .col-md-6, .col-6 {
    padding-left: 6px !important;
    padding-right: 6px !important;
}

/* RESPONSIVE */
@media (max-width: 992px) {
    .custom-header {
        padding: 0.75rem !important;
    }
    
    .custom-subtitle {
        font-size: 1.1rem;
    }
    
    .custom-description {
        font-size: 0.8rem;
    }
    
    .container-fluid {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }
}

@media (max-width: 768px) {
    .dashboard-wrapper {
        height: auto;
        min-height: 100vh;
    }
    
    .custom-header {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
        padding: 0.75rem !important;
    }
    
    .custom-header > div {
        width: 100%;
        justify-content: center !important;
    }
    
    .custom-subtitle {
        font-size: 1rem;
    }
    
    .custom-description {
        font-size: 0.75rem;
    }
    
    .col-md-6, .col-6 {
        width: 100%;
        margin-bottom: 0.75rem;
    }
    
    .container-fluid {
        padding-left: 6px !important;
        padding-right: 6px !important;
    }
    
    .n-layout-content.p-4 {
        padding: 1rem !important;
    }
    
    :deep(.n-card .n-card-content) {
        padding: 12px;
    }
    
    .position-relative {
        position: absolute !important;
        top: 10px;
        right: 10px;
    }
    
    :deep(.custom-table .n-data-table-base-table) {
        min-width: 1200px;
    }
    
    :deep(.custom-table td:last-child .d-flex) {
        flex-direction: column;
        gap: 4px;
    }
    
    :deep(.custom-table td:last-child .d-flex .n-button) {
        width: 100%;
        justify-content: center;
    }
}

@media (min-width: 1200px) {
    .container-fluid {
        max-width: 1400px;
        margin: 0 auto;
    }
}

/* Scrollbar générale */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>