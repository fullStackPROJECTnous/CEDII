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

             <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
          
        <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-4">
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
              <i class="bi bi-graph-up-arrow me-2"></i>
              Facturation & Génération
            </h2>
            <p class="custom-description">Tableau de bord financier et gestion des facturations</p>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <n-button 
              @click="sendAllPenaltyNotifications" 
              type="warning" 
              size="small" 
              :disabled="locationsEnRetardUnifiees.length === 0"
            >
              <i class="bi bi-bell me-2"></i>Notifier Retards ({{ locationsEnRetardUnifiees.length }})
            </n-button>
            <n-tag type="info" size="small" class="custom-tag">
              Rôle: {{ userRole }}
            </n-tag>
          </div>
        </n-layout-header>
        <!-- ... votre header existant ... -->
        </n-layout-header>

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light">
          <!-- Alerte Litiges - Barre bleue en bas supprimée -->
         
          <div class="container-fluid py-4 px-0 mx-0">
            <!-- CONTENU PRINCIPAL SANS SCROLL INTERNE -->
            <!-- Cartes de statistiques améliorées -->
            <div class="row mb-4 g-3">
              <div class="col-md-3 col-6">
                <n-card class="custom-card-primary h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-primary me-3">
                      <i class="bi bi-calendar-check text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">À Facturer</h6>
                      <h4 class="mb-0 text-warning">{{ locationsAFacturerCount }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>
              
              <div class="col-md-3 col-6">
                <n-card class="custom-card-danger h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-danger me-3">
                      <i class="bi bi-clock-history text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">En Retard</h6>
                      <h4 class="mb-0 text-danger">{{ locationsEnRetardUnifiees.length }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>

              <div class="col-md-3 col-6">
                <n-card class="custom-card-warning h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-warning me-3">
                      <i class="bi bi-cash-coin text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">Chiffre d'Affaires</h6>
                      <h4 class="mb-0 text-info">{{ chiffreAffairesTotal }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>

              <!-- NOUVEAU : KPI Factures Envoyées -->
              <div class="col-md-3 col-6">
                <n-card class="custom-card-success h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-success me-3">
                      <i class="bi bi-envelope-check text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">Factures Envoyées</h6>
                      <h4 class="mb-0 text-success">{{ facturesEnvoyeesCount }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>
            </div>

            <!-- Nouvelle section Alertes Retards -->
            <div class="row mb-4" v-if="locationsEnRetardUnifiees.length > 0">
              <div class="col-12">
                <n-alert type="warning" class="custom-alert">
                  <template #icon>
                    <i class="bi bi-exclamation-triangle"></i>
                  </template>
                  <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong>{{ locationsEnRetardUnifiees.length }} location(s) en retard de retour </strong>
                      <div class="small">Total des pénalités: {{ totalPenalitesCalcule }}</div>
                    </div>
                    <n-button @click="sendAllPenaltyNotifications" type="warning" size="small" class="mt-2 mt-md-0">
                      <i class="bi bi-bell me-1"></i>Notifier tous les clients
                    </n-button>
                  </div>
                </n-alert>
              </div>
            </div>

            <!-- Tableau des locations à facturer -->
            <n-card class="shadow-lg mb-4" title="📍 Locations à Facturer">
              <template #header-extra>
                <div class="d-flex gap-2 flex-wrap">
                  <!-- AJOUT : Filtres -->
                  <div class="d-flex gap-2 flex-wrap">
                    <!-- Filtre par statut -->
                    <n-select
                      v-model:value="filtreStatut"
                      :options="optionsStatut"
                      placeholder="Statut"
                      style="width: 150px"
                      clearable
                    />
                    
                    <!-- Filtre par date début -->
                    <n-date-picker
                      v-model:value="filtreDateDebut"
                      type="date"
                      placeholder="Date début"
                      style="width: 150px"
                      clearable
                    />
                    
                    <!-- Filtre par date fin -->
                    <n-date-picker
                      v-model:value="filtreDateFin"
                      type="date"
                      placeholder="Date fin"
                      style="width: 150px"
                      clearable
                    />
                    
                    <!-- Recherche par client -->
                    <n-input
                      v-model:value="rechercheClient"
                      placeholder="Rechercher client..."
                      style="width: 200px"
                      clearable
                    >
                      <template #prefix>
                        <i class="bi bi-search"></i>
                      </template>
                    </n-input>
                    
                    <!-- Bouton pour effacer les filtres -->
                    <n-button 
                      @click="effacerFiltres" 
                      type="default" 
                      size="small"
                      :disabled="!filtresActifs"
                    >
                      <template #icon>
                        <i class="bi bi-x-circle"></i>
                      </template>
                      Effacer
                    </n-button>
                  </div>
                  
                  <n-button type="info" size="small" @click="fetchAllData">
                    <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
                  </n-button>
                </div>
              </template>

              <div class="card-body p-0">
                <!-- Loading State -->
                <div v-if="loadingEvents" class="text-center p-5">
                  <n-spin size="large">
                    <template #description>
                      Chargement des locations...
                    </template>
                  </n-spin>
                </div>

                <!-- Empty State -->
                <div v-else-if="tableDataFiltree.length === 0" class="text-center p-5">
                  <n-empty :description="filtresActifs ? 'Aucune location correspondant aux filtres' : 'Aucune location à facturer'">
                    <template #icon>
                      <i class="bi bi-receipt" style="font-size: 3rem; color: #55555E;"></i>
                    </template>
                    <template #extra v-if="filtresActifs">
                      <n-button @click="effacerFiltres" size="small">
                        Effacer les filtres
                      </n-button>
                    </template>
                  </n-empty>
                </div>

                <!-- Data Table avec scroll contrôlé -->
                <div v-else class="table-responsive">
                  <n-data-table
                    :columns="columnsAFacturer"
                    :data="tableDataFiltree"
                    :bordered="false"
                    class="custom-table"
                    :style="{ minWidth: '100%' }"
                  />
                  
                  <!-- Info sur le filtrage -->
                  <div v-if="filtresActifs" class="mt-3 text-muted small px-3">
                    <i class="bi bi-funnel"></i>
                    {{ tableDataFiltree.length }} location(s) correspondant aux filtres 
                    (sur {{ tableDataAFacturer.length }} au total)
                    <a href="#" @click.prevent="effacerFiltres" class="ms-2">
                      <i class="bi bi-x-circle"></i> Effacer les filtres
                    </a>
                  </div>
                </div>
              </div>
            </n-card>
          </div>

          <!-- Modal de confirmation de facturation -->
          <n-modal v-model:show="showConfirmModal" preset="dialog" :mask-closable="false">
            <template #header>
              <div class="d-flex align-items-center">
                <i class="bi bi-receipt me-2 text-primary"></i>
                <span>Créer et Envoyer la Facture</span>
              </div>
            </template>
            
            <div v-if="selectedLocation" class="facture-preview">
              <n-alert type="info" class="mb-3 custom-alert">
                <template #icon>
                  <i class="bi bi-info-circle"></i>
                </template>
                Confirmez-vous la création et l'envoi de la facture pour cette location ?
              </n-alert>
              
              <div class="border rounded p-3 bg-light mb-3">
                <h6 class="fw-bold mb-3">Détails de la Location</h6>
                <div class="row">
                  <div class="col-md-6">
                    <strong>Référence:</strong> #{{ selectedLocation.id }}<br>
                    <strong>Client:</strong> {{ selectedLocation.client }}<br>
                    <strong>Email:</strong> 
                    <span :class="{'text-danger': !selectedLocation.email, 'text-success': selectedLocation.email}">
                      {{ selectedLocation.email || 'Non renseigné' }}
                    </span><br>
                  </div>
                  <div class="col-md-6">
                    <strong>Type:</strong> {{ selectedLocation.type }}<br>
                    <strong>Début:</strong> {{ selectedLocation.dateDebut }}<br>
                    <strong>Fin:</strong> {{ selectedLocation.dateFin }}<br>
                  </div>
                </div>
                <hr>
                <div class="text-center">
                  <strong class="fs-5 text-success">Montant Total: {{ selectedLocation.tarif }}</strong>
                  <div v-if="selectedLocation.joursRetard > 0" class="mt-2">
                    <small class="text-warning">
                      ⚠️ {{ selectedLocation.joursRetard }} jour(s) de retard 
                      (Pénalité: +{{ selectedLocation.penalite }} Ar)
                    </small>
                  </div>
                </div>
              </div>

              <n-form v-if="!selectedLocation.email" ref="emailFormRef" :model="emailForm">
                <n-form-item label="Email du client" required>
                  <n-input 
                    v-model:value="emailForm.email" 
                    placeholder="Entrez l'email du client"
                    type="email"
                  />
                </n-form-item>
              </n-form>

              <n-alert type="warning" v-if="!selectedLocation.email" class="custom-alert">
                <template #icon>
                  <i class="bi bi-exclamation-triangle"></i>
                </template>
                Aucun email renseigné pour ce client. Veuillez saisir une adresse email pour envoyer la facture.
              </n-alert>
            </div>
            
            <template #action>
              <div class="d-flex gap-2 justify-content-end flex-wrap">
                <n-button 
                  @click="telechargerFacture" 
                  type="info" 
                  :loading="isDownloading"
                  :disabled="!selectedLocation"
                >
                  <template #icon>
                    <i class="bi bi-download"></i>
                  </template>
                  Télécharger PDF
                </n-button>
                <n-button 
                  @click="creerEtEnvoyerFacture" 
                  type="primary" 
                  :loading="isSending"
                  :disabled="!selectedLocation || (!selectedLocation.email && !emailForm.email)"
                >
                  <template #icon>
                    <i class="bi bi-send-check"></i>
                  </template>
                  {{ selectedLocation?.email ? 'Créer et Envoyer' : 'Créer et Envoyer avec email' }}
                </n-button>
                <n-button @click="showConfirmModal = false" :disabled="isSending || isDownloading">
                  Annuler
                </n-button>
              </div>
            </template>
          </n-modal>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h, nextTick } from 'vue';
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
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NDatePicker
} from 'naive-ui';
import AuthService from '../services/AuthService'; 
import FinanceService from '../services/FinanceService'; 
import LocationService from '../services/LocationService';

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const activeMenuKey = ref('facturation');

// Données réactives pour le dashboard
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

// Nouvelle fonction: Retour en arrière
const goBack = () => {
    router.go(-1);
};

// Propriétés calculées
const invoicesToProcess = computed(() => invoicesToSend.value.length);
const litigeCount = computed(() => pendingPenalties.value.length);

// Variables réactives pour la gestion des factures
const confirmedEvents = ref([]);
const locationsTermineesPayees = ref([]);
const loadingEvents = ref(true);
const loadingTerminated = ref(false);
const showConfirmModal = ref(false);
const selectedLocation = ref(null);
const isSending = ref(false);
const isDownloading = ref(false);
const emailFormRef = ref(null);
const emailForm = ref({ email: '' });
const facturesEnvoyeesCount = ref(0);
const chiffreAffairesTotal = ref('0 Ar');

// Variables pour les filtres
const filtreStatut = ref(null);
const filtreDateDebut = ref(null);
const filtreDateFin = ref(null);
const rechercheClient = ref('');

// Options pour le filtre par statut
const optionsStatut = [
    { label: 'Tous', value: null },
    { label: 'Confirmée', value: 'Confirmée' },
    { label: 'En cours', value: 'En cours' },
    { label: 'En retard', value: 'retard' }
];

// Computed properties pour les factures
const locationsAFacturerCount = computed(() => {
    return confirmedEvents.value.filter(event => 
        event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
    ).length;
});

// SOURCE UNIQUE pour les locations en retard
const locationsEnRetardUnifiees = computed(() => {
    return tableDataAFacturer.value.filter(item => item.estEnRetard);
});

const totalPenalitesCalcule = computed(() => {
    const total = locationsEnRetardUnifiees.value.reduce((sum, item) => {
        const penaliteValue = parseFloat(item.penalite.replace(/[^\d.]/g, '')) || 0;
        return sum + penaliteValue;
    }, 0);
    return formatTarifAriary(total);
});

// Vérifier si des filtres sont actifs
const filtresActifs = computed(() => {
    return filtreStatut.value !== null || 
           filtreDateDebut.value !== null || 
           filtreDateFin.value !== null || 
           rechercheClient.value !== '';
});

// Tableau des locations À FACTURER (Confirmées + En cours)
const tableDataAFacturer = computed(() => {
    return confirmedEvents.value
        .filter(event => event.etatLo === 'Confirmée' || event.etatLo === 'En cours')
        .map(event => {
            const clientEmail = event.client?.emailCli || event.reservation?.client?.emailCli || event.emailCli || '';
            const clientName = event.client ? `${event.client.nomCli} ${event.client.prenomCli || ''}`.trim() :
                event.reservation?.client ? `${event.reservation.client.nomCli} ${event.reservation.client.prenomCli || ''}`.trim() :
                event.nomCli && event.prenomCli ? `${event.nomCli} ${event.prenomCli}`.trim() : 'N/A';

            // Calcul des jours de retard et pénalités
            const finLocation = new Date(event.finLo);
            const aujourdhui = new Date();
            const joursRetard = Math.max(0, Math.floor((aujourdhui - finLocation) / (1000 * 60 * 60 * 24)));
            const tauxPenalite = 0.02;
            const tarifLocation = calculateTarif(event);
            const penalite = joursRetard * tauxPenalite * tarifLocation;

            return {
                id: event.idLo,
                client: clientName,
                type: event.typeLo,
                dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
                dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
                tarif: formatTarifAriary(tarifLocation),
                statut: event.etatLo,
                email: clientEmail,
                hasEmail: !!clientEmail,
                location: event,
                tarifNumerique: tarifLocation,
                joursRetard: joursRetard,
                penalite: formatTarifAriary(penalite),
                estEnRetard: joursRetard > 0,
                penaliteNumerique: penalite,
                // Pour le filtrage par date
                dateDebutObj: new Date(event.debLo),
                dateFinObj: new Date(event.finLo)
            };
        });
});

// Tableau filtré selon les critères
const tableDataFiltree = computed(() => {
    if (!filtresActifs.value) {
        return tableDataAFacturer.value;
    }

    return tableDataAFacturer.value.filter(item => {
        // Filtre par statut
        if (filtreStatut.value === 'retard' && !item.estEnRetard) {
            return false;
        }
        if (filtreStatut.value !== null && filtreStatut.value !== 'retard' && item.statut !== filtreStatut.value) {
            return false;
        }

        // Filtre par date début
        if (filtreDateDebut.value) {
            const dateFiltre = new Date(filtreDateDebut.value);
            const dateItem = new Date(item.dateDebutObj);
            if (dateItem < dateFiltre) {
                return false;
            }
        }

        // Filtre par date fin
        if (filtreDateFin.value) {
            const dateFiltre = new Date(filtreDateFin.value);
            const dateItem = new Date(item.dateFinObj);
            if (dateItem > dateFiltre) {
                return false;
            }
        }

        // Recherche par client
        if (rechercheClient.value && !item.client.toLowerCase().includes(rechercheClient.value.toLowerCase())) {
            return false;
        }

        return true;
    });
});

// Colonnes pour le tableau À FACTURER
const columnsAFacturer = [
    {
        title: 'Client',
        key: 'client',
        minWidth: 180,
        render: (row) => h('div', [
            h('div', { 
                class: 'fw-medium text-truncate',
                style: 'max-width: 170px;'
            }, row.client),
            h('div', { 
                class: `small ${row.hasEmail ? 'text-success' : 'text-danger'}` 
            }, row.hasEmail ? '✓ Email' : '✗ Pas d\'email')
        ])
    },
    {
        title: 'Type',
        key: 'type',
        width: 100,
        render: (row) => h(NTag, { 
            type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
            size: 'small',
            bordered: false
        }, { default: () => row.type })
    },
    {
        title: 'Période',
        key: 'periode',
        minWidth: 220,
        render: (row) => h('div', [
            h('div', { class: 'small text-muted text-truncate', style: 'max-width: 210px;' }, 'Début: ' + row.dateDebut),
            h('div', { class: 'small text-muted text-truncate', style: 'max-width: 210px;' }, 'Fin: ' + row.dateFin),
            row.estEnRetard ? h('div', { class: 'small text-danger' }, `⚠️ ${row.joursRetard} jour(s) retard`) : null
        ])
    },
    {
        title: 'Montant',
        key: 'tarif',
        align: 'right',
        width: 150,
        render: (row) => h('div', [
            h('strong', { class: 'text-success fs-6' }, row.tarif),
            row.estEnRetard ? h('div', { class: 'small text-warning text-truncate', style: 'max-width: 140px;' }, `+${row.penalite} pénalité`) : null
        ])
    },
    {
        title: 'Statut',
        key: 'statut',
        width: 120,
        render: (row) => h(NTag, {
            type: row.estEnRetard ? 'error' : 
                  row.statut === 'En cours' ? 'warning' : 
                  row.statut === 'Confirmée' ? 'info' : 'default',
            size: 'small'
        }, { default: () => row.estEnRetard ? 'En retard' : row.statut })
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 180,
        render: (row) => h('div', { class: 'd-flex gap-1' }, [
            h(NButton, {
                size: 'small',
                type: 'info',
                onClick: () => telechargerFactureDirect(row),
                title: 'Télécharger la facture'
            }, {
                default: () => h('i', { class: 'bi bi-download' })
            }),
            h(NButton, {
                size: 'small',
                type: row.estEnRetard ? 'warning' : 'primary',
                onClick: () => ouvrirModalFacturation(row),
                disabled: !row.hasEmail
            }, {
                default: () => [h('i', { class: 'bi bi-receipt me-1' }), row.estEnRetard ? 'Facturer +' : 'Facturer']
            })
        ])
    }
];

// Fonctions pour le dashboard
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

const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value);
};

