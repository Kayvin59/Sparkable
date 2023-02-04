import type { NextPage } from "next";
import { useState } from "react";
import styles from "../../styles/Article.module.scss";
import { ArticlesList } from "../../components/ArticlesList";
import { ArticlePreview } from "../../components/ArticlePreview";
import { BackButton } from "../../components/BackButton";
import { useLazyGetArticleByIDQuery } from "../../store/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ApiTypes } from "../../types";
import { motion } from "framer-motion";
import { ModalShare } from '../../components/ModalShare';

const Article: NextPage = () => {
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);
  const [triggerGetArticleByID, { isLoading, data }] = useLazyGetArticleByIDQuery();
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      triggerGetArticleByID(slug as string);
    }
  }, [slug]);

  return (
    <>
      <motion.div
        className={styles.backButtonWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <BackButton directPath="/#explore">Back <span>to Explore</span></BackButton>
      </motion.div>
      <motion.section
        className={styles.articlesWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ArticlesList isPreviewPage />
      </motion.section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ArticlePreview
          isLoading={isLoading}
          onShareClick={() => setCopyModalVisible(true)}
          {...data as ApiTypes.Res.Article}
        />
      </motion.div>
      {
        data && <ModalShare
          isVisible={isCopyModalVisible}
          onCancel={() => setCopyModalVisible(false)}
          textLink={data?.link}
        />
      }
    </>
  );
};

export default Article;
