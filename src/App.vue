<template>
  <div>
    <header>
      <nav-bar/>
    </header>
    <main class="py-5">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>

<style>
a {
  text-decoration: none !important;
}
</style>