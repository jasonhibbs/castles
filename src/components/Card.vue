<template lang="pug">

  .card
    header.card-header(
      ref="cardHeader"
      @click="$root.$emit('togglesheet')"
    )
      .layout
        slot(name="header")
        router-link.card-header-close(
          v-if="dismiss"
          :title="dismiss"
          :to="{ name: 'Home' }"
          @click.native.stop
        )
          icon-close

    main.card-content
      slot(name="content")

</template>
<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
import IconClose from '@/components/IconClose.vue'

@Component({
  components: { IconClose },
  computed: mapState(['mapView']),
})
export default class Card extends Vue {
  @Ref('cardHeader') cardHeaderEl!: HTMLElement
  @Prop({ default: '' }) dismiss!: string

  mapView!: any

  mounted() {
    window.addEventListener('resize', this.onResize)
    document.fonts.ready.then(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
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
      left = 320
      bottom = 20
    }

    this.$store.commit('updatePadding', { left, bottom })
  }

  updateSheetProperty() {
    if (this.cardHeaderEl) {
      document.documentElement.style.setProperty(
        '--sheet-bottom',
        `${this.cardHeaderEl.clientHeight}px`
      )
      this.$root.$emit('checksheet')
    }
  }
}
</script>
