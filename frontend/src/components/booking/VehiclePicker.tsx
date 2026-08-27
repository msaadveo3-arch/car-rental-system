import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api';

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make, model, or plate..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={makeFilter}
          onChange={(e) => setMakeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
        >
          <option value="all">All Makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
        >
          <option value="all">All Groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Year / KM</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fuel</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Engine / HP</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rate / Day</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Select</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCars.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`cursor-pointer ${selectedId === c.id ? 'bg-blue-50' : 'hover:bg-gray-50/60'}`}
              >
                <td className="px-5 py-3">
                  <p className="font-semibold text-gray-900">{c.make} {c.model}</p>
                  <span className="text-xs text-gray-500">{c.car_group} • {c.plate_number}</span>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {c.year}
                  <span className="block text-xs text-gray-400">{Number(c.mileage).toLocaleString()} km</span>
                </td>
                <td className="px-5 py-3 text-gray-600">{c.fuel_type}</td>
                <td className="px-5 py-3 text-gray-600">{c.engine_capacity ?? '—'} / {c.horsepower} HP</td>
                <td className="px-5 py-3 font-semibold text-gray-900">AED {c.daily_rate}</td>
                <td className="px-5 py-3">
                  <input
                    type="radio"
                    name="vehicle"
                    checked={selectedId === c.id}
                    onChange={() => onSelect(c.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                </td>
              </tr>
            ))}
            {filteredCars.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">No available cars match</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {car && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">{car.make} {car.model}</p>
            <p className="text-xs text-gray-500">
              {car.plate_number} • {car.body_type} • {car.seats} seats • {car.color}
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900">
            AED {car.daily_rate}
            <span className="text-xs text-gray-500"> / day</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default VehiclePicker;