---
badges:
  - breaking
---

# Eventos de Ciclo de Vida do VNode <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

No Vue 2, era possível usar eventos para escutar os principais estágios do ciclo de vida de um componente. Esses eventos tinham nomes que começavam com o prefixo `hook:`, seguido pelo nome do gatilho do ciclo de vida correspondente.

No Vue 3, esse prefixo foi alterado para `vnode-`. Além disso, esses eventos agora estão disponíveis para elementos HTML e componentes.

## Sintaxe v2.x

No Vue 2, o nome do evento é o mesmo que o gatilho do ciclo de vida equivalente, prefixado com `hook:`:

```html
<template>
  <child-component @hook:updated="onUpdated">
</template>
```

## Sintaxe v3.x

No Vue 3, o nome do evento é prefixado com `vnode-`:

```html
<template>
  <child-component @vnode-updated="onUpdated">
</template>
```

Ou apenas `vnode` se você estiver usando camelCase:

```html
<template>
  <child-component @vnodeUpdated="onUpdated">
</template>
```

## Estratégia de Migração

Na maioria dos casos, deve apenas exigir a alteração do prefixo. Os gatilhos do ciclo de vida `beforeDestroy` e `destroyed` foram renomeados para `beforeUnmount` e `unmounted` respectivamente, então os nomes dos eventos correspondentes também precisarão ser atualizados.

[Sinalizadores na compilação de migração: `INSTANCE_EVENT_HOOKS`](migration-build.html#configuracao-de-compatibilidade)

## Veja também

- [Guia de migração - API de eventos](/guide/migration/events-api.html)
