<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <router-link to="/dashboardFinance" class="btn btn-sm custom-btn-outline">
            <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
          </router-link>
          <div>
            <n-button @click="exporterFactures" type="info" size="small" class="me-2" :disabled="confirmedEvents.length === 0">
              <i class="bi bi-download me-2"></i>Exporter Factures
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-4 custom-divider">

    <!-- Cartes de statistiques améliorées -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3">
              <i class="bi bi-calendar-check text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Locations Confirmées</h6>
              <h4 class="mb-0 text-primary">{{ confirmedEvents.length }}</h4>
            </div>
          </div>
        </n-card>
      </div>
      
      <div class="col-md-3 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #067186;">
              <i class="bi bi-receipt text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">À Facturer</h6>
              <h4 class="mb-0 text-info">{{ aFacturerCount }}</h4>
            </div>
          </div>
        </n-card>
      </div>
      
      <div class="col-md-3 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #28a745;">
              <i class="bi bi-envelope-check text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Factures Envoyées</h6>
              <h4 class="mb-0 text-success">{{ facturesEnvoyeesCount }}</h4>
            </div>
          </div>
        </n-card>
      </div>

      <div class="col-md-3 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #ffc107;">
              <i class="bi bi-cash-coin text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Chiffre d'Affaires</h6>
              <h4 class="mb-0 text-warning">{{ chiffreAffairesTotal }}</h4>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Tableau des locations à facturer -->
    <n-card class="custom-card shadow-lg" title="Locations Confirmées à Facturer">
      <template #header-extra>
        <div class="d-flex gap-2">
          <n-button type="info" size="small" @click="fetchConfirmedEvents">
            <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
          </n-button>
          <n-button type="primary" size="small" @click="facturerTout" :disabled="aFacturerCount === 0">
            <i class="bi bi-receipt me-2"></i>Facturer Tout
          </n-button>
        </div>
      </template>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loadingEvents" class="text-center p-5">
          <n-spin size="large">
            <template #description>
              Chargement des locations...
            </template>
          </n-spin>
        </div>

        <!-- Empty State -->
        <div v-else-if="confirmedEvents.length === 0" class="text-center p-5">
          <n-empty description="Aucune location à facturer">
            <template #icon>
              <i class="bi bi-receipt" style="font-size: 3rem; color: #55555E;"></i>
            </template>
          </n-empty>
        </div>

        <!-- Data Table -->
        <div v-else>
          <n-data-table
            :columns="columns"
            :data="tableData"
            :bordered="false"
            class="custom-table"
            :row-class-name="rowClassName"
          />
        </div>
      </div>
    </n-card>

    <!-- Modal de confirmation de facturation amélioré -->
    <n-modal v-model:show="showConfirmModal" preset="dialog" :mask-closable="false">
      <template #header>
        <div class="d-flex align-items-center">
          <i class="bi bi-receipt me-2 cedii-primary"></i>
          <span>Créer et Envoyer la Facture</span>
        </div>
      </template>
      
      <div v-if="selectedLocation" class="facture-preview">
        <n-alert type="info" class="mb-3">
          <template #icon>
            <i class="bi bi-info-circle"></i>
          </template>
          Confirmez-vous la création et l'envoi de la facture pour cette location ?
        </n-alert>
        
        <div class="border rounded p-3 bg-light mb-3">
          <h6 class="fw-bold mb-3">Détails de la Location</h6>
          <div class="row">
            <div class="col-md-6">
              <strong>Référence:</strong> #{{ selectedLocation.id }}<br>
              <strong>Client:</strong> {{ selectedLocation.client }}<br>
              <strong>Email:</strong> 
              <span :class="{'text-danger': !selectedLocation.email, 'text-success': selectedLocation.email}">
                {{ selectedLocation.email || 'Non renseigné' }}
              </span><br>
            </div>
            <div class="col-md-6">
              <strong>Type:</strong> {{ selectedLocation.type }}<br>
              <strong>Début:</strong> {{ selectedLocation.dateDebut }}<br>
              <strong>Fin:</strong> {{ selectedLocation.dateFin }}<br>
            </div>
          </div>
          <hr>
          <div class="text-center">
            <strong class="fs-5 text-success">Montant Total: {{ selectedLocation.tarif }}</strong>
          </div>
        </div>

        <n-form v-if="!selectedLocation.email" ref="emailFormRef" :model="emailForm">
          <n-form-item label="Email du client" required>
            <n-input 
              v-model:value="emailForm.email" 
              placeholder="Entrez l'email du client"
              type="email"
            />
          </n-form-item>
        </n-form>

        <n-alert type="warning" v-if="!selectedLocation.email">
          <template #icon>
            <i class="bi bi-exclamation-triangle"></i>
          </template>
          Aucun email renseigné pour ce client. Veuillez saisir une adresse email pour envoyer la facture.
        </n-alert>
      </div>
      
      <template #action>
        <div class="d-flex gap-2 justify-content-end">
          <n-button 
            @click="telechargerFacture" 
            type="info" 
            :loading="isDownloading"
            :disabled="!selectedLocation"
          >
            <template #icon>
              <i class="bi bi-download"></i>
            </template>
            Télécharger PDF
          </n-button>
          <n-button 
            @click="creerEtEnvoyerFacture" 
            type="primary" 
            :loading="isSending"
            :disabled="!selectedLocation || (!selectedLocation.email && !emailForm.email)"
          >
            <template #icon>
              <i class="bi bi-send-check"></i>
            </template>
            {{ selectedLocation?.email ? 'Créer et Envoyer' : 'Créer et Envoyer avec email' }}
          </n-button>
          <n-button @click="showConfirmModal = false" :disabled="isSending || isDownloading">
            Annuler
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { 
  NCard, 
  NButton, 
  NSpin, 
  NEmpty, 
  NDataTable,
  NAlert,
  NTag,
  NModal,
  NForm,
  NFormItem,
  NInput
} from 'naive-ui';
import LocationService from '../services/LocationService';
import FinanceService from '../services/FinanceService';

