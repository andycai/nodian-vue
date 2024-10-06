<template>
    <div class="flex h-full">
        <div class="w-1/4 border-r">
            <FileTree :root="rootDir" @file-selected="openFile" />
        </div>
        <div class="w-3/4 flex flex-col">
            <div class="flex border-b">
                <div v-for="file in openFiles" :key="file.path" class="px-4 py-2 cursor-pointer"
                    :class="{ 'bg-gray-200': file.path === currentFile?.path }" @click="switchFile(file)">
                    {{ file.name }}
                    <span v-if="file.isModified">*</span>
                </div>
            </div>
            <MarkdownEditor v-if="currentFile" :file="currentFile" @content-changed="handleContentChange"
                @save="saveFile" />
            <div v-else class="p-4">
                No file selected. Please select a file from the tree or create a new one.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FileTree from './FileTree.vue';
import MarkdownEditor from './MarkdownEditor.vue';
import { readTextFile, mkdir, exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { appDataDir, join, basename, homeDir } from '@tauri-apps/api/path';

const rootDir = ref('');
const openFiles = ref<Array<{ path: string; name: string; content: string; isModified: boolean }>>([]);
const currentFile = ref<{ path: string; name: string; content: string; isModified: boolean } | null>(null);

onMounted(async () => {
    console.log('MarkdownNote component mounted');
    try {
        const homeDirPath = await homeDir();
        rootDir.value = await join(homeDirPath, 'nodian');
        console.log('Root directory:', rootDir.value);
        if (!await exists(rootDir.value)) {
            await mkdir(rootDir.value);
            console.log('Created nodian directory');
        }
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
});

const openFile = async (filePath: string) => {
    try {
        const fullPath = await join(rootDir.value, filePath);
        // console.error("file path:", fullPath);
        const content = await readTextFile(fullPath);
        const name = await basename(filePath);
        const file = { path: filePath, name, content, isModified: false };
        const existingFileIndex = openFiles.value.findIndex(f => f.path === filePath);
        if (existingFileIndex !== -1) {
            openFiles.value[existingFileIndex] = file;
        } else {
            openFiles.value.push(file);
        }
        currentFile.value = file;
        // console.log('Opened file:', file);
    } catch (error) {
        console.error('Error opening file:', error);
    }
};

const switchFile = (file: { path: string; name: string; content: string; isModified: boolean }) => {
    currentFile.value = file;
};

const handleContentChange = (content: string) => {
    if (currentFile.value) {
        currentFile.value.content = content;
        currentFile.value.isModified = true;
    }
};

const saveFile = async () => {
    if (currentFile.value) {
        try {
            await writeTextFile(currentFile.value.path, currentFile.value.content);
            currentFile.value.isModified = false;
            console.log('File saved:', currentFile.value.path);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }
};
</script>