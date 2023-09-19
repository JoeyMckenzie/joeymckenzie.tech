import { computed, ref } from 'vue';

export type ViewCountMeta = {
  count: number;
  slug: string;
};

export type ViewCountMetadata = {
  counts: ViewCountMeta[];
};

export function useBlogCounts() {
  const viewCounts = ref<ViewCountMetadata | undefined>(undefined);

  const loadViewCounts = async (apiBaseUrl: string, includeTop = false) => {
    const url = includeTop ? `${apiBaseUrl}/views/top` : `${apiBaseUrl}/views`;
    const viewCountsResponse = await fetch(url);
    viewCounts.value = await viewCountsResponse.json();
  };

  const loadViewCount = async (apiBaseUrl: string, slug: string) => {
    const viewCountResponse = await fetch(`${apiBaseUrl}/views/${slug}`);
    viewCounts.value = await viewCountResponse.json();
  };

  const getViewCount = (slug: string) =>
    computed(
      () => viewCounts.value?.counts.find((vc) => vc.slug === slug)?.count ?? 0,
    );

  return {
    loadViewCounts,
    viewCounts,
    getViewCount,
  };
}
