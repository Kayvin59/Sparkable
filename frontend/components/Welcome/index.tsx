import classNames from "classnames";
import Link from "next/link";
import styles from "./index.module.scss";

export const Welcome = () => {
  return (
    <div className={styles.welcomeWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>
          What on the internet <br />
          sparks new <br />
          understanding?
        </h1>
        <h2 className={styles.subtitle}>
          Sparkable is a collection of links that have
          brought lasting new insight to people.
        </h2>
        <div className={styles.buttonsWrapper}>
          <Link
            scroll={false}
            href="/#explore"
            className={classNames(styles.startButton, styles.sizeXl)}
          >
            Start Exploring
          </Link>
          <Link
            href="/about"
            className={classNames(styles.buttonTransparent, styles.sizeXl)}
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};
