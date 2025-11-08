'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Heart, 
  Leaf, 
  Shield, 
  Award,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Award, value: '500+', label: 'Premium Products' },
    { icon: Globe, value: '100+', label: 'Cities Served' },
    { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' }
  ];

  const values = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'All our products are made from pure, natural ingredients sourced ethically.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every product undergoes rigorous testing to ensure safety and effectiveness.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your wellness journey is our priority. We\'re here to support you every step.',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Combining ancient Ayurvedic wisdom with modern scientific research.',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Founded with a vision to make authentic Ayurvedic wellness accessible to everyone.'
    },
    {
      year: '2021',
      title: 'Growth & Expansion',
      description: 'Expanded product line and reached 10,000+ satisfied customers across India.'
    },
    {
      year: '2023',
      title: 'Recognition',
      description: 'Received multiple awards for quality and customer satisfaction in wellness industry.'
    },
    {
      year: '2025',
      title: 'Today',
      description: 'Serving 50,000+ customers with 500+ premium products and growing strong.'
    }
  ];

  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Ayurvedic Officer',
      description: '20+ years of experience in Ayurvedic medicine and wellness.',
      image: '/team/dr-rajesh.jpg'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Product Development',
      description: 'Expert in herbal formulations and natural product innovation.',
      image: '/team/priya.jpg'
    },
    {
      name: 'Amit Verma',
      role: 'Quality Assurance Head',
      description: 'Ensures every product meets the highest quality standards.',
      image: '/team/amit.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">About Us</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Nature Medica</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Your trusted partner in holistic wellness. We blend ancient Ayurvedic wisdom with modern science to bring you the finest natural products for a healthier, happier life.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="p-4 mt-6">
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Nature Medica was born from a simple yet powerful belief: wellness should be natural, accessible, and rooted in time-tested wisdom. Our journey began in 2020 when a group of Ayurvedic practitioners and wellness enthusiasts came together with a shared vision.
            </p>
            <p>
              We noticed that many people were looking for authentic, natural solutions to their health concerns but struggled to find products they could trust. That's when we decided to create Nature Medica – a brand that stands for purity, quality, and genuine care for your wellbeing.
            </p>
            <p>
              Today, we're proud to serve thousands of customers across India, offering a curated selection of premium Ayurvedic and natural wellness products. Each product in our collection is carefully selected and rigorously tested to ensure it meets our high standards of quality and effectiveness.
            </p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6">
                <div className={`w-12 h-12 ${value.color} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Our Mission */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            To empower individuals on their wellness journey by providing authentic, high-quality natural products backed by Ayurvedic wisdom and modern research. We strive to make holistic health accessible, affordable, and trustworthy for everyone.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Journey</h2>
        <div className="bg-white rounded-xl p-6">
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 pb-6 border-l-2 border-[#3a5d1e] last:border-l-0 last:pb-0">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-[#3a5d1e] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="inline-block px-3 py-1 bg-[#3a5d1e] text-white text-xs font-bold rounded-full mb-2">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
        <div className="space-y-4">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                <p className="text-[#3a5d1e] text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#3a5d1e] to-[#4a7d2e] rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Why Choose Nature Medica?</h2>
          <ul className="space-y-3">
            {[
              'Authentic Ayurvedic formulations backed by research',
              '100% natural ingredients with no harmful chemicals',
              'Rigorous quality testing and certification',
              'Fast and reliable delivery across India',
              'Expert guidance and customer support',
              'Satisfaction guaranteed or money back'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Certifications */}
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Certifications & Recognition</h2>
        <div className="bg-white rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              'ISO 9001:2015 Certified',
              'AYUSH Approved',
              'GMP Certified',
              'FDA Registered',
              'Organic Certified',
              'Cruelty-Free'
            ].map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-[#3a5d1e] flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Get In Touch</h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Have questions? We'd love to hear from you!
          </p>
          
          <div className="space-y-3 mb-6">
            <a href="tel:+917007016231" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Call Us</p>
                <p className="font-semibold text-gray-900">+91 7007016231</p>
              </div>
            </a>

            <a href="mailto:naturemedica09@gmail.com" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Us</p>
                <p className="font-semibold text-gray-900">naturemedica09@gmail.com</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Visit Us</p>
                <p className="font-semibold text-gray-900">Lucknow, UP 226022</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/contact')}
            className="w-full bg-[#3a5d1e] text-white py-3 rounded-lg font-semibold hover:bg-[#2d4818] transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="p-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
          <h3 className="font-bold text-gray-900 mb-2">Stay Updated!</h3>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to our newsletter for wellness tips, new products, and exclusive offers.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] text-sm"
            />
            <button className="px-6 py-2 bg-[#3a5d1e] text-white rounded-lg font-medium hover:bg-[#2d4818] transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
