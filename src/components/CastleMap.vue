<template lang="pug">

  mgl-map#map(
    :accessToken="mapConfig.accessToken"
    :mapStyle="mapConfig.styleUrl"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :hash="true"
    :style="{ '--map-zoom': mapView.zoom, '--map-zoom-floor': Math.floor(mapView.zoom), '--map-bearing': `${mapView.bearing}deg` }"
    @load="onMapLoaded"
    @click="onMapClick"
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
import Mapbox, { MapMouseEvent } from 'mapbox-gl'
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
    this.mapView.center = this.map.getCenter()
    this.mapView.zoom = this.map.getZoom()
    this.updateBounds()
    this.$root.$on('locationchange', this.mapEaseTo)
  }

  onStyleLoaded(e: any) {
    this.$emit('mapstylechange')
  }

  // Movement

  onMapMove = debounce(() => {
    this.onMapMoved()
  }, 400)

  onMapMoved() {
    this.mapView.center = this.map.getCenter()
    this.updateBounds()
    this.$emit('mapmove')
  }

  onMapZoom = throttle(() => {
    this.onMapZoomed()
  }, 200)

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

  onMapClick(e: any) {
    this.$emit('mapclick', e)
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
          zoom: 8.5,
          duration: 800,
        },
        args
      )
    )
  }
}
</script>
