import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { RoomCategory, Hotel } from '../../types/index';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

interface RoomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: RoomCategory | null;
  hotels: Hotel[];
  onSaved: () => void;
}

export const RoomCategoryModal: React.FC<RoomCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  hotels,
  onSaved,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    hotelId: '',
    name: '',
    description: '',
    basePrice: 5000,
    capacityAdults: 2,
    capacityChildren: 1,
    bedType: 'King Bed',
    sizeSqFt: 450,
    totalRooms: 10,
    amenitiesStr: '',
    imagesStr: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        hotelId: category.hotelId || (hotels[0] ? hotels[0].id : ''),
        name: category.name || '',
        description: category.description || '',
        basePrice: category.basePrice || 5000,
        capacityAdults: category.capacityAdults || 2,
        capacityChildren: category.capacityChildren || 1,
        bedType: category.bedType || 'King Bed',
        sizeSqFt: category.sizeSqFt || 450,
        totalRooms: category.totalRooms || 10,
        amenitiesStr: (category.amenities || []).join(', '),
        imagesStr: (category.images || []).join('\n'),
      });
    } else {
      setFormData({
        hotelId: hotels[0] ? hotels[0].id : '',
        name: '',
        description: '',
        basePrice: 8500,
        capacityAdults: 2,
        capacityChildren: 1,
        bedType: 'California King',
        sizeSqFt: 520,
        totalRooms: 10,
        amenitiesStr: 'Ocean View, Balcony, Bathtub, High-Speed Wi-Fi, Espresso Machine',
        imagesStr: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      });
    }
  }, [category, hotels, isOpen]);

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
        hotelId: formData.hotelId,
        name: formData.name,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        capacityAdults: Number(formData.capacityAdults),
        capacityChildren: Number(formData.capacityChildren),
        bedType: formData.bedType,
        sizeSqFt: Number(formData.sizeSqFt),
        totalRooms: Number(formData.totalRooms),
        images,
        amenities,
      };

      if (category) {
        await api.put(`/admin/room-categories/${category.id}`, payload);
        showToast('Room category updated successfully.', 'success');
      } else {
        await api.post('/admin/room-categories', payload);
        showToast('New room category created with available physical rooms!', 'success');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save room category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Room Category' : 'Add New Room Category'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
            Assign To Hotel *
          </label>
          <select
            required
            value={formData.hotelId}
            onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Deluxe Sea Facing Suite"
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Base Price / Night (₹) *
            </label>
            <input
              type="number"
              required
              min="500"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Total Room Inventory Count
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.totalRooms}
              onChange={(e) => setFormData({ ...formData, totalRooms: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs font-bold text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Bed Type
            </label>
            <input
              type="text"
              value={formData.bedType}
              onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
              placeholder="King Bed, 2 Queen Beds"
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Room Size (Sq Ft)
            </label>
            <input
              type="number"
              value={formData.sizeSqFt}
              onChange={(e) => setFormData({ ...formData, sizeSqFt: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Adults Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacityAdults}
              onChange={(e) => setFormData({ ...formData, capacityAdults: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Children Capacity
            </label>
            <input
              type="number"
              min="0"
              value={formData.capacityChildren}
              onChange={(e) => setFormData({ ...formData, capacityChildren: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-[#0B132B]"
            />
          </div>

          <div className="col-span-2">
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

          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Room Image URLs (one per line)
            </label>
            <textarea
              rows={2}
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
            {submitting ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
