<template>
  <div class="theme-container">
    <div class="theme-default-content">
      <h1>404</h1>

      <blockquote>
        <p>Opa! Esta página não existe.</p>
      </blockquote>

      <p v-show="isTranslation">
        Novas páginas são adicionadas à documentação o tempo todo. Esta página pode não estar incluída em todas as traduções ainda.
      </p>

      <RouterLink to="/">
        Me leve para home.
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { repos } from '../../components/guide/contributing/translations-data.js'

export default {
  data () {
    return {
      isTranslation: false
    }
  },

  mounted () {
    const toOrigin = url => (String(url).match(/https?:\/\/[^/]+/) || [])[0]
    const referrer = toOrigin(document.referrer)

    // Did we get here from a translation?
    if (referrer && referrer !== location.origin && repos.some(({ url }) => toOrigin(url) === referrer)) {
      this.isTranslation = true
    }
  }
}
</script>
