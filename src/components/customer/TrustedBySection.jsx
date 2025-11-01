// src/components/customer/TrustedBySection.jsx
import Image from "next/image";

export default function TrustedBySection() {
  return (
    <section className="bg-gradient-to-r from-white to-gray-50 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left - Customer Grid */}
        <div className="relative w-full h-80 sm:h-96 md:h-[28rem] rounded-2xl overflow-hidden shadow-md bg-white">
          <img
            src="https://img4.hkrtcdn.com/35085/bnr_3508403_o.jpg"
            alt="Happy customer community"
            className="object-cover w-full h-full grayscale hover:grayscale-0 transition duration-500"
          />
        </div>

        {/* Right - Trust Info */}
        <div className="md:bg-white md:p-10 md:rounded-2xl md:shadow-md md:shadow-xl md:border md:border-gray-100 transition-all duration-300">
          <h2 className="text-xl md:text-2xl font-bold text-[#3C5D27] mb-6">
            Trusted by 70 Lac+ consumers
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3C5D27]/10 text-[#3C5D27] font-bold text-lg">✔</div>
              <div>
                <h3 className="font-semibold text-gray-900">Research-backed products</h3>
                <p className="text-gray-600 text-sm">
                  Scientific formulations crafted by experts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3C5D27]/10 text-[#3C5D27] font-bold text-lg">✔</div>
              <div>
                <h3 className="font-semibold text-gray-900">Assured safety with each product</h3>
                <p className="text-gray-600 text-sm">
                  Confidence instilled, forty lakh people testify.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3C5D27]/10 text-[#3C5D27] font-bold text-lg">✔</div>
              <div>
                <h3 className="font-semibold text-gray-900">Authenticity guaranteed</h3>
                <p className="text-gray-600 text-sm">
                  Genuine products assured.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}