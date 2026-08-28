import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarPlus, Car, FileText, Users } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

interface Stats {
  totalCustomers: number;
  totalCars: number;
  totalBookings: number;
  totalContracts: number;
}

const statusBadge = (status: string) => {
  if (status === 'active') return 'badge-success';
  if (status === 'booked') return 'badge-primary';
  if (status === 'completed') return 'badge-neutral';
  return 'badge-ghost';
};

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<Stats>({ totalCustomers: 0, totalCars: 0, totalBookings: 0, totalContracts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentals, setRentals] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const [customersRes, carsRes, rentalsRes] = await Promise.all([
          api.get('/customers'),
          api.get('/cars'),
          api.get('/rentals'),
        ]);
        const customers = customersRes.data.data || customersRes.data || [];
        const cars = carsRes.data.data || carsRes.data || [];
        const allRentals = rentalsRes.data.data || rentalsRes.data || [];
        setRentals(allRentals);
        setStats({
          totalCustomers: Array.isArray(customers) ? customers.length : 0,
          totalCars: Array.isArray(cars) ? cars.length : 0,
          totalBookings: Array.isArray(allRentals) ? allRentals.length : 0,
          totalContracts: Array.isArray(allRentals) ? allRentals.filter((r: any) => r.status === 'active').length : 0,
        });
      } catch (requestError: any) {
        setError(requestError.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const cards = [
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, tone: 'text-primary', surface: 'bg-primary/10', detail: 'Active customers' },
    { title: 'Total Cars', value: stats.totalCars, icon: Car, tone: 'text-success', surface: 'bg-success/10', detail: 'Fleet vehicles' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, tone: 'text-warning', surface: 'bg-warning/10', detail: 'All reservations' },
    { title: 'Active Contracts', value: stats.totalContracts, icon: FileText, tone: 'text-secondary', surface: 'bg-secondary/10', detail: 'Confirmed rentals' },
  ];
  const rented = Math.floor(stats.totalBookings * 0.6);
  const available = Math.max(0, stats.totalCars - rented);
  const maintenance = Math.floor(stats.totalCars * 0.1);

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-base-content/60">Welcome back! Here’s what’s happening with your fleet today.</p>
          </div>
          {((user as any)?.role ?? 'staff') !== 'inspector' && <Link to="/booking" className="btn btn-primary gap-2"><CalendarPlus size={18} /> New Rental Contract</Link>}
        </div>

        {error && <div role="alert" className="alert alert-error"><span>{error}</span></div>}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ title, value, icon: Icon, tone, surface, detail }) => (
            <article key={title} className="app-card transition-shadow hover:shadow-md">
              <div className="app-card-body">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-sm font-medium text-base-content/70">{title}</p><p className="mt-2 text-3xl font-bold">{loading ? <span className="loading loading-dots loading-sm" /> : value}</p><p className={`mt-2 text-sm ${tone}`}>{detail}</p></div>
                  <div className={`rounded-box p-3 ${surface}`}><Icon className={tone} size={24} /></div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="app-card overflow-hidden xl:col-span-2">
            <div className="app-card-body gap-4">
              <h2 className="card-title text-lg">Latest Contracts</h2>
              <div className="overflow-x-auto">
                <table className="app-table">
                  <thead><tr><th>Booking</th><th>Customer</th><th>Car</th><th>Period</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {rentals.slice(0, 5).map((r: any) => <tr key={r.id}><td className="font-medium">{r.booking_number ?? `#${r.id}`}</td><td>{r.customer_name || '—'}</td><td>{r.plate_number || '—'}</td><td className="text-xs text-base-content/65">{r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}</td><td className="font-semibold">{r.total_amount != null ? `AED ${Number(r.total_amount).toLocaleString()}` : '—'}</td><td><span className={`badge capitalize ${statusBadge(r.status)}`}>{r.status}</span></td></tr>)}
                    {!loading && rentals.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-base-content/60">No contracts yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          <article className="app-card"><div className="app-card-body gap-5">
            <div className="flex items-center justify-between"><h2 className="card-title text-lg">Fleet Status</h2><button className="btn btn-ghost btn-sm text-primary">View details</button></div>
            {[['Available', available, 'progress-success', 60], ['Rented', rented, 'progress-warning', 30], ['Maintenance', maintenance, 'progress-error', 10]].map(([label, count, color, value]) => <div key={label as string}><div className="mb-2 flex items-center justify-between text-sm"><span className="text-base-content/70">{label}</span><span className="font-bold">{loading ? '…' : count}</span></div><progress className={`progress w-full ${color}`} value={value as number} max="100" /></div>)}
          </div></article>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
