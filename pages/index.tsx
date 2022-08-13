import type { NextPage } from "next";
import Head from "next/head";
import styles from "styles/Home.module.css";
import { allPosts } from ".contentlayer/generated";

const PostCard = ({ post }: { post: any }) => {
  return (
    <a href={post.url} className={styles.card}>
      <h2>{post.title} &rarr;</h2>
      <p>{post.description}</p>
    </a>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome To Contentlayer</h1>
        <div className={styles.grid}>
          {allPosts.map((post, idx) => (
            <PostCard post={post} key={idx}></PostCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
