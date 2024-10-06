<template>
    <div class="flex flex-col h-full">
        <div class="flex justify-end p-2">
            <button @click="saveFile" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
        <div class="flex flex-1">
            <div class="w-1/2 p-4">
                <textarea v-model="content" @input="handleInput" class="w-full h-full p-2 border rounded"
                    placeholder="Enter your Markdown here..."></textarea>
            </div>
            <div class="w-1/2 p-4">
                <div v-html="renderedContent" class="markdown-body"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps<{
    file: { path: string; name: string; content: string; isModified: boolean };
}>();

const emit = defineEmits<{
    (e: 'content-changed', content: string): void;
    (e: 'save'): void;
}>();

const content = ref(props.file.content);

watch(() => props.file, (newFile) => {
    content.value = newFile.content;
}, { deep: true });

const handleInput = () => {
    emit('content-changed', content.value);
};

const saveFile = () => {
    emit('save');
};

const renderedContent = computed(() => {
    marked.setOptions({
        highlight: (code: string, lang: string) => {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    });
    return marked.parse(content.value);
});
</script>

<style>
@import 'highlight.js/styles/github.css';

.markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
}

.markdown-body h1 {
    font-size: 2em;
}

.markdown-body h2 {
    font-size: 1.5em;
}

.markdown-body h3 {
    font-size: 1.25em;
}

.markdown-body h4 {
    font-size: 1em;
}

.markdown-body h5 {
    font-size: 0.875em;
}

.markdown-body h6 {
    font-size: 0.85em;
}

.markdown-body pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
}
</style>