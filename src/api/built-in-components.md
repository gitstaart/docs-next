# Componentes Integrados

Os componentes integrados podem ser usados diretamente em _templates_ sem a necessidade de registro.

Os componentes `<keep-alive>`, `<transition>`, `<transition-group>`, e `<teleport>` podem ser todos _tree-shaken_ por empacotadores (_bundlers_), de modo que só são incluídos na construção se forem usados. Eles também podem ser importados explicitamente se você precisar de acesso direto ao próprio componente:

```js
// Distribuição em CDN do Vue
const { KeepAlive, Teleport, Transition, TransitionGroup } = Vue
```

```js
// Distribuição em ESM do Vue
import { KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'
```

`<component>` e `<slot>` são recursos da sintaxe de _template_ em forma de componentes. Eles não são componentes verdadeiros e não podem ser importados como os componentes mostrados acima.

## component

- **Propriedades:**

  - `is` - `string | Component | VNode`

- **Uso:**

  Um "meta componente" para renderizar componentes dinâmicos. O componente real a ser renderizado é determinado pela propriedade `is`. Uma propriedade `is` como string pode ser um nome de tag HTML ou um nome de componente.

  ```html
  <!-- um componente dinâmico controlado -->
  <!-- pela propriedade `componentId` na vm -->
  <component :is="componentId"></component>

  <!-- pode também renderizar um componente registrado ou componente passado como propriedade -->
  <component :is="$options.components.child"></component>

  <!-- pode referenciar componentes por string -->
  <component :is="condition ? 'FooComponent' : 'BarComponent'"></component>

  <!-- pode ser usado para renderizar elementos HTML nativos -->
  <component :is="href ? 'a' : 'span'"></component>
  ```

- **Uso com componentes integrados:**
  
  Os componentes integrados `KeepAlive`, `Transition`, `TransitionGroup`, e `Teleport` podem ser passados para `is`, mas você deve registrá-los se quiser transmiti-los por nome. Por exemplo: 

  ```js
  const { Transition, TransitionGroup } = Vue

  const Component = {
    components: {
      Transition,
      TransitionGroup
    },

    template: `
      <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
        ...
      </component>
    `
  }
  ```

  O registro não será necessário se você passar o próprio componente para `is` ao invés de seu nome.

- **Uso com VNodes:**

  Em casos de uso avançados, às vezes pode ser útil renderizar um VNode existente por meio de um _template_. Usar um `<component>` torna isso possível, mas deve ser visto como uma válvula de escape, usada para evitar reescrever o _template_ inteiro como uma função `render`.

  ```html
  <component :is="vnode" :key="aSuitableKey" />
  ```

  Uma ressalva de misturar VNodes e _templates_ dessa maneira é que você precisa fornecer um atributo `key` adequado. O VNode será considerado estático, portanto, quaisquer atualizações serão ignoradas, a menos que a `key` seja alterada. A `key` pode estar no VNode ou na tag `<component>`, mas de qualquer forma ela deve mudar toda vez que você quiser que o VNode seja renderizado novamente. Esta ressalva não se aplica se os nós tiverem tipos diferentes, por exemplo, alterando um `span` para um `div`.

- **Ver também:** [Componentes Dinâmicos](../guide/component-dynamic-async.html)

## transition

