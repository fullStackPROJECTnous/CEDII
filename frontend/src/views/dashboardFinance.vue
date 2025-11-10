


<template>
  <div class="d-flex vh-100"> 

    <nav class="sidebar cedii-bg-dark text-white p-3 shadow d-flex flex-column">
      <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2"> 
        <h4 class="cedii-text-primary mb-0">CEDII Finance</h4>
      </div>
      
      <ul class="nav flex-column mb-auto">
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'FinanceDashboard'}" class="nav-link text-white active">
            <i class="bi bi-wallet-fill me-2"></i> Tableau de Bord
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'FactureGene' }" class="nav-link text-white">
            <i class="bi bi-file-earmark-text me-2"></i> *Facturation & Génération*
            <span class="badge rounded-pill bg-info text-dark ms-auto">{{ invoicesToProcess }}</span>
          </router-link>
        </li>
        
        <li class="nav-item mb-2">
          <router-link :to="{ name: 'SuiviPaie' }" class="nav-link text-white">
            <i class="bi bi-cash-stack me-2"></i> *Suivi des Paiements*
            <span class="badge rounded-pill bg-warning text-dark ms-auto">{{ pendingPaymentsCount }}</span>
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'PenaliteLiti' }" class="nav-link text-white">
            <i class="bi bi-exclamation-octagon-fill me-2"></i> *Pénalités & Litiges*
            <span class="badge rounded-pill bg-danger ms-auto">{{ litigeCount }}</span>
          </router-link>
        </li>

        <li class="nav-item mb-2">
          <router-link :to="{ name: 'RapportSynth' }" class="nav-link text-white">
            <i class="bi bi-graph-up me-2"></i> Rapports & Synthèse
          </router-link>
        </li>
        
      </ul>
      
      <div class="mt-auto pt-3 border-top">
        <button @click="logout" class="btn btn-sm btn-danger w-100">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </nav>


    <main class="main-content flex-grow-1 overflow-auto bg-light"> 
      
      <header class="d-flex justify-content-between align-items-center p-4 pb-0">
        <h1 class="text-secondary mb-0">Espace Financier 💰</h1>
        <small class="text-muted">Rôle: {{ userRole }}</small>
      </header>
      
      <div class="p-4">
        
        <div class="alert alert-danger shadow-sm border-2 border-danger" role="alert" v-if="litigeCount > 0">
            <i class="bi bi-exclamation-circle-fill me-2"></i> 
            **ATTENTION :** **{{ litigeCount }}** dossiers de pénalités ou dégradations requièrent votre action. Traitez-les pour déclencher les calculs de jours de retard.
        </div>
        
        <div class="row mb-5">
            <div class="col-md-3 mb-4">
                <KpiCard 
                    icon="bi-file-earmark-plus" 
                    title="Factures à Générer" 
                    :value="invoicesToProcess" 
                    trend="Automatique" 
                    color="text-info"
                    linkName="FacturationGeneration"
                />
            </div>
            <div class="col-md-3 mb-4">
                <KpiCard 
                    icon="bi-hourglass-split" 
                    title="Paiements en Attente" 
                    :value="pendingPaymentsCount" 
                    :trend="`Montant: ${formatCurrency(kpis.pendingAmount)}`" 
                    color="text-warning"
                    linkName="SuiviPaiements"
                />
            </div>
            <div class="col-md-3 mb-4">
                <KpiCard 
                    icon="bi-receipt" 
                    title="Jours de Retard (Moy.)" 
                    :value="kpis.avgDaysLate" 
                    trend="Tendance : -2 jours" 
                    color="text-danger"
                    linkName="PenalitesLitiges"
                />
            </div>
            <div class="col-md-3 mb-4">
                <KpiCard 
                    icon="bi-currency-euro" 
                    title="Paiements Automatisés" 
                    :value="kpis.autoPaymentRate" 
                    trend="Taux de réussite email 98%" 
                    color="text-success"
                    linkName="SuiviPaiements"
                />
            </div>
        </div>
        
        <div class="row">
          <div class="col-lg-7 mb-4">
    <div class="card shadow-sm">
        <div class="card-header bg-white border-bottom">
            <h5 class="card-title mb-0 text-dark">Factures Prêtes à l'Envoi Automatique</h5>
            <p class="text-muted small mb-0">Les locations terminées et impayées. Confirmez l'envoi de l'email au client.</p>
        </div>
        <div class="card-body">
            <table class="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>ID Location</th>
                        <th>Client</th>
                        <th>Montant Calculé</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="invoice in invoicesToSend" :key="invoice.id">
                        <td>{{ invoice.id }}</td> 
                        <td>{{ invoice.client }}</td>
                        <td class="fw-bold">{{ formatCurrency(invoice.amount) }}</td>
                        <td>
                            <button 
                                class="btn btn-sm cedii-btn-primary" 
                                @click="sendInvoiceEmail(invoice.id)">
                                <i class="bi bi-send-fill"></i> Envoyer Email
                            </button>
                        </td>
                    </tr>
                    <tr v-if="invoicesToSend.length === 0">
                        <td colspan="4" class="text-center text-muted">Aucune nouvelle facture prête à l'envoi.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
             <div class="col-lg-5 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white border-bottom">
                        <h5 class="card-title mb-0 text-dark">Pénalités Requérant Notification</h5>
                        <p class="text-muted small mb-0">Les retards détectés automatiquement par le système.</p>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li v-for="penalty in pendingPenalties" :key="penalty.id" class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-calendar-x-fill text-danger me-2"></i> 
                                    **{{ penalty.client }}** - Retard de **{{ penalty.daysLate }} jours**
                                </div>
                                <button class="btn btn-sm btn-outline-danger"><i class="bi bi-bell"></i> Notifier</button>
                            </li>
                             <li v-if="pendingPenalties.length === 0" class="list-group-item text-center text-muted">
                                Aucune pénalité en attente de notification.
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer bg-white text-end">
                         <router-link :to="{ name: 'SuiviPaie' }" class="btn btn-sm btn-outline-secondary">Voir tout</router-link>
                    </div>
                </div>
            </div>
        </div>
        
       <div class="card shadow-sm mt-4">
    <div class="card-header bg-white border-bottom">
        <h5 class="card-title mb-0 text-dark">Synthèse du Cashflow (Rapports)</h5>
    </div>
    <div class="card-body">
        <!-- Indicateurs clés -->
        <div class="row mb-4" v-if="cashflowData.kpis">
            <div class="col-md-3">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Revenus Totaux</h6>
                        <h4 class="text-success">{{ formatCurrency(cashflowData.kpis.totalRevenus) }}</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Dépenses Totales</h6>
                        <h4 class="text-danger">{{ formatCurrency(cashflowData.kpis.totalDepenses) }}</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Solde Net</h6>
                        <h4 :class="cashflowData.kpis.soldeNet >= 0 ? 'text-primary' : 'text-danger'">
                            {{ formatCurrency(cashflowData.kpis.soldeNet) }}
                        </h4>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-light">
                    <div class="card-body text-center">
                        <h6 class="card-title">Taux d'Épargne</h6>
                        <h4 class="text-info">{{ cashflowData.kpis.tauxEpargne }}</h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Message de chargement/erreur -->
        <div v-if="loadingCashflow" class="text-center p-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-2 text-muted">Calcul des indicateurs financiers...</p>
        </div>

        <div v-else-if="!cashflowData" class="text-center text-muted p-5 border rounded">
            <p>Les données de synthèse cashflow seront affichées ici après calcul automatique.</p>
            <button @click="loadCashflowData" class="btn btn-primary mt-2">
                <i class="bi bi-arrow-clockwise"></i> Actualiser les calculs
            </button>
        </div>
    </div>
