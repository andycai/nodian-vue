<template>
    <div class="p-4 bg-white dark:bg-gray-900 text-black dark:text-white">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Files</h2>
            <button @click="createNewFile"
                class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">New
                File</button>
        </div>
        <ul v-if="treeItems.length">
            <FileTreeItem v-for="item in sortedTreeItems" :key="item.path" :item="item" :root="root"
                @file-selected="$emit('file-selected', $event)" />
        </ul>
        <div v-else>No files found.</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { readDir, writeTextFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';
import FileTreeItem from './FileTreeItem.vue';

const props = defineProps<{
    root: string;
}>();

const emit = defineEmits<{
    (e: 'file-selected', path: string): void;
}>();

interface TreeItem {
    name: string;
    path: string;
    isDirectory: boolean;
    isOpen: boolean;
    children?: TreeItem[];
}

const treeItems = ref<TreeItem[]>([]);

const sortTreeItems = (items: TreeItem[]): TreeItem[] => {
    return items.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
    }).map(item => {
        if (item.children) {
            item.children = sortTreeItems(item.children);
        }
        return item;
    });
};

const sortedTreeItems = computed(() => sortTreeItems(treeItems.value));

const loadTreeItems = async (dir: string): Promise<TreeItem[]> => {
    try {
        const fullPath = await join(props.root, dir);
        const entries = await readDir(fullPath, { recursive: false });
        const items: TreeItem[] = [];

        for (const entry of entries) {
            const item: TreeItem = {
                name: entry.name ?? '',
                path: entry.name ?? '',
                isDirectory: entry.isDirectory,
                isOpen: false
            };

            const subPath = await join(dir, item.path);
            if (item.isDirectory) {
                item.children = await loadTreeItems(subPath);
            }
            item.path = subPath;

            items.push(item);
        }

        return sortTreeItems(items);
    } catch (error) {
        console.error('Error loading tree items:', error);
        return [];
    }
};

onMounted(async () => {
    console.log('FileTree component mounted');
    if (props.root) {
        treeItems.value = await loadTreeItems("");
    }
});

watch(() => props.root, async (newRoot) => {
    console.log('Root changed to:', newRoot);
    if (newRoot) {
        treeItems.value = await loadTreeItems("");
    }
});

const createNewFile = async () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
        try {
            const filePath = await join(props.root, fileName);
            await writeTextFile(filePath, '');
            console.log('Created new file:', filePath);
            treeItems.value = await loadTreeItems("");
            emit('file-selected', filePath);
        } catch (error) {
            console.error('Error creating new file:', error);
        }
    }
};
</script>