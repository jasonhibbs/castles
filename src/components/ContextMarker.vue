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

    template
      mgl-geojson-layer(
        :sourceId="radius.id"
        :layerId="radius.id"
        :source="radius.source"
        :layer="radius.layer"
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

  mounted() {
    this.$root.$on('mapstylechange', this.onStyleChange)
  }

  onStyleChange() {
    // geojsonlayer breaks on style change, so rebuild manually
    const map = this.$store.state.map
    if (!this.$store.state.map.getSource(this.radius.id)) {
      map.addSource(this.radius.id, this.radius.source)
      map.addLayer(this.radius.layer)
    }
  }

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

  get radiusWidth() {
    return this.mapView.zoom ** 2 * 0.1
  }

  get radius() {
    const id = 'contextRadius'
    return {
      id,
      layer: {
        id,
        source: id,
        type: 'line',
        paint: {
          'line-width': this.radiusWidth,
          'line-color': '#5398c6',
          'line-opacity': 0.4,
        },
      },
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [this.makeRadius(this.lat, this.lng, 31.29767)],
        },
      },
    }
  }

  makeRadius(lat: number, lng: number, radius: number, points?: number) {
    if (!points) points = 48

    const km = radius

    const ret = []
    const distanceX = km / (111.32 * Math.cos((lat * Math.PI) / 180))
    const distanceY = km / 110.574

    let theta, x, y
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
