# Configuração do Servidor

A [estrutura do código](./structure.html) e a [configuração do webpack](./build-config.html) que descrevemos também requerem algumas alterações no código do nosso servidor Express.

- precisamos criar um aplicativo com um `entry-server.js` construído a partir do pacote resultante. Um caminho para ele pode ser encontrado usando o _manifest_ do webpack:

  ```js
  // server.js
  const path = require('path')
  const manifest = require('./dist/server/ssr-manifest.json')

  // o nome 'app.js' é retirado do nome do ponto de entrada e mais um `.js`
  const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
  const createApp = require(appPath).default
  ```

- temos que definir caminhos corretos para todos os _assets_:

  ```js
  // server.js
  server.use(
    '/img',
    express.static(path.join(__dirname, './dist/client', 'img'))
  )
  server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
  server.use(
    '/css',
    express.static(path.join(__dirname, './dist/client', 'css'))
  )
  server.use(
    '/favicon.ico',
    express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
  )
  ```

- precisamos substituir o conteúdo de `index.html` pelo conteúdo do aplicativo renderizado no lado do servidor:

  ```js
  // server.js
  const indexTemplate = fs.readFileSync(
    path.join(__dirname, '/dist/client/index.html'),
    'utf-8'
  )

  server.get('*', async (req, res) => {
    const { app } = createApp()

    const appContent = await renderToString(app)

    const html = indexTemplate
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })
  ```

Abaixo você pode encontrar um código completo para o nosso servidor Express:

```js
const path = require('path')
const express = require('express')
const fs = require('fs')
const { renderToString } = require('@vue/server-renderer')
const manifest = require('./dist/server/ssr-manifest.json')

const server = express()

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.use('/img', express.static(path.join(__dirname, './dist/client', 'img')))
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
server.use('/css', express.static(path.join(__dirname, './dist/client', 'css')))
server.use(
  '/favicon.ico',
  express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
)

server.get('*', async (req, res) => {
  const { app } = createApp()

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

console.log('Você pode navegar para http://localhost:8080')

server.listen(8080)
```