- **Propriedades:**

  - `name` - `string` Usado para gerar automaticamente nomes de classes CSS de transições. Por exemplo, `name: 'fade'` expandirá automaticamente para `.fade-enter`, `.fade-enter-active`, etc.
  - `appear` - `boolean`, Se a transição deve ser aplicada na renderização inicial deverá ser configurado para `true`. Por padrão, `false`.
  - `persisted` - `boolean`. Se estiver `true`, indica que esta transição não insere/remove realmente o elemento, mas alterna o status entre mostrar/esconder. Os gatilhos de transição são injetados, mas serão ignorados pelo renderizador. Em vez disso, uma diretiva personalizada pode controlar a transição chamando os gatilhos injetados (por exemplo `v-show`).
  - `css` - `boolean`. Aplicar ou não classes de transição CSS. Por padrão é `true`. Se configurado para `false`, apenas acionará gatilhos registrados no JavaScript por meio de eventos de componentes.
  - `type` - `string`. Especifica o tipo de eventos de transição a serem aguardados para determinar o tempo de término da transição. Os valores disponíveis são `"transition"` and `"animation"`. Por padrão, será detectado automaticamente o tipo que tenha uma duração mais longa.
  - `mode` - `string`. Controla a sequência de temporização das transições de saída/entrada. Modos disponíveis são  `"out-in"` e `"in-out"`; o padrão é simultâneo.
  - `duration` - `number | { enter: number, leave: number }`. Especifica a duração da transição. Por padrão, o Vue aguarda o primeiro evento de `transitionend` ou `animationend` no elemento de transição raiz.
  - `enter-from-class` - `string`
  - `leave-from-class` - `string`
  - `appear-class` - `string`
  - `enter-to-class` - `string`
  - `leave-to-class` - `string`
  - `appear-to-class` - `string`
  - `enter-active-class` - `string`
  - `leave-active-class` - `string`
  - `appear-active-class` - `string`

- **Eventos:**

  - `before-enter`
  - `before-leave`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (apenas `v-show`)
  - `appear-cancelled`

- **Uso:**

  `<transition>` servem como efeitos de transição para elemento/componente **único**. O `<transition>` aplica apenas o comportamento de transição para o conteúdo dentro do *wrapper*; Ele não renderiza um elemento DOM extra ou aparece na hierarquia dos componentes inspecionados.

  ```html
  <!-- elemento simples -->
  <transition>
    <div v-if="ok">conteúdo alternado</div>
  </transition>

  <!-- componente dinâmico -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- gatilhos de evento -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">conteúdo alternado</div>
    </transition>
  </div>
  ```

  ```js
  const app = createApp({
    ...
    methods: {
      transitionComplete (el) {
        // para o 'el' passado que é um elemento do DOM como um argumento ...
      }
    }
    ...
  })

  app.mount('#transition-demo')
  ```

