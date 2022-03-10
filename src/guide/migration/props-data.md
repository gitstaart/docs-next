---
badges:
  - removed
---

# `propsData` <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

A opção `propsData`, usada para passar props para a instância Vue durante sua criação, foi removida. Para passar props para o componente raiz de um aplicativo Vue 3, use o segundo argumento de [createApp](/api/global-api.html#createapp).

## Sintaxe v2.x

Na versão 2.x, conseguíamos passar props para uma instância do Vue durante sua criação:

```js
const Comp = Vue.extend({
  props: ['username'],
  template: '<div>{{ username }}</div>'
})

new Comp({
  propsData: {
    username: 'Evan'
  }
})
```

## Atualização 3.x

A opção `propsData` foi removida. Se você precisar passar props para a instância do componente raiz durante sua criação, você deve usar o segundo argumento de `createApp`:

```js
const app = createApp(
  {
    props: ['username'],
    template: '<div>{{ username }}</div>'
  },
  { username: 'Evan' }
)
```
