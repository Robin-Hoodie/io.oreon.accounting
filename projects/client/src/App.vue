<template>
  <div id="app-container">
    <TheContainer />
  </div>
</template>

<script lang="ts">
import { provide } from "vue";
import TheContainer from "@/components/TheContainer.vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { getDefaultApolloClient } from "@/apollo";

export default {
  name: "App",
  components: {
    TheContainer
  },
  setup (): void {
    provide(DefaultApolloClient, getDefaultApolloClient());
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
