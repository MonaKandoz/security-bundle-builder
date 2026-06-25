import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import productsData from '../data/products.json';
import type { Product, ReviewLine, StepId, Category } from '../types';
import { lineKey } from './slices/builderSlice';

const products = productsData as Product[];

export const STEP_ORDER: StepId[] = ['cameras', 'plan', 'sensors', 'accessories'];
export const CATEGORY_ORDER: Category[] = ['Cameras', 'Sensors', 'Accessories', 'Plan'];

export const selectQuantities = (state: RootState) => state.builder.quantities;
export const selectActiveVariant = (state: RootState) => state.builder.activeVariant;
export const selectOpenStep = (state: RootState) => state.builder.openStep;

export const selectProductsByStep = (stepId: StepId): Product[] =>
  products.filter((p) => p.stepId === stepId).sort((a, b) => a.order - b.order);

export const selectProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

/** Quantity of the currently active variant for a product (or its single default qty). */
export const makeSelectActiveQuantity = (productId: string) =>
  createSelector(
    [selectQuantities, selectActiveVariant],
    (quantities, activeVariant) => {
      const product = selectProductById(productId);
      const variantId = product?.variants ? activeVariant[productId] ?? product.variants[0]?.id : undefined;
      return quantities[lineKey(productId, variantId)] ?? 0;
    },
  );

/** Number of distinct products with at least one unit selected, for a given step. */
export const makeSelectStepSelectedCount = (stepId: StepId) =>
  createSelector([selectQuantities], (quantities) => {
    const stepProducts = selectProductsByStep(stepId);
    let count = 0;
    for (const product of stepProducts) {
      if (product.reviewOnly) continue;
      const hasAny = Object.keys(quantities).some(
        (key) => key.startsWith(`${product.id}::`) && quantities[key] > 0,
      );
      if (hasAny) count += 1;
    }
    return count;
  });

/** All review lines (one per product+variant with qty > 0, plus reviewOnly items), grouped by category. */
export const selectReviewLines = createSelector([selectQuantities], (quantities) => {
  const lines: ReviewLine[] = [];

  for (const product of products) {
    if (product.reviewOnly) {
      const key = lineKey(product.id);
      const qty = quantities[key] ?? (product.noQuntitiy ? 1: 0);
      if (qty > 0) {
        lines.push({
          key,
          product,
          quantity: qty,
          lineTotal: product.price * qty,
          lineCompareAtTotal: product.compareAtPrice ? product.compareAtPrice * qty : undefined,
        });
      }
      continue;
    }

    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const key = lineKey(product.id, variant.id);
        const qty = quantities[key] ?? 0;
        if (qty > 0) {
          lines.push({
            key,
            product,
            variant,
            quantity: qty,
            lineTotal: product.price * qty,
            lineCompareAtTotal: product.compareAtPrice ? product.compareAtPrice * qty : undefined,
          });
        }
      }
    } else {
      const key = lineKey(product.id);
      const qty = quantities[key] ?? 0;
      if (qty > 0) {
        lines.push({
          key,
          product,
          quantity: qty,
          lineTotal: product.price * qty,
          lineCompareAtTotal: product.compareAtPrice ? product.compareAtPrice * qty : undefined,
        });
      }
    }
  }

  return lines;
});

export const selectReviewLinesByCategory = createSelector(
  [selectReviewLines],
  (lines) => {
    const grouped: Record<Category, ReviewLine[]> = {
      Cameras: [],
      Sensors: [],
      Accessories: [],
      Plan: [],
    };
    for (const line of lines) {
      grouped[line.product.category].push(line);
    }
    return grouped;
  },
);

export interface OrderSummary {
  itemsTotal: number;
  itemsCompareAtTotal: number;
  shippingCost: number;
  shippingCompareAt: number;
  grandTotal: number;
  grandCompareAtTotal: number;
  savings: number;
  monthlyFinancing: number;
}

const SHIPPING_COMPARE_AT = 5.99;
const SHIPPING_COST = 0; // "Fast Shipping — FREE" per design
const FINANCING_MONTHS = 12; // "as low as $X/mo"

export const selectOrderSummary = createSelector([selectReviewLines], (lines): OrderSummary => {

  const itemsTotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemsCompareAtTotal = lines.reduce(
    (sum, l) => sum + (l.lineCompareAtTotal ?? l.lineTotal),
    0,
  );

  const grandTotal = itemsTotal + SHIPPING_COST;
  const grandCompareAtTotal = itemsCompareAtTotal + SHIPPING_COST;
  const savings = grandCompareAtTotal - grandTotal;

  return {
    itemsTotal,
    itemsCompareAtTotal,
    shippingCost: SHIPPING_COST,
    shippingCompareAt: SHIPPING_COMPARE_AT,
    grandTotal,
    grandCompareAtTotal,
    savings,
    monthlyFinancing: grandCompareAtTotal / FINANCING_MONTHS,
  };
});

export const selectPlanLine = createSelector([selectReviewLines], (lines) =>
  lines.find((l) => l.product.isMonthly),
);
