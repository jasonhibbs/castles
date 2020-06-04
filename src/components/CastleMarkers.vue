<template lang="pug">

  .castle-markers
    mgl-geojson-layer(
      v-for="layer in layers"
      :sourceId="sourceId"
      :layerId="layer.id"
      :layer="layer"
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
    return [this.castleHoverCircles, this.castleCircles, this.castleLabels]
  }

  get circleColor() {
    return 'hsl(160, 2%, 28%)'
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
      'circle-stroke-color': [
        'interpolate',
        ['linear'],
        ['zoom'],
        5,
        '#ebebea',
        12,
        'hsl(36, 28%, 93%)',
      ],
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

  get castleHoverCircles() {
    return {
      id: '_castle-hover-circles',
      type: 'circle',
      paint: {
        ...this.circlePaintBase,
        'circle-radius': [
          'interpolate',
          ['exponential', 1.2],
          ['zoom'],
          3,
          3,
          14,
          13,
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
        'text-halo-color': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          '#ebebea',
          12,
          'hsl(36, 28%, 93%)',
        ],
        'text-halo-width': 2,
        'text-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          1,
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
        // ['step', ['zoom'], 0, 8.5, 1],
        'text-opacity-transition': {
          duration: 120,
        },
      },
    }
  }
}
</script>
