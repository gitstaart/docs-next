# Especificação da Sintaxe SFC

## Introdução

Um arquivo `*.vue` é um formato de arquivo personalizado que usa sintaxe semelhante a HTML para descrever um componente Vue. Cada arquivo `*.vue` consiste em três tipos de blocos de linguagem no nível superior: `<template>`, `<script>` e `<style>` e, opcionalmente, blocos customizados adicionais:

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Olá mundo!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  Isso poderia ser, ex.: documentação do componente.
</custom1>
```

## Blocos de Linguagem

### `<template>`

- Cada arquivo `*.vue` pode conter no máximo um bloco `<template>` de nível superior por vez.

- O conteúdo será extraído e passado para `@vue/compiler-dom`, pré-compilado em funções de renderização JavaScript e anexado ao componente exportado como sua opção `render`.

### `<script>`

- Cada arquivo `*.vue` pode conter no máximo um bloco `<script>` por vez (excluindo [`<script setup>`](/api/sfc-script-setup.html)).

- O script é executado como um Módulo ES.

- A **exportação padrão** deve ser um objeto de opções do componente Vue, como um objeto simples ou como o valor de retorno de [defineComponent](/api/global-api.html#definecomponent).

### `<script setup>`

- Cada arquivo `*.vue` pode conter no máximo um bloco `<script setup>` por vez (excluindo o `<script>` normal).

- O script é pré-processado e usado como a função `setup()` do componente, o que significa que será executado **para cada instância do componente**. Os vínculos de nível superior em `<script setup>` são automaticamente expostos ao _template_. Para mais detalhes, veja [documentação dedicada ao `<script setup>`](/api/sfc-script-setup).

### `<style>`

- Um único arquivo `*.vue` pode conter várias tags `<style>`.

- Uma tag `<style>` pode ter atributos `scoped` ou `module` (veja [Recursos de Estilo em SFC](/api/sfc-style) para mais detalhes) para ajudar a encapsular os estilos no componente atual. Várias tags `<style>` com diferentes modos de encapsulamento podem ser misturadas no mesmo componente.

### Blocos Customizados

Blocos customizados adicionais podem ser incluídos em um arquivo `*.vue` para qualquer necessidade específica do projeto, por exemplo, um bloco `<docs>`. Alguns exemplos do mundo real de blocos customizados incluem:

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

O manuseio de Blocos Customizados dependerá das ferramentas - se você quiser criar suas próprias integrações de blocos customizados, consulte [Ferramentas para SFC](/api/sfc-tooling.html#integracao-de-blocos-customizados) para obter mais detalhes.

## Inferência Automática de `nome`

Um SFC infere automaticamente o nome do componente pelo seu **nome do arquivo** nos seguintes casos:

- Formatação de aviso do desenvolvedor
- Inspeção no DevTools
- Auto-referência recursiva. Por exemplo. um arquivo chamado `FooBar.vue` pode se referir a si mesmo como `<FooBar/>` em seu _template_. Isso tem prioridade menor do que componentes explicitamente registrados/importados.

## Pré-Processadores

Os blocos podem declarar linguagens de pré-processador usando o atributo `lang`. O caso mais comum é usar TypeScript para o bloco `<script>`:

```html
<script lang="ts">
  // usa TypeScript
</script>
```

`lang` pode ser aplicado a qualquer bloco - por exemplo, podemos usar `<style>` com [SASS](https://sass-lang.com/) e `<template>` com [Pug](https://pugjs.org/api/getting-started.html):

```html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

Observe que a integração com pré-processadores pode diferir com base na cadeia de ferramentas. Confira as respectivas documentações para exemplos:

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Importações Src

Se preferir dividir seus componentes `*.vue` em vários arquivos, você pode usar o atributo `src` para importar um arquivo externo para um bloco de languagem:

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

Esteja ciente de que as importações `src` seguem as mesmas regras de resolução de caminho que as solicitações do módulo webpack, o que significa:

- Caminhos relativos precisam começar com `./`
- Você pode importar recursos das dependências npm:

```vue
<!-- importar um arquivo do pacote npm "todomvc-app-css" instalado -->
<style src="todomvc-app-css/index.css">
```

Importações `src` também funcionam com blocos customizados, por exemplo:

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## Comentários

Dentro de cada bloco deve-se utilizar a sintaxe de comentários da linguagem utilizada (HTML, CSS, JavaScript, Pug, etc.). Para comentários de nível superior, use a sintaxe de comentário HTML: `<!-- comente o conteúdo aqui -->`
