import React, { useEffect, useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import CountryInput from './CountryInput';
import AppSelect from '../common/AppSelect';
import AppDatePicker from '../common/AppDatePicker';
import { RedwoodFormActions, RedwoodSection } from '../common/RedwoodPage';

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

const inputCls = 'app-field';

const empty = {
  name: '', phone: '', email: '', customer_type_id: '', nationality: '', gender: '',
  birth_date: '', job: '',
  address: '', residential_no: '', address_1: '', address_2: '', postal_code: '',
  national_id: '', id_issue_date: '', id_expiry_date: '',
  license_type_id: '', license_number: '', license_issue_date: '', license_expiry_date: '',
  notes: '',
};

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

  const setSelect = (key: keyof typeof empty) => (value: string) => setForm({ ...form, [key]: value });

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
    <form onSubmit={submit} className="redwood-form-grid">
      <div className="redwood-form-main">
      {error && (
        <div role="alert" className="alert alert-error"><span>{error}</span></div>
      )}

      {/* 1) Personal Info */}
      <RedwoodSection title="Personal information" description="Identity, customer type, and primary contact details.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Full Name *</label>
            <input value={form.name} onChange={set('name')} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Mobile *</label>
            <input value={form.phone} onChange={set('phone')} required placeholder="0501234567" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Customer Type *</label>
            <AppSelect value={form.customer_type_id} onChange={setSelect('customer_type_id')} placeholder="—" options={customerTypes.map((type) => ({ value: type.id, label: type.name }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Nationality *</label>
            <CountryInput
              value={form.nationality}
              onChange={(v) => setForm({ ...form, nationality: v })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Gender *</label>
            <AppSelect value={form.gender} onChange={setSelect('gender')} placeholder="—" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Birth Date *</label>
            <AppDatePicker value={form.birth_date} onChange={setSelect('birth_date')} placeholder="Select birth date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Job *</label>
            <input value={form.job} onChange={set('job')} required className={inputCls} />
          </div>
        </div>
      </RedwoodSection>

      {/* 2) Identification */}
      <RedwoodSection title="Identification" description="Government-issued identity document and validity.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">ID Number</label>
            <input value={form.national_id} onChange={set('national_id')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">ID Issue Date</label>
            <AppDatePicker value={form.id_issue_date} onChange={setSelect('id_issue_date')} placeholder="Select issue date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">ID Expiry Date</label>
            <AppDatePicker value={form.id_expiry_date} onChange={setSelect('id_expiry_date')} placeholder="Select expiry date" />
          </div>
        </div>
      </RedwoodSection>

      {/* 3) Driving License */}
      <RedwoodSection title="Driving license" description="License classification, number, and validity dates.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">License Type</label>
            <AppSelect value={form.license_type_id} onChange={setSelect('license_type_id')} placeholder="—" options={licenseTypes.map((type) => ({ value: type.id, label: type.name }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">License Number</label>
            <input value={form.license_number} onChange={set('license_number')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">License Issue Date</label>
            <AppDatePicker value={form.license_issue_date} onChange={setSelect('license_issue_date')} placeholder="Select issue date" />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">License Expiry Date</label>
            <AppDatePicker value={form.license_expiry_date} onChange={setSelect('license_expiry_date')} placeholder="Select expiry date" />
          </div>
        </div>
      </RedwoodSection>

      {/* 4) Address & Contact */}
      <RedwoodSection title="Address" description="Residential and mailing information for the customer.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Address 1</label>
            <input value={form.address_1} onChange={set('address_1')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Address 2</label>
            <input value={form.address_2} onChange={set('address_2')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Residential No</label>
            <input value={form.residential_no} onChange={set('residential_no')} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Postal Code</label>
            <input value={form.postal_code} onChange={set('postal_code')} className={inputCls} />
          </div>
        </div>
      </RedwoodSection>

      {/* Notes */}
      <RedwoodSection title="Internal notes" description="Operational notes are visible to staff managing this customer.">
        <label className="block text-sm font-medium text-base-content/80 mb-1">Notes</label>
        <textarea value={form.notes} onChange={set('notes')} rows={3} className="app-textarea" />
      </RedwoodSection>
      </div>

      <aside className="redwood-form-aside">
        <RedwoodSection title="Record guidance">
          <div className="space-y-4 text-sm leading-6 text-base-content/65">
            <ShieldCheck size={22} className="text-primary" aria-hidden />
            <p>Required fields establish the minimum customer record needed for a rental contract.</p>
            <p>Verify identity and license expiry dates before saving.</p>
          </div>
        </RedwoodSection>
      </aside>

      <div className="xl:col-span-2">
      <RedwoodFormActions message="Changes are validated before the record is saved.">
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>}
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary gap-2 disabled:opacity-60"
        >
          <Save size={16} aria-hidden /> {saving ? 'Saving…' : initial ? 'Update customer' : 'Save customer'}
        </button>
      </RedwoodFormActions>
      </div>
    </form>
  );
};

export default CustomerForm;
