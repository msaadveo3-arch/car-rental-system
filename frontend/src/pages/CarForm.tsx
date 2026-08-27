import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CarFront, ArrowLeft, Save, Wrench, Briefcase } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

interface Lookup {
  id: number;
  name: string;
}

interface VehicleModel extends Lookup {
  make_id: number;
}

interface Lookups {
  body_types: Lookup[];
  fuel_types: Lookup[];
  transmissions: Lookup[];
  car_groups: Lookup[];
  vehicle_makes: Lookup[];
  vehicle_models: VehicleModel[];
  engine_capacities: Lookup[];
  technical_statuses: Lookup[];
  colors: Lookup[];
}

interface FormState {
  make_id: string;
  vehicle_model_id: string;
  body_type_id: string;
  seats: string;
  fuel_type_id: string;
  engine_capacity_id: string;
  horsepower: string;
  transmission_id: string;
  group_id: string;
  plate_number: string;
  vin: string;
  registration_number: string;
  registration_expiry: string;
  year: string;
  manufacture_year: string;
  color_id: string;
  technical_status_id: string;
  daily_rate: string;
  monthly_rate: string;
  status: string;
  location: string;
  mileage: string;
  fuel_level: string;
}

const emptyForm: FormState = {
  make_id: '', vehicle_model_id: '', body_type_id: '', seats: '', fuel_type_id: '',
  engine_capacity_id: '', horsepower: '', transmission_id: '', group_id: '',
  plate_number: '', vin: '', registration_number: '', registration_expiry: '',
  year: '', manufacture_year: '', color_id: '', technical_status_id: '',
  daily_rate: '', monthly_rate: '',
  status: 'available', location: '', mileage: '0', fuel_level: 'full',
};

const inputCls =
  'w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({
  icon,
  title,
  desc,
}) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  </div>
);

const CarForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [lookups, setLookups] = useState<Lookups>({
    body_types: [], fuel_types: [], transmissions: [], car_groups: [],
    vehicle_makes: [], vehicle_models: [],
    engine_capacities: [], technical_statuses: [], colors: [],
  });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/lookups').then((r) => setLookups(r.data.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get('/cars')
      .then((r) => {
        const car = r.data.data.find((c: any) => c.id === Number(id));
        if (car) {
          setForm({
            make_id: car.make_lookup_id != null ? String(car.make_lookup_id) : '',
            vehicle_model_id: car.model_lookup_id != null ? String(car.model_lookup_id) : '',
            body_type_id: car.body_type_id != null ? String(car.body_type_id) : '',
            seats: car.seats != null ? String(car.seats) : '',
            fuel_type_id: car.fuel_type_id != null ? String(car.fuel_type_id) : '',
            engine_capacity_id: car.engine_capacity_id != null ? String(car.engine_capacity_id) : '',
            horsepower: car.horsepower != null ? String(car.horsepower) : '',
            transmission_id: car.transmission_id != null ? String(car.transmission_id) : '',
            group_id: car.group_id != null ? String(car.group_id) : '',
            plate_number: car.plate_number ?? '', vin: car.vin ?? '',
            registration_number: car.registration_number ?? '',
            registration_expiry: car.registration_expiry ?? '',
            year: String(car.year ?? ''),
            manufacture_year: car.manufacture_year != null ? String(car.manufacture_year) : '',
            color_id: car.color_id != null ? String(car.color_id) : '',
            technical_status_id: car.technical_status_id != null ? String(car.technical_status_id) : '',
            daily_rate: car.daily_rate ?? '', monthly_rate: car.monthly_rate ?? '',
            status: car.status ?? 'available', location: car.location ?? '',
            mileage: String(car.mileage ?? 0), fuel_level: car.fuel_level ?? 'full',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'make_id') {
      setForm({ ...form, make_id: value, vehicle_model_id: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const modelsOfMake = lookups.vehicle_models.filter(
    (m) => String(m.make_id) === form.make_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/cars/${id}`, form);
      } else {
        await api.post('/cars', form);
      }
      navigate('/cars');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save car');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/cars" className="p-2 hover:bg-gray-200 rounded-lg text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CarFront className="text-blue-600" size={24} />
                {isEdit ? `Edit Car #${id}` : 'Add New Car'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isEdit ? 'Update vehicle information' : 'Register a new vehicle in the fleet'}
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">Loading...</div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8"
            >
              {/* 1) Vehicle Identity */}
              <div>
                <SectionHeader
                  icon={<CarFront size={16} />}
                  title="Vehicle Identity"
                  desc="What identifies this exact unit"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                    <select name="make_id" value={form.make_id} onChange={handleChange} required className={inputCls}>
                      <option value="">— Choose make —</option>
                      {lookups.vehicle_makes.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                    <select
                      name="vehicle_model_id"
                      value={form.vehicle_model_id}
                      onChange={handleChange}
                      required
                      disabled={!form.make_id}
                      className={inputCls}
                    >
                      <option value="">— Choose model —</option>
                      {modelsOfMake.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    {form.make_id && modelsOfMake.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">
                        No models for this make — add them from Lookups → Vehicle Models
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Year *</label>
                    <input name="year" type="number" value={form.year} onChange={handleChange} required placeholder="2024" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Year</label>
                    <input name="manufacture_year" type="number" value={form.manufacture_year} onChange={handleChange} placeholder="2023" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select name="color_id" value={form.color_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.colors.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
                    <input name="plate_number" value={form.plate_number} onChange={handleChange} required placeholder="DUB-005" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN (Chassis)</label>
                    <input name="vin" value={form.vin} onChange={handleChange} placeholder="VH-77281" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration #</label>
                    <input name="registration_number" value={form.registration_number} onChange={handleChange} placeholder="REG-10005" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry</label>
                    <input name="registration_expiry" type="date" value={form.registration_expiry} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* 2) Technical Specs */}
              <div>
                <SectionHeader
                  icon={<Wrench size={16} />}
                  title="Technical Specs"
                  desc="Factory catalog specifications"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                    <select name="body_type_id" value={form.body_type_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.body_types.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                    <input name="seats" type="number" value={form.seats} onChange={handleChange} placeholder="7" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select name="fuel_type_id" value={form.fuel_type_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.fuel_types.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity</label>
                    <select name="engine_capacity_id" value={form.engine_capacity_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.engine_capacities.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horsepower</label>
                    <input name="horsepower" type="number" value={form.horsepower} onChange={handleChange} placeholder="409" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                    <select name="transmission_id" value={form.transmission_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.transmissions.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Group</label>
                    <select name="group_id" value={form.group_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.car_groups.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3) Operations & Pricing */}
              <div>
                <SectionHeader
                  icon={<Briefcase size={16} />}
                  title="Operations & Pricing"
                  desc="Daily business: rates, status, and current condition"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (AED)</label>
                    <input name="daily_rate" type="number" step="0.01" value={form.daily_rate} onChange={handleChange} placeholder="250" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (AED)</label>
                    <input name="monthly_rate" type="number" step="0.01" value={form.monthly_rate} onChange={handleChange} placeholder="5000" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="out_of_service">Out of Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technical Status</label>
                    <select name="technical_status_id" value={form.technical_status_id} onChange={handleChange} className={inputCls}>
                      <option value="">—</option>
                      {lookups.technical_statuses.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Main Branch" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                    <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Level</label>
                    <select name="fuel_level" value={form.fuel_level} onChange={handleChange} className={inputCls}>
                      <option value="full">Full</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                      <option value="empty">Empty</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Link to="/cars" className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-70"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : isEdit ? 'Update Car' : 'Save Car'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CarForm;