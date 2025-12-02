<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    
    <main class="main-content flex-grow-1 overflow-auto bg-white">
      <div class="container-fluid py-4">
        <n-card class="mb-4 border-0" content-style="padding: 0;">
          <div class="d-flex justify-content-between align-items-center p-4">
            <div>
              <n-h1 class="mb-2" style="color: #02061E;">Catalogue des Biens CEDII</n-h1>
              <n-text class="text-muted">Découvrez notre sélection de ressources disponibles à la location</n-text>
            </div>
            
            <n-space>
              <n-select
                v-model:value="selectedCategory"
                placeholder="Filtrer par catégorie"
                :options="categoryOptions"
                clearable
                style="width: 200px"
                size="small"
              />
              <n-input
                v-model:value="searchQuery"
                placeholder="Rechercher un bien..."
                clearable
                size="small"
                style="width: 250px"
              >
                <template #prefix>
                  <i class="bi bi-search"></i>
                </template>
              </n-input>
            </n-space>
          </div>
        </n-card>

        <n-grid :cols="4" :x-gap="16" class="mb-4">
          <n-gi>
            <n-statistic label="Total des biens" :value="catalogItems.length">
              <template #prefix>
                <i class="bi bi-grid-3x3-gap" style="color: #5811EE;"></i>
              </template>
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="Biens disponibles" :value="availableItemsCount">
              <template #prefix>
                <i class="bi bi-check-circle" style="color: #067186;"></i>
              </template>
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="Immobilier" :value="realEstateCount">
              <template #prefix>
                <i class="bi bi-building" style="color: #04058F;"></i>
              </template>
            </n-statistic>
          </n-gi>
          <n-gi>
            <n-statistic label="Matériel" :value="equipmentCount">
              <template #prefix>
                <i class="bi bi-tools" style="color: #55555E;"></i>
              </template>
            </n-statistic>
          </n-gi>
        </n-grid>

        <n-grid :cols="1" :y-gap="16" v-if="filteredItems.length === 0">
          <n-gi>
            <n-card class="text-center py-5">
              <n-empty description="Aucun bien ne correspond à votre recherche">
                <template #icon>
                  <i class="bi bi-search" style="font-size: 3rem; color: #55555E;"></i>
                </template>
                <template #extra>
                  <n-button type="primary" @click="clearFilters">
                    <template #icon>
                      <i class="bi bi-arrow-clockwise"></i>
                    </template>
                    Réinitialiser les filtres
                  </n-button>
                </template>
              </n-empty>
            </n-card>
          </n-gi>
        </n-grid>
        <n-grid :cols="2" :x-gap="24" :y-gap="24" v-else>
          <n-gi v-for="item in filteredItems" :key="item.id">
            <n-card class="catalog-card h-100" :bordered="false" content-style="padding: 0;">
              <div class="card-image-container">
                <img 
                  :src="item.image" 
                  class="card-img-top" 
                  :alt="item.name"
                />
                <div class="card-header-overlay">
                  <div class="card-badges">
                    <n-tag 
                      :type="item.category === 'Immobilier' ? 'info' : 'warning'" 
                      size="small"
                      :class="item.category === 'Immobilier' ? 'badge-immobilier' : 'badge-materiel'"
                    >
                      {{ item.category }}
                    </n-tag>
                    <n-tag 
                      :type="item.isAvailable ? 'success' : 'error'" 
                      size="small"
                      :class="item.isAvailable ? 'badge-disponible' : 'badge-occupe'"
                    >
                      {{ item.isAvailable ? 'Disponible' : 'Occupé' }}
                    </n-tag>
                  </div>
                  
                  <router-link 
                    :to="{ 
                      name: 'ReservationForm', 
                      query: { 
                        // 🎯 CORRECTION: Utiliser l'ID unique pour la sélection interne (CLE NECESSAIRE)
                        resourceId: item.id, 
                        // Clé 2: Passage de la CATÉGORIE pour initialiser le type de formulaire
                        category: item.category 
                      } 
                    }" 
                    class="text-decoration-none ms-auto"
                  >
                    <n-button 
                      type="primary" 
                      class="cedii-btn-primary reservation-button-top"
                      :disabled="!item.isAvailable"
                      size="small"
                    >
                      <template #icon>
                        <i class="bi bi-calendar-plus"></i>
                      </template>
                      Réserver
                    </n-button>
                  </router-link>
                </div>
              </div>
              
              <div class="card-body p-4">
                <n-h3 class="card-title mb-3" style="color: #02061E;">
                  {{ item.name }}
                </n-h3>
                
                <n-text class="card-description" depth="3">
                  {{ item.description }}
                </n-text>
                
                <n-divider class="my-3" />
                
                <div class="card-footer d-flex justify-content-between align-items-center">
                  <n-text class="text-muted small">
                    <i class="bi bi-info-circle me-1"></i>
                    ID: {{ item.id }}
                  </n-text>
                  
                  <n-text v-if="!item.isAvailable" type="error" class="small fw-semibold">
                    Indisponible à la réservation
                  </n-text>
                </div>
              </div>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  NCard, NH1, NText, NGrid, NGi, NStatistic, NTag, NButton, NDivider,
  NEmpty, NSelect, NInput, NSpace
} from 'naive-ui';
import ClientNavbar from '../components/clientNavbar.vue';

