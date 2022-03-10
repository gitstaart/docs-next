# Segurança

## Reportando Vulnerabilidades

Quando uma vulnerabilidade é reportada, ela imediatamente se torna nossa principal preocupação, com um contribuidor em tempo integral largando tudo para trabalhar nela. Para reportar uma vulnerabilidade, envie um e-mail para [security@vuejs.org](mailto:security@vuejs.org).

Embora a descoberta de novas vulnerabilidades seja rara, também recomendamos sempre usar as versões mais recentes do Vue e suas bibliotecas complementares oficiais para garantir que seu aplicativo permaneça o mais seguro possível.

## Regra nº 1: Nunca Use Templates Não Confiáveis

A regra de segurança mais fundamental ao usar o Vue é **nunca use conteúdo não confiável como seu _template_ de componente**. Fazer isso é equivalente a permitir a execução arbitrária de JavaScript em seu aplicativo - e pior, pode levar a violações do servidor se o código for executado durante a renderização do lado do servidor. Um exemplo desse uso:

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // NUNCA FAÇA ISSO
}).mount('#app')
```

Os _templates_ Vue são compilados em JavaScript, e as expressões dentro dos _templates_ serão executadas como parte do processo de renderização. Embora as expressões sejam avaliadas em um contexto de renderização específico, devido à complexidade de ambientes de execução global em potencial, é impraticável para um _framework_ como o Vue protegê-lo completamente de uma possível execução de código malicioso sem incorrer em sobrecarga de desempenho irreal. A maneira mais direta de evitar essa categoria de problemas é garantir que o conteúdo de seus _templates_ Vue seja sempre confiável e totalmente controlado por você.

## Ações do Vue Para Te Proteger

### conteúdo HTML

Seja usando _templates_ ou funções de renderização, o conteúdo é tratado automaticamente. Isso significa que neste _template_:

```html
<h1>{{ userProvidedString }}</h1>
```

se `userProvidedString` continha:

```js
'<script>alert("oi")</script>'
```

então seria tratado para o seguinte HTML:

```html
&lt;script&gt;alert(&quot;oi&quot;)&lt;/script&gt;
```

evitando assim a injeção de script. Esse tratamento é feito usando APIs nativas do navegador, como `textContent`, portanto, uma vulnerabilidade só pode existir se o próprio navegador for vulnerável.

### Vínculos de atributo

Da mesma forma, os vínculos dinâmicos de atributos também são tratados automaticamente. Isso significa que neste _template_:

```html
<h1 :title="userProvidedString">
  Olá
</h1>
```

se `userProvidedString` continha:

```js
'" onclick="alert(\'oi\')'
```

então seria tratado para o seguinte HTML:

```html
&quot; onclick=&quot;alert('oi')
```

evitando assim o fechamento do atributo `title` para injetar um novo HTML arbitrário. Esse tratamento é feito usando APIs nativas do navegador, como `setAttribute`, portanto, uma vulnerabilidade só pode existir se o próprio navegador for vulnerável.

## Potenciais Perigos

Em qualquer aplicativo Web, permitir que conteúdo não sanitizado fornecido pelo usuário seja executado como HTML, CSS ou JavaScript é potencialmente perigoso, portanto, deve ser evitado sempre que possível. Há momentos em que algum risco pode ser aceitável.

Por exemplo, serviços como CodePen e JSFiddle permitem que o conteúdo fornecido pelo usuário seja executado, mas é em um contexto em que isso é esperado e protegido até certo ponto dentro de iframes. Nos casos em que um recurso importante requer inerentemente algum nível de vulnerabilidade, cabe à sua equipe avaliar a importância do recurso em relação aos piores cenários que a vulnerabilidade permite.

### Injetando HTML

Como aprendeu anteriormente, o Vue trata automaticamente o conteúdo HTML, evitando que você injete acidentalmente HTML executável em seu aplicativo. No entanto, nos casos em que sabe que o HTML é seguro, você pode renderizar explicitamente o conteúdo HTML:

- Usando um _template_:

  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- Usando uma função de renderização:

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- Usando uma função de renderização com JSX:

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::tip Nota
Observe que o HTML fornecido pelo usuário nunca pode ser considerado 100% seguro, a menos que esteja em um iframe em área restrita ou em uma parte do aplicativo em que apenas o usuário que escreveu esse HTML possa ser exposto a ele. Além disso, permitir que os usuários escrevam seus próprios _templates_ Vue traz perigos semelhantes.
:::

### Injetando URLs

Em uma URL como esta:

```html
<a :href="userProvidedUrl">
  clique em mim
