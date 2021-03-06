<template lang="pug">


  transition(
    appear
    name="sheet"
    @enter="onEnter"
  )
    .sheet-context
      .sheet(
        ref="sheet"
        :class="classes"
        @scroll="onScroll"
      )
        .sheet-margin(
          ref="sheetMargin"
          @click="deactivate"
          @mouseenter="deactivate"
          @touchstart="deactivate"
          @touchmove="deactivate"
        )
        .sheet-stop._top(
          ref="stopTop"
        )
        .sheet-stop._mid(
          ref="stopMid"
        )
        .sheet-stop._bottom(
          ref="stopBottom"
        )
        .sheet-content(
          @mouseenter="activate"
          @mouseleave="deactivate"
          @touchstart="activate"
        )
          slot

      .scroll-margin(
        ref="scrollMargin"
      )

</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

@Component
export default class BottomSheet extends Vue {
  @Prop({ default: false }) peek!: boolean

  @Ref('sheet') sheetEl!: HTMLElement
  @Ref('sheetMargin') sheetMarginEl!: HTMLElement
  @Ref('stopTop') stopTopEl!: HTMLElement
  @Ref('stopMid') stopMidEl!: HTMLElement
  @Ref('stopBottom') stopBottomEl!: HTMLElement
  @Ref('scrollMargin') scrollMarginEl!: HTMLElement

  scrolled = false
  scrollTop = 0

  height = 0
  stop: 'top' | 'middle' | 'bottom' | 'between' = 'bottom'

  willDismiss = false
  dismissed = false

  willInteract = true
  interactive = false

  get classes() {
    return [
      {
        _interactive: this.interactive,
        _scrolled: this.scrolled,
        _top: this.atTop || this.scrolled,
        _mid: this.atMid,
        _bottom: this.atBottom,
      },
    ]
  }

  mounted() {
    this.$root.$on('raisesheet', () => this.atBottom && this.toMid())
    this.$root.$on('lowersheet', () => !this.atBottom && this.toBottom())
    this.$root.$on('togglesheet', this.toggle)
    this.$root.$on('checksheet', this.check)
    this.onScroll()
  }

  activate() {
    this.interactive = this.willInteract
  }

  deactivate() {
    this.interactive = false
  }

  dismiss() {
    if (!this.dismissed) {
      this.dismissed = true
      this.$emit('dismiss')
    }
  }

  check() {
    // This is a collection of hacks trying to fix issues relating to
    // adjusting the scroll height based on content of the sheet
    // They don’t really work

    // Safari is fine until the user has scrolled the sheet
    // then it seems to need a kick
    if (this.isSafari) {
      window.dispatchEvent(new Event('scroll'))
    }

    // The new scroll height tends to end up between
    // when it should be in the middle
    if (this.atBetween) {
      this.toMid()
    }

    // Firefox responds to this
    if (this.isFirefox) {
      this.sheetEl.scroll()
    }
  }

  // Sniffs

