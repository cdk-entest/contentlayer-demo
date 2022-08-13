import React from "react";
import { allPosts } from ".contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Box, chakra} from "@chakra-ui/react";
import styles from "styles/Home.module.css";

const mdxComponents = {
  h1: (props) => <chakra.h1 fontSize={"5xl"} apply="mdx.h1" {...props} />,
  h2: (props) => <chakra.h2 fontSize={"3xl"} apply="mdx.h2" {...props} />
}

export async function getStaticPaths() {
  const paths = allPosts.map((post) => post.url);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  return {
    props: {
      post,
    },
  };
}

const PostLayout = ({ post }) => {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <Box bg={'gray.100'} maxW="1000px" margin={'auto'} padding="20px">
      <div>
        <h1 className={styles.title}>{post.title}</h1>
        <MDXContent components={mdxComponents}></MDXContent>
      </div>
    </Box>
  );
};

export default PostLayout;