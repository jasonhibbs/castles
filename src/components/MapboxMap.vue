<template lang="pug">

  mgl-map#map(
    :accessToken="mapConfig.accessToken"
    :mapStyle="mapStyle"
    :center="mapConfig.center"
    :zoom="mapConfig.zoom"
    :hash="true"
    :style="styles"
    @load="onMapLoad"
    @click="onMapClick"
    @move="onMapMove"
    @rotate="onMapRotate"
    @zoom="onMapZoom"
    @styledata="onStyleLoaded"
    @mousedown="onMapMousedown"
    @mouseup="onMapMouseup"
    @mousemove="onMapMousemove"
    @drag="onMapDrag"
    @touchstart="onMapTouchstart"
    @touchend="onMapTouchend"
    @touchmove="onMapTouchmove"
  )
    slot

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Mapbox, { MapMouseEvent } from 'mapbox-gl'
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
export default class MapboxMap extends Vue {
  map!: any
  mapbox!: any
  mapConfig!: any
  mapView!: any

  // Setup

  created() {
    this.mapbox = Mapbox
  }

  mounted() {
    this.$root.$on('locationchange', this.mapEaseTo)
    this.$root.$on('colorschemechange', this.onSchemeChange)
  }

  onMapLoad(e: any) {
    this.$store.state.map = e.map
    this.$emit('load', e.map)
    this.mapView.center = this.map.getCenter()
    this.mapView.zoom = this.map.getZoom()
    this.updateBounds()
  }

  get mapStyle() {
    const scheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    return this.mapConfig.style[scheme]
  }

  onStyleLoaded(e: any) {
    this.$emit('styleload')
  }

  onSchemeChange(value: string) {
    this.$emit('styleloading')
    this.map.setStyle(this.mapConfig.style[value])
  }

  get styles() {
    return {
      '--map-zoom': this.mapView.zoom,
      '--map-zoom-floor': Math.floor(this.mapView.zoom),
      '--map-bearing': `${this.mapView.bearing}deg`,
    }
  }

  // Movement

  onMapMove = debounce(() => {
    this.onMapMoved()
  }, 400)

  onMapMoved() {
    this.mapView.center = this.map.getCenter()
    this.updateBounds()
    this.$emit('move')
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
    this.$emit('click', e)
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
    if (!this.map) {
      setTimeout(() => {
        this.mapEaseTo(args)
      }, 400)
    }
    const defaultZoom = 8 > this.mapView.zoom ? 8 : this.mapView.zoom
    this.map.easeTo(
      Object.assign(
        {
          zoom: defaultZoom,
          duration: 800,
          padding: this.mapView.padding,
        },
        args
      )
    )
  }

  // Longpress

  longpressTimeout: number | undefined
  longpressed = false

  longpressTimeoutStart(e: any) {
    this.longpressTimeoutClear()
    this.longpressTimeout = window.setTimeout(() => {
      this.longpressed = true
      this.$emit('longpress', e)
    }, 500)
  }

  longpressTimeoutEnd(e: any) {
    this.longpressTimeoutClear()
    if (this.longpressed === true) {
      e.mapboxEvent.originalEvent.preventDefault()
      this.longpressed = false
    }
  }

  longpressTimeoutClear() {
    if (this.longpressTimeout) {
      window.clearTimeout(this.longpressTimeout)
    }
  }

  // Mouse

  onMapMousedown(e: any) {
    this.longpressTimeoutStart(e)
  }

  onMapMouseup(e: any) {
    this.longpressTimeoutEnd(e)
  }

  onMapMousemove(e: any) {
    this.$emit('mousemove', e)
  }

  onMapDrag(e: any) {
    this.longpressTimeoutClear()
    this.$emit('drag', e)
  }

  // Touch

  onMapTouchstart(e: any) {
    this.longpressTimeoutStart(e)
  }

  onMapTouchend(e: any) {
    this.longpressTimeoutEnd(e)
  }

  onMapTouchmove(e: any) {
    this.longpressTimeoutClear()
  }
}
</script>
