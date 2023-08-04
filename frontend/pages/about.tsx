import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/About.module.scss";

const About: NextPage = () => {
  const openPDF = () => {
    window.open("/pdf/whitepaper-and-faq.pdf", "_blank");
  };

  return (
    <>
      <Head>
        <title>Sparkable - About</title>
        <meta name="description" content="Sparkable - About Us" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
      <div className={styles.aboutWrapper}>
        <section className={styles.situationWrapper}>
          <div className={styles.aboutContainer}>
            <div className={styles.titleTag}>SITUATION</div>
            <h2 className={styles.aboutTitle}>
              The internet has become toxic.
            </h2>
            <p className={classNames(styles.aboutText, styles.center)}>
              Our life online is dominated by the advertisement business model
              which optimizes for clicks, likes, and follows. This has led to
              filter bubbles, polarization, hate, and other dangerous trends.{" "}
            </p>
          </div>
        </section>
        <section className={styles.visionWrapper}>
          <div className={styles.aboutContainer}>
            <div className={styles.titleTag}>VISION</div>
            <h2 className={styles.aboutTitle}>
              What if we optimized for understanding?
            </h2>
            <p className={classNames(styles.aboutText, styles.center)}>
              We are working on a fundamentally new business model for the
              internet. It rewards the creation of new understanding instead of
              clickbait.
            </p>
            <p className={classNames(styles.aboutText, styles.center)}>
              For people, not for profit.
            </p>
            <div className={styles.visionButtonWrapper}>
              <Link
                scroll={false}
                href="about#howItWorks"
                className={classNames(styles.whiteButton, styles.learnMore)}
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.howItWorksWrapper} id="howItWorks">
          <div className={styles.aboutContainer}>
            <div className={styles.videoFrame}>
              <iframe
                src="https://player.vimeo.com/video/766153844?h=44f44d933a&color=ffffff&byline=0&portrait=0"
                allow="autoplay; fullscreen; picture-in-picture"
              />
            </div>
            <h3 className={classNames(styles.aboutTitle, styles.smaller)}>
              How it works
            </h3>
            <ol>
              <li className={styles.aboutListItem}>
                See link submissions that have given others new insight and
                understanding.
              </li>
              <li className={styles.aboutListItem}>
                Submit your own links and get points.
              </li>
              <li className={styles.aboutListItem}>
                Participate in the weekly voting to select the most insightful
                link submissions and get points.
              </li>
              <li className={styles.aboutListItem}>
                Spend your points to see only the best content.
              </li>
              <li className={styles.aboutListItem}>
                The spent points are then redistributed to the submitter, the
                selectors, and the platform.
              </li>
            </ol>
            <div className={styles.howItWorksButtonsWrapper}>
              <a
                className={classNames(styles.blueButton, styles.whitepaper)}
                href="/pdf/whitepaper-and-faq.pdf"
                download
              >
                Whitepaper and FAQ
              </a>
              {/* "FAQ" button to open the PDF */}
              <button
                className={classNames(styles.whiteButton, styles.explore)}
                onClick={openPDF}
              >
                FAQ
              </button>
            </div>
          </div>
        </section>
        <section className={styles.communityWrapper}>
          <div className={styles.aboutContainer}>
            <div className={styles.titleTag}>COMMUNITY</div>
            <h2 className={styles.aboutTitle}>
              Calling changemakers like you.
            </h2>
            <p className={classNames(styles.aboutText, styles.center)}>
              Join the Sparkable community to co-create a better internet that
              leads to more understanding instead of more polarization.{" "}
            </p>
            <div className={styles.communityButtons}>
              <a
                className={classNames(styles.blueButton, styles.joinSlack)}
                target="_blank"
                href="https://join.slack.com/t/sparkable-cc/shared_invite/zt-1uankp984-nPw9IJl956eeQ~9l689htg"
                rel="noreferrer"
              >
                Join our Slack
              </a>
            </div>
            <div className={styles.slackMembersWrapper}>
              <img
                src="slack-member-1.png"
                alt="member"
                className={styles.slackMember}
              />
              <img
                src="slack-member-2.png"
                alt="member"
                className={styles.slackMember}
              />
              <img
                src="slack-member-3.png"
                alt="member"
                className={styles.slackMember}
              />
              <span className={styles.slackMemberCounter}>+60</span>
            </div>
            <div className={styles.communityButtons}>
              <Link
                scroll={false}
                href="about#newsletter"
                className={classNames(styles.whiteButton, styles.joinMailing)}
              >
                Join mailing list
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.teamWrapper}>
          <div className={styles.aboutContainer}>
            <div className={styles.titleTag}>TEAM</div>
            <h2 className={styles.aboutTitle}>
              A collective of curious minds.
            </h2>
            <p className={classNames(styles.aboutText, styles.center)}>
              People from different walks of life. United by the vision of a
              better information environment.
            </p>
            <div className={styles.teamMembersWrapper}>
              <div className={styles.teamMember}>
                <img
                  src="Felix.png"
                  alt="Felix"
                  className={styles.teamMemberPhoto}
                />
                <div className={styles.teamMemberInfo}>
                  <div className={styles.teamMemberName}>Felix Gugler </div>
                  <div className={styles.teamMemberPosition}>
                    Business Design
                  </div>
                </div>
              </div>
              <div className={styles.teamMember}>
                <img
                  src="Tony.png"
                  alt="Tony"
                  className={styles.teamMemberPhoto}
                />
                <div className={styles.teamMemberInfo}>
                  <div className={styles.teamMemberName}>
                    Tony Morellá Llácer
                  </div>
                  <div className={styles.teamMemberPosition}>Technology</div>
                </div>
              </div>
              <div className={styles.teamMember}>
                <img
                  src="Oma.png"
                  alt="Oma"
                  className={styles.teamMemberPhoto}
                />
                <div className={styles.teamMemberInfo}>
                  <div className={styles.teamMemberName}>Oma Ikwueme</div>
                  <div className={styles.teamMemberPosition}>Technology</div>
                </div>
              </div>
              <div className={styles.teamMember}>
                <img
                  src="Vardon.png"
                  alt="Vardon"
                  className={styles.teamMemberPhoto}
                />
                <div className={styles.teamMemberInfo}>
                  <div className={styles.teamMemberName}>Vardon Hamdiu</div>
                  <div className={styles.teamMemberPosition}>Project Lead</div>
                </div>
              </div>
            </div>
            <div className={styles.teamVacanciesWrapper}>
              <img src="svg/vacancies.svg" alt="img" />
              <div className={styles.teamVacanciesListWrapper}>
                <h3 className={styles.teamVacanciesTitle}>You?</h3>
                <ul className={styles.teamVacanciesList}>
                  <li className={styles.teamVacanciesListItem}>Product Lead</li>
                  <li className={styles.teamVacanciesListItem}>
                    Product Designer
                  </li>
                  <li className={styles.teamVacanciesListItem}>
                    Frontend Developer
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.teamButtonWrapper}>
              <a
                href="mailto:support@sparkable.cc"
                className={classNames(styles.whiteButton, styles.joinMailing)}
              >
                Drop us a line
              </a>
            </div>
            <div className={styles.teamButtonWrapper}>
              <Link
                className={classNames(styles.blueButton, styles.submit)}
                href="/career"
              >
                See open job positions
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.newsletterWrapper} id="newsletter">
          <div className={styles.aboutContainer}>
            <div className={styles.titleTag}>NEWSLETTER</div>
            <h2 className={styles.aboutTitle}>Keep in touch.</h2>
            <form action="" className={styles.newsletterForm}>
              <input
                type="text"
                className={styles.newsletterInput}
                placeholder="Email"
              />
              <div className={styles.newsletterNote}>
                Once a month, no noise. You can unsubscribe at any time.
              </div>
              <label htmlFor="privacyAgree" className={styles.inputLabel}>
                <input
                  type="radio"
                  className={styles.inputRadio}
                  id="privacyAgree"
                />
                By submitting your email you agree to our{" "}
                <Link href="legal/privacy-policy" className={styles.link}>
                  privacy policy
                </Link>
              </label>
            </form>
          </div>
        </section>
        <section className={styles.participateWrapper}>
          <div className={styles.aboutContainer}>
            <div className={styles.titleTag}>PARTICIPATE</div>
            <h2 className={styles.aboutTitle}>
              Spark new insight and mutual understanding.
            </h2>
            <div className={styles.participateButtonWrapper}>
              <Link
                className={classNames(styles.blueButton, styles.submit)}
                href="submission/create"
              >
                Submit a link
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
