<script setup>
// ... (script setup du plan précédent)
// Le code est similaire à celui fourni précédemment mais adapté pour utiliser le LocationService
</script>

<template>
    <div class="card p-3 shadow-sm border-info">
        <h5 class="card-title text-center">{{ props.mode === 'depart' ? 'État des Lieux au Départ' : 'Vérification et Retour' }}</h5>
        <p class="text-muted text-center">Matériel: **{{ props.materielCode }}** (Qté: {{ props.qteMat }})</p>
        
        <form @submit.prevent="submitEtatLieux">
            
            <div class="mb-3">
                <label for="etatInitial" class="form-label">Description de l'état actuel</label>
                <textarea v-model="etatInitial" class="form-control" id="etatInitial" rows="2" required></textarea>
            </div>

            <div v-if="props.mode === 'retour'">
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" v-model="estEndommage" id="estEndommage">
                    <label class="form-check-label" for="estEndommage">
                        Dégradation(s) constatée(s) ? (Nécessite Facturation)
                    </label>
                </div>

                <div v-if="estEndommage" class="alert alert-warning p-3">
                    <div class="mb-3">
                        <label for="descriptionDegradation" class="form-label">Description de la Dégradation</label>
                        <textarea v-model="descriptionDegradation" class="form-control" id="descriptionDegradation" rows="2" required></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="coutReparation" class="form-label">Coût de la Facturation (AR)</label>
                        <input type="number" v-model.number="coutReparation" class="form-control" id="coutReparation" min="0" required>
                        <div class="form-text">Ce montant sera inséré dans la table `paiement`.</div>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-3">
                Enregistrer & {{ props.mode === 'retour' ? 'Finaliser' : 'Confirmer le Départ' }}
            </button>
        </form>
    </div>
</template>