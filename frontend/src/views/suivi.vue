<template>
  <div class="container-fluid py-4">
    <!-- En-tête avec bouton retour -->
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
                <i class="bi bi-cash-coin me-2"></i>
                Suivi des Paiements
              </h1>
              <p class="custom-subtitle">Gestion et suivi des transactions financières</p>
            </div>
            <div></div> <!-- Placeholder pour l'alignement -->
          </div>
        </div>
      </div>
    </div>

    <!-- Carte d'alerte pour paiements en attente -->
    <div class="row mb-4">
      <div class="col-12">
        <n-alert type="warning">
          <template #icon>
            <i class="bi bi-exclamation-triangle"></i>
          </template>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>Paiements en Attente d'Action</strong>
              <div class="small">
                Vous avez <strong>{{ pendingPayments.length }} transactions</strong> en attente de validation ou de relance.
                Montant total : <strong>{{ formatCurrency(totalPendingAmount) }}</strong>
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
              <h4 class="mb-0 text-warning">{{ pendingPayments.length }}</h4>
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
              <h4 class="mb-0 text-success">{{ validatedPayments.length }}</h4>
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
              <h4 class="mb-0 text-info">{{ formatCurrency(totalPendingAmount) }}</h4>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Section des transactions en attente -->
    <n-card class="shadow-lg mb-4" title="Transactions en Attente">
      <template #header-extra>
        <n-tag type="warning" round class="custom-tag">{{ pendingPayments.length }} en attente</n-tag>
      </template>
      
      <n-empty v-if="pendingPayments.length === 0 && !isLoading" description="Aucun paiement en attente. Votre caisse est à jour !">
        <template #icon>
          <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
        </template>
      </n-empty>
      
      <n-data-table
        v-else
        :columns="pendingColumns"
        :data="pendingPayments"
        :loading="isLoading"
        :scroll-x="1200"
        class="custom-table"
      />
    </n-card>

    <!-- Section de l'historique des transactions -->
    <n-card class="shadow-lg" title="Historique des Transactions Rapprochées">
      <template #header-extra>
        <n-tag type="info" round class="custom-tag">{{ validatedPayments.length }} validés</n-tag>
      </template>
      
      <p class="text-muted mb-3">Toutes les transactions passées et validées.</p>
      
      <div class="d-flex justify-content-between align-items-center mb-3">
        <n-space>
          <n-input
            v-model:value="searchQuery"
            placeholder="Rechercher..."
            clearable
          >
            <template #prefix>
              <i class="bi bi-search text-muted"></i>
            </template>
          </n-input>
          
          <n-select
            v-model:value="filterStatus"
            :options="statusOptions"
            placeholder="Filtrer par statut"
            clearable
            style="width: 180px"
          />
        </n-space>
        
        <n-button type="primary" @click="exportHistory" class="custom-btn-primary">
          <template #icon>
            <i class="bi bi-download"></i>
          </template>
          Exporter
        </n-button>
      </div>
      
      <n-data-table
        :columns="historyColumns"
        :data="filteredHistory"
        :loading="isLoading"
        :scroll-x="1400"
        class="custom-table"
      />
      
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
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import { 
  NButton, 
  NAlert, 
  NCard, 
  NDataTable, 
  NTag, 
  NEmpty, 
  NIcon, 
  NInput, 
  NSelect, 
  NSpace, 
  NPagination
} from 'naive-ui';
import FinanceService from '../services/FinanceService';

// --- États des Données ---
const isLoading = ref(true);
const pendingPayments = ref([]);
const validatedPayments = ref([]);

// --- États pour la recherche et filtres ---
const searchQuery = ref('');
const filterStatus = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);

// --- Options de filtre ---
const statusOptions = [
  { label: 'Effectué', value: 'Effectué' },
  { label: 'Annulé', value: 'Annulé' }
];

// --- Propriétés Calculées ---
const totalPendingAmount = computed(() => {
  return pendingPayments.value.reduce((sum, payment) => sum + (payment.montantPaie || 0), 0);
});

const filteredHistory = computed(() => {
  let filtered = validatedPayments.value;
  
  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(payment => 
      payment.numeroFacture?.toLowerCase().includes(query) ||
      (payment.nomCli && payment.nomCli.toLowerCase().includes(query)) ||
      payment.libellePaie?.toLowerCase().includes(query)
    );
  }
  
  // Filtre par statut
  if (filterStatus.value) {
    filtered = filtered.filter(payment => payment.statutPaie === filterStatus.value);
  }
  
  return filtered;
});

