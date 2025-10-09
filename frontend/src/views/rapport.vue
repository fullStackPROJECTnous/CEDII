<template>
    <div class="retour">
     <router-link to="/home" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="reports-management p-3 bg-white rounded shadow-sm">
    <h3 class="mb-4">Suivi & Rapports d'Activité</h3>
    
    <div class="row mb-5">
        <div class="col-md-3 mb-4" v-for="(kpi, key) in kpis" :key="key">
            <div class="card p-3 shadow-sm cedii-widget">
                <div class="d-flex align-items-center">
                    <i :class="getKpiIcon(key)" class="h2 me-3 cedii-text-primary"></i>
                    <div>
                        <h5 class="card-title text-muted mb-0">{{ getKpiTitle(key) }}</h5>
                        <p class="h3 mb-0">{{ formatKpiValue(key, kpi) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        
        <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-4">
                <h4 class="card-title text-secondary">Statut des Réservations (Total)</h4>
                <div class="chart-placeholder">
                    <div v-if="reservationData.length === 0" class="text-center text-muted p-5">
                        Aucune donnée de réservation à afficher.
                    </div>
                    <ul v-else class="list-group list-group-flush mt-3">
                        <li v-for="item in reservationData" :key="item.etatRes" 
                            class="list-group-item d-flex justify-content-between align-items-center">
                            {{ item.etatRes }}
                            <span :class="getStatusBadge(item.etatRes)">{{ item.count }}</span>
                        </li>
                    </ul>
                </div>
                <small class="text-muted mt-2">* Basé sur toutes les réservations enregistrées.</small>
            </div>
        </div>

        <div class="col-lg-6 mb-4">
            <div class="card shadow-sm p-4">
                <h4 class="card-title text-secondary">Top 5 Matériels les plus demandés</h4>
                
                <ul class="list-group list-group-flush mt-3">
                    <li v-for="(mat, index) in topMateriel" :key="mat.codeMat" 
                        class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="fw-bold me-2">{{ index + 1 }}.</span>
                        <span class="flex-grow-1">{{ mat.Materiel.designationMat || 'Matériel Inconnu' }}</span>
                        <span class="badge bg-info">{{ mat.totalQteLouee }} Unités louées</span>
                    </li>
                    <li v-if="topMateriel.length === 0" class="list-group-item text-center text-muted">
                        Aucune donnée de location de matériel.
                    </li>
                </ul>
                <small class="text-muted mt-2">* Quantité totale louée sur l'historique.</small>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RapportService from '../services/RapportService'; 

// Les KPIs sont stockés dans un objet pour faciliter l'itération
const kpis = ref({
    totalClients: 0,
    locationsMois: 0,
    revenuTotal: 0,
    tauxOccupationSalle: 0
});

const reservationData = ref([]);
const topMateriel = ref([]);

// --- Chargement des données ---

const fetchData = async () => {
    try {
        const [kpiRes, reportRes, topMatRes] = await Promise.all([
            RapportService.getKPIs(),
            RapportService.getReservationsReport(),
            RapportService.getTopRentedMateriel()
        ]);

        kpis.value = kpiRes.data;
        reservationData.value = reportRes.data;
        topMateriel.value = topMatRes.data;

    } catch (error) {
        console.error("Erreur de chargement des rapports:", error);
    }
};

onMounted(() => {
    fetchData();
});

// --- Fonctions d'affichage et utilitaires ---

const formatCurrency = (value) => {
    if (typeof value === 'string') value = parseFloat(value);
    if (isNaN(value)) return '0,00 MGA';
    return `${value.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const getKpiTitle = (key) => {
    const titles = {
        totalClients: 'Total Clients',
        locationsMois: 'Locations Confirmées (Mois)',
        revenuTotal: 'Revenu Total (Archivé)',
        tauxOccupationSalle: 'Taux Occup. Salles'
    };
    return titles[key] || key;
};

const getKpiIcon = (key) => {
    const icons = {
        totalClients: 'bi bi-person-check-fill',
        locationsMois: 'bi bi-calendar-event',
        revenuTotal: 'bi bi-currency-dollar',
        tauxOccupationSalle: 'bi bi-bar-chart-fill'
    };
    return icons[key] || 'bi bi-question-circle';
};

const formatKpiValue = (key, value) => {
    if (key === 'revenuTotal') {
        return formatCurrency(value);
    }
    if (key === 'tauxOccupationSalle') {
        return `${value}%`;
    }
    return value;
};

const getStatusBadge = (statut) => {
    if (statut === 'Confirmée') return 'badge bg-success';
    if (statut === 'En attente') return 'badge bg-warning text-dark';
    if (statut === 'Annulée') return 'badge bg-danger';
    if (statut === 'Terminée') return 'badge bg-secondary';
    return 'badge bg-info';
};
</script>

<style scoped>
/* Les styles spécifiques aux widgets pour l'accentuation */
.cedii-widget {
    border-left: 5px solid var(--cedii-primary-light, #5B11EE);
    transition: transform 0.2s;
}
.cedii-widget:hover {
    transform: translateY(-2px);
}
.cedii-text-primary {
    color: var(--cedii-primary-light, #5B11EE) !important;
}
.chart-placeholder {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.retour{
    float: right;
}
</style>