<!--<template>
  <div class="p-4">
    <h1>Calendrier🛎️</h1>
    <p>Vue d'ensemble </p>
    </div>
</template>
<script setup>
// Logique Réception
</script>


<script setup>
import { ref, onMounted } from 'vue';
// 💡 Assurez-vous d'importer votre service API réel
import FinanceService from '@/services/FinanceService'; 

// 1. Variable réactive pour stocker le nombre de litiges
const litigeCount = ref(0);

// 2. Fonction pour récupérer le compte
const fetchLitigeCount = async () => {
    try {
        // Cet appel utilise la route /api/finance/litigation-count que nous allons définir.
        const response = await FinanceService.getLitigationCount();
        litigeCount.value = parseInt(response.data.count) || 0;
    } catch (error) {
        console.error("Erreur lors de la récupération du compte de litiges:", error);
        litigeCount.value = 0; // Réinitialiser en cas d'erreur
    }
};

// 3. Exécuter la fonction au montage du composant
onMounted(() => {
    fetchLitigeCount();
});
</script>

<template>
    <ul class="nav flex-column mb-auto">
        
        <li class="nav-item mb-2">
            <router-link :to="{ name: 'PenaliteLiti' }" class="nav-link text-white">
                <i class="bi bi-exclamation-octagon-fill me-2"></i> **Pénalités & Litiges**
                <span v-if="litigeCount > 0" class="badge rounded-pill bg-danger ms-auto">{{ litigeCount }}</span>
            </router-link>
        </li>

        </ul>
</template>

<style scoped>
/* Styles spécifiques au menu de navigation si nécessaire */
.nav-link {
    display: flex; /* Assure que le badge va à droite */
    align-items: center;
    padding: 0.5rem 1rem;
    color: #fff; /* Assurer que le texte est blanc */
    text-decoration: none;
    transition: background-color 0.2s;
}
.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}
.ms-auto {
    margin-left: auto !important; /* Force le badge à droite */
}
</style>-->

<script setup>
import { ref, onMounted } from 'vue';
// 💡 Assurez-vous d'importer votre service API réel
import FinanceService from '@/services/FinanceService'; 

// --- Variables d'état ---
const penalitesList = ref([]);
const isLoading = ref(true);

// --- Fonctions utilitaires ---

// Fonction pour formater en Malagasy Ariary (MGA)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value);
};


// --- Logique d'appel API et d'action ---

const fetchPenalitesData = async () => {
    isLoading.value = true;
    try {
        // 1. Appel au backend pour récupérer la liste
        const response = await FinanceService.getPenalitesList();
        penalitesList.value = response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données de pénalités:", error);
        // Afficher un message d'erreur si l'API échoue (code 500)
    } finally {
        isLoading.value = false;
    }
};

const sendReminderEmail = async (idLo, clientName) => {
    if (!confirm(`Confirmer l'envoi d'un email de relance au client ${clientName} pour la location #${idLo}?`)) {
        return;
    }
    
    try {
        // 2. Appel au backend pour l'envoi de relance (Utilise la route /send-reminder/:idLo)
        const response = await FinanceService.sendPaymentReminder(idLo);
        
        alert(response.data.message);
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erreur serveur lors de l'envoi de la relance.";
        alert(`Échec de l'envoi de la relance: ${errorMessage}`);
        console.error(error);
    }
};


// --- Montage ---
onMounted(() => {
    fetchPenalitesData();
});
</script>

<template>
    <div class="container-fluid">
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800"><i class="bi bi-exclamation-octagon-fill me-2 text-danger"></i> Suivi des Pénalités et Litiges</h1>
        </div>

        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-danger">Locations Terminées & Impayées (avec Pénalités)</h6>
                <p class="text-muted small mb-0">Liste des factures en retard de paiement générant des pénalités journalières (1% du montant initial par jour).</p>
            </div>
            
            <div class="card-body">
                <div v-if="isLoading" class="text-center p-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Chargement...</span>
                    </div>
                    <p class="mt-2 text-muted">Chargement des données...</p>
                </div>

                <div v-else-if="penalitesList.length === 0" class="alert alert-success text-center">
                    <i class="bi bi-check-circle me-2"></i> Aucune pénalité de retard de paiement détectée. Tout est à jour !
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>ID Location</th>
                                <th>Client</th>
                                <th>Jours de Retard</th>
                                <th>Montant Initial</th>
                                <th>Pénalités</th>
                                <th>Montant Total Dû</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in penalitesList" :key="item.id">
                                <td class="fw-bold">{{ item.id }}</td>
                                <td>{{ item.client }}</td>
                                <td class="text-danger fw-bold">{{ item.daysLate }} jours</td>
                                <td>{{ formatCurrency(item.baseAmount) }}</td>
                                <td class="text-warning">{{ formatCurrency(item.penaltyAmount) }}</td>
                                <td class="fw-bolder text-primary">{{ formatCurrency(item.finalAmount) }}</td>
                                <td>
                                    <button 
                                        class="btn btn-sm btn-outline-danger"
                                        @click="sendReminderEmail(item.id, item.client)">
                                        <i class="bi bi-bell-fill"></i> Envoyer Relance
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="card shadow mb-4 mt-5">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-secondary">Litiges de Location (Cas Manuels)</h6>
            </div>
            <div class="card-body">
                <div class="text-center text-muted p-5">
                    <i class="bi bi-hammer me-2"></i> Zone pour le suivi des litiges manuels ou des dommages matériels.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ajoutez des styles Bootstrap supplémentaires si nécessaire, basés sur votre thème */
.text-danger {
    color: #e74a3b !important;
}
.text-warning {
    color: #f6c23e !important;
}
.text-primary {
    color: #4e73df !important;
}
</style>
