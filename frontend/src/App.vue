<script setup>
//import HelloWorld from './components/HelloWorld.vue'


</script>


<!--<router-view>
  <HelloWorld msg="Vite + Vue" />
</router-view>
  -->
<template>
  <router-view /> 
</template>


 


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
router-view {
  width: 100%;
  height: 100%;
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

</style>
