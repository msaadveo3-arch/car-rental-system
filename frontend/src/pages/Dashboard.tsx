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
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      subtext: 'Active customers',
    },
    {
      title: 'Total Cars',
      value: stats.totalCars,
      icon: Car,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      subtext: 'Fleet vehicles',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      subtext: 'All reservations',
    },
    {
      title: 'Active Contracts',
      value: stats.totalContracts,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      subtext: 'Confirmed rentals',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back! Here's what's happening with your fleet today.
            </p>
          </div>
          {((user as any)?.role ?? 'staff') !== 'inspector' && (
          <Link
            to="/booking"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <CalendarPlus size={18} /> New Rental Contract
          </Link>
        )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
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
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
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
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Latest Contracts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Booking</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Car</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Period</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rentals.slice(0, 5).map((r: any) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.booking_number ?? `#${r.id}`}</td>
                  <td className="px-4 py-3 text-gray-600">{r.customer_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.plate_number}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {r.total_amount != null ? `AED ${Number(r.total_amount).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        r.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : r.status === 'booked'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rentals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No contracts yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

          {/* Fleet Status Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Fleet Status</h2>
              <button className="text-sm text-blue-600 hover:underline">View Details</button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {loading ? '...' : stats.totalCars - Math.floor(stats.totalBookings * 0.6)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Rented</span>
                  <span className="text-sm font-semibold text-amber-600">
                    {loading ? '...' : Math.floor(stats.totalBookings * 0.6)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Maintenance</span>
                  <span className="text-sm font-semibold text-red-600">
                    {loading ? '...' : Math.floor(stats.totalCars * 0.1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }} />
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