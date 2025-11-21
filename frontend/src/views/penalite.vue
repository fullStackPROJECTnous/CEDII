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
                <i class="bi bi-exclamation-octagon-fill me-2"></i>
                Suivi des Pénalités et Litiges
              </h1>
              <p class="custom-subtitle">Gestion des retards de paiement et litiges clients</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistiques résumées -->
    <div class="row mb-4">
      <div class="col-xl-3 col-md-6 mb-3">
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
      <div class="col-xl-3 col-md-6 mb-3">
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
      <div class="col-xl-3 col-md-6 mb-3">
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
      <div class="col-xl-3 col-md-6 mb-3">
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
          <n-button type="primary" @click="fetchPenalitesData" class="custom-btn-primary">
            <template #icon>
              <i class="bi bi-arrow-clockwise"></i>
            </template>
            Actualiser
          </n-button>
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

      <!-- Table des pénalités -->
      <n-data-table
        v-else
        :columns="penalitesColumns"
        :data="penalitesList"
        :scroll-x="1400"
        class="custom-table"
        :row-class-name="rowClassName"
      />
    </n-card>

    <!-- Section Litiges Manuels -->
    <n-card class="shadow-lg" title="Litiges de Location">
      <template #header-extra>
        <n-tag type="warning" class="custom-tag">Manuel</n-tag>
      </template>

      <n-alert type="warning">
        Zone pour le suivi des litiges manuels ou des dommages matériels nécessitant une intervention spécifique.
      </n-alert>

      <div class="text-center p-4 border rounded">
        <i class="bi bi-tools" style="font-size: 3rem; color: #6c757d;"></i>
        <p class="text-muted mb-3">Interface de gestion des litiges en cours de développement</p>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, h, computed } from 'vue';
import { 
  NButton, 
  NCard, 
  NDataTable, 
  NTag, 
  NEmpty, 
  NIcon, 
  NAlert,
  NSpin,
  NSpace
} from 'naive-ui';
import FinanceService from '@/services/FinanceService';

// --- Variables d'état ---
const penalitesList = ref([]);
const isLoading = ref(true);

// --- Propriétés calculées ---
const totalBaseAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.baseAmount || 0), 0);
});

const totalPenalties = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.penaltyAmount || 0), 0);
});

const totalFinalAmount = computed(() => {
  return penalitesList.value.reduce((sum, item) => sum + parseFloat(item.finalAmount || 0), 0);
});

// --- Colonnes pour le tableau des pénalités ---
const penalitesColumns = [
  {
    title: 'ID Location',
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
          onClick: () => sendReminderEmail(row.id, row.client)
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

// --- Fonctions utilitaires ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value || 0);
};

const rowClassName = (row, index) => {
  return row.daysLate > 7 ? 'table-row-critical' : 'table-row-warning';
};

// --- Logique d'appel API ---
const fetchPenalitesData = async () => {
  isLoading.value = true;
  try {
    if (typeof FinanceService.getPenalitesData === 'function') {
      const response = await FinanceService.getPenalitesData();
      
      penalitesList.value = response.data.map(item => ({
        id: item.idLo || item.id,
        client: item.client || `${item.nomCli} ${item.prenomCli}`,
        email: item.emailCli,
        daysLate: item.daysLate || 0,
        baseAmount: item.baseAmount || item.tarifTot || 0,
        penaltyAmount: item.penaltyAmount || calculatePenalty(item),
        finalAmount: item.finalAmount || (parseFloat(item.baseAmount || item.tarifTot || 0) + parseFloat(item.penaltyAmount || calculatePenalty(item)))
      }));
    } else {
      console.warn('Méthode getPenalitesData non disponible, utilisation des données de démonstration');
      penalitesList.value = getDemoData();
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données de pénalités:", error);
    penalitesList.value = getDemoData();
    alert("Chargement des données de démonstration - Vérifiez la connexion API");
  } finally {
    isLoading.value = false;
  }
};

// Fonction de calcul de pénalité
const calculatePenalty = (item) => {
  const baseAmount = parseFloat(item.baseAmount || item.tarifTot || 0);
  const daysLate = item.daysLate || 0;
  const penaltyRate = 0.01;
  
  return baseAmount * penaltyRate * daysLate;
};

// Données de démonstration
const getDemoData = () => {
  return [
    {
      id: 1,
      client: "Miary Ma",
      email: "cecette@gmail.com",
      daysLate: 5,
      baseAmount: 250000,
      penaltyAmount: 12500,
      finalAmount: 262500
    },
    {
      id: 2,
      client: "danie rarie", 
      email: "rariedanie@gmail.com",
      daysLate: 12,
      baseAmount: 50000,
      penaltyAmount: 6000,
      finalAmount: 56000
    },
    {
      id: 3,
      client: "daniella rari",
      email: "elle@gmail.com", 
      daysLate: 3,
      baseAmount: 7000,
      penaltyAmount: 210,
      finalAmount: 7210
    },
    {
      id: 4,
      client: "SARL Tech Solutions",
      email: "contact@techsolutions.mg",
      daysLate: 8,
      baseAmount: 150000,
      penaltyAmount: 12000,
      finalAmount: 162000
    }
  ];
};

const sendReminderEmail = async (idLo, clientName) => {
  if (!confirm(`Confirmer l'envoi d'un email de relance au client ${clientName} pour la location #${idLo} ?`)) {
    return;
  }
  
  try {
    const response = await FinanceService.sendPaymentReminder(idLo);
    alert(response.data.message || "Relance envoyée avec succès");
    await fetchPenalitesData();
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Erreur serveur lors de l'envoi de la relance.";
    alert(`Échec de l'envoi de la relance: ${errorMessage}`);
    console.error(error);
  }
};

const viewDetails = (locationId) => {
  const location = penalitesList.value.find(item => item.id === locationId);
  if (location) {
    const message = `
Détails de la location #${locationId}:

Client: ${location.client}
Jours de retard: ${location.daysLate} jours
Montant initial: ${formatCurrency(location.baseAmount)}
Frais de retard (1%/jour): ${formatCurrency(location.penaltyAmount)}
Total à payer: ${formatCurrency(location.finalAmount)}
    `;
    alert(message);
  }
};

// --- Initialisation ---
onMounted(() => {
  fetchPenalitesData();
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

/* Styles pour les lignes critiques */
:deep(.table-row-critical) {
  background-color: #f8d7da !important;
}

:deep(.table-row-warning) {
  background-color: #fff3cd !important;
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

/* Styles pour les tables */
:deep(.n-data-table .n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
}

.d-flex.gap-2 {
  gap: 8px;
}
</style>