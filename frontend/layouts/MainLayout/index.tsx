import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/MobileHeader";
import { AuthButtons } from '../../components/AuthButtons';

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className={styles.mainWrapper}>
      <Menu />
      <MobileHeader />
      <AuthButtons />
      {children}
    </main>
  )
}