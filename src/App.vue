<template lang="pug">

  #app
    logo

    castle-map(
      @mapclick="onMapclick"
    )
      context-marker
      castle-markers(
        v-if="hasCastles"
        :castles="castles"
      )

    button-location

    bottom-sheet
      router-view(:key="$route.fullPath")

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BottomSheet from '@/components/BottomSheet.vue'
import CastleMap from '@/components/CastleMap.vue'
import CastleMarkers from '@/components/CastleMarkers.vue'
import ContextMarker from '@/components/ContextMarker.vue'
import ButtonLocation from '@/components/ButtonLocation.vue'
import Logo from '@/components/Logo.vue'

@Component({
  components: {
    BottomSheet,
    CastleMap,
    CastleMarkers,
    ContextMarker,
    ButtonLocation,
    Logo,
  },
})
export default class App extends Vue {
  castles: any[] = []

  async fetchCastles() {
    return fetch('/castles-index.json')
      .then(response => response.json())
      .then(data => {
        this.castles = data
      })
  }

  get hasCastles() {
    return this.castles.length
  }

  // Lifecycle

  queryDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

  mounted() {
    this.fetchCastles()
    this.queryDarkMode.addListener((dark: MediaQueryListEvent) => {
      this.$root.$emit('colorschemechange', dark.matches ? 'dark' : 'light')
    })
  }

  // Events

  onMapclick(e: any) {
    const originalEvent = e.mapboxEvent.originalEvent

    if (originalEvent.target.tagName !== 'CANVAS') {
      return false
    }

    const { lat, lng } = e.mapboxEvent.lngLat
    this.$store.commit('updateContext', { lat, lng })
  }
}
</script>
