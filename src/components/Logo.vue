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
    transition: 180ms;
  }

  &:hover #lid {
    transition: 80ms;
    d: path(
      'M291.667,1766.67l-25,0l0,-750l2133.33,0l0,750l-25,0c-237.634,379.38 -615.931,625 -1041.67,625c-425.735,0 -804.032,-245.62 -1041.67,-625Z'
    );
  }
}
</style>
