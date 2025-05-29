<template>
  <div class="home">
    <div class="welcome-section">
      <h2>欢迎来到快乐学习乐园！</h2>
      <p>让我们一起开始有趣的学习之旅吧！</p>
    </div>
    
    <div class="modules-grid">
      <router-link to="/numbers" class="module-card">
        <div class="card-content">
          <h3>数字学习</h3>
          <p>认识数字，学习数数</p>
        </div>
      </router-link>
      
      <router-link to="/letters" class="module-card">
        <div class="card-content">
          <h3>字母学习</h3>
          <p>认识字母，学习发音</p>
        </div>
      </router-link>
      
      <router-link to="/colors" class="module-card">
        <div class="card-content">
          <h3>颜色认知</h3>
          <p>认识各种颜色</p>
        </div>
      </router-link>
      
      <router-link to="/games" class="module-card">
        <div class="card-content">
          <h3>趣味游戏</h3>
          <p>有趣的互动游戏</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.home {
  text-align: center;
}

.welcome-section {
  margin-bottom: 3rem;
}

.welcome-section h2 {
  color: #ff6b6b;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.welcome-section p {
  color: #666;
  font-size: 1.2rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.module-card {
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.card-content h3 {
  color: #4a90e2;
  margin-bottom: 0.5rem;
}

.card-content p {
  color: #666;
}

/* 为每个卡片设置不同的背景色 */
.module-card:nth-child(1) {
  background-color: #ffebee;
}

.module-card:nth-child(2) {
  background-color: #e8f5e9;
}

.module-card:nth-child(3) {
  background-color: #e3f2fd;
}

.module-card:nth-child(4) {
  background-color: #fff3e0;
}
</style> 