<template>
  <div class="flex h-screen">
    <nav class="w-16 bg-gray-800">
      <ul class="flex flex-col items-center py-4">
        <li v-for="item in menuItems" :key="item.icon" class="mb-4">
          <router-link :to="item.route" class="text-white hover:text-gray-300">
            <i :class="item.icon" class="text-2xl"></i>
          </router-link>
        </li>
      </ul>
    </nav>
    <main class="flex-1 overflow-hidden">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const menuItems = [
  { icon: 'fas fa-file-alt', route: '/' },
  // Add more menu items for other features later
];

onMounted(() => {
  console.log('App component mounted');
});
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
</style>
