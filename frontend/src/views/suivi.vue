

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
           <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
        
        <!-- Header -->
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
              <i class="bi bi-cash-coin me-2"></i>
              Suivi des Paiements
            </h2>
            <p class="custom-description">Gestion et suivi des transactions financières</p>
          </div>
          <n-tag type="info" size="small" class="custom-tag">
            Rôle: {{ userRole }}
          </n-tag>
        </n-layout-header>
          <!-- ... votre header existant ... -->
        </n-layout-header>
        

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4 px-0 mx-0">
            <!-- Carte d'alerte pour paiements en attente -->
            <div class="row mb-4">
              <div class="col-12">
                <n-alert type="warning" class="custom-alert">
                  <template #icon>
                    <i class="bi bi-exclamation-triangle"></i>
                  </template>
                  <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong>Paiements en Attente d'Action</strong>
                      <div class="small">
                        Vous avez <strong>{{ filteredPendingPayments.length }} transactions</strong> en attente de validation ou de relance.
                        Montant total : <strong>{{ formatCurrency(totalPendingAmountFiltered) }}</strong>
                      </div>
                    </div>
                    <n-button type="warning" size="small" @click="$router.push({ name: 'FactureGene' })" class="mt-2 mt-md-0">
                      <i class="bi bi-file-earmark-text me-1"></i>Voir les Factures en Retard
                    </n-button>
                  </div>
                </n-alert>
              </div>
            </div>

            <!-- Cartes de statistiques -->
            <div class="row mb-4 g-3">
              <div class="col-md-4 col-6">
                <n-card class="custom-card-warning h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-warning me-3">
                      <i class="bi bi-clock-history text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">En Attente</h6>
                      <h4 class="mb-0 text-warning">{{ filteredPendingPayments.length }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>
              
              <div class="col-md-4 col-6">
                <n-card class="custom-card-success h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-success me-3">
                      <i class="bi bi-check-circle text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">Validés</h6>
                      <h4 class="mb-0 text-success">{{ filteredHistory.length }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>
              
              <div class="col-md-4 col-6">
                <n-card class="custom-card-primary h-100" size="small">
                  <div class="d-flex align-items-center">
                    <div class="custom-icon-primary me-3">
                      <i class="bi bi-currency-exchange text-white"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 text-white">Total En Attente</h6>
                      <h4 class="mb-0 text-info">{{ formatCurrency(totalPendingAmountFiltered) }}</h4>
                    </div>
                  </div>
                </n-card>
              </div>
            </div>

            <!-- Section des transactions en attente -->
            <n-card class="shadow-lg mb-4" title="Transactions en Attente">
              <template #header-extra>
                <n-tag type="warning" round class="custom-tag">{{ filteredPendingPayments.length }} en attente</n-tag>
              </template>
              
              <!-- Barre de recherche pour les transactions en attente -->
              <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <n-space class="flex-grow-1">
                  <!-- Recherche par nom -->
                  <n-input
                    v-model:value="searchPending.nom"
                    placeholder="Rechercher par nom client..."
                    clearable
                    style="min-width: 200px;"
                  >
                    <template #prefix>
                      <i class="bi bi-person text-muted"></i>
                    </template>
                  </n-input>
                  
                  <!-- Recherche par location -->
                  <n-input
                    v-model:value="searchPending.location"
                    placeholder="Rechercher par location..."
                    clearable
                    style="min-width: 200px;"
                  >
                    <template #prefix>
                      <i class="bi bi-geo-alt text-muted"></i>
                    </template>
                  </n-input>
                  
                  <!-- Bouton pour effacer les filtres -->
                  <n-button 
                    v-if="searchPending.nom || searchPending.location" 
                    type="default" 
                    size="small" 
                    @click="searchPending = { nom: '', location: '' }"
                  >
                    Effacer les filtres
                  </n-button>
                </n-space>
              </div>
              
              <!-- Résumé des filtres actifs -->
              <div v-if="searchPending.nom || searchPending.location" class="mb-3">
                <n-tag type="info" size="small" class="me-2">
                  Filtres actifs:
                </n-tag>
                <n-tag v-if="searchPending.nom" type="warning" size="small" closable @close="searchPending.nom = ''" class="me-2">
                  Nom: {{ searchPending.nom }}
                </n-tag>
                <n-tag v-if="searchPending.location" type="warning" size="small" closable @close="searchPending.location = ''">
                  Location: {{ searchPending.location }}
                </n-tag>
              </div>
              
              <div v-if="filteredPendingPayments.length === 0 && !isLoading">
                <n-empty :description="pendingPayments.length === 0 ? 'Aucun paiement en attente. Votre caisse est à jour !' : 'Aucun paiement en attente correspondant aux critères'">
                  <template #icon>
                    <i v-if="pendingPayments.length === 0" class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
                    <i v-else class="bi bi-search" style="font-size: 3rem; color: #6c757d;"></i>
                  </template>
                </n-empty>
              </div>
              
              <div v-else class="table-responsive">
                <n-data-table
                  :columns="pendingColumns"
                  :data="filteredPendingPayments"
                  :loading="isLoading"
                  class="custom-table"
                  :style="{ minWidth: '100%' }"
                />
              </div>
            </n-card>

            <!-- Section de l'historique des transactions -->
            <n-card class="shadow-lg" title="Historique des Transactions ">
              <template #header-extra>
                <n-tag type="info" round class="custom-tag">{{ filteredHistory.length }} validés</n-tag>
              </template>
              
              <p class="text-muted mb-3">Toutes les transactions passées et validées.</p>
              
              <!-- Barre de recherche pour l'historique -->
              <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <n-space class="flex-grow-1 flex-wrap gap-2">
                  <!-- Recherche par nom dans l'historique -->
                  <n-input
                    v-model:value="searchHistory.nom"
                    placeholder="Rechercher par nom client..."
                    clearable
                    style="min-width: 200px;"
                  >
                    <template #prefix>
                      <i class="bi bi-person text-muted"></i>
                    </template>
                  </n-input>
                  
                  <!-- Recherche par date dans l'historique -->
                  <n-date-picker
                    v-model:value="searchHistory.date"
                    type="date"
                    clearable
                    placeholder="Rechercher par date..."
                    style="min-width: 200px;"
                    :value-format="'yyyy-MM-dd'"
                  >
                    <template #prefix>
                      <i class="bi bi-calendar text-muted"></i>
                    </template>
                  </n-date-picker>
                  
                  <!-- Filtre par statut -->
                  <n-select
                    v-model:value="filterStatus"
                    :options="statusOptions"
                    placeholder="Filtrer par statut"
                    clearable
                    style="width: 180px"
                  />
                  
                  <!-- Bouton pour effacer les filtres de l'historique -->
                  <n-button 
                    v-if="searchHistory.nom || searchHistory.date || filterStatus" 
                    type="default" 
                    size="small" 
                    @click="clearHistoryFilters"
                  >
                    Effacer les filtres
                  </n-button>
                </n-space>
              </div>
              
              <!-- Résumé des filtres actifs -->
              <div v-if="searchHistory.nom || searchHistory.date || filterStatus" class="mb-3">
                <n-tag type="info" size="small" class="me-2">
                  Filtres actifs:
                </n-tag>
                <n-tag v-if="searchHistory.nom" type="warning" size="small" closable @close="searchHistory.nom = ''" class="me-2">
                  Nom: {{ searchHistory.nom }}
                </n-tag>
                <n-tag v-if="searchHistory.date" type="warning" size="small" closable @close="searchHistory.date = null">
                  Date: {{ formatDisplayDate(searchHistory.date) }}
                </n-tag>
                <n-tag v-if="filterStatus" type="warning" size="small" closable @close="filterStatus = null" class="me-2">
                  Statut: {{ filterStatus }}
                </n-tag>
              </div>
              
              <div class="table-responsive">
                <n-data-table
                  :columns="historyColumns"
                  :data="filteredHistory"
                  :loading="isLoading"
                  class="custom-table"
                  :style="{ minWidth: '100%' }"
                />
              </div>
              
              <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap">
                <div class="text-muted small mb-2 mb-md-0">
                  Affichage de {{ filteredHistory.length }} sur {{ validatedPayments.length }} transactions
                </div>
                <n-pagination
                  v-model:page="currentPage"
                  :page-count="Math.ceil(filteredHistory.length / pageSize)"
                  :page-slot="5"
                />
              </div>
            </n-card>
          </div>

          <!-- Modal pour les détails de validation -->
          <n-modal
            v-model:show="showValidationModal"
            :mask-closable="false"
            preset="dialog"
            title="Détails du Paiement"
            positive-text="Valider"
            negative-text="Annuler"
            @positive-click="confirmValidation"
            @negative-click="showValidationModal = false"
          >
            <n-form
              ref="validationFormRef"
              :model="validationForm"
              :rules="validationRules"
              label-placement="top"
              class="mt-3"
            >
              <!-- Informations du client -->
              <n-card size="small" class="mb-3" title="Informations Client">
                <div class="row">
                  <div class="col-6">
                    <n-form-item label="Nom" path="clientName">
                      <n-input
                        v-model:value="validationForm.clientName"
                        placeholder="Nom du client"
                        disabled
                      />
                    </n-form-item>
                  </div>
                  <div class="col-6">
                    <n-form-item label="Prénom" path="clientFirstName">
                      <n-input
                        v-model:value="validationForm.clientFirstName"
                        placeholder="Prénom du client"
                        disabled
                      />
                    </n-form-item>
                  </div>
                </div>
                <div class="row">
                 
                </div>
              </n-card>

              <!-- Détails de la transaction -->
              <n-card size="small" class="mb-3" title="Détails de la Transaction">
                <div class="row">
                  <div class="col-6">
                    <n-form-item label="N° Facture" path="invoiceNumber">
                      <n-input
                        v-model:value="validationForm.invoiceNumber"
                        placeholder="Numéro de facture"
                        disabled
                      />
                    </n-form-item>
                  </div>
                  <div class="col-6">
                    <n-form-item label="Montant" path="amount">
                      <n-input
                        v-model:value="validationForm.amount"
                        placeholder="Montant"
                        disabled
                      >
                        <template #prefix>
                          <span class="text-success">MGA</span>
                        </template>
                      </n-input>
                    </n-form-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <n-form-item label="Location" path="locationId">
                      <n-input
                        v-model:value="validationForm.locationId"
                        placeholder="ID Location"
                        disabled
                      />
                    </n-form-item>
                  </div>
                </div>
              </n-card>

              <!-- Mode de paiement -->
              <n-card size="small" class="mb-3" title="Mode de Paiement">
                <div class="row">
                  <div class="col-12">
                    <n-form-item label="Mode de paiement" path="paymentMethod" required>
                      <n-select
                        v-model:value="validationForm.paymentMethod"
                        :options="paymentMethodOptions"
                        placeholder="Sélectionnez le mode de paiement"
                        @update:value="handlePaymentMethodChange"
                      />
                    </n-form-item>
                  </div>
                </div>

                <!-- Champs spécifiques selon le mode de paiement -->
                <div v-if="validationForm.paymentMethod === 'mobile_money'" class="row mt-2">
                  <div class="col-12 mb-2">
                    <n-form-item label="Nom de l'envoyeur" path="senderName" required>
                      <n-input
                        v-model:value="validationForm.senderName"
                        placeholder="Nom complet de la personne qui envoie"
                      />
                    </n-form-item>
                  </div>
                  <div class="col-12">
                    <n-form-item label="ID de référence" path="referenceId" required>
                      <n-input
                        v-model:value="validationForm.referenceId"
                        placeholder="Réference de transaction (ex: 123456789)"
                      />
                    </n-form-item>
                  </div>
                </div>

                <div v-if="validationForm.paymentMethod === 'cheque'" class="row mt-2">
                  <div class="col-12">
                    <n-form-item label="Référence du chèque" path="referenceId" required>
                      <n-input
                        v-model:value="validationForm.referenceId"
                        placeholder="Numéro de chèque"
                      />
                    </n-form-item>
                  </div>
                </div>

                <div v-if="validationForm.paymentMethod === 'cash'" class="row mt-2">
                  <div class="col-12">
                    <n-alert type="info" class="mb-0 custom-alert">
                      <template #icon>
                        <i class="bi bi-info-circle"></i>
                      </template>
                      <div class="small">
                        Paiement en espèces confirmé. Veuillez vous assurer que le montant a été reçu en main propre.
                      </div>
                    </n-alert>
                  </div>
                </div>
              </n-card>

              <!-- Notes additionnelles -->
              <n-card size="small" title="Notes">
                <div class="row">
                  <div class="col-12">
                    <n-form-item label="Remarques (optionnel)" path="notes">
                      <n-input
                        v-model:value="validationForm.notes"
                        type="textarea"
                        placeholder="Ajoutez des remarques sur ce paiement..."
                        :rows="3"
                      />
                    </n-form-item>
                  </div>
                </div>
              </n-card>
            </n-form>
          </n-modal>

          <!-- Modal pour voir les détails de la transaction -->
          <n-modal
            v-model:show="showDetailsModal"
            preset="dialog"
            title="Détails Complets de la Transaction"
            positive-text="Fermer"
            @positive-click="showDetailsModal = false"
          >
            <n-card size="small" class="mb-3" title="Informations Client">
              <n-descriptions
                label-placement="left"
                bordered
                column="1"
                size="small"
              >
                <n-descriptions-item label="Nom complet">
                  {{ transactionDetails.clientName }} {{ transactionDetails.clientFirstName }}
                </n-descriptions-item>
                
                <n-descriptions-item label="Email">
                  {{ transactionDetails.clientEmail || 'Non renseigné' }}
                </n-descriptions-item>
              </n-descriptions>
            </n-card>

            <n-card size="small" class="mb-3" title="Détails Transaction">
              <n-descriptions
                label-placement="left"
                bordered
                column="1"
                size="small"
              >
                <n-descriptions-item label="N° Facture">
                  {{ transactionDetails.invoiceNumber }}
                </n-descriptions-item>
                <n-descriptions-item label="Montant">
                  <span class="text-success">{{ formatCurrency(transactionDetails.amount) }}</span>
                </n-descriptions-item>
                <n-descriptions-item label="Date">
                  {{ formatDate(transactionDetails.transactionDate) }}
                </n-descriptions-item>
                <n-descriptions-item label="Location">
                  LO-{{ transactionDetails.locationId }}
                </n-descriptions-item>
              </n-descriptions>
            </n-card>

            <n-card size="small" class="mb-3" title="Mode de Paiement">
              <n-descriptions
                label-placement="left"
                bordered
                column="1"
                size="small"
              >
                <n-descriptions-item label="Méthode">
                  <n-tag :type="getPaymentMethodTagType(transactionDetails.paymentMethod)">
                    {{ getPaymentMethodLabel(transactionDetails.paymentMethod) }}
                  </n-tag>
                </n-descriptions-item>
                
                <n-descriptions-item 
                  v-if="transactionDetails.paymentMethod === 'mobile_money' || transactionDetails.paymentMethod === 'cheque'" 
                  label="ID Référence"
                >
                  {{ transactionDetails.referenceId || 'Non renseigné' }}
                </n-descriptions-item>
                
                <n-descriptions-item 
                  v-if="transactionDetails.paymentMethod === 'mobile_money'" 
                  label="Nom envoyeur"
                >
                  {{ transactionDetails.senderName || 'Non renseigné' }}
                </n-descriptions-item>
              </n-descriptions>
            </n-card>

            <n-card size="small" v-if="transactionDetails.notes" title="Remarques">
              <p class="mb-0">{{ transactionDetails.notes }}</p>
            </n-card>
          </n-modal>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h, nextTick } from 'vue';
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
  NDataTable,
  NEmpty, 
  NInput, 
  NSpace, 
  NPagination,
  NModal,
  NForm,
  NFormItem,
  NDescriptions,
  NDescriptionsItem,
  NDatePicker,
  NSelect,
  NBadge
} from 'naive-ui';
import AuthService from '../services/AuthService'; 
import FinanceService from '../services/FinanceService';
import jsPDF from 'jspdf';

const router = useRouter();
const route = useRoute();
const userRole = ref('');
const activeMenuKey = ref('paiements');
const validationFormRef = ref(null);

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

// Propriétés calculées
const invoicesToProcess = computed(() => invoicesToSend.value.length);
const litigeCount = computed(() => pendingPenalties.value.length);

// --- États pour les modals ---
const showValidationModal = ref(false);
const showDetailsModal = ref(false);
const currentPaymentId = ref(null);

// --- Formulaire de validation ---
const validationForm = ref({
  clientName: '',
  clientFirstName: '',
  clientPhone: '',
  invoiceNumber: '',
  amount: '',
  locationId: '',
  paymentMethod: null,
  referenceId: '',
  senderName: '',
  notes: ''
});

const transactionDetails = ref({
  clientName: '',
  clientFirstName: '',
  clientPhone: '',
  clientEmail: '',
  invoiceNumber: '',
  amount: '',
  locationId: '',
  paymentMethod: '',
  referenceId: '',
  senderName: '',
  notes: '',
  transactionDate: ''
});

// --- Options pour le mode de paiement ---
const paymentMethodOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Mobile Money', value: 'mobile_money' },
  { label: 'Chèque', value: 'cheque' }
];

// --- Règles de validation ---
const validationRules = {
  paymentMethod: {
    required: true,
    message: 'Veuillez sélectionner un mode de paiement',
    trigger: ['blur', 'change']
  },
  referenceId: {
    required: (value, rule) => {
      return validationForm.value.paymentMethod === 'mobile_money' || 
             validationForm.value.paymentMethod === 'cheque';
    },
    message: 'ID de référence requis',
    trigger: ['blur', 'input']
  },
  senderName: {
    required: (value, rule) => {
      return validationForm.value.paymentMethod === 'mobile_money';
    },
    message: 'Nom de l\'envoyeur requis',
    trigger: ['blur', 'input']
  }
};

// --- États des Données ---
const isLoading = ref(true);
const pendingPayments = ref([]);
const validatedPayments = ref([]);

// --- États pour la recherche et filtres ---
const filterStatus = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);

// --- Recherche pour les transactions en attente ---
const searchPending = ref({
  nom: '',
  location: ''
});

// --- Recherche pour l'historique ---
const searchHistory = ref({
  nom: '',
  date: null
});

// --- Options de filtre ---
const statusOptions = [
  { label: 'Effectué', value: 'Effectué' },
  { label: 'Annulé', value: 'Annulé' }
];

// --- Computed Properties ---
const totalPendingAmount = computed(() => {
  return pendingPayments.value.reduce((sum, payment) => {
    const amount = Number(payment.montantPaie) || 0;
    return sum + amount;
  }, 0);
});

const totalPendingAmountFiltered = computed(() => {
  return filteredPendingPayments.value.reduce((sum, payment) => {
    const amount = Number(payment.montantPaie) || 0;
    return sum + amount;
  }, 0);
});

// Computed property pour les transactions en attente filtrées
const filteredPendingPayments = computed(() => {
  let filtered = pendingPayments.value;
  
  if (searchPending.value.nom) {
    const query = searchPending.value.nom.toLowerCase();
    filtered = filtered.filter(payment => 
      (payment.nomCli && payment.nomCli.toLowerCase().includes(query)) ||
      (payment.prenomCli && payment.prenomCli.toLowerCase().includes(query))
    );
  }
  
  if (searchPending.value.location) {
    const query = searchPending.value.location.toLowerCase();
    filtered = filtered.filter(payment => 
      payment.idLo && payment.idLo.toString().toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// Computed property pour l'historique filtré
const filteredHistory = computed(() => {
  let filtered = validatedPayments.value;
  
  if (searchHistory.value.nom) {
    const query = searchHistory.value.nom.toLowerCase();
    filtered = filtered.filter(payment => 
      (payment.nomCli && payment.nomCli.toLowerCase().includes(query)) ||
      (payment.prenomCli && payment.prenomCli.toLowerCase().includes(query))
    );
  }
  
  if (searchHistory.value.date) {
    try {
      const searchDate = new Date(searchHistory.value.date).toISOString().split('T')[0];
      filtered = filtered.filter(payment => {
        if (!payment.dateCre) return false;
        try {
          const paymentDate = new Date(payment.dateCre).toISOString().split('T')[0];
          return paymentDate === searchDate;
        } catch (e) {
          console.error('Erreur de conversion de date:', payment.dateCre, e);
          return false;
        }
      });
    } catch (error) {
      console.error('Erreur de traitement de la date de recherche:', error);
    }
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(payment => payment.statutPaie === filterStatus.value);
  }
  
  return filtered;
});

// Fonction pour retourner en arrière
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push({ name: 'FinanceDashboard' });
  }
};

// --- Colonnes pour la table des paiements en attente ---
const pendingColumns = [
  {
    title: 'N° Facture',
    key: 'numeroFacture',
    width: 150,
    render: (row) => row.numeroFacture || '-'
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => {
      return (row.nomCli || '') + (row.prenomCli ? ' ' + row.prenomCli : '');
    }
  },
  {
    title: 'Montant',
    key: 'montantPaie',
    width: 130,
    render: (row) => h('strong', { class: 'text-success' }, formatCurrency(row.montantPaie)),
    sorter: (a, b) => (a.montantPaie || 0) - (b.montantPaie || 0)
  },
  {
    title: 'Location',
    key: 'idLo',
    width: 100,
    render: (row) => h('span', { class: 'text-muted' }, `LO-${row.idLo || 'N/A'}`)
  },
   {
    title: 'Statut',
    key: 'statut',
    width: 100,
    render: (row) => h('span', { class: 'text-danger' }, `Non Payé`)
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'success',
        onClick: () => openValidationModal(row),
        title: 'Valider ce paiement'
      }, {
        default: () => [h('i', { class: 'bi bi-check-lg me-1' }), 'Valider']
      }),
      
      h(NButton, {
        size: 'small',
        type: 'warning',
        onClick: () => sendReminder(row.idPaie),
        title: 'Envoyer une relance'
      }, {
        default: () => [h('i', { class: 'bi bi-bell me-1' }), 'Relancer']
      }),
    ])
  }
];

