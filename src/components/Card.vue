<template lang="pug">

  .card
    header.card-header(
      ref="cardHeader"
    )
      slot(name="header")

    main.card-content
      slot(name="content")

</template>
<script lang="ts">
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'

@Component({
  computed: mapState(['mapView']),
})
export default class Card extends Vue {
  @Ref('cardHeader') cardHeaderEl!: HTMLElement

  mapView!: any

  mounted() {
    window.addEventListener('resize', this.onResize)
    document.fonts.ready.then(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }

  onResize = debounce(() => {
    this.updateMapPadding()
    this.updateSheetProperty()
  }, 400)

  updateMapPadding() {
    const w = window.innerWidth
    let bottom = this.mapView.padding.bottom
    let left = 0

    if (w >= 768) {
      left = 360
      bottom = 0
    }

    this.$store.commit('updatePadding', { left, bottom })
  }

  updateSheetProperty() {
    document.documentElement.style.setProperty(
      '--sheet-bottom',
      `${this.cardHeaderEl?.clientHeight}px`
    )
  }
}
</script>
