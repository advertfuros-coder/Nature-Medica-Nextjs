'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Category-wise Revenue</h2>
        <p className="text-gray-600 text-center py-8">No data available</p>
      </div>
    );
  }

  const colors = [
    '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'
  ];

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        data: data.map(d => d.revenue),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ₹${context.parsed.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Category-wise Revenue</h2>
      <div style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
