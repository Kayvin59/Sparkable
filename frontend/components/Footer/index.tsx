import classNames from "classnames";
import Link from "next/link";
import styles from "./index.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footerWrapper} id="footer">
      <div className={styles.footerTopPart}>
        <img
          className={styles.footerLogo}
          src="/svg/logo.svg"
          alt="sparkable-logo"
        />
        <span className={styles.footerVersion}>
          <Link
            href="https://github.com/butterfyme/sparkable/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            v0.1.2 (beta)
          </Link>
        </span>
      </div>
      <div className={styles.footerColumnsWrapper}>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>CONTACT</h3>
          <a href="mailto:support@sparkable.cc" className={styles.footerLink}>
            support@sparkable.cc
          </a>
          <br />
          Sparkable (Association) <br />
          CH-8000 Zurich, Switzerland
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>ABOUT</h3>
          <Link href="/about" className={styles.footerLink}>
            About Sparkable
          </Link>
          <br />
          <Link href="/career" className={styles.footerLink}>
            Join our team
          </Link>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>LEGAL</h3>
          <Link href="/legal/privacy-policy" className={styles.footerLink}>
            Privacy policy
          </Link>
          <br />
          <Link href="/legal/terms-of-use" className={styles.footerLink}>
            Terms of use
          </Link>
          <br />
          <Link
            href="/legal/acceptable-use-policy"
            className={styles.footerLink}
          >
            Acceptable use policy
          </Link>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>KEEP IN TOUCH</h3>
          <div className={styles.footerSocialWrapper}>
            <a
              href="https://join.slack.com/t/sparkable-cc/shared_invite/zt-1uankp984-nPw9IJl956eeQ~9l689htg"
              className={classNames(styles.footerSocial, styles.slack)}
              target="_blank"
              rel="noopener noreferrer"
            />
            <br />
            <a
              href="https://www.linkedin.com/company/sparkable-cc"
              className={classNames(styles.footerSocial, styles.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
            />
            <br />
            <a
              href="https://github.com/butterfyme/Sparkable"
              className={classNames(styles.footerSocial, styles.github)}
              target="_blank"
              rel="noopener noreferrer"
            />
            <br />
            <a
              href="https://www.twitter.com/sparkable_cc"
              className={classNames(styles.footerSocial, styles.twitter)}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </div>
      </div>
      <div className={styles.footerBottomPart}>
        <div className={styles.footerBottomColumn}>
          <iframe
            className={styles.footerIframe}
            src="https://f38488d3.sibforms.com/serve/MUIEAAjiBi-Ewn5NOU9Nsek6QtFBT2Rp4oMoMQS8OJk2C_PTeMSttEtrYQDxi8V3hqHbv4uFAzSk1YLzY0bMhh3d7SF1YpOtWj_Yaj5_Fc1gMP9B0KykzSIcHmk4a3KxpWGbxOPILYS41fSvnG23Zb9zbtnrEcEqTbNC0021yNkY48mvLXpzdTTsRQEAKwW4BzVU33_InBuJgWUK"
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
          />
        </div>
        <div className={styles.footerBottomColumn}>
          <div>
            <br />
            <br />
            <p>
              <a
                href="https://engagement.migros.ch/en/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/svg/migros-2.png"
                  alt="Migros Pioneer Fund"
                  className={styles.footerMigros}
                />
              </a>
            </p>
            <p>
              <b>About Migros Pioneer Fund</b>
            </p>
            <p>
              The Migros Pioneer Fund looks for and supports ideas with social
              potential. It enables pioneering projects that break new ground
              and seek out forward-looking solutions. Its impact-oriented
              funding approach combines financial support with coaching
              services. The Migros Pioneer Fund is part of the Migros Group's
              social commitment and is enabled by the Migros Group with around
              CHF 15 million annually. For further information:{" "}
              <a
                href="https://www.migros-pionierfonds.ch/en"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.migros-pionierfonds.ch/en
              </a>
            </p>
          </div>
          <br />
          <br />
          <br />
          <div>
            <img
              src="/svg/open-source.svg"
              alt="open source"
              className={styles.footerOpenSource}
            />
          </div>
          <div className={styles.footerBottomTextWrapper}>
            <img
              src="/svg/surface.svg"
              alt="open source"
              className={styles.footerLogos}
            />
            <p className={styles.footerText}>
              <span>
                With the exception of the trademark (c) Sparkable, this work is
                licensed under a{" "}
              </span>
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerTextLink}
              >
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0
                International License.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