// --- Colonnes pour l'historique ---
const historyColumns = [
  {
    title: 'N° Facture',
    key: 'numeroFacture',
    width: 150,
    render: (row) => row.numeroFacture || '-'
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => {
      return (row.nomCli || '') + (row.prenomCli ? ' ' + row.prenomCli : '');
    }
  },
  {
    title: 'Date Transaction',
    key: 'dateCre',
    width: 150,
    render: (row) => formatDate(row.dateCre)
  },
  {
    title: 'Méthode',
    key: 'modePaie',
    width: 120,
    render: (row) => {
      let displayMethod = row.modePaie || 'Non spécifié';
      
      const methodLower = displayMethod.toLowerCase().trim();
      if (methodLower === 'non spécifié' || 
          methodLower === 'non specifie' || 
          methodLower === 'inconnu' || 
          methodLower === 'unknown' || 
          methodLower === '' || 
          methodLower === 'null' || 
          methodLower === 'undefined') {
        displayMethod = 'Chèque';
      }
      
      const methodMap = {
        'cash': 'Cash',
        'mobile_money': 'Mobile Money',
        'mobilemoney': 'Mobile Money',
        'mobile money': 'Mobile Money',
        'cheque': 'Chèque',
        'carte': 'Carte',
        'virement': 'Virement',
        'espèces': 'Espèces',
        'especes': 'Espèces'
      };
      
      if (methodMap[methodLower]) {
        displayMethod = methodMap[methodLower];
      }
      
      const colorMap = {
        'cash': 'success',
        'mobile money': 'info',
        'mobile_money': 'info',
        'mobilemoney': 'info',
        'chèque': 'warning',
        'cheque': 'warning',
        'carte': 'primary',
        'virement': 'default',
        'espèces': 'success'
      };
      
      const methodType = displayMethod.toLowerCase();
      const tagType = colorMap[methodType] || 'default';
      
      return h(NTag, { 
        type: tagType, 
        size: 'small',
        class: 'custom-tag'
      }, { default: () => displayMethod });
    }
  },
  {
    title: 'Montant',
    key: 'montantPaie',
    width: 130,
    render: (row) => h('strong', { class: 'text-success' }, formatCurrency(row.montantPaie)),
    sorter: (a, b) => (a.montantPaie || 0) - (b.montantPaie || 0)
  },
  {
    title: 'Statut',
    key: 'statutPaie',
    width: 120,
    render: (row) => {
      const typeMap = {
        'Effectué': 'success',
        'En attente': 'warning',
        'Annulé': 'error'
      };
      return h(NTag, { 
        type: typeMap[row.statutPaie] || 'default', 
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.statutPaie || 'Non spécifié' });
    }
  },
  {
    title: 'Location',
    key: 'idLo',
    width: 100,
    render: (row) => h('span', { class: 'text-muted' }, `LO-${row.idLo || 'N/A'}`)
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'info',
        onClick: () => downloadPaymentInvoice(row.idLo),
        title: 'Télécharger la facture'
      }, {
        default: () => h('i', { class: 'bi bi-download' })
      }),
      
      h(NButton, {
        size: 'small',
        type: 'primary',
        onClick: () => showTransactionDetails(row),
        title: 'Voir les détails'
      }, {
        default: () => [h('i', { class: 'bi bi-eye me-1' }), 'Détails']
      }),
      
      row.statutPaie !== 'Annulé' ? h(NButton, {
        size: 'small',
        type: 'error',
        onClick: () => cancelPayment(row.idPaie),
        title: 'Annuler ce paiement'
      }, {
        default: () => [h('i', { class: 'bi bi-x-lg me-1' }), 'Annuler']
      }) : null
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
  const numValue = Number(value) || 0;
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
};