// Méthodes pour la gestion des factures
const fetchAllData = async () => {
    loadingEvents.value = true;
    try {
        await fetchConfirmedEvents();
        await Promise.all([
            fetchLocationsTermineesPayees(),
            loadStats()
        ]);
        verifierCohérenceDonnees();
    } catch (error) {
        console.error("❌ Erreur chargement des données:", error);
    } finally {
        loadingEvents.value = false;
    }
};

const fetchConfirmedEvents = async () => {
    try {
        const response = await LocationService.getConfirmedEvents();
        confirmedEvents.value = response.data;
        console.log('✅ Locations à facturer chargées:', response.data.length);
    } catch (error) {
        console.error("❌ Erreur chargement locations à facturer:", error);
        throw error;
    }
};

const fetchLocationsTermineesPayees = async () => {
    loadingTerminated.value = true;
    try {
        const response = await LocationService.getTerminatedLocations();
        locationsTermineesPayees.value = response.data.filter(location => 
            location.statutPaie === 'Effectué'
        );
        console.log('✅ Locations terminées payées chargées:', locationsTermineesPayees.value.length);
    } catch (error) {
        console.error("❌ Erreur chargement locations terminées:", error);
    } finally {
        loadingTerminated.value = false;
    }
};

const sendAllPenaltyNotifications = async () => {
    if (locationsEnRetardUnifiees.value.length === 0) {
        alert('Aucune location en retard à notifier.');
        return;
    }
    
    if (!confirm(`Voulez-vous envoyer des notifications de pénalité à ${locationsEnRetardUnifiees.value.length} client(s) ?`)) {
        return;
    }
    
    try {
        const locationIds = locationsEnRetardUnifiees.value.map(item => item.id);
        const response = await FinanceService.sendPenaltyNotificationsForLocations(locationIds);
        alert(response.data.message || `Notifications envoyées pour ${locationIds.length} location(s)`);
        await fetchAllData();
    } catch (error) {
        console.error('❌ Erreur notifications pénalités:', error);
        alert('Erreur lors de l\'envoi des notifications');
    }
};

