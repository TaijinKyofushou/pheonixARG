<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  /** 为 null 时不显示底部禁用输入条 */
  composerHint?: string | null
}>()
</script>

<template>
  <div class="im">
    <div class="im-bg" aria-hidden="true" />
    <div class="im-card">
      <header class="im-top">
        <div class="im-brand">
          <h1 class="im-title">{{ title }}</h1>
          <p v-if="subtitle" class="im-sub">{{ subtitle }}</p>
        </div>
        <div class="im-search">
          <slot name="search" />
        </div>
        <div class="im-actions">
          <slot name="actions" />
        </div>
      </header>

      <div class="im-body">
        <aside class="im-sidebar">
          <slot name="sidebar" />
        </aside>
        <main class="im-main">
          <div class="im-chatbar">
            <span class="im-to"><slot name="pane-head">对话</slot></span>
          </div>
          <slot name="banner" />
          <div class="im-feed">
            <slot />
          </div>
          <div
            v-if="composerHint != null"
            class="im-disabled-input"
            aria-disabled="true"
          >
            <span class="im-attach" aria-hidden="true">📎</span>
            <span class="im-ph">{{ composerHint }}</span>
            <span class="im-icons" aria-hidden="true">😊 ✈</span>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.im {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.5rem;
  box-sizing: border-box;
}
.im-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 130% 85% at 50% -10%, rgba(125, 211, 252, 0.55), transparent 52%),
    linear-gradient(168deg, #dbeafe 0%, #e0f2fe 42%, #f0f9ff 100%);
}
.im-card {
  position: relative;
  z-index: 1;
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  color: #1a1d24;
  border-radius: 12px;
  border: 1px solid rgba(125, 211, 252, 0.35);
  box-shadow:
    0 20px 50px rgba(14, 116, 144, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset;
  overflow: hidden;
}
.im-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #e0f2fe;
  background: linear-gradient(180deg, #f8fbff 0%, #f0f9ff 100%);
}
.im-brand {
  flex: 1;
  min-width: 140px;
}
.im-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0c4a6e;
}
.im-sub {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  color: #64748b;
}
.im-search {
  flex: 1 1 220px;
  min-width: 200px;
  max-width: 360px;
  margin-left: auto;
}
.im-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.im-body {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: minmax(0, 1fr);
  height: 500px;
  overflow: hidden;
}
.im-sidebar {
  border-right: 1px solid #e0f2fe;
  background: linear-gradient(180deg, #f8fbff 0%, #f0f9ff 100%);
  overflow: auto;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.im-sidebar::-webkit-scrollbar {
  display: none;
}
.im-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: #fff;
}
.im-chatbar {
  padding: 0.65rem 1rem;
  border-bottom: 1px solid #e0f2fe;
  background: linear-gradient(180deg, #f8fbff 0%, #f7fafe 100%);
}
.im-to {
  font-size: 0.88rem;
  font-weight: 600;
  color: #0c4a6e;
}
.im-disabled-input {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.55rem 1rem 0.65rem;
  border-radius: 0;
  border: none;
  border-top: 1px solid #e0f2fe;
  background: linear-gradient(180deg, #f8fbff 0%, #f0f9ff 100%);
  color: #94a3b8;
  font-size: 0.88rem;
}
.im-ph {
  flex: 1;
}
.im-feed {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
  padding: 0.35rem 0.85rem 0.75rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.im-feed::-webkit-scrollbar {
  display: none;
}

@media (max-width: 840px) {
  .im-card {
    width: 98vw;
  }
  .im-body {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
    overflow: visible;
  }
  .im-sidebar {
    border-right: none;
    border-bottom: 1px solid #e0f2fe;
    max-height: 200px;
  }
  .im-main {
    height: 560px;
  }
  .im-feed {
    max-height: 480px;
    flex: none;
  }
  .im-search {
    order: 3;
    flex: 1 1 100%;
    max-width: none;
    margin-left: 0;
  }
}
</style>
