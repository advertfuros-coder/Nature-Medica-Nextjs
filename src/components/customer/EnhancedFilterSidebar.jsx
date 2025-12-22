'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiFilter, FiX, FiTag, FiTrendingUp, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { Heart, Leaf, Award, Star, DollarSign, Package, Shield } from 'lucide-react';

export default function EnhancedFilterSidebar({ categories }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse all current filters
    const getCurrentFilters = () => ({
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || '',
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
        benefits: searchParams.get('benefits')?.split(',').filter(Boolean) || [],
        ayurvedicType: searchParams.get('ayurvedic Type')?.split(',').filter(Boolean) || [],
        dietary: searchParams.get('dietary')?.split(',').filter(Boolean) || [],
        form: searchParams.get('form')?.split(',').filter(Boolean) || [],
        certifications: searchParams.get('certifications')?.split(',').filter(Boolean) || [],
        ageGroup: searchParams.get('ageGroup')?.split(',').filter(Boolean) || [],
        usageTime: searchParams.get('usageTime')?.split(',').filter(Boolean) || [],
        rating: searchParams.get('rating') || '',
    });

    const [currentFilters, setCurrentFilters] = useState(getCurrentFilters());
    const [filterDrawer, setFilterDrawer] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        benefits: true,
        ayurvedicType: false,
        dietary: false,
        form: false,
        certifications: false,
        ageGroup: false,
        usageTime: false,
    });

    // Update local state when search params change
    useEffect(() => {
        setCurrentFilters(getCurrentFilters());
    }, [searchParams]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = filterDrawer ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [filterDrawer]);

    const applyFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);

        if (key === 'category') {
            params.delete('search');
        }

        if (value) params.set(key, value);
        else params.delete(key);
        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    const applyMultiFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        const current = params.get(key)?.split(',').filter(Boolean) || [];

        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];

        if (updated.length > 0) {
            params.set(key, updated.join(','));
        } else {
            params.delete(key);
        }
        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (currentFilters.priceMin) params.set('priceMin', currentFilters.priceMin);
        else params.delete('priceMin');
        if (currentFilters.priceMax) params.set('priceMax', currentFilters.priceMax);
        else params.delete('priceMax');
        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/products');
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (currentFilters.category) count++;
        if (currentFilters.sort) count++;
        if (currentFilters.priceMin || currentFilters.priceMax) count++;
        if (currentFilters.rating) count++;
        count += currentFilters.benefits.length;
        count += currentFilters.ayurvedicType.length;
        count += currentFilters.dietary.length;
        count += currentFilters.form.length;
        count += currentFilters.certifications.length;
        count += currentFilters.ageGroup.length;
        count += currentFilters.usageTime.length;
        return count;
    };

    // Filter options
    const healthBenefits = [
        { value: 'immunity', label: 'Immunity Boost', icon: Shield },
        { value: 'hair-growth', label: 'Hair Growth', icon: Heart },
        { value: 'skin-brightening', label: 'Skin Brightening', icon: Star },
        { value: 'digestion', label: 'Digestion', icon: Leaf },
        { value: 'weight-management', label: 'Weight Management', icon: Package },
        { value: 'energy', label: 'Energy & Stamina', icon: Award },
        { value: 'joint-health', label: 'Joint Health', icon: Heart },
        { value: 'sleep-quality', label: 'Sleep Quality', icon: Heart },
    ];

    const ayurvedicTypes = [
        { value: 'vata', label: 'Vata Balance' },
        { value: 'pitta', label: 'Pitta Balance' },
        { value: 'kapha', label: 'Kapha Balance' },
    ];

    const dietaryPreferences = [
        { value: 'vegan', label: 'Vegan' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'gluten-free', label: 'Gluten-Free' },
        { value: 'sugar-free', label: 'Sugar-Free' },
        { value: 'lactose-free', label: 'Lactose-Free' },
    ];

    const productForms = [
        { value: 'capsules', label: 'Capsules' },
        { value: 'powder', label: 'Powder' },
        { value: 'oil', label: 'Oil' },
        { value: 'cream-gel', label: 'Cream/Gel' },
        { value: 'liquid', label: 'Liquid' },
    ];

    const certificationOptions = [
        { value: 'organic', label: 'Organic' },
        { value: 'fssai', label: 'FSSAI Approved' },
        { value: 'iso', label: 'ISO Certified' },
        { value: 'gmp', label: 'GMP Certified' },
        { value: 'ayush', label: 'Ayush Approved' },
    ];

    const ageGroups = [
        { value: 'children', label: 'Children' },
        { value: 'adults', label: 'Adults' },
        { value: 'seniors', label: 'Seniors' },
        { value: 'all-ages', label: 'All Ages' },
    ];

    const usageTimes = [
        { value: 'morning', label: 'Morning' },
        { value: 'night', label: 'Night' },
        { value: 'after-meals', label: 'After Meals' },
        { value: 'empty-stomach', label: 'Empty Stomach' },
        { value: 'anytime', label: 'Anytime' },
    ];

    // Filter Section Component
    const FilterSection = ({ title, isExpanded, onToggle, children, count = 0 }) => (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    {title}
                    {count > 0 && (
                        <span className="px-2 py-0.5 bg-[#4D6F36] text-white text-xs rounded-full">
                            {count}
                        </span>
                    )}
                </span>
                <FiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && <div className="px-4 pb-4 space-y-2">{children}</div>}
        </div>
    );

    // Checkbox Option Component
    const CheckboxOption = ({ value, label, filterKey, icon: Icon }) => {
        const isChecked = currentFilters[filterKey]?.includes(value);
        return (
            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => applyMultiFilter(filterKey, value)}
                    className="w-4 h-4 text-[#4D6F36] border-gray-300 rounded focus:ring-[#4D6F36]"
                />
                {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#4D6F36]" />}
                <span className={`text-sm ${isChecked ? 'text-[#4D6F36] font-medium' : 'text-gray-700'}`}>
                    {label}
                </span>
            </label>
        );
    };

    const FilterContent = () => (
        <div className="space-y-0">
            {/* Clear All */}
            {getActiveFilterCount() > 0 && (
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                        <FiX className="w-4 h-4" />
                        Clear All Filters ({getActiveFilterCount()})
                    </button>
                </div>
            )}

            {/* Price Range */}
            <FilterSection
                title="Price Range"
                isExpanded={expandedSections.priceRange || true}
                onToggle={() => toggleSection('priceRange')}
            >
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={currentFilters.priceMin}
                        onChange={(e) => setCurrentFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#4D6F36] focus:ring-1 focus:ring-[#4D6F36]"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={currentFilters.priceMax}
                        onChange={(e) => setCurrentFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#4D6F36] focus:ring-1 focus:ring-[#4D6F36]"
                    />
                </div>
                <button
                    onClick={applyPriceFilter}
                    className="w-full mt-2 px-4 py-2 bg-[#4D6F36] text-white rounded-lg text-sm font-medium hover:bg-[#3d5829] transition-colors"
                >
                    Apply
                </button>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Customer Rating" isExpanded={expandedSections.rating || true} onToggle={() => toggleSection('rating')}>
                {[4, 3, 2].map(stars => (
                    <label key={stars} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            checked={currentFilters.rating === stars.toString()}
                            onChange={() => applyFilter('rating', stars.toString())}
                            className="w-4 h-4 text-[#4D6F36] border-gray-300 focus:ring-[#4D6F36]"
                        />
                        <div className="flex items-center gap-1">
                            {Array.from({ length: stars }, (_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-700">& Up</span>
                        </div>
                    </label>
                ))}
            </FilterSection>

            {/* Health Benefits */}
            <FilterSection
                title="Health Benefits"
                isExpanded={expandedSections.benefits}
                onToggle={() => toggleSection('benefits')}
                count={currentFilters.benefits.length}
            >
                {healthBenefits.map(benefit => (
                    <CheckboxOption key={benefit.value} {...benefit} filterKey="benefits" />
                ))}
            </FilterSection>

            {/* Ayurvedic Type */}
            <FilterSection
                title="Ayurvedic Dosha"
                isExpanded={expandedSections.ayurvedicType}
                onToggle={() => toggleSection('ayurvedicType')}
                count={currentFilters.ayurvedicType.length}
            >
                {ayurvedicTypes.map(type => (
                    <CheckboxOption key={type.value} {...type} filterKey="ayurvedicType" />
                ))}
            </FilterSection>

            {/* Dietary Preferences */}
            <FilterSection
                title="Dietary Preferences"
                isExpanded={expandedSections.dietary}
                onToggle={() => toggleSection('dietary')}
                count={currentFilters.dietary.length}
            >
                {dietaryPreferences.map(diet => (
                    <CheckboxOption key={diet.value} {...diet} filterKey="dietary" />
                ))}
            </FilterSection>

            {/* Product Form */}
            <FilterSection
                title="Product Form"
                isExpanded={expandedSections.form}
                onToggle={() => toggleSection('form')}
                count={currentFilters.form.length}
            >
                {productForms.map(form => (
                    <CheckboxOption key={form.value} {...form} filterKey="form" />
                ))}
            </FilterSection>

            {/* Certifications */}
            <FilterSection
                title="Certifications"
                isExpanded={expandedSections.certifications}
                onToggle={() => toggleSection('certifications')}
                count={currentFilters.certifications.length}
            >
                {certificationOptions.map(cert => (
                    <CheckboxOption key={cert.value} {...cert} filterKey="certifications" />
                ))}
            </FilterSection>

            {/* Age Group */}
            <FilterSection
                title="Age Group"
                isExpanded={expandedSections.ageGroup}
                onToggle={() => toggleSection('ageGroup')}
                count={currentFilters.ageGroup.length}
            >
                {ageGroups.map(age => (
                    <CheckboxOption key={age.value} {...age} filterKey="ageGroup" />
                ))}
            </FilterSection>

            {/* Usage Time */}
            <FilterSection
                title="Usage Time"
                isExpanded={expandedSections.usageTime}
                onToggle={() => toggleSection('usageTime')}
                count={currentFilters.usageTime.length}
            >
                {usageTimes.map(time => (
                    <CheckboxOption key={time.value} {...time} filterKey="usageTime" />
                ))}
            </FilterSection>

            {/* Category */}
            <FilterSection title="Category" isExpanded={true} onToggle={() => { }}>
                <div className="space-y-1">
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            checked={!currentFilters.category}
                            onChange={() => applyFilter('category', '')}
                            className="w-4 h-4 text-[#4D6F36] border-gray-300 focus:ring-[#4D6F36]"
                        />
                        <span className={`text-sm ${!currentFilters.category ? 'text-[#4D6F36] font-medium' : 'text-gray-700'}`}>
                            All Categories
                        </span>
                    </label>
                    {categories.map(category => (
                        <label key={category._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                checked={currentFilters.category === category.slug}
                                onChange={() => applyFilter('category', category.slug)}
                                className="w-4 h-4 text-[#4D6F36] border-gray-300 focus:ring-[#4D6F36]"
                            />
                            <span className={`text-sm ${currentFilters.category === category.slug ? 'text-[#4D6F36] font-medium' : 'text-gray-700'}`}>
                                {category.name}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Sort By */}
            <FilterSection title="Sort By" isExpanded={true} onToggle={() => { }}>
                <select
                    value={currentFilters.sort || ''}
                    onChange={(e) => applyFilter('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#4D6F36] focus:ring-1 focus:ring-[#4D6F36]"
                >
                    <option value="">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="bestseller">Best Sellers</option>
                </select>
            </FilterSection>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-20 right-4 z-30">
                <button
                    onClick={() => setFilterDrawer(true)}
                    className="relative bg-gradient-to-br from-[#4D6F36] to-[#3d5829] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                >
                    <FiFilter className="w-6 h-6" />
                    {getActiveFilterCount() > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                            {getActiveFilterCount()}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Drawer */}
            {filterDrawer && (
                <>
                    <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setFilterDrawer(false)} />
                    <div className="lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col">
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                            <button onClick={() => setFilterDrawer(false)} className="text-gray-500 hover:text-gray-700">
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <FilterContent />
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => setFilterDrawer(false)}
                                className="w-full bg-gradient-to-br from-[#4D6F36] to-[#3d5829] text-white py-3 rounded-xl font-semibold"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-[#4D6F36] to-[#3d5829]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FiFilter className="w-5 h-5 text-white" />
                            <h3 className="text-xl font-bold text-white">Filters</h3>
                        </div>
                        {getActiveFilterCount() > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-white hover:bg-white/20 text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
                            >
                                <FiX className="w-4 h-4" />
                                Clear ({getActiveFilterCount()})
                            </button>
                        )}
                    </div>
                </div>
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
                    <FilterContent />
                </div>
            </aside>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4D6F36;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d5829;
        }
      `}</style>
        </>
    );
}
