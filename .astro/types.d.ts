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

  type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
  export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<
    AnyEntryMap[C]
  >;

  // This needs to be in sync with ImageMetadata
  export type ImageFunction = () => import('astro/zod').ZodObject<{
    src: import('astro/zod').ZodString;
    width: import('astro/zod').ZodNumber;
    height: import('astro/zod').ZodNumber;
    format: import('astro/zod').ZodUnion<
      [
        import('astro/zod').ZodLiteral<'png'>,
        import('astro/zod').ZodLiteral<'jpg'>,
        import('astro/zod').ZodLiteral<'jpeg'>,
        import('astro/zod').ZodLiteral<'tiff'>,
        import('astro/zod').ZodLiteral<'webp'>,
        import('astro/zod').ZodLiteral<'gif'>,
        import('astro/zod').ZodLiteral<'svg'>,
      ]
    >;
  }>;

  type BaseSchemaWithoutEffects =
    | import('astro/zod').AnyZodObject
    | import('astro/zod').ZodUnion<
        [BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]
      >
    | import('astro/zod').ZodDiscriminatedUnion<
        string,
        import('astro/zod').AnyZodObject[]
      >
    | import('astro/zod').ZodIntersection<
        BaseSchemaWithoutEffects,
        BaseSchemaWithoutEffects
      >;

  type BaseSchema =
    | BaseSchemaWithoutEffects
    | import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

  export type SchemaContext = { image: ImageFunction };

  type DataCollectionConfig<S extends BaseSchema> = {
    type: 'data';
    schema?: S | ((context: SchemaContext) => S);
  };

  type ContentCollectionConfig<S extends BaseSchema> = {
    type?: 'content';
    schema?: S | ((context: SchemaContext) => S);
  };

  type CollectionConfig<S> =
    | ContentCollectionConfig<S>
    | DataCollectionConfig<S>;

  export function defineCollection<S extends BaseSchema>(
    input: CollectionConfig<S>,
  ): CollectionConfig<S>;

  type AllValuesOf<T> = T extends any ? T[keyof T] : never;
  type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
    ContentEntryMap[C]
  >['slug'];

  export function getEntryBySlug<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(
    collection: C,
    // Note that this has to accept a regular string too, for SSR
    entrySlug: E,
  ): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;

  export function getDataEntryById<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C],
  >(collection: C, entryId: E): Promise<CollectionEntry<C>>;

  export function getCollection<
    C extends keyof AnyEntryMap,
    E extends CollectionEntry<C>,
  >(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => entry is E,
  ): Promise<E[]>;
  export function getCollection<C extends keyof AnyEntryMap>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown,
  ): Promise<CollectionEntry<C>[]>;

  export function getEntry<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(entry: {
    collection: C;
    slug: E;
  }): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C] | (string & {}),
  >(entry: {
    collection: C;
    id: E;
  }): E extends keyof DataEntryMap[C]
    ? Promise<DataEntryMap[C][E]>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(
    collection: C,
    slug: E,
  ): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C] | (string & {}),
  >(
    collection: C,
    id: E,
  ): E extends keyof DataEntryMap[C]
    ? Promise<DataEntryMap[C][E]>
    : Promise<CollectionEntry<C> | undefined>;

  /** Resolve an array of entry references from the same collection */
  export function getEntries<C extends keyof ContentEntryMap>(
    entries: {
      collection: C;
      slug: ValidContentEntrySlug<C>;
    }[],
  ): Promise<CollectionEntry<C>[]>;
  export function getEntries<C extends keyof DataEntryMap>(
    entries: {
      collection: C;
      id: keyof DataEntryMap[C];
    }[],
  ): Promise<CollectionEntry<C>[]>;

  export function reference<C extends keyof AnyEntryMap>(
    collection: C,
  ): import('astro/zod').ZodEffects<
    import('astro/zod').ZodString,
    C extends keyof ContentEntryMap
      ? {
          collection: C;
          slug: ValidContentEntrySlug<C>;
        }
      : {
          collection: C;
          id: keyof DataEntryMap[C];
        }
  >;
  // Allow generic `string` to avoid excessive type errors in the config
  // if `dev` is not running to update as you edit.
  // Invalid collection names will be caught at build time.
  export function reference<C extends string>(
    collection: C,
  ): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

  type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
  type InferEntrySchema<C extends keyof AnyEntryMap> =
    import('astro/zod').infer<
      ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
    >;

  type ContentEntryMap = {
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
      'going-serverless-with-dotnet-planetscale-and-fly.md': {
        id: 'going-serverless-with-dotnet-planetscale-and-fly.md';
        slug: 'going-serverless-with-dotnet-planetscale-and-fly';
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
      'serverless-databases-with-go-planetscale.md': {
        id: 'serverless-databases-with-go-planetscale.md';
        slug: 'serverless-databases-with-go-planetscale';
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
      'templates-with-rust-axum-htmx-askama.md': {
        id: 'templates-with-rust-axum-htmx-askama.md';
        slug: 'templates-with-rust-axum-htmx-askama';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
      'ziggin-around-with-linked-lists.md': {
        id: 'ziggin-around-with-linked-lists.md';
        slug: 'ziggin-around-with-linked-lists';
        body: string;
        collection: 'blog';
        data: InferEntrySchema<'blog'>;
      } & { render(): Render['.md'] };
    };
  };

  type DataEntryMap = {};

  type AnyEntryMap = ContentEntryMap & DataEntryMap;

  type ContentConfig = typeof import('../src/content/config');
}
