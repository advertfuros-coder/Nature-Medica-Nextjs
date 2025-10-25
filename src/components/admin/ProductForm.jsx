'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiPlus } from 'react-icons/fi';

export default function ProductForm({ product, onSubmit, loading }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    mrp: product?.mrp || '',
    category: product?.category._id || '',
    brand: product?.brand || '',
    stock: product?.stock || '',
    images: product?.images || [],
    variants: product?.variants || [],
    ingredients: product?.ingredients || '',
    specifications: product?.specifications || {},
    visibility: product?.visibility !== undefined ? product.visibility : true
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [newVariant, setNewVariant] = useState({ name: '', value: '', price: '', stock: '' });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFiles(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    if (newVariant.name && newVariant.value) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, newVariant]
      }));
      setNewVariant({ name: '', value: '', price: '', stock: '' });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey]: newSpecValue
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      images: [...formData.images, ...imageFiles]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Product Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Brand *</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={5}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-2">Price (₹) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">MRP (₹) *</label>
          <input
            type="number"
            value={formData.mrp}
            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Stock *</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Product Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mb-3"
        />
        
        <div className="grid grid-cols-4 gap-3">
          {formData.images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image.url}
                alt="Product"
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
          
          {imageFiles.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={file}
                alt="Upload"
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Variants (Optional)</label>
        
        <div className="grid grid-cols-5 gap-2 mb-3">
          <input
            type="text"
            placeholder="Name (e.g., Size)"
            value={newVariant.name}
            onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Value (e.g., 500g)"
            value={newVariant.value}
            onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Price (optional)"
            value={newVariant.price}
            onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Stock (optional)"
            value={newVariant.stock}
            onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addVariant}
            className="bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FiPlus />
          </button>
        </div>

        {formData.variants.length > 0 && (
          <div className="space-y-2">
            {formData.variants.map((variant, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="text-sm">
                  {variant.name}: {variant.value}
                  {variant.price && ` - ₹${variant.price}`}
                  {variant.stock && ` (Stock: ${variant.stock})`}
                </span>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Ingredients (Optional)</label>
        <textarea
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          rows={3}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      {/* Specifications */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Specifications (Optional)</label>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <input
            type="text"
            placeholder="Key (e.g., Weight)"
            value={newSpecKey}
            onChange={(e) => setNewSpecKey(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Value (e.g., 500g)"
            value={newSpecValue}
            onChange={(e) => setNewSpecValue(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addSpecification}
            className="bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FiPlus />
          </button>
        </div>

        {Object.keys(formData.specifications).length > 0 && (
          <div className="space-y-2">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <span className="text-sm">
                  <strong>{key}:</strong> {value}
                </span>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
            className="mr-2"
          />
          <span className="font-semibold">Product Visible to Customers</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
      >
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
