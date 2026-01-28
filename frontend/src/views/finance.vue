

<template>
  <div class="full-height-container">
    <!-- Structure principale avec sidebar et contenu -->
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

             <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
      
        <!-- Header avec navigation et actions -->
  <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-3">
  <!-- Partie gauche -->
  <div class="d-flex align-items-center">
    <n-button 
      @click="$router.go(-1)" 
      type="default" 
      size="small"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-left"></i>
      </template>
      Retour
    </n-button>
  </div>
  
    <div class="text-center">
                  <h1 class="custom-title mb-1">
                    <i class="bi bi-cash-stack me-2"></i>
                    Contrôle Financier
                  </h1>
                  <p class="custom-subtitle">Suivi et surveillance des données financières</p>
                </div>
  <!-- Partie droite -->
  <div class="d-flex align-items-center gap-3">
    <n-button 
      @click="refreshPage" 
      type="info" 
      size="small"
      :loading="isLoading"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-clockwise"></i>
      </template>
      Actualiser
    </n-button>
    
    <n-tag type="info" size="small" class="custom-tag">
      Rôle: {{ userLogin }}
    </n-tag>
  </div>
</n-layout-header>
    <!-- ... votre header existant ... -->
        </n-layout-header>

        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="finance-container">
            <!-- KPIs Financiers Intégrés -->
            <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic 
                    label="Chiffre d'Affaires" 
                    :value="formatCurrency(financialStats.chiffreAffaires || '0')"
                    class="text-primary"
                  >
                    <template #prefix>
                      <i class="bi bi-currency-dollar"></i>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic 
                    label="Paiements en Attente" 
                    :value="financialStats.paiementsEnAttente || 0"
                    class="text-warning"
                  >
                    <template #prefix>
                      <i class="bi bi-clock"></i>
                    </template>
                    <template #suffix>
                      <div class="small">{{ formatCurrency(financialStats.montantEnAttente || '0') }}</div>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic 
                    label="Locations en Retard" 
                    :value="locationsEnRetard.length || 0"
                    class="text-error"
                  >
                    <template #prefix>
                      <i class="bi bi-exclamation-triangle"></i>
                    </template>
                    <template #suffix>
                      <div class="small">{{ formatCurrency(totalPenalitesValue || '0') }}</div>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="kpi-card custom-card">
                  <n-statistic 
                    label="À Facturer" 
                    :value="locationsAFacturer || 0"
                    class="text-info"
                  >
                    <template #prefix>
                      <i class="bi bi-calendar-check"></i>
                    </template>
                  </n-statistic>
                </n-card>
              </n-gi>
            </n-grid>

            <!-- Section de statistiques détaillées -->
            <n-grid :cols="2" :x-gap="16" :y-gap="16" class="mb-4">
              <n-gi>
                <n-card class="custom-card" title="📊 Résumé Financier">
                  <n-space vertical>
                    <n-statistic label="Locations Terminées Payées" :value="locationsPayees || 0" />
                    <n-statistic label="Chiffre d'Affaires Réel" :value="formatCurrency(financialStats.chiffreAffaires || '0')" />
                   
                    <n-statistic label="Locations Actives" :value="locationsActives || 0" />
                  </n-space>
                </n-card>
              </n-gi>
              <n-gi>
                <n-card class="custom-card" title="📈 Transactions Récentes">
                  <div v-if="loading.finance" class="text-center py-3">
                    <n-spin size="small" />
                  </div>
                  <div v-else-if="recentFinancialTransactions.length === 0" class="text-center py-4">
                    <n-empty description="Aucune transaction récente" size="small" />
                  </div>
                  <n-list v-else size="small">
                    <n-list-item v-for="transaction in recentFinancialTransactions.slice(0, 3)" :key="transaction.id">
                      <n-thing
                        :title="formatCurrency(transaction.amount)"
                        :description="`${transaction.client} • ${formatDate(transaction.date)}`"
                      />
                    </n-list-item>
                  </n-list>
                </n-card>
              </n-gi>
            </n-grid>

            <!-- Tableau des Locations à Facturer -->
            <n-card class="custom-card mb-4" title="📍 Locations à Facturer">
              <template #header-extra>
                <n-tag type="warning" size="small">{{ locationsAFacturer || 0 }} en attente</n-tag>
              </template>

              <div v-if="loading.finance" class="text-center py-4">
                <n-spin size="small">
                  <template #description>
                    Chargement des locations...
                  </template>
                </n-spin>
              </div>

              <div v-else-if="tableDataAFacturer.length === 0" class="text-center py-4">
                <n-empty description="Aucune location à facturer" size="small" />
              </div>

              <n-data-table
                v-else
                :columns="columnsAFacturer"
                :data="tableDataAFacturer"
                :bordered="false"
                size="small"
                class="custom-table"
              />
            </n-card>

            <!-- Tableau des Locations Terminées et Payées -->
            <n-card class="custom-card" title="💰 Locations Terminées et Payées">
              <template #header-extra>
                <n-tag type="success" size="small">{{ locationsPayees || 0 }} payées</n-tag>
              </template>

              <div v-if="loading.finance" class="text-center py-3">
                <n-spin size="small" />
              </div>

              <div v-else-if="tableDataTerminees.length === 0" class="text-center py-4">
                <n-empty description="Aucune location payée" size="small" />
              </div>

              <n-data-table
                v-else
                :columns="columnsTerminees"
                :data="tableDataTerminees"
                :bordered="false"
                size="small"
                class="custom-table"
              />
            </n-card>

            <!-- Section Analyse par Type -->
            <n-card class="custom-card mt-4" title="📋 Analyse par Type">
              <n-grid :cols="3" :x-gap="16" :y-gap="16">
                <n-gi>
                  <n-card size="small" class="text-center">
                    <div class="text-info">
                      <i class="bi bi-building" style="font-size: 2rem;"></i>
                      <div class="fw-bold mt-2">{{ statsByType.salle || 0 }}</div>
                      <div class="small">Salles</div>
                    </div>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card size="small" class="text-center">
                    <div class="text-success">
                      <i class="bi bi-tools" style="font-size: 2rem;"></i>
                      <div class="fw-bold mt-2">{{ statsByType.materiel || 0 }}</div>
                      <div class="small">Matériel</div>
                    </div>
                  </n-card>
                </n-gi>
                <n-gi>
                  <n-card size="small" class="text-center">
                    <div class="text-warning">
                      <i class="bi bi-layers" style="font-size: 2rem;"></i>
                      <div class="fw-bold mt-2">{{ statsByType.mixte || 0 }}</div>
                      <div class="small">Mixte</div>
                    </div>
                  </n-card>
                </n-gi>
              </n-grid>
            </n-card>

            <!-- Dernière mise à jour -->
            <n-card class="custom-card mt-4" size="small">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <i class="bi bi-info-circle me-2 text-primary"></i>
                  <span class="small">Dernière mise à jour: {{ lastUpdateTime }}</span>
                </div>
                <div class="small text-muted">
                  Mode surveillance - Données financières intégrées
                </div>
              </div>
            </n-card>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag,
  NText,
  NSpace,
  NCard,
  NDataTable,
  NGrid,
  NGi,
  NStatistic,
  NList,
  NListItem,
  NThing,
  NSpin,
  NEmpty
} from 'naive-ui';
import FinanceService from '../services/FinanceService';
import LocationService from '../services/LocationService';
import AuthService from '../services/AuthService';

