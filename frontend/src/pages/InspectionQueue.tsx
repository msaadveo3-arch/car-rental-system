import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Box, ShieldAlert, Eye, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AuthContext } from '../context/AuthContext';

interface QueueItem {
  id: number;
  booking_number: string | null;
  customer_name: string;
  plate_number: string;
  make: string | null;
  model: string | null;
  start_date: string;
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

const InspectionQueue: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const role = (user as any)?.role ?? 'staff';

  const [items, setItems] = useState<QueueItem[]>([]);
  const [done, setDone] = useState<DoneItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'inspector') return;
    Promise.all([api.get('/rentals'), api.get('/inspections/pickup')])
      .then(([r1, r2]) => {
        setItems(r1.data.data.filter((x: any) => x.status === 'booked'));
        setDone(r2.data.data);
      })
      .finally(() => setLoading(false));
  }, [role]);

  if (role !== 'inspector') {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-lg flex items-center gap-2">
          <ShieldAlert size={18} /> Inspection area — inspector account only.
        </div>
      </DashboardLayout>
    );
  }

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

    // ===== Header =====
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

    // ===== Customer & Vehicle =====
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

    // ===== Damage Details =====
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

    // ===== Signatures =====
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="text-amber-500" size={24} /> Inspection Queue
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Pending pickup inspections + your completed reports
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
            <h2 className="text-sm font-bold text-amber-700 uppercase tracking-wide">Waiting for Inspection</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Booking</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Car</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Pickup Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4 font-medium text-gray-900">{r.booking_number ?? `#${r.id}`}</td>
                    <td className="px-5 py-4 text-gray-600">{r.customer_name}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {r.plate_number}
                      <span className="block text-xs text-gray-400">{[r.make, r.model].filter(Boolean).join(' ')}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">{r.start_date?.slice(0, 10)}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate(`/inspection-view/${r.id}`)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 text-sm font-medium"
                      >
                        <Box size={16} /> Start 3D Inspection
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                      No contracts waiting for inspection 🎉
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 bg-green-50 border-b border-green-100">
            <h2 className="text-sm font-bold text-green-700 uppercase tracking-wide">Completed Inspections</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Booking</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Car</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Inspected At</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Damages</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {done.map((it) => (
                  <tr key={it.inspection_id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4 font-medium text-gray-900">{it.booking_number ?? `#${it.rental_id}`}</td>
                    <td className="px-5 py-4 text-gray-600">{it.customer_name}</td>
                    <td className="px-5 py-4 text-gray-600">{it.plate_number}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {it.inspection_date ? new Date(it.inspection_date).toLocaleString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-full border bg-gray-100 text-gray-600 border-gray-200">
                        {safeParse(it.damage_report).length} issue(s)
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                        {it.rental_status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          disabled
                          title="Inspection report page — coming next"
                          className="p-2 text-gray-300 cursor-not-allowed"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => downloadPdf(it)}
                          title="Download PDF report"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && done.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                      No completed inspections yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InspectionQueue;