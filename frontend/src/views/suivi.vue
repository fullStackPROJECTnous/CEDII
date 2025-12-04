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
                 <!-- Menu trois points -->
            <div class="position-relative">
              <n-dropdown
                trigger="click"
                :options="navigationOptions"
                @select="handleNavigationSelect"
                placement="bottom-end"
              >
                <n-button type="primary" size="small" class="custom-btn-primary">
                  <i class="bi bi-three-dots-vertical"></i>
                </n-button>
              </n-dropdown>
            </div>
            <div></div> <!-- Placeholder pour l'alignement -->
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu avec scroll -->
    <div class="content-wrapper">
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
        
        <div v-if="pendingPayments.length === 0 && !isLoading">
          <n-empty description="Aucun paiement en attente. Votre caisse est à jour !">
            <template #icon>
              <i class="bi bi-check-circle" style="font-size: 3rem; color: #28a745;"></i>
            </template>
          </n-empty>
        </div>
        
        <div v-else class="table-container">
          <n-data-table
            :columns="pendingColumns"
            :data="pendingPayments"
            :loading="isLoading"
            :scroll-x="1200"
            class="custom-table"
          />
        </div>
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
        
        <div class="table-container">
          <n-data-table
            :columns="historyColumns"
            :data="filteredHistory"
            :loading="isLoading"
            :scroll-x="1400"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NButton, 
  NAlert, 
  NCard, 
  NDataTable, 
  NTag, 
  NEmpty, 
  NIcon, 
  NInput, 
  NDropdown,
  NSelect, 
  NSpace, 
  NPagination
} from 'naive-ui';
import FinanceService from '../services/FinanceService';
import jsPDF from 'jspdf';



const router = useRouter();


// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Facturation',
    key: 'fact',
    icon: () => h('i', { class: 'bi-file-earmark-text' })
  },
  {
    label: 'Penalités et Litiges',
    key: 'penaliteLiti',
    icon: () => h('i', { class: 'bi-exclamation-octagon-fill' })
  },
  {
    label: 'Rapports $ Synthèses',
    key: 'syntheseRapp',
    icon: () => h('i', { class: 'bi-graph-up' })
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardFinance',
    'fact': '/facturation',
    'penaliteLiti': '/penalite',
    'syntheseRapp': '/synthese'
    
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};

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

const totalPendingAmount = computed(() => {
  return pendingPayments.value.reduce((sum, payment) => {
    const amount = Number(payment.montantPaie) || 0;
    return sum + amount;
  }, 0);
});

const filteredHistory = computed(() => {
  let filtered = validatedPayments.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(payment => 
      payment.numeroFacture?.toLowerCase().includes(query) ||
      (payment.nomCli && payment.nomCli.toLowerCase().includes(query)) ||
      payment.libellePaie?.toLowerCase().includes(query)
    );
  }
  
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
    title: 'Location',
    key: 'idLo',
    width: 100,
    render: (row) => h('span', { class: 'text-muted' }, `LO-${row.idLo || 'N/A'}`)
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'success',
        onClick: () => validatePayment(row.idPaie),
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
      
      h(NButton, {
        size: 'small',
        type: 'info',
        onClick: () => downloadPaymentInvoice(row.idLo),
        title: 'Télécharger la facture'
      }, {
        default: () => h('i', { class: 'bi bi-download' })
      })
    ])
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
    
    const primaryColor = [0, 4, 143];
    const secondaryColor = [220, 53, 69];
    const textColor = [51, 51, 51];
    
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CEDII LOCATIONS', 105, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text('FACTURE OFFICIELLE', 105, 30, { align: 'center' });
    
    pdf.setDrawColor(...secondaryColor);
    pdf.setLineWidth(0.5);
    pdf.line(20, 45, 190, 45);
    
    const lines = text.split('\n');
    let yPosition = 60;
    
    let numeroFacture = 'N/A';
    let client = 'N/A';
    let location = 'N/A';
    let periode = 'N/A';
    let montant = 'N/A';
    let statut = 'N/A';
    
    lines.forEach(line => {
      if (line.includes('Numéro:')) numeroFacture = line.split('Numéro:')[1]?.trim() || 'N/A';
      if (line.includes('Client:')) client = line.split('Client:')[1]?.trim() || 'N/A';
      if (line.includes('Location:')) location = line.split('Location:')[1]?.trim() || 'N/A';
      if (line.includes('Période:')) periode = line.split('Période:')[1]?.trim() || 'N/A';
      if (line.includes('Montant:')) montant = line.split('Montant:')[1]?.trim() || 'N/A';
      if (line.includes('Statut:')) statut = line.split('Statut:')[1]?.trim() || 'N/A';
    });
    
    pdf.setTextColor(...textColor);
    pdf.setFontSize(12);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS DE LA FACTURE', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Numéro de facture: ${numeroFacture}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS DU CLIENT', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Client: ${client}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Location: ${location}`, 20, yPosition);
    yPosition += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('DÉTAILS DE LA LOCATION', 20, yPosition);
    yPosition += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Période: ${periode}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Statut: ${statut}`, 20, yPosition);
    yPosition += 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('MONTANT TOTAL', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(16);
    pdf.setTextColor(...secondaryColor);
    pdf.text(` ${montant}`, 20, yPosition);
    yPosition += 20;
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Merci pour votre confiance!', 105, yPosition, { align: 'center' });
    yPosition += 6;
    pdf.text('CEDII Locations - Votre partenaire de confiance', 105, yPosition, { align: 'center' });
    
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('CEDII Locations • contact@cedii.mg • +261 XX XX XXX XX', 105, 280, { align: 'center' });
    
    pdf.save(`facture-cedii-${locationId}.pdf`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    return false;
  }
};


