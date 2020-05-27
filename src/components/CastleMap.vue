<template lang="pug">

  mgl-map#map(
    :accessToken="mapConfig.accessToken"
    :mapStyle="mapConfig.styleUrl"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :hash="true"
    :style="{ '--map-zoom': mapView.zoom, '--map-bearing': `${mapView.bearing}deg` }"
    @load="onMapLoaded"
    @move="onMapMove"
    @rotate="onMapRotate"
    @zoom="onMapZoom"
    @styledata="onStyleLoaded"
  )
    slot

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Mapbox from 'mapbox-gl'
import * as polyline from '@mapbox/polyline'
import { MglMap, MglMarker, MglGeojsonLayer } from 'vue-mapbox'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'

@Component({
  components: {
    MglMap,
    MglMarker,
    MglGeojsonLayer,
  },
  computed: {
    ...mapState(['map', 'mapConfig', 'mapView']),
  },
})
export default class CastleMap extends Vue {
  map!: any
  mapbox!: any
  mapConfig!: any
  mapView!: any

  // Setup

  created() {
    this.mapbox = Mapbox
  }

  onMapLoaded(e: any) {
    this.$store.state.map = e.map
    this.updateBounds()
  }

  onStyleLoaded(e: any) {
    this.$root.$emit('mapstylechanged')
  }

  // Movement

  onMapMove = debounce(() => {
    this.onMapMoved()
  }, 300)

  onMapMoved() {
    this.mapView.center = this.map.getCenter()
    this.updateBounds()
    this.$root.$emit('mapmoved')
  }

  onMapZoom = throttle(() => {
    this.onMapZoomed()
  }, 100)

  onMapZoomed() {
    const currentZoom = this.map.getZoom()
    this.mapView.zoom = currentZoom
  }

  onMapRotate = throttle(() => {
    this.onMapRotated()
  }, 60)

  onMapRotated() {
    const currentBearing = this.map.getBearing()
    this.mapView.bearing = currentBearing
  }

  updateBounds() {
    if (this.mapView.zoom < 6) {
      return
    }

    const bounds = this.map.getBounds()
    this.mapView.bounds = {
      north: bounds.getNorth(),
      east: bounds.getEast(),
      south: bounds.getSouth(),
      west: bounds.getWest(),
    }
  }

  mapEaseTo(args: any) {
    this.map.easeTo(
      Object.assign(
        {
          zoom: 14,
          duration: 800,
        },
        args
      )
    )
  }
}
</script>
