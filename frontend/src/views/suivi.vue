<!--

<template>
  <div class="dashboard-wrapper"> 
    <n-layout has-sider class="h-100">
      <!-- Sidebar Naive UI 
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
          <!-- Logo et Titre 
          <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
            <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
            <h4 class="sidebar-title mb-0 fs-6">CEDII Finance</h4>
          </div>
          
          <!-- Menu Navigation 
          <n-menu
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
            class="flex-grow-1 custom-menu"
          />
          
          <!-- Bouton Déconnexion 
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

      <!-- Contenu Principal 
      <n-layout class="main-content">
        <!-- Header 
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

        <!-- Contenu 
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4">
            <!-- Contenu avec scroll VERTICAL seulement
            <div class="content-wrapper">
              <!-- Carte d'alerte pour paiements en attente 
              <div class="row mb-4">
                <div class="col-12">
                  <n-alert type="warning" class="custom-alert">
                    <template #icon>
                      <i class="bi bi-exclamation-triangle"></i>
                    </template>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Paiements en Attente d'Action</strong>
                        <div class="small">
                          Vous avez <strong>{{ filteredPendingPayments.length }} transactions</strong> en attente de validation ou de relance.
                          Montant total : <strong>{{ formatCurrency(totalPendingAmountFiltered) }}</strong>
                        </div>
                      </div>
                      <n-button type="warning" size="small" @click="$router.push({ name: 'FactureGene' })">
                        <i class="bi bi-file-earmark-text me-1"></i>Voir les Factures en Retard
                      </n-button>
                    </div>
                  </n-alert>
                </div>
              </div>

              <!-- Cartes de statistiques
              <div class="row mb-4">
                <div class="col-md-4 mb-3">
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
                
                <div class="col-md-4 mb-3">
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
                
                <div class="col-md-4 mb-3">
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

              <!-- Section des transactions en attente -
              <n-card class="shadow-lg mb-4" title="Transactions en Attente">
                <template #header-extra>
                  <n-tag type="warning" round class="custom-tag">{{ filteredPendingPayments.length }} en attente</n-tag>
                </template>
                
                <!-- Barre de recherche pour les transactions en attente 
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <n-space class="flex-grow-1">
                    <!-- Recherche par nom 
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
                    
                    <!-- Recherche par location 
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
                    
                    <!-- Bouton pour effacer les filtres 
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
                
                <!-- Résumé des filtres actifs 
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
                
                <div v-else class="table-container">
                  <n-data-table
                    :columns="pendingColumns"
                    :data="filteredPendingPayments"
                    :loading="isLoading"
                    class="custom-table"
                  />
                </div>
              </n-card>

              <!-- Section de l'historique des transactions 
              <n-card class="shadow-lg" title="Historique des Transactions Rapprochées">
                <template #header-extra>
                  <n-tag type="info" round class="custom-tag">{{ filteredHistory.length }} validés</n-tag>
                </template>
                
                <p class="text-muted mb-3">Toutes les transactions passées et validées.</p>
                
                <!-- Barre de recherche pour l'historique 
                <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <n-space class="flex-grow-1 flex-wrap gap-2">
                    <!-- Recherche par nom dans l'historique 
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
                    
                    <!-- Recherche par date dans l'historique 
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
                    
                    <!-- Filtre par statut 
                    <n-select
                      v-model:value="filterStatus"
                      :options="statusOptions"
                      placeholder="Filtrer par statut"
                      clearable
                      style="width: 180px"
                    />
                    
                    <!-- Bouton pour effacer les filtres de l'historique 
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
                
                <!-- Résumé des filtres actifs 
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
                
                <div class="table-container">
                  <n-data-table
                    :columns="historyColumns"
                    :data="filteredHistory"
                    :loading="isLoading"
                    class="custom-table"
                  />
                </div>
                
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="text-muted small">
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

            <!-- Modal pour les détails de validation 
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
                <!-- Informations du client 
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
                    <div class="col-12">
                      <n-form-item label="Téléphone" path="clientPhone">
                        <n-input
                          v-model:value="validationForm.clientPhone"
                          placeholder="Téléphone du client"
                          disabled
                        />
                      </n-form-item>
                    </div>
                  </div>
                </n-card>

                <!-- Détails de la transaction 
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

                <!-- Mode de paiement 
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

                  <!-- Champs spécifiques selon le mode de paiement 
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
                          placeholder="ID de transaction (ex: 123456789)"
                        />
                      </n-form-item>
                    </div>
                  </div>

                  <div v-if="validationForm.paymentMethod === 'cheque'" class="row mt-2">
                    <div class="col-12">
                      <n-form-item label="ID de référence du chèque" path="referenceId" required>
                        <n-input
                          v-model:value="validationForm.referenceId"
                          placeholder="Numéro de chèque (ex: CHQ-2024-001)"
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

                <!-- Notes additionnelles 
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

            <!-- Modal pour voir les détails de la transaction 
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
                  <n-descriptions-item label="Téléphone">
                    {{ transactionDetails.clientPhone || 'Non renseigné' }}
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
          </div>
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
  date: null // Utiliser null au lieu de string vide pour le DatePicker
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
  
  // Recherche par nom dans les transactions en attente
  if (searchPending.value.nom) {
    const query = searchPending.value.nom.toLowerCase();
    filtered = filtered.filter(payment => 
      (payment.nomCli && payment.nomCli.toLowerCase().includes(query)) ||
      (payment.prenomCli && payment.prenomCli.toLowerCase().includes(query))
    );
  }
  
  // Recherche par location dans les transactions en attente
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
  
  // Recherche par nom dans l'historique
  if (searchHistory.value.nom) {
    const query = searchHistory.value.nom.toLowerCase();
    filtered = filtered.filter(payment => 
      (payment.nomCli && payment.nomCli.toLowerCase().includes(query)) ||
      (payment.prenomCli && payment.prenomCli.toLowerCase().includes(query))
    );
  }
  
  // Recherche par date dans l'historique
  if (searchHistory.value.date) {
    try {
      // Convertir le timestamp en string de date
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

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1); // Retourne d'une page dans l'historique
  } else {
    // Si pas d'historique, redirige vers le tableau de bord
    router.push({ name: 'FinanceDashboard' });
  }
}

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
      const paymentMethod = row.modePaie || 'Non spécifié';
      const type = paymentMethod.toLowerCase();
      
      const colorMap = {
        'carte': 'primary',
        'virement': 'info',
        'mobilemoney': 'success',
        'cash': 'success',
        'espèces': 'success',
        'mobile money': 'success'
      };
      
      return h(NTag, { 
        type: colorMap[type] || 'default', 
        size: 'small',
        class: 'custom-tag'
      }, { default: () => paymentMethod });
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
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value);
};

