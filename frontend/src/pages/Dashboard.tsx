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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="opacity-70 text-sm mt-1">
              Welcome back! Here's what's happening with your fleet today.
            </p>
          </div>
          {((user as any)?.role ?? 'staff') !== 'inspector' && (
          <Link
            to="/booking"
            className="btn btn-primary gap-2"
          >
            <CalendarPlus size={18} /> New Rental Contract
          </Link>
        )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error text-sm">
            <span>Error loading data: {error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200"
              >
                <div className="card-body p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium opacity-70">{card.title}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
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
                    <div className={`${card.bgColor} p-3 rounded-lg`} data-theme="corporate">
                      <Icon className={card.textColor} size={24} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Latest Contracts */}
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Latest Contracts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="text-xs font-semibold opacity-70 uppercase">Booking</th>
                  <th className="text-xs font-semibold opacity-70 uppercase">Customer</th>
                  <th className="text-xs font-semibold opacity-70 uppercase">Car</th>
                  <th className="text-xs font-semibold opacity-70 uppercase">Period</th>
                  <th className="text-xs font-semibold opacity-70 uppercase">Total</th>
                  <th className="text-xs font-semibold opacity-70 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.slice(0, 5).map((r: any) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.booking_number ?? `#${r.id}`}</td>
                    <td className="opacity-70">{r.customer_name}</td>
                    <td className="opacity-70">{r.plate_number}</td>
                    <td className="text-xs opacity-70">
                      {r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}
                    </td>
                    <td className="font-semibold">
                      {r.total_amount != null ? `AED ${Number(r.total_amount).toLocaleString()}` : '—'}
                    </td>
                    <td>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full badge ${
                          r.status === 'active'
                            ? 'badge-success'
                            : r.status === 'booked'
                              ? 'badge-info'
                              : 'badge-ghost'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {rentals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center opacity-70 py-8">No contracts yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

          {/* Fleet Status Placeholder */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Fleet Status</h2>
                <button className="btn btn-link btn-sm">View Details</button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70">Available</span>
                    <span className="text-sm font-semibold text-success">
                      {loading ? '...' : stats.totalCars - Math.floor(stats.totalBookings * 0.6)}
                    </span>
                  </div>
                  <progress className="progress progress-success w-full" value={60} max={100}></progress>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70">Rented</span>
                    <span className="text-sm font-semibold text-warning">
                      {loading ? '...' : Math.floor(stats.totalBookings * 0.6)}
                    </span>
                  </div>
                  <progress className="progress progress-warning w-full" value={30} max={100}></progress>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-70">Maintenance</span>
                    <span className="text-sm font-semibold text-error">
                      {loading ? '...' : Math.floor(stats.totalCars * 0.1)}
                    </span>
                  </div>
                  <progress className="progress progress-error w-full" value={10} max={100}></progress>
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