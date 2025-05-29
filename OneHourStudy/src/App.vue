<template>
  <div class="app">
    <header class="header">
      <h1>快乐学习乐园</h1>
      <nav class="nav">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/chinese" class="nav-item">识字</router-link>
        <router-link to="/math" class="nav-item">算术</router-link>
        <router-link to="/english" class="nav-item">英语</router-link>
        <router-link to="/games" class="nav-item">游戏</router-link>
        <router-link to="/check-in" class="nav-item">打卡</router-link>
      </nav>
    </header>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--primary-color);
  padding: 1rem 2rem;
  box-shadow: var(--box-shadow);
}

.header h1 {
  color: white;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 2rem;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-item.router-link-active {
  background-color: var(--accent-color);
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .nav {
    flex-direction: column;
    align-items: center;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }
}
</style> 