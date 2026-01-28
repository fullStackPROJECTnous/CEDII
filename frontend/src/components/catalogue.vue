<!--<template>
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
</style>-->

<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    
    <main class="main-content flex-grow-1 overflow-auto bg-light">
      <div class="container-fluid py-4">
        <!-- EN-TÊTE AMÉLIORÉE -->
        <div class="page-header mb-4">
          <div class="header-container p-4 rounded-4 shadow-sm">
            <!-- Première ligne : Titre principal et statistiques -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon-container">
                  <i class="bi bi-grid-3x3-gap-fill header-icon"></i>
                </div>
                <div>
                  <h1 class="header-title mb-0">Catalogue des Biens CEDII</h1>
                  <p class="header-subtitle mb-0 text-muted">Découvrez notre sélection de ressources disponibles à la location</p>
                </div>
              </div>
              
              <n-tag type="info" size="large" class="custom-tag">
                <template #icon>
                  <n-icon>
                    <i class="bi bi-inbox"></i>
                  </n-icon>
                </template>
                {{ catalogItems.length }} biens au total
              </n-tag>
            </div>
            
            <!-- Deuxième ligne : Statistiques rapides -->
            <div class="header-info-row">
              <div class="row g-4">
                <!-- Biens disponibles -->
                <div class="col-md-3">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-check-circle-fill text-success"></i>
                      <span class="info-label">Biens disponibles</span>
                    </div>
                    <div class="info-value fw-bold text-dark">{{ availableItemsCount }}</div>
                  </div>
                </div>
                
                <!-- Immobilier -->
                <div class="col-md-3">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-building-fill text-primary"></i>
                      <span class="info-label">Immobilier</span>
                    </div>
                    <div class="info-value fw-bold text-dark">{{ realEstateCount }}</div>
                  </div>
                </div>
                
                <!-- Matériel -->
                <div class="col-md-3">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-tools text-warning"></i>
                      <span class="info-label">Matériel</span>
                    </div>
                    <div class="info-value fw-bold text-dark">{{ equipmentCount }}</div>
                  </div>
                </div>
                
                <!-- Taux de disponibilité 
                <div class="col-md-3">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-percent text-info"></i>
                      <span class="info-label">Taux de disponibilité</span>
                    </div>
                    <div class="info-value fw-bold text-dark">
                      {{ availabilityRate }}%
                    </div>
                  </div>
                </div>-->
              </div>
            </div>
            
            <!-- Troisième ligne : Filtres et recherche -->
            <div class="header-actions mt-4 pt-3 border-top">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-funnel text-primary"></i>
                    <span class="fw-semibold">Filtres :</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-3 justify-content-end">
                    <n-select
                      v-model:value="selectedCategory"
                      placeholder="Toutes les catégories"
                      :options="categoryOptions"
                      clearable
                      style="width: 180px"
                      size="small"
                      class="filter-select"
                    />
                    <n-input
                      v-model:value="searchQuery"
                      placeholder="Rechercher un bien..."
                      clearable
                      size="small"
                      style="width: 220px"
                      class="search-input"
                    >
                      <template #prefix>
                        <i class="bi bi-search"></i>
                      </template>
                    </n-input>
                    <n-button 
                      type="default" 
                      size="small" 
                      class="action-btn"
                      @click="clearFilters"
                      :disabled="!hasActiveFilters"
                    >
                      <template #icon>
                        <i class="bi bi-arrow-clockwise"></i>
                      </template>
                      Réinitialiser
                    </n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENU PRINCIPAL -->
        <!-- Message si aucun résultat -->
        <n-grid :cols="1" :y-gap="16" v-if="filteredItems.length === 0">
          <n-gi>
            <n-card class="text-center py-5 border-0 shadow-sm">
              <n-empty description="Aucun bien ne correspond à votre recherche">
                <template #icon>
                  <i class="bi bi-search" style="font-size: 3rem; color: #55555E;"></i>
                </template>
                <template #extra>
                  <n-button type="primary" @click="clearFilters" class="cedii-btn-primary">
                    <template #icon>
                      <i class="bi bi-arrow-clockwise"></i>
                    </template>
                    Afficher tous les biens
                  </n-button>
                </template>
              </n-empty>
            </n-card>
          </n-gi>
        </n-grid>

        <!-- Grille des biens -->
        <div v-else>
          <!-- Compteur de résultats -->
          <div class="mb-3 d-flex justify-content-between align-items-center">
            <n-text class="text-muted">
              <i class="bi bi-list-check me-1"></i>
              {{ filteredItems.length }} bien{{ filteredItems.length > 1 ? 's' : '' }} trouvé{{ filteredItems.length > 1 ? 's' : '' }}
            </n-text>
            <n-text class="text-muted small">
              <i class="bi bi-info-circle me-1"></i>
              Cliquez sur "Réserver" pour effectuer une demande
            </n-text>
          </div>

          <!-- Cartes des biens -->
          <n-grid :cols="2" :x-gap="24" :y-gap="24">
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
                          resourceId: item.id, 
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
                      <i class="bi bi-clock-history me-1"></i>
                      Indisponible à la réservation
                    </n-text>
                  </div>
                </div>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  NCard, NH1, NText, NGrid, NGi, NStatistic, NTag, NButton, NDivider,
  NEmpty, NSelect, NInput, NSpace, NIcon
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