// --- Fonctions de Chargement ---
const fetchPaymentData = async () => {
  isLoading.value = true;
  try {
    const response = await FinanceService.getPaymentData();
    const data = response.data;
    
    console.log('Données reçues:', data);
    
    pendingPayments.value = data.pendingPayments || [];
    validatedPayments.value = data.validatedPayments || [];
    
    if (pendingPayments.value.length > 0) {
      console.log('Méthodes de paiement en attente:', pendingPayments.value.map(p => p.modePaie));
    }
    if (validatedPayments.value.length > 0) {
      console.log('Méthodes de paiement validés:', validatedPayments.value.map(p => p.modePaie));
    }
    
  } catch (error) {
    console.error("Erreur lors du chargement des données de paiement:", error);
    alert("Erreur lors du chargement des données");
  } finally {
    isLoading.value = false;
  }
};

// --- Fonction pour générer un PDF à partir du texte ---
const generatePDFFromText = (text, locationId) => {
  try {
    const pdf = new jsPDF();
    
    // Définition des couleurs professionnelles CEDII
    const primaryColor = [4, 5, 143]; // Bleu CEDII (#04058F)
    const secondaryColor = [88, 17, 238]; // Violet CEDII (#5811EE)
    const accentColor = [40, 167, 69]; // Vert (#28a745)
    const warningColor = [220, 53, 69]; // Rouge (#dc3545)
    const lightGray = [248, 249, 250]; // Gris clair (#f8f9fa)
    const darkGray = [52, 58, 64]; // Gris foncé (#343a40)
    const textColor = [51, 51, 51]; // Texte (#333)
    
    // Variables de mise en page
    const pageWidth = 210;
    const margin = 15;
    const columnWidth = 85;
    let yPosition = 50;
    
    // ===== EN-TÊTE PROFESSIONNEL =====
    // Fond de l'en-tête
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo CEDII en haut à gauche
    try {
      // Essayer de charger le logo depuis plusieurs chemins
      const logoPaths = [
        '/public/images/logo.jpg',
        'public/images/logo.jpg',
        './public/images/logo.jpg',
        '../public/images/logo.jpg',
        'logo.jpg'
      ];
      
      let logoLoaded = false;
      for (const path of logoPaths) {
        try {
          pdf.addImage(path, 'JPEG', margin, 8, 25, 25);
          logoLoaded = true;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!logoLoaded) {
        // Fallback: Texte CEDII stylisé
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CEDII', margin + 13, 18);
        pdf.setFontSize(8);
        pdf.text("Centre d'Échange, Documentation", margin + 13, 24);
        pdf.text("et d'Information ", margin + 13, 28);
        pdf.text("Inter-Institutionnelles", margin + 13, 32);
      }
    } catch (error) {
      console.warn('Logo non chargé:', error);
    }
    
    // Titre principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CEDII LOCATIONS', pageWidth / 2, 20, { align: 'center' });
    
    // Ligne de séparation
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.8);
    pdf.line(margin, 45, pageWidth - margin, 45);
    
    // ===== ZONE DEUX COLONNES =====
    yPosition = 55;
    
    // Ligne verticale séparatrice
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth / 2, yPosition - 5, pageWidth / 2, yPosition + 80);
    
    // ===== COLONNE GAUCHE - INTERNE CEDII =====
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS CEDII', margin, yPosition);
    yPosition += 8;
    
    // Encadré informations internes
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.2);
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, yPosition, columnWidth, 70, 3, 3, 'FD');
    
    // Contenu colonne gauche
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const infoCedii = [
      { label: 'Société:', value: 'CEDII ' },
      { label: 'Adresse:', value: 'Boulevard Philibert Tsiranana Tsianonlondroa'},
      { label: 'Ville:', value: 'Fianarantsoa 301' },
      { label: 'Pays:', value: 'Madagascar' },
      { label: 'Tél:', value: ' +261 34 03 931 91/ +261 34 60 020 34' },
      { label: 'Email:', value: 'cedii.fia@gmail.mg' },
      { label: 'NIF:', value: 'xxxxxxx' },
      { label: 'STAT:', value: 'xxxxxxxx' }
    ];
    
    let yOffset = yPosition + 6;
    infoCedii.forEach((info, index) => {
      if (index < 5) { // Limite à 5 lignes pour la première partie
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, margin + 5, yOffset);
        pdf.setFont('helvetica', 'normal');
        pdf.text(info.value, margin + 25, yOffset);
        yOffset += 5;
      }
    });
    
    yOffset += 5;
    
    infoCedii.slice(5).forEach((info, index) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(info.label, margin + 5, yOffset);
      pdf.setFont('helvetica', 'normal');
      pdf.text(info.value, margin + 25, yOffset);
      yOffset += 5;
    });
    
    // ===== COLONNE DROITE - CLIENT =====
    let yRight = 55;
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS CLIENT', pageWidth / 2 + margin, yRight);
    yRight += 8;
    
    // Encadré informations client
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.2);
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(pageWidth / 2 + margin, yRight, columnWidth, 70, 3, 3, 'FD');
    
    // Extraction des informations du texte
    let numeroFacture = 'N/A';
    let client = 'N/A';
    let location = 'N/A';
    let periode = 'N/A';
    let montant = 'N/A';
    let statut = 'N/A';
    let clientDetails = {};
    
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.includes('Numéro:')) numeroFacture = line.split('Numéro:')[1]?.trim() || 'N/A';
      if (line.includes('Client:')) client = line.split('Client:')[1]?.trim() || 'N/A';
      if (line.includes('Location:')) location = line.split('Location:')[1]?.trim() || 'N/A';
      if (line.includes('Période:')) periode = line.split('Période:')[1]?.trim() || 'N/A';
      if (line.includes('Montant:')) montant = line.split('Montant:')[1]?.trim() || 'N/A';
      if (line.includes('Statut:')) statut = line.split('Statut:')[1]?.trim() || 'N/A';
      
      // Extraction des détails client supplémentaires
      if (line.includes('Email:')) clientDetails.email = line.split('Email:')[1]?.trim();
      if (line.includes('Téléphone:')) clientDetails.phone = line.split('Téléphone:')[1]?.trim();
      if (line.includes('Adresse:')) clientDetails.address = line.split('Adresse:')[1]?.trim();
    });
    
    // Contenu colonne droite
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    let yOffsetRight = yRight + 6;
    const clientInfo = [
      { label: 'Nom:', value: client },
      { label: 'Référence:', value: `#${locationId}` },
      { label: 'Facture:', value: numeroFacture },
      { label: 'Email:', value: clientDetails.email || 'Non renseigné' },
      { label: 'Téléphone:', value: clientDetails.phone || 'Non renseigné' },
      { label: 'Adresse:', value: clientDetails.address || 'Non renseigné' }
    ];
    
    clientInfo.forEach((info, index) => {
      if (index < 6) { // Toutes les infos
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, pageWidth / 2 + margin + 5, yOffsetRight);
        pdf.setFont('helvetica', 'normal');
        
        // Gestion des textes longs
        const value = String(info.value || '');
        if (value.length > 25) {
          const parts = pdf.splitTextToSize(value, columnWidth - 25);
          parts.forEach((part, i) => {
            pdf.text(part, pageWidth / 2 + margin + 20, yOffsetRight + (i * 4));
          });
          yOffsetRight += (parts.length * 4) - 4;
        } else {
          pdf.text(value, pageWidth / 2 + margin + 20, yOffsetRight);
        }
        
        yOffsetRight += 6;
      }
    });
    
    // ===== DÉTAILS DE LA LOCATION =====
    yPosition = yRight + 85;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DÉTAILS DE LA LOCATION', margin, yPosition);
    yPosition += 8;
    
    // Encadré détails
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, yPosition, pageWidth - (margin * 2), 25);
    
    pdf.setFontSize(10);
    pdf.setTextColor(...textColor);
    
    // Ligne 1: Type et Période
    pdf.setFont('helvetica', 'bold');
    pdf.text('Type:', margin + 5, yPosition + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(location || 'Location', margin + 20, yPosition + 8);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Période:', margin + 90, yPosition + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(periode || 'N/A', margin + 110, yPosition + 8);
    
    // Ligne 2: Statut et Date facture
    pdf.setFont('helvetica', 'bold');
    pdf.text('Statut:', margin + 5, yPosition + 16);
    pdf.setFont('helvetica', 'normal');
    
    // Couleur selon le statut
    const statutLower = (statut || '').toLowerCase();
    if (statutLower.includes('payé') || statutLower.includes('réglé')) {
      pdf.setTextColor(...accentColor);
    } else if (statutLower.includes('en attente') || statutLower.includes('en cours')) {
      pdf.setTextColor(255, 193, 7); // Orange
    } else {
      pdf.setTextColor(...warningColor);
    }
    pdf.text(statut || 'N/A', margin + 20, yPosition + 16);
    
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Date facture:', margin + 90, yPosition + 16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date().toLocaleDateString('fr-FR'), margin + 115, yPosition + 16);
    
    // ===== MONTANT TOTAL =====
    yPosition += 35;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MONTANT TOTAL À PAYER:', margin, yPosition);
    
    // Encadré montant
    pdf.setDrawColor(...accentColor);
    pdf.setLineWidth(1);
    pdf.rect(margin, yPosition + 5, pageWidth - (margin * 2), 15);
    
    pdf.setFontSize(18);
    pdf.setTextColor(...accentColor);
    pdf.text(`${montant || '0 Ar'}`, pageWidth / 2, yPosition + 15, { align: 'center' });
    
    // ===== CONDITIONS ET NOTES =====
    yPosition += 30;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(9);
    pdf.setTextColor(...darkGray);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONDITIONS DE PAIEMENT:', margin, yPosition);
    yPosition += 6;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const conditions = [
      "• Tout retard entraîne des pénalités de 1% par heures ou jours de retard",
      "• Mode de paiement: Virement bancaire, Mobile Money ou espèces",
      "• Pour toute réclamation, contactez-nous sous 7 jours"
    ];
    
    conditions.forEach((condition, index) => {
      pdf.text(condition, margin, yPosition + (index * 5));
    });
    
    // ===== SIGNATURES =====
    yPosition += 40;
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth / 2, yPosition, pageWidth / 2, yPosition + 30);
    
    // Signature CEDII (gauche)
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pour CEDII Locations', margin + 40, yPosition, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Le Responsable Financier', margin + 40, yPosition + 5, { align: 'center' });
    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin + 20, yPosition + 12, margin + 60, yPosition + 12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Signature et cachet', margin + 40, yPosition + 18, { align: 'center' });
    
    // Signature Client (droite)
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pour le Client', pageWidth / 2 + 40, yPosition, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Bon pour accord', pageWidth / 2 + 40, yPosition + 5, { align: 'center' });
    pdf.setDrawColor(100, 100, 100);
    pdf.line(pageWidth / 2 + 20, yPosition + 12, pageWidth / 2 + 60, yPosition + 12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Signature et date', pageWidth / 2 + 40, yPosition + 18, { align: 'center' });
    
    // ===== PIED DE PAGE =====
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'italic');
    pdf.text('CEDII Locations - Centre d\'Échange, de Documentation et d\'Information Inter-Institutionnelles', 
             pageWidth / 2, 280, { align: 'center' });
    pdf.text('Facture générée le ' + new Date().toLocaleString('fr-FR'), pageWidth / 2, 285, { align: 'center' });
    
    // Numéro de page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin, 290, { align: 'right' });
    }
    
    // Sauvegarde du PDF
    pdf.save(`facture-cedii-${locationId}.pdf`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    return false;
  }
};

