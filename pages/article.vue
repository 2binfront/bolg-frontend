<script lang="ts" setup>
import { marked } from 'marked';
import type { ArticleInfo } from '~/interface';
const userStore = useUserStore();
const articleStore = useArticleStore();
const article = ref<ArticleInfo>({
    id: '',
    articleId: '',
    title: '',
    create_date: '2023-07-21T15:32:35.000Z',
    write_date: '2023-07-21T15:32:35.000Z',
    content: '',
    category: '',
    tags: [],
});
const editing = ref(false);
const handleEdit = () => {
    if (userStore.canEdit) {
        editing.value = !editing.value;
        // if (toolbars.value['bold']) {
        //   subfield.value = false;
        //   for (const item of Object.keys(toolbars.value)) {
        //     toolbars.value[item] = false;
        //     toolbars.value.navigation = true;
        //     toolbars.value.fullscreen = true;
        //   }
        // } else {
        //   subfield.value = true;
        //   for (const item of Object.keys(toolbars.value)) {
        //     toolbars.value[item] = true;
        //   }
        //   toolbars.value['html'] = false;
        // }
    }
};
// 编辑保存
const handleSave = async () => {
    try {
        const route = useRoute();

        if (route.query.edit) {
            await $fetch(`/api/blog/article`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${userStore.access_token}`,
                },
                body: {
                    title: article.value.title,
                    content: article.value.content,
                    category_id: article.value.category,
                    tag_ids: article.value.tags,
                },
            });
        } else {
            await $fetch(`/api/blog/article/${route.query.id}`, {
                method: 'patch',
                headers: {
                    Authorization: `Bearer ${userStore.access_token}`,
                },
                body: {
                    title: article.value.title,
                    content: article.value.content,
                    category_id: article.value.category,
                    tag_ids: article.value.tags,
                },
            });
        }
        editing.value = false;
        navigateTo(`/`);
    } catch (error) {
        console.log(error);
    }
};
const html = ref('');
const loading = ref(false);
const catologTree = ref<any>();
onMounted(async () => {
    const route = useRoute();
    if (route.query.edit) {
        editing.value = true;
        return;
    }
    article.value = await $fetch(`/api/blog/article/${route.query.id}`);
    html.value = await marked.parse(article.value.content);
    // catologTree.value = getContentDirTree(html.value);
});
// const subfield = ref(false);
// const toolbars = ref<Record<string, boolean>>({
//   bold: false, // 粗体
//   italic: false, // 斜体
//   header: false, // 标题
//   underline: false, // 下划线
//   strikethrough: false, // 中划线
//   mark: false, // 标记
//   superscript: false, // 上角标
//   subscript: false, // 下角标
//   quote: false, // 引用
//   ol: false, // 有序列表
//   ul: false, // 无序列表
//   link: false, // 链接
//   imagelink: false, // 图片链接
//   code: false, // code
//   table: false, // 表格
//   fullscreen: false, // 全屏编辑
//   readmodel: true, // 沉浸式阅读
//   htmlcode: false, // 展示html源码
//   help: false, // 帮助
//   /* 1.3.5 */
//   undo: false, // 上一步
//   redo: false, // 下一步
//   trash: false, // 清空
//   save: false, // 保存（触发events中的save事件）
//   /* 1.4.2 */
//   navigation: true, // 导航目录
//   /* 2.1.8 */
//   alignleft: false, // 左对齐
//   aligncenter: false, // 居中
//   alignright: false, // 右对齐
//   /* 2.2.1 */
//   subfield: false, // 单双栏模式
//   preview: false, // 预览
// });
</script>

<template>
    <div class="box-border flex flex-col full">
        <div class="mt flex flex-col">
            <div class="frb">
                <div class="flex items-end">
                    <div @dblclick="handleEdit">
                        <div v-if="!editing" class="flex items-end">
                            <h1>{{ article.title }} </h1>
                            <span class="ml-2 time-string">{{
                                `Created at ${formatTime(article.create_date, 's')}, Updated at
                                ${formatTime(article.write_date, 's')}`
                            }}</span>
                        </div>
                        <div v-else>
                            <input v-model="article.title" class="w-400px text-24px fw700" />
                            <select v-model="article.category" class="w-100px text-18px fw700 ml">
                                <option v-for="item in articleStore.categories" :key="item.id" :value="item.id">{{
                                    item.name }}</option>
                            </select>
                            <select v-model="article.tags" class="w-400px text-16px fw700 ml" multiple>
                                <option v-for="item in articleStore.tags" :key="item.id" :value="item.id">{{ item.name
                                    }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button v-if="editing" class="mr" @click="handleSave">Save</button>
            </div>
            <div class="mt-2 flex-1  article-content  w-full">
                <div v-if="!editing" relative w-full>
                    <Toc :content-html="html" :offsetTop="0" />
                    <div v-html="html" ref="mdDom" class="max-w-50vw text-justify flex-1"></div>
                </div>
                <div v-else="editing" class="mr flex-1">
                    <ClientOnly>
                        <mavon-editor class="h-80vh" v-model="article.content" />
                    </ClientOnly>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.article-content {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
}



.line {
    display: block;
    padding: 0 1rem;
}

.line.highlight {
    width: 100%;
    background-color: #8881 !important;
}

.line.diff.remove {
    background-color: rgba(194, 58, 58, 0.3) !important;
}

.line.diff.add {
    background-color: rgba(46, 141, 46, 0.3) !important;
}

.line.diff.remove::before {
    content: '-';
    color: #c23a3a;
    position: absolute;
}

.line.diff.add::before {
    content: '+';
    color: #23b73c;
    position: absolute;
}
</style>
