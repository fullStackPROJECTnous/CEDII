
<template>
  <div class="redirector-container">
    <div class="text-center py-5">
      <n-spin size="large" v-if="loading" />
      <div v-else>
        <h3 class="mb-4">Redirection en cours...</h3>
        <p>Vous serez redirigé vers votre tableau de bord.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { NSpin } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)

onMounted(() => {
  // Simuler un délai pour la redirection
  setTimeout(() => {
    redirectToDashboard()
  }, 1000)
})

const redirectToDashboard = () => {
  const role = authStore.userRole
  
  if (!role) {
    router.push({ name: 'LoginWithRegister' })
    return
  }
  
  switch (role) {
    case 'admin':
      router.push({ name: 'AdminDashboard' })
      break
    case 'reception':
      router.push({ name: 'ReceptionDashboard' })
      break
    case 'finance':
      router.push({ name: 'FinanceDashboard' })
      break
    case 'client':
      router.push({ name: 'ClientDashboard' })
      break
    default:
      router.push({ name: 'LoginWithRegister' })
  }
  
  loading.value = false
}
</script>

<style scoped>
.redirector-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
</style>