const loadStats = async () => {
    try {
        const [chiffreAffaires, facturesEnvoyees] = await Promise.all([
            calculerChiffreAffairesReel(),
            compterFacturesEnvoyees()
        ]);
        
        chiffreAffairesTotal.value = formatTarifAriary(chiffreAffaires);
        facturesEnvoyeesCount.value = facturesEnvoyees;
        
    } catch (error) {
        console.error('❌ Erreur chargement statistiques:', error);
        chiffreAffairesTotal.value = '0 Ar';
        facturesEnvoyeesCount.value = 0;
    }
};

const calculerChiffreAffairesReel = async () => {
    try {
        const response = await FinanceService.getChiffreAffaires();
        return response.data.total || 0;
    } catch (error) {
        console.warn('⚠️ API CA non disponible, calcul local...');
        return locationsTermineesPayees.value.reduce((total, location) => {
            return total + parseFloat(location.montantPaie || 0);
        }, 0);
    }
};

const compterFacturesEnvoyees = async () => {
    try {
        const response = await FinanceService.getFacturesEnvoyees();
        return response.data.count || 0;
    } catch (error) {
        console.warn('⚠️ API factures non disponible, calcul local...');
        return locationsTermineesPayees.value.length;
    }
};

const ouvrirModalFacturation = (location) => {
    selectedLocation.value = location;
    emailForm.value.email = location.email || '';
    showConfirmModal.value = true;
};

