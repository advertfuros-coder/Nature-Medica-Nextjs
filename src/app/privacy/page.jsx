'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  Mail,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState(null);

  const lastUpdated = 'November 9, 2025';

  const sections = [
    {
      id: 'information-collection',
      icon: Database,
      title: 'Information We Collect',
      content: `
        <p class="mb-4">We collect several types of information to provide and improve our services:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Personal Information:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Name, email address, and phone number</li>
          <li>Billing and shipping addresses</li>
          <li>Payment information (processed securely by payment gateways)</li>
          <li>Order history and preferences</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Automatically Collected Information:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on our site</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Information You Provide:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>Product reviews and ratings</li>
          <li>Customer service communications</li>
          <li>Newsletter subscription preferences</li>
          <li>Survey responses and feedback</li>
        </ul>
      `
    },
    {
      id: 'how-we-use',
      icon: UserCheck,
      title: 'How We Use Your Information',
      content: `
        <p class="mb-4">We use the collected information for the following purposes:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Order Processing & Delivery:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Handle returns, refunds, and exchanges</li>
          <li>Verify payment information</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Communication:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Respond to customer inquiries and support requests</li>
          <li>Send important account and service updates</li>
          <li>Provide promotional offers (with your consent)</li>
          <li>Send newsletters and wellness tips</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Improvement & Analytics:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Improve our website and user experience</li>
          <li>Analyze shopping patterns and preferences</li>
          <li>Develop new products and services</li>
          <li>Conduct market research and surveys</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Security & Compliance:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>Prevent fraud and unauthorized access</li>
          <li>Comply with legal obligations</li>
          <li>Enforce our terms and conditions</li>
          <li>Protect our rights and property</li>
        </ul>
      `
    },
    {
      id: 'information-sharing',
      icon: Eye,
      title: 'Information Sharing & Disclosure',
      content: `
        <p class="mb-4">We respect your privacy and do not sell your personal information. We may share your information only in the following circumstances:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Service Providers:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
          <li><strong>Shipping Partners:</strong> Shiprocket, Delhivery, Ekart for order delivery</li>
          <li><strong>Email Service:</strong> For sending order confirmations and notifications</li>
          <li><strong>Analytics:</strong> Google Analytics for website performance analysis</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Legal Requirements:</h4>
        <p class="mb-4">We may disclose information when required by law or to:</p>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Comply with legal processes or government requests</li>
          <li>Enforce our terms and conditions</li>
          <li>Protect our rights, property, or safety</li>
          <li>Prevent fraud or illegal activities</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Business Transfers:</h4>
        <p class="mb-2">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner. We will notify you before your information is transferred.</p>
      `
    },
    {
      id: 'data-security',
      icon: Lock,
      title: 'Data Security',
      content: `
        <p class="mb-4">We take the security of your personal information seriously and implement various measures to protect it:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Technical Safeguards:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>SSL/TLS encryption for all data transmission</li>
          <li>Secure servers with regular security updates</li>
          <li>Encrypted storage of sensitive information</li>
          <li>Regular security audits and vulnerability assessments</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Access Controls:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Limited access to personal information</li>
          <li>Strong password requirements</li>
          <li>Two-factor authentication options</li>
          <li>Regular access reviews and monitoring</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Payment Security:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>PCI DSS compliant payment processing</li>
          <li>We do not store complete credit card information</li>
          <li>Tokenized payment data storage</li>
          <li>Secure payment gateway integration</li>
        </ul>
      `
    },
    {
      id: 'your-rights',
      icon: Shield,
      title: 'Your Rights & Choices',
      content: `
        <p class="mb-4">You have the following rights regarding your personal information:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Access & Control:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Access:</strong> Request a copy of your personal information</li>
          <li><strong>Update:</strong> Correct or update your account information</li>
          <li><strong>Delete:</strong> Request deletion of your account and data</li>
          <li><strong>Export:</strong> Receive your data in a portable format</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Communication Preferences:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Unsubscribe from marketing emails anytime</li>
          <li>Manage notification preferences in your account</li>
          <li>Opt-out of promotional SMS messages</li>
          <li>Control cookie preferences</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">How to Exercise Your Rights:</h4>
        <p class="mb-2">To exercise any of these rights, please:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Email us at: <a href="mailto:naturemedica09@gmail.com" class="text-[#3a5d1e] underline">naturemedica09@gmail.com</a></li>
          <li>Call us at: <a href="tel:+917007016231" class="text-[#3a5d1e] underline">+91 7007016231</a></li>
          <li>Access your account settings directly</li>
        </ul>
      `
    },
    {
      id: 'cookies',
      icon: Database,
      title: 'Cookies & Tracking',
      content: `
        <p class="mb-4">We use cookies and similar tracking technologies to enhance your experience:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Types of Cookies We Use:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for website functionality (login, cart, checkout)</li>
          <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
          <li><strong>Marketing Cookies:</strong> Show relevant ads and track campaign effectiveness</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Third-Party Cookies:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Google Analytics for website analytics</li>
          <li>Payment gateway cookies for transactions</li>
          <li>Social media plugins (Facebook, Instagram)</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Managing Cookies:</h4>
        <p class="mb-2">You can control cookies through:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li>Browser settings (disable or delete cookies)</li>
          <li>Our cookie consent banner</li>
          <li>Privacy settings on third-party platforms</li>
        </ul>
      `
    },
    {
      id: 'data-retention',
      icon: FileText,
      title: 'Data Retention',
      content: `
        <p class="mb-4">We retain your personal information only as long as necessary:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">Active Accounts:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Your information is retained while your account is active</li>
          <li>Order history maintained for warranty and returns</li>
          <li>Communication records kept for customer service</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Inactive Accounts:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li>Accounts inactive for 3+ years may be deleted</li>
          <li>We will notify you before deletion</li>
          <li>You can reactivate your account anytime</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Legal Requirements:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>Some data retained for legal compliance (tax, audit)</li>
          <li>Transaction records kept as per regulations</li>
          <li>Dispute resolution records maintained appropriately</li>
        </ul>
      `
    },
    {
      id: 'children',
      icon: AlertCircle,
      title: "Children's Privacy",
      content: `
        <p class="mb-4">Our services are not intended for children under 18 years of age:</p>
        
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>We do not knowingly collect information from children under 18</li>
          <li>If you are under 18, please do not use our services or provide any information</li>
          <li>Parents should supervise children's online activities</li>
          <li>If we learn we have collected children's data, we will delete it immediately</li>
        </ul>

        <p class="mb-2">If you believe we have collected information from a child under 18, please contact us at <a href="mailto:naturemedica09@gmail.com" class="text-[#3a5d1e] underline">naturemedica09@gmail.com</a></p>
      `
    },
    {
      id: 'changes',
      icon: FileText,
      title: 'Changes to Privacy Policy',
      content: `
        <p class="mb-4">We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements:</p>
        
        <h4 class="font-semibold text-gray-900 mb-2">How We Notify You:</h4>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Updated "Last Modified" date at the top of this policy</li>
          <li>Email notification for significant changes</li>
          <li>Prominent notice on our website or app</li>
          <li>In-app notifications for mobile users</li>
        </ul>

        <h4 class="font-semibold text-gray-900 mb-2">Your Acceptance:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>Continued use of our services means you accept the updated policy</li>
          <li>We recommend reviewing this policy periodically</li>
          <li>Material changes require your explicit consent</li>
        </ul>
      `
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact Us',
      content: `
        <p class="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
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

        <p class="text-sm text-gray-600">We will respond to your inquiry within 48 hours during business days.</p>
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
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-3">Your Privacy Matters</h2>
          <p className="text-sm opacity-90 mb-2">
            We are committed to protecting your personal information and being transparent about how we collect and use it.
          </p>
          <p className="text-xs opacity-75">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="p-4">
        <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Quick Navigation
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Click on any section below to jump to that topic
          </p>
          <div className="grid grid-cols-2 gap-2">
            {sections.slice(0, 6).map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs text-[#3a5d1e] hover:underline text-left"
              >
                • {section.title}
              </button>
            ))}
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

      {/* Contact CTA */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white text-center">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-bold text-lg mb-2">Have Questions?</h3>
          <p className="text-sm opacity-90 mb-4">
            Our team is here to help you understand how we protect your data
          </p>
          <button
            onClick={() => router.push('/contact')}
            className="w-full bg-white text-[#3a5d1e] py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* CSS for prose styling */}
      <style jsx global>{`
        .prose ul {
          margin-top: 0;
        }
        .prose li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .prose p {
          margin-top: 0;
        }
        .prose h4 {
          margin-top: 0;
        }
      `}</style>
    </div>
  );
}
