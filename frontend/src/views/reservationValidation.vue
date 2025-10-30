<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LocationService from '@/services/LocationService'; 

const route = useRoute();
const router = useRouter();
const idRes = ref(route.params.idRes);
const reservationDetails = ref(null);
const signatureData = ref(null); // Simule les données de la signature
const isLoading = ref(true);

// ... (fonctions fetchDetails, handleSignature, validateReservation du plan précédent)

</script>

<template>
    <div class="container mt-5">
        <h2 class="mb-4">Validation de la Réservation #{{ idRes }}</h2>
        <div v-if="isLoading" class="alert alert-info">Chargement des détails...</div>
        
        <div v-else-if="!reservationDetails" class="alert alert-danger">Réservation non trouvée ou non éligible à la validation.</div>

        <div v-else class="card shadow-lg">
            <div class="card-header bg-primary text-white">
                Détails du Contrat
            </div>
            <div class="card-body">
                
                <h5 class="card-title">Client : {{ reservationDetails.client.nomCli }} {{ reservationDetails.client.prenomCli }}</h5>
                <p>Email : {{ reservationDetails.client.emailCli }}</p>
                <hr>

                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Ressource :</strong> {{ reservationDetails.codeMat || reservationDetails.idSalle }} ({{ reservationDetails.typeRes }})</p>
                        <p><strong>Quantité/Nb Pers. :</strong> {{ reservationDetails.qteMat || 1 }} / {{ reservationDetails.nbPerso || 0 }}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Période :</strong> Du {{ new Date(reservationDetails.debRes).toLocaleString() }} au {{ new Date(reservationDetails.finRes).toLocaleString() }}</p>
                        <p><strong>Tarif Total :</strong> <span class="badge bg-success">{{ formatCurrency(reservationDetails.tarifTot) }}</span></p>
                    </div>
                </div>
                
                <hr>

                <div class="row mt-4">
                    <div class="col-md-6">
                        <h6>1. Génération et Consultation du Contrat</h6>
                        <p>Le contrat est généré automatiquement. La Réception vérifie.</p>
                        <button class="btn btn-sm btn-outline-info">Télécharger Contrat PDF (Simulation)</button>
                    </div>
                    <div class="col-md-6">
                        <h6>2. Signature Électronique du Client</h6>
                        <div class="border p-3 text-center bg-light" style="height: 100px;">
                            <span v-if="signatureData">✅ Signature Enregistrée</span>
                            <span v-else>Espace Signature - (Cliquez pour simuler)</span>
                            <button v-if="!signatureData" @click="handleSignature('simulated_data')" class="btn btn-sm btn-outline-secondary d-block w-100 mt-2">Simuler Signature</button>
                        </div>
                    </div>
                </div>

                <div class="mt-4 text-center">
                    <button @click="validateReservation" :disabled="!signatureData" class="btn btn-lg btn-success">
                        <i class="bi bi-check-circle-fill me-2"></i> Valider la Réservation & Activer la Location
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>