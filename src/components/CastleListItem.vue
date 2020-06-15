<template lang="pug">

  li.castle-list-item
    router-link._unlink(:to="link")
      .layout
        h2 {{ name }}
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
  @Prop() id!: string
  @Prop() name!: string
  @Prop({ default: 0 }) distance!: number

  mapView!: any

  get link() {
    return {
      name: 'Castle',
      params: {
        id: this.id,
      },
    }
  }

  get range() {
    const magic = 31.37206463500155
    const range = 2
    const km = this.distance
    switch (true) {
      case km > magic + range:
        return 1
      case km < magic - range:
        return -1
      default:
        return 0
    }
  }

  get distanceLabel() {
    const km = this.distance

    switch (true) {
      case km < 1:
        return `${+km.toFixed(2) * 1000} m`
      case km > 100:
        return `${km.toFixed(0)} km`
      default:
        return `${km.toFixed(1)} km`
    }

    return ''
  }

  get distanceRangeLabel() {
    switch (true) {
      case this.range > 0:
        return `${this.distanceLabel} – too far`
      case this.range < 0:
        return `${this.distanceLabel} – too near`
      default:
        return `${this.distanceLabel} — just right`
    }
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';

.castle-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.castle-list-item {
  a {
    display: block;

    &:focus,
    &:hover {
      background-color: var(--contrast-lightest);
    }
  }

  .layout {
    padding: rem(16) 0;
    box-shadow: 0 1px var(--contrast-lighter);
  }

  h2 {
    @include font-size(20, 20);
    padding-bottom: rem(8);
  }

  p {
    margin: 0;
  }
}
</style>

