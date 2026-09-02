"use client";

import Image from "next/image";
import Link from "next/link";

export default function PromoBanner({
  src = "/2027/ChatGPT Image Sep 2, 2026, 04_16_00 PM.png",
  alt = "Nature Medica Special Offer",
  href = "/products"
}) {
  return (
    <section className="w-full my-4 sm:my-6 md:my-8">
      <Link
        href={href}
        className="block w-full cursor-pointer transition-opacity duration-300 hover:opacity-95"
        title="View All Products"
      >
        <Image
          src={src}
          alt={alt}
          width={1672}
          height={941}
          sizes="100vw"
          className="w-full h-auto block"
          priority={false}
        />
      </Link>
    </section>
  );
}


