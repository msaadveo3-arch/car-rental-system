import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Power } from 'lucide-react';
import api from '../../services/api';
import AppSelect from '../common/AppSelect';

interface Policy {
  id: number;
  rental_type_id: number;
  group_id: number;
  max_km: number;
  extra_km_rate: string;
  unlimited_daily_amount: string;
  status: string;
  rental_type: string;
  group_name: string;
}

interface Opt {
  id: number;
  name: string;
}

type KmPoliciesManagerProps = {
  searchQuery?: string;
};

const inputCls = 'app-field';

const labelCls = 'block text-sm font-medium text-base-content/80 mb-1';

const KmPoliciesManager: React.FC<KmPoliciesManagerProps> = ({ searchQuery = '' }) => {
  const [rows, setRows] = useState<Policy[]>([]);
  const [rtypes, setRtypes] = useState<Opt[]>([]);
  const [groups, setGroups] = useState<Opt[]>([]);

  const [rType, setRType] = useState('');
  const [group, setGroup] = useState('');
  const [maxKm, setMaxKm] = useState('250');
  const [extra, setExtra] = useState('2');
  const [unl, setUnl] = useState('50');

  const [editId, setEditId] = useState<number | null>(null);
  const [eMax, setEMax] = useState('');
  const [eExtra, setEExtra] = useState('');
  const [eUnl, setEUnl] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/km-policies').then((r) => setRows(r.data.data));

  useEffect(() => {
    load();
    api.get('/lookups/rental_types').then((r) => setRtypes(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/car_groups').then((r) => setGroups(r.data.data.filter((x: any) => x.status === 'active')));
  }, []);

  const add = async () => {
    setError('');
    try {
      await api.post('/km-policies', {
        rental_type_id: Number(rType),
        group_id: Number(group),
        max_km: Math.max(0, Number(maxKm) || 0),
        extra_km_rate: Math.max(0, Number(extra) || 0),
        unlimited_daily_amount: Math.max(0, Number(unl) || 0),
      });
      setRType('');
      setGroup('');
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add');
    }
  };

  const save = async (id: number) => {
    setError('');
    try {
      await api.put(`/km-policies/${id}`, {
        max_km: Math.max(0, Number(eMax) || 0),
        extra_km_rate: Math.max(0, Number(eExtra) || 0),
        unlimited_daily_amount: Math.max(0, Number(eUnl) || 0),
      });
      setEditId(null);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const toggle = async (p: Policy) => {
    setError('');
    try {
      await api.put(`/km-policies/${p.id}`, { status: p.status === 'active' ? 'inactive' : 'active' });
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const del = async (id: number) => {
    if (!window.confirm('Delete this KM policy?')) return;
    setError('');
    try {
      await api.delete(`/km-policies/${id}`);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to delete');
    }
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredRows = normalizedSearch
    ? rows.filter((policy) =>
        [
          policy.rental_type,
          policy.group_name,
          policy.max_km,
          policy.extra_km_rate,
          policy.unlimited_daily_amount,
          policy.status,
        ].some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      )
    : rows;

  return (
      <div className="space-y-4 p-5 sm:p-6">
      <p className="text-sm leading-6 text-base-content/60">Define included kilometers, excess usage rates, and unlimited-distance add-ons by rental type and vehicle group.</p>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <div className="redwood-inline-create grid grid-cols-1 rounded-box border border-base-300 md:grid-cols-3">
        <div>
          <label className={labelCls}>Rental Type *</label>
          <AppSelect value={rType} onChange={setRType} placeholder="— Rental Type —" options={rtypes.map((type) => ({ value: type.id, label: type.name }))} />
        </div>
        <div>
          <label className={labelCls}>Vehicle Group *</label>
          <AppSelect value={group} onChange={setGroup} placeholder="— Vehicle Group —" options={groups.map((vehicleGroup) => ({ value: vehicleGroup.id, label: vehicleGroup.name }))} />
        </div>
        <div>
          <label className={labelCls}>Max KM / Day *</label>
          <input value={maxKm} onChange={(e) => setMaxKm(e.target.value)} type="number" min="0" step="1" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Extra KM Rate (AED) *</label>
          <input value={extra} onChange={(e) => setExtra(e.target.value)} type="number" min="0" step="0.5" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Unlimited Add-on (AED/Day)</label>
          <input value={unl} onChange={(e) => setUnl(e.target.value)} type="number" min="0" step="0.5" className={inputCls} />
        </div>
        <div className="flex items-end">
          <button
            onClick={add}
              className="btn btn-primary w-full gap-2"
          >
            <Plus size={16} /> Add Policy
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="app-table">
          <thead>
            <tr>
              <th>Rental type</th><th>Group</th><th>Max km/day</th><th>Extra km</th><th>Unlimited/day</th><th>Status</th><th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300">
            {filteredRows.map((p) => (
              <tr key={p.id} className={p.status !== 'active' ? 'opacity-50' : ''}>
                <td className="px-5 py-3 font-medium text-base-content">{p.rental_type}</td>
                <td className="px-5 py-3 text-base-content/80">{p.group_name}</td>
                <td className="px-5 py-3">
                  {editId === p.id ? (
                    <input value={eMax} onChange={(e) => setEMax(e.target.value)} type="number" min="0" step="1" className="w-24 px-2 py-1.5 border border-base-300 rounded-lg outline-none" autoFocus />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/30">{p.max_km} km</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === p.id ? (
                    <input value={eExtra} onChange={(e) => setEExtra(e.target.value)} type="number" min="0" step="0.5" className="w-24 px-2 py-1.5 border border-base-300 rounded-lg outline-none" />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-warning/10 text-warning border-warning/30">AED {Number(p.extra_km_rate)}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === p.id ? (
                    <input value={eUnl} onChange={(e) => setEUnl(e.target.value)} type="number" min="0" step="0.5" className="w-24 px-2 py-1.5 border border-base-300 rounded-lg outline-none" />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-success/10 text-success border-success/30">AED {Number(p.unlimited_daily_amount)}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      p.status === 'active'
                        ? 'bg-success/10 text-success border-success/30'
                        : 'bg-base-200 text-base-content/60 border-base-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {editId === p.id ? (
                      <>
                        <button type="button" onClick={() => save(p.id)} title="Save" aria-label="Save mileage policy" className="btn btn-ghost btn-square btn-sm text-success">
                          <Check size={16} />
                        </button>
                        <button type="button" onClick={() => setEditId(null)} title="Cancel" aria-label="Cancel editing mileage policy" className="btn btn-ghost btn-square btn-sm">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => toggle(p)} title={p.status === 'active' ? 'Deactivate' : 'Activate'} aria-label={`${p.status === 'active' ? 'Deactivate' : 'Activate'} mileage policy`} className="btn btn-ghost btn-square btn-sm text-warning">
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => { setEditId(p.id); setEMax(String(p.max_km)); setEExtra(p.extra_km_rate); setEUnl(p.unlimited_daily_amount); }}
                          title="Edit"
                          aria-label="Edit mileage policy"
                          className="btn btn-ghost btn-square btn-sm text-primary"
                        >
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => del(p.id)} title="Delete" aria-label="Delete mileage policy" className="btn btn-ghost btn-square btn-sm text-error">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-base-content/60">
                  {rows.length === 0 ? 'No KM policies yet' : 'No KM policies match your search'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KmPoliciesManager;
