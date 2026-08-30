import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerPicker from '../components/booking/CustomerPicker';
import VehiclePicker from '../components/booking/VehiclePicker';
import BookingDetailsForm, { BookingDraft, emptyDraft } from '../components/booking/BookingDetailsForm';
import TariffSummary, { TariffSummaryData } from '../components/booking/TariffSummary';
import { Link } from 'react-router-dom';
import { FileCheck2 } from 'lucide-react';
import AppSelect from '../components/common/AppSelect';
import { RedwoodContextItem, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

const STEPS = [
  { n: 1, label: 'Customer Docs', key: 'customer', contentTitle: 'Customer' },
  { n: 2, label: 'Security Deposit', key: 'deposit', contentTitle: 'Security Deposit' },
  { n: 3, label: 'Vehicle', key: 'vehicle', contentTitle: 'Vehicle Selection' },
  { n: 4, label: 'Booking Info', key: 'details', contentTitle: 'Booking Details' },
  { n: 5, label: 'Tariff', key: 'tariff', contentTitle: 'Tariff' },
  { n: 6, label: 'Accessories', key: 'accessories', contentTitle: 'Accessories' },
  { n: 7, label: 'Additional Drivers', key: 'drivers', contentTitle: 'Personal Accident & Additional Drivers' },
  { n: 8, label: 'Advanced Payments', key: 'payment', contentTitle: 'Advanced Payment & Invoicing' },
  { n: 9, label: 'NOL & Contract', key: 'legal', contentTitle: 'Legal Documentation & Signatures' },
];

const inputCls = 'app-field';

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <div className="redwood-empty-state rounded-box border border-dashed border-base-300 bg-base-200/35">
    <p className="font-semibold text-base-content">{label}</p>
    <p className="text-sm text-base-content/60">This workflow is intentionally not implemented yet.</p>
  </div>
);

