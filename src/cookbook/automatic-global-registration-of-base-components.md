# Registro Global Automático de Componentes Base

## Exemplo Básico

Muitos de seus componentes serão relativamente genéricos, possivelmente envolvendo apenas um elemento como um _input_ ou um botão. Às vezes, nos referimos a eles como [componentes base](../style-guide/#nomes-de-componentes-base-fortemente-recomendado) e eles tendem a ser usados ​​com muita frequência em seus componentes.

O resultado é que muitos componentes podem incluir longas listas de componentes base:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'
export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Apenas para suportar relativamente pouca marcação em um _template_:

```html
<BaseInput v-model="searchText" @keydown.enter="search" />
<BaseButton @click="search">
  <BaseIcon name="search" />
</BaseButton>
```

Felizmente, se você estiver usando webpack (ou [Vue CLI](https://github.com/vuejs/vue-cli), que usa webpack internamente), você pode usar `require.context` para registrar globalmente apenas esses componentes base comuns. Aqui está um exemplo do código que você pode usar para importar globalmente componentes base no arquivo de entrada do seu aplicativo (ex.: `src/main.js`):

```js
import { createApp } from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'

const app = createApp(App)

const requireComponent = require.context(
  // O caminho relativo da pasta de componentes
  './components',
  // Se deve ou não procurar nas subpastas
  false,
  // Expressão regular para encontrar nomes de arquivos de componente base
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Obtém a configuração do componente
  const componentConfig = requireComponent(fileName)

  // Obtém o nome do componente em PascalCase
  const componentName = upperFirst(
    camelCase(
      // Obtém o nome do arquivo independente da profundidade da pasta
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  app.component(
    componentName,
    // Procura opções do componente em `.default`, que irá
    // existir se o componente foi exportado com `export default`,
    // caso contrário, volta para a raiz do módulo.
    componentConfig.default || componentConfig
  )
})

app.mount('#app')
```