- **Ver também:** [Transições de entrada e saída](/guide/transitions-enterleave.html#transicao-de-elementos-componentes-unicos)

## transition-group

- **Propriedades:**

  - `tag` - `string`, se não definido, renderiza sem um elemento raiz.
  - `move-class` - substitui a classe CSS aplicada durante a transição em movimento.
  - expõe as mesmas propriedades que `<transition>` exceto `mode`.

- **Eventos:**

  - expõe os mesmos eventos que `<transition>`.

- **Uso:**

  `<transition-group>` fornece efeitos de transição para **múltiplos** elementos/componentes. Por padrão, ele não renderiza um elemento *wrapper* no DOM, mas um pode ser definido por meio do atributo `tag`.

  Note que cada filho em um `<transition-group>` deve ser identificado com [**chave única**](./special-attributes.html#key) para as animações funcionarem corretamente.

  `<transition-group>` suporta transições de movimento via transformações CSS. Quando a posição de um elemento filho na tela muda após uma atualização, ele aplicará uma classe de movimento CSS (gerada automaticamente a partir do atributo `name` ou configurada com o atributo `move-class` ). Se a propriedade CSS `transform` for passível de transição quando a classe de movimento é aplicada, o elemento será animado suavemente para o seu destino usando a [técnica FLIP](https://aerotwist.com/blog/flip-your-animations/).

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

- **Ver também:** [Lista de Transições](/guide/transitions-list.html)

## keep-alive

- **Propriedades:**

  - `include` - `string | RegExp | Array`. Apenas os componentes com nomes correspondentes serão colocados em cache.
  - `exclude` - `string | RegExp | Array`. Qualquer componente com o nome correspondente não será colocado em cache.
  - `max` - `number | string`. O número máximo de instâncias do componente a serem colocadas em cache.

- **Uso:**

  Quando *wrapped* (envolvido) em torno de um componente dinâmico, `<keep-alive>` coloca as instâncias dos componentes inativos em cache sem os destruir. Semelhante a `<transition>`, `<keep-alive>` é um componente abstrato: ele não renderiza um elemento DOM em si, e não aparece na cadeia pai do componente.

  Quando um componente é alternado dentro de `<keep-alive>`, seus gatilhos de ciclo de vida `activated` e `deactivated` serão invocados de acordo, fornecendo uma alternativa para `mounted` e `unmounted`, que não são chamados. (Isso se aplica ao filho direto de `<keep-alive>`, bem como a todos os seus descendentes.)

  Usado principalmente para preservar o estado do componente ou evitar re-renderização.

  ```html
  <!-- básico -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- filhos com multiplas condições -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- usado juntamente com `<transition>` -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  Note que, `<keep-alive>` é projetado para o caso em que ele possui um componente filho direto que está sendo alternado. Isso não funciona se você tiver `v-for` dentro dele. Quando há múltiplos filhos condicionais, como acima, `<keep-alive>` exige que apenas um filho seja renderizado de cada vez.

- **`include` e `exclude`**

  As propriedades `include` e `exclude` permitem que os componentes sejam cacheados condicionalmente. Ambas as propriedades podem ser uma String separada por vígulas, uma RegExp ou um Array:

  ```html
  <!-- string separada por vírgulas -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (usando `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (usando `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  A correspondência é verificada primeiro na opção `name` do componente, depois pelo nome no registro local (a chave dentro da opção `components` do pai) se a opção `name` não estiver disponível. Os componentes anônimos não poder ser comparados.

- **`max`**

  O número máximo de instâncias do componente a serem guardadas em cache. Quando esse número for atingido, a instância do componente em cache que foi acessada menos recentemente será destruída antes de criar uma nova instância.

  ```html
  <keep-alive :max="10">
    <component :is="view"></component>
  </keep-alive>
  ```

  ::: warning Aviso
  `<keep-alive>` não funciona com componentes funcionais porque eles não têm instâncias a serem guardadas em cache.
  :::

- **Ver também:** [Componentes dinâmicos - keep-alive](../guide/component-dynamic-async.html#componentes-dinamicos-com-keep-alive)

## slot

- **Propriedades:**

  - `name` - `string`, Usado para o *slot* nomeado.

- **Uso:**

  `<slot>` servem como pontos de distribuição de conteúdo em _templates_ de componentes. O `<slot>` em si será substituído.

  Para obter detalhes sobre o uso, consulte a seção do guia no link abaixo.

- **Ver também:** [Distribuição de Conteúdo com Slots](../guide/component-basics.html#distribuicao-de-conteudo-com-slots)

## teleport

- **Propriedades:**

  - `to` - `string`. Propriedade obrigatória, tem que ser um seletor (*query*) válido, ou um elemento HTML (*HTMLElement*) (se usado no ambiente do navegador). Especifica um elemento de destino para onde o conteúdo de `<teleport>` será movido.

  ```html
  <!-- ok -->
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />

  <!-- Errado -->
  <teleport to="h1" />
  <teleport to="some-string" />
  ```

  - `disabled` - `boolean`. Esta propriedade opcional pode ser usada para desativar a funcionalidade de `<teleport>`, o que significa que o conteúdo do slot não será movido para qualquer lugar, e em vez disso será renderizado onde você especificou o `<teleport>` no componente pai que o envolve.

  ```html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

  Observe que isso moverá os nós DOM reais em vez de serem destruídos e recriados e também manterá todas as instâncias do componente vivas. Todos os elementos HTML com estado (por exemplo, um vídeo em reprodução) manterão seu estado.

- **Ver também:** [Componente de teletransporte](../guide/teleport.html#teleporte)
