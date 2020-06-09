<template lang="pug">

  card.card-nearby
    template(#header)
      .layout
        .heading
          h1 Nearby

        router-link(
          title="Dismiss Nearby"
          :to="'/'"
          @click.native.stop
        )
          icon-close

    template(#content)
      .layout

        loader(v-if="finding") Loading…
        template(v-else)
          p cool


</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import distance from '@turf/distance'
import Card from '@/components/Card.vue'
import Loader from '@/components/Loader.vue'
import IconClose from '@/components/IconClose.vue'

@Component({
  components: { Card, Loader, IconClose },
  computed: mapState(['mapView', 'castles']),
})
export default class Castle extends Vue {
  mapView!: any
  castles!: []
  castle: any = {}
  finding: boolean = true

  // Lifecycle

  mounted() {}
}
</script>
<style lang="scss">
@import '../assets/scss/util';
</style>
