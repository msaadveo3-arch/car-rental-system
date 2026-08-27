import React, { useCallback, useEffect, useState } from 'react';
import { Settings2, Plus, Pencil, Trash2, Check, X, Power } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import BorderFees from '../components/lookups/BorderFees';
import VehicleModels from '../components/lookups/VehicleModels';
import TariffsManager from '../components/lookups/TariffsManager';
import KmPoliciesManager from '../components/lookups/KmPoliciesManager';

type LookupType =
  | 'body_types' | 'fuel_types' | 'transmissions' | 'car_groups'
  | 'branches' | 'sources' | 'borders' | 'payment_methods' | 'currencies'
  | 'vehicle_makes' | 'vehicle_models'
  | 'engine_capacities' | 'technical_statuses' | 'colors' | 'customer_types' | 'license_types'
  | 'pricing_modes' | 'rental_types' | 'tariffs' | 'km_policies';

interface LookupItem {
  id: number;
  name: string;
  status: string;
  fee: string | null;
  label: string | null;
  rate: string | null;
  created_by_name: string | null;
  updated_by_name: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const TABS: { key: LookupType; label: string }[] = [
  { key: 'body_types', label: 'Body Types' },
  { key: 'fuel_types', label: 'Fuel Types' },
  { key: 'transmissions', label: 'Transmissions' },
    { key: 'car_groups', label: 'Vehicle Groups' },
  { key: 'branches', label: 'Branches' },
  { key: 'sources', label: 'Hirer Sources' },
  { key: 'borders', label: 'Cross Borders' },
  { key: 'payment_methods', label: 'Payment Methods' },
  { key: 'currencies', label: 'Currencies' },
  { key: 'vehicle_makes', label: 'Vehicle Makes' },
  { key: 'vehicle_models', label: 'Vehicle Models' },
  { key: 'engine_capacities', label: 'Engine Capacities' },
  { key: 'technical_statuses', label: 'Technical Statuses' },
  { key: 'colors', label: 'Colors' },
  { key: 'customer_types', label: 'Customer Types' },
  { key: 'license_types', label: 'License Types' },
  { key: 'pricing_modes', label: 'Pricing Modes' },
  { key: 'rental_types', label: 'Rental Types' },
  { key: 'tariffs', label: 'Tariffs' },
  { key: 'km_policies', label: 'KM Policies' },
];

const EXTRA_FIELDS: Record<string, { key: string; label: string; kind: 'number' | 'text'; badge?: string; step?: string; min?: string }[]> = {
  currencies: [
    { key: 'label', label: 'Label', kind: 'text' },
    { key: 'rate', label: 'Rate to AED', kind: 'number' },
  ],
  pricing_modes: [{ key: 'description', label: 'Description', kind: 'text' }],
  rental_types: [
    { key: 'min_days', label: 'Min Days', kind: 'number', step: '1', min: '1' },
    { key: 'max_days', label: 'Max Days', kind: 'number', step: '1', min: '1' },
    { key: 'description', label: 'Description', kind: 'text' },
  ],
};

const Lookups: React.FC = () => {
  const [active, setActive] = useState<LookupType>('body_types');
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newExtras, setNewExtras] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editExtras, setEditExtras] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const extras = EXTRA_FIELDS[active] ?? [];

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/lookups/${active}`)
      .then((r) => setItems(r.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [active]);

  useEffect(() => {
    setNewName('');
    setNewExtras({});
    setEditingId(null);
    setError('');
    load();
  }, [load]);

  const buildPayload = (name: string, ex: Record<string, string>) => {
    const payload: any = { name };
    extras.forEach((f) => {
      if (ex[f.key] !== undefined && ex[f.key] !== '') {
        payload[f.key] = f.kind === 'number' ? Number(ex[f.key]) || 0 : ex[f.key];
      }
    });
    return payload;
  };

  const add = async () => {
    if (!newName.trim()) return;
    setError('');
    try {
      await api.post(`/lookups/${active}`, buildPayload(newName.trim(), newExtras));
      setNewName('');
      setNewExtras({});
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add');
    }
  };

  const saveEdit = async (id: number) => {
    if (!editName.trim()) return;
    setError('');
    try {
      await api.put(`/lookups/${active}/${id}`, buildPayload(editName.trim(), editExtras));
      setEditingId(null);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const toggle = async (item: LookupItem) => {
    setError('');
    try {
      await api.put(`/lookups/${active}/${item.id}`, {
        status: item.status === 'active' ? 'inactive' : 'active',
      });
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const remove = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setError('');
    try {
      await api.delete(`/lookups/${active}/${id}`);
      load();
    } catch (e: any) {
      const msg = e.response?.data?.message ?? 'Failed to delete';
      setError(msg);
      window.alert(msg);
    }
  };

  const extraValue = (item: LookupItem, key: string): string | null =>
    (item as any)[key] ?? null;

  const colCount = 1 + extras.length + 4;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="text-blue-600" size={24} /> Lookups
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage catalog values — any change appears in the forms instantly
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                active === t.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {active !== 'borders' && active !== 'vehicle_models' && active !== 'tariffs' && active !== 'km_policies' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="Add new value..."
              className="flex-1 min-w-40 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {extras.map((f) => (
              <input
                key={f.key}
                value={newExtras[f.key] ?? ''}
                onChange={(e) => setNewExtras({ ...newExtras, [f.key]: e.target.value })}
                type={f.kind === 'number' ? 'number' : 'text'}
                step={f.step ?? '0.0001'}
                min={f.min}
                placeholder={f.label}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
            <button
              onClick={add}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    {extras.map((f) => (
                      <th key={f.key} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                        {f.label}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Updated</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className={item.status !== 'active' ? 'opacity-50' : ''}>
                      <td className="px-5 py-3">
                        {editingId === item.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-800">{item.name}</span>
                        )}
                      </td>

                      {extras.map((f) => (
                        <td key={f.key} className="px-5 py-3">
                          {editingId === item.id ? (
                            <input
                              value={editExtras[f.key] ?? ''}
                              onChange={(e) => setEditExtras({ ...editExtras, [f.key]: e.target.value })}
                              type={f.kind === 'number' ? 'number' : 'text'}
                              step={f.step ?? '0.0001'}
                              min={f.min}
                              className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          ) : f.badge ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                              {f.badge} {Number(extraValue(item, f.key) ?? 0)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-600">{extraValue(item, f.key) ?? '—'}</span>
                          )}
                        </td>
                      ))}

                      <td className="px-5 py-3">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full border ${
                            item.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <p className="text-sm text-gray-700">{item.created_by_name ?? '—'}</p>
                        <p className="text-xs text-gray-400">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <p className="text-sm text-gray-700">{item.updated_by_name ?? '—'}</p>
                        <p className="text-xs text-gray-400">
                          {item.updated_at ? new Date(item.updated_at).toLocaleString() : ''}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          {editingId === item.id ? (
                            <>
                              <button onClick={() => saveEdit(item.id)} title="Save" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                <Check size={16} />
                              </button>
                              <button onClick={() => setEditingId(null)} title="Cancel" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggle(item)}
                                title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                              >
                                <Power size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditName(item.name);
                                  const ex: Record<string, string> = {};
                                  extras.forEach((f) => {
                                    ex[f.key] = extraValue(item, f.key) ?? '';
                                  });
                                  setEditExtras(ex);
                                }}
                                title="Edit"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => remove(item.id, item.name)}
                                title="Delete"
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={colCount} className="px-5 py-8 text-center text-gray-400">No values yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {active === 'borders' && <BorderFees />}
        {active === 'vehicle_models' && <VehicleModels />}
        {active === 'tariffs' && <TariffsManager />}
        {active === 'km_policies' && <KmPoliciesManager />}
      </div>
    </DashboardLayout>
  );
};

export default Lookups;