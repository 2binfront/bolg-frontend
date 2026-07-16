<script lang="ts" setup>
const articleStore = useArticleStore();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const loadError = ref(false);

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
    loading.value = true;
    loadError.value = false;
    try {
        await articleStore.getArticles({
            page: currentPage.value,
            pageSize: 10,
            categoryId: route.query.categoryId ? toPositiveInteger(route.query.categoryId, 0) || undefined : undefined,
            tagId: route.query.tagId ? toPositiveInteger(route.query.tagId, 0) || undefined : undefined,
        });

        if (articleStore.pagination.totalPages > 0 && currentPage.value > articleStore.pagination.totalPages) {
            await changePage(articleStore.pagination.totalPages);
        }
    } catch {
        loadError.value = true;
    } finally {
        loading.value = false;
    }
};

const changePage = async (page: number) => {
    if (page < 1 || page > articleStore.pagination.totalPages || page === currentPage.value) {
        return;
    }
    await router.push({
        query: {
            ...route.query,
            page: page === 1 ? undefined : String(page),
        },
    });
};

watch(
    () => [route.query.page, route.query.categoryId, route.query.tagId],
    loadArticles,
    { immediate: true },
);

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
            <div class="flex items-end">
                <h2>{{ article.title }}</h2>
                <div ml>{{ article.category?.name }}</div>
                <button v-if="userStore.canEdit && userStore.isLoginShow"
                    @click.stop="maskShow = true; chooseArticle = article">删除</button>
            </div>
        </div>

        <nav v-if="articleStore.pagination.totalPages > 1" class="pagination" aria-label="文章分页">
            <button type="button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">上一页</button>
            <button v-for="page in visiblePages" :key="page" type="button"
                :class="{ active: page === currentPage }" :aria-current="page === currentPage ? 'page' : undefined"
                @click="changePage(page)">
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

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 2rem 0;

    button {
        min-width: 2.25rem;
        padding: 0.35rem 0.65rem;
        border: 1px solid #aaa;
        border-radius: 4px;
        background: transparent;
        cursor: pointer;
    }

    button.active {
        color: #fff;
        background: #222;
        border-color: #222;
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
    background-color: rgba(0, 0, 0, 0.5);

    &>div:first-child {
        color: #fff;
        font-size: 20px;
        margin-bottom: 20px;
    }
}
</style>
