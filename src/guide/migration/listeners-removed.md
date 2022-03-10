---
title: $listeners removido
badges:
  - breaking
---

# `$listeners` removido <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

O objeto `$listeners` foi removido no Vue 3. Os escutadores de eventos agora fazem parte do `$attrs`:

```js
{
  text: 'este é um atributo',
  onClose: () => console.log('Evento close acionado')
}
```

## Sintaxe v2.x

No Vue 2, você pode acessar atributos passados ​​para seus componentes com `this.$attrs`, e escutadores de eventos com `this.$listeners`.
Em combinação com `inheritAttrs: false`, eles permitem que o desenvolvedor aplique esses atributos e escutadores a algum outro elemento em vez do elemento raiz:

```html
<template>
  <label>
    <input type="text" v-bind="$attrs" v-on="$listeners" />
  </label>
</template>
<script>
  export default {
    inheritAttrs: false
  }
</script>
```

## Sintaxe v3.x

No DOM virtual do Vue 3, os escutadores de eventos agora são apenas atributos, prefixados com `on`, e como tal são parte do objeto `$attrs`, então `$listeners` foi removido.

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

Se este componente recebeu um atributo `id` e um escutador `v-on:close`, o objeto `$attrs` agora ficará assim:

```js
{
  id: 'my-input',
  onClose: () => console.log('Evento close acionado')
}
```

## Estratégia de Migração

Remova todos os usos de `$listeners`.

[Sinalizador na compilação de migração: `INSTANCE_LISTENERS`](migration-build.html#configuracao-de-compatibilidade)

## Veja também

- [RFC relevante](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [Guia de migração - `$attrs` inclui `class` & `style`](./attrs-includes-class-style.md)
- [Guia de migração - Alterações na API de Funções de Renderização](./render-function-api.md)
- [Guia de migração - Nova Opção Emits](./emits-option.md)
- [Guia de migração - Modificador `.native` removido](./v-on-native-modifier-removed.md)
