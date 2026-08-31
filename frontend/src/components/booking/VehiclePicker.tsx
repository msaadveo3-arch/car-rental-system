import React, { useEffect, useMemo, useState } from 'react';
import { CarFront } from 'lucide-react';
import api from '../../services/api';
import AppSelect from '../common/AppSelect';
import { RedwoodCollectionToolbar, RedwoodEmptyState, RedwoodSection } from '../common/RedwoodPage';

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
      <RedwoodSection title="Available vehicles" description="Choose one ready vehicle for this contract." contentMode="flush">
        <RedwoodCollectionToolbar
          search={{ value: search, onChange: setSearch, placeholder: 'Search make, model, or plate' }}
          filters={
            <>
              <AppSelect
                value={makeFilter}
                onChange={setMakeFilter}
                size="sm"
                className="w-44"
                aria-label="Filter by make"
                options={[{ value: 'all', label: 'All makes' }, ...makes.map((make) => ({ value: make, label: make }))]}
              />
              <AppSelect
                value={groupFilter}
                onChange={setGroupFilter}
                size="sm"
                className="w-44"
                aria-label="Filter by vehicle group"
                options={[{ value: 'all', label: 'All groups' }, ...groups.map((group) => ({ value: group, label: group }))]}
              />
            </>
          }
          summary={`${filteredCars.length} available`}
        />
        {filteredCars.length === 0 ? (
          <RedwoodEmptyState icon={<CarFront size={22} />} title="No available vehicles match" description="Adjust the search, make, or group filters to see other available vehicles." />
        ) : (
        <div className="overflow-x-auto">
        <table className="app-table">
          <thead>
            <tr>
              <th>Vehicle</th><th>Year / km</th><th>Fuel</th><th>Engine</th><th>Daily rate</th><th>Select</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-base-300">
            {filteredCars.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`cursor-pointer ${selectedId === c.id ? 'bg-primary/10' : 'hover:bg-base-200/60'}`}
              >
                <td>
                  <p className="font-semibold text-base-content">{c.make} {c.model}</p>
                  <span className="text-xs text-base-content/60">{c.car_group} • {c.plate_number}</span>
                </td>
                <td className="text-base-content/80">
                  {c.year}
                  <span className="block text-xs text-base-content/60">{Number(c.mileage).toLocaleString()} km</span>
                </td>
                <td className="text-base-content/80">{c.fuel_type}</td>
                <td className="text-base-content/80">{c.engine_capacity ?? '—'} / {c.horsepower} HP</td>
                <td className="font-semibold text-base-content">AED {c.daily_rate}</td>
                <td>
                  <input
                    type="radio"
                    name="vehicle"
                    checked={selectedId === c.id}
                    onChange={() => onSelect(c.id)}
                    className="radio radio-primary radio-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
      </RedwoodSection>

      {car && (
        <div className="redwood-selection-summary">
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
