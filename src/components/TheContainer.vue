<template>
  <section class="container">
    <Suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        Loading...
      </template>
    </Suspense>
    <router-view />
  </section>
</template>

<script>
export default {
  name: "TheContainer"
};
</script>

<style
  lang="sass"
  scoped
>
.container
  max-width: 80%
</style>
