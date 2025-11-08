'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  Scale, 
  ShoppingCart, 
  CreditCard, 
  Truck,
  RotateCcw,
  Shield,
  UserX,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Mail
} from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState(null);

  const lastUpdated = 'November 9, 2025';

  const sections = [
    {
      id: 'acceptance',
      icon: Scale,
      title: 'Acceptance of Terms',
      content: `
        <p class="mb-4">By accessing and using Nature Medica's website and services, you accept and agree to be bound by these Terms and Conditions.</p>
        
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>These terms apply to all visitors, users, and customers</li>
          <li>If you do not agree with any part of these terms, you must not use our services</li>
          <li>We reserve the right to update these terms at any time</li>
          <li>Continued use after changes constitutes acceptance of new terms</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Age Requirement:</h4>
        <p class="mb-2">You must be at least 18 years old to use our services. By using our website, you confirm that you meet this age requirement.</p>
      `
    },
    {
      id: 'products',
      icon: ShoppingCart,
      title: 'Products & Services',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Product Information:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>We strive to display accurate product information, including descriptions, images, and prices</li>
          <li>Product colors may vary slightly from images due to screen settings</li>
          <li>We reserve the right to correct any errors in product information</li>
          <li>Products are subject to availability</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Product Use:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>All products are for personal use only</li>
          <li>Follow product instructions and usage guidelines carefully</li>
          <li>Consult a healthcare professional before use if you have medical conditions</li>
          <li>Keep products out of reach of children</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Pricing:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes</li>
          <li>Prices are subject to change without notice</li>
          <li>The price at the time of order placement applies</li>
          <li>We reserve the right to limit quantities purchased</li>
        </ul>
      `
    },
    {
      id: 'ordering',
      icon: ShoppingCart,
      title: 'Ordering & Payment',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Order Process:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Add products to your cart and proceed to checkout</li>
          <li>Provide accurate shipping and billing information</li>
          <li>Review your order before confirming payment</li>
          <li>You will receive an order confirmation email</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Order Acceptance:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Order confirmation does not constitute order acceptance</li>
          <li>We reserve the right to refuse or cancel any order</li>
          <li>Orders may be cancelled for reasons including product unavailability, pricing errors, or fraud suspicion</li>
          <li>You will be notified if your order is cancelled</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Payment Methods:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Credit/Debit Cards, UPI, Net Banking, Wallets</li>
          <li>Cash on Delivery (COD) available for eligible orders</li>
          <li>All payments are processed securely through Razorpay</li>
          <li>Payment must be received before order processing</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">COD Orders:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>COD charges may apply</li>
          <li>Maximum order value limits may apply</li>
          <li>Payment in exact amount preferred</li>
          <li>Refuse to accept if packaging is damaged</li>
        </ul>
      `
    },
    {
      id: 'shipping',
      icon: Truck,
      title: 'Shipping & Delivery',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Delivery Timeline:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Standard delivery: 3-7 business days</li>
          <li>Express delivery: 1-3 business days (where available)</li>
          <li>Timelines are estimates and not guaranteed</li>
          <li>Delivery times may vary based on location and courier availability</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Shipping Charges:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Free shipping on orders above ₹499</li>
          <li>Standard shipping charges apply for orders below ₹499</li>
          <li>Remote area delivery may incur additional charges</li>
          <li>Shipping costs are non-refundable</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Delivery Requirements:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Ensure someone is available to receive the order</li>
          <li>Valid address and contact details are required</li>
          <li>ID proof may be required for delivery</li>
          <li>Sign the delivery receipt upon receiving</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Tracking:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>Tracking details sent via email/SMS once shipped</li>
          <li>Track your order in the "My Orders" section</li>
          <li>Contact us if tracking shows no movement for 3+ days</li>
        </ul>
      `
    },
    {
      id: 'returns',
      icon: RotateCcw,
      title: 'Returns & Refunds',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Return Policy:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>7-day return policy from date of delivery</li>
          <li>Products must be unused and in original packaging</li>
          <li>Return shipping costs may apply (except for defective/wrong items)</li>
          <li>Some products may not be eligible for return (dietary supplements opened/used)</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Return Process:</h4>
        <ol class="list-decimal pl-6 mb-4 space-y-2">
          <li>Contact customer support to initiate a return</li>
          <li>Provide order details and reason for return</li>
          <li>Receive return authorization and shipping instructions</li>
          <li>Pack the item securely with original invoice</li>
          <li>Ship to provided return address</li>
        </ol>

        <h4 class="font-semibold text-gray-900 mb-2">Refund Policy:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Refunds processed within 7-10 business days of receiving returned item</li>
          <li>Refund to original payment method</li>
          <li>Shipping charges are non-refundable (except for wrong/defective items)</li>
          <li>Partial refunds may apply if item is not in original condition</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Exchanges:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>Exchanges subject to product availability</li>
          <li>Same process as returns</li>
          <li>No exchange for sale/discounted items</li>
        </ul>
      `
    },
    {
      id: 'account',
      icon: Shield,
      title: 'User Account',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Account Registration:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Provide accurate and complete registration information</li>
          <li>Keep your account credentials secure</li>
          <li>You are responsible for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Account Responsibilities:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Maintain accurate contact and shipping information</li>
          <li>Use strong passwords and change them regularly</li>
          <li>Do not share your account with others</li>
          <li>Report suspicious activity immediately</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Account Termination:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          <li>You may close your account at any time by contacting us</li>
          <li>Pending orders must be completed or cancelled before account closure</li>
          <li>We may retain certain information as required by law</li>
        </ul>
      `
    },
    {
      id: 'prohibited',
      icon: UserX,
      title: 'Prohibited Activities',
      content: `
        <p class="mb-4">The following activities are strictly prohibited:</p>
        
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Providing false or misleading information</li>
          <li>Impersonating another person or entity</li>
          <li>Using automated systems (bots) to access our services</li>
          <li>Attempting to hack, disrupt, or compromise our website</li>
          <li>Violating any applicable laws or regulations</li>
          <li>Reselling products for commercial purposes without authorization</li>
          <li>Posting false reviews or ratings</li>
          <li>Harassing or abusing our staff or other customers</li>
          <li>Using our services for fraudulent purposes</li>
          <li>Bulk ordering to create artificial scarcity</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Consequences:</h4>
        <p class="mb-2">Violation of these terms may result in:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Immediate account suspension or termination</li>
          <li>Cancellation of pending orders without refund</li>
          <li>Legal action if applicable</li>
          <li>Reporting to law enforcement authorities</li>
        </ul>
      `
    },
    {
      id: 'intellectual',
      icon: Shield,
      title: 'Intellectual Property',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Our Content:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>All content on our website is owned by or licensed to Nature Medica</li>
          <li>This includes text, images, logos, graphics, and software</li>
          <li>Protected by copyright, trademark, and other intellectual property laws</li>
          <li>You may not copy, reproduce, or distribute our content without permission</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Trademarks:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>"Nature Medica" name and logo are our registered trademarks</li>
          <li>Product names and brands belong to their respective owners</li>
          <li>Unauthorized use of our trademarks is prohibited</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">User Content:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>You retain ownership of content you submit (reviews, feedback)</li>
          <li>By submitting, you grant us a license to use, display, and distribute it</li>
          <li>You represent that your content does not violate any third-party rights</li>
          <li>We may remove any content that violates these terms</li>
        </ul>
      `
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Disclaimer:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Products are provided "as is" without warranties of any kind</li>
          <li>We do not guarantee specific health outcomes</li>
          <li>Always consult healthcare professionals before starting supplements</li>
          <li>Individual results may vary</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Product Liability:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>We are not liable for adverse reactions to products when used as directed</li>
          <li>Read product labels and follow usage instructions</li>
          <li>Inform us immediately of any adverse reactions</li>
          <li>Manufacturer liability applies for defective products</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Service Interruptions:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>We do not guarantee uninterrupted access to our services</li>
          <li>Not liable for delays or failures due to circumstances beyond our control</li>
          <li>This includes natural disasters, strikes, technical issues, etc.</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Maximum Liability:</h4>
        <p class="mb-2">Our total liability to you for any claim shall not exceed the amount you paid for the product or service in question.</p>
      `
    },
    {
      id: 'disputes',
      icon: Scale,
      title: 'Dispute Resolution',
      content: `
        <h4 class="font-semibold text-gray-900 mb-2">Informal Resolution:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Contact our customer support first to resolve any issues</li>
          <li>We will work in good faith to resolve disputes amicably</li>
          <li>Most issues can be resolved through direct communication</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Governing Law:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>These terms are governed by the laws of India</li>
          <li>Courts in Lucknow, Uttar Pradesh have exclusive jurisdiction</li>
          <li>Any legal proceedings must be conducted in English or Hindi</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Arbitration:</h4>
        <ul class="list-disc pl-6 space-y-2">
          <li>If informal resolution fails, disputes may go to arbitration</li>
          <li>Arbitration shall be conducted under Indian Arbitration Act</li>
          <li>Location of arbitration: Lucknow, Uttar Pradesh</li>
          <li>Decision of arbitrator is final and binding</li>
        </ul>
      `
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Information',
      content: `
        <p class="mb-4">For questions or concerns regarding these Terms and Conditions, please contact us:</p>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3">Nature Medica</h4>
          
          <div class="space-y-2 text-sm">
            <div class="flex items-start gap-2">
              <span class="font-medium text-gray-700 min-w-[80px]">Email:</span>
              <a href="mailto:naturemedica09@gmail.com" class="text-[#3a5d1e] underline">naturemedica09@gmail.com</a>
            </div>
            
            <div class="flex items-start gap-2">
              <span class="font-medium text-gray-700 min-w-[80px]">Phone:</span>
              <a href="tel:+917007016231" class="text-[#3a5d1e] underline">+91 7007016231</a>
            </div>
            
            <div class="flex items-start gap-2">
              <span class="font-medium text-gray-700 min-w-[80px]">Address:</span>
              <span class="text-gray-600">Lucknow, Uttar Pradesh 226022, India</span>
            </div>
            
            <div class="flex items-start gap-2">
              <span class="font-medium text-gray-700 min-w-[80px]">Hours:</span>
              <span class="text-gray-600">Monday - Saturday: 9 AM - 6 PM IST</span>
            </div>
          </div>
        </div>
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Terms & Conditions</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Terms & Conditions</h2>
          <p className="text-sm opacity-90 mb-2">
            Please read these terms carefully before using our services
          </p>
          <p className="text-xs opacity-75">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Important Notice</h3>
              <p className="text-sm text-gray-700">
                By using Nature Medica's website and services, you agree to these terms. If you do not agree, please discontinue use immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="p-4 space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} id={section.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3a5d1e]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#3a5d1e]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div 
                    className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Agreement CTA */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white text-center">
          <Scale className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-bold text-lg mb-2">Questions About Terms?</h3>
          <p className="text-sm opacity-90 mb-4">
            Our customer support team is ready to help clarify any doubts
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="w-full bg-white text-[#3a5d1e] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
