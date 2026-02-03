import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS modules
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

export default function TrendsChart({ monthlySummaries }) {
  const labels = Object.keys(monthlySummaries); // e.g., ["January 2024", "February 2024"]
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: labels.map(m => monthlySummaries[m].income),
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        fill: true,
        tension: 0.4, // Makes the line curvy/aesthetic
      },
      {
        label: 'Expenses',
        data: labels.map(m => Math.abs(monthlySummaries[m].expenses)),
        borderColor: '#ff4757',
        backgroundColor: 'rgba(255, 71, 87, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#ffffff', font: { family: 'Inter' } }
      },
    },
    scales: {
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <Line data={data} options={options} />
    </div>
  );
}