import React, { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Users, Car, CalendarCheck, FileText } from 'lucide-react';
import api from '../services/api';

interface Stats {
  totalCustomers: number;
  totalCars: number;
  totalBookings: number;
  totalContracts: number;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentals, setRentals] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading dashboard stats...');
        
        const [customersRes, carsRes, rentalsRes] = await Promise.all([
          api.get('/customers'),
          api.get('/cars'),
          api.get('/rentals'),
        ]);

        console.log('Customers:', customersRes.data);
        console.log('Cars:', carsRes.data);
        console.log('Rentals:', rentalsRes.data);

        const customersData = customersRes.data.data || customersRes.data || [];
        const carsData = carsRes.data.data || carsRes.data || [];
        const rentalsData = rentalsRes.data.data || rentalsRes.data || [];

        setRentals(rentalsData);
        const confirmedContracts = rentalsData.filter((r: any) => r.status === 'active').length;

        setStats({
          totalCustomers: Array.isArray(customersData) ? customersData.length : 0,
          totalCars: Array.isArray(carsData) ? carsData.length : 0,
          totalBookings: Array.isArray(rentalsData) ? rentalsData.length : 0,
          totalContracts: confirmedContracts,
        });
      } catch (err: any) {
        console.error('Failed to load dashboard stats:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        
        // Fallback: try direct fetch
        try {
          const fallbackData = await Promise.all([
            fetch('/api/customers').then(r => r.json()),
            fetch('/api/cars').then(r => r.json()),
            fetch('/api/rentals').then(r => r.json()),
          ]);
          
          console.log('Fallback data:', fallbackData);
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      subtext: 'Active customers',
    },
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      subtext: 'Fleet vehicles',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      subtext: 'All reservations',
    },
    {
      title: 'Active Contracts',
      value: stats.totalContracts,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtext: 'Confirmed rentals',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-apple-dark-50">Dashboard</h1>
            <p className="text-apple-dark-400 text-sm mt-1">
              Welcome back! Here's what's happening with your fleet today.
            </p>
          </div>
          {((user as any)?.role ?? 'staff') !== 'inspector' && (
          <Link
            to="/booking"
            className="px-5 py-2.5 bg-apple-accent-blue text-white rounded-apple hover:bg-apple-accent-blue/90 font-medium flex items-center gap-2 shadow-apple"
          >
            <CalendarPlus size={18} /> New Rental Contract
          </Link>
        )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-apple text-sm">
            Error loading data: {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6 hover:shadow-apple-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-apple-dark-400">{card.title}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-apple-dark-50">
                        {loading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          card.value
                        )}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${card.textColor}`}>
                      {card.subtext}
                    </p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-apple`}>
                    <Icon className={card.textColor} size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Latest Contracts */}
      <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-apple-dark-50">Latest Contracts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-dark-700/30 border-b border-apple-dark-700/50">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-apple-dark-400 uppercase">Booking</th>
                <th className="px-4 py-2 text-xs font-semibold text-apple-dark-400 uppercase">Customer</th>
                <th className="px-4 py-2 text-xs font-semibold text-apple-dark-400 uppercase">Car</th>
                <th className="px-4 py-2 text-xs font-semibold text-apple-dark-400 uppercase">Period</th>
                <th className="px-4 py-2 text-xs font-semibold text-apple-dark-400 uppercase">Total</th>
                <th className="px-4 py-2 text-xs font-semibold text-apple-dark-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-dark-700/30">
              {rentals.slice(0, 5).map((r: any) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-apple-dark-50">{r.booking_number ?? `#${r.id}`}</td>
                  <td className="px-4 py-3 text-apple-dark-300">{r.customer_name}</td>
                  <td className="px-4 py-3 text-apple-dark-300">{r.plate_number}</td>
                  <td className="px-4 py-3 text-apple-dark-400 text-xs">
                    {r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-apple-dark-50">
                    {r.total_amount != null ? `AED ${Number(r.total_amount).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-apple border ${
                        r.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : r.status === 'booked'
                            ? 'bg-apple-accent-blue/20 text-apple-accent-blue border-apple-accent-blue/30'
                            : 'bg-apple-dark-700/50 text-apple-dark-400 border-apple-dark-600/50'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rentals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-apple-dark-400">No contracts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

          {/* Fleet Status Placeholder */}
          <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-apple-dark-50">Fleet Status</h2>
              <button className="text-sm text-apple-accent-blue hover:underline">View Details</button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-apple-dark-400">Available</span>
                  <span className="text-sm font-semibold text-apple-accent-green">
                    {loading ? '...' : stats.totalCars - Math.floor(stats.totalBookings * 0.6)}
                  </span>
                </div>
                <div className="w-full bg-apple-dark-700/50 rounded-full h-2">
                  <div className="bg-apple-accent-green h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-apple-dark-400">Rented</span>
                  <span className="text-sm font-semibold text-apple-accent-orange">
                    {loading ? '...' : Math.floor(stats.totalBookings * 0.6)}
                  </span>
                </div>
                <div className="w-full bg-apple-dark-700/50 rounded-full h-2">
                  <div className="bg-apple-accent-orange h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-apple-dark-400">Maintenance</span>
                  <span className="text-sm font-semibold text-apple-accent-pink">
                    {loading ? '...' : Math.floor(stats.totalCars * 0.1)}
                  </span>
                </div>
                <div className="w-full bg-apple-dark-700/50 rounded-full h-2">
                  <div className="bg-apple-accent-pink h-2 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;