// --- Nouvelles fonctions pour la modal de validation ---
const openValidationModal = (payment) => {
  currentPaymentId.value = payment.idPaie;
  
  // Remplir le formulaire avec les données du paiement
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
  
  // Réinitialiser les champs conditionnels
  nextTick(() => {
    if (validationFormRef.value) {
      validationFormRef.value.restoreValidation();
    }
  });
};

const handlePaymentMethodChange = (value) => {
  // Réinitialiser les champs spécifiques quand on change de méthode
  if (value !== 'mobile_money') {
    validationForm.value.senderName = '';
  }
  if (value !== 'mobile_money' && value !== 'cheque') {
    validationForm.value.referenceId = '';
  }
};

const confirmValidation = async () => {
  try {
    // Validation du formulaire
    await validationFormRef.value?.validate();
    
    // Préparer les données pour l'API
    const validationData = {
      paymentId: currentPaymentId.value,
      paymentMethod: validationForm.value.paymentMethod,
      referenceId: validationForm.value.referenceId,
      senderName: validationForm.value.senderName,
      notes: validationForm.value.notes
    };
    
    // Appeler l'API pour valider le paiement
    await FinanceService.validatePaymentWithDetails(validationData);
    
    // Mettre à jour les données
    await fetchPaymentData();
    
    // Fermer le modal
    showValidationModal.value = false;
    
    // Afficher un message de succès
    alert(`✅ Paiement #${currentPaymentId.value} validé avec succès !
    
• Mode de paiement: ${getPaymentMethodLabel(validationForm.value.paymentMethod)}
• Transaction enregistrée dans l'historique`);
    
  } catch (error) {
    if (error.errors) {
      // Erreurs de validation du formulaire
      console.error('Erreurs de validation:', error.errors);
    } else {
      // Erreur API
      console.error('❌ Erreur lors de la validation:', error);
      alert(`Erreur lors de la validation: ${error.response?.data?.message || error.message}`);
    }
  }
};

