import { ref } from 'vue';

export type ViewCountMeta = {
  counts: ViewCount[];
};

export type ViewCount = {
  count: number;
  slug: string;
};

export const viewCount = ref(0);
export const viewCounts = ref<ViewCount[]>([]);

export async function loadViewCounts(apiBaseUrl: string) {
  const viewCountResponse = await fetch(`${apiBaseUrl}/views`);
  const viewCountMeta: ViewCountMeta = await viewCountResponse.json();
  viewCounts.value = viewCountMeta.counts;
}
