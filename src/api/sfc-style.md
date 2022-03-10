---
sidebarDepth: 1
---

# Recursos de Estilo em SFC

## `<style scoped>`

Quando uma tag `<style>` tem o atributo `scoped`, seu CSS será aplicado apenas aos elementos do componente atual. Isso é semelhante ao encapsulamento de estilo encontrado no Shadow DOM. Ele vem com algumas ressalvas, mas não requer _polyfills_. Isso é obtido usando PostCSS para transformar o seguinte:

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">oi</div>
</template>
```

No seguinte:

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>oi</div>
</template>
```

### Elementos-raiz de Componente Filho

Com `scoped`, os estilos do componente pai não vazarão para os componentes filhos. No entanto, o nó raiz de um componente filho será afetado pelo CSS com escopo do pai e pelo CSS com escopo do filho. Isso ocorre por design para que o pai possa estilizar o elemento raiz filho para fins de layout.

### Seletores Profundos

Se você quiser que um seletor em estilos `scoped` seja "profundo", ou seja, afetando componentes filhos, você pode usar a pseudo-classe `:deep()`:

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

O acima será compilado em:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip Dica
O conteúdo do DOM criado com `v-html` não é afetado por estilos com escopo, mas você ainda pode estilizá-los usando seletores profundos.
:::

### Seletores _Slotted_

Por padrão, os estilos com escopo não afetam o conteúdo renderizado por `<slot/>`, pois são considerados de propriedade do componente pai que os transmite. Para mirar explicitamente o conteúdo do slot, use a pseudoclasse `:slotted`:

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### Seletores Globais

Se quiser que apenas uma regra seja aplicada globalmente, você pode usar a pseudo-classe `:global` em vez de criar outra `<style>` (veja abaixo):

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### Misturando Estilos Locais e Globais

Você também pode incluir estilos com e sem escopo no mesmo componente:

```vue
<style>
/* estilos globais */
</style>

<style scoped>
/* estilos locais */
</style>
```

### Dicas para Estilo com Escopo

- **Estilos com escopo não eliminam a necessidade de classes**. Devido à maneira como os navegadores renderizam vários seletores CSS, `p { color: red }` será muitas vezes mais lento quando com escopo (ou seja, quando combinado com um seletor de atributo). Se você usar classes ou ids, como em `.example { color: red }`, você praticamente elimina esse impacto no desempenho.

- **Tenha cuidado com seletores descendentes em componentes recursivos!** Para uma regra CSS com o seletor `.a .b`, se o elemento que corresponde a `.a` contiver um componente filho recursivo, então todos os `.b` deste componente filho serão mirados pela regra.

## `<style module>`

Uma tag `<style module>` é compilada como [CSS Modules](https://github.com/css-modules/css-modules) e expõe as classes CSS resultantes ao componente como um objeto sob a chave de `$style`:

```vue
<template>
  <p :class="$style.red">
    Este deve ser vermelho
  </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

As classes resultantes recebem _hash_ para evitar colisões, alcançando o mesmo efeito de definir o escopo do CSS apenas para o componente atual.

Consulte a [especificação de Módulos CSS](https://github.com/css-modules/css-modules) para obter mais detalhes, como [exceções globais](https://github.com/css-modules/css-modules#exceptions) e [composição](https://github.com/css-modules/css-modules#composition).

### Nome de Injeção Customizado

Você pode personalizar a chave de propriedade do objeto de classes injetado dando um valor ao atributo `module`:

```vue
<template>
  <p :class="classes.red">vermelho</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### Uso com API de Composição

As classes injetadas podem ser acessadas em `setup()` e `<script setup>` por meio da API [`useCssModule`](/api/global-api.html#usecssmodule). Para blocos `<style module>` com nomes de injeção customizados, `useCssModule` aceita o valor do atributo `module` correspondente como o primeiro argumento:

```js
// default, retorna classes para <style module>
useCssModule()

// nomeado, retorna classes para <style module="classes">
useCssModule('classes')
```

## CSS Dinâmico Controlado por Estado

As tags de SFC `<style>` suportam a vinculação de valores CSS ao estado dinâmico do componente usando a função CSS `v-bind`:

```vue
<template>
  <div class="text">olá</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

A sintaxe funciona com [`<script setup>`](./sfc-script-setup) e suporta expressões JavaScript (devem estar entre aspas):

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>olá</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

O valor real será compilado em uma propriedade CSS customizada com _hash_, portanto, o CSS ainda é estático. A propriedade customizada será aplicada ao elemento raiz do componente por meio de estilos _inline_ e atualizada de forma reativa se o valor de origem for alterado.
