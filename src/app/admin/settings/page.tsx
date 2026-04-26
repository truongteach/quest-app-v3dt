
/**
 * src/app/admin/settings/page.tsx
 * 
 * Route: /admin/settings
 * Purpose: Centralized platform calibration terminal for branding, security, and assessment logic.
 * Key components: BrandingCard, SecurityCard, AssessmentCard, IntegrationsCard.
 * Data fetching: Fetches and commits settings to Google Sheets registry via Registry Bridge.
 * Auth: Admin only.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/settings-context';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api-config';
import { Save, Loader2, Bell, AlertCircle, Database, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/context/language-context';
import { AILoader } from '@/components/ui/ai-loader';
import { logActivity } from '@/lib/activity-log';
import { trackEvent } from '@/lib/tracker';

// Sub-component extraction per Protocol v18.9
import { BrandingCard } from '@/components/admin/settings/BrandingCard';
import { SecurityCard } from '@/components/admin/settings/SecurityCard';
import { AssessmentCard } from '@/components/admin/settings/AssessmentCard';

export default function AdminSettingsPage() {
  const { settings, loading: settingsLoading, refreshSettings } = useSettings();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    platform_name: '',
    logo_url: '',
    support_email: '',
    announcement_banner: '',
    custom_footer_text: '',
    theme_primary_color: '#2563EB',
    daily_key_salt: '',
    access_key_protection_enabled: 'true',
    default_pass_threshold: '70',
    global_timer_limit: '15',
    enable_benchmarking: 'true',
    maintenance_mode: 'false',
    allowed_email_domains: '',
    session_timeout_hours: '24',
    guest_access_allowed: 'true',
    google_sheet_url: ''
  });

  useEffect(() => {
    if (!settingsLoading && settings) {
      setFormData({
        platform_name: String(settings.platform_name || 'DNTRNG'),
        logo_url: settings.logo_url || '',
        support_email: settings.support_email || '',
        announcement_banner: settings.announcement_banner || '',
        custom_footer_text: settings.custom_footer_text || '',
        theme_primary_color: settings.theme_primary_color || '#2563EB',
        daily_key_salt: settings.daily_key_salt || '',
        access_key_protection_enabled: String(settings.access_key_protection_enabled ?? 'true'),
        default_pass_threshold: settings.default_pass_threshold || '70',
        global_timer_limit: settings.global_timer_limit || '15',
        enable_benchmarking: String(settings.enable_benchmarking ?? 'true'),
        maintenance_mode: String(settings.maintenance_mode ?? 'false'),
        allowed_email_domains: settings.allowed_email_domains || '',
        session_timeout_hours: settings.session_timeout_hours || '24',
        guest_access_allowed: String(settings.guest_access_allowed ?? 'true'),
        google_sheet_url: settings.google_sheet_url || ''
      });
    }
  }, [settings, settingsLoading]);

  // Logic: Change-Aware Guard Protocol
  const hasChanges = Object.keys(formData).some(
    (key) => formData[key] !== String(settings[key] ?? (key === 'theme_primary_color' ? '#2563EB' : (key === 'access_key_protection_enabled' || key === 'enable_benchmarking' || key === 'guest_access_allowed' ? 'true' : (key === 'maintenance_mode' ? 'false' : ''))))
  );

  const handlePost = async (action: string, payload: any) => {
    if (!API_URL) return false;
    try {
      // GAS: saveSetting
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action, ...payload })
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSaveAll = async () => {
    const changedKeys = Object.keys(formData).filter(key => {
      const current = String(settings[key] ?? "");
      return formData[key] !== current;
    });

    if (changedKeys.length === 0) return;

    setSaving(true);
    try {
      await Promise.all(changedKeys.map(key => handlePost('saveSetting', { key, value: formData[key] })));
      
      toast({ title: "Registry Updated", description: `${changedKeys.length} preference(s) synchronized.` });
      logActivity("System settings updated", `${changedKeys.length} preference(s) calibrated`);
      
      trackEvent('admin_settings_save', { details: { changed_fields: changedKeys, platform_name: formData.platform_name } });
      if (changedKeys.includes('daily_key_salt')) trackEvent('admin_access_key_change');
      
      await refreshSettings();
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Error" });
    } finally {
      setSaving(false);
    }
  };

  if (settingsLoading) return <div className="py-40"><AILoader /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('siteSettings')}</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">{t('platformConfig')}</p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={saving || !hasChanges}
          className="h-14 px-8 rounded-full bg-primary font-black uppercase text-xs tracking-widest shadow-xl"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {t('saveAllSettings')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <BrandingCard formData={formData} setFormData={setFormData} t={t} />
          
          <Card id="sheet-url-field" className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border dark:border-slate-800">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b p-8">
              <h2 className="text-xl font-black flex items-center gap-3"><Database className="w-5 h-5 text-primary" /> {t('integrations')}</h2>
              <CardDescription>Connect external data nodes</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="google-sheet-url" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('googleSheetUrl')}</Label>
                <div className="relative">
                  <FileSpreadsheet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    id="google-sheet-url"
                    value={formData.google_sheet_url}
                    onChange={(e) => setFormData({ ...formData, google_sheet_url: e.target.value })}
                    className="h-12 pl-11 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 font-bold text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <SecurityCard formData={formData} setFormData={setFormData} t={t} />
        </div>

        <div className="lg:col-span-5 space-y-8">
          <AssessmentCard formData={formData} setFormData={setFormData} t={t} />

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Bell className="w-24 h-24" /></div>
            <div className="relative z-10 space-y-4">
              <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">System Integrity</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Changes applied here will affect all student nodes globally upon their next session initialization. 
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