</div>

      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import KpiCard from '../views/KpiCard.vue'; 
import AuthService from '../services/AuthService'; 
// 🚨 AJOUT : Importer le service API pour la finance
import FinanceService from '../services/FinanceService'; // Assurez-vous d'avoir ce service

const userRole = ref('');
const router = useRouter(); 

// --- États des données ---
const kpis = ref({ 
    // Initialiser les KPIs pour qu'ils soient mis à jour par l'API
    monthlyRevenue: 0, 
    pendingAmount: 0, // 💡 Initialisé à 0, sera rempli par le backend
    avgDaysLate: 0, 
    autoPaymentRate: '0%'
});

// 🚨 MODIFICATION : `pendingPaymentsCount` devient une `ref` simple
const pendingPaymentsCount = ref(0); 
const invoicesToSend = ref([]);
const pendingPenalties = ref([]);
// const allTransactions = ref([]); // N'est plus nécessaire car le backend fait le calcul

// --- Propriétés Calculées ---
const invoicesToProcess = computed(() => invoicesToSend.value.length);
// ❌ SUPPRESSION : L'ancienne propriété calculée `pendingPaymentsCount`
const litigeCount = computed(() => pendingPenalties.value.length);
// NOUVELLES VARIABLES POUR LA SYNTHÈSE
const loadingCashflow = ref(false);

const cashflowData = ref({
    kpis: {
        totalRevenus: 0,
        totalDepenses: 0,
        soldeNet: 0,
        tauxEpargne: '0%'
    }
}); // Structure par défaut pour éviter les erreurs



defineProps({
    invoicesToProcess: {
        type: Number,
        default: 0
    }
});

