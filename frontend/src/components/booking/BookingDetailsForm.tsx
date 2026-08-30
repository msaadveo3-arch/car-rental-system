import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import AppSelect from '../common/AppSelect';
import AppDatePicker from '../common/AppDatePicker';
import { RedwoodSection } from '../common/RedwoodPage';

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

const inputCls = 'app-field';

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
      <div className="space-y-8">
      {/* RENTAL SETUP */}
      <RedwoodSection
        title="Rental setup"
        description="Contract type and originating business source."
        actions={days > 0 ? (
            <span className="text-xs font-medium bg-primary/10 text-primary border border-primary/30 px-2 py-1 rounded-full">
              Period: {days} Days • {band?.name ?? '—'}
            </span>
          ) : undefined}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Rental Type (auto)</label>
            <input
              value={value.rentalType === 'monthly' ? 'Monthly' : 'Daily'}
              disabled
              className="w-full px-4 py-2 border border-base-300 rounded-lg bg-base-200 text-base-content/80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Hirer Source</label>
            <AppSelect
              value={value.hirerSourceId}
              onChange={(hirerSourceId) => onChange({ hirerSourceId })}
              placeholder="—"
              options={sources.map((source) => ({ value: source.id, label: source.name }))}
            />
          </div>
        </div>
      </RedwoodSection>

      {/* DATES & LOCATIONS */}
      <RedwoodSection title="Dates and locations" description="Pickup and return schedule, branches, and handover addresses.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Check-In (Pickup) *</label>
            <AppDatePicker value={value.startDate} onChange={(startDate) => onChange({ startDate })} placeholder="Select pickup date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Check-Out (Return) *</label>
            <AppDatePicker value={value.endDate} onChange={(endDate) => onChange({ endDate })} placeholder="Select return date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Pickup Location</label>
            <AppSelect
              value={value.pickupBranchId}
              onChange={(pickupBranchId) => {
                const b = branches.find((x) => String(x.id) === pickupBranchId);
                const addr = b?.address ?? '';
                onChange(
                  value.returnBranchId
                    ? { pickupBranchId, pickupAddress: addr }
                    : {
                        pickupBranchId,
                        pickupAddress: addr,
                        returnBranchId: pickupBranchId,
                        dropoffAddress: addr,
                      }
                );
              }}
              placeholder="—"
              options={branches.map((branch) => ({ value: branch.id, label: branch.name }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Drop-Off Location</label>
            <AppSelect
              value={value.returnBranchId}
              onChange={(returnBranchId) => {
                const b = branches.find((x) => String(x.id) === returnBranchId);
                onChange({ returnBranchId, dropoffAddress: b?.address ?? '' });
              }}
              placeholder="—"
              options={branches.map((branch) => ({ value: branch.id, label: branch.name }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Pickup Address</label>
            <input value={value.pickupAddress} onChange={(e) => onChange({ pickupAddress: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-base-content/80 mb-1">Drop-Off Address</label>
            <input value={value.dropoffAddress} onChange={(e) => onChange({ dropoffAddress: e.target.value })} className={inputCls} />
          </div>
        </div>
        {days === 0 && value.startDate && value.endDate && (
          <p className="text-sm text-error mt-2">End date must be after start date</p>
        )}
      </RedwoodSection>

      {/* KM POLICY */}
      <RedwoodSection title="Mileage policy" description="Included distance and excess kilometer terms for this rental.">

        {!carGroupName && (
          <div className="bg-warning/10 border border-warning/30 text-warning px-4 py-2.5 rounded-lg text-sm mb-4">
            Select a vehicle first to load the KM policy
          </div>
        )}

        {carGroupName && !kmRow && days > 0 && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-2.5 rounded-lg text-sm mb-4">
            No KM policy configured for <strong>{carGroupName}</strong> • <strong>{band?.name ?? '—'}</strong> — add it in Lookups → KM Policies
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-base-content/80">
            <input
              type="radio"
              checked={value.kmPolicy === 'limited'}
              onChange={() => onChange({ kmPolicy: 'limited' })}
              className="w-4 h-4"
            />
            Limited
          </label>
          <label className="flex items-center gap-2 text-sm text-base-content/80">
            <input
              type="radio"
              checked={value.kmPolicy === 'unlimited'}
              onChange={() => onChange({ kmPolicy: 'unlimited' })}
              className="w-4 h-4"
            />
            Unlimited
            {kmRow && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border bg-success/10 text-success border-success/30">
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
                  className="w-28 px-4 py-2 border border-base-300 rounded-lg bg-base-200 text-base-content/80 font-medium"
                />
                <span className="text-xs text-base-content/60 font-medium">KM Total</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={value.extraKmFee}
                  readOnly
                  className="w-24 px-4 py-2 border border-base-300 rounded-lg bg-base-200 text-base-content/80 font-medium"
                />
                <span className="text-xs text-base-content/60 font-medium">AED/Extra KM</span>
              </div>
            </>
          )}
        </div>

        {kmRow && value.kmPolicy === 'limited' && (
          <p className="text-xs text-base-content/60 mt-2">
            From matrix: {kmRow.max_km} km/day × {days} days = {(kmRow.max_km * days).toLocaleString()} km included • AED {Number(kmRow.extra_km_rate)} per extra km on return
          </p>
        )}
      </RedwoodSection>

      {/* CROSS BORDERS */}
      <RedwoodSection title="Cross-border travel" description="Optional destination and the applicable vehicle-group fee.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <AppSelect
            value={value.crossBorderId}
            onChange={(crossBorderId) => onChange({ crossBorderId })}
            placeholder="No cross border"
            options={borders.map((border) => ({ value: border.id, label: border.name }))}
          />
          {border && !carGroupName && (
            <div className="bg-base-200 border border-base-300 text-base-content/60 px-4 py-2.5 rounded-lg text-sm">
              Select a vehicle to see the group rate
            </div>
          )}
          {border && carGroupName && borderFee && (
            <div className="bg-warning/10 border border-warning/30 text-warning px-4 py-2.5 rounded-lg text-sm font-medium">
              + AED {Number(borderFee.fee)} fee applies ({carGroupName} rate)
            </div>
          )}
          {border && carGroupName && !borderFee && (
            <div className="bg-error/10 border border-error/30 text-error px-4 py-2.5 rounded-lg text-sm">
              No fee configured for {carGroupName} → {border.name} — add it in Lookups
            </div>
          )}
        </div>
      </RedwoodSection>

      {/* NOTES */}
      <RedwoodSection title="Contract notes" description="Operational notes carried with the rental transaction.">
        <label className="block text-sm font-medium text-base-content/80 mb-1">Notes</label>
        <textarea rows={3} value={value.notes} onChange={(e) => onChange({ notes: e.target.value })} className="app-textarea" />
      </RedwoodSection>
    </div>
  );
};

export default BookingDetailsForm;
