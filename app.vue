<script setup lang="ts">
const userStore = useUserStore();
const articleStore = useArticleStore();
onMounted(async () => {
    await userStore.checkAuth();
    await articleStore.getAllArticles();
});
</script>

<template>
    <Html lang="en">

    <Head>
        <Title>2binfront</Title>
        <Meta name="description" content="Good luck and have fun." />
    </Head>

    <Body>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </Body>

    </Html>
</template>
