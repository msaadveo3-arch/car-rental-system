import React, { useEffect, useState } from 'react';
import { Save, User, Fingerprint, KeyRound, MapPin } from 'lucide-react';
import api from '../../services/api';
import CountryInput from './CountryInput';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  id_type: string | null;
  customer_type_id: number | null;
  customer_type: string | null;
  national_id: string | null;
  id_issue_date: string | null;
  id_expiry_date: string | null;
  nationality: string | null;
  gender: string | null;
  birth_date: string | null;
  job: string | null;
  license_type_id: number | null;
  license_type: string | null;
  license_number: string | null;
  license_issue_date: string | null;
  license_expiry_date: string | null;
  address: string | null;
  residential_no: string | null;
  postal_code: string | null;
  address_1: string | null;
  address_2: string | null;
  notes: string | null;
  created_at: string | null;
}

const inputCls =
  'w-full px-4 py-2 border border-apple-dark-600 bg-apple-dark-700/50 rounded-apple focus:ring-2 focus:ring-apple-accent-blue focus:bg-apple-dark-600 outline-none text-apple-dark-50 placeholder-apple-dark-400';

const empty = {
  name: '', phone: '', email: '', customer_type_id: '', nationality: '', gender: '',
  birth_date: '', job: '',
  address: '', residential_no: '', address_1: '', address_2: '', postal_code: '',
  national_id: '', id_issue_date: '', id_expiry_date: '',
  license_type_id: '', license_number: '', license_issue_date: '', license_expiry_date: '',
  notes: '',
};

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-apple bg-apple-accent-blue/20 text-apple-accent-blue flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="text-lg font-bold text-apple-dark-50">{title}</h2>
      <p className="text-sm text-apple-dark-400">{subtitle}</p>
    </div>
  </div>
);

const CustomerForm: React.FC<{
  initial?: Customer | null;
  onSaved: (c: Customer) => void;
  onCancel?: () => void;
}> = ({ initial, onSaved, onCancel }) => {
  const [customerTypes, setCustomerTypes] = useState<{ id: number; name: string }[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    api.get('/lookups/customer_types').then((r) =>
      setCustomerTypes(r.data.data.filter((x: any) => x.status === 'active'))
    );
    api.get('/lookups/license_types').then((r) =>
      setLicenseTypes(r.data.data.filter((x: any) => x.status === 'active'))
    );
  }, []);

  const [form, setForm] = useState(() =>
    initial
      ? {
          name: initial.name ?? '', phone: initial.phone ?? '', email: initial.email ?? '',
          customer_type_id: initial.customer_type_id != null ? String(initial.customer_type_id) : '',
          nationality: initial.nationality ?? '', gender: initial.gender ?? '',
          birth_date: initial.birth_date ?? '', job: initial.job ?? '',
          address: initial.address ?? '', residential_no: initial.residential_no ?? '',
          address_1: initial.address_1 ?? '', address_2: initial.address_2 ?? '',
          postal_code: initial.postal_code ?? '',
          national_id: initial.national_id ?? '',
          id_issue_date: initial.id_issue_date ?? '', id_expiry_date: initial.id_expiry_date ?? '',
          license_type_id: initial.license_type_id != null ? String(initial.license_type_id) : '',
          license_number: initial.license_number ?? '',
          license_issue_date: initial.license_issue_date ?? '',
          license_expiry_date: initial.license_expiry_date ?? '',
          notes: initial.notes ?? '',
        }
      : empty
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set =
    (k: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const r = initial
        ? await api.put(`/customers/${initial.id}`, form)
        : await api.post('/customers', form);
      onSaved(r.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save customer');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-apple text-sm">{error}</div>
      )}

      {/* 1) Personal Info */}
      <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
        <SectionTitle
          icon={<User size={20} />}
          title="Personal Info"
          subtitle="Who this customer is and how to reach them"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Full Name *</label>
            <input value={form.name} onChange={set('name')} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Mobile *</label>
            <input value={form.phone} onChange={set('phone')} required placeholder="0501234567" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Customer Type *</label>
            <select value={form.customer_type_id} onChange={set('customer_type_id')} required className={inputCls}>
              <option value="">—</option>
              {customerTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Nationality *</label>
            <CountryInput
              value={form.nationality}
              onChange={(v) => setForm({ ...form, nationality: v })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Gender *</label>
            <select value={form.gender} onChange={set('gender')} required className={inputCls}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Birth Date *</label>
            <input type="date" value={form.birth_date} onChange={set('birth_date')} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Job *</label>
            <input value={form.job} onChange={set('job')} required className={inputCls} />
          </div>
        </div>
      </div>

      {/* 2) Identification */}
      <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
        <SectionTitle
          icon={<Fingerprint size={20} />}
          title="Identification"
          subtitle="ID document details"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">ID Number</label>
            <input value={form.national_id} onChange={set('national_id')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">ID Issue Date</label>
            <input type="date" value={form.id_issue_date} onChange={set('id_issue_date')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">ID Expiry Date</label>
            <input type="date" value={form.id_expiry_date} onChange={set('id_expiry_date')} className={inputCls} />
          </div>
        </div>
      </div>

      {/* 3) Driving License */}
      <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
        <SectionTitle
          icon={<KeyRound size={20} />}
          title="Driving License"
          subtitle="License details and validity"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">License Type</label>
            <select value={form.license_type_id} onChange={set('license_type_id')} className={inputCls}>
              <option value="">—</option>
              {licenseTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">License Number</label>
            <input value={form.license_number} onChange={set('license_number')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">License Issue Date</label>
            <input type="date" value={form.license_issue_date} onChange={set('license_issue_date')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">License Expiry Date</label>
            <input type="date" value={form.license_expiry_date} onChange={set('license_expiry_date')} className={inputCls} />
          </div>
        </div>
      </div>

      {/* 4) Address & Contact */}
      <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
        <SectionTitle
          icon={<MapPin size={20} />}
          title="Address & Contact"
          subtitle="Where to reach the customer"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Address 1</label>
            <input value={form.address_1} onChange={set('address_1')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Address 2</label>
            <input value={form.address_2} onChange={set('address_2')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Residential No</label>
            <input value={form.residential_no} onChange={set('residential_no')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-apple-dark-300 mb-1">Postal Code</label>
            <input value={form.postal_code} onChange={set('postal_code')} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-apple-dark-800/50 backdrop-blur-xs rounded-apple-xl shadow-apple border border-apple-dark-700/50 p-6">
        <label className="block text-sm font-medium text-apple-dark-300 mb-1">Notes</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2} className={inputCls} />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-apple-accent-blue text-white rounded-apple hover:bg-apple-accent-blue/90 font-medium flex items-center gap-2 disabled:opacity-60 shadow-apple transition-colors"
        >
          <Save size={16} /> {saving ? 'Saving...' : initial ? 'Update Customer' : 'Save Customer'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;