<template lang="pug">

  .castle-map(
    :class="classes"
  )
    mapbox-map(
      @mapload="onLoad"
      @mapclick="onClick"
      @mapmousemove="onMousemove"
      @maplongpress="onLongpress"
    )
      context-marker
      castle-markers(
        :sourceId="sourceId"
      )


</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MapboxMap from '@/components/MapboxMap.vue'
import ContextMarker from '@/components/ContextMarker.vue'
import CastleMarkers from '@/components/CastleMarkers.vue'
import { Map } from 'mapbox-gl'

@Component({
  components: { MapboxMap, ContextMarker, CastleMarkers },
})
export default class CastleMap extends Vue {
  @Prop() castles: any
  map!: Map

  get classes() {
    return {
      _hover: this.castleHovering,
    }
  }

  // Setup

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
    const features = this.map.queryRenderedFeatures(this.makeBox(e, range), {
      layers: ['_castle-circles'],
    })
    return features[0] || null
  }

  // Castles

  castleSelected: number | null = null
  castleHovering: number | null = null

  selectCastle(feature: mapboxgl.MapboxGeoJSONFeature) {
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

    this.$router.push({
      name: 'Castle',
      params: {
        id: feature.properties!.id,
      },
    })
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
    }
    this.castleSelected = null
    this.$router.push('/')
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
