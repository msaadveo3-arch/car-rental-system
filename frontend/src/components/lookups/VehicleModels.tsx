import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Power } from 'lucide-react';
import api from '../../services/api';
import AppSelect from '../common/AppSelect';

interface ModelRow {
  id: number;
  name: string;
  make_id: number;
  status: string;
}

const VehicleModels: React.FC = () => {
  const [makes, setMakes] = useState<{ id: number; name: string; status: string }[]>([]);
  const [models, setModels] = useState<ModelRow[]>([]);
  const [makeId, setMakeId] = useState('');
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editMakeId, setEditMakeId] = useState('');
  const [error, setError] = useState('');

  const loadMakes = () => api.get('/lookups/vehicle_makes').then((r) => setMakes(r.data.data));
  const loadModels = () => api.get('/lookups/vehicle_models').then((r) => setModels(r.data.data));

  useEffect(() => {
    loadMakes();
    loadModels();
  }, []);

  const makeName = (id: number) => makes.find((m) => m.id === id)?.name ?? '—';
  const shown = makeId ? models.filter((m) => String(m.make_id) === makeId) : models;

  const add = async () => {
    if (!makeId || !name.trim()) {
      setError('Choose a make and enter the model name');
      return;
    }
    setError('');
    try {
      await api.post('/lookups/vehicle_models', { name: name.trim(), make_id: Number(makeId) });
      setName('');
      loadModels();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to add model');
    }
  };

  const save = async (id: number) => {
    if (!editName.trim() || !editMakeId) return;
    setError('');
    try {
      await api.put(`/lookups/vehicle_models/${id}`, {
        name: editName.trim(),
        make_id: Number(editMakeId),
      });
      setEditId(null);
      loadModels();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update model');
    }
  };

  const toggle = async (item: ModelRow) => {
    setError('');
    try {
      await api.put(`/lookups/vehicle_models/${item.id}`, {
        status: item.status === 'active' ? 'inactive' : 'active',
      });
      loadModels();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    }
  };

  const del = async (id: number, nm: string) => {
    if (!window.confirm(`Delete "${nm}"?`)) return;
    setError('');
    try {
      await api.delete(`/lookups/vehicle_models/${id}`);
      loadModels();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to delete');
    }
  };

  const selectCls =
    'px-3 py-2 border border-base-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none';

  return (
    <div className="card card-border bg-base-100 shadow-sm p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-base-content">Vehicle Models</h2>
        <p className="text-base-content/60 text-sm mt-1">
          Pick the make, then add its models — filter the list by make if you want
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex gap-2 flex-wrap items-center">
        <AppSelect value={makeId} onChange={setMakeId} className="w-44" placeholder="— Make —" options={makes.filter((make) => make.status === 'active').map((make) => ({ value: make.id, label: make.name }))} />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Model name (e.g. Camry)"
          className="w-52 px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Model
        </button>

        <AppSelect
          value={makeId}
          onChange={setMakeId}
          className="ml-auto w-44"
          placeholder="All Makes"
          options={makes.map((make) => ({ value: make.id, label: make.name }))}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="app-table">
          <thead className="bg-base-200 border-b border-base-300">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Model</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Make</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-base-content/60 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shown.map((m) => (
              <tr key={m.id} className={m.status !== 'active' ? 'opacity-50' : ''}>
                <td className="px-5 py-3">
                  {editId === m.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-base-content">{m.name}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === m.id ? (
                    <AppSelect
                      value={editMakeId}
                      onChange={setEditMakeId}
                      size="sm"
                      className="w-40"
                      options={makes.map((make) => ({ value: make.id, label: make.name }))}
                    />
                  ) : (
                    <span className="text-base-content/80">{makeName(m.make_id)}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      m.status === 'active'
                        ? 'bg-success/10 text-success border-success/30'
                        : 'bg-base-200 text-base-content/60 border-base-300'
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    {editId === m.id ? (
                      <>
                        <button onClick={() => save(m.id)} title="Save" className="p-2 text-success hover:bg-success/10 rounded-lg">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditId(null)} title="Cancel" className="p-2 text-base-content/60 hover:bg-base-200 rounded-lg">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => toggle(m)} title={m.status === 'active' ? 'Deactivate' : 'Activate'} className="p-2 text-warning hover:bg-warning/10 rounded-lg">
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => { setEditId(m.id); setEditName(m.name); setEditMakeId(String(m.make_id)); }}
                          title="Edit"
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => del(m.id, m.name)} title="Delete" className="p-2 text-error hover:bg-error/10 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-base-content/60">No models yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleModels;
