<script lang="ts" setup></script>

<template>
  <div class="f-col h-100vh">
    <header class="blog-header p-4">
      <NuxtLink to="/">hh's blog</NuxtLink>
      <span ml-20></span>
    </header>
    <main class="p-3 flex-1">
      <slot />
    </main>
    <footer class="blog-footer frc"> 2binfront@2024 </footer>
  </div>
</template>

<style lang="scss">
.blog-header {
  //   background-color: #f3f3f3;
  //   height: 5vh;
  max-height: 200px;
}

.blog-footer {
  //   background-color: black;
  color: #000;
  height: 5vh;
  max-height: 200px;
}
</style>