// --- Fonctions de Chargement/Utilitaires ---
const fetchFinanceData = async () => {
    try {
        // 🚨 REMPLACEMENT DE LA SIMULATION PAR L'APPEL API
        const response = await FinanceService.getFinanceDashboardData(); 
        const data = response.data;

        // 💡 AFFECTATION DES VALEURS DU KPI 'Paiements en Attente'
        pendingPaymentsCount.value = data.pendingPaymentsCount || 0; // Utilise la donnée du backend
        kpis.value.pendingAmount = data.pendingAmount || 0;          // Utilise la donnée du backend
        
        // Affectation des autres données (assurez-vous que le backend renvoie ces structures)
        kpis.value.monthlyRevenue = data.monthlyRevenue || 0; 
        kpis.value.avgDaysLate = data.avgDaysLate || 0; 
        kpis.value.autoPaymentRate = data.autoPaymentRate || '0%';
        invoicesToSend.value = data.invoicesToSend || []; 
        pendingPenalties.value = data.pendingPenalties || [];

    } catch (error) {
        console.error("Erreur lors du chargement des données financières:", error);
        // En cas d'erreur, assurez-vous que les KPIs affichent 0 ou les valeurs initiales
        pendingPaymentsCount.value = 0;
        kpis.value.pendingAmount = 0;
    }
};

const loadCashflowData = async () => {
    loadingCashflow.value = true;
    console.log('🟡 Début du chargement cashflow...');
    
    try {
        const response = await FinanceService.getCashflowSynthese();
        console.log('🟢 Réponse API reçue:', response);
        
        if (response.data && response.data.kpis) {
            cashflowData.value = response.data;
            console.log('✅ Données cashflow chargées avec succès');
        } else {
            console.warn('⚠️ Structure de réponse invalide');
            // Données par défaut
            cashflowData.value = {
                kpis: {
                    totalRevenus: 0,
                    totalDepenses: 0,
                    soldeNet: 0,
                    tauxEpargne: '0%',
                    message: "Données temporairement indisponibles"
                }
            };
        }
    } catch (error) {
        console.error('🔴 Erreur API cashflow:', error);
        
        // Afficher les détails de l'erreur
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        }
        
        // Données de secours
       
        
    } finally {
        loadingCashflow.value = false;
        console.log('🟣 Chargement cashflow terminé');
    }
};

function logout() {
    // 1. Afficher la boîte de dialogue de confirmation native du navigateur.
    // confirm() retourne true si l'utilisateur clique sur "OK" ou "Oui", et false si "Annuler" ou "Non".
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");

    // 2. Vérifier la réponse de l'utilisateur.
    if (isConfirmed) {
        console.log("Déconnexion confirmée. Exécution de la déconnexion...");
        
        // 3. Exécuter l'action de déconnexion
        AuthService.logout();
        
        // 4. Rediriger l'utilisateur vers la page de connexion
        router.push('/');
    } else {
        console.log("Déconnexion annulée.");
        // Optionnel : ne rien faire, l'utilisateur reste sur la page actuelle.
    }
}
const formatCurrency = (value) => {
    // Le 'fr-FR' assure que le séparateur décimal est une virgule et que l'espacement est correct.
    // La devise est changée en 'MGA'.
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(value);
};

// --- CONSOLIDATION de onMounted ---
onMounted(() => {
    const user = AuthService.getCurrentUser();
    // Utiliser le rôle 'finance' ou 'administrateur'
    if (user && user.roleUti && (user.roleUti.toLowerCase() === 'finance' || user.roleUti.toLowerCase() === 'administrateur')) {
        userRole.value = user.roleUti.toUpperCase();
        fetchFinanceData();
  setTimeout(() => {
            loadCashflowData();
        }, 1000);

    } else {
        router.push('/'); 
    }
});
</script>
<style scoped>
/* Les styles (couleurs, sidebar, etc.) sont conservés pour la cohérence avec AdminDashboard.vue */
.cedii-bg-dark { background-color: var(--cedii-dark, #5E5E5E) !important; }
.cedii-text-primary { color: var(--cedii-primary-light, white) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}

.sidebar { width: 250px; flex-shrink: 0; display: flex; flex-direction: column; }
.sidebar-logo { width: 60px; height: 60px; border-radius: 50%; border: 2px solid white; object-fit: cover; }
.sidebar .nav-link { transition: background-color 0.3s; border-radius: 5px; }
.sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: var(--cedii-primary-dark, white); }

.sidebar .nav-link { 
    color: #02061E !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}

.sidebar .nav-link.active { 
    color: purple !important; /* Cette ligne change la couleur du texte en Bleu Nuit */
    font-weight: 600; 
}

</style>