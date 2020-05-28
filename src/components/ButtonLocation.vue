<template lang="pug">

  button.button-location(
    v-if="hasGeolocation"
    title="Get current location"
    @click="getCurrentLocation"
  )
    inline-svg(:src="`/location-arrow.svg`")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import InlineSvg from 'vue-inline-svg'

@Component({
  components: { InlineSvg },
  computed: {
    ...mapState(['mapView']),
  },
})
export default class ButtonLocation extends Vue {
  mapView!: any

  get hasGeolocation() {
    return !!navigator.geolocation
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      this.updateCurrentLocation,
      this.handleLocationError
    )
  }

  updateCurrentLocation(position: Position) {
    this.mapView.context.lat = position.coords.latitude
    this.mapView.context.lng = position.coords.longitude
    this.$emit('originclick')
  }

  handleLocationError(error: PositionError) {
    console.warn(error.message)
  }
}
</script>

<style lang="scss">
.button-location {
  --padding-x: 0;
  --padding-y: 0;
  --background-color: var(--contrast-darkest);
  --hover-background-color: var(--color-contrast);
  --color: var(--color-map-base);

  width: 2.25rem;
  height: 2.25rem;

  svg {
    display: block;
    height: 1em;
    width: auto;
    margin: auto;
    fill: currentColor;
  }
}
</style>
