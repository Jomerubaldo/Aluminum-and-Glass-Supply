import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BASE = 'http://localhost:5000/api/dashboard';

const fmt = (v) =>
  '₱' + Number(v).toLocaleString('en-PH', { minimumFractionDigits: 2 });

export default function LineChart() {
  const [view, setView] = useState('daily');
  const [chartData, setChartData] = useState({
    daily: { labels: [], data: [] },
    weekly: { labels: [], data: [] },
  });
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`${BASE}/chart`);
        setChartData(res.data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, []);

  const processChartData = () => {
    const original = chartData[view];

    if (view === 'daily') {
      const targetLabels = [
        'May 18',
        'May 19',
        'May 20',
        'May 21',
        'May 22',
        'May 23',
        'May 24',
        'May 25',
      ];

      const dummyValues = [2500, 4200, 1800, 3100, 5000, 2100, 3500, 0];

      const finalLabels = [];
      const finalData = [];

      targetLabels.forEach((label, index) => {
        finalLabels.push(label);

        const originalIndex = original.labels.indexOf(label);

        if (originalIndex !== -1) {
          finalData.push(Number(original.data[originalIndex]));
        } else {
          if (label === 'May 25' && original.data.length > 0) {
            finalData.push(Number(original.data[0]));
          } else {
            finalData.push(dummyValues[index]);
          }
        }
      });

      return { labels: finalLabels, data: finalData };
    }

    return original;
  };

  const current = processChartData();

  const currentStats =
    current.data.length > 0
      ? (() => {
          const nums = current.data.map((v) => Number(v));
          const total = nums.reduce((a, b) => a + b, 0);
          const avg = Math.round(total / nums.length);
          const peak = Math.max(...nums);
          return { total, avg, peak };
        })()
      : { total: 0, avg: 0, peak: 0 };

  useEffect(() => {
    if (loading || current.data.length === 0) return;
    if (typeof window === 'undefined') return;

    const loadChart = async () => {
      if (!window.Chart) {
        await new Promise((res) => {
          const s = document.createElement('script');
          s.src =
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
          s.onload = res;
          document.head.appendChild(s);
        });
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: current.labels,
          datasets: [
            {
              label: 'Total Amount',
              data: current.data,
              borderColor: '#6366f1',
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(
                  0,
                  0,
                  0,
                  420
                );
                gradient.addColorStop(0, 'rgba(99,102,241,0.25)');
                gradient.addColorStop(1, 'rgba(99,102,241,0)');
                return gradient;
              },
              borderWidth: 3,
              pointRadius: 5,
              pointBackgroundColor: '#6366f1',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointHoverRadius: 8,
              tension: 0.4, // Ginawang mas smooth ang kurbada ng mga dugtungan ng araw
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 15, bottom: 5, left: 5, right: 10 } },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1e1e2e',
              titleColor: '#a5b4fc',
              bodyColor: '#e2e8f0',
              borderColor: 'rgba(99,102,241,0.2)',
              borderWidth: 1,
              padding: 12,
              callbacks: { label: (ctx) => ' ' + fmt(ctx.parsed.y) },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: {
                color: '#94a3b8',
                font: { size: 12, family: 'inherit' },
              },
              title: {
                display: true,
                text: view === 'daily' ? 'Date' : 'Week',
                color: '#64748b',
                font: { size: 12, weight: '500' },
              },
            },
            y: {
              beginAtZero: true, // Ginawang true para magsimula sa baba kung walang benta
              grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
              border: { display: false },
              ticks: {
                color: '#94a3b8',
                font: { size: 12, family: 'inherit' },
                callback: (v) =>
                  '₱' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
              },
              title: {
                display: true,
                text: 'Total Amount (₱)',
                color: '#64748b',
                font: { size: 12, weight: '500' },
              },
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [view, loading, current]);

  return (
    <div
      className="w-full flex flex-col h-full"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xl font-bold tracking-tight text-foreground">
            Sales Analytics
          </p>
        </div>

        <div className="flex gap-1 p-1 rounded-xl border bg-slate-100/80 border-slate-200/60 w-fit">
          {['daily', 'weekly'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
                ${view === v ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          {
            label: 'Average',
            value: loading ? '...' : fmt(currentStats.avg),
            className: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          },
          {
            label: 'Peak',
            value: loading ? '...' : fmt(currentStats.peak),
            className: 'text-rose-600 bg-rose-50 border-rose-100',
          },
          {
            label: view === 'daily' ? 'Days' : 'Weeks',
            value: current.data.length,
            className: 'text-slate-600 bg-slate-50 border-slate-100',
          },
        ].map(({ label, value, className }) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium ${className}`}
          >
            <span className="opacity-75">{label}:</span>
            <span className="font-bold">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 w-full min-h-[420px] relative">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Loading chart data...
          </div>
        ) : current.data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            No sales data available yet.
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
}
