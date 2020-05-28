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
import debounce from 'lodash.debounce'

@Component
export default class Card extends Vue {
  @Ref('cardHeader') cardHeaderEl!: HTMLElement

  mounted() {
    window.addEventListener('resize', this.onResize)
    document.fonts.ready.then(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }

  onResize = debounce(() => {
    this.updateSheetProperty()
  }, 400)

  updateSheetProperty() {
    document.documentElement.style.setProperty(
      '--sheet-bottom',
      `${this.cardHeaderEl.clientHeight}px`
    )
  }
}
</script>
