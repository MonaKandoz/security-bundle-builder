import type { StepConfig, StepId } from '../types';

export const STEPS: StepConfig[] = [
  {
    id: 'cameras',
    stepNumber: 1,
    title: 'Choose your cameras',
    icon: 'camera',
    ctaLabel: 'Next: Choose your plan',
  },
  {
    id: 'plan',
    stepNumber: 2,
    title: 'Choose your plan',
    icon: 'shield',
    ctaLabel: 'Next: Choose your sensors',
  },
  {
    id: 'sensors',
    stepNumber: 3,
    title: 'Choose your sensors',
    icon: 'sensor',
    ctaLabel: 'Next: Add extra protection',
  },
  {
    id: 'accessories',
    stepNumber: 4,
    title: 'Add extra protection',
    icon: 'protection',
    ctaLabel: null,
  },
];

export const NEXT_STEP: Record<StepId, StepId | null> = {
  cameras: 'plan',
  plan: 'sensors',
  sensors: 'accessories',
  accessories: null,
};
