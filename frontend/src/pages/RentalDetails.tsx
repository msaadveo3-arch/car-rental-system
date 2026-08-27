import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, User, CarFront, CalendarRange, BadgeDollarSign, ShieldCheck,
  Undo2, CheckCircle2, XCircle,
} from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-800">
      {value === null || value === undefined || value === '' ? '—' : value}
    </p>
  </div>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
  icon, title, subtitle,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  </div>
);

const badge = (s: string) =>
  s === 'active'
    ? 'bg-green-50 text-green-700 border-green-200'
    : s === 'booked'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : s === 'returned'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : s === 'completed'
          ? 'bg-gray-100 text-gray-600 border-gray-200'
          : 'bg-red-50 text-red-600 border-red-200';

const RentalDetails: React.FC = () => {
  const { id } = useParams();
  const [r, setR] = useState<any>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get(`/rentals/${id}`).then((res) => setR(res.data.data));

  useEffect(() => {
    load().catch(() => setError('Failed to load contract'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const changeStatus = async (status: string, msg: string) => {
    if (!window.confirm(msg)) return;
    setBusy(true);
    setError('');
    try {
      await api.put(`/rentals/${id}`, { status });
      await load();
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  const fmt = (n: any) =>
    n !== null && n !== undefined && n !== ''
      ? `AED ${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  if (!r) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-gray-400">{error || 'Loading contract...'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/rentals" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Back to contracts">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                {r.booking_number ?? `#${r.id}`}
                <span className={`text-xs px-2.5 py-1 rounded-full border ${badge(r.status)}`}>{r.status}</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {r.contract_number ?? 'No contract number yet'} • Created by {r.staff_name ?? '—'} •{' '}
                {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
              </p>
              {r.status === 'booked' && (
                <p className="text-xs text-amber-600 mt-1">
                  Waiting for pickup inspection — handover happens only from the Inspection page (inspector account)
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {r.status === 'booked' && (
              <button
                onClick={() => changeStatus('cancelled', `Cancel booking ${r.booking_number}?`)}
                disabled={busy}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center gap-2 disabled:opacity-50"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}
            {r.status === 'active' && (
              <button
                onClick={() => changeStatus('returned', `Return car ${r.plate_number}?`)}
                disabled={busy}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 disabled:opacity-50"
              >
                <Undo2 size={16} /> Return Vehicle
              </button>
            )}
            {r.status === 'returned' && (
              <button
                onClick={() => changeStatus('completed', `Close contract ${r.booking_number}?`)}
                disabled={busy}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 size={16} /> Complete & Close
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Customer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionTitle icon={<User size={20} />} title="Customer" subtitle="Who rented the vehicle" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Full Name" value={r.customer_name} />
            <Field label="Mobile" value={r.customer_phone} />
            <Field label="Email" value={r.customer_email} />
            <Field label="Nationality" value={r.customer_nationality} />
            <Field label="Gender" value={r.customer_gender} />
            <Field label="Birth Date" value={r.customer_birth_date} />
            <Field label="Job" value={r.customer_job} />
            <Field label="ID Number" value={r.customer_national_id} />
            <Field label="License Type" value={r.customer_license_type} />
            <Field label="License Number" value={r.customer_license_number} />
            <Field label="License Expiry" value={r.customer_license_expiry} />
          </div>
        </div>

        {/* Vehicle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionTitle icon={<CarFront size={20} />} title="Vehicle" subtitle="The exact unit under contract" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Plate Number" value={r.plate_number} />
            <Field label="Make / Model" value={[r.make, r.model].filter(Boolean).join(' ')} />
            <Field label="Vehicle Group" value={r.car_group} />
            <Field label="Color" value={r.color} />
            <Field label="VIN" value={r.vin} />
            <Field label="Registration No" value={r.registration_number} />
          </div>
        </div>

        {/* Rental Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionTitle icon={<CalendarRange size={20} />} title="Rental Details" subtitle="Period, locations and kilometers" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Pickup Date" value={r.start_date?.slice(0, 10)} />
            <Field label="Return Date" value={r.end_date?.slice(0, 10)} />
            <Field label="Rental Type" value={r.rental_type} />
            <Field label="Hirer Source" value={r.hirer_source} />
            <Field label="Pickup Location" value={r.pickup_branch} />
            <Field label="Drop-Off Location" value={r.return_branch} />
            <Field label="Pickup Address" value={r.pickup_address} />
            <Field label="Drop-Off Address" value={r.dropoff_address} />
            <Field label="Cross Border" value={r.cross_border} />
            <Field label="KM Policy" value={r.km_policy} />
            <Field label="Allowed KM" value={r.allowed_km} />
            <Field label="Extra KM Fee" value={r.extra_km_fee != null ? `AED ${Number(r.extra_km_fee)}/km` : null} />
          </div>
        </div>

        {/* Tariff & Charges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionTitle icon={<BadgeDollarSign size={20} />} title="Tariff & Charges" subtitle="How the total was calculated" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Tariff Name" value={r.tariff_name} />
            <Field label="Pricing Mode" value={r.pricing_mode} />
            <Field label="Rental Band" value={r.rental_band} />
            <Field label="Units" value={r.units} />
            <Field label="Rack Rate" value={r.rack_rate != null ? fmt(r.rack_rate) : null} />
            <Field label="Gross Rent" value={r.gross_amount != null ? fmt(r.gross_amount) : null} />
            <Field label="Discount" value={r.discount_amount != null ? fmt(r.discount_amount) : null} />
            <Field label="Unlimited Add-on" value={r.unlimited_addon != null ? fmt(r.unlimited_addon) : null} />
            <Field label="Border Fee" value={r.border_fee != null ? fmt(r.border_fee) : null} />
            <Field label="VAT 5%" value={r.vat_amount != null ? fmt(r.vat_amount) : null} />
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500 uppercase">Contract Total</p>
            <p className="text-2xl font-extrabold text-blue-700">{fmt(r.total_amount)}</p>
          </div>
        </div>

        {/* Deposit */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <SectionTitle icon={<ShieldCheck size={20} />} title="Security Deposit" subtitle="Collected at booking" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Deposit Amount" value={r.security_deposit != null ? fmt(r.security_deposit) : null} />
            <Field label="Method" value={r.deposit_method} />
            <Field label="Transaction Ref" value={r.deposit_ref} />
            <Field label="Currency" value={r.currency} />
            <div>
              <p className="text-xs text-gray-400">Received</p>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  Number(r.deposit_received) === 1
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
              >
                {Number(r.deposit_received) === 1 ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RentalDetails;