<!--<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation 
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
                <i class="bi bi-graph-up-arrow me-2"></i>
                Gestion Financière
              </h1>
              <p class="custom-subtitle">Tableau de bord financier et gestion des facturations</p>
            </div>
            <div class="d-flex gap-2">
              <n-button @click="sendAllPenaltyNotifications" type="warning" size="small" :disabled="locationsEnRetardUnifiees.length === 0">
                <i class="bi bi-bell me-2"></i>Notifier Retards ({{ locationsEnRetardUnifiees.length }})
              </n-button>
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENU AVEC SCROLL 
    <div class="content-wrapper">
      <!-- Cartes de statistiques améliorées 
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
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
        
        <div class="col-md-3 mb-3">
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
        
        <!-- SUPPRIMÉ : KPI Facturées Payées 

        <div class="col-md-3 mb-3">
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

        <!-- NOUVEAU : KPI Factures Envoyées
        <div class="col-md-3 mb-3">
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

      <!-- Nouvelle section Alertes Retards
      <div class="row mb-4" v-if="locationsEnRetardUnifiees.length > 0">
        <div class="col-12">
          <n-alert type="warning">
            <template #icon>
              <i class="bi bi-exclamation-triangle"></i>
            </template>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ locationsEnRetardUnifiees.length }} location(s) en retard de retour </strong>
                <div class="small">Total des pénalités: {{ totalPenalitesCalcule }}</div>
              </div>
              <n-button @click="sendAllPenaltyNotifications" type="warning" size="small">
                <i class="bi bi-bell me-1"></i>Notifier tous les clients
              </n-button>
            </div>
          </n-alert>
        </div>
      </div>

      <!-- Tableau des locations à facturer 
      <n-card class="shadow-lg" title="📍 Locations à Facturer">
        <template #header-extra>
          <div class="d-flex gap-2">
            <!-- AJOUT : Filtres 
            <div class="d-flex gap-2">
              <!-- Filtre par statut 
              <n-select
                v-model:value="filtreStatut"
                :options="optionsStatut"
                placeholder="Filtrer par statut"
                style="width: 150px"
                clearable
              />
              
              <!-- Filtre par date début 
              <n-date-picker
                v-model:value="filtreDateDebut"
                type="date"
                placeholder="Date début"
                style="width: 150px"
                clearable
              />
              
              <!-- Filtre par date fin 
              <n-date-picker
                v-model:value="filtreDateFin"
                type="date"
                placeholder="Date fin"
                style="width: 150px"
                clearable
              />
              
              <!-- Recherche par client 
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
              
              <!-- Bouton pour effacer les filtres 
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

        <div class="card-body">
          <!-- Loading State 
          <div v-if="loadingEvents" class="text-center p-5">
            <n-spin size="large">
              <template #description>
                Chargement des locations...
              </template>
            </n-spin>
          </div>

          <!-- Empty State 
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

          <!-- Data Table avec scroll
          <div v-else class="table-container">
            <n-data-table
              :columns="columnsAFacturer"
              :data="tableDataFiltree"
              :bordered="false"
              class="custom-table"
            />
            
            <!-- Info sur le filtrage 
            <div v-if="filtresActifs" class="mt-3 text-muted small">
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

      <!-- Section Locations Terminées et Payées 
      <n-card class="shadow-lg mt-4" title="💰 Historique des Locations Terminées et Payées">
        <template #header-extra>
          <n-tag type="success" size="small">
            <i class="bi bi-cash-coin me-1"></i>
            Total Payé: {{ totalPaye }}
          </n-tag>
        </template>

        <div class="card-body">
          <div v-if="loadingTerminated" class="text-center p-3">
            <n-spin size="small">
              <template #description>
                Chargement de l'historique...
              </template>
            </n-spin>
          </div>

          <div v-else-if="locationsTermineesPayees.length === 0" class="text-center p-4">
            <n-empty description="Aucune location payée dans l'historique">
              <template #icon>
                <i class="bi bi-wallet2" style="font-size: 2rem; color: #28a745;"></i>
              </template>
            </n-empty>
          </div>

          <div v-else class="table-container">
            <n-data-table
              :columns="columnsTerminees"
              :data="tableDataTerminees"
              :bordered="false"
              class="custom-table"
            />
          </div>
        </div>
      </n-card> 
    </div>

    <!-- Modal de confirmation de facturation 
    <n-modal v-model:show="showConfirmModal" preset="dialog" :mask-closable="false">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-receipt me-2 text-primary"></i>
          <span>Créer et Envoyer la Facture</span>
        </div>
      </template>
      
      <div v-if="selectedLocation" class="facture-preview">
        <n-alert type="info" class="mb-3">
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

        <n-alert type="warning" v-if="!selectedLocation.email">
          <template #icon>
            <i class="bi bi-exclamation-triangle"></i>
          </template>
          Aucun email renseigné pour ce client. Veuillez saisir une adresse email pour envoyer la facture.
        </n-alert>
      </div>
      
      <template #action>
        <div class="d-flex gap-2 justify-content-end">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NCard, 
  NButton, 
  NSpin, 
  NEmpty, 
  NDataTable,
  NAlert,
  NTag,
  NModal,
  NDropdown,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NDatePicker
} from 'naive-ui';
import LocationService from '../services/LocationService';
import FinanceService from '../services/FinanceService';

