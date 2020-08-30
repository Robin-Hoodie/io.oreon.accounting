<template>
  <div id="app">
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
#app
  display: flex
  justify-content: center
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  width: 100vw

</style>
