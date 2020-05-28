<template lang="pug">

  card
    template(#header)
      .layout
        h1 Where should thou test thine eyes?
        h2 A map of English castles

    template(#content)

</template>
<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import Card from '@/components/Card.vue'

@Component({
  components: { Card },
})
export default class Home extends Vue {}
</script>
