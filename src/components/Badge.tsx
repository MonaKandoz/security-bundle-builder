import type { FC } from 'react';
import styles from './Badge.module.scss';

export const Badge: FC<{ text: string }> = ({ text }) => (
  <span className={styles.badge}>{text}</span>
);
