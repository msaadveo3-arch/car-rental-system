import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, CalendarPlus, Car, FileText, Users } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

interface Stats {
  totalCustomers: number;
  totalCars: number;
  totalBookings: number;
  totalContracts: number;
  availableCars: number;
  rentedCars: number;
  maintenanceCars: number;
}

const statusBadge = (status: string) => {
  if (status === 'active') return 'badge-success';
  if (status === 'booked') return 'badge-primary';
  if (status === 'completed') return 'badge-neutral';
  return 'badge-ghost';
};

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalContracts: 0,
    availableCars: 0,
    rentedCars: 0,
    maintenanceCars: 0,
  });
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
          availableCars: Array.isArray(cars) ? cars.filter((car: any) => car.status === 'available').length : 0,
          rentedCars: Array.isArray(cars) ? cars.filter((car: any) => car.status === 'rented').length : 0,
          maintenanceCars: Array.isArray(cars) ? cars.filter((car: any) => car.status === 'maintenance').length : 0,
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
    { title: 'Customers', value: stats.totalCustomers, icon: Users, detail: 'Customer records', to: '/customers' },
    { title: 'Fleet vehicles', value: stats.totalCars, icon: Car, detail: `${stats.availableCars} available now`, to: '/cars' },
    { title: 'Rental contracts', value: stats.totalBookings, icon: CalendarCheck, detail: 'All recorded contracts', to: '/rentals' },
    { title: 'Active contracts', value: stats.totalContracts, icon: FileText, detail: 'Currently in progress', to: '/rentals' },
  ];

  return (
    <DashboardLayout>
      <RedwoodPage>
        <RedwoodPageHeader
          eyebrow="Operations overview"
          title={`Good day${user?.name ? `, ${user.name}` : ''}`}
          description="Prioritized fleet and rental activity that needs your attention today."
          actions={((user as any)?.role ?? 'staff') !== 'inspector' ? <Link to="/booking" className="btn btn-primary gap-2"><CalendarPlus size={18} aria-hidden /> New rental contract</Link> : undefined}
        />

        {error && <div role="alert" className="alert alert-error"><span>{error}</span></div>}

        <section aria-label="Key business metrics" className="redwood-metric-band">
          {cards.map(({ title, value, icon: Icon, detail, to }) => (
            <Link key={title} to={to} className="redwood-metric-item group">
              <div className="flex items-center gap-3">
                <span className="redwood-metric-icon"><Icon size={18} aria-hidden /></span>
                <p className="text-sm font-semibold text-base-content/70">{title}</p>
              </div>
              <p className="mt-5 text-3xl font-semibold tabular-nums tracking-tight text-base-content">
                {loading ? <span className="loading loading-dots loading-sm" /> : value}
              </p>
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-base-content/55">
                <span>{detail}</span>
                <ArrowRight className="redwood-metric-arrow" size={15} aria-hidden />
              </div>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <RedwoodSection
            title="Recent rental contracts"
            description="The five most recently created rental transactions."
            actions={<Link to="/rentals" className="btn btn-ghost btn-sm gap-2 text-primary">View all <ArrowRight size={15} aria-hidden /></Link>}
            contentMode="flush"
            className="xl:col-span-2"
          >
              <div className="overflow-x-auto">
                <table className="app-table">
                  <thead><tr><th>Contract</th><th>Customer</th><th>Vehicle</th><th>Rental period</th><th className="text-right">Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {rentals.slice(0, 5).map((r: any) => (
                      <tr key={r.id}>
                        <td><Link to={`/rentals/${r.id}`} className="font-semibold text-primary hover:underline">{r.booking_number ?? `#${r.id}`}</Link></td>
                        <td><span className="font-medium text-base-content">{r.customer_name || '—'}</span></td>
                        <td><span className="font-mono text-xs text-base-content/75">{r.plate_number || '—'}</span></td>
                        <td><span className="block text-sm text-base-content/80">{r.start_date?.slice(0, 10) || '—'}</span><span className="block text-xs text-base-content/50">to {r.end_date?.slice(0, 10) || '—'}</span></td>
                        <td className="text-right font-semibold tabular-nums">{r.total_amount != null ? `AED ${Number(r.total_amount).toLocaleString()}` : '—'}</td>
                        <td><span className={`badge badge-sm capitalize ${statusBadge(r.status)}`}>{r.status}</span></td>
                      </tr>
                    ))}
                    {!loading && rentals.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-base-content/60">No contracts yet</td></tr>}
                  </tbody>
                </table>
              </div>
          </RedwoodSection>

          <RedwoodSection title="Fleet status" description="Current operational distribution." actions={<Link to="/cars" className="btn btn-ghost btn-sm gap-2 text-primary">View fleet <ArrowRight size={15} aria-hidden /></Link>}>
            <div className="space-y-5">
            {[
              ['Available', stats.availableCars, 'progress-success'],
              ['Rented', stats.rentedCars, 'progress-warning'],
              ['Maintenance', stats.maintenanceCars, 'progress-error'],
            ].map(([label, count, color]) => (
              <div key={label as string}>
                <div className="mb-2 flex items-center justify-between text-sm"><span className="text-base-content/70">{label}</span><span className="font-semibold tabular-nums">{loading ? '…' : count}</span></div>
                <progress className={`progress h-1.5 w-full ${color}`} value={count as number} max={Math.max(stats.totalCars, 1)} />
              </div>
            ))}
            </div>
          </RedwoodSection>
        </div>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default Dashboard;