// --- Fonctions de Chargement ---
const fetchPaymentData = async () => {
  isLoading.value = true;
  try {
    const response = await FinanceService.getPaymentData();
    const data = response.data;
    
    console.log('📊 Données reçues pour Suivi des Paiements:', data);
    
    pendingPayments.value = data.pendingPayments || [];
    validatedPayments.value = data.validatedPayments || [];
    
    if (validatedPayments.value.length > 0) {
      console.log('📋 Méthodes de paiement dans les données validées:');
      validatedPayments.value.forEach((payment, index) => {
        console.log(`  [${index}] ID: ${payment.idPaie}, Méthode: "${payment.modePaie}", Statut: ${payment.statutPaie}`);
      });
    }
    
  } catch (error) {
    console.error("❌ Erreur lors du chargement des données de paiement:", error);
    alert("Erreur lors du chargement des données");
  } finally {
    isLoading.value = false;
  }
};

// --- Nouvelles fonctions pour la modal de validation ---
const openValidationModal = (payment) => {
  currentPaymentId.value = payment.idPaie;
  
  validationForm.value = {
    clientName: payment.nomCli || '',
    clientFirstName: payment.prenomCli || '',
    clientPhone: payment.telCli || '',
    invoiceNumber: payment.numeroFacture || '',
    amount: formatCurrency(payment.montantPaie),
    locationId: payment.idLo || '',
    paymentMethod: null,
    referenceId: '',
    senderName: '',
    notes: ''
  };
  
  showValidationModal.value = true;
  
  nextTick(() => {
    if (validationFormRef.value) {
      validationFormRef.value.restoreValidation();
    }
  });
};