// Variables réactives
const confirmedEvents = ref([]);
const loadingEvents = ref(true);
const showConfirmModal = ref(false);
const selectedLocation = ref(null);
const isSending = ref(false);
const isDownloading = ref(false);
const emailFormRef = ref(null);
const emailForm = ref({
  email: ''
});


// Computed properties corrigées
const tableData = computed(() => {
  return confirmedEvents.value.map(event => {
    // Essayez différentes façons de récupérer l'email
    const clientEmail = 
      event.client?.emailCli ||           // Direct sur l'event
      event.reservation?.client?.emailCli || // Dans reservation.client
      event.emailCli ||                   // Direct sur l'event (autre structure)
      '';
    
    const clientName = 
      event.client ? 
        `${event.client.nomCli} ${event.client.prenomCli || ''}`.trim() :
      event.reservation?.client ?
        `${event.reservation.client.nomCli} ${event.reservation.client.prenomCli || ''}`.trim() :
      event.nomCli && event.prenomCli ?
        `${event.nomCli} ${event.prenomCli}`.trim() :
        'N/A';

    return {
      id: event.idLo,
      client: clientName,
      type: event.typeLo,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarif: formatTarifAriary(calculateTarif(event)),
      statut: event.etatLo,
      materiel: event.reservation?.codeMat || event.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || 'N/A',
      email: clientEmail,
      hasEmail: !!clientEmail,
      // Données originales pour le traitement
      reservation: event.reservation,
      location: event,
      tarifNumerique: calculateTarif(event)
    };
  });
});



// Fonctions améliorées
const calculateTarif = (event) => {
  try {
    // Si le tarif existe déjà dans la location, l'utiliser
    if (event.tarifTot && event.tarifTot > 0) {
      return parseFloat(event.tarifTot);
    }

    // Sinon, calculer basé sur la réservation
    if (event.reservation) {
      // Utiliser le tarif de la réservation
      if (event.reservation.tarifTot && event.reservation.tarifTot > 0) {
        return parseFloat(event.reservation.tarifTot);
      }

      // Calculer basé sur la durée et les tarifs du matériel/salle
      const debut = new Date(event.debLo || event.reservation.debRes);
      const fin = new Date(event.finLo || event.reservation.finRes);
      
      const dureeHeures = (fin - debut) / (1000 * 60 * 60);
      
      let tarifUnitaire = 0;
      
      // Si c'est une location de matériel
      if (event.reservation.codeMat && event.reservation.materiel) {
        const materiel = event.reservation.materiel;
        if (dureeHeures <= 4) {
          tarifUnitaire = parseFloat(materiel.tarifDemiJournee) || 0;
        } else if (dureeHeures <= 8) {
          tarifUnitaire = parseFloat(materiel.tarifJour) || 0;
        } else {
          // Calcul proportionnel
          tarifUnitaire = (parseFloat(materiel.tarifHeure) || 0) * dureeHeures;
        }
      }
      
      // Si c'est une location de salle
      if (event.reservation.idSalle && event.reservation.salle) {
        const salle = event.reservation.salle;
        if (dureeHeures <= 4) {
          tarifUnitaire = parseFloat(salle.tarifDemiJournee) || 0;
        } else if (dureeHeures <= 8) {
          tarifUnitaire = parseFloat(salle.tarifJour) || 0;
        } else {
          tarifUnitaire = (parseFloat(salle.tarifHeure) || 0) * dureeHeures;
        }
      }
      
      // Multiplier par la quantité
      const quantite = event.reservation.qteMat || 1;
      return tarifUnitaire * quantite;
    }
    
    return 0;
  } catch (error) {
    console.error('Erreur calcul tarif:', error);
    return 0;
  }
};

