# Deploy em Produção

::: info
A maioria das dicas abaixo está habilitada por padrão se você estiver usando o [Vue CLI](https://cli.vuejs.org). Esta seção só é relevante se você estiver usando uma configuração de compilação customizada.
:::

## Ativar o Modo de Produção

Durante o desenvolvimento, o Vue fornece muitos avisos para ajudá-lo com erros e armadilhas comuns. No entanto, essas strings de aviso se tornam inúteis em produção e aumentam o tamanho da carga útil do seu aplicativo. Além disso, algumas dessas verificações para avisos têm pequenos custos em tempo de execução que podem ser evitados no [modo de produção](https://cli.vuejs.org/guide/mode-and-env.html#modes).

### Sem Ferramentas de Compilação

Se você estiver usando a compilação completa, ou seja, incluindo diretamente o Vue por meio de uma tag script sem uma ferramenta de compilação, certifique-se de usar a versão minificada para produção. Isso pode ser encontrado no [Guia de Instalação](/guide/installation.html#cdn).

### Com Ferramentas de Compilação

Ao usar uma ferramenta de compilação como Webpack ou Browserify, o modo de produção será determinado pelo `process.env.NODE_ENV` dentro do código fonte do Vue, e estará no modo de desenvolvimento por padrão. Ambas as ferramentas de compilação fornecem maneiras de substituir essa variável para habilitar o modo de produção do Vue, e os avisos serão removidos por minificadores durante a compilação. O Vue CLI tem isso pré-configurado para você, mas seria benéfico saber como é feito:

#### Webpack

No Webpack 4+, você pode usar a opção `mode`:

```js
module.exports = {
  mode: 'production'
}
```

#### Browserify

- Execute seu comando de empacotamento com a variável de ambiente `NODE_ENV` definida como `"production"`. Isso diz ao `vueify` para evitar incluir _hot-reload_ e código relacionado ao desenvolvimento.

- Aplique uma transformação global [envify](https://github.com/hughsk/envify) ao seu pacote. Isso permite que o minificador remova todos os avisos no código-fonte do Vue envoltos em blocos condicionais de variáveis de ambiente. Por exemplo:

  ```bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- Ou, usando [envify](https://github.com/hughsk/envify) com Gulp:

  ```js
  // Use o módulo customizado envify para especificar variáveis ​​de ambiente
  const envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Necessário para processar arquivos de node_modules
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- Ou, usando [envify](https://github.com/hughsk/envify) com Grunt e [grunt-browserify](https://github.com/jmreidy/grunt-browserify):

  ```js
  // Use o módulo customizado envify para especificar variáveis ​​de ambiente
  const envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Função para desviar da ordem padrão do grunt-browserify
        configure: (b) =>
          b
            .transform('vueify')
            .transform(
              // Necessário para processar arquivos de node_modules
              { global: true },
              envify({ NODE_ENV: 'production' })
            )
            .bundle()
      }
    }
  }
  ```

#### Rollup

Use [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
const replace = require('@rollup/plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## Pré-Compilando Templates

Ao usar _templates_ no-DOM ou _template_ em strings no-JavaScript, a compilação de _template_ para função de renderização é executada em tempo real. Isso geralmente é rápido o suficiente na maioria dos casos, mas é melhor evitar se seu aplicativo for sensível ao desempenho.

A maneira mais fácil de pré-compilar _templates_ é usando [Componentes Single-File](/guide/single-file-component.html) - as configurações de compilação associadas executam automaticamente a pré-compilação para você, portanto, o código compilado contém as funções de renderização já compiladas em vez de _template_ em strings brutos.

Se você estiver usando o Webpack e preferir separar JavaScript e arquivos de _template_, você pode usar [vue-template-loader](https://github.com/ktsn/vue-template-loader), que também transforma os arquivos de _template_ em funções de renderização do JavaScript durante a etapa de compilação.

## Extraindo CSS do Componente

Ao usar Componentes Single-File, o CSS dentro dos componentes é injetado dinamicamente como tags `<style>` via JavaScript. Isso tem um pequeno custo em tempo de execução e, se você estiver usando a renderização do lado do servidor, causará um "flash de conteúdo sem estilo". Extrair o CSS em todos os componentes no mesmo arquivo evitará esses problemas e também resultará em melhor minificação e armazenamento em cache do CSS.

Consulte as respectivas documentações de ferramentas de compilação para ver como isso é feito:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (o _template_ webpack de `vue-cli` tem isso pré-configurado)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

## Rastreando Erros do Tempo de Execução

Se ocorrer um erro em tempo de execução durante a renderização de um componente, ele será passado para a função da configuração global `app.config.errorHandler` se tiver sido definida. Pode ser uma boa ideia aproveitar esse gatilho junto com um serviço de rastreamento de erros como o [Sentry](https://sentry.io), qual fornece [uma integração oficial](https://sentry.io/for/vue/) para Vue.
