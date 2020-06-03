<template lang="pug">

  .castle-markers
    mgl-geojson-layer(
      :sourceId="sourceId"
      :layerId="castleCircles.id"
      :layer="castleCircles"
    )
    mgl-geojson-layer(
      :sourceId="sourceId"
      :layerId="castleLabels.id"
      :layer="castleLabels"
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

  get castleCircles() {
    return {
      id: '_castle-circles',
      type: 'circle',

      paint: {
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#f00',
          'hsl(160, 2%, 28%)',
        ],
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
          duration: 300,
        },
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
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
        // ['step', ['zoom'], 0, 8.5, 1],
        'text-opacity-transition': {
          duration: 400,
        },
      },
    }
  }
}
</script>
