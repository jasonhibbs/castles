<template lang="pug">

  li.castle-list-item
    p {{ castle.name }}
    p {{ distanceRangeLabel }}


</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import distance from '@turf/distance'

@Component({
  computed: mapState(['mapView']),
})
export default class CastleListItem extends Vue {
  @Prop() castle!: any

  mapView!: any

  get coords() {
    return this.castle.coords
  }

  get km() {
    return this.castle.distance
  }

  get range() {
    const magic = 31.37206463500155
    const range = 2
    switch (true) {
      case this.km > magic + range:
        return 1
      case this.km < magic - range:
        return -1
      default:
        return 0
    }
  }

  get distance() {
    const { km } = this
    if (km) {
      switch (true) {
        case km < 1:
          return `${km.toFixed(2) * 1000} m`
        case km > 100:
          return `${km.toFixed(0)} km`
        default:
          return `${km.toFixed(1)} km`
      }
    }
    return ''
  }

  get distanceRangeLabel() {
    switch (true) {
      case this.range > 0:
        return `${this.distance} – too far`
      case this.range < 0:
        return `${this.distance} – too near`
      default:
        return `${this.distance} — just right`
    }
  }
}
</script>
