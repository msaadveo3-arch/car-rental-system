import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerPicker from '../components/booking/CustomerPicker';
import VehiclePicker from '../components/booking/VehiclePicker';
import BookingDetailsForm, { BookingDraft, emptyDraft } from '../components/booking/BookingDetailsForm';
import TariffSummary, { TariffSummaryData } from '../components/booking/TariffSummary';
import { Link } from 'react-router-dom';
import { FileCheck2 } from 'lucide-react';

const STEPS = [
  { n: 1, label: 'Customer Docs', page: 0, section: 'customer' },
  { n: 2, label: 'Security Deposit', page: 0, section: 'deposit' },
  { n: 3, label: 'Vehicle', page: 1, section: 'vehicle' },
  { n: 4, label: 'Booking Info', page: 1, section: 'details' },
  { n: 5, label: 'Tariff', page: 1, section: 'tariff' },
  { n: 6, label: 'Accessories', page: 1, section: 'accessories' },
  { n: 7, label: 'Additional Drivers', page: 1, section: 'drivers' },
  { n: 8, label: 'Advanced Payments', page: 2, section: 'payment' },
  { n: 9, label: 'NOL & Contract', page: 2, section: 'legal' },
];

const PAGES: { title: string; sections: { key: string; title: string }[] }[] = [
  {
    title: 'Customer & Deposit',
    sections: [
      { key: 'customer', title: 'Customer' },
      { key: 'deposit', title: 'Security Deposit' },
    ],
  },
  {
    title: 'Rental Setup',
    sections: [
      { key: 'vehicle', title: 'Vehicle Selection' },
      { key: 'details', title: 'Booking Details' },
      { key: 'tariff', title: 'Tariff' },
      { key: 'insurance', title: 'Vehicle Insurance' },
      { key: 'accessories', title: 'Accessories' },
      { key: 'drivers', title: 'Personal Accident & Additional Drivers' },
    ],
  },
  {
    title: 'Payment & Docs',
    sections: [
      { key: 'payment', title: 'Advanced Payment & Invoicing' },
      { key: 'legal', title: 'Legal Documentation & Signatures' },
    ],
  },
];

const SECTION_NUMBERS: Record<string, number> = {};
let sectionCounter = 0;
PAGES.forEach((p) =>
  p.sections.forEach((s) => {
    sectionCounter += 1;
    SECTION_NUMBERS[s.key] = sectionCounter;
  })
);

const inputCls =
  'w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none';

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
    {label} — coming in the next step
  </div>
);

