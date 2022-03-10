# Ferramentas para SFC

## Playgrounds Online

Você não precisa instalar nada em sua máquina para experimentar SFCs do Vue - existem muitos playgrounds online que permitem que você faça isso diretamente no navegador:

- [Vue SFC Playground](https://sfc.vuejs.org) (oficial, implantado a partir do último commit)
- [VueUse Playground](https://play.vueuse.org)
- [Vue no CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue no Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue no Codepen](https://codepen.io/pen/editor/vue)
- [Vue no StackBlitz](https://stackblitz.com/fork/vue)
- [Vue em Components.studio](https://components.studio/create/vue3)
- [Vue em WebComponents.dev](https://webcomponents.dev/create/cevue)

Também é recomendável usar esses playgrounds online para fornecer reproduções ao relatar bugs.

## Andaimes de Projeto

### Vite

[Vite](https://vitejs.dev/) é uma ferramenta de compilação leve e rápida com suporte a Vue SFC de primeira classe. Ele foi criado por Evan You, que também é o autor do próprio Vue! Para começar com o Vite + Vue, basta executar:

```sh
npm init vite@latest
```

Em seguida, selecione o _template_ Vue e siga as instruções.

- Para saber mais sobre o Vite, confira a [documentação do Vite](https://vitejs.dev/guide/).
- Para configurar o comportamento específico do Vue em um projeto Vite, por exemplo, passando opções para o compilador Vue, confira a documentação do [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).

O [SFC Playground](https://sfc.vuejs.org/) também suporta o download dos arquivos como um projeto Vite.

### Vue CLI

[Vue CLI](https://cli.vuejs.org/) é a ferramenta oficial de compilação baseada em webpack para projetos Vue. Para começar com Vue CLI:

```sh
npm install -g @vue/cli
vue create hello-vue
```

- Para saber mais sobre Vue CLI, confira a [documentação do Vue CLI](https://cli.vuejs.org/guide/installation.html).

### Vite ou Vue CLI?

Recomendamos iniciar novos projetos com o Vite, pois oferece uma experiência de desenvolvimento significativamente melhor em termos de inicialização do servidor dev e desempenho de atualização em HMR ([detalhes](https://vitejs.dev/guide/why.html)). Use o Vue CLI apenas se você confiar em recursos específicos do webpack (ex.: Federação de Módulos).

Se você é um usuário do [Rollup](https://rollupjs.org/), pode adotar o Vite com segurança, pois ele usa o Rollup para compilações de produção e oferece suporte a um sistema de plug-ins compatível com Rollup. [Até o mantenedor do Rollup recomenda o Vite como O _wrapper_ de desenvolvimento web para o Rollup](https://twitter.com/lukastaegert/status/1412119729431584774).

## Suporte de IDE

A configuração de IDE recomendada é [VSCode](https://code.visualstudio.com/) + a extensão [Volar](https://github.com/johnsoncodehk/volar). O Volar fornece realce de sintaxe e IntelliSense avançado para expressões de _template_, props de componentes e até validação de slots. Recomendamos fortemente esta configuração se você deseja obter a melhor experiência possível com Vue SFCs, especialmente se você também estiver usando TypeScript.

[WebStorm](https://www.jetbrains.com/webstorm/) também fornece suporte decente para Vue SFCs. No entanto, observe que o suporte para `<script setup>` ainda está [em andamento](https://youtrack.jetbrains.com/issue/WEB-49000).

A maioria dos outros editores tem suporte a realce de sintaxe criado pela comunidade para Vue, mas não possui o mesmo nível de IntelliSense de código. A longo prazo, esperamos poder estender o alcance do suporte de editor aproveitando o [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) já que a lógica central do Volar é implementada como um servidor de linguagem padrão.

## Suporte a Testes

- Se estiver usando o Vite, recomendamos o [Cypress](https://www.cypress.io/) como o executor de testes para testes unitários e e2e. Testes de unidade para Vue SFCs podem ser feitos com o [Cypress Component Test Runner](https://www.cypress.io/blog/2021/04/06/introducing-the-cypress-component-test-runner/).

- Vue CLI vem com integrações [Jest](https://jestjs.io/) e [Mocha](https://mochajs.org/).

- Se você estiver configurando manualmente o Jest para trabalhar com Vue SFCs, confira [vue-jest](https://github.com/vuejs/vue-jest) que é a transformação Jest oficial para Vue SFCs.

## Integração de Blocos Customizados

Blocos customizados são compilados em importações para o mesmo arquivo Vue com diferentes consultas de solicitação. Cabe à ferramenta de compilação subjacente lidar com essas solicitações de importação.

- Se estiver usando o Vite, um plug-in personalizado do Vite deve ser usado para transformar blocos customizados correspondentes em JavaScript executável. [[Exemplo](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)]

- Se estiver usando Vue CLI ou webpack puro, um carregador do webpack deve ser configurado para transformar os blocos correspondentes. [[Exemplo](https://vue-loader.vuejs.org/guide/custom-blocks.html#custom-blocks)]

## Ferramentas de Nível Inferior

### `@vue/compiler-sfc`

- [Documentação](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc)

Este pacote faz parte do monorepo principal do Vue e é sempre publicado com a mesma versão do pacote principal `vue`. Normalmente, ele será listado como uma dependência par do `vue` em um projeto. Para garantir o comportamento correto, sua versão deve sempre ser mantida em sincronia com `vue` - ou seja, sempre que você atualizar a versão de `vue`, você também deve atualizar `@vue/compiler-sfc` para corresponder a ela.

O próprio pacote fornece utilitários de nível inferior para processar Vue SFCs e destina-se apenas a autores de ferramentas que precisam oferecer suporte a Vue SFCs em ferramentas personalizadas.

### `@vitejs/plugin-vue`

- [Documentação](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

Plugin oficial que fornece suporte a Vue SFC no Vite.

### `vue-loader`

- [Documentação](https://vue-loader.vuejs.org/)

O carregador oficial que fornece suporte a Vue SFC no webpack. Se você estiver usando o Vue CLI, consulte também [documentação sobre como modificar as opções do `vue-loader` no Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).
