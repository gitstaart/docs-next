# API do Escopo de Efeito <Badge text="3.2+" />

:::info
Escopo de efeito é uma API avançada destinada principalmente a autores de bibliotecas. Para obter detalhes sobre como aproveitar essa API, consulte o [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md) correspondente.
:::

## `effectScope`

Cria um objeto de escopo de efeito que pode capturar os efeitos reativos (por exemplo, computados e observadores) criados dentro dele para que esses efeitos possam ser descartados juntos.

**Tipando:**

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // indefinido se o escopo estiver inativo
  stop(): void
}
```

**Exemplo:**

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Contagem: ', doubled.value))
})

// para descartar todos os efeitos no escopo
scope.stop()
```

## `getCurrentScope`

Retorna o [escopo de efeito](#effectscope) atualmente ativo se houver um.

**Tipando:**

```ts
function getCurrentScope(): EffectScope | undefined
```

## `onScopeDispose`

Registra um _callback_ de descarte no [escopo de efeito](#effectscope) atualmente ativo. O _callback_ será invocado quando o escopo de efeito associado for interrompido.

Este método pode ser usado como um substituto de `onUnmounted` "não acoplado a componentes" em funções de composição reutilizáveis, uma vez que a função `setup()` de cada componente Vue também é invocada em um escopo de efeito.

**Tipando:**

```ts
function onScopeDispose(fn: () => void): void
```
