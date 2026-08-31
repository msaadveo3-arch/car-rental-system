import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Settings2, Plus, Pencil, Trash2, Check, X, Power } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import BorderFees from '../components/lookups/BorderFees';
import VehicleModels from '../components/lookups/VehicleModels';
import TariffsManager from '../components/lookups/TariffsManager';
import KmPoliciesManager from '../components/lookups/KmPoliciesManager';
import AppSelect from '../components/common/AppSelect';
import { RedwoodCollectionToolbar, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

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
      <RedwoodPage>
        <RedwoodPageHeader
          eyebrow="Application setup"
          title="Reference data"
          description="Manage controlled catalog values used across vehicles, customers, pricing, and contracts."
          icon={<Settings2 size={21} />}
        />

        {error && (
          <div role="alert" className="alert alert-error"><span>{error}</span></div>
        )}

        <RedwoodSection
          title={TABS.find((tab) => tab.key === active)?.label ?? 'Reference data'}
          description="Changes apply immediately to the corresponding application forms."
          contentMode="flush"
        >
          <RedwoodCollectionToolbar
            search={{ value: search, onChange: setSearch, placeholder: 'Search reference values' }}
            filters={
              <AppSelect
                value={active}
                onChange={(value) => setActive(value as LookupType)}
                size="sm"
                className="w-56"
                options={TABS.map((tab) => ({ value: tab.key, label: tab.label }))}
                aria-label="Lookup category"
              />
            }
            summary={isGenericLookup ? `${filteredItems.length} of ${items.length} values` : undefined}
          />

          {isGenericLookup && (
            <div className="redwood-inline-create">
              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && add()}
                placeholder="Add new lookup..."
                aria-label="New lookup value"
                className="app-field min-w-56 flex-1 lg:max-w-md"
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
                  className="app-field w-40"
                />
              ))}
              <button onClick={add} className="btn btn-primary gap-2 whitespace-nowrap">
                <Plus size={16} aria-hidden="true" /> Add
              </button>
            </div>
          )}

        {isGenericLookup && (
        <div className="space-y-4">

          {loading ? (
            <div className="p-8 text-center text-base-content/60">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    {extras.map((f) => (
                      <th key={f.key}>
                        {f.label}
                      </th>
                    ))}
                    <th>Status</th><th>Created</th><th>Updated</th><th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-base-300">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className={item.status !== 'active' ? 'opacity-50' : ''}>
                      <td>
                        {editingId === item.id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                            className="app-field-sm w-full"
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
                              className="app-field-sm w-28"
                            />
                          ) : f.badge ? (
                            <span className="badge badge-warning">
                              {f.badge} {Number(extraValue(item, f.key) ?? 0)}
                            </span>
                          ) : (
                            <span className="text-sm text-base-content/80">{extraValue(item, f.key) ?? '—'}</span>
                          )}
                        </td>
                      ))}

                      <td>
                        <span
                          className={`badge capitalize ${
                            item.status === 'active'
                              ? 'badge-success'
                              : 'badge-ghost'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <p className="text-sm text-base-content/80">{item.created_by_name ?? '—'}</p>
                        <p className="text-xs text-base-content/60">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
                        </p>
                      </td>

                      <td>
                        <p className="text-sm text-base-content/80">{item.updated_by_name ?? '—'}</p>
                        <p className="text-xs text-base-content/60">
                          {item.updated_at ? new Date(item.updated_at).toLocaleString() : ''}
                        </p>
                      </td>

                      <td>
                        <div className="flex items-center gap-1">
                          {editingId === item.id ? (
                            <>
                              <button type="button" onClick={() => saveEdit(item.id)} title="Save" aria-label={`Save ${item.name}`} className="btn btn-ghost btn-square btn-sm text-success">
                                <Check size={16} aria-hidden />
                              </button>
                              <button type="button" onClick={() => setEditingId(null)} title="Cancel" aria-label={`Cancel editing ${item.name}`} className="btn btn-ghost btn-square btn-sm">
                                <X size={16} aria-hidden />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => toggle(item)}
                                title={item.status === 'active' ? 'Deactivate' : 'Activate'}
                                aria-label={`${item.status === 'active' ? 'Deactivate' : 'Activate'} ${item.name}`}
                                className="btn btn-ghost btn-square btn-sm text-warning"
                              >
                                <Power size={16} aria-hidden />
                              </button>
                              <button
                                type="button"
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
                                aria-label={`Edit ${item.name}`}
                                className="btn btn-ghost btn-square btn-sm text-primary"
                              >
                                <Pencil size={16} aria-hidden />
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(item.id, item.name)}
                                title="Delete"
                                aria-label={`Delete ${item.name}`}
                                className="btn btn-ghost btn-square btn-sm text-error"
                              >
                                <Trash2 size={16} aria-hidden />
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
        </RedwoodSection>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default Lookups;
