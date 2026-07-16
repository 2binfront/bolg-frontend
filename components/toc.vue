<template>
    <div v-if="tocItems.length">
        <!-- 切换按钮 - 始终可见 -->
        <button class="toc-toggle-btn" :class="{ 'button-hidden': !isVisible }" @click="isVisible = !isVisible"
            :title="isVisible ? '隐藏目录' : '显示目录'">
            {{ isVisible ? '×' : '≡' }}
        </button>
        <div v-if="tocItems.length" class="toc-container toc-inner" :class="{ 'toc-hidden': !isVisible }">
            <div class=" toc-header">目录</div>
            <div class="toc-header-row">
                <!-- <button v-if="previousScrollY !== null" type="button" class="toc-back-btn"
                    @click.stop="restorePreviousPosition">返回上次位置</button> -->
            </div>
            <div class="toc-content">
                <ul class="toc-list">
                    <li v-for="item in tocItems" :key="item.id" :class="[
                        `toc-level-${item.level}`,
                        { 'toc-active': activeId === item.id }
                    ]" :aria-level="item.depth" @click="scrollToTarget(item.id)">
                        <a href="#" @click.prevent="scrollToTarget(item.id)">{{ item.text }}</a>
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
        },
        // 是否为移动端
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tocItems: [],
            activeId: null,
            isFixed: false,
            observer: null,
            isVisible: true,
            headingElements: [],
            // previousScrollY: null,
            scrollRaf: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.generateToc()
            this.setupScrollSpy()

            window.addEventListener('scroll', this.handleScroll)

        })
        setTimeout(() => {
            if (this.isMobile === true) {
                this.isVisible = false
            }
        }, 1000);

    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll)
        if (this.scrollRaf) window.cancelAnimationFrame(this.scrollRaf)

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
            this.headingElements = []

            // 为每个标题生成唯一ID
            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.substring(1))
                const text = (heading.textContent || '').trim()
                const id = `heading-${index}`

                const parent = [...this.tocItems].reverse().find(item => item.level < level)

                this.tocItems.push({
                    id,
                    level,
                    text: text || `章节 ${index + 1}`,
                    depth: Math.max(1, level - (this.tocItems[0]?.level || level) + 1),
                    parentId: parent?.id || null
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

            this.observer = null
            this.updateActiveHeading()

            // 监听所有标题元素
            this.headingElements.forEach(el => {
                this.observer?.observe(el)
            })
        },

        // 滚动到目标位置
        updateActiveHeading() {
            if (!this.headingElements.length) return
            const anchor = this.offsetTop + 24
            let active = this.headingElements[0]
            this.headingElements.forEach((heading) => {
                if (heading.getBoundingClientRect().top <= anchor) active = heading
            })
            this.activeId = active.id
        },

        handleScroll() {
            if (this.scrollRaf) return
            this.scrollRaf = window.requestAnimationFrame(() => {
                this.scrollRaf = null
                this.updateActiveHeading()
            })
        },

        scrollToTarget(id) {
            const element = document.getElementById(id)

            if (element) {
                // this.previousScrollY = window.scrollY
                const top = element.getBoundingClientRect().top + window.scrollY - this.offsetTop - 12


                window.scrollTo({
                    top: Math.max(0, top),
                    behavior: 'auto'
                })
                this.activeId = id

                // const yOffset = -this.offsetTop
                // const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

                // window.scrollTo({
                //     top: y,
                //     behavior: 'smooth'
                // })
            }
        },

        // restorePreviousPosition() {
        //     if (this.previousScrollY === null) return
        //     const target = this.previousScrollY
        //     this.previousScrollY = null
        //     window.scrollTo({ top: target, behavior: 'smooth' })
        // },


    }
}
</script>

<style scoped>
.toc-container {
    width: 240px;
    max-height: 600px;
    overflow-y: auto;
    border: 0;
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

    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
    font-family: Georgia, "Times New Roman", "Noto Serif SC", serif;
}

.toc-container::-webkit-scrollbar {
    width: 4px;
}

.toc-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 999px;
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
    border: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    outline: none;
    margin-left: 16px;
    transition: all 0.1s ease;
}

.button-hidden {
    right: 0;
}

.toc-toggle-btn:hover {
    color: #222;
}

.toc-hidden {
    /*  width: 0;*/
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
    padding: 0 8px 8px;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #222;
}

.toc-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.toc-back-btn {
    border: 0;
    padding: 2px 0;
    background: transparent;
    color: #777;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.toc-back-btn:hover {
    color: #222;
}

.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.toc-list li {
    padding: 0;
    margin: 2px 0;
    border-radius: 7px;
    cursor: pointer;
    transition: color 0.2s ease;
}

.toc-list li a {
    padding: 6px 8px;
    color: #666;
    text-decoration: none;
    display: block;
    word-break: break-word;
}



.toc-list li:hover a {
    /* color: #551a8b; */
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.45);
}

.toc-active {
    color: #000 !important;
    font-weight: 800;
}


/* .toc-active a,
.toc-active:hover a {
    color: #000 !important;
    font-weight: 600;
} */

/* 标题层级缩进 */
.toc-level-1 {
    a {
        padding-left: 0;
    }

    font-size: 1.1em;
}

.toc-level-2 {
    a {
        padding-left: 12px;
    }

    font-size: 1em;
}

.toc-level-3 {
    a {
        padding-left: 24px;
    }

    font-size: 0.9em;
}

.toc-level-4 {
    a {
        padding-left: 36px;
    }

    font-size: 0.8em;
}

.toc-level-5 {
    a {
        padding-left: 48px;
    }

    font-size: 0.7em;
}

.toc-level-6 {
    a {
        padding-left: 60px;
    }

    font-size: 0.65em;
}
</style>
