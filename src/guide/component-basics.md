# Básico sobre Componentes

<VideoLesson href="https://vueschool.io/courses/vue-js-3-components-fundamentals?friend=vuejs" title="Curso Gratuito de Fundamentos de Componentes em Vue.js">Aprenda o básico sobre componentes com um curso em vídeo gratuito na Vue School</VideoLesson>

## Exemplo Base

Aqui está um exemplo de um componente Vue:

```js
// Criando uma aplicação Vue
const app = Vue.createApp({})

// Definindo um novo componente global chamado button-counter
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Você me clicou {{ count }} vezes.
    </button>`
})
```

::: info
Estamos mostrando um exemplo simples aqui, mas em uma típica aplicação Vue, usamos Componentes Single File em vez de _template strings_. Você pode encontrar mais informações sobre eles [nesta seção](single-file-component.html).
:::

Componentes são instâncias reutilizáveis ​​com um nome: neste caso, `<button-counter>`. Podemos usar este componente como um elemento personalizado dentro de uma instância raiz:

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
app.mount('#components-demo')
```

<common-codepen-snippet title="Básico sobre Componentes" slug="yLOGZKE" tab="js,result" :preview="false" />

Uma vez que componentes são instâncias reutilizáveis, eles aceitam as mesmas opções que a instância raiz, como `data`, `computed`, `watch`, `methods` e gatilhos de ciclo de vida.

## Reutilizando Componentes

Componentes podem ser reutilizados quantas vezes você quiser:

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<common-codepen-snippet title="Básico sobre Componentes: Reutilizando Componentes" slug="GRZPzBN" tab="result" :preview="false" />

Perceba que ao clicar nos botões, cada um mantêm seu próprio e único `count`. Isso acontece porque cada vez que você usa um componente, uma nova **instância** dele é criada.

## Organizando Componentes

É comum que um aplicativo seja organizado em uma árvore de componentes aninhados:

![Árvore de Componentes](/images/components.png)

Por exemplo, você pode ter componentes para o cabeçalho, barra lateral e área de conteúdo, cada um normalmente contendo outros componentes para navegação, como links, postagens de _blog_, etc.

Para usar esses componentes em _templates_, eles devem ser registrados para que o Vue saiba deles. Há dois tipos de registro de componentes, sendo eles: **global** e **local**. Até agora, nós apenas registramos componentes globalmente, usando o método `component` do nosso app:

```js
const app = Vue.createApp({})

app.component('my-component-name', {
  // ... opções ...
})
```

Componentes registrados globalmente podem ser usados ​​no _template_ de qualquer componente do aplicativo.

Isso é tudo que você precisa saber sobre registro por hora, mas assim que terminar de ler esta página e se sentir confortável com seu conteúdo, recomendamos voltar mais tarde para ler o guia completo sobre [Registro de Componentes](component-registration.md).

## Passando Dados aos Filhos com Propriedades

Anteriormente, mencionamos a criação de um componente para postagens de _blog_. O problema é que esse componente não será útil a menos que você possa passar dados para ele, como o título e o conteúdo da postagem específica que queremos exibir. É aí que entram as propriedades (comumente chamadas apenas de _props_, já que este é o termo abreviado adotado pelo Vue).

Propriedades são atributos personalizados que você pode registrar em um componente. Para passar um título para o componente de postagem do nosso _blog_, podemos incluí-lo na lista de propriedades que este componente aceita, usando a opção `props`:

```js
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```

Quando um valor é passado para um atributo prop, ele se torna uma propriedade naquela instância de componente. O valor dessa propriedade está acessível no *template*, assim como qualquer outra propriedade do componente.

Um componente pode ter quantas propriedades você quiser e, por padrão, qualquer valor pode ser passado para qualquer propriedade.

Uma vez que uma propriedade é registrada, você pode passar dados para ela como um atributo personalizado, dessa forma:

```html
<div id="blog-post-demo" class="demo">
  <blog-post title="Minha jornada com Vue"></blog-post>
  <blog-post title="Escrevendo sobre o Vue"></blog-post>
  <blog-post title="Porquê Vue é tão divertido"></blog-post>
</div>
```

<common-codepen-snippet title="Básico sobre Componentes: Usando props" slug="wvGRNbP" tab="result" :preview="false" />

Em uma aplicação comum, no entanto, você provavelmente terá uma série de postagens em `data`:

```js
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'Minha jornada com Vue' },
        { id: 2, title: 'Escrevendo sobre o Vue' },
        { id: 3, title: 'Porquê Vue é tão divertido' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

E, em seguida, poderá querer renderizar um componente para cada uma delas:

```html
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

Acima, você viu que podemos usar `v-bind` para passar propriedades dinamicamente. Isso é especialmente útil quando você não sabe o conteúdo exato que irá renderizar com antecedência.

