<script setup>
import { ref } from 'vue'
import HanziLearning from './components/HanziLearning.vue'

const currentModule = ref('hanzi')

const modules = [
  { id: 'hanzi', name: '识汉字', icon: '🏮' },
  { id: 'math', name: '数学题', icon: '🧮' },
  { id: 'english', name: '学英语', icon: '🅰️' }
]
</script>

<template>
  <div class="app-container">
    <header>
      <h1 class="title">🌈 幼儿园快乐学习</h1>
      <nav class="nav-menu">
        <button 
          v-for="mod in modules" 
          :key="mod.id"
          class="nav-item"
          :class="{ active: currentModule === mod.id }"
          @click="currentModule = mod.id"
        >
          <span class="nav-icon">{{ mod.icon }}</span>
          <span class="nav-name">{{ mod.name }}</span>
        </button>
      </nav>
    </header>

    <main class="content-area">
      <transition name="fade-slide" mode="out-in">
        <div :key="currentModule" class="module-wrapper">
          <HanziLearning v-if="currentModule === 'hanzi'" />
          <div v-else-if="currentModule === 'math'" class="placeholder-card glass-card">
            <h2>🧮 数学模块正在建设中...</h2>
            <p>很快就能和大家见面啦！</p>
          </div>
          <div v-else-if="currentModule === 'english'" class="placeholder-card glass-card">
            <h2>🅰️ 英语模块正在建设中...</h2>
            <p>敬请期待！</p>
          </div>
        </div>
      </transition>
    </main>

    <footer>
      <p>© 2026 幼儿园学习助手 - 陪伴宝宝成长</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  gap: 2rem;
}

header {
  margin-top: 2rem;
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  background: transparent;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  color: #666;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}

.nav-icon {
  font-size: 1.8rem;
}

.nav-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.content-area {
  flex: 1;
  display: flex;
  justify-content: center;
  width: 100%;
}

.module-wrapper {
  width: 100%;
}

.placeholder-card {
  padding: 4rem 2rem;
  color: #666;
}

footer {
  margin-top: auto;
  padding: 2rem;
  color: white;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 600px) {
  .nav-menu {
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .nav-item {
    padding: 0.5rem 1rem;
  }
}
</style>
