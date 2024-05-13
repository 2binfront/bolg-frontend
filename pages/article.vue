<script lang="ts" setup>
import { parseMarkdown } from '@nuxtjs/mdc/runtime';
import { marked } from 'marked';
const articleTest = `
---
title: Sam
---

# Simple

Simple paragraph

Inline code \`const codeInline: string = 'highlighted code inline'\`{lang="ts"} can be contained in paragraphs.

Code block:
\`\`\`typescript[filename]{1,3-5}meta
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

async function main(mdc: string) {
  const ast = await parseMarkdown(mdc)
  // Do your magic with parsed AST tree

  return ast // [!code ++]
  return ast // [!code --]
}
\`\`\`
`;
const html = marked.parse(articleTest);
</script>

<template>
  <div class="full">
    <div class="home-links">
      <NuxtLink to="/catalog">Catalog</NuxtLink>
      <NuxtLink to="/tag" ml>Tag</NuxtLink>
      <!-- <NuxtLink to="/archive" ml>Archive</NuxtLink> -->
      <NuxtLink to="/about" ml>About</NuxtLink>
    </div>
    <!-- <MDC :value="articleTest" tag="article"></MDC> -->
    <MDC v-slot="{ data, body }" :value="articleTest">
      <article class="p-4 prose">
        <h1 v-if="data?.title">
          {{ data.title }}
        </h1>
        <MDCRenderer v-if="body" :body="body" :data="data" />
      </article>
    </MDC>
    <div v-html="html"></div>
  </div>
</template>

<style lang="scss" scoped>
pre {
  padding: 1em 0 !important;
  --tw-prose-pre-bg: #8881 !important;
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
