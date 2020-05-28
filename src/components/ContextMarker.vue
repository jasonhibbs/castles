<template lang="pug">

  mgl-marker(
    :coordinates="coords"
  )
    .marker.context-marker(slot="marker")
      .marker-pin
        .marker-head
        .marker-shaft
      .marker-label
        .marker-label-content {{ label }}


</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { MglMarker } from 'vue-mapbox'

@Component({
  components: {
    MglMarker,
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

  get label() {
    return 'My Location'
  }
}
</script>
