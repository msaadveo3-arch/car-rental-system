import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FileText, Undo2, CheckCircle2, XCircle,
} from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { RedwoodContextItem, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-base-content/60">{label}</p>
    <p className="text-sm font-semibold text-base-content">
      {value === null || value === undefined || value === '' ? '—' : value}
    </p>
  </div>
);

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

const RentalDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <div className="p-12 text-center text-base-content/60">{error || 'Loading contract...'}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <RedwoodPage>
        <RedwoodPageHeader
          eyebrow="Contract detail"
          title={r.booking_number ?? `Rental #${r.id}`}
          description={r.status === 'booked' ? 'Waiting for pickup inspection before vehicle handover.' : 'Review the people, vehicle, dates, pricing, and deposit for this contract.'}
          icon={<FileText size={21} />}
          backLabel="Rental contracts"
          onBack={() => navigate('/rentals')}
          context={
            <>
              <RedwoodContextItem label="Contract" value={r.contract_number ?? 'Not assigned'} />
              <RedwoodContextItem label="Status" value={<span className={`badge badge-sm capitalize ${badge(r.status)}`}>{r.status}</span>} />
              <RedwoodContextItem label="Created by" value={r.staff_name ?? '—'} />
              <RedwoodContextItem label="Created" value={r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'} />
            </>
          }
          actions={
            <>
            {r.status === 'booked' && (
              <button
                onClick={() => changeStatus('cancelled', `Cancel booking ${r.booking_number}?`)}
                disabled={busy}
                className="btn btn-outline btn-error px-4 disabled:opacity-50"
              >
                <XCircle size={16} aria-hidden /> Cancel booking
              </button>
            )}
            {r.status === 'active' && (
              <button
                onClick={() => changeStatus('returned', `Return car ${r.plate_number}?`)}
                disabled={busy}
                className="btn btn-warning px-4 disabled:opacity-50"
              >
                <Undo2 size={16} aria-hidden /> Return vehicle
              </button>
            )}
            {r.status === 'returned' && (
              <button
                onClick={() => changeStatus('completed', `Close contract ${r.booking_number}?`)}
                disabled={busy}
                className="btn btn-neutral px-4 disabled:opacity-50"
              >
                <CheckCircle2 size={16} aria-hidden /> Complete contract
              </button>
            )}
            </>
          }
        />

        {error && (
          <div role="alert" className="alert alert-error"><span>{error}</span></div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Customer */}
        <RedwoodSection title="Customer" description="Identity and driving credentials for the hirer.">
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
        </RedwoodSection>

        {/* Vehicle */}
        <RedwoodSection title="Vehicle" description="The exact fleet unit assigned to this contract.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Plate Number" value={r.plate_number} />
            <Field label="Make / Model" value={[r.make, r.model].filter(Boolean).join(' ')} />
            <Field label="Vehicle Group" value={r.car_group} />
            <Field label="Color" value={r.color} />
            <Field label="VIN" value={r.vin} />
            <Field label="Registration No" value={r.registration_number} />
          </div>
        </RedwoodSection>

        {/* Rental Details */}
        <RedwoodSection title="Rental details" description="Period, handover locations, mileage policy, and travel terms." className="xl:col-span-2">
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
        </RedwoodSection>

        {/* Tariff & Charges */}
        <RedwoodSection title="Tariff and charges" description="How the final contract total was calculated.">
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
          <div className="mt-5 pt-4 border-t border-base-300 flex items-center justify-between">
            <p className="text-sm font-semibold text-base-content/60 uppercase">Contract Total</p>
            <p className="text-2xl font-extrabold text-primary">{fmt(r.total_amount)}</p>
          </div>
        </RedwoodSection>

        {/* Deposit */}
        <RedwoodSection title="Security deposit" description="Collection method, currency, and receipt status.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
            <Field label="Deposit Amount" value={r.security_deposit != null ? fmt(r.security_deposit) : null} />
            <Field label="Method" value={r.deposit_method} />
            <Field label="Transaction Ref" value={r.deposit_ref} />
            <Field label="Currency" value={r.currency} />
            <div>
              <p className="text-xs text-base-content/60">Received</p>
              <span
                className={`badge badge-sm ${
                  Number(r.deposit_received) === 1
                    ? 'badge-success'
                    : 'badge-ghost'
                }`}
              >
                {Number(r.deposit_received) === 1 ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </RedwoodSection>
        </div>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default RentalDetails;