// --- Fonctions d'Action ---
const downloadPaymentInvoice = async (locationId) => {
  if (!locationId) {
    alert('ID de location manquant');
    return;
  }
  
  try {
    console.log('📥 Tentative de téléchargement pour location:', locationId);
    
    const response = await FinanceService.downloadInvoice(locationId, {
      responseType: 'blob'
    });
    
    console.log('📄 Réponse reçue:', response);
    
    if (!response.data || response.data.size === 0) {
      throw new Error('Aucune donnée reçue du serveur');
    }
    
    const contentType = response.headers['content-type'];
    console.log('📋 Content-Type:', contentType);
    
    if (contentType && contentType.includes('text/plain')) {
      const text = await response.data.text();
      console.log('📝 Contenu de la facture reçu:', text);
      
      const pdfGenerated = generatePDFFromText(text, locationId);
      
      if (pdfGenerated) {
        console.log('✅ Facture PDF générée avec succès pour location:', locationId);
        alert(`Facture LO-${locationId} générée en PDF avec succès!`);
      } else {
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
        
        console.log('✅ Facture texte téléchargée (fallback) pour location:', locationId);
        alert(`Facture LO-${locationId} téléchargée au format texte!`);
      }
      return;
    }
    
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

const validatePayment = async (paymentId) => {
  const payment = pendingPayments.value.find(p => p.idPaie === paymentId);
  
  if (!payment) {
    alert('Paiement non trouvé');
    return;
  }
  
  const confirmationMessage = `Confirmez-vous la validation du paiement ?
    
• Paiement: #${payment.idPaie}
• Client: ${payment.nomCli} ${payment.prenomCli || ''}
• Montant: ${formatCurrency(payment.montantPaie)}
• Méthode: ${payment.modePaie}
• Location: LO-${payment.idLo}

Cette action marquera le paiement comme "Effectué".`;
  
  if (!confirm(confirmationMessage)) return;
  
  try {
    await FinanceService.validatePayment(paymentId);
    
    alert(`✅ Paiement #${paymentId} validé avec succès !
    
• Statut mis à jour: En attente → Effectué
• Location LO-${payment.idLo} maintenant complètement payée
• Transaction rapprochée dans la comptabilité`);
    
    await fetchPaymentData();
    
  } catch (error) {
    console.error(`❌ Erreur lors de la validation du paiement ${paymentId}:`, error);
    alert(`Erreur lors de la validation: ${error.response?.data?.message || error.message}`);
  }
};
// Dans suivi.vue - Remplacer la fonction sendReminder
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
const exportHistory = () => {
  alert("Fonctionnalité d'export à implémenter");
};

// --- Fonctions Utilitaires ---
const formatCurrency = (value) => {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'MGA' 
  }).format(numericValue);
};

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

/* Conteneur principal avec scroll */
.content-wrapper {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

/* Scrollbar personnalisée */
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

/* Conteneur pour les tables avec scroll */
.table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
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
  
  .content-wrapper {
    max-height: none;
    overflow-y: visible;
  }
  
  .table-container {
    max-height: 300px;
  }
}


/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>