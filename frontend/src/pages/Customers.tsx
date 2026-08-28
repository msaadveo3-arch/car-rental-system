import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, RefreshCw, Plus, Search, Trash2, Pencil } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

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
    <div className="app-page">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Users className="text-primary" size={24} /> Customers
          </h1>
          <p className="text-base-content/60 text-sm mt-1">Manage your rental customers</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="input input-bordered h-10 min-h-10 w-full bg-base-100 pl-9 pr-3 text-sm focus:outline-primary"
            />
          </div>
          <div className="flex items-center gap-3">
          <Link
            to="/customers/add"
            className="btn btn-primary h-10 min-h-10 whitespace-nowrap"
          >
            <Plus size={18} /> Add New Customer
          </Link>
          <button
            onClick={loadCustomers}
            className="btn btn-outline h-10 min-h-10 whitespace-nowrap"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          </div>
        </div>
      </div>

      <div className="card card-border bg-base-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-base-content/60">Loading customers...</div>
        ) : error ? (
          <div className="p-12 text-center text-error">{error}</div>
        ) : (
          <table className="app-table">
            <thead className="bg-base-200 border-b border-base-300">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">License</th>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-base-content/60 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
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
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete"
                        className="p-2 text-error hover:bg-error/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Customers;
