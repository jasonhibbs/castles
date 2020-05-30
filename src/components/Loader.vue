<template lang="pug">

  span.loader
    span.loader-spinner
      span
    span.loader-label
      slot

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Loader extends Vue {}
</script>
<style lang="scss">
.loader {
  --size: 1.25em;
  --width: 2px;
  --light-color: var(--contrast-light);
  --color: var(--contrast-darker);
  --speed: #{(2s/3)};

  display: flex;
  align-items: center;
  color: currentColor;

  .loader-spinner,
  .loader-label {
    flex: none;
  }

  .loader-spinner {
    > span {
      display: block;
      width: var(--size);
      height: var(--size);
      border: var(--width) solid var(--color);
      border-top-color: var(--light-color) !important;
      border-radius: var(--size);
      animation: spin var(--speed) linear infinite;
    }
  }

  .loader-label:not(:empty) {
    margin-left: 0.5em;
  }

  @keyframes spin {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
}

[data-loading] {
  transition: opacity 0.2s;
  will-change: opacity;
}

[data-loading='true'] {
  opacity: (1/3);
}
</style>
