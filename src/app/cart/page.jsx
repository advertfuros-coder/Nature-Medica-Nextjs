import CartClient from '@/components/customer/CartClient';
import BestSellerSectionWrapper from '@/components/customer/BestSellerSectionWrapper';

// Force dynamic rendering as BestSellerSectionWrapper fetches from DB
export const dynamic = 'force-dynamic';

export default function CartPage() {
  return (
    <>
      <CartClient />
      <BestSellerSectionWrapper />
    </>
  );
}
