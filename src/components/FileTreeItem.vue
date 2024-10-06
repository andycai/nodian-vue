<template>
    <li>
        <div @click="toggleFolder"
            class="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded">
            <i :class="item.isDirectory ? 'fas fa-folder text-yellow-500' : 'fas fa-file text-blue-500'"
                class="mr-2"></i>
            {{ item.name }}
        </div>
        <ul v-if="item.isDirectory && item.isOpen" class="ml-4">
            <FileTreeItem v-for="child in item.children" :key="child.path" :item="child" :root="root"
                @file-selected="$emit('file-selected', $event)" />
        </ul>
    </li>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface TreeItem {
    name: string;
    path: string;
    isDirectory: boolean;
    isOpen: boolean;
    children?: TreeItem[];
}

const props = defineProps<{
    item: TreeItem;
    root: string;
}>();

const emit = defineEmits<{
    (e: 'file-selected', path: string): void;
}>();

const toggleFolder = () => {
    if (props.item.isDirectory) {
        props.item.isOpen = !props.item.isOpen;
    } else {
        emit('file-selected', props.item.path);
    }
};
</script>