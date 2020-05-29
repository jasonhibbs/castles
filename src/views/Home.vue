<template lang="pug">

  card
    template(#header)
      .layout
        h1 Where should thou test thine eyes?
        h2 A map of English castles

    template(#content)
      .layout
        p According to the UK Prime Minister’s chief adviser, vision is ideally checked via the operation of a motor vehicle travelling toward a castle approximately 31.3 kilometres from your residence.
        p Tap anywhere on the map (or the compass arrow) to draw a circle around a location and discover the ideal castle for you.
        p Disclaimer: please do not actually drive while your eyesight is below #[a(href="https://www.gov.uk/driving-eyesight-rules#standards-of-vision-for-driving") the standards of vision for driving].

</template>
<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import Card from '@/components/Card.vue'

@Component({
  components: { Card },
})
export default class Home extends Vue {}
</script>