Por enquanto, isso é tudo que você precisa saber sobre propriedades, mas assim que terminar de ler esta página e se sentir confortável com seu conteúdo, recomendamos voltar mais tarde para ler o guia completo sobre [Propriedades](component-props.html).

## Escutando Eventos dos Filhos

Conforme desenvolvemos nosso componente `<blog-post>`, alguns recursos podem exigir comunicação de volta com o componente pai. Por exemplo, podemos decidir incluir um recurso de acessibilidade para ampliar o texto das postagens do _blog_, deixando o resto da página com o tamanho padrão.

No componente pai, podemos oferecer suporte a esse recurso adicionando uma propriedade `postFontSize`:

```js
const App = {
  data() {
    return {
      posts: [
        /* ... */
      ],
      postFontSize: 1
    }
  }
}
```

A qual poderia ser usada no _template_ para controlar o tamanho da fonte de todas as postagens do _blog_:

```html
<div id="blog-posts-events-demo">
  <div :style="{ fontSize: postFontSize + 'em' }">
    <blog-post
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
    ></blog-post>
  </div>
</div>
```

Agora, vamos adicionar um botão para ampliar o texto após o título de cada postagem:

```js
app.component('blog-post', {
  props: ['title'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button>
        Aumentar texto
      </button>
    </div>
  `
})
```

O problema é que este botão não executa nada:

```html
<button>
  Aumentar texto
</button>
```

Ao clicar no botão, precisamos comunicar ao componente pai que deve ampliar o texto de todas as postagens. Para resolver esse problema, as instâncias de componente fornecem um sistema de eventos personalizados. O componente pai pode escolher ouvir qualquer evento na instância do componente filho com `v-on` ou `@`, assim como faríamos com um evento DOM nativo:

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

Então, o componente filho pode emitir um evento por si próprio chamando o [método **`$emit`**](../api/instance-methods.html#emit), passando o nome do evento que o pai poderá escutar:

```html
<button @click="$emit('enlarge-text')">
  Aumentar texto
</button>
```

Graças à escuta `@enlarge-text="postFontSize += 0.1"`, o componente pai receberá o evento e atualizará o valor de `postFontSize`.

<common-codepen-snippet title="Básico sobre Componentes: Emitindo Eventos" slug="jOqXJEv" tab="result" :preview="false" />

Para sermos mais explícitos, podemos listar os eventos emitidos na opção `emits` do componente:

```js
app.component('blog-post', {
  props: ['title'],
  emits: ['enlargeText']
})
```

Isso permitirá que você verifique todos os eventos emitidos pelo componente e, opcionalmente, [validá-los](component-custom-events.html#validate-emitted-events).

### Emitindo um Valor com um Evento

Às vezes é útil emitir um valor específico com um evento. Por exemplo, nós talvez queiramos que o componente `<blog-post>` seja responsável por definir de quanto em quanto aumentar a fonte. Nesses casos, podemos passar um segundo parâmetro no método `$emit` para prover tal valor:

```html
<button @click="$emit('enlarge-text', 0.1)">
  Aumentar texto
</button>
```

Então, quando escutarmos o evento no componente pai, podemos acessar o valor emitido com `$event`:

```html
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

Ou, se o manipulador de eventos for um método:

```html
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

Então o valor será passado como o primeiro parâmetro desse método:

```js
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### Usando `v-model` em Componentes

Eventos personalizados podem também ser usados para criar _inputs_ personalizados que funcionam com `v-model`. Lembre-se que:

```html
<input v-model="searchText" />
```

Tem a mesma funcionalidade que:

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

No entanto, quando usado em um componente, `v-model` faria isso:

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

