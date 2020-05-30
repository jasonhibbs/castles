<template lang="pug">

  card.card-castle
    template(#header)
      .layout
        h1 {{ title }}
        router-link(
          title="Dismiss castle"
          :to="'/'"
          @click.native.stop
        )
          icon-close

    template(#content)
      .layout
        loader(v-if="fetching") Loading…
        template(v-else)
          template(v-if="!castle")
            p No castle found by that name…
          template(v-else)
            p {{ castle.description }}

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Card from '@/components/Card.vue'
import Loader from '@/components/Loader.vue'
import IconClose from '@/components/IconClose.vue'

@Component({
  components: { Card, Loader, IconClose },
})
export default class Caslte extends Vue {
  castle: any = {}
  fetching: boolean = true

  get id() {
    return this.$route.params.id
  }

  get title() {
    return this.castle?.name || this.id
  }

  async fetchCastle(id: string) {
    return fetch('/castles-data.json')
      .then(response => response.json())
      .then(data => {
        this.fetching = false
        return data.find((c: any) => this.id === c.id)
      })
  }

  async mounted() {
    this.castle = await this.fetchCastle(this.id)
  }
}
</script>
<style lang="scss">
@import '../assets/scss/util';

.card-castle .card-header {
  padding: 0;

  .layout {
    display: flex;
    width: auto;
  }

  h1 {
    flex: auto;
    margin: rem(16) 0 rem(16);
    margin-left: rem(var(--screen-padding-x));
  }

  a {
    $size: 28;
    $margin: 16;
    display: flex;
    align-items: center;
    flex: none;
    font-size: rem($size);
    text-align: right;
    padding: 0 rem($margin);
    max-height: rem($size + ($margin * 2));

    &:focus {
      outline: none;
      .icon-close {
        box-shadow: 0 0 0 3px var(--contrast-light);
      }
    }
  }
}
</style>
