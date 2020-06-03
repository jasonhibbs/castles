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
      data: '/castles-1591211716907.geojson',
    })
  }

  // Map

  makeBox(e: any, range: number = 10): any {
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
    return features[0]?.id || null
  }

  // Events

  castleSelected: number | null = null
  castleHovering: number | null = null

  onClick(e: any) {
    const clicked = this.findFeature(e)

    if (clicked) {
      if (clicked === this.castleSelected) {
        this.map.removeFeatureState(
          {
            source: 'castles',
            id: this.castleSelected,
          },
          'selected'
        )
        this.castleSelected = null
      } else {
        this.castleSelected = +clicked
        this.map.setFeatureState(
          {
            source: 'castles',
            id: this.castleSelected,
          },
          {
            selected: true,
          }
        )
      }
    }
  }

  onMousemove(e: any) {
    const hovering = this.findFeature(e, 6)

    if (this.castleHovering) {
      this.map.removeFeatureState(
        {
          source: 'castles',
          id: this.castleHovering,
        },
        'hover'
      )
      this.castleHovering = null
    }

    if (hovering) {
      this.castleHovering = +hovering
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
