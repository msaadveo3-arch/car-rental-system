import React, { useEffect, useState } from 'react';
import { BadgeDollarSign, Tags, Plus, Pencil, Trash2, Check, X, Power, Star } from 'lucide-react';
import api from '../../services/api';

interface Tariff {
  id: number;
  name: string;
  description: string | null;
  status: string;
}

interface Detail {
  id: number;
  tariff_id: number;
  group_id: number;
  branch_id: number | null;
  pricing_mode_id: number;
  rental_type_id: number;
  rack_rate: string;
  floor_rate: string;
  is_default: number;
  status: string;
  tariff_name: string;
  group_name: string;
  branch_name: string | null;
  pricing_mode: string;
  rental_type: string;
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

const TariffsManager: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [details, setDetails] = useState<Detail[]>([]);
  const [groups, setGroups] = useState<Opt[]>([]);
  const [branches, setBranches] = useState<Opt[]>([]);
  const [modes, setModes] = useState<Opt[]>([]);
  const [rtypes, setRtypes] = useState<Opt[]>([]);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const [dTariff, setDTariff] = useState('');
  const [dGroup, setDGroup] = useState('');
  const [dBranch, setDBranch] = useState('');
  const [dMode, setDMode] = useState('');
  const [dType, setDType] = useState('');
  const [dRack, setDRack] = useState('');
  const [dFloor, setDFloor] = useState('');
  const [dDefault, setDDefault] = useState(false);

  const [editDetailId, setEditDetailId] = useState<number | null>(null);
  const [eRack, setERack] = useState('');
  const [eFloor, setEFloor] = useState('');
  const [error, setError] = useState('');

  const loadTariffs = () => api.get('/tariffs').then((r) => setTariffs(r.data.data));
  const loadDetails = () => api.get('/tariff-details').then((r) => setDetails(r.data.data));

