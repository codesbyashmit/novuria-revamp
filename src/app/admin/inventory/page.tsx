'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierModal from '@/components/ui/AtelierModal';

interface InventoryItem {
  inventoryId: string;
  variantId: string;
  sku: string;
  color: string;
  size: string;
  pricePaise: number;
  productId: string;
  productName: string;
  productSlug: string;
  quantityOnHand: number;
  reservedQuantity: number;
  reorderThreshold: number;
  updatedAt: string;
}

interface AuditLog {
  id: string;
  variantId: string;
  changeQuantity: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('Restock received from workshop');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchInventory = useCallback(() => {
    fetch('/api/admin/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setItems(data.items);
        if (data.logs) setLogs(data.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  function openAdjustModal(item: InventoryItem) {
    setSelectedVariant(item);
    setAdjustQty('0');
    setAdjustReason('Restock received from workshop');
    setAdjustModalOpen(true);
  }

  async function handleAdjustSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVariant) return;

    const change = parseInt(adjustQty, 10);
    if (isNaN(change) || change === 0) {
      setFeedback('Provide a non-zero quantity change');
      return;
    }

    const res = await fetch('/api/admin/inventory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId: selectedVariant.variantId,
        quantityChange: change,
        reason: adjustReason,
      }),
    });

    if (res.ok) {
      setAdjustModalOpen(false);
      fetchInventory();
      setFeedback(`Adjusted stock by ${change > 0 ? `+${change}` : change}`);
    } else {
      const err = await res.json();
      setFeedback(err.error || 'Adjustment failed');
    }
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setFeedback(null);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/inventory/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(`Updated ${data.count} inventory items via CSV`);
        fetchInventory();
      } else {
        setFeedback(data.error || 'CSV import failed');
      }
    } catch {
      setFeedback('Error parsing CSV file');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Vault Balances &amp; Audit Logs
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Inventory Management</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer">
            <span className="inline-block px-4 py-2 border border-[#2C1810] bg-[#1A0E1C] hover:border-[#E5B869] text-xs font-mono uppercase tracking-widest text-[#F5EFE6] transition-colors">
              {importing ? 'Importing CSV...' : 'Import CSV'}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              disabled={importing}
            />
          </label>

          <a href="/api/admin/inventory/csv" download>
            <AtelierButton variant="secondary" size="sm">Export CSV</AtelierButton>
          </a>
        </div>
      </div>

      {feedback && (
        <div className="border border-[#E5B869] bg-[#E5B869]/10 p-3 text-xs font-mono text-[#E5B869]">
          {feedback}
        </div>
      )}

      <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
        <div className="p-4 border-b border-[#2C1810] bg-[#241326] flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E5B869]">
            Stock Balances by Specimen SKU
          </span>
          <span className="text-xs font-mono text-[#F5EFE6]/60">
            {items.length} Tracked SKUs
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Querying vault balances...
          </div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider">
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Color / Size</th>
                  <th className="py-3 px-4">On Hand</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C1810]/60">
                {items.map((item) => {
                  const available = Math.max(0, item.quantityOnHand - item.reservedQuantity);
                  return (
                    <tr key={item.variantId} className="text-[#F5EFE6] hover:bg-[#2C1810]/40 transition-colors">
                      <td className="py-3 px-4 text-[#E5B869]">{item.sku}</td>
                      <td className="py-3 px-4 font-sans font-medium">{item.productName}</td>
                      <td className="py-3 px-4 text-[#F5EFE6]/60">
                        {item.color} / {item.size}
                      </td>
                      <td className="py-3 px-4 font-semibold">{item.quantityOnHand}</td>
                      <td className="py-3 px-4 text-[#F5EFE6]/40">{item.reservedQuantity}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] ${
                            available > 0
                              ? 'bg-[#1E6B62]/20 text-[#A5EDE1]'
                              : 'bg-[#D8371F]/20 text-[#FF8F7A]'
                          }`}
                        >
                          {available} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openAdjustModal(item)}
                          className="px-3 py-1 border border-[#2C1810] bg-[#241326] hover:border-[#E5B869] text-[#E5B869] text-[10px] uppercase tracking-wider transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <p className="font-serif text-lg text-[#F5EFE6]">No Variants In Vault</p>
            <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
              Add products with variants in the Catalogue section or import via CSV to track stock balances.
            </p>
          </div>
        )}
      </div>

      <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
        <div className="p-4 border-b border-[#2C1810] bg-[#241326]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E5B869]">
            Recent Stock Movement Audit Trail
          </span>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Delta</th>
                  <th className="py-2.5 px-4">Balance After</th>
                  <th className="py-2.5 px-4">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C1810]/60">
                {logs.map((log) => (
                  <tr key={log.id} className="text-[#F5EFE6]">
                    <td className="py-2.5 px-4 text-[#F5EFE6]/60">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={log.changeQuantity >= 0 ? 'text-[#1E6B62]' : 'text-[#D8371F]'}>
                        {log.changeQuantity >= 0 ? `+${log.changeQuantity}` : log.changeQuantity}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">{log.balanceAfter}</td>
                    <td className="py-2.5 px-4">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Audit log empty. Stock movements will be logged automatically.
          </div>
        )}
      </div>

      <AtelierModal
        isOpen={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        title="Adjust Variant Stock Balance"
      >
        {selectedVariant && (
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="p-3 bg-[#241326] border border-[#2C1810] text-xs font-mono space-y-1">
              <span className="text-[#E5B869] block font-semibold">{selectedVariant.sku}</span>
              <span className="text-[#F5EFE6] block">{selectedVariant.productName} ({selectedVariant.color} / {selectedVariant.size})</span>
              <span className="text-[#F5EFE6]/60 block">Current on hand: {selectedVariant.quantityOnHand} units</span>
            </div>

            <AtelierInput
              label="Quantity Delta (positive to add, negative to subtract)"
              value={adjustQty}
              onChange={(e) => setAdjustQty(e.target.value)}
              placeholder="e.g. 20 or -5"
              required
            />

            <AtelierInput
              label="Audit Reason"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="Workshop delivery / audit recount / defect removal"
              required
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1810]">
              <AtelierButton variant="secondary" onClick={() => setAdjustModalOpen(false)}>
                Cancel
              </AtelierButton>
              <AtelierButton variant="primary">
                Confirm Stock Adjustment
              </AtelierButton>
            </div>
          </form>
        )}
      </AtelierModal>
    </div>
  );
}
