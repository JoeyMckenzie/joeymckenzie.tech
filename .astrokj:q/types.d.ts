declare module 'astro:content' {
  interface Render {
    '.mdx': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  export { z } from 'astro/zod';
  export type CollectionEntry<C extends keyof typeof entryMap> =
    (typeof entryMap)[C][keyof (typeof entryMap)[C]];

  export const image: () => import('astro/zod').ZodObject<{
    src: import('astro/zod').ZodString;
    width: import('astro/zod').ZodNumber;
    height: import('astro/zod').ZodNumber;
    format: import('astro/zod').ZodString;
  }>;

  type BaseSchemaWithoutEffects =
    | import('astro/zod').AnyZodObject
    | import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
    | import('astro/zod').ZodDiscriminatedUnion<
        string,
        import('astro/zod').AnyZodObject[]
      >
    | import('astro/zod').ZodIntersection<
        import('astro/zod').AnyZodObject,
        import('astro/zod').AnyZodObject
      >;

  type BaseSchema =
    | BaseSchemaWithoutEffects
    | import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

  type BaseCollectionConfig<S extends BaseSchema> = {
    schema?: S;
    slug?: (entry: {
      id: CollectionEntry<keyof typeof entryMap>['id'];
      defaultSlug: string;
      collection: string;
      body: string;
      data: import('astro/zod').infer<S>;
    }) => string | Promise<string>;
  };
  export function defineCollection<S extends BaseSchema>(
    input: BaseCollectionConfig<S>
  ): BaseCollectionConfig<S>;

  type EntryMapKeys = keyof typeof entryMap;
  type AllValuesOf<T> = T extends any ? T[keyof T] : never;
  type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<
    (typeof entryMap)[C]
  >['slug'];

  export function getEntryBySlug<
    C extends keyof typeof entryMap,
    E extends ValidEntrySlug<C> | (string & {})
  >(
    collection: C,
    // Note that this has to accept a regular string too, for SSR
    entrySlug: E
  ): E extends ValidEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getCollection<
    C extends keyof typeof entryMap,
    E extends CollectionEntry<C>
  >(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => entry is E
  ): Promise<E[]>;
  export function getCollection<C extends keyof typeof entryMap>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown
  ): Promise<CollectionEntry<C>[]>;

  type InferEntrySchema<C extends keyof typeof entryMap> =
    import('astro/zod').infer<
      Required<ContentConfig['collections'][C]>['schema']
    >;

  const entryMap: {
    blog: {
      'blazor-basics-calling-external-apis.md': {
        id: 'blazor-basics-calling-external-apis.md';
        slug: 'blazor-basics-calling-external-apis';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'build-a-tailwind-modal-with-angular-and-ngrx.md': {
        id: 'build-a-tailwind-modal-with-angular-and-ngrx.md';
        slug: 'build-a-tailwind-modal-with-angular-and-ngrx';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'constructing-objects-with-intent.md': {
        id: 'constructing-objects-with-intent.md';
        slug: 'constructing-objects-with-intent';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'csharp-8-nullable-reference-types.md': {
        id: 'csharp-8-nullable-reference-types.md';
        slug: 'csharp-8-nullable-reference-types';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'decoupling-controllers-with-api-endpoints.md': {
        id: 'decoupling-controllers-with-api-endpoints.md';
        slug: 'decoupling-controllers-with-api-endpoints';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'hitchhikers-guide-to-angular-nx-development.md': {
        id: 'hitchhikers-guide-to-angular-nx-development.md';
        slug: 'hitchhikers-guide-to-angular-nx-development';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'implementing-tailwind-dark-mode-in-angular.md': {
        id: 'implementing-tailwind-dark-mode-in-angular.md';
        slug: 'implementing-tailwind-dark-mode-in-angular';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'jamstack-angular-apps-with-scully-and-netlify.md': {
        id: 'jamstack-angular-apps-with-scully-and-netlify.md';
        slug: 'jamstack-angular-apps-with-scully-and-netlify';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'learning-to-fly-with-rust-postgres.md': {
        id: 'learning-to-fly-with-rust-postgres.md';
        slug: 'learning-to-fly-with-rust-postgres';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'migrating-to-astro.md': {
        id: 'migrating-to-astro.md';
        slug: 'migrating-to-astro';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'net-core-dapper-and-crud-buzzword-bingo-part-2.md': {
        id: 'net-core-dapper-and-crud-buzzword-bingo-part-2.md';
        slug: 'net-core-dapper-and-crud-buzzword-bingo-part-2';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'net-core-dapper-and-crud-buzzword-bingo-part-3.md': {
        id: 'net-core-dapper-and-crud-buzzword-bingo-part-3.md';
        slug: 'net-core-dapper-and-crud-buzzword-bingo-part-3';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'net-core-dapper-and-crud-buzzword-bingo-part-4.md': {
        id: 'net-core-dapper-and-crud-buzzword-bingo-part-4.md';
        slug: 'net-core-dapper-and-crud-buzzword-bingo-part-4';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'net-core-dapper-and-crud-buzzword-bingo.md': {
        id: 'net-core-dapper-and-crud-buzzword-bingo.md';
        slug: 'net-core-dapper-and-crud-buzzword-bingo';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'react-data-fetching-with-rxjs.md': {
        id: 'react-data-fetching-with-rxjs.md';
        slug: 'react-data-fetching-with-rxjs';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'rethinking-exceptions-in-dotnet.md': {
        id: 'rethinking-exceptions-in-dotnet.md';
        slug: 'rethinking-exceptions-in-dotnet';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'serverless-databases-with-rust-neon.md': {
        id: 'serverless-databases-with-rust-neon.md';
        slug: 'serverless-databases-with-rust-neon';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'serverless-rust-with-shuttle.md': {
        id: 'serverless-rust-with-shuttle.md';
        slug: 'serverless-rust-with-shuttle';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'service-lifetimes-in-plain-english.md': {
        id: 'service-lifetimes-in-plain-english.md';
        slug: 'service-lifetimes-in-plain-english';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'state-management-with-fluxor-blazor-part-1.md': {
        id: 'state-management-with-fluxor-blazor-part-1.md';
        slug: 'state-management-with-fluxor-blazor-part-1';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'state-management-with-fluxor-blazor-part-2.md': {
        id: 'state-management-with-fluxor-blazor-part-2.md';
        slug: 'state-management-with-fluxor-blazor-part-2';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
    };
  };

  type ContentConfig = typeof import('../src/content/config');
}
