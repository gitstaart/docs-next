# Básico Sobre Acessibilidade

Acessibilidade web (também conhecida como a11y) refere-se à práticas na criação de websites que podem ser usados por qualquer pessoa - seja uma pessoa com uma incapacidade, uma conexão lenta, hardware desatualizado ou não funcionando corretamente ou simplesmente alguém em um ambiente adverso. Por exemplo, adicionar legendas à um vídeo ajudaria seus usuários surdos e com deficiência auditiva e aqueles que estão em um ambiente barulhento e não podem ouvir o telefone. Da mesma forma, certificar-se de que o seu texto não tenha um contraste muito baixo ajudará tanto os usuários com visão reduzida quanto os usuários que estão tentando usar o telefone sob luz solar intensa.

Pronto para começar, mas não tem certeza por onde?

Confira o [Guia de planejamento e gerenciamento de acessibilidade web](https://www.w3.org/WAI/planning-and-managing/) fornecido pelo [World Wide Web Consortium (W3C)](https://www.w3.org/)

## Link Pular Conteúdo

Você deve adicionar um link na parte superior de cada página que vai diretamente para a área de conteúdo principal para que os usuários possam pular o conteúdo que se repete em várias páginas web.

Normalmente, isso é feito no topo do `App.vue` pois será o primeiro elemento focável em todas as suas páginas:

```html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink">Pular para o conteúdo principal</a>
  </li>
</ul>
```

Para esconder o link a menos que ele esteja focado, você pode adicionar o seguinte estilo:

```css
.skipLink {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skipLink:focus {
  opacity: 1;
  background-color: white;
  padding: .5em;
  border: 1px solid black;
}
```

Depois que um usuário muda de rota, traga o foco de volta para o link de pular. Isso pode ser feito chamando a função _focus_ para a `ref` do elemento como exemplificado abaixo:

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus();
    }
  }
};
</script>
```

<common-codepen-snippet title="Pular para o conteúdo principal" user="emanuelgsouza" name="Emanuel Gonçalves" slug="GRqZbeq" :height="350" tab="js,result" theme="light" :preview="false" :editable="false" />

[Leia a documentação sobre pular para o conteúdo principal](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Estruture Seu Conteúdo

Uma das peças mais importantes da acessibilidade é garantir que o design possa oferecer suporte à implementação acessível. O design não deve considerar apenas o contraste das cores, a seleção das fontes, o tamanho dos textos e o idioma, mas também como o conteúdo é estruturado na aplicação.

### Títulos

Os usuários podem navegar em uma aplicação por meio de títulos. Ter títulos descritivos para cada seção de sua aplicação torna mais fácil para os usuários preverem o conteúdo de cada seção. Quando se trata de títulos, existem algumas práticas de acessibilidade recomendadas:

- Aninhar títulos em sua ordem de classificação: `<h1>` - `<h6>`
- Não pular títulos dentro de uma seção
- Usar tags de títulos reais em vez de estilizar o texto para dar a aparência visual de títulos

[Leia mais sobre títulos](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Título Principal</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Título da Seção </h2>
    <h3>Subtítulo da Seção</h3>
    <!-- Conteúdo -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Título da Seção </h2>
    <h3>Subtítulo da Seção</h3>
    <!-- Conteúdo -->
    <h3>Subtítulo da Seção</h3>
    <!-- Conteúdo -->
  </section>
</main>
```

### Landmarks

_Landmarks_ fornecem acesso programável às seções de uma aplicação. Os usuários que dependem de tecnologias assistivas podem navegar para cada seção da aplicação e pular seu conteúdo. Você pode usar [_ARIA roles_](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) para te ajudar à atingir isso.

| HTML             | _ARIA Role_          | Propósito da _Landmark_                                                                                                      |
| ---------------- | ---------------------| ---------------------------------------------------------------------------------------------------------------------------- |
| header           | role="banner"        | Título principal: título da página                                                                                           |
| nav              | role="navigation"    | Coleção de links adequados para uso ao navegar no documento ou documentos relacionados                                       |
| main             | role="main"          | O conteúdo principal ou central do documento.                                                                                |
| footer           | role="contentinfo"   | Informações sobre o documento principal: notas de rodapé/direitos autorais/links para declaração de privacidade              |
| aside            | role="complementary" | Suporta o conteúdo principal, mas é separado e significativo em seu próprio conteúdo                                         |
| _Não disponível_ | role="search"        | Esta seção contém a funcionalidade de pesquisa para a aplicação                                                              |
| form             | role="form"          | Coleção de elementos associados à formulários                                                                                |
| section          | role="region"        | Conteúdo relevante e para o qual os usuários provavelmente desejam navegar. Um rótulo deve ser fornecido para este elemento  |

:::tip Dica
É recomendado o uso de elementos HTML com atributos _role_ de referência redundantes para maximizar a compatibilidade com navegadores legados [que não oferecem suporte à elementos semânticos do HTML5](https://caniuse.com/#feat=html5semantic).
:::

[Leia mais sobre _landmarks_](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)
