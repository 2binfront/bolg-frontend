<!-- components/RssSubscribe.vue -->
<template>
    <div class="rss-subscribe" title="RSS">
        <a href="/api/rss.xml" target="_blank" class="rss-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rss-icon">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
            </svg>
        </a>
    </div>
</template>

<style scoped>
.rss-subscribe {
    margin: 1rem 0;
}

.rss-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #fff;
    border-radius: 4px;
    color: #ff6600;
    text-decoration: none;
    font-weight: 500;
}

.rss-icon {
    color: #ff6600;
}
</style>
