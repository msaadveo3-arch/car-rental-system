import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, UserPlus, Pencil } from 'lucide-react';
import api from '../../services/api';
import CustomerForm, { Customer } from '../customers/CustomerForm';
import AppSelect, { type AppSelectOption } from '../common/AppSelect';
import { RedwoodSection } from '../common/RedwoodPage';

const initials = (name: string) =>
  name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const Field: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-base-content/60">{label}</p>
    <p className="text-sm font-semibold text-base-content">{value || '—'}</p>
  </div>
);

interface Props {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClear: () => void;
  onChanged: () => void;
}

type CustomerOption = AppSelectOption & {
  searchText: string;
  customer: Customer;
};

const CustomerPicker: React.FC<Props> = ({ selectedId, onSelect, onClear, onChanged }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [formMode, setFormMode] = useState<'new' | 'edit' | null>(null);

  useEffect(() => {
    setCollapsed(false);
  }, [selectedId]);

  useEffect(() => {
    api.get('/customers').then((r) => setCustomers(r.data.data));
  }, []);

  const customerOptions = useMemo<CustomerOption[]>(
    () =>
      customers.map((customer) => ({
        value: String(customer.id),
        label: customer.name,
        searchText: [customer.name, customer.phone, customer.email, customer.national_id, customer.license_number]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
        customer,
      })),
    [customers]
  );

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const handleSaved = (c: Customer) => {
    setCustomers((prev) =>
      prev.some((p) => p.id === c.id) ? prev.map((p) => (p.id === c.id ? c : p)) : [c, ...prev]
    );
    onChanged();
    onSelect(c.id);
    setFormMode(null);
  };

  return (
    <div className="space-y-4">
      <RedwoodSection
        title="Find customer"
        description="Search existing records or create a customer without leaving the contract flow."
        actions={
          <button
            type="button"
            onClick={() => setFormMode((v) => (v === 'new' ? null : 'new'))}
            className="btn btn-primary btn-sm app-btn-sm gap-2 whitespace-nowrap"
          >
            <UserPlus size={17} aria-hidden /> New customer
          </button>
        }
      >
        <div className="min-w-0 flex-1">
          <AppSelect<CustomerOption>
            size="sm"
            inputId="customer-picker"
            value={selectedId}
            options={customerOptions}
            isClearable
            isSearchable
            placeholder="Search by name, phone, ID, or license..."
            noOptionsMessage={() => 'No matching customers'}
            filterOption={(option, input) => option.data.searchText.includes(input.trim().toLowerCase())}
            onChange={(value) => {
              if (value) onSelect(Number(value));
              else onClear();
            }}
            formatOptionLabel={(option, { context }) => (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {initials(option.customer.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-base-content">{option.customer.name}</p>
                  {context === 'menu' && (
                    <p className="truncate text-sm text-base-content/60">
                      {option.customer.phone}{option.customer.national_id ? ` • Emirates ID: ${option.customer.national_id}` : ''}
                    </p>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </RedwoodSection>

      {formMode === 'new' && (
        <CustomerForm size="sm" onSaved={handleSaved} onCancel={() => setFormMode(null)} />
      )}

      {formMode === 'edit' && selected && (
        <CustomerForm size="sm" initial={selected} onSaved={handleSaved} onCancel={() => setFormMode(null)} />
      )}

      {selected && (
        <RedwoodSection title="Selected customer" description="Review credentials before continuing with this contract.">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center shrink-0">
              {initials(selected.name)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-base-content">Personal Information</h3>
                <button
                  onClick={() => setCollapsed((v) => !v)}
                  title={collapsed ? 'Expand' : 'Collapse'}
                className="btn btn-ghost btn-square btn-sm app-btn-sm text-base-content/60"
                >
                  {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>

              {collapsed ? (
                <p className="text-sm text-base-content/60">
                  {selected.phone}
                  {selected.national_id ? ` • Emirates ID: ${selected.national_id}` : ''}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                    <Field label="Full Name" value={selected.name} />
                    <Field label="Phone" value={selected.phone} />
                    <Field label="Email" value={selected.email} />
                    <Field label="Nationality" value={selected.nationality} />
                    <Field label="Gender" value={selected.gender} />
                    <Field label="Birth Date" value={selected.birth_date} />
                    <Field label="Job" value={selected.job} />
                    <Field label="ID Number" value={selected.national_id} />
                    <Field label="ID Expiry" value={selected.id_expiry_date} />
                    <Field label="License Type" value={selected.license_type} />
                    <Field label="License Number" value={selected.license_number} />
                    <Field label="License Expiry" value={selected.license_expiry_date} />
                    <div className="col-span-2 md:col-span-3">
                      <Field label="Address" value={selected.address} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-base-300">
                    <p className="text-xs text-base-content/60">
                      Customer since{' '}
                      {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : '—'}
                    </p>
                    <button
                      onClick={() => setFormMode('edit')}
              className="btn btn-ghost btn-sm app-btn-sm gap-1 text-primary"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </RedwoodSection>
      )}
    </div>
  );
};

export default CustomerPicker;