const showTransactionDetails = (payment) => {
  // Récupérer les détails supplémentaires si disponibles
  const additionalDetails = payment.additionalDetails || {};
  
  transactionDetails.value = {
    clientName: payment.nomCli || '',
    clientFirstName: payment.prenomCli || '',
    clientPhone: payment.telCli || '',
    clientEmail: payment.emailCli || '',
    invoiceNumber: payment.numeroFacture || '',
    amount: payment.montantPaie || 0,
    locationId: payment.idLo || '',
    paymentMethod: payment.modePaie || additionalDetails.paymentMethod || '',
    referenceId: additionalDetails.referenceId || '',
    senderName: additionalDetails.senderName || '',
    notes: additionalDetails.notes || '',
    transactionDate: payment.dateCre || new Date().toISOString()
  };
  
  showDetailsModal.value = true;
};

// Fonction pour retourner en arrière


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
    
    // Télécharger directement le PDF du serveur
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
    
    // Si ce n'est pas un PDF, essayer de le traiter comme texte
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
    
    // Utiliser la nouvelle route avec ID dans l'URL
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

const exportHistory = () => {
  alert("Fonctionnalité d'export à implémenter");
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
        
        // Définir l'élément de menu actif basé sur la route actuelle
        activeMenuKey.value = 'paiements';
        
        // Charger les données de paiement
        fetchPaymentData();
    } else {
        router.push('/'); 
    }
});
</script>

<style scoped>
/* COULEURS ORIGINALES */

.dashboard-wrapper {
    height: 100vh;
    overflow: hidden; /* Empêche le scroll global */
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

/* Contenu principal - DÉSACTIVATION du scroll horizontal */
.content-wrapper {
    max-height: calc(100vh - 250px);
    overflow-y: auto; /* Seulement vertical */
    overflow-x: hidden; /* Désactive le scroll horizontal */
    padding-right: 5px;
    width: 100%;
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

/* Conteneur de table - Ajusté pour éviter le dépassement */
.table-container {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden; /* Désactive le scroll horizontal */
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    width: 100%;
}

.table-container::-webkit-scrollbar {
    width: 6px;
    height: 0; /* Cache la barre de scroll horizontal */
}

.table-container::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
}

/* Table personnalisée - S'adapte à la largeur disponible */
.custom-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100% !important;
    table-layout: auto; /* Ajuste automatiquement la largeur des colonnes */
}

