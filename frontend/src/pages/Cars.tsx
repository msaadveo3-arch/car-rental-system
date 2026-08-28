import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarFront, Search, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import AppSelect from '../components/common/AppSelect';

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
  available: 'bg-success/10 text-success border-success/30',
  rented: 'bg-primary/10 text-primary border-primary/30',
  maintenance: 'bg-warning/10 text-warning border-warning/30',
  out_of_service: 'bg-error/10 text-error border-error/30',
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
      <div className="app-page">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <CarFront className="text-primary" size={24} /> Cars
            </h1>
            <p className="text-base-content/60 text-sm mt-1">Fleet overview — {cars.length} vehicles</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plate, make, model..."
                className="pl-10 pr-4 py-2 border border-base-300 rounded-lg w-64 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <AppSelect
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-44"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'available', label: 'Available' },
                { value: 'rented', label: 'Rented' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'out_of_service', label: 'Out of Service' },
              ]}
            />
            <Link to="/cars/add"className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary font-medium">
              <Plus size={18} /> Add New Car
            </Link>
          </div>
        </div>

        <div className="card card-border bg-base-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-base-content/60">Loading cars...</div>
          ) : (
            <table className="app-table">
              <thead className="bg-base-200 border-b border-base-300">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Vehicle</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Plate / Color</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Year / KM</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Fuel Type / Level</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Engine / HP</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Rate / Day</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Registration</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Status</th>
                  <th className="px-5 py-4 text-xs font-semibold text-base-content/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => {
                  const days = daysToExpiry(c.registration_expiry);
                  return (
                    <tr key={c.id} className="hover:bg-base-200/60">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-base-content">{c.make} {c.model}</p>
                        <span className="text-xs text-base-content/60">
                          {c.car_group} • {c.body_type} • {c.seats} seats
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-base-content">{c.plate_number}</p>
                        <span className="text-xs text-base-content/60">{c.color}</span>
                        {c.vin && <span className="block text-[11px] text-base-content/60">VIN: {c.vin}</span>}
                      </td>
                      <td className="px-5 py-4 text-base-content/80">
                        {c.year}
                        <span className="block text-xs text-base-content/60">
                          {Number(c.mileage).toLocaleString()} km
                        </span>
                      </td>
                      <td className="px-5 py-4 text-base-content/80">
                        {c.fuel_type}
                        <span className="block text-xs text-base-content/60 capitalize">{c.fuel_level}</span>
                      </td>
                      <td className="px-5 py-4 text-base-content/80">
                        {c.engine_capacity} cc
                        <span className="block text-xs text-base-content/60">{c.horsepower} HP</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-base-content">AED {c.daily_rate}</td>
                      <td className="px-5 py-4">
                        {days !== null && days <= 30 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium bg-error/10 text-error border border-error/30 px-2 py-1 rounded-full">
                            <AlertTriangle size={12} />
                            {days <= 0 ? 'Expired!' : `Expires in ${days}d`}
                          </span>
                        ) : (
                          <span className="text-base-content/80 text-sm">{c.registration_expiry}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                            statusStyles[c.status] ?? 'bg-base-200 text-base-content/80'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                                            <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/cars/edit/${c.id}`}
                            title="Edit"
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(c.id, c.plate_number)}
                            title="Delete"
                            className="p-2 text-error hover:bg-error/10 rounded-lg"
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cars;
