<template lang="pug">

  button.button-location._inner(
    v-if="hasGeolocation"
    :title="title"
    @click="getCurrentLocation"
  )
    .button-inner
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
}
</script>

<style lang="scss">
@import '../assets/scss/util';

.button-location {
  --padding-x: 0;
  --padding-y: 0;
  --background-color: var(--color-black);
  --hover-background-color: var(--grey-darkest);
  --color: var(--color-white);

  .button-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(32);
    height: rem(32);
  }

  .loader {
    --light-color: var(--tint-mid);
    --color: var(--color-tint);
  }

  .loader-spinner {
    margin: auto;
  }
}
</style>
