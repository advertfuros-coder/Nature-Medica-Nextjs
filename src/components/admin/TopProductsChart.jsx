'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TopProductsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Top 5 Selling Products</h2>
        <p className="text-gray-600 text-center py-8">No data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.product.title.substring(0, 30) + '...'),
    datasets: [
      {
        label: 'Units Sold',
         data: data.map(d => d.totalSold),
        backgroundColor: '#059669',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Sold: ${context.parsed.x} units`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Top 5 Selling Products</h2>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
