import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Undo2, CheckCircle2, XCircle, Eye, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { RedwoodCollectionToolbar, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

interface Rental {
  id: number;
  booking_number: string | null;
  contract_number: string | null;
  customer_name: string;
  customer_phone: string;
  plate_number: string;
  make: string | null;
  model: string | null;
  start_date: string;
  end_date: string;
  total_amount: string | null;
  status: string;
}

interface DoneItem {
  inspection_id: number;
  inspection_date: string;
  notes: string | null;
  damage_report: string | null;
  rental_id: number;
  booking_number: string | null;
  contract_number: string | null;
  rental_status: string;
  start_date: string;
  end_date: string;
  customer_name: string;
  customer_phone: string;
  plate_number: string;
  vin: string | null;
  mileage: string | null;
  color: string | null;
  make: string | null;
  model: string | null;
  car_group: string | null;
  inspector_name: string | null;
}

const safeParse = (s: string | null): any[] => {
  try {
    const v = JSON.parse(s ?? '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const badge = (s: string) =>
  s === 'active'
    ? 'badge-success'
    : s === 'booked'
      ? 'badge-primary'
      : s === 'returned'
        ? 'badge-warning'
        : s === 'completed'
          ? 'badge-neutral'
          : 'badge-error';

const downloadPdf = (it: DoneItem) => {
  const doc = new jsPDF();
  const damages = safeParse(it.damage_report);
  const W = 210;
  const M = 14;
  const CW = W - M * 2;
  let y = 0;

  const ensure = (h: number) => {
    if (y + h > 280) {
      doc.addPage();
      y = 15;
    }
  };

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('CarRental — Vehicle Inspection Report', M, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Booking: ${it.booking_number ?? '#' + it.rental_id}   |   Contract: ${it.contract_number ?? '—'}   |   Status: ${it.rental_status}`,
    M,
    20
  );
  doc.text(
    `Inspected: ${it.inspection_date ? new Date(it.inspection_date).toLocaleString() : '—'}   |   Inspector: ${it.inspector_name ?? '—'}`,
    M,
    25.5
  );
  y = 40;

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Customer & Vehicle', M, y);
  y += 2.5;
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.7);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFontSize(10);
  const kv = (label: string, value: string, col = 0) => {
    const x = M + col * (CW / 2);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '—', x + 30, y);
  };
  kv('Customer', it.customer_name);
  kv('Phone', it.customer_phone, 1);
  y += 6;
  kv('Car', `${it.plate_number} — ${[it.make, it.model].filter(Boolean).join(' ')}`);
  kv('Group', it.car_group ?? '—', 1);
  y += 6;
  kv('VIN', it.vin ?? '—');
  kv('Odometer', it.mileage != null ? `${Number(it.mileage).toLocaleString()} km` : '—', 1);
  y += 6;
  kv('Color', it.color ?? '—');
  kv('Period', `${(it.start_date || '').slice(0, 10)} → ${(it.end_date || '').slice(0, 10)}`, 1);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text(`Damage Details (${damages.length})`, M, y);
  y += 2.5;
  doc.setDrawColor(185, 28, 28);
  doc.line(M, y, W - M, y);
  y += 7;
  doc.setTextColor(30, 41, 59);

  if (damages.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No damages recorded — vehicle released clean.', M, y);
    y += 10;
  }

  damages.forEach((d: any, idx: number) => {
    const photos: string[] = Array.isArray(d.photos) ? d.photos : [];
    const noteLines = d.notes ? (doc.splitTextToSize(String(d.notes), CW - 12) as string[]) : [];
    const photoRows = photos.length ? Math.ceil(photos.length / 2) * 47 : 0;
    const blockH = 16 + (noteLines.length ? noteLines.length * 5 + 3 : 0) + photoRows + 4;

    ensure(blockH + 8);

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y - 5, CW, blockH, 2, 2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(185, 28, 28);
    doc.text(`#${idx + 1} — ${d.part || '—'}`, M + 5, y + 1);

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Type: ${d.type || '—'}   |   Severity: ${d.severity || '—'}`, M + 5, y + 7);

    let yy = y + 13;
    if (noteLines.length) {
      doc.setFont('helvetica', 'normal');
      doc.text(noteLines, M + 5, yy);
      yy += noteLines.length * 5 + 3;
    }

    if (photos.length) {
      let px = M + 5;
      let py = yy;
      photos.forEach((ph) => {
        try {
          doc.addImage(ph, 'JPEG', px, py, 60, 42);
        } catch (e) {
          /* صورة بايظة — نتجاهل */
        }
        px += 65;
        if (px > W - M - 60) {
          px = M + 5;
          py += 47;
        }
      });
    }

    y += blockH + 8;
  });

  ensure(32);
  y += 8;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.line(M, y + 10, M + 70, y + 10);
  doc.line(W - M - 70, y + 10, W - M, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Inspector Signature', M, y + 15);
  doc.text('Customer Signature', W - M - 70, y + 15);

  doc.save(`${it.booking_number ?? 'inspection'}-pickup-report.pdf`);
};

const Rentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [inspections, setInspections] = useState<DoneItem[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([api.get('/rentals'), api.get('/inspections/pickup')]).then(([r1, r2]) => {
      setRentals(r1.data.data);
      setInspections(r2.data.data);
    });

  useEffect(() => {
    load();
  }, []);

  const inspByRental = useMemo(() => {
    const m = new Map<number, DoneItem>();
    inspections.forEach((i) => m.set(i.rental_id, i));
    return m;
  }, [inspections]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rentals;
    return rentals.filter(
      (r) =>
        (r.booking_number ?? '').toLowerCase().includes(s) ||
        (r.contract_number ?? '').toLowerCase().includes(s) ||
        (r.customer_name ?? '').toLowerCase().includes(s) ||
        (r.plate_number ?? '').toLowerCase().includes(s)
    );
  }, [q, rentals]);

  const changeStatus = async (id: number, status: string, msg: string) => {
    if (!window.confirm(msg)) return;
    setBusy(id);
    setError('');
    try {
      await api.put(`/rentals/${id}`, { status });
      await load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    } finally {
      setBusy(null);
    }
  };

  return (
    <DashboardLayout>
      <RedwoodPage>
        <RedwoodPageHeader
          eyebrow="Rental operations"
          title="Rental contracts"
          description="Track bookings through inspection, handover, return, and contract closure."
          icon={<FileText size={21} />}
          actions={<Link to="/booking" className="btn btn-primary gap-2"><Plus size={18} aria-hidden /> New contract</Link>}
        />

        {error && (
          <div role="alert" className="alert alert-error"><span>{error}</span></div>
        )}

        <RedwoodSection
          title="Contract register"
          description="Handover and activation are completed by an inspector after pickup inspection."
          contentMode="flush"
        >
          <RedwoodCollectionToolbar
            search={{ value: q, onChange: setQ, placeholder: 'Search booking, contract, customer, or plate' }}
            summary={`${filtered.length} of ${rentals.length} contracts`}
          />
          <div className="overflow-x-auto">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Booking</th><th>Contract</th><th>Customer</th><th>Vehicle</th><th>Period</th><th>Total</th><th>Status</th><th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
            <tbody className="divide-y divide-base-300">
                {filtered.map((r) => {
                  const insp = inspByRental.get(r.id);
                  return (
                    <tr key={r.id} className="hover:bg-base-200/60">
                      <td className="font-medium text-base-content">{r.booking_number ?? `#${r.id}`}</td>
                      <td className="text-base-content/80">{r.contract_number ?? '—'}</td>
                      <td className="text-base-content/80">{r.customer_name}</td>
                      <td className="text-base-content/80">
                        {r.plate_number}
                        <span className="block text-xs text-base-content/60">{[r.make, r.model].filter(Boolean).join(' ')}</span>
                      </td>
                      <td className="text-base-content/60 text-xs">
                        {r.start_date?.slice(0, 10)} → {r.end_date?.slice(0, 10)}
                      </td>
                      <td className="font-semibold text-base-content">
                        {r.total_amount != null ? `AED ${Number(r.total_amount).toLocaleString()}` : '—'}
                      </td>
                      <td>
                        <span className={`badge capitalize ${badge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/rentals/${r.id}`}
                             title="View Contract"
                             aria-label={`View contract ${r.booking_number ?? r.id}`}
                             className="btn btn-ghost btn-square btn-sm"
                          >
                            <Eye size={16} />
                          </Link>
                          {insp && (
                            <button
                              onClick={() => downloadPdf(insp)}
                               title="Download inspection report (PDF)"
                               aria-label={`Download inspection report for ${r.booking_number ?? r.id}`}
                               className="btn btn-ghost btn-square btn-sm text-primary"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          {r.status === 'booked' && (
                            <button
                              onClick={() => changeStatus(r.id, 'cancelled', `Cancel booking ${r.booking_number}?`)}
                              disabled={busy === r.id}
                               title="Cancel"
                               aria-label={`Cancel booking ${r.booking_number ?? r.id}`}
                               className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10 disabled:opacity-50"
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                          {r.status === 'active' && (
                            <button
                              onClick={() => changeStatus(r.id, 'returned', `Return car ${r.plate_number}?`)}
                              disabled={busy === r.id}
                               title="Return"
                               aria-label={`Return vehicle ${r.plate_number}`}
                               className="btn btn-ghost btn-square btn-sm text-warning hover:bg-warning/10 disabled:opacity-50"
                            >
                              <Undo2 size={16} />
                            </button>
                          )}
                          {r.status === 'returned' && (
                            <button
                              onClick={() => changeStatus(r.id, 'completed', `Close contract ${r.booking_number}?`)}
                              disabled={busy === r.id}
                               title="Complete"
                               aria-label={`Complete contract ${r.booking_number ?? r.id}`}
                               className="btn btn-ghost btn-square btn-sm disabled:opacity-50"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {(r.status === 'completed' || r.status === 'cancelled') && (
                            <span className="text-xs text-base-content/60">Closed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-base-content/60">No contracts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </RedwoodSection>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default Rentals;
