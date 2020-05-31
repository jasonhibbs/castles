<template lang="pug">

  .castle-markers
    mgl-marker(
      v-for="castle in castles"
      :key="castle.id"
      :coordinates="[castle.coords.lng, castle.coords.lat]"
    )
      castle-marker(
        slot="marker"
        :castle="castle"
        :aria-selected="castle.id === selected"
        @click.native="onClickMarker(castle.id)"
      )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { MglMarker } from 'vue-mapbox'
import CastleMarker from '@/components/CastleMarker.vue'

@Component({
  components: {
    MglMarker,
    CastleMarker,
  },
})
export default class CastleMarkers extends Vue {
  @Prop() castles: any

  get selected() {
    return this.$route.name === 'Castle' ? this.$route.params?.id : ''
  }

  onClickMarker(id: string) {
    // this.$router.push({ name: 'Castle', params: { id } })
  }
}
</script>
