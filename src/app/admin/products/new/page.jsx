'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Product created successfully');
        router.push('/admin/products');
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
