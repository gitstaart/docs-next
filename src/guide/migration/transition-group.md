---
title: Elemento Raiz para Transição em Grupo
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

`<transition-group>` não renderiza mais um elemento raiz por padrão, mas ainda pode criar um com o atributo `tag`.

## Sintaxe v2.x

No Vue 2, `<transition-group>`, como outros componentes personalizados, precisava de um elemento raiz, que por padrão era um `<span>`, mas era personalizável através do atributo `tag`.

```html
<transition-group tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</transition-group>
```

## Sintaxe v3.x

No Vue 3, temos [suporte a fragmentos](/guide/migration/fragments.html), então os componentes não precisam mais de um nó raiz. Consequentemente, `<transition-group>` não renderiza mais um por padrão.

- Se você já tem o atributo `tag` definido em seu código Vue 2, como no exemplo acima, tudo funcionará como antes
- Se você não tem um definido _e_ seu estilo ou outros comportamentos dependem da presença do elemento raiz `<span>` para funcionar corretamente, basta adicionar `tag="span"` ao `<transition-group>`:

```html
<transition-group tag="span">
  <!-- -->
</transition-group>
```

## Estratégia de Migração

[Sinalizador na compilação de migração: `TRANSITION_GROUP_ROOT`](migration-build.html#configuracao-de-compatibilidade)

## Veja também

- [Algumas classes de transição foram renomeadas](/guide/migration/transition.html)
- [`<Transition>` como root não pode mais ser alternado do lado de fora](/guide/migration/transition-as-root.html)
