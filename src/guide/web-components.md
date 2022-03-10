# Vue e Componentes da Web

[Componentes da Web](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components) é um termo genérico para um conjunto de APIs nativas da Web que permite aos desenvolvedores criar elementos customizados reutilizáveis.

Consideramos Vue e Componentes da Web como tecnologias primeiramente complementares. O Vue tem um excelente suporte para consumir e criar elementos customizados. Esteja você integrando elementos customizados em um aplicativo Vue existente ou usando o Vue para criar e distribuir elementos customizados, você está em boa companhia.

## Usando Elementos Customizados no Vue

Vue [pontuou um perfeito 100% nos testes do Custom Elements Everywhere](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Consumir elementos customizados dentro de um aplicativo Vue funciona basicamente da mesma forma que usar elementos HTML nativos, com algumas coisas a serem lembradas:

### Ignorando a Resolução de Componente

Por padrão, o Vue tentará resolver uma tag HTML não nativa como um componente Vue registrado antes de voltar a renderizá-lo como um elemento customizado. Isso fará com que o Vue emita um aviso de "falha ao resolver o componente" durante o desenvolvimento. Para que o Vue saiba que certos elementos devem ser tratados como elementos customizados e pular a resolução de componente, podemos especificar a [opção `compilerOptions.isCustomElement`](/api/application-config.html#compileroptions).

Se você estiver usando o Vue com um ambiente de compilação, a opção deve ser passada por meio das configurações de compilação, pois é uma opção de tempo de compilação.

#### Exemplo de Configuração no Navegador

```js
// Só funciona se estiver usando compilação no navegador.
// Para ferramentas de compilação, veja os exemplos de configuração abaixo.
app.config.compilerOptions.isCustomElement = tag => tag.includes('-')
```

#### Exemplo de Configuração do Vite

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // trata todas as tags com traço como elementos customizados
          isCustomElement: tag => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Exemplo de Configuração do Vue CLI

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // trata qualquer tag começando com ion- como elemento customizado
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Passando Propriedades do DOM

Como os atributos do DOM só podem ser strings, precisamos passar dados complexos para elementos customizados como propriedades do DOM. Ao definir props em um elemento customizado, o Vue 3 verifica automaticamente a presença da propriedade do DOM usando o operador `in` e prefere definir o valor como uma propriedade do DOM se a chave estiver presente. Isso significa que, na maioria dos casos, você não precisará pensar nisso se o elemento customizado seguir as [melhores práticas recomendadas](https://developers.google.com/web/fundamentals/web-components/best-practices#aim-to-keep-primitive-data-attributes-and-properties-in-sync,-reflecting-from-property-to-attribute,-and-vice-versa.).

No entanto, pode haver casos raros em que os dados devem ser passados ​​como uma propriedade do DOM, mas o elemento customizado não define/reflete adequadamente a propriedade (fazendo com que a verificação `in` falhe). Neste caso, você pode forçar um vínculo `v-bind` a ser definido como uma propriedade do DOM usando o modificador `.prop`:

```html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- equivalente abreviado -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Construindo Elementos Customizados com Vue

O principal benefício dos elementos customizados é que eles podem ser usados ​​com qualquer framework ou até mesmo sem um framework. Isso os torna ideais para distribuir componentes onde o consumidor final pode não estar usando a mesma stack de front-end ou quando você deseja isolar o aplicativo final dos detalhes de implementação dos componentes que ele usa.

### defineCustomElement

O Vue suporta a criação de elementos customizados usando exatamente as mesmas APIs de componentes Vue por meio do método [`defineCustomElement`](/api/global-api.html#definecustomelement). O método aceita o mesmo argumento que [`defineComponent`](/api/global-api.html#definecomponent), mas retorna um construtor de elemento customizados que estende `HTMLElement`:

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // opções normais de componentes Vue aqui
  props: {},
  emits: {},
  template: `...`,

  // somente defineCustomElement: CSS a ser injetado na raiz sombra
  styles: [`/* CSS inline */`]
})

// Registra o elemento personalizado.
// Após o registro, todas as tags `<my-vue-element>`
// na página serão atualizadas.
customElements.define('my-vue-element', MyVueElement)

// Você também pode instanciar programaticamente o elemento:
// (só pode ser feito após o registro)
document.body.appendChild(
  new MyVueElement({
    // props iniciais (opcional)
  })
)
```

#### Ciclo de Vida

- Um elemento customizado Vue montará uma instância interna do componente Vue dentro de sua raiz sombra quando o [`connectedCallback`](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components/Using_custom_elements#usando_os_callbacks_do_ciclo_de_vida) do elemento for chamado pela primeira vez.

- Quando o `disconnectedCallback` do elemento é invocado, o Vue verificará se o elemento é desconectado do documento após uma microtarefa.

  - Se o elemento ainda estiver no documento, é uma movimentação e a instância do componente será preservada;

  - Se o elemento for desanexado do documento, é uma remoção e a instância do componente será desmontada.

#### Props

- Todas as props declaradas usando a opção `props` serão definidas no elemento customizado como propriedades. Vue lidará automaticamente com a reflexão entre atributos / propriedades onde apropriado.

  - Os atributos são sempre refletidos nas propriedades correspondentes.

  - Propriedades com valores primitivos (`string`, `boolean` ou `number`) são refletidas como atributos.

- Vue também converte automaticamente props declarados com tipos `Boolean` ou `Number` no tipo desejado quando são definidos como atributos (que são sempre strings). Por exemplo, dada a seguinte declaração de props:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  E o uso do elemento customizado:

  ```html
  <my-element selected index="1"></my-element>
  ```

  No componente, `selected` será convertido em `true` (booleano) e `index` será convertido em `1` (número).

#### Eventos

Eventos emitidos via `this.$emit` ou configuração `emit` são despachados como [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) nativos no elemento customizado. Argumentos de eventos adicionais (_payload_) serão expostos como um array no objeto CustomEvent como sua propriedade `details`.

#### Slots

Dentro do componente, os slots podem ser renderizados usando o elemento `<slot/>` como de costume. No entanto, ao consumir o elemento resultante, ele aceita apenas [sintaxe de slots nativos](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- [Slots com escopo](/guide/component-slots.html#definicao-de-escopo-em-slots) não são compatíveis.

- Ao passar slots nomeados, use o atributo `slot` em vez da diretiva `v-slot`:

  ```html
  <my-element>
    <div slot="named">olá</div>
  </my-element>
  ```

#### Prover / Injetar

A [API Prover / Injetar](/guide/component-provide-inject.html#prover-e-injetar-dados) e sua [equivalente na API de Composição](/api/composition-api.html#prover-injetar) também funcionam entre elementos customizados. No entanto, observe que isso funciona **somente entre elementos customizados**. ou seja, um elemento customizado definido pelo Vue não poderá injetar propriedades fornecidas por um componente Vue de elemento não customizado.

### SFC como Elemento Customizado

`defineCustomElement` também funciona com Componentes Single-File do Vue (SFCs). No entanto, com a configuração padrão de ferramentas, o `<style>` dentro dos SFCs ainda será extraído e mesclado em um único arquivo CSS durante a compilação de produção. Ao usar um SFC como um elemento customizado, geralmente é desejável injetar as tags `<style>` na raiz sombra do elemento customizado.

As ferramentas SFC oficiais suportam a importação de SFCs no "modo de elemento customizado" (requer `@vitejs/plugin-vue@^1.4.0` ou `vue-loader@^16.5.0`). Um SFC carregado no modo de elemento customizado converte suas tags `<style>` em strings de CSS e as expõe na opção `styles` do componente. Isso será captado por `defineCustomElement` e injetado na raiz sombra do elemento quando instanciado.

Para ativar este modo, basta encerrar o nome do arquivo do componente com `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* CSS inline */"]

// converte em construtor de elemento customizado
const ExampleElement = defineCustomElement(Exemplo)

// registro
customElements.define('my-example', ExampleElement)
```

Se deseja personalizar quais arquivos devem ser importados no modo de elemento customizado (por exemplo, tratando _todos_ SFCs como elementos customizados), você pode passar a opção `customElement` para os respectivos plugins de compilação:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Dicas para uma Biblioteca de Elementos Customizados Vue

Ao construir elementos customizados com o Vue, os elementos contarão com o _runtime_ do Vue. Há um custo no tamanho inicial de ~16kb, dependendo de quantos recursos estão sendo usados. Isso significa que não é ideal usar o Vue se você estiver enviando um único elemento customizado - você pode desejar usar JavaScript vanilla, [petite-vue](https://github.com/vuejs/petite-vue) ou frameworks que especializam-se no tamanho pequeno do _runtime_. No entanto, o tamanho base é mais do que justificável se você estiver enviando uma coleção de elementos customizados com lógica complexa, pois o Vue permitirá que cada componente seja criado com muito menos código. Quanto mais elementos você enviar juntos, melhor será a troca.

Se os elementos customizados forem usados ​​em um aplicativo que também está usando o Vue, você pode optar por externalizar o Vue do pacote compilado para que os elementos usem a mesma cópia do Vue do aplicativo host.

Recomenda-se exportar os construtores de elementos individuais para dar aos usuários a flexibilidade de importá-los sob demanda e registrá-los com os nomes de tags desejados. Você também pode exportar uma função de conveniência para registrar automaticamente todos os elementos. Aqui está um exemplo de ponto de entrada de uma biblioteca de elementos customizados Vue:

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// exporta elementos individuais
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Se você tiver muitos componentes, também poderá aproveitar os recursos da ferramenta de compilação, como o [glob import](https://vitejs.dev/guide/features.html#glob-import) do Vite ou o [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) do webpack para carregar todos os componentes de um diretório.

## Componentes da Web vs. Componentes Vue

Alguns desenvolvedores acreditam que modelos de componente proprietários de frameworks devem ser evitados e que o uso exclusivo de elementos customizados torna um aplicativo "à prova de futuro". Aqui tentaremos explicar por que acreditamos que esta é uma visão excessivamente simplista do problema.

Há de fato um certo nível de sobreposição de recursos entre elementos customizados e componentes Vue: ambos nos permitem definir componentes reutilizáveis ​​com passagem de dados, emissão de eventos e gerenciamento do ciclo de vida. No entanto, as APIs de Web Components são de nível relativamente baixo e básicas. Para construir um aplicativo real, precisamos de alguns recursos adicionais que a plataforma não cobre:

- Um sistema de _templates_ declarativo e eficiente;

- Um sistema de gerenciamento de estado reativo que facilita a extração e reutilização de lógica entre componentes;

- Uma maneira eficiente de renderizar os componentes no servidor e hidratá-los no cliente (SSR), o que é importante para SEO e [métricas de Web Vitals, como LCP](https://web.dev/vitals/). Elementos customizados nativos SSR normalmente envolve simular o DOM em Node.js e então serializar o DOM modificado, enquanto Vue SSR compila em concatenação de strings sempre que possível, o que é muito mais eficiente.

O modelo de componentes do Vue é projetado com essas necessidades em mente como um sistema coerente.

Com uma equipe de engenharia competente, você provavelmente poderia construir o equivalente em cima de Elementos Customizados nativos - mas isso também significa que você está assumindo a carga de manutenção de longo prazo de um framework interno, enquanto perde o ecossistema e os benefícios da comunidade de um framework maduro como o Vue.

Existem também frameworks construídos usando Elementos Customizados como base do seu modelo de componente, mas todos eles inevitavelmente têm que apresentar suas soluções proprietárias para os problemas listados acima. O uso desses frameworks envolve a compra de suas decisões técnicas sobre como resolver esses problemas - o que, apesar do que pode ser anunciado, não o isola automaticamente de possíveis rotatividades futuras.

Existem também algumas áreas em que consideramos que os elementos customizados são limitantes:

- A execução antecipada do slot dificulta a composição de componente. Os [slots com escopo](/guide/component-slots.html#definicao-de-escopo-em-slots) do Vue são um mecanismo poderoso para composição de componentes, que não pode ser suportado por elementos customizados devido à natureza impaciente dos slots nativos. Slots impacientes também significam que o componente receptor não pode controlar quando ou se deve renderizar uma parte do conteúdo do slot.

- O envio de elementos customizados com CSS com escopo do shadow DOM hoje requer a incorporação do CSS dentro do JavaScript para que eles possam ser injetados nas raízes das sombras em tempo de execução. Eles também resultam em estilos duplicados na marcação em cenários SSR. Existem [recursos de plataforma](https://github.com/whatwg/html/pull/4898/) sendo trabalhados nesta área - mas a partir de agora eles ainda não são universalmente suportados, e ainda há preocupações sobre o desempenho de produção / SSR a serem tratadas. Enquanto isso, Vue SFCs fornecem [mecanismos de escopo de CSS](/api/sfc-style.html) que suportam a extração de estilos em arquivos CSS simples.

O Vue sempre se manterá atualizado com os padrões mais recentes da plataforma web, e teremos prazer em aproveitar o que a plataforma fornecer se facilitar nosso trabalho. No entanto, nosso objetivo é fornecer soluções que funcionem bem e funcionem hoje. Isso significa que temos que incorporar novos recursos da plataforma com uma mentalidade crítica - e isso envolve preencher as lacunas onde os padrões ficam aquém enquanto ainda for o caso.
