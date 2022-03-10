const sidebar = {
  cookbook: [
    {
      title: 'Livro de Receitas',
      collapsable: false,
      children: [
        '/cookbook/',
        '/cookbook/editable-svg-icons',
        '/cookbook/debugging-in-vscode',
        '/cookbook/automatic-global-registration-of-base-components'
      ]
    }
  ],
  guide: [
    {
      title: 'Essenciais',
      collapsable: false,
      children: [
        '/guide/installation',
        '/guide/introduction',
        '/guide/instance',
        '/guide/template-syntax',
        '/guide/data-methods',
        '/guide/computed',
        '/guide/class-and-style',
        '/guide/conditional',
        '/guide/list',
        '/guide/events',
        '/guide/forms',
        '/guide/component-basics'
      ]
    },
    {
      title: 'Componentes em Detalhes',
      collapsable: false,
      children: [
        '/guide/component-registration',
        '/guide/component-props',
        '/guide/component-attrs',
        '/guide/component-custom-events',
        '/guide/component-slots',
        '/guide/component-provide-inject',
        '/guide/component-dynamic-async',
        '/guide/component-template-refs',
        '/guide/component-edge-cases'
      ]
    },
    {
      title: 'Transições & Animações',
      collapsable: false,
      children: [
        '/guide/transitions-overview',
        '/guide/transitions-enterleave',
        '/guide/transitions-list',
        '/guide/transitions-state'
      ]
    },
    {
      title: 'Reuso & Composição',
      collapsable: false,
      children: [
        {
          title: 'API de Composição',
          children: [
            '/guide/composition-api-introduction',
            '/guide/composition-api-setup',
            '/guide/composition-api-lifecycle-hooks',
            '/guide/composition-api-provide-inject',
            '/guide/composition-api-template-refs'
          ]
        },
        '/guide/mixins',
        '/guide/custom-directive',
        '/guide/teleport',
        '/guide/render-function',
        '/guide/plugins'
      ]
    },
    {
      title: 'Guias Avançados',
      collapsable: false,
      children: [
        '/guide/web-components',
        {
          title: 'Reatividade',
          children: [
            '/guide/reactivity',
            '/guide/reactivity-fundamentals',
            '/guide/reactivity-computed-watchers'
          ]
        },
        '/guide/optimizations',
        '/guide/change-detection'
      ]
    },
    {
      title: 'Ferramentas',
      collapsable: false,
      children: [
        '/guide/single-file-component',
        '/guide/testing',
        '/guide/typescript-support',
        '/guide/mobile',
        '/guide/tooling/deployment'
      ]
    },
    {
      title: 'Escalonando',
      collapsable: false,
      children: [
        '/guide/routing',
        '/guide/state-management',
        '/guide/ssr',
        '/guide/security'
      ]
    },
    {
      title: 'Acessibilidade',
      collapsable: false,
      children: [
        '/guide/a11y-basics',
        '/guide/a11y-semantics',
        '/guide/a11y-standards',
        '/guide/a11y-resources'
      ]
    }
  ],
  api: [
    '/api/application-config',
    '/api/application-api',
    '/api/global-api',
    {
      title: 'Opções',
      path: '/api/options-api',
      collapsable: false,
      children: [
        '/api/options-data',
        '/api/options-dom',
        '/api/options-lifecycle-hooks',
        '/api/options-assets',
        '/api/options-composition',
        '/api/options-misc'
      ]
    },
    '/api/instance-properties',
    '/api/instance-methods',
    '/api/directives',
    '/api/special-attributes',
    '/api/built-in-components.md',
    {
      title: 'API de Reatividade',
      path: '/api/reactivity-api',
      collapsable: false,
      children: [
        '/api/basic-reactivity',
        '/api/refs-api',
        '/api/computed-watch-api',
        '/api/effect-scope',
      ]
    },
    '/api/composition-api',
    {
      title: 'Componentes Single-File',
      collapsable: false,
      children: [
        {
          title: 'Especificação',
          path: '/api/sfc-spec'
        },
        {
          title: 'Ferramentas',
          path: '/api/sfc-tooling'
        },
        {
          title: '<script setup>',
          path: '/api/sfc-script-setup'
        },
        {
          title: 'Recursos do <style>',
          path: '/api/sfc-style'
        }
      ]
    }
  ],
  examples: [
    {
      title: 'Exemplos',
      collapsable: false,
      children: [
        '/examples/markdown',
        '/examples/commits',
        '/examples/grid-component',
        '/examples/tree-view',
        '/examples/svg',
        '/examples/modal',
        '/examples/elastic-header',
        '/examples/select2',
        '/examples/todomvc'
      ]
    }
  ],
  migration: [
    '/guide/migration/introduction',
    '/guide/migration/migration-build',
    {
      title: 'Detalhes',
      collapsable: false,
      children: [
        '/guide/migration/array-refs',
        '/guide/migration/async-components',
        '/guide/migration/attribute-coercion',
        '/guide/migration/attrs-includes-class-style',
        '/guide/migration/children',
        '/guide/migration/custom-directives',
        '/guide/migration/custom-elements-interop',
        '/guide/migration/data-option',
        '/guide/migration/emits-option',
        '/guide/migration/events-api',
        '/guide/migration/filters',
        '/guide/migration/fragments',
        '/guide/migration/functional-components',
        '/guide/migration/global-api',
        '/guide/migration/global-api-treeshaking',
        '/guide/migration/inline-template-attribute',
        '/guide/migration/key-attribute',
        '/guide/migration/keycode-modifiers',
        '/guide/migration/listeners-removed',
        '/guide/migration/mount-changes',
        '/guide/migration/props-data',
        '/guide/migration/props-default-this',
        '/guide/migration/render-function-api',
        '/guide/migration/slots-unification',
        '/guide/migration/suspense',
        '/guide/migration/transition',
        '/guide/migration/transition-as-root',
        '/guide/migration/transition-group',
        '/guide/migration/v-on-native-modifier-removed',
        '/guide/migration/v-model',
        '/guide/migration/v-if-v-for',
        '/guide/migration/v-bind',
        '/guide/migration/vnode-lifecycle-events',
        '/guide/migration/watch'
      ]
    }
  ],
  ssr: [
    ['/guide/ssr/introduction', 'Introduction'],
    '/guide/ssr/getting-started',
    '/guide/ssr/universal',
    '/guide/ssr/structure',
    '/guide/ssr/build-config',
    '/guide/ssr/server',
    '/guide/ssr/routing',
    '/guide/ssr/hydration'
  ],
  contributing: [
    {
      title: 'Contribua com a Documentação',
      collapsable: false,
      children: [
        '/guide/contributing/writing-guide',
        '/guide/contributing/doc-style-guide',
        '/guide/contributing/translations'
      ]
    }
  ]
}

