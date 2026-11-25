import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Hotel } from '../../types/index';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel | null;
  onSaved: () => void;
}

export const HotelModal: React.FC<HotelModalProps> = ({ isOpen, onClose, hotel, onSaved }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    address: '',
    city: '',
    state: '',
    starRating: 5,
    startingPrice: 5000,
    featured: false,
    contactEmail: '',
    contactPhone: '',
    imagesStr: '',
    amenitiesStr: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || '',
        tagline: hotel.tagline || '',
        description: hotel.description || '',
        address: hotel.address || '',
        city: hotel.city || '',
        state: hotel.state || '',
        starRating: hotel.starRating || 5,
        startingPrice: hotel.startingPrice || 5000,
        featured: hotel.featured || false,
        contactEmail: hotel.contactEmail || '',
        contactPhone: hotel.contactPhone || '',
        imagesStr: (hotel.images || []).join('\n'),
        amenitiesStr: (hotel.amenities || []).join(', '),
      });
    } else {
      setFormData({
        name: '',
        tagline: '',
        description: '',
        address: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        starRating: 5,
        startingPrice: 6500,
        featured: true,
        contactEmail: 'stay@luxuryhotel.com',
        contactPhone: '+91 98765 00000',
        imagesStr: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        amenitiesStr: 'Infinity Pool, Ayurvedic Spa, Fine Dining, Free Wi-Fi, Valet Parking, Butler Service',
      });
    }
  }, [hotel, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const images = formData.imagesStr
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const amenities = formData.amenitiesStr
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        starRating: Number(formData.starRating),
        startingPrice: Number(formData.startingPrice),
        featured: Boolean(formData.featured),
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        images,
        amenities,
      };

      if (hotel) {
        await api.put(`/admin/hotels/${hotel.id}`, payload);
        showToast('Hotel details updated successfully.', 'success');
      } else {
        await api.post('/admin/hotels', payload);
        showToast('New luxury hotel property created!', 'success');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save hotel.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hotel ? 'Edit Hotel Sanctuary' : 'Register New Hotel Property'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Hotel Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Timeless Royal Elegance & Serenity"
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              State *
            </label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Star Rating (1 - 5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.starRating}
              onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Starting Price / Night (₹)
            </label>
            <input
              type="number"
              min="1000"
              value={formData.startingPrice}
              onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center space-x-2 text-xs font-bold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-stone-300 accent-[#C5A059]"
              />
              <span>Mark as Featured Sanctuary (Displayed on Homepage)</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              value={formData.amenitiesStr}
              onChange={(e) => setFormData({ ...formData, amenitiesStr: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Image URLs (one URL per line)
            </label>
            <textarea
              rows={3}
              value={formData.imagesStr}
              onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-mono text-[#0B132B]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-xl bg-[#0B132B] hover:bg-[#C5A059] text-white hover:text-[#0B132B] text-xs font-bold transition-all shadow"
          >
            {submitting ? 'Saving...' : 'Save Hotel'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
