import React, { useEffect, useState } from 'react';
import { Gauge, Plus, Pencil, Trash2, Check, X, Power } from 'lucide-react';
import api from '../../services/api';

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
  'w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
  icon,
  title,
  subtitle,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400">{subtitle}</p>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <SectionTitle
        icon={<Gauge size={20} />}
        title="KM Policies"
        subtitle="Included kilometers per day, extra-km rate and unlimited add-on per group"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <label className={labelCls}>Rental Type *</label>
          <select value={rType} onChange={(e) => setRType(e.target.value)} className={inputCls}>
            <option value="">— Rental Type —</option>
            {rtypes.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Vehicle Group *</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={inputCls}>
            <option value="">— Vehicle Group —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
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
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Policy
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rental Type</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Group</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Max KM/Day</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Extra KM (AED)</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Unlimited (AED/Day)</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((p) => (
              <tr key={p.id} className={p.status !== 'active' ? 'opacity-50' : ''}>
                <td className="px-5 py-3 font-medium text-gray-800">{p.rental_type}</td>
                <td className="px-5 py-3 text-gray-600">{p.group_name}</td>
                <td className="px-5 py-3">
                  {editId === p.id ? (
                    <input value={eMax} onChange={(e) => setEMax(e.target.value)} type="number" min="0" step="1" className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg outline-none" autoFocus />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">{p.max_km} km</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === p.id ? (
                    <input value={eExtra} onChange={(e) => setEExtra(e.target.value)} type="number" min="0" step="0.5" className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg outline-none" />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">AED {Number(p.extra_km_rate)}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === p.id ? (
                    <input value={eUnl} onChange={(e) => setEUnl(e.target.value)} type="number" min="0" step="0.5" className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg outline-none" />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">AED {Number(p.unlimited_daily_amount)}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      p.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {editId === p.id ? (
                      <>
                        <button onClick={() => save(p.id)} title="Save" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditId(null)} title="Cancel" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => toggle(p)} title={p.status === 'active' ? 'Deactivate' : 'Activate'} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => { setEditId(p.id); setEMax(String(p.max_km)); setEExtra(p.extra_km_rate); setEUnl(p.unlimited_daily_amount); }}
                          title="Edit"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => del(p.id)} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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
                <td colSpan={7} className="px-5 py-8 text-center text-gray-400">No KM policies yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KmPoliciesManager;