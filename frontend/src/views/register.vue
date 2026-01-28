

<template>
  <div class="register-wrapper d-flex justify-content-center align-items-center">
    <n-card class="register-card shadow-lg" :bordered="false">
      <template #header>
        <div class="text-center">
          <n-h2 class="cedii-text-dark mb-2">Créer un Compte CEDII</n-h2>
          <n-text class="text-muted">Inscription Utilisateur</n-text>
        </div>
      </template>

      <n-form @submit.prevent="handleRegister" :model="formData" :rules="rules" ref="formRef">
        <n-grid :cols="1" :x-gap="24" :y-gap="16">
          <n-gi>
            <n-form-item label="Identifiant (Login)" path="loginUti" label-placement="left">
              <n-input
                v-model:value="formData.loginUti"
                placeholder="Entrez votre identifiant"
                size="large"
                :disabled="isLoading"
              />
            </n-form-item>
          </n-gi>

          <n-gi>
            <n-form-item label="Mot de passe" path="motDePasseUti" label-placement="left">
              <n-input
                type="password"
                v-model:value="formData.motDePasseUti"
                placeholder="Entrez votre mot de passe"
                size="large"
                :disabled="isLoading"
                show-password-on="click"
              />
            </n-form-item>
          </n-gi>

          <n-gi>
            <n-form-item label="Rôle" path="roleUti" label-placement="left">
              
              <template v-if="isReceptionSource">
                <n-input
                  :value="'Client'"
                  size="large"
                  disabled
                  placeholder="Rôle Client Forcé"
                />
                <input type="hidden" v-model="formData.roleUti">
              </template>
              
              <template v-else>
                <n-select
                  v-model:value="formData.roleUti"
                  :options="roleOptions"
                  size="large"
                  :disabled="isLoading"
                />
              </template>

            </n-form-item>
          </n-gi>
        </n-grid>

        <n-alert 
          v-if="message" 
          :type="isSuccess ? 'success' : 'error'" 
          class="mb-3"
          :show-icon="true"
        >
          {{ message }}
        </n-alert>
        
        <n-button 
          type="primary" 
          attr-type="submit" 
          size="large" 
          :loading="isLoading"
          class="w-100 cedii-btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Enregistrement...' : 'Créer le Compte' }}
        </n-button>
      </n-form>

      <template #footer>
        <div class="text-center">
          <router-link to="/" class="cedii-text-action text-decoration-none">
            <n-button text type="primary" size="small">
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
                </n-icon>
              </template>
              Retour à la connexion
            </n-button>
          </router-link>
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  NCard, 
  NH2, 
  NText, 
  NForm, 
  NFormItem, 
  NInput, 
  NSelect, 
  NButton, 
  NAlert, 
  NIcon,
  NGrid,
  NGi
} from 'naive-ui';
import AuthService from '../services/AuthService'; 

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const message = ref('');
const isSuccess = ref(false);
const formRef = ref(null);
const isReceptionSource = ref(false);

const formData = reactive({
  loginUti: '',
  motDePasseUti: '',
  roleUti: 'client'
});

const roleOptions = [
  {
    label: 'Client',
    value: 'client'
  },
  {
    label: 'Administrateur',
    value: 'admin'
  },
  {
    label: 'Réceptionniste',
    value: 'reception'
  },
  {
    label: 'Financière',
    value: 'finance'
  }
];

onMounted(() => {
  if (route.query.source === 'reception') {
    isReceptionSource.value = true;
    formData.roleUti = 'client';
  }
});

const rules = {
  loginUti: [
    {
      required: true,
      message: 'L\'identifiant est requis',
      trigger: ['input', 'blur']
    },
    {
      min: 3,
      message: 'L\'identifiant doit contenir au moins 3 caractères',
      trigger: ['input', 'blur']
    }
  ],
  motDePasseUti: [
    {
      required: true,
      message: 'Le mot de passe est requis',
      trigger: ['input', 'blur']
    },
    {
      min: 6,
      message: 'Le mot de passe doit contenir au moins 6 caractères',
      trigger: ['input', 'blur']
    }
  ],
  roleUti: [
    {
      required: true,
      message: 'Le rôle est requis',
      trigger: ['change', 'blur']
    }
  ]
};

async function handleRegister() {
  message.value = '';
  
  try {
    await formRef.value?.validate();
    
    isLoading.value = true;
    isSuccess.value = false;

    console.log('Envoi des données:', formData);
    
    try {
      const response = await AuthService.register(formData);
      
      isSuccess.value = true;
      message.value = response.data?.message || "Compte créé avec succès ! Vous pouvez maintenant vous connecter.";
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (apiError) {
      console.error('Erreur API:', apiError);
      
      if (apiError.response) {
        const errorMessage = apiError.response.data?.message || 
                            apiError.response.data?.error ||
                            "Erreur lors de l'inscription.";
        
        isSuccess.value = false;
        message.value = `Erreur ${apiError.response.status}: ${errorMessage}`;
        
        if (apiError.response.status === 400 && apiError.response.data?.errors) {
          const errors = apiError.response.data.errors;
          message.value = `Erreurs de validation: ${Object.values(errors).join(', ')}`;
        }
      } else if (apiError.request) {
        message.value = "Erreur réseau. Vérifiez votre connexion.";
      } else {
        message.value = "Erreur de configuration. Contactez l'administrateur.";
      }
    }
    
  } catch (validationError) {
    console.log('Erreurs de validation frontend:', validationError);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.register-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #02061E 0%, #04058F 100%);
  padding: 20px;
}

.register-card {
  max-width: 500px;
  width: 100%;
  border-radius: 12px;
  background: white;
}

:deep(.n-form-item .n-form-item-label) {
  text-align: left;
  font-weight: 500;
  color: var(--cedii-dark, #02061E);
  min-width: 140px;
  margin-right: 16px;
}

:deep(.n-form-item .n-form-item-blank) {
  flex: 1;
}

.cedii-text-dark {
  color: var(--cedii-dark, #02061E) !important;
}

.cedii-btn-primary {
  background-color: var(--cedii-primary-light, #5B11EE) !important;
  border-color: var(--cedii-primary-light, #5B11EE) !important;
  color: white !important;
}

.cedii-btn-primary:hover {
  background-color: var(--cedii-primary-dark, #0405BF) !important;
  border-color: var(--cedii-primary-dark, #0405BF) !important;
}

.cedii-text-action {
  color: var(--cedii-action, #0671B6) !important;
}

@media (max-width: 768px) {
  .register-wrapper {
    padding: 16px;
  }
  
  :deep(.n-form-item .n-form-item-label) {
    min-width: 120px;
    margin-right: 12px;
  }
}

@media (max-width: 576px) {
  :deep(.n-form-item) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  :deep(.n-form-item .n-form-item-label) {
    min-width: auto;
    margin-right: 0;
    margin-bottom: 8px;
    text-align: left;
    width: 100%;
  }
  
  :deep(.n-form-item .n-form-item-blank) {
    width: 100%;
  }
}
</style>