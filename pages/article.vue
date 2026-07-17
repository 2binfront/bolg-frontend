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
    content_en: '',
    category: '',
    tags: [],
});
const editing = ref(false);
const saving = ref(false);
const saveError = ref('');
const imageUploading = ref(false);
const editorRefZh = ref<any>(null);
const editorRefEn = ref<any>(null);
const previewImage = ref('');
const displayLanguage = ref<'zh' | 'en'>('zh');
const hasEnglishContent = computed(() => Boolean(article.value.content_en?.trim()));
const handleContentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLImageElement && target.src) {
        previewImage.value = target.src;
    }
};
const closeImagePreview = () => {
    previewImage.value = '';
};
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
    if (saving.value) {
        return;
    }

    const categoryId = Number(
        typeof article.value.category === 'object'
            ? article.value.category.id
            : article.value.category,
    );
    const tagIds = article.value.tags.map((tag) => Number(typeof tag === 'object' ? tag.id : tag));

    if (!article.value.title.trim() || !article.value.content.trim() || !Number.isInteger(categoryId)) {
        saveError.value = '请填写标题、正文并选择分类。';
        return;
    }

    saving.value = true;
    saveError.value = '';
    try {
        const route = useRoute();
        const body = {
            title: article.value.title.trim(),
            content: article.value.content,
            content_en: article.value.content_en?.trim() || null,
            category_id: categoryId,
            tag_ids: tagIds,
        };

        const articleId = Number(route.query.id);
        if (Number.isInteger(articleId) && articleId > 0) {
            await $fetch(`/api/blog/article/${articleId}`, {
                method: 'patch',
                headers: {
                    Authorization: `Bearer ${userStore.access_token}`,
                },
                body,
            });
        } else {
            await $fetch(`/api/blog/article`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${userStore.access_token}`,
                },
                body,
            });
        }
        editing.value = false;
        await navigateTo(`/`);
    } catch (error) {
        console.error(error);
        const responseMessage = (error as any)?.data?.message;
        if (typeof responseMessage === 'string') saveError.value = responseMessage;
        saveError.value = '保存失败，请检查登录状态和文章内容后重试。';
    } finally {
        saving.value = false;
    }
};
const handleEditorImageAdd = async (position: number, file: File, language: 'zh' | 'en') => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 10 * 1024 * 1024) {
        saveError.value = '仅支持 JPG、PNG、WebP、GIF，且图片不能超过 10 MB。';
        return;
    }
    imageUploading.value = true;
    saveError.value = '';
    try {
        const formData = new FormData();
        formData.append('file', file, file.name);
        const result = await $fetch<{ publicUrl: string }>('/api/blog/article/upload', {
            method: 'post',
            headers: { Authorization: `Bearer ${userStore.access_token}` },
            body: formData,
        });
        (language === 'zh' ? editorRefZh : editorRefEn).value?.$img2Url(position, result.publicUrl);
    } catch (error) {
        console.error(error);
        saveError.value = '图片上传失败，请稍后重试。';
    } finally {
        imageUploading.value = false;
    }
};
const html = ref('');
const renderMarkdown = async (content: string) => {
    const renderedHtml = await marked.parse(content || '');
    return renderedHtml.replace(/<img\b([^>]*)>/gi, (_match, attributes) => {
        const existing = String(attributes);
        const normalized = existing.replace(/(\bsrc=["'])(?!https?:\/\/|data:|\/)/i, '$1https://');
        const loading = /\bloading\s*=/.test(normalized) ? '' : ' loading="lazy"';
        const decoding = /\bdecoding\s*=/.test(normalized) ? '' : ' decoding="async"';
        const priority = /\bfetchpriority\s*=/.test(normalized) ? '' : ' fetchpriority="low"';
        return `<span class="article-image-frame"><span class="article-image-loading">Loading...</span><img${loading}${decoding}${priority}${normalized}></span>`;
    });
};
const renderDisplayedContent = async () => {
    const content = displayLanguage.value === 'en' && hasEnglishContent.value
        ? article.value.content_en!
        : article.value.content;
    html.value = await renderMarkdown(content);
};
const loading = ref(false);
const catologTree = ref<any>();
const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}



onMounted(async () => {
    const route = useRoute();
    if (route.query.edit) {
        editing.value = true;
        return;
    }
    const response = await $fetch<ArticleInfo>(`/api/blog/article/${route.query.id}`);
    article.value = {
        ...response,
        category: typeof response.category === 'object' ? response.category.id : response.category,
        tags: response.tags.map((tag) => typeof tag === 'object' ? tag.id : tag),
    };
    article.value.content_en = response.content_en || '';
    const renderedHtml = await marked.parse(article.value.content);
    html.value = renderedHtml.replace(/<img\b([^>]*)>/gi, (_match, attributes) => {
        const existing = String(attributes);
        const normalized = existing.replace(/(\bsrc=["'])(?!https?:\/\/|data:|\/)/i, '$1https://');
        const loading = /\bloading\s*=/.test(normalized) ? '' : ' loading="lazy"';
        const decoding = /\bdecoding\s*=/.test(normalized) ? '' : ' decoding="async"';
        const priority = /\bfetchpriority\s*=/.test(normalized) ? '' : ' fetchpriority="low"';
        return `<span class="article-image-frame"><span class="article-image-loading">加载中...</span><img${loading}${decoding}${priority}${normalized}></span>`;
    });
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // catologTree.value = getContentDirTree(html.value);
});

watch(displayLanguage, renderDisplayedContent);

const handleContentImageLoad = (event: Event) => {
    const image = event.target;
    if (image instanceof HTMLImageElement) {
        image.closest('.article-image-frame')?.classList.add('is-loaded');
    }
};
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
                            <div class="language-switcher ml-4" role="group" aria-label="Content language">
                                <button type="button" :class="{ active: displayLanguage === 'zh' }"
                                    @click="displayLanguage = 'zh'">中文</button>
                                <button type="button" :disabled="!hasEnglishContent"
                                    :class="{ active: displayLanguage === 'en' }"
                                    @click="displayLanguage = 'en'">English</button>
                            </div>
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
                <button v-if="editing" class="mr" :disabled="saving" @click="handleSave">
                    {{ saving ? 'Saving...' : 'Save' }}
                </button>
            </div>
            <div v-if="saveError" class="save-error">{{ saveError }}</div>
            <div class="mt-2 flex-1  article-content  w-full">
                <div v-if="!editing" relative w-full>
                    <Toc :content-html="html" :offsetTop="0" :isMobile="isMobile" />
                    <div v-html="html" ref="mdDom" @click="handleContentClick" @load.capture="handleContentImageLoad"
                        :class="[
                            'text-justify flex-1',
                            'lg:max-w-62vw',
                        ]"></div>
                </div>
                <div v-else="editing" class="mr flex-1">
                    <ClientOnly>
                        <div v-if="imageUploading" class="image-upload-status">正在上传图片...</div>
                        <div class="bilingual-editors">
                            <div class="editor-pane">
                                <div class="editor-label">中文正文</div>
                                <mavon-editor ref="editorRefZh" class="h-80vh" v-model="article.content"
                                    @imgAdd="(position: number, file: File) => handleEditorImageAdd(position, file, 'zh')" />
                            </div>
                            <div class="editor-pane">
                                <div class="editor-label">English Content</div>
                                <mavon-editor ref="editorRefEn" class="h-80vh" v-model="article.content_en"
                                    @imgAdd="(position: number, file: File) => handleEditorImageAdd(position, file, 'en')" />
                            </div>
                        </div>
                    </ClientOnly>
                </div>
            </div>
        </div>
        <div v-if="previewImage" class="image-preview" role="dialog" aria-modal="true" @click.self="closeImagePreview">
            <button type="button" class="image-preview-close" aria-label="关闭图片预览" @click="closeImagePreview">×</button>
            <img :src="previewImage" alt="图片预览" @click.stop />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.article-content {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
    font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
}

.language-switcher {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: underline;

    button {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--muted-color);
        font: inherit;
        font-size: 0.95rem;
        cursor: pointer;
    }

    button.active {
        color: var(--text-color);
        font-weight: 700;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }

    button:not(:disabled):hover {
        color: var(--link-color);
    }
}

.bilingual-editors {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
}

.editor-label {
    margin-bottom: 0.5rem;
    color: var(--muted-color);
    font-weight: 700;
}

@media (max-width: 900px) {
    .bilingual-editors {
        grid-template-columns: 1fr;
    }
}

h1 {
    font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
}

.save-error {
    margin-top: 0.5rem;
    color: var(--error-color, #c23a3a);
}

.image-upload-status {
    margin-bottom: 0.5rem;
}

.article-content :deep(.article-image-frame) {
    display: block;
    position: relative;
    width: fit-content;
    max-width: min(100%, 760px);
    max-height: 440px;
    margin: 1.25rem auto;
    overflow: hidden;
    // border-radius: 8px;
    background: var(--code-bg-color);
}

.article-content :deep(img) {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: 440px;
    object-fit: contain;
    cursor: zoom-in;
    // opacity: 0;
    transition: opacity 0.2s ease;
}

.article-content :deep(.article-image-frame.is-loaded img) {
    opacity: 1;
}

.article-content :deep(.article-image-loading) {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-color);
    font-size: 0.9rem;
    pointer-events: none;
}

.article-content :deep(.article-image-frame.is-loaded .article-image-loading) {
    display: none;
}

.image-preview {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.82);
    cursor: zoom-out;
}

.image-preview img {
    max-width: 92vw;
    max-height: 88vh;
    object-fit: contain;
    // border-radius: 6px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    cursor: default;
}

.image-preview-close {
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    color: #fff;
    font-size: 2rem;
    line-height: 1;
    background: transparent;
    border: 0;
    cursor: pointer;
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
