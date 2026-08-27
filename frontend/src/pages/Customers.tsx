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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-blue-600" size={24} /> Customers
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your rental customers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, license..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-72 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/customers/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={18} /> Add New Customer
          </Link>
          <button
            onClick={loadCustomers}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading customers...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">License</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60">
                  <td className="px-6 py-4 text-gray-400 text-sm">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{c.email ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{c.license_number ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{c.address ?? '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/customers/edit/${c.id}`}
                        title="Edit"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
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