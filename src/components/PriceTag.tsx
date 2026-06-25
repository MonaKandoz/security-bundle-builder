import type { FC } from 'react';
import styles from './PriceTag.module.scss';

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  isMonthly?: boolean;
  align?: 'left' | 'right';
  review?: boolean;
  freeLabel?: boolean;
}

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const PriceTag: FC<PriceTagProps> = ({
  price,
  compareAtPrice,
  isMonthly = false,
  align = 'right',
  review,
  freeLabel = true,
}) => {
  const suffix = isMonthly ? '/mo' : '';
  return (
    <div
      className={`${styles.wrap} ${align === 'right' ? styles.right : styles.left} ${review? styles.bigGap : ""}`}
    >
      {compareAtPrice != null && compareAtPrice > price && (
        <span className={`${styles.compareAt} ${review? styles.compareReview : ""}`}>
          {formatPrice(compareAtPrice)}
          {suffix}
        </span>
      )}
      <span className={`${styles.active} ${review? styles.review : ""}`}>
        {freeLabel && price === 0 ? 'FREE' : `${formatPrice(price)}${suffix}`}
      </span>
    </div>
  );
};