/* Force les tables Naive UI à s'adapter */
:deep(.n-data-table) {
    width: 100% !important;
    max-width: 100% !important;
}

:deep(.n-data-table-base-table) {
    width: 100% !important;
    max-width: 100% !important;
}

:deep(.n-data-table-base-table-body) {
    width: 100% !important;
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
    overflow-x: hidden; /* Désactive le scroll horizontal */
}

.bg-light {
    background-color: #f8f9fa !important;
}

.facture-preview {
    max-height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
}

/* Ajustements pour le conteneur principal */
.container-fluid {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden; /* Empêche le défilement horizontal */
}

/* Ajustements pour les cartes */
:deep(.n-card) {
    width: 100%;
    max-width: 100%;
    overflow: hidden; /* Empêche le dépassement */
}

/* Ajustements pour les inputs et filtres */
:deep(.n-input) {
    max-width: 100%;
}

:deep(.n-select) {
    max-width: 100%;
}

:deep(.n-date-picker) {
    max-width: 100%;
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
    
    .col-md-4 {
        width: 100%;
    }
    
    /* Responsive pour les filtres */
    .card-body .d-flex.gap-2 {
        flex-wrap: wrap;
    }
    
    .card-body .d-flex.gap-2 > * {
        margin-bottom: 0.5rem;
        width: 100%;
    }
    
    .card-body .d-flex.gap-2 .n-input,
    .card-body .d-flex.gap-2 .n-select,
    .card-body .d-flex.gap-2 .n-date-picker {
        width: 100% !important;
        max-width: 100% !important;
    }
}

@media (max-width: 768px) {
    .col-md-4 {
        width: 100%;
    }
    
    .custom-subtitle {
        font-size: 1.1rem;
    }
    
    .content-wrapper {
        max-height: calc(100vh - 350px);
    }
    
    /* Ajustements supplémentaires pour mobile */
    .custom-table {
        font-size: 0.85rem;
    }
    
    :deep(.n-data-table th),
    :deep(.n-data-table td) {
        padding: 8px 6px !important;
    }
}