</a>
```

Há um possível problema de segurança se o URL não tiver sido "sanitizado" para impedir a execução de JavaScript usando `javascript:`. Existem bibliotecas como [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) para ajudar com isso, mas observe:

:::tip Nota
Se você está fazendo limpeza de URL no frontend, já tem um problema de segurança. Os URLs fornecidos pelo usuário devem sempre ser sanitizados pelo seu back-end antes mesmo de serem salvos em um banco de dados. Assim, o problema é evitado para _todos_ os clientes que se conectam à sua API, incluindo aplicativos móveis nativos. Observe também que, mesmo com URLs sanitizadas, o Vue não pode ajudá-lo a garantir que elas levem a destinos seguros.
:::

### Injetando Estilos

Olhando para este exemplo:

```html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  clique em mim
</a>
```

vamos supor que `sanitizedUrl` tenha sido sanitizado, então é definitivamente uma URL real e não JavaScript. Com o `userProvidedStyles`, usuários mal-intencionados ainda podem fornecer CSS para "_click jack_", por exemplo. estilizando o link em uma caixa transparente sobre o botão "Log in". Então, se `https://user-control-website.com/` for construído para se parecer com a página de login do seu aplicativo, eles podem ter capturado as informações de login reais de um usuário.

Você pode imaginar como permitir conteúdo fornecido pelo usuário para um elemento `<style>` criaria uma vulnerabilidade ainda maior, dando a esse usuário controle total sobre como estilizar a página inteira. É por isso que o Vue impede a renderização de tags de estilo dentro de _templates_, como:

```html
<style>{{ userProvidedStyles }}</style>
```

Para manter seus usuários totalmente protegidos contra o _click jacking_, recomendamos permitir apenas o controle total sobre o CSS dentro de um iframe em área restrita. Como alternativa, ao fornecer controle ao usuário por meio de um estilo com vínculo, recomendamos usar sua [sintaxe de objeto](class-and-style.html#sintaxe-de-objeto-2) e permitir que os usuários forneçam apenas valores para propriedades específicas que sejam seguras para eles controlarem , assim:

```html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  clique em mim
</a>
```

### Injetando JavaScript

Nós desencorajamos fortemente renderizar um elemento `<script>` com Vue, já que _templates_ e funções de renderização nunca devem ter efeitos colaterais. No entanto, essa não é a única maneira de incluir strings que seriam executadas como JavaScript em tempo de execução.

Cada elemento HTML tem atributos com valores que aceitam strings de JavaScript, como `onclick`, `onfocus` e `onmouseenter`. Vincular JavaScript fornecido pelo usuário a qualquer um desses atributos de evento é um risco de segurança em potencial, portanto, deve ser evitado.

:::tip Nota
Observe que o JavaScript fornecido pelo usuário nunca pode ser considerado 100% seguro, a menos que esteja em um iframe em área restrita ou em uma parte do aplicativo em que apenas o usuário que escreveu esse JavaScript possa ser exposto a ele.
:::

Às vezes recebemos reportagem de vulnerabilidade sobre como é possível fazer _cross-site scripting_ (XSS) em _templates_ Vue. Em geral, não consideramos esses casos como vulnerabilidades reais, porque não há uma maneira prática de proteger os desenvolvedores dos dois cenários que permitiriam o XSS:

1. O desenvolvedor está pedindo explicitamente ao Vue que renderize conteúdo não sanitizado fornecido pelo usuário como _templates_ Vue. Isso é inerentemente inseguro e não há como o Vue saber a origem.

2. O desenvolvedor está montando o Vue em uma página HTML inteira que contém conteúdo renderizado pelo servidor e fornecido pelo usuário. Este é fundamentalmente o mesmo problema do \#1, mas às vezes os desenvolvedores podem fazer isso sem perceber. Isso pode levar a possíveis vulnerabilidades em que o invasor fornece HTML que é seguro como HTML simples, mas inseguro como um _template_ Vue. A melhor prática é nunca montar o Vue em nós que possam conter conteúdo renderizado pelo servidor e fornecido pelo usuário.

## Melhores Práticas

A regra geral é que, se permitir que conteúdo não sanitizado fornecido pelo usuário seja executado (como HTML, JavaScript ou mesmo CSS), você pode estar se abrindo para ataques. Este conselho realmente é válido, seja usando Vue, outro framework, ou mesmo nenhum framework.

Além das recomendações feitas acima para [Potenciais Perigos](#potenciais-perigos), também recomendamos que você se familiarize com estes recursos:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [Cross Site Scripting (XSS) Prevention Cheat Sheet do OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

Em seguida, use o que você aprendeu para também revisar o código-fonte de suas dependências em busca de padrões potencialmente perigosos, se algum deles incluir componentes de terceiros ou influenciar o que é renderizado para o DOM.

## Coordenação do Back-end

Vulnerabilidades de segurança HTTP, como falsificação de solicitação entre sites (CSRF/XSRF) e inclusão de script _cross-site_ (XSSI), são abordadas principalmente no back-end, portanto, não são uma preocupação do Vue. No entanto, ainda é uma boa ideia se comunicar com sua equipe de back-end para saber como interagir melhor com sua API, por exemplo, enviando tokens CSRF com envios de formulários.

## Renderização do Lado do Servidor (SSR)

Existem algumas preocupações de segurança adicionais ao usar SSR, portanto, certifique-se de seguir as práticas recomendadas descritas em [nossa documentação de SSR](ssr/introduction.html) para evitar vulnerabilidades.
