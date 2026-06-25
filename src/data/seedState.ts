import type { QuantityMap, ActiveVariantMap } from '../types';

/**
 * Default selections so the app loads looking exactly like the design:
 * Cam v4 ×1 (White), Cam Pan v3 ×2 (White), Sense Motion Sensor ×2,
 * Sense Hub ×1 (required, no control), MicroSD ×2, Cam Unlimited plan ×1.
 */
export const seedQuantities: QuantityMap = {
  'cam-v4::white': 1,
  'cam-pan-v3::white': 2,
  'sense-motion-sensor::default': 2,
  'sense-hub::default': 1,
  'microsd-256::default': 2,
  'plan-cam-unlimited::default': 1,
};

export const seedActiveVariant: ActiveVariantMap = {
  'cam-v4': 'white',
  'cam-pan-v3': 'white',
  'cam-floodlight-v2': 'white',
  'battery-cam-pro': 'white',
};
