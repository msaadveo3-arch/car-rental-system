import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import api from '../../services/api';
import CountryInput from '../customers/CountryInput';

interface BorderFee {
  id: number;
  border_id: number;
  group_id: number;
  fee: string;
  border_name: string;
  group_name: string;
}

const BorderFees: React.FC = () => {
  const [rows, setRows] = useState<BorderFee[]>([]);
  const [borders, setBorders] = useState<{ id: number; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [borderName, setBorderName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [fee, setFee] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editFee, setEditFee] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/border-fees').then((r) => setRows(r.data.data));
  const loadBorders = () =>
    api.get('/lookups/borders').then((r) => {
      setBorders(r.data.data.filter((x: any) => x.status === 'active'));
      return r.data.data;
    });

  useEffect(() => {
    load();
    loadBorders();
    api.get('/lookups/car_groups').then((r) => setGroups(r.data.data.filter((x: any) => x.status === 'active')));
  }, []);

  const add = async () => {
    setError('');
    try {
      const nm = borderName.trim();
      if (!nm) {
        setError('Enter the country name');
        return;
      }
      if (!groupId) {
        setError('Vehicle group is required');
        return;
      }

      // دور على البلد — لو مش موجود اتخلق لوحده
      let b = borders.find((x) => x.name.toLowerCase() === nm.toLowerCase());
      if (!b) {
        await api.post('/lookups/borders', { name: nm });
        const all = await loadBorders();
        b = all.find((x: any) => x.name.toLowerCase() === nm.toLowerCase());
        if (!b) {
          setError('Failed to create the country');
          return;
        }
      }

      await api.post('/border-fees', {
        border_id: b.id,
        group_id: Number(groupId),
        fee: Number(fee) || 0,
      });
      setBorderName('');
      setGroupId('');
      setFee('');
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add fee');
    }
  };

  const save = async (id: number) => {
    setError('');
    try {
      await api.put(`/border-fees/${id}`, { fee: Number(editFee) || 0 });
      setEditId(null);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update fee');
    }
  };

  const del = async (id: number) => {
    if (!window.confirm('Delete this fee?')) return;
    setError('');
    try {
      await api.delete(`/border-fees/${id}`);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to delete fee');
    }
  };

  const selectCls =
    'px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Cross Borders & Fees</h2>
        <p className="text-gray-500 text-sm mt-1">
          Type the country, choose the vehicle group, then set the fee — new countries are created automatically
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex gap-2 flex-wrap items-center">
        <div className="w-48">
          <CountryInput value={borderName} onChange={setBorderName} withCode={false} />
        </div>

        <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className={selectCls}>
          <option value="">— Vehicle Group —</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <input
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          type="number"
          min="0"
          step="0.5"
          placeholder="Fee (AED)"
          className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={add}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} /> Add Fee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Border</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Vehicle Group</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fee</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-3 font-medium text-gray-800">{r.border_name}</td>
                <td className="px-5 py-3 text-gray-600">{r.group_name}</td>
                <td className="px-5 py-3">
                  {editId === r.id ? (
                    <input
                      value={editFee}
                      onChange={(e) => setEditFee(e.target.value)}
                      type="number"
                      min="0"
                      step="0.5"
                      className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                      AED {Number(r.fee)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {editId === r.id ? (
                      <>
                        <button onClick={() => save(r.id)} title="Save" className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditId(null)} title="Cancel" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(r.id); setEditFee(r.fee); }}
                          title="Edit"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => del(r.id)} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400">No border fees yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorderFees;