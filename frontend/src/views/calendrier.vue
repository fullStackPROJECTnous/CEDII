

<template>
  <div class="full-height-container">
    <!-- Structure principale avec sidebar et contenu -->
    <n-layout has-sider class="h-100">
      <!-- Sidebar Naive UI -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        show-trigger="bar"
        class="custom-sidebar"
      >
        <div class="sidebar-content d-flex flex-column h-100 p-3">
          <!-- Logo et Titre -->
          <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
            <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
            <h4 class="sidebar-title mb-0 fs-6">CEDII Patrimoine Plus</h4>
          </div>
          
          <!-- Menu Navigation -->
          <n-menu
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
            class="flex-grow-1 custom-menu"
          />
          
          <!-- Bouton Déconnexion -->
          <div class="mt-auto pt-3 border-top border-white">
            <n-button 
              @click="logout" 
              type="error"
              size="small"
              class="w-100"
              ghost
            >
              <template #icon>
                <i class="bi bi-box-arrow-right"></i>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">
        <!-- Header -->
        <n-layout-header bordered class="custom-header d-flex align-items-center p-3">
          <!-- Bouton Retour -->
          <div class="d-flex align-items-center">
            <n-button 
              @click="$router.go(-1)" 
              type="default" 
              size="small"
              class="me-3"
              ghost
            >
              <template #icon>
                <i class="bi bi-arrow-left"></i>
              </template>
              Retour
            </n-button>
          </div>
          
          <!-- Titre centré -->
          <div class="flex-grow-1 text-center">
            <h1 class="custom-title mb-1">
              <i class="bi bi-calendar-check me-2"></i>
              Calendrier & Disponibilités
            </h1>
            <p class="custom-subtitle">Gestion des locations et réservations en temps réel</p>
          </div>
          
          <!-- Informations utilisateur -->
          <div class="d-flex align-items-center gap-3">
            <n-tag type="info" size="small" class="custom-tag">
              Rôle: {{ userRole }}
            </n-tag>
          </div>
        </n-layout-header>

        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="container-fluid py-4">
            <!-- Contenu principal avec scroll -->
            <div class="content-wrapper">
              <hr class="my-4 custom-divider">

              <!-- Cartes de statistiques CLICABLES -->
              <div class="row mb-4">
                <!-- KPI: Événements Confirmés -->
                <div class="col-md-4 mb-3" @click="showKpiDetails('confirmes')">
                  <n-card class="custom-card-primary h-100" size="small" hoverable>
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-primary me-3">
                        <i class="bi bi-calendar-check text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">Événements Confirmés</h6>
                        <h4 class="mb-0 text-warning">{{ confirmedEventsCount }}</h4>
                        <small class="text-white-50">
                          <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour voir les détails
                        </small>
                      </div>
                    </div>
                  </n-card>
                </div>
                
                <!-- KPI: En Cours -->
                <div class="col-md-4 mb-3" @click="showKpiDetails('en_cours')">
                  <n-card class="custom-card-warning h-100" size="small" hoverable>
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-warning me-3">
                        <i class="bi bi-clock-history text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">En Cours</h6>
                        <h4 class="mb-0 text-warning">{{ enCoursCount }}</h4>
                        <small class="text-white-50">
                          <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour voir les détails
                        </small>
                      </div>
                    </div>
                  </n-card>
                </div>
                
                <!-- KPI: Terminés -->
                <div class="col-md-4 mb-3" @click="showKpiDetails('termines')">
                  <n-card class="custom-card-danger h-100" size="small" hoverable>
                    <div class="d-flex align-items-center">
                      <div class="custom-icon-danger me-3">
                        <i class="bi bi-check-circle text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1 text-white">Terminés</h6>
                        <h4 class="mb-0 text-danger">{{ completedCount }}</h4>
                        <small class="text-white-50">
                          <i class="bi bi-arrow-right-circle me-1"></i>Cliquez pour voir les détails
                        </small>
                      </div>
                    </div>
                  </n-card>
                </div>
              </div>

              <!-- NOUVEAUX BOUTONS DEMANDÉS -->
              <div class="row mb-4">
                <div class="col-md-6 mb-3">
                  <n-button 
                    block 
                    type="primary" 
                    size="large"
                    @click="showTodayConfirmedModal = true"
                    class="custom-btn-primary"
                  >
                    <template #icon>
                      <i class="bi bi-calendar-check me-2"></i>
                    </template>
                    Confirmés & En cours aujourd'hui
                    <n-badge :value="todayConfirmedAndInProgressCount" type="warning" :max="99" class="ms-2" />
                  </n-button>
                </div>
                
                <div class="col-md-6 mb-3">
                  <n-button 
                    block 
                    type="info" 
                    size="large"
                    @click="openEquipmentReturnsModal"
                    class="custom-btn-info"
                  >
                    <template #icon>
                      <i class="bi bi-arrow-return-left me-2"></i>
                    </template>
                    Retours aujourd'hui & Confirmés 7 jours
                    <n-badge :value="equipmentReturnsTodayCount + confirmedNext7DaysCount" type="error" :max="99" class="ms-2" />
                  </n-button>
                </div>
              </div>

              <!-- Bouton pour ouvrir le calendrier -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="d-flex justify-content-end">
                    <n-button 
                      type="primary" 
                      class="custom-btn-primary mb-3"
                      @click="showCalendarModal = true"
                    >
                      <template #icon>
                        <i class="bi bi-calendar3"></i>
                      </template>
                      Voir le calendrier des réservations
                    </n-button>
                  </div>
                </div>
              </div>

              <!-- Vue d'ensemble des Locations et Réservations -->
              <n-card class="shadow-lg custom-card" title="Locations">
                <template #header-extra>
                  <div class="d-flex gap-2 align-items-center flex-wrap">
                    <!-- Barre de recherche par nom -->
                    <div class="search-container">
                      <n-input
                        v-model:value="searchQuery"
                        placeholder="Rechercher par client, désignation..."
                        clearable
                        size="small"
                        style="width: 250px;"
                      >
                        <template #prefix>
                          <i class="bi bi-search"></i>
                        </template>
                      </n-input>
                    </div>
                    
                    <!-- Recherche par date -->
                    <div class="date-search-container d-flex gap-2">
                      <n-select
                        v-model:value="searchDateType"
                        :options="dateSearchOptions"
                        placeholder="Type de date"
                        style="width: 140px;"
                        size="small"
                      />
                      
                      <div v-if="searchDateType !== 'both'">
                        <n-date-picker
                          v-model:formatted-value="searchDate"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="Sélectionner date"
                          clearable
                          size="small"
                          style="width: 150px;"
                        />
                      </div>
                      
                      <div v-if="searchDateType === 'both'" class="d-flex gap-2">
                        <n-date-picker
                          v-model:formatted-value="startDateRange"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="Du"
                          clearable
                          size="small"
                          style="width: 120px;"
                        />
                        <n-date-picker
                          v-model:formatted-value="endDateRange"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="Au"
                          clearable
                          size="small"
                          style="width: 120px;"
                        />
                      </div>
                    </div>
                    
                    <!-- Filtre de statut -->
                    <n-select
                      v-model:value="selectedStatusFilter"
                      :options="statusFilterOptions"
                      placeholder="Statut"
                      style="width: 140px;"
                      size="small"
                      clearable
                    />
                    
                    <!-- Bouton réinitialiser -->
                    <n-button 
                      type="default" 
                      size="small" 
                      @click="resetSearch"
                      :disabled="!searchQuery && !searchDate && !startDateRange && !endDateRange && !selectedStatusFilter"
                    >
                      <template #icon>
                        <i class="bi bi-x-circle"></i>
                      </template>
                      Réinitialiser
                    </n-button>
                    
                    <!-- Bouton actualiser -->
                    <n-button type="primary" size="small" class="custom-btn-primary" @click="fetchAllEvents" :loading="loadingEvents">
                      <template #icon>
                        <i class="bi bi-arrow-clockwise"></i>
                      </template>
                      Actualiser
                    </n-button>
                  </div>
                </template>

                <div class="card-header-info mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div v-if="isSearchActive" class="search-info">
                      <n-tag type="info" size="small">
                        <i class="bi bi-filter me-1"></i>
                        Recherche active : {{ searchResultCount }} résultat(s)
                      </n-tag>
                    </div>
                    <div v-else>
                      <n-tag type="default" size="small">
                        Total : {{ filteredTableData.length }} événement(s)
                      </n-tag>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  <!-- Loading State -->
                  <div v-if="loadingEvents" class="text-center p-5">
                    <n-spin size="large">
                      <template #description>
                        Chargement des événements...
                      </template>
                    </n-spin>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="loadError" class="text-center p-5">
                    <n-alert type="error" title="Erreur de chargement" class="mb-3">
                      Impossible de charger les événements. Vérifiez votre connexion.
                    </n-alert>
                    <n-button type="primary" @click="fetchAllEvents">
                      <template #icon>
                        <i class="bi bi-arrow-clockwise"></i>
                      </template>
                      Réessayer
                    </n-button>
                  </div>

                  <!-- Empty State -->
                  <div v-else-if="filteredTableData.length === 0" class="text-center p-5">
                    <n-empty :description="selectedStatusFilter ? `Aucun événement avec le statut '${selectedStatusFilter}'` : 'Aucun événement trouvé'">
                      <template #icon>
                        <i class="bi bi-calendar-x" style="font-size: 3rem; color: #55555E;"></i>
                      </template>
                      <template #extra>
                        <n-button type="primary" @click="fetchAllEvents">
                          <template #icon>
                            <i class="bi bi-arrow-clockwise"></i>
                          </template>
                          Actualiser
                        </n-button>
                      </template>
                    </n-empty>
                  </div>

                  <!-- Data Table avec scroll -->
                  <div v-else class="table-container">
                    <n-data-table
                      :columns="columns"
                      :data="filteredTableData"
                      :pagination="pagination"
                      :bordered="false"
                      class="custom-table"
                      :loading="loadingTable"
                    />
                  </div>
                </div>
              </n-card>
            </div>

            <!-- Modal pour le calendrier simplifié -->
            <n-modal
              v-model:show="showCalendarModal"
              :mask-closable="false"
              preset="card"
              title="Calendrier des Réservations"
              style="width: 95%; max-width: 1200px;"
              class="custom-modal"
              size="huge"
            >
              <template #header>
                <div class="d-flex align-items-center">
                  <div class="calendar-icon me-3">
                    <i class="bi bi-calendar3 text-white"></i>
                  </div>
                  <div>
                    <h5 class="mb-0">Calendrier des Réservations</h5>
                    <small class="text-muted">Visualisez les locations en cours et confirmées</small>
                  </div>
                </div>
              </template>

              <div class="calendar-container">
                <!-- Légende du calendrier -->
                <div class="calendar-legend mb-4">
                  <div class="d-flex flex-wrap gap-3">
                    <div class="legend-item">
                      <span class="legend-color" style="background-color: #4CAF50;"></span>
                      <span class="legend-text">Confirmée</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-color" style="background-color: #FFA726;"></span>
                      <span class="legend-text">En cours</span>
                    </div>
                  
                  </div>
                </div>

                <!-- Calendrier simplifié -->
                <div class="simple-calendar">
                  <div class="calendar-header">
                    <button class="calendar-nav-btn" @click="prevMonth">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                    <h4 class="calendar-month">{{ currentMonthYear }}</h4>
                    <button class="calendar-nav-btn" @click="nextMonth">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </div>
                  
                  <div class="calendar-grid">
                    <!-- En-têtes des jours -->
                    <div class="calendar-week-header">
                      <div class="calendar-day-header" v-for="day in daysOfWeek" :key="day">
                        {{ day }}
                      </div>
                    </div>
                    
                    <!-- Jours du mois -->
                    <div class="calendar-week" v-for="week in calendarWeeks" :key="week.weekNumber">
                      <div 
                        class="calendar-day" 
                        v-for="day in week.days" 
                        :key="day.date"
                        :class="{
                          'today': day.isToday,
                          'other-month': !day.isCurrentMonth,
                          'has-events': day.events.length > 0
                        }"
                        @click="day.events.length > 0 ? showDayEvents(day) : null"
                      >
                        <div class="day-number">{{ day.day }}</div>
                        <div class="day-events">
                          <div 
                            v-for="event in day.events.slice(0, 2)" 
                            :key="event.id"
                            class="event-dot"
                            :style="{ backgroundColor: getEventColor(event) }"
                            :title="event.title"
                          ></div>
                          <div v-if="day.events.length > 2" class="event-more">
                            +{{ day.events.length - 2 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Liste des événements du mois -->
                <div class="month-events mt-4">
                  <h6 class="mb-3">Événements de {{ currentMonthYear }}</h6>
                  <div v-if="monthEvents.length === 0" class="text-center py-3">
                    <p class="text-muted">Aucun événement ce mois-ci</p>
                  </div>
                  <div v-else>
                    <div class="event-list">
                      <div v-for="event in monthEvents" :key="event.id" class="event-item mb-3 p-3 border rounded">
                        <div class="d-flex align-items-center">
                          <div class="event-color me-3" :style="{ backgroundColor: getEventColor(event) }"></div>
                          <div class="flex-grow-1">
                            <div class="d-flex justify-content-between">
                              <strong>{{ event.title }}</strong>
                              <n-tag :type="getStatusTagType(event.status)" size="small">
                                {{ event.status }}
                              </n-tag>
                            </div>
                            <div class="text-muted small">{{ formatEventDate(event) }}</div>
                            <div class="text-muted small">Client: {{ event.client }}</div>
                            <div class="text-muted small">Type: {{ event.type }}</div>
                            <div class="text-muted small">Désignation: {{ event.designation || 'Non spécifié' }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <template #action>
                <div class="d-flex justify-content-between w-100">
                  <n-button @click="showCalendarModal = false">
                    Fermer
                  </n-button>
                  <div>
                  
                  </div>
                </div>
              </template>
            </n-modal>

            <!-- Modal pour les détails des KPIs avec TABLEAU -->
            <n-modal
              v-model:show="showKpiModal"
              :mask-closable="false"
              preset="dialog"
              :title="kpiModalTitle"
              :bordered="false"
              class="custom-modal"
              style="width: 90%; max-width: 1200px;"
            >
              <template #header>
                <div class="d-flex align-items-center">
                  <div :class="['kpi-icon', activeKpi]">
                    <i :class="kpiModalIcon"></i>
                  </div>
                  <div>
                    <h5 class="mb-0">{{ kpiModalTitle }}</h5>
                    <small class="text-muted">{{ kpiModalSubtitle }}</small>
                  </div>
                </div>
              </template>

              <div class="kpi-modal-content">
                <!-- Loading State -->
                <div v-if="loadingKpiEvents" class="text-center p-4">
                  <n-spin size="medium">
                    <template #description>
                      Chargement des événements...
                    </template>
                  </n-spin>
                </div>

                <!-- Empty State -->
                <div v-else-if="kpiTableData.length === 0" class="text-center p-4">
                  <n-empty :description="`Aucun événement ${kpiModalTitle.toLowerCase()}`">
                    <template #icon>
                      <i :class="kpiModalIcon" style="font-size: 2.5rem; color: #ccc;"></i>
                    </template>
                  </n-empty>
                </div>

                <!-- Tableau des événements (comme le tableau principal) -->
                <div v-else class="kpi-table-container">
                  <n-data-table
                    :columns="kpiColumns"
                    :data="kpiTableData"
                    :pagination="kpiPagination"
                    :bordered="false"
                    class="custom-table"
                    size="small"
                  />
                </div>
              </div>

              <template #action>
                <div class="d-flex justify-content-between w-100">
                  <n-button @click="showKpiModal = false">
                    Fermer
                  </n-button>
                  <div>
                  
                  </div>
                </div>
              </template>
            </n-modal>

            <!-- Modal pour les événements confirmés et en cours aujourd'hui -->
            <n-modal
              v-model:show="showTodayConfirmedModal"
              :mask-closable="false"
              preset="card"
              title="Événements confirmés et en cours aujourd'hui"
              style="width: 95%; max-width: 1200px;"
              class="custom-modal"
              size="huge"
            >
              <template #header>
                <div class="d-flex align-items-center">
                  <div class="modal-icon me-3" style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);">
                    <i class="bi bi-calendar-check text-white"></i>
                  </div>
                  <div>
                    <h5 class="mb-0">Événements confirmés et en cours aujourd'hui</h5>
                    <small class="text-muted">{{ todayConfirmedAndInProgressCount }} événement(s)</small>
                  </div>
                </div>
              </template>

              <div class="modal-content">
                <!-- Loading State -->
                <div v-if="loadingEvents" class="text-center p-4">
                  <n-spin size="medium">
                    <template #description>
                      Chargement des événements...
                    </template>
                  </n-spin>
                </div>

                <!-- Empty State -->
                <div v-else-if="todayConfirmedAndInProgressEvents.length === 0" class="text-center p-4">
                  <n-empty description="Aucun événement confirmé ou en cours aujourd'hui">
                    <template #icon>
                      <i class="bi bi-calendar-x" style="font-size: 2.5rem; color: #55555E;"></i>
                    </template>
                  </n-empty>
                </div>

                <!-- Data Table -->
                <div v-else class="table-container">
                  <n-data-table
                    :columns="todayConfirmedAndInProgressColumns"
                    :data="todayConfirmedAndInProgressTableData"
                    :pagination="todayConfirmedAndInProgressPagination"
                    :bordered="false"
                    class="custom-table"
                  />
                </div>
              </div>

              <template #action>
                <div class="d-flex justify-content-between w-100">
                  <n-button @click="showTodayConfirmedModal = false">
                    Fermer
                  </n-button>
                  <div>
                    
                  </div>
                </div>
              </template>
            </n-modal>

            <!-- Modal pour retours matériel & confirmés 7 jours -->
            <n-modal
              v-model:show="showEquipmentReturnsModal"
              :mask-closable="false"
              preset="card"
              title="Retours matériel & Confirmés 7 jours"
              style="width: 95%; max-width: 1200px;"
              class="custom-modal"
              size="huge"
            >
              <template #header>
                <div class="d-flex align-items-center">
                  <div class="modal-icon me-3" style="background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);">
                    <i class="bi bi-arrow-return-left text-white"></i>
                  </div>
                  <div>
                    <h5 class="mb-0">Retours matériel & Confirmés 7 jours</h5>
                    <small class="text-muted">{{ equipmentReturnsTodayCount }} retour(s) aujourd'hui, {{ confirmedNext7DaysCount }} confirmé(s) dans 7 jours</small>
                  </div>
                </div>
              </template>

              <n-tabs type="line" animated>
                <!-- Onglet 1: Retours matériel aujourd'hui -->
                <n-tab-pane name="returns" tab="Retours matériel aujourd'hui">
                  <div class="tab-content">
                    <!-- Empty State -->
                    <div v-if="equipmentReturnsToday.length === 0" class="text-center p-4">
                      <n-empty description="Aucun retour de matériel prévu aujourd'hui">
                        <template #icon>
                          <i class="bi bi-check-circle" style="font-size: 2.5rem; color: #28a745;"></i>
                        </template>
                      </n-empty>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="table-container">
                      <n-data-table
                        :columns="equipmentReturnsColumns"
                        :data="equipmentReturnsTableData"
                        :pagination="equipmentReturnsPagination"
                        :bordered="false"
                        class="custom-table"
                      />
                    </div>
                  </div>
                </n-tab-pane>

                <!-- Onglet 2: Confirmés 7 prochains jours -->
                <n-tab-pane name="upcoming" tab="Confirmés 7 prochains jours">
                  <div class="tab-content">
                    <!-- Empty State -->
                    <div v-if="confirmedNext7Days.length === 0" class="text-center p-4">
                      <n-empty description="Aucune location confirmée dans les 7 prochains jours">
                        <template #icon>
                          <i class="bi bi-calendar-plus" style="font-size: 2.5rem; color: #6f42c1;"></i>
                        </template>
                      </n-empty>
                    </div>

                    <!-- Data Table -->
                    <div v-else class="table-container">
                      <n-data-table
                        :columns="confirmedNext7DaysColumns"
                        :data="confirmedNext7DaysTableData"
                        :pagination="confirmedNext7DaysPagination"
                        :bordered="false"
                        class="custom-table"
                      />
                    </div>
                  </div>
                </n-tab-pane>
              </n-tabs>

              <template #action>
                <div class="d-flex justify-content-between w-100">
                  <n-button @click="showEquipmentReturnsModal = false">
                    Fermer
                  </n-button>
                  <div>
                  >
                  </div>
                </div>
              </template>
            </n-modal>

            <!-- Modal d'annulation -->
            <n-modal
              v-model:show="showCancelModal"
              :mask-closable="false"
              preset="dialog"
              title="Annuler la Location"
              class="cancel-modal"
              positive-text="Confirmer l'annulation"
              negative-text="Annuler"
              @positive-click="confirmCancelLocation"
              @negative-click="showCancelModal = false"
            >
              <div class="cancel-form">
                <div class="alert alert-warning mb-4">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  <strong>Attention :</strong> Cette action est irréversible. La location sera marquée comme annulée.
                </div>

                <div class="mb-4">
                  <h6>Détails de la location :</h6>
                  <div v-if="locationToCancel" class="location-details p-3 bg-light rounded">
                    <div class="row">
                      <div class="col-md-6">
                        <p><strong>Client :</strong> {{ locationToCancel.client }}</p>
                        <p><strong>Type :</strong> {{ locationToCancel.type }}</p>
                        <p><strong>Désignation :</strong> {{ locationToCancel.designation || 'Non spécifié' }}</p>
                        <p><strong>Statut :</strong> 
                          <n-tag :type="getStatusTagType(locationToCancel.statut)" size="small">
                            {{ locationToCancel.statut }}
                          </n-tag>
                        </p>
                      </div>
                      <div class="col-md-6">
                        <p><strong>Début :</strong> {{ locationToCancel.dateDebut }}</p>
                        <p><strong>Fin :</strong> {{ locationToCancel.dateFin }}</p>
                        <p><strong>Tarif :</strong> {{ formatTarif(locationToCancel.tarifTot) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">
                    <strong>Raison de l'annulation *</strong>
                  </label>
                  <n-select
                    v-model:value="cancellationReason"
                    :options="cancellationReasons"
                    placeholder="Sélectionnez une raison"
                    clearable
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">
                    <strong>Notes supplémentaires</strong>
                  </label>
                  <n-input
                    v-model:value="cancellationNotes"
                    type="textarea"
                    placeholder="Ajoutez des notes ou détails supplémentaires..."
                    :rows="3"
                  />
                </div>

                <div class="form-check mb-3">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="confirmCancellation"
                    id="confirmCancel"
                  >
                  <label class="form-check-label" for="confirmCancel">
                    Je confirme vouloir annuler cette location
                  </label>
                </div>
              </div>
            </n-modal>
          </div>

          <!-- Modals existants -->
          <EtatLieu 
            v-model:show="showRetourModal"
            :location="selectedLocationForAction"
            @retour-success="handleRetourSuccess"
          />
          
          <EtatLieuDepart
            v-model:show="showEtatLieuxDepartModal"
            :location="selectedLocationForAction"
            @depart-success="handleEtatLieuxDepartSuccess"
          />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag, 
  NCard, 
  NSpin, 
  NEmpty, 
  NDataTable, 
  NPagination,
  NModal,
  NAlert,
  NSelect,
  NInput,
  NBadge,
  NTabs,
  NTabPane,
  NDatePicker
} from 'naive-ui';
import LocationService from '../services/LocationService';
import AuthService from '../services/AuthService';
import EtatLieu from './etatLieu.vue';
import EtatLieuDepart from './etatLieuDepart.vue';

const router = useRouter();
const route = useRoute();

// États utilisateur
const userRole = ref('');
const activeMenuKey = ref('calendrier'); // Activer l'item "calendrier" dans le menu

// Options du menu avec texte blanc
const menuOptions = ref([
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Nouvelle Réservation / Location'),
    key: 'nouvelle-reservation',
    icon: renderIcon('bi-calendar-plus-fill')
  },
  {
    label: () => {
      // Créer le label avec badge conditionnel
      const children = [
        h('span', { class: 'text-white' }, 'Demandes à Traiter')
      ];
      
      if (badgeCount.value > 0) {
        children.push(
          h(NTag, {
            type: 'warning',
            size: 'small',
            class: 'ms-2 custom-tag'
          }, { default: () => badgeCount.value.toString() })
        );
      }
      
      return h('div', {
        class: 'd-flex align-items-center'
      }, children);
    },
    key: 'demandes-attente',
    icon: renderIcon('bi-bell-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Calendrier & Disponibilités'),
    key: 'calendrier',
    icon: renderIcon('bi-calendar-day')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Inventaire & Patrimoine'),
    key: 'inventaire',
    icon: renderIcon('bi-tools')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Matériel de Bureau'),
    key: 'bureau',
    icon: renderIcon('bi-briefcase-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Fiches Clients'),
    key: 'clients',
    icon: renderIcon('bi-people-fill')
  }
]);

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'accueil': 'ReceptionDashboard',
    'nouvelle-reservation': 'NouvelleReservation',
    'demandes-attente': 'DemandesEnAttente',
    'calendrier': 'CalendrierDisponibilites',
    'inventaire': 'InventairePatrimoine',
    'bureau': 'Bureau',
    'clients': 'ClientManagement'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Variables d'état
const allEvents = ref([]);
const loadingEvents = ref(true);
const loadingTable = ref(false);
const loadError = ref(false);
const showKpiModal = ref(false);
const activeKpi = ref('');
const kpiEvents = ref([]);
const loadingKpiEvents = ref(false);
const showEtatLieuxDepartModal = ref(false);
const showRetourModal = ref(false);
const selectedLocationForAction = ref(null);
const selectedStatusFilter = ref(null);
const badgeCount = ref(0);

// Variables pour le calendrier
const showCalendarModal = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Variables pour l'annulation
const showCancelModal = ref(false);
const locationToCancel = ref(null);
const cancellationReason = ref('');
const cancellationNotes = ref('');
const confirmCancellation = ref(false);

// Variables pour les nouveaux modals
const showTodayConfirmedModal = ref(false);
const showEquipmentReturnsModal = ref(false);

// Recherche par nom et date
const searchQuery = ref('');
const searchDate = ref(null);
const searchDateType = ref('start'); // 'start', 'end', 'both'
const startDateRange = ref(null);
const endDateRange = ref(null);

// Options pour le filtre de statut
const statusFilterOptions = [
  { label: 'Tous les statuts', value: null },
  { label: 'Confirmée', value: 'Confirmée' },
  { label: 'En cours', value: 'En cours' },
  { label: 'Terminée', value: 'Terminée' },
  { label: 'Annulée', value: 'Annulée' }
];

// Options pour la recherche par date
const dateSearchOptions = [
  { label: 'Date de début', value: 'start' },
  { label: 'Date de fin', value: 'end' },
  { label: 'Entre deux dates', value: 'both' }
];

// Options pour les raisons d'annulation
const cancellationReasons = [
  { label: 'Annulation par le client', value: 'client_cancellation' },
  { label: 'Indisponibilité du matériel', value: 'equipment_unavailable' },
  { label: 'Indisponibilité de la salle', value: 'room_unavailable' },
  { label: 'Problème de paiement', value: 'payment_issue' },
  { label: 'Force majeure', value: 'force_majeure' },
  { label: 'Autre raison', value: 'other' }
];

// Jours de la semaine
const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// NOUVELLES COMPUTED PROPERTIES POUR LES BOUTONS
// Événements confirmés et en cours pour aujourd'hui seulement
const todayConfirmedAndInProgressEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return allEvents.value.filter(event => {
    if (!['Confirmée', 'En cours'].includes(event.etatLo)) return false;
    
    const eventDate = new Date(event.debLo);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate.getTime() === today.getTime();
  });
});

