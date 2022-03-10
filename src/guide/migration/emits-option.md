---
title: Opção emits
badges:
  - new
---

# Opção `emits` <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

O Vue 3 agora oferece uma opção `emits`, semelhante à opção `props` existente. Esta opção pode ser usada para definir os eventos que um componente pode emitir para seu pai.

## Comportamento v2.x

No Vue 2, você pode definir as props que um componente recebe, mas não pode declarar quais eventos ele pode emitir:

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
```

## Comportamento v3.x

Semelhante a props, os eventos que o componente emite agora podem ser definidos com a opção `emits`:

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted']
  }
</script>
```

A opção também aceita um objeto, que permite ao desenvolvedor definir validadores para os argumentos que são passados ​​com o evento emitido, semelhante aos validadores nas definições de `props`.

Para obter mais informações sobre isso, leia a [documentação da API para este recurso](../../api/options-data.md#emits).

## Estratégia de Migração

É altamente recomendado que você documente todos os eventos emitidos por cada um de seus componentes usando `emits`.

Isso é especialmente importante por causa da [remoção do modificador `.native`](./v-on-native-modifier-removed.md). Quaisquer escutadores para eventos que não são declarados com `emits` agora serão incluídos no `$attrs` do componente, que por padrão será vinculado ao nó raiz do componente.

### Exemplo

Para componentes que reemitem eventos nativos para seus pais, isso agora levaria ao disparo de dois eventos:

```vue
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // sem evento declarado
}
</script>
```

Quando um pai escuta o evento `click` no componente:

```html
<my-button v-on:click="handleClick"></my-button>
```

agora seria acionado _duas vezes_:

- Uma vez de `$emit()`.
- Uma vez de um escutador de evento nativo aplicado ao elemento raiz.

Aqui você tem duas opções:

1. Declare corretamente o evento `click`. Isso é útil se você realmente adicionar alguma lógica a esse manipulador de eventos em `<my-button>`.
2. Remova a reemissão do evento, pois o pai agora pode escutar o evento nativo facilmente, sem adicionar `.native`. Adequado quando você realmente apenas reemite o evento de qualquer maneira.

## Veja também

- [RFC relevante](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)
- [Guia de migração - modificador `.native` removido](./v-on-native-modifier-removed.md)
- [Guia de migração - `$listeners` removido](./listeners-removed.md)
- [Guia de migração - `$attrs` inclui `class` e `style`](./attrs-includes-class-style.md)
- [Guia de migração - Mudanças na API de Funções de Renderização](./render-function-api.md)
