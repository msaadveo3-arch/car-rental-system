import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft, Save, ShieldAlert, ClipboardList, Crosshair, Pencil, Trash2, Check, X,
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AppSelect from '../components/common/AppSelect';

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
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-6">
        <div className="redwood-section max-w-lg p-7 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-btn bg-error/10 text-error">
            <ShieldAlert size={22} aria-hidden />
          </span>
          <h1 className="mt-4 font-serif text-2xl text-base-content">Inspector access required</h1>
          <p className="mt-2 text-sm leading-6 text-base-content/65">
            Vehicle handover inspections are available only to inspector accounts.
          </p>
          <button type="button" className="btn btn-primary btn-sm mt-5" onClick={() => navigate('/')}>
            Return to dashboard
          </button>
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
    <div className="redwood-visual-space">
      <header className="redwood-visual-header">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/inspection-queue')}
            className="btn btn-ghost btn-square btn-sm shrink-0"
            title="Back to queue"
            aria-label="Back to inspection queue"
          >
            <ArrowLeft size={20} aria-hidden />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-primary">Pickup inspection</p>
            <h1 className="truncate font-serif text-xl leading-tight text-base-content sm:text-2xl">
              Vehicle condition workspace
            </h1>
            <p className="mt-1 truncate text-xs text-base-content/60">
              {rental
                ? `${rental.booking_number ?? `#${rental.id}`} • ${rental.plate_number} • ${rental.customer_name}`
                : 'Loading contract...'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={saveReport}
          disabled={saving || !rental}
          className="btn btn-primary btn-sm shrink-0 sm:btn-md"
        >
          <Save size={18} aria-hidden />
          <span className="hidden sm:inline">{saving ? 'Saving inspection...' : 'Save inspection & release vehicle'}</span>
          <span className="sm:hidden">{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </header>

      {error && (
        <div role="alert" className="border-b border-error/30 bg-error/10 px-4 py-2 text-sm text-error">
          {error}
        </div>
      )}

      <div className="redwood-visual-layout">
        <aside className="redwood-visual-panel" aria-label="Damage observations">
          <div className="border-b border-base-300 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-base-content">Damage observations</h2>
                <p className="mt-1 text-xs text-base-content/60">Select the vehicle model to add an observation.</p>
              </div>
              <span className="badge badge-primary">{damages.length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {damages.length === 0 ? (
              <div className="flex flex-col items-center px-3 py-10 text-center">
                <span className="redwood-empty-icon">
                  <Crosshair size={22} aria-hidden />
                </span>
                <p className="mt-4 text-sm font-semibold text-base-content">No damage recorded</p>
                <p className="mt-1 max-w-56 text-xs leading-relaxed text-base-content/60">
                  Select a point on the 3D vehicle to record its condition.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {damages.map((d, i) =>
                  editing === i ? (
                    <div key={i} className="space-y-3 rounded-box border border-primary/30 bg-primary/10 p-3">
                      <input
                        value={ePart}
                        onChange={(ev) => setEPart(ev.target.value)}
                        placeholder="Part name"
                        className="input input-bordered input-sm w-full bg-base-100"
                        aria-label="Vehicle part"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <AppSelect value={eType} onChange={setEType} size="sm" options={TYPES.map((type) => ({ value: type, label: type }))} />
                        <AppSelect value={eSev} onChange={setESev} size="sm" options={SEVERITIES.map((severity) => ({ value: severity, label: severity }))} />
                      </div>
                      <textarea
                        value={eNotes}
                        onChange={(ev) => setENotes(ev.target.value)}
                        rows={2}
                        placeholder="Notes"
                        className="textarea textarea-bordered textarea-sm w-full bg-base-100"
                        aria-label="Damage notes"
                      />
                      <div className="flex items-center gap-1 justify-end">
                        <button type="button" onClick={() => saveEdit(i)} title="Save changes" aria-label="Save changes" className="btn btn-ghost btn-square btn-xs text-success">
                          <Check size={15} aria-hidden />
                        </button>
                        <button type="button" onClick={() => setEditing(null)} title="Cancel editing" aria-label="Cancel editing" className="btn btn-ghost btn-square btn-xs">
                          <X size={15} aria-hidden />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <article key={i} className="redwood-card min-w-0 border border-base-300 bg-base-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 break-words text-sm font-semibold text-base-content">{d.part || `Observation ${i + 1}`}</p>
                        <span className={`badge shrink-0 ${d.severity === 'Severe' ? 'badge-error' : d.severity === 'Moderate' ? 'badge-warning' : 'badge-neutral'}`}>
                          {d.severity || '—'}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/60 mt-1">Type: {d.type || '—'}</p>
                      {d.notes && <p className="text-xs text-base-content/80 mt-1.5 leading-relaxed break-words">{d.notes}</p>}
                      {Array.isArray(d.photos) && d.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {d.photos.map((ph, pi) => (
                            <img key={pi} src={ph} alt={`damage ${i + 1}`} className="w-16 h-12 object-cover rounded-btn border border-base-300" />
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-end gap-1 border-t border-base-300 pt-2">
                        <button type="button" onClick={() => startEdit(i)} title="Edit observation" aria-label={`Edit observation ${i + 1}`} className="btn btn-ghost btn-square btn-xs text-primary">
                          <Pencil size={14} aria-hidden />
                        </button>
                        <button type="button" onClick={() => deleteDamage(i)} title="Delete observation" aria-label={`Delete observation ${i + 1}`} className="btn btn-ghost btn-square btn-xs text-error">
                          <Trash2 size={14} aria-hidden />
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-base-300 bg-base-200/55 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-btn bg-primary/10 text-primary">
                <ClipboardList size={16} aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-base-content">Inspection progress</p>
                <p className="text-[11px] text-base-content/60">Review observations before saving</p>
              </div>
            </div>
            <span className="badge badge-primary">{damages.length}</span>
          </div>
        </aside>

        <main className="redwood-visual-canvas" aria-label="3D vehicle inspection canvas">
          <iframe
            ref={iframeRef}
            title="3D Car Inspection"
            src={iframeSrc}
            className="absolute inset-0 block size-full border-0"
            allowFullScreen
          />
        </main>
      </div>
    </div>
  );
};

export default Inspection3D;
