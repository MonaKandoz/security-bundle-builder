export type StepId = 'cameras' | 'plan' | 'sensors' | 'accessories';

export type Category = 'Cameras' | 'Sensors' | 'Accessories' | 'Plan';

export interface ProductVariant {
  id: string;
  label: string;
  swatch: string; // hex color or image path for the small swatch
}

export interface ProductBadge {
  text: string;
}

export interface Product {
  id: string;
  stepId: StepId;
  category: Category;
  name: string;
  description?: string;
  image: string;
  learnMoreUrl?: string;
  badge?: ProductBadge;
  compareAtPrice?: number;
  price: number;
  noQuntitiy?: boolean;
  /** Monthly price for plan-type products (e.g. "$9.99/mo") */
  isMonthly?: boolean;
  variants?: ProductVariant[];
  /** Whether this product shows a quantity stepper / add control at all */
  maxToAdd?: number;
  /** Required add-ons shown in review with no stepper (e.g. Sense Hub) */
  reviewOnly?: boolean;
  /** Sort order within its step/category */
  order: number;
}

export interface StepConfig {
  id: StepId;
  stepNumber: number;
  title: string;
  icon: string;
  ctaLabel: string | null; // "Next: Choose your plan" — null for last step
}

/** quantities keyed by `${productId}::${variantId | 'default'}` */
export type QuantityMap = Record<string, number>;

/** which variant is currently "active" (shown on the card) per product */
export type ActiveVariantMap = Record<string, string>;

export interface BuilderState {
  quantities: QuantityMap;
  activeVariant: ActiveVariantMap;
  openStep: StepId;
}

export interface ReviewLine {
  key: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  lineTotal: number;
  lineCompareAtTotal?: number;
}