// Événements dont le retour est prévu aujourd'hui (statut 'En cours' ou 'Confirmée' avec date de fin aujourd'hui)
const equipmentReturnsToday = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return allEvents.value.filter(event => {
    if (!['En cours', 'Confirmée'].includes(event.etatLo)) return false;
    if (event.typeLo === 'Salle') return false; // Exclure les salles
    
    const endDate = new Date(event.finLo);
    endDate.setHours(0, 0, 0, 0);
    
    return endDate.getTime() === today.getTime();
  });
});

// Événements confirmés dans les 7 prochains jours
const confirmedNext7Days = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);
  
  return allEvents.value.filter(event => {
    if (event.etatLo !== 'Confirmée') return false;
    
    const startDate = new Date(event.debLo);
    
    return startDate >= today && startDate <= nextWeek;
  }).sort((a, b) => new Date(a.debLo) - new Date(b.debLo));
});

// Counts pour les badges
const todayConfirmedAndInProgressCount = computed(() => {
  return todayConfirmedAndInProgressEvents.value.length;
});

const equipmentReturnsTodayCount = computed(() => {
  return equipmentReturnsToday.value.length;
});

const confirmedNext7DaysCount = computed(() => {
  return confirmedNext7Days.value.length;
});

// Computed properties pour la recherche active
const isSearchActive = computed(() => {
  return !!searchQuery.value || !!searchDate.value || 
         !!startDateRange.value || !!endDateRange.value || 
         !!selectedStatusFilter.value;
});

const searchResultCount = computed(() => {
  return filteredTableData.value.length;
});

// Computed properties originales
const confirmedEventsCount = computed(() => {
  return allEvents.value.filter(event => event.etatLo === 'Confirmée').length;
});

const enCoursCount = computed(() => {
  return allEvents.value.filter(event => event.etatLo === 'En cours').length;
});

const completedCount = computed(() => {
  return allEvents.value.filter(event => event.etatLo === 'Terminée').length;
});

// Computed pour le calendrier simplifié
const currentMonthYear = computed(() => {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return `${monthNames[currentMonth.value]} ${currentYear.value}`;
});

// Transform events for calendar
const transformedCalendarEvents = computed(() => {
  return allEvents.value
    .filter(event => event.etatLo === 'Confirmée' || event.etatLo === 'En cours' || event.etatLo === 'En attente')
    .map(event => {
      const clientName = getClientName(event);
      const designation = getDesignation(event);
      
      let title = clientName;
      if (designation !== 'Non spécifié') {
        title = `${designation} - ${clientName}`;
      }
      
      return {
        id: event.idLo,
        title: title,
        start: new Date(event.debLo),
        end: new Date(event.finLo),
        client: clientName,
        type: event.typeLo,
        designation: designation,
        status: event.etatLo,
        materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || '',
        salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || '',
        tarif: event.tarifTot,
        locationId: event.idLo
      };
    });
});

const calendarWeeks = computed(() => {
  const weeks = [];
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  
  // Ajuster pour commencer le lundi
  const dayOfWeek = firstDayOfMonth.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(firstDayOfMonth.getDate() - diff);
  
  let currentWeek = [];
  let weekNumber = 1;
  
  while (startDate <= lastDayOfMonth || currentWeek.length < 7) {
    if (currentWeek.length === 7) {
      weeks.push({
        weekNumber: weekNumber,
        days: [...currentWeek]
      });
      currentWeek = [];
      weekNumber++;
    }
    
    const dayDate = new Date(startDate);
    const isCurrentMonth = dayDate.getMonth() === currentMonth.value;
    const isToday = dayDate.toDateString() === new Date().toDateString();
    
    // Trouver les événements pour ce jour
    const dayEvents = transformedCalendarEvents.value.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === dayDate.toDateString();
    });
    
    currentWeek.push({
      date: dayDate.toISOString().split('T')[0],
      day: dayDate.getDate(),
      isCurrentMonth,
      isToday,
      events: dayEvents
    });
    
    startDate.setDate(startDate.getDate() + 1);
  }
  
  if (currentWeek.length > 0) {
    weeks.push({
      weekNumber: weekNumber,
      days: currentWeek
    });
  }
  
  return weeks;
});

const monthEvents = computed(() => {
  return transformedCalendarEvents.value.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getMonth() === currentMonth.value && 
           eventDate.getFullYear() === currentYear.value;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));
});

// Données pour le tableau principal (filtrées si nécessaire)
const filteredTableData = computed(() => {
  let events = allEvents.value;
  
  // Appliquer le filtre de statut si sélectionné
  if (selectedStatusFilter.value) {
    events = events.filter(event => event.etatLo === selectedStatusFilter.value);
  }
  
  // Appliquer la recherche par nom
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    events = events.filter(event => {
      const clientName = getClientName(event).toLowerCase();
      const designation = getDesignation(event).toLowerCase();
      const type = event.typeLo.toLowerCase();
      
      return clientName.includes(query) || 
             designation.includes(query) || 
             type.includes(query) ||
             event.idLo.toString().includes(query);
    });
  }
  
  // Appliquer la recherche par date
  if (searchDate.value) {
    const selectedDate = new Date(searchDate.value);
    selectedDate.setHours(0, 0, 0, 0);
    
    events = events.filter(event => {
      const eventStartDate = new Date(event.debLo);
      eventStartDate.setHours(0, 0, 0, 0);
      
      const eventEndDate = new Date(event.finLo);
      eventEndDate.setHours(0, 0, 0, 0);
      
      if (searchDateType.value === 'start') {
        return eventStartDate.getTime() === selectedDate.getTime();
      } else if (searchDateType.value === 'end') {
        return eventEndDate.getTime() === selectedDate.getTime();
      } else if (searchDateType.value === 'both') {
        return eventStartDate <= selectedDate && eventEndDate >= selectedDate;
      }
      return true;
    });
  }
  
  // Appliquer la recherche par plage de dates
  if (searchDateType.value === 'both' && startDateRange.value && endDateRange.value) {
    const startDate = new Date(startDateRange.value);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(endDateRange.value);
    endDate.setHours(23, 59, 59, 999);
    
    events = events.filter(event => {
      const eventStartDate = new Date(event.debLo);
      const eventEndDate = new Date(event.finLo);
      
      return eventStartDate <= endDate && eventEndDate >= startDate;
    });
  }
  
  return events.map(event => {
    const clientName = getClientName(event);
    const designation = getDesignation(event);
    
    return {
      id: event.idLo,
      idLo: event.idLo,
      client: clientName,
      type: event.typeLo,
      designation: designation,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarifTot: event.tarifTot,
      statut: event.etatLo,
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      _original: event,
      reservation: event.reservation || event.Reservation,
      location: event
    };
  });
});

// NOUVELLES DONNÉES POUR LES TABLEAUX DES BOUTONS
// Données pour le tableau "Événements confirmés et en cours aujourd'hui"
const todayConfirmedAndInProgressTableData = computed(() => {
  return todayConfirmedAndInProgressEvents.value.map(event => {
    const clientName = getClientName(event);
    const designation = getDesignation(event);
    
    return {
      id: event.idLo,
      client: clientName,
      type: event.typeLo,
      designation: designation,
      heureDebut: new Date(event.debLo).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      heureFin: new Date(event.finLo).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duree: calculateDuration(event.debLo, event.finLo),
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      statut: event.etatLo,
      tarif: event.tarifTot,
      _original: event
    };
  });
});

// Données pour le tableau "Retours matériel aujourd'hui"
const equipmentReturnsTableData = computed(() => {
  return equipmentReturnsToday.value.map(event => {
    const clientName = getClientName(event);
    const designation = getDesignation(event);
    
    return {
      id: event.idLo,
      client: clientName,
      type: event.typeLo,
      designation: designation,
      dateDebut: new Date(event.debLo).toLocaleDateString('fr-FR'),
      heureFin: new Date(event.finLo).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      quantite: event.reservation?.quantite || event.quantite || 1,
      statut: event.etatLo,
      _original: event
    };
  });
});

// Données pour le tableau "Confirmés 7 prochains jours"
const confirmedNext7DaysTableData = computed(() => {
  return confirmedNext7Days.value.map(event => {
    const clientName = getClientName(event);
    const designation = getDesignation(event);
    
    return {
      id: event.idLo,
      client: clientName,
      type: event.typeLo,
      designation: designation,
      dateDebut: new Date(event.debLo).toLocaleDateString('fr-FR'),
      heureDebut: new Date(event.debLo).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      joursRestants: calculateDaysRemaining(event.debLo),
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      tarif: event.tarifTot,
      _original: event
    };
  });
});

// Données pour le tableau KPI
const kpiTableData = computed(() => {
  return kpiEvents.value.map(event => {
    const clientName = getClientName(event);
    const designation = getDesignation(event);
    
    return {
      id: event.idLo,
      idLo: event.idLo,
      client: clientName,
      type: event.typeLo,
      designation: designation,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarifTot: event.tarifTot,
      statut: event.etatLo,
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      _original: event,
      reservation: event.reservation || event.Reservation,
      location: event
    };
  });
});

const pagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
};

const kpiPagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10, 20]
};

// NOUVELLES PAGINATIONS
const todayConfirmedAndInProgressPagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
};

const equipmentReturnsPagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
};

const confirmedNext7DaysPagination = {
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50]
};

// Computed pour le modal KPI
const kpiModalTitle = computed(() => {
  const titles = {
    'confirmes': 'Événements Confirmés',
    'en_cours': 'Événements en Cours',
    'termines': 'Événements Terminés'
  };
  return titles[activeKpi.value] || 'Détails';
});

const kpiModalSubtitle = computed(() => {
  const subtitles = {
    'confirmes': `${confirmedEventsCount.value} événements à venir`,
    'en_cours': `${enCoursCount.value} événements en cours`,
    'termines': `${completedCount.value} événements terminés`
  };
  return subtitles[activeKpi.value] || '';
});

const kpiModalIcon = computed(() => {
  const icons = {
    'confirmes': 'bi bi-calendar-check text-primary',
    'en_cours': 'bi bi-clock-history text-warning',
    'termines': 'bi bi-check-circle text-success'
  };
  return icons[activeKpi.value] || 'bi bi-info-circle';
});

// Configuration des colonnes pour le tableau principal
const columns = [
 /* {
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 150,
    ellipsis: true,
    sorter: (a, b) => a.client.localeCompare(b.client)
  },
  {
    title: 'Type',
    key: 'type',
    width: 100,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      class: 'custom-tag'
    }, { default: () => row.type })
  },
  // AJOUT DE LA COLONNE DÉSIGNATION/NOM
  {
    title: 'Désignation',
    key: 'designation',
    width: 180,
    ellipsis: true,
    render: (row) => {
      const designation = row.designation;
      return h('div', { 
        class: 'designation-cell',
        title: designation 
      }, designation);
    }
  },
  {
    title: 'Début',
    key: 'dateDebut',
    width: 160
  },
  {
    title: 'Fin',
    key: 'dateFin',
    width: 160
  },
  {
    title: 'Tarif',
    key: 'tarif',
    width: 130,
    align: 'right',
    render: (row) => {
      const tarifCalcule = calculateTarif(row.location || row);
      return h('strong', { class: 'text-primary' }, formatTarif(tarifCalcule));
    }
  },
  {
    title: 'Statut',
    key: 'statut',
    width: 120,
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning',
        'Terminée': 'default',
        'En attente': 'info',
        'Annulée': 'error'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.statut })
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 220,
    fixed: 'right',
    render: (row) => {
      const buttons = [];
      
      // Bouton Annuler (seulement pour Confirmée et En attente)
      if (row.statut === 'Confirmée' || row.statut === 'En attente') {
        buttons.push(
          h(NButton, {
            size: 'small',
            type: 'error',
            class: 'custom-btn-danger me-1',
            onClick: () => openCancelModal(row),
            title: 'Annuler cette location'
          }, {
            default: () => [h('i', { class: 'bi bi-x-circle me-1' }), 'Annuler']
          })
        );
      }
      
      // Bouton Départ
      buttons.push(
        h(NButton, {
          size: 'small',
          type: 'warning',
          class: 'custom-btn-warning me-1',
          onClick: () => ouvrirEtatLieuxDepart(row),
          disabled: row.statut !== 'Confirmée',
          title: row.statut !== 'Confirmée' ? 
            (row.statut === 'En cours' ? 'Départ déjà effectué' : 'Location terminée ou annulée') 
            : 'État des lieux départ'
        }, {
          default: () => [h('i', { class: 'bi bi-box-arrow-right me-1' }), 'Départ']
        })
      );
      
      // Bouton Retour
      buttons.push(
        h(NButton, {
          size: 'small',
          type: 'error',
          class: 'custom-btn-danger',
          onClick: () => ouvrirRetourMateriel(row),
          disabled: row.statut !== 'En cours',
          title: row.statut !== 'En cours' ? 
            (row.statut === 'Confirmée' ? 'Départ non effectué' : 'Location terminée') 
            : 'Retour de matériel'
        }, {
          default: () => [h('i', { class: 'bi bi-box-arrow-in-left me-1' }), 'Retour']
        })
      );
      
      return h('div', { class: 'd-flex gap-1' }, buttons);
    }
  }
];

// Configuration des colonnes pour le tableau KPI
const kpiColumns = [
 /* {
    title: 'ID',
    key: 'id',
    width: 70,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 140,
    ellipsis: true,
    sorter: (a, b) => a.client.localeCompare(b.client)
  },
  {
    title: 'Type',
    key: 'type',
    width: 90,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      class: 'custom-tag'
    }, { default: () => row.type })
  },
  // CORRECTION DE LA COLONNE DÉSIGNATION POUR LES KPI
  {
    title: 'Désignation/Nom',
    key: 'designation',
    width: 180,
    ellipsis: true,
    render: (row) => {
      // Utiliser directement la désignation depuis les données transformées
      const designation = row.designation || getDesignation(row._original || row.location || row);
      return h('div', { 
        class: 'designation-cell',
        title: designation 
      }, designation);
    }
  },
  {
    title: 'Début',
    key: 'dateDebut',
    width: 150
  },
  {
    title: 'Fin',
    key: 'dateFin',
    width: 150
  },
  {
    title: 'Tarif',
    key: 'tarif',
    width: 120,
    align: 'right',
    render: (row) => {
      const tarifCalcule = calculateTarif(row.location || row);
      return h('strong', { class: 'text-primary' }, formatTarif(tarifCalcule));
    }
  },
  {
    title: 'Statut',
    key: 'statut',
    width: 110,
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning',
        'Terminée': 'default',
        'En attente': 'info',
        'Annulée': 'error'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.statut })
    }
  }
];

// NOUVELLES COLONNES POUR LES BOUTONS
const todayConfirmedAndInProgressColumns = [
  /*{
    title: 'ID',
    key: 'id',
    width: 70,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 140,
    ellipsis: true
  },
  {
    title: 'Type',
    key: 'type',
    width: 90,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small'
    }, { default: () => row.type })
  },
  {
    title: 'Désignation/Nom',
    key: 'designation',
    width: 180,
    ellipsis: true,
    render: (row) => {
      const designation = row.designation;
      return h('div', { 
        class: 'designation-cell',
        title: designation 
      }, designation);
    }
  },
  {
    title: 'Heure Début',
    key: 'heureDebut',
    width: 110
  },
  {
    title: 'Heure Fin',
    key: 'heureFin',
    width: 110
  },
  {
    title: 'Durée',
    key: 'duree',
    width: 90
  },
  {
    title: 'Statut',
    key: 'statut',
    width: 100,
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small'
      }, { default: () => row.statut })
    }
  },
  {
    title: 'Tarif',
    key: 'tarif',
    width: 110,
    align: 'right',
    render: (row) => h('strong', { class: 'text-primary' }, formatTarif(row.tarif))
  }
];

const equipmentReturnsColumns = [
 /* {
    title: 'ID',
    key: 'id',
    width: 70,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 140,
    ellipsis: true
  },
  {
    title: 'Type',
    key: 'type',
    width: 90,
    render: (row) => h(NTag, { 
      type: row.type === 'Materiel' ? 'info' : 'success',
      size: 'small'
    }, { default: () => row.type })
  },
  {
    title: 'Désignation/Nom',
    key: 'designation',
    width: 180,
    ellipsis: true,
    render: (row) => {
      const designation = row.designation;
      return h('div', { 
        class: 'designation-cell',
        title: designation 
      }, designation);
    }
  },
  {
    title: 'Date Début',
    key: 'dateDebut',
    width: 110
  },
  {
    title: 'Heure Fin',
    key: 'heureFin',
    width: 110
  },
  {
    title: 'Matériel',
    key: 'materiel',
    width: 130
  },
  {
    title: 'Quantité',
    key: 'quantite',
    width: 90,
    align: 'center'
  },
  {
    title: 'Statut',
    key: 'statut',
    width: 100,
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small'
      }, { default: () => row.statut })
    }
  }
];

const confirmedNext7DaysColumns = [
  /*{
    title: 'ID',
    key: 'id',
    width: 70,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },*/
  {
    title: 'Client',
    key: 'client',
    width: 140,
    ellipsis: true
  },
  {
    title: 'Type',
    key: 'type',
    width: 90,
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small'
    }, { default: () => row.type })
  },
  {
    title: 'Désignation/Nom',
    key: 'designation',
    width: 180,
    ellipsis: true,
    render: (row) => {
      const designation = row.designation;
      return h('div', { 
        class: 'designation-cell',
        title: designation 
      }, designation);
    }
  },
  {
    title: 'Date Début',
    key: 'dateDebut',
    width: 110
  },
  {
    title: 'Heure Début',
    key: 'heureDebut',
    width: 110
  },
  {
    title: 'Jours restants',
    key: 'joursRestants',
    width: 120,
    render: (row) => {
      const days = row.joursRestants;
      const tagType = days <= 1 ? 'error' : days <= 3 ? 'warning' : 'info';
      return h(NTag, { 
        type: tagType,
        size: 'small'
      }, { default: () => `${days} jour${days > 1 ? 's' : ''}` })
    }
  },
  {
    title: 'Tarif',
    key: 'tarif',
    width: 110,
    align: 'right',
    render: (row) => h('strong', { class: 'text-primary' }, formatTarif(row.tarif))
  }
];


const getDesignation = (event) => {
  if (!event) return 'Non spécifié';
  
  try {
    // Cas 1: Événements avec réservation imbriquée
    if (event.reservation) {
      // Pour le matériel
      if (event.typeLo === 'Materiel' || event.typeLo === 'Mixte') {
        const materiel = event.reservation.materiel || event.reservation.Materiel;
        if (materiel?.designationMat) {
          return materiel.designationMat;
        }
      }
      
      // Pour la salle
      if (event.typeLo === 'Salle' || event.typeLo === 'Mixte') {
        const salle = event.reservation.salle || event.reservation.Salle;
        if (salle?.nomSalle) {
          return `Salle: ${salle.nomSalle}`;
        }
      }
    }
    
    // Cas 2: Événements avec détails directs (pour les événements terminés)
    if (event.materielDetails?.designationMat) {
      return event.materielDetails.designationMat;
    }
    
    if (event.salleDetails?.nomSalle) {
      return ` ${event.salleDetails.nomSalle}`;
    }
    
    // Cas 3: Vérifier les champs directs
    if (event.designationMat) {
      return event.designationMat;
    }
    
    if (event.nomSalle) {
      return ` ${event.nomSalle}`;
    }
    
    // Cas 4: Recherche dans les champs de code/id
    if (event.codeMat) {
      return `${event.codeMat}`;
    }
    
    if (event.idSalle) {
      return `Salle #${event.idSalle}`;
    }
    
    // Par défaut selon le type
    if (event.typeLo === 'Materiel') {
      return 'Matériel non spécifié';
    } else if (event.typeLo === 'Salle') {
      return 'Salle non spécifiée';
    } else if (event.typeLo === 'Mixte') {
      return 'Mixte (détails non disponibles)';
    }
    
    return 'Non spécifié';
    
  } catch (error) {
    console.error('Erreur getDesignation:', error, event);
    return 'Erreur de chargement';
  }
};



const fetchAllEvents = async () => {
  loadingEvents.value = true;
  loadingTable.value = true;
  loadError.value = false;
  
  try {
    console.log('🔄 Début du chargement des événements...');
    
    // Récupérer les événements
    const eventsResponse = await LocationService.getConfirmedEvents();
    const events = eventsResponse.data.data || eventsResponse.data;
    
    // Récupérer les matériels
    const materielsResponse = await LocationService.getMateriels();
    const materiels = materielsResponse.data || materielsResponse;
    
    // Récupérer les salles
    const sallesResponse = await LocationService.getSalles();
    const salles = sallesResponse.data || sallesResponse;
    
    if (events && Array.isArray(events)) {
      // Enrichir les événements AVEC PLUS DE DÉTAILS
      const enrichedEvents = events.map(event => {
        const enrichedEvent = { ...event };
        
        // IMPORTANT: Pour les événements terminés, essayer de récupérer les détails depuis différentes sources
        if (event.etatLo === 'Terminée') {
          // Essayer de trouver les détails dans la réponse initiale
          if (event.Reservation) {
            if (event.Reservation.Materiel) {
              enrichedEvent.materielDetails = event.Reservation.Materiel;
            }
            if (event.Reservation.Salle) {
              enrichedEvent.salleDetails = event.Reservation.Salle;
            }
          }
        }
        
        // Ajouter les détails du matériel
        if (event.codeMat || event.reservation?.codeMat || event.Reservation?.codeMat) {
          const codeMat = event.codeMat || event.reservation?.codeMat || event.Reservation?.codeMat;
          const materiel = Array.isArray(materiels) 
            ? materiels.find(m => m.codeMat === codeMat)
            : materiels.data?.find(m => m.codeMat === codeMat);
          
          if (materiel) {
            enrichedEvent.materielDetails = materiel;
          }
        }
        
        // Ajouter les détails de la salle
        if (event.idSalle || event.reservation?.idSalle || event.Reservation?.idSalle) {
          const idSalle = event.idSalle || event.reservation?.idSalle || event.Reservation?.idSalle;
          const salle = Array.isArray(salles) 
            ? salles.find(s => s.idSalle == idSalle)
            : salles.data?.find(s => s.idSalle == idSalle);
          
          if (salle) {
            enrichedEvent.salleDetails = salle;
          }
        }
        
        return enrichedEvent;
      });
      
      allEvents.value = enrichedEvents;
      console.log(`✅ ${allEvents.value.length} événements enrichis chargés`);
      console.log('Événements terminés:', allEvents.value.filter(e => e.etatLo === 'Terminée'));
      
    } else {
      console.error('❌ Format de données invalide:', eventsResponse);
      allEvents.value = [];
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error);
    loadError.value = true;
    loadDemoData();
  } finally {
    loadingEvents.value = false;
    loadingTable.value = false;
  }
};


const loadDemoData = () => {
  console.log('⚠️  Utilisation de données de démo');
  
  const demoEvents = [
    {
      idLo: 15,
      typeLo: 'Materiel',
      etatLo: 'En attente',
      debLo: new Date('2025-11-09T03:00:00').toISOString(),
      finLo: new Date('2025-11-12T03:00:00').toISOString(),
      tarifTot: 75000,
      client: {
        nomCli: 'rarie',
        prenomCli: 'danie'
      },
      materielDetails: {
        designationMat: 'Projecteur HD'
      }
    },
    {
      idLo: 9,
      typeLo: 'Materiel',
      etatLo: 'Confirmée',
      debLo: new Date('2025-11-11T09:37:00').toISOString(),
      finLo: new Date('2025-11-12T12:00:00').toISOString(),
      tarifTot: 21,
      client: {
        nomCli: 'Ma',
        prenomCli: 'Mary'
      },
      materielDetails: {
        designationMat: 'Microphone sans fil'
      }
    },
    {
      idLo: 1,
      typeLo: 'Salle',
      etatLo: 'Confirmée',
      debLo: new Date(Date.now() + 86400000).toISOString(),
      finLo: new Date(Date.now() + 86400000 + 3*3600000).toISOString(),
      tarifTot: 150000,
      client: {
        nomCli: 'Dupont',
        prenomCli: 'Jean'
      },
      salleDetails: {
        nomSalle: 'Salle de conférence'
      }
    },
    {
      idLo: 2,
      typeLo: 'Materiel',
      etatLo: 'En cours',
      debLo: new Date(Date.now() - 3600000).toISOString(),
      finLo: new Date(Date.now() + 7*3600000).toISOString(),
      tarifTot: 75000,
      reservation: {
        client: {
          nomCli: 'Martin',
          prenomCli: 'Sophie'
        }
      },
      materielDetails: {
        designationMat: 'Écran de projection'
      }
    },
    {
      idLo: 3,
      typeLo: 'Mixte',
      etatLo: 'Terminée',
      debLo: new Date(Date.now() - 86400000).toISOString(),
      finLo: new Date(Date.now() - 86400000 + 9*3600000).toISOString(),
      tarifTot: 250000,
      client: {
        nomCli: 'Bernard',
        prenomCli: 'Pierre'
      },
      materielDetails: {
        designationMat: 'Système son'
      },
      salleDetails: {
        nomSalle: 'Salle polyvalente'
      }
    },
    {
      idLo: 4,
      typeLo: 'Materiel',
      etatLo: 'Terminée',
      debLo: new Date(Date.now() - 2*86400000).toISOString(),
      finLo: new Date(Date.now() - 86400000).toISOString(),
      tarifTot: 120000,
      client: {
        nomCli: 'Leroy',
        prenomCli: 'Claire'
      },
      materielDetails: {
        designationMat: 'Équipement audiovisuel'
      }
    }
  ];
  
  allEvents.value = demoEvents;
  
  console.log('✅ Données de démo chargées:', demoEvents.length, 'événements');
};




// Fonctions KPI
const showKpiDetails = async (kpiType) => {
  activeKpi.value = kpiType;
  loadingKpiEvents.value = true;
  showKpiModal.value = true;

  try {
    switch (kpiType) {
      case 'confirmes':
        kpiEvents.value = allEvents.value.filter(event => 
          event.etatLo === 'Confirmée'
        );
        break;
      case 'en_cours':
        kpiEvents.value = allEvents.value.filter(event => 
          event.etatLo === 'En cours'
        );
        break;
      case 'termines':
        kpiEvents.value = allEvents.value.filter(event => 
          event.etatLo === 'Terminée'
        );
        break;
      default:
        kpiEvents.value = allEvents.value;
    }
    
    kpiEvents.value.sort((a, b) => new Date(b.debLo) - new Date(a.debLo));
    
    console.log(`📍 ${kpiType}: ${kpiEvents.value.length} événements trouvés`);
    console.log('Détails des événements terminés:', kpiEvents.value);
    
  } catch (error) {
    console.error('Erreur lors du chargement des événements KPI:', error);
    kpiEvents.value = [];
  } finally {
    loadingKpiEvents.value = false;
  }
};

// NOUVELLES FONCTIONS POUR LES BOUTONS
const openEquipmentReturnsModal = () => {
  showEquipmentReturnsModal.value = true;
};

// Fonction pour réinitialiser la recherche
const resetSearch = () => {
  searchQuery.value = '';
  searchDate.value = null;
  startDateRange.value = null;
  endDateRange.value = null;
  selectedStatusFilter.value = null;
};

// Fonctions utilitaires supplémentaires
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
  
  if (diffHours < 1) {
    return `${Math.round(diffHours * 60)} min`;
  } else if (diffHours < 24) {
    return `${Math.round(diffHours)} h`;
  } else {
    const days = Math.floor(diffHours / 24);
    const hours = Math.round(diffHours % 24);
    return `${days} j ${hours > 0 ? hours + ' h' : ''}`;
  }
};

const calculateDaysRemaining = (futureDate) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const future = new Date(futureDate);
  future.setHours(0, 0, 0, 0);
  
  const diffTime = future - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const getClientName = (event) => {
  let clientInfo = null;
  
  if (event.client && (event.client.nomCli || event.client.prenomCli)) {
    clientInfo = event.client;
  } else if (event.reservation?.client && (event.reservation.client.nomCli || event.reservation.client.prenomCli)) {
    clientInfo = event.reservation.client;
  } else if (event.Reservation?.Client && (event.Reservation.Client.nomCli || event.Reservation.Client.prenomCli)) {
    clientInfo = event.Reservation.Client;
  } else if (event.nomCli || event.prenomCli) {
    clientInfo = {
      nomCli: event.nomCli,
      prenomCli: event.prenomCli
    };
  } else if (event.reservation?.nomCli || event.reservation?.prenomCli) {
    clientInfo = {
      nomCli: event.reservation.nomCli,
      prenomCli: event.reservation.prenomCli
    };
  }
  
  if (clientInfo) {
    const nom = `${clientInfo.prenomCli || ''} ${clientInfo.nomCli || ''}`.trim();
    return nom || `Client #${clientInfo.idCli || event.idCli || 'Inconnu'}`;
  }
  
  return 'Client non spécifié';
};

const calculateTarif = (event) => {
  try {
    if (event.tarifTot && event.tarifTot > 0) {
      return event.tarifTot;
    }
    return 0;
  } catch (error) {
    console.error('Erreur calcul tarif:', error);
    return 0;
  }
};

const formatTarif = (montant) => {
  if (montant === null || montant === undefined || isNaN(montant)) {
    return '0 Ar';
  }
  const numericValue = typeof montant === 'number' ? montant : parseFloat(montant);
  return `${numericValue.toLocaleString('fr-FR')} Ar`;
};

// Fonctions pour le calendrier simplifié
const getEventColor = (event) => {
  if (event.status === 'Confirmée') return '#4CAF50';
  if (event.status === 'En cours') return '#FFA726';
  if (event.status === 'En attente') return '#757575';
  return '#9E9E9E';
};

const getStatusTagType = (status) => {
  const typeMap = {
    'Confirmée': 'success',
    'En cours': 'warning',
    'Terminée': 'default',
    'En attente': 'info',
    'Annulée': 'error'
  };
  return typeMap[status] || 'default';
};

const formatEventDate = (event) => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  return `${start.toLocaleDateString('fr-FR')} ${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const showDayEvents = (day) => {
  if (day.events.length > 0) {
    const eventsList = day.events.map(event => 
      `• ${event.title}\n  ${formatEventDate(event)}\n  Statut: ${event.status}\n  Désignation: ${event.designation || 'Non spécifié'}`
    ).join('\n\n');
    
    alert(`Événements du ${day.day}/${currentMonth.value + 1}/${currentYear.value}:\n\n${eventsList}`);
  }
};

// Fonctions d'annulation
const openCancelModal = (location) => {
  locationToCancel.value = location;
  cancellationReason.value = '';
  cancellationNotes.value = '';
  confirmCancellation.value = false;
  showCancelModal.value = true;
};

const confirmCancelLocation = async () => {
  if (!confirmCancellation.value) {
    alert('Veuillez confirmer l\'annulation en cochant la case.');
    return;
  }
  
  if (!cancellationReason.value) {
    alert('Veuillez sélectionner une raison d\'annulation.');
    return;
  }
  
  try {
    // Mettre à jour le statut localement
    const eventIndex = allEvents.value.findIndex(
      event => event.idLo === locationToCancel.value.idLo
    );
    
    if (eventIndex !== -1) {
      allEvents.value[eventIndex].etatLo = 'Annulée';
      
      console.log('📍 Location annulée:', {
        id: locationToCancel.value.idLo,
        reason: cancellationReason.value,
        notes: cancellationNotes.value
      });
      
      showCancelModal.value = false;
      
      alert(`Location #${locationToCancel.value.idLo} annulée avec succès !`);
      
      // Réinitialiser les champs
      locationToCancel.value = null;
      cancellationReason.value = '';
      cancellationNotes.value = '';
      confirmCancellation.value = false;
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error);
    alert('Erreur lors de l\'annulation de la location.');
  }
};

// Fonctions de gestion des actions
const ouvrirEtatLieuxDepart = (location) => {
  if (!location || (!location.idLo && !location.id)) {
    console.error('❌ ERREUR CRITIQUE: Location invalide:', location);
    alert('Erreur: Données de location invalides');
    return;
  }
  
  const locationAvecId = {
    ...location,
    idLo: location.idLo || location.id
  };
  
  selectedLocationForAction.value = locationAvecId;
  showEtatLieuxDepartModal.value = true;
};

const ouvrirRetourMateriel = (location) => {
  if (!location || (!location.idLo && !location.id)) {
    console.error('❌ ERREUR CRITIQUE: Location invalide:', location);
    alert('Erreur: Données de location invalides');
    return;
  }
  
  const locationAvecId = {
    ...location,
    idLo: location.idLo || location.id
  };
  
  selectedLocationForAction.value = locationAvecId;
  showRetourModal.value = true;
};

const handleEtatLieuxDepartSuccess = async (result) => {
  console.log('✅ État des lieux départ validé:', result);
  
  const eventIndex = allEvents.value.findIndex(
    event => event.idLo === result.locationId
  );
  
  if (eventIndex !== -1) {
    allEvents.value[eventIndex].etatLo = 'En cours';
  }
  
  showEtatLieuxDepartModal.value = false;
  alert('État des lieux départ enregistré avec succès ! La location est maintenant "En cours".');
};

const handleRetourSuccess = async (retourData) => {
  console.log('✅ Retour validé - Mise à jour locale seulement');
  
  const eventIndex = allEvents.value.findIndex(
    event => event.idLo === retourData.locationId
  );
  
  if (eventIndex !== -1) {
    allEvents.value[eventIndex].etatLo = 'Terminée';
    console.log('📍 État mis à jour localement: Terminée');
  }
  
  showRetourModal.value = false;
  
  alert(`✅ Retour de matériel validé avec succès !\n\n• Location #${retourData.locationId} : "Terminée"\n• Stock matériel mis à jour\n• État des lieux enregistré\n\nLa synchronisation avec le calendrier est complète.`);
};

// Navigation
const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// Cycle de vie
onMounted(() => {
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
  }
  
  console.log('📅 Calendrier monté, chargement des événements...');
  fetchAllEvents();
});
</script>

<style scoped>
.full-height-container {
  height: 100vh;
}

/* Sidebar en bleu nuit */
.custom-sidebar {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  background: transparent;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.sidebar-title {
  color: white !important;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Styles pour le menu */
:deep(.custom-menu) {
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
  color: white !important;
  transition: all 0.3s ease;
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
  color: white !important;
  font-weight: 600;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

/* Header amélioré */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
  font-size: 1.5rem;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.custom-tag {
  font-weight: 600;
}

/* Contenu principal */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.bg-light {
  background-color: #f8f9fa !important;
  flex: 1;
  overflow-y: auto;
}

/* NOUVEAUX STYLES POUR LES BOUTONS */
.custom-btn-info {
  background: #17a2b8;
  border-color: #17a2b8;
  color: white;
}

.custom-btn-info:hover {
  background: #138496;
  border-color: #138496;
  color: white;
}

/* Styles pour la barre de recherche */
.search-container {
  position: relative;
}

.search-container .n-input__input {
  padding-left: 35px;
}

.search-container i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
}

.date-search-container {
  min-width: 300px;
}

.card-header-info {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

/* Responsive pour la barre de recherche */
@media (max-width: 1200px) {
  .date-search-container {
    min-width: 280px;
  }
}

@media (max-width: 992px) {
  :deep(.n-card__header-extra) .d-flex {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .search-container,
  .date-search-container,
  .date-search-container .d-flex {
    width: 100%;
  }
  
  .search-container .n-input {
    width: 100% !important;
  }
  
  .date-search-container .n-select,
  .date-search-container .n-date-picker {
    width: 100% !important;
  }
}

@media (max-width: 768px) {
  .date-search-container {
    flex-direction: column;
    min-width: unset;
  }
}

/* Styles pour les nouveaux modals */
.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* Tab content */
.tab-content {
  padding: 10px;
}

/* Badges */
:deep(.n-badge) {
  margin-left: 8px;
}

/* Vos styles d'en-tête existants */
.custom-divider {
  border-color: #007bff;
  opacity: 0.3;
}

/* Conteneur principal avec scroll */
.content-wrapper {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

.content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Tableau avec scroll horizontal et vertical */
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #c1c1c1;
}

/* Cartes KPI avec vos couleurs originales */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.custom-card-warning {
  background: linear-gradient(135deg, #0405BF 0%, #0405BF 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.custom-card-danger {
  background: linear-gradient(135deg, #5E5E5E 0%, #5E5E5E 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.custom-card {
  border: none;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}

/* Icônes KPI */
.custom-icon-primary, 
.custom-icon-warning,
.custom-icon-danger {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

/* Boutons avec vos couleurs */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.custom-btn-warning {
  background: #0405BF;
  border-color: #0405BF;
  color: white;
}

.custom-btn-warning:hover {
  background: #0304a3;
  border-color: #0304a3;
  color: white;
}

.custom-btn-danger {
  background: #5E5E5E;
  border-color: #5E5E5E;
  color: white;
}

.custom-btn-danger:hover {
  background: #4a4a4a;
  border-color: #4a4a4a;
  color: white;
}

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #02061E;
  position: sticky;
  top: 0;
  z-index: 1;
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Cellule de désignation */
.designation-cell {
  font-size: 0.85rem;
  color: #555;
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.designation-cell:hover {
  color: #007bff;
  cursor: default;
}

/* Styles pour le modal KPI avec tableau */
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 15px;
}

.kpi-icon.confirmes {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.kpi-icon.en_cours {
  background: linear-gradient(135deg, #0405BF 0%, #0304a3 100%);
  color: white;
}

.kpi-icon.termines {
  background: linear-gradient(135deg, #5E5E5E 0%, #4a4a4a 100%);
  color: white;
}

.kpi-modal-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.kpi-modal-content::-webkit-scrollbar {
  width: 8px;
}

.kpi-modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.kpi-modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

/* Conteneur du tableau KPI */
.kpi-table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.kpi-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.kpi-table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.kpi-table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

/* Effet de survol pour les cartes KPI */
.custom-card-primary:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2);
}

.custom-card-warning:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(4, 5, 191, 0.2);
}

.custom-card-danger:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(94, 94, 94, 0.2);
}

/* NOUVEAUX STYLES POUR LE CALENDRIER */
.calendar-container {
  padding: 10px;
}

.calendar-legend {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
}

.legend-text {
  font-size: 0.9rem;
  color: #555;
}

.calendar-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

/* Calendrier simplifié */
.simple-calendar {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.calendar-month {
  margin: 0;
  font-weight: 600;
  color: #02061E;
}

.calendar-nav-btn {
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-nav-btn:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.calendar-grid {
  padding: 10px;
}

.calendar-week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 10px;
}

.calendar-day-header {
  text-align: center;
  font-weight: 600;
  color: #02061E;
  padding: 8px 0;
  font-size: 0.9rem;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}

.calendar-day {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 8px;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
}

.calendar-day:hover {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.calendar-day.today {
  background-color: rgba(0, 123, 255, 0.1);
  border-color: #007bff;
}

.calendar-day.other-month {
  background-color: #f8f9fa;
  color: #adb5bd;
}

.calendar-day.has-events {
  border-color: #0405BF;
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
  color: #02061E;
}

.day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.event-more {
  font-size: 0.7rem;
  color: #6c757d;
  margin-left: 2px;
}

/* Événements du mois */
.month-events {
  margin-top: 20px;
}

.event-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

/* Styles pour le modal d'annulation */
.cancel-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.cancel-form::-webkit-scrollbar {
  width: 8px;
}

.cancel-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.cancel-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.location-details p {
  margin-bottom: 5px;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-warning,
  .custom-icon-danger {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .content-wrapper {
    max-height: none;
    overflow-y: visible;
  }
  
  .table-container {
    max-height: 400px;
  }
  
  .kpi-modal-content {
    max-height: 50vh;
  }
  
  .kpi-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    margin-right: 10px;
  }
  
  /* Responsive pour les nouveaux boutons */
  .row.mb-4 .col-md-6 {
    margin-bottom: 10px;
  }
  
  /* Responsive pour le calendrier */
  .calendar-day {
    min-height: 60px;
    padding: 4px;
  }
  
  .day-number {
    font-size: 0.8rem;
  }
  
  .event-dot {
    width: 6px;
    height: 6px;
  }
  
  .calendar-month {
    font-size: 1.1rem;
  }
  
  /* Responsive pour les modals */
  .modal-icon {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    margin-right: 10px;
  }
  
  /* Responsive pour la colonne désignation */
  .designation-cell {
    font-size: 0.8rem;
    max-width: 120px;
  }
}

/* Styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
}

/* État de chargement */
:deep(.n-spin) {
  color: #007bff;
}

:deep(.n-spin .n-spin-description) {
  color: #55555E;
  margin-top: 10px;
}

/* États d'erreur */
:deep(.n-alert) {
  border-radius: 8px;
}

/* Scrollbars personnalisées */
.bg-light::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Styles pour le badge dans le menu */
:deep(.custom-menu .n-menu-item .n-menu-item-content .custom-tag) {
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  min-width: 16px;
}
</style>