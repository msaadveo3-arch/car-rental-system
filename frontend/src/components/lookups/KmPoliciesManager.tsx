import React, { useEffect, useState } from 'react';
import { Gauge, Plus, Pencil, Trash2, Check, X, Power } from 'lucide-react';
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

const inputCls =
  'w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none';

const labelCls = 'block text-sm font-medium text-base-content/80 mb-1';

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="text-lg font-bold text-base-content">{title}</h2>
      <p className="text-sm text-base-content/60">{subtitle}</p>
    </div>
  </div>
);

const KmPoliciesManager: React.FC = () => {
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

  return (
      <div className="card card-border bg-base-100 shadow-sm p-6">
      <SectionTitle
        icon={<Gauge size={20} />}
        title="KM Policies"
        subtitle="Included kilometers per day, extra-km rate and unlimited add-on per group"
      />

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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
            className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Policy
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="app-table">
          <thead className="bg-base-200 border-b border-base-300">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Rental Type</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Group</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Max KM/Day</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Extra KM (AED)</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Unlimited (AED/Day)</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((p) => (
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
                        <button onClick={() => save(p.id)} title="Save" className="p-2 text-success hover:bg-success/10 rounded-lg">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditId(null)} title="Cancel" className="p-2 text-base-content/60 hover:bg-base-200 rounded-lg">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => toggle(p)} title={p.status === 'active' ? 'Deactivate' : 'Activate'} className="p-2 text-warning hover:bg-warning/10 rounded-lg">
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => { setEditId(p.id); setEMax(String(p.max_km)); setEExtra(p.extra_km_rate); setEUnl(p.unlimited_daily_amount); }}
                          title="Edit"
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => del(p.id)} title="Delete" className="p-2 text-error hover:bg-error/10 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-base-content/60">No KM policies yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KmPoliciesManager;
