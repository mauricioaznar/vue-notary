<template>
  <v-container style="max-width: 1000px">
    <v-timeline
      dense
      clipped
    >
      <v-timeline-item
        hide-dot
        class="mb-12 align-center"
      >
        <h1 class="text-center">Plan de desarrollo</h1>
      </v-timeline-item>
      <roadmap-title
        title="NOTARY-MANAGER v.2.0.0 (primer lanzamiento)"
      />
      <roadmap-item
          date="2021-05-18"
      >
        [Caracteristica] Aplicación apobada por los usuarios.
        <ul>
          <li>
            Aplicacion contiene toda las caracteristicas y funciona como la aplicacion anterior
          </li>
        </ul>
      </roadmap-item>
      <roadmap-item
          date="2021-05-19"
      >
        [Caracteristica] Cambiar fecha por año en la base de datos.
      </roadmap-item>
      <roadmap-item
          date="2021-05-18"
      >
        [Caracteristica] Entidades no se pueden borrar si tienen un registro dependiente
        <ul>
          <li>Clientes</li>
          <li>Otorgantes</li>
          <li>Usuarios</li>
          <li>Grupos</li>
        </ul>
      </roadmap-item>

      <roadmap-title
          title="NOTARY-MANAGER v.2.0.0-beta-2 (actual)"
      />
      <roadmap-item
          color="green"
          date="2021-05-03"
      >
        [Caracteristica] Los usuarios pueden cerrar sesion
      </roadmap-item>
      <roadmap-item
          color="green"
          date="2021-05-03"
      >
        [Caracteristica] La aplicacion detecta cuando no hay conexion con el servidor y muestra un mensaje. El usuario
        puede reinentar la conexion.
      </roadmap-item>


      <roadmap-title
          title="NOTARY-MANAGER v.2.0.0-beta-1"
      />
      <roadmap-item
          color="green"
          date="2021-04-30"
      >
        [Caracteristica] Desarrollo completo de la aplicacion
      </roadmap-item>
      <roadmap-item
          color="green"
          date="2021-04-30"
      >
        [Caracteristica] Mejorar el dialogo que aparece cuando le das click a una cita.
      </roadmap-item>
      <roadmap-item
          color="green"
          date="2021-04-30"
      >
        [Caracteristica] Mejorar la experiencia de inicio de sesion
      </roadmap-item>
    </v-timeline>
  </v-container>
</template>

<script>
import RoadmapTitle from "@/views/roadmap/RoadmapTitle";
import RoadmapItem from "@/views/roadmap/RoadmapItem";
export default {
  name: 'Roadmap',
  components: {RoadmapItem, RoadmapTitle}
}
</script>

<style scoped>

</style>