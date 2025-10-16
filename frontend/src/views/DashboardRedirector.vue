<template>
  <div class="flex justify-center items-center h-screen">
    <p>Chargement de votre tableau de bord...</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/AuthService'; // Ajustez le chemin

const router = useRouter();

onMounted(() => {
  const user = AuthService.getCurrentUser();
  const role = user ? user.role : null; // Lisez le rôle

  if (!user || !role) {
    // Si la lecture échoue quand même (ce qui ne devrait pas arriver ici), renvoyer au login
    router.push({ name: 'Login' });
    return;
  }

  // Redirection finale basée sur le rôle
  switch (role) {
    case 'admin':
      router.push({ name: 'AdminDashboard' });
      break;
    case 'reception':
      router.push({ name: 'ReceptionDashboard' });
      break;
    case 'finance':
      router.push({ name: 'FinanceDashboard' });
      break;
    case 'client':
    default:
      router.push({ name: 'ClientDashboard' });
      break;
  }
});
</script>