const Booking: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [carId, setCarId] = useState<number | null>(null);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [depositMethodId, setDepositMethodId] = useState('');
  const [depositRef, setDepositRef] = useState('');
  const [depositReceived, setDepositReceived] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([]);
  const [currencies, setCurrencies] = useState<{ id: number; name: string }[]>([]);
  const [currencyId, setCurrencyId] = useState('');
  const [tariffSummary, setTariffSummary] = useState<TariffSummaryData | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedNumber, setSavedNumber] = useState('');
  const [error, setError] = useState('');
  const [cars, setCars] = useState<
    { id: number; car_group: string | null; daily_rate: string | null; monthly_rate: string | null }[]
  >([]);

    useEffect(() => {
    api.get('/cars').then((r) => setCars(r.data.data));
  }, []);
  useEffect(() => {
    api.get('/lookups/payment_methods').then((r) =>
      setPaymentMethods(r.data.data.filter((x: any) => x.status === 'active'))
    );
    api.get('/lookups/currencies').then((r) =>
      setCurrencies(r.data.data.filter((x: any) => x.status === 'active'))
    );
  }, []);

  const patchDraft = (p: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...p }));
  const carGroupName = cars.find((c) => c.id === carId)?.car_group ?? null;
  const selectedCar = cars.find((c) => c.id === carId) ?? null;
  const page1Done = !!customerId && !!depositMethodId && depositReceived;
  const page2Done =
  !!carId &&
  !!draft.startDate &&
  !!draft.endDate &&
  !!draft.pickupBranchId &&
  !!draft.returnBranchId &&
  !!draft.pickupAddress.trim() &&
  !!draft.dropoffAddress.trim();

  const done: Record<string, boolean> = {
    customer: !!customerId,
    deposit: !!depositMethodId && depositReceived,
    vehicle: !!carId,
    details: !!draft.startDate && !!draft.endDate,
    tariff: !!carId && !!draft.startDate && !!draft.endDate,
  };

  const canNext = pageIndex === 0 ? page1Done : pageIndex === 1 ? page2Done : false;

  const page = PAGES[pageIndex];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rental Contract</h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete each page to unlock the next — the steps above track your progress
          </p>
        </div>

        {/* Stepper — للعرض فقط */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center overflow-x-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1 shrink-0" title={s.label}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    done[s.section] ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s.n}
                </div>
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    done[s.section] ? 'text-green-700' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 min-w-6 ${
                    done[s.section] ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Page title */}
        <div className="px-1">
          <h2 className="text-lg font-bold text-gray-900">
            Page {pageIndex + 1} — {page.title}
          </h2>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {page.sections.map((sec) => (
            <div key={sec.key} id={`sec-${sec.key}`} className="scroll-mt-24">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center">
                  {SECTION_NUMBERS[sec.key]}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{sec.title}</h3>
              </div>

              {sec.key === 'customer' && (
                <CustomerPicker
                  selectedId={customerId}
                  onSelect={setCustomerId}
                  onClear={() => setCustomerId(null)}
                  onChanged={() => {}}
                />
              )}

              {sec.key === 'deposit' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount</label>
                      <div className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase">System Generated</span>
                        <span className="text-lg font-bold text-gray-900">AED 1,000</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                      <select
                        value={depositMethodId}
                        onChange={(e) => setDepositMethodId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">—</option>
                        {paymentMethods.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={currencyId}
                        onChange={(e) => setCurrencyId(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">—</option>
                        {currencies.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Ref (optional)</label>
                    <input
                      value={depositRef}
                      onChange={(e) => setDepositRef(e.target.value)}
                      placeholder="e.g. TXN-9982"
                      className={inputCls}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Payment received</p>
                      <p className="text-xs text-gray-400">Toggle to confirm the deposit was collected</p>
                    </div>
                    <button
                      onClick={() => setDepositReceived((v) => !v)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        depositReceived ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title="Toggle payment received"
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                          depositReceived ? 'left-6' : 'left-0.5'
                        }`}
                      />
                    </button>
                    {depositReceived && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium">
                        Payment Received — recorded for this booking
                      </div>
                    )}
                  </div>
                </div>
              )}

          {sec.key === 'vehicle' && <VehiclePicker selectedId={carId} onSelect={setCarId} />}
          {sec.key === 'details' && (
            <BookingDetailsForm value={draft} onChange={patchDraft} carGroupName={carGroupName} />
          )}
          {sec.key === 'tariff' && (
            <TariffSummary car={selectedCar} value={draft} onChange={patchDraft} onSummary={setTariffSummary} />
          )}
          {sec.key !== 'customer' && sec.key !== 'deposit' && sec.key !== 'vehicle' && sec.key !== 'details' && sec.key !== 'tariff' && (
            <Placeholder label={sec.title} />
          )}
            </div>
          ))}
        </div>
    {/* Confirm */}
    {pageIndex === 2 && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {savedNumber ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg font-medium flex items-center justify-between">
            <span>🎉 Contract {savedNumber} created successfully</span>
            <Link to="/rentals" className="text-sm text-green-800 underline">View Rentals</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileCheck2 className="text-blue-600" size={20} /> Confirm & Save Contract
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Total: <span className="font-bold text-gray-900">{tariffSummary ? `AED ${tariffSummary.total.toFixed(2)}` : '—'}</span>
                  {tariffSummary?.tariffName ? ` • Tariff: ${tariffSummary.tariffName}` : ''}
                </p>
              </div>
              <button
                onClick={async () => {
                  setSaving(true);
                  setError('');
                  try {
                    const t = tariffSummary;
                    const r = await api.post('/rentals', {
                      customer_id: customerId,
                      car_id: carId,
                      start_date: draft.startDate,
                      end_date: draft.endDate,
                      rental_type: draft.rentalType,
                      pickup_branch_id: draft.pickupBranchId ? Number(draft.pickupBranchId) : null,
                      return_branch_id: draft.returnBranchId ? Number(draft.returnBranchId) : null,
                      pickup_address: draft.pickupAddress,
                      dropoff_address: draft.dropoffAddress,
                      hirer_source_id: draft.hirerSourceId ? Number(draft.hirerSourceId) : null,
                      cross_border_id: draft.crossBorderId ? Number(draft.crossBorderId) : null,
                      km_policy: draft.kmPolicy,
                      allowed_km: draft.allowedKm ? Number(draft.allowedKm) : null,
                      extra_km_fee: draft.extraKmFee ? Number(draft.extraKmFee) : null,
                      security_deposit: 1000,
                      security_deposit_method_id: depositMethodId ? Number(depositMethodId) : null,
                      deposit_received: depositReceived ? 1 : 0,
                      deposit_ref: depositRef || null,
                      currency_id: currencyId ? Number(currencyId) : null,
                      daily_rate: selectedCar?.daily_rate ?? null,
                      monthly_rate: selectedCar?.monthly_rate ?? null,
                      notes: draft.notes || null,
                      tariff_name: t?.tariffName ?? null,
                      pricing_mode: t?.modeName ?? null,
                      rental_band: t?.bandName ?? null,
                      units: t?.units ?? null,
                      rack_rate: t?.rack ?? null,
                      gross_amount: t?.rent ?? null,
                      discount_amount: t?.discount ?? null,
                      unlimited_addon: t?.unlimitedAddOn ?? null,
                      border_fee: t?.borderFee ?? null,
                      vat_amount: t?.vat ?? null,
                      total_amount: t?.total ?? null,
                    });
                    setSavedNumber(r.data.data.booking_number ?? `#${r.data.data.id}`);
                  } catch (e: any) {
                    setError(e.response?.data?.message ?? 'Failed to create contract');
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={!page1Done || !page2Done || saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <FileCheck2 size={18} /> {saving ? 'Saving...' : 'Confirm & Save Contract'}
              </button>
            </div>
            {(!page1Done || !page2Done) && (
              <p className="text-xs text-amber-600">Complete Customer, Deposit, Vehicle and Booking Details to enable confirm.</p>
            )}
          </>
        )}
      </div>
    )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {pageIndex < 2 && (
            <button
              onClick={() => setPageIndex((p) => Math.min(2, p + 1))}
              disabled={!canNext}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Booking;