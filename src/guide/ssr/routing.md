# Roteamento e Divisão de Código

## Roteamento com `vue-router`

Você deve ter notado que nosso código de servidor usa um manipulador `*` que aceita URLs arbitrários. Isso nos permite passar a URL visitada para nosso aplicativo Vue e reutilizar a mesma configuração de roteamento para cliente e servidor!

Recomenda-se usar a biblioteca oficial [vue-router](https://github.com/vuejs/vue-router-next) para esta finalidade. Vamos primeiro criar um arquivo onde criamos o roteador. Observe que, semelhante à instância do aplicativo, também precisamos de uma nova instância do roteador para cada solicitação, portanto, o arquivo exporta uma função `createRouter`:

```js
// router.js
import { createRouter } from 'vue-router'
import MyUser from './components/MyUser.vue'

const routes = [{ path: '/user', component: MyUser }]

export default function (history) {
  return createRouter({
    history,
    routes
  })
}
```

E atualize nossas entradas de cliente e servidor:

```js
// entry-client.js
import { createSSRApp } from 'vue'
import { createWebHistory } from 'vue-router'
import createRouter from './router.js'
import App from './App.vue'

// ...

const app = createSSRApp(App)

const router = createRouter(createWebHistory())

app.use(router)

// ...
```

```js
// entry-server.js
import { createSSRApp } from 'vue'
// o roteador do servidor usa um histórico diferente do cliente
import { createMemoryHistory } from 'vue-router'
import createRouter from './router.js'
import App from './App.vue'

export default function () {
  const app = createSSRApp(App)
  const router = createRouter(createMemoryHistory())

  app.use(router)

  return {
    app,
    router
  }
}
```

## Divisão de Código

Dividir código, ou carregar preguiçosamente parte do seu aplicativo, ajuda a reduzir o tamanho dos _assets_ que precisam ser baixados pelo navegador para a renderização inicial e pode melhorar muito o TTI (tempo até a interatividade) para aplicativos com grandes pacotes. A chave é "carregar apenas o que é necessário" para a tela inicial.

O Vue Router fornece [suporte a carregamento preguiçoso](https://next.router.vuejs.org/guide/advanced/lazy-loading.html), permitindo o [webpack dividir o código naquele ponto](https://webpack.js.org/guides/code-splitting-async/). Tudo que você precisa fazer é:

```js
// mude isso...
import MyUser from './components/MyUser.vue'
const routes = [{ path: '/user', component: MyUser }]

// para isso:
const routes = [
  { path: '/user', component: () => import('./components/MyUser.vue') }
]
```

Tanto no cliente quanto no servidor, precisamos esperar que o roteador resolva os componentes de rota assíncrona antecipadamente para invocar corretamente os gatilhos no componente. Para isso, usaremos o método [router.isReady](https://next.router.vuejs.org/api/#isready). Vamos atualizar nossa entrada de cliente:

```js
// entry-client.js
import { createSSRApp } from 'vue'
import { createWebHistory } from 'vue-router'
import createRouter from './router.js'
import App from './App.vue'

const app = createSSRApp(App)

const router = createRouter(createWebHistory())

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
```

Também precisamos atualizar nosso script `server.js`:

```js
// server.js
const path = require('path')

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.get('*', async (req, res) => {
  const { app, router } = createApp()

  await router.push(req.url)
  await router.isReady()

  const appContent = await renderToString(app)

  fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, html) => {
    if (err) {
      throw err
    }

    html = html
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })
})
```