const router = useRouter();

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Suivi des paiements',
    key: 'suiviPaie',
    icon: () => h('i', { class: 'bi-cash-stack' })
  },
  {
    label: 'Penalités et Litiges',
    key: 'penaliteLiti',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
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
    'suiviPaie': '/suivi',
    'penaliteLiti': '/penalite',
    'syntheseRapp': '/synthese'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

// Variables réactives
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

// NOUVEAUX : Variables pour les filtres
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

// Computed properties
const locationsAFacturerCount = computed(() => {
  return confirmedEvents.value.filter(event => 
    event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
  ).length;
});

// SUPPRIMÉ : locationsPayeesCount

const totalPaye = computed(() => {
  const total = locationsTermineesPayees.value.reduce((sum, location) => {
    return sum + parseFloat(location.montantPaie || 0);
  }, 0);
  return formatTarifAriary(total);
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

// NOUVEAU : Vérifier si des filtres sont actifs
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

// NOUVEAU : Tableau filtré selon les critères
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

// Colonnes pour le tableau À FACTURER
const columnsAFacturer = [
  {
    title: 'Client',
    key: 'client',
    render: (row) => h('div', [
      h('div', { class: 'fw-medium' }, row.client),
      h('div', { 
        class: `small ${row.hasEmail ? 'text-success' : 'text-danger'}` 
      }, row.hasEmail ? '✓ Email renseigné' : '✗ Email manquant')
    ])
  },
  {
    title: 'Type',
    key: 'type',
    width: 120,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      bordered: false
    }, { default: () => row.type })
  },
  {
    title: 'Période',
    key: 'periode',
    width: 250,
    render: (row) => h('div', [
      h('div', { class: 'small text-muted' }, 'Début: ' + row.dateDebut),
      h('div', { class: 'small text-muted' }, 'Fin: ' + row.dateFin),
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
      row.estEnRetard ? h('div', { class: 'small text-warning' }, `+${row.penalite} pénalité`) : null
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
    width: 200,
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

// SUPPRIMÉ : Colonnes pour le tableau TERMINÉES ET PAYÉES (car section commentée)

// Méthodes principales
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

// NOUVELLE : Méthode pour effacer tous les filtres
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
  fetchAllData();
});
</script>

<style scoped>
/* Styles existants conservés */
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

.content-wrapper {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

.content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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

.custom-card-success {
  background: linear-gradient(135deg, #5e5e5e 0%, #5e5e5e 100%);
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
}

.custom-icon-primary { background: rgba(255, 255, 255, 0.2); }
.custom-icon-danger { background: rgba(255, 255, 255, 0.2); }
.custom-icon-success { background: rgba(255, 255, 255, 0.2); }
.custom-icon-warning { background: rgba(255, 255, 255, 0.2); }

.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.facture-preview {
  max-height: 60vh;
  overflow-y: auto;
}

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
  
  .content-wrapper {
    max-height: none;
    overflow-y: visible;
  }
  
  .table-container {
    max-height: 400px;
  }
  
  /* Responsive pour les filtres */
  .card-body .d-flex.gap-2 {
    flex-wrap: wrap;
  }
  
  .card-body .d-flex.gap-2 > * {
    margin-bottom: 0.5rem;
  }
  
  .card-body .d-flex.gap-2 .n-input,
  .card-body .d-flex.gap-2 .n-select,
  .card-body .d-flex.gap-2 .n-date-picker {
    width: 100% !important;
  }
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

/* Styles pour les filtres */
.n-select, .n-date-picker, .n-input {
  font-size: 0.9rem;
}

/* Indicateur de filtres actifs */
:deep(.n-empty__description) {
  font-size: 1rem;
  color: #666;
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

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light">
          <!-- Alerte Litiges - Barre bleue en bas supprimée -->
          <n-alert 
            v-if="litigeCount > 0"
            type="error"
            title="ATTENTION"
            class="mb-4 shadow-sm custom-alert"
          >
            <template #icon>
              <i class="bi bi-exclamation-triangle-fill"></i>
            </template>
            <strong>{{ litigeCount }}</strong> dossiers de pénalités ou dégradations requièrent votre action. Traitez-les pour déclencher les calculs de jours de retard.
          </n-alert>

          <div class="container-fluid py-4">
            <!-- CONTENU AVEC SCROLL -->
            <div class="content-wrapper">
              <!-- Cartes de statistiques améliorées -->
              <div class="row mb-4">
                <div class="col-md-3 mb-3">
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
                
                <div class="col-md-3 mb-3">
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

                <div class="col-md-3 mb-3">
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
                <div class="col-md-3 mb-3">
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
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{{ locationsEnRetardUnifiees.length }} location(s) en retard de retour </strong>
                        <div class="small">Total des pénalités: {{ totalPenalitesCalcule }}</div>
                      </div>
                      <n-button @click="sendAllPenaltyNotifications" type="warning" size="small">
                        <i class="bi bi-bell me-1"></i>Notifier tous les clients
                      </n-button>
                    </div>
                  </n-alert>
                </div>
              </div>

              <!-- Tableau des locations à facturer -->
              <n-card class="shadow-lg" title="📍 Locations à Facturer">
                <template #header-extra>
                  <div class="d-flex gap-2">
                    <!-- AJOUT : Filtres -->
                    <div class="d-flex gap-2">
                      <!-- Filtre par statut -->
                      <n-select
                        v-model:value="filtreStatut"
                        :options="optionsStatut"
                        placeholder="Filtrer par statut"
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

                <div class="card-body">
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

                  <!-- Data Table avec scroll -->
                  <div v-else class="table-container">
                    <n-data-table
                      :columns="columnsAFacturer"
                      :data="tableDataFiltree"
                      :bordered="false"
                      class="custom-table"
                    />
                    
                    <!-- Info sur le filtrage -->
                    <div v-if="filtresActifs" class="mt-3 text-muted small">
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
                <div class="d-flex gap-2 justify-content-end">
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
          </div>
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
        render: (row) => h('div', [
            h('div', { class: 'fw-medium' }, row.client),
            h('div', { 
                class: `small ${row.hasEmail ? 'text-success' : 'text-danger'}` 
            }, row.hasEmail ? '✓ Email renseigné' : '✗ Email manquant')
        ])
    },
    {
        title: 'Type',
        key: 'type',
        width: 120,
        render: (row) => h(NTag, { 
            type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
            size: 'small',
            bordered: false
        }, { default: () => row.type })
    },
    {
        title: 'Période',
        key: 'periode',
        width: 250,
        render: (row) => h('div', [
            h('div', { class: 'small text-muted' }, 'Début: ' + row.dateDebut),
            h('div', { class: 'small text-muted' }, 'Fin: ' + row.dateFin),
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
            row.estEnRetard ? h('div', { class: 'small text-warning' }, `+${row.penalite} pénalité`) : null
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
        width: 200,
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
    padding: 1rem 1.5rem !important;
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

/* Contenu principal */
.content-wrapper {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
    padding-right: 5px;
}

.content-wrapper::-webkit-scrollbar {
    width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

.table-container {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
}

.table-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.table-container::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
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

.facture-preview {
    max-height: 60vh;
    overflow-y: auto;
}

/* Responsive */
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
    }
    
    .custom-subtitle {
        font-size: 1.2rem;
    }
    
    .custom-description {
        font-size: 0.85rem;
    }
    
    .content-wrapper {
        max-height: calc(100vh - 320px);
    }
    
    .table-container {
        max-height: 400px;
    }
    
    .col-md-3 {
        width: 50%;
    }
    
    /* Responsive pour les filtres */
    .card-body .d-flex.gap-2 {
        flex-wrap: wrap;
    }
    
    .card-body .d-flex.gap-2 > * {
        margin-bottom: 0.5rem;
    }
    
    .card-body .d-flex.gap-2 .n-input,
    .card-body .d-flex.gap-2 .n-select,
    .card-body .d-flex.gap-2 .n-date-picker {
        width: 100% !important;
    }
}

@media (max-width: 768px) {
    .col-md-3 {
        width: 100%;
    }
    
    .custom-subtitle {
        font-size: 1.1rem;
    }
    
    .content-wrapper {
        max-height: calc(100vh - 350px);
    }
}

@media (min-width: 1200px) {
    .content-wrapper {
        max-height: calc(100vh - 280px);
    }
}
</style>