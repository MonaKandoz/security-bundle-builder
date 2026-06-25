import type { FC } from 'react';
import type { ReviewLine } from '../types';
import { useAppDispatch } from '../hooks/useAppStore';
import { decrementQuantity, incrementQuantity } from '../store/slices/builderSlice';
import { QuantityStepper } from './QuantityStepper';
import { PriceTag } from './PriceTag';
import styles from './ReviewLineItem.module.scss';
import { showToast } from '../store/slices/uiSlice';

interface ReviewLineItemProps {
  line: ReviewLine;
}

export const ReviewLineItem: FC<ReviewLineItemProps> = ({ line }) => {
  const dispatch = useAppDispatch();
  const { product, variant, quantity } = line;
  
  const illustration = `assets/${product.stepId}/${product.image}/${variant?`opt_${variant?.id}` : "main"}.png`

  const handleIncrement = () =>{
    if(product.maxToAdd === quantity) return dispatch(showToast( `Can't add more than ${product.maxToAdd}`))
    dispatch(incrementQuantity({ productId: product.id, variantId: variant?.id }));
  }
  const handleDecrement = () =>
    dispatch(decrementQuantity({ productId: product.id, variantId: variant?.id }));

  const displayName = variant ? `${product.name} (${variant.label})` : product.name;

  return (
    <div className={`${styles.line} ${product.category === "Plan" && styles.noImgLine}`}>
      {product.category !== "Plan" &&
        <div className={styles.thumb}>
          <img src={illustration} title={`${product.name}`} alt={`${product.name}`} aria-label={`${product.name}`}/>
        </div>
      }
      <div className={styles.name}>
        {product.category === "Plan" ?
          <div className={`${styles.thumb} ${styles.fullWImg}`}>
            <img src={illustration} title={`${product.name}`} alt={`${product.name}`} aria-label={`${product.name}`}/>
          </div>
          :
          <span>{product.name}</span>
        }
        {variant && <span className={styles.variant}>{variant.label}</span>}
      </div>
      {!product.noQuntitiy&& 
        <QuantityStepper
          quantity={quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          label={displayName}
          disabled={product.reviewOnly}
          isWhite
        />
      }
      <PriceTag
        price={line.lineTotal}
        compareAtPrice={line.lineCompareAtTotal}
        isMonthly={product.isMonthly}
        review
        freeLabel
      />
    </div>
  );
};
