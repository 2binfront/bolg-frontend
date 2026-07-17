<script lang="ts" setup>
const articleStore = useArticleStore();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const loadError = ref(false);
const pageSize = ref(10);
let resizeTimer: ReturnType<typeof setTimeout> | undefined;
let latestLoadRequest = 0;

const getResponsivePageSize = () => {
    if (!import.meta.client) return 10;

    const viewportWidth = Math.max(window.innerWidth, 320);
    const viewportHeight = Math.max(window.innerHeight, 480);

    // Estimate the list row height continuously: narrower screens wrap titles more often.
    const titleCharsPerLine = Math.max(14, viewportWidth / 18);
    const estimatedTitleLines = Math.min(3, Math.max(1, 32 / titleCharsPerLine));
    const estimatedItemHeight = 52 + estimatedTitleLines * 20;

    // Account for the header, footer, page padding and pagination controls.
    const reservedHeight = 175 + Math.max(0, (768 - viewportWidth) * 0.08);
    const visibleItems = Math.ceil((viewportHeight - reservedHeight) / estimatedItemHeight);

    return Math.max(5, Math.min(30, visibleItems));
};

const updatePageSize = () => {
    const nextPageSize = getResponsivePageSize();
    if (nextPageSize !== pageSize.value) {
        pageSize.value = nextPageSize;
    }
};

const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updatePageSize, 400);
};

const toPositiveInteger = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const currentPage = computed(() => toPositiveInteger(route.query.page, 1));
const visiblePages = computed(() => {
    const total = articleStore.pagination.totalPages;
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(currentPage.value - 2, total - 4));
    return Array.from({ length: 5 }, (_, index) => start + index);
});

const loadArticles = async () => {
    const requestId = ++latestLoadRequest;
    loading.value = true;
    loadError.value = false;
    try {
        await articleStore.getArticles({
            page: currentPage.value,
            pageSize: pageSize.value,
            categoryId: route.query.categoryId ? toPositiveInteger(route.query.categoryId, 0) || undefined : undefined,
            tagId: route.query.tagId ? toPositiveInteger(route.query.tagId, 0) || undefined : undefined,
        });

        // A newer route/page-size change has already started another request.
        // Do not let this response trigger a correction based on newer data.
        if (requestId !== latestLoadRequest) return;

        const lastPage = articleStore.pagination.totalPages;
        if (lastPage > 0 && currentPage.value > lastPage) {
            await changePage(lastPage);
        } else if (lastPage === 0 && currentPage.value !== 1) {
            await router.replace({
                query: {
                    ...route.query,
                    page: undefined,
                },
            });
        }
    } catch {
        if (requestId !== latestLoadRequest) return;
        loadError.value = true;
    } finally {
        if (requestId === latestLoadRequest) loading.value = false;
    }
};

const changePage = async (page: number) => {
    const nextPage = Math.trunc(Number(page));
    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > articleStore.pagination.totalPages || nextPage === currentPage.value) {
        return;
    }
    await router.push({
        query: {
            ...route.query,
            page: nextPage === 1 ? undefined : String(nextPage),
        },
    });
};

watch(
    () => [route.query.page, route.query.categoryId, route.query.tagId, pageSize.value],
    loadArticles,
    { immediate: true },
);

onMounted(() => {
    updatePageSize();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimer) clearTimeout(resizeTimer);
});

const gotoPage = (id: string) => {
    navigateTo(`/article?id=${id}`);
};

const maskShow = ref(false);
const chooseArticle = ref<any>({});
const handleDelete = async (id: string) => {
    await articleStore.delArticle(id);
    maskShow.value = false;

    if (articleStore.allArticles.length === 1 && currentPage.value > 1) {
        await changePage(currentPage.value - 1);
        return;
    }
    await loadArticles();
};
</script>

<template>
    <div class="full">
        <div v-if="loading" class="list-message">正在加载文章...</div>
        <div v-else-if="loadError" class="list-message">
            文章加载失败，<button type="button" @click="loadArticles">重试</button>
        </div>
        <div v-else-if="!articleStore.allArticles.length" class="list-message">暂无文章</div>

        <div v-for="article in articleStore.allArticles" :key="article.id" @click="gotoPage(article.id)"
            class="cp my article-brief">
            <div>
                <span class="time-string">{{ `Created on ${formatTime(article.create_date)}, Updated on
                    ${formatTime(article.write_date)}` }}</span>
            </div>
            <div class="flex items-end article-title">
                <h2>{{ article.title }}</h2>
                <div ml>{{ article.category?.name }}</div>
                <button v-if="userStore.canEdit && userStore.isLoginShow"
                    @click.stop="maskShow = true; chooseArticle = article">删除</button>
            </div>
        </div>

        <nav v-if="articleStore.pagination.totalPages > 1" class="pagination" aria-label="文章分页">
            <button type="button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
            <button v-for="page in visiblePages" :key="page" type="button" :class="{ active: page === currentPage }"
                :aria-current="page === currentPage ? 'page' : undefined" @click="changePage(page)">
                {{ page }}
            </button>
            <button type="button" :disabled="currentPage === articleStore.pagination.totalPages"
                @click="changePage(currentPage + 1)">下一页</button>
            <span>共 {{ articleStore.pagination.total }} 篇</span>
        </nav>

        <div v-if="maskShow" class="mask">
            <div>确认删除 <strong>{{ chooseArticle.title }}</strong>？</div>
            <div>
                <button @click="handleDelete(chooseArticle.id)">确认</button>
                <button @click="maskShow = false">取消</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.list-message {
    padding: 2rem 0;
    text-align: center;
}

.article-brief {
    font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
    transition: color 0.2s ease;
}

.article-brief .article-title:hover {
    color: #551a8b;
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.45);
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 2rem 0;

    button {
        min-width: 2rem;
        padding: 0.35rem 0.55rem;
        border: 0;
        border-radius: 999px;
        background: transparent;
        cursor: pointer;
        color: inherit;
        font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
        transition: color 0.2s ease;
    }

    button:not(:disabled):hover {
        // background: transparent;
        color: #551a8b;
        font-weight: bold;
    }

    button.active {
        color: #551a8b;
        // background: #222;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }
}

.mask {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // background-color: rgba(0, 0, 0, 0.5);

    &>div:first-child {
        color: #fff;
        font-size: 20px;
        margin-bottom: 20px;
    }
}
</style>
