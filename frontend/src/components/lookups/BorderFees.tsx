import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import api from '../../services/api';
import CountryInput from '../customers/CountryInput';
import AppSelect from '../common/AppSelect';

interface BorderFee {
  id: number;
  border_id: number;
  group_id: number;
  fee: string;
  border_name: string;
  group_name: string;
}

type BorderFeesProps = {
  searchQuery?: string;
};

const BorderFees: React.FC<BorderFeesProps> = ({ searchQuery = '' }) => {
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
    'px-3 py-2 border border-base-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none';
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredRows = normalizedSearch
    ? rows.filter((row) =>
        [row.border_name, row.group_name, row.fee].some((value) =>
          String(value).toLowerCase().includes(normalizedSearch),
        ),
      )
    : rows;

  return (
    <div className="card card-border bg-base-100 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-base-content">Cross Borders & Fees</h2>
        <p className="text-base-content/60 text-sm mt-1">
          Type the country, choose the vehicle group, then set the fee — new countries are created automatically
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex gap-2 flex-wrap items-center">
        <div className="w-48">
          <CountryInput value={borderName} onChange={setBorderName} withCode={false} />
        </div>

        <AppSelect value={groupId} onChange={setGroupId} className="w-48" placeholder="— Vehicle Group —" options={groups.map((group) => ({ value: group.id, label: group.name }))} />

        <input
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          type="number"
          min="0"
          step="0.5"
          placeholder="Fee (AED)"
          className="w-28 px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />

        <button
          onClick={add}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Fee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="app-table">
          <thead className="bg-base-200 border-b border-base-300">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Border</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Vehicle Group</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Fee</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-3 font-medium text-base-content">{r.border_name}</td>
                <td className="px-5 py-3 text-base-content/80">{r.group_name}</td>
                <td className="px-5 py-3">
                  {editId === r.id ? (
                    <input
                      value={editFee}
                      onChange={(e) => setEditFee(e.target.value)}
                      type="number"
                      min="0"
                      step="0.5"
                      className="w-24 px-3 py-1.5 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border bg-warning/10 text-warning border-warning/30">
                      AED {Number(r.fee)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {editId === r.id ? (
                      <>
                        <button onClick={() => save(r.id)} title="Save" className="p-2 text-success hover:bg-success/10 rounded-lg">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditId(null)} title="Cancel" className="p-2 text-base-content/60 hover:bg-base-200 rounded-lg">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(r.id); setEditFee(r.fee); }}
                          title="Edit"
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => del(r.id)} title="Delete" className="p-2 text-error hover:bg-error/10 rounded-lg">
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
                <td colSpan={4} className="px-5 py-8 text-center text-base-content/60">
                  {rows.length === 0 ? 'No border fees yet' : 'No border fees match your search'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorderFees;
