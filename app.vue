<script setup lang="ts">
const userStore = useUserStore();
const articleStore = useArticleStore();
onMounted(async () => {
    await userStore.checkAuth();
    await articleStore.getAllArticles();
});
</script>

<template>

    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>

</template>
