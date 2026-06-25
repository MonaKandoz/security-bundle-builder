import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BuilderState, StepId } from '../../types';
import { seedQuantities, seedActiveVariant } from '../../data/seedState';
import productsData from '../../data/products.json';
import type { Product } from '../../types';

const products = productsData as Product[];

export const STORAGE_KEY = 'security-bundle-builder:v1';

export const lineKey = (productId: string, variantId?: string) =>
  `${productId}::${variantId ?? 'default'}`;

function loadPersisted(): Partial<BuilderState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as Partial<BuilderState>;
  } catch {
    return null;
  }
}

function buildInitialState(): BuilderState {
  const persisted = loadPersisted();
  if (persisted && persisted.quantities) {
    return {
      quantities: persisted.quantities ?? {},
      activeVariant: persisted.activeVariant ?? {},
      openStep: persisted.openStep ?? 'cameras',
    };
  }
  return {
    quantities: { ...seedQuantities },
    activeVariant: { ...seedActiveVariant },
    openStep: 'cameras',
  };
}

const initialState: BuilderState = buildInitialState();

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setQuantity: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>,
    ) => {
      const { productId, variantId, quantity } = action.payload;
      const key = lineKey(productId, variantId);
      const clamped = Math.max(0, quantity);
      if (clamped === 0) {
        delete state.quantities[key];
      } else {
        state.quantities[key] = clamped;
      }
    },
    incrementQuantity: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>,
    ) => {
      const { productId, variantId } = action.payload;
      const key = lineKey(productId, variantId);
      state.quantities[key] = (state.quantities[key] ?? 0) + 1;
    },
    decrementQuantity: (
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>,
    ) => {
      const { productId, variantId } = action.payload;
      const key = lineKey(productId, variantId);
      const next = (state.quantities[key] ?? 0) - 1;
      if (next <= 0) {
        delete state.quantities[key];
      } else {
        state.quantities[key] = next;
      }
    },
    setActiveVariant: (
      state,
      action: PayloadAction<{ productId: string; variantId: string }>,
    ) => {
      state.activeVariant[action.payload.productId] = action.payload.variantId;
    },
    toggleStep: (state, action: PayloadAction<StepId>) => {
      state.openStep = state.openStep === action.payload ? state.openStep : action.payload;
    },
    setOpenStep: (state, action: PayloadAction<StepId>) => {
      state.openStep = action.payload;
    },
    advanceStep: (state, action: PayloadAction<StepId>) => {
      state.openStep = action.payload;
    },
    saveForLater: (state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // localStorage unavailable — silently no-op, UI shows a toast regardless
      }
    },
    restoreFromStorage: (state) => {
      const persisted = loadPersisted();
      if (persisted) {
        state.quantities = persisted.quantities ?? {};
        state.activeVariant = persisted.activeVariant ?? {};
        state.openStep = persisted.openStep ?? 'cameras';
      }
    },
    resetToSeed: (state) => {
      state.quantities = { ...seedQuantities };
      state.activeVariant = { ...seedActiveVariant };
      state.openStep = 'cameras';
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  },
});

export const {
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  setActiveVariant,
  toggleStep,
  setOpenStep,
  advanceStep,
  saveForLater,
  restoreFromStorage,
  resetToSeed,
} = builderSlice.actions;

export default builderSlice.reducer;

// Re-export products for convenience in selectors
export { products };
