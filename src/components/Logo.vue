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
  #lid {
    transition: 160ms;
  }

  &:hover #lid {
    transition: 80ms;
    d: path(
      'M312.5,1766.67l-45.833,0l0,-750l2133.33,0l0,750l-45.833,0c-232.882,371.792 -603.613,612.5 -1020.83,612.5c-417.22,0 -787.951,-240.708 -1020.83,-612.5Z'
    );
  }
}
</style>
