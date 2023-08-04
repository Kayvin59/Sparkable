import type { NextPage } from "next";
import Head from "next/head";
import { ArticlesList } from "../components/ArticlesList";
import { Filters } from "../components/Filters";
import { MobileFilters } from "../components/MobileFilters";
import { SortsSelect } from "../components/SortsSelect";
import { Welcome } from "../components/Welcome";
import { useAppSelector } from "../store/hooks";
import { selectArticles, selectTotal } from "../store/UIslice";
import styles from "../styles/Home.module.scss";

const HomePage: NextPage = () => {
  const total = useAppSelector(selectTotal);
  const articles = useAppSelector(selectArticles);
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Sparkable</title>
        <meta
          name="description"
          content="Discover links that spark new understanding."
        />
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://www.sparkable.cc" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sparkable" />
        <meta
          property="og:description"
          content="Discover links that spark new understanding."
        />
        <meta
          property="og:image"
          content="https://www.sparkable.cc/og-image.png"
        />
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="sparkable.cc" />
        <meta property="twitter:url" content="https://www.sparkable.cc" />
        <meta name="twitter:title" content="Sparkable" />
        <meta
          name="twitter:description"
          content="Discover links that spark new understanding."
        />
        <meta
          name="twitter:image"
          content="https://www.sparkable.cc/og-image.png"
        />
        <script
          defer
          data-domain="sparkable.cc"
          src="https://plausible.io/js/script.js"
        />
      </Head>
      <section className={styles.container}>
        <Welcome />
        <div className={styles.contentWrapper}>
          <section className={styles.articlesWrapper} id="explore">
            <div className={styles.exploreTitleWrapper}>
              <div className={styles.exploreButton} />
              <h2 className={styles.exploreTitle}>
                <span>Explore</span> what others have submitted
              </h2>
            </div>
            <div className={styles.sortsWrapper}>
              <span className={styles.totalCounter}>
                {articles.length} / {total} submissions
              </span>
              <SortsSelect />
            </div>
            <MobileFilters />
            <ArticlesList />
          </section>
          <Filters />
        </div>
      </section>
    </>
  );
};

export default HomePage;