// --- Colonnes pour la table des paiements en attente ---
const pendingColumns = [
  {
    title: 'ID Paie',
    key: 'idPaie',
    width: 100,
    sorter: (a, b) => a.idPaie - b.idPaie
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => {
      return row.nomCli + (row.prenomCli ? ' ' + row.prenomCli : '');
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
      const type = row.modePaie?.toLowerCase();
      const colorMap = {
        'carte': 'primary',
        'virement': 'info',
        'mobilemoney': 'success',
        'cash': 'success'
      };
      return h(NTag, { 
        type: colorMap[type] || 'default', 
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.modePaie });
    }
  },
  {
    title: 'Montant',
    key: 'montantPaie',
    width: 130,
    render: (row) => h('strong', { class: 'text-success' }, formatCurrency(row.montantPaie)),
    sorter: (a, b) => a.montantPaie - b.montantPaie
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'd-flex gap-2' }, [
        h(NButton, {
          type: 'success',
          size: 'small',
          class: 'custom-btn-success',
          onClick: () => validatePayment(row.idPaie)
        }, {
          default: () => 'Valider',
          icon: () => h('i', { class: 'bi bi-check-lg' })
        }),
        h(NButton, {
          type: 'warning',
          size: 'small',
          class: 'custom-btn-warning',
          onClick: () => sendReminder(row.idPaie)
        }, {
          default: () => 'Relance',
          icon: () => h('i', { class: 'bi bi-bell' })
        })
      ]);
    }
  }
];

// --- Colonnes pour l'historique ---
const historyColumns = [
  {
    title: 'ID Paie',
    key: 'idPaie',
    width: 100,
    sorter: (a, b) => a.idPaie - b.idPaie
  },
  {
    title: 'N° Facture',
    key: 'numeroFacture',
    width: 150
  },
  {
    title: 'Client',
    key: 'client',
    width: 200,
    render: (row) => {
      return row.nomCli + (row.prenomCli ? ' ' + row.prenomCli : '');
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
      const type = row.modePaie?.toLowerCase();
      const colorMap = {
        'carte': 'primary',
        'virement': 'info',
        'mobilemoney': 'success',
        'cash': 'success'
      };
      return h(NTag, { 
        type: colorMap[type] || 'default', 
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.modePaie });
    }
  },
  {
    title: 'Montant',
    key: 'montantPaie',
    width: 130,
    render: (row) => h('strong', { class: 'text-success' }, formatCurrency(row.montantPaie)),
    sorter: (a, b) => a.montantPaie - b.montantPaie
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
      }, { default: () => row.statutPaie });
    }
  },
  {
    title: 'Location',
    key: 'idLo',
    width: 100,
    render: (row) => h('span', { class: 'text-muted' }, `LO-${row.idLo}`)
  }
];

// --- Fonctions de Chargement ---
const fetchPaymentData = async () => {
  isLoading.value = true;
  try {
    const response = await FinanceService.getPaymentData();
    const data = response.data;
    
    pendingPayments.value = data.pendingPayments || [];
    validatedPayments.value = data.validatedPayments || [];
    
  } catch (error) {
    console.error("Erreur lors du chargement des données de paiement:", error);
    alert("Erreur lors du chargement des données");
  } finally {
    isLoading.value = false;
  }
};

// --- Fonctions d'Action ---
const validatePayment = async (paymentId) => {
  if (!confirm(`Confirmez-vous la validation du paiement ${paymentId} ?`)) return;
  
  try {
    await FinanceService.validatePayment(paymentId);
    alert(`Paiement ${paymentId} validé et rapproché.`);
    await fetchPaymentData();
  } catch (error) {
    console.error(`Erreur lors de la validation du paiement ${paymentId}:`, error);
    alert("Erreur lors de la validation");
  }
};

const sendReminder = async (paymentId) => {
  if (!confirm(`Confirmez-vous l'envoi d'une relance pour le paiement ${paymentId} ?`)) return;

  try {
    await FinanceService.sendPaymentReminder(paymentId);
    alert(`Relance envoyée pour le paiement ${paymentId}.`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de la relance pour le paiement ${paymentId}:`, error);
    alert("Erreur lors de la relance");
  }
};

const exportHistory = () => {
  alert("Fonctionnalité d'export à implémenter");
  // Implémentez ici la logique d'export (CSV, Excel, PDF)
};

// --- Fonctions Utilitaires ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// --- Initialisation ---
onMounted(() => {
  fetchPaymentData();
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

.custom-btn-success {
  background: #28a745;
  border-color: #28a745;
}

.custom-btn-warning {
  background: #ffc107;
  border-color: #ffc107;
}

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
}
</style>