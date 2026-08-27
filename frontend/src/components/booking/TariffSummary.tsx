import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { BookingDraft } from './BookingDetailsForm';

interface CarInfo {
  id: number;
  daily_rate: string | null;
  monthly_rate: string | null;
  car_group: string | null;
}

interface RentalType {
  id: number;
  name: string;
  min_days: number;
  max_days: number;
}

interface Line {
  id: number;
  tariff_name: string;
  group_name: string;
  branch_name: string | null;
  pricing_mode: string;
  rental_type: string;
  rack_rate: string;
  floor_rate: string;
  is_default: number;
  status: string;
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

export interface TariffSummaryData {
  modeName: string;
  bandName: string | null;
  units: number;
  tariffName: string | null;
  rack: number | null;
  rent: number;
  discount: number;
  unlimitedAddOn: number;
  borderFee: number;
  vat: number;
  total: number;
}

const TariffSummary: React.FC<{
  car: CarInfo | null;
  value: BookingDraft;
  onChange: (patch: Partial<BookingDraft>) => void;
  onSummary?: (s: TariffSummaryData) => void;
}> = ({ car, value, onChange, onSummary }) => {
  const [rtypes, setRtypes] = useState<RentalType[]>([]);
  const [modes, setModes] = useState<{ id: number; name: string }[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [kmRows, setKmRows] = useState<KmRow[]>([]);
  const [borderFees, setBorderFees] = useState<
    { id: number; border_id: number; group_name: string; fee: string }[]
  >([]);
  const [borders, setBorders] = useState<{ id: number; name: string }[]>([]);
  const [modeName, setModeName] = useState('Daily Standard');

  useEffect(() => {
    api.get('/lookups/rental_types').then((r) => setRtypes(r.data.data.filter((x: any) => x.status === 'active')));
    api.get('/lookups/pricing_modes').then((r) => {
      const act = r.data.data.filter((x: any) => x.status === 'active');
      setModes(act);
      if (act.length && !act.some((m: any) => m.name === modeName)) setModeName(act[0].name);
    });
    api.get('/tariff-details').then((r) => setLines(r.data.data));
    api.get('/km-policies').then((r) => setKmRows(r.data.data));
    api.get('/border-fees').then((r) => setBorderFees(r.data.data));
    api.get('/lookups/borders').then((r) => setBorders(r.data.data));
  }, []);

  const days = useMemo(() => {
    if (!value.startDate || !value.endDate) return 0;
    const d = Math.ceil(
      (new Date(value.endDate).getTime() - new Date(value.startDate).getTime()) / 86400000
    );
    return d > 0 ? d : 0;
  }, [value.startDate, value.endDate]);

  const band = useMemo(() => {
    if (!days || rtypes.length === 0) return null;
    return (
      rtypes.find((r) => days >= r.min_days && days <= r.max_days) ??
      rtypes.reduce((a, b) => (b.max_days > a.max_days ? b : a))
    );
  }, [days, rtypes]);

  const units = band ? Math.max(1, Math.ceil(days / band.min_days)) : days;

  const line = useMemo(() => {
    if (!car?.car_group || !band) return null;
    const cands = lines.filter(
      (l) =>
        l.status === 'active' &&
        l.group_name === car.car_group &&
        l.pricing_mode === modeName &&
        l.rental_type === band.name
    );
    if (cands.length === 0) return null;
    return [...cands].sort(
      (a, b) => b.is_default - a.is_default || (a.branch_name ? 1 : 0) - (b.branch_name ? 1 : 0)
    )[0];
  }, [lines, car, band, modeName]);

  const kmRow = useMemo(() => {
    if (!car?.car_group || !band) return null;
    return (
      kmRows.find(
        (k) => k.status === 'active' && k.group_name === car.car_group && k.rental_type === band.name
      ) ?? null
    );
  }, [kmRows, car, band]);

  const isUnlimited = (value as any).kmPolicy === 'unlimited';

  const daily = Number(car?.daily_rate ?? 0);
  const monthly = Number(car?.monthly_rate ?? 0);
  const months = Math.ceil(days / 30);

  const rent = line
    ? Number(line.rack_rate) * units
    : value.rentalType === 'monthly'
      ? months * monthly
      : days * daily;

  const floorTotal = line ? Number(line.floor_rate) * units : 0;
  const maxDiscount = line ? Math.max(0, rent - floorTotal) : rent;
  const wantedDiscount = Number(value.discount) || 0;
  const discount = Math.min(wantedDiscount, maxDiscount);
  const capped = wantedDiscount > maxDiscount;

  const border = borders.find((b) => String(b.id) === value.crossBorderId) ?? null;
  const borderFeeRow =
    border && car?.car_group
      ? borderFees.find((r) => r.border_id === border.id && r.group_name === car.car_group) ?? null
      : null;
  const borderFee = border && borderFeeRow ? Number(borderFeeRow.fee) : 0;

  const unlimitedAddOn = isUnlimited && kmRow ? Number(kmRow.unlimited_daily_amount) * days : 0;

  const subtotal = rent - discount + borderFee + unlimitedAddOn;
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

    useEffect(() => {
    onSummary?.({
      modeName,
      bandName: band?.name ?? null,
      units,
      tariffName: line?.tariff_name ?? null,
      rack: line ? Number(line.rack_rate) : null,
      rent,
      discount,
      unlimitedAddOn,
      borderFee,
      vat,
      total,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeName, band, line, units, rent, discount, unlimitedAddOn, borderFee, vat, total]);

  const fmt = (n: number) =>
    `AED ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Pricing Mode</span>
            <select
              value={modeName}
              onChange={(e) => setModeName(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {modes.map((m) => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {line
                ? `${line.tariff_name} • ${line.rental_type} — Rack ${fmt(Number(line.rack_rate))} × ${units}`
                : value.rentalType === 'monthly'
                  ? `Car Monthly Rate × ${months} month(s)`
                  : `Car Daily Rate × ${days} day(s)`}
            </span>
            <span className="font-medium text-gray-800">{fmt(rent)}</span>
          </div>

          {kmRow && !isUnlimited && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Included KM — {kmRow.max_km} km/day × {days} day(s)
              </span>
              <span className="font-medium text-gray-800">
                {(kmRow.max_km * days).toLocaleString()} km
              </span>
            </div>
          )}
          {kmRow && !isUnlimited && (
            <p className="text-xs text-gray-400">
              Extra kilometer on return: AED {Number(kmRow.extra_km_rate)}/km
            </p>
          )}

          {isUnlimited && kmRow && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Unlimited Mileage Add-on × {days} day(s)</span>
              <span className="font-medium text-gray-800">{fmt(unlimitedAddOn)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Cross Border Fee{border ? ` — ${border.name}` : ''}
            </span>
            <span className="font-medium text-gray-800">{fmt(borderFee)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Discount (AED)</span>
            <input
              type="number"
              min="0"
              value={value.discount}
              onChange={(e) => onChange({ discount: e.target.value })}
              className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right"
            />
          </div>
          {capped && (
            <p className="text-xs text-amber-600">
              Discount capped at {fmt(maxDiscount)} — floor rate protection 🛡️
            </p>
          )}

          <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-800">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">VAT 5%</span>
            <span className="font-medium text-gray-800">{fmt(vat)}</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col justify-between">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total</p>
          <p className="text-3xl font-extrabold text-blue-800">{fmt(total)}</p>
          <p className="text-xs text-blue-500 mt-2">
            {car
              ? `${car.car_group ?? '—'} • ${band ? `${band.name} (${days} days)` : `${days} days`}`
              : 'Select a vehicle to calculate'}
          </p>
        </div>
      </div>

      {!car && (
        <p className="text-sm text-amber-600 mt-3">Select a vehicle first to see the tariff.</p>
      )}
      {car && days > 0 && !line && (
        <p className="text-sm text-amber-600 mt-3">
          No tariff line for ({car.car_group} • {band?.name ?? '—'} • {modeName}) — using the car's own rates.
        </p>
      )}
    </div>
  );
};

export default TariffSummary;