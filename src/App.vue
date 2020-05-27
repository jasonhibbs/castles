<template lang="pug">

  #app
    h1 Where’s my nearest eye test?
    castle-map
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

@Component({
  components: {
    CastleMap,
    CastleMarkers,
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
}
</script>
