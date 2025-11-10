
<template>
  <div class="container-fluid py-4">
   <div class="retour">
    <router-link to="/dashboardFinance" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
    <div class="row">
      <div class="col-12">
        <h1 class="h3 mb-4 text-dark">Suivi des Paiements</h1>
      </div>
    </div>

    <div class="card shadow-sm mb-4 bg-warning-subtle border-warning">
        <div class="card-body d-flex justify-content-between align-items-center">
            <div>
                <h5 class="card-title mb-0 text-dark">
                    <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i> Paiements en Attente d'Action
                </h5>
                <p class="text-muted small mb-0">
                    Vous avez **{{ pendingPayments.length }} transactions** en attente de validation ou de relance. Montant total : 
                    <span class="fw-bold text-dark">{{ formatCurrency(totalPendingAmount) }}</span>
                </p>
            </div>
            <router-link :to="{ name: 'FactureGene' }" class="btn btn-sm btn-warning">
                Voir les Factures en Retard
            </router-link>
        </div>
    </div>

    <div class="card shadow-sm mb-5">
      <div class="card-header bg-white border-bottom">
        <h5 class="card-title mb-0 text-dark">
          <i class="bi bi-hourglass-split me-2"></i> Liste des Transactions en Attente
        </h5>
      </div>
      
      <div class="card-body p-0">
        <div v-if="pendingPayments.length === 0 && !isLoading" class="alert alert-success m-3 text-center">
            Aucun paiement en attente. Votre caisse est à jour !
        </div>
        
        <table v-else class="table table-striped table-hover mb-0">
          <thead>
            <tr>
              <th>ID Paie</th>
              <th>Client</th>
              <th>Date Transaction</th>
              <th>Méthode</th>
              <th>Montant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in pendingPayments" :key="payment.id">
              <td>{{ payment.id }}</td>
              <td>{{ payment.client }}</td>
              <td>{{ formatDate(payment.date) }}</td>
              <td><span :class="getMethodBadge(payment.method)">{{ payment.method }}</span></td>
              <td class="fw-bold">{{ formatCurrency(payment.amount) }}</td>
              <td>
                <button @click="validatePayment(payment.id)" class="btn btn-sm btn-success me-2">
                  <i class="bi bi-check-lg"></i> Valider
                </button>
                <button @click="sendReminder(payment.id)" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-bell"></i> Relance
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0 text-dark">
          <i class="bi bi-list-ul me-2"></i> Historique des Transactions Rapprochées
        </h5>
       
      </div>
      
      <div class="card-body">
         <p class="text-muted small">Toutes les transactions passées et validées. Total : {{ validatedPayments.length }} paiements.</p>
         
         <div class="text-center text-muted p-5 border rounded">
             [Tableau de l'historique complet des paiements validés (avec recherche/filtres)]
         </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import FinanceService from '../services/FinanceService'; // Votre service API

// --- États des Données ---
const isLoading = ref(true);
const allTransactions = ref([]); // Toutes les transactions chargées
const pendingPayments = ref([]); // Transactions en attente de validation
const validatedPayments = ref([]); // Transactions validées

// --- Propriétés Calculées ---

const totalPendingAmount = computed(() => {
    // Calcule la somme des montants des paiements en attente
    return pendingPayments.value.reduce((sum, payment) => sum + (payment.amount || 0), 0);
});


// --- Fonctions de Chargement ---

/**
 * Charge toutes les données de suivi des paiements depuis le backend.
 */
const fetchPaymentData = async () => {
    isLoading.value = true;
    try {
        // 🚨 Il faut créer la route /api/finance/payments dans financeRoutes.js
        const response = await FinanceService.getPaymentData(); 
        const data = response.data;
        
        // Mettre à jour les listes
        pendingPayments.value = data.pendingPayments || [];
        validatedPayments.value = data.validatedPayments || [];
        
    } catch (error) {
        console.error("Erreur lors du chargement des données de paiement:", error);
    } finally {
        isLoading.value = false;
    }
};

// --- Fonctions d'Action ---

const validatePayment = async (paymentId) => {
    if(!confirm(`Confirmez-vous la validation du paiement ${paymentId} ?`)) return;
    
    try {
        // 🚨 Cet endpoint doit être créé dans votre financeController.js
        await FinanceService.validatePayment(paymentId);
        alert(`Paiement ${paymentId} validé et rapproché.`);
        await fetchPaymentData(); // Rafraîchir
    } catch (error) {
        console.error(`Erreur lors de la validation du paiement ${paymentId}:`, error);
        alert("Erreur lors de la validation. Vérifiez la console.");
    }
};

const sendReminder = async (paymentId) => {
     if(!confirm(`Confirmez-vous l'envoi d'une relance pour le paiement ${paymentId} ?`)) return;

    try {
        // 🚨 Cet endpoint doit être créé dans votre financeController.js
        await FinanceService.sendPaymentReminder(paymentId);
        alert(`Relance envoyée pour le paiement ${paymentId}.`);
    } catch (error) {
        console.error(`Erreur lors de l'envoi de la relance pour le paiement ${paymentId}:`, error);
        alert("Erreur lors de la relance. Vérifiez la console.");
    }
};

// --- Fonctions Utilitaires ---

const formatCurrency = (value) => {
    // Le 'fr-FR' assure que le séparateur décimal est une virgule et que l'espacement est correct.
    // La devise est changée en 'MGA'.
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
};

const getMethodBadge = (method) => {
    const base = 'badge text-light ';
    switch (method.toLowerCase()) {
        case 'carte': return base + 'bg-primary';
        case 'virement': return base + 'bg-info';
        case 'chèque': return base + 'bg-secondary';
        case 'espèce': return base + 'bg-success';
        default: return base + 'bg-dark';
    }
};

// --- Initialisation ---
onMounted(() => {
    fetchPaymentData();
});
</script>

<style scoped>
/* Les styles spécifiques (méthode de paiement) */
.bg-warning-subtle {
    background-color: #fff3cd !important;
}
.border-warning {
    border-color: #ffc107 !important;
}
.retour{
  float: right;
}
</style>