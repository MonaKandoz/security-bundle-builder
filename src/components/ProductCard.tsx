import type { FC } from 'react';
import type { Product } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import {
  decrementQuantity,
  incrementQuantity,
  lineKey,
  setActiveVariant,
} from '../store/slices/builderSlice';
import { selectActiveVariant, selectQuantities } from '../store/selectors';
import { Badge } from './Badge';
import { VariantSelector } from './VariantSelector';
import { QuantityStepper } from './QuantityStepper';
import { PriceTag } from './PriceTag';
import styles from './ProductCard.module.scss';
import { showToast } from '../store/slices/uiSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const quantities = useAppSelector(selectQuantities);
  const activeVariants = useAppSelector(selectActiveVariant);

  const hasVariants = !!product.variants && product.variants.length > 0;
  const activeVariantId = hasVariants
    ? activeVariants[product.id] ?? product.variants![0].id
    : undefined;

  const key = lineKey(product.id, activeVariantId);
  const quantity = quantities[key] ?? 0;
  const isSelected = quantity > 0;

  const illustration = `assets/${product.stepId}/${product.image}/main.png`

  const handleIncrement = () =>{
    if(product.maxToAdd === quantity) return dispatch(showToast( `Can't add more than ${product.maxToAdd}`))
    dispatch(incrementQuantity({ productId: product.id, variantId: activeVariantId }));
  }
  const handleDecrement = () =>
    dispatch(decrementQuantity({ productId: product.id, variantId: activeVariantId }));
  const handleVariantSelect = (variantId: string) =>
    dispatch(setActiveVariant({ productId: product.id, variantId }));

  return (
    <article className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      {product.category !== "Plan" &&
        <div className={styles.media}>
          {product.badge && (
            <span className={styles.badgeSlot}>
              <Badge text={product.badge.text} />
            </span>
          )}
          <div className={styles.image}>
            <img src={illustration} title={`${product.name}`} alt={`${product.name}`} aria-label={`${product.name}`}/>
          </div>
        </div>
      }

      <div className={styles.body}>
        {product.category === "Plan"?
          <div className={`${styles.media} ${styles.nameImg}`}>
            {product.badge && (
              <span className={styles.badgeSlot}>
                <Badge text={product.badge.text} />
              </span>
            )}
            <div className={`${styles.image} ${styles.nameImg}`}>
              <img src={illustration} title={`${product.name}`} alt={`${product.name}`} aria-label={`${product.name}`}/>
            </div>
          </div>
          :
          <h3 className={styles.title}>{product.name}</h3>
        }
        {product.description && <p className={styles.description}>
          {product.description}
          {product.learnMoreUrl && (
            <a className={styles.learnMore} href={product.learnMoreUrl}>
              Learn More
            </a>
          )}
        </p>}

        {hasVariants && (
          <div className={styles.variants}>
            <VariantSelector
              product={product}
              activeVariantId={activeVariantId!}
              onSelect={handleVariantSelect}
            />
          </div>
        )}

        <div className={styles.footer}>
          {!product.noQuntitiy &&
            <QuantityStepper
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              label={product.name}
              disabled={product.reviewOnly}
            />
          }
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            isMonthly={product.isMonthly}
          />
        </div>
      </div>
    </article>
  );
};
