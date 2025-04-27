<script lang="ts" setup>
const userStore = useUserStore();
let timer: any = null;
let waitTime = 200; // 该时间间隔内点击才算连续点击（单位：ms）
let lastTime = new Date().getTime(); // 上次点击时间
let count = 0; // 连续点击次数
const { isLoginShow } = storeToRefs(userStore);

const checkUser = () => {
    let currentTime = new Date().getTime();
    // 计算两次相连的点击时间间隔
    count = currentTime - lastTime < waitTime ? count + 1 : 1;
    lastTime = new Date().getTime();
    clearTimeout(timer);
    timer = setTimeout(() => {
        clearTimeout(timer);
        // 处理点击事件
        if (count > 3) {
            // 连续点击五次或者五次以上的点击事件
            //   console.log('点击超过4次了');
            isLoginShow.value = !isLoginShow.value;
        }
    }, waitTime + 10);
};

const pwd = ref('');
const handleLogin = async () => {
    try {
        const res: any = await $fetch(`/api/blog/auth/login`, {
            method: 'post',
            body: {
                username: userStore.username,
                password: pwd.value,
            },
        });
        userStore.access_token = res.access_token;
        await userStore.checkAuth();
    } catch (error) { }
};

const gotoEdit = (key: string) => {
    switch (key) {
        case 'addArticle':
            navigateTo(`/article?edit=1`);
            break;
        case 'editC':
            navigateTo(`/category?edit=1`);
            break;
        case 'editT':
            navigateTo(`/tag?edit=1`);
            break;
        default:
            break;
    }
};
</script>

<template>
    <div class="f-col h-100vh relative">
        <header class="blog-header px pt-4 pb-2 frb" @click="checkUser">
            <div class="flex">
                <NuxtLink to="/" class="text-26px mr my-2">2binfront's blog</NuxtLink>
                <div class="home-links">
                    <NuxtLink to="/category">Category</NuxtLink>
                    <NuxtLink to="/tag" ml>Tag</NuxtLink>
                    <NuxtLink to="/about" ml>About</NuxtLink>
                </div>
            </div>
            <div v-if="isLoginShow && !userStore.canEdit" class="flex-1 flex items-center">
                <input class="ml" type="password" show-password v-model="pwd" @keyup.enter="handleLogin" />
            </div>
            <div v-else-if="isLoginShow && userStore.canEdit" class="flex items-center">
                <button @click="gotoEdit('addArticle')">Add Article</button>
                <button @click="gotoEdit('editC')">Edit Categories</button>
                <button @click="gotoEdit('editT')">Edit Tags</button>
            </div>
        </header>
        <main class="px flex-1 box-border">
            <slot />
        </main>
        <footer class="blog-footer frc">
            <div>2binfront@2024</div>
            <Rss />
        </footer>
    </div>
</template>

<style lang="scss">
.blog-header {
    //   background-color: #f3f3f3;
    //   height: 5vh;
    max-height: 200px;

    .home-links {
        font-size: 16px;
        margin: 8px 0;
        display: flex;
        align-items: end;
    }
}

.blog-footer {
    //   background-color: black;
    color: #000;
    height: 5vh;
    max-height: 200px;
}

pre {
    padding: 1em !important;
    --tw-prose-pre-bg: #8881 !important;
    // width: fit-content;
    // max-width: 400px;
    overflow: auto;

    code {
        word-wrap: break-word !important;
    }
}
</style>
