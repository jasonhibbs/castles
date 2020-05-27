<template lang="pug">

  .castle-marker
    .castle-marker-pin
      .castle-marker-head
      .castle-marker-shaft
    .castle-marker-label
      .castle-marker-label-content {{ label }}


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
