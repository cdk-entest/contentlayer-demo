---
title: Build a Personal Site with ContentLayer and ChakraUI
description: build a personal site with contentlayer and chakraui and host by amplify
author: haimtran
publishedDate: 08/12/2022
date: 2022-08-12
---

## Build a Personal Site with ContentLayer and ChakraUI

- Contentlayer converts mdx, md into json and react components
- Contentlayer does routing - nextjs prerender
- Contentlayer appiles styles to generated components
- Provide styles via ChakaraUI and useMDXComponent hook
- [GitHub](https://github.com/entest-hai/nextjs-contentlayer-chakra-ui)

## Create NextJS App

```bash
npx create-next-app@latest my-site --typescript
```

add content layer

```bash
npm install contentlayer next-contentlayer
```

add chakraui

```bash
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

```
|--.contentlayer
|--pages
   |___app.tsx
   |__index.tsx
   |--posts
      |--[slug].js
|--posts
   |--post-01.mdx
   |--post-02.mdx
   |--post-03.mdx
|--src
   |--components
      |--mdx-components
         |--codeblock
         |--inline-code.tsx
         |--linked-heading.tsx
         |--mdx-component.tsx
|--contentlayer.config.js
|--next.config.js
|--package.json
```

configure tsconfig with paths

```json
{
  "compilerOptions": {
    ...
    "incremental": true,
    "baseUrl": "."
  },
  "paths": {
    "contentlayer/generated": ["./.contentlayer/generated"],
    "styles/*": ["styles/*"]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".contentlayer/generated"
  ],
  "exclude": ["node_modules"]
}
```

configure next.config.js

```js
const { withContentlayer } = require("next-contentlayer");
module.exports = withContentlayer({});
```

## Configure Schema

This is the content of contentlayer.config.js and it specifies the schema of Post. Given the schema, contentlayer can convert md, mdx content into react components.

```js
import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
});
```

## Configure Routes

import the generated posts from contentlayer and map to the nextjs url

```js
import { allPosts } from "./../../.contentlayer/generated";

export async function getStaticPaths() {
  const paths = allPosts.map((post) => post.url);
  return {
    paths,
    fallback: false,
  };
}
```

match the request url (from user) with the nextjs url using slug.

```js
export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  return {
    props: {
      post,
    },
  };
}
```

## Apply Styles

Provide styles for generated components via [MDXComponents](https://www.contentlayer.dev/docs/reference/next-contentlayer). For example

```js
const mdxComponents = {
  h1: (props) => <chakra.h1 fontSize={"5xl"} apply="mdx.h1" {...props} />,
  h2: (props) => <chakra.h2 fontSize={"3xl"} apply="mdx.h2" {...props} />,
};
```

Then apply the styles into generated components

```js
import React from "react";
import { allPosts } from ".contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Box, chakra } from "@chakra-ui/react";
import styles from "styles/Home.module.css";

const PostLayout = ({ post }) => {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <Box bg={"gray.100"} maxW="1000px" margin={"auto"} padding="20px">
      <div>
        <h1 className={styles.title}>{post.title}</h1>
        <MDXContent components={mdxComponents}></MDXContent>
      </div>
    </Box>
  );
};

export default PostLayout;
```

## Amplify Hosting

```bash
amplify init
```

then add hosting

```bash
amplify add hosting
```

select manual then publish (this work for static website). For hybrid, need to choose CI/CD pipeline with GitHub source or using vercel hosting.

```bash
amplify publish
```
