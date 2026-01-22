"use client";

import { useState } from "react";
import { X, MapPin, Briefcase, IndianRupee, Store, Send, CheckCircle2 } from "lucide-react";

export default function FranchiseModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        state: "",
        city: "",
        pincode: "",
        address: "",
        investmentCapacity: "",
        propertyStatus: "",
        shopArea: "",
        profession: "",
        experience: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/franchise", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({
                        name: "", email: "", phone: "", state: "", city: "", pincode: "",
                        address: "", investmentCapacity: "", propertyStatus: "",
                        shopArea: "", profession: "", experience: "", message: ""
                    });
                }, 3000);
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to submit inquiry. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-900 leading-tight">Take Franchise</h2>
                        <p className="text-emerald-700 text-sm mt-1">Start your wellness journey with Nature Medica</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    {success ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                            <p className="text-gray-600">
                                Thank you for your interest in Nature Medica. <br />
                                Our franchise team will contact you within 24-48 hours.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Personal Section */}
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Full Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Email Address *</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="example@email.com"
                                        className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Mobile Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="10-digit mobile number"
                                        className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Current Profession</label>
                                    <input
                                        type="text"
                                        value={formData.profession}
                                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                        placeholder="e.g. Businessman, Doctor"
                                        className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="  border-gray-100">
                                 
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">State *</label>
                                        <select
                                            required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                        >
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">City *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Enter city"
                                            className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Pincode *</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                            placeholder="6-digit pin"
                                            className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 mt-4">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Proposed Shop Address *</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Enter full address of the proposed location"
                                        className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>

                            {/* Business Section */}
                            <div className="border-gray-100">
                                
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Investment Capacity *</label>
                                        <div className="relative">
                                            <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                required
                                                value={formData.investmentCapacity}
                                                onChange={(e) => setFormData({ ...formData, investmentCapacity: e.target.value })}
                                                className="w-full pl-10 text-xs pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                                            >
                                                <option value="">Select Range</option>
                                                <option value="Below 5 Lakhs">Below 5 Lakhs</option>
                                                <option value="5-10 Lakhs">5 - 10 Lakhs</option>
                                                <option value="10-20 Lakhs">10 - 20 Lakhs</option>
                                                <option value="Above 20 Lakhs">Above 20 Lakhs</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500  uppercase tracking-wider block ml-1">Property Status *</label>
                                        <div className="relative">
                                            <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                required
                                                value={formData.propertyStatus}
                                                onChange={(e) => setFormData({ ...formData, propertyStatus: e.target.value })}
                                                className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Owned">Owned</option>
                                                <option value="Rented">Rented</option>
                                                <option value="Seeking Location">Seeking Location</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Shop Area (sq. ft.) *</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.shopArea}
                                            onChange={(e) => setFormData({ ...formData, shopArea: e.target.value })}
                                            placeholder="Total available area"
                                            className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Prior Experience</label>
                                        <input
                                            type="text"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            placeholder="e.g. 5 years in retail"
                                            className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            <div className="space-y-1   border-gray-100">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">Any other comments?</label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell us why you want to partner with Nature Medica"
                                    className="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <X size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Application
                                    </>
                                )}
                            </button>

                        </form>
                    )}
                </div>

                {/* Footer info */}
                <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                        Nature Medica • Natural Wellness Franchise • India
                    </p>
                </div>

            </div>
        </div>
    );
}
