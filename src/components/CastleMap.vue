<template lang="pug">

  .castle-map(
    :class="classes"
  )
    loader(v-if="!styleLoaded")
    mapbox-map(
      @load="onLoad"
      @styleloading="onStyleLoading"
      @styleload="onStyleLoad"
      @click="onClick"
      @longpress="onLongpress"
      @mousemove="onMousemove"
      @drag.passive="onDrag"

    )
      template(v-if="styleLoaded")
        context-marker
        castle-markers(:sourceId="sourceId")


</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { Map } from 'mapbox-gl'
import { Point } from 'geojson'
import debounce from 'lodash.debounce'
import MapboxMap from '@/components/MapboxMap.vue'
import ContextMarker from '@/components/ContextMarker.vue'
import CastleMarkers from '@/components/CastleMarkers.vue'
import Loader from '@/components/Loader.vue'

@Component({
  components: { MapboxMap, ContextMarker, CastleMarkers, Loader },
  computed: mapState(['mapView']),
})
export default class CastleMap extends Vue {
  @Prop() castles: any
  map!: Map
  mapView!: any

  get classes() {
    return {
      _hover: this.castleHovering,
      _ready: this.styleLoaded,
    }
  }

  // Setup

  async onLoad(map: Map) {
    this.map = map
    this.setSource()
  }

  selectFromRoute() {
    if (!this.map?.getLayer('_castle-circles')) {
      return
    }
    const routeId = this.$route.params?.id
    if (routeId) {
      const features = this.map.querySourceFeatures(this.sourceId, {
        sourceLayer: '_castle-circles',
        filter: ['==', 'id', routeId],
      })
      if (features.length) {
        this.selectCastle(features[0])
      }
    }
  }

  @Watch('$route') onRouteChange(to: any, from: any) {
    if (to.name === 'Home') {
      this.deselectCastles()
    }
    if (to.name === 'Castle') {
      this.selectFromRoute()
    }
  }

  // Style

  styleLoaded = false

  onStyleLoading() {
    this.styleLoaded = false
  }

  onStyleLoad = debounce(() => {
    this.onStyleLoaded()
  }, 500)

  onStyleLoaded() {
    if (!this.map.getSource(this.sourceId)) {
      this.setSource()
    }
    this.selectFromRoute()
    this.styleLoaded = true
  }

  // Source

  get sourceId() {
    return 'castles'
  }

  async setSource() {
    return this.map.addSource(this.sourceId, {
      type: 'geojson',
      data: '/castles-1591219381299.geojson',
    })
  }

  // Map

  makeBox(e: any, range: number = 6): any {
    const { x, y } = e.mapboxEvent.point
    return [
      [x - range, y - range],
      [x + range, y + range],
    ]
  }

  findFeature(e: any, range?: number) {
    if (!this.map.getLayer('_castle-circles')) {
      return
    }
    const features = this.map.queryRenderedFeatures(this.makeBox(e, range), {
      layers: ['_castle-circles'],
    })
    return features[0] || null
  }

  // Castles

  castleHovering: number | null = null

  get castleSelected() {
    return this.mapView.selected?.id
  }

  selectCastle(feature: mapboxgl.MapboxGeoJSONFeature) {
    if (this.castleSelected) {
      this.map.removeFeatureState(
        {
          source: 'castles',
          id: this.castleSelected,
        },
        'selected'
      )
      this.$store.commit('updateSelected', null)
    }

    this.$store.commit('updateSelected', feature)
    this.map.setFeatureState(
      {
        source: 'castles',
        id: this.castleSelected,
      },
      {
        selected: true,
      }
    )

    if (this.$route.params?.id !== feature.properties!.id) {
      this.$router.push({
        name: 'Castle',
        params: {
          id: feature.properties!.id,
        },
      })
    }
  }

  deselectCastles() {
    if (this.castleSelected) {
      this.map.removeFeatureState(
        {
          source: 'castles',
          id: this.castleSelected,
        },
        'selected'
      )
      this.$store.commit('updateSelected', null)
    }
    if (this.$route.name !== 'Home') {
      this.$router.push('/')
    }
  }

  hoverCastle(feature: mapboxgl.MapboxGeoJSONFeature) {
    this.castleHovering = +feature.id!
    this.map.setFeatureState(
      {
        source: 'castles',
        id: this.castleHovering,
      },
      {
        hover: true,
      }
    )
  }

  unhoverCastles() {
    if (this.castleHovering) {
      this.map.removeFeatureState(
        {
          source: 'castles',
          id: this.castleHovering,
        },
        'hover'
      )
    }
    this.castleHovering = null
  }

  // Input

  onClick(e: any) {
    const clicked = this.findFeature(e)

    // no castle clicked
    if (!clicked) {
      return
    }

    // selected castle clicked
    if (clicked.id === this.castleSelected) {
      this.deselectCastles()
      return
    }

    // castle clicked
    this.selectCastle(clicked)
  }

  onMousemove(e: any) {
    const hovering = this.findFeature(e)

    if (this.castleHovering) {
      this.unhoverCastles()
    }

    if (hovering) {
      this.hoverCastle(hovering)
    }
  }

  onLongpress(e: any) {
    const { originalEvent } = e.mapboxEvent

    if (originalEvent.target.tagName !== 'CANVAS') {
      return false
    }

    const { lat, lng } = e.mapboxEvent.lngLat
    this.$store.commit('updateContext', { lat, lng })
  }

  onDrag(e: any) {
    if (window.innerWidth >= 768) {
      return
    }

    const sheetZone = window.innerHeight - (this.mapView.sheet.height + 44)
    const { originalEvent } = e.mapboxEvent
    let dragY = originalEvent.clientY

    if (originalEvent.touches) {
      const touches = [...originalEvent.touches].map(t => t.pageY)
      dragY = Math.max(...touches)
    }

    if (dragY > sheetZone) {
      this.$root.$emit('lowersheet')
    }
  }
}
</script>

<style lang="scss">
.castle-map {
  &,
  #map {
    overflow: hidden;
    height: 100%;
  }

  &._hover canvas {
    cursor: pointer;
  }

  canvas {
    opacity: 0;
    transition: opacity 0.4s;
  }

  &._ready canvas {
    opacity: 1;
  }

  .loader {
    --size: 2em;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;
  }
}
</style>
