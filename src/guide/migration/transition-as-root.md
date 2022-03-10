---
badges:
  - breaking
---

# `transition` como Raiz <MigrationBadges :badges="$frontmatter.badges" />

## Visão Geral

O uso de um `<transition>` como raiz de um componente não acionará mais transições quando o componente for alternado de fora.

## Comportamento v2.x

No Vue 2, era possível acionar uma transição de fora de um componente usando um `<transition>` como raiz do componente:

```html
<!-- componente modal -->
<template>
  <transition>
    <div class="modal"><slot/></div>
  </transition>
</template>
```

```html
<!-- uso -->
<modal v-if="showModal">olá</modal>
```

Alternar o valor de `showModal` acionaria uma transição dentro do componente modal.

Isso funcionou por acidente, não por design. Uma `<transition>` deve ser desencadeada por alterações em seus filhos, não alternando a própria `<transition>`.

Esta peculiaridade foi removida.

## Estratégia de Migração

Um efeito semelhante pode ser obtido passando uma prop para o componente:

```vue
<template>
  <transition>
    <div v-if="show" class="modal"><slot/></div>
  </transition>
</template>
<script>
export default {
  props: ['show']
}
</script>
```

```html
<!-- uso -->
<modal :show="showModal">olá</modal>
```

## Veja também

- [Algumas classes de transição foram renomeadas](/guide/migration/transition.html)
- [`<TransitionGroup>` agora não renderiza nenhum elemento _wrapper_ por padrão](/guide/migration/transition-group.html)