const formatTarifAriary = (montant) => {
  if (montant === null || montant === undefined || isNaN(montant)) {
    return '0 Ar';
  }
  const numericValue = typeof montant === 'number' ? montant : parseFloat(montant);
  return `${numericValue.toLocaleString('fr-FR')} Ar`;
};

// Configuration du tableau améliorée
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted fw-bold' }, `#${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    sorter: (a, b) => a.client.localeCompare(b.client),
    render: (row) => h('div', [
      h('div', { class: 'fw-medium' }, row.client),
      h('div', { 
        class: `small ${row.hasEmail ? 'text-success' : 'text-danger'}` 
      }, row.hasEmail ? '✓ Email renseigné' : '✗ Email manquant')
    ])
  },
  {
    title: 'Email',
    key: 'email',
    render: (row) => h('span', { 
      class: row.email ? 'text-success' : 'text-danger' 
    }, row.email || 'Non renseigné')
  },
  {
    title: 'Type',
    key: 'type',
    width: 120,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      bordered: false
    }, { default: () => row.type })
  },
  {
    title: 'Période',
    key: 'periode',
    width: 250,
    render: (row) => h('div', [
      h('div', { class: 'small text-muted' }, 'Début: ' + row.dateDebut),
      h('div', { class: 'small text-muted' }, 'Fin: ' + row.dateFin)
    ])
  },
  {
    title: 'Montant',
    key: 'tarif',
    align: 'right',
    width: 150,
    sorter: (a, b) => a.tarifNumerique - b.tarifNumerique,
    render: (row) => h('strong', { class: 'text-success fs-6' }, row.tarif)
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (row) => h('div', { class: 'd-flex gap-1' }, [
      h(NButton, {
        size: 'small',
        type: 'info',
        onClick: () => telechargerFactureDirect(row),
        title: 'Télécharger la facture'
      }, {
        default: () => h('i', { class: 'bi bi-download' })
      }),
      h(NButton, {
        size: 'small',
        type: 'primary',
        onClick: () => ouvrirModalFacturation(row),
        disabled: !row.hasEmail
      }, {
        default: () => [h('i', { class: 'bi bi-receipt me-1' }), 'Facturer']
      })
    ])
  }
];

// Méthodes améliorées
const fetchConfirmedEvents = async () => {
  loadingEvents.value = true;
  try {
    const response = await LocationService.getConfirmedEvents();
    confirmedEvents.value = response.data;
    
    console.log('Événements chargés:', response.data);
  } catch (error) {
    console.error("Erreur lors du chargement des événements confirmés:", error);
  } finally {
    loadingEvents.value = false;
  }
};

const ouvrirModalFacturation = (location) => {
  selectedLocation.value = location;
  emailForm.value.email = location.email || '';
  showConfirmModal.value = true;
};

// Dans facturation.vue - REMPLACEZ les méthodes de téléchargement
import PdfService from '../services/PdfService';

