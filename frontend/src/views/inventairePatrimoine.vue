<template>
  <div class="inventaire-patrimoine-container">
    <div class="header-section">
      <div class="title-section">
        <h1 class="page-title">
          <i class="bi bi-box-seam me-2"></i>Inventaire & Patrimoine
        </h1>
        <p class="page-subtitle">Gestion du matériel et des salles de l'établissement</p>
      </div>
      
      <div class="action-section">
        <router-link to="/dashboardReception" class="btn-retour">
          <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
        </router-link>
      </div>
    </div>

    <div class="navigation-section">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <router-link 
            to="/patrimoine/materiel" 
            :class="['nav-link', { active: $route.path.includes('/patrimoine/materiel') }]">
            <i class="bi bi-pc-display me-2"></i>Matériel
          </router-link>
        </li>
        <li class="nav-item">
          <router-link 
            to="/patrimoine/salle" 
            :class="['nav-link', { active: $route.path.includes('/patrimoine/salle') }]">
            <i class="bi bi-door-closed me-2"></i>Salles
          </router-link>
        </li>
      </ul>
    </div>

    <div class="content-section">
      <div class="tab-content-container">
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.title-section {
  flex: 1;
}

.page-title {
  color: #5811EE !important;
  font-weight: 700;
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: #55555E;
  font-size: 0.95rem;
  margin: 0;
}

.action-section {
  display: flex;
  align-items: center;
}

.btn-retour {
  background-color: white;
  color: #5811EE;
  border: 1px solid #5811EE;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.btn-retour:hover {
  background-color: #5811EE;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(88, 17, 238, 0.2);
}

.navigation-section {
  margin-bottom: 1.5rem;
}

.nav-tabs {
  border-bottom: 2px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  margin-bottom: -2px;
}

.nav-link {
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
}

.nav-link:hover {
  color: #5811EE;
  background-color: white;
  border-color: #e9ecef #e9ecef #e9ecef;
}

.nav-link.active {
  color: white;
  background-color: #5811EE;
  border-color: #5811EE #5811EE #5811EE;
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #5811EE;
}

.content-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  overflow: hidden;
}

.tab-content-container {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 1.5rem;
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
  background: #c5c5c5;
  border-radius: 3px;
}

.tab-content-container::-webkit-scrollbar-thumb:hover {
  background: #55555E;
}

/* Responsive */
@media (max-width: 768px) {
  .inventaire-patrimoine-container {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-section {
    align-self: flex-end;
  }
  
  .nav-tabs {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .nav-link {
    border-radius: 0.375rem;
    justify-content: center;
  }
  
  .nav-link.active::after {
    display: none;
  }
}
</style>