# Composição

## `mixins`

- **Tipo:** `Array<Object>`

- **Detalhes:**

  A opção `mixins` aceita um array de objetos _mixin_. Esses objetos _mixin_ podem conter opções de instância como objetos de instância normais, e eles serão mesclados com as opções eventuais usando a lógica de mesclagem de opções. Por exemplo, se seu _mixin_ contiver um gatilho `created` e o próprio componente também, ambas as funções serão chamadas.

  Os gatilhos do _mixin_ são chamados  na ordem em que são fornecidos e chamados antes dos gatilhos do próprio componente.

  :::info
  No Vue 2, os _mixins_ eram o principal mecanismo para criar blocos reutilizáveis de lógica de componentes. Embora os _mixins_ continuem sendo suportados no Vue 3, a [API de Composição](/guide/composition-api-introduction.html) agora é a abordagem preferida para reutilização de código entre componentes.
  :::

- **Exemplo:**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

- **Ver também:** [Mixins](../guide/mixins.html)

## `extends`

- **Tipo:** `Object`

- **Detalhes:**

  Permite que um componente estenda outro, herdando suas opções de componente.

  De uma perspectiva de implementação, `extends` é quase idêntico a `mixins`. O componente especificado por `extends` será tratado como se fosse o primeiro _mixin_.

  No entanto, `extends` e `mixins` expressam intenções diferentes. A opção `mixins` é usada principalmente para compor blocos de funcionalidade, enquanto `extends` está principalmente preocupado com herança.

  Assim como em `mixins`, todas as opções serão mescladas usando a estratégia de mesclagem relevante.

- **Exemplo:**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

## `provide` / `inject`

- **Tipo:**

  - **provide:** `Object | () => Object`
  - **inject:** `Array<string> | { [key: string]: string | Symbol | Object }`

- **Detalhes:**

  Esse par de opções é usado em conjunto para permitir que um componente ancestral sirva como um injetor de dependência para todos os seus descendentes, independentemente da profundidade da hierarquia do componente, desde que estejam na mesma cadeia do pai. Se você estiver familiarizado com React, isso é muito semelhante ao recurso `context` do React.

  A opção `provide` deve ser um objeto ou uma função que retorne um objeto. Este objeto contém as propriedades que estão disponíveis para injeção em seus descendentes. Você pode usar Symbols do ES2015 como chaves neste objeto, mas apenas em ambientes que suportem nativamente `Symbol` e `Reflect.ownKeys`.

  A opção `inject` deve ser:

  - um array de strings, ou
  - um objeto em que as chaves são o nome do vínculo local e o valor é:
    - a chave (string ou Symbol) para procurar nas injeções disponíveis, ou
    - um objeto onde:
      - a propriedade `from` é a chave (string ou Symbol) para procurar nas injeções disponíveis, e
      - a propriedade `default` é usada como valor de _fallback_

  > Nota: os vínculos `provide` e `inject` NÃO são reativos. Isso é intencional. No entanto, se você transmitir um objeto reativo, as propriedades desse objeto permanecerão reativas.

- **Exemplo:**

  ```js
  // componente pai fornecendo 'foo'
  const Provider = {
    provide: {
      foo: 'bar'
    }
    // ...
  }

  // componente filho injetando 'foo'
  const Child = {
    inject: ['foo'],
    created() {
      console.log(this.foo) // => "bar"
    }
    // ...
  }
  ```

  Com Symbols do ES2015, a função `provide` e objeto `inject`:

  ```js
  const s = Symbol()

  const Provider = {
    provide() {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s }
    // ...
  }
  ```

  Usando um valor injetado como _default_ para uma prop:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Usando um valor injetado como entrada de dados:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  As injeções podem ser opcionais com um valor padrão (_default_):

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Se precisar ser injetado de uma propriedade com um nome diferente, use `from` para denotar a propriedade de origem:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  Semelhante aos valores padrão de prop, você precisa usar uma função fabricadora para valores não primitivos:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **Ver também:** [Prover / Injetar](../guide/component-provide-inject.html)

## `setup`

- **Tipo:** `Function`

A função `setup` é uma nova opção de componente. Ela serve como ponto de entrada para usar a API de Composição dentro dos componentes.

