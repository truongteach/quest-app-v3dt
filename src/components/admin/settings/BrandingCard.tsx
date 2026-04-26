
/**
 * BrandingCard.tsx
 * 
 * Purpose: Manages the visual identity settings of the platform, including logo, name, and theme colors.
 * Used by: src/app/admin/settings/page.tsx
 * Props:
 *   - formData: Record<string, string> — current settings state
 *   - setFormData: (data: Record<string, string>) => void — state dispatcher
 *   - t: (key: string) => string — localization function
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Globe, Zap, Palette, AlignLeft, ImageIcon, Megaphone, Mail } from 'lucide-react';

interface BrandingCardProps {
  formData: Record<string, string>;
  setFormData: (data: Record<string, string>) => void;
  t: (key: string) => string;
}

export function BrandingCard({ formData, setFormData, t }: BrandingCardProps) {
  const isValidHex = (hex: string) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b p-8">
        <h2 className="text-xl font-black flex items-center gap-3">
          <Globe className="w-5 h-5 text-primary" aria-hidden="true" /> {t('branding')}
        </h2>
        <CardDescription>Global visual identity and contact registry</CardDescription>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="platform-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('platformName')}</Label>
          <div className="relative">
            <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
            <Input 
              id="platform-name"
              value={formData.platform_name}
              onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
              className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-black text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="theme-color" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('themePrimaryColor')}</Label>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 ring-1 ring-slate-100 shadow-sm transition-all hover:scale-105 active:scale-95 group">
                <input 
                  id="theme-color-picker"
                  type="color"
                  value={isValidHex(formData.theme_primary_color) ? formData.theme_primary_color : '#2563EB'}
                  onChange={(e) => setFormData({ ...formData, theme_primary_color: e.target.value.toUpperCase() })}
                  className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] cursor-pointer bg-transparent border-none appearance-none"
                />
                <div 
                  className="w-full h-full pointer-events-none"
                  style={{ backgroundColor: isValidHex(formData.theme_primary_color) ? formData.theme_primary_color : '#2563EB' }}
                />
              </div>
              <div className="relative flex-1">
                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
                <Input 
                  id="theme-color"
                  value={formData.theme_primary_color}
                  onChange={(e) => setFormData({ ...formData, theme_primary_color: e.target.value })}
                  placeholder="#2563EB"
                  className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footer-text" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('customFooterText')}</Label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
              <Input 
                id="footer-text"
                value={formData.custom_footer_text}
                onChange={(e) => setFormData({ ...formData, custom_footer_text: e.target.value })}
                placeholder="© 2025 Your Legal Text"
                className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-bold text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-url" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('logoUrl')}</Label>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
            <Input 
              id="logo-url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-bold text-sm"
            />
          </div>
          {formData.logo_url && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
              <img src={formData.logo_url} alt="Logo Preview" className="h-12 w-auto object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="announcement" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('announcementBanner')}</Label>
          <div className="relative">
            <Megaphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
            <Input 
              id="announcement"
              value={formData.announcement_banner}
              onChange={(e) => setFormData({ ...formData, announcement_banner: e.target.value })}
              placeholder="Enter broadcast message"
              className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-bold text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="support-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('supportEmail')}</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
            <Input 
              id="support-email"
              type="email"
              value={formData.support_email}
              onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
              placeholder="support@yourplatform.com"
              className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-bold text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
