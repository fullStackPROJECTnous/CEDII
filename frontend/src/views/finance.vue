<template>
    <div class="retour">
     <router-link to="/dashboardAdmin" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="finance-management p-3 bg-white rounded shadow-sm">
    <h3 class="mb-4">Gestion Financière & Suivi des Locations</h3>
    
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>N° Fact. Virt.</th>
            <th>Client</th>
            <th>Location Réf. (ID)</th>
            <th>Montant Total</th>
            <th>Montant Dû Initial</th>
            <th>Pénalité (Calculée)</th>
            <th>Total à Payer</th>
            <th>Statut Financier</th>
            <th>Échéance (Fin Loc.)</th>
            <th>Retard (Jours)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="suivi in locationsSuivi" :key="suivi.idLo" 
              :class="{'table-danger': suivi.joursRetard > 0}">
            
            <td>{{ suivi.numeroFacture }}</td>
            <td>{{ getClientName(suivi) }}</td> 
            <td>{{ suivi.idLo }}</td>
            <td>{{ formatCurrency(suivi.montantTotal) }}</td>
            <td>{{ formatCurrency(suivi.montantDuInitial) }}</td>
            
            <td :class="{'text-danger fw-bold': suivi.montantPenalite > 0}">
                {{ formatCurrency(suivi.montantPenalite) }}
            </td>
            <td class="fw-bold">{{ formatCurrency(suivi.montantTotalDu) }}</td>

            <td><span :class="getStatusBadge(suivi.statutFinancier)">{{ suivi.statutFinancier }}</span></td>
            <td>{{ formatDate(suivi.dateEcheance) }}</td>
            <td>
                <span v-if="suivi.joursRetard > 0" class="badge bg-danger">
                    {{ suivi.joursRetard }} Jours
                </span>
                <span v-else class="badge bg-success">À Jour</span>
            </td>
            <td>
              <button class="btn btn-sm btn-success me-2" 
                      @click="openPaiementModal(suivi)">
                  <i class="bi bi-wallet2"></i> Payer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FinanceService from '../services/FinanceService';

const locationsSuivi = ref([]);

const fetchLocationsSuivi = async () => {
    try {
        const response = await FinanceService.getLocationsSuivi();
        locationsSuivi.value = response.data;
    } catch (error) {
        console.error("Erreur de chargement du suivi financier:", error);
    }
};

onMounted(fetchLocationsSuivi);

// --- Fonctions d'affichage ---

const formatCurrency = (value) => {
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return '0,00 MGA';
    return `${value.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
};

const getStatusBadge = (statut) => {
    if (statut === 'Payée') return 'badge bg-success';
    if (statut === 'Partiellement Payée') return 'badge bg-warning text-dark';
    if (statut === 'Émise (Non Payée)') return 'badge bg-info';
    return 'badge bg-secondary';
};

const getClientName = (suivi) => {
    try {
        const client = suivi.Client;
        return `${client.nomCli} ${client.prenomCli || ''}`;
    } catch (e) {
        return 'N/A';
    }
};

// --- Logique d'interaction ---

const openPaiementModal = async (suivi) => {
    
    const montantTotalDu = suivi.montantTotalDu;
    
    const montantPaye = prompt(`
        Enregistrement de paiement pour la Location Réf. ${suivi.idLo}.
        Montant total à régler (incluant pénalités): ${formatCurrency(montantTotalDu)}.
        
        Entrez le montant reçu:
    `, montantTotalDu.toFixed(2));

    if (montantPaye && !isNaN(parseFloat(montantPaye))) {
        const modePaie = prompt("Méthode de paiement (Cash, Virement, MobileMoney, Carte):");

        try {
            await FinanceService.recordPaiement(suivi.idLo, {
                montantPaye: parseFloat(montantPaye),
                modePaie: modePaie 
            });
            alert("Paiement enregistré et statut mis à jour avec succès!");
            fetchLocationsSuivi(); 
        } catch (error) {
            alert(`Erreur lors de l'enregistrement du paiement: ${error.response?.data?.message || error.message}`);
            console.error(error);
        }
    }
};
</script>
<style>
.retour{
    float: right;
}
</style>