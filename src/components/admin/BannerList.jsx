'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

export default function BannerList({ banners }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    title: '',
    subtitle: '',
    link: '',
    order: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile && !editingBanner) {
      alert('Please upload an image');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners';

      const res = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageFile || formData.image
        })
      });

      if (res.ok) {
        alert(`Banner ${editingBanner ? 'updated' : 'created'} successfully`);
        resetForm();
        router.refresh();
      } else {
        alert('Failed to save banner');
      }
    } catch (error) {
      alert('Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      order: banner.order,
      active: banner.active,
      image: banner.image
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Banner deleted successfully');
        router.refresh();
      } else {
        alert('Failed to delete banner');
      }
    } catch (error) {
      alert('Failed to delete banner');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      title: '',
      subtitle: '',
      link: '',
      order: 0,
      active: true
    });
    setImageFile(null);
    setEditingBanner(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Banners</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FiPlus />
          Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-xl mb-4">
            {editingBanner ? 'Edit Banner' : 'Add New Banner'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Banner Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="home">Home Banner</option>
                <option value="bestseller">Bestseller Banner</option>
                <option value="hotselling">Hot Selling Banner</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Subtitle (Optional)</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Link (Optional)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="/products?category=supplements"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Banner Image * (1920x500 recommended)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required={!editingBanner}
              className="mb-2"
            />
            {(imageFile || formData.image?.url) && (
              <div className="relative w-full h-48">
                <img
                  src={imageFile || formData.image.url}
                  alt="Preview"
                  fill
                  
                  className="object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2"
              />
              <span className="font-semibold">Active</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingBanner ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <div className="relative w-64 h-32 flex-shrink-0">
                <img
                  src={banner.image.url}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-cover rounded"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{banner.title || 'Untitled Banner'}</h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-600">{banner.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {banner.type} | Order: {banner.order}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    banner.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {banner.active ? 'Active' : 'Inactive'}
                  </span>
                  {banner.link && (
                    <span className="text-xs text-gray-600">Link: {banner.link}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
