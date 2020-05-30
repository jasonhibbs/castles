<template lang="pug">

  .logo
    inline-svg.inline-svg(:src="`/img/logo.svg`")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import InlineSvg from 'vue-inline-svg'

@Component({
  components: { InlineSvg },
})
export default class Logo extends Vue {}
</script>

<style lang="scss">
.logo {
  path#crest,
  path#cornea {
    fill: var(--color-text);
  }

  path#eye {
    fill: var(--color-root);
  }
}
</style>
