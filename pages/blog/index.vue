<script setup lang="ts">
useSeoMeta({
  title: 'joeymckenzie.tech',
  ogTitle: 'Blog | joeymckenzie.tech',
  description: 'A blog about code, software, and sometimes beer.',
  ogDescription: 'A blog about code, software, and sometimes beer.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
});

const content = await queryContent().where({});
// const posts = (await getCollection('blog'))
//   .filter((p) => p.data.published)
//   .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
console.log('content', content);
</script>
