---
badges:
  - removed
---

# $children <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

A propriedade de instância `$children` foi removida do Vue 3.0 e não é mais suportada.

## Sintaxe v2.x

Na v2.x, os desenvolvedores podiam acessar componentes filhos diretos da instância atual com `this.$children`:

```vue
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <my-button>Alterar logotipo</my-button>
  </div>
</template>

<script>
import MyButton from './MyButton'

export default {
  components: {
    MyButton
  },
  mounted() {
    console.log(this.$children) // [VueComponent]
  }
}
</script>
```

## Atualização v3.x

Na v3.x, a propriedade `$children` foi removida e não é mais suportada. Em vez disso, se você precisar acessar uma instância de componente filho, recomendamos usar [$refs](/guide/component-template-refs.html#refs-de-template).

## Estratégia de Migração

[Sinalizador na compilação de migração: `INSTANCE_CHILDREN`](migration-build.html#configuracao-de-compatibilidade)
