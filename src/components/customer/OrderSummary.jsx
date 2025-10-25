import Image from 'next/image';

export default function OrderSummary({ 
  items, 
  totalPrice, 
  discount, 
  couponCode, 
  onPlaceOrder, 
  loading,
  disabled 
}) {
  const finalPrice = totalPrice - discount;

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 pb-3 border-b">
            <img
              src={item.product.images[0]?.url || '/placeholder.png'}
              alt={item.product.title}
              width={60}
              height={60}
              className="rounded object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.product.title}</p>
              {item.variant && (
                <p className="text-xs text-gray-600">{item.variant}</p>
              )}
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{totalPrice}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({couponCode})</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>FREE</span>
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={disabled || loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
