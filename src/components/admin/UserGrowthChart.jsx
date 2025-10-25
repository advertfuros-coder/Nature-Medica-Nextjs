'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function UserGrowthChart({ data }) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'New Users',
        data: data.map(d => d.newUsers),
        borderColor: '#2563eb',
        tension: 0.3,
        fill: false,
      }
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="font-bold mb-4">Customer Growth (7 Days)</h2>
      <Line data={chartData} />
    </div>
  );
}
