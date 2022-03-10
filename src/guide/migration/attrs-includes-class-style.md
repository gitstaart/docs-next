---
title: $attrs inclui classe e estilo
badges:
  - breaking
---

# `$attrs` inclui `class` & `style` <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

`$attrs` agora contém _todos_ atributos passados ​​para um componente, incluindo `class` e `style`.

## Comportamento v2.x

Os atributos `class` e `style` recebem algum tratamento especial na implementação do DOM virtual do Vue 2. Por essa razão, eles _não_ são incluídos em `$attrs`, enquanto todos os outros atributos são.

Um efeito colateral disso se manifesta ao usar `inheritAttrs: false`:

- Atributos em `$attrs` não são mais adicionados automaticamente ao elemento raiz, deixando para o desenvolvedor decidir onde adicioná-los.
- Mas `class` e `style`, não sendo parte de `$attrs`, ainda serão aplicados ao elemento raiz do componente:

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

quando usado assim:

```html
<my-component id="my-id" class="my-class"></my-component>
```

...irá gerar este HTML:

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

## Comportamento v3.x

`$attrs` contém _todos_ atributos, o que facilita a aplicação de todos eles a um elemento diferente. O exemplo acima agora gera o seguinte HTML:

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```

## Estratégia de Migração

Em componentes que usam `inheritAttrs: false`, certifique-se de que o estilo ainda funcione como pretendido. Se você confiava anteriormente no comportamento especial de `class` e `style`, alguns visuais podem ser quebrados, pois esses atributos agora podem ser aplicados a outro elemento.

[Sinalizador na compilação de migração: `INSTANCE_ATTRS_CLASS_STYLE`](migration-build.html#configuracao-de-compatibilidade)

## Veja também

- [RFC Relevante](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [Guia de migração - `$listeners` removido](./listeners-removed.md)
- [Guia de migração - Nova opção _Emits_](./emits-option.md)
- [Guia de migração - modificador `.native` removido](./v-on-native-modifier-removed.md)
- [Guia de migração - Mudanças na API de Funções de Renderização](./render-function-api.md)
