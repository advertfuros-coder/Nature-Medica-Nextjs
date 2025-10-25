'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SalesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Sales Overview (Last 7 Days)</h2>
        <p className="text-gray-600 text-center py-8">No sales data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => new Date(d._id).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'Revenue (₹)',
         data: data.map(d => d.sales),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Sales Overview (Last 7 Days)</h2>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
