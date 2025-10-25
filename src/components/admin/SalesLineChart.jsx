'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, PointElement, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, PointElement, LinearScale, Tooltip);

export default function SalesLineChart({ data }) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data.map(d => d.revenue),
        borderColor: '#059669',
        tension: 0.3,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: { display: true }
    },
    scales: {
      y: { beginAtZero: true },
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="font-bold mb-4">Revenue (Last 7 Days)</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
