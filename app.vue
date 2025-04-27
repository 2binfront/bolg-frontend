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
        <link rel="alternate" type="application/rss+xml" title="2binfront - RSS Feed" href="/api/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="2binfront - Atom Feed" href="/api/atom.xml" />
    </Head>

    <Body>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </Body>

    </Html>
</template>
