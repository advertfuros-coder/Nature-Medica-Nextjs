'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUpload, FiX, FiSave, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

export default function ProductEditForm({ product, categories }) {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: product.title || '',
    slug: product.slug || '',
    description: product.description || '',
    price: product.price || 0,
    mrp: product.mrp || 0,
    category: product.category || '',
    stock: product.stock || 0,
    sku: product.sku || '',
    weight: product.weight || 0,
    dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
    tags: product.tags?.join(', ') || '',
    metaTitle: product.seo?.metaTitle || '',
    metaDescription: product.seo?.metaDescription || '',
    metaKeywords: product.seo?.metaKeywords || '',
    visibility: product.visibility ?? true,
    featured: product.featured ?? false,
    ingredients: product.ingredients || '',
    specifications: product.specifications || []
  });

  const [images, setImages] = useState(product.images || []);
  const [newImages, setNewImages] = useState([]);
  const [variants, setVariants] = useState(product.variants || []);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDimensionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: parseFloat(value) || 0 }
    }));
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Specifications
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  // Variants
  const addVariant = () => {
    setVariants(prev => [...prev, { name: '', price: 0, stock: 0, sku: '' }]);
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title || !formData.price || !formData.category) {
    alert('Please fill all required fields');
    return;
  }

  setSaving(true);

  try {
    const formDataToSend = new FormData();

    // Add text fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('mrp', formData.mrp);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('sku', formData.sku);
    formDataToSend.append('weight', formData.weight);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('ingredients', formData.ingredients);
    formDataToSend.append('visibility', formData.visibility);
    formDataToSend.append('featured', formData.featured);

    // Add JSON fields
    formDataToSend.append('dimensions', JSON.stringify(formData.dimensions));
    formDataToSend.append('specifications', JSON.stringify(formData.specifications));
    formDataToSend.append('variants', JSON.stringify(variants));
    formDataToSend.append('seo', JSON.stringify({
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      metaKeywords: formData.metaKeywords
    }));
    formDataToSend.append('existingImages', JSON.stringify(images));

    // Add new image files
    for (const base64Image of newImages) {
      // Convert base64 to blob
      const blob = await fetch(base64Image).then(r => r.blob());
      formDataToSend.append('newImages', blob, `image-${Date.now()}.jpg`);
    }

    const res = await fetch(`/api/admin/products/${product._id}`, {
      method: 'PUT',
      body: formDataToSend // Don't set Content-Type, browser does it automatically
    });

    if (res.ok) {
      alert('Product updated successfully!');
      router.push('/admin/products');
    } else {
      const data = await res.json();
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('Failed to update product');
  } finally {
    setSaving(false);
  }
};


  // Delete product
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Product deleted successfully');
        router.push('/admin/products');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Error deleting product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 font-semibold"
        >
          ← Back to Products
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FiTrash2 />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="e.g., Ashwagandha Capsules 500mg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="ashwagandha-capsules-500mg"
                />
                <p className="text-sm text-gray-500 mt-1">Leave empty to auto-generate from title</p>
              </div>

              <div>
                <label className="block font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="Detailed product description..."
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Ingredients</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="List of ingredients..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Selling Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">MRP (₹)</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>

              {formData.mrp > formData.price && (
                <div className="md:col-span-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 font-semibold">
                      Discount: {Math.round(((formData.mrp - formData.price) / formData.mrp) * 100)}% off
                    </p>
                    <p className="text-sm text-green-600">Save ₹{formData.mrp - formData.price}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Inventory</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="PROD-001"
                />
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Length (cm)</label>
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Width (cm)</label>
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full border-2 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
         {/* Specifications section - Add safety check */}
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Specifications</h2>
    <button
      type="button"
      onClick={addSpecification}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
      <FiPlus /> Add Specification
    </button>
  </div>
  
  <div className="space-y-3">
    {(formData.specifications && Array.isArray(formData.specifications)) ? (
      formData.specifications.map((spec, index) => (
        <div key={index} className="flex gap-3">
          <input
            type="text"
            value={spec.key || ''}
            onChange={(e) => updateSpecification(index, 'key', e.target.value)}
            placeholder="Key (e.g., Serving Size)"
            className="flex-1 border-2 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            value={spec.value || ''}
            onChange={(e) => updateSpecification(index, 'value', e.target.value)}
            placeholder="Value (e.g., 2 capsules)"
            className="flex-1 border-2 rounded-lg px-4 py-2"
          />
          <button
            type="button"
            onClick={() => removeSpecification(index)}
            className="text-red-600 hover:text-red-700"
          >
            <FiX size={24} />
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm">No specifications added yet. Click "Add Specification" to start.</p>
    )}
  </div>
</div>


          {/* Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FiPlus /> Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="border-2 rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-semibold">Variant #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="Variant name (e.g., 60 Capsules)"
                      className="border-2 rounded-lg px-4 py-2"
                    />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                      placeholder="Price"
                      className="border-2 rounded-lg px-4 py-2"
                    />
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                      placeholder="Stock"
                      className="border-2 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      placeholder="SKU (optional)"
                      className="border-2 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="Product title for search engines"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="Brief description for search results"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Meta Keywords</label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleInputChange}
                  className="w-full border-2 rounded-lg px-4 py-2"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Images & Settings */}
        <div className="space-y-6">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Product Images</h2>
            
            {/* Existing Images */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square group">
                  <img
                    src={img.url}
                    alt="Product"
                    fill
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* New Images */}
            {newImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {newImages.map((img, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img src={img} alt="New" className="w-full h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX size={16} />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition">
              <FiUpload className="text-3xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Category *</h2>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full border-2 rounded-lg px-4 py-2"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Tags</h2>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full border-2 rounded-lg px-4 py-2"
              placeholder="organic, ayurvedic, wellness"
            />
            <p className="text-sm text-gray-500 mt-2">Comma-separated tags</p>
          </div>

          {/* Visibility Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Visibility</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="visibility"
                  checked={formData.visibility}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span>Visible on store</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span>Featured product</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
