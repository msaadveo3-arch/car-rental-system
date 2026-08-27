import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

export interface BookingDraft {
  startDate: string;
  endDate: string;
  rentalType: 'daily' | 'monthly';
  hirerSourceId: string;
  pickupBranchId: string;
  returnBranchId: string;
  pickupAddress: string;
  dropoffAddress: string;
  kmPolicy: 'limited' | 'unlimited';
  allowedKm: string;
  extraKmFee: string;
  crossBorderId: string;
  notes: string;
}

export const emptyDraft: BookingDraft = {
  startDate: '',
  endDate: '',
  rentalType: 'daily',
  hirerSourceId: '',
  pickupBranchId: '',
  returnBranchId: '',
  pickupAddress: '',
  dropoffAddress: '',
  kmPolicy: 'limited',
  allowedKm: '',
  extraKmFee: '2',
  crossBorderId: '',
  notes: '',
};

interface Lookup {
  id: number;
  name: string;
  fee?: string | null;
  address?: string | null;
}

interface RentalType {
  id: number;
  name: string;
  min_days: number;
  max_days: number;
}

interface KmRow {
  id: number;
  group_name: string;
  rental_type: string;
  max_km: number;
  extra_km_rate: string;
  unlimited_daily_amount: string;
  status: string;
}

const inputCls =
  'w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-3">{children}</p>
);

