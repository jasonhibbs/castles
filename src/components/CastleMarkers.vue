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

@Component({ components: { MglGeojsonLayer } })
export default class CastleMarkers extends Vue {
  @Prop() sourceId: any

  get isDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  get layers() {
    return [
      this.castleCircles,
      this.castleActiveRings,
      this.castleActiveCircles,
      this.castleLabels,
    ]
  }

  get labelColor() {
    return this.isDark ? 'hsl(180, 0%, 100%)' : 'hsl(160, 2%, 18%)'
  }

  get circleColor() {
    return this.isDark ? 'hsl(180, 2%, 80%)' : 'hsl(160, 2%, 28%)'
  }

  get haloColor() {
    const darkHalo = [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      'hsl(180, 1%, 12%)',
      12,
      'hsl(180, 3%, 8%)',
    ]

    const lightHalo = [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      'hsl(60, 2%, 92%)',
      12,
      'hsl(36, 28%, 93%)',
    ]

    return this.isDark ? darkHalo : lightHalo
  }

  circleRadius(offsetA: number = 0, offsetB: number = offsetA) {
    return [
      'interpolate',
      ['exponential', 1.2],
      ['zoom'],
      2,
      1 + offsetA,
      14,
      10 + offsetB,
    ]
  }

  get circlePaintBase() {
    return {
      'circle-color': this.circleColor,
      'circle-radius': this.circleRadius(),
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
        'circle-radius': this.circleRadius(3, 5),
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
        'text-color': this.labelColor,
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
