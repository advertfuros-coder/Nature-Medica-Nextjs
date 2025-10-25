'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my-orders');
      const data = await res.json();
      
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-blue-100 text-blue-700',
      'Confirmed': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-yellow-100 text-yellow-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
        <Link 
          href="/products"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
                <p className="text-gray-600 text-sm">
                  Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="border-t pt-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 mb-3">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="text-xl font-bold">₹{order.finalPrice}</p>
              </div>
              <Link
                href={`/orders/${order.orderId}`}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
