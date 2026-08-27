import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft, Save, ShieldAlert, ClipboardList, Crosshair, Pencil, Trash2, Check, X,
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

interface Damage {
  part: string;
  type: string;
  severity: string;
  notes: string;
  photos: string[];
}

const TYPES = ['Scratch', 'Crack', 'Collision', 'Burn', 'Rust', 'Other'];
const SEVERITIES = ['Minor', 'Moderate', 'Severe'];

const Inspection3D: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const role = (user as any)?.role ?? 'staff';
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [rental, setRental] = useState<any>(null);
  const [damages, setDamages] = useState<Damage[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [ePart, setEPart] = useState('');
  const [eType, setEType] = useState(TYPES[0]);
  const [eSev, setESev] = useState(SEVERITIES[0]);
  const [eNotes, setENotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'inspector') return;
    api
      .get(`/rentals/${id}`)
      .then((r) => setRental(r.data.data))
      .catch(() => setError('Failed to load contract'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      if (ev.data && ev.data.type === 'damages-update') {
        setDamages(ev.data.data ?? []);
        setEditing(null);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  if (role !== 'inspector') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-lg flex items-center gap-2">
          <ShieldAlert size={18} /> Inspection area — inspector account only.
        </div>
      </div>
    );
  }

  const send = (msg: any) => {
    iframeRef.current?.contentWindow?.postMessage(msg, '*');
  };

  const deleteDamage = (i: number) => {
    if (!window.confirm(`Delete damage #${i + 1}?`)) return;
    setDamages((d) => d.filter((_, x) => x !== i));
    send({ type: 'damage-delete', index: i });
  };

  const startEdit = (i: number) => {
    const d = damages[i];
    setEditing(i);
    setEPart(d.part || '');
    setEType(d.type || TYPES[0]);
    setESev(d.severity || SEVERITIES[0]);
    setENotes(d.notes || '');
  };

  const saveEdit = (i: number) => {
    const updated: Damage = { ...damages[i], part: ePart, type: eType, severity: eSev, notes: eNotes };
    setDamages((d) => d.map((x, idx) => (idx === i ? updated : x)));
    send({ type: 'damage-update', index: i, data: updated });
    setEditing(null);
  };

  const saveReport = async () => {
    if (!window.confirm('Save pickup inspection and activate the contract?')) return;
    setSaving(true);
    setError('');
    try {
      await api.post('/inspections/pickup', {
        rental_id: Number(id),
        notes: null,
        damage_report: damages,
        photos: [],
      });
      navigate('/inspection-queue');
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to save inspection');
      setSaving(false);
    }
  };

  const params = rental
    ? new URLSearchParams({
        car: [rental.make, rental.model].filter(Boolean).join(' '),
        sub: rental.car_group ?? '',
        vin: rental.vin ?? '',
        mileage:
          rental.mileage !== null && rental.mileage !== undefined && rental.mileage !== ''
            ? `${Number(rental.mileage).toLocaleString()} km`
            : '',
        color: rental.color ?? '',
        engine: rental.engine_capacity ?? '',
        transmission: rental.transmission ?? '',
      }).toString()
    : '';
  const iframeSrc =
    'http://localhost/car-rental-system/inspections-3d/index.html' + (params ? `?${params}` : '');

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* الشريط العلوي */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/inspection-queue')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            title="Back to queue"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-gray-900">3D Damage Inspection — Pickup</h2>
            <p className="text-xs text-gray-500">
              {rental
                ? `${rental.booking_number ?? `#${rental.id}`} • ${rental.plate_number} • ${rental.customer_name}`
                : 'Loading contract...'}
            </p>
          </div>
        </div>
        <button
          onClick={saveReport}
          disabled={saving || !rental}
          className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Report & Release Car'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-600 px-4 py-2 text-sm">{error}</div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Aside الأضرار — سكرول رأسي بس */}
        <aside className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto p-5">
            {damages.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                  <Crosshair size={22} className="text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-600 mt-4">No damages recorded yet</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Click any point on the vehicle above to register new damage
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {damages.map((d, i) =>
                  editing === i ? (
                    <div key={i} className="border border-blue-200 rounded-xl p-3 bg-blue-50/40 space-y-2">
                      <input
                        value={ePart}
                        onChange={(ev) => setEPart(ev.target.value)}
                        placeholder="Part name"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select value={eType} onChange={(ev) => setEType(ev.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                          {TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <select value={eSev} onChange={(ev) => setESev(ev.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                          {SEVERITIES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={eNotes}
                        onChange={(ev) => setENotes(ev.target.value)}
                        rows={2}
                        placeholder="Notes"
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => saveEdit(i)} title="Save" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                          <Check size={15} />
                        </button>
                        <button onClick={() => setEditing(null)} title="Cancel" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50/60 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-red-600 break-words min-w-0">#{i + 1} — {d.part || '—'}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 shrink-0">
                          {d.severity || '—'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Type: {d.type || '—'}</p>
                      {d.notes && <p className="text-xs text-gray-600 mt-1.5 leading-relaxed break-words">{d.notes}</p>}
                      {Array.isArray(d.photos) && d.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {d.photos.map((ph, pi) => (
                            <img key={pi} src={ph} alt={`damage ${i + 1}`} className="w-16 h-12 object-cover rounded-lg border border-gray-200" />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                        <button onClick={() => startEdit(i)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteDamage(i)} title="Delete" className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Damage Log — تحت fixed */}
          <div className="border-t border-gray-100 p-4 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ClipboardList size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Damage Log</p>
                <p className="text-[11px] text-gray-400">Damages recorded on this vehicle</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{damages.length}</span>
          </div>
        </aside>

        {/* الـ 3D */}
        <div className="flex-1 relative overflow-hidden">
          <iframe
            ref={iframeRef}
            title="3D Car Inspection"
            src={iframeSrc}
            style={{ position: 'absolute', left: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default Inspection3D;