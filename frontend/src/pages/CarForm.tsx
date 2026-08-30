import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CarFront, Save, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import AppSelect from '../components/common/AppSelect';
import AppDatePicker from '../components/common/AppDatePicker';
import { RedwoodContextItem, RedwoodFormActions, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

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

const inputCls = 'app-field';

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

  const handleSelectChange = (name: keyof FormState) => (value: string) => {
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
      <RedwoodPage>
          <RedwoodPageHeader
            eyebrow={isEdit ? 'Advanced edit' : 'Advanced create'}
            title={isEdit ? `Vehicle ${form.plate_number || `#${id}`}` : 'Add vehicle'}
            description={isEdit ? 'Update identity, factory specifications, and operational readiness.' : 'Register a fleet vehicle with its identity, specifications, and operating rates.'}
            icon={<CarFront size={21} />}
            backLabel="Vehicles"
            onBack={() => navigate('/cars')}
            context={isEdit && form.plate_number ? <><RedwoodContextItem label="Plate" value={form.plate_number} /><RedwoodContextItem label="Status" value={form.status.replace('_', ' ')} /></> : undefined}
          />

          {error && (
            <div role="alert" className="alert alert-error"><span>{error}</span></div>
          )}

          {loading ? (
      <div className="app-card p-12 text-center text-base-content/60">Loading…</div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="redwood-form-grid"
            >
              <div className="redwood-form-main">
              {/* 1) Vehicle Identity */}
              <RedwoodSection title="Vehicle identity" description="Registration and identifying information for this exact fleet unit.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Make *</label>
                    <AppSelect value={form.make_id} onChange={handleSelectChange('make_id')} placeholder="— Choose make —" options={lookups.vehicle_makes.map((make) => ({ value: make.id, label: make.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Model *</label>
                    <AppSelect value={form.vehicle_model_id} onChange={handleSelectChange('vehicle_model_id')} placeholder="— Choose model —" isDisabled={!form.make_id} options={modelsOfMake.map((model) => ({ value: model.id, label: model.name }))} />
                    {form.make_id && modelsOfMake.length === 0 && (
                      <p className="text-xs text-warning mt-1">
                        No models for this make — add them from Lookups → Vehicle Models
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Model Year *</label>
                    <input name="year" type="number" value={form.year} onChange={handleChange} required placeholder="2024" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Manufacture Year</label>
                    <input name="manufacture_year" type="number" value={form.manufacture_year} onChange={handleChange} placeholder="2023" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Color</label>
                    <AppSelect value={form.color_id} onChange={handleSelectChange('color_id')} placeholder="—" options={lookups.colors.map((color) => ({ value: color.id, label: color.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Plate Number *</label>
                    <input name="plate_number" value={form.plate_number} onChange={handleChange} required placeholder="DUB-005" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">VIN (Chassis)</label>
                    <input name="vin" value={form.vin} onChange={handleChange} placeholder="VH-77281" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Registration #</label>
                    <input name="registration_number" value={form.registration_number} onChange={handleChange} placeholder="REG-10005" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Registration Expiry</label>
                    <AppDatePicker value={form.registration_expiry} onChange={handleSelectChange('registration_expiry')} placeholder="Select registration expiry" />
                  </div>
                </div>
              </RedwoodSection>

              {/* 2) Technical Specs */}
              <RedwoodSection title="Technical specifications" description="Factory configuration used for fleet classification and matching.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Body Type</label>
                    <AppSelect value={form.body_type_id} onChange={handleSelectChange('body_type_id')} placeholder="—" options={lookups.body_types.map((bodyType) => ({ value: bodyType.id, label: bodyType.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Seats</label>
                    <input name="seats" type="number" value={form.seats} onChange={handleChange} placeholder="7" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Fuel Type</label>
                    <AppSelect value={form.fuel_type_id} onChange={handleSelectChange('fuel_type_id')} placeholder="—" options={lookups.fuel_types.map((fuelType) => ({ value: fuelType.id, label: fuelType.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Engine Capacity</label>
                    <AppSelect value={form.engine_capacity_id} onChange={handleSelectChange('engine_capacity_id')} placeholder="—" options={lookups.engine_capacities.map((capacity) => ({ value: capacity.id, label: capacity.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Horsepower</label>
                    <input name="horsepower" type="number" value={form.horsepower} onChange={handleChange} placeholder="409" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Transmission</label>
                    <AppSelect value={form.transmission_id} onChange={handleSelectChange('transmission_id')} placeholder="—" options={lookups.transmissions.map((transmission) => ({ value: transmission.id, label: transmission.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Vehicle Group</label>
                    <AppSelect value={form.group_id} onChange={handleSelectChange('group_id')} placeholder="—" options={lookups.car_groups.map((group) => ({ value: group.id, label: group.name }))} />
                  </div>
                </div>
              </RedwoodSection>

              {/* 3) Operations & Pricing */}
              <RedwoodSection title="Operations and pricing" description="Rental rates, current location, mileage, and operating condition.">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Daily Rate (AED)</label>
                    <input name="daily_rate" type="number" step="0.01" value={form.daily_rate} onChange={handleChange} placeholder="250" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Monthly Rate (AED)</label>
                    <input name="monthly_rate" type="number" step="0.01" value={form.monthly_rate} onChange={handleChange} placeholder="5000" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Status</label>
                    <AppSelect value={form.status} onChange={handleSelectChange('status')} options={[{ value: 'available', label: 'Available' }, { value: 'rented', label: 'Rented' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'out_of_service', label: 'Out of Service' }]} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Technical Status</label>
                    <AppSelect value={form.technical_status_id} onChange={handleSelectChange('technical_status_id')} placeholder="—" options={lookups.technical_statuses.map((status) => ({ value: status.id, label: status.name }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Main Branch" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Mileage (km)</label>
                    <input name="mileage" type="number" value={form.mileage} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Fuel Level</label>
                    <AppSelect value={form.fuel_level} onChange={handleSelectChange('fuel_level')} options={['full', 'high', 'medium', 'low', 'empty'].map((level) => ({ value: level, label: level[0].toUpperCase() + level.slice(1) }))} />
                  </div>
                </div>
              </RedwoodSection>
              </div>

              <aside className="redwood-form-aside">
                <RedwoodSection title="Fleet readiness">
                  <div className="space-y-4 text-sm leading-6 text-base-content/65">
                    <ShieldCheck size={22} className="text-primary" aria-hidden />
                    <p>Registration, technical status, pricing, mileage, and fuel level determine whether this vehicle is ready for assignment.</p>
                    <dl className="space-y-2 border-t border-base-300 pt-3">
                      <div className="flex justify-between gap-3"><dt>Status</dt><dd className="font-semibold capitalize text-base-content">{form.status.replace('_', ' ')}</dd></div>
                      <div className="flex justify-between gap-3"><dt>Mileage</dt><dd className="font-semibold text-base-content">{Number(form.mileage || 0).toLocaleString()} km</dd></div>
                    </dl>
                  </div>
                </RedwoodSection>
              </aside>

              <div className="xl:col-span-2">
              <RedwoodFormActions message="Required identity fields must be complete before saving.">
                <button type="button" onClick={() => navigate('/cars')} className="btn btn-ghost">Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
            className="btn btn-primary gap-2 disabled:opacity-70"
                >
                  <Save size={18} aria-hidden />
                  {saving ? 'Saving…' : isEdit ? 'Update vehicle' : 'Save vehicle'}
                </button>
              </RedwoodFormActions>
              </div>
            </form>
          )}
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default CarForm;