module.exports = {
  title: 'Vue.js',
  description: 'Vue.js - O Framework JavaScript Progressivo',
  head: [
    [
      'link',
      {
        href:
        'https://fonts.googleapis.com/css?family=Inter:300,400,500,600|Open+Sans:400,600;display=swap',
        rel: 'stylesheet'
      }
    ],
    [
      'link',
      {
        href:
          'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        rel: 'stylesheet'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.png'
      }
    ],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/images/icons/apple-icon-152x152.png'
      }
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/images/icons/ms-icon-144x144.png'
      }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    [
      'script',
      {
        src: 'https://player.vimeo.com/api/player.js'
      }
    ],
    [
      'script',
      {
        src: 'https://extend.vimeocdn.com/ga/72160148.js',
        defer: 'defer'
      }
    ]
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      {
        text: 'Documentação',
        ariaLabel: 'Menu de Documentação',
        items: [
          {
            text: 'Guia',
            link: '/guide/introduction'
          },
          {
            text: 'Guia de Estilos',
            link: '/style-guide/'
          },
          {
            text: 'Livro de Receitas',
            link: '/cookbook/'
          },
          {
            text: 'Exemplos',
            link: '/examples/markdown'
          },
          {
            text: 'Contribua',
            link: '/guide/contributing/writing-guide'
          },
          {
            text: 'Migração do Vue 2',
            link: '/guide/migration/introduction'
          }
        ]
      },
      {
        text: 'Referência da API',
        link: '/api/'
      },
      {
        text: 'Ecossistema',
        items: [
          {
            text: 'Comunidade',
            ariaLabel: 'Menu de Comunidade',
            items: [
              {
                text: 'Equipe',
                link: '/community/team/'
              },
              {
                text: 'Parceiros',
                link: '/community/partners'
              },
              {
                text: 'Junte-se',
                link: '/community/join/'
              },
              {
                text: 'Temas',
                link: '/community/themes/'
              }
            ]
          },
          {
            text: 'Projetos Oficiais',
            items: [
              {
                text: 'Vue Router',
                link: 'https://next.router.vuejs.org/'
              },
              {
                text: 'Vuex',
                link: 'https://next.vuex.vuejs.org/'
              },
              {
                text: 'Vue CLI',
                link: 'https://cli.vuejs.org/'
              },
              {
                text: 'Vue Test Utils',
                link: 'https://next.vue-test-utils.vuejs.org/guide/'
              },
              {
                text: 'Devtools',
                link: 'https://devtools.vuejs.org'
              },
              {
                text: 'Notícias semanais',
                link: 'https://news.vuejs.org/'
              },
              {
                text: 'Blog',
                link: 'https://blog.vuejs.org/'
              }
            ]
          }
        ]
      },
      {
        text: 'Patrocine',
        link: '/support-vuejs/',
        items: [
          {
            text: 'Doações Únicas',
            link: '/support-vuejs/#doacoes-unicas'
          },
          {
            text: 'Ajuda Recorrente',
            link: '/support-vuejs/#doacoes-recorrentes'
          },
          {
            text: 'Loja de Camisetas',
            link: 'https://vue.threadless.com/'
          }
        ]
      },
      {
        text: 'Traduções',
        link: '#',
        items: [
          // Translation maintainers: Please include the link below to the English documentation
          {
            text: 'English',
            link: 'https://v3.vuejs.org/',
            isTranslation: true
          },
          {
            text: '中文',
            link: 'https://v3.cn.vuejs.org/',
            isTranslation: true
          },
          {
            text: '한국어',
            link: 'https://v3.ko.vuejs.org/',
            isTranslation: true
          },
          {
            text: '日本語',
            link: 'https://v3.ja.vuejs.org/',
            isTranslation: true
          },
          {
            text: 'Русский',
            link: 'https://v3.ru.vuejs.org/ru/',
            isTranslation: true
          },
          {
            text: 'Mais Traduções',
            link: '/guide/contributing/translations#traducoes-da-comunidade'
          }
        ]
      }
    ],
    repo: 'vuejs-br/docs-next',
    editLinks: true,
    editLinkText: 'Edite isto no GitHub!',
    lastUpdated: 'Atualizado pela última vez',
    docsDir: 'src',
    sidebarDepth: 2,
    sidebar: {
      collapsable: false,
      '/guide/migration/': sidebar.migration,
      '/guide/contributing/': sidebar.contributing,
      '/guide/ssr/': sidebar.ssr,
      '/guide/': sidebar.guide,
      '/community/': sidebar.guide,
      '/cookbook/': sidebar.cookbook,
      '/api/': sidebar.api,
      '/examples/': sidebar.examples
    },
    smoothScroll: false,
    algolia: {
      indexName: 'vuejs-v3',
      appId: 'BH4D9OD16A',      
      apiKey: 'bc6e8acb44ed4179c30d0a45d6140d3f',
      placeholder: 'Buscar na documentação'
    },
    carbonAds: {
      carbon: 'CEBDT27Y',
      custom: 'CKYD62QM',
      placement: 'vuejsorg'
    },
    topBanner: true
  },
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer(timestamp) {
          const date = new Date(timestamp)

          const digits = [
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
          ].map(num => String(num).padStart(2, '0'))

          return '{0}-{1}-{2}, {3}:{4}:{5} UTC'.replace(
            /{(\d)}/g,
            (_, num) => digits[num]
          )
        }
      }
    ],
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          '/': {
            message: 'Novo conteúdo disponível.',
            buttonText: 'Atualizar'
          }
        }
      }
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'info',
        before: info =>
          `<div class="custom-block info"><p class="custom-block-title">${info}</p>`,
        after: '</div>'
      }
    ]
  ],
  markdown: {
    lineNumbers: true,
    /** @param {import('markdown-it')} md */
    extendMarkdown: md => {
      md.options.highlight = require('./markdown/highlight')(
        md.options.highlight
      )
    }
  }
}
