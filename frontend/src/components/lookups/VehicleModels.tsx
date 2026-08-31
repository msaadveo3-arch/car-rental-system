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

type VehicleModelsProps = {
  searchQuery?: string;
};

const VehicleModels: React.FC<VehicleModelsProps> = ({ searchQuery = '' }) => {
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
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const shown = models.filter((model) => {
    const matchesMake = !makeId || String(model.make_id) === makeId;
    const matchesSearch = !normalizedSearch || [model.name, makeName(model.make_id), model.status]
      .some((value) => value.toLowerCase().includes(normalizedSearch));

    return matchesMake && matchesSearch;
  });

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
    'app-field';

  return (
    <div className="space-y-4 p-5 sm:p-6">
      <p className="text-sm leading-6 text-base-content/60">Choose a vehicle make, add its model, and maintain availability for vehicle registration.</p>

      {error && (
        <div role="alert" className="alert alert-error">{error}</div>
      )}

      <div className="redwood-inline-create rounded-box border border-base-300">
        <AppSelect value={makeId} onChange={setMakeId} className="w-44" placeholder="— Make —" options={makes.filter((make) => make.status === 'active').map((make) => ({ value: make.id, label: make.name }))} />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Model name (e.g. Camry)"
          className="app-field w-56"
        />
        <button
          onClick={add}
            className="btn btn-primary gap-2"
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
          <thead>
            <tr>
              <th>Model</th><th>Make</th><th>Status</th><th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300">
            {shown.map((m) => (
              <tr key={m.id} className={m.status !== 'active' ? 'opacity-50' : ''}>
                <td>
                  {editId === m.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="app-field-sm w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-base-content">{m.name}</span>
                  )}
                </td>
                <td>
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
                <td>
                  <span
                    className={`badge ${
                      m.status === 'active'
                        ? 'badge-success'
                        : 'badge-ghost'
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {editId === m.id ? (
                      <>
                        <button type="button" onClick={() => save(m.id)} title="Save" aria-label={`Save ${m.name}`} className="btn btn-ghost btn-square btn-sm text-success">
                          <Check size={16} />
                        </button>
                        <button type="button" onClick={() => setEditId(null)} title="Cancel" aria-label={`Cancel editing ${m.name}`} className="btn btn-ghost btn-square btn-sm">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => toggle(m)} title={m.status === 'active' ? 'Deactivate' : 'Activate'} aria-label={`${m.status === 'active' ? 'Deactivate' : 'Activate'} ${m.name}`} className="btn btn-ghost btn-square btn-sm text-warning">
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => { setEditId(m.id); setEditName(m.name); setEditMakeId(String(m.make_id)); }}
                          title="Edit"
                          aria-label={`Edit ${m.name}`}
                          className="btn btn-ghost btn-square btn-sm text-primary"
                        >
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => del(m.id, m.name)} title="Delete" aria-label={`Delete ${m.name}`} className="btn btn-ghost btn-square btn-sm text-error">
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
                <td colSpan={4} className="px-5 py-8 text-center text-base-content/60">
                  {models.length === 0 ? 'No models yet' : 'No models match your filters'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleModels;