const router = useRouter();

// États utilisateur
const userRole = ref('');
const userLogin = ref('');
const activeMenuKey = ref('finance'); // Activer l'item "finance" dans le menu

// Options du menu
const menuOptions = [
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
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

// États
const loading = ref({
  data: false,
  global: false,
  finance: false
});
const lastUpdateTime = ref('--:--');

// Données provenant du module Finance
const confirmedEvents = ref([]);
const locationsTermineesPayees = ref([]);
const locationsEnRetard = ref([]);
const totalPenalitesValue = ref(0);
const locationsAFacturer = ref(0);
const locationsPayees = ref(0);
const totalPayeValue = ref(0);
const locationsActives = ref(0);

// Données financières
const recentFinancialTransactions = ref([]);
const financialStats = ref({
  chiffreAffaires: 0,
  paiementsEnAttente: 0,
  montantEnAttente: 0,
  locationsEnRetard: 0,
  penalitesTotal: 0
});

// Navigation
const goToDashboard = () => {
  router.push({ name: 'AdminDashboard' });
};

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// Tableau des locations À FACTURER
const tableDataAFacturer = computed(() => {
  const filtered = confirmedEvents.value
    .filter(event => event.etatLo === 'Confirmée' || event.etatLo === 'En cours');
  
  return filtered.map(event => {
    const clientEmail = event.client?.emailCli || event.reservation?.client?.emailCli || event.emailCli || '';
    const clientName = event.client ? `${event.client.nomCli} ${event.client.prenomCli || ''}`.trim() :
      event.reservation?.client ? `${event.reservation.client.nomCli} ${event.reservation.client.prenomCli || ''}`.trim() :
      event.nomCli && event.prenomCli ? `${event.nomCli} ${event.prenomCli}`.trim() : 'N/A';

    const finLocation = new Date(event.finLo);
    const aujourdhui = new Date();
    const joursRetard = Math.max(0, Math.floor((aujourdhui - finLocation) / (1000 * 60 * 60 * 24)));
    const tauxPenalite = 0.02;
    const penalite = joursRetard * tauxPenalite * calculateTarif(event);

    return {
      id: event.idLo,
      client: clientName,
      type: event.typeLo,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarif: formatTarifAriary(calculateTarif(event)),
      statut: event.etatLo,
      email: clientEmail,
      estEnRetard: joursRetard > 0,
      joursRetard: joursRetard,
      penalite: formatTarifAriary(penalite)
    };
  });
});

// Tableau des locations TERMINÉES ET PAYÉES
const tableDataTerminees = computed(() => {
  return locationsTermineesPayees.value.map(event => {
    const clientEmail = event.emailCli || '';
    const clientName = `${event.nomCli || ''} ${event.prenomCli || ''}`.trim() || 'N/A';

    return {
      id: event.idLo,
      client: clientName,
      type: event.typeLo,
      dateDebut: new Date(event.debLo).toLocaleDateString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleDateString('fr-FR'),
      tarif: formatTarifAriary(event.tarifTot || 0),
      dateFacturation: event.dateFacturation ? new Date(event.dateFacturation).toLocaleDateString('fr-FR') : 'N/A',
      numeroFacture: event.numeroFacture || 'N/A',
      montantPaye: event.montantPaie ? formatTarifAriary(event.montantPaie) : '0 Ar',
      statutPaiement: event.statutPaie || 'Payé'
    };
  });
});

// Statistiques par type
const statsByType = computed(() => {
  const allEvents = [...confirmedEvents.value, ...locationsTermineesPayees.value];
  
  const salle = allEvents.filter(e => e.typeLo === 'Salle').length;
  const materiel = allEvents.filter(e => e.typeLo === 'Materiel').length;
  const mixte = allEvents.filter(e => e.typeLo === 'Mixte').length;
  
  return { salle, materiel, mixte };
});

// Colonnes pour le tableau À FACTURER
const columnsAFacturer = [
 /* {
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted fw-bold' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 150,
  },
  {
    title: 'Type',
    key: 'type',
    width: 100,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small'
    }, { default: () => row.type })
  },
  {
    title: 'Période',
    key: 'periode',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'small' }, row.dateDebut),
      h('div', { class: 'small text-muted' }, 'au ' + row.dateFin),
      row.estEnRetard ? h('div', { class: 'small text-danger' }, `⚠️ ${row.joursRetard} jour(s) retard`) : null
    ])
  },
  {
    title: 'Montant',
    key: 'tarif',
    align: 'right',
    width: 120,
    render: (row) => h('div', [
      h('strong', { class: 'text-success' }, row.tarif),
      row.estEnRetard ? h('div', { class: 'small text-warning' }, `+${row.penalite} pénalité`) : null
    ])
  },
  {
    title: 'Statut',
    key: 'statut',
    width: 100,
    render: (row) => h(NTag, {
      type: row.estEnRetard ? 'error' : 
            row.statut === 'En cours' ? 'warning' : 
            row.statut === 'Confirmée' ? 'info' : 'default',
      size: 'small'
    }, { default: () => row.estEnRetard ? 'En retard' : row.statut })
  }
];

// Colonnes pour le tableau TERMINÉES ET PAYÉES
const columnsTerminees = [
 /*{
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted fw-bold' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 150,
  },
  {
    title: 'Type',
    key: 'type',
    width: 100,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small'
    }, { default: () => row.type })
  },
  {
    title: 'Période',
    key: 'periode',
    width: 150,
    render: (row) => h('div', [
      h('div', { class: 'small' }, row.dateDebut),
      h('div', { class: 'small text-muted' }, 'au ' + row.dateFin)
    ])
  },
  {
    title: 'Facture',
    key: 'facture',
    width: 150,
    render: (row) => h('div', [
      h('div', { class: 'small text-success' }, row.numeroFacture),
      h('div', { class: 'small text-muted' }, row.dateFacturation)
    ])
  },
  {
    title: 'Montant Payé',
    key: 'montantPaye',
    align: 'right',
    width: 120,
    render: (row) => h('strong', { class: 'text-success' }, row.montantPaye)
  }
];


/*
const fetchFinancialData = async () => {
  loading.value.finance = true;
  try {
    console.log('🔄 Chargement des données du module Finance...');
    
    // 1. Charger les locations à facturer
    const confirmedResponse = await LocationService.getConfirmedEvents();
    confirmedEvents.value = confirmedResponse.data || [];
    locationsAFacturer.value = confirmedEvents.value.filter(event => 
      event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
    
    // 2. Charger les locations terminées payées
    const terminatedResponse = await LocationService.getTerminatedLocations();
    locationsTermineesPayees.value = (terminatedResponse.data || []).filter(location => 
      location.statutPaie === 'Effectué'
    );
    locationsPayees.value = locationsTermineesPayees.value.length;
    
    // 3. Calculer le total payé
    totalPayeValue.value = locationsTermineesPayees.value.reduce((sum, location) => {
      return sum + parseFloat(location.montantPaie || 0);
    }, 0);
    
    // 4. Charger les locations en retard
    const penaltiesResponse = await FinanceService.calculatePenalties();
    locationsEnRetard.value = penaltiesResponse.data || [];
    
    // Calculer le total des pénalités
    totalPenalitesValue.value = locationsEnRetard.value.reduce((sum, location) => {
      return sum + (location.penalite || 0);
    }, 0);
    
    // 5. Charger les données de paiement pour les transactions récentes
    const financeResponse = await FinanceService.getPaymentData();
    const financialData = financeResponse.data || { 
      pendingPayments: [], 
      validatedPayments: []
    };
    
    // 6. Mettre à jour les stats financières - CORRECTION ICI
    // ESSAYER D'ABORD L'API DÉDIÉE POUR LE CHIFFRE D'AFFAIRES
    let totalCA = 0;
    
    try {
      const caResponse = await FinanceService.getChiffreAffaires();
      totalCA = caResponse.data.total || 0;
      console.log('✅ Chiffre d\'affaires depuis API:', totalCA);
    } catch (apiError) {
      console.warn('⚠️ API CA non disponible, calcul local...');
      
      // FALLBACK 1: Calcul local depuis les paiements validés
      totalCA = (financialData.validatedPayments || [])
        .filter(p => p.statutPaie === 'Effectué')
        .reduce((sum, p) => sum + (parseFloat(p.montantPaie) || 0), 0);
      
      console.log('CA depuis paiements validés:', totalCA);
      
      // FALLBACK 2: Si toujours 0, utiliser les locations payées
      if (totalCA === 0) {
        totalCA = locationsTermineesPayees.value.reduce((sum, l) => {
          const montant = parseFloat(l.montantPaie) || 0;
          console.log(`Location ${l.idLo}: ${l.montantPaie} -> ${montant}`);
          return sum + montant;
        }, 0);
        console.log('CA depuis locations terminées payées:', totalCA);
      }
    }
    
    financialStats.value.chiffreAffaires = totalCA;
    
    // 7. Mettre à jour les autres statistiques financières
    financialStats.value.paiementsEnAttente = (financialData.pendingPayments || []).length;
    financialStats.value.montantEnAttente = (financialData.pendingPayments || [])
      .reduce((sum, p) => sum + (p.montantPaie || 0), 0);
    
    financialStats.value.locationsEnRetard = locationsEnRetard.value.length;
    financialStats.value.penalitesTotal = totalPenalitesValue.value;
    
    // 8. Transactions récentes
    const recentPayments = (financialData.validatedPayments || [])
      .sort((a, b) => new Date(b.dateCre || b.datePaie) - new Date(a.dateCre || a.datePaie))
      .slice(0, 5)
      .map(p => ({
        id: p.idPaie || p.id || `PAY-${Math.random().toString(36).substr(2, 5)}`,
        client: `${p.nomCli || 'Client'} ${p.prenomCli || ''}`.trim(),
        amount: p.montantPaie || p.montant || 0,
        date: p.dateCre || p.datePaie || new Date().toISOString(),
        method: p.modePaie || 'Cash',
        status: p.statutPaie || 'Effectué'
      }));
    
    // Si aucune transaction, utiliser les locations payées
    if (recentPayments.length === 0 && locationsTermineesPayees.value.length > 0) {
      recentFinancialTransactions.value = locationsTermineesPayees.value
        .slice(0, 3)
        .map(l => ({
          id: `LOC-${l.idLo}`,
          client: `${l.nomCli || 'Client'} ${l.prenomCli || ''}`.trim(),
          amount: l.montantPaie || 0,
          date: l.dateFacturation || new Date().toISOString(),
          method: 'Divers',
          status: 'Effectué'
        }));
    } else {
      recentFinancialTransactions.value = recentPayments;
    }
    
    // 9. Calculer les locations actives
    locationsActives.value = confirmedEvents.value.filter(event => 
      event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
    
    console.log('✅ Données chargées:', {
      àFacturer: locationsAFacturer.value,
      payées: locationsPayees.value,
      enRetard: locationsEnRetard.value.length,
      CA: financialStats.value.chiffreAffaires,
      totalPayeValue: totalPayeValue.value
    });
    
    // Debug: Afficher les détails des calculs
    console.log('📊 Détails des calculs:', {
      locationsTermineesPayees: locationsTermineesPayees.value.length,
      montants: locationsTermineesPayees.value.map(l => ({
        id: l.idLo,
        montantPaie: l.montantPaie,
        parsed: parseFloat(l.montantPaie) || 0
      })),
      totalCAFinal: totalCA
    });
    
  } catch (error) {
    console.error('❌ Erreur chargement données finance:', error);
    
    // Données de démonstration en cas d'erreur
    financialStats.value = {
      chiffreAffaires: 2750000,
      paiementsEnAttente: 4,
      montantEnAttente: 680000,
      locationsEnRetard: 2,
      penalitesTotal: 75000
    };
    
    recentFinancialTransactions.value = [
      {
        id: 'PAY-DEMO-1',
        client: 'Client Démo',
        amount: 300000,
        date: new Date().toISOString(),
        method: 'Virement',
        status: 'Effectué'
      },
      {
        id: 'PAY-DEMO-2',
        client: 'Entreprise ABC',
        amount: 500000,
        date: new Date(Date.now() - 172800000).toISOString(),
        method: 'Carte',
        status: 'Effectué'
      }
    ];
    
    // Mettre à jour les compteurs avec des valeurs par défaut
    locationsAFacturer.value = confirmedEvents.value.filter(event => 
      event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
    locationsPayees.value = locationsTermineesPayees.value.length;
  } finally {
    loading.value.finance = false;
  }
};

*/

// MODIFIEZ la fonction fetchFinancialData existante
const fetchFinancialData = async () => {
  loading.value.finance = true;
  try {
    console.log('🔄 Chargement des données du module Finance...');
    
    // 1. Charger les locations à facturer
    const confirmedResponse = await LocationService.getConfirmedEvents();
    confirmedEvents.value = confirmedResponse.data || [];
    locationsAFacturer.value = confirmedEvents.value.filter(event => 
      event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
    
    // 2. Charger les locations terminées payées
    const terminatedResponse = await LocationService.getTerminatedLocations();
    locationsTermineesPayees.value = (terminatedResponse.data || []).filter(location => 
      location.statutPaie === 'Effectué'
    );
    locationsPayees.value = locationsTermineesPayees.value.length;
    
    // 3. Calculer le total payé
    totalPayeValue.value = locationsTermineesPayees.value.reduce((sum, location) => {
      return sum + parseFloat(location.montantPaie || 0);
    }, 0);
    
    // 4. Charger les locations en retard
    const penaltiesResponse = await FinanceService.calculatePenalties();
    locationsEnRetard.value = penaltiesResponse.data || [];
    
    // Calculer le total des pénalités
    totalPenalitesValue.value = locationsEnRetard.value.reduce((sum, location) => {
      return sum + (location.penalite || 0);
    }, 0);
    
    // 5. Charger les données de paiement pour les transactions récentes
    const financeResponse = await FinanceService.getPaymentData();
    const financialData = financeResponse.data || { 
      pendingPayments: [], 
      validatedPayments: []
    };
    
    // 6. Mettre à jour les stats financières - CALCUL DU CA
    let totalCA = 0;
    
    try {
      const caResponse = await FinanceService.getChiffreAffaires();
      totalCA = caResponse.data.total || 0;
      console.log('✅ Chiffre d\'affaires depuis API:', totalCA);
    } catch (apiError) {
      console.warn('⚠️ API CA non disponible, calcul local...');
      
      // FALLBACK 1: Calcul local depuis les paiements validés
      totalCA = (financialData.validatedPayments || [])
        .filter(p => p.statutPaie === 'Effectué')
        .reduce((sum, p) => sum + (parseFloat(p.montantPaie) || 0), 0);
      
      console.log('CA depuis paiements validés:', totalCA);
      
      // FALLBACK 2: Si toujours 0, utiliser les locations payées
      if (totalCA === 0) {
        totalCA = locationsTermineesPayees.value.reduce((sum, l) => {
          const montant = parseFloat(l.montantPaie) || 0;
          console.log(`Location ${l.idLo}: ${l.montantPaie} -> ${montant}`);
          return sum + montant;
        }, 0);
        console.log('CA depuis locations terminées payées:', totalCA);
      }
    }
    
    // ⭐⭐⭐ AJOUT IMPORTANT ⭐⭐⭐
    // Stocker le chiffre d'affaires dans localStorage pour le partager
    localStorage.setItem('chiffreAffairesGlobal', totalCA.toString());
    console.log('💾 Chiffre d\'affaires stocké dans localStorage:', totalCA);
    
    // Stocker aussi les détails pour le débogage
    localStorage.setItem('ca_lastUpdate', new Date().toISOString());
    localStorage.setItem('ca_source', totalCA > 0 ? 'Finance Module' : 'Calcul local');
    
    // Mettre à jour les stats locales
    financialStats.value.chiffreAffaires = totalCA;
    
    // 7. Mettre à jour les autres statistiques financières
    financialStats.value.paiementsEnAttente = (financialData.pendingPayments || []).length;
    financialStats.value.montantEnAttente = (financialData.pendingPayments || [])
      .reduce((sum, p) => sum + (p.montantPaie || 0), 0);
    
    financialStats.value.locationsEnRetard = locationsEnRetard.value.length;
    financialStats.value.penalitesTotal = totalPenalitesValue.value;
    
    // 8. Transactions récentes
    const recentPayments = (financialData.validatedPayments || [])
      .sort((a, b) => new Date(b.dateCre || b.datePaie) - new Date(a.dateCre || a.datePaie))
      .slice(0, 5)
      .map(p => ({
        id: p.idPaie || p.id || `PAY-${Math.random().toString(36).substr(2, 5)}`,
        client: `${p.nomCli || 'Client'} ${p.prenomCli || ''}`.trim(),
        amount: p.montantPaie || p.montant || 0,
        date: p.dateCre || p.datePaie || new Date().toISOString(),
        method: p.modePaie || 'Cash',
        status: p.statutPaie || 'Effectué'
      }));
    
    // Si aucune transaction, utiliser les locations payées
    if (recentPayments.length === 0 && locationsTermineesPayees.value.length > 0) {
      recentFinancialTransactions.value = locationsTermineesPayees.value
        .slice(0, 3)
        .map(l => ({
          id: `LOC-${l.idLo}`,
          client: `${l.nomCli || 'Client'} ${l.prenomCli || ''}`.trim(),
          amount: l.montantPaie || 0,
          date: l.dateFacturation || new Date().toISOString(),
          method: 'Divers',
          status: 'Effectué'
        }));
    } else {
      recentFinancialTransactions.value = recentPayments;
    }
    
    // 9. Calculer les locations actives
    locationsActives.value = confirmedEvents.value.filter(event => 
      event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
    
    console.log('✅ Données chargées:', {
      àFacturer: locationsAFacturer.value,
      payées: locationsPayees.value,
      enRetard: locationsEnRetard.value.length,
      CA: totalCA,
      totalPayeValue: totalPayeValue.value
    });
    
  } catch (error) {
    console.error('❌ Erreur chargement données finance:', error);
    
    // Données de démonstration en cas d'erreur
    financialStats.value = {
      chiffreAffaires: 2750000,
      paiementsEnAttente: 4,
      montantEnAttente: 680000,
      locationsEnRetard: 2,
      penalitesTotal: 75000
    };
    
    // Stocker même la valeur de démonstration
    localStorage.setItem('chiffreAffairesGlobal', '2750000');
    localStorage.setItem('ca_lastUpdate', new Date().toISOString());
    localStorage.setItem('ca_source', 'Fallback (erreur)');
    
    recentFinancialTransactions.value = [
      {
        id: 'PAY-DEMO-1',
        client: 'Client Démo',
        amount: 300000,
        date: new Date().toISOString(),
        method: 'Virement',
        status: 'Effectué'
      },
      {
        id: 'PAY-DEMO-2',
        client: 'Entreprise ABC',
        amount: 500000,
        date: new Date(Date.now() - 172800000).toISOString(),
        method: 'Carte',
        status: 'Effectué'
      }
    ];
    
    // Mettre à jour les compteurs avec des valeurs par défaut
    locationsAFacturer.value = confirmedEvents.value.filter(event => 
      event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
    locationsPayees.value = locationsTermineesPayees.value.length;
  } finally {
    loading.value.finance = false;
  }
};

// AJOUTEZ ces nouvelles fonctions après fetchFinancialData
const updateChiffreAffairesInStorage = (value) => {
  localStorage.setItem('chiffreAffairesGlobal', value.toString());
  localStorage.setItem('ca_lastUpdate', new Date().toISOString());
  localStorage.setItem('ca_source', 'Manual Update');
  console.log('💾 CA manuellement mis à jour:', value);
  
  // Mettre à jour aussi l'affichage local
  financialStats.value.chiffreAffaires = value;
};

// Fonction pour synchroniser manuellement le CA
const syncChiffreAffairesToReports = () => {
  const currentCA = financialStats.value.chiffreAffaires || 0;
  updateChiffreAffairesInStorage(currentCA);
  
  // Afficher une notification
  window.$message?.success(`Chiffre d'affaires synchronisé: ${formatCurrency(currentCA)}`);
};

// Fonction pour vérifier ce qui est stocké
const checkStoredCA = () => {
  const storedCA = localStorage.getItem('chiffreAffairesGlobal');
  const lastUpdate = localStorage.getItem('ca_lastUpdate');
  const source = localStorage.getItem('ca_source');
  
  console.log('🔍 CA stocké dans localStorage:', {
    valeur: storedCA,
    dernièreMiseÀJour: lastUpdate ? new Date(lastUpdate).toLocaleString('fr-FR') : 'N/A',
    source: source || 'N/A'
  });
  
  return {
    valeur: storedCA ? parseInt(storedCA) : 0,
    dernièreMiseÀJour: lastUpdate,
    source: source
  };
};


const refreshAllData = async () => {
  loading.value.global = true;
  try {
    await fetchFinancialData();
    updateLastUpdateTime();
  } catch (error) {
    console.error('Erreur actualisation:', error);
  } finally {
    loading.value.global = false;
  }
};



const updateLastUpdateTime = () => {
  const now = new Date();
  lastUpdateTime.value = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Fonctions utilitaires
const formatCurrency = (value) => {
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0,00 MGA';
  return `${value.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatTarifAriary = (montant) => {
  if (montant === null || montant === undefined || isNaN(montant)) {
    return '0 Ar';
  }
  return `${parseFloat(montant).toLocaleString('fr-FR')} Ar`;
};

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

const formatDate = (datetime) => {
  if (!datetime) return 'N/A';
  try {
    return new Date(datetime).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return '-';
  }
};

// Cycle de vie
onMounted(async () => {
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    userLogin.value = user.loginUti || '';
  }
  
  await refreshAllData();
});
</script>

<style scoped>
.full-height-container {
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

/* Contenu principal */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.bg-light {
  background-color: #f8f9fa !important;
  flex: 1;
  overflow-y: auto;
}

.finance-container {
  height: 100%;
  display: flex;
  flex-direction: column;
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

.custom-tag {
  font-weight: 600;
}

/* Cartes */
.custom-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

.kpi-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

/* Table */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-table .n-data-table-thead) {
  background-color: #f8f9fa;
}

:deep(.custom-table .n-data-table-th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
}

:deep(.custom-table .n-data-table-tr--hover) {
  background-color: #f8f9ff !important;
}

.text-mono {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

/* Scrollbars personnalisées */
.bg-light::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-table {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .custom-table {
    font-size: 0.8rem;
  }
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