@media (min-width: 1200px) {
    .content-wrapper {
        max-height: calc(100vh - 280px);
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

        <!-- Contenu -->
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4">
            <!-- Contenu avec scroll VERTICAL seulement -->
            <div class="content-wrapper">
              <!-- Carte d'alerte pour paiements en attente -->
              <div class="row mb-4">
                <div class="col-12">
                  <n-alert type="warning" class="custom-alert">
                    <template #icon>
                      <i class="bi bi-exclamation-triangle"></i>
                    </template>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Paiements en Attente d'Action</strong>
                        <div class="small">
                          Vous avez <strong>{{ filteredPendingPayments.length }} transactions</strong> en attente de validation ou de relance.
                          Montant total : <strong>{{ formatCurrency(totalPendingAmountFiltered) }}</strong>
                        </div>
                      </div>
                      <n-button type="warning" size="small" @click="$router.push({ name: 'FactureGene' })">
                        <i class="bi bi-file-earmark-text me-1"></i>Voir les Factures en Retard
                      </n-button>
                    </div>
                  </n-alert>
                </div>
              </div>

              <!-- Cartes de statistiques -->
              <div class="row mb-4">
                <div class="col-md-4 mb-3">
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
                
                <div class="col-md-4 mb-3">
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
                
                <div class="col-md-4 mb-3">
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
                
                <div v-else class="table-container">
                  <n-data-table
                    :columns="pendingColumns"
                    :data="filteredPendingPayments"
                    :loading="isLoading"
                    class="custom-table"
                  />
                </div>
              </n-card>

              <!-- Section de l'historique des transactions -->
              <n-card class="shadow-lg" title="Historique des Transactions Rapprochées">
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
                
                <div class="table-container">
                  <n-data-table
                    :columns="historyColumns"
                    :data="filteredHistory"
                    :loading="isLoading"
                    class="custom-table"
                  />
                </div>
                
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <div class="text-muted small">
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
                    <div class="col-12">
                      <n-form-item label="Téléphone" path="clientPhone">
                        <n-input
                          v-model:value="validationForm.clientPhone"
                          placeholder="Téléphone du client"
                          disabled
                        />
                      </n-form-item>
                    </div>
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
                          placeholder="ID de transaction (ex: 123456789)"
                        />
                      </n-form-item>
                    </div>
                  </div>

                  <div v-if="validationForm.paymentMethod === 'cheque'" class="row mt-2">
                    <div class="col-12">
                      <n-form-item label="ID de référence du chèque" path="referenceId" required>
                        <n-input
                          v-model:value="validationForm.referenceId"
                          placeholder="Numéro de chèque (ex: CHQ-2024-001)"
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
                  <n-descriptions-item label="Téléphone">
                    {{ transactionDetails.clientPhone || 'Non renseigné' }}
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
          </div>
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
      // CRITIQUE : C'est ici qu'il faut corriger l'affichage
      // On va utiliser une fonction qui transforme "non spécifié" en "Chèque"
      let displayMethod = row.modePaie || 'Non spécifié';
      
      // CORRECTION : Si c'est "non spécifié", "inconnu" ou vide, afficher "Chèque"
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
      
      // Capitaliser les autres méthodes
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
      
      // Déterminer la couleur du tag
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
    
    // Debug: Vérifier les méthodes de paiement dans les données
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

// --- Fonction pour générer un PDF à partir du texte ---
const generatePDFFromText = (text, locationId) => {
  try {
    const pdf = new jsPDF();
    
    // Définition des couleurs professionnelles CEDII
    const primaryColor = [4, 5, 143]; // Bleu CEDII (#04058F)
    const secondaryColor = [88, 17, 238]; // Violet CEDII (#5811EE)
    const accentColor = [40, 167, 69]; // Vert (#28a745)
    const warningColor = [220, 53, 69]; // Rouge (#dc3545)
    const lightGray = [248, 249, 250]; // Gris clair (#f8f9fa)
    const darkGray = [52, 58, 64]; // Gris foncé (#343a40)
    const textColor = [51, 51, 51]; // Texte (#333)
    
    // Variables de mise en page
    const pageWidth = 210;
    const margin = 15;
    const columnWidth = 85;
    let yPosition = 50;
    
    // ===== EN-TÊTE PROFESSIONNEL =====
    // Fond de l'en-tête
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo CEDII en haut à gauche
    try {
      // Essayer de charger le logo depuis plusieurs chemins
      const logoPaths = [
        '/public/images/logo.jpg',
        'public/images/logo.jpg',
        './public/images/logo.jpg',
        '../public/images/logo.jpg',
        'logo.jpg'
      ];
      
      let logoLoaded = false;
      for (const path of logoPaths) {
        try {
          pdf.addImage(path, 'JPEG', margin, 8, 25, 25);
          logoLoaded = true;
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!logoLoaded) {
        // Fallback: Texte CEDII stylisé
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CEDII', margin + 13, 18);
        pdf.setFontSize(8);
        pdf.text("Centre d'Échange, Documentation", margin + 13, 24);
        pdf.text("et d'Information ", margin + 13, 28);
        pdf.text("Inter-Institutionnelles", margin + 13, 32);
      }
    } catch (error) {
      console.warn('Logo non chargé:', error);
    }
    
    // Titre principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CEDII LOCATIONS', pageWidth / 2, 20, { align: 'center' });
    
    // Ligne de séparation
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.8);
    pdf.line(margin, 45, pageWidth - margin, 45);
    
    // ===== ZONE DEUX COLONNES =====
    yPosition = 55;
    
    // Ligne verticale séparatrice
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth / 2, yPosition - 5, pageWidth / 2, yPosition + 80);
    
    // ===== COLONNE GAUCHE - INTERNE CEDII =====
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS CEDII', margin, yPosition);
    yPosition += 8;
    
    // Encadré informations internes
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.2);
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, yPosition, columnWidth, 70, 3, 3, 'FD');
    
    // Contenu colonne gauche
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const infoCedii = [
      { label: 'Société:', value: 'CEDII ' },
      { label: 'Adresse:', value: 'Boulevard Philibert Tsiranana Tsianonlondroa'},
      { label: 'Ville:', value: 'Fianarantsoa 301' },
      { label: 'Pays:', value: 'Madagascar' },
      { label: 'Tél:', value: ' +261 34 03 931 91/ +261 34 60 020 34' },
      { label: 'Email:', value: 'cedii.fia@gmail.mg' },
      { label: 'NIF:', value: 'xxxxxxx' },
      { label: 'STAT:', value: 'xxxxxxxx' }
    ];
    
    let yOffset = yPosition + 6;
    infoCedii.forEach((info, index) => {
      if (index < 5) { // Limite à 5 lignes pour la première partie
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, margin + 5, yOffset);
        pdf.setFont('helvetica', 'normal');
        pdf.text(info.value, margin + 25, yOffset);
        yOffset += 5;
      }
    });
    
    yOffset += 5;
    
    infoCedii.slice(5).forEach((info, index) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(info.label, margin + 5, yOffset);
      pdf.setFont('helvetica', 'normal');
      pdf.text(info.value, margin + 25, yOffset);
      yOffset += 5;
    });
    
    // ===== COLONNE DROITE - CLIENT =====
    let yRight = 55;
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS CLIENT', pageWidth / 2 + margin, yRight);
    yRight += 8;
    
    // Encadré informations client
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.2);
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(pageWidth / 2 + margin, yRight, columnWidth, 70, 3, 3, 'FD');
    
    // Extraction des informations du texte
    let numeroFacture = 'N/A';
    let client = 'N/A';
    let location = 'N/A';
    let periode = 'N/A';
    let montant = 'N/A';
    let statut = 'N/A';
    let clientDetails = {};
    
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.includes('Numéro:')) numeroFacture = line.split('Numéro:')[1]?.trim() || 'N/A';
      if (line.includes('Client:')) client = line.split('Client:')[1]?.trim() || 'N/A';
      if (line.includes('Location:')) location = line.split('Location:')[1]?.trim() || 'N/A';
      if (line.includes('Période:')) periode = line.split('Période:')[1]?.trim() || 'N/A';
      if (line.includes('Montant:')) montant = line.split('Montant:')[1]?.trim() || 'N/A';
      if (line.includes('Statut:')) statut = line.split('Statut:')[1]?.trim() || 'N/A';
      
      // Extraction des détails client supplémentaires
      if (line.includes('Email:')) clientDetails.email = line.split('Email:')[1]?.trim();
      if (line.includes('Téléphone:')) clientDetails.phone = line.split('Téléphone:')[1]?.trim();
      if (line.includes('Adresse:')) clientDetails.address = line.split('Adresse:')[1]?.trim();
    });
    
    // Contenu colonne droite
    pdf.setTextColor(...textColor);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    let yOffsetRight = yRight + 6;
    const clientInfo = [
      { label: 'Nom:', value: client },
      { label: 'Référence:', value: `#${locationId}` },
      { label: 'Facture:', value: numeroFacture },
      { label: 'Email:', value: clientDetails.email || 'Non renseigné' },
      { label: 'Téléphone:', value: clientDetails.phone || 'Non renseigné' },
      { label: 'Adresse:', value: clientDetails.address || 'Non renseigné' }
    ];
    
    clientInfo.forEach((info, index) => {
      if (index < 6) { // Toutes les infos
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, pageWidth / 2 + margin + 5, yOffsetRight);
        pdf.setFont('helvetica', 'normal');
        
        // Gestion des textes longs
        const value = String(info.value || '');
        if (value.length > 25) {
          const parts = pdf.splitTextToSize(value, columnWidth - 25);
          parts.forEach((part, i) => {
            pdf.text(part, pageWidth / 2 + margin + 20, yOffsetRight + (i * 4));
          });
          yOffsetRight += (parts.length * 4) - 4;
        } else {
          pdf.text(value, pageWidth / 2 + margin + 20, yOffsetRight);
        }
        
        yOffsetRight += 6;
      }
    });
    
    // ===== DÉTAILS DE LA LOCATION =====
    yPosition = yRight + 85;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DÉTAILS DE LA LOCATION', margin, yPosition);
    yPosition += 8;
    
    // Encadré détails
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, yPosition, pageWidth - (margin * 2), 25);
    
    pdf.setFontSize(10);
    pdf.setTextColor(...textColor);
    
    // Ligne 1: Type et Période
    pdf.setFont('helvetica', 'bold');
    pdf.text('Type:', margin + 5, yPosition + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(location || 'Location', margin + 20, yPosition + 8);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Période:', margin + 90, yPosition + 8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(periode || 'N/A', margin + 110, yPosition + 8);
    
    // Ligne 2: Statut et Date facture
    pdf.setFont('helvetica', 'bold');
    pdf.text('Statut:', margin + 5, yPosition + 16);
    pdf.setFont('helvetica', 'normal');
    
    // Couleur selon le statut
    const statutLower = (statut || '').toLowerCase();
    if (statutLower.includes('payé') || statutLower.includes('réglé')) {
      pdf.setTextColor(...accentColor);
    } else if (statutLower.includes('en attente') || statutLower.includes('en cours')) {
      pdf.setTextColor(255, 193, 7); // Orange
    } else {
      pdf.setTextColor(...warningColor);
    }
    pdf.text(statut || 'N/A', margin + 20, yPosition + 16);
    
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Date facture:', margin + 90, yPosition + 16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date().toLocaleDateString('fr-FR'), margin + 115, yPosition + 16);
    
    // ===== MONTANT TOTAL =====
    yPosition += 35;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MONTANT TOTAL À PAYER:', margin, yPosition);
    
    // Encadré montant
    pdf.setDrawColor(...accentColor);
    pdf.setLineWidth(1);
    pdf.rect(margin, yPosition + 5, pageWidth - (margin * 2), 15);
    
    pdf.setFontSize(18);
    pdf.setTextColor(...accentColor);
    pdf.text(`${montant || '0 Ar'}`, pageWidth / 2, yPosition + 15, { align: 'center' });
    
    // ===== CONDITIONS ET NOTES =====
    yPosition += 30;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(9);
    pdf.setTextColor(...darkGray);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONDITIONS DE PAIEMENT:', margin, yPosition);
    yPosition += 6;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const conditions = [
      "• Tout retard entraîne des pénalités de 1% par heures ou jours de retard",
      "• Mode de paiement: Virement bancaire, Mobile Money ou espèces",
      "• Pour toute réclamation, contactez-nous sous 7 jours"
    ];
    
    conditions.forEach((condition, index) => {
      pdf.text(condition, margin, yPosition + (index * 5));
    });
    
    // ===== SIGNATURES =====
    yPosition += 40;
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth / 2, yPosition, pageWidth / 2, yPosition + 30);
    
    // Signature CEDII (gauche)
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pour CEDII Locations', margin + 40, yPosition, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Le Responsable Financier', margin + 40, yPosition + 5, { align: 'center' });
    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin + 20, yPosition + 12, margin + 60, yPosition + 12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Signature et cachet', margin + 40, yPosition + 18, { align: 'center' });
    
    // Signature Client (droite)
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pour le Client', pageWidth / 2 + 40, yPosition, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Bon pour accord', pageWidth / 2 + 40, yPosition + 5, { align: 'center' });
    pdf.setDrawColor(100, 100, 100);
    pdf.line(pageWidth / 2 + 20, yPosition + 12, pageWidth / 2 + 60, yPosition + 12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Signature et date', pageWidth / 2 + 40, yPosition + 18, { align: 'center' });
    
    // ===== PIED DE PAGE =====
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'italic');
    pdf.text('CEDII Locations - Centre d\'Échange, de Documentation et d\'Information Inter-Institutionnelles', 
             pageWidth / 2, 280, { align: 'center' });
    pdf.text('Facture générée le ' + new Date().toLocaleString('fr-FR'), pageWidth / 2, 285, { align: 'center' });
    
    // Numéro de page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin, 290, { align: 'right' });
    }
    
    // Sauvegarde du PDF
    pdf.save(`facture-cedii-${locationId}.pdf`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    return false;
  }
};