const handlePaymentMethodChange = (value) => {
  if (value !== 'mobile_money') {
    validationForm.value.senderName = '';
  }
  if (value !== 'mobile_money' && value !== 'cheque') {
    validationForm.value.referenceId = '';
  }
};

const confirmValidation = async () => {
  try {
    await validationFormRef.value?.validate();
    
    const validationData = {
      paymentId: currentPaymentId.value,
      paymentMethod: validationForm.value.paymentMethod,
      referenceId: validationForm.value.referenceId,
      senderName: validationForm.value.senderName,
      notes: validationForm.value.notes
    };
    
    console.log('📤 Envoi des données de validation:', validationData);
    
    const response = await FinanceService.validatePaymentWithDetails(validationData);
    console.log('✅ Réponse validation:', response.data);
    
    await fetchPaymentData();
    
    showValidationModal.value = false;
    
    alert(`✅ Paiement #${currentPaymentId.value} validé avec succès !
    
• Mode de paiement: ${getPaymentMethodLabel(validationForm.value.paymentMethod)}
• Transaction enregistrée dans l'historique`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
    if (error.errors) {
      console.error('Erreurs de validation:', error.errors);
    } else {
      alert(`Erreur lors de la validation: ${error.response?.data?.message || error.message}`);
    }
  }
};

const showTransactionDetails = (payment) => {
  const additionalDetails = payment.additionalDetails || {};
  
  let paymentMethod = payment.modePaie || additionalDetails.paymentMethod || '';
  
  const methodLower = paymentMethod.toLowerCase().trim();
  if (methodLower === 'non spécifié' || 
      methodLower === 'non specifie' || 
      methodLower === 'inconnu' || 
      methodLower === 'unknown' || 
      methodLower === '' || 
      methodLower === 'null' || 
      methodLower === 'undefined') {
    paymentMethod = 'Chèque';
  }
  
  transactionDetails.value = {
    clientName: payment.nomCli || '',
    clientFirstName: payment.prenomCli || '',
    clientPhone: payment.telCli || '',
    clientEmail: payment.emailCli || '',
    invoiceNumber: payment.numeroFacture || '',
    amount: payment.montantPaie || 0,
    locationId: payment.idLo || '',
    paymentMethod: paymentMethod,
    referenceId: additionalDetails.referenceId || '',
    senderName: additionalDetails.senderName || '',
    notes: additionalDetails.notes || '',
    transactionDate: payment.dateCre || new Date().toISOString()
  };
  
  showDetailsModal.value = true;
};

// --- Fonctions utilitaires pour les modes de paiement ---
const getPaymentMethodLabel = (method) => {
  const labels = {
    'cash': 'Cash',
    'mobile_money': 'Mobile Money',
    'cheque': 'Chèque',
    'mobilemoney': 'Mobile Money',
    'carte': 'Carte',
    'virement': 'Virement'
  };
  return labels[method] || method;
};

const getPaymentMethodTagType = (method) => {
  const types = {
    'cash': 'success',
    'mobile_money': 'info',
    'mobilemoney': 'info',
    'cheque': 'warning',
    'carte': 'primary',
    'virement': 'default'
  };
  return types[method] || 'default';
};

const downloadPaymentInvoice = async (locationId) => {
  if (!locationId) {
    alert('ID de location manquant');
    return;
  }
  
  try {
    console.log('📥 Tentative de téléchargement pour location:', locationId);
    
    const response = await FinanceService.downloadInvoice(locationId, {
      responseType: 'blob'
    });
    
    console.log('📄 Réponse reçue:', response);
    
    if (!response.data || response.data.size === 0) {
      throw new Error('Aucune donnée reçue du serveur');
    }
    
    const contentType = response.headers['content-type'];
    console.log('📋 Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/pdf')) {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-location-${locationId}.pdf`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Facture PDF téléchargée avec succès pour location:', locationId);
      alert(`Facture LO-${locationId} téléchargée au format PDF!`);
      return;
    }
    
    if (contentType && contentType.includes('text/plain')) {
      const text = await response.data.text();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-location-${locationId}.txt`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Facture texte téléchargée pour location:', locationId);
      alert(`Facture LO-${locationId} téléchargée au format texte!`);
      return;
    }
    
    console.error('❌ Type de contenu non supporté:', contentType);
    alert('Format de facture non supporté par le serveur');
    
  } catch (error) {
    console.error('❌ Erreur téléchargement facture:', error);
    
    if (error.response?.status === 404) {
      alert(`Facture non trouvée pour la location LO-${locationId}`);
    } else if (error.response?.status === 500) {
      alert('Erreur serveur lors de la génération de la facture');
    } else if (error.message.includes('Network Error')) {
      alert('Erreur de connexion au serveur');
    } else {
      alert(`Erreur lors du téléchargement: ${error.message}`);
    }
  }
};

