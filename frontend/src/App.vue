<script setup>
import NavBar from '@/components/common/NavBar.vue'
import Footer from '@/components/common/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <NavBar />
    <main class="flex-1 max-w-7xl w-full mx-auto">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>
