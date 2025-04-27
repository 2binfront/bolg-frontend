<script lang="ts" setup>
import type { ArticleInfo } from '~/interface';

const articleStore = useArticleStore();
const route = useRoute();
const userStore = useUserStore();
const curArticles = ref<ArticleInfo[]>([])

onMounted(async () => {
    if (!articleStore.allArticles.length) {
        await articleStore.getAllArticles()
    }
    curArticles.value = articleStore.allArticles
    if (route.query.tagId) {
        curArticles.value = curArticles.value.filter((v) => v.tags.includes(Number(route.query.tagId)));
    }
    if (route.query.categoryId) {
        curArticles.value = curArticles.value.filter((v) => v.category.id === Number(route.query.categoryId));
    }

});

watch(() => route.query, () => {
    curArticles.value = articleStore.allArticles
    if (route.query.tagId) {
        curArticles.value = curArticles.value.filter((v) => v.tags.includes(Number(route.query.tagId)));
    }
    if (route.query.categoryId) {
        curArticles.value = curArticles.value.filter((v) => v.category.id === Number(route.query.categoryId));
    }
});

const gotoPage = (id: string) => {
    navigateTo(`/article?id=${id}`);
};

const maskShow = ref(false)
const chooseArticle = ref<any>({})
const handleDelete = async (id: string) => {
    await articleStore.delArticle(id);
    maskShow.value = false;
    articleStore.getAllArticles();
}
</script>

<template>
    <div class="full ">
        <div v-for="(article, index) in curArticles" @click="gotoPage(article.id)" class="cp my article-brief">
            <div>
                <span class="time-string">{{ `Created on ${formatTime(article.create_date)}, Updated on
                    ${formatTime(article.write_date)}` }}</span>
            </div>
            <div class="flex items-end">
                <h2>{{ `${article.title}` }}</h2>
                <div ml>{{ `${articleStore.categories.find((v) => v.id === article.category.id)?.name} ` }}</div>
                <button v-if="userStore.canEdit && userStore.isLoginShow"
                    @click.stop="maskShow = true, chooseArticle = article">删除</button>
            </div>

        </div>
        <div v-if="maskShow" class="mask">
            <div>确认删除 <strong>{{ chooseArticle.title }} </strong>？</div>
            <div>
                <button @click="handleDelete(chooseArticle.id)">确认</button>
                <button @click="maskShow = false">取消</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;

    &>div:first-child {
        color: #fff;
        font-size: 20px;
        margin-bottom: 20px;
    }
}
</style>
