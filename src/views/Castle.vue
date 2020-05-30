<template lang="pug">

  card
    template(#header)
      .layout
        h1 {{ title }}

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

@Component({
  components: { Card, Loader },
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
