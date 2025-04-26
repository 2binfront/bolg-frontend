<template>
    <div v-if="tocItems.length">
        <!-- 切换按钮 - 始终可见 -->
        <button class="toc-toggle-btn" :class="{ 'button-hidden': !isVisible }" @click="isVisible = !isVisible"
            :title="isVisible ? '隐藏目录' : '显示目录'">
            {{ isVisible ? '×' : '≡' }}
        </button>
        <div v-if="tocItems.length" class="toc-container toc-inner" :class="{ 'toc-hidden': !isVisible }">
            <div class=" toc-header">目录</div>
            <div class="toc-content">
                <ul class="toc-list">
                    <li v-for="(item, index) in tocItems" :key="index" :class="[
                        `toc-level-${item.level}`,
                        { 'toc-active': activeId === item.id }
                    ]" @click="scrollToTarget(item.id)">
                        <a href="javascript:void(0)">{{ item.text }}</a>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'TableOfContents',
    props: {
        // HTML内容字符串
        contentHtml: {
            type: String,
            required: true
        },
        // 容器选择器，用于确定内容区域
        contentSelector: {
            type: String,
            default: '.article-content'
        },
        // 目录固定时距离顶部的距离
        offsetTop: {
            type: Number,
            default: 80
        }
    },
    data() {
        return {
            tocItems: [],
            activeId: null,
            isFixed: false,
            observer: null,
            isVisible: true,
            headingElements: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.generateToc()
            this.setupScrollSpy()

            window.addEventListener('scroll', this.handleScroll)
        })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)

        if (this.observer) {
            this.observer.disconnect()
        }
    },
    watch: {
        contentHtml() {
            this.$nextTick(() => {
                this.generateToc()
                this.setupScrollSpy()
            })
        }
    },
    methods: {
        // 生成目录结构
        generateToc() {
            const parser = new DOMParser()
            const doc = parser.parseFromString(this.contentHtml, 'text/html')

            // 获取所有标题元素
            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

            this.tocItems = []

            // 为每个标题生成唯一ID
            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.substring(1))
                const text = heading.textContent
                const id = `heading-${index}`

                this.tocItems.push({
                    id,
                    level,
                    text
                })

                // 在实际DOM中查找对应的标题元素并添加ID
                const contentContainer = document.querySelector(this.contentSelector)
                if (contentContainer) {
                    const actualHeadings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6')
                    if (actualHeadings[index]) {
                        actualHeadings[index].id = id
                        this.headingElements.push(actualHeadings[index])
                    }
                }
            })
        },

        // 设置滚动监听，用于高亮当前标题
        setupScrollSpy() {
            if (this.observer) {
                this.observer.disconnect()
            }

            const options = {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.activeId = entry.target.id
                    }
                })
            }, options)

            // 监听所有标题元素
            this.headingElements.forEach(el => {
                this.observer.observe(el)
            })
        },

        // 滚动到目标位置
        scrollToTarget(id) {
            const element = document.getElementById(id)

            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
                // const yOffset = -this.offsetTop
                // const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

                // window.scrollTo({
                //     top: y,
                //     behavior: 'smooth'
                // })
            }
        },


    }
}
</script>

<style scoped>
.toc-container {
    width: 240px;
    max-height: 600px;
    overflow-y: auto;
    border: 2px solid #eaeaea;
    border-radius: 10px;
    padding: 10px 16px;
    margin-left: 20px;

    position: fixed;
    top: 80px;
    right: 20px;
    /* 距离顶部的距离 */
    max-height: calc(100vh - 300px);
    /* 确保容器不会超出视口 */
    overflow-y: auto;
    /* 内容过多时允许滚动 */
    align-self: flex-start;
    /* 在 flex 布局中确保正确定位 */
    z-index: 100;
    transition: all 0.3s ease;

    background-color: #fff;
}

.toc-toggle-btn {
    position: fixed;
    top: 80px;
    right: 300px;
    z-index: 100;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    outline: none;
    margin-left: 16px;
    transition: all 0.2s ease;
}

.button-hidden {
    right: 0;
}

.toc-toggle-btn:hover {
    background-color: #f5f5f5;
}

.toc-hidden {
    width: 0;
    margin-left: 60px;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    border: none !important;
}

.toc-inner {
    /* border-left: 2px solid #eaeaea; */
    /* padding: 0 16px; */
}

.toc-header {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
}

.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.toc-list li {
    padding: 4px 0;
    cursor: pointer;
    transition: all 0.2s ease;
}

.toc-list li a {
    color: #666;
    text-decoration: none;
    display: block;
    word-break: break-word;
}

.toc-list li:hover a {
    color: #3498db;
}

.toc-active a {
    color: #3498db !important;
    font-weight: 500;
}

/* 标题层级缩进 */
.toc-level-1 {
    margin-left: 0;
}

.toc-level-2 {
    margin-left: 12px;
    font-size: 0.95em;
}

.toc-level-3 {
    margin-left: 24px;
    font-size: 0.9em;
}

.toc-level-4 {
    margin-left: 36px;
    font-size: 0.85em;
}

.toc-level-5 {
    margin-left: 48px;
    font-size: 0.8em;
}

.toc-level-6 {
    margin-left: 60px;
    font-size: 0.75em;
}
</style>