  useEffect(() => {
    loadTariffs();
    loadDetails();
    api.get('/lookups/car_groups').then((r) => setGroups(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/branches').then((r) => setBranches(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/pricing_modes').then((r) => setModes(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/rental_types').then((r) => setRtypes(r.data.data.filter((x: any) => x.status === 'active')));
  }, []);

  const addTariff = async () => {
    if (!name.trim()) return;
    setError('');
    try {
      await api.post('/tariffs', { name: name.trim(), description: desc.trim() });
      setName('');
      setDesc('');
      loadTariffs();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add tariff');
    }
  };

  const saveTariff = async (id: number) => {
    if (!editName.trim()) return;
    setError('');
    try {
      await api.put(`/tariffs/${id}`, { name: editName.trim() });
      setEditId(null);
      loadTariffs();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update tariff');
    }
  };

  const toggleTariff = async (t: Tariff) => {
    setError('');
    try {
      await api.put(`/tariffs/${t.id}`, { status: t.status === 'active' ? 'inactive' : 'active' });
      loadTariffs();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update tariff');
    }
  };

  const delTariff = async (id: number, nm: string) => {
    if (!window.confirm(`Delete tariff "${nm}"?`)) return;
    setError('');
    try {
      await api.delete(`/tariffs/${id}`);
      loadTariffs();
      loadDetails();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to delete tariff');
    }
  };

  const addDetail = async () => {
    setError('');
    try {
      await api.post('/tariff-details', {
        tariff_id: Number(dTariff),
        group_id: Number(dGroup),
        branch_id: dBranch ? Number(dBranch) : null,
        pricing_mode_id: Number(dMode),
        rental_type_id: Number(dType),
        rack_rate: Number(dRack) || 0,
        floor_rate: Number(dFloor) || 0,
        is_default: dDefault ? 1 : 0,
      });
      setDTariff(''); setDGroup(''); setDBranch(''); setDMode(''); setDType('');
      setDRack(''); setDFloor(''); setDDefault(false);
      loadDetails();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add price line');
    }
  };

  const saveDetail = async (id: number) => {
    setError('');
    try {
      await api.put(`/tariff-details/${id}`, {
        rack_rate: Number(eRack) || 0,
        floor_rate: Number(eFloor) || 0,
      });
      setEditDetailId(null);
      loadDetails();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update price line');
    }
  };

  const toggleDefault = async (d: Detail) => {
    setError('');
    try {
      await api.put(`/tariff-details/${d.id}`, { is_default: d.is_default ? 0 : 1 });
      loadDetails();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const toggleDetailStatus = async (d: Detail) => {
    setError('');
    try {
      await api.put(`/tariff-details/${d.id}`, { status: d.status === 'active' ? 'inactive' : 'active' });
      loadDetails();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const delDetail = async (id: number) => {
    if (!window.confirm('Delete this price line?')) return;
    setError('');
    try {
      await api.delete(`/tariff-details/${id}`);
      loadDetails();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Tariff lists */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SectionTitle
          icon={<BadgeDollarSign size={20} />}
          title="Tariff Lists"
          subtitle="Named price lists for seasons and promotions"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className={labelCls}>Tariff Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Airport Season"
              className={inputCls}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What this tariff is for"
              className={inputCls}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addTariff}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Tariff
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tariffs.map((t) => (
                <tr key={t.id} className={t.status !== 'active' ? 'opacity-50' : ''}>
                  <td className="px-5 py-3">
                    {editId === t.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{t.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{t.description ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        t.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {editId === t.id ? (
                        <>
                          <button onClick={() => saveTariff(t.id)} title="Save" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditId(null)} title="Cancel" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => toggleTariff(t)} title={t.status === 'active' ? 'Deactivate' : 'Activate'} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => { setEditId(t.id); setEditName(t.name); }}
                            title="Edit"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => delTariff(t.id, t.name)} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {tariffs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">No tariffs yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price lines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SectionTitle
          icon={<Tags size={20} />}
          title="Price Lines (Rack / Floor)"
          subtitle="Rates per vehicle group, branch and rental type"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className={labelCls}>Tariff *</label>
            <select value={dTariff} onChange={(e) => setDTariff(e.target.value)} className={inputCls}>
              <option value="">— Tariff —</option>
              {tariffs.filter((t) => t.status === 'active').map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Vehicle Group *</label>
            <select value={dGroup} onChange={(e) => setDGroup(e.target.value)} className={inputCls}>
              <option value="">— Vehicle Group —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Branch</label>
            <select value={dBranch} onChange={(e) => setDBranch(e.target.value)} className={inputCls}>
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Pricing Mode *</label>
            <select value={dMode} onChange={(e) => setDMode(e.target.value)} className={inputCls}>
              <option value="">— Pricing Mode —</option>
              {modes.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Rental Type *</label>
            <select value={dType} onChange={(e) => setDType(e.target.value)} className={inputCls}>
              <option value="">— Rental Type —</option>
              {rtypes.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Rack Rate (AED) *</label>
            <input
              value={dRack}
              onChange={(e) => setDRack(e.target.value)}
              type="number"
              min="0"
              step="0.5"
              placeholder="250"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Floor Rate (AED) *</label>
            <input
              value={dFloor}
              onChange={(e) => setDFloor(e.target.value)}
              type="number"
              min="0"
              step="0.5"
              placeholder="200"
              className={inputCls}
            />
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 pb-2">
              <input
                type="checkbox"
                checked={dDefault}
                onChange={(e) => setDDefault(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              Default
            </label>
            <button
              onClick={addDetail}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Line
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tariff</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Group</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Branch</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Mode</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rental Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rack</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Floor</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Default</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {details.map((d) => (
                <tr key={d.id} className={d.status !== 'active' ? 'opacity-50' : ''}>
                  <td className="px-5 py-3 font-medium text-gray-800">{d.tariff_name}</td>
                  <td className="px-5 py-3 text-gray-600">{d.group_name}</td>
                  <td className="px-5 py-3 text-gray-600">{d.branch_name ?? 'All'}</td>
                  <td className="px-5 py-3 text-gray-600">{d.pricing_mode}</td>
                  <td className="px-5 py-3 text-gray-600">{d.rental_type}</td>
                  <td className="px-5 py-3">
                    {editDetailId === d.id ? (
                      <input
                        value={eRack}
                        onChange={(e) => setERack(e.target.value)}
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                        AED {Number(d.rack_rate)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {editDetailId === d.id ? (
                      <input
                        value={eFloor}
                        onChange={(e) => setEFloor(e.target.value)}
                        type="number"
                        min="0"
                        step="0.5"
                        className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg outline-none"
                      />
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full border bg-red-50 text-red-600 border-red-200">
                        AED {Number(d.floor_rate)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleDefault(d)}
                      title={d.is_default ? 'Remove default' : 'Make default'}
                      className={d.is_default ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}
                    >
                      <Star size={18} fill={d.is_default ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {editDetailId === d.id ? (
                        <>
                          <button onClick={() => saveDetail(d.id)} title="Save" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditDetailId(null)} title="Cancel" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => toggleDetailStatus(d)} title={d.status === 'active' ? 'Deactivate' : 'Activate'} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => { setEditDetailId(d.id); setERack(d.rack_rate); setEFloor(d.floor_rate); }}
                            title="Edit rates"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => delDetail(d.id)} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {details.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-gray-400">No price lines yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TariffsManager;