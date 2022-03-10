# Começando

> Este guia atualmente está sob ativo desenvolvimento

## Instalação

Para criar um aplicativo renderizado no lado do servidor, precisamos instalar o pacote `@vue/server-renderer`:

```bash
npm install @vue/server-renderer
## OU
yarn add @vue/server-renderer
```

#### Notas

- Recomenda-se usar o Node.js em versão 12+.
- `@vue/server-renderer` e `vue` devem ter versões correspondentes.
- `@vue/server-renderer` depende de alguns módulos nativos do Node.js e, portanto, só pode ser usado no Node.js. Podemos fornecer uma versão mais simples que possa ser executada em outros _runtimes_ do JavaScript no futuro.

## Renderizando um Aplicativo Vue

Ao contrário de um aplicativo Vue _client-only_, que é criado usando `createApp`, um aplicativo SSR precisa ser criado usando `createSSRApp`:

```js
const { createSSRApp } = require('vue')

const app = createSSRApp({
  data() {
    return {
      user: 'John Doe'
    }
  },
  template: `<div>O usuário atual é: {{ user }}</div>`
})
```

Agora, podemos usar a função `renderToString` para renderizar nossa instância de aplicativo em uma string. Esta função retorna uma Promise que resolve para o HTML renderizado.

```js{2,13}
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

const app = createSSRApp({
  data() {
    return {
      user: 'John Doe'
    }
  },
  template: `<div>O usuário atual é: {{ user }}</div>`
})

const appContent = await renderToString(app)
```

## Integrando com um Servidor

Para executar uma aplicação, neste exemplo usaremos [Express](https://expressjs.com/):

```bash
npm install express
## OU
yarn add express
```

```js
// server.js

const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const server = require('express')()

server.get('*', async (req, res) => {
  const app = createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>O usuário atual é: {{ user }}</div>`
  })

  const appContent = await renderToString(app)
  const html = `
  <html>
    <body>
      <h1>Meu Primeiro Título</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `

  res.end(html)
})

server.listen(8080)
```

Agora, ao executar este script Node.js, podemos ver uma página HTML estática em `localhost:8080`. No entanto, este código não é _hidratado_: Vue ainda não assumiu o HTML estático enviado pelo servidor para transformá-lo em DOM dinâmico que pode reagir a alterações de dados _client-side_. Isso será abordado na seção [Hidratação _Client-Side_](hydration.html).
