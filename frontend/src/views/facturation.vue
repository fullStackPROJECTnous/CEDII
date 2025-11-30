<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation -->
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
              <n-button @click="sendAllPenaltyNotifications" type="warning" size="small" :disabled="locationsEnRetard.length === 0">
                <i class="bi bi-bell me-2"></i>Notifier Retards ({{ locationsEnRetard.length }})
              </n-button>
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
            </div>
          </div>
        </div>
      </div>
    </div>

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
                <h4 class="mb-0 text-danger">{{ locationsEnRetard.length }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        
        <div class="col-md-3 mb-3">
          <n-card class="custom-card-success h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-success me-3">
                <i class="bi bi-check-circle text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Facturées Payées</h6>
                <h4 class="mb-0 text-success">{{ locationsPayeesCount }}</h4>
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
      </div>

      <!-- Nouvelle section Alertes Retards -->
      <div class="row mb-4" v-if="locationsEnRetard.length > 0">
        <div class="col-12">
          <n-alert type="warning">
            <template #icon>
              <i class="bi bi-exclamation-triangle"></i>
            </template>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ locationsEnRetard.length }} location(s) en retard de retour </strong>
                <div class="small">Total des pénalités: {{ totalPenalites }} Ar</div>
              </div>
              <n-button @click="sendAllPenaltyNotifications" type="warning" size="small">
                <i class="bi bi-bell me-1"></i>Notifier tous les clients
              </n-button>
            </div>
          </n-alert>
        </div>
      </div>

      <!-- Tableau des locations à facturer -->
      <n-card class="shadow-lg" title="📍 Locations à Facturer (Confirmées + En Cours + Retard)">
        <template #header-extra>
          <div class="d-flex gap-2">
            <n-button type="info" size="small" @click="fetchAllData">
              <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
            </n-button>
            <n-button type="primary" size="small" @click="facturerTout" :disabled="locationsAFacturerCount === 0">
              <i class="bi bi-receipt me-2"></i>Facturer Tout
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
          <div v-else-if="locationsAFacturerCount === 0" class="text-center p-5">
            <n-empty description="Aucune location à facturer">
              <template #icon>
                <i class="bi bi-receipt" style="font-size: 3rem; color: #55555E;"></i>
              </template>
            </n-empty>
          </div>

          <!-- Data Table avec scroll -->
          <div v-else class="table-container">
            <n-data-table
              :columns="columnsAFacturer"
              :data="tableDataAFacturer"
              :bordered="false"
              class="custom-table"
            />
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
      </n-card> -->
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
import { ref, computed, onMounted, h } from 'vue';
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
  NInput
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

// Variables pour les pénalités
const locationsEnRetard = ref([]);
const totalPenalites = ref('0 Ar');

// Computed properties
const locationsAFacturerCount = computed(() => {
  return confirmedEvents.value.filter(event => 
    event.etatLo === 'Confirmée' || event.etatLo === 'En cours'
  ).length;
});

const locationsPayeesCount = computed(() => {
  return locationsTermineesPayees.value.length;
});

