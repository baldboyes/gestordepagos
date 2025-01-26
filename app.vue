<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
  .page-enter-active,.page-leave-active {
    transition: all 0.4s;
  }
  .page-enter-from,.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
  }
</style>

<script setup>
// App.vue now serves as the entry point using the default layout
</script>
