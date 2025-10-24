<!--<template>
  <div class="p-4">
    <h1>Calendrier🛎️</h1>
    <p>Vue d'ensemble </p>
    </div>
</template>
<script setup>
// Logique Réception
</script>-->

<template>
  <div class="container-fluid py-4">
   <div class="retour">
    <router-link to="/dashboardReception" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
    <div class="row">
      <div class="col-12">
        <h1 class="h3 mb-4 text-dark">Facturation & Génération Automatique</h1>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0 text-dark">
          <i class="bi bi-clock-history me-2"></i> Locations à Facturer
        </h5>
        <button 
            @click="triggerAutomaticGeneration" 
            :disabled="locationsToInvoice.length === 0 || isGenerating"
            :class="['btn', 'btn-lg', isGenerating ? 'btn-secondary' : 'btn-success']"
        >
          <span v-if="isGenerating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isGenerating ? 'Génération en cours...' : `Générer ${locationsToInvoice.length} Factures` }}
        </button>
      </div>
      
      <div class="card-body">
        <p class="text-muted">Liste des contrats de location dont la date de fin est passée et qui n'ont pas encore de facture associée.</p>
        
        <div v-if="locationsToInvoice.length === 0 && !isLoading" class="alert alert-info text-center">
            Aucune location terminée n'est en attente de facturation. Tout est à jour !
        </div>
        
        <table v-else class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Contrat ID</th>
              <th>Client</th>
              <th>Date de Fin</th>
              <th>Jours de Retard</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="location in locationsToInvoice" :key="location.id">
              <td>{{ location.id }}</td>
              <td>{{ location.client }}</td>
              <td>{{ formatDate(location.endDate) }}</td>
              <td :class="{'text-danger fw-bold': location.daysLate > 0}">
                {{ location.daysLate }} jours
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white border-bottom">
        <h5 class="card-title mb-0 text-dark">
          <i class="bi bi-file-earmark-check me-2"></i> Factures Prêtes à être Envoyées ({{ invoicesToSend.length }})
        </h5>
        <p class="text-muted small mb-0">Ces factures ont été générées automatiquement. Vérifiez les montants et déclenchez l'envoi.</p>
      </div>
      <div class="card-body">
        <div v-if="invoicesToSend.length === 0" class="alert alert-warning text-center">
            Aucune facture en cours de préparation.
        </div>
        <table v-else class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Facture ID</th>
              <th>Client</th>
              <th>Montant Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoicesToSend" :key="invoice.id">
              <td>{{ invoice.id }}</td>
              <td>{{ invoice.client }}</td>
              <td class="fw-bold">{{ formatCurrency(invoice.amount) }}</td>
              <td>
                <span class="badge bg-success">Générée</span>
              </td>
              <td>
                <button @click="viewInvoice(invoice.id)" class="btn btn-sm btn-outline-info me-2">
                  <i class="bi bi-eye"></i> Voir
                </button>
                <button @click="sendInvoiceEmail(invoice.id)" class="btn btn-sm cedii-btn-primary">
                  <i class="bi bi-send-fill"></i> Envoyer Email
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="card shadow-sm">
      <div class="card-header bg-white border-bottom">
        <h5 class="card-title mb-0 text-dark">
          <i class="bi bi-list-ul me-2"></i> Historique des Factures Envoyées
        </h5>
      </div>
      <div class="card-body">
         <p class="text-muted small">Toutes les factures qui ont été transmises aux clients.</p>
         <div class="text-center text-muted p-3 border rounded">
             [Tableau de l'historique complet avec recherche/pagination]
         </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 🚨 Assurez-vous d'avoir ce service qui communique avec votre backend
import FinanceService from '../services/FinanceService'; 


// --- États des Données ---
const isLoading = ref(true);
const isGenerating = ref(false);
const locationsToInvoice = ref([]);
const invoicesToSend = ref([]);

// --- Fonctions de Chargement ---

/**
 * Charge les locations terminées à facturer et les factures prêtes à l'envoi.
 */
const fetchFacturationData = async () => {
    isLoading.value = true;
    try {
        const response = await FinanceService.getFacturationData();
        const data = response.data;
        
        locationsToInvoice.value = data.locationsToInvoice || [];
        invoicesToSend.value = data.invoicesReadyToSend || [];
        
    } catch (error) {
        console.error("Erreur lors du chargement des données de facturation:", error);
    } finally {
        isLoading.value = false;
    }
};


// --- Fonctions d'Action ---

/**
 * Déclenche la génération automatique des factures côté backend.
 */
const triggerAutomaticGeneration = async () => {
    if (locationsToInvoice.value.length === 0 || isGenerating.value) return;
    
    isGenerating.value = true;
    try {
        // 🚨 Cet endpoint doit être créé dans votre financeController.js
        const response = await FinanceService.generateInvoices(); 
        alert(response.data.message || `${locationsToInvoice.value.length} factures générées avec succès.`);
        
        // Rafraîchir les données après la génération
        await fetchFacturationData(); 
        
    } catch (error) {
        console.error("Erreur lors de la génération automatique:", error);
        alert("Erreur lors de la génération des factures. Vérifiez la console.");
    } finally {
        isGenerating.value = false;
    }
};

/**
 * Envoie un email de facture à un client spécifique.
 */
const sendInvoiceEmail = async (invoiceId) => {
    // 🚨 Cet endpoint doit être créé dans votre financeController.js
    if(confirm(`Confirmez-vous l'envoi par email de la facture ${invoiceId} ?`)){
        try {
            await FinanceService.sendInvoice(invoiceId);
            alert(`Facture ${invoiceId} envoyée avec succès.`);
            await fetchFacturationData(); // Rafraîchir
        } catch (error) {
             console.error(`Erreur lors de l'envoi de la facture ${invoiceId}:`, error);
             alert("Erreur lors de l'envoi. Vérifiez la console.");
        }
    }
};

/**
 * Affiche les détails d'une facture (ou redirige vers la page de modification).
 */
const viewInvoice = (invoiceId) => {
    // Rediriger vers une route de détail/modification de facture
    // router.push({ name: 'FactureDetails', params: { id: invoiceId } });
    alert(`Afficher les détails de la facture ${invoiceId} (à implémenter)`);
};


// --- Fonctions Utilitaires ---

const formatCurrency = (value) => {
    const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(numValue);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
};


// --- Initialisation ---
onMounted(() => {
    fetchFacturationData();
});
</script>

<style scoped>
/* Style pour le bouton principal de génération */
.btn-success {
    background-color: #28a745;
    border-color: #28a745;
    transition: all 0.3s;
}
.retour{
  float: right;
}
.btn-success:hover {
     background-color: #218838;
     border-color: #1e7e34;
}
.cedii-btn-primary { 
    background-color: #5B11EE;
    color: white;
    border-color: #5B11EE;
}
.cedii-btn-primary:hover {
    background-color: #0405BF;
    border-color: #0405BF;
}
</style>