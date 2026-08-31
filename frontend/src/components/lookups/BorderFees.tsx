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
    'app-field';
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredRows = normalizedSearch
    ? rows.filter((row) =>
        [row.border_name, row.group_name, row.fee].some((value) =>
          String(value).toLowerCase().includes(normalizedSearch),
        ),
      )
    : rows;

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <p className="text-sm leading-6 text-base-content/60">Choose a destination and vehicle group, then set the applicable cross-border fee.</p>

      {error && (
        <div role="alert" className="alert alert-error">{error}</div>
      )}

      <div className="redwood-inline-create rounded-box border border-base-300">
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
          className="app-field w-32"
        />

        <button
          onClick={add}
            className="btn btn-primary gap-2"
        >
          <Plus size={16} /> Add Fee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="app-table">
          <thead>
            <tr>
              <th>Destination</th><th>Vehicle group</th><th>Fee</th><th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300">
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td className="font-medium text-base-content">{r.border_name}</td>
                <td className="text-base-content/80">{r.group_name}</td>
                <td>
                  {editId === r.id ? (
                    <input
                      value={editFee}
                      onChange={(e) => setEditFee(e.target.value)}
                      type="number"
                      min="0"
                      step="0.5"
                      className="app-field-sm w-24"
                      autoFocus
                    />
                  ) : (
                    <span className="badge badge-warning">
                      AED {Number(r.fee)}
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {editId === r.id ? (
                      <>
                        <button type="button" onClick={() => save(r.id)} title="Save" aria-label={`Save border fee for ${r.border_name}`} className="btn btn-ghost btn-square btn-sm text-success">
                          <Check size={16} aria-hidden />
                        </button>
                        <button type="button" onClick={() => setEditId(null)} title="Cancel" aria-label="Cancel editing border fee" className="btn btn-ghost btn-square btn-sm">
                          <X size={16} aria-hidden />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(r.id); setEditFee(r.fee); }}
                          title="Edit"
                          aria-label={`Edit border fee for ${r.border_name}`}
                          className="btn btn-ghost btn-square btn-sm text-primary"
                        >
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => del(r.id)} title="Delete" aria-label={`Delete border fee for ${r.border_name}`} className="btn btn-ghost btn-square btn-sm text-error">
                          <Trash2 size={16} aria-hidden />
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
