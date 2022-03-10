# Guia de Renderização do Lado do Servidor

> Este guia atualmente está sob ativo desenvolvimento

## O que é Renderização do Lado do Servidor (SSR)?

Vue.js é uma framework para construir aplicativos _client-side_. Por padrão, os componentes Vue produzem e manipulam o DOM no navegador como saída. No entanto, também é possível renderizar os mesmos componentes em strings HTML no servidor, enviá-los diretamente para o navegador e, finalmente, "hidratar" a marcação estática em um aplicativo totalmente interativo no cliente.

Um aplicativo Vue.js renderizado pelo servidor também pode ser considerado "isomórfico" ou "universal". Isso significa que a maior parte do código do seu aplicativo é executada no servidor **e** no cliente.

## Por que SSR?

Comparado a um SPA (_Single-Page Application_) tradicional, a vantagem do SSR reside principalmente em:

- Melhor otimização de mecanismos de pesquisa (SEO), pois os rastreadores de mecanismos de pesquisa verão diretamente a página totalmente renderizada.

  Observe que, a partir de agora, o Google e o Bing podem indexar aplicativos JavaScript síncronos muito bem. Síncrono sendo a palavra-chave lá. Se seu aplicativo começar com um spinner de carregamento e, em seguida, buscar conteúdo por meio de chamada de API, o rastreador não aguardará que você termine. Isso significa que, se você tiver conteúdo obtido de forma assíncrona em páginas em que o SEO é importante, o SSR pode ser necessário.

- "Tempo até o conteúdo" mais rápido, especialmente na conexão lenta com a Internet ou em dispositivos lentos. A marcação renderizada pelo servidor não precisa esperar até que todo o JavaScript seja baixado e executado para ser exibida, para que seu usuário veja uma página totalmente renderizada mais cedo. Isso geralmente resulta em uma melhor experiência do usuário e pode ser fundamental para aplicativos em que o tempo de conteúdo está diretamente associado à taxa de conversão.

Há também algumas compensações a serem consideradas ao usar o SSR:

- Restrições de desenvolvimento. O código específico do navegador só pode ser usado dentro de determinados gatilhos de ciclo de vida; algumas bibliotecas externas podem precisar de tratamento especial para serem executadas em um aplicativo renderizado pelo servidor.

- Requisitos mais complexos de deploy e ambiente de compilação. Ao contrário de um SPA totalmente estático que pode ser implantado em qualquer servidor de arquivos estático, um aplicativo renderizado pelo servidor requer um ambiente em que um servidor Node.js possa ser executado.

- Mais carga do lado do servidor. A renderização de um aplicativo completo em Node.js exigirá mais da CPU do que apenas servir arquivos estáticos, portanto, se você espera alto tráfego, esteja preparado para a carga correspondente no servidor e empregue estratégias de armazenamento em cache com sabedoria.

Antes de usar o SSR para seu aplicativo, a primeira pergunta que você deve fazer é se você realmente precisa dele. Depende principalmente de quão importante é o "tempo até o conteúdo" para seu aplicativo. Por exemplo, se você estiver criando um dashboard interno em que algumas centenas de milissegundos extras na carga inicial não importam muito, SSR seria um exagero. No entanto, nos casos em que o "tempo até o conteúdo" é absolutamente crítico, o SSR pode ajudá-lo a obter o melhor desempenho de carregamento inicial possível.

## SSR vs Pré-renderização

Se você está apenas investigando o SSR para melhorar o SEO de um punhado de páginas de marketing (ex.: `/`, `/about`, `/contact`, etc), então você provavelmente quer a **pré-renderização**. Em vez de usar um servidor web para compilar HTML dinamicamente, a pré-renderização gera arquivos HTML estáticos para rotas específicas em tempo de compilação. A vantagem é que configurar a pré-renderização é muito mais simples e permite que você mantenha seu frontend como um site totalmente estático.

Se você estiver usando o [webpack](https://webpack.js.org/), poderá adicionar a pré-renderização com o [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin). Este foi amplamente testado com aplicativos Vue.

## Sobre Este Guia

[//]: # 'TODO: Este guia é focado em Single-Page Applications renderizados pelo servidor usando Node.js como servidor. Misturar o Vue SSR com outras configurações de backend é um tópico próprio e discutido brevemente em uma [seção dedicada].'

Este guia será muito aprofundado e pressupõe que você já esteja familiarizado com o próprio Vue.js e tenha um conhecimento de trabalho decente de Node.js e webpack.

Se você preferir uma solução de nível superior que forneça uma experiência suave e pronta para uso, provavelmente deveria experimentar o [Nuxt.js](https://nuxtjs.org/). Ele é construído sobre a mesma stack Vue, mas abstrai muito do _boilerplate_ e fornece alguns recursos extras, como geração de site estático. No entanto, pode não ser adequado ao seu caso de uso se você precisar de um controle mais direto da estrutura do seu aplicativo. Independentemente disso, ainda seria benéfico ler este guia para entender melhor como as coisas funcionam juntas.

[//]: # 'TODO: Enquanto você lê, seria útil consultar a [HackerNews Demo](https://github.com/vuejs/vue-hackernews-2.0/) oficial, que faz uso de a maioria das técnicas abordadas neste guia'

Por fim, observe que as soluções neste guia não são definitivas - descobrimos que estão funcionando bem para nós, mas isso não significa que não possam ser melhoradas. Elas podem ser revisados ​​no futuro - e sinta-se à vontade para contribuir enviando _pull requests_!
