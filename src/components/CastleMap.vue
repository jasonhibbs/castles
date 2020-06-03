<template lang="pug">

  .castle-map
    mapbox-map(
      @mapload="onLoad"
      @maplongpress="onLongpress"
    )
      context-marker

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MapboxMap from '@/components/MapboxMap.vue'
import ContextMarker from '@/components/ContextMarker.vue'
import { Map } from 'mapbox-gl'

@Component({
  components: { MapboxMap, ContextMarker },
})
export default class CastleMap extends Vue {
  @Prop() castles: any
  map!: Map

  // Events

  onLoad(map: Map) {
    this.map = map
    this.map.setLayoutProperty('castle-circles', 'visibility', 'visible')
    this.map.setLayoutProperty('castle-labels', 'visibility', 'visible')
  }

  onLongpress(e: any) {
    const originalEvent = e.mapboxEvent.originalEvent

    if (originalEvent.target.tagName !== 'CANVAS') {
      return false
    }

    const { lat, lng } = e.mapboxEvent.lngLat
    this.$store.commit('updateContext', { lat, lng })
  }
}
</script>

<style lang="scss">
.castle-map {
  display: contents;
}
</style>
