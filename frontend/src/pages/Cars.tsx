import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import AppSelect from '../components/common/AppSelect';
import { RedwoodCollectionToolbar, RedwoodEmptyState, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

interface Car {
  id: number;
  plate_number: string;
  registration_number: string | null;
  registration_expiry: string | null;
  year: number;
  color: string | null;
  daily_rate: string | null;
  monthly_rate: string | null;
  status: string;
  location: string | null;
  mileage: number;
  fuel_level: string | null;
  make: string | null;
  model: string | null;
  body_type: string | null;
  seats: number | null;
  fuel_type: string | null;
  engine_capacity: number | null;
  horsepower: number | null;
  transmission: string | null;
  car_group: string | null;
  image_url: string | null;
}

const statusStyles: Record<string, string> = {
  available: 'badge-success',
  rented: 'badge-primary',
  maintenance: 'badge-warning',
  out_of_service: 'badge-error',
};

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/cars')
      .then((r) => setCars(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const daysToExpiry = (date: string | null): number | null => {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

    const handleDelete = async (id: number, plate: string) => {
    if (!window.confirm(`سيتم إخفاء العربية "${plate}" من القائمة (حذف آمن). متابعة؟`)) {
      return;
    }
    try {
      await api.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Failed to delete car.');
    }
  };

  const filtered = cars.filter((c) => {
    const q = search.toLowerCase();
    const matchQ =
      c.plate_number.toLowerCase().includes(q) ||
      (c.make ?? '').toLowerCase().includes(q) ||
      (c.model ?? '').toLowerCase().includes(q);
    const matchS = statusFilter === 'all' || c.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <DashboardLayout>
      <RedwoodPage>
        <RedwoodPageHeader
          eyebrow="Fleet management"
          title="Vehicles"
          description="Monitor availability, registration health, mileage, rates, and vehicle specifications."
          icon={<CarFront size={21} />}
          actions={<Link to="/cars/add" className="btn btn-primary gap-2"><Plus size={18} aria-hidden /> Add vehicle</Link>}
        />

        <RedwoodSection title="Fleet inventory" description="Operational vehicles and their current readiness." contentMode="flush">
          <RedwoodCollectionToolbar
            search={{ value: search, onChange: setSearch, placeholder: 'Search plate, make, or model' }}
            filters={
              <AppSelect
                value={statusFilter}
                onChange={setStatusFilter}
                size="sm"
                className="w-48"
                aria-label="Filter by vehicle status"
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'available', label: 'Available' },
                  { value: 'rented', label: 'Rented' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'out_of_service', label: 'Out of service' },
                ]}
              />
            }
            summary={`${filtered.length} of ${cars.length} vehicles`}
          />
          {loading ? (
            <div className="redwood-empty-state"><span className="loading loading-spinner loading-md" /><span>Loading vehicles…</span></div>
          ) : filtered.length === 0 ? (
            <RedwoodEmptyState
              icon={<CarFront size={22} />}
              title={search || statusFilter !== 'all' ? 'No vehicles match these filters' : 'No vehicles yet'}
              description={search || statusFilter !== 'all' ? 'Clear or adjust the search and status filter.' : 'Add the first vehicle to begin managing the fleet.'}
              action={!search && statusFilter === 'all' ? <Link to="/cars/add" className="btn btn-primary btn-sm">Add vehicle</Link> : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Vehicle</th><th>Plate / color</th><th>Year / km</th><th>Fuel</th><th>Engine</th><th>Daily rate</th><th>Registration</th><th>Status</th><th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
            <tbody className="divide-y divide-base-300">
                {filtered.map((c) => {
                  const days = daysToExpiry(c.registration_expiry);
                  return (
                    <tr key={c.id} className="hover:bg-base-200/60">
                      <td>
                        <p className="font-semibold text-base-content">{c.make} {c.model}</p>
                        <span className="text-xs text-base-content/60">
                          {c.car_group} • {c.body_type} • {c.seats} seats
                        </span>
                      </td>
                      <td>
                        <p className="font-medium text-base-content">{c.plate_number}</p>
                        <span className="text-xs text-base-content/60">{c.color}</span>
                        {c.vin && <span className="block text-[11px] text-base-content/60">VIN: {c.vin}</span>}
                      </td>
                      <td className="text-base-content/80">
                        {c.year}
                        <span className="block text-xs text-base-content/60">
                          {Number(c.mileage).toLocaleString()} km
                        </span>
                      </td>
                      <td className="text-base-content/80">
                        {c.fuel_type}
                        <span className="block text-xs text-base-content/60 capitalize">{c.fuel_level}</span>
                      </td>
                      <td className="text-base-content/80">
                        {c.engine_capacity} cc
                        <span className="block text-xs text-base-content/60">{c.horsepower} HP</span>
                      </td>
                      <td className="font-semibold text-base-content">AED {c.daily_rate}</td>
                      <td>
                        {days !== null && days <= 30 ? (
                          <span className="badge badge-error gap-1">
                            <AlertTriangle size={12} />
                            {days <= 0 ? 'Expired!' : `Expires in ${days}d`}
                          </span>
                        ) : (
                          <span className="text-base-content/80 text-sm">{c.registration_expiry}</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            statusStyles[c.status] ?? 'badge-ghost'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                                            <td>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/cars/edit/${c.id}`}
                            title="Edit"
                            aria-label={`Edit ${c.plate_number}`}
                            className="btn btn-ghost btn-square btn-sm text-primary"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id, c.plate_number)}
                            title="Delete"
                            aria-label={`Delete ${c.plate_number}`}
                            className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </RedwoodSection>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default Cars;
