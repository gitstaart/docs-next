---
sidebarDepth: 1
---

# `<script setup>` do SFC

`<script setup>` é um açúcar sintático em tempo de compilação para usar [API de Composição](/api/composition-api.html) dentro de Componentes Single-File (SFCs). É a sintaxe recomendada se você estiver usando SFCs e API de Composição. Ele fornece uma série de vantagens sobre a sintaxe normal do `<script>`:

- Código mais sucinto com menos _boilerplate_
- Capacidade de declarar props e eventos emitidos usando TypeScript puro
- Melhor desempenho em tempo de execução (o _template_ é compilado em uma função de renderização no mesmo escopo, sem um _proxy_ intermediário)
- Melhor desempenho de inferência de tipo na IDE (menos trabalho para o servidor de linguagem extrair tipos de código)

## Sintaxe Básica

Para ativar a sintaxe, adicione o atributo `setup` ao bloco `<script>`:

```vue
<script setup>
console.log('olá script setup')
</script>
```

O código dentro é compilado como o conteúdo da função `setup()` do componente. Isso significa que, diferentemente do `<script>` normal, que é executado apenas uma vez quando o componente é importado pela primeira vez, o código dentro do `<script setup>` **executará toda vez que uma instância do componente for criada**.

### Vínculos de Nível Superior são Expostos ao Template

Ao usar `<script setup>`, quaisquer vínculos de nível superior (incluindo variáveis, declarações de função e importações) declaradas dentro de `<script setup>` podem ser usadas diretamente no _template_:

```vue
<script setup>
// variável
const msg = 'Olá!'

// funções
function log() {
  console.log(msg)
}
</script>

<template>
  <div @click="log">{{ msg }}</div>
</template>
```

As importações são expostas da mesma forma. Isso significa que você pode usar diretamente uma função auxiliar importada em expressões de _template_ sem ter que expô-la através da opção `methods`:

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('olá') }}</div>
</template>
```

## Reatividade

O estado reativo precisa ser criado explicitamente usando [APIs de Reatividade](/api/basic-reactivity.html). Semelhante aos valores retornados de uma função `setup()`, refs são automaticamente desempacotados quando referenciados em _templates_:

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Usando Componentes

Os valores no escopo de `<script setup>` também podem ser usados ​​diretamente como nomes de tags de componentes personalizados:

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

Pense em `MyComponent` como sendo referenciado como uma variável. Se você usou JSX, o modelo mental é semelhante aqui. O equivalente kebab-case `<my-component>` também funciona no _template_ - no entanto, as tags do componente PascalCase são fortemente recomendadas para consistência. Também ajuda a diferenciar dos elementos personalizados nativos.

### Componentes Dinâmicos

Como os componentes são referenciados como variáveis ​​em vez de registrados em chaves string, você deve usar a vinculação dinâmica `:is` ao usar componentes dinâmicos dentro de `<script setup>`:

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

Observe como os componentes podem ser usados ​​como variáveis ​​em uma expressão ternária.

### Componentes Recursivos

Um SFC pode se referir implicitamente a si mesmo por meio de seu nome de arquivo. Por exemplo, um arquivo chamado `FooBar.vue` pode se referir a si mesmo como `<FooBar/>` em seu _template_.

Observe que isso tem prioridade menor do que os componentes importados. Se você tiver uma importação nomeada que conflite com o nome inferido do componente, você pode usar o _alias_ da importação:

```js
import { FooBar as FooBarChild } from './components'
```

### Componentes com Namespace

Você pode usar tags de componentes com pontos como `<Foo.Bar>` para se referir aos componentes aninhados nas propriedades do objeto. Isso é útil quando você importa vários componentes de um único arquivo:

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>rótulo</Form.Label>
  </Form.Input>
</template>
```

## Usando Diretivas Customizadas

As diretivas customizadas registradas globalmente funcionam como esperado, e as locais podem ser usadas diretamente no _template_, assim como explicamos acima para componentes.

Mas há uma restrição a ser observada: Você deve nomear as diretivas customizadas locais de acordo com o seguinte esquema: `vNameOfDirective` para que elas possam ser usadas diretamente no _template_.

```html
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // faz algo com o elemento
  }
}
</script>
<template>
  <h1 v-my-directive>Este é um Título</h1>
</template>
```
```html
<script setup>
  // importações também funcionam e podem ser nomeadas com o esquema necessário
  import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## `defineProps` e `defineEmits`

Para declarar `props` e `emits` em `<script setup>`, você deve usar as APIs `defineProps` e `defineEmits`, que fornecem suporte completo para inferência de tipos e estão automaticamente disponíveis dentro de `<script setup>`:

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// código de configuração
</script>
```

- `defineProps` e `defineEmits` são **macros de compilador** utilizáveis ​​apenas dentro de `<script setup>`. Eles não precisam ser importados e são compilados quando `<script setup>` é processado.