const telechargerFacture = async () => {
  if (!selectedLocation.value) return;
  
  isDownloading.value = true;
  try {
    console.log('📍 Génération PDF pour location:', selectedLocation.value.id);
    
    // Utilisez les données de la location pour générer le PDF côté client
    const invoiceData = {
      idLo: selectedLocation.value.id,
      numeroFacture: `FACT-${new Date().getFullYear()}-${selectedLocation.value.id}`,
      typeLo: selectedLocation.value.type,
      debLo: selectedLocation.value.location?.debLo || selectedLocation.value.debLo,
      finLo: selectedLocation.value.location?.finLo || selectedLocation.value.finLo,
      tarifTot: selectedLocation.value.tarifNumerique || selectedLocation.value.location?.tarifTot,
      qteMat: selectedLocation.value.location?.qteMat || selectedLocation.value.qteMat,
      nbPersp: selectedLocation.value.location?.nbPersp || selectedLocation.value.nbPersp,
      client: {
        nomCli: selectedLocation.value.client.split(' ')[0],
        prenomCli: selectedLocation.value.client.split(' ').slice(1).join(' '),
        emailCli: selectedLocation.value.email,
        telephoneCli: selectedLocation.value.location?.reservation?.client?.telephoneCli || 'Non renseigné'
      },
      materiel: selectedLocation.value.location?.materiel || selectedLocation.value.materiel,
      salle: selectedLocation.value.location?.salle || selectedLocation.value.salle
    };
    
    // Générer le PDF
    const pdfDoc = PdfService.generateInvoice(invoiceData);
    
    // Télécharger le PDF
    pdfDoc.save(`facture-${selectedLocation.value.id}.pdf`);
    
    console.log('✅ PDF généré et téléchargé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    alert('Erreur lors de la génération du PDF. Vérifiez la console.');
  } finally {
    isDownloading.value = false;
  }
};

const telechargerFactureDirect = async (location) => {
  try {
    console.log('📍 Génération PDF direct pour:', location.id);
    
    // Préparer les données pour le PDF
    const invoiceData = {
      idLo: location.id,
      numeroFacture: `FACT-${new Date().getFullYear()}-${location.id}`,
      typeLo: location.type,
      debLo: location.location?.debLo || location.debLo,
      finLo: location.location?.finLo || location.finLo,
      tarifTot: location.tarifNumerique || location.location?.tarifTot,
      qteMat: location.location?.qteMat || location.qteMat,
      nbPersp: location.location?.nbPersp || location.nbPersp,
      client: {
        nomCli: location.client.split(' ')[0],
        prenomCli: location.client.split(' ').slice(1).join(' '),
        emailCli: location.email,
        telephoneCli: location.location?.reservation?.client?.telephoneCli || 'Non renseigné'
      },
      materiel: location.location?.materiel || location.materiel,
      salle: location.location?.salle || location.salle
    };
    
    // Générer le PDF
    const pdfDoc = PdfService.generateInvoice(invoiceData);
    
    // Télécharger le PDF
    pdfDoc.save(`facture-${location.id}.pdf`);
    
    console.log('✅ PDF généré et téléchargé avec succès');
    
  } catch (error) {
    console.error('❌ Erreur génération PDF direct:', error);
    alert('Erreur lors de la génération du PDF.');
  }
};

// Dans facturation.vue - CORRECTIONS DES MÉTHODES
/*const telechargerFacture = async () => {
  if (!selectedLocation.value) return;
  
  isDownloading.value = true;
  try {
    console.log('📍 Téléchargement facture pour location:', selectedLocation.value.id);
    
    // ✅ CORRECTION : Utilisez l'ID de location correct
    const response = await FinanceService.downloadInvoice(selectedLocation.value.id);
    
    // Créer un blob et télécharger le PDF
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${selectedLocation.value.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Facture téléchargée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors du téléchargement de la facture:', error);
    alert('Erreur lors du téléchargement de la facture. La route peut ne pas être implémentée.');
  } finally {
    isDownloading.value = false;
  }
};

const telechargerFactureDirect = async (location) => {
  try {
    console.log('📍 Téléchargement direct facture:', location.id);
    
    // ✅ CORRECTION : Utilisez l'ID de location
    const response = await FinanceService.downloadInvoice(location.id);
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${location.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Facture téléchargée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur téléchargement direct:', error);
    alert('Erreur lors du téléchargement de la facture. Fonctionnalité en cours de développement.');
  }
};
*/

// Dans facturation.vue - MISE À JOUR COMPLÈTE
// 🔥 REMPLACEZ la méthode creerEtEnvoyerFacture
const creerEtEnvoyerFacture = async () => {
  if (!selectedLocation.value) return;
  
  const emailFinal = selectedLocation.value.email || emailForm.value.email;
  if (!emailFinal) {
    alert('Veuillez renseigner un email pour envoyer la facture.');
    return;
  }
  
  isSending.value = true;
  try {
    const payload = {
      locationId: selectedLocation.value.id,
      clientEmail: emailFinal
    };
    
    console.log('📍 Envoi facture avec payload:', payload);
    
    const response = await FinanceService.createAndSendInvoice(payload);
    
    console.log('✅ Facture créée et envoyée:', response.data);
    
    // 🔥 METTRE À JOUR LES DONNÉES EN TEMPS RÉEL
    if (response.data.newStats) {
      updateDashboardWithNewStats(response.data.newStats);
    }
    
    // 🔥 RETIRER LA LOCATION FACTURÉE DE LA LISTE
    confirmedEvents.value = confirmedEvents.value.filter(
      event => event.idLo !== selectedLocation.value.id
    );
    
    // 🔥 AFFICHER CONFIRMATION AVEC NOUVELLES STATS
    showConfirmModal.value = false;
    selectedLocation.value = null;
    emailForm.value.email = '';
    
    const newStats = response.data.newStats;
    alert(`✅ Facture créée et envoyée avec succès à ${emailFinal}\n\n📊 Tableau de bord mis à jour:\n• Locations restantes: ${newStats.confirmedLocationsCount}\n• Factures envoyées: ${newStats.invoicesSentCount}\n• Chiffre d'affaires: ${formatTarifAriary(newStats.totalRevenue)}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création/envoi de la facture:', error);
    alert('Erreur lors de la création/envoi de la facture. Vérifiez la console.');
  } finally {
    isSending.value = false;
  }
};

// 🔥 NOUVELLE FONCTION POUR METTRE À JOUR L'INTERFACE
const updateDashboardWithNewStats = (newStats) => {
  console.log('📍 Mise à jour des statistiques:', newStats);
  
  // Mettre à jour les computed properties
  // Ces valeurs seront automatiquement recalculées
  // grâce au rafraîchissement de confirmedEvents
  
  // Vous pouvez aussi stocker ces stats pour les afficher ailleurs
  localStorage.setItem('lastFinanceStats', JSON.stringify(newStats));
};

// 🔥 AMÉLIORATION DE facturerTout
const facturerTout = async () => {
  const locationsAvecEmail = tableData.value.filter(item => item.hasEmail);
  
  if (locationsAvecEmail.length === 0) {
    alert('Aucune location avec email renseigné pour la facturation groupée.');
    return;
  }
  
  if (!confirm(`Voulez-vous facturer ${locationsAvecEmail.length} location(s) ?\n\nDes emails de confirmation seront envoyés à tous les clients.`)) {
    return;
  }
  
  isSending.value = true;
  
  try {
    const results = await Promise.allSettled(
      locationsAvecEmail.map(location => 
        FinanceService.createAndSendInvoice({
          locationId: location.id,
          clientEmail: location.email
        })
      )
    );
    
    const succes = results.filter(r => r.status === 'fulfilled').length;
    const echecs = results.filter(r => r.status === 'rejected').length;
    
    // 🔥 RAFRAÎCHIR TOUTES LES DONNÉES APRÈS FACTURATION GROUPÉE
    await fetchConfirmedEvents();
    
    // 🔥 RÉCUPÉRER LES NOUVELLES STATISTIQUES GLOBALES
    const dashboardResponse = await FinanceService.getFinanceDashboardData();
    const globalStats = dashboardResponse.data;
    
    alert(`✅ Facturation groupée terminée:\n\n• ${succes} facture(s) envoyée(s) avec succès\n• ${echecs} échec(s)\n\n📊 Tableau de bord mis à jour:\n• Locations à facturer: ${globalStats.invoicesToSendCount || 0}\n• Paiements en attente: ${globalStats.pendingPaymentsCount || 0}\n• Chiffre d'affaires: ${formatTarifAriary(globalStats.totalRevenue || 0)}`);
    
  } catch (error) {
    console.error('Erreur lors de la facturation groupée:', error);
    alert('Erreur lors de la facturation groupée.');
  } finally {
    isSending.value = false;
  }
};

// 🔥 AJOUTEZ UNE MÉTHODE POUR RAFRAÎCHIR TOUT LE TABLEAU DE BORD
const refreshFullDashboard = async () => {
  try {
    // Recharger les locations
    await fetchConfirmedEvents();
    
    // Recharger les stats globales si nécessaire
    const dashboardResponse = await FinanceService.getFinanceDashboardData();
    console.log('📊 Stats globales mises à jour:', dashboardResponse.data);
    
  } catch (error) {
    console.error('Erreur rafraîchissement dashboard:', error);
  }
};

// 🔥 COMPUTED PROPERTIES AMÉLIORÉES
const aFacturerCount = computed(() => {
  return confirmedEvents.value.filter(event => 
    event.etatLo === 'Confirmée' && 
    !event.paiements?.some(p => p.statutPaie === 'Effectué')
  ).length;
});

const facturesEnvoyeesCount = computed(() => {
  // Basé sur les paiements avec email envoyé
  return confirmedEvents.value.filter(event => 
    event.paiements && event.paiements.some(p => p.emailEnvoye)
  ).length;
});

const chiffreAffairesTotal = computed(() => {
  // Calcul basé sur TOUTES les locations facturées (pas seulement celles affichées)
  const total = tableData.value.reduce((sum, item) => sum + item.tarifNumerique, 0);
  return formatTarifAriary(total);
});
// 🔥 COMPUTED AMÉLIORÉ POUR LES FACTURES ENVOYÉES
//const facturesEnvoyeesCount = ref(0); // Initialiser avec une valeur

// Récupérer le compteur initial au chargement
onMounted(async () => {
  await fetchConfirmedEvents();
  // Optionnel: Récupérer le compteur initial des factures envoyées
  // await fetchInitialStats();
});


/*const creerEtEnvoyerFacture = async () => {
  if (!selectedLocation.value) return;
  
  // Validation de l'email si nécessaire
  const emailFinal = selectedLocation.value.email || emailForm.value.email;
  if (!emailFinal) {
    alert('Veuillez renseigner un email pour envoyer la facture.');
    return;
  }
  
  isSending.value = true;
  try {
    const payload = {
      locationId: selectedLocation.value.id, // ✅ CORRECTION : Utilisez l'ID direct
      clientEmail: emailFinal
    };
    
    console.log('📍 Envoi facture avec payload:', payload);
    
    // ✅ CORRECTION : Utilisez la nouvelle méthode
    const response = await FinanceService.createAndSendInvoice(payload);
    
    console.log('✅ Facture créée et envoyée:', response.data);
    
    // Mettre à jour l'interface
    confirmedEvents.value = confirmedEvents.value.filter(
      event => event.id !== selectedLocation.value.id
    );
    
    showConfirmModal.value = false;
    selectedLocation.value = null;
    emailForm.value.email = '';
    
    alert(`✅ Facture créée et envoyée avec succès à ${emailFinal}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création/envoi de la facture:', error);
    
    // Message d'erreur plus informatif
    if (error.response?.status === 404) {
      alert('Fonctionnalité en cours de développement. La route d\'envoi de facture n\'est pas encore implémentée.');
    } else {
      alert('Erreur lors de la création/envoi de la facture. Vérifiez la console.');
    }
  } finally {
    isSending.value = false;
  }
};
*/
/*const facturerTout = async () => {
  const locationsAvecEmail = tableData.value.filter(item => item.hasEmail);
  
  if (locationsAvecEmail.length === 0) {
    alert('Aucune location avec email renseigné pour la facturation groupée.');
    return;
  }
  
  if (!confirm(`Voulez-vous facturer ${locationsAvecEmail.length} location(s) ?`)) {
    return;
  }
  
  try {
    const results = await Promise.allSettled(
      locationsAvecEmail.map(location => 
        FinanceService.createAndSendInvoice({
          locationId: location.id, // ✅ CORRECTION : Utilisez l'ID direct
          clientEmail: location.email
        })
      )
    );
    
    const succes = results.filter(r => r.status === 'fulfilled').length;
    const echecs = results.filter(r => r.status === 'rejected').length;
    
    alert(`Facturation groupée terminée: ${succes} succès, ${echecs} échecs.`);
    
    // Recharger les données
    fetchConfirmedEvents();
    
  } catch (error) {
    console.error('Erreur lors de la facturation groupée:', error);
    alert('Erreur lors de la facturation groupée.');
  }
};
*/
/*const telechargerFactureDirect = async (location) => {
  try {
    const response = await FinanceService.downloadInvoice(location.location.idLo);
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${location.id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur téléchargement direct:', error);
    alert('Erreur lors du téléchargement de la facture.');
  }
};*/
/*
const creerEtEnvoyerFacture = async () => {
  if (!selectedLocation.value) return;
  
  // Validation de l'email si nécessaire
  const emailFinal = selectedLocation.value.email || emailForm.value.email;
  if (!emailFinal) {
    alert('Veuillez renseigner un email pour envoyer la facture.');
    return;
  }
  
  isSending.value = true;
  try {
    const payload = {
      locationId: selectedLocation.value.location.idLo,
      clientEmail: emailFinal
    };
    
    const response = await FinanceService.sendInvoice(payload);
    
    console.log('Facture créée et envoyée:', response.data);
    
    // Mettre à jour l'interface
    confirmedEvents.value = confirmedEvents.value.filter(
      event => event.idLo !== selectedLocation.value.location.idLo
    );
    
    showConfirmModal.value = false;
    selectedLocation.value = null;
    emailForm.value.email = '';
    
    alert(`Facture créée et envoyée avec succès à ${emailFinal}`);
    
  } catch (error) {
    console.error('Erreur lors de la création/envoi de la facture:', error);
    alert('Erreur lors de la création/envoi de la facture. Vérifiez la console.');
  } finally {
    isSending.value = false;
  }
};
*/
/*const facturerTout = async () => {
  const locationsAvecEmail = tableData.value.filter(item => item.hasEmail);
  
  if (locationsAvecEmail.length === 0) {
    alert('Aucune location avec email renseigné pour la facturation groupée.');
    return;
  }
  
  if (!confirm(`Voulez-vous facturer ${locationsAvecEmail.length} location(s) ?`)) {
    return;
  }
  
  try {
    const results = await Promise.allSettled(
      locationsAvecEmail.map(location => 
        FinanceService.sendInvoice({
          locationId: location.location.idLo,
          clientEmail: location.email
        })
      )
    );
    
    const succes = results.filter(r => r.status === 'fulfilled').length;
    const echecs = results.filter(r => r.status === 'rejected').length;
    
    alert(`Facturation groupée terminée: ${succes} succès, ${echecs} échecs.`);
    
    // Recharger les données
    fetchConfirmedEvents();
    
  } catch (error) {
    console.error('Erreur lors de la facturation groupée:', error);
    alert('Erreur lors de la facturation groupée.');
  }
};
*/
const exporterFactures = async () => {
  try {
    const response = await FinanceService.exportInvoices();
    
    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factures-cedii-${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur lors de l\'export des factures:', error);
    alert('Erreur lors de l\'export des factures.');
  }
};

const rowClassName = (row) => {
  return row.hasEmail ? 'has-email' : 'no-email';
};

// Cycle de vie
onMounted(() => {
  fetchConfirmedEvents();
});
</script>

<style scoped>
:root {
  --cedii-primary: #5811EE;
  --cedii-primary-dark: #04058F;
  --cedii-dark: #02061E;
  --cedii-info: #067186;
  --cedii-secondary: #55555E;
}

/* Dans le style de facturation.vue */
.stats-update {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.success-message {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.custom-btn-outline {
  border-color: var(--cedii-primary);
  color: var(--cedii-primary);
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: var(--cedii-primary);
  color: white;
}

.custom-divider {
  border-color: var(--cedii-info);
  opacity: 0.3;
}

.custom-card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}

.custom-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--cedii-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.custom-table {
  --n-border-color: #f0f0f0;
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: var(--cedii-dark);
  border-bottom: 2px solid var(--cedii-primary);
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

:deep(.has-email) {
  background-color: rgba(40, 167, 69, 0.05);
}

:deep(.no-email) {
  background-color: rgba(220, 53, 69, 0.05);
}

:deep(.n-data-table-tr:hover .n-data-table-td) {
  background-color: rgba(88, 17, 238, 0.05);
}

.text-primary {
  color: var(--cedii-primary) !important;
}

.text-info {
  color: var(--cedii-info) !important;
}

.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.bg-primary {
  background-color: var(--cedii-primary) !important;
}

.cedii-primary { color: #5811EE; }

.facture-preview {
  max-height: 60vh;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-icon-container {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  :deep(.n-data-table) {
    font-size: 0.875rem;
  }
}
</style>