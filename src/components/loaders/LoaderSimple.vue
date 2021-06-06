<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="auto">
        <v-progress-circular size="50" indeterminate> </v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "LoaderSimple"
  }
</script>