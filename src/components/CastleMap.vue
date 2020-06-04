<template lang="pug">

  .castle-map(
    :class="classes"
  )
    mapbox-map(
      @mapload="onLoad"
      @mapstyleloading="onStyleLoading"
      @mapstyleload="onStyleLoad"
      @mapclick="onClick"
      @mapmousemove="onMousemove"
      @maplongpress="onLongpress"
    )
      template(v-if="styleLoaded")
        context-marker
        castle-markers(
          :sourceId="sourceId"
        )


</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import MapboxMap from '@/components/MapboxMap.vue'
import ContextMarker from '@/components/ContextMarker.vue'
import CastleMarkers from '@/components/CastleMarkers.vue'
import { Map } from 'mapbox-gl'
import debounce from 'lodash.debounce'

@Component({
  components: { MapboxMap, ContextMarker, CastleMarkers },
})
export default class CastleMap extends Vue {
  @Prop() castles: any
  map!: Map

  @Watch('$route') onRouteChange(to: any, from: any) {
    if (to.name === 'Home') {
      this.deselectCastles()
    }
  }

  get classes() {
    return {
      _hover: this.castleHovering,
    }
  }

  // Setup

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

  async onLoad(map: Map) {
    this.map = map
    this.setSource()
  }

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

  selectFromRoute() {
    if (!this.map.getLayer('_castle-circles')) {
      return
    }
    const routeId = this.$route.params?.id
    if (routeId) {
      const features = this.map.querySourceFeatures(this.sourceId, {
        sourceLayer: '_castle-circles',
        filter: ['==', 'id', routeId],
      })
      this.selectCastle(features[0])
    }
  }

  // Castles

  castleSelected: number | null = null
  castleHovering: number | null = null

  selectCastle(feature: mapboxgl.MapboxGeoJSONFeature) {
    if (this.castleSelected) {
      this.map.removeFeatureState(
        {
          source: 'castles',
          id: this.castleSelected,
        },
        'selected'
      )
    }

    this.castleSelected = +feature.id!
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
      this.castleSelected = null
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

  // Events

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
  &,
  #map {
    overflow: hidden;
    height: 100%;
  }

  &._hover canvas {
    cursor: pointer;
  }
}
</style>
