<script setup lang="ts">
const { data } = await useAsyncData('content', () => queryContent().findOne());

watchEffect(() => {
  // eslint-disable-next-line no-console
  console.log({ data: data.value });
});
</script>
