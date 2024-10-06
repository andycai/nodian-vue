import { createRouter, createWebHistory } from 'vue-router'
import MarkdownNote from '../components/MarkdownNote.vue'

const routes = [
  { path: '/', component: MarkdownNote },
  // 其他路由将在后续添加
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router