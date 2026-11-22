'use client';

import React, { useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';

interface SettingItem {
  id: string;
  settingKey: string;
  settingValue: string;
  description?: string | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  function handleChange(key: string, value: string) {
    setSettings((prev) =>
      prev.map((s) => (s.settingKey === key ? { ...s, settingValue: value } : s))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        settings: settings.map((s) => ({
          key: s.settingKey,
          value: s.settingValue,
        })),
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedback('Site parameters and financial thresholds updated in database');
      } else {
        setFeedback('Failed to update settings');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Global Atelier Configuration
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Store Parameters</h1>
        </div>

        <AtelierButton variant="secondary" size="sm" onClick={fetchSettings}>
          Reload Settings
        </AtelierButton>
      </div>

      {feedback && (
        <div className="border border-[#E5B869] bg-[#E5B869]/10 p-3 text-xs font-mono text-[#E5B869]">
          {feedback}
        </div>
      )}

      <div className="border border-[#2C1810] bg-[#1A0E1C] p-6">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Querying parameters...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {settings.map((s) => (
                <div key={s.settingKey} className="space-y-1">
                  <AtelierInput
                    label={s.settingKey.replace(/_/g, ' ')}
                    value={s.settingValue}
                    onChange={(e) => handleChange(s.settingKey, e.target.value)}
                  />
                  {s.description && (
                    <span className="text-[10px] font-mono text-[#F5EFE6]/40 block pl-1">
                      {s.description}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#2C1810] flex justify-end">
              <AtelierButton variant="primary" size="lg" disabled={saving}>
                {saving ? 'Saving...' : 'Save Parameters'}
              </AtelierButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

