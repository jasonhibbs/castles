<template lang="pug">

  .castle-markers
    mgl-geojson-layer(
      v-for="layer in layers"
      :sourceId="sourceId"
      :layerId="layer.id"
      :layer="layer"
      replaceSource
      replace
    )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MglGeojsonLayer } from 'vue-mapbox'

@Component({
  components: {
    MglGeojsonLayer,
  },
})
export default class CastleMarkers extends Vue {
  @Prop() sourceId: any

  get layers() {
    return [
      this.castleCircles,
      this.castleActiveRings,
      this.castleActiveCircles,
      this.castleLabels,
    ]
  }

  get circleColor() {
    return 'hsl(160, 2%, 28%)'
  }

  get haloColor() {
    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      '#ebebea',
      12,
      'hsl(36, 28%, 93%)',
    ]
  }

  get circlePaintBase() {
    return {
      'circle-color': this.circleColor,
      'circle-radius': [
        'interpolate',
        ['exponential', 1.2],
        ['zoom'],
        3,
        1,
        14,
        10,
      ],
      'circle-stroke-color': this.haloColor,
      'circle-stroke-width': 1,
      'circle-pitch-alignment': 'map',
      'circle-color-transition': {
        duration: 120,
      },
    }
  }

  get castleCircles() {
    return {
      id: '_castle-circles',
      type: 'circle',
      paint: this.circlePaintBase,
    }
  }

  get castleActiveCircles() {
    return {
      id: '_castle-active-circles',
      type: 'circle',
      paint: {
        ...this.circlePaintBase,
        'circle-stroke-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
      },
    }
  }

  get castleActiveRings() {
    return {
      id: '_castle-active-rings',
      type: 'circle',
      paint: {
        ...this.circlePaintBase,
        'circle-stroke-width': 0,
        'circle-radius': [
          'interpolate',
          ['exponential', 1.2],
          ['zoom'],
          3,
          4,
          14,
          14,
        ],
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
      },
    }
  }

  get castleLabels() {
    return {
      id: '_castle-labels',
      type: 'symbol',
      layout: {
        'text-field': ['to-string', ['get', 'name']],
        'text-justify': 'left',
        'text-offset': [
          'interpolate',
          ['exponential', 1.1],
          ['zoom'],
          3,
          ['literal', [0.25, 0]],
          14,
          ['literal', [1, -0.75]],
        ],
        'text-font': ['Overpass Mono Light', 'Arial Unicode MS Regular'],
        'text-padding': 8,
        'text-max-width': 16,
        'text-anchor': 'bottom-left',
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': 'hsl(160, 2%, 18%)',
        'text-halo-color': this.haloColor,
        'text-halo-width': 2,
        'text-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
        'text-opacity-transition': {
          duration: 120,
        },
      },
    }
  }
}
</script>