- **Momento de Invocação**

  `setup` é chamada logo após a resolução inicial das props quando uma instância do componente é criada. Em termos de ciclo de vida, ela é chamado antes do gatilho [beforeCreate](./options-lifecycle-hooks.html#beforecreate).

- **Uso com _templates_**

  Se `setup` retornar um objeto, as propriedades do objeto serão mescladas no contexto de renderização do _template_ do componente:

  ```html
  <template>
    <div>{{ count }} {{ object.foo }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const count = ref(0)
        const object = reactive({ foo: 'bar' })

        // expõe ao template
        return {
          count,
          object
        }
      }
    }
  </script>
  ```

  Note que [refs](refs-api.html#ref) retornados de `setup` são automaticamente desempacotadas quando acessados ​​no _template_, então não há necessidade de `.value` nos _templates_.

- **Uso com Funções de Renderização / JSX**

  `setup` também pode retornar uma função de renderização, que pode usar diretamente o estado reativo declarado no mesmo escopo:

  ```js
  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })

      return () => h('div', [count.value, object.foo])
    }
  }
  ```

- **Argumentos**

  A função recebe as props resolvidas como seu primeiro argumento:

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      console.log(props.name)
    }
  }
  ```

  Observe que este objeto `props` é reativo - ou seja, ele é atualizado quando novas props são passadas ​​e pode ser observado e reagido ao usar `watchEffect` ou `watch`:

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      watchEffect(() => {
        console.log(`nome é: ` + props.name)
      })
    }
  }
  ```

  No entanto, NÃO desestruture o objeto `props`, pois ele perderá reatividade:

  ```js
  export default {
    props: {
      name: String
    },
    setup({ name }) {
      watchEffect(() => {
        console.log(`nome é: ` + name) // Não será reativo!
      })
    }
  }
  ```

  O objeto `props` é imutável para o código do usuário durante o desenvolvimento (irá emitir um aviso se o código do usuário tentar alterá-lo).

  O segundo argumento fornece um objeto de contexto que expõe vários objetos e funções que podem ser úteis no `setup`:

  ```js
  const MyComponent = {
    setup(props, context) {
      context.attrs
      context.slots
      context.emit
      context.expose
    }
  }
  ```

  `attrs`, `slots` e `emit` são equivalentes às propriedades de instância [`$attrs`](/api/instance-properties.html#attrs), [`$slots`](/api/instance-properties.html#slots) e [`$emit`](/api/instance-methods.html#emit) respectivamente.
  
  `attrs` e `slots` são _proxies_ para os valores correspondentes na instância interna do componente. Isso garante que eles sempre exponham os valores mais recentes, mesmo após as atualizações, para que possamos desestruturá-los sem nos preocupar em acessar uma referência obsoleta:

  ```js
  const MyComponent = {
    setup(props, { attrs }) {
      // uma função que pode ser chamada em um estágio posterior
      function onClick() {
        console.log(attrs.foo) // garantido ser a referência mais recente
      }
    }
  }
  ```

  `expose`, adicionado no Vue 3.2, é uma função que permite que propriedades específicas sejam expostas através da instância pública do componente. Por padrão, a instância pública recuperada usando refs, `$parent` ou `$root` é equivalente à instância interna usada pelo _template_. Chamar `expose` criará uma instância pública separada com as propriedades especificadas:

  ```js
  const MyComponent = {
    setup(props, { expose }) {
      const count = ref(0)
      const reset = () => count.value = 0
      const increment = () => count.value++

      // Somente reset estará disponível externamente, ex. via $refs
      expose({
        reset
      })

      // Internamente, o template tem acesso à count e increment
      return { count, increment }
    }
  }
  ```

  Existem várias razões para colocar `props` como um primeiro argumento separado em vez de incluí-lo no contexto:

  - É muito mais comum um componente usar `props` do que as outras propriedades, e muitas vezes um componente usa apenas `props`.

  - Ter `props` como um argumento separado torna mais fácil digitá-lo individualmente sem atrapalhar os tipos de outras propriedades no contexto. Também torna possível manter uma assinatura consistente em `setup`, `render` e componentes funcionais simples com suporte a TSX.

- **Ver também:** [API de Composição](composition-api.html)
