# Compilação de Migração

## Visão Geral

`@vue/compat` (também conhecido como "a compilação de migração") é uma versão do Vue 3 que fornece um comportamento configurável compatível com Vue 2.

A compilação de migração é executada no modo Vue 2 por padrão - a maioria das APIs públicas se comportam exatamente como no Vue 2, com apenas algumas exceções. O uso de recursos que foram alterados ou obsoletos no Vue 3 emitirá avisos em tempo de execução. A compatibilidade de um recurso também pode ser ativada/desativada por componente.

### Casos de Uso Pretendidos

- Atualizando um aplicativo Vue 2 para Vue 3 (com [limitações](#limitacoes-conhecidas))
- Migrando uma biblioteca para suportar Vue 3
- Para desenvolvedores experientes do Vue 2 que ainda não experimentaram o Vue 3, a compilação de migração pode ser usada no lugar do Vue 3 para ajudar a aprender a diferença entre as versões.

### Limitações Conhecidas

Embora tenhamos nos esforçado para fazer a compilação de migração imitar o comportamento do Vue 2 o máximo possível, existem algumas limitações que podem impedir que seu aplicativo seja qualificado para atualização:

- Dependências que dependem de APIs internas do Vue 2 ou comportamento não documentado. O caso mais comum é o uso de propriedades privadas em `VNodes`. Se o seu projeto depende de bibliotecas de componentes como [Vuetify](https://vuetifyjs.com/en/), [Quasar](https://quasar.dev/) ou [ElementUI](https://element.eleme.io/#/en-US), é melhor esperar por suas versões compatíveis com Vue 3.

- Suporte ao Internet Explorer 11: [O Vue 3 abandonou oficialmente o plano de suporte ao IE11](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md). Se você ainda precisar dar suporte ao IE11 ou abaixo, terá que permanecer no Vue 2.

- Renderização do lado do servidor: a compilação de migração pode ser usada para SSR, mas a migração de uma configuração de SSR personalizada é muito mais complexa. A ideia geral é substituir `vue-server-renderer` por [`@vue/server-renderer`](https://github.com/vuejs/vue-next/tree/master/packages/server-renderer). O Vue 3 não fornece mais um renderizador de pacote (_bundle_) e é recomendado usar o Vue 3 SSR com [Vite](https://vitejs.dev/guide/ssr.html). Se estiver usando [Nuxt.js](https://nuxtjs.org/), você pode testar [Nuxt Bridge, uma camada de compatibilidade do Nuxt.js 2 para 3](https://v3.nuxtjs.org/getting-started/bridge/). Para projetos de produção complexos, provavelmente é melhor esperar pelo [Nuxt 3 (atualmente em beta)](https://v3.nuxtjs.org/getting-started/introduction).

### Expectativas

Observe que a compilação de migração visa cobrir apenas as APIs e o comportamento do Vue 2 documentados publicamente. Se seu aplicativo não for executado na compilação de migração devido à dependência de comportamento não documentado, é improvável que ajustemos a compilação de migração para atender ao seu caso específico. Considere refatorar para remover a dependência do comportamento em questão.

Uma palavra de aviso: se seu aplicativo for grande e complexo, a migração provavelmente será um desafio mesmo com a compilação da migração. Se seu aplicativo infelizmente não for adequado para atualização, observe que estamos planejando fazer o _backport_ da API de composição e alguns outros recursos do Vue 3 para a v2.7 (estimada para o terceiro trimestre de 2021).

Se você executar seu aplicativo na compilação de migração, **pode** enviá-lo para produção antes que a migração seja concluída. Embora haja uma pequena sobrecarga de desempenho/tamanho, ela não deve afetar visivelmente a UX de produção. Talvez você precise fazer isso quando tiver dependências que dependem do comportamento do Vue 2 e não podem ser atualizadas/substituídas.

A compilação de migração será fornecida a partir da v3.1 e continuará a ser publicada junto com a linha de lançamento da v3.2. Planejamos eventualmente parar de publicar a compilação de migração em uma versão menor futura (não antes do fim de 2021), portanto, você ainda deve tentar mudar para a compilação padrão antes disso.

## Fluxo de Trabalho da Atualização

O fluxo de trabalho a seguir percorre as etapas de migração de um aplicativo Vue 2 real (Vue HackerNews 2.0) para o Vue 3. Os commits completos podem ser encontrados [aqui](https://github.com/vuejs/vue-hackernews-2.0/compare/migration). Observe que as etapas reais necessárias para o seu projeto podem variar, e essas etapas devem ser tratadas como orientação geral em vez de instruções estritas.

### Preparações

- Se você ainda estiver usando a [sintaxe obsoleta de slot nomeado/com escopo](https://br.vuejs.org/v2/guide/components-slots.html#Sintaxe-Obsoleta), atualize primeiro para a sintaxe mais recente (que já é suportada na 2.6).

### Instalação

1. Atualize as ferramentas, se aplicável.

   - Se estiver usando uma configuração de webpack personalizada: Atualize o `vue-loader` para `^16.0.0`.
   - Se estiver usando `vue-cli`: atualize para o `@vue/cli-service` mais recente com `vue upgrade`
   - (Alternativa) migrar para [Vite](https://vitejs.dev/) + [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2). [[Commit de exemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/565b948919eb58f22a32afca7e321b490cb3b074)]

2. No `package.json`, atualize `vue` para 3.1, instale `@vue/compat` da mesma versão e substitua `vue-template-compiler` (se presente) por `@vue/compiler-sfc`:

   ```diff
   "dependencies": {
   -  "vue": "^2.6.12",
   +  "vue": "^3.1.0",
   +  "@vue/compat": "^3.1.0"
      ...
   },
   "devDependencies": {
   -  "vue-template-compiler": "^2.6.12"
   +  "@vue/compiler-sfc": "^3.1.0"
   }
   ```

   [Commit de exemplo](https://github.com/vuejs/vue-hackernews-2.0/commit/14f6f1879b43f8610add60342661bf915f5c4b20)

3. Na configuração da compilação, crie o apelido `vue` para `@vue/compat` e habilite o modo de compatibilidade através das opções do compilador Vue.

   **Exemplos de Configurações**

   <details>
     <summary><b>vue-cli</b></summary>

   ```js
   // vue.config.js
   module.exports = {
     chainWebpack: config => {
       config.resolve.alias.set('vue', '@vue/compat')

       config.module
         .rule('vue')
         .use('vue-loader')
         .tap(options => {
           return {
             ...options,
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         })
     }
   }
   ```

   </details>

   <details>
     <summary><b>Webpack puro</b></summary>

   ```js
   // webpack.config.js
   module.exports = {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     module: {
       rules: [
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         }
       ]
     }
   }
   ```

   </details>

   <details>
     <summary><b>Vite</b></summary>

   ```js
   // vite.config.js
   export default {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     plugins: [
       vue({
         template: {
           compilerOptions: {
             compatConfig: {
               MODE: 2
             }
           }
         }
       })
     ]
   }
   ```

   </details>

4. Se você estiver usando TypeScript, também precisará modificar a tipagem do `vue` para expor a exportação padrão (que não está mais presente no Vue 3) adicionando um arquivo `*.d.ts` com o seguinte:

   ```ts
   declare module 'vue' {
     import { CompatVue } from '@vue/runtime-dom'
     const Vue: CompatVue
     export default Vue
     export * from '@vue/runtime-dom'
   }
   ```

5. Neste ponto, seu aplicativo pode encontrar alguns erros/avisos em tempo de compilação (ex.: uso de filtros). Corrija-os primeiro. Se todos os avisos do compilador desaparecerem, você também poderá definir o compilador para o modo Vue 3.

   [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/b05d9555f6e115dea7016d7e5a1a80e8f825be52)

6. Depois de corrigir os erros, o aplicativo poderá ser executado se não estiver sujeito às [limitações](#limitacoes-conhecidas) mencionadas acima.

   Você provavelmente verá MUITOS avisos na linha de comando e no console do navegador. Aqui estão algumas dicas gerais:

   - Você pode filtrar por avisos específicos no console do navegador. É uma boa ideia usar o filtro e focar na correção de um item de cada vez. Você também pode usar filtros negados como `-GLOBAL_MOUNT`.

   - Você pode suprimir itens obsoletos específicos por meio de [configuração de compatibilidade](#configuracao-de-compatibilidade).

   - Alguns avisos podem ser causados ​​por uma dependência que você usa (ex.: `vue-router`). Você pode verificar isso no rastro do componente com aviso ou rastro da pilha de erros (expandido ao clicar). Concentre-se primeiro em corrigir os avisos originados de seu próprio código-fonte.

   - Se você estiver usando `vue-router`, observe que `<transition>` e `<keep-alive>` não funcionarão com `<router-view>` até que você atualize para `vue-router` v4.

7. Atualize [nomes de classe em `<transition>`](/guide/migration/transition.html). Este é o único recurso que não possui um aviso de tempo de execução. Você pode fazer uma pesquisa em todo o projeto para nomes de classes CSS `.*-enter` e `.*-leave`.

   [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/d300103ba622ae26ac26a82cd688e0f70b6c1d8f)

8. Atualize a entrada do aplicativo para usar a [nova API de montagem global](/guide/migration/global-api.html#uma-nova-api-global-createapp).

   [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/a6e0c9ac7b1f4131908a4b1e43641f608593f714)

9. [Atualize `vuex` para v4](https://vuex.vuejs.org/ptbr/guide/migrating-to-4-0-from-3-x.html).

   [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/5bfd4c61ee50f358cd5daebaa584f2c3f91e0205)

10. [Atualize o `vue-router` para v4](https://next.router.vuejs.org/guide/migration/index.html). Se você também usa `vuex-router-sync`, você pode substituí-lo por um _store getter_.

    Após a atualização, para usar `<transition>` e `<keep-alive>` com `<router-view>` requer o uso da nova [sintaxe baseada em slot com escopo](https://next.router.vuejs.org/guide/migration/index.html#router-view-keep-alive-and-transition).

    [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/758961e73ac4089890079d4ce14996741cf9344b)

11. Retire os avisos individuais. Observe que alguns recursos têm comportamento conflitante entre o Vue 2 e o Vue 3 - por exemplo, a API da função de renderização ou o componente funcional vs. a alteração de componente assíncrona. Para migrar para a API do Vue 3 sem afetar o restante do aplicativo, você pode optar pelo comportamento do Vue 3 por componente com a [opção `compatConfig`](#configuracao-por-componente).

    [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/d0c7d3ae789be71b8fd56ce79cb4cb1f921f893b)

12. Quando todos os avisos forem corrigidos, você poderá remover a compilação de migração e alternar para o Vue 3 propriamente dito. Observe que você pode não conseguir fazer isso se ainda tiver dependências que dependem do comportamento do Vue 2.

    [Exemplo de commit](https://github.com/vuejs/vue-hackernews-2.0/commit/9beb45490bc5f938c9e87b4ac1357cfb799565bd)

## Configuração de Compatibilidade

### Configuração Global

Os recursos da compatibilidade podem ser desativados individualmente:

```js
import { configureCompat } from 'vue'

// desabilita a compatibilidade para certos recursos
configureCompat({
  FEATURE_ID_A: false,
  FEATURE_ID_B: false
})
```

Alternativamente, todo o aplicativo pode padronizar o comportamento do Vue 3, com apenas alguns recursos de compatibilidade ativados:

```js
import { configureCompat } from 'vue'

// padroniza tudo para o comportamento do Vue 3 e habilita compatibilidade apenas
// para certos recursos
configureCompat({
  MODE: 3,
  FEATURE_ID_A: true,
  FEATURE_ID_B: true
})
```

### Configuração por Componente

Um componente pode usar a opção `compatConfig`, que espera as mesmas opções que o método global `configureCompat`:

```js
export default {
  compatConfig: {
    MODE: 3, // ativa o comportamento do Vue 3 apenas para este componente
    FEATURE_ID_A: true // recursos também podem ser alternados no nível do componente
  }
  // ...
}
```

### Configuração Específica de Compilador

Os recursos que começam com `COMPILER_` são específicos do compilador: se você estiver usando a compilação completa (com compilador _in-browser_), eles podem ser configurados em tempo de execução. No entanto, se estiver usando um ambiente de compilação, eles devem ser configurados por meio de `compilerOptions` na configuração de compilação (veja as configurações de exemplo acima).

## Referência de Recurso

### Tipos de Compatibilidade

- ✔ Totalmente compatível
- ◐ Parcialmente compatível com ressalvas
- ⨂ Incompatível (somente aviso)
- ⭘ Somente modo de compatibilidade (sem aviso)

### Incompatível

> Deve ser corrigido antecipadamente ou provavelmente levará a erros

| ID                                    | Tipo | Descrição                                                                  | Documentação                                                                                   |
| ------------------------------------- | ---- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GLOBAL_MOUNT_CONTAINER                | ⨂    | O aplicativo montado não substitui o elemento no qual está montado         | [link](/guide/migration/mount-changes.html)                                                    |
| CONFIG_DEVTOOLS                       | ⨂    | devtools de produção agora é um sinalizador em tempo de compilação         | [link](https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags) |
| COMPILER_V_IF_V_FOR_PRECEDENCE        | ⨂    | A precedência `v-if` e `v-for` quando usada no mesmo elemento foi alterada | [link](/guide/migration/v-if-v-for.html)                                                       |
| COMPILER_V_IF_SAME_KEY                | ⨂    | Ramos `v-if` não podem mais ter a mesma chave                              | [link](/guide/migration/key-attribute.html#em-branches-condicionais)                           |
| COMPILER_V_FOR_TEMPLATE_KEY_PLACEMENT | ⨂    | A chave de `<template v-for>` agora deve ser colocada no `<template>`      | [link](/guide/migration/key-attribute.html#com-template-v-for)                                 |
| COMPILER_SFC_FUNCTIONAL               | ⨂    | `<template functional>` não é mais suportado em SFCs                       | [link](/guide/migration/functional-components.html#componentes-single-file-sfcs)               |

### Parcialmente Compatível com Ressalvas

| ID                       | Tipo | Descrição                                                                                                                                                                                                                             | Documentação                                                                                                   |
| ------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| CONFIG_IGNORED_ELEMENTS  | ◐    | `config.ignoredElements` agora é `config.compilerOptions.isCustomElement` (somente na versão do compilador _in-browser_). Se estiver usando ambiente de compilação, `isCustomElement` deve ser passado na configuração da compilação. | [link](/guide/migration/global-api.html#config-ignoredelements-agora-e-config-compileroptions-iscustomelement) |
| COMPILER_INLINE_TEMPLATE | ◐    | `inline-template` removido (compatibilidade suportada apenas na compilação _in-browser_)                                                                                                                                              | [link](/guide/migration/inline-template-attribute.html)                                                        |
| PROPS_DEFAULT_THIS       | ◐    | Função-fábrica padrão de props não tem mais acesso a `this` (no modo de compatibilidade, `this` não é uma instância real - apenas expõe props, `$options` e injeções)                                                                 | [link](/guide/migration/props-default-this.html)                                                               |
| INSTANCE_DESTROY         | ◐    | Método de instância `$destroy` removido (no modo de compatibilidade, suportado apenas na instância raiz)                                                                                                                              |                                                                                                                |
| GLOBAL_PRIVATE_UTIL      | ◐    | `Vue.util` é privado e não está mais disponível                                                                                                                                                                                       |                                                                                                                |
| CONFIG_PRODUCTION_TIP    | ◐    | `config.productionTip` não é mais necessário                                                                                                                                                                                          | [link](/guide/migration/global-api.html#config-productiontip-removido)                                         |
| CONFIG_SILENT            | ◐    | `config.silent` removido                                                                                                                                                                                                              |                                                                                                                |

### Somente Modo de Compatibilidade (sem aviso)

| ID                 | Tipo | Descrição                                       | Documentação                             |
| ------------------ | ---- | ----------------------------------------------- | ---------------------------------------- |
| TRANSITION_CLASSES | ⭘    | Classes de entrada/saída da transição alteradas | [link](/guide/migration/transition.html) |

### Totalmente Compatível

| ID                                    | Tipo | Descrição                                                                   | Documentação                                                                                   |
| ------------------------------------- | ---- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GLOBAL_MOUNT                          | ✔    | new Vue() -> createApp                                                      | [link](/guide/migration/global-api.html#montando-a-instancia-do-aplicativo)                    |
| GLOBAL_EXTEND                         | ✔    | Vue.extend removido (use a opção `defineComponent` ou `extends`)            | [link](/guide/migration/global-api.html#vue-extend-removido)                                   |
| GLOBAL_PROTOTYPE                      | ✔    | `Vue.prototype` -> `app.config.globalProperties`                            | [link](/guide/migration/global-api.html#vue-prototype-substituido-por-config-globalproperties) |
| GLOBAL_SET                            | ✔    | `Vue.set` removido (não é mais necessário)                                  |                                                                                                |
| GLOBAL_DELETE                         | ✔    | `Vue.delete` removido (não é mais necessário)                               |                                                                                                |
| GLOBAL_OBSERVÁVEL                     | ✔    | `Vue.observable` removido (use `reactive`)                                  | [link](/api/basic-reactivity.html)                                                             |
| CONFIG_KEY_CODES                      | ✔    | config.keyCodes removidos                                                   | [link](/guide/migration/keycode-modifiers.html)                                                |
| CONFIG_WHITESPACE                     | ✔    | No Vue 3, o espaço em branco padrão é `"condense"`                          |                                                                                                |
| INSTANCE_SET                          | ✔    | `vm.$set` removido (não é mais necessário)                                  |                                                                                                |
| INSTANCE_DELETE                       | ✔    | `vm.$delete` removido (não é mais necessário)                               |                                                                                                |
| INSTANCE_EVENT_EMITTER                | ✔    | `vm.$on`, `vm.$off`, `vm.$once` removido                                    | [link](/guide/migration/events-api.html)                                                       |
| INSTANCE_EVENT_HOOKS                  | ✔    | A instância não emite mais eventos `hook:x`                                 | [link](/guide/migration/vnode-lifecycle-events.html)                                           |
| INSTANCE_CHILDREN                     | ✔    | `vm.$children` removido                                                     | [link](/guide/migration/children.html)                                                         |
| INSTANCE_LISTENERS                    | ✔    | `vm.$listeners` removido                                                    | [link](/guide/migration/listeners-removed.html)                                                |
| INSTANCE_SCOPED_SLOTS                 | ✔    | `vm.$scopedSlots` removido; `vm.$slots` agora expõe funções                 | [link](/guide/migration/slots-unification.html)                                                |
| INSTANCE_ATTRS_CLASS_STYLE            | ✔    | `$attrs` agora inclui `class` e `style`                                     | [link](/guide/migration/attrs-includes-class-style.html)                                       |
| OPTIONS_DATA_FN                       | ✔    | `data` deve ser uma função em todos os casos                                | [link](/guide/migration/data-option.html)                                                      |
| OPTIONS_DATA_MERGE                    | ✔    | `data` do mixin ou extensão agora é mesclado superficialmente               | [link](/guide/migration/data-option.html)                                                      |
| OPTIONS_BEFORE_DESTROY                | ✔    | `beforeDestroy` -> `beforeUnmount`                                          |                                                                                                |
| OPTIONS_DESTROYED                     | ✔    | `destroyed` -> `unmounted`                                                  |                                                                                                |
| WATCH_ARRAY                           | ✔    | Observar um array não dispara mais na mutação, a menos que seja profundo    | [link](/guide/migration/watch.html)                                                            |
| V_FOR_REF                             | ✔    | `ref` dentro de `v-for` não registra mais array de refs                     | [link](/guide/migration/array-refs.html)                                                       |
| V_ON_KEYCODE_MODIFIER                 | ✔    | `v-on` não suporta mais modificadores keyCode                               | [link](/guide/migration/keycode-modifiers.html)                                                |
| CUSTOM_DIR                            | ✔    | Nomes de gatilhos de diretiva personalizada alterados                       | [link](/guide/migration/custom-directives.html)                                                |
| ATTR_FALSE_VALUE                      | ✔    | Não remove mais o atributo se o valor do vínculo for booleano `false`       | [link](/guide/migration/attribute-coercion.html)                                               |
| ATTR_ENUMERATED_COERCION              | ✔    | Caso especial de atributos enumerados não funciona mais                     | [link](/guide/migration/attribute-coercion.html)                                               |
| TRANSITION_GROUP_ROOT                 | ✔    | `<transition-group>` não renderiza mais um elemento raiz por padrão         | [link](/guide/migration/transition-group.html)                                                 |
| COMPONENT_ASYNC                       | ✔    | API do componente assíncrono alterada (agora requer `defineAsyncComponent`) | [link](/guide/migration/async-components.html)                                                 |
| COMPONENT_FUNCTIONAL                  | ✔    | API de componente funcional alterada (agora devem ser funções simples)      | [link](/guide/migration/functional-components.html)                                            |
| COMPONENT_V_MODEL                     | ✔    | Componente `v-model` retrabalhado                                           | [link](/guide/migration/v-model.html)                                                          |
| RENDER_FUNCTION                       | ✔    | API da função de renderização alterada                                      | [link](/guide/migration/render-function-api.html)                                              |
| FILTROS                               | ✔    | Filtros removidos (afeta apenas APIs de filtro em tempo de execução)        | [link](/guide/migration/filters.html)                                                          |
| COMPILER_IS_ON_ELEMENT                | ✔    | O uso de `is` agora está restrito apenas a `<component>`                    | [link](/guide/migration/custom-elements-interop.html)                                          |
| COMPILER_V_BIND_SYNC                  | ✔    | `v-bind.sync` substituído por `v-model` com argumentos                      | [link](/guide/migration/v-model.html)                                                          |
| COMPILER_V_BIND_PROP                  | ✔    | Modificador `v-bind.prop` removido                                          |                                                                                                |
| COMPILER_V_BIND_OBJECT_ORDER          | ✔    | `v-bind="object"` agora é sensível à ordem                                  | [link](/guide/migration/v-bind.html)                                                           |
| COMPILER_V_ON_NATIVE                  | ✔    | Modificador `v-on.native` removido                                          | [link](/guide/migration/v-on-native-modifier-removed.html)                                     |
| COMPILER_V_FOR_REF                    | ✔    | `ref` em `v-for` (suporte no compilador)                                    |                                                                                                |
| COMPILER_NATIVE_TEMPLATE              | ✔    | `<template>` sem diretivas especiais agora renderiza como elemento nativo   |                                                                                                |
| COMPILER_FILTERS                      | ✔    | Filtros (suporte no compilador)                                             |                                                                                                |
