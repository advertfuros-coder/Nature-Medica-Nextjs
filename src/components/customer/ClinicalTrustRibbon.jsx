import { ShieldCheck, Award, Leaf, FlaskConical } from 'lucide-react';

const items = [
  { icon: Award, label: 'AYUSH GMP Certified' },
  { icon: FlaskConical, label: 'Lab Tested' },
  { icon: Leaf, label: 'Cruelty-Free' },
  { icon: ShieldCheck, label: 'No Parabens or Sulfates' },
];

export default function ClinicalTrustRibbon() {
  return (
    <section className="bg-[#f4f7f2] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2 text-xs sm:text-[13px] font-semibold text-[#2d4e24]">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
