<template>
  <div id="app-container">
    <TheContainer />
  </div>
</template>

<script lang="ts">
import TheContainer from "@/components/TheContainer.vue";

export default {
  name: "App",
  components: {
    TheContainer
  }
};
</script>

<style lang="sass">
#app-container
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  width: 100vw

</style>