const API_BASE_URL = 'http://localhost:5000';

const catalogItems = ref([]);
const selectedCategory = ref(null);
const searchQuery = ref('');

const categoryOptions = [
  { label: 'Toutes les catégories', value: null },
  { label: 'Immobilier', value: 'Immobilier' },
  { label: 'Matériel', value: 'Matériel' }
];

// Computed properties
const filteredItems = computed(() => {
  let items = catalogItems.value;
  
  if (selectedCategory.value) {
    items = items.filter(item => item.category === selectedCategory.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }
  
  return items;
});

const availableItemsCount = computed(() => 
  catalogItems.value.filter(item => item.isAvailable).length
);

const realEstateCount = computed(() => 
  catalogItems.value.filter(item => item.category === 'Immobilier').length
);

const equipmentCount = computed(() => 
  catalogItems.value.filter(item => item.category === 'Matériel').length
);

const fetchCatalog = async () => {
    // ----------------------------------------------------------------------
    // REMPLACER CECI PAR L'APPEL À VOTRE API BACKEND !
    // ----------------------------------------------------------------------

    // --- Données simulées basées sur VOS informations ---
    const sallesDataFromApi = [
        { 
          // ID interne BDD
          idSalle: 1, 
          nomSalle: 'Salle de Conférence', // 🎯 Nom utilisé pour la recherche dans ReservationForm
          descriptionSalle: 'Grande salle pour événements et réunions, capacité 50 personnes.', 
          isAvailable: true, 
          // 🎯 Chemin exact dans backend/public/uploads/
          imageUrl: '/uploads/salle-de-conference.jpg' 
        },
        /* ... autres salles ... */
    ];

    const materielsDataFromApi = [
        { 
          // ID interne BDD
          codeMat: 'MAT-A2025-CEDII/003', 
          // Désignation affichée
          designationMat: 'Projecteur', // Mise en majuscule pour l'exemple
          descriptionMat: 'Projecteur haute définition et écran mobile pour vos présentations.', 
          isAvailable: true, 
          // 🎯 Chemin exact dans backend/public/uploads/
          imageUrl: '/uploads/projecteur.jpg' 
        },
        { 
          // ID interne BDD
          codeMat: 'MAT-A2024-CEDII/003', 
          // Désignation affichée
          designationMat: 'chapiteau', // Mise en majuscule pour l'exemple
          descriptionMat: 'Chapiteaux couleur rouge.', 
          isAvailable: true, 
          // 🎯 Chemin exact dans backend/public/uploads/
          imageUrl: '/uploads/chapiteau-rouge.jpg' 
        },
        /* ... autres matériels ... */
    ];
    // --------------------------------------------------

    const mappedSalles = sallesDataFromApi.map(s => ({
        // Conversion en String pour uniformité avec le codeMat
        id: String(s.idSalle), 
        name: s.nomSalle, 
        description: s.descriptionSalle, 
        category: 'Immobilier', // Correspond à typeRes: 'Salle'
        categoryType: 'Salle', 
        isAvailable: s.isAvailable,
        image: API_BASE_URL + s.imageUrl 
    }));
    
    const mappedMateriels = materielsDataFromApi.map(m => ({
        // L'ID est déjà une String
        id: m.codeMat, 
        name: m.designationMat, 
        description: m.descriptionMat, 
        category: 'Matériel', // Correspond à typeRes: 'Materiel'
        categoryType: 'Materiel', 
        isAvailable: m.isAvailable,
        image: API_BASE_URL + m.imageUrl
    }));

    catalogItems.value = [...mappedSalles, ...mappedMateriels];
};

const clearFilters = () => {
  selectedCategory.value = null;
  searchQuery.value = '';
};

onMounted(() => {
  fetchCatalog();
});
</script>

<style scoped>
/* --- Styles Personnalisés pour Naive UI (couleurs) --14/11/21 --- */
.main-content {
  background-color: #ffffff;
}

.cedii-btn-primary { 
  background-color: #5811EE;
  color: white;
  border-color: #5811EE;
}

.cedii-btn-primary:hover {
  background-color: #04058F;
  border-color: #04058F;
}

.cedii-btn-primary:disabled {
  background-color: #55555E;
  border-color: #55555E;
  cursor: not-allowed;
  opacity: 0.8;
}

/* 🚀 NOUVELLES COULEURS DE BADGES POUR MEILLEUR CONTRASTE --14/11/21 🚀 */

/* Catégorie : Immobilier */
:deep(.badge-immobilier) {
    background-color: #04058F !important; /* Bleu foncé */
    color: white !important;
    border-color: #04058F !important;
    font-weight: 600;
}

/* Catégorie : Matériel */
:deep(.badge-materiel) {
    background-color: #FFC107 !important; /* Jaune vif */
    color: #333 !important;
    border-color: #FFC107 !important;
    font-weight: 600;
}

/* Statut : Disponible */
:deep(.badge-disponible) {
    background-color: #198754 !important; /* Vert foncé */
    color: white !important;
    border-color: #198754 !important;
    font-weight: 600;
}

/* Statut : Occupé */
:deep(.badge-occupe) {
    background-color: #DC3545 !important; /* Rouge foncé */
    color: white !important;
    border-color: #DC3545 !important;
    font-weight: 600;
}
/* FIN DES NOUVELLES COULEURS DE BADGES */


/* --- Styles pour la Carte de Catalogue --14/11/21 --- */
.card-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.card-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.catalog-card:hover .card-image-container img {
  transform: scale(1.05);
}

.card-header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  z-index: 10;
}

.card-badges {
  display: flex;
  gap: 8px;
}

/* --- Styles couleur reservation  --14/11/21 --- */
.reservation-button-top {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.card-description {
  line-height: 1.6;
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
}

.catalog-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
}

.catalog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(2, 6, 30, 0.15) !important;
}

/* Styles pour les composants Naive UI */
:deep(.n-card) {
  border-radius: 12px;
}

:deep(.n-statistic .n-statistic-value) {
  font-weight: 600;
  color: #02061E;
}

:deep(.n-statistic .n-statistic-label) {
  color: #55555E;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container-fluid {
    padding: 1rem;
  }
  
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
  
  .card-image-container {
    height: 200px;
  }
}
</style>