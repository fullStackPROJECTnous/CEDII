<template>
  <div class="inventaire-patrimoine-container">
    <!-- Header amélioré -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardReception" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-box-seam me-2"></i>
                Inventaire & Patrimoine
              </h1>
              <p class="custom-subtitle">Gestion du matériel et des salles de l'établissement</p>
            </div>
            <div></div> <!-- Placeholder pour l'alignement -->
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation par onglets -->
    <div class="navigation-section mb-4">
      <ul class="nav nav-tabs custom-nav-tabs">
        <li class="nav-item">
          <router-link 
            to="/patrimoine/materiel" 
            :class="['nav-link', 'custom-nav-link', { active: $route.path.includes('/patrimoine/materiel') }]">
            <i class="bi bi-pc-display me-2"></i>Matériel
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            to="/patrimoine/salle" 
            :class="['nav-link', 'custom-nav-link', { active: $route.path.includes('/patrimoine/salle') }]">
            <i class="bi bi-door-closed me-2"></i>Salles
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Contenu principal -->
    <div class="content-section">
      <div class="tab-content-container custom-card">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventaire-patrimoine-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1.5rem;
}

/* Header amélioré */
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
  font-size: 1.8rem;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

/* Navigation par onglets */
.custom-nav-tabs {
  border-bottom: 2px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
  background: transparent;
}

.nav-item {
  margin-bottom: -2px;
}

.custom-nav-link {
  color: #04058F;
  border: 1px solid transparent;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  text-decoration: none;
}

.custom-nav-link:hover {
  color: #007bff;
  background-color: white;
  border-color: #e9ecef #e9ecef #e9ecef;
}

.custom-nav-link.active {
  color: white;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-color: #007bff #007bff #007bff;
  position: relative;
}

.custom-nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff;
}

/* Contenu principal */
.content-section {
  border-radius: 0.5rem;
  overflow: hidden;
}

.tab-content-container {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 1.5rem;
}

/* Cartes cohérentes */
.custom-card {
  background-color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Scrollbar personnalisée */
.tab-content-container::-webkit-scrollbar {
  width: 6px;
}

.tab-content-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tab-content-container::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 3px;
}

.tab-content-container::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .inventaire-patrimoine-container {
    padding: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-nav-tabs {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .custom-nav-link {
    border-radius: 0.375rem;
    justify-content: center;
  }
  
  .custom-nav-link.active::after {
    display: none;
  }
  
  .tab-content-container {
    padding: 1rem;
    max-height: none;
  }
}

@media (max-width: 576px) {
  .inventaire-patrimoine-container {
    padding: 0.5rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .tab-content-container {
    padding: 0.75rem;
  }
}
</style>