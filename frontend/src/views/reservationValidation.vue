
<template>
  <div class="validation-container">
    <!-- Header avec navigation fixe -->
    <div class="header-section">
      <div class="d-flex justify-content-between align-items-center">
        <n-button 
          type="primary" 
          ghost 
          @click="$router.push('/demandeAttente')"
          class="back-button"
          size="small"
        >
          <template #icon>
            <n-icon>
              <i class="bi bi-arrow-left"></i>
            </n-icon>
          </template>
          Retour aux demandes
        </n-button>

        <div class="header-title text-center flex-grow-1">
          <h1 class="page-title mb-2">
            <i class="bi bi-file-earmark-check-fill me-2"></i> 
            Validation de la Demande #{{ idRes }}
          </h1>
          <p class="page-subtitle mb-0">
            Processus de validation et création de contrat
          </p>
        </div>
      </div>
    </div>

    <!-- Messages d'alerte -->
    <n-alert
      v-if="errorMessage"
      type="error"
      title="Erreur"
      class="mb-4 alert-fixed"
      closable
      @close="errorMessage = null"
    >
      {{ errorMessage }}
    </n-alert>

    <n-alert
      v-if="successMessage"
      type="success"
      title="Succès"
      class="mb-4 alert-fixed"
      closable
      @close="successMessage = null"
    >
      {{ successMessage }}
    </n-alert>

    <!-- Contenu scrollable -->
    <div class="scrollable-content">
      <!-- État de chargement -->
      <div v-if="loading" class="loading-state">
        <n-card class="text-center loading-card">
          <n-space vertical align="center" class="py-5">
            <n-spin size="large" />
            <n-text class="mt-3 fs-5 loading-text">
              Chargement des détails de la réservation...
            </n-text>
          </n-space>
        </n-card>
      </div>

      <!-- Contenu principal -->
      <div v-else-if="reservation" class="content-section">
        <!-- Carte Détails de la Demande -->
        <n-card class="main-card mb-4" title="Détails de la Demande">
          <template #header-extra>
            <n-tag :type="getStatusType(reservation.etatRes)" size="small" class="status-tag">
              {{ reservation.etatRes }}
            </n-tag>
          </template>

          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <!-- Informations Client -->
            <n-gi>
              <n-card title="Informations Client" size="small" class="h-100 client-card">
                <template #header-extra>
                  <n-icon size="20" class="card-icon">
                    <i class="bi bi-person-badge"></i>
                  </n-icon>
                </template>
                
                <n-space vertical>
                  <div class="info-item">
                    <n-text strong class="info-label">Nom complet :</n-text>
                    <n-text class="ms-2 info-value">
                      {{ reservation.client.nomCli }} {{ reservation.client.prenomCli }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong class="info-label">Email :</n-text>
                    <n-text class="ms-2 info-email">
                      {{ reservation.client.emailCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong class="info-label">Téléphone :</n-text>
                    <n-text class="ms-2 info-value">
                      {{ reservation.client.telephoneCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong class="info-label">ID Client :</n-text>
                    <n-tag size="small" type="info" class="ms-2 id-tag">
                      {{ reservation.client.idCli }}
                    </n-tag>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Ressource Demandée -->
            <n-gi>
              <n-card title="Ressource Demandée" size="small" class="h-100 resource-card">
                <template #header-extra>
                  <n-icon size="20" class="card-icon">
                    <i class="bi" :class="getResourceIcon(reservation.typeRes)"></i>
                  </n-icon>
                </template>

                <n-space vertical>
                  <div class="info-item">
                    <n-text strong class="info-label">Type :</n-text>
                    <n-tag :type="getResourceTagType(reservation.typeRes)" size="small" class="ms-2 type-tag">
                      {{ getRessourceType(reservation) }}
                    </n-tag>
                  </div>
                  <div class="info-item">
                    <n-text strong class="info-label">Période :</n-text>
                    <n-text class="ms-2 period-value">
                      Du {{ formatDate(reservation.debRes) }}<br>
                      Au {{ formatDate(reservation.finRes) }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong class="info-label">{{ reservation.typeRes === 'Materiel' ? 'Quantité' : 'Personnes' }} :</n-text>
                    <n-text class="ms-2 quantity-value" strong>
                      {{ reservation.qteMat || reservation.nbPerso }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong class="info-label">Tarif Total :</n-text>
                    <n-text class="ms-2 price-value">
                      {{ reservation.tarifTot }} MGA
                    </n-text>
                  </div>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </n-card>

        <!-- Processus de Validation -->
        <n-card class="validation-card" title="Processus de Validation">
          <template #header-extra>
            <n-steps :current="currentStep" status="process" class="validation-steps">
              <n-step title="Contrat" description="Génération du document" />
              <n-step title="Signature" description="Validation client" />
              <n-step title="Activation" description="Finalisation" />
            </n-steps>
          </template>

          <!-- Étape 1: Contrat -->
          <n-card title="1. Génération du Contrat" size="small" class="mb-4 step-card">
            <n-alert type="info" class="mb-3 step-alert">
              <template #icon>
                <n-icon>
                  <i class="bi bi-info-circle"></i>
                </n-icon>
              </template>
              <span class="alert-text">
                Le système a vérifié la disponibilité. Vous confirmez le transfert vers une location active.
              </span>
            </n-alert>

            <div class="button-group">
              <n-button 
                type="primary" 
                ghost 
                @click="genererContrat"
                class="me-3 pdf-button"
                :loading="generatingPdf"
                :disabled="contractReady"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-file-earmark-text"></i>
                  </n-icon>
                </template>
                <span class="button-text">Générer le Contrat PDF</span>
              </n-button>

              <n-button 
                v-if="pdfUrl"
                type="success" 
                @click="ouvrirPDF"
                class="me-3 pdf-button"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-eye"></i>
                  </n-icon>
                </template>
                <span class="button-text">Voir le PDF</span>
              </n-button>

              <n-button 
                v-if="pdfUrl"
                type="warning" 
                ghost 
                @click="telechargerPDF"
                class="pdf-button"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-download"></i>
                  </n-icon>
                </template>
                <span class="button-text">Télécharger</span>
              </n-button>
            </div>

            <n-alert v-if="contractReady" type="success" class="mt-3 success-alert">
              <template #icon>
                <n-icon>
                  <i class="bi bi-check-circle"></i>
                </n-icon>
              </template>
              <span class="alert-text">
                Contrat généré et prêt pour la signature électronique
              </span>
            </n-alert>
          </n-card>

          <!-- Étape 2: Signature -->
          <n-card title="2. Signature Électronique" size="small" class="mb-4 step-card">
            <n-form :model="signatureForm" :rules="signatureRules" class="signature-form">
              <n-form-item label="Signature électronique" path="signature" class="signature-item">
                <n-input
                  v-model:value="signatureData"
                  placeholder="Entrez 'SIGNÉ' pour simuler la signature"
                  :disabled="!contractReady"
                  clearable
                  class="signature-input"
                />
                <template #feedback>
                  <n-text class="signature-hint">
                    Ce champ simule l'étape de signature électronique du client
                  </n-text>
                </template>
              </n-form-item>
            </n-form>
          </n-card>

          <!-- Étape 3: Finalisation -->
          <n-card title="3. Finalisation" size="small" class="step-card">
            <n-button
              type="primary"
              size="large"
              :disabled="!isReadyToValidate || isProcessing"
              :loading="isProcessing"
              @click="handleValidation"
              class="w-100 validate-btn"
            >
              <template #icon>
                <n-icon>
                  <i class="bi bi-check-circle-fill"></i>
                </n-icon>
              </template>
              <span class="validate-text">
                {{ isProcessing ? 'Traitement en cours...' : 'Confirmer la Location et Activer le Contrat' }}
              </span>
            </n-button>

            <n-alert v-if="!isReadyToValidate && contractReady" type="warning" class="mt-3 warning-alert">
              <template #icon>
                <n-icon>
                  <i class="bi bi-exclamation-triangle"></i>
                </n-icon>
              </template>
              <span class="alert-text">
                Veuillez compléter la signature électronique pour finaliser la validation
              </span>
            </n-alert>
          </n-card>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jsPDF } from 'jspdf';
import {
  NButton,
  NIcon,
  NCard,
  NTag,
  NGrid,
  NGi,
  NSpace,
  NText,
  NAlert,
  NSpin,
  NSteps,
  NStep,
  NForm,
  NFormItem,
  NInput
} from 'naive-ui';
import LocationService from '../services/LocationService';

const route = useRoute();
const router = useRouter();

const idRes = ref(null);
const reservation = ref(null);
const loading = ref(true);
const errorMessage = ref(null);
const successMessage = ref(null);
const isProcessing = ref(false);
const contractReady = ref(false);
const signatureData = ref('');

// Nouveaux états pour la gestion PDF
const generatingPdf = ref(false);
const pdfUrl = ref(null);
const pdfBlob = ref(null);

// ------------------------------------
// PROPRIÉTÉS CALCULÉES
// ------------------------------------
const currentStep = computed(() => {
  if (!contractReady.value) return 0;
  if (contractReady.value && !isReadyToValidate.value) return 1;
  return 2;
});

const isReadyToValidate = computed(() => {
  return contractReady.value && signatureData.value.toUpperCase() === 'SIGNÉ';
});

// ------------------------------------
// RÈGLES DE VALIDATION
// ------------------------------------
const signatureRules = {
  signature: {
    validator: (rule, value) => {
      if (!value) {
        return new Error('La signature est requise');
      }
      if (value.toUpperCase() !== 'SIGNÉ') {
        return new Error('Veuillez entrer "SIGNÉ" pour valider');
      }
      return true;
    },
    trigger: ['input', 'blur']
  }
};

const signatureForm = computed(() => ({
  signature: signatureData.value
}));

// ------------------------------------
// MÉTHODES PDF AVEC LOGO
// ------------------------------------
const genererContrat = async () => {
  generatingPdf.value = true;
  errorMessage.value = null;
  
  try {
    await genererVraiPDF();
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    errorMessage.value = "Erreur lors de la génération du PDF";
  } finally {
    generatingPdf.value = false;
  }
};



const genererVraiPDF = () => {
  return new Promise((resolve) => {
    try {
      const doc = new jsPDF();
      
      // Variables pour la mise en page
      const margeGauche = 15;
      const ligneCentre = 105;
      let yPosition = 50;
      
      // --- EN-TÊTE PROFESSIONNELLE ---
      // Logo CEDII (à gauche)
      const cheminsLogo = [
        '/images/logo.jpg',
        '/public/images/logo.jpg',
        './images/logo.jpg',
        window.location.origin + '/images/logo.jpg',
        'logo.jpg'
      ];
      
      let logoAjoute = false;
      for (const chemin of cheminsLogo) {
        try {
          doc.addImage(chemin, 'JPEG', margeGauche, 15, 30, 30);
          logoAjoute = true;
          console.log('✅ Logo ajouté avec chemin:', chemin);
          break;
        } catch (e) {
          console.log('❌ Échec avec chemin:', chemin);
          continue;
        }
      }
      
      if (!logoAjoute) {
        console.warn('⚠️ Logo non trouvé, ajout du texte CEDII');
        doc.setFontSize(14);
        doc.setTextColor(91, 17, 238);
        doc.setFont("helvetica", "bold");
        doc.text('CEDII', margeGauche + 5, 25);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(" Centre d'Echanges,", margeGauche + 5, 32);
        doc.text("de Documentation et d'Information", margeGauche + 5, 37);
        doc.text("Inter-Institutionnelles", margeGauche + 5, 42);
      }
        
      // Titre centré
      doc.setFontSize(18);
      doc.setTextColor(4, 5, 191);
      doc.setFont("helvetica", "bold");
      doc.text('CONTRAT DE LOCATION', ligneCentre, 25, { align: 'center' });
      
      // Sous-titre
      doc.setFontSize(11);
      doc.setTextColor(94, 94, 94);
      doc.setFont("helvetica", "normal");
      doc.text(`N° de contrat : ${idRes.value}`, ligneCentre, 32, { align: 'center' });
      
      // Date
      const dateFormatted = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      doc.text(`Fait à Fianarantsoa, le ${dateFormatted}`, ligneCentre, 38, { align: 'center' });
      
      // Ligne séparatrice
      doc.setDrawColor(6, 113, 182);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // --- PARTIES CONTRACTANTES ---
      yPosition = 55;
      doc.setFontSize(12);
      doc.setTextColor(2, 6, 30);
      doc.setFont("helvetica", "bold");
      doc.text('ENTRE LES SOUSSIGNÉS :', margeGauche, yPosition);
      yPosition += 10;
      
      // COLONNE GAUCHE - CEDII
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text('CENTRE CEDII :', margeGauche, yPosition);
      doc.setFont("helvetica", "normal");
      
      const infoCEDII = [
        " Centre d'Echanges, de Documentation",
        " et d'Information Inter-Institutionnelles",
        "Représenté par son responsable",
        "Adresse: Boulevard Philibert Tsiranana Tsianonlondroa Fianarantsoa 301",
        "Tél: +261 34 03 931 91/ +261 34 60 020 34",
        "Email: cediifia@gmail.com",
        "NIF: 1234567890",
        "Stat: 9876543210"
      ];
      
      infoCEDII.forEach((ligne, index) => {
        doc.text(String(ligne), margeGauche + 5, yPosition + 7 + (index * 5));
      });
      
      // COLONNE DROITE - CLIENT
      doc.setFont("helvetica", "bold");
      doc.text('LE CLIENT :', ligneCentre + 10, yPosition);
      doc.setFont("helvetica", "normal");
      
      const clientNom = reservation.value?.client.nomCli || reservation.value?.client.nomCli || '[Nom]';
      const clientPrenom = reservation.value?.client.prenomCli || reservation.value?.client.prenomCli || '[Prénom]';
      
      const clientInfo = [
        `Nom: ${clientNom}`,
        `Prénom: ${clientPrenom}`,
        
        `Téléphone: ${reservation.value?.client.telephoneCli || reservation.value?.client.telephone || '[Téléphone]'}`,
        `Email: ${reservation.value?.client.emailCli || reservation.value?.client.email || '[Email]'}`,
       
      ];
      
      clientInfo.forEach((ligne, index) => {
        doc.text(String(ligne), ligneCentre + 15, yPosition + 7 + (index * 5));
      });
      
      yPosition += 50;
      
      // --- DÉTAILS DE LA LOCATION ---
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text('DÉTAILS DE LA LOCATION :', margeGauche, yPosition);
      yPosition += 10;
      
      // Encadré pour les détails
      doc.setDrawColor(91, 17, 238);
      doc.setLineWidth(0.2);
      doc.rect(margeGauche, yPosition - 2, 175, 35);
      
      const detailsLocation = [
        { label: 'Type de ressource:', value: getRessourceType(reservation.value) || '[Type]' },
      
        { label: 'Date de début:', value: formatDate(reservation.value?.debRes) || '[Date début]' },
        { label: 'Date de fin:', value: formatDate(reservation.value?.finRes) || '[Date fin]' },
        { label: 'Quantité/Personnes:', value: String(reservation.value?.qteMat || reservation.value?.nbPerso || '[Nombre]') },
        { label: 'Tarif total:', value: `${String(reservation.value?.tarifTot || '0')} MGA` }
      ];
      
      detailsLocation.forEach((detail, index) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(String(detail.label), margeGauche + 5, yPosition + (index * 6) + 5);
        doc.setFont("helvetica", "normal");
        doc.text(String(detail.value), margeGauche + 50, yPosition + (index * 6) + 5);
      });
      
      yPosition += 45;
      
      // --- CONDITIONS GÉNÉRALES ---
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text('CONDITIONS GÉNÉRALES :', margeGauche, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      const conditions = [
       
        "1. Toute annulation doit être notifiée au minimum 48 heures à l'avance.",
        "2. Le client est entièrement responsable du matériel pendant toute la durée de la location.",
      
        "3. Le non-respect des horaires de restitution peut entraîner des frais supplémentaires.",
        "4. Un état des lieux sera effectué avant la remise et après la restitution du matériel.",
       
      ];
      
      conditions.forEach(condition => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        try {
          const splitText = doc.splitTextToSize(String(condition), 170);
          if (Array.isArray(splitText)) {
            splitText.forEach((line) => {
              if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(String(line), margeGauche, yPosition);
              yPosition += 5;
            });
          } else {
            doc.text(String(condition), margeGauche, yPosition);
            yPosition += 5;
          }
        } catch (error) {
          console.warn('Erreur avec condition:', condition);
          doc.text(String(condition), margeGauche, yPosition);
          yPosition += 5;
        }
      });
      
      yPosition += 10;
      
      // --- SIGNATURES ---
      // Ligne de séparation
      doc.setDrawColor(4, 5, 191);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 15;
      
      // Zone signatures
      doc.setFontSize(10);
      
      // Signature Client (droite)
      doc.text('Pour le Client,', ligneCentre + 40, yPosition, { align: 'center' });
      doc.text('Lu et approuvé', ligneCentre + 40, yPosition + 5, { align: 'center' });
      doc.setDrawColor(94, 94, 94);
      doc.line(ligneCentre + 20, yPosition + 15, ligneCentre + 60, yPosition + 15);
      doc.text('Signature précédée de la mention', ligneCentre + 40, yPosition + 25, { align: 'center' });
      doc.text('« Lu et approuvé »', ligneCentre + 40, yPosition + 30, { align: 'center' });
      
      // Signature CEDII (gauche)
      doc.text('Pour le CEDII,', margeGauche + 40, yPosition, { align: 'center' });
      doc.setDrawColor(94, 94, 94);
      doc.line(margeGauche + 20, yPosition + 15, margeGauche + 60, yPosition + 15);
      doc.text('Le Responsable', margeGauche + 40, yPosition + 25, { align: 'center' });
      doc.text('Cachet et signature', margeGauche + 40, yPosition + 30, { align: 'center' });
      
      // --- PIED DE PAGE ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(94, 94, 94);
        doc.text(`CEDII - 
Centre d'Echanges, de Documentation et d'Information Inter-Institutionnelles`, ligneCentre, 287, { align: 'center' });
        doc.text(`Page ${i} / ${pageCount}`, ligneCentre, 292, { align: 'center' });
      }
      
      // Générer le blob PDF
      const pdfBlobData = doc.output('blob');
      pdfUrl.value = URL.createObjectURL(pdfBlobData);
      pdfBlob.value = pdfBlobData;
      contractReady.value = true;
      successMessage.value = "Contrat PDF professionnel généré avec succès";
      
      resolve();
      
    } catch (error) {
      console.error("Erreur détaillée génération PDF:", error);
      try {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(4, 5, 191);
        doc.text('CONTRAT DE LOCATION CEDII', 105, 50, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`N°: ${idRes.value}`, 105, 60, { align: 'center' });
        doc.text('Document généré avec succès', 105, 70, { align: 'center' });
        
        const pdfBlobData = doc.output('blob');
        pdfUrl.value = URL.createObjectURL(pdfBlobData);
        pdfBlob.value = pdfBlobData;
        contractReady.value = true;
        successMessage.value = "Contrat PDF de base généré";
      } catch (fallbackError) {
        console.error("Même la version fallback a échoué:", fallbackError);
        errorMessage.value = "Impossible de générer le PDF";
      }
      resolve();
    }
  });
};


const ouvrirPDF = () => {
  if (pdfUrl.value) {
    window.open(pdfUrl.value, '_blank');
  }
};

const telechargerPDF = () => {
  if (pdfBlob.value) {
    const link = document.createElement('a');
    link.href = pdfUrl.value;
    link.download = `contrat-location-cedii-${idRes.value}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Nettoyer les URLs créées
const cleanup = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
  }
};

// ------------------------------------
// MÉTHODES EXISTANTES
// ------------------------------------
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  } catch {
    return dateString.substring(0, 16);
  }
};

const getRessourceType = (request) => {
  const typeMap = {
    'Salle': 'Salle',
    'Materiel': 'Matériel',
    'Mixte': 'Salle & Matériel'
  };
  return typeMap[request.typeRes] || 'Non spécifié';
};



const getResourceIcon = (type) => {
  const icons = {
    'Salle': 'bi-house-door',
    'Materiel': 'bi-tools',
    'Mixte': 'bi-collection'
  };
  return icons[type] || 'bi-question-circle';
};

const getResourceTagType = (type) => {
  const types = {
    'Salle': 'primary',
    'Materiel': 'warning',
    'Mixte': 'success'
  };
  return types[type] || 'default';
};

const getStatusType = (status) => {
  const types = {
    'En attente': 'warning',
    'Confirmée': 'success',
    'Refusée': 'error',
    'Annulée': 'default'
  };
  return types[status] || 'default';
};

const fetchReservationDetails = async () => {
  if (!idRes.value) {
    loading.value = false;
    errorMessage.value = "Erreur: L'identifiant de la réservation est manquant.";
    return;
  }
  
  loading.value = true;
  errorMessage.value = null;
  try {
    const response = await LocationService.getReservationDetails(idRes.value);
    reservation.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement des détails:", error);
    errorMessage.value = `Impossible de charger la réservation : ${error.response?.data?.message || error.message}`;
  } finally {
    loading.value = false;
  }
};

const handleValidation = async () => {
  if (!isReadyToValidate.value) return;

  isProcessing.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await LocationService.validateReservation(idRes.value, signatureData.value);
    
    successMessage.value = response.data.message;
    
    setTimeout(() => {
      router.push({ name: 'DemandesEnAttente' });
    }, 2000);
    
  } catch (error) {
    console.error("Erreur de validation:", error);
    errorMessage.value = `Échec de la validation : ${error.response?.data?.message || error.message}`;
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  const routeId = route.params.idRes;
  console.log("Paramètres de la route:", route.params);
  
  if (routeId) {
    idRes.value = routeId;
    fetchReservationDetails();
  } else {
    loading.value = false;
    errorMessage.value = "Erreur: L'identifiant de la réservation est introuvable.";
  }
});

// Nettoyage quand le composant est détruit
onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
/* PALETTE CEDII AMÉLIORÉE */
:root {
  --cedii-primary: #5B11EE;
  --cedii-primary-dark: #4A0FCC;
  --cedii-secondary: #0405BF;
  --cedii-secondary-dark: #0304A3;
  --cedii-accent: #0671B6;
  --cedii-accent-light: #0A8CD6;
  --cedii-dark: #02061E;
  --cedii-gray: #5E5E5E;
  --cedii-gray-light: #757575;
  --cedii-light: #F8F9FA;
  --cedii-white: #FFFFFF;
  --cedii-success: #28A745;
  --cedii-warning: #FFC107;
  --cedii-error: #DC3545;
}

.validation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, var(--cedii-primary) 0%, var(--cedii-secondary) 100%);
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(91, 17, 238, 0.15);
  flex-shrink: 0;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.95);
}

.back-button {
  min-width: 160px;
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  font-weight: 500;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

/* Alertes */
.alert-fixed {
  flex-shrink: 0;
  border-radius: 8px;
  border-left: 4px solid;
}

/* Contenu scrollable */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 12px;
  padding-bottom: 20px;
}

/* Scrollbar */
.scrollable-content::-webkit-scrollbar {
  width: 10px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: var(--cedii-light);
  border-radius: 5px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--cedii-primary), var(--cedii-secondary));
  border-radius: 5px;
  border: 2px solid var(--cedii-light);
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, var(--cedii-secondary), var(--cedii-dark));
}

/* Loading State */
.loading-state {
  padding: 3rem 0;
}

.loading-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid var(--cedii-primary);
}

.loading-text {
  color: var(--cedii-secondary);
  font-weight: 500;
}

/* Cartes principales */
.main-card, .validation-card {
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 2px solid rgba(91, 17, 238, 0.1);
  background: white;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.main-card:hover, .validation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(91, 17, 238, 0.15);
}

/* Cartes internes */
.client-card, .resource-card, .step-card {
  border-radius: 12px;
  border: 1px solid rgba(6, 113, 182, 0.15);
  background: linear-gradient(to bottom right, rgba(248, 249, 250, 0.8), white);
}

.client-card {
  border-top: 4px solid var(--cedii-accent);
}

.resource-card {
  border-top: 4px solid var(--cedii-primary);
}

.step-card {
  border-top: 4px solid var(--cedii-secondary);
}

/* Éléments des cartes */
.card-icon {
  color: var(--cedii-primary) !important;
}

.status-tag {
  font-weight: 600;
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 20px;
}

/* Info items */
.info-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid rgba(94, 94, 94, 0.08);
  transition: background-color 0.2s ease;
}

.info-item:hover {
  background-color: rgba(248, 249, 250, 0.5);
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 6px;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--cedii-dark);
  min-width: 140px;
  font-weight: 600;
}

.info-value {
  color: var(--cedii-dark);
  font-weight: 500;
}

.info-email {
  color: var(--cedii-accent) !important;
  font-weight: 500;
  text-decoration: none;
}

.info-email:hover {
  text-decoration: underline;
}

.period-value {
  color: var(--cedii-gray);
  font-weight: 500;
  line-height: 1.5;
}

.quantity-value {
  color: var(--cedii-secondary);
  font-size: 1.1rem;
}

.price-value {
  color: var(--cedii-primary);
  font-weight: 700;
  font-size: 1.2rem;
}

/* Tags */
.id-tag, .type-tag {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Étapes de validation */
.validation-steps {
  padding: 16px 0;
}

/* Alerts dans les étapes */
.step-alert, .success-alert, .warning-alert {
  border-radius: 10px;
  border: 1px solid;
  border-left-width: 6px;
}

.step-alert {
  border-color: rgba(6, 113, 182, 0.2);
  border-left-color: var(--cedii-accent);
  background-color: rgba(6, 113, 182, 0.05);
}

.success-alert {
  border-color: rgba(4, 5, 191, 0.2);
  border-left-color: var(--cedii-secondary);
  background-color: rgba(4, 5, 191, 0.05);
}

.warning-alert {
  border-color: rgba(91, 17, 238, 0.2);
  border-left-color: var(--cedii-primary);
  background-color: rgba(91, 17, 238, 0.05);
}

.alert-text {
  color: var(--cedii-dark);
  font-weight: 500;
}

/* Boutons PDF */
.button-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.pdf-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 180px;
}

.pdf-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.button-text {
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Formulaire de signature */
.signature-form {
  padding: 8px 0;
}

.signature-item {
  margin-bottom: 8px;
}

.signature-input {
  font-size: 1rem;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid rgba(94, 94, 94, 0.2);
  transition: all 0.3s ease;
}

.signature-input:focus {
  border-color: var(--cedii-primary);
  box-shadow: 0 0 0 3px rgba(91, 17, 238, 0.1);
  outline: none;
}

.signature-input:hover {
  border-color: var(--cedii-accent);
}

.signature-hint {
  color: var(--cedii-gray-light);
  font-size: 0.85rem;
  margin-top: 4px;
}

/* Bouton de validation */
.validate-btn {
  height: 56px;
  font-weight: 700;
  font-size: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--cedii-primary) 0%, var(--cedii-secondary) 100%);
  border: none;
  box-shadow: 0 6px 20px rgba(91, 17, 238, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.validate-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.validate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(91, 17, 238, 0.4);
}

.validate-btn:hover::before {
  left: 100%;
}

.validate-btn:disabled {
  background: var(--cedii-gray-light);
  transform: none;
  box-shadow: none;
}

.validate-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.validate-btn:disabled::before {
  display: none;
}

.validate-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Override Naive UI styles */
:deep(.n-card__header) {
  padding: 20px 24px;
  background: linear-gradient(to right, rgba(248, 249, 250, 0.9), white);
  border-bottom: 2px solid rgba(91, 17, 238, 0.1);
}

:deep(.n-card__title) {
  color: var(--cedii-dark) !important;
  font-size: 1.25rem;
  font-weight: 700;
}

:deep(.n-alert.n-alert--info .n-alert__icon) {
  color: var(--cedii-accent) !important;
}

:deep(.n-alert.n-alert--success .n-alert__icon) {
  color: var(--cedii-success) !important;
}

:deep(.n-alert.n-alert--warning .n-alert__icon) {
  color: var(--cedii-warning) !important;
}

:deep(.n-alert.n-alert--error .n-alert__icon) {
  color: var(--cedii-error) !important;
}

:deep(.n-alert__title) {
  color: var(--cedii-dark) !important;
  font-weight: 600;
}

:deep(.n-steps .n-step.n-step--active .n-step__indicator) {
  background-color: var(--cedii-primary) !important;
  border-color: var(--cedii-primary) !important;
}

:deep(.n-step__title) {
  color: var(--cedii-dark) !important;
  font-weight: 600;
}

/* Correction du texte invisible */
.n-button {
  color: inherit;
}

.n-button span:not(.n-icon) {
  color: inherit !important;
}

/* Couleurs spécifiques */
.n-button--primary-type span:not(.n-icon) {
  color: white !important;
}

.n-button--success-type span:not(.n-icon) {
  color: white !important;
}

.n-button--warning-type.n-button--ghost span:not(.n-icon) {
  color: var(--n-text-color) !important;
}

:deep(.n-step__description) {
  color: var(--cedii-gray) !important;
}

:deep(.n-button--primary-type) {
  background-color: var(--cedii-secondary) !important;
  border-color: var(--cedii-secondary) !important;
  color: white !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--cedii-secondary-dark) !important;
  border-color: var(--cedii-secondary-dark) !important;
}

:deep(.n-button--success-type) {
  background-color: var(--cedii-accent) !important;
  border-color: var(--cedii-accent) !important;
  color: white !important;
}

:deep(.n-button--success-type:hover) {
  background-color: var(--cedii-accent-light) !important;
  border-color: var(--cedii-accent-light) !important;
}

:deep(.n-button--warning-type) {
  background-color: var(--cedii-gray) !important;
  border-color: var(--cedii-gray) !important;
  color: white !important;
}

:deep(.n-button--warning-type:hover) {
  background-color: var(--cedii-gray-light) !important;
  border-color: var(--cedii-gray-light) !important;
}

:deep(.n-button--primary-type.ghost) {
  color: var(--cedii-secondary) !important;
  border-color: var(--cedii-secondary) !important;
  background: transparent !important;
}

:deep(.n-button--primary-type.ghost:hover) {
  background-color: rgba(4, 5, 191, 0.1) !important;
}

:deep(.n-tag.n-tag--primary) {
  background-color: rgba(91, 17, 238, 0.1) !important;
  color: var(--cedii-primary) !important;
  border-color: var(--cedii-primary) !important;
}

:deep(.n-tag.n-tag--info) {
  background-color: rgba(6, 113, 182, 0.1) !important;
  color: var(--cedii-accent) !important;
  border-color: var(--cedii-accent) !important;
}

:deep(.n-tag.n-tag--warning) {
  background-color: rgba(255, 193, 7, 0.1) !important;
  color: var(--cedii-warning) !important;
  border-color: var(--cedii-warning) !important;
}

:deep(.n-tag.n-tag--success) {
  background-color: rgba(40, 167, 69, 0.1) !important;
  color: var(--cedii-success) !important;
  border-color: var(--cedii-success) !important;
}

:deep(.n-tag.n-tag--error) {
  background-color: rgba(220, 53, 69, 0.1) !important;
  color: var(--cedii-error) !important;
  border-color: var(--cedii-error) !important;
}

/* Responsive */
@media (max-width: 992px) {
  .validation-container {
    padding: 16px;
  }
  
  .header-section {
    padding: 16px 20px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .validation-container {
    padding: 12px;
    height: 100vh;
  }
  
  .header-section .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .back-button {
    align-self: flex-start;
    min-width: 140px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }

  .scrollable-content {
    padding-right: 4px;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .pdf-button {
    width: 100%;
    min-width: auto;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .info-label {
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .validation-container {
    padding: 8px;
  }
  
  .header-section {
    padding: 12px 16px;
    margin-bottom: 16px;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .back-button {
    min-width: 120px;
    font-size: 0.9rem;
  }
  
  .validate-btn {
    height: 50px;
    font-size: 15px;
  }
  
  :deep(.n-card__header) {
    padding: 16px 20px;
  }
  
  :deep(.n-card__title) {
    font-size: 1.1rem;
  }
}
</style>