const availabilityRate = computed(() => {
  if (catalogItems.value.length === 0) return 0;
  return Math.round((availableItemsCount.value / catalogItems.value.length) * 100);
});

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== null || searchQuery.value !== '';
});

const fetchCatalog = async () => {
    // Données simulées (à remplacer par votre API)
    const sallesDataFromApi = [
        { 
          idSalle: 1, 
          nomSalle: 'Salle de Conférence',
          descriptionSalle: 'Grande salle pour événements et réunions, capacité 50 personnes.', 
          isAvailable: true, 
          imageUrl: '/uploads/salle-de-conference.jpg' 
        },
        { 
          idSalle: 2, 
          nomSalle: 'Salle de Réunion',
          descriptionSalle: 'Salle modulable pour 20 personnes, équipée de vidéoprojecteur.', 
          isAvailable: true, 
          imageUrl: '/uploads/salle-reunion.jpg' 
        },
    ];

    const materielsDataFromApi = [
        { 
          codeMat: 'MAT-A2025-CEDII/003', 
          designationMat: 'Projecteur Haute Définition',
          descriptionMat: 'Projecteur haute définition 4K et écran mobile pour vos présentations.', 
          isAvailable: true, 
          imageUrl: '/uploads/projecteur.jpg' 
        },
        { 
          codeMat: 'MAT-A2024-CEDII/003', 
          designationMat: 'Chapiteau Événementiel',
          descriptionMat: 'Chapiteaux couleur rouge de 10x15m, idéal pour événements extérieurs.', 
          isAvailable: false, 
          imageUrl: '/uploads/chapiteau-rouge.jpg' 
        }
    
    ];

    const mappedSalles = sallesDataFromApi.map(s => ({
        id: String(s.idSalle), 
        name: s.nomSalle, 
        description: s.descriptionSalle, 
        category: 'Immobilier',
        categoryType: 'Salle', 
        isAvailable: s.isAvailable,
        image: API_BASE_URL + s.imageUrl 
    }));
    
    const mappedMateriels = materielsDataFromApi.map(m => ({
        id: m.codeMat, 
        name: m.designationMat, 
        description: m.descriptionMat, 
        category: 'Matériel',
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
.main-content {
  background-color: #f8f9fa;
}

/* STYLES DU HEADER AMÉLIORÉ (cohérent avec le composant précédent) */
.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid rgba(4, 5, 143, 0.1);
}

.header-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.header-icon-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #04058f 0%, #5811EE 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 2rem;
  color: white;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #02061E;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.custom-tag {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2);
}

/* Cartes d'informations */
.info-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.1);
  border-color: rgba(88, 17, 238, 0.2);
}

.info-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #02061E;
}

/* Boutons d'actions et filtres */
.action-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-width: 2px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-select:deep(.n-base-selection) {
  border-radius: 20px;
  border: 2px solid rgba(88, 17, 238, 0.2);
}

.search-input:deep(.n-input) {
  border-radius: 20px;
  border: 2px solid rgba(88, 17, 238, 0.2);
}

/* STYLES EXISTANTS POUR LE CATALOGUE */
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

/* Badges */
:deep(.badge-immobilier) {
    background-color: #04058F !important;
    color: white !important;
    border-color: #04058F !important;
    font-weight: 600;
}

:deep(.badge-materiel) {
    background-color: #FFC107 !important;
    color: #333 !important;
    border-color: #FFC107 !important;
    font-weight: 600;
}

:deep(.badge-disponible) {
    background-color: #198754 !important;
    color: white !important;
    border-color: #198754 !important;
    font-weight: 600;
}

:deep(.badge-occupe) {
    background-color: #DC3545 !important;
    color: white !important;
    border-color: #DC3545 !important;
    font-weight: 600;
}

/* Carte de catalogue */
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

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1.5rem !important;
  }
  
  .header-icon-container {
    width: 50px;
    height: 50px;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .header-info-row .row {
    flex-direction: column;
  }
  
  .header-actions .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions .d-flex {
    flex-wrap: wrap;
    justify-content: flex-start !important;
  }
  
  .filter-select,
  .search-input {
    width: 100% !important;
  }
  
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

@media (max-width: 576px) {
  .header-title {
    font-size: 1.25rem;
  }
  
  .custom-tag {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .info-card {
    padding: 1rem !important;
  }
  
  .action-btn {
    font-size: 0.85rem;
  }
}
</style>