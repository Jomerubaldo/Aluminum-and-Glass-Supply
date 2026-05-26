import { useState, useEffect } from 'react';
import StatCard from '@/pages/dashboard/components/StatCard';
import LineChart from '@/pages/dashboard/components/LineChart';
import {
  ChartNoAxesColumn,
  CircleCheckBig,
  Clock,
  PackageCheck,
  ShoppingCart,
} from 'lucide-react';
import axios from 'axios';

const BASE = 'http://localhost:5000/api/dashboard';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    forInstallation: 0,
    completedOrders: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      className: 'text-indigo-400',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      className: 'text-amber-400',
    },
    {
      title: 'Ready for Installation',
      value: stats.forInstallation,
      icon: PackageCheck,
      className: 'text-blue-400',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CircleCheckBig,
      className: 'text-green-400',
    },
    {
      title: 'Total Sales',
      value: `₱${Number(stats.totalSales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
      icon: ChartNoAxesColumn,
      className: 'text-gray-400',
    },
  ];

  return (
    <div
      className="bg-background h-full overflow-y-auto"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--border) transparent',
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
        {statCards.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={loading ? '...' : item.value}
            icon={item.icon}
            className={item.className}
          />
        ))}
      </div>

      <div className="px-6 pb-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <LineChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
