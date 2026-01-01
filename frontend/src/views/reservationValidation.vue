<!--<template>
  <div class="validation-container">
     Header avec navigation fixe 
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
          <h1 class="page-title cedii-text-primary mb-2">
            <i class="bi bi-file-earmark-check-fill me-2"></i> 
            Validation de la Demande #{{ idRes }}
          </h1>
          <p class="page-subtitle text-muted mb-0">
            Processus de validation et création de contrat
          </p>
        </div>
      </div>
    </div>

    <!-- Messages d'alerte 
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

    <!-- Contenu scrollable 
    <div class="scrollable-content">
      <!-- État de chargement 
      <div v-if="loading" class="loading-state">
        <n-card class="text-center">
          <n-space vertical align="center" class="py-5">
            <n-spin size="large" />
            <n-text type="primary" class="mt-3 fs-5">
              Chargement des détails de la réservation...
            </n-text>
          </n-space>
        </n-card>
      </div>

      <!-- Contenu principal
      <div v-else-if="reservation" class="content-section">
        <!-- Carte Détails de la Demande 
        <n-card class="main-card mb-4" title="Détails de la Demande">
          <template #header-extra>
            <n-tag :type="getStatusType(reservation.etatRes)" size="small">
              {{ reservation.etatRes }}
            </n-tag>
          </template>

          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <!-- Informations Client 
            <n-gi>
              <n-card title="Informations Client" size="small" class="h-100">
                <template #header-extra>
                  <n-icon size="20" color="var(--cedii-primary-light)">
                    <i class="bi bi-person-badge"></i>
                  </n-icon>
                </template>
                
                <n-space vertical>
                  <div class="info-item">
                    <n-text strong>Nom complet :</n-text>
                    <n-text class="ms-2">
                      {{ reservation.client.nomCli }} {{ reservation.client.prenomCli }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Email :</n-text>
                    <n-text class="ms-2" type="info">
                      {{ reservation.client.emailCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Téléphone :</n-text>
                    <n-text class="ms-2">
                      {{ reservation.client.telephoneCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>ID Client :</n-text>
                    <n-tag size="small" type="info" class="ms-2">
                      {{ reservation.client.idCli }}
                    </n-tag>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Ressource Demandée 
            <n-gi>
              <n-card title="Ressource Demandée" size="small" class="h-100">
                <template #header-extra>
                  <n-icon size="20" color="var(--cedii-primary-light)">
                    <i class="bi" :class="getResourceIcon(reservation.typeRes)"></i>
                  </n-icon>
                </template>

                <n-space vertical>
                  <div class="info-item">
                    <n-text strong>Type :</n-text>
                    <n-tag :type="getResourceTagType(reservation.typeRes)" size="small" class="ms-2">
                      {{ getRessourceType(reservation) }}
                    </n-tag>
                  </div>
                  <div class="info-item">
                    <n-text strong>Période :</n-text>
                    <n-text class="ms-2">
                      Du {{ formatDate(reservation.debRes) }}<br>
                      Au {{ formatDate(reservation.finRes) }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>{{ reservation.typeRes === 'Materiel' ? 'Quantité' : 'Personnes' }} :</n-text>
                    <n-text class="ms-2" strong>
                      {{ reservation.qteMat || reservation.nbPerso }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Tarif Total :</n-text>
                    <n-text class="ms-2 cedii-text-primary fw-bold fs-6">
                      {{ reservation.tarifTot }} MGA
                    </n-text>
                  </div>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </n-card>

        <!-- Processus de Validation 
        <n-card class="validation-card" title="Processus de Validation">
          <template #header-extra>
            <n-steps :current="currentStep" status="process">
              <n-step title="Contrat" description="Génération du document" />
              <n-step title="Signature" description="Validation client" />
              <n-step title="Activation" description="Finalisation" />
            </n-steps>
          </template>

          <!-- Étape 1: Contrat 
          <n-card title="1. Génération du Contrat" size="small" class="mb-4">
            <n-alert type="info" class="mb-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-info-circle"></i>
                </n-icon>
              </template>
              Le système a vérifié la disponibilité. Vous confirmez le transfert vers une location active.
            </n-alert>

            <div class="button-group">
              <n-button 
                type="primary" 
                ghost 
                @click="genererContrat"
                class="me-3"
                :loading="generatingPdf"
                :disabled="contractReady"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-file-earmark-text"></i>
                  </n-icon>
                </template>
                Générer le Contrat PDF
              </n-button>

              <n-button 
                v-if="pdfUrl"
                type="success" 
                @click="ouvrirPDF"
                class="me-3"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-eye"></i>
                  </n-icon>
                </template>
                Voir le PDF
              </n-button>

              <n-button 
                v-if="pdfUrl"
                type="warning" 
                ghost 
                @click="telechargerPDF"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-download"></i>
                  </n-icon>
                </template>
                Télécharger
              </n-button>
            </div>

            <n-alert v-if="contractReady" type="success" class="mt-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-check-circle"></i>
                </n-icon>
              </template>
              Contrat généré et prêt pour la signature électronique
            </n-alert>
          </n-card>

          <!-- Étape 2: Signature 
          <n-card title="2. Signature Électronique" size="small" class="mb-4">
            <n-form :model="signatureForm" :rules="signatureRules">
              <n-form-item label="Signature électronique" path="signature">
                <n-input
                  v-model:value="signatureData"
                  placeholder="Entrez 'SIGNÉ' pour simuler la signature"
                  :disabled="!contractReady"
                  clearable
                />
                <template #feedback>
                  <n-text depth="3" class="small">
                    Ce champ simule l'étape de signature électronique du client
                  </n-text>
                </template>
              </n-form-item>
            </n-form>
          </n-card>

          <!-- Étape 3: Finalisation 
          <n-card title="3. Finalisation" size="small">
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
              {{ isProcessing ? 'Traitement en cours...' : 'Confirmer la Location et Activer le Contrat' }}
            </n-button>

            <n-alert v-if="!isReadyToValidate && contractReady" type="warning" class="mt-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-exclamation-triangle"></i>
                </n-icon>
              </template>
              Veuillez compléter la signature électronique pour finaliser la validation
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
// MÉTHODES PDF CORRIGÉES
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
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('CONTRAT DE LOCATION', 105, 20, { align: 'center' });
    
    // Numéro de contrat
    doc.setFontSize(12);
    doc.text(`N° ${idRes.value}`, 105, 30, { align: 'center' });
    
    // Ligne séparatrice
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    // Informations du contrat
    let yPosition = 50;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('ENTRE LES SOUSSIGNÉS :', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.text('Le CEDII, représenté par son responsable,', 25, yPosition);
    yPosition += 8;
    doc.text(`ET`, 25, yPosition);
    yPosition += 8;
    doc.text(`${reservation.value?.client.nomCli} ${reservation.value?.client.prenomCli}`, 25, yPosition);
    yPosition += 15;
    
    // Détails de la location
    doc.setFontSize(14);
    doc.text('DÉTAILS DE LA LOCATION :', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.text(`Type : ${getRessourceType(reservation.value)}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Période : Du ${formatDate(reservation.value?.debRes)} au ${formatDate(reservation.value?.finRes)}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Quantité/Personnes : ${reservation.value?.qteMat || reservation.value?.nbPerso}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Tarif Total : ${reservation.value?.tarifTot} MGA`, 25, yPosition);
    yPosition += 15;
    
    // Conditions générales
    doc.setFontSize(14);
    doc.text('CONDITIONS GÉNÉRALES :', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(10);
    const conditions = [
      '1. Le présent contrat est valable pour la période convenue',
      '2. Toute annulation doit être notifiée 48h à l\'avance',
      '3. Le client est responsable du matériel pendant la durée de location',
      '4. Tout dommage sera facturé au client',
      '5. Le non-respect des horaires peut entraîner des frais supplémentaires'
    ];
    
    conditions.forEach(condition => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(condition, 25, yPosition);
      yPosition += 7;
    });
    
    // Signatures
    yPosition = Math.max(yPosition + 20, 200);
    doc.setFontSize(12);
    doc.text('Fait à Fianarantsoa, le ' + new Date().toLocaleDateString('fr-FR'), 105, yPosition, { align: 'center' });
    yPosition += 20;
    
    doc.text('___________________', 50, yPosition);
    doc.text('___________________', 140, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text('Signature Client', 50, yPosition);
    doc.text('Signature CEDII', 140, yPosition);
    
    // Générer le blob PDF
    const pdfBlobData = doc.output('blob');
    pdfUrl.value = URL.createObjectURL(pdfBlobData);
    pdfBlob.value = pdfBlobData;
    contractReady.value = true;
    successMessage.value = "Contrat PDF généré avec succès";
    
    resolve();
  });
};
/*
const genererVraiPDF = () => {
  return new Promise((resolve) => {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Variables pour la mise en page
    const margeGauche = 15;
    const margeDroite = 15;
    const largeurColonne = 85;
    const ligneCentre = 105;
    let yPosition = 50;
    
    // --- EN-TÊTE PROFESSIONNELLE ---
    // Logo CEDII (à gauche)
    try {
      const logoPath = 'D:/disqueC/logo.jpg';
      // Note: En production, utilisez une URL ou base64
      // doc.addImage(logoData, 'JPEG', margeGauche, 15, 30, 30);
    } catch (e) {
      console.log("Logo non trouvé, continuation sans logo");
    }
    
    // Titre centré
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // Bleu professionnel
    doc.setFont("helvetica", "bold");
    doc.text('CONTRAT DE LOCATION', ligneCentre, 25, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
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
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
    
    // --- CORPS DU DOCUMENT À DEUX COLONNES ---
    
    // Titre Entre les parties
    yPosition = 55;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text('ENTRE LES SOUSSIGNÉS :', margeGauche, yPosition);
    yPosition += 10;
    
    // Colonne de gauche - CEDII
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('CENTRE CEDII :', margeGauche, yPosition);
    doc.setFont("helvetica", "normal");
    
    const infoCEDII = [
      'Centre d\'Échange et de Diffusion',
      'd\'Informations Informatiques',
      'Représenté par son responsable',
      'Adresse: [Adresse CEDII]',
      'Tél: [Téléphone CEDII]',
      'Email: [Email CEDII]',
      'NIF: [NIF CEDII]',
      'Stat: [STAT CEDII]'
    ];
    
    infoCEDII.forEach((ligne, index) => {
      doc.text(ligne, margeGauche + 5, yPosition + 7 + (index * 5));
    });
    
    // Colonne de droite - Client
    doc.setFont("helvetica", "bold");
    doc.text('LE CLIENT :', ligneCentre + 10, yPosition);
    doc.setFont("helvetica", "normal");
    
    const clientInfo = [
      `Nom: ${reservation.value?.client.nomCli || '[Nom]'}`,
      `Prénom: ${reservation.value?.client.prenomCli || '[Prénom]'}`,
      `Adresse: ${reservation.value?.client.adresse || '[Adresse]'}`,
      `Téléphone: ${reservation.value?.client.telephone || '[Téléphone]'}`,
      `Email: ${reservation.value?.client.email || '[Email]'}`,
      `Profession: ${reservation.value?.client.profession || '[Profession]'}`
    ];
    
    clientInfo.forEach((ligne, index) => {
      doc.text(ligne, ligneCentre + 15, yPosition + 7 + (index * 5));
    });
    
    yPosition += 50;
    
    // --- DÉTAILS DE LA LOCATION ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('DÉTAILS DE LA LOCATION :', margeGauche, yPosition);
    yPosition += 10;
    
    // Encadré pour les détails
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.rect(margeGauche, yPosition - 2, 175, 35);
    
    const detailsLocation = [
      { label: 'Type de ressource:', value: getRessourceType(reservation.value) || '[Type]' },
      { label: 'Date de début:', value: formatDate(reservation.value?.debRes) || '[Date début]' },
      { label: 'Date de fin:', value: formatDate(reservation.value?.finRes) || '[Date fin]' },
      { label: 'Quantité/Personnes:', value: reservation.value?.qteMat || reservation.value?.nbPerso || '[Nombre]' },
      { label: 'Tarif total:', value: `${reservation.value?.tarifTot || '0'} MGA` }
    ];
    
    detailsLocation.forEach((detail, index) => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(detail.label, margeGauche + 5, yPosition + (index * 6) + 5);
      doc.setFont("helvetica", "normal");
      doc.text(detail.value, margeGauche + 50, yPosition + (index * 6) + 5);
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
      '1. Le présent contrat est valable exclusivement pour la période convenue ci-dessus.',
      '2. Toute annulation doit être notifiée au minimum 48 heures à l\'avance.',
      '3. Le client est entièrement responsable du matériel pendant toute la durée de la location.',
      '4. Tout dommage, perte ou vol sera intégralement facturé au client selon la valeur de remplacement.',
      '5. Le non-respect des horaires de restitution peut entraîner des frais supplémentaires.',
      '6. Un état des lieux sera effectué avant la remise et après la restitution du matériel.',
      '7. Le paiement doit être effectué selon les modalités convenues avant la prise du matériel.',
      '8. En cas de litige, le tribunal compétent est celui de Fianarantsoa.'
    ];
    
    conditions.forEach(condition => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      // Texte justifié sur les deux colonnes
      const splitText = doc.splitTextToSize(condition, 170);
      splitText.forEach((line) => {
        doc.text(line, margeGauche, yPosition);
        yPosition += 5;
      });
    });
    
    yPosition += 10;
    
    // --- SIGNATURES ---
    // Ligne de séparation
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 15;
    
    // Zone signatures
    doc.setFontSize(10);
    
    // Signature Client (droite)
    doc.text('Pour le Client,', ligneCentre + 40, yPosition, { align: 'center' });
    doc.text('Lu et approuvé', ligneCentre + 40, yPosition + 5, { align: 'center' });
    doc.setDrawColor(150, 150, 150);
    doc.line(ligneCentre + 20, yPosition + 15, ligneCentre + 60, yPosition + 15);
    doc.text('Signature précédée de la mention', ligneCentre + 40, yPosition + 25, { align: 'center' });
    doc.text('« Lu et approuvé »', ligneCentre + 40, yPosition + 30, { align: 'center' });
    
    // Signature CEDII (gauche)
    doc.text('Pour le CEDII,', margeGauche + 40, yPosition, { align: 'center' });
    doc.setDrawColor(150, 150, 150);
    doc.line(margeGauche + 20, yPosition + 15, margeGauche + 60, yPosition + 15);
    doc.text('Le Responsable', margeGauche + 40, yPosition + 25, { align: 'center' });
    doc.text('Cachet et signature', margeGauche + 40, yPosition + 30, { align: 'center' });
    
    // --- PIED DE PAGE ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`CEDII - Centre d'Échange et de Diffusion d'Informations Informatiques`, ligneCentre, 287, { align: 'center' });
      doc.text(`Page ${i} / ${pageCount}`, ligneCentre, 292, { align: 'center' });
    }
    
    // Générer le blob PDF
    const pdfBlobData = doc.output('blob');
    pdfUrl.value = URL.createObjectURL(pdfBlobData);
    pdfBlob.value = pdfBlobData;
    contractReady.value = true;
    successMessage.value = "Contrat PDF professionnel généré avec succès";
    
    resolve();
  });
};
*/
const ouvrirPDF = () => {
  if (pdfUrl.value) {
    // Ouvrir dans un nouvel onglet
    window.open(pdfUrl.value, '_blank');
  }
};

const telechargerPDF = () => {
  if (pdfBlob.value) {
    const link = document.createElement('a');
    link.href = pdfUrl.value;
    link.download = `contrat-location-${idRes.value}.pdf`;
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
    
    // Redirection après délai pour voir le message de succès
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
.validation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header Section fixe */
.header-section {
  background: transparent;
  flex-shrink: 0;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
}

.back-button {
  min-width: 160px;
}

/* Alertes fixes */
.alert-fixed {
  flex-shrink: 0;
}

/* Contenu scrollable */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

/* Scrollbar personnalisée */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: var(--cedii-primary-light, #5B11EE);
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: var(--cedii-primary-dark, #0671b6);
}

/* Pour Firefox */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: var(--cedii-primary-light, #5B11EE) #f1f1f1;
}

/* Cards */
.main-card, .validation-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Loading State */
.loading-state {
  padding: 2rem 0;
}

/* Content Section */
.content-section {
  min-height: min-content;
  padding-bottom: 20px;
}

/* Info Items */
.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

/* Validation Button */
.validate-btn {
  height: 50px;
  font-weight: 600;
  font-size: 16px;
}

/* Groupe de boutons PDF */
.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

/* Palette CEDII */
.cedii-text-primary { 
  color: var(--cedii-primary-light, #5B11EE) !important; 
}

:deep(.n-button--primary-type) {
  background-color: var(--cedii-primary-light, #5B11EE) !important;
  border-color: var(--cedii-primary-light, #5B11EE) !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--cedii-primary-dark, #0671b6) !important;
  border-color: var(--cedii-primary-dark, #0671b6) !important;
}

/* Steps customization */
:deep(.n-steps .n-step .n-step__indicator) {
  border-color: var(--cedii-primary-light, #5B11EE);
}

:deep(.n-steps .n-step.n-step--active .n-step__indicator) {
  background-color: var(--cedii-primary-light, #5B11EE);
}

/* Responsive */
@media (max-width: 768px) {
  .validation-container {
    padding: 12px;
    height: 100vh;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-section .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .back-button {
    align-self: flex-start;
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
  }
  
  .button-group .n-button {
    width: 100%;
    margin-bottom: 8px;
  }
}

@media (max-width: 576px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .validation-container {
    padding: 8px;
  }
}
</style>-->

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
          <h1 class="page-title cedii-text-primary mb-2">
            <i class="bi bi-file-earmark-check-fill me-2"></i> 
            Validation de la Demande #{{ idRes }}
          </h1>
          <p class="page-subtitle text-muted mb-0">
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
        <n-card class="text-center">
          <n-space vertical align="center" class="py-5">
            <n-spin size="large" />
            <n-text type="primary" class="mt-3 fs-5">
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
            <n-tag :type="getStatusType(reservation.etatRes)" size="small">
              {{ reservation.etatRes }}
            </n-tag>
          </template>

          <n-grid :cols="2" :x-gap="24" :y-gap="16">
            <!-- Informations Client -->
            <n-gi>
              <n-card title="Informations Client" size="small" class="h-100">
                <template #header-extra>
                  <n-icon size="20" color="var(--cedii-primary-light)">
                    <i class="bi bi-person-badge"></i>
                  </n-icon>
                </template>
                
                <n-space vertical>
                  <div class="info-item">
                    <n-text strong>Nom complet :</n-text>
                    <n-text class="ms-2">
                      {{ reservation.client.nomCli }} {{ reservation.client.prenomCli }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Email :</n-text>
                    <n-text class="ms-2" type="info">
                      {{ reservation.client.emailCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Téléphone :</n-text>
                    <n-text class="ms-2">
                      {{ reservation.client.telephoneCli || 'Non renseigné' }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>ID Client :</n-text>
                    <n-tag size="small" type="info" class="ms-2">
                      {{ reservation.client.idCli }}
                    </n-tag>
                  </div>
                </n-space>
              </n-card>
            </n-gi>

            <!-- Ressource Demandée -->
            <n-gi>
              <n-card title="Ressource Demandée" size="small" class="h-100">
                <template #header-extra>
                  <n-icon size="20" color="var(--cedii-primary-light)">
                    <i class="bi" :class="getResourceIcon(reservation.typeRes)"></i>
                  </n-icon>
                </template>

                <n-space vertical>
                  <div class="info-item">
                    <n-text strong>Type :</n-text>
                    <n-tag :type="getResourceTagType(reservation.typeRes)" size="small" class="ms-2">
                      {{ getRessourceType(reservation) }}
                    </n-tag>
                  </div>
                  <div class="info-item">
                    <n-text strong>Période :</n-text>
                    <n-text class="ms-2">
                      Du {{ formatDate(reservation.debRes) }}<br>
                      Au {{ formatDate(reservation.finRes) }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>{{ reservation.typeRes === 'Materiel' ? 'Quantité' : 'Personnes' }} :</n-text>
                    <n-text class="ms-2" strong>
                      {{ reservation.qteMat || reservation.nbPerso }}
                    </n-text>
                  </div>
                  <div class="info-item">
                    <n-text strong>Tarif Total :</n-text>
                    <n-text class="ms-2 cedii-text-primary fw-bold fs-6">
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
            <n-steps :current="currentStep" status="process">
              <n-step title="Contrat" description="Génération du document" />
              <n-step title="Signature" description="Validation client" />
              <n-step title="Activation" description="Finalisation" />
            </n-steps>
          </template>

          <!-- Étape 1: Contrat -->
          <n-card title="1. Génération du Contrat" size="small" class="mb-4">
            <n-alert type="info" class="mb-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-info-circle"></i>
                </n-icon>
              </template>
              Le système a vérifié la disponibilité. Vous confirmez le transfert vers une location active.
            </n-alert>

            <div class="button-group">
              <n-button 
                type="primary" 
                ghost 
                @click="genererContrat"
                class="me-3"
                :loading="generatingPdf"
                :disabled="contractReady"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-file-earmark-text"></i>
                  </n-icon>
                </template>
                Générer le Contrat PDF
              </n-button>

              <n-button 
                v-if="pdfUrl"
                type="success" 
                @click="ouvrirPDF"
                class="me-3"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-eye"></i>
                  </n-icon>
                </template>
                Voir le PDF
              </n-button>

              <n-button 
                v-if="pdfUrl"
                type="warning" 
                ghost 
                @click="telechargerPDF"
              >
                <template #icon>
                  <n-icon>
                    <i class="bi bi-download"></i>
                  </n-icon>
                </template>
                Télécharger
              </n-button>
            </div>

            <n-alert v-if="contractReady" type="success" class="mt-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-check-circle"></i>
                </n-icon>
              </template>
              Contrat généré et prêt pour la signature électronique
            </n-alert>
          </n-card>

          <!-- Étape 2: Signature -->
          <n-card title="2. Signature Électronique" size="small" class="mb-4">
            <n-form :model="signatureForm" :rules="signatureRules">
              <n-form-item label="Signature électronique" path="signature">
                <n-input
                  v-model:value="signatureData"
                  placeholder="Entrez 'SIGNÉ' pour simuler la signature"
                  :disabled="!contractReady"
                  clearable
                />
                <template #feedback>
                  <n-text depth="3" class="small">
                    Ce champ simule l'étape de signature électronique du client
                  </n-text>
                </template>
              </n-form-item>
            </n-form>
          </n-card>

          <!-- Étape 3: Finalisation -->
          <n-card title="3. Finalisation" size="small">
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
              {{ isProcessing ? 'Traitement en cours...' : 'Confirmer la Location et Activer le Contrat' }}
            </n-button>

            <n-alert v-if="!isReadyToValidate && contractReady" type="warning" class="mt-3">
              <template #icon>
                <n-icon>
                  <i class="bi bi-exclamation-triangle"></i>
                </n-icon>
              </template>
              Veuillez compléter la signature électronique pour finaliser la validation
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
      const margeDroite = 15;
      const largeurColonne = 85;
      const ligneCentre = 105;
      let yPosition = 50;
      
      // --- EN-TÊTE PROFESSIONNELLE ---
      // Logo CEDII (à gauche) - Essayer plusieurs chemins
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
        // Texte de remplacement pour le logo
        doc.setFontSize(14);
        doc.setTextColor(0, 51, 102);
        doc.setFont("helvetica", "bold");
        doc.text('CEDII', margeGauche + 5, 25);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Centre d'Échange et de", margeGauche + 5, 32);
        doc.text("Diffusion d'Informations", margeGauche + 5, 37);
        doc.text("Informatiques", margeGauche + 5, 42);
      }
      
      // Titre centré
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 102); // Bleu marine professionnel
      doc.setFont("helvetica", "bold");
      doc.text('CONTRAT DE LOCATION', ligneCentre, 25, { align: 'center' });
      
      // Sous-titre
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
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
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // --- PARTIES CONTRACTANTES AVEC 2 COLONNES ---
      yPosition = 55;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text('ENTRE LES SOUSSIGNÉS :', margeGauche, yPosition);
      yPosition += 10;
      
      // === COLONNE GAUCHE - CEDII ===
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text('CENTRE CEDII :', margeGauche, yPosition);
      doc.setFont("helvetica", "normal");
      
      const infoCEDII = [
        "Centre d'Échange et de Diffusion",
        "d'Informations Informatiques",
        "Représenté par son responsable",
        "Adresse: Lot IVH 32 Ter Amboditsiry",
        "Tél: +261 34 05 120 30",
        "Email: contact@cedii.mg",
        "NIF: 1234567890",
        "Stat: 9876543210"
      ];
      
      infoCEDII.forEach((ligne, index) => {
        doc.text(String(ligne), margeGauche + 5, yPosition + 7 + (index * 5));
      });
      
      // === COLONNE DROITE - CLIENT ===
      doc.setFont("helvetica", "bold");
      doc.text('LE CLIENT :', ligneCentre + 10, yPosition);
      doc.setFont("helvetica", "normal");
      
      const clientNom = reservation.value?.client.nomCli || reservation.value?.client.nomCli || '[Nom]';
      const clientPrenom = reservation.value?.client.prenomCli || reservation.value?.client.prenomCli || '[Prénom]';
      
      const clientInfo = [
        `Nom: ${clientNom}`,
        `Prénom: ${clientPrenom}`,
        `Adresse: ${reservation.value?.client.adresse || '[Adresse]'}`,
        `Téléphone: ${reservation.value?.client.telephoneCli || reservation.value?.client.telephone || '[Téléphone]'}`,
        `Email: ${reservation.value?.client.emailCli || reservation.value?.client.email || '[Email]'}`,
        `Profession: ${reservation.value?.client.profession || '[Profession]'}`
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
      doc.setDrawColor(200, 200, 200);
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
        "1. Le présent contrat est valable exclusivement pour la période convenue ci-dessus.",
        "2. Toute annulation doit être notifiée au minimum 48 heures à l'avance.",
        "3. Le client est entièrement responsable du matériel pendant toute la durée de la location.",
        "4. Tout dommage, perte ou vol sera intégralement facturé au client selon la valeur de remplacement.",
        "5. Le non-respect des horaires de restitution peut entraîner des frais supplémentaires.",
        "6. Un état des lieux sera effectué avant la remise et après la restitution du matériel.",
        "7. Le paiement doit être effectué selon les modalités convenues avant la prise du matériel.",
        "8. En cas de litige, le tribunal compétent est celui de Fianarantsoa."
      ];
      
      conditions.forEach(condition => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Essayer de splitter le texte
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
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 15;
      
      // Zone signatures
      doc.setFontSize(10);
      
      // Signature Client (droite)
      doc.text('Pour le Client,', ligneCentre + 40, yPosition, { align: 'center' });
      doc.text('Lu et approuvé', ligneCentre + 40, yPosition + 5, { align: 'center' });
      doc.setDrawColor(150, 150, 150);
      doc.line(ligneCentre + 20, yPosition + 15, ligneCentre + 60, yPosition + 15);
      doc.text('Signature précédée de la mention', ligneCentre + 40, yPosition + 25, { align: 'center' });
      doc.text('« Lu et approuvé »', ligneCentre + 40, yPosition + 30, { align: 'center' });
      
      // Signature CEDII (gauche)
      doc.text('Pour le CEDII,', margeGauche + 40, yPosition, { align: 'center' });
      doc.setDrawColor(150, 150, 150);
      doc.line(margeGauche + 20, yPosition + 15, margeGauche + 60, yPosition + 15);
      doc.text('Le Responsable', margeGauche + 40, yPosition + 25, { align: 'center' });
      doc.text('Cachet et signature', margeGauche + 40, yPosition + 30, { align: 'center' });
      
      // --- PIED DE PAGE ---
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`CEDII - Centre d'Échange et de Diffusion d'Informations Informatiques`, ligneCentre, 287, { align: 'center' });
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
      // Version minimale en cas d'erreur
      try {
        const doc = new jsPDF();
        doc.setFontSize(16);
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

/*
const genererVraiPDF = () => {
  return new Promise((resolve) => {
    try {
      const doc = new jsPDF();
      
      // Variables pour la mise en page
      const margeGauche = 15;
      const ligneCentre = 105;
      let yPosition = 50;
      
      // --- EN-TÊTE SIMPLIFIÉE ---
      // Titre centré
      doc.setFontSize(18);
      doc.setTextColor(0, 51, 102);
      doc.setFont("helvetica", "bold");
      doc.text('CONTRAT DE LOCATION', ligneCentre, 25, { align: 'center' });
      
      // Sous-titre
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
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
      doc.setDrawColor(0, 51, 102);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);
      
      // --- PARTIES CONTRACTANTES ---
      yPosition = 55;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text('ENTRE LES SOUSSIGNÉS :', margeGauche, yPosition);
      yPosition += 10;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text('Le CEDII, représenté par son responsable,', margeGauche, yPosition);
      yPosition += 8;
      doc.text('ET', margeGauche, yPosition);
      yPosition += 8;
      doc.text(`${reservation.value?.client.nomCli} ${reservation.value?.client.prenomCli}`, margeGauche, yPosition);
      yPosition += 15;
      
      // --- DÉTAILS DE LA LOCATION ---
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('DÉTAILS DE LA LOCATION :', margeGauche, yPosition);
      yPosition += 12;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Type : ${getRessourceType(reservation.value)}`, margeGauche + 5, yPosition);
      yPosition += 8;
      doc.text(`Période : Du ${formatDate(reservation.value?.debRes)} au ${formatDate(reservation.value?.finRes)}`, margeGauche + 5, yPosition);
      yPosition += 8;
      doc.text(`Quantité/Personnes : ${String(reservation.value?.qteMat || reservation.value?.nbPerso || '1')}`, margeGauche + 5, yPosition);
      yPosition += 8;
      doc.text(`Tarif Total : ${String(reservation.value?.tarifTot || '0')} MGA`, margeGauche + 5, yPosition);
      yPosition += 15;
      
      // --- CONDITIONS GÉNÉRALES SIMPLIFIÉES ---
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('CONDITIONS GÉNÉRALES :', margeGauche, yPosition);
      yPosition += 12;
      
      doc.setFontSize(10);
      const conditions = [
        '1. Le présent contrat est valable pour la période convenue',
        '2. Toute annulation doit être notifiée 48h à l\'avance',
        '3. Le client est responsable du matériel pendant la durée de location',
        '4. Tout dommage sera facturé au client',
        '5. Le non-respect des horaires peut entraîner des frais supplémentaires'
      ];
      
      conditions.forEach(condition => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(String(condition), margeGauche + 5, yPosition);
        yPosition += 7;
      });
      
      // --- SIGNATURES ---
      yPosition = Math.max(yPosition + 20, 200);
      doc.setFontSize(12);
      doc.text('Fait à Fianarantsoa, le ' + new Date().toLocaleDateString('fr-FR'), ligneCentre, yPosition, { align: 'center' });
      yPosition += 20;
      
      doc.text('___________________', 50, yPosition);
      doc.text('___________________', 140, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text('Signature Client', 50, yPosition);
      doc.text('Signature CEDII', 140, yPosition);
      
      // Générer le blob PDF
      const pdfBlobData = doc.output('blob');
      pdfUrl.value = URL.createObjectURL(pdfBlobData);
      pdfBlob.value = pdfBlobData;
      contractReady.value = true;
      successMessage.value = "Contrat PDF généré avec succès";
      
      resolve();
      
    } catch (error) {
      console.error("Erreur détaillée génération PDF:", error);
      // Fournir un PDF minimal en cas d'erreur
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('CONTRAT DE LOCATION CEDII', 105, 50, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`N°: ${idRes.value}`, 105, 60, { align: 'center' });
      doc.text('Document généré avec succès', 105, 70, { align: 'center' });
      
      const pdfBlobData = doc.output('blob');
      pdfUrl.value = URL.createObjectURL(pdfBlobData);
      pdfBlob.value = pdfBlobData;
      contractReady.value = true;
      successMessage.value = "Contrat PDF de base généré";
      
      resolve();
    }
  });
};
*/
const ouvrirPDF = () => {
  if (pdfUrl.value) {
    // Ouvrir dans un nouvel onglet
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
    
    // Redirection après délai pour voir le message de succès
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
.validation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header Section fixe */
.header-section {
  background: transparent;
  flex-shrink: 0;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
}

.back-button {
  min-width: 160px;
}

/* Alertes fixes */
.alert-fixed {
  flex-shrink: 0;
}

/* Contenu scrollable */
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

/* Scrollbar personnalisée */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: var(--cedii-primary-light, #5B11EE);
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: var(--cedii-primary-dark, #0671b6);
}

/* Pour Firefox */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: var(--cedii-primary-light, #5B11EE) #f1f1f1;
}

/* Cards */
.main-card, .validation-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Loading State */
.loading-state {
  padding: 2rem 0;
}

/* Content Section */
.content-section {
  min-height: min-content;
  padding-bottom: 20px;
}

/* Info Items */
.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-item:last-child {
  border-bottom: none;
}

/* Validation Button */
.validate-btn {
  height: 50px;
  font-weight: 600;
  font-size: 16px;
}

/* Groupe de boutons PDF */
.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

/* Palette CEDII */
.cedii-text-primary { 
  color: var(--cedii-primary-light, #5B11EE) !important; 
}

:deep(.n-button--primary-type) {
  background-color: var(--cedii-primary-light, #5B11EE) !important;
  border-color: var(--cedii-primary-light, #5B11EE) !important;
}

:deep(.n-button--primary-type:hover) {
  background-color: var(--cedii-primary-dark, #0671b6) !important;
  border-color: var(--cedii-primary-dark, #0671b6) !important;
}

/* Steps customization */
:deep(.n-steps .n-step .n-step__indicator) {
  border-color: var(--cedii-primary-light, #5B11EE);
}

:deep(.n-steps .n-step.n-step--active .n-step__indicator) {
  background-color: var(--cedii-primary-light, #5B11EE);
}

/* Responsive */
@media (max-width: 768px) {
  .validation-container {
    padding: 12px;
    height: 100vh;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .header-section .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .back-button {
    align-self: flex-start;
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
  }
  
  .button-group .n-button {
    width: 100%;
    margin-bottom: 8px;
  }
}

@media (max-width: 576px) {
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .validation-container {
    padding: 8px;
  }
}
</style>