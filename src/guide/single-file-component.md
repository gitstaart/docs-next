# Componentes Single-File

<VideoLesson href="https://vueschool.io/lessons/vue-3-introduction-to-single-file-components?friend=vuejs" title="Lição Gratuita sobre Componentes Single-File do Vue.js">Aprenda sobre componentes single-file com uma vídeo aula gratuita na Vue School</VideoLesson>

## Introdução

Componentes Single-File do Vue (também conhecido como arquivos `*.vue`, abreviado como **SFC**) é um formato de arquivo especial que nos permite encapsular o *template*, lógica **e** estilização de um componente Vue em um único arquivo. Aqui está um exemplo de SFC:

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Olá Mundo!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

Como podemos ver, SFC no Vue é uma extensão natural do trio clássico de HTML, CSS e JavaScript. Cada arquivo `*.vue` consiste em três tipos de blocos de linguagem de nível superior: `<template>`, `<script>` e `<style>`:

- A seção `<script>` é um módulo JavaScript padrão. Ele deve exportar uma definição de componente Vue como sua exportação padrão.
- A seção `<template>` define o *template* (árvore HTML) do componente.
- A seção `<style>` define o CSS associado ao componente.

Verifique mais detalhes na [Especificação da sintaxe SFC](/api/sfc-spec).

## Como funciona

Vue SFC é um formato de arquivo específico do framework e deve ser pré-compilado por [@vue/compiler-sfc](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc) em JavaScript e CSS padrão. Um SFC compilado é um módulo JavaScript (ES) padrão - o que significa que, com a configuração de compilação adequada, você pode importar um SFC como um módulo:

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

As tags `<style>` dentro de SFCs são normalmente injetadas como tags `<style>` nativas durante o desenvolvimento para suportar _hot updates_. Para produção, elas podem ser extraídas e mescladas em um único arquivo CSS.

Você pode brincar com SFCs e explorar como eles são compilados no [Vue SFC Playground](https://sfc.vuejs.org/).

Em projetos reais, normalmente integramos o compilador SFC com uma ferramenta de construção como [Vite](https://vitejs.dev/) ou [Vue CLI](http://cli.vuejs.org/) (que é baseada no [webpack](https://webpack.js.org/)), e o Vue fornece ferramentas oficiais de _scaffolding_ para você começar com SFCs o mais rápido possível. Confira mais detalhes na seção [Ferramentas SFC](/api/sfc-tooling).

## Por que SFC

Embora os SFCs exijam uma etapa de compilação, há vários benefícios em troca:

- Crie componentes modulares usando a sintaxe familiar de HTML, CSS e JavaScript
- _Templates_ pré-compilados
- [CSS isolado por componente](/api/sfc-style)
- [Sintaxe mais ergonômica ao trabalhar com a API de Composição](/api/sfc-script-setup)
- Mais otimizações de tempo de compilação por meio de análise cruzada de _template_ e script
- [Suporte da IDE](/api/sfc-tooling.html#ide-support) com preenchimento automático e verificação de tipo para expressões do _template_
- Suporte a _Hot-Module Replacement_ (HMR) pronto para uso

O SFC é um recurso definidor do Vue como um framework e é a abordagem recomendada para usar o Vue nos seguintes cenários:

- Aplicativos de Página Única (SPA)
- Geração de Site Estático (SSG)
- Quaisquer frontends não triviais em que uma etapa de compilação possa ser justificada para uma melhor experiência de desenvolvimento (DX).

Dito isso, percebemos que existem cenários em que os SFCs podem parecer um exagero. É por isso que o Vue ainda pode ser usado via JavaScript simples sem uma etapa de compilação. Se você está apenas procurando aprimorar HTML amplamente estático com interações leves, também pode conferir [petite-vue](https://github.com/vuejs/petite-vue), um subconjunto de 6kb do Vue otimizado para aprimoramento progressivo.

## E Quanto à Separação de Preocupações?

Alguns usuários vindos de um background tradicional de desenvolvimento web podem ter a preocupação de que os SFCs estejam misturando diferentes preocupações no mesmo lugar - que HTML/CSS/JS deveriam se separar!

Para responder a essa pergunta, é importante concordarmos que **a separação de preocupações não é igual à separação de tipos de arquivos.** O objetivo final dos princípios de engenharia é melhorar a manutenibilidade das bases de código. A separação de preocupações, quando aplicada dogmaticamente como separação de tipos de arquivos, não nos ajuda a atingir esse objetivo no contexto de aplicativos frontend cada vez mais complexos.

No desenvolvimento de UI moderno, descobrimos que, em vez de dividir a base de código em três camadas enormes que se entrelaçam, faz muito mais sentido dividi-las em componentes fracamente acoplados e compô-los. Dentro de um componente, seu _template_, lógica e estilos são inerentemente acoplados, e colocá-los juntos na verdade torna o componente mais coeso e sustentável.

Observe que mesmo que você não goste da ideia de Componentes Single-File, você ainda pode aproveitar seus recursos de pré-compilação e _hot-reloading_ separando seu JavaScript e CSS em arquivos separados usando [Src Imports](/api/sfc-spec.html#src-imports).
