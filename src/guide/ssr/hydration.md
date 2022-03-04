# Hidratação _Client-Side_

Hidratação refere-se ao processo _client-side_ durante o qual o Vue assume o HTML estático enviado pelo servidor e o transforma em DOM dinâmico que pode reagir às alterações de dados _client-side_.

Em `entry-client.js`, estamos simplesmente montando o aplicativo com esta linha:

```js
app.mount('#app')
```

Como o servidor já renderizou a marcação, obviamente não queremos jogar isso fora e recriar todos os elementos DOM. Em vez disso, queremos "hidratar" a marcação estática e torná-la interativa.

O Vue fornece um método `createSSRApp` para uso no código _client-side_ (neste caso, em nosso `entry-client.js`) para dizer ao Vue para hidratar o HTML estático existente em vez de recriar todos os elementos DOM.

### Limitações da Hidratação

O Vue confirmará que a árvore DOM virtual gerada pelo cliente corresponde à estrutura DOM renderizada a partir do servidor. Se houver uma incompatibilidade, ele deixará a hidratação, descartará o DOM existente e renderizará do zero. Haverá um aviso no console do navegador, mas seu site ainda funcionará.

A primeira forma importante de garantir que o SSR esteja funcionando é garantir que o estado do aplicativo seja o mesmo no cliente e no servidor. Tome cuidado especial para não depender de APIs específicas do navegador (como largura da janela, capacidade do dispositivo ou localStorage) ou do servidor (como _built-ins_ do Node), e tome cuidado onde o mesmo código dará resultados diferentes quando executado em locais diferentes (como ao usar fusos horários, _timestamps_, normalizar URLs ou gerar números aleatórios). Consulte [Escrevendo Código Universal](./universal.md) para mais detalhes.

Uma segunda coisa importante a ser observada ao usar o SSR + hidratação no cliente é que HTML inválido pode ser alterado pelo navegador. Por exemplo, quando você escreve isso em um _template_ Vue:

```html
<table>
  <tr>
    <td>oi</td>
  </tr>
</table>
```

O navegador automaticamente injetará `<tbody>` dentro de `<table>`, entretanto, o DOM virtual gerado pelo Vue não contém `<tbody>`, então causará uma incompatibilidade. Para garantir a correspondência correta, certifique-se de escrever um HTML válido em seus _templates_.

Você pode usar um validador de HTML como [o W3C Markup Validation Service](https://validator.w3.org/) ou [HTML-validate](https://html-validate.org/) para verificar seus _templates_ em desenvolvimento.