const BookingDetailsForm: React.FC<{
  value: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  carGroupName?: string | null;
}> = ({ value, onChange, carGroupName }) => {
  const [sources, setSources] = useState<Lookup[]>([]);
  const [branches, setBranches] = useState<Lookup[]>([]);
  const [borders, setBorders] = useState<Lookup[]>([]);
  const [borderFees, setBorderFees] = useState<
    { id: number; border_id: number; group_name: string; fee: string }[]
  >([]);
  const [rtypes, setRtypes] = useState<RentalType[]>([]);
  const [kmRows, setKmRows] = useState<KmRow[]>([]);

  useEffect(() => {
    api.get('/lookups/sources').then((r) => setSources(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/branches').then((r) => setBranches(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/borders').then((r) => setBorders(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/border-fees').then((r) => setBorderFees(r.data.data));
    api.get('/lookups/rental_types').then((r) => setRtypes(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/km-policies').then((r) => setKmRows(r.data.data.filter((x: any) => x.status === 'active')));
  }, []);

  const days = useMemo(() => {
    if (!value.startDate || !value.endDate) return 0;
    const d = Math.ceil(
      (new Date(value.endDate).getTime() - new Date(value.startDate).getTime()) / 86400000
    );
    return d > 0 ? d : 0;
  }, [value.startDate, value.endDate]);

  // Rental Type محسوب: 30 يوم فأكثر = Monthly
  useEffect(() => {
    const rt: 'daily' | 'monthly' = days >= 30 ? 'monthly' : 'daily';
    if (rt !== value.rentalType) onChange({ rentalType: rt });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  // شريحة المدة (Daily / Weekly / Monthly)
  const band = useMemo(() => {
    if (!days || rtypes.length === 0) return null;
    return (
      rtypes.find((r) => days >= r.min_days && days <= r.max_days) ??
      rtypes.reduce((a, b) => (b.max_days > a.max_days ? b : a))
    );
  }, [days, rtypes]);

  // سطر KM Policy المطابق
  const kmRow = useMemo(() => {
    if (!carGroupName || !band) return null;
    return (
      kmRows.find(
        (k) => k.group_name === carGroupName && k.rental_type === band.name
      ) ?? null
    );
  }, [kmRows, carGroupName, band]);

  // املأ allowedKm + extraKmFee تلقائيًا من المصفوفة
  useEffect(() => {
    if (value.kmPolicy === 'limited' && kmRow && days > 0) {
      const allowed = kmRow.max_km * days;
      const extra = Number(kmRow.extra_km_rate);
      if (
        value.allowedKm !== String(allowed) ||
        Number(value.extraKmFee) !== extra
      ) {
        onChange({
          allowedKm: String(allowed),
          extraKmFee: String(extra),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kmRow, days, value.kmPolicy]);

  const border = borders.find((b) => String(b.id) === value.crossBorderId) ?? null;
  const borderFee =
    border && carGroupName
      ? borderFees.find(
          (r) => r.border_id === Number(value.crossBorderId) && r.group_name === carGroupName
        ) ?? null
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* RENTAL SETUP */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Rental Setup</SectionLabel>
          {days > 0 && (
            <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">
              Period: {days} Days • {band?.name ?? '—'}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rental Type (auto)</label>
            <input
              value={value.rentalType === 'monthly' ? 'Monthly' : 'Daily'}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hirer Source</label>
            <select
              value={value.hirerSourceId}
              onChange={(e) => onChange({ hirerSourceId: e.target.value })}
              className={inputCls}
            >
              <option value="">—</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATES & LOCATIONS */}
      <div>
        <SectionLabel>Dates & Locations</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-In (Pickup) *</label>
            <input type="date" value={value.startDate} onChange={(e) => onChange({ startDate: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out (Return) *</label>
            <input type="date" value={value.endDate} onChange={(e) => onChange({ endDate: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <select
              value={value.pickupBranchId}
              onChange={(e) => {
                const b = branches.find((x) => String(x.id) === e.target.value);
                const addr = b?.address ?? '';
                onChange(
                  value.returnBranchId
                    ? { pickupBranchId: e.target.value, pickupAddress: addr }
                    : {
                        pickupBranchId: e.target.value,
                        pickupAddress: addr,
                        returnBranchId: e.target.value,
                        dropoffAddress: addr,
                      }
                );
              }}
              className={inputCls}
            >
              <option value="">—</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-Off Location</label>
            <select
              value={value.returnBranchId}
              onChange={(e) => {
                const b = branches.find((x) => String(x.id) === e.target.value);
                onChange({ returnBranchId: e.target.value, dropoffAddress: b?.address ?? '' });
              }}
              className={inputCls}
            >
              <option value="">—</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
            <input value={value.pickupAddress} onChange={(e) => onChange({ pickupAddress: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drop-Off Address</label>
            <input value={value.dropoffAddress} onChange={(e) => onChange({ dropoffAddress: e.target.value })} className={inputCls} />
          </div>
        </div>
        {days === 0 && value.startDate && value.endDate && (
          <p className="text-sm text-red-600 mt-2">End date must be after start date</p>
        )}
      </div>

      {/* KM POLICY */}
      <div>
        <SectionLabel>KM Policy</SectionLabel>

        {!carGroupName && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-lg text-sm mb-4">
            Select a vehicle first to load the KM policy
          </div>
        )}

        {carGroupName && !kmRow && days > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm mb-4">
            No KM policy configured for <strong>{carGroupName}</strong> • <strong>{band?.name ?? '—'}</strong> — add it in Lookups → KM Policies
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              checked={value.kmPolicy === 'limited'}
              onChange={() => onChange({ kmPolicy: 'limited' })}
              className="w-4 h-4"
            />
            Limited
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="radio"
              checked={value.kmPolicy === 'unlimited'}
              onChange={() => onChange({ kmPolicy: 'unlimited' })}
              className="w-4 h-4"
            />
            Unlimited
            {kmRow && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                + AED {Number(kmRow.unlimited_daily_amount)}/day
              </span>
            )}
          </label>

          {value.kmPolicy === 'limited' && kmRow && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value.allowedKm}
                  readOnly
                  className="w-28 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
                />
                <span className="text-xs text-gray-400 font-medium">KM Total</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={value.extraKmFee}
                  readOnly
                  className="w-24 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
                />
                <span className="text-xs text-gray-400 font-medium">AED/Extra KM</span>
              </div>
            </>
          )}
        </div>

        {kmRow && value.kmPolicy === 'limited' && (
          <p className="text-xs text-gray-400 mt-2">
            From matrix: {kmRow.max_km} km/day × {days} days = {(kmRow.max_km * days).toLocaleString()} km included • AED {Number(kmRow.extra_km_rate)} per extra km on return
          </p>
        )}
      </div>

      {/* CROSS BORDERS */}
      <div>
        <SectionLabel>Cross Borders</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <select
            value={value.crossBorderId}
            onChange={(e) => onChange({ crossBorderId: e.target.value })}
            className={inputCls}
          >
            <option value="">No cross border</option>
            {borders.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {border && !carGroupName && (
            <div className="bg-gray-50 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg text-sm">
              Select a vehicle to see the group rate
            </div>
          )}
          {border && carGroupName && borderFee && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-lg text-sm font-medium">
              + AED {Number(borderFee.fee)} fee applies ({carGroupName} rate)
            </div>
          )}
          {border && carGroupName && !borderFee && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm">
              No fee configured for {carGroupName} → {border.name} — add it in Lookups
            </div>
          )}
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea rows={3} value={value.notes} onChange={(e) => onChange({ notes: e.target.value })} className={inputCls} />
      </div>
    </div>
  );
};

export default BookingDetailsForm;