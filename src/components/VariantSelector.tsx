import type { FC } from 'react';
import type { Product, ProductVariant } from '../types';
import styles from './VariantSelector.module.scss';

interface VariantSelectorProps {
  product: Product;
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export const VariantSelector: FC<VariantSelectorProps> = ({
  product,
  activeVariantId,
  onSelect,
}) => {
  const variants : ProductVariant[] = product.variants!;
  return (
    <div className={styles.row} role="radiogroup" aria-label="Color">
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        const src = `assets/${product.stepId}/${product.image}/opt_${variant.id}.png`;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.chip} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(variant.id)}
          >
            <img src={src} className={styles.img} />
            <span className={styles.label}>{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
};
