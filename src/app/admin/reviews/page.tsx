'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';

interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  title?: string | null;
  comment: string;
  fitMeter?: string | null;
  isVerifiedPurchase: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  photos: { id: string; imageUrl: string }[];
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchReviews = useCallback(() => {
    fetch('/api/admin/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleModerate(reviewId: string, status: 'approved' | 'rejected') {
    const res = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, status }),
    });

    if (res.ok) {
      setFeedback(`Review marked as ${status}`);
      fetchReviews();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Realised In The World Testimonials
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Review Moderation</h1>
        </div>

        <AtelierButton variant="secondary" size="sm" onClick={fetchReviews}>
          Refresh Queue
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
            Querying moderation queue...
          </div>
        ) : reviews.length > 0 ? (
          <div className="divide-y divide-[#2C1810]">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 space-y-3 hover:bg-[#2C1810]/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-[#E5B869]">
                      {r.rating}/5
                    </span>
                    <span className="font-sans font-medium text-sm text-[#F5EFE6]">
                      {r.productName}
                    </span>
                    {r.isVerifiedPurchase && (
                      <span className="px-2 py-0.5 bg-[#1E6B62]/20 text-[#A5EDE1] text-[10px] font-mono uppercase">
                        Verified Patron
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                      r.moderationStatus === 'approved'
                        ? 'bg-[#1E6B62]/20 text-[#A5EDE1]'
                        : r.moderationStatus === 'rejected'
                        ? 'bg-[#D8371F]/20 text-[#FF8F7A]'
                        : 'bg-[#E5B869]/20 text-[#E5B869]'
                    }`}
                  >
                    {r.moderationStatus}
                  </span>
                </div>

                {r.title && <h3 className="font-serif text-base text-[#F5EFE6]">{r.title}</h3>}
                <p className="text-xs font-sans text-[#F5EFE6]/80 leading-relaxed">{r.comment}</p>

                {r.fitMeter && (
                  <span className="text-[10px] font-mono text-[#F5EFE6]/50 block">
                    Fit assessment: {r.fitMeter}
                  </span>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-[#F5EFE6]/40">
                    Submitted {new Date(r.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    {r.moderationStatus !== 'approved' && (
                      <button
                        onClick={() => handleModerate(r.id, 'approved')}
                        className="px-3 py-1 bg-[#1E6B62] text-white hover:bg-[#1E6B62]/80 text-[10px] font-mono uppercase tracking-wider"
                      >
                        Approve
                      </button>
                    )}
                    {r.moderationStatus !== 'rejected' && (
                      <button
                        onClick={() => handleModerate(r.id, 'rejected')}
                        className="px-3 py-1 border border-[#D8371F] text-[#D8371F] hover:bg-[#D8371F]/10 text-[10px] font-mono uppercase tracking-wider"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <p className="font-serif text-lg text-[#F5EFE6]">Queue Is Clear</p>
            <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
              Submitted customer testimonials and garment fit reviews will appear here for publication approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
