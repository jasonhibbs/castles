<template lang="pug">


  card.card-castle(
    dismiss="Dismiss Castle"
  )

    template(#header)
      .heading(v-if="castle")
        h1 {{ title }}
        span(
          v-if="distance"
        ) {{ distanceRangeLabel }}

      .heading(v-else)
        h1 404

    template(#content)
      .layout

        loader(v-if="fetching") Loading…
        template(v-else)

          template(v-if="!castle")
            p No castle found by that name…

          template(v-else)
            ul.meta(v-if="meta")
              li(v-for="m in meta") {{ m }}
            p(v-if="castle.ownership") {{ castle.ownership }}
            p(v-if="description") {{ description }}
            p
              a(
                target="_blank"
                :href="castle.href"
              ) More on Wikipedia


</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import distance from '@turf/distance'
import Card from '@/components/Card.vue'
import Loader from '@/components/Loader.vue'

@Component({
  components: { Card, Loader },
  computed: mapState(['mapView', 'castles']),
})
export default class Castle extends Vue {
  mapView!: any
  castles!: []
  castle: any = {}
  fetching: boolean = true

  // Lifecycle

  async mounted() {
    // ease immediately if possible
    const storeCoords = this.mapView.selected?.geometry.coordinates
    if (storeCoords) {
      this.easeToCastle(storeCoords[1], storeCoords[0])
    }
    // fetch castle data
    this.castle = await this.getCastle(this.id)
    // ease from data if necessary
    if (!storeCoords && this.castle?.coords) {
      this.easeToCastle()
    }
  }

  // Setup

  async getCastle(id: string) {
    if (!this.castles.length) {
      await this.fetchCastles()
    }
    this.fetching = false
    return this.castles.find((c: any) => this.id === c.id)
  }

  async fetchCastles() {
    return fetch('/castles-data.json')
      .then(response => response.json())
      .then(data => {
        return this.$store.commit('updateCastles', data)
      })
  }

  async easeToCastle(lat?: number, lng?: number) {
    if (!this.$store.state.map) {
      setTimeout(() => this.easeToCastle(lat, lng), 100)
      return
    }

    if ((!lng || !lat) && this.coords) {
      lng = this.coords.lng
      lat = this.coords.lat
    }

    if (lng && lat) {
      this.$root.$emit('locationchange', {
        center: [lng, lat],
      })
    }

    this.$root.$emit('raisesheet')
  }

  // Detail

  get id() {
    return this.$route.params.id
  }

  get title() {
    return this.castle?.name || ''
  }

  get meta() {
    const { type, date, location } = this.castle
    const meta = [type, date, location].filter(x => !!x)
    return meta
  }

  get coords() {
    return this.castle.coords
  }

  get km() {
    if (!this.coords || !this.mapView.context) {
      return ''
    }
    const from = [this.mapView.context.lng, this.mapView.context.lat]
    const to = [this.coords.lng, this.coords.lat]
    return distance(from, to)
  }

  get range() {
    const magic = 31.37206463500155
    const range = 2
    switch (true) {
      case this.km > magic + range:
        return 1
      case this.km < magic - range:
        return -1
      default:
        return 0
    }
  }

  get distance() {
    const { km } = this
    if (km) {
      switch (true) {
        case km < 1:
          return `${km.toFixed(2) * 1000} m`
        case km > 100:
          return `${km.toFixed(0)} km`
        default:
          return `${km.toFixed(1)} km`
      }
    }
    return ''
  }

  get distanceRangeLabel() {
    switch (true) {
      case this.range > 0:
        return `${this.distance} – too far`
      case this.range < 0:
        return `${this.distance} – too near`
      default:
        return `${this.distance} — just right`
    }
  }

  get description() {
    return this.castle?.description?.replace(/\s(\w+)\W*$/, ` $1`)
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';

ul.meta {
  margin: 0;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding: 0;
  list-style: none;

  li {
    display: inline;

    &:not(:last-child):after {
      content: ' • ';
      color: var(--text-light);
    }
  }
}
</style>
