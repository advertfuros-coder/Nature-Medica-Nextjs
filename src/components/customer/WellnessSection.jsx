"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Droplets
} from "lucide-react";
import serum2 from "@/assets/serum2.png";

export default function WellnessSection() {
  return (
    <section className="relative w-full py-14 sm:py-18 md:py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F4F0E8] to-[#FAF8F5] overflow-hidden border-y border-stone-200/60 font-sans">
      
      {/* Ambient Botanical Glow Elements */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3-Column / Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* =========================================
              LEFT COLUMN: Brand Story & Philosophy (5 Cols)
             ========================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/10 border border-emerald-800/20 text-[#2D5A27] text-xs font-semibold tracking-wide uppercase shadow-xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse" />
              <span>Ancient Wisdom • Clinical Science</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F331A] leading-[1.15] tracking-tight">
              Inspired By Nature, <br />
              <span className="text-[#3E6B2D] italic font-serif font-normal">
                Perfected by Wellness
              </span>
            </h2>

            {/* Narrative */}
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We fuse 5,000-year-old Ayurvedic heritage with cutting-edge clean dermatology. Every formulation is handcrafted with pure cold-pressed botanicals designed to restore your skin&apos;s natural cellular radiance.
            </p>

            {/* Key Value Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[#2D5A27] shrink-0 group-hover:bg-[#2D5A27] group-hover:text-white transition-colors duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">100% Active Herbal Botanicals</h4>
                  <p className="text-xs text-stone-500">Pure Himalayan herbs harvested at peak seasonal potency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[#2D5A27] shrink-0 group-hover:bg-[#2D5A27] group-hover:text-white transition-colors duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Ayush Certified & Lab Tested</h4>
                  <p className="text-xs text-stone-500">Formulated in GMP-compliant facilities adhering to classical texts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[#2D5A27] shrink-0 group-hover:bg-[#2D5A27] group-hover:text-white transition-colors duration-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Zero Toxin Guarantee</h4>
                  <p className="text-xs text-stone-500">Free from parabens, synthetic sulfates, silicones, and mineral oil.</p>
                </div>
              </div>
            </div>

            {/* CTA and Micro-Proof */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#27461F] hover:bg-[#1C3316] text-[#F3EFE6] text-sm font-bold tracking-wide shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
              >
                <span>Explore Formulations</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <span className="text-xs text-stone-500 font-medium">
                🌿 Flat 20% Off on First Order
              </span>
            </div>

          </div>

          {/* =========================================
              CENTER COLUMN: The Spotlight Product (4 Cols)
             ========================================= */}
          <div className="lg:col-span-4 flex justify-center relative my-8 lg:my-0">
            
            {/* Pedestal Aura Glow */}
            <div className="absolute inset-0 bg-radial from-amber-200/40 via-emerald-100/30 to-transparent rounded-full blur-2xl transform scale-90" />
            
            {/* Decorative Soft Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80 border border-emerald-700/15 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-92 sm:h-92 border border-dashed border-amber-600/20 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

            {/* Floating Bottle Container */}
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[26rem] flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <Image
                src={serum2}
                alt="Nature Medica 24K Gold Face Serum"
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                priority={false}
              />
            </div>

            {/* Floating Pill Badge 1 (Top-Right: Rating) */}
            <div className="absolute -top-2 -right-2 sm:right-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2.5 animate-[bounce-subtle_4s_ease-in-out_infinite]">
              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-stone-900 leading-none flex items-center gap-1">
                  4.9 / 5.0
                </div>
                <div className="text-[10px] text-stone-500 font-medium">2,400+ Verified Reviews</div>
              </div>
            </div>

            {/* Floating Pill Badge 2 (Bottom-Left: Star Active) */}
            <div className="absolute -bottom-4 -left-2 sm:left-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2.5 animate-[bounce-subtle_4s_ease-in-out_infinite_2s]">
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-[#2D5A27] shrink-0 shadow-inner">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-stone-900 leading-none">24K Pure Gold</div>
                <div className="text-[10px] text-stone-500 font-medium">Radiance & Firming</div>
              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT COLUMN: Benefits & Impact Bento (3 Cols)
             ========================================= */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Card 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-600/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-[#2D5A27] group-hover:bg-[#2D5A27] group-hover:text-white transition-colors duration-300 shadow-xs">
                  <Leaf className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">Ayurvedic Harmony</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Balancing formulations curated according to Tridosha principles for optimal skin and wellness equilibrium.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-600/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors duration-300 shadow-xs">
                  <Droplets className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">Cellular Nourishment</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Micro-emulsified plant botanicals penetrate deep into dermal layers without greasy residue.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-600/30 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-colors duration-300 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">Sustainable Purity</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ethically wildcrafted herbs with zero animal testing and 100% recyclable luxury packaging.
              </p>
            </div>

            {/* Bottom Trust Stat Micro-Bar */}
            <div className="p-3 rounded-xl bg-[#27461F]/5 border border-[#27461F]/15 flex items-center justify-between text-center">
              <div>
                <div className="text-xs font-extrabold text-[#27461F]">50k+</div>
                <div className="text-[10px] text-stone-500">Healed Skin</div>
              </div>
              <div className="h-6 w-px bg-stone-300/80" />
              <div>
                <div className="text-xs font-extrabold text-[#27461F]">100%</div>
                <div className="text-[10px] text-stone-500">Ayurvedic</div>
              </div>
              <div className="h-6 w-px bg-stone-300/80" />
              <div>
                <div className="text-xs font-extrabold text-[#27461F]">AYUSH</div>
                <div className="text-[10px] text-stone-500">Certified</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Embedded High-Performance Keyframe Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </section>
  );
}
