'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierModal from '@/components/ui/AtelierModal';

interface PincodeItem {
  id: string;
  pincode: string;
  city: string;
  state: string;
  isServiceable: boolean;
  isCodAvailable: boolean;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  standardFeePaise: number;
  expressAvailable: boolean;
}

export default function AdminPincodesPage() {
  const [pincodes, setPincodes] = useState<PincodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [codAvailable, setCodAvailable] = useState(true);
  const [minDays, setMinDays] = useState('2');
  const [maxDays, setMaxDays] = useState('4');

  const fetchPincodes = useCallback(() => {
    fetch('/api/admin/pincodes')
      .then((res) => res.json())
      .then((data) => {
        if (data.pincodes) setPincodes(data.pincodes);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPincodes();
  }, [fetchPincodes]);

  async function handleAddPincode(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/pincodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pincode,
        city,
        state,
        isServiceable: true,
        isCodAvailable: codAvailable,
        estimatedDaysMin: parseInt(minDays, 10) || 2,
        estimatedDaysMax: parseInt(maxDays, 10) || 4,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      setPincode('');
      setCity('');
      setState('');
      fetchPincodes();
      setFeedback('Pincode serviceability updated');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Dispatch Hubs &amp; Coverage
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Pincode Serviceability</h1>
        </div>

        <AtelierButton variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          Register Serviceable Pincode
        </AtelierButton>
      </div>

      {feedback && (
        <div className="border border-[#E5B869] bg-[#E5B869]/10 p-3 text-xs font-mono text-[#E5B869]">
          {feedback}
        </div>
      )}

      <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Querying serviceability network...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider bg-[#241326]">
                  <th className="py-3 px-4">Pincode</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Estimated Delivery</th>
                  <th className="py-3 px-4">COD Available</th>
                  <th className="py-3 px-4">Service Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C1810]/60">
                {pincodes.map((pin) => (
                  <tr key={pin.id} className="text-[#F5EFE6] hover:bg-[#2C1810]/40 transition-colors">
                    <td className="py-3 px-4 text-[#E5B869] font-bold">{pin.pincode}</td>
                    <td className="py-3 px-4">
                      {pin.city}, {pin.state}
                    </td>
                    <td className="py-3 px-4">
                      {pin.estimatedDaysMin}-{pin.estimatedDaysMax} business days
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] ${pin.isCodAvailable ? 'text-[#A5EDE1]' : 'text-[#FF8F7A]'}`}>
                        {pin.isCodAvailable ? 'COD Enabled' : 'Prepaid Only'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#1E6B62]/20 text-[#A5EDE1] text-[10px] uppercase">
                        Serviceable
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AtelierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Pincode Serviceability"
      >
        <form onSubmit={handleAddPincode} className="space-y-4">
          <AtelierInput
            label="Pincode (6 digits)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="110001"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AtelierInput
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New Delhi"
              required
            />
            <AtelierInput
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Delhi"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AtelierInput
              label="Min Delivery Days"
              value={minDays}
              onChange={(e) => setMinDays(e.target.value)}
              placeholder="2"
            />
            <AtelierInput
              label="Max Delivery Days"
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
              placeholder="4"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="cod-toggle"
              checked={codAvailable}
              onChange={(e) => setCodAvailable(e.target.checked)}
              className="w-4 h-4 bg-[#241326] border border-[#2C1810]"
            />
            <label htmlFor="cod-toggle" className="text-xs font-mono text-[#F5EFE6]">
              Enable Cash on Delivery (COD) for this pincode
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1810]">
            <AtelierButton variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </AtelierButton>
            <AtelierButton variant="primary">
              Register Pincode
            </AtelierButton>
          </div>
        </form>
      </AtelierModal>
    </div>
  );
}
