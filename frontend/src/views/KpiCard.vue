<template>
    <div class="card p-3 shadow-sm kpi-widget h-100" :style="borderStyle">
        <div class="d-flex align-items-start">
            <div class="icon-container me-3">
                <i :class="['bi', icon, 'h3 mb-0', props.color]"></i>
            </div>
            
            <div>
                <h5 class="card-title text-muted mb-1">{{ title }}</h5>
                <p class="h3 fw-bold mb-1">{{ value }}</p>
                
                <small v-if="trend" :class="['trend-text', trendColorClass]">
                    {{ trend }}
                </small>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    trend: {
        type: String,
        default: ''
    },
    /** Peut être une classe Bootstrap (text-success) ou une classe personnalisée (cedii-text-primary) */
    color: {
        type: String,
        default: 'text-primary' 
    }
});

/**
 * Détermine la couleur de la bordure gauche pour le style en ligne.
 */
const borderStyle = computed(() => {
    // Si la classe est une classe Bootstrap standard (success, info, warning, danger), on utilise la variable CSS
    if (props.color.includes('text-success')) return 'border-left-color: var(--bs-success, #198754);';
    if (props.color.includes('text-info')) return 'border-left-color: var(--bs-info, #0dcaf0);';
    if (props.color.includes('text-warning')) return 'border-left-color: var(--bs-warning, #ffc107);';
    if (props.color.includes('text-danger')) return 'border-left-color: var(--bs-danger, #dc3545);';
    
    // Si c'est la classe personnalisée 'cedii-text-primary' ou 'text-primary' par défaut
    // Utilise une variable CSS personnalisée pour la couleur principale CEDII
    return 'border-left-color: var(--cedii-primary-light, #5B11EE);';
});


/**
 * Détermine la couleur du texte de tendance (similaire à l'ancien code)
 */
const trendColorClass = computed(() => {
    if (props.trend.includes('+') || props.trend.includes('réussite')) {
        return 'text-success';
    }
    if (props.trend.includes('-') || props.trend.includes('retard')) {
        return 'text-danger';
    }
    return 'text-muted';
});
</script>

<style scoped>
/* Style général du widget */
.kpi-widget {
    border-left: 5px solid; /* La couleur est définie par le style en ligne (borderStyle) */
    transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-widget:hover {
    transform: translateY(-3px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

/* Vous devez vous assurer que cette variable est définie dans votre CSS global ou dans votre fichier Home.vue */
.cedii-text-primary {
    color: var(--cedii-primary-light, #5B11EE) !important;
}

.icon-container {
    padding-top: 5px;
}

.trend-text {
    font-weight: 500;
}
</style>