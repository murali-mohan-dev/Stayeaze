import React, { useState } from 'react';
import { Review } from '../../types/index';
import { StarRating } from '../common/StarRating';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { formatDate } from '../../utils/formatters';
import { MessageSquarePlus, User, CheckCircle2 } from 'lucide-react';

interface ReviewSectionProps {
  hotelId: string;
  reviews: Review[];
  ratingScore: number;
  reviewCount: number;
  onReviewAdded: (newReview: Review, updatedScore: number) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  hotelId,
  reviews,
  ratingScore,
  reviewCount,
  onReviewAdded,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to write a review.', 'info');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      showToast('Please provide both review headline and comments.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        hotelId,
        rating,
        title,
        comment,
      });

      if (res.data.success) {
        showToast('Review submitted successfully! Thank you.', 'success');
        onReviewAdded(res.data.review, res.data.newAverageScore);
        setModalOpen(false);
        setTitle('');
        setComment('');
        setRating(5);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-8">
      
      {/* Header and Average Rating Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#0B132B]">
            Guest Reviews & Experiences
          </h3>
          <div className="flex items-center space-x-3 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-[#0B132B] text-[#C5A059] font-serif text-xl font-bold flex items-center justify-center shadow">
              {ratingScore.toFixed(1)}
            </div>
            <div>
              <div className="font-bold text-sm text-[#0B132B]">
                {ratingScore >= 4.8 ? 'Superb' : 'Exceptional'}
              </div>
              <div className="text-xs text-stone-500">Based on {reviewCount} verified guest stays</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              showToast('Please sign in to share your stay experience.', 'info');
              return;
            }
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#C5A059]/40 text-[#0B132B] font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#C5A059]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm">
            No reviews yet. Be the first to share your experience at this property!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={rev.user?.name || 'Guest'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C5A059]/40"
                  />
                  <div>
                    <h5 className="font-serif font-bold text-sm text-[#0B132B]">
                      {rev.user?.name || 'Verified Guest'}
                    </h5>
                    <div className="flex items-center space-x-2 text-[11px] text-stone-400">
                      <span>{formatDate(rev.createdAt)}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Stay
                      </span>
                    </div>
                  </div>
                </div>

                <StarRating rating={rev.rating} size="sm" />
              </div>

              <h6 className="font-bold text-sm text-[#0B132B]">{rev.title}</h6>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Share Your Stay Experience"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Overall Rating
            </label>
            <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center space-x-2">
              <StarRating
                rating={rating}
                interactive={true}
                size="lg"
                onRatingChange={(newVal) => setRating(newVal)}
              />
              <span className="text-xs font-bold text-[#0B132B] ml-2">({rating} Stars)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Review Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Magnificent ocean views and exemplary service"
              className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-medium text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Your Detailed Experience
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other travelers what you enjoyed about the room, dining, facilities, and staff hospitality..."
              className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-stone-200 text-sm font-medium text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] font-bold text-xs transition-all shadow-md"
            >
              {submitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
