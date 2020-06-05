<template lang="pug">

  #app
    logo
    castle-map
    button-location
    bottom-sheet
      transition(:name="transitionName")
        router-view(:key="$route.fullPath")

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
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
  // Lifecycle

  queryDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

  mounted() {
    this.queryDarkMode.addListener((dark: MediaQueryListEvent) => {
      this.$root.$emit('colorschemechange', dark.matches ? 'dark' : 'light')
    })
  }

  // Route

  transitionName: string = 'none'

  @Watch('$route') onRouteChange(to: any, from: any) {
    if (to.name === 'Castle') {
      this.transitionName = 'slide-up'
    }
    if (to.name === 'Home') {
      this.transitionName = 'slide-down'
    }
  }

  // Events

  onMaplongpress(e: any) {
    const originalEvent = e.mapboxEvent.originalEvent

    if (originalEvent.target.tagName !== 'CANVAS') {
      return false
    }

    const { lat, lng } = e.mapboxEvent.lngLat
    this.$store.commit('updateContext', { lat, lng })
  }
}
</script>
