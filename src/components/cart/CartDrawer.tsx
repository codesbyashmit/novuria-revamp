'use client';

import React from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalCount } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 15000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-stone-900 text-stone-100 shadow-2xl flex flex-col border-l border-stone-800">
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              <h2 className="text-sm font-semibold tracking-widest uppercase">
                Shopping Bag ({totalCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="bg-stone-950 px-6 py-3 border-b border-stone-800 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-emerald-400 font-medium">
                You have unlocked complimentary express shipping.
              </p>
            ) : (
              <p className="text-stone-400">
                Add{' '}
                <span className="text-amber-400 font-semibold">
                  INR {(freeShippingThreshold - subtotal).toLocaleString('en-IN')}
                </span>{' '}
                more for complimentary express shipping.
              </p>
            )}
            <div className="mt-2 h-1 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="h-10 w-10 text-stone-600 mx-auto" />
                <p className="text-stone-400 text-sm">Your shopping bag is currently empty.</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 text-xs uppercase tracking-wider text-amber-500 hover:underline"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b border-stone-800/60 pb-4 items-start"
                >
                  <div className="relative h-20 w-16 bg-stone-950 flex-shrink-0 overflow-hidden border border-stone-800">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="h-full w-full bg-stone-800" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-stone-100 truncate">{item.name}</h3>
                    {item.color && (
                      <p className="text-[11px] text-stone-400 mt-0.5">{item.color}</p>
                    )}
                    <p className="text-xs font-semibold text-amber-400 mt-1">
                      INR {item.price.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-stone-700 bg-stone-950 text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 font-mono text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-stone-800 text-stone-400 hover:text-stone-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] text-stone-500 hover:text-red-400 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-stone-800 bg-stone-950 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="font-semibold text-stone-100">
                  INR {subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                Applicable taxes and customs calculated at secure checkout.
              </p>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold py-3 text-xs uppercase tracking-widest transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

