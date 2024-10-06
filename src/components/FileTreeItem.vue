<template>
    <li>
        <div @click="toggleFolder"
            class="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded">
            <component :is="getIcon" class="w-5 h-5 mr-2" :class="getIconColor" />
            {{ item.name }}
        </div>
        <ul v-if="item.isDirectory && item.isOpen" class="ml-4">
            <FileTreeItem v-for="child in item.children" :key="child.path" :item="child" :root="root"
                @file-selected="$emit('file-selected', $event)" />
        </ul>
    </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FolderIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';

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

const getIcon = computed(() => {
    if (props.item.isDirectory) {
        return FolderIcon;
    } else if (props.item.name.endsWith('.md')) {
        return DocumentTextIcon;
    } else {
        return DocumentIcon;
    }
});

const getIconColor = computed(() => {
    if (props.item.isDirectory) {
        return 'text-yellow-500';
    } else if (props.item.name.endsWith('.md')) {
        return 'text-blue-500';
    } else {
        return 'text-gray-500';
    }
});
</script>