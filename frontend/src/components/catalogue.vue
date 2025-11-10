<template>
  <div class="vh-100 d-flex flex-column"> 

    <ClientNavbar />

    <main class="main-content flex-grow-1 overflow-auto bg-light p-4"> 
      <header class="pb-3 border-bottom">
        <h1 class="text-secondary">Catalogue des Biens CEDII</h1>
      </header>
      
      <div class="row mt-4">
        <div class="col-md-4 mb-4" v-for="item in catalogItems" :key="item.id">
          <div class="card shadow-sm h-100 catalog-card">
            <img :src="item.image" class="card-img-top" :alt="item.name" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title cedii-text-primary">{{ item.name }}</h5>
              <p class="card-text text-muted flex-grow-1">{{ item.description }}</p>
              <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge rounded-pill bg-info text-dark">{{ item.category }}</span>
                  <span :class="['badge rounded-pill', item.isAvailable ? 'bg-success' : 'bg-danger']">
                      {{ item.isAvailable ? 'Disponible' : 'Occupé' }}
                  </span>
              </div>
             <!-- <router-link :to="{ name: 'ReservationForm', query: { resourceId: item.id } }" 
                           class="btn cedii-btn-primary w-100 mt-auto" 
                           :disabled="!item.isAvailable">
                Réserver
              </router-link>-->
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ClientNavbar from '../components/clientNavbar.vue';

const catalogItems = ref([]);
// Import des images locales
import salleImage from '@/assets/images/salle-reunion.jpg';
import bureauImage from '@/assets/images/bureau.jpg';
import projecteurImage from '@/assets/images/projecteur.jpg';
import chapiteauImage from '@/assets/images/chapiteau.jpg';



const fetchCatalog = async () => {
    catalogItems.value = [
        { 
            id: 45, 
            name: 'Salle de Réunion', 
            description: 'Grande salle pour événements et réunions, capacité 50 personnes.', 
            category: 'Immobilier', 
            isAvailable: true, 
            image: salleImage
        },
        { 
            id: 46, 
            name: 'Salle de Documentation', 
            description: 'Salle pour des réunions, idéal pour le travail au calme.', 
            category: 'Immobilier', 
            isAvailable: false, 
            image: bureauImage
        },
        { 
            id: 47, 
            name: 'Projecteur', 
            description: 'Projecteur haute définition et écran mobile pour vos présentations.', 
            category: 'Matériel', 
            isAvailable: true, 
            image: projecteurImage
        },
        { 
            id: 48, 
            name: 'Chapiteau', 
            description: 'Grand chapiteau pour les événements différents.', 
            category: 'Matériel', 
            isAvailable: true, 
            image: chapiteauImage
        },
    ];
};


onMounted(() => {
    fetchCatalog();
});
</script>

<style scoped>
/* COHÉRENCE AVEC LES STYLES */
.cedii-text-primary { color: var(--cedii-primary-light, #5B11EE) !important; }
.cedii-btn-primary { 
    background-color: var(--cedii-primary-light, #5B11EE);
    color: white;
    border-color: var(--cedii-primary-light, #5B11EE);
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}
</style>