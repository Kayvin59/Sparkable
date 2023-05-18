import styles from "./index.module.scss";
import classNames from "classnames";
import { useMemo, useEffect, useState } from "react";
import { getArticles, getCategories, useLazyGetCategoriesQuery } from "../../store/api/articlesApi";
import { setFilters, selectSelectedFilters } from "../../store/UIslice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { v4 as uuidv4 } from "uuid";
import isEqual from "lodash.isequal";
import { useRouter } from "next/router";
import { ModalNote } from "../ModalNote";

export const Filters = () => {
  const selectedFilters = useAppSelector(selectSelectedFilters);
  const [currentFilters, setCurrentFilters] = useState<string[]>(selectedFilters);
  const dispatch = useAppDispatch();
  const [triggerGetCategories] = useLazyGetCategoriesQuery();
  const params = selectedFilters?.length ? selectedFilters : undefined;
  const selectArticles = useMemo(() => getArticles.select({ categories: params }), [
    selectedFilters,
  ]);
  const selectCategories = useMemo(() => getCategories.select(), []);
  const articles = useAppSelector(selectArticles);
  const categories = useAppSelector(selectCategories);
  const categoriesData = categories?.data?.categories;
  const router = useRouter();

  const onSetCurrentFilter = (event: any) => {
    const param = event?.target?.getAttribute("data-param");
    if (!param) return;

    if (currentFilters?.find(item => item === param)) {
      setCurrentFilters(currentFilters.filter(item => item !== param));
    } else {
      setCurrentFilters([...currentFilters, ...[param]]);
    }
  };

  const onApply = () => {
    dispatch(setFilters(currentFilters));
  };

  useEffect(() => {
    if (!categoriesData) {
      triggerGetCategories();
    }
  }, []);

  return (
    <aside className={styles.filtersSidebar}>
      <section className={styles.filtersSection}>
        <h4 className={styles.filtersTitle}>Filter by category</h4>
        {
          categoriesData && categoriesData?.map(item => (
            <button
              className={classNames(styles.filterButton, {
                [styles.active]: currentFilters.find(sortItem => sortItem === item.slug)
              })}
              onClick={onSetCurrentFilter}
              disabled={articles?.isLoading}
              key={uuidv4()}
              data-param={item.slug}
            >
              {item.name}
            </button>
          ))
        }
        {
          !isEqual(currentFilters, selectedFilters) &&
          <button
            className={styles.applyButton}
            onClick={onApply}
          >
            Apply
          </button>
        }
      </section>
      <section className={styles.filtersSection}>
        <div className={styles.filtersTitleWrapper}>
          <h4 className={styles.filtersTitle}>Filter by stage</h4>
          <ModalNote title="Filter by stage">
            <div className={styles.modalText}>In stage 1, you can explore all the submissions.</div>
            <div className={styles.modalText}>In stage 2, you can explore  submissions which received votes.</div>
            <div className={styles.modalText}>To explore stage 2, participate in an upcoming voting round.</div>
            <div className={styles.modalTextLink}>Learn more</div>
            <div className={styles.modalImgWrapper}>
              <img src="svg/filter-tooltip.svg" alt="icon" />
            </div>
          </ModalNote>
        </div>
        <div className={styles.filterButtonWrapper}>
          <button
            className={classNames(styles.filterStageButton, {
              [styles.active]: false
            })}
            // onClick={onSetCurrentFilter}
            // data-param={item.slug}
            disabled={articles?.isLoading}
            key={uuidv4()}
          >
            Stage 1
          </button>
          <span className={styles.filterButtonNote}>Explore all submissions</span>
        </div>
        <div className={styles.filterButtonWrapper}>
          <button
            className={classNames(styles.filterStageButton, {
              [styles.disabled]: true
            })}
            // onClick={onSetCurrentFilter}
            // data-param={item.slug}
            disabled={articles?.isLoading}
            key={uuidv4()}
          >
            Stage 2
          </button>
          <span className={styles.filterButtonNote}>Explore submissions which received votes</span>
        </div>
        {
          // !isEqual(currentFilters, selectedFilters) &&
          // <button
          //   className={styles.applyButton}
          //   onClick={onApply}
          // >
          //   Apply
          // </button>
        }
      </section>
      <div className={styles.textWrapper}>
        <p className={styles.text}>
          What is the most insightful piece of content you have encountered recently?
        </p>
        <button
          onClick={() => router.push("/submission/create")}
          className={classNames(styles.buttonPrimary, styles.sizeXl)}
        >
          Submit a link
        </button>
      </div>
    </aside>
  );
};