const Booking: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highestReachedStepIndex, setHighestReachedStepIndex] = useState(0);
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

  const activeStep = STEPS[currentStepIndex];
  const canAdvance =
    currentStepIndex === 0
      ? !!customerId
      : currentStepIndex === 1
        ? page1Done
        : currentStepIndex === 2
          ? !!carId
          : currentStepIndex === 3
            ? page2Done
            : true;

  const goToNextStep = () => {
    const nextStepIndex = Math.min(STEPS.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextStepIndex);
    setHighestReachedStepIndex((highestStep) => Math.max(highestStep, nextStepIndex));
  };

  return (
    <DashboardLayout>
      <RedwoodPage className="xl:h-[calc(100vh-8rem)] xl:overflow-hidden">
        <RedwoodPageHeader
          eyebrow="Guided transaction"
          title="Create rental contract"
          description="Complete each business step in sequence. Finished steps remain available for review."
          icon={<FileText size={21} />}
          context={
            <>
              <RedwoodContextItem label="Current step" value={`${activeStep.n} of ${STEPS.length}`} />
              <RedwoodContextItem label="Customer" value={customerId ? `#${customerId}` : 'Not selected'} />
              <RedwoodContextItem label="Vehicle" value={carId ? `#${carId}` : 'Not selected'} />
            </>
          }
          actions={<Link to="/rentals" className="btn btn-ghost">View contracts</Link>}
        />

        <div className="grid grid-cols-1 items-start gap-6 xl:min-h-0 xl:flex-1 xl:grid-cols-4 xl:items-stretch">
          <aside className="redwood-wizard-nav self-start xl:sticky xl:top-0 xl:self-stretch">
            <nav aria-label="Rental contract steps" className="p-4">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-base-content/50">Contract workflow</p>
              <ol className="booking-steps steps steps-vertical w-full">
                {STEPS.map((step, index) => {
                  const isCurrent = index === currentStepIndex;
                  const isCompleted = index < highestReachedStepIndex;

                  return (
                    <li
                      key={step.n}
                      data-content={step.n}
                      onClick={isCompleted && !isCurrent ? () => setCurrentStepIndex(index) : undefined}
                      onKeyDown={
                        isCompleted && !isCurrent
                          ? (event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setCurrentStepIndex(index);
                              }
                            }
                          : undefined
                      }
                      role={isCompleted && !isCurrent ? 'button' : undefined}
                      tabIndex={isCompleted && !isCurrent ? 0 : undefined}
                      aria-label={isCompleted && !isCurrent ? `Go to completed step ${step.n}: ${step.label}` : undefined}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={`step rounded-btn text-base-content/70 font-semibold ${
                        isCurrent ? 'step-primary' : isCompleted ? 'step-success' : ''
                      } ${
                        isCompleted && !isCurrent
                          ? 'cursor-pointer transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
                          : ''
                      }`}
                    >
                      <span>{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          <section className="redwood-wizard-panel xl:col-span-3 xl:h-full xl:min-h-0 xl:flex xl:flex-col xl:overflow-hidden">
            <div className="card-body gap-8 p-8 sm:p-10 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">

        {/* Active step */}
        <div className="border-b border-base-300 pb-6">
          <p className="redwood-kicker">Step {activeStep.n} of {STEPS.length}</p>
          <h2 className="mt-2 font-serif text-3xl font-normal text-base-content">{activeStep.contentTitle}</h2>
          <p className="mt-2 text-sm text-base-content/60">Complete the required details below to continue.</p>
        </div>

        {/* One focused panel for the active step */}
        <div>
          {activeStep.key !== 'details' && activeStep.key !== 'tariff' && activeStep.key !== 'payment' && (
            <h3 className="mb-4 text-lg font-bold text-base-content">{activeStep.contentTitle}</h3>
          )}

          {activeStep.key === 'customer' && (
                <CustomerPicker
                  selectedId={customerId}
                  onSelect={setCustomerId}
                  onClear={() => setCustomerId(null)}
                  onChanged={() => {}}
                />
              )}

          {activeStep.key === 'deposit' && (
              <div className="redwood-section space-y-5 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">Deposit Amount</label>
                      <div className="flex items-center justify-between px-4 py-2 border border-base-300 rounded-lg bg-base-200">
                        <span className="text-[10px] font-semibold text-base-content/60 uppercase">System Generated</span>
                        <span className="text-lg font-bold text-base-content">AED 1,000</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">Payment Method *</label>
                      <AppSelect
                        value={depositMethodId}
                        onChange={setDepositMethodId}
                        placeholder="—"
                        options={paymentMethods.map((method) => ({ value: method.id, label: method.name }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-base-content/80 mb-1">Currency</label>
                      <AppSelect
                        value={currencyId}
                        onChange={setCurrencyId}
                        placeholder="—"
                        options={currencies.map((currency) => ({ value: currency.id, label: currency.name }))}
                      />
                    </div>
                  </div>

                  <div className="max-w-sm">
                    <label className="block text-sm font-medium text-base-content/80 mb-1">Transaction Ref (optional)</label>
                    <input
                      value={depositRef}
                      onChange={(e) => setDepositRef(e.target.value)}
                      placeholder="e.g. TXN-9982"
                      className={inputCls}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-base-300">
                    <div>
                      <p className="text-sm font-semibold text-base-content">Payment received</p>
                      <p className="text-xs text-base-content/60">Toggle to confirm the deposit was collected</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={depositReceived}
                      onChange={(event) => setDepositReceived(event.target.checked)}
                      aria-label="Confirm payment received"
                    />
                    {depositReceived && (
                      <div className="bg-success/10 border border-success/30 text-success px-4 py-2 rounded-lg text-sm font-medium">
                        Payment Received — recorded for this booking
                      </div>
                    )}
                  </div>
                </div>
              )}

          {activeStep.key === 'vehicle' && <VehiclePicker selectedId={carId} onSelect={setCarId} />}
          {activeStep.key === 'details' && (
            <BookingDetailsForm value={draft} onChange={patchDraft} carGroupName={carGroupName} />
          )}
          {activeStep.key === 'tariff' && (
            <TariffSummary car={selectedCar} value={draft} onChange={patchDraft} onSummary={setTariffSummary} />
          )}
          {!['customer', 'deposit', 'vehicle', 'details', 'tariff', 'legal'].includes(activeStep.key) && (
            <Placeholder label={activeStep.key === 'payment' ? 'Payment details' : activeStep.contentTitle} />
          )}
        </div>
    {/* Confirm */}
    {activeStep.key === 'legal' && (
          <div className="redwood-section space-y-4 p-6">
        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
        {savedNumber ? (
          <div className="bg-success/10 border border-success/30 text-success px-5 py-4 rounded-lg font-medium flex items-center justify-between">
            <span>🎉 Contract {savedNumber} created successfully</span>
            <Link to="/rentals" className="link link-success text-sm">View Rentals</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                  <FileCheck2 className="text-primary" size={20} /> Confirm & Save Contract
                </h3>
                <p className="text-sm text-base-content/60 mt-1">
                  Total: <span className="font-bold text-base-content">{tariffSummary ? `AED ${tariffSummary.total.toFixed(2)}` : '—'}</span>
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
                className="btn btn-success px-6 py-3 font-bold disabled:opacity-50"
              >
                <FileCheck2 size={18} /> {saving ? 'Saving...' : 'Confirm & Save Contract'}
              </button>
            </div>
            {(!page1Done || !page2Done) && (
              <p className="text-xs text-warning">Complete Customer, Deposit, Vehicle and Booking Details to enable confirm.</p>
            )}
          </>
        )}
      </div>
    )}

          </div>

        {/* Persistent wizard navigation */}
        <div className="flex shrink-0 justify-between border-t border-base-300 bg-base-100/95 px-8 py-4 backdrop-blur-sm sm:px-10">
          <button
            onClick={() => setCurrentStepIndex((step) => Math.max(0, step - 1))}
            disabled={currentStepIndex === 0}
            className="btn btn-ghost gap-2 disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {currentStepIndex < STEPS.length - 1 && (
            <button
              onClick={goToNextStep}
              disabled={!canAdvance}
              className="btn btn-primary gap-2 disabled:opacity-50"
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
          </section>
        </div>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default Booking;
