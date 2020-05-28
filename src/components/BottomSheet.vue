<template lang="pug">


  transition(
    appear
    name="sheet"
    @enter="enter"
  )
    .overlay-context
      .overlay(
        ref="overlay"
        :class="classes"
        @scroll="scroll"
      )
        .overlay-margin(
          ref="overlayMargin"
          @mouseover="elide"
          @click="elide"
          @touchstart="elide"
          @touchmove="elide"
        )
        .overlay-stop._top(
          ref="stopTop"
        )
        .overlay-stop._mid(
          ref="stopMid"
        )
        .overlay-stop._bottom(
          ref="stopLow"
        )
        .overlay-content(
          @mouseover="activate"
          @touchstart="activate"
        )
          slot

      .scroll-margin(
        ref="scrollMargin"
      )

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BottomSheet extends Vue {
  @Prop({ default: true }) peek!: boolean

  onClient = false
  interactive = true
  scrolled = false
  atTop = true
  dismissed = false
  scrollTop = 0

  get classes() {
    return [
      {
        _interactive: this.interactive,
        _scrolled: this.scrolled,
        _top: this.atTop || this.scrolled,
      },
    ]
  }

  mounted() {
    this.onClient = true
    // document.addEventListener('touchend', this.elide)
    this.$on('raise', this.toMid)
    this.$on('lower', this.toBottom)
  }

  destroyed() {
    document.removeEventListener('touchend', this.documentTouchEnd)
  }

  documentTouchEnd(t: any) {
    const activeEl = document.activeElement
    if (activeEl && 'input' !== activeEl.tagName.toLowerCase()) {
      setTimeout(() => {
        this.activate()
      }, 10)
    }
  }

  enter() {
    this.peek ? this.toBottom() : this.toMid()
  }

  toTop() {
    // this.$refs.overlay.scrollTop = this.$refs.overlay.clientHeight
    this.$refs.overlay.scrollTop = this.$refs.stopTop.offsetTop
    this.activate()
  }

  toMid() {
    this.$refs.overlay.scrollTop = this.$refs.stopMid.offsetTop
  }

  toBottom() {
    this.$refs.overlay.scrollTop = this.$refs.stopLow.offsetTop
  }

  activate() {
    this.interactive = true
  }

  elide() {
    this.interactive = false
  }

  dismiss() {
    if (!this.dismissed) {
      this.dismissed = true
      this.$emit('dismiss')
    }
  }

  scroll(e: Event) {
    const overlayEl = this.$refs.overlay as HTMLElement
    const overlayMarginEl = this.$refs.overlayMargin as HTMLElement
    // const stopMidEl = this.$refs.stopMid as HTMLElement
    // const stopLowEl = this.$refs.stopLow as HTMLElement
    const scrollMarginEl = this.$refs.scrollMargin as HTMLElement

    if (overlayEl && !this.dismissed) {
      const delta = overlayEl.scrollTop - this.scrollTop
      this.scrollTop = overlayEl.scrollTop

      if (this.scrollTop >= overlayMarginEl.clientHeight) {
        scrollMarginEl.style.height = '0'
        this.atTop = true

        if (this.scrollTop > overlayMarginEl.clientHeight) {
          this.scrolled = true
        }

        return
      }

      this.atTop = false
      this.scrolled = false
      // var minHeight = stopLowEl.offsetTop / 2

      // if (delta < 0 && overlayEl.scrollTop < minHeight) {
      //   scrollMarginEl.style.height = '0'
      //   this.dismiss()
      //   return
      // }

      scrollMarginEl.style.height = `${overlayEl.scrollTop}px`
    }
  }
}
</script>

<style lang="scss">
:root {
  --sheet-offset-top: 0;
  --sheet-offset-bottom: calc(5.25rem + env(safe-area-inset-bottom));
  --sheet-slide-duration: 0.25s;
}

.overlay {
  -webkit-overflow-scrolling: touch;

  position: absolute;
  top: var(--sheet-offset-top);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  pointer-events: none;
  overflow: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  -ms-overflow-style: none;

  max-width: (420rem/16);

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    display: none;
  }

  &._interactive {
    pointer-events: auto;
    overflow-y: scroll;
  }
}

.overlay-margin {
  position: relative;
  width: 100%;
  height: calc(100% - var(--sheet-offset-bottom));
  background: none;
}

.overlay-stop {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: block;
  position: absolute;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 1px;
  // background-color: #f0f;

  &._top {
    top: calc(100% - var(--sheet-offset-bottom));
  }

  &._mid {
    top: calc(50% - var(--sheet-offset-bottom));
  }

  &._bottom {
    top: 0;
  }
}

.scroll-margin {
  position: absolute;
  left: 0;
  top: 100%;
  width: 1px;
}

.overlay-content {
  max-width: (380rem/16);
  margin: auto;
  position: relative;
  pointer-events: auto;
}

// Animation

.sheet-enter,
.sheet-leave-to {
  opacity: 0;

  .overlay {
    transform: translateY(100vh);
  }
}

.sheet-enter-active {
  scroll-behavior: auto;
  transition: opacity 0.1s, visibility var(--sheet-slide-duration);

  .overlay {
    transition: transform var(--sheet-slide-duration)
      cubic-bezier((1/4), (10/12), (1/10), 1);
  }
}

.sheet-leave-active {
  transition: opacity 0.1s 0.2s, visibility var(--sheet-slide-duration);

  .overlay {
    transition: transform var(--sheet-slide-duration)
      cubic-bezier((1/4), (10/12), (1/10), 1);
  }
}
</style>
