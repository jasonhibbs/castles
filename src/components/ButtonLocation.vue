<template lang="pug">

  button.button-location(
    v-if="hasGeolocation"
    :title="title"
    @click="getCurrentLocation"
  )
    template(v-if="!isFinding")
      inline-svg.inline-svg(:src="`/location-arrow.svg`")
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
  --background-color: var(--shade-darkest);
  --hover-background-color: var(--shade-darker);
  --color: var(--color-white);

  width: 2.25rem;
  height: 2.25rem;

  .loader {
    --light-color: var(--tint-mid);
    --color: var(--color-tint);
  }

  .loader-spinner {
    margin: auto;
  }
}
</style>
