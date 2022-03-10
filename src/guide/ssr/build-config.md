# Configuração da Compilação

A configuração do webpack para um projeto SSR será semelhante a um projeto _client-only_. Se você não estiver familiarizado com a configuração do webpack, poderá encontrar mais informações na documentação do [Vue CLI](https://cli.vuejs.org/guide/webpack.html#working-with-webpack) ou [configurando o Vue Loader manualmente](https://vue-loader.vuejs.org/guide/#manual-setup).

## Principais Diferenças com Compilações _Client-Only_

1. Precisamos criar um [_manifest_ do webpack](https://webpack.js.org/concepts/manifest/) para nosso código do lado do servidor. Este é um arquivo JSON que o webpack mantém para rastrear como todos os módulos são mapeados para os pacotes finais.

2. Devemos [externalizar dependências de aplicativos](https://webpack.js.org/configuration/externals/). Isso torna a compilação do servidor muito mais rápida e gera um arquivo de pacote menor. Ao fazer isso, temos que excluir dependências que precisam ser processadas pelo webpack (como arquivos `.css`. ou `.vue`).

3. Precisamos alterar o [_target_](https://webpack.js.org/concepts/targets/) do webpack para Node.js. Isso permite que o webpack lide com importações dinâmicas de maneira apropriada ao Node, e também diz ao `vue-loader` para emitir código orientado ao servidor ao compilar componentes Vue.

4. Ao construir uma entrada de servidor, precisaríamos definir uma variável de ambiente para indicar que estamos trabalhando com SSR. Pode ser útil adicionar alguns `scripts` ao `package.json` do projeto:

```json
"scripts": {
  "build:client": "vue-cli-service build --dest dist/client",
  "build:server": "SSR=1 vue-cli-service build --dest dist/server",
  "build": "npm run build:client && npm run build:server",
}
```

## Exemplo de Configuração

Abaixo está um `vue.config.js` de exemplo que adiciona renderização SSR a um projeto Vue CLI, mas pode ser adaptado para qualquer compilação com webpack.

```js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  chainWebpack: webpackConfig => {
    // Precisamos desabilitar o cache loader, caso contrário a compilação do cliente
    // usará componentes em cache da compilação do servidor
    webpackConfig.module.rule('vue').uses.delete('cache-loader')
    webpackConfig.module.rule('js').uses.delete('cache-loader')
    webpackConfig.module.rule('ts').uses.delete('cache-loader')
    webpackConfig.module.rule('tsx').uses.delete('cache-loader')

    if (!process.env.SSR) {
      // Aponta a entrada para o arquivo de entrada do cliente do seu aplicativo
      webpackConfig
        .entry('app')
        .clear()
        .add('./src/entry-client.js')
      return
    }

    // Aponta a entrada para o arquivo de entrada do servidor do seu aplicativo
    webpackConfig
      .entry('app')
      .clear()
      .add('./src/entry-server.js')

    // Permite que o webpack lide com importações dinâmicas ao estilo Node
    // e também diz ao `vue-loader` para emitir código orientado ao servidor ao
    // compilar componentes Vue.
    webpackConfig.target('node')
    // Isso diz ao pacote do servidor para usar exportações no estilo Node
    webpackConfig.output.libraryTarget('commonjs2')

    webpackConfig
      .plugin('manifest')
      .use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }))

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // Externaliza dependências do app. Compila a parte do servidor mais rápido
    // e gera um arquivo de pacote menor.

    // Não externalize dependências que precisam ser processadas pelo webpack.
    // Você deve permitir deps que modificam o `global` (ex.: polyfills)
    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }))

    webpackConfig.optimization.splitChunks(false).minimize(false)

    webpackConfig.plugins.delete('preload')
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('progress')
    webpackConfig.plugins.delete('friendly-errors')

    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    )
  }
}
```

## Limitações do _Externals_

Observe que na opção `externals` estamos permitindo arquivos CSS. Isso ocorre porque o CSS importado das dependências ainda deve ser tratado pelo webpack. Se estiver importando qualquer outro tipo de arquivo que também dependa do webpack (ex.: `*.vue`, `*.sass`), você deve adicioná-los à lista de permissões também.

Se estiver usando `runInNewContext: 'once'` ou `runInNewContext: true`, então você também precisa colocar _polyfills_ na lista de permissões que modificam `global`, ex.: `babel-polyfill`. Isso ocorre porque ao usar o novo modo de contexto, **o código dentro de um pacote de servidor tem seu próprio objeto `global`.** Como você realmente não precisa disso no servidor, é mais fácil importá-lo na entrada do cliente.

## Gerando `clientManifest`

Além do pacote do servidor, também podemos gerar um manifesto da compilação do cliente. Com o manifesto do cliente e o pacote do servidor, o renderizador agora tem informações das compilações do servidor _e_ do cliente. Dessa forma, ele pode inferir e injetar automaticamente [diretivas de _preload / prefetch_](https://css-tricks.com/prefetching-preloading-prebrowsing/), tags `<link>` e `<script>` no HTML renderizado.

Os benefícios são duplos:

1. Ele pode substituir o `html-webpack-plugin` para injetar os URLs de _assets_ corretos quando houver _hashes_ em seus nomes de arquivos gerados.

2. Ao renderizar um pacote que aproveita os recursos de divisão de código sob demanda do webpack, podemos garantir que os fragmentos ideais sejam _preloaded / prefetched_ e também injetar de forma inteligente as tags `<script>` para os fragmentos assíncronos necessários e evitar solicitações em cascata no cliente, assim melhorando o TTI (_time-to-interactive_).
