<template>
  <div :class="{ 'dark': isDarkMode }" class="h-screen">
    <div class="flex h-full bg-white dark:bg-gray-900 text-black dark:text-white">
      <nav class="w-16 bg-gray-200 dark:bg-gray-800">
        <ul class="flex flex-col items-center py-4">
          <li v-for="item in menuItems" :key="item.icon" class="mb-4">
            <router-link :to="item.route"
              class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i :class="item.icon" class="text-2xl"></i>
            </router-link>
          </li>
        </ul>
        <button @click="toggleDarkMode" class="w-full text-center py-2">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'" class="text-2xl"></i>
        </button>
      </nav>
      <main class="flex-1 overflow-hidden">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStorage } from '@vueuse/core';

const menuItems = [
  { icon: 'fas fa-file-alt', route: '/' },
  // Add more menu items for other features later
];

const isDarkMode = useStorage('darkMode', false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

onMounted(() => {
  console.log('App component mounted');
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  }
});
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
</style>
