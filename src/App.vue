<template lang="pug">

  #app
    header
      h1 Where can I test my eyes?
      h2 A map of English castles
    castle-map(
      @mapclick="onMapclick"
    )
      context-marker
      castle-markers(
        v-if="hasCastles"
        :castles="castles"
      )

    router-view(:key="$route.fullPath")

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CastleMap from '@/components/CastleMap.vue'
import CastleMarkers from '@/components/CastleMarkers.vue'
import ContextMarker from '@/components/ContextMarker.vue'
import { MapboxEvent } from 'mapbox-gl'

@Component({
  components: {
    CastleMap,
    CastleMarkers,
    ContextMarker,
  },
})
export default class App extends Vue {
  castles: any[] = []

  async fetchCastles() {
    return fetch('/castles.json')
      .then(response => response.json())
      .then(data => {
        this.castles = data
      })
  }

  get hasCastles() {
    return this.castles.length
  }

  mounted() {
    this.fetchCastles()
  }

  onMapclick(e: any) {
    const originalEvent = e.mapboxEvent.originalEvent

    if (originalEvent.target.tagName !== 'CANVAS') {
      return false
    }

    console.log(e.mapboxEvent.lngLat)

    const { lat, lng } = e.mapboxEvent.lngLat
    this.$store.commit('updateContext', { lat, lng })
  }
}
</script>
