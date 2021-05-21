<template>
  <v-row>
    <v-col cols="12">
      <v-simple-table class="row-pointer">
        <template v-slot:default>
          <slot />
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>