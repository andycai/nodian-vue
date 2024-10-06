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
import { onMounted, watch, provide } from 'vue';
import { useStorage } from '@vueuse/core';

const menuItems = [
  { icon: 'fas fa-file-alt', route: '/' },
  // Add more menu items for other features later
];

const isDarkMode = useStorage('darkMode', false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

const applyDarkMode = (value: boolean) => {
  if (value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

watch(isDarkMode, (newValue) => {
  applyDarkMode(newValue);
});

onMounted(() => {
  console.log('App component mounted');
  applyDarkMode(isDarkMode.value);
});

// Provide isDarkMode to all child components
provide('isDarkMode', isDarkMode);
</script>

<style>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 暗色模式下的滚动条样式 */
.dark ::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
