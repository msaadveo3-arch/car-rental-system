import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api';
import AppSelect from '../common/AppSelect';

interface Car {
  id: number;
  plate_number: string;
  year: number;
  color: string | null;
  daily_rate: string | null;
  monthly_rate: string | null;
  status: string;
  mileage: number;
  fuel_level: string | null;
  make: string | null;
  model: string | null;
  body_type: string | null;
  seats: number | null;
  fuel_type: string | null;
  engine_capacity: string | null;
  horsepower: number | null;
  car_group: string | null;
}

const VehiclePicker: React.FC<{
  selectedId: number | null;
  onSelect: (id: number) => void;
}> = ({ selectedId, onSelect }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [makeFilter, setMakeFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  useEffect(() => {
    api.get('/cars').then((r) => setCars(r.data.data));
  }, []);

  const availableCars = useMemo(() => cars.filter((c) => c.status === 'available'), [cars]);

  const makes = [...new Set(availableCars.map((c) => c.make).filter(Boolean))] as string[];
  const groups = [...new Set(availableCars.map((c) => c.car_group).filter(Boolean))] as string[];

  const filteredCars = availableCars.filter((c) => {
    const q = search.toLowerCase();
    const mq =
      !q ||
      c.plate_number.toLowerCase().includes(q) ||
      (c.make ?? '').toLowerCase().includes(q) ||
      (c.model ?? '').toLowerCase().includes(q);
    const mm = makeFilter === 'all' || c.make === makeFilter;
    const mg = groupFilter === 'all' || c.car_group === groupFilter;
    return mq && mm && mg;
  });

  const car = availableCars.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div className="card card-border grid grid-cols-1 gap-3 bg-base-100 p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_10rem_10rem]">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make, model, or plate..."
            className="pl-10 pr-4 py-2 border border-base-300 rounded-lg w-full focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <AppSelect
          value={makeFilter}
          onChange={setMakeFilter}
          className="w-full"
          options={[{ value: 'all', label: 'All Makes' }, ...makes.map((make) => ({ value: make, label: make }))]}
        />
        <AppSelect
          value={groupFilter}
          onChange={setGroupFilter}
          className="w-full"
          options={[{ value: 'all', label: 'All Groups' }, ...groups.map((group) => ({ value: group, label: group }))]}
        />
      </div>

      <div className="card card-border bg-base-100 shadow-sm overflow-x-auto">
        <table className="app-table">
          <thead className="bg-base-200 border-b border-base-300">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Vehicle</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Year / KM</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Fuel</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Engine / HP</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Rate / Day</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Select</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCars.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`cursor-pointer ${selectedId === c.id ? 'bg-primary/10' : 'hover:bg-base-200/60'}`}
              >
                <td className="px-5 py-3">
                  <p className="font-semibold text-base-content">{c.make} {c.model}</p>
                  <span className="text-xs text-base-content/60">{c.car_group} • {c.plate_number}</span>
                </td>
                <td className="px-5 py-3 text-base-content/80">
                  {c.year}
                  <span className="block text-xs text-base-content/60">{Number(c.mileage).toLocaleString()} km</span>
                </td>
                <td className="px-5 py-3 text-base-content/80">{c.fuel_type}</td>
                <td className="px-5 py-3 text-base-content/80">{c.engine_capacity ?? '—'} / {c.horsepower} HP</td>
                <td className="px-5 py-3 font-semibold text-base-content">AED {c.daily_rate}</td>
                <td className="px-5 py-3">
                  <input
                    type="radio"
                    name="vehicle"
                    checked={selectedId === c.id}
                    onChange={() => onSelect(c.id)}
                    className="w-4 h-4 text-primary"
                  />
                </td>
              </tr>
            ))}
            {filteredCars.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-base-content/60">No available cars match</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {car && (
        <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="min-w-0">
            <p className="font-bold text-base-content">{car.make} {car.model}</p>
            <p className="text-xs text-base-content/60">
              {car.plate_number} • {car.body_type} • {car.seats} seats • {car.color}
            </p>
          </div>
          <p className="ml-auto shrink-0 text-right text-xl font-bold text-base-content">
            AED {car.daily_rate}
            <span className="text-xs text-base-content/60"> / day</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default VehiclePicker;
