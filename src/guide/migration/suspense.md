---
badges:
  - new
---

# Suspense <MigrationBadges :badges="$frontmatter.badges" />

:::warning Experimental
Suspense é um novo recurso experimental e a API pode mudar a qualquer momento. Está documentado aqui para que a comunidade possa fornecer feedback sobre a implementação atual.

Não deve ser usado em aplicativos em produção.
:::

## Introdução

É comum que os componentes precisem realizar algum tipo de solicitação assíncrona antes de serem renderizados corretamente. Os componentes geralmente lidam com isso localmente e, em muitos casos, essa é uma abordagem perfeitamente boa.

O componente `<suspense>` fornece uma alternativa, permitindo que a espera seja tratada mais adiante na árvore de componentes em vez de em cada componente individual.

Um caso de uso comum envolve [componentes assíncronos](/guide/component-dynamic-async.html#componentes-assincronos):

```vue{2-4,6,17}
<template>
  <suspense>
    <template #default>
      <todo-list />
    </template>
    <template #fallback>
      <div>
        Carregando...
      </div>
    </template>
  </suspense>
</template>

<script>
export default {
  components: {
    TodoList: defineAsyncComponent(() => import('./TodoList.vue'))
  }
}
</script>
```

O componente `<suspense>` tem dois slots. Ambos os slots permitem apenas um nó filho imediato. O nó no slot `default` é mostrado se possível. Caso contrário, o nó no slot `fallback` será exibido.

Importante, o componente assíncrono não precisa ser o filho imediato do `<suspense>`. Ele pode estar em qualquer profundidade dentro da árvore de componentes e não precisa aparecer no mesmo _template_ que o próprio `<suspense>`. O conteúdo só é considerado resolvido quando todos os descendentes estiverem prontos.

A outra maneira de acionar o slot `fallback` é um componente descendente retornar uma promise de sua função `setup`. Isso geralmente é implementado usando `async` em vez de retornar explicitamente uma promise:

```js{2}
export default {
  async setup() {
    // Tenha muito cuidado ao usar `await` dentro de `setup` como
    // a maioria das funções da API de Composição só funcionará
    // antes do primeiro `await`
    const data = await loadData()

    // Isso está implicitamente envolvido em uma promise porque
    // a função é `assíncrona`
    return {
      // ...
    }
  }
}
```

## Atualizações em Filhos

Uma vez que um `<suspense>` tenha resolvido o conteúdo de seu slot `default`, ele só pode ser acionado novamente se o nó raiz `default` for substituído. Novos componentes aninhados mais profundamente na árvore não são suficientes para mover o `<suspense>` de volta para um estado pendente.

Se o nó raiz mudar, ele acionará o evento `pending`. No entanto, por padrão, ele não atualizará o DOM para mostrar o conteúdo `fallback`. Em vez disso, ele continuará mostrando o DOM antigo até que os novos componentes estejam prontos. Isso pode ser controlado usando a prop `timeout`. Este valor, expresso em milissegundos, diz ao componente `<suspense>` quanto tempo esperar antes de mostrar o `fallback`. Um valor de `0` irá mostrá-lo imediatamente quando o `<suspense>` entrar no estado pendente.

## Eventos

Além do evento `pending`, o componente `<suspense>` também possui eventos `resolve` e `fallback`. O evento `resolve` é emitido quando o novo conteúdo termina de resolver no slot `default`. O evento `fallback` é acionado quando o conteúdo do slot `fallback` é mostrado.

Os eventos podem ser usados, por exemplo, para mostrar um indicador de carregamento na frente do DOM antigo enquanto novos componentes estão sendo carregados.

## Combinando com Outros Componentes

É comum querer usar `<suspense>` em combinação com os componentes [`<transition>`](/api/built-in-components.html#transition) e [`<keep-alive>`](/api/built-in-components.html#keep-alive). A ordem de aninhamento desses componentes é importante para que todos funcionem corretamente.

Além disso, esses componentes são frequentemente usados ​​em conjunto com o componente `<router-view>` do [Vue Router](https://next.router.vuejs.org/).

O exemplo a seguir mostra como aninhar esses componentes para que todos se comportem conforme o esperado. Para combinações mais simples, você pode remover os componentes desnecessários:

```html
<router-view v-slot="{ Component }">
  <template v-if="Component">
    <transition mode="out-in">
      <keep-alive>
        <suspense>
          <component :is="Component"></component>
          <template #fallback>
            <div>
              Carregando...
            </div>
          </template>
        </suspense>
      </keep-alive>
    </transition>
  </template>
</router-view>
```

O Vue Router tem suporte embutido para [carregar componentes preguiçosamente](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) usando importações dinâmicas. Eles são distintos dos componentes assíncronos e atualmente eles não acionarão `<suspense>`. No entanto, eles ainda podem ter componentes assíncronos como descendentes e esses podem acionar `<suspense>` da maneira usual.
