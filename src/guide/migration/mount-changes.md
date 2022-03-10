---
title: 'Alterações na API de Montagem'
badges:
  - breaking
---

# O aplicativo montado não substitui o elemento <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

No Vue 2.x, ao montar uma aplicação que tem um `template`, o conteúdo renderizado substitui o elemento em que montamos. No Vue 3.x, o aplicativo renderizado é anexado como filho de tal elemento, substituindo o `innerHTML` do elemento.

## Sintaxe v2.x

No Vue 2.x, passamos um seletor de elemento HTML para `new Vue()` ou `$mount`:

```js
new Vue({
  el: '#app',
  data() {
    return {
      message: 'Olá Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

// ou
const app = new Vue({
  data() {
    return {
      message: 'Olá Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

app.$mount('#app')
```

Quando montamos esta aplicação na página que tem um `div` com o seletor passado (no nosso caso, é `id="app"`):

```html
<body>
  <div id="app">
    Algum conteúdo de aplicativo
  </div>
</body>
```

no resultado renderizado, o `div` mencionado será substituído pelo conteúdo do aplicativo renderizado:

```html
<body>
  <div id="rendered">Olá Vue!</div>
</body>
```

## Sintaxe v3.x

No Vue 3.x, quando montamos uma aplicação, seu conteúdo renderizado substituirá o `innerHTML` do elemento que passamos para `mount`:

```js
const app = Vue.createApp({
  data() {
    return {
      message: 'Olá Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

app.mount('#app')
```

Quando este aplicativo é montado na página que tem um `div` com `id="app"`, isso resultará em:

```html
<body>
  <div id="app" data-v-app="">
    <div id="rendered">Olá Vue!</div>
  </div>
</body>
```

## Estratégia de Migração

[Sinalizador na compilação de migração: `GLOBAL_MOUNT_CONTAINER`](migration-build.html#configuracao-de-compatibilidade)

## Veja também

- [API `mount`](/api/application-api.html#mount)