- `defineProps` aceita o mesmo valor que a [opção `props`](/api/options-data.html#props), enquanto `defineEmits` aceita o mesmo valor que a [opção `emits`](/api/options-data.html#emits).

- `defineProps` e `defineEmits` fornecem inferência de tipo adequada com base nas opções passadas.

- As opções passadas para `defineProps` e `defineEmits` serão içadas para fora do _setup_ no escopo do módulo. Portanto, as opções não podem fazer referência a variáveis ​​locais declaradas no escopo do _setup_. Fazer isso resultará em um erro de compilação. No entanto, _pode_ fazer referência a vínculos importados, pois eles também estão no escopo do módulo.

Se você estiver usando TypeScript, também é possível [declarar _props_ e _emits_ usando anotações de tipos puros](#recursos-somente-do-typescript).

## `defineExpose`

Componentes usando `<script setup>` são **fechados por padrão** - ou seja, a instância pública do componente, que é recuperada via refs de _template_ ou correntes de `$parent`, **não** exporá nenhuma das vinculações declaradas dentro de `<script setup>`.

Para expor explicitamente as propriedades em um componente `<script setup>`, use o macro de compilação `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

Quando um pai obtém uma instância deste componente via refs de _template_, a instância recuperada terá a forma `{ a: number, b: number }` (refs são automaticamente desempacotadas como em instâncias normais).

## `useSlots` e `useAttrs`

O uso de `slots` e `attrs` dentro de `<script setup>` deve ser relativamente raro, já que você pode acessá-los diretamente como `$slots` e `$attrs` no _template_. No caso raro em que você precisar deles, use os auxiliares `useSlots` e `useAttrs` respectivamente:

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` e `useAttrs` são funções de tempo de execução reais que retornam o equivalente de `setupContext.slots` e `setupContext.attrs`. Eles também podem ser usados ​​em funções de API de composição normal.

## Uso ao lado do `<script>` normal

`<script setup>` pode ser usado junto com o `<script>` normal. Um `<script>` normal pode ser necessário nos casos em que você precisa:

- Declarar opções que não podem ser expressas em `<script setup>`, por exemplo `inheritAttrs` ou opções customizadas habilitadas por meio de plugins.
- Declarar exportações nomeadas (incluindo tipos TypeScript).
- Executar efeitos colaterais ou crie objetos que devem ser executados apenas uma vez.

```vue
<script>
// normal <script>, executado no escopo do módulo (apenas uma vez)
runSideEffectOnce()

// declara opções adicionais
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// executado no escopo setup() (para cada instância)
</script>
```

:::warning Aviso
A função `render` não é suportada neste cenário. Por favor, use um `<script>` normal com a opção `setup`.
:::

## `await` de nível superior

O `await` de nível superior pode ser usado dentro de `<script setup>`. O código resultante será compilado como `async setup()`:

```vue
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

Além disso, a expressão aguardada será compilada automaticamente em um formato que preserva o contexto da instância do componente atual após o `await`.

:::warning Nota
`async setup()` deve ser usado em combinação com `Suspense`, que atualmente ainda é um recurso experimental. Planejamos finalizá-lo e documentá-lo em uma versão futura - mas se você estiver curioso agora, pode consultar seus [testes](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) para ver como funciona.
:::

## Recursos somente do TypeScript

### Exportações de tipos adicionais

Como observado acima, para exportar tipos adicionais de um SFC, eles devem ser movidos para um bloco `<script>` adicional ao lado do bloco `<script setup>`.

Por exemplo
```vue
<script lang="ts">
export type SizeOptions = 'small' | 'medium' | 'large';
</script>

<script lang="ts" setup>
defineProps({
  size: { type: String as PropType<SizeOptions> },
})
</script>
```

### Declarando somente o tipo de props/emits

Props e emits também podem ser declarados usando sintaxe de tipo puro passando um argumento de tipo literal para `defineProps` ou `defineEmits`:

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` ou `defineEmits` só podem usar declaração de tempo de execução OU declaração de tipo. Usar ambos ao mesmo tempo resultará em um erro de compilação.

- Ao usar a declaração de tipo, a declaração de tempo de execução equivalente é gerada automaticamente a partir da análise estática para eliminar a necessidade de declaração dupla e ainda garantir o comportamento correto em tempo de execução.

  - No modo dev, o compilador tentará inferir a validação em tempo de execução correspondente dos tipos. Por exemplo, aqui `foo: String` é inferido do tipo `foo: string`. Se o tipo for uma referência a um tipo importado, o resultado inferido será `foo: null` (igual ao tipo `any`) já que o compilador não possui informações de arquivos externos.

  - No modo de produção, o compilador gerará a declaração de formato de array para reduzir o tamanho do pacote (as props aqui serão compiladas em `['foo', 'bar']`)

  - O código emitido ainda é TypeScript com tipagem válida, podendo ser posteriormente processado por outras ferramentas.

- A partir de agora, o argumento de declaração de tipo deve ser um dos seguintes para garantir a análise estática correta:

  - Um literal de tipo
  - Uma referência a uma interface ou um literal de tipo no mesmo arquivo

  Atualmente, tipos complexos e importações de tipos de outros arquivos não são suportados. É teoricamente possível suportar importações de tipo no futuro.

### Valores padrão de props ao usar declaração de tipo

Uma desvantagem da declaração `defineProps` somente de tipo é que ela não tem uma maneira de fornecer valores padrão para as props. Para resolver este problema, uma macro do compilador `withDefaults` também é fornecida:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'olá',
  labels: () => ['um', 'dois']
})
```

Isso será compilado para as opções `default` de props equivalentes em tempo de execução. Além disso, o auxiliar `withDefaults` fornece verificações de tipo para os valores padrão e garante que o tipo `props` retornado tenha os sinalizadores opcionais removidos para propriedades que possuem valores padrão declarados.

## Restrição: Nenhuma Importação Src

Devido à diferença na semântica de execução do módulo, o código dentro de `<script setup>` depende do contexto de um SFC. Quando movido para arquivos externos `.js` ou `.ts`, pode causar confusão tanto para desenvolvedores quanto para ferramentas. Portanto, **`<script setup>`** não pode ser usado com o atributo `src`.
