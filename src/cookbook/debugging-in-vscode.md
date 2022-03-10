# Depuração no VS Code

Todo aplicativo chega a um ponto em que é necessário entender falhas, de pequenas a grandes. Nesta receita, exploramos alguns fluxos de trabalho para usuários do VS Code que desejam depurar seus aplicativos no navegador.

Esta receita mostra como depurar aplicativos [Vue CLI](https://github.com/vuejs/vue-cli) no VS Code à medida que são executados no navegador.

## Pré-requisitos

Certifique-se de ter o VS Code e o navegador de sua escolha instalados.

Instale e crie um projeto com o [vue-cli](https://github.com/vuejs/vue-cli), seguindo as instruções do [Guia do Vue CLI](https://cli.vuejs.org/). Mude para o diretório do aplicativo recém-criado e abra o VS Code.

### Exibindo o Código-fonte no Navegador

Antes que possa depurar seus componentes Vue a partir do VS Code, você precisa atualizar a configuração do Webpack gerada para construir _sourcemaps_. Fazemos isso para que nosso depurador tenha uma maneira de mapear o código dentro de um arquivo compactado de volta à sua posição no arquivo original. Isso garante que você possa depurar um aplicativo mesmo depois que seus ativos tiverem sido otimizados pelo Webpack.

Se você usa Vue CLI 2, defina ou atualize a propriedade `devtool` dentro de `config/index.js`:

```json
devtool: 'source-map',
```

Se você usa Vue CLI 3, defina ou atualize a propriedade `devtool` dentro de `vue.config.js`:

```js
modulo.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
}
```

### Iniciando o Aplicativo a partir do VS Code

::: info
Estamos assumindo que a porta é `8080` aqui. Se não for o caso (por exemplo, se `8080` foi usado e Vue CLI automaticamente escolhe outra porta para você), apenas modifique a configuração de acordo.
:::

Clique no ícone "Debugging" na Barra de Atividade para abrir a _view_ de Depuração e, em seguida, clique no ícone de engrenagem para configurar um arquivo launch.json, selecionando **Chrome/Firefox: Launch** como ambiente. Substitua o conteúdo do launch.json gerado pela configuração correspondente:

<div style="padding: 10px 25px 30px"><img src="/images/config_add.png" alt="Adicionar configuração do Chrome" style="width: 690px; border-radius: 3px; box-shadow: 0 10px 15px rgb(0 0 0 / 50%)"></div>

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## Configurando um Ponto de Interrupção

1. Defina um ponto de interrupção em **src/components/HelloWorld.vue** na `line 90` onde a função `data` retorna uma string.

<div style="padding: 10px 25px 30px"><img src="/images/breakpoint_set.png" alt="Renderização de Ponto de Interrupção" style="width: 690px; border-radius: 3px; box-shadow: 0 10px 15px rgb(0 0 0 / 50%)"></div>


2. Abra seu terminal favorito na pasta raiz e sirva o aplicativo usando Vue CLI:

```
npm run serve
```

3. Vá para a _view_ de Depuração, selecione a configuração **'vuejs: chrome/firefox'** e pressione F5 ou clique no botão verde _play_.

4. Seu ponto de interrupção agora deve ser atingido quando uma nova instância do navegador abrir `http://localhost:8080`.

<div style="padding: 10px 25px 30px"><img src="/images/breakpoint_hit.png" alt="Atingindo Ponto de Interrupção" style="width: 690px; border-radius: 3px; box-shadow: 0 10px 15px rgb(0 0 0 / 50%)"></div>

## Padrões Alternativos

### Vue Devtools

Existem outros métodos de depuração, variando em complexidade. O mais popular e simples é usar as excelentes devtools do Vue.js [para Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) e [para Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/). Alguns dos benefícios de trabalhar com as devtools são que elas permitem que você edite propriedades de dados ao vivo e veja as alterações refletidas imediatamente. O outro grande benefício é a capacidade de fazer depuração _time travel_ para Vuex.

![Depurador _time travel_ no Devtools](/images/devtools-timetravel.gif)

Por favor, note que se a página usa uma produção/compilação minificada do Vue.js (como o link padrão de um CDN), a inspeção devtools é desabilitada por padrão para que o painel Vue não apareça. Se você mudar para uma versão não minificada, talvez seja necessário atualizar a página para vê-los.

### Simples Instrução _Debugger_

O exemplo acima tem um ótimo fluxo de trabalho. No entanto, há uma opção alternativa em que você pode usar a [instrução nativa "debugger"](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/debugger) diretamente em seu código. Se você optar por trabalhar dessa maneira, é importante lembrar de remover as declarações quando terminar.

```vue
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Olá Mundo!'
    debugger
    this.message = hello
  }
};
</script>
```

## Reconhecimentos

Esta receita foi baseada em uma contribuição de [Kenneth Auchenberg](https://twitter.com/auchenberg), [disponível aqui](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli).
