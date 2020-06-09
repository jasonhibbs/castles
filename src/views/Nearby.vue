<template lang="pug">

  card.card-nearby(
    dismiss="Dismiss Nearby"
  )

    template(#header)
      .heading
        h1 Nearby

    template(#content)
      ul.castle-list
        castle-list-item(
          v-for="castle in nearbyCastles"
          :key="castle.id"
          v-bind="castle"
        )


</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import distance from '@turf/distance'
import Card from '@/components/Card.vue'
import Loader from '@/components/Loader.vue'
import CastleListItem from '@/components/CastleListItem.vue'

@Component({
  components: { Card, Loader, CastleListItem },
  computed: mapState(['mapView', 'castles']),
})
export default class Nearby extends Vue {
  mapView!: any
  castles!: []
  fetching: boolean = true

  getCastleDistance(castle: any) {
    if (!castle.coords || !this.mapView.context) {
      return ''
    }
    const { lng, lat } = castle.coords
    const from = [this.mapView.context.lng, this.mapView.context.lat]
    const to = [lng, lat]
    return distance(from, to)
  }

  get measuredCastles() {
    // console.log(this.$store.state.mapView.context.lat, this.mapView.context.lat)
    const update = this.mapView.context.lat
    return this.castles.map((c: any) => {
      c.distance = this.getCastleDistance(c)
      return c
    })
  }

  get nearbyCastles() {
    return this.measuredCastles.sort((a: any, b: any) => {
      return a.distance - b.distance
    })
  }

  // Lifecycle

  async mounted() {
    // fetch castle data
    await this.checkCastles()
  }

  // Setup

  async checkCastles() {
    if (!this.castles.length) {
      await this.fetchCastles()
    }
    this.fetching = false
  }

  async fetchCastles() {
    return fetch('/castles-data.json')
      .then(response => response.json())
      .then(data => {
        return this.$store.commit('updateCastles', data)
      })
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';
</style>
