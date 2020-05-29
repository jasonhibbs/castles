<template lang="pug">

  .context
    mgl-marker(
      :coordinates="[lng, lat]"
    )
      .marker.context-marker(slot="marker")
        .marker-pin
          .marker-head
          .marker-shaft
        .marker-label
          .marker-label-content {{ label }}

    mgl-geojson-layer(
      :sourceId="radiusId"
      :layerId="radiusId"
      :source="radiusSource"
      :layer="radiusLayer"
    )


</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { MglMarker, MglGeojsonLayer } from 'vue-mapbox'

@Component({
  components: {
    MglMarker,
    MglGeojsonLayer,
  },
  computed: {
    ...mapState(['mapView']),
  },
})
export default class ContextMarker extends Vue {
  mapView!: any

  get coords() {
    return [this.mapView.context.lng, this.mapView.context.lat]
  }

  get lat() {
    return this.mapView.context.lat
  }

  get lng() {
    return this.mapView.context.lng
  }

  get label() {
    return 'My Location'
  }

  get radiusId() {
    return 'contextRadius'
  }

  get radiusWidth() {
    return this.mapView.zoom ** 2 * 0.1
  }

  get radiusLayer() {
    return {
      type: 'line',
      paint: {
        'line-width': this.radiusWidth,
        'line-color': '#5398c6',
        'line-opacity': 0.4,
      },
    }
  }

  get radiusSource() {
    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [this.makeCircle(this.lat, this.lng, 31.29767)],
      },
    }
  }

  makeCircle(lat: number, lng: number, radius: number, points?: number) {
    if (!points) points = 48

    var km = radius

    var ret = []
    var distanceX = km / (111.32 * Math.cos((lat * Math.PI) / 180))
    var distanceY = km / 110.574

    var theta, x, y
    for (var i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI)
      x = distanceX * Math.cos(theta)
      y = distanceY * Math.sin(theta)

      ret.push([lng + x, lat + y])
    }
    ret.push(ret[0])

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret],
      },
    }
  }
}
</script>
