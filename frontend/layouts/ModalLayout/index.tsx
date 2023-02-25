import { PropsWithChildren, useRef } from 'react';
import styles from './index.module.scss';
import { motion } from "framer-motion";
import { useOutsideClick } from '../../utils/useOutsideClick';
import classNames from 'classnames';

const variants = {
  initial: { opacity: 0, display: "none" },
  open: { opacity: 1, display: "flex" },
  closed: { opacity: 0, display: "none" },
}

interface Props extends PropsWithChildren {
  title: string
  isVisible: boolean
  withTitleIcon?: boolean
  cancelButtonLabel?: string
  onCancel: () => void
}

export const ModalLayout = ({ children, title, isVisible, withTitleIcon, cancelButtonLabel, onCancel }: Props) => {
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => {
    onCancel();
  });

  return (
    <motion.div className={styles.modalViewport}
      animate={isVisible ? "open" : "closed"}
      variants={variants}
      
    >
      <div className={styles.modalWrapper} ref={containerRef}>
        <header className={styles.modalHeader}>
          <h3 className={classNames(styles.modalTitle, {[styles.titleIcon]: withTitleIcon})}>
            {title}
          </h3>
          <button
            className={styles.cancelButton}
            onClick={onCancel}>
            {cancelButtonLabel ? cancelButtonLabel : "Cancel"}
          </button>
        </header>
        {children}
      </div>
    </motion.div>
  )
}