const creerEtEnvoyerFacture = async () => {
    if (!selectedLocation.value) return;
    
    const emailFinal = selectedLocation.value.email || emailForm.value.email;
    if (!emailFinal) {
        alert('Veuillez renseigner un email pour envoyer la facture.');
        return;
    }
    
    isSending.value = true;
    try {
        const payload = {
            locationId: selectedLocation.value.id,
            clientEmail: emailFinal
        };
        
        console.log('📍 Envoi facture:', payload);
        
        const response = await FinanceService.createAndSendInvoice(payload);
        
        if (response.data.success) {
            console.log('✅ Facture créée et envoyée:', response.data);
            await fetchAllData();
            showConfirmModal.value = false;
            selectedLocation.value = null;
            emailForm.value.email = '';
            alert(`✅ Facture créée et envoyée avec succès à ${emailFinal}.`);
        } else {
            throw new Error(response.data.message || 'Erreur lors de la création de la facture');
        }
        
    } catch (error) {
        console.error('❌ Erreur création/envoi facture:', error);
        alert(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
        isSending.value = false;
    }
};

const telechargerFacture = async () => {
    if (!selectedLocation.value) return;
    
    isDownloading.value = true;
    try {
        const response = await FinanceService.downloadInvoice(selectedLocation.value.id);
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture-${selectedLocation.value.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Facture téléchargée');
        
    } catch (error) {
        console.error('❌ Erreur téléchargement facture:', error);
        alert('Erreur lors du téléchargement de la facture');
    } finally {
        isDownloading.value = false;
    }
};

const telechargerFactureDirect = async (location) => {
    try {
        const response = await FinanceService.downloadInvoice(location.id);
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture-${location.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('✅ Facture téléchargée directement');
        
    } catch (error) {
        console.error('❌ Erreur téléchargement direct:', error);
        alert('Erreur lors du téléchargement de la facture');
    }
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

const formatTarifAriary = (montant) => {
    if (montant === null || montant === undefined || isNaN(montant)) {
        return '0 Ar';
    }
    return `${parseFloat(montant).toLocaleString('fr-FR')} Ar`;
};

// Méthode pour effacer tous les filtres
const effacerFiltres = () => {
    filtreStatut.value = null;
    filtreDateDebut.value = null;
    filtreDateFin.value = null;
    rechercheClient.value = '';
};

// Méthode de débogage
const verifierCohérenceDonnees = () => {
    console.log('=== VÉRIFICATION COHÉRENCE DES DONNÉES ===');
    console.log('1. Total locations à facturer:', locationsAFacturerCount.value);
    console.log('2. Locations en retard (computed):', locationsEnRetardUnifiees.value.length);
    console.log('=== FIN VÉRIFICATION ===');
};

// Cycle de vie
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
        userRole.value = user.roleUti.toUpperCase();
        fetchFinanceData();
        
        // Définir l'élément de menu actif basé sur la route actuelle
        activeMenuKey.value = 'facturation';
        
        // Charger les données de facturation
        fetchAllData();
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
    position: relative;
}

/* Supprimer les débordements horizontaux */
.n-layout, .n-layout-sider, .n-layout-content, .n-layout-header {
    max-width: 100% !important;
    overflow-x: hidden !important;
}

.main-content {
    overflow-x: hidden !important;
    width: 100% !important;
}

/* Container fluid corrigé */
.container-fluid {
    width: 100%;
    max-width: 100%;
    padding-left: 12px !important;
    padding-right: 12px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    overflow-x: hidden;
}

/* Correction pour le padding du contenu */
.n-layout-content.p-4 {
    padding: 1.5rem !important;
    width: 100%;
    max-width: 100%;
}

/* Correction pour les cartes */
:deep(.n-card) {
    max-width: 100%;
    overflow: hidden;
    border-radius: 8px;
}

:deep(.n-card .n-card-header) {
    padding: 12px 16px;
    border-bottom: 1px solid #e9ecef;
}

:deep(.n-card .n-card-content) {
    padding: 16px;
}

/* Correction pour les tableaux */
.table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

:deep(.custom-table) {
    min-width: 100%;
    table-layout: auto;
}

:deep(.custom-table .n-data-table-base-table) {
    width: 100% !important;
    min-width: 800px;
}

:deep(.custom-table .n-data-table-base-table-header) {
    white-space: nowrap;
}

/* Correction pour les colonnes Bootstrap */
.row {
    margin-left: -6px !important;
    margin-right: -6px !important;
}

.col-md-3, .col-12, .col-md-6, .col-6 {
    padding-left: 6px !important;
    padding-right: 6px !important;
}

/* COULEURS ORIGINALES */

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
    padding: 1rem 1.5rem !important;
    width: 100%;
}

.custom-subtitle {
    color: white;
    font-weight: 700;
    margin: 0;
    font-size: 1.3rem;
}

.custom-description {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-size: 0.9rem;
}

/* Bouton Retour */
.btn-back {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
}

/* Alertes - Barre bleue en bas supprimée */
.custom-alert {
    border-bottom: none !important;
}

:deep(.custom-alert .n-alert-body) {
    border-bottom: none !important;
}

:deep(.custom-alert) {
    border-bottom: none !important;
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
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

/* Contenu principal - Supprimé le scroll interne */
.bg-light {
    background-color: #f8f9fa !important;
    min-height: calc(100vh - 64px);
    overflow-y: auto;
}

.facture-preview {
    max-height: 60vh;
    overflow-y: auto;
    padding: 0 5px;
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

/* RESPONSIVE */
@media (max-width: 992px) {
    .custom-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1rem !important;
    }
    
    .custom-header > div {
        width: 100%;
        justify-content: center !important;
    }
    
    .custom-header .d-flex.gap-2 {
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem !important;
    }
    
    .custom-subtitle {
        font-size: 1.2rem;
        margin-bottom: 0.5rem !important;
    }
    
    .custom-description {
        font-size: 0.85rem;
        margin-bottom: 1rem !important;
    }
    
    .container-fluid {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }
    
    .col-md-3 {
        width: 50%;
    }
    
    /* Responsive pour les filtres */
    :deep(.n-card .n-card-header) {
        padding: 10px !important;
    }
    
    .d-flex.gap-2.flex-wrap {
        gap: 0.5rem !important;
    }
    
    .d-flex.gap-2.flex-wrap > * {
        flex: 1 1 auto;
        min-width: 120px;
    }
    
    .n-input, .n-select, .n-date-picker {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Ajustement des colonnes du tableau sur mobile */
    :deep(.custom-table .n-data-table-base-table) {
        min-width: 900px;
    }
}

@media (max-width: 768px) {
    .dashboard-wrapper {
        height: auto;
        min-height: 100vh;
    }
    
    .col-md-3, .col-6 {
        width: 100%;
        margin-bottom: 0.75rem;
    }
    
    .custom-subtitle {
        font-size: 1.1rem;
    }
    
    .container-fluid {
        padding-left: 6px !important;
        padding-right: 6px !important;
    }
    
    .n-layout-content.p-4 {
        padding: 1rem !important;
    }
    
    /* Réduire le padding des cartes sur mobile */
    :deep(.n-card .n-card-content) {
        padding: 12px;
    }
    
    /* Optimiser les boutons d'actions */
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

/* Correction pour les modales */
:deep(.n-modal) {
    max-width: 95vw !important;
    width: auto !important;
}

:deep(.n-modal .n-modal-body) {
    padding: 20px !important;
}

/* Scrollbar personnalisée */
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