::: warning
Observe que usamos `model-value` com _kebab-case_ aqui porque estamos trabalhando com _templates_ diretamente no DOM. Você pode encontrar uma explicação detalhada sobre os atributos _kebab-cased_ vs. _camelCased_ na seção [Ressalvas na Análise do _template_ DOM](#ressalvas-na-analise-do-template-dom)
:::

Para realmente funcionar, o `<input>` dentro do componente precisa:

- Vincular o atributo `value` com a propriedade `modelValue`
- No `input`, emitir um evento `update:modelValue` com o novo valor

Então, aqui está isso em ação:

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

Agora o `v-model` deve funcionar perfeitamente com esse componente:

```html
<custom-input v-model="searchText"></custom-input>
```

Outra forma de implementar o `v-model` dentro deste componente é usar a capacidade das propriedades `computed` para definir um *getter* e *setter*. O método `get` deve retornar a propriedade `modelValue` e o método `set` deve emitir o evento correspondente:

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

Isso é tudo que você precisa saber sobre eventos personalizados em componentes por hora, mas assim que você terminar de ler essa página e se sentir confortável com o conteúdo, recomendamos retornar mais tarde para ler o guia completo de [Eventos Personalizados](component-custom-events.md).

## Distribuição de Conteúdo com _Slots_

Assim como em elementos HTML, muitas vezes é útil ser capaz de passar conteúdo dentro de um componente, dessa forma:

```html
<alert-box>
  Algo ruim aconteceu.
</alert-box>
```

Que renderizaria algo assim:

<common-codepen-snippet title="Básico sobre Componentes: slots" slug="WNwLmJP" :preview="false" />

Isso pode ser realizado usando o elemento `<slot>` personalizado do Vue:

```js
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Erro!</strong>
      <slot></slot>
    </div>
  `
})
```

Como você viu acima, nós usamos o `<slot>` como um *placeholder* para aonde queremos que o conteúdo vá – e é isso. Estamos prontos!

Isso é tudo que você precisa saber sobre _slots_ por hora, mas assim que você terminar de ler essa página e se sentir confortável com o conteúdo, recomendamos retornar mais tarde para ler o guia completo sobre [_Slots_](component-slots.md).

## Componentes Dinâmicos

Às vezes, é útil alternar dinamicamente entre componentes, como em uma interface de abas:

<common-codepen-snippet title="Básico sobre Componentes: Componentes Dinâmicos" slug="ZEWVPqY" :preview="false" />

O exemplo acima é possível por causa do elemento `<component>` com o atributo especial `is`:

```html
<!-- O componente atualiza quando currentTabComponent muda -->
<component :is="currentTabComponent"></component>
```

No exemplo acima, `currentTabComponent` pode conter:

- o nome do componente registrado, ou
- o objeto de opções de inicialização um componente

Veja [esse exemplo](https://codepen.io/vuejs-br/pen/ZEWVPqY) para experimentar com este código por sua conta, ou veja [essa versão](https://codepen.io/vuejs-br/pen/ZEWVPZb) para um exemplo vinculando ao objeto de opções de inicialização de um componente, ao invés de vincular ao seu nome registrado.

Você também pode usar o atributo `is` para criar elementos HTML comuns.

Isso é tudo que você precisa saber sobre componentes dinâmicos por hora mas, assim que você terminar de ler essa página e se sentir confortável com o conteúdo, recomendamos retornar mais tarde para ler o guia completo sobre [Componentes Dinâmicos & Assíncronos](./component-dynamic-async.html).

## Ressalvas na Análise do _template_ DOM

Se você estiver escrevendo seus _templates_ Vue diretamente no DOM, o Vue terá que recuperar a string do _template_ do DOM. Isso leva a algumas ressalvas devido ao comportamento da análise de HTML nativo dos navegadores.

:::tip Nota
Deve-se observar que as limitações discutidas abaixo se aplicam apenas se você estiver escrevendo seus _templates_ diretamente no DOM. Eles NÃO se aplicam se você estiver usando _templates_ em string das seguintes fontes:

- _Templates_ String (e.g. `template: '...'`)
- [Componentes Single-file (`.vue`)](single-file-component.html)
- `<script type="text/x-template">`
:::

### Restrições na Colocação de Elementos

Alguns elementos HTML, como `<ul>`, `<ol>`, `<table>` e `<select>` têm restrições do que pode aparecer dentro deles, e alguns elementos como `<li>`, `<tr>`, e `<option>` podem aparecer apenas dentro de certos elementos.

Isso nos leva a problemas quando usamos componentes com elementos que tem tais restrições. Por exemplo:

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

O componente `<blog-post-row>` será removido como um conteúdo inválido, causando erros na eventual renderização. Podemos usar o atributo especial [`is`](/api/special-attributes.html#is) como uma forma de contornar o problema:

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip Nota
Quando usado em elementos HTML nativos, o valor de `is` deve ser prefixado com `vue:` para ser interpretado como um componente Vue. Isso é necessário para evitar confusão com [elementos integrados personalizados](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) nativos.
:::

### Insensibilidade entre Maiúsculas e Minúsculas

Nomes de atributos HTML são insensíveis à notação de maiúsculas/minúsculas (_case-insensitive_), então os navegadores interpretarão quaisquer caracteres maiúsculos como minúsculos. Isso significa que, quando você está usando _templates_ diretamente no DOM, nomes de propriedades _camelCased_ e parâmetros de manipuladores de eventos precisarão usar seus equivalentes _kebab-cased_ (ou seja, em minúsculas e delimitados por hífen):

```js
// camelCase em JavaScript
app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- kebab-case em HTML -->
<blog-post post-title="hello!"></blog-post>
```

Isso é tudo que você precisa saber sobre componentes dinâmicos por hora – na verdade, esse é o fim da seção _Essenciais_ do Vue. Parabéns! Ainda há mais a ser aprendido, mas antes, recomendamos que tire um tempo para brincar com o Vue por conta própria e criar alguma coisa divertida.

Assim que você se sentir confortável com o conteúdo que vimos, recomendamos retornar mais tarde para ler o guia completo de [Componentes Dinâmicos & Assíncronos](component-dynamic-async.html), como também as outras páginas na seção Componentes em Detalhes da barra lateral.