const totalPaye = computed(() => {
  const total = locationsTermineesPayees.value.reduce((sum, location) => {
    return sum + parseFloat(location.montantPaie || 0);
  }, 0);
  return formatTarifAriary(total);
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
        hasEmail: !!clientEmail,
        location: event,
        tarifNumerique: calculateTarif(event),
        joursRetard: joursRetard,
        penalite: formatTarifAriary(penalite),
        estEnRetard: joursRetard > 0
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

// Colonnes pour le tableau À FACTURER
const columnsAFacturer = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted fw-bold' }, `#${row.id}`)
  },
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

// Colonnes pour le tableau TERMINÉES ET PAYÉES
const columnsTerminees = [
  {
    title: 'ID Location',
    key: 'id',
    width: 100,
    render: (row) => h('span', { class: 'text-muted fw-bold' }, `#${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 150
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
      h('div', { class: 'small text-muted' }, 'au ' + row.dateFin)
    ])
  },
  {
    title: 'Facture',
    key: 'facture',
    width: 180,
    render: (row) => h('div', [
      h('div', { class: 'fw-medium text-success' }, row.numeroFacture),
      h('div', { class: 'small text-muted' }, row.dateFacturation)
    ])
  },
  {
    title: 'Statut',
    key: 'statutPaiement',
    width: 120,
    render: (row) => h(NTag, {
      type: 'success',
      size: 'small'
    }, { default: () => 'Payé' })
  },
  {
    title: 'Montant Payé',
    key: 'montantPaye',
    align: 'right',
    width: 130,
    render: (row) => h('strong', { class: 'text-success' }, row.montantPaye)
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 100,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'info',
        onClick: () => telechargerFactureTerminee(row),
        title: 'Télécharger la facture'
      }, {
        default: () => h('i', { class: 'bi bi-download' })
      })
    ])
  }
];

// Méthodes principales
const fetchAllData = async () => {
  loadingEvents.value = true;
  try {
    await Promise.all([
      fetchConfirmedEvents(),
      fetchLocationsTermineesPayees(),
      loadLocationsEnRetard()
    ]);
    await loadStats();
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
    // Filtrer seulement les locations avec paiement EFFECTUÉ
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

const loadLocationsEnRetard = async () => {
  try {
    const response = await FinanceService.calculatePenalties();
    locationsEnRetard.value = response.data;
    
    const total = locationsEnRetard.value.reduce((sum, location) => {
      return sum + (location.penalite || 0);
    }, 0);
    totalPenalites.value = formatTarifAriary(total);
    
    console.log('✅ Locations en retard chargées:', locationsEnRetard.value.length);
  } catch (error) {
    console.error('❌ Erreur chargement locations en retard:', error);
  }
};

const sendAllPenaltyNotifications = async () => {
  if (locationsEnRetard.value.length === 0) {
    alert('Aucune location en retard à notifier.');
    return;
  }
  
  if (!confirm(`Voulez-vous envoyer des notifications de pénalité à ${locationsEnRetard.value.length} client(s) ?`)) {
    return;
  }
  
  try {
    const response = await FinanceService.sendPenaltyNotifications();
    alert(response.data.message);
    await loadLocationsEnRetard();
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

const marquerLocationTerminee = async (locationId) => {
  try {
    const response = await LocationService.updateLocationStatus(locationId, 'Terminée');
    console.log(`✅ Location ${locationId} marquée comme terminée`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erreur mise à jour statut location ${locationId}:`, error);
    throw error;
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
      
      await marquerLocationTerminee(selectedLocation.value.id);
      await fetchAllData(); // Recharger toutes les données
      
      showConfirmModal.value = false;
      selectedLocation.value = null;
      emailForm.value.email = '';
      
      alert(`✅ Facture créée et envoyée avec succès à ${emailFinal}. Location marquée comme terminée.`);
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

const facturerTout = async () => {
  const locationsAvecEmail = tableDataAFacturer.value.filter(item => item.hasEmail);
  
  if (locationsAvecEmail.length === 0) {
    alert('Aucune location avec email renseigné pour la facturation groupée.');
    return;
  }
  
  if (!confirm(`Voulez-vous facturer ${locationsAvecEmail.length} location(s) et les marquer comme terminées ?`)) {
    return;
  }
  
  isSending.value = true;
  
  try {
    let succes = 0;
    let echecs = 0;
    
    for (const location of locationsAvecEmail) {
      try {
        const payload = {
          locationId: location.id,
          clientEmail: location.email
        };
        
        await FinanceService.createAndSendInvoice(payload);
        await marquerLocationTerminee(location.id);
        succes++;
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Erreur location ${location.id}:`, error);
        echecs++;
      }
    }
    
    await fetchAllData();
    alert(`✅ Facturation groupée terminée:\n• ${succes} succès\n• ${echecs} échecs\n• Locations marquées comme terminées`);
    
  } catch (error) {
    console.error('Erreur facturation groupée:', error);
    alert('Erreur lors de la facturation groupée.');
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

// CORRECTION : Une seule déclaration de telechargerFactureTerminee
const telechargerFactureTerminee = async (location) => {
  try {
    console.log('📍 Téléchargement facture terminée:', location.id);
    
    // Utiliser la NOUVELLE méthode pour les factures payées
    const response = await FinanceService.downloadPaidInvoice(location.id);

    // Vérifier que la réponse contient des données
    if (!response.data || response.data.size === 0) {
      throw new Error('Le fichier PDF est vide');
    }

    // Vérifier le type MIME
    const contentType = response.headers['content-type'];
    if (contentType !== 'application/pdf') {
      console.warn('⚠️ Type MIME inattendu, tentative de traitement PDF...');
    }

    // Créer le blob
    const blob = new Blob([response.data], { 
      type: 'application/pdf' 
    });

    // Vérifier la taille
    if (blob.size === 0) {
      throw new Error('Fichier PDF corrompu');
    }

    // Créer l'URL et télécharger
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${location.id}-${new Date().toISOString().split('T')[0]}.pdf`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Nettoyer après téléchargement
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    console.log('✅ Facture payée téléchargée avec succès');

  } catch (error) {
    console.error('❌ Erreur détaillée téléchargement facture terminée:', error);
    
    let message = 'Erreur lors du téléchargement de la facture';
    
    if (error.response) {
      switch (error.response.status) {
        case 404:
          message = 'Facture non trouvée pour cette location';
          break;
        case 500:
          message = 'Erreur serveur lors de la génération du PDF';
          break;
        default:
          message = `Erreur serveur (${error.response.status})`;
      }
    } else if (error.message) {
      message = error.message;
    }
    
    // Utiliser le système de notification
    window.$message?.error(message);
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

const exporterFactures = async () => {
  try {
    const response = await FinanceService.exportInvoices();
    
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factures-cedii-${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur export factures:', error);
    alert('Erreur lors de l\'export des factures');
  }
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
</style>