const cancelPayment = async (paymentId) => {
  if (!confirm(`Confirmez-vous l'annulation du paiement ${paymentId} ?`)) return;
  
  try {
    await FinanceService.cancelPayment(paymentId);
    alert(`Paiement ${paymentId} annulé avec succès.`);
    await fetchPaymentData();
  } catch (error) {
    console.error(`❌ Erreur lors de l'annulation du paiement ${paymentId}:`, error);
    alert("Erreur lors de l'annulation");
  }
};

const sendReminder = async (paymentId) => {
  const payment = pendingPayments.value.find(p => p.idPaie === paymentId);
  
  if (!payment) {
    alert('Paiement non trouvé');
    return;
  }
  
  const reminderMessage = `Confirmez-vous l'envoi d'une relance pour le paiement ?
    
• Paiement: #${payment.idPaie}
• Client: ${payment.nomCli} ${payment.prenomCli || ''}
• Montant en attente: ${formatCurrency(payment.montantPaie)}
• Location: LO-${payment.idLo}

Un email de rappel sera envoyé au client.`;
  
  if (!confirm(reminderMessage)) return;

  try {
    console.log('📧 Envoi relance pour paiement:', paymentId);
    
    const response = await FinanceService.sendPaymentReminderByIdInUrl(paymentId);
    
    console.log('✅ Réponse relance:', response);
    
    if (response.data.success) {
      alert(`📧 ${response.data.message}
      
• Paiement: #${paymentId}
• Client: ${response.data.data.clientName}
• Email: ${response.data.data.clientEmail}
• Statut email: ${response.data.data.emailSent ? 'Envoyé' : 'Échec'}`);
    } else {
      alert(`❌ ${response.data.message}`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de la relance:`, error);
    
    if (error.response?.status === 404) {
      alert('Fonctionnalité de rappel non disponible. Contactez l\'administrateur.');
    } else if (error.response?.status === 400) {
      alert(error.response.data.message || 'Données client incomplètes pour l\'envoi de rappel.');
    } else {
      alert(`Erreur lors de l'envoi: ${error.response?.data?.message || error.message}`);
    }
  }
};

const clearHistoryFilters = () => {
  searchHistory.value = { nom: '', date: null };
  filterStatus.value = null;
};

// --- Fonctions Utilitaires ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', dateString, error);
    return '-';
  }
};

