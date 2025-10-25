'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`);
      const data = await res.json();
      
      if (res.ok) {
        setProduct(data.product);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Product updated successfully');
        router.push('/admin/products');
      } else {
        alert(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm 
        product={product} 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
    </div>
  );
}
