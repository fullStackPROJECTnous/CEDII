<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    
    <main class="main-content flex-grow-1 overflow-auto bg-white">
      <div class="container-fluid py-4">
        <!-- En-tête avec filtre et recherche -->
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

        <!-- Statistiques rapides -->
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

        <!-- Grille des biens -->
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
                <div class="card-badges">
                  <n-tag 
                    :type="item.category === 'Immobilier' ? 'info' : 'warning'" 
                    size="small"
                    class="me-2"
                  >
                    {{ item.category }}
                  </n-tag>
                  <n-tag 
                    :type="item.isAvailable ? 'success' : 'error'" 
                    size="small"
                  >
                    {{ item.isAvailable ? 'Disponible' : 'Occupé' }}
                  </n-tag>
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
                  
                  <router-link 
                    :to="{ name: 'ReservationForm', query: { resourceId: item.id } }" 
                    class="text-decoration-none"
                  >
                    <n-button 
                      type="primary" 
                      class="cedii-btn-primary"
                      :disabled="!item.isAvailable"
                      size="small"
                    >
                      <template #icon>
                        <i class="bi bi-calendar-plus"></i>
                      </template>
                      {{ item.isAvailable ? 'Réserver' : 'Indisponible' }}
                    </n-button>
                  </router-link>
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
  NCard, 
  NH1, 
  NText, 
  NGrid, 
  NGi, 
  NStatistic, 
  NTag, 
  NButton, 
  NDivider,
  NEmpty,
  NSelect,
  NInput,
  NSpace
} from 'naive-ui';
import ClientNavbar from '../components/clientNavbar.vue';

// Import des images locales
import salleImage from '@/assets/images/salle-reunion.jpg';
import bureauImage from '@/assets/images/bureau.jpg';
import projecteurImage from '@/assets/images/projecteur.jpg';
import chapiteauImage from '@/assets/images/chapiteau.jpg';

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
  catalogItems.value = [
    { 
      id: 45, 
      name: 'Salle de Réunion', 
      description: 'Grande salle pour événements et réunions, capacité 50 personnes. Équipée de matériel audiovisuel moderne et connexion internet haut débit.', 
      category: 'Immobilier', 
      isAvailable: true, 
      image: salleImage
    },
    { 
      id: 46, 
      name: 'Salle de Documentation', 
      description: 'Salle pour des réunions, idéal pour le travail au calme. Espace lumineux avec bibliothèque intégrée et postes de travail individuels.', 
      category: 'Immobilier', 
      isAvailable: false, 
      image: bureauImage
    },
    { 
      id: 47, 
      name: 'Projecteur HD', 
      description: 'Projecteur haute définition et écran mobile pour vos présentations. Résolution 4K, compatible avec tous les appareils modernes.', 
      category: 'Matériel', 
      isAvailable: true, 
      image: projecteurImage
    },
    { 
      id: 48, 
      name: 'Chapiteau Événementiel', 
      description: 'Grand chapiteau pour les événements extérieurs. Structure robuste, installation facile, capacité jusqu\'à 100 personnes.', 
      category: 'Matériel', 
      isAvailable: true, 
      image: chapiteauImage
    },
  ];
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
}

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

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
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