import type { FC } from 'react';
import { MinusIcon, PlusIcon } from '../assets/StepIcons';
import styles from './QuantityStepper.module.scss';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  label?: string;
  isWhite?: boolean;
}

export const QuantityStepper: FC<QuantityStepperProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  label = 'item',
  isWhite
}) => {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={`${styles.btn} ${isWhite? styles.btnWhite : ""}`}
        onClick={onDecrement}
        disabled={disabled || quantity <= 0}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon />
      </button>
      <span className={styles.value} aria-live="polite" aria-atomic="true">
        {quantity}
      </span>
      <button
        type="button"
        className={`${styles.btn} ${isWhite? styles.btnWhite : ""}`}
        onClick={onIncrement}
        disabled={disabled}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
};
