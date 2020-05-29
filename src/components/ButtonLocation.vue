<template lang="pug">

  button.button-location(
    v-if="hasGeolocation"
    :title="title"
    @click="getCurrentLocation"
  )
    template(v-if="!isFinding")
      inline-svg(:src="`/location-arrow.svg`")
    template(v-else)
      loader

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import InlineSvg from 'vue-inline-svg'
import Loader from '@/components/Loader.vue'

@Component({
  components: { InlineSvg, Loader },
  computed: {
    ...mapState(['mapView']),
  },
})
export default class ButtonLocation extends Vue {
  mapView!: any
  isFinding: boolean = false

  get title() {
    return this.isFinding ? 'Getting location…' : 'Get current location'
  }

  get hasGeolocation() {
    return !!navigator.geolocation && window.location.protocol.includes('https')
  }

  getCurrentLocation() {
    this.isFinding = true
    navigator.geolocation.getCurrentPosition(
      this.updateCurrentLocation,
      this.handleLocationError
    )
  }

  updateCurrentLocation(position: Position) {
    const { lat, lng } = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
    this.$store.commit('updateContext', { lat, lng })
    this.$root.$emit('locationchange', { center: [lng, lat] })
    this.isFinding = false
  }

  handleLocationError(error: PositionError) {
    console.warn(error.message)
    this.isFinding = false
  }

  onLocationChange() {
    this.$root.$emit('locationchange', {
      center: [this.mapView.context.lng, this.mapView.context.lat],
    })
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
