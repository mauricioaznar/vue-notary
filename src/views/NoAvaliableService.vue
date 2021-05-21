<template>
  <v-main>
    <v-container class="fill-height">

      <v-row justify="center">
        <v-col cols="auto">
          <v-card  outlined elevation="4" class="pa-6">
            <v-card-title>
              <h1>Servicio no disponible</h1>
            </v-card-title>
            <v-card-actions class="pt-0" >
              <v-spacer />
              <v-btn
                  text
                  color="teal accent-4"
                  @click="tryAgain"
              >
                Reintentar inicio de sesión
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: 'NotAvailableService',
  methods: {
    tryAgain: function () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>