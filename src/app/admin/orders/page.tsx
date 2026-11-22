'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierModal from '@/components/ui/AtelierModal';
import AtelierPrice from '@/components/ui/AtelierPrice';

interface OrderItem {
  id: string;
  titleSnapshot: string;
  skuSnapshot: string;
  colorSnapshot?: string | null;
  sizeSnapshot?: string | null;
  pricePaiseSnapshot: number;
  quantity: number;
  subtotalPaise: number;
}

interface OrderHistory {
  id: string;
  fromStatus?: string | null;
  toStatus: string;
  comment?: string | null;
  createdAt: string;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressJson: Record<string, unknown>;
  subtotalPaise: number;
  discountPaise: number;
  shippingFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
  history: OrderHistory[];
}

const statusOptions = [
  'placed',
  'confirmed',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    });

    if (res.ok) {
      setFeedback(`Order updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      const err = await res.json();
      setFeedback(err.error || 'Failed to update order status');
    }
  }

  function viewOrder(order: OrderRecord) {
    setSelectedOrder(order);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Fulfillment &amp; Garment Dispatches
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Order Acquisitions</h1>
        </div>

        <AtelierButton variant="secondary" size="sm" onClick={fetchOrders}>
          Refresh Orders
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
            Querying acquisitions...
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider bg-[#241326]">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patron</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C1810]/60">
                {orders.map((o) => (
                  <tr key={o.id} className="text-[#F5EFE6] hover:bg-[#2C1810]/40 transition-colors">
                    <td className="py-3 px-4 text-[#E5B869] font-bold">{o.orderNumber}</td>
                    <td className="py-3 px-4 text-[#F5EFE6]/60">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-sans block text-[#F5EFE6]">{o.customerName}</span>
                      <span className="text-[10px] text-[#F5EFE6]/40 block">{o.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <AtelierPrice amountInPaise={o.totalPaise} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] uppercase bg-[#2C1810] text-[#E5B869]">
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-[#241326] border border-[#2C1810] text-xs font-mono text-[#F5EFE6] px-2 py-1 focus:border-[#E5B869] focus:outline-none"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => viewOrder(o)}
                        className="px-3 py-1 border border-[#2C1810] bg-[#241326] hover:border-[#E5B869] text-[#E5B869] text-[10px] uppercase tracking-wider transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <p className="font-serif text-lg text-[#F5EFE6]">No Patron Orders Yet</p>
            <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
              Completed patron checkout acquisitions and payment authorizations will appear here with full lifecycle state controls.
            </p>
          </div>
        )}
      </div>

      <AtelierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : 'Order Detail'}
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs font-mono">
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#241326] border border-[#2C1810]">
              <div>
                <span className="text-[#F5EFE6]/40 uppercase tracking-widest block text-[10px]">Patron</span>
                <span className="text-sm font-sans font-medium text-[#F5EFE6]">{selectedOrder.customerName}</span>
                <span className="text-[#F5EFE6]/60 block">{selectedOrder.customerEmail}</span>
                <span className="text-[#F5EFE6]/60 block">{selectedOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-[#F5EFE6]/40 uppercase tracking-widest block text-[10px]">Financial Summary</span>
                <span className="text-base font-mono font-bold text-[#E5B869]">
                  <AtelierPrice amountInPaise={selectedOrder.totalPaise} />
                </span>
                <span className="text-[#F5EFE6]/60 block text-[10px] mt-1">
                  Payment: {selectedOrder.paymentStatus.toUpperCase()} ({selectedOrder.paymentMethod})
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5B869] font-mono block mb-2">
                Garments Inscribed in Order
              </span>
              <div className="border border-[#2C1810] divide-y divide-[#2C1810]">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-sans font-medium text-[#F5EFE6] block">{item.titleSnapshot}</span>
                      <span className="text-[10px] text-[#F5EFE6]/60">
                        {item.skuSnapshot} &bull; {item.colorSnapshot || 'Standard'} &bull; Size {item.sizeSnapshot || 'M'} &bull; Qty {item.quantity}
                      </span>
                    </div>
                    <AtelierPrice amountInPaise={item.subtotalPaise} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5B869] font-mono block mb-2">
                Order Lifecycle Timeline
              </span>
              <div className="space-y-2 border-l border-[#2C1810] pl-4">
                {selectedOrder.history?.map((h) => (
                  <div key={h.id} className="text-[11px]">
                    <span className="text-[#E5B869] font-semibold uppercase">{h.toStatus}</span>
                    <span className="text-[#F5EFE6]/40 text-[10px] ml-2">
                      {new Date(h.createdAt).toLocaleString()}
                    </span>
                    {h.comment && <p className="text-[#F5EFE6]/80 text-[10px] mt-0.5">{h.comment}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#2C1810]">
              <AtelierButton variant="secondary" onClick={() => setModalOpen(false)}>
                Close
              </AtelierButton>
            </div>
          </div>
        )}
      </AtelierModal>
    </div>
  );
}
