---
title: Modificador v-on.native removido
badges:
  - breaking
---

# Modificador `v-on.native` removido <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

O modificador `.native` para `v-on` foi removido.

## Sintaxe v2.x

Os escutadores de eventos passados ​​para um componente com `v-on` são por padrão apenas acionados pela emissão de um evento com `this.$emit`. Para adicionar um escutador nativo do DOM ao elemento raiz do componente filho, o modificador `.native` pode ser usado:

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click.native="handleNativeClickEvent"
/>
```

## Sintaxe v3.x

O modificador `.native` para `v-on` foi removido. Ao mesmo tempo, a [nova opção `emits`](./emits-option.md) permite que o filho defina quais eventos ele de fato emite.

Consequentemente, o Vue agora adicionará todos os escutadores de eventos que _não_ são definidos como eventos emitidos por componentes no filho como escutadores de eventos nativos ao elemento raiz do filho (a menos que `inheritAttrs: false` tenha sido definido nas opções do filho).

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```

`MyComponent.vue`

```html
<script>
  export default {
    emits: ['close']
  }
</script>
```

## Estratégia de Migração

- remova todas as instâncias do modificador `.native`.
- certifique-se de que todos os seus componentes documentem seus eventos com a opção `emits`.

[Sinalizador na compilação de migração: `COMPILER_V_ON_NATIVE`](migration-build.html#configuracao-de-compatibilidade)

## Veja também

- [RFC Relevante](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md#v-on-listener-fallthrough)
- [Guia de migração - Nova Opção Emits](./emits-option.md)
- [Guia de migração - `$listeners` removido](./listeners-removed.md)
- [Guia de migração - Alterações na API de funções de renderização](./render-function-api.md)
