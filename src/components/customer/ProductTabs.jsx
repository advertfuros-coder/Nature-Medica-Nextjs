'use client';

import { useState } from 'react';

export default function ProductTabs({ description, ingredients, specifications }) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="bg-white rounded-lg md:shadow md:p-4 mb-4">
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-3 py-1.5 text-[12px] font-semibold ${
            activeTab === 'description'
              ? 'border-b-[1.5px] border-[#3A5D1E] text-[#3A5D1E]'
              : 'text-gray-500 hover:text-[#3A5D1E]'
          }`}
        >
          Description
        </button>
        {ingredients && (
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-3 py-1.5 text-[12px] font-semibold ${
              activeTab === 'ingredients'
                ? 'border-b-[1.5px] border-[#3A5D1E] text-[#3A5D1E]'
                : 'text-gray-500 hover:text-[#3A5D1E]'
            }`}
          >
            Ingredients
          </button>
        )}
        {specifications && Object.keys(specifications).length > 0 && (
          <button
            onClick={() => setActiveTab('specifications')}
            className={`px-3 py-1.5 text-[12px] font-semibold ${
              activeTab === 'specifications'
                ? 'border-b-[1.5px] border-[#3A5D1E] text-[#3A5D1E]'
                : 'text-gray-500 hover:text-[#3A5D1E]'
            }`}
          >
            Specifications
          </button>
        )}
      </div>

      <div>
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-[12px] text-gray-700 whitespace-pre-line">{description}</p>
          </div>
        )}

        {activeTab === 'ingredients' && ingredients && (
          <div className="prose max-w-none">
            <p className="text-[12px] text-gray-700 whitespace-pre-line">{ingredients}</p>
          </div>
        )}

        {activeTab === 'specifications' && specifications && (
          <div className="grid md:grid-cols-2 gap-2.5">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[12px] font-semibold text-gray-700">{key}:</span>
                <span className="text-[11px] text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
