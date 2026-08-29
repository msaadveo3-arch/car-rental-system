import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Settings2, Plus, Pencil, Trash2, Check, X, Power, Search } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import BorderFees from '../components/lookups/BorderFees';
import VehicleModels from '../components/lookups/VehicleModels';
import TariffsManager from '../components/lookups/TariffsManager';
import KmPoliciesManager from '../components/lookups/KmPoliciesManager';
import AppSelect from '../components/common/AppSelect';

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
  const [search, setSearch] = useState('');

  const extras = EXTRA_FIELDS[active] ?? [];
  const isGenericLookup = !['borders', 'vehicle_models', 'tariffs', 'km_policies'].includes(active);

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/lookups/${active}`)
      .then((r) => setItems(r.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [active]);

  useEffect(() => {
    setSearch('');
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

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      [
        item.name,
        item.status,
        item.created_by_name,
        item.updated_by_name,
        ...extras.map((field) => extraValue(item, field.key)),
      ].some((value) => String(value ?? '').toLowerCase().includes(query)),
    );
  }, [extras, items, search]);

  const colCount = 1 + extras.length + 4;

  return (
    <DashboardLayout>
      <div className="app-page">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Settings2 className="text-primary" size={24} /> Lookups
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Manage catalog values — any change appears in the forms instantly
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="w-full sm:w-64">
              <AppSelect
                value={active}
                onChange={(value) => setActive(value as LookupType)}
                options={TABS.map((tab) => ({ value: tab.key, label: tab.label }))}
                aria-label="Lookup category"
              />
            </div>
            <div className="relative w-full sm:w-80">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60"
                size={18}
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search lookup values..."
                aria-label="Search lookup values"
                className="input input-bordered h-12 min-h-12 w-full bg-base-100 pl-10 pr-4 focus:outline-primary"
              />
            </div>
          </div>

          {isGenericLookup && (
            <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto lg:flex-1">
              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && add()}
                placeholder="Add new lookup..."
                aria-label="New lookup value"
                className="input input-bordered h-12 min-h-12 min-w-56 flex-1 bg-base-100 lg:max-w-md"
              />
              {extras.map((field) => (
                <input
                  key={field.key}
                  value={newExtras[field.key] ?? ''}
                  onChange={(event) => setNewExtras({ ...newExtras, [field.key]: event.target.value })}
                  type={field.kind === 'number' ? 'number' : 'text'}
                  step={field.step ?? '0.0001'}
                  min={field.min}
                  placeholder={field.label}
                  aria-label={field.label}
                  className="input input-bordered h-12 min-h-12 w-36 bg-base-100"
                />
              ))}
              <button onClick={add} className="btn btn-primary h-12 min-h-12 gap-2 whitespace-nowrap">
                <Plus size={16} aria-hidden="true" /> Add
              </button>
            </div>
          )}
        </div>

        {isGenericLookup && (
        <div className="space-y-4">

          {loading ? (
            <div className="p-8 text-center text-base-content/60">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead className="bg-base-200 border-b border-base-300">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Name</th>
                    {extras.map((f) => (
                      <th key={f.key} className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">
                        {f.label}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Created</th>
                    <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Updated</th>
                    <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className={item.status !== 'active' ? 'opacity-50' : ''}>
                      <td className="px-5 py-3">
                        {editingId === item.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                            className="w-full px-3 py-1.5 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-base-content">{item.name}</span>
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
                              className="w-28 px-3 py-1.5 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            />
                          ) : f.badge ? (
                            <span className="badge badge-warning badge-sm">
                              {f.badge} {Number(extraValue(item, f.key) ?? 0)}
                            </span>
                          ) : (
                            <span className="text-sm text-base-content/80">{extraValue(item, f.key) ?? '—'}</span>
                          )}
                        </td>
                      ))}

                      <td className="px-5 py-3">
                        <span
                          className={`badge badge-sm capitalize ${
                            item.status === 'active'
                              ? 'badge-success'
                              : 'badge-ghost'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <p className="text-sm text-base-content/80">{item.created_by_name ?? '—'}</p>
                        <p className="text-xs text-base-content/60">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <p className="text-sm text-base-content/80">{item.updated_by_name ?? '—'}</p>
                        <p className="text-xs text-base-content/60">
                          {item.updated_at ? new Date(item.updated_at).toLocaleString() : ''}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          {editingId === item.id ? (
                            <>
                              <button onClick={() => saveEdit(item.id)} title="Save" className="p-2 text-success hover:bg-success/10 rounded-lg">
                                <Check size={16} />
                              </button>
                              <button onClick={() => setEditingId(null)} title="Cancel" className="p-2 text-base-content/60 hover:bg-base-200 rounded-lg">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggle(item)}
                                title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                                className="p-2 text-warning hover:bg-warning/10 rounded-lg"
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
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => remove(item.id, item.name)}
                                title="Delete"
                                className="p-2 text-error hover:bg-error/10 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={colCount} className="px-5 py-8 text-center text-base-content/60">
                        {items.length === 0 ? 'No values yet' : 'No lookup values match your search'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {active === 'borders' && <BorderFees searchQuery={search} />}
        {active === 'vehicle_models' && <VehicleModels searchQuery={search} />}
        {active === 'tariffs' && <TariffsManager searchQuery={search} />}
        {active === 'km_policies' && <KmPoliciesManager searchQuery={search} />}
      </div>
    </DashboardLayout>
  );
};

export default Lookups;