// --- Nouvelles fonctions pour la modal de validation ---
const openValidationModal = (payment) => {
  currentPaymentId.value = payment.idPaie;
  
  // Remplir le formulaire avec les données du paiement
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
  
  // Réinitialiser les champs conditionnels
  nextTick(() => {
    if (validationFormRef.value) {
      validationFormRef.value.restoreValidation();
    }
  });
};

const handlePaymentMethodChange = (value) => {
  // Réinitialiser les champs spécifiques quand on change de méthode
  if (value !== 'mobile_money') {
    validationForm.value.senderName = '';
  }
  if (value !== 'mobile_money' && value !== 'cheque') {
    validationForm.value.referenceId = '';
  }
};

const confirmValidation = async () => {
  try {
    // Validation du formulaire
    await validationFormRef.value?.validate();
    
    // Préparer les données pour l'API
    const validationData = {
      paymentId: currentPaymentId.value,
      paymentMethod: validationForm.value.paymentMethod,
      referenceId: validationForm.value.referenceId,
      senderName: validationForm.value.senderName,
      notes: validationForm.value.notes
    };
    
    console.log('📤 Envoi des données de validation:', validationData);
    
    // Appeler l'API pour valider le paiement
    const response = await FinanceService.validatePaymentWithDetails(validationData);
    console.log('✅ Réponse validation:', response.data);
    
    // Mettre à jour les données
    await fetchPaymentData();
    
    // Fermer le modal
    showValidationModal.value = false;
    
    // Afficher un message de succès
    alert(`✅ Paiement #${currentPaymentId.value} validé avec succès !
    
• Mode de paiement: ${getPaymentMethodLabel(validationForm.value.paymentMethod)}
• Transaction enregistrée dans l'historique`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error);
    if (error.errors) {
      // Erreurs de validation du formulaire
      console.error('Erreurs de validation:', error.errors);
    } else {
      // Erreur API
      alert(`Erreur lors de la validation: ${error.response?.data?.message || error.message}`);
    }
  }
};

const showTransactionDetails = (payment) => {
  // Récupérer les détails supplémentaires si disponibles
  const additionalDetails = payment.additionalDetails || {};
  
  // CRITIQUE : Ici aussi, il faut corriger l'affichage du mode de paiement
  let paymentMethod = payment.modePaie || additionalDetails.paymentMethod || '';
  
  // Transformer "non spécifié" en "Chèque" pour l'affichage dans les détails
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
    paymentMethod: paymentMethod, // Utiliser la version corrigée
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
    
    // Télécharger directement le PDF du serveur
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
    
    // Si ce n'est pas un PDF, essayer de le traiter comme texte
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
    
    // Utiliser la nouvelle route avec ID dans l'URL
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

const exportHistory = () => {
  alert("Fonctionnalité d'export à implémenter");
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
        
        // Définir l'élément de menu actif basé sur la route actuelle
        activeMenuKey.value = 'paiements';
        
        // Charger les données de paiement
        fetchPaymentData();
    } else {
        router.push('/'); 
    }
});
</script>

<style scoped>
/* Les styles restent exactement les mêmes que dans votre code */
.dashboard-wrapper {
    height: 100vh;
    overflow: hidden;
}

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

.content-wrapper {
    max-height: calc(100vh - 250px);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 5px;
    width: 100%;
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
    overflow-x: hidden;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    width: 100%;
}

.table-container::-webkit-scrollbar {
    width: 6px;
    height: 0;
}

.table-container::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
    background: #dee2e6;
    border-radius: 3px;
}

.custom-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100% !important;
    table-layout: auto;
}

:deep(.n-data-table) {
    width: 100% !important;
    max-width: 100% !important;
}

:deep(.n-data-table-base-table) {
    width: 100% !important;
    max-width: 100% !important;
}

:deep(.n-data-table-base-table-body) {
    width: 100% !important;
}

:deep(.n-spin-container) {
    display: flex;
    justify-content: center;
    align-items: center;
}

.border-top.border-white {
    border-color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.n-card .n-card-header) {
    padding: 12px 16px;
    border-bottom: 1px solid #dee2e6;
}

:deep(.n-card .n-card-content) {
    padding: 16px;
}

.main-content {
    overflow-y: auto;
    overflow-x: hidden;
}

.bg-light {
    background-color: #f8f9fa !important;
}

.facture-preview {
    max-height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.container-fluid {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
}

:deep(.n-card) {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
}

:deep(.n-input) {
    max-width: 100%;
}

:deep(.n-select) {
    max-width: 100%;
}

:deep(.n-date-picker) {
    max-width: 100%;
}

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
    
    .col-md-4 {
        width: 100%;
    }
    
    .card-body .d-flex.gap-2 {
        flex-wrap: wrap;
    }
    
    .card-body .d-flex.gap-2 > * {
        margin-bottom: 0.5rem;
        width: 100%;
    }
    
    .card-body .d-flex.gap-2 .n-input,
    .card-body .d-flex.gap-2 .n-select,
    .card-body .d-flex.gap-2 .n-date-picker {
        width: 100% !important;
        max-width: 100% !important;
    }
}

@media (max-width: 768px) {
    .col-md-4 {
        width: 100%;
    }
    
    .custom-subtitle {
        font-size: 1.1rem;
    }
    
    .content-wrapper {
        max-height: calc(100vh - 350px);
    }
    
    .custom-table {
        font-size: 0.85rem;
    }
    
    :deep(.n-data-table th),
    :deep(.n-data-table td) {
        padding: 8px 6px !important;
    }
}

@media (min-width: 1200px) {
    .content-wrapper {
        max-height: calc(100vh - 280px);
    }
}
</style>