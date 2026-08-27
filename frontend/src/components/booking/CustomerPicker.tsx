import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, UserPlus, Pencil } from 'lucide-react';
import api from '../../services/api';
import CustomerForm, { Customer } from '../customers/CustomerForm';

const initials = (name: string) =>
  name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const Field: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
  </div>
);

interface Props {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClear: () => void;
  onChanged: () => void;
}

const CustomerPicker: React.FC<Props> = ({ selectedId, onSelect, onClear, onChanged }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [formMode, setFormMode] = useState<'new' | 'edit' | null>(null);

  useEffect(() => {
    setCollapsed(false);
  }, [selectedId]);

  useEffect(() => {
    api.get('/customers').then((r) => setCustomers(r.data.data));
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return customers
      .filter(
        (c) =>
          (c.name ?? '').toLowerCase().includes(s) ||
          (c.phone ?? '').toLowerCase().includes(s) ||
          (c.email ?? '').toLowerCase().includes(s) ||
          (c.national_id ?? '').toLowerCase().includes(s) ||
          (c.license_number ?? '').toLowerCase().includes(s)
      )
      .slice(0, 5);
  }, [q, customers]);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const handleSaved = (c: Customer) => {
    setCustomers((prev) =>
      prev.some((p) => p.id === c.id) ? prev.map((p) => (p.id === c.id ? c : p)) : [c, ...prev]
    );
    onChanged();
    onSelect(c.id);
    setFormMode(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, phone, ID, or license..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => setFormMode((v) => (v === 'new' ? null : 'new'))}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <UserPlus size={18} /> New Customer
        </button>
      </div>

      {formMode === 'new' && (
        <CustomerForm onSaved={handleSaved} onCancel={() => setFormMode(null)} />
      )}

      {formMode === 'edit' && selected && (
        <CustomerForm initial={selected} onSaved={handleSaved} onCancel={() => setFormMode(null)} />
      )}

      {results.map((c) => (
        <div
          key={c.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
              {initials(c.name)}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-500">
                {c.phone}{c.national_id ? ` • Emirates ID: ${c.national_id}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { onSelect(c.id); setQ(''); }}
            className="px-7 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Select
          </button>
        </div>
      ))}

      {selected && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold flex items-center justify-center shrink-0">
              {initials(selected.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => setCollapsed((v) => !v)}
                  title={collapsed ? 'Expand' : 'Collapse'}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                >
                  {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              {collapsed ? (
                <p className="text-sm text-gray-500">
                  {selected.phone}
                  {selected.national_id ? ` • Emirates ID: ${selected.national_id}` : ''}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                    <Field label="Full Name" value={selected.name} />
                    <Field label="Phone" value={selected.phone} />
                    <Field label="Email" value={selected.email} />
                    <Field label="Nationality" value={selected.nationality} />
                    <Field label="Gender" value={selected.gender} />
                    <Field label="Birth Date" value={selected.birth_date} />
                    <Field label="Job" value={selected.job} />
                    <Field label="ID Number" value={selected.national_id} />
                    <Field label="ID Expiry" value={selected.id_expiry_date} />
                    <Field label="License Type" value={selected.license_type} />
                    <Field label="License Number" value={selected.license_number} />
                    <Field label="License Expiry" value={selected.license_expiry_date} />
                    <div className="col-span-2 md:col-span-3">
                      <Field label="Address" value={selected.address} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Customer since{' '}
                      {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : '—'}
                    </p>
                    <button
                      onClick={() => setFormMode('edit')}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPicker;