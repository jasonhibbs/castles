<template lang="pug">

  card
    template(#header)

      .heading
        h1 Where should thou test thine eyes?
        h2 A map of English castles

    template(#content)
      .layout
        p According to the UK Prime Minister’s Chief Adviser, vision is best checked via the operation of a motor vehicle travelling towards a castle approximately 31.4 kilometres from your estate.
        p {{ locationHint }} to mark your location and discover the ideal castles for you.
        p Privacy: your location isn’t used beyond this website.
        p Disclaimer: please do not actually drive while your eyesight is below #[a(href="https://www.gov.uk/driving-eyesight-rules#standards-of-vision-for-driving") the standards of vision for driving].

      footer
        .layout
          p Castles from #[a(href="https://en.wikipedia.org/wiki/List_of_castles_in_England") Wikipedia]
          p Built with #[a(href="https://vuejs.org/") Vue]
          p Powered by #[a(href="https://www.netlify.com/") Netlify]
          p.vcard.h-card Made by #[a.p-name.u-url.fn.url(href="https://jasonhibbs.co.uk") Jason Hibbs]


</template>
<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import Card from '@/components/Card.vue'

@Component({
  components: { Card },
})
export default class Home extends Vue {
  get hasGeolocation() {
    return !!navigator.geolocation && window.location.protocol.includes('https')
  }

  get locationHint() {
    return !this.hasGeolocation
      ? 'Long-press anywhere on the map'
      : 'Tap the compass arrow (or long-press anywhere on the map)'
  }
}
</script>