  get isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  }

  get isFirefox() {
    return 'netscape' in window
  }

  // Stops

  toggle() {
    if (this.atMid) {
      this.toTop()
    } else {
      this.toMid()
    }
  }

  toTop() {
    this.sheetEl.scrollTop = this.stopTopEl.offsetTop
    this.activate()
  }

  toMid() {
    this.sheetEl.scrollTop = this.stopMidEl.offsetTop
  }

  toBottom() {
    this.sheetEl.scrollTop = this.stopBottomEl.offsetTop
  }

  setStop(stop: 'top' | 'middle' | 'bottom' | 'between') {
    this.stop = stop
    this.$store.dispatch('sheetScrolled', { stop, height: this.height })
  }

  get atTop() {
    return this.stop === 'top'
  }

  get atMid() {
    return this.stop === 'middle'
  }

  get atBottom() {
    return this.stop === 'bottom'
  }

  get atBetween() {
    return this.stop === 'between'
  }

  // Events

  onEnter() {
    this.peek ? this.toBottom() : this.toMid()
  }

  onScroll() {
    if (this.sheetEl && !this.dismissed) {
      const delta = this.sheetEl.scrollTop - this.scrollTop
      const top = this.sheetMarginEl.clientHeight
      const context = window.innerHeight - this.stopTopEl.offsetTop

      this.scrolled = false
      this.scrollTop = this.sheetEl.scrollTop
      this.height = this.scrollTop + context

      switch (true) {
        case this.scrollTop >= top:
          this.setStop('top')
          this.scrollMarginEl.style.height = '0'
          if (this.scrollTop > top) {
            this.scrolled = true
          }
          return
        case this.scrollTop === this.stopMidEl.offsetTop:
          this.setStop('middle')
          break
        case this.scrollTop <= 0:
          this.setStop('bottom')
          break
        default:
          this.setStop('between')
          break
      }

      if (this.willDismiss) {
        const minHeight = this.stopBottomEl.offsetTop / 2
        if (delta < 0 && this.sheetEl.scrollTop < minHeight) {
          this.scrollMarginEl.style.height = '0'
          this.dismiss()
          return
        }
      }

      this.scrollMarginEl.style.height = `${this.sheetEl.scrollTop}px`
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/util';

$sheet-breakpoint: 641px;
$sheet-max-viewport: 412;

:root {
  --sheet-top: 0;
  --sheet-mid: 50%;
  --sheet-bottom: 8rem;

  --sheet-offset-top: var(--sheet-top);
  --sheet-offset-bottom: calc(
    var(--sheet-bottom) + env(safe-area-inset-bottom)
  );

  --sheet-slide-duration: 0.25s;
}

.sheet {
  position: absolute;
  top: var(--sheet-offset-top);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  pointer-events: none;
  overflow: hidden;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;

  max-width: rem($sheet-max-viewport + 40);
  padding: 0;
  padding-left: env(safe-area-inset-left);
  padding-right: calc(env(safe-area-inset-left) / 2);

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    display: none;
  }

  &._interactive {
    pointer-events: auto;
    overflow-y: scroll;
  }

  &._scrolled {
    scroll-snap-type: none;
  }

  @media (min-width: $sheet-breakpoint) {
    max-width: rem(400);
  }
}

.sheet-content {
  max-width: rem($sheet-max-viewport);
  margin: auto;
  position: relative;
  pointer-events: auto;

  scroll-snap-align: start;
  scroll-snap-stop: always;

  @media (min-width: $sheet-breakpoint) {
    max-width: rem(360);
  }
}

.sheet-margin {
  position: relative;
  width: 100%;
  background: transparent;
  height: calc(100% - var(--sheet-offset-bottom));
  will-change: height;

  ._bottom & {
    transition: height 0.4s ease-out;
  }
}

.sheet-stop {
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
    $mid: (66.666% / (144 / 89));
    top: calc(#{$mid} - var(--sheet-offset-bottom));
    scroll-snap-align: start;
    scroll-snap-stop: always;

    @media (max-height: 32em) {
      top: calc(100% - 5.5rem - var(--sheet-offset-bottom));
    }
  }

  &._bottom {
    top: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
}

.scroll-margin {
  position: absolute;
  left: 0;
  top: 100%;
  width: 1px;
}

// Animation

.sheet-enter,
.sheet-leave-to {
  opacity: 0;

  .sheet {
    transform: translateY(100vh);
  }
}

.sheet-enter-active {
  scroll-behavior: auto;
  transition: opacity 0.1s, visibility var(--sheet-slide-duration);

  .sheet {
    transition: transform var(--sheet-slide-duration)
      cubic-bezier((1/4), (10/12), (1/10), 1);
  }
}

.sheet-leave-active {
  transition: opacity 0.1s 0.2s, visibility var(--sheet-slide-duration);

  .sheet {
    transition: transform var(--sheet-slide-duration)
      cubic-bezier((1/4), (10/12), (1/10), 1);
  }
}
</style>