const formatDisplayDate = (timestamp) => {
  if (!timestamp) return '-';
  try {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return '-';
  }
};

// --- Initialisation ---
onMounted(() => {
    const user = AuthService.getCurrentUser();
    
    if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
        userRole.value = user.roleUti.toUpperCase();
        fetchFinanceData();
        
        activeMenuKey.value = 'paiements';
        
        fetchPaymentData();
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

.n-layout, .n-layout-sider, .n-layout-content, .n-layout-header {
    max-width: 100% !important;
    overflow-x: hidden !important;
}

.main-content {
    overflow-x: hidden !important;
    width: 100% !important;
}

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

.row {
    margin-left: -6px !important;
    margin-right: -6px !important;
}

.col-md-4, .col-12, .col-md-6, .col-6 {
    padding-left: 6px !important;
    padding-right: 6px !important;
}

/* COULEURS ORIGINALES */
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

.btn-back {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

.btn-back:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
}

.custom-alert {
    border-bottom: none !important;
}

:deep(.custom-alert .n-alert-body) {
    border-bottom: none !important;
}

:deep(.custom-alert) {
    border-bottom: none !important;
}

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

.custom-tag {
    font-weight: 600;
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

.bg-light {
    background-color: #f8f9fa !important;
    min-height: calc(100vh - 64px);
}

.facture-preview {
    max-height: 60vh;
    overflow-y: auto;
    padding: 0 5px;
}

:deep(.n-spin-container) {
    display: flex;
    justify-content: center;
    align-items: center;
}

.border-top.border-white {
    border-color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.n-modal) {
    max-width: 95vw !important;
    width: auto !important;
}

:deep(.n-modal .n-modal-body) {
    padding: 20px !important;
}

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
    
    .col-md-4 {
        width: 50%;
    }
    
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
    
    :deep(.custom-table .n-data-table-base-table) {
        min-width: 900px;
    }
}

@media (max-width: 768px) {
    .dashboard-wrapper {
        height: auto;
        min-height: 100vh;
    }
    
    .col-md-4, .col-6 {
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
    
    :deep(.n-card .n-card-content) {
        padding: 12px;
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