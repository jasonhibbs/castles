<template lang="pug">

  .castle-markers
    mgl-marker(
      v-for="castle in castles"
      v-if="castle.coords"
      :coordinates="[castle.coords.lng, castle.coords.lat]"
    )
      div(
        slot="marker"
      ) {{ castle.name }}

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MglMap, MglMarker, MglGeojsonLayer } from 'vue-mapbox'

@Component({
  components: {
    MglMap,
    MglMarker,
    MglGeojsonLayer,
  },
})
export default class CastleMarkers extends Vue {
  @Prop() castles: any
}
</script>
