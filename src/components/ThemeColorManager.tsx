"use client";

import React, { useEffect } from 'react';
import { useSettings } from '@/context/settings-context';

/**
 * THEME DYNAMIC CALIBRATION MODULE
 * 
 * Synchronizes the UI primary color with the registry-defined theme_primary_color.
 * Implements HEX-to-HSL conversion to maintain compatibility with Tailwind opacity modifiers.
 */
export function ThemeColorManager() {
  const { settings } = useSettings();

  useEffect(() => {
    const customHex = settings.theme_primary_color;
    if (!customHex || !/^#([0-9A-F]{3}){1,2}$/i.test(customHex)) {
      return;
    }

    // HEX to HSL Conversion for Tailwind CSS Variable Compatibility
    // Tailwind expects space-separated components: "h s l"
    const components = hexToHSLComponents(customHex);
    document.documentElement.style.setProperty('--primary', components);
    document.documentElement.style.setProperty('--ring', components);
  }, [settings.theme_primary_color]);

  return null;
}

function hexToHSLComponents(hex: string): string {
  // Strip #
  hex = hex.replace(/^#/, '');
  
  // Expand short hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}