# Estrutura do Código Fonte

## Evite _Singletons_ com Estado

Ao escrever código _client-only_, podemos supor que nosso código será executado em um novo contexto todas as vezes. No entanto, um servidor Node.js é um processo de longa execução. Quando nosso código é importado pela primeira vez pelo processo, ele será executado uma vez e depois ficará na memória. Isso significa que, se você criar um objeto _singleton_, ele será compartilhado entre todas as solicitações recebidas, com o risco de poluição do estado em solicitação cruzada.

```js
// ruim
import app from './app.js'

server.get('*', async (req, res) => {
  // o aplicativo agora é compartilhado entre todos os usuários
  const result = await renderToString(app)
  // ...
})
```

```js
// bom
function createApp() {
  return createSSRApp(/* ... */)
}

server.get('*', async (req, res) => {
  // cada usuário obtém seu próprio aplicativo
  const app = createApp()
  const result = await renderToString(app)
  // ...
})
```

Portanto, precisamos **criar uma nova instância Vue raiz para cada solicitação.** Para fazer isso, precisamos escrever uma função fabricadora que possa ser executada repetidamente para criar novas instâncias de aplicativo para cada solicitação:

```js
// server.js
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const express = require('express')

const server = express()

function createApp() {
  return createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>O usuário atual é: {{ user }}</div>`
  })
}

server.get('*', async (req, res) => {
  const app = createApp()

  const appContent = await renderToString(app)
  const html = `
  <html>
    <body>
      <h1>Meu primeiro título</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `

  res.end(html)
})

server.listen(8080)
```

A mesma regra também se aplica a outras instâncias (como o roteador ou o _store_). Em vez de exportar o roteador ou _store_ diretamente de um módulo e importá-lo em seu aplicativo, você deve criar uma nova instância em `createApp` e injetá-la da instância raiz do Vue sempre que uma nova solicitação for feita.

## Introduzindo uma Etapa de Construção

Até agora, ainda não discutimos como entregar o mesmo aplicativo Vue para o cliente. Para fazer isso, precisamos usar o webpack para empacotar nosso aplicativo Vue.

- Precisamos processar o código do servidor com webpack. Por exemplo, arquivos `.vue` precisam ser processados ​​com `vue-loader`, e muitos recursos específicos do webpack, como importar arquivos via `file-loader` ou importar CSS via `css-loader` não funcionam diretamente no Node.js.

- Da mesma forma, precisamos de uma compilação separada do lado do cliente porque, embora a versão mais recente do Node.js suporte totalmente os recursos do ES2015, os navegadores mais antigos exigirão que o código seja transpilado.

Portanto, a ideia básica é que usaremos o webpack para empacotar nosso aplicativo para ambos cliente e servidor. O pacote do servidor será necessário no servidor e usado para renderizar HTML estático, enquanto o pacote do cliente será enviado ao navegador para hidratar a marcação estática.

![arquitetura](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)

Discutiremos os detalhes da configuração em seções posteriores - por enquanto, vamos apenas supor que já descobrimos a configuração da compilação e podemos escrever o código do nosso aplicativo Vue com o webpack habilitado.

## Estrutura de Código com webpack

Agora que estamos usando o webpack para processar o aplicativo para servidor e cliente, a maior parte do nosso código-fonte pode ser escrito de maneira universal, com acesso a todos os recursos do webpack. Ao mesmo tempo, há várias coisas que você deve ter em mente ao [escrever código universal](./universal.html).

Um projeto simples ficaria assim:

```bash
src
├── components
│   ├── MyUser.vue
│   └── MyTable.vue
├── App.vue # a raiz do seu aplicativo
├── entry-client.js # executa apenas no navegador
└── entry-server.js # executa apenas no servidor
```

### `App.vue`

Você deve ter notado que agora temos um arquivo chamado `App.vue` na raiz da nossa pasta `src`. É onde o componente raiz do seu aplicativo será armazenado. Agora podemos mover com segurança o código do aplicativo de `server.js` para o arquivo `App.vue`:

```vue
<template>
  <div>O usuário atual é: {{ user }}</div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: 'John Doe'
    }
  }
}
</script>
```

### `entry-client.js`

A entrada do cliente cria o aplicativo usando o componente `App.vue` e o monta no DOM:

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

// lógica de inicialização específica do cliente...

const app = createSSRApp(App)

// isso assume que o elemento raiz do template de App.vue tem `id="app"`
app.mount('#app')
```

### `entry-server.js`

A entrada do servidor usa uma exportação padrão que é uma função que pode ser chamada repetidamente para cada renderização. Neste momento, ele não faz muito além de retornar a instância do aplicativo - mas mais tarde realizaremos a correspondência de rota do lado do servidor e a lógica de _pre-fetching_ de dados aqui.

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

export default function () {
  const app = createSSRApp(App)

  return {
    app
  }
}
```
