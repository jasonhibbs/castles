<template lang="pug">

  .card
    p Hello World

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {}
</script>
<style lang="scss">
.card {
  background-color: var(--color-root);
  padding: 1px;
  min-height: 100vh;
  box-shadow: 0 0 12px var(--shade-light), 0 0 0 1px var(--shade-lightest);
  border-radius: 12px 12px 0 0;

  &:before {
    $width: 36px;
    content: '';
    border-radius: 2px;
    height: 4px;
    width: $width;
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    background-color: currentColor;
    opacity: 0.1;
    transition: top 0.2s, opacity 0.2s;
  }

  ._top & {
    border-radius: 0;

    &:before {
      top: -6px;
      opacity: 0;
    }
  }
}
</style>
