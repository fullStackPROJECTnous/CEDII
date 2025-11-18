<template>
  <div class="container-fluid py-4">
    <!-- En-tête avec bouton retour -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0 text-dark fw-bold">Suivi des Paiements</h1>
      <n-button type="primary" ghost @click="$router.push('/dashboardFinance')">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
          </n-icon>
        </template>
        Retour à l'Accueil
      </n-button>
    </div>

    <!-- Carte d'alerte pour paiements en attente -->
    <n-alert title="Paiements en Attente d'Action" type="warning" class="mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <p class="mb-0">
            Vous avez <strong>{{ pendingPayments.length }} transactions</strong> en attente de validation ou de relance.
          </p>
          <p class="mb-0">
            Montant total : <strong>{{ formatCurrency(totalPendingAmount) }}</strong>
          </p>
        </div>
        <n-button type="warning" @click="$router.push({ name: 'FactureGene' })">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
              </svg>
            </n-icon>
          </template>
          Voir les Factures en Retard
        </n-button>
      </div>
    </n-alert>

    <!-- Section des transactions en attente -->
    <n-card title="Transactions en Attente" class="mb-4">
      <template #header-extra>
        <n-tag type="warning" round>{{ pendingPayments.length }} en attente</n-tag>
      </template>
      
      <n-empty v-if="pendingPayments.length === 0 && !isLoading" description="Aucun paiement en attente. Votre caisse est à jour !">
        <template #icon>
          <n-icon size="60" color="#28a745">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
          </n-icon>
        </template>
      </n-empty>
      
      <n-data-table
        v-else
        :columns="pendingColumns"
        :data="pendingPayments"
        :loading="isLoading"
        :scroll-x="1200"
        class="payment-table"
      />
    </n-card>

    <!-- Section de l'historique des transactions -->
    <n-card title="Historique des Transactions Rapprochées">
      <template #header-extra>
        <n-tag type="info" round>{{ validatedPayments.length }} validés</n-tag>
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
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </n-icon>
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
        
        <n-button type="primary" @click="exportHistory">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
            </n-icon>
          </template>
          Exporter
        </n-button>
      </div>
      
      <n-data-table
        :columns="historyColumns"
        :data="filteredHistory"
        :loading="isLoading"
        :scroll-x="1400"
        class="history-table"
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
      return h(NTag, { type: colorMap[type] || 'default', size: 'small' }, { default: () => row.modePaie });
    }
  },
  {
    title: 'Montant',
    key: 'montantPaie',
    width: 130,
    render: (row) => formatCurrency(row.montantPaie),
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
          onClick: () => validatePayment(row.idPaie)
        }, {
          default: () => 'Valider',
          icon: () => h(NIcon, null, {
            default: () => h('svg', { 
              xmlns: 'http://www.w3.org/2000/svg', 
              width: '12', 
              height: '12', 
              fill: 'currentColor', 
              viewBox: '0 0 16 16'
            }, [
              h('path', { d: 'M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z' })
            ])
          })
        }),
        h(NButton, {
          type: 'warning',
          size: 'small',
          onClick: () => sendReminder(row.idPaie)
        }, {
          default: () => 'Relance',
          icon: () => h(NIcon, null, {
            default: () => h('svg', { 
              xmlns: 'http://www.w3.org/2000/svg', 
              width: '12', 
              height: '12', 
              fill: 'currentColor', 
              viewBox: '0 0 16 16'
            }, [
              h('path', { d: 'M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z' })
            ])
          })
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
      return h(NTag, { type: colorMap[type] || 'default', size: 'small' }, { default: () => row.modePaie });
    }
  },
  {
    title: 'Montant',
    key: 'montantPaie',
    width: 130,
    render: (row) => formatCurrency(row.montantPaie),
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
      return h(NTag, { type: typeMap[row.statutPaie] || 'default', size: 'small' }, { default: () => row.statutPaie });
    }
  },
  {
    title: 'Location',
    key: 'idLo',
    width: 100,
    render: (row) => `LO-${row.idLo}`
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
/* Styles spécifiques pour l'interface CEDII */
:deep(.n-card-header) {
  border-bottom: 1px solid #e9ecef;
}

:deep(.payment-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
}

:deep(.history-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Adaptation de la palette CEDII */
:deep(.n-button--primary-type) {
  background-color: #04058f;
  border-color: #04058f;
}

:deep(.n-button--primary-type:hover) {
  background-color: #02061e;
  border-color: #02061e;
}

:deep(.n-tag--warning-type) {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

:deep(.n-alert--warning-type) {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.d-flex.gap-2 {
  gap: 8px;
}
</style>