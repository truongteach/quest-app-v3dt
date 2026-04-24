/**
 * DNTRNG™ SAFE MATH PROTOCOL
 * 
 * Utilities for handling unpredictable registry values (strings, nulls, undefined).
 */

export const safeFixed = (val: any, digits = 2): string => {
  if (val === null || val === undefined) return (0).toFixed(digits);
  const num = parseFloat(val);
  return isNaN(num) ? (0).toFixed(digits) : num.toFixed(digits);
};

export const safePercent = (val: any): number => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
};
