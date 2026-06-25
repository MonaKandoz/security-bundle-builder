import { useState, type FC } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import {
  CATEGORY_ORDER,
  selectOrderSummary,
  selectReviewLinesByCategory,
} from '../store/selectors';
import { saveForLater } from '../store/slices/builderSlice';
import { showToast } from '../store/slices/uiSlice';
import { ReviewLineItem } from './ReviewLineItem';
import { PriceTag } from './PriceTag';
import { TruckIcon } from '../assets/StepIcons';
import { SatisfactionSeal } from '../assets/SatisfactionSeal';
import styles from './ReviewPanel.module.scss';

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const ReviewPanel: FC = () => {
  const dispatch = useAppDispatch();
  const grouped = useAppSelector(selectReviewLinesByCategory);
  const summary = useAppSelector(selectOrderSummary);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    dispatch(saveForLater());
    dispatch(showToast('Your system was saved. Come back anytime to pick up where you left off.'));
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2200);
  };

  const handleCheckout = () => {
    dispatch(showToast("This is a prototype — there's no real checkout here, but your cart total looks great!"));
  };

  const hasAnyItems = CATEGORY_ORDER.some((cat) => grouped[cat].length > 0);

  return (
    <aside className={styles.panel}>
      <div className={styles.checkoutDetailsArea}>
        <div className={styles.introArea}>
          <p className={styles.eyebrow}>Review</p>
          <h2 className={styles.heading}>Your security system</h2>
          <p className={styles.subhead}>
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>

        <div className={styles.linesArea}>
          <div className={styles.divider} />

          {!hasAnyItems && (
            <p className={styles.empty}>
              Nothing selected yet — choose products on the left and they&apos;ll show up here.
            </p>
          )}

          {CATEGORY_ORDER.map((category) => {
            const lines = grouped[category];
            if (lines.length === 0) return null;
            return (
              <div key={category} className={styles.group}>
                <p className={styles.groupLabel}>{category}</p>
                {lines.map((line) => (
                  <ReviewLineItem key={line.key} line={line} />
                ))}
              </div>
            );
          })}

          <div className={styles.group}>
            <div className={styles.shippingRow}>
              <span className={styles.shippingIcon}>
                <TruckIcon />
              </span>
              <span className={styles.shippingLabel}>Fast Shipping</span>
              <PriceTag price={summary.shippingCost} compareAtPrice={summary.shippingCompareAt} review freeLabel />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.totalsArea}>
        <div className={styles.sealArea}>
          <div className={styles.sealRow}>
            <SatisfactionSeal />
            <div className={styles.sealCopy}>
              <p className={styles.sealTitle}>30-day hassle-free returns</p>
              <p className={styles.sealText}>
                If you&apos;re not totally in love with the product, we will refund you 100%.
              </p>
            </div>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.financingPill}>
              as low as {formatPrice(summary.monthlyFinancing)}/mo
            </span>
            <div className={styles.totalPrice}>
              <span className={styles.totalCompareAt}>{formatPrice(summary.grandCompareAtTotal)}</span>
              <span className={styles.totalActive}>{formatPrice(summary.grandTotal)}</span>
            </div>
          </div>
        </div>

        {summary.savings > 0 && (
          <p className={styles.savings}>
            Congrats! You&apos;re saving {formatPrice(summary.savings)} on your security bundle!
          </p>
        )}

        <button type="button" className={styles.checkoutBtn} onClick={handleCheckout}>
          Checkout
        </button>
        <button type="button" className={styles.saveLink} onClick={handleSave}>
          {justSaved ? 'Saved ✓' : 'Save my system for later'}
        </button>
      </div>
    </aside>
  );
};
