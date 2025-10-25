'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function CategoryRevenueChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  const labels = Object.keys(data);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Category Revenue (₹)',
        data: Object.values(data),
        backgroundColor: '#10b981',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="font-bold mb-4">Category Wise Revenue</h2>
      <Bar data={chartData} />
    </div>
  );
}
