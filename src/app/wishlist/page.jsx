'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import ProductCard from '@/components/customer/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import Link from 'next/link';

export default function WishlistPage() {
    const router = useRouter();
    const { isAuthenticated } = useSelector(state => state.user || { isAuthenticated: false });
    const { wishlist, wishlistCount, loading, fetchWishlist } = useWishlist();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth?redirect=/wishlist');
            return;
        }

        // Explicitly fetch wishlist when page loads
        console.log('Wishlist page mounted, fetching wishlist...');
        fetchWishlist();
    }, [isAuthenticated, router]);

    // Debug: Log wishlist data
    useEffect(() => {
        console.log('🎨 WISHLIST PAGE - State Update:', {
            wishlistArray: wishlist,
            wishlistIsArray: Array.isArray(wishlist),
            wishlistCount,
            loading,
            itemsLength: wishlist?.length,
            firstItem: wishlist?.[0]
        });

        if (wishlist && Array.isArray(wishlist)) {
            console.log('📋 All wishlist items:', wishlist.map(p => ({
                id: p._id,
                title: p.title,
                price: p.price
            })));
        }
    }, [wishlist, wishlistCount, loading]);

    // Don't render until auth check is complete
    if (!isAuthenticated) {
        console.log('🔒 User not authenticated, redirecting...');
        return null;
    }

    console.log('🎨 RENDERING WISHLIST PAGE');
    console.log('📊 Render state:', {
        loading,
        wishlistLength: wishlist?.length,
        showingProducts: wishlist && wishlist.length > 0
    });

    if (loading && wishlist.length === 0) {
        console.log('⏳ Showing loading spinner...');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5d1e] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-600 hover:text-[#3a5d1e] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-red-500 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                            <p className="text-gray-600 mt-1">
                                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wishlist Grid */}
                {wishlist.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {wishlist.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#3a5d1e] text-[#3a5d1e] rounded-lg font-semibold hover:bg-[#3a5d1e] hover:text-white transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your Wishlist is Empty
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Save your favorite Ayurvedic products here to buy them later or share with friends
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3a5d1e] text-white rounded-lg font-semibold hover:bg-[#2d4818] transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                        </Link>
                    </div>
                )}

                {/* Wishlist Benefits */}
                <div className="mt-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Why use Wishlist?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Heart className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Save for Later</h4>
                                <p className="text-sm text-gray-600">Keep track of products you love</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Easy Checkout</h4>
                                <p className="text-sm text-gray-600">Buy when you're ready</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Price Alerts</h4>
                                <p className="text-sm text-gray-600">Get notified of price drops</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
