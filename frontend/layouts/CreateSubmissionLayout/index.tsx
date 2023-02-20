import { PropsWithChildren } from 'react';
import { BackButton } from '../../components/BackButton';
import { CancelButton } from '../../components/CancelButton';
import styles from './index.module.scss';
import classNames from 'classnames';
import { useRouter } from 'next/router';

interface Props extends PropsWithChildren {
  onSubmit?: () => void
  isCancelAvailable?: boolean
  submitButtonText?: string
  isSubmitAvailable?: boolean
}

export const CreateSubmissionLayout = ({
  children,
  submitButtonText,
  isSubmitAvailable,
  isCancelAvailable,
  onSubmit,
}: Props) => {
  const router = useRouter();

  const onCancel = () => {
    // TO-DO
    // reset submission store
    // go back to the main page
  }

  return (
    <div className={styles.createWrapper}>
      <div className={styles.submissionWrapper}>
        <header className={styles.submissionHeader}>
          <BackButton>Back</BackButton>
          {isCancelAvailable && <CancelButton onCancel={onCancel}>Cancel</CancelButton>}
        </header>
        {
          /link|category|statement/.test(router.route) &&
          <div className={styles.submissionSteps}>
            <div className={classNames(styles.submissionStepItem, { [styles.active]: /link/.test(router.route) })}>
              LINK
            </div>
            <div className={classNames(styles.submissionStepItem, { [styles.active]: /category/.test(router.route) })}>
              CATEGORY
            </div>
            <div className={classNames(styles.submissionStepItem, { [styles.active]: /statement/.test(router.route) })}>
              STATEMENT
            </div>
          </div>
        }
        {children}
        {submitButtonText &&
          <footer className={styles.submissionFooter}>
            <button
              disabled={!isSubmitAvailable}
              onClick={onSubmit}
              className={classNames(
                styles.submissionButton,
                styles.sizeXl,
                { [styles.start]: submitButtonText === "Start" },
                { [styles.disable]: !isSubmitAvailable},
              )}>
              {submitButtonText}
            </button>
          </footer>
        }
      </div>
    </div>
  )
}
