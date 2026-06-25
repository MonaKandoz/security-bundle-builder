import { useEffect, type FC } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { clearToast } from '../store/slices/uiSlice';
import styles from './Toast.module.scss';

export const Toast: FC = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.ui.toastMessage);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => dispatch(clearToast()), 3200);
    return () => window.clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
};
