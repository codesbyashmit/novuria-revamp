'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  color?: string | null;
  colorHex?: string | null;
  size?: string | null;
  pricePaise: number;
  compareAtPricePaise?: number | null;
  quantity: number;
  lineTotalPaise: number;
  imageUrl?: string | null;
}

interface CartContextType {
  items: CartItem[];
  subtotalPaise: number;
  totalCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotalPaise, setSubtotalPaise] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setSubtotalPaise(data.subtotalPaise || 0);
        setTotalCount(data.totalItems || 0);
      }
    } catch {}
  };

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setItems(data.items || []);
          setSubtotalPaise(data.subtotalPaise || 0);
          setTotalCount(data.totalItems || 0);
        }
      })
      .catch(() => {});
  }, []);

  const addItem = async (variantId: string, quantity = 1) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (res.ok) {
        await refreshCart();
        setIsOpen(true);
      }
    } catch {}
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch {}
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshCart();
      }
    } catch {}
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotalPaise,
        totalCount,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
