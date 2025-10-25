'use client';

import { useState } from 'react';

export default function ProductTabs({ description, ingredients, specifications }) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'description'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Description
        </button>
        {ingredients && (
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'ingredients'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Ingredients
          </button>
        )}
        {specifications && Object.keys(specifications).length > 0 && (
          <button
            onClick={() => setActiveTab('specifications')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'specifications'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Specifications
          </button>
        )}
      </div>

      <div>
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
          </div>
        )}

        {activeTab === 'ingredients' && ingredients && (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{ingredients}</p>
          </div>
        )}

        {activeTab === 'specifications' && specifications && (
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">{key}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
