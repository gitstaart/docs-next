# Escrevendo Código Universal

Antes de prosseguir, vamos discutir as restrições ao escrever código "universal" - ou seja, código que é executado no servidor e no cliente. Devido às diferenças de caso de uso e API de plataforma, o comportamento do nosso código não será exatamente o mesmo quando executado em ambientes diferentes. Aqui vamos falar sobre as principais coisas que você precisa estar ciente.

## Reatividade de Dados no Servidor

Em um aplicativo _client-only_, cada usuário usará uma nova instância do aplicativo em seu navegador. Para renderização do lado do servidor, queremos o mesmo: cada solicitação deve ter uma instância de aplicativo nova e isolada para que não haja poluição de estado em solicitação cruzada.

Como o processo de renderização real precisa ser determinístico, também estaremos "_pre-fetching_" dados no servidor - isso significa que o estado do nosso aplicativo já estará resolvido quando iniciarmos a renderização. Isso significa que a reatividade de dados é desnecessária no servidor, então está desabilitada por padrão. A desativação da reatividade de dados também evita o custo de desempenho da conversão de dados em objetos reativos.

## Gatilhos de Ciclo de Vida do Componente

Como não há atualizações dinâmicas, os únicos [gatilhos de ciclo de vida](/guide/instance.html#gatilhos-de-ciclo-de-vida) que serão chamados durante o SSR são `beforeCreate` e `created`. Isso significa que qualquer código dentro de outros gatilhos de ciclo de vida, como `beforeMount` ou `mounted`, só serão executados no cliente.

Outra coisa a notar é que você deve evitar código que produza efeitos colaterais globais em `beforeCreate` e `created`, por exemplo configurando temporizadores com `setInterval`. No código _client-side_ podemos configurar um temporizador e, em seguida, destruí-lo em `beforeUnmount` ou `unmounted`. No entanto, como os gatilhos de destruição não serão chamados durante o SSR, os temporizadores permanecerão para sempre. Para evitar isso, mova seu código de efeito colateral para `beforeMount` ou `mounted`.

## Acesso a APIs Específicas da Plataforma

Código universal não pode assumir o acesso a APIs específicas de uma plataforma, portanto, se seu código usar diretamente globais somente do navegador, como `window` ou `document`, gerará erros quando executado no Node.js e vice-versa.

Para tarefas compartilhadas entre servidor e cliente, mas usando APIs de plataforma diferentes, é recomendável agrupar as implementações específicas da plataforma dentro de uma API universal ou usar bibliotecas que fazem isso para você. Por exemplo, [axios](https://github.com/axios/axios) é um cliente HTTP que expõe a mesma API para servidor e cliente.

Para APIs somente do navegador, a abordagem comum é acessá-las preguiçosamente dentro de gatilhos de ciclo de vida _client-only_.

Observe que, se uma biblioteca de terceiros não for escrita com o uso universal em mente, pode ser complicado integrá-la em um aplicativo renderizado pelo servidor. Você _pode_ ser capaz de fazê-lo funcionar simulando alguns dos globais, mas seria _hacky_ e pode interferir no código de detecção de ambiente de outras bibliotecas.

## Diretivas Customizadas

A maioria das [diretivas customizadas](/guide/custom-directive.html#diretivas-customizadas) manipula diretamente o DOM, o que causará erros durante o SSR. Recomendamos usar componentes como mecanismo de abstração em vez de diretivas.
