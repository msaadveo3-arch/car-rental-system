import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, RefreshCw, Plus, Trash2, Pencil } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { RedwoodCollectionToolbar, RedwoodEmptyState, RedwoodPage, RedwoodPageHeader, RedwoodSection } from '../components/common/RedwoodPage';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  license_number: string | null;
  national_id: string | null;
  address: string | null;
  created_at: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.data);
    } catch {
      setError('Failed to load customers. Make sure Apache & MySQL are running.');
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`سيتم إخفاء العميل "${name}" من القائمة (حذف آمن). متابعة؟`)) {
      return;
    }
    try {
      await api.delete(`/customers/${id}`);
      loadCustomers();
    } catch {
      alert('Failed to delete customer. Try again.');
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);
    const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.license_number ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <RedwoodPage>
        <RedwoodPageHeader
          eyebrow="Customer management"
          title="Customers"
          description="Find customer records, review rental credentials, and maintain contact details."
          icon={<Users size={21} />}
          actions={
          <Link
            to="/customers/add"
            className="btn btn-primary gap-2 whitespace-nowrap"
          >
            <Plus size={18} aria-hidden /> Add customer
          </Link>
          }
        />

        <RedwoodSection
          title="Customer directory"
          description="All active customer profiles available to rental operations."
          contentMode="flush"
        >
          <RedwoodCollectionToolbar
            search={{ value: search, onChange: setSearch, placeholder: 'Search name, phone, email, or license' }}
            summary={`${filteredCustomers.length} of ${customers.length} customers`}
            actions={
              <button onClick={loadCustomers} className="btn btn-ghost btn-sm gap-2">
                <RefreshCw size={16} aria-hidden /> Refresh
              </button>
            }
          />
        {loading ? (
          <div className="redwood-empty-state"><span className="loading loading-spinner loading-md" /><span>Loading customers…</span></div>
        ) : error ? (
          <div role="alert" className="alert alert-error m-5 w-auto"><span>{error}</span></div>
        ) : filteredCustomers.length === 0 ? (
          <RedwoodEmptyState
            icon={<Users size={22} />}
            title={search ? 'No customers match your search' : 'No customers yet'}
            description={search ? 'Try a different name, phone, email, or license number.' : 'Add the first customer to begin creating rental contracts.'}
            action={!search ? <Link to="/customers/add" className="btn btn-primary btn-sm">Add customer</Link> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>License</th><th>Address</th><th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300">
                {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-base-200/60">
                  <td className="px-6 py-4 text-base-content/60 text-sm">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-base-content">{c.name}</td>
                  <td className="px-6 py-4 text-base-content/80">{c.phone}</td>
                  <td className="px-6 py-4 text-base-content/80">{c.email ?? '—'}</td>
                  <td className="px-6 py-4 text-base-content/80">{c.license_number ?? '—'}</td>
                  <td className="px-6 py-4 text-base-content/80">{c.address ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/customers/edit/${c.id}`}
                        title="Edit"
                        aria-label={`Edit ${c.name}`}
                        className="btn btn-ghost btn-square btn-sm text-primary"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete"
                        aria-label={`Delete ${c.name}`}
                        className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        </RedwoodSection>
      </RedwoodPage>
    </DashboardLayout>
  );
};

export default Customers;
