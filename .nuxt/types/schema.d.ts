import { NuxtModule, RuntimeConfig } from 'nuxt/schema';
declare module 'nuxt/schema' {
  interface NuxtConfig {
    ['mdc']?: typeof import('@nuxtjs/mdc').default extends NuxtModule<infer O>
      ? Partial<O>
      : Record<string, any>;
    ['content']?: typeof import('@nuxt/content').default extends NuxtModule<
      infer O
    >
      ? Partial<O>
      : Record<string, any>;
    ['robots']?: typeof import('@nuxtjs/robots').default extends NuxtModule<
      infer O
    >
      ? Partial<O>
      : Record<string, any>;
    ['icon']?: typeof import('nuxt-icon').default extends NuxtModule<infer O>
      ? Partial<O>
      : Record<string, any>;
    ['feedme']?: typeof import('nuxt-feedme').default extends NuxtModule<
      infer O
    >
      ? Partial<O>
      : Record<string, any>;
    ['pinia']?: typeof import('@pinia/nuxt').default extends NuxtModule<infer O>
      ? Partial<O>
      : Record<string, any>;
    ['image']?: typeof import('@nuxt/image').default extends NuxtModule<infer O>
      ? Partial<O>
      : Record<string, any>;
    ['devtools']?: typeof import('@nuxt/devtools').default extends NuxtModule<
      infer O
    >
      ? Partial<O>
      : Record<string, any>;
    ['telemetry']?: typeof import('@nuxt/telemetry').default extends NuxtModule<
      infer O
    >
      ? Partial<O>
      : Record<string, any>;
    modules?: (
      | undefined
      | null
      | false
      | NuxtModule
      | string
      | [NuxtModule | string, Record<string, any>]
      | ['@nuxtjs/mdc', Exclude<NuxtConfig['mdc'], boolean>]
      | ['@nuxt/content', Exclude<NuxtConfig['content'], boolean>]
      | ['@nuxtjs/robots', Exclude<NuxtConfig['robots'], boolean>]
      | ['nuxt-icon', Exclude<NuxtConfig['icon'], boolean>]
      | ['nuxt-feedme', Exclude<NuxtConfig['feedme'], boolean>]
      | ['@pinia/nuxt', Exclude<NuxtConfig['pinia'], boolean>]
      | ['@nuxt/image', Exclude<NuxtConfig['image'], boolean>]
      | ['@nuxt/devtools', Exclude<NuxtConfig['devtools'], boolean>]
      | ['@nuxt/telemetry', Exclude<NuxtConfig['telemetry'], boolean>]
    )[];
  }
  interface RuntimeConfig {
    app: {
      baseURL: string;

      buildAssetsDir: string;

      cdnURL: string;

      spotifyClientId: string;

      spotifyClientSecret: string;

      spotifyRefreshToken: string;

      spotifyTokenEndpoint: string;

      spotifyNowPlayingEndpoint: string;

      databaseUrl: string;
    };

    mdc: {
      highlight: {
        theme: string;

        preload: Array<string>;

        wrapperStyle: any;
      };
    };

    content: {
      cacheVersion: number;

      cacheIntegrity: string;

      transformers: Array<any>;

      base: string;

      api: {
        baseURL: string;
      };

      watch: {
        ws: {
          port: {
            port: number;

            portRange: Array<number>;
          };

          hostname: string;

          showURL: boolean;
        };
      };

      sources: any;

      ignores: Array<any>;

      locales: Array<any>;

      defaultLocale: any;

      highlight: {
        theme: string;

        preload: Array<string>;
      };

      markdown: {
        tags: {
          p: string;

          a: string;

          blockquote: string;

          'code-inline': string;

          code: string;

          em: string;

          h1: string;

          h2: string;

          h3: string;

          h4: string;

          h5: string;

          h6: string;

          hr: string;

          img: string;

          ul: string;

          ol: string;

          li: string;

          strong: string;

          table: string;

          thead: string;

          tbody: string;

          td: string;

          th: string;

          tr: string;
        };

        anchorLinks: {
          depth: number;

          exclude: Array<number>;
        };

        remarkPlugins: any;

        rehypePlugins: any;
      };

      yaml: any;

      csv: {
        delimeter: string;

        json: boolean;
      };

      navigation: {
        fields: Array<any>;
      };

      contentHead: boolean;

      documentDriven: boolean;

      respectPathCase: boolean;

      experimental: {
        clientDB: boolean;

        stripQueryParameters: boolean;

        advanceQuery: boolean;

        search: any;
      };
    };

    feedme: string;
  }
  interface PublicRuntimeConfig {
    commitSha: string;

    mdc: {
      components: {
        prose: boolean;

        map: {
          p: string;

          a: string;

          blockquote: string;

          'code-inline': string;

          code: string;

          em: string;

          h1: string;

          h2: string;

          h3: string;

          h4: string;

          h5: string;

          h6: string;

          hr: string;

          img: string;

          ul: string;

          ol: string;

          li: string;

          strong: string;

          table: string;

          thead: string;

          tbody: string;

          td: string;

          th: string;

          tr: string;
        };
      };

      headings: {
        anchorLinks: {
          h1: boolean;

          h2: boolean;

          h3: boolean;

          h4: boolean;

          h5: boolean;

          h6: boolean;
        };
      };
    };

    content: {
      locales: Array<any>;

      defaultLocale: any;

      integrity: number;

      experimental: {
        stripQueryParameters: boolean;

        advanceQuery: boolean;

        clientDB: boolean;
      };

      respectPathCase: boolean;

      api: {
        baseURL: string;
      };

      navigation: {
        fields: Array<any>;
      };

      tags: {
        p: string;

        a: string;

        blockquote: string;

        'code-inline': string;

        code: string;

        em: string;

        h1: string;

        h2: string;

        h3: string;

        h4: string;

        h5: string;

        h6: string;

        hr: string;

        img: string;

        ul: string;

        ol: string;

        li: string;

        strong: string;

        table: string;

        thead: string;

        tbody: string;

        td: string;

        th: string;

        tr: string;
      };

      highlight: {
        theme: string;

        preload: Array<string>;
      };

      wsUrl: string;

      documentDriven: boolean;

      host: string;

      trailingSlash: boolean;

      search: any;

      contentHead: boolean;

      anchorLinks: {
        depth: number;

        exclude: Array<number>;
      };
    };
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $config: RuntimeConfig;
  }
}
