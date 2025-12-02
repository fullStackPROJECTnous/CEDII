<template>
  <div class="finance-management-container">
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
                <i class="bi bi-cash-coin me-2"></i>
                Gestion Financière & Suivi des Locations
              </h1>
              <p class="custom-subtitle">Suivez les paiements, pénalités et états financiers des locations</p>
            </div>
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

    <!-- Message d'erreur -->
    <n-alert v-if="apiError" type="error" class="mb-4">
      <template #icon>
        <n-icon>⚠️</n-icon>
      </template>
      {{ errorMessage }}
    </n-alert>

    <!-- Cartes de statistiques -->
    <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Chiffre d'Affaires" :value="stats.chiffreAffaires || '0'">
            <template #suffix> MGA</template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Locations Actives" :value="stats.locationsActives || 0" class="text-info">
            <template #prefix>📊</template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="Paiements Validés" :value="stats.paiementsValides || 0" class="text-success">
            <template #prefix>✅</template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card class="custom-card">
          <n-statistic label="En Attente" :value="stats.enAttente || 0" class="text-warning">
            <template #prefix>⏳</template>
          </n-statistic>
        </n-card>
      </n-gi>
    </n-grid>

    <!-- Tableau principal -->
    <n-card class="custom-card">
      <template #header>
        <n-space justify="space-between" align="center">
          <n-h4 class="mb-0">Suivi Financier des Locations</n-h4>
          <n-button 
            type="primary" 
            size="small" 
            @click="fetchLocationsSuivi"
            :loading="loading"
            class="custom-btn-primary"
          >
            🔄 Actualiser
          </n-button>
        </n-space>
      </template>

      <n-data-table
        :columns="columns"
        :data="locationsData"
        :loading="loading"
        :bordered="false"
        striped
        :row-class-name="getRowClass"
        class="custom-table"
      />
    </n-card>

    <!-- Modal de paiement -->
    <n-modal
      v-model:show="showPaiementModal"
      preset="card"
      title="Enregistrement de Paiement"
      style="width: 500px"
    >
      <div v-if="selectedLocation">
        <n-space vertical size="large">
          <!-- Informations de la location -->
          <n-card size="small">
            <n-space vertical>
              <n-text strong>Location #{{ selectedLocation.idLo }}</n-text>
              <n-text depth="3">Client: {{ getClientName(selectedLocation) }}</n-text>
              <n-text depth="3">Période: {{ formatDate(selectedLocation.debLo) }} - {{ formatDate(selectedLocation.finLo) }}</n-text>
            </n-space>
          </n-card>

          <!-- Détails financiers -->
          <n-descriptions label-placement="left" bordered size="small">
            <n-descriptions-item label="Tarif Total">
              <n-text strong>{{ formatCurrency(selectedLocation.tarifTot) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="Statut Location">
              <n-tag :type="getLocationStatusType(selectedLocation.etatLo)" class="custom-tag">
                {{ selectedLocation.etatLo }}
              </n-tag>
            </n-descriptions-item>
          </n-descriptions>

          <!-- Formulaire de paiement -->
          <n-space vertical>
            <n-input-number
              v-model:value="paiementMontant"
              :min="0"
              :max="selectedLocation.tarifTot"
              :precision="2"
              placeholder="Montant payé"
              clearable
              style="width: 100%"
            />
            
            <n-select
              v-model:value="paiementMode"
              :options="modePaieOptions"
              placeholder="Mode de paiement"
            />

            <n-input
              v-model:value="paiementNotes"
              type="textarea"
              placeholder="Notes (optionnel)"
              :rows="2"
            />
          </n-space>

          <!-- Actions -->
          <n-space justify="end">
            <n-button @click="closePaiementModal" class="custom-btn-outline">
              Annuler
            </n-button>
            <n-button 
              type="primary" 
              @click="handlePaiementSubmit"
              :loading="submitting"
              :disabled="!paiementMontant || !paiementMode"
              class="custom-btn-primary"
            >
              Enregistrer le Paiement
            </n-button>
          </n-space>
        </n-space>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, h, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  NH2,
  NText,
  NSpace,
  NButton,
  NCard,
  NDataTable,
  NTag,
  NBadge,
  NGrid,
  NGi,
  NStatistic,
  NModal,
  NAlert,
  NInputNumber,
  NSelect,
  NInput,
  NDescriptions,
  NDescriptionsItem
} from 'naive-ui';
import FinanceService from '../services/FinanceService';


const router = useRouter();

// Options du menu de navigation
const navigationOptions = [

  {
    label: 'Fiches Clients',
    key: 'client',
    icon: () => h('i', { class: 'bi bi-people me-2' })
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
    label: 'Location & Reservation',
    key: 'location',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
  },
  {
    label: 'Suivi & Rapports',
    key: 'rapport',
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
    'dashboard': '/dashboardAdmin',
    'location': '/location',
    'rapport': '/rapport',
    'calendrier': '/location',
    'inventaire': '/patrimoine1',
    'client': 'clientManagementAdmin',
    'bureau': '/materielBureauView'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};


const locationsData = ref([]);
const loading = ref(false);
const apiError = ref(false);
const errorMessage = ref('');
const showPaiementModal = ref(false);
const selectedLocation = ref(null);
const submitting = ref(false);
const paiementMontant = ref(null);
const paiementMode = ref(null);
const paiementNotes = ref('');

const modePaieOptions = [
  { label: '💵 Cash', value: 'Cash' },
  { label: '🏦 Virement', value: 'Virement' },
];

// --- Statistiques calculées ---
const stats = computed(() => {
  const data = locationsData.value || [];
  const totalCA = data.reduce((sum, item) => sum + (parseFloat(item.tarifTot) || 0), 0);
  const locationsActives = data.filter(item => 
    item.etatLo === 'Confirmée' || item.etatLo === 'En attente'
  ).length;
  const paiementsValides = data.filter(item => 
    item.Paiements && item.Paiements.some(p => p.statutPaie === 'Effectué')
  ).length;
  const enAttente = data.filter(item => 
    !item.Paiements || item.Paiements.every(p => p.statutPaie !== 'Effectué')
  ).length;

  return {
    chiffreAffaires: totalCA.toLocaleString('fr-MG'),
    locationsActives,
    paiementsValides,
    enAttente
  };
});

// --- Colonnes du tableau ---
const columns = [
  {
    title: 'ID Location',
    key: 'idLo',
    width: 100,
    render: (row) => h('span', { class: 'text-mono' }, `#${row.idLo}`)
  },
  {
    title: 'Client',
    key: 'client',
    width: 150,
    render: (row) => {
      const clientName = getClientName(row);
      return h('span', clientName);
    }
  },
  {
    title: 'Type',
    key: 'typeLo',
    width: 100,
    render: (row) => {
      const typeConfig = {
        'Salle': { type: 'info', color: '#067186' },
        'Materiel': { type: 'success', color: '#04058F' },
        'Mixte': { type: 'warning', color: '#5811EE' }
      };
      const config = typeConfig[row.typeLo] || { type: 'default' };
      return h(NTag, { 
        type: config.type,
        style: { backgroundColor: config.color, color: 'white' }
      }, { default: () => row.typeLo });
    }
  },
  {
    title: 'Période',
    key: 'period',
    width: 200,
    render: (row) => h('div', [
      h('div', { class: 'small' }, formatDate(row.debLo)),
      h('div', { class: 'small text-muted' }, 'au'),
      h('div', { class: 'small' }, formatDate(row.finLo))
    ])
  },
  {
    title: 'Tarif Total',
    key: 'tarifTot',
    width: 130,
    align: 'right',
    render: (row) => h('span', { 
      class: 'fw-bold',
      style: { color: '#5811EE' }
    }, formatCurrency(row.tarifTot))
  },
  {
    title: 'Statut Location',
    key: 'etatLo',
    width: 120,
    render: (row) => {
      const statusConfig = {
        'Confirmée': { type: 'success' },
        'En attente': { type: 'warning' },
        'Annulée': { type: 'error' },
        'Terminée': { type: 'default' }
      };
      const config = statusConfig[row.etatLo] || { type: 'info' };
      return h(NTag, { type: config.type }, { default: () => row.etatLo });
    }
  },
  {
    title: 'Paiements',
    key: 'paiements',
    width: 150,
    render: (row) => {
      if (!row.Paiements || row.Paiements.length === 0) {
        return h(NTag, { type: 'warning' }, { default: () => 'Aucun' });
      }
      
      const paiementEffectue = row.Paiements.find(p => p.statutPaie === 'Effectué');
      if (paiementEffectue) {
        return h('div', [
          h(NTag, { type: 'success', size: 'small' }, { default: () => 'Payé' }),
          h('div', { class: 'small text-muted' }, formatCurrency(paiementEffectue.montantPaie))
        ]);
      }
      
      return h(NTag, { type: 'info' }, { default: () => 'En attente' });
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render: (row) => {
      const hasPaiement = row.Paiements && row.Paiements.some(p => p.statutPaie === 'Effectué');
      
      return h(NButton, {
        size: 'small',
        type: hasPaiement ? 'default' : 'primary',
        onClick: () => openPaiementModal(row),
        disabled: row.etatLo === 'Annulée'
      }, { default: () => hasPaiement ? 'Voir' : 'Payer' });
    }
  }
];

// --- Chargement des données ---
const fetchLocationsSuivi = async () => {
  loading.value = true;
  apiError.value = false;
  errorMessage.value = '';
  
  try {
    console.log('Chargement des données financières...');
    
    let response;
    try {
      response = await FinanceService.getLocationsWithPayments();
    } catch (error) {
      console.log('Méthode getLocationsWithPayments non disponible, tentative avec getPaymentData...');
      response = await FinanceService.getPaymentData();
    }
    
    if (response && response.data) {
      locationsData.value = Array.isArray(response.data) ? response.data : [];
      console.log('Données chargées:', locationsData.value.length, 'locations');
    } else {
      locationsData.value = [];
      console.log('Aucune donnée reçue');
    }
    
  } catch (error) {
    console.error('Erreur de chargement du suivi financier:', error);
    apiError.value = true;
    errorMessage.value = `Erreur de chargement: ${error.message}`;
    locationsData.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLocationsSuivi();
});

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0,00 MGA';
  return `${value.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
  if (!datetime) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(datetime).toLocaleDateString('fr-FR', options);
};

const getClientName = (location) => {
  try {
    if (location.Client) {
      return `${location.Client.nomCli} ${location.Client.prenomCli || ''}`.trim();
    }
    if (location.Reservation && location.Reservation.Client) {
      return `${location.Reservation.Client.nomCli} ${location.Reservation.Client.prenomCli || ''}`.trim();
    }
    return 'Client non spécifié';
  } catch (e) {
    console.error('Erreur getClientName:', e);
    return 'N/A';
  }
};

const getLocationStatusType = (status) => {
  const statusConfig = {
    'Confirmée': 'success',
    'En attente': 'warning',
    'Annulée': 'error',
    'Terminée': 'default'
  };
  return statusConfig[status] || 'info';
};

const getRowClass = (row) => {
  if (row.etatLo === 'Annulée') return 'row-annulee';
  if (row.etatLo === 'Terminée') return 'row-terminee';
  return '';
};

// --- Fonctions d'action ---
const openPaiementModal = (location) => {
  selectedLocation.value = location;
  paiementMontant.value = location.tarifTot;
  paiementMode.value = null;
  paiementNotes.value = '';
  showPaiementModal.value = true;
};

const closePaiementModal = () => {
  showPaiementModal.value = false;
  selectedLocation.value = null;
  paiementMontant.value = null;
  paiementMode.value = null;
  paiementNotes.value = '';
};

const handlePaiementSubmit = async () => {
  if (!selectedLocation.value) return;
  
  submitting.value = true;
  try {
    const paiementData = {
      montantPaye: paiementMontant.value,
      modePaie: paiementMode.value,
      notes: paiementNotes.value,
      libellePaie: `Paiement location #${selectedLocation.value.idLo}`
    };

    await FinanceService.recordPaiement(selectedLocation.value.idLo, paiementData);
    
    alert("Paiement enregistré avec succès!");
    closePaiementModal();
    fetchLocationsSuivi();
    
  } catch (error) {
    console.error('Erreur lors du paiement:', error);
    const errorMsg = error.response?.data?.message || error.message || 'Erreur inconnue';
    alert(`Erreur lors de l'enregistrement du paiement: ${errorMsg}`);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.finance-management-container {
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
  cursor: pointer;
}

.text-mono {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

:deep(.n-data-table) {
  border-radius: 8px;
}

:deep(.n-button) {
  border-radius: 6px;
}

:deep(.row-annulee) {
  background-color: rgba(108, 117, 125, 0.1) !important;
  color: #6c757d;
}

:deep(.row-terminee) {
  background-color: rgba(92, 184, 92, 0.1) !important;
}

:deep(.n-statistic .n-statistic-value) {
  font-weight: 600;
}

.text-success {
  color: #5cb85c !important;
}

.text-warning {
  color: #f0ad4e !important;
}

.text-info {
  color: #067186 !important;
}

.small {
  font-size: 0.875em;
}

/* Responsive */
@media (max-width: 768px) {
  .finance-management-container {
    padding: 12px;
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

@media (max-width: 576px) {
  .custom-table {
    font-size: 0.8rem;
  }
}
</style>