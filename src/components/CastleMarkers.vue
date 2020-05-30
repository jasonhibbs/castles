<template lang="pug">

  .castle-markers
    mgl-marker(
      v-for="castle in castles"
      :key="castle.id"
      :coordinates="[castle.coords.lng, castle.coords.lat]"
    )
      castle-marker(
        slot="marker"
        :castle="castle"
      )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MglMarker } from 'vue-mapbox'
import CastleMarker from '@/components/CastleMarker.vue'

@Component({
  components: {
    MglMarker,
    CastleMarker,
  },
})
export default class CastleMarkers extends Vue {
  @Prop() castles: any
}
</script>
