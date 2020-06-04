<template lang="pug">

  .marker.castle-marker
    .marker-pin
      .marker-head
      .marker-shaft
    .marker-label
      .marker-label-content {{ label }}


</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class CastleMarker extends Vue {
  @Prop() castle!: any

  get label() {
    return this.castle.name
  }
}
</script>
