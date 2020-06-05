<template lang="pug">


  card.card-castle
    template(#header)
      .layout

        .heading(v-if="castle")
          h1 {{ title }}
          span(
            v-if="distance"
          ) {{ distanceRangeLabel }}

        .heading(v-else)
          h1 404

        router-link(
          title="Dismiss castle"
          :to="'/'"
          @click.native.stop
        )
          icon-close

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
import IconClose from '@/components/IconClose.vue'

@Component({
  components: { Card, Loader, IconClose },
  computed: mapState(['mapView']),
})
export default class Castle extends Vue {
  mapView!: any
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
    this.castle = await this.fetchCastle(this.id)
    // ease from data if necessary
    if (!storeCoords && this.castle?.coords) {
      this.easeToCastle()
    }
  }

  // Setup

  async fetchCastle(id: string) {
    return fetch('/castles-data.json')
      .then(response => response.json())
      .then(data => {
        this.fetching = false
        return data.find((c: any) => this.id === c.id)
      })
  }

  async easeToCastle(lat?: number, lng?: number) {
    if (!this.$store.state.map) {
      setTimeout(() => this.easeToCastle(lat, lng), 100)
      return
    }

    if (!lng || !lat) {
      lng = this.coords.lng
      lat = this.coords.lat
    }

    this.$root.$emit('raisesheet')
    this.$root.$emit('locationchange', {
      center: [lng, lat],
    })
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

.card-castle .card-header {
  padding: 0;

  .layout {
    display: flex;
    width: auto;
    min-height: rem(64);
  }

  .heading {
    flex: auto;
    margin: rem(16) 0;
    margin-left: rem(var(--screen-padding-x));

    span {
      display: inline-block;
      margin-top: rem(8);
    }
  }

  a {
    $size: 28;
    $margin: 18;
    display: flex;
    align-items: center;
    flex: none;
    font-size: rem($size);
    text-align: right;
    padding: 0 rem($margin);
    max-height: rem($size + ($margin * 2));

    &:focus {
      outline: none;
      .icon-close {
        box-shadow: 0 0 0 3px var(--contrast-light);
      }
    }
